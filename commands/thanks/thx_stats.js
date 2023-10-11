const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const thx_db = require('./../../Database/models/thxDB.model')
const { thx_params, role_level_id, level_point, thx_received_msg, thx_creator } = require("./thx_settings.json");


function get_user_level(my_point) {
    let max_level;
    for (let i in level_point) {
        if (my_point > level_point[i]) {
            max_level = i
        }
    }
    return max_level;
}

const role_level = {
    0 : role_level_id.lvl_zero,
    1 : role_level_id.lvl_one,
    2 : role_level_id.lvl_two,
    3 : role_level_id.lvl_three,
    4 : role_level_id.lvl_four,
    5 : role_level_id.lvl_five,
    6 : role_level_id.lvl_six,
    7 : role_level_id.lvl_seven,
}


module.exports = {
    uuid: "ADC547B72E4C4A1188AAE68E19BCBAA7",
	permissions: "ADMIN",
	data: new SlashCommandBuilder()
		.setName('thx_stats')
		.setDescription(`Get stats`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('[ADMIN] Thanks info about a user')
                .addUserOption(option => option.setName('user').setDescription('User to check thanks stats')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('[ADMIN] Thanks info about the server'))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
        if(interaction.options.getSubcommand() == 'server'){
            let all_user_receiver = await thx_db.find({}).where('thx_point_received').gte(1).sort([['thx_point_received', 'descending']]);
            let all_user_giver = await thx_db.find({}).where('thx_point_given').gte(1).sort([['thx_point_given', 'descending']]);

            let nb_receiver = all_user_receiver.length;
            let nb_giver = all_user_giver.length;

            let message_content_receiver = '';

            for(let i=0; i<20; i++){
                let line = `${all_user_receiver[i].thx_point_received} pts : <@${all_user_receiver[i].user_id}> `
                message_content_receiver += line + "\n"
            }

            let message_content_giver = '';

            for(let i=0; i<20; i++){
                let line = `${all_user_giver[i].thx_point_given} pts : <@${all_user_giver[i].user_id}> `
                message_content_giver += line + "\n"
            }


            const embed_receiver = new EmbedBuilder()
                .setTitle('TOP10 thanked')
                .setDescription(message_content_receiver)
                .addFields(
                    {name: 'Unique user thanked', value: nb_receiver.toString(), inline: true},
                )

            const embed_giver = new EmbedBuilder()
                .setTitle('TOP10 thanksgiver')
                .setDescription(message_content_giver)
                .addFields(
                    {name: 'Unique user thanksgiver', value: nb_giver.toString(), inline: true},
                )
        

            await interaction.reply({embeds: [embed_receiver, embed_giver]})
        }
        if(interaction.options.getSubcommand() == 'user'){
            const user = interaction.options.getUser('user');

            let is_in_db = await thx_db.findOne(
                {user_id: user.id}
            )

            let actual_level, user_point, user_title;
            let text_info = `Informations about ${user.username} / ${user.globalName}`;
            
            if(is_in_db){
                user_point = is_in_db.thx_point_received;
                actual_level = parseInt(get_user_level(user_point));
            } else {
                user_point = 0;
            }

            if(user_point <= level_point[1]){
                actual_level = 0;
                user_title = "Pas de grade pour le moment";
            } else {
                user_title = `<@&${role_level[parseInt(get_user_level(user_point))]}>`;
            }

            let left_point = level_point[actual_level + 1] - user_point;

            const embed = new EmbedBuilder()
                .setTitle('Thx User Stats')
                .setDescription(
                    text_info + "\n\n" +
                    `Number of points: ${user_point}` + "\n" +
                    `Current rank: ${user_title}` + "\t" +
                    `Current level: ${actual_level}` + "\n" +
                    `Next level in: ${left_point} points`
                )
            
            await interaction.deferReply({ ephemeral: true });

            await interaction.editReply({embeds: [embed]})
        }

	},
};