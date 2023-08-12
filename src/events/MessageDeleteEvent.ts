// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
import { AuditLogEvent, Embed, EmbedBuilder, Message, TextChannel } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { LogConfig } from '../typeorm/entities/LogConfig';
import { getRepository } from 'typeorm';

export default class MessageDeleteEvent extends BaseEvent {
  constructor(
    private readonly guildLogRepository=getRepository(LogConfig)
  ) {
    super('messageDelete');
  }
  
  async run(client: DiscordClient, message: Message) {
    const isEnabled =await this.guildLogRepository.findOneBy({GuildID:message.guild?.id})
    const config = client.logconfigs.get(message.guild?.id!);
    const channel=message.guild?.channels.cache.get(config?.LogChannel!) as TextChannel

    if(isEnabled?.MsgDeletedContent == false || !channel){
      return
    }else{

      // const auditLogs= await message.guild?.fetchAuditLogs({type: AuditLogEvent.MessageDelete,limit:1}) // preia ultimul log, acela fiind chiar cel de delete pentru a afla persoana care sterge mesajul
      // const firstentry=auditLogs?.entries.first()!;
      // const user=await client.users.fetch(firstentry.executorId!)

      const embed=new EmbedBuilder()
      .setTitle(`Deleted Message`)
      .setDescription(`Message send by <@${message.author.id}> was deleted from <#${message.channelId}> at <t:${Math.floor(message.createdAt.getTime()/1000)}>`)
      .addFields(
        {name:'Deleted message:',value:`${message.content ? message.content: "**The message had no written content**"}`},
      )

      channel.send({
        embeds:[embed],

      })
    }
  }
}