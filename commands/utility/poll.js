const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const emojiList = ['👍', '👎', '🤷'];

module.exports = {
    uuid: "EA4AEA0EEC1B406588F71D043F70AB90",
	permissions: "USER",
    data: new SlashCommandBuilder()
        .setName('sondage')
        .setDescription('Creer un sondage')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('oui-non')
                .setDescription('Question fermée')
                .addStringOption(options => 
                    options.setName('question')
                        .setDescription('Question du sondage')
                        .setRequired(true)
                        .setMaxLength(200)
                )
        ),

    async execute(interaction) {
        
        if(interaction.options.getSubcommand() == 'oui-non') {
            const pollQuestion = interaction.options.getString('question');
            const embed = new EmbedBuilder()
                .setTitle(`Question: ${pollQuestion}`)
                .setColor(interaction.client.config.color.info)
                .setFooter({text:'Utilise 👍, 👎 ou 🤷 pour voter'})
            
            async function reactEmoji(message, remover) {
                for (i = 0; i < emojiList.length; i++) {
                    let emoji = emojiList[i];
                    await message.react(emoji);
                }
                await message.react('🗑️');
                
                const collectorFilter = (reaction, user) => {
                    return reaction.emoji.name === '🗑️' && user.id === message.interaction.user.id;
                };
        
                message.awaitReactions({filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '🗑️') {
                            message.delete();
                        }
                    }).catch(collected => {
                        message.reactions.cache.get('🗑️').remove()
	                        .catch(error => console.error('Failed to remove reactions:', error));
                    });
            }

            await interaction.reply({embeds: [embed]});
            const message = await interaction.fetchReply();
            reactEmoji(message);
            interaction.followUp({content: '_Une erreur ? Tu as 60 secondes pour utiliser la 🗑️ afin de supprimer ta question_', ephemeral: true})
        }
    }
}


