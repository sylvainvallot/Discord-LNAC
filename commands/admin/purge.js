const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    uuid: "3BF187B4A2C74BC9AC05E136449413BC",
    permissions: "ADMIN",
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('[MOD] Purge messages in a channel')
        .addIntegerOption(option =>
            option.setName('number')
            .setDescription('Number of messages to delete')
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(99)
            )
        .addBooleanOption(option => 
            option.setName('keep-pinned')
            .setDescription('Ignore pin messages')
            )
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Use to purge message only')
        )
        .setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
        const deleteAmount = interaction.options.getInteger('number');
        const ignorePin = interaction.options.getBoolean('keep-pinned');
        const user = interaction.options.getUser('user');

        await interaction.deferReply({ephemeral: true});
        const messages = await interaction.channel.messages.fetch({limit: deleteAmount});
        let messagesToPurge;
        
        if(user && ignorePin){
            messagesToPurge = messages.filter(m => !m.pinned && m.author.id == user.id);
        } else if(user){
            messagesToPurge = messages.filter(m => m.author.id == user.id);
        } else if(ignorePin){
            messagesToPurge = messages.filter(m => !m.pinned);
        } else {
            messagesToPurge = deleteAmount;
        }
        interaction.channel.bulkDelete(messagesToPurge).catch(console.error);

        await interaction.editReply({content: `${deleteAmount} messages deleted`, ephemeral:true})
	},
};