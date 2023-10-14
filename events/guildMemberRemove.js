require('dotenv').config()
const { Events, EmbedBuilder, ActivityType } = require('discord.js');
const { userLeft } = require('./../Database/utils/user.js');

function timespan(date1, date2) {
        if (date1 > date2) { // swap
            let result = (date2, date1);
            result.years  = -result.years;
            result.months = -result.months;
            result.days   = -result.days;
            result.hours  = -result.hours;
            return result;
        }
        let result = {
            years:  date2.getFullYear()  - date1.getFullYear(),
            months: date2.getMonth() - date1.getMonth(),
            days:   date2.getDate()  - date1.getDate(),
            hours:  date2.getHours() - date1.getHours()
        };
        if (result.hours < 0) {
            result.days--;
            result.hours += 24;
        }
        if (result.days < 0) {
            result.months--;
            // days = days left in date1's month,
            //   plus days that have passed in date2's month
            var copy1 = new Date(date1.getTime());
            copy1.setDate(32);
            result.days = 32-date1.getDate()-copy1.getDate()+date2.getDate();
        }
        if (result.months < 0) {
            result.years--;
            result.months+=12;
        }
        if(result.years === 'NaN'){
            result.years=0
        }
        return result;
}

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
        const timeStayed = timespan(new Date(member.joinedTimestamp), new Date())
        const embed = new EmbedBuilder()
            .setTitle(`User left: ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL({ extension: 'jpg' }))
            .setDescription(`User: <@${member.user.id}>`)
            .addFields(
                { name: "Account created on:", value: `${member.user.createdAt}`, inline: true },
                { name: "Id:", value: `${member.user.id}`, inline: true },
                { name: "Bot:", value: `${member.user.bot}`, inline: true },
                { name: "JoinedAt:", value: `${new Date(member.joinedTimestamp)}`, inline: true},
                { name: "Stayed:",  value: `${timeStayed.years} years, ${timeStayed.months} months, ${timeStayed.days} days and ${timeStayed.hours} hours`, inline: true },
        )
        const channel = member.client.channels.cache.get(process.env.CHAN_ID_LOG_INOUT);
        channel.send({embeds: [embed]}).catch(console.error);
        member.client.user.setActivity(`${member.guild.memberCount} étudiant·es`, { type: ActivityType.Watching });
        await userLeft(member);
	},
};