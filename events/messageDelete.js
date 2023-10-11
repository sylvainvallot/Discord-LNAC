require('dotenv').config()
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        if(message.author.bot) return;

        const embed = new EmbedBuilder()
            .setTitle("**DELETED MESSAGES**")
            .setColor(message.client.config.color.fatal)
            .setThumbnail(message.author.displayAvatarURL({ extension: 'jpg' }))
            .addFields(
                    { name: "Author", value: `<@${message.author.id}>`, inline: true},
                    { name: "Channel", value: `<#${message.channelId}>`, inline: true },
                    { name: 'Content', value: ':arrow_heading_down:'}
            )
        const log_chan = message.client.channels.cache.get(process.env.CHAN_ID_LOG_MSG);
        await log_chan.send({embeds: [embed]}).catch(console.error);
        await log_chan.send({content: message.content ? message.content : 'Cannont retrieve message content'})
	},
};