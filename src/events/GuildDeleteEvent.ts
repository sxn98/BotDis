// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
import { Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { getRepository } from 'typeorm';
import { GuildConfig } from '../typeorm/entities/GuildConfig';
import { LogConfig } from '../typeorm/entities/LogConfig';
import { AutoRoleConfig } from '../typeorm/entities/AutoRoleConfig';

export default class GuildDeleteEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository=getRepository(GuildConfig),
    private readonly guildLogRepository=getRepository(LogConfig),
    private readonly guildAutoRoleRepository=getRepository(AutoRoleConfig)
  ) {
    super('guildDelete');
  }
  
  async run(client: DiscordClient, guild: Guild) {
    
    const config=await this.guildConfigRepository.findOneBy({
      GuildID:guild.id,
  });
    const logConfig=await this.guildLogRepository.findOneBy({
      GuildID:guild.id
  })
  const autoroleconfig=await this.guildAutoRoleRepository.findBy({
    GuildID:guild.id
  })
    // const autoroleConfig=await this.guildAutoRoleRepository.findOneBy({
    //   GuildID:guild.id
    // })
    if(config){
      
      //console.log('(CONFIG) am fost dat afara din '+guild.name)
      client.configs.delete(guild.id)
      this.guildConfigRepository.delete({GuildID:guild.id})
      //console.log(client.configs)
    } 
    if(logConfig){
      
      //console.log('(LOG) am fost dat afara din '+guild.name)
      client.logconfigs.delete(guild.id)
      this.guildLogRepository.delete({GuildID:guild.id})
      //console.log(client.logconfigs)
    }

    if(autoroleconfig){
      //console.log('(AUTOROLE) am fost dat afara din '+guild.name)
      autoroleconfig.forEach(element=> client.roleconfigs.delete(element.ID.toString()))
      this.guildAutoRoleRepository.delete({GuildID:guild.id})
      //console.log(client.roleconfigs)
    }
  }
}