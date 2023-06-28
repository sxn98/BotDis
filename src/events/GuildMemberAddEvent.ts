import { GuildMember, TextChannel } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";

export default class GuildMemberAddEvent extends BaseEvent{
    constructor(){
        super('guildMemberAdd');
    }

    async run(client:DiscordClient,member:GuildMember){
        console.log('Guild member joined');
        console.log(`Joined ${member.guild.id} ${member.guild.name}`);
        const config = client.configs.get(member.guild.id);
        console.log(config);

        if(!config) return;
        if(config.WelcomeChannelID){
           const channel= member.guild.channels.cache.get(config.WelcomeChannelID) as TextChannel;
           if(!channel){
            console.log('No welcome channel found');
           }else{
            channel.send(`Welcome ${member}`);
           }
        }else{
            console.log(`No welcome channel set in ${member.guild.name}`);
        }
    }
}