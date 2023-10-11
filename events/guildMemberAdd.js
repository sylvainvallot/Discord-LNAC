require('dotenv').config()
const { Events, EmbedBuilder, ActivityType } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
        const embed = new EmbedBuilder()
            .setColor(member.client.config.color.info)
            .setTitle(`User joined: ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL({ extension: 'jpg' }))
            .setDescription(`User: <@${member.user.id}>`)
            .addFields(
                { name: "Account created on:", value: `${member.user.createdAt}`, inline: true },
                { name: "Id:", value: `${member.user.id}`, inline: true },
                { name: "Bot:", value: `${member.user.bot}`, inline: true }
        )
        const channel = member.client.channels.cache.get(process.env.CHAN_ID_LOG_INOUT);
        channel.send({embeds: [embed]}).catch(console.error);
        
        member.client.user.setActivity(`${member.guild.memberCount} étudiant·es`, { type: ActivityType.Watching });
	},
};