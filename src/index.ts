require('dotenv').config();
import { registerCommands, registerEvents } from './utils/registry';
//import config from '../slappey.json';
import DiscordClient from './client/client';
import { Collection, GatewayIntentBits } from 'discord.js';
import {createConnection, getRepository } from 'typeorm';
import { GuildConfig } from './typeorm/entities/GuildConfig';
import { io } from 'socket.io-client';
import { AutoRoleConfig } from './typeorm/entities/AutoRoleConfig';
import { LogConfig } from './typeorm/entities/LogConfig';



const client = new DiscordClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildVoiceStates] });

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
  socket.on('guildWelcomeChannelUpdate',(config:GuildConfig)=>{
    client.configs.set(config.GuildID,config)
  })

  socket.on('autoRoleAdd',(config:AutoRoleConfig)=>{
    // console.log('configul adaugat')
    // console.log(config)
    client.roleconfigs.set(config.ID.toString(),config)
    // console.log('rezultat ramas')
    // console.log(client.roleconfigs)
  })
  socket.on('autoRoleDelete',(config)=>{// nu putem transforma eficient daca este de tip AutoRoleConfig
    const betterConfig=Object.assign({},...config) // nu putem selecta ceva specific din config usor deoarece este primit ca un array of object, astfel, il transformam intr-un object
    //  console.log('rezultat sters')
    //  console.log(betterConfig)
    //  console.log(betterConfig.ID,betterConfig.RoleID)

    if(betterConfig.ID===undefined) {
      console.log('eroare sau nu e nici un rezultat valid')
      return
    }
    if (betterConfig) client.roleconfigs.delete(betterConfig.ID.toString())
    else console.log('eroare sau nu e nici un rezultat valid')

    //  console.log('configuri ramase')
    //  console.log(client.roleconfigs)
    
  })

  socket.on('logUpdate',(config)=>{
    console.log(config)
    console.log('logUpdate')
    client.logconfigs.set(config.GuildID,config)
    console.log(client.logconfigs)
  })

  await createConnection({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    synchronize:true,
    entities: [GuildConfig,AutoRoleConfig,LogConfig],
  })


  // socket.emit('guilds',{     // testare pentru a vedea daca aplicatia botului poate trimite mesaje catre server
  //   message:'hello world',
  // })



 // client.prefix = process.env.PREFIX || client.prefix;
  const configRepo=getRepository(GuildConfig);
  const autoroleconfigRepo=getRepository(AutoRoleConfig);
  const logRepo=getRepository(LogConfig)

  const guildConfigs=await configRepo.find();
  const autoroleConfigs=await autoroleconfigRepo.find();
  const logConfigs=await logRepo.find();

  const configMappings=new Collection<string,GuildConfig>();
  const autoroleconfigMappings=new Collection<string,AutoRoleConfig>();
  const logConfigMappings=new Collection<string,LogConfig>();

  guildConfigs.forEach((config)=> configMappings.set(config.GuildID,config));
  autoroleConfigs.forEach((config)=> autoroleconfigMappings.set(config.ID.toString(),config));
  logConfigs.forEach((config)=>logConfigMappings.set(config.GuildID,config))

  client.configs=configMappings;
  client.roleconfigs=autoroleconfigMappings
  client.logconfigs=logConfigMappings;

  console.log(client.configs);
  console.log(client.roleconfigs);
  console.log(client.logconfigs)

  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.TOKEN);


})();

