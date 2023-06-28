import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class HelpCommandCommand extends BaseCommand {
  constructor() {
    super('HelpCommand', 'Mod', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    message.channel.send('HelpCommand command works');
  }
}