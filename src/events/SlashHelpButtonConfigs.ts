// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate
import { EmbedBuilder, Interaction } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';

export default class SlashHelpButtonConfigs extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }
  
  async run(client: DiscordClient, interaction: Interaction) {
    if(!interaction.isButton()) return;

    const ButoaneEmbed =()=>{
      let [stilButon1,stilButon2,stilButon3,stilButon4]:number[]=[1,1,1,1]
      let [disabledButon1,disabledButon2,disabledButon3,disabledButon4]:boolean[]=[false,false,false,false]
      if(interaction.customId=='discordCommands'){stilButon1=3,disabledButon1=true}
      if(interaction.customId=='guildConfig'){stilButon2=3,disabledButon2=true}
      if(interaction.customId=='autoRoleConfig'){stilButon3=3,disabledButon3=true}
      if(interaction.customId=='logConfig'){stilButon4=3,disabledButon4=true}

      const butoane={
        "type":1,
        "components":[
          {
            "style":stilButon1,
            "label":'Discord written commands',
            "custom_id":'discordCommands',
            "disabled":disabledButon1,
            "type":2
          },{
            "style":stilButon2,
            "label":'General configurations',
            "custom_id":'guildConfig',
            "disabled":disabledButon2,
            "type":2
          },{
            "style":stilButon3,
            "label":'AutoRole configurations',
            "custom_id":'autoRoleConfig',
            "disabled":disabledButon3,
            "type":2
          },{
            "style":stilButon4,
            "label":'Log configurations',
            "custom_id":'logConfig',
            "disabled":disabledButon4,
            "type":2
          }
        ]
      }
      return butoane
    }

    if(interaction.customId=='discordCommands'){
      const currentGuildConfig=client.configs.filter(c=>c.GuildID==interaction.guildId!).get(`${interaction.guildId}`)
      
      const embed=new EmbedBuilder()
      .setTitle('Written custom commands')
      .setDescription('List of commands that are available for administrators to write, for the commands to work, I must have administration privilege!. In case of an error, additional information will be sent in your dm'+' s')
      .setAuthor(
        {name:`${client.user?.username}`, iconURL:`${client.user?.displayAvatarURL()}`}
        )
      .addFields(
        {name:'Ban command',value:`${currentGuildConfig?.prefix}ban (tagged user) (days of message history deleted) [reason]`},
        {name:'Unban command',value:`${currentGuildConfig?.prefix}unban (user id) [reason]`},
        {name:'Kick command',value:`${currentGuildConfig?.prefix}kick (tagged user) [reason]`},
        {name:'Timeout command',value:`${currentGuildConfig?.prefix}timeout (tagged user) (minutes) [reason]`},
        {name:'Remove timeout command',value:`${currentGuildConfig?.prefix}removeTimeout (tagged user) [reason]`},
      )
      .setFooter({text:'aaaaaaaaaaaaaaaa'})
      await interaction.reply({
        embeds:[embed],
        ephemeral:true,
        components:[ButoaneEmbed()]
      });
    }

    if(interaction.customId=='guildConfig'){
      const currentGuildConfig=client.configs.filter(c=>c.GuildID==interaction.guildId!).get(`${interaction.guildId}`) // transformam colectia intr-un obiect

      const embed=new EmbedBuilder()
      .setTitle('Server Config')
      .setDescription('List of server configuration')
      .addFields(
        {name:'Server ID',value:`${currentGuildConfig?.GuildID}`},
        {name:'Prefix',value:`${currentGuildConfig?.prefix}`},
        {name:'Welcome Channel',value:`${interaction.guild?.channels.cache.find(channel=>channel.id==currentGuildConfig?.WelcomeChannelID)?.id==undefined ? 'Channel was not set' : "<#"+interaction.guild?.channels.cache.find(channel=>channel.id==currentGuildConfig?.WelcomeChannelID)?.id+">"}`},
        {name:'Welcome Text', value:`Welcome (tagged user)`}
      )
      await interaction.reply({
        embeds:[embed],
        ephemeral:true,
        components:[ButoaneEmbed()]
      });
    }

    if(interaction.customId=='autoRoleConfig'){

      const currentGuildAutoRole=client.roleconfigs.filter(ar=>ar.GuildID==interaction.guildId)
      const embed=new EmbedBuilder()
      .setTitle('AutoRole Config')
      //.setImage(interaction.user.displayAvatarURL({size:1024}))
      .setDescription('List of all roles that will be given when a app is used/played by a user')
      currentGuildAutoRole.forEach(element=> embed.addFields({name:element.ActivityName,value:`<@&${element.RoleID}>`,inline:true}))

      await interaction.reply({
        embeds:[embed],
        ephemeral:true,
        components:[ButoaneEmbed()]
      });
    }

    if(interaction.customId=='logConfig'){
      const currentGuildLogConfig=client.logconfigs.filter(lc=>lc.GuildID==interaction.guildId!).get(`${interaction.guildId}`)
      console.log(currentGuildLogConfig)
      const embed=new EmbedBuilder()
      .setTitle('Log config')
      .setDescription('List of the configuration for the logs that i can provide')
      .addFields(
        {name:'Deleted Message Content', value:`${currentGuildLogConfig?.MsgDeletedContent==true ? ':white_check_mark:' : ':x:'}`},
        {name:'Deleted Edited Content', value:`${currentGuildLogConfig?.MsgEditedContent==true ? ':white_check_mark:' : ':x:'}`},
        {name:'Nickname Changes', value:`${currentGuildLogConfig?.NicknameChanges==true ? ':white_check_mark:' : ':x:'}`},
        {name:'User Forcefully Disconnected', value:`${currentGuildLogConfig?.UserForcefullyDisconnected==true ? ':white_check_mark:' : ':x:'}`},
        {name:'User Forcefully Moved', value:`${currentGuildLogConfig?.UserForcefullyMoved==true ? ':white_check_mark:' : ':x:'}`},
        {name:'Text Channel in which the bot posts the logs', value:`${currentGuildLogConfig?.LogChannel==null ? 'No channel set' : "<#"+currentGuildLogConfig?.LogChannel+">"}`},
      )

      await interaction.reply({
        embeds:[embed],
        ephemeral:true,
        components:[ButoaneEmbed()]
      });
    }
  }
}