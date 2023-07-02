// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate
import { EmbedBuilder, Interaction } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';

export default class SlashHelp extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }
  
  async run(client: DiscordClient, interaction: Interaction) {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName==='help'){
      const embed=new EmbedBuilder()
        .setTitle('Embed title')
        .setDescription('this is a description')

      interaction.reply({embeds:[embed]});
    }
  }
}