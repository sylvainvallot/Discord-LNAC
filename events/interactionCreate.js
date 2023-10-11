const { Events } = require('discord.js');
const ChatInputCommandHandler = require('./../handler/interactions/isChatInputCommand.js');
const ModalSubmitHandler = require('./../handler/interactions/isModalSubmit.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()){
			ChatInputCommandHandler.execute(interaction)

		} else if (interaction.isButton()) {
			// respond to button

		} else if (interaction.isStringSelectMenu()) {
			// respond to the select menu

		} else if (interaction.isModalSubmit()){
			ModalSubmitHandler.execute(interaction)
			
		}

	},
};