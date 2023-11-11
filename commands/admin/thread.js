const { ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    uuid: "76EBD249F89245208877B73382CAAAF6",
    permissions: "ADMIN",
	data: new SlashCommandBuilder()
		.setName('thread')
		.setDescription('[ADMIN] Create a private thread')
        .addStringOption(options => 
            options.setName('name')
            .setDescription('Thread Name')
            .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to add to the thread')
        )
        .setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
        const toIsolate = interaction.options.getMember('user');
        const threadName = interaction.options.getString('name');
        interaction.channel.threads.create({
            type: ChannelType.PrivateThread,
            name: threadName,
            invitable: false
        }).catch(console.error);
        await interaction.reply({content: 'done', ephemeral: true});
	},
};