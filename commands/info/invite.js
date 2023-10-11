require("dotenv").config();
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	uuid: "4CEFE66C68554F5DBA7CA143F0825D39",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('invitation')
		.setDescription('Lien d\'invitation au serveur'),

	async execute(interaction) {
		await interaction.reply({content: process.env.LNAC_INVITE, ephemeral: true});
	},
};