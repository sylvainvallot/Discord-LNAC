require("dotenv").config();
require('./../Database/database');

const { Client, Events, GatewayIntentBits } = require('discord.js');
const { sendHappyBirthday } = require('./../Database/utils/user.js');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildPresences,
	],
});

client.on('ready', async () => {
	console.log('Cron job Happy Birthday Starting');
	const birthdayCount = await sendHappyBirthday(client);
	console.log(`Wishing ${birthdayCount} birthdays today`);
	console.log('Cron job Happy Birthday done, exiting');
	process.exit();
});

client.login(process.env.TOKEN);
