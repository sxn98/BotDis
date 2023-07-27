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

    if(interaction.customId=='guildConfig'){
      const currentGuildConfig=client.configs.filter(c=>c.GuildID==interaction.guildId!).get(`${interaction.guildId}`) // transformam colectia intr-un obiect

      const embed=new EmbedBuilder()
      .setTitle('Server Config')
      .setDescription('List of server configuration')
      .addFields(
        {name:'Server ID',value:`${currentGuildConfig?.GuildID}`},
        {name:'Prefix',value:`${currentGuildConfig?.prefix}`},
        {name:'Welcome Channel',value:`${interaction.guild?.channels.cache.find(channel=>channel.id==currentGuildConfig?.WelcomeChannelID)?.name ||'!Channel was not set!'}`},
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
  }
}