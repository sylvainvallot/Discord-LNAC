const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    uuid: "DB0BD0F2625A45D58B9883144460C15D",
	permissions: "USER",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Liste les commandes disponibles sur le bot'),

    async execute(interaction) {
        let commandList = interaction.client.commands

        let embed = new EmbedBuilder()
            .setTitle('Liste des commandes')
            .setDescription('Liste des commandes disponibles sur le serveur. Si tu as des suggestions pour améliorer le bot, hésite pas à utiliser la commande /ticket et de sélectionner le choix Suggestion')
        
        commandList = commandList.filter((cmd) => cmd.data.default_member_permissions === undefined)
        commandList = commandList.sort((a, b) => a.data.name.localeCompare(b.data.name))
        
        commandList.forEach(cmd => {
            if(cmd.data.default_member_permissions === undefined){
                embed.addFields({
                    name: `/${cmd.data.name}`,
                    value: `${cmd.data.description}`,
                    inline: true
                })
            }
        });
        interaction.reply({embeds: [embed], ephemeral:true});
    }
}