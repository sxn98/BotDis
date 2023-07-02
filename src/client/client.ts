import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseCommand from '../utils/structures/BaseCommand';
import { GuildConfig } from '../typeorm/entities/GuildConfig';
import { AutoRoleConfig } from '../typeorm/entities/AutoRoleConfig';

export default class DiscordClient extends Client {

  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _prefix: string = '!';
  private _configs=new Collection<string,GuildConfig>();
  private _roleconfigs=new Collection<string,AutoRoleConfig>();


  constructor(options: ClientOptions) {
    super(options);
  }

  get commands(): Collection<string, BaseCommand> { return this._commands; }
  get events(): Collection<string, BaseEvent> { return this._events; }
  get prefix(): string { return this._prefix; }
  set prefix(prefix: string) { this._prefix = prefix; }


  get configs(){
    return this._configs;
  }
  get roleconfigs(){
    return this._roleconfigs;
  }

  set configs(guildConfigs:Collection<string,GuildConfig>) {
    this._configs=guildConfigs;
  }
  set roleconfigs(autoroleConfigs:Collection<string,AutoRoleConfig>){
    this._roleconfigs=autoroleConfigs;
  }
}
