// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
import { AuditLogEvent, EmbedBuilder, TextChannel, VoiceState } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { getRepository } from 'typeorm';
import { LogConfig } from '../typeorm/entities/LogConfig';

export default class VoiceStateUpdateEventMove extends BaseEvent {
  constructor(
    private readonly guildLogRepository=getRepository(LogConfig)
  ) {
    super('voiceStateUpdate');
  }
  
  async run(client: DiscordClient, oldState: VoiceState, newState: VoiceState) {
    const isEnabled =await this.guildLogRepository.findOneBy({GuildID:oldState.guild.id})
    const config = client.logconfigs.get(oldState.guild?.id!);
    const channel=oldState.guild?.channels.cache.get(config?.LogChannel!) as TextChannel
    
     if(isEnabled?.UserForcefullyMoved == false || !channel){
       return
     }
    const wasInVoice=!!oldState.channel
    const isInVoice=!!newState.channel // punem doua semne de exclamare pentru a le transforma in true sau false in cazul in care exista sau nu date in aceste variabile

    if (wasInVoice && isInVoice){

      const auditLogs= await oldState.guild?.fetchAuditLogs({limit:1})
      const firstentry=auditLogs?.entries.first()!; // preluam din log ultima data cand cineva si-a luat kick din voice chat, scrisul in log are prioritate dupa captarea acestui eveniment de catre bot
      const member= oldState.guild.members.cache.get(firstentry.executor?.id!)

      if(firstentry.action==26 && (firstentry.extra as any).count < 2){
        const embed=new EmbedBuilder()
        .setTitle(`User Forcefully Moved`)
        .setDescription(`User <@${oldState.member?.id}> was moved from <#${oldState.channel.id}> in <#${newState.channel.id}> most likely by <@${member?.id}>`)

        channel.send({
          embeds:[embed],

        })
      }
    }
    
  }
}