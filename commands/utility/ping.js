const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	uuid: "499B92D496AF494B9226C4791CB433DF",
	permissions: "ADMIN",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('[ADMIN] Get Websocket and Roundtrip latency')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral:true });

		const messsage = `Websocket heartbeat: ${interaction.client.ws.ping}ms.\n` + 
			`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`
		interaction.editReply({content: messsage});
	},
};