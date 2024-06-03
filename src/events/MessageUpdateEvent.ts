// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
import { AuditLogEvent, EmbedBuilder, Message, TextChannel } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { getRepository } from 'typeorm';
import { LogConfig } from '../typeorm/entities/LogConfig';

export default class MessageUodateEvent extends BaseEvent {
  constructor(
    private readonly guildLogRepository=getRepository(LogConfig)
  ) {
    super('messageUpdate');
  }
  
  async run(client: DiscordClient, oldMessage: Message, newMessage: Message) {
    const isEnabled =await this.guildLogRepository.findOneBy({GuildID:oldMessage.guild?.id})
    const config = client.logconfigs.get(oldMessage.guild?.id!);
    const channel=oldMessage.guild?.channels.cache.get(config?.LogChannel!) as TextChannel

    if(isEnabled?.MsgEditedContent == false || !channel || oldMessage.author.bot ){
      return
    }else{
      const embed=new EmbedBuilder()
      .setTitle(`Edited Message`)
      .setDescription(`Message send by <@${oldMessage.author.id}> written in channel <#${oldMessage.channelId}> was edited at <t:${Math.floor(newMessage.createdAt.getTime()/1000)}>`) // transformam date-ul in format unix pentru a fi creat intr-un timestamp vizibil pentru oricare zona geografica
      .addFields(
        {name:'Original Message:',value:`${oldMessage.content ? oldMessage.content: "**The message had no written content**"}`},
        {name:'Edited message:',value:`${newMessage.content ? newMessage.content: "**The edited message has no written content**"}`}
      )

      channel.send({
        embeds:[embed],

      })
    }
  }
}