import { EmbedBuilder, Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TimeoutCommand extends BaseCommand {
  constructor() {
    super('Timeout', 'Mod', ['timeout']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const embed=new EmbedBuilder()
    .setTitle('Timeout command')
    
    if(!message.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)){
      embed.addFields({name:"Error",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to moderate someone`})
      message.author.send({embeds:[embed]})
      message.delete()
      return 
    } 

    const reason = args.slice(2).join(" ")
    const mentionedUser= message.mentions.users.first()
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    const isMember=message.guild?.members.cache.find(member=> member.id === targetID)
 
    if(!isMember){
      embed.addFields({name:"Error",value:`User was not found, try to tag the user (ex: <@${message.author.id}>)`})
      message.author.send({embeds:[embed]})
      return
    }

    if(message.author.id === targetID){ // verifica sa nu iti dai singur timeout
      embed.addFields({name:"Error",value:"Why do you want to timeout yourself?"})
      message.author.send({embeds:[embed]})
      return
    } 

    if(!isMember?.manageable || !isMember.moderatable){
      embed.addFields({name:"Error",value:'The target user is not moderatable by the bot'})
      message.author.send({embeds:[embed]})
      return
    }

    if(message.member.roles.highest.position < isMember.roles.highest.position){
      embed.addFields({name:"Error",value:'Selected user to timeout has a higher role position than you'})
      message.author.send({embeds:[embed]})
      return
    }

    if(!reason){
      embed.addFields({name:"Error",value:"Specify a reason for the timeout"})
      message.author.send({embeds:[embed]})
      return
    }
    
    if(Number.parseFloat(args[1])<1 || Number.parseFloat(args[1])>120 || Number.isNaN(Number.parseFloat(args[1]))){
      embed.addFields({name:"Error",value:"Specify a duration between 1 and 120 minutes"})
      message.author.send({embeds:[embed]})
      return
    }

    try {

      embed.addFields({name:"Timeout",value:`You have been timeouted from the server "${message.guild?.name}" by "${message.author.username}". The reason is: ${reason}. Duration: ${args[1]} minutes`})
      await mentionedUser?.send({embeds:[embed]})
      await message.guild?.members.cache.get(mentionedUser?.id!)?.timeout(+args[1]*60000,reason)

    } catch (error) {
      embed.addFields({name:"Timeout",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work`})
      message.author.send({embeds:[embed]})
    }
  }
}