// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleDelete
import { Role } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { AutoRoleConfig } from '../typeorm/entities/AutoRoleConfig';
import { getRepository } from 'typeorm';

export default class RoleDeleteEvent extends BaseEvent {
  constructor(
    private readonly guildAutoRoleRepository=getRepository(AutoRoleConfig)
  ) {
    super('roleDelete');
  }
  
  async run(client: DiscordClient, role: Role) {
    const gasit= client.roleconfigs.find(element=> element.RoleID==role.id)

    if(gasit) {
      client.roleconfigs.delete(gasit.ID.toString())
      this.guildAutoRoleRepository.delete({ID:gasit.ID})
      console.log(client.roleconfigs)
    }
    else console.log('nothing here')

    
  }
}

