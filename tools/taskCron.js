require("dotenv").config();
require('./../Database/database');

const { Client, Events, GatewayIntentBits } = require('discord.js');
const { getReminders, sendRemindersTask, replyRemindersTask } = require('./../Database/utils/reminder.js');

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
	console.log('Cron job Starting');
	const todayReminders = await getReminders();
	console.log(`Sending ${todayReminders.length} reminders`);
	for(const reminder of todayReminders){
		await sendRemindersTask(client, reminder);
	}
	console.log('Cron job done, exiting');

	process.exit();
});

client.login(process.env.TOKEN);
