require('dotenv').config()
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildBanRemove,
	async execute(GuildBan) {

        const embed = new EmbedBuilder()
            .setColor(GuildBan.client.config.color.warn)
            .setTitle(`User unban: ${GuildBan.user.tag}`)
            .setThumbnail(GuildBan.user.displayAvatarURL({ extension: 'jpg' }))
            .setDescription(`User: <@${GuildBan.user.id}>`)
            .addFields(
                { name: "Account created on:", value: `${GuildBan.user.createdAt}`, inline: true },
                { name: "Id:", value: `${GuildBan.user.id}`, inline: true },
                { name: "Bot:", value: `${GuildBan.user.bot}`, inline: true }
        )
        const channel = GuildBan.client.channels.cache.get(process.env.CHAN_ID_SANCTION);
        channel.send({embeds: [embed]}).catch(console.error);
	},
};