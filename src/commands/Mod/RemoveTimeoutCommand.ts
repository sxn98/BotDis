import { Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class RemoveTimeoutCommand extends BaseCommand {
  constructor() {
    super('RemoveTimeout', 'Mod', ['removetimeout','removeTimeout','Removetimeout']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if(!message.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)){
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to moderate someone`)
      message.delete()
      return 
    } 

    const reason = args.slice(1).join(" ")
    const mentionedUser= message.mentions.users.first()
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    const isMember=message.guild?.members.cache.find(member=> member.id === targetID)

    
    if(!isMember){
      message.author.send(`User was not found, try to tag the user (ex: <@${message.author.id}>)`)
      return
    }

    if(message.author.id === targetID){ // verifica sa nu iti dai singur remove timeout
      message.author.send("Why would you remove the timeout put on you?")
      return
    } 

    if(!isMember?.manageable || !isMember.moderatable){
      message.author.send('The target user is not moderatable by the bot')
      return
    }

    if(message.member.roles.highest.position < isMember.roles.highest.position){
      message.author.send('Selected user to timeout has a higher role position than you')
      return
    }

    if(!isMember.communicationDisabledUntil){
      message.author.send('The user is not under the effect of a timeout!')
      return
    }

    try {

      await mentionedUser?.send(`Your timeout from the server "${message.guild?.name}" was removed earlier by "${message.author.username}". The reason is: ${reason}.`)
      await message.guild?.members.cache.get(mentionedUser?.id!)?.timeout(null)

    } catch (error) {
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work`)
    }
  }
}