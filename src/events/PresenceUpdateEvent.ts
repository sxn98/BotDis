// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-presenceUpdate
import { Presence, Role } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { Repository, getRepository } from 'typeorm';
import { AutoRoleConfig } from '../typeorm/entities/AutoRoleConfig';

export default class PresenceUpdateEvent extends BaseEvent {
  constructor(private readonly autoroleConfigRepository=getRepository(AutoRoleConfig)) {
    super('presenceUpdate');
  }
  
  async run(client: DiscordClient, oldPresence: Presence | null | undefined, newPresence: Presence) {

    const oldActivities = oldPresence?.activities.toString();
    const newActivities = newPresence.activities.toString();

    if (JSON.stringify(oldPresence) == undefined) {
      return
    };
    if (oldPresence == undefined) {
      return
    };
    if (oldPresence == null && newPresence == null) {
      return
    }
    if (oldPresence == undefined && newPresence == undefined) {
      return
    }
    if (oldPresence?.activities == undefined && newPresence.activities == undefined) {
      return
    }

    const gameId = await registeredGame(this.autoroleConfigRepository,newActivities,newPresence.guild?.id);
    //console.log('id-ul jocului gasit in bd este'+gameId)
    if(gameId==null) return

    if(newActivities!="" && gameId && newPresence?.member?.roles.cache.find(role=>role.id==gameId)===undefined){
      console.log('\n########################################################################################################################\n');
      console.log('Activitate veche: ' + oldActivities + '\nActivitate noua: ' + newActivities + '\nUser: ' + newPresence?.member?.displayName); // Daca se da rol, se va specifica in "Activitatea noua" care este acela
      console.log('Se da rol la baiatu');
      newPresence?.member?.roles.add(gameId).catch(e => { console.error(e); });

    }else return;
  }
}

async function registeredGame(autoroleRep: Repository<AutoRoleConfig>, game: string,presenceGuildID: string | undefined) {
  game.toString();
  const gasit=await autoroleRep.findOneBy({
    GuildID:presenceGuildID,
    ActivityName:game,
  });
  // console.log(gasit)
  // console.log(gasit?.ActivityName.toString().toLowerCase(),game.toString().toLowerCase())

  try {
    if ((game != null && game != undefined) && gasit?.ActivityName.toString().toLowerCase() === game.toString().toLowerCase()) {		
      return gasit.RoleID;
  }
  } catch (error) {
    console.log(error)
  }
  
  return false;
}