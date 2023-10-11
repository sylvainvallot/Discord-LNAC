const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    uuid: "9FCA89019FBA4982BFD20483B6E87902",
    permissions: "ADMIN",
    data: new SlashCommandBuilder()
    .setName('lnac')
    .setDescription('[ADMIN] LNAC.gif')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction){
        await interaction.reply({files: ['./lnac.gif']});
    }

}