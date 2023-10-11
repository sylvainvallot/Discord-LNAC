require("dotenv").config();
const { EmbedBuilder } = require('discord.js');

module.exports = {
    log_thx: function (interaction, giver_id, receiver_id, points_given){
        const thx_log_chan = interaction.client.channels.cache.get(process.env.THX_SYS_LOG);
        const embed = new EmbedBuilder()
            .setTitle(":handshake: Remerciement")
            .setDescription(`<@${giver_id}> :arrow_forward: <@${receiver_id}> : **+${points_given}**  :round_pushpin:<#${interaction.channelId}> `)
            .setColor(interaction.client.config.color.palette.firstDate)
            .setTimestamp()
        thx_log_chan.send({embeds: [embed]}).catch(console.error)
    },

    levelup_log_thx: function(interaction, levelup_member, level, role){
        const thx_log_chan = interaction.client.channels.cache.get(process.env.THX_SYS_LOG);
        const embed = new EmbedBuilder()
            .setTitle(":up: Level Up")
            .setDescription(`${levelup_member} est passé au niveau ${level} <@&${role}>`)
            .setTimestamp()
            .setColor(interaction.client.config.color.palette.orangeVille)
        thx_log_chan.send({embeds: [embed]}).catch(console.error)
    },


}
