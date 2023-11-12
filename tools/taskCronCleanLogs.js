require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');

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
	console.log('Starting to clean logs...');

    const logs = await client.channels.cache.get(process.env.CHAN_ID_LOG_MSG)
    console.log('Logs channel found, fetching messages...');
	const messages = await logs.messages.fetch({limit: 100});

	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 14);

	const toClean = await messages.filter(m => m.createdTimestamp < oneWeekAgo.getTime());

	if(toClean.size > 0){
		console.log(`Found ${toClean.size} messages to clean, deleting...`);
		for (const m of toClean.values()) {
			
			await m.delete();
			
			// wait 1 second to avoid rate limit
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}
	console.log('Cleanings logs done, exiting');
	process.exit();
});

client.login(process.env.TOKEN);