import { EmbedBuilder, Message, PermissionsBitField } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';


export default class BanCommand extends BaseCommand {
  constructor() {
    super('Ban', 'Mod', ['ban']);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const embed=new EmbedBuilder()
    .setTitle('Timeout command')
    
    if(!message.member?.permissions.has(PermissionsBitField.Flags.BanMembers)){
      embed.addFields({name:"Error",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work because you do not have permission to ban someone`})
      message.author.send({embeds:[embed]})
      message.delete()
      return 
    } 

    const reason = args.slice(2).join(" ")
    const mentionedUser= message.mentions.users.first()
    const targetID=args[0].replace("<","").replace("@","").replace(">","")

    const isMember=message.guild?.members.cache.find(member=> member.id === targetID)

    if(!reason){
      embed.addFields({name:"Error",value:"Specificati un motiv pentru ban"})
      message.author.send({embeds:[embed]})
      return
    }

    if(Number.parseFloat(args[1])<0 || Number.parseFloat(args[1])>7 || Number.isNaN(Number.parseFloat(args[1]))){
      embed.addFields({name:"Error",value:"Specificati mesajele user-ului tinta din ultimele cate zile doriti sa fie sterse, exprimat in zile, intre 0-7"})
      message.author.send({embeds:[embed]})
      return
    }

    if(!isMember){
      embed.addFields({name:"Error",value:"User was not found"})
      message.author.send({embeds:[embed]})
      return
    }

    if(message.author.id === targetID){ // verifica sa nu iti dai singur ban
      embed.addFields({name:"Error",value:"Why do you want to ban yourself?"})
      message.author.send({embeds:[embed]})
      return
    } 

    const isBannable=message.guild?.members.cache.get(mentionedUser?.id!)?.bannable

    if(isBannable){ // verifica daca botul in momentul comenzii poate da ban persoanei fara nici o problema
      
      try {

        embed.addFields({name:"Banned",value:`You have been banned from the server "${message.guild?.name}" by "${message.author.username}". The reason is: ${reason}. The ban is permanent, your messages from the last: ${args[1]} days have been deleted from the server`})
        await mentionedUser?.send({embeds:[embed]})
        await message.guild?.members.cache.get(mentionedUser?.id!)?.ban({
          deleteMessageDays: +args[1], // cu + putem transforma din string in number
          reason:reason,
         
        })

      } catch (error) {

        embed.addFields({name:"Error",value:`Your command "${message.content}" in server "${message.guild?.name}" did not work`})
        message.author.send({embeds:[embed]})

      }
    }else{
      embed.addFields({name:"Error",value:'The person could not be banned by the bot, check if it has the necessary permissions or check the role hierarchy'})
      message.author.send({embeds:[embed]})
      return;
    }
    // message.channel.send("kicked user "+kickedUser+" | user "+user+" | reason "+reason)
    // .then(msg=>{
    //   setTimeout(()=> msg.delete(), 2000)
    // });

    
  }
}