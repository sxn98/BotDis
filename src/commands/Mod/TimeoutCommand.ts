import { Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TimeoutCommand extends BaseCommand {
  constructor() {
    super('Timeout', 'Mod', ['timeout']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if(!message.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)){
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to moderate someone`)
      message.delete()
      return 
    } 

    const reason = args.slice(2).join(" ")
    const mentionedUser= message.mentions.users.first()
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    const isMember=message.guild?.members.cache.find(member=> member.id === targetID)

    
    if(!isMember){
      message.author.send(`User was not found, try to tag the user (ex: <@${message.author.id}>)`)
      return
    }

    if(message.author.id === targetID){ // verifica sa nu iti dai singur timeout
      message.author.send("Why do you want to timeout yourself?")
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

    if(!reason){
      message.author.send("Specify a reason for the timeout")
      return
    }
    
    if(Number.parseFloat(args[1])<1 || Number.parseFloat(args[1])>120 || Number.isNaN(Number.parseFloat(args[1]))){
      message.author.send("Specify a duration between 1 and 120 minutes")
      return
    }

    try {

      await mentionedUser?.send(`You have been timeouted from the server "${message.guild?.name}" by "${message.author.username}". The reason is: ${reason}. Duration: ${args[1]} minutes`)
      await message.guild?.members.cache.get(mentionedUser?.id!)?.timeout(+args[1]*60000,reason)

    } catch (error) {
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work`)
    }
  }
}