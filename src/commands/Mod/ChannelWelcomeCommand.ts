import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getRepository } from "typeorm";
import { GuildConfig } from "../../typeorm/entities/GuildConfig";

export default class ChannelWelcomeCommand extends BaseCommand{
    constructor(private readonly guildConfigRepository=getRepository(GuildConfig)){
        super('ChannelWelcome','Mod',[]);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>){
        

        if(!args.length){
            message.channel.send("Please provide an argument!");
            return;
        }
        const [newWelcomeID]=args;

        try {
            
            const config=client.configs.get(message.guildId!);
            const updatedConfig=await this.guildConfigRepository.save({
                ...config,
                WelcomeChannelID: newWelcomeID,
            })
            console.log(updatedConfig);
            message.channel.send('Updated welcome channel succesfully!'); 
            client.configs.set(message.guildId!,updatedConfig);
            console.log(client.configs);

        } catch (error) {
            console.log(error)
            message.channel.send('Something went wrong');
            
        }
    }
}