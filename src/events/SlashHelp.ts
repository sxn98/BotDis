// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction, Message } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';

export default class SlashHelp extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }
  
  async run(client: DiscordClient, interaction: Interaction) {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName==='help'){
      // var rolesObject: any[]=[];
      // interaction.guild?.roles.cache.forEach(role=>rolesObject.push({'ID':role.id,'Name':role.name}))
      // console.log(rolesObject.find(el=>el.ID=='1130175404985040976'))
      const currentGuildConfig=client.configs.filter(c=>c.GuildID==interaction.guildId!).get(`${interaction.guildId}`)


      const embed=new EmbedBuilder()
      .setTitle('Help')
      .setDescription('List of help commands and functions, click a button for more informations')
      .addFields(
        {name:'Ban command',value:`${currentGuildConfig?.prefix}ban (tagged user) (days of message history deleted) [reason]`},
        {name:'Unban command',value:`${currentGuildConfig?.prefix}unban (user id) [reason]`},
        {name:'Kick command',value:`${currentGuildConfig?.prefix}kick (tagged user) [reason]`},
        {name:'Timeout command',value:`${currentGuildConfig?.prefix}timeout (tagged user) (minutes) [reason]`},
        {name:'Remove timeout command',value:`${currentGuildConfig?.prefix}removeTimeout (tagged user) [reason]`},
      )
      const butoane ={
        "type":1,
        "components":[
          {
            "style":3,
            "label":'Discord written commands',
            "custom_id":'discordCommands',
            "disabled":true,
            "type":2
          },{
            "style":1,
            "label":'General configurations',
            "custom_id":'guildConfig',
            "disabled":false,
            "type":2
          },{
            "style":1,
            "label":'AutoRole configurations',
            "custom_id":'autoRoleConfig',
            "disabled":false,
            "type":2
          },{
            "style":1,
            "label":'Log configurations',
            "custom_id":'logConfig',
            "disabled":false,
            "type":2
          }
        ]

      }
      await interaction.reply({
        embeds:[embed],
        ephemeral:true,
        components:[butoane]
      });
    }
  }
}