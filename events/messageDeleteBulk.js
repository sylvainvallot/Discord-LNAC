require('dotenv').config()
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageBulkDelete,
	async execute(messages, channel) {

        const length = Array.from(messages).length;
        const chan = messages.first().channelId

        const embed = new EmbedBuilder()
        .setTitle("**BULK DELETED MESSAGES**")
        .setColor(messages.first().client.config.color.fatal)
        .addFields(
                { name: "Channel", value: `<#${chan}>`, inline: true },
                { name: "Length", value: `${length}`, inline: true },
        )
        const log_chan = messages.first().client.channels.cache.get(process.env.CHAN_ID_LOG_MSG);
        // await log_chan.send({content: `<#${messages.first().channelId}>`})
        await log_chan.send({embeds: [embed]}).catch(console.error);
	},
};