require('dotenv').config()
const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const guild = await client.guilds.fetch(process.env.LNAC_GUILD_ID)
		client.user.setActivity(`${guild.memberCount} étudiant·es`, { type: ActivityType.Watching });
	},
};