require("dotenv").config();
require('./../Database/database');

const { Client, Events, GatewayIntentBits } = require('discord.js');
const { saveUser } = require('./../Database/utils/user.js');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildPresences,
	],
});

client.on('ready', async () => {
	const guild = await client.guilds.fetch(process.env.LNAC_GUILD_ID);
	const members = await guild.members.fetch();
	const users = members.filter(m => !m.user.bot);
	const total = users.size;
	
	let i = 1;
	await users.forEach((m) => {
		if(!m.user.bot){
			console.log(`Saving user ${i}/${total}`);
			saveUser(m, 'JOIN');
			i++;
		}
	});
	await console.log("DONE");
});

client.login(process.env.TOKEN);
