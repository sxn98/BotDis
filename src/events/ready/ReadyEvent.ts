import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
require ('dotenv').config()
import { ActivityType, Routes } from 'discord.js';
import {REST} from '@discordjs/rest'


const rest=new REST().setToken(process.env.TOKEN as any)


export default class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  
  async run (client: DiscordClient) {
    console.log(client.user?.tag+' has logged in.');
    client.user?.setActivity("users. Use /help",{type:ActivityType.Listening})
    const commands=[ // comenzile folosite exclusiv cu "/" numite "slash commands"
      {
        name:'help',
        description:'posts the available commands',
      },
  ];
   
  
  (async () =>{
    
      try {

        await rest.put(
          
          Routes.applicationCommands(process.env.APP_ID as any),  // vom adauga comenzile noastre pe toate serverele in care bot-ul nostru exista de fiecare data cand acesta porneste
          {body:commands}
        )
      } catch (error) {
        console.log(error)
      }
  })();
  }
}