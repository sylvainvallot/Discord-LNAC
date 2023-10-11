const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    uuid: "03C9A7089EFB4181B7E873D4DEEF26AC",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Rock Paper Scissor'),

    async execute(interaction) {

        const emoji = {
            'rock' : "🪨",
            'paper' : "📄",
            'scissors': "✂️",
        }

        const rock = new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('Pierre')
            .setStyle(ButtonStyle.Primary)
            .setEmoji(emoji.rock);

        const paper = new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('Feuille')
            .setStyle(ButtonStyle.Primary)
            .setEmoji(emoji.paper);

        const scissors = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('Ciseaux')
            .setStyle(ButtonStyle.Primary)
            .setEmoji(emoji.scissors);

        const row = new ActionRowBuilder()
            .addComponents(rock, paper, scissors);

        const response = await interaction.reply({ 
            content: 'Quel est ton choix ?', 
            components: [row], 
            ephemeral: true,
        });
        
        const botChoices = ['rock', 'paper', 'scissors'];
        const botPlay = botChoices[Math.floor(Math.random() * 3)];
        
        const collectorFilter = i => i.user.id === interaction.user.id; 

        try {
            const choice = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});
            
            const userPlay = choice.customId;
            
            let result;
            
            if (userPlay === botPlay) {
                result = 'C\'est une égalité';
            } else if (
                (userPlay === 'rock' && botPlay === 'scissors') ||
                (userPlay === 'paper' && botPlay === 'rock') ||
                (userPlay === 'scissors' && botPlay === 'paper')
                ) {
                    result = 'Tu as gagné!';
                } else {
                    result = 'Tu as perdu!';
                }

            const reply = `Tu as choisi: ${emoji[userPlay]} contre ${emoji[botPlay]}. ${result}`;
            await interaction.editReply({ content: reply, components: [] });

        } catch(e){
            await interaction.editReply({content: 'Aucune sélection enregistrée, annulation de la partie', components: [] });
        }
    },
};
