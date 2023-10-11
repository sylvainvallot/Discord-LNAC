require('dotenv').config()
const { SlashCommandBuilder, Events, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getCommandsUsage } = require('./../../Database/utils/commandUsage.js');
module.exports = {
	uuid: "736A1CA80797497CAE7DA0A58C624DEA",
	permissions: "DEV",
	data: new SlashCommandBuilder()
		.setName('server-stats')
		.setDescription('[DEV] Server Statistics')
		.addStringOption(option =>
            option.setName('type')
                .setDescription('Which data ?')
                .setRequired(true)
                .addChoices(
                    { name: 'Commands Usage', value: 'commands-usage' },
                ))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
		const type = interaction.options.getString('type');
		
		if(type == 'commands-usage'){
			let commandsUsed = await getCommandsUsage();

			let embed = new EmbedBuilder()
            	.setTitle('Commands Usage')
			
			commandsUsed = commandsUsed.filter((cmd) => cmd.permissions !== "DEV")
			commandsUsed = commandsUsed.sort((a, b) => b.usage - a.usage)
			
			commandsUsed.forEach(cmd => {
				embed.addFields({
					name: `/${cmd.name}`,
					value: `${cmd.usage}`,
					inline: true
				})
			});
			interaction.reply({embeds: [embed], ephemeral:true});

		}
		
	}
};