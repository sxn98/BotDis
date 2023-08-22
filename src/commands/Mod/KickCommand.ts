import { Client, Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { error } from 'console';

export default class KickCommand extends BaseCommand {
  constructor() {
    super('kick', 'Mod', ['Kick']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if(!message.member?.permissions.has(PermissionsBitField.Flags.KickMembers)){
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to kick someone`)
      message.delete()
      return 
    } 

    const reason = args.slice(1).join(" ") // extrage al doilea cuvant din comanda, adica motivul
    const mentionedUser= message.mentions.users.first() // colecteaza primul user mentionat, adica primul cu @ in fata
    const targetID=args[0].replace("<","").replace("@","").replace(">","") // transforma primul cuvant, adica userul tinta dintr-un tip de date mention (<@1234>), intr-un id

    const isMember=message.guild?.members.cache.find(member=> member.id === targetID)


    if(!reason){
      message.author.send("Specificati un motiv pentru kick")
      return
    }

    if(!isMember){ // verifica daca exista pe sv
      message.author.send(`User was not found, try to tag the user (ex: <@${message.author.id}>)`)
      return
    } 

    if(message.author.id === targetID){ // verifica sa nu iti dai singur kick
      message.author.send("Why would you want to kick yourself?")
      return
    }

    const isKickable=message.guild?.members.cache.get(mentionedUser?.id!)?.kickable

    if(isKickable){ // verifica daca botul in momentul comenzii poate da kick persoanei fara nici o problema
      try {

        await mentionedUser?.send(`You have been kicked from the server "${message.guild?.name}" by "${message.author.username}". The reason is: ${reason}.`)
        await message.guild?.members.cache.get(mentionedUser?.id!)?.kick(reason)

      } catch (error) {
        message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work`)
      }
    }else{
      message.author.send('The person could not be kicked by the bot, check if it has the necessary permissions or check the role hierarchy')
      return;
    }
      
    // message.channel.send("kicked user "+kickedUser+" | user "+user+" | reason "+reason)
    // .then(msg=>{
    //   setTimeout(()=> msg.delete(), 2000)
    // });

    
  }
}