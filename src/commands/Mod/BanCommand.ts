import { Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';


export default class BanCommand extends BaseCommand {
  constructor() {
    super('Ban', 'Mod', ['ban']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if(!message.member?.permissions.has(PermissionsBitField.Flags.BanMembers)){
      message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to ban someone`)
      message.delete()
      return 
    } 

    const reason = args.slice(2).join(" ")
    const mentionedUser= message.mentions.users.first()
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    const isMember=message.guild?.members.cache.find(member=> member.id === targetID)

    if(!reason){
      message.author.send("Specificati un motiv pentru ban")
      return
    }
    
    if(Number.parseFloat(args[1])<0 || Number.parseFloat(args[1])>7 || Number.isNaN(Number.parseFloat(args[1]))){
      message.author.send("Specificati mesajele user-ului tinta din ultimele cate zile doriti sa fie sterse, exprimat in zile, intre 0-7")
      return
    }

    if(!isMember){
      message.channel.send("User was not found")
     .then(msg=>{
       setTimeout(()=> msg.delete(), 3000)
     });
     return
    }

    if(message.author.id === targetID){ // verifica sa nu iti dai singur ban
      message.author.send("Why do you want to ban yourself?")
      return
    } 

    const isBannable=message.guild?.members.cache.get(mentionedUser?.id!)?.bannable

    if(isBannable){ // verifica daca botul in momentul comenzii poate da ban persoanei fara nici o problema
      try {

        await mentionedUser?.send(`You have been banned from the server "${message.guild?.name}" by "${message.author.username}". The reason is: ${reason}. The ban is permanent, your messages from the last: ${args[1]} days have been deleted from the server`)
        await message.guild?.members.cache.get(mentionedUser?.id!)?.ban({
          deleteMessageDays: +args[1], // cu + putem transforma din string in number
          reason:reason,
         
        })

      } catch (error) {
        message.author.send(`Your command "${message.content}" in server "${message.guild?.name}" did not work`)
      }
    }else{
      message.author.send('The person could not be banned by the bot, check if it has the necessary permissions or check the role hierarchy')
      return;
    }
    // message.channel.send("kicked user "+kickedUser+" | user "+user+" | reason "+reason)
    // .then(msg=>{
    //   setTimeout(()=> msg.delete(), 2000)
    // });

    
  }
}