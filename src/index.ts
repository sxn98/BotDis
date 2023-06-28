require('dotenv').config();
import { registerCommands, registerEvents } from './utils/registry';
//import config from '../slappey.json';
import DiscordClient from './client/client';
import { Collection, GatewayIntentBits } from 'discord.js';
import {createConnection, getRepository } from 'typeorm';
import { GuildConfig } from './typeorm/entities/GuildConfig';
import { io } from 'socket.io-client';



const client = new DiscordClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent ] });

(async () => {

  const socket=io('http://localhost:3001');
  socket.on('guildPrefixUpdate',(config:GuildConfig)=>{ // primim mesaj pe calea 'guildPrefixUpdate' de la server despre noua configuratie in caz ca se schimba pe partea de frontend
    // console.log('guildPrefixUpdate');
    // console.log(config)
    // console.log('INAINTE DE UPDATE')
    // console.log(client.configs)

    client.configs.set(config.GuildID,config); // modificam configurarea
    // console.log('DUPA UPDATE')
    // console.log(client.configs)
  })

  await createConnection({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    synchronize:true,
    entities: [GuildConfig],
  })

  // socket.emit('guilds',{     // testare pentru a vedea daca aplicatia botului poate trimite mesaje catre server
  //   message:'hello world',
  // })



 // client.prefix = process.env.PREFIX || client.prefix;
  const configRepo=getRepository(GuildConfig);
  const guildConfigs=await configRepo.find();
  const configMappings=new Collection<string,GuildConfig>();
  guildConfigs.forEach((config)=> configMappings.set(config.GuildID,config));

  client.configs=configMappings;

  console.log(client.configs);

  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.TOKEN);


})();

