import { Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class UnbanCommand extends BaseCommand {
  constructor() {
    super('Unban', 'Mod', ['unban','UNBAN','UnBan']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if(!message.member?.permissions.has(PermissionsBitField.Flags.BanMembers)){
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to ban someone`)
      message.delete()
      return 
    } 

    const reason = args.slice(1).join(" ")
    const mentionedUser= args[0]
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    if(message.author.id === targetID){ // verifica sa nu iti dai singur remove timeout
      message.author.send("Why would you remove the ban put on you?")
      return
    } 

    const bannedMember=await (await message.guild?.bans.fetch()!).has(targetID)

    if(!bannedMember){
      message.author.send('The user is not banned')
      return
    }

    try {

      await message.guild?.members.unban(mentionedUser,reason)
      await client.users.cache.get(mentionedUser)?.send(`Your ban from the server "${message.guild?.name}" was removed earlier by "${message.author.username}". The reason is: ${reason}.`)
     
    } catch (error) {
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work`)
    }
  }
}