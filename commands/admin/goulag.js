const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    uuid: "E12B019557694EDBAF1161C5868840BD",
    permissions: "ADMIN",
	data: new SlashCommandBuilder()
		.setName('goulag')
		.setDescription('[DEV] Quarantine a user')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to quanrantine')
            .setRequired(true)
            )
        .setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
        const toGoulag = interaction.options.getMember('user');
        let roleList = []
        toGoulag.roles.cache.map(r => roleList.push(r.id))

        console.log(roleList)
        await interaction.reply({content: 'Command not active', ephemeral: true});
	},
};