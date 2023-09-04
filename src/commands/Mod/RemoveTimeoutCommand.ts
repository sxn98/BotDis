import { EmbedBuilder, Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class RemoveTimeoutCommand extends BaseCommand {
  constructor() {
    super('RemoveTimeout', 'Mod', ['removetimeout','removeTimeout','Removetimeout']);
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

    const reason = args.slice(1).join(" ")
    const mentionedUser= message.mentions.users.first()
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    const isMember=message.guild?.members.cache.find(member=> member.id === targetID)


    
    if(!isMember){
      embed.addFields({name:"Error",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to moderate someone`})
      message.author.send({embeds:[embed]})
      message.author.send(`User was not found, try to tag the user (ex: <@${message.author.id}>)`)
      return
    }

    if(message.author.id === targetID){ // verifica sa nu iti dai singur remove timeout
      embed.addFields({name:"Error",value:"Why would you remove the timeout put on you?"})
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

    if(!isMember.communicationDisabledUntil){
      embed.addFields({name:"Error",value:'The user is not under the effect of a timeout!'})
      message.author.send({embeds:[embed]})
      return
    }

    if(!reason){
      embed.addFields({name:"Error",value:"Specify a reason for the removal of the timeout"})
      message.author.send({embeds:[embed]})
      return
    }

    try {

      embed.addFields({name:"Removed Timeout",value:`Your timeout from the server "${message.guild?.name}" was removed earlier by "${message.author.username}". The reason is: ${reason}.`})
      await mentionedUser?.send({embeds:[embed]})
      await message.guild?.members.cache.get(mentionedUser?.id!)?.timeout(null)

    } catch (error) {
      embed.addFields({name:"Error",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work`})
      message.author.send({embeds:[embed]})
    }
  }
}