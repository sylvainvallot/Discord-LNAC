require('dotenv').config()
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getAllThreads } = require('../../Database/utils/irls');

module.exports = {
	uuid: "584790317182488F9C2B131812E98611",
	permissions: "DEV",
	data: new SlashCommandBuilder()
		.setName('setup-irl')
		.setDescription('[DEV] IRL Setup Commands')
        .addSubcommand(subcommand =>
            subcommand.setName('create-new-thread')
                .setDescription('Create a new IRL thread')
                .addStringOption(option =>
                    option.setName('thread')
                        .setDescription('Thread Name')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Thread Type')
                        .setRequired(true)
                        .addChoices(
                            { name: 'city', value: 'city' },
                            // { name: 'university', value: 'university' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('list-threads')
                .setDescription('List all IRL threads')
                // .addStringOption(option =>
                //     option.setName('type')
                //         .setDescription('Thread Type')
                //         .setRequired(true)
                //         .addChoices(
                //             { name: 'city', value: 'city' },
                //             { name: 'university', value: 'university' },
                //             { name: 'all', value: 'all'}
                //         )
                // )
        )
		// .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        // .setDMPermission(false)
        .setNSFW(true),


	async execute(interaction) {

        if(interaction.options.getSubcommand() == 'create-new-thread'){
            console.log(interaction.user);
        } 
        if(interaction.options.getSubcommand() == 'list-threads'){
            const threads = await getAllThreads();
            let content = []
            threads.sort((a,b) => a.name.localCompare(b.name)).forEach(thread => {
                content.push(`**${thread.name}** - ${thread.memberCount-1} membres`);
            })
            const embed = new EmbedBuilder()
                .setTitle('Liste des threads')
                .setDescription(content.join('\n'))
            return await interaction.reply({embeds: [embed], ephemeral: true});
        }
	}
};