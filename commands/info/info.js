require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    uuid: "F15E9981FD6648E1A077017C38EF24C3",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Information sur le bot'),

	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`Infos`)
            .setDescription(`
                Le bot est développé, maintenu et hébergé par <@${process.env.BOT_OWNER_ID}>. 
                Le code source de ce bot est disponible sur [GitHub](https://github.com/sylvainvallot/Discord-LNAC 'optional hovertext'), ce qui signifie que si vous êtes intéressé·e à contribuer ou à suggérer des améliorations, vous êtes les bienvenus.`)
            .addFields(
                { name:`Contribuer sur GitHub`, value: `Vous pouvez trouver le code source sur [GitHub](https://github.com/sylvainvallot/Discord-LNAC 'optional hovertext')`},
                { name:`Contacter l'auteur`, value:` Si vous avez des idées, des suggestions ou des questions, je serais ravi(e) de les entendre. Vous pouvez me contacter directement sur Discord à <@${process.env.BOT_OWNER_ID}>` },
                { name:`Merci de votre intérêt et de votre soutien !`, value:`\u200b` },
            )
            .setColor(interaction.client.config.color.info)
		await interaction.reply({embeds: [embed], ephemeral: true});
	},
};