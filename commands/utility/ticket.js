const { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    uuid: "70E6CB49D35C4DABAA40EDB578497214",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Tickets pour signaler des problèmes, suggérer des idées, recevoir une assistance')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type de ticket')
                .setRequired(true)
                .addChoices(
                    { name: 'Assistance Technique', value: 'help'},
                    { name: 'Rapport de Bug', value: 'bug' },
                    { name: 'Suggestions', value: 'suggestion' },
                    { name: 'Commentaires', value: 'feedback'}
                ))
        .setDMPermission(false),

	async execute(interaction) {
       
        const modalTitle = {
            'help': 'Assistance Technique',
            'bug' : 'Rapport de Bug',
            'suggestion': 'Suggestions',
            'feedback': 'Commentaires',
        }

        const type = interaction.options.getString('type');        

        const modal = new ModalBuilder()
            .setCustomId(`ticket-${type}`)
            .setTitle(`${modalTitle[type]}`)
		
		const ticketTitle = new TextInputBuilder()
            .setCustomId('ticket-title')
            .setLabel("Titre")
            .setStyle(TextInputStyle.Short);

        const ticketContent = new TextInputBuilder()
            .setCustomId('ticket-content')
            .setLabel("Contenu")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder(`Fournissez ici des détails précis. Un contact pourra être nécessaire. Tout abus sera sanctionné.`);

        const firstActionRow = new ActionRowBuilder().addComponents(ticketTitle);
        const secondActionRow = new ActionRowBuilder().addComponents(ticketContent);

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);

	},
};