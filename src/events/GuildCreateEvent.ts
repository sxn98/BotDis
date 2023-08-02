import { Guild } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { getRepository } from "typeorm";
import { GuildConfig } from "../typeorm/entities/GuildConfig";
import { LogConfig } from "../typeorm/entities/LogConfig";

export default class GuildCreateEvent extends BaseEvent{
    constructor(
        private readonly guildConfigRepository=getRepository(GuildConfig),
        private readonly guildLogRepository=getRepository(LogConfig)
    ){
        super('guildCreate');
    }
    async run(client:DiscordClient, guild:Guild){
        console.log('hello, world!');
        console.log(`Joined ${guild.name}`);

        const config=await this.guildConfigRepository.findOneBy({
            GuildID:guild.id,
        });
        const logConfig=await this.guildLogRepository.findOneBy({
            GuildID:guild.id
        })

        if(config){
            console.log('A config was found');
            client.configs.set(guild.id,config);
        }else{
            console.log('No config found, creating one')
            const newConfig=this.guildConfigRepository.create({
                GuildID:guild.id,
            });
          
            const savedConfig=await this.guildConfigRepository.save(newConfig);
            
            client.configs.set(guild.id,savedConfig);
            console.log(client.configs);
        }

        if(logConfig){
            console.log('Log config was found')
            client.logconfigs.set(guild.id,logConfig)
        }else{
            const newLogConfig=this.guildLogRepository.create({
                GuildID:guild.id
            });

            const savedLogConfig=await this.guildLogRepository.save(newLogConfig)
            client.logconfigs.set(guild.id,savedLogConfig);
            console.log(client.logconfigs)
        }
    }

}