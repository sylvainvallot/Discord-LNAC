require('dotenv').config()
const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        if(message.author.bot) return;
        
        const fetchedLogs = await message.guild.fetchAuditLogs({
                type: AuditLogEvent.MessageDelete,
                limit: 1,
        });
        const entry = fetchedLogs.entries.first();
        let user = "";
        if (entry.extra.channel.id === message.channel.id
            && (entry.target.id === message.author.id)
            && (entry.createdTimestamp > (Date.now() - 5000))
            && (entry.extra.count >= 1)) {
            user =  `<@${entry.executor.id}>`;
        } else {
            user =  `<@${message.author.id}>`;
        }
        const embed = new EmbedBuilder()
            .setTitle("**DELETED MESSAGES**")
            .setColor(message.client.config.color.fatal)
            .setThumbnail(message.author.displayAvatarURL({ extension: 'jpg' }))
            .addFields(
                    { name: "Author", value: `<@${message.author.id}>`, inline: true},
                    { name: "Channel", value: `<#${message.channelId}>`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true},
                    { name: "Deleted by", value: user, inline: true},
                    { name: 'Content', value: ':arrow_heading_down:', inline: true},

            )
        const log_chan = message.client.channels.cache.get(process.env.CHAN_ID_LOG_MSG);
        await log_chan.send({embeds: [embed]}).catch(console.error);
        await log_chan.send({content: message.content ? message.content : 'Cannont retrieve message content'})
	},
};