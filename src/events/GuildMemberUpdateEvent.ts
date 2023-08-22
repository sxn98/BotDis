// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';

export default class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(client: DiscordClient, oldMember: GuildMember, newMember: GuildMember) {
    
    if(oldMember.nickname===newMember.nickname) return;

    const config = client.logconfigs.get(oldMember.guild?.id!);
    const channel=oldMember.guild?.channels.cache.get(config?.LogChannel!) as TextChannel

    if(!channel){
      return
    }else{
      const embed=new EmbedBuilder()
      .setTitle(`Nickname Changed`) // in cazul in care nu are nickname sau isi schimba nickname-ul in cel default, vom specifica pentru a nu printa "null"
      .setDescription(`User <@${oldMember.id}> nickname got changed from ${oldMember.nickname ? oldMember.nickname:oldMember.displayName} to ${newMember.nickname ? newMember.nickname:newMember.displayName}`) 

      channel.send({
        embeds:[embed],

      })
    }
  }
}