const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Events } = require('discord.js');
const { thx_params, role_level_id, level_point, thx_received_msg, thx_creator, thx_message } = require("./../thanks/thx_settings.json");
const thx_db = require('./../../Database/models/thxDB.model')

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
    uuid: "B2423EE7D64F4A04A340EC004887EDAB",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Obtiens tes différentes statistiques sur le serveur')
        .addStringOption(option =>
            option.setName('donnees')
                .setDescription('Choisis les statistiques que tu veux savoir')
                .setRequired(true)
                .addChoices(
                    { name: 'Système de remerciement', value: 'merci' },
                )),

	async execute(interaction) {
        const type = interaction.options.getString('donnees');

        if(type == 'merci'){
            
            let author_id = interaction.member.id;
            
            let point_to_give, max_point_to_give, max_user_day;
            let text_info, actual_level, left_point, user_title, user_point;
                
            let is_in_db = await thx_db.findOne(
                {user_id: author_id}
            );
        
            if(is_in_db){
                user_point = is_in_db.thx_point_received;
                user_givent_points = is_in_db.thx_point_given;
                actual_level = parseInt(get_user_level(user_point))
            } else {
                user_point = 0;
                user_givent_points = 0;
            }
        
            if(user_point <= level_point[1]){
                actual_level = 0;
                user_title = "Pas de grade pour le moment"
            } else {
                user_title = `<@&${role_level[parseInt(get_user_level(user_point))]}>`
            }
        
            left_point = level_point[actual_level + 1] - user_point;
        
            const status_embed = new EmbedBuilder()
                .setTitle(`:scroll: Voici tes statistiques \`/merci\``)
                .addFields(
                    {name: 'Points reçus', value:`${user_point}`, inline: true},
                    {name: 'Points donnés', value:`${user_givent_points}`, inline: true},
                    {name: '\u200B', value: '\u200B', inline: true },
                    {name: 'Grade actuel', value: `${user_title}`, inline: true},
                    {name: 'Niveau actuel', value: `${actual_level}`, inline: true},
                    {name: 'Niveau supérieur dans', value: `${left_point} points`, inline: true}

                )
                .setFooter({ text:`N'oublie pas de rappeler que /merci existe, tu passeras plus vite au niveau supérieur !`})
        
            await interaction.reply({embeds: [status_embed], ephemeral: true});
        }
	},
};