require("dotenv").config();
const { EmbedBuilder } = require('discord.js');
const { saveCommandUsage } = require('./../../Database/utils/commandUsage.js');

module.exports = {
    async execute(interaction) {
        const command = interaction.client.commands.get(interaction.commandName);
		
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
	
			try {
				await command.execute(interaction);
				saveCommandUsage(command);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
    }
}
