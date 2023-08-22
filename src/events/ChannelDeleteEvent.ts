// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
import { DMChannel, GuildChannel } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { GuildConfig } from '../typeorm/entities/GuildConfig';
import { getRepository } from 'typeorm';
import { LogConfig } from '../typeorm/entities/LogConfig';

export default class ChannelDeleteEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository=getRepository(GuildConfig),
    private readonly guildLogConfigRepository=getRepository(LogConfig)
  ) {
    super('channelDelete');
  }
  
  async run(client: DiscordClient, channel: DMChannel | GuildChannel) {
    const gasit= client.configs.find(element=> element.WelcomeChannelID==channel.id)
    const WelcomeChannelID=""
    if(gasit) {
      const newEntry:GuildConfig=await this.guildConfigRepository.save({
        ...gasit,
        WelcomeChannelID,
      })
      client.configs.set(gasit.GuildID,newEntry)
      //console.log('am ajuns aici')
    }
    else console.log('nothing here')

    const gasitLog= client.logconfigs.find(element=> element.LogChannel==channel.id)
    const LogChannel=""
    if(gasitLog) {
      const newEntryLog:LogConfig=await this.guildLogConfigRepository.save({
        ...gasitLog,
        LogChannel,
      })
      client.logconfigs.set(gasitLog.GuildID,newEntryLog)
      //console.log('am ajuns aici')
    }
    else console.log('nothing here')
  }
}
// socket.on('guildWelcomeChannelUpdate',(config:GuildConfig)=>{
//   client.configs.set(config.GuildID,config)
// })