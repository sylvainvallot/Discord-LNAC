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

	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	let messages;
	let lastMessageId;
	let i = 0;

	do {
		messages = await logs.messages.fetch({ limit: 100, before: lastMessageId });
		const toClean = messages.filter(m => m.createdTimestamp < oneWeekAgo.getTime());		
		
		if (toClean.size > 0) {
			console.log(`Found ${toClean.size} logs to clean, deleting...`);
			for (const m of toClean.values()) {
				await m.delete();
				// wait 1 second to avoid rate limit
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		} 
		if (messages.size > 0) {
			lastMessageId = messages.last().id;
		} else {
			lastMessageId = null;
		}
		i++;
	} while (messages.size > 0 && i < 10);

	console.log('Cleanings logs done, exiting');
	process.exit();
});

client.login(process.env.TOKEN);