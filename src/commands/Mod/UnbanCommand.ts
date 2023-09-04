import { EmbedBuilder, Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class UnbanCommand extends BaseCommand {
  constructor() {
    super('Unban', 'Mod', ['unban','UNBAN','UnBan']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const embed=new EmbedBuilder()
    .setTitle('Kick command')
    
    if(!message.member?.permissions.has(PermissionsBitField.Flags.BanMembers)){
      embed.addFields({name:"Error",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to ban someone`})
      message.author.send({embeds:[embed]})
      message.delete()
      return 
    } 

    const reason = args.slice(1).join(" ")
    const mentionedUser= args[0]
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    if(message.author.id === targetID){ // verifica sa nu iti dai singur remove timeout
      embed.addFields({name:"Error",value:"Why would you remove the ban put on you?"})
      message.author.send({embeds:[embed]})
      return
    } 

    const bannedMember=await (await message.guild?.bans.fetch()!).has(targetID)

    if(!bannedMember){
      embed.addFields({name:"Error",value:`The user is not banned or the id provided is invalid, try to provide a valid ID (ex: your user id is ${message.author.id}. It can be found by right clicking a user and click on "Copy User ID"`})
      message.author.send({embeds:[embed]})
      return
    }

    if(!reason){
      embed.addFields({name:"Error",value:"Specify a reason for the Unban"})
      message.author.send({embeds:[embed]})
      return
    }

    try {

      embed.addFields({name:"Unbanned",value:`Your ban from the server "${message.guild?.name}" was removed earlier by "${message.author.username}". The reason is: ${reason}.`})
      await message.guild?.members.unban(mentionedUser,reason)
      await client.users.cache.get(mentionedUser)?.send({embeds:[embed]})
     
    } catch (error) {
      embed.addFields({name:"Error",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work`})
      message.author.send({embeds:[embed]})
    }
  }
}