require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
});

cleanChannel = async (channelID) => {
    const channel = await client.channels.cache.get(channelID);
    console.log(`Cleaning channel ${channel.name}...`);
    let toClean;

    do {
        const messages = await channel.messages.fetch({ limit: 100, pinned: false });
        toClean = messages.filter(m => !m.pinned);		

        if (toClean.size > 0) {
            console.log(`Found ${toClean.size} messages to clean, deleting...`);
            await channel.bulkDelete(toClean);
        }

    } while (toClean.size > 0);
}

client.on('ready', async () => {
	console.log('Starting to clean logs...');

    const channelID = process.env.CHAN_ID_AUTOCLEAN.split(',');
    
    for (const id of channelID) {
        await cleanChannel(id);
    }

    console.log('Cleanings channel done, exiting');
	process.exit();
});

client.login(process.env.TOKEN);