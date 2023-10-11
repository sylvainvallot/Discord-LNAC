const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const thx_db = require('./../../Database/models/thxDB.model')
const { levelup_log_thx } = require('./../../handler/logger')
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

const message = [
    'Hello how are you doing USER_ID'
]; 

const DEV = true

module.exports = {
    uuid: "ADD5AF2C090748C99AFE4A95448CFC8D",
	permissions: "ADMIN",
	data: new SlashCommandBuilder()
		.setName('thx_edit')
		.setDescription(`[ADMIN] Edit thx data of an user`)
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription('User to update data')
				.setRequired(true))
        .addNumberOption(option =>
            option
                .setName('value')
                .setDescription('Number to add or remove')
                .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
        const user = interaction.options.getUser('user')
        const number = interaction.options.getNumber('value')
        
        let is_in_db = await thx_db.findOne(
            {user_id: user.id}
        )
        if(!is_in_db){
            return await interaction.reply({content: 'Cannot edit the data of this user - Inexistant in database', ephemeral: true})
        }
        await interaction.deferReply({ephemeral: true})
            
        let entry_id = is_in_db._id;
        let current_points = is_in_db.thx_point_received
        
        let points_to_update;
        
        if(number < 0){
            if(Math.abs(number) > current_points){
                points_to_update = -(current_points -1)
            }
        } else {
            points_to_update = number
        }

        let balance = current_points + points_to_update
        
        if(!DEV){
            thx_db.updateOne(
                { _id: entry_id},
                {
                    $inc: {
                        thx_point_received: points_to_update,
                    }
                }
            ).catch(console.error)
            
        }

        let user_db = await thx_db.findOne({
            user_id: user.id
        });
        // let user_point = balance;
        let user_point = user_db.thx_point_received;
        let userLevel = get_user_level(user_point);
        let user_level;
        
        if(userLevel){
            user_level = userLevel.toString();
        }

        
        function role_level_manager(member, userLevel){
            let theoretical_role = role_level[user_level];
            // console.log('THEORICAL_ROLE ', theoretical_role)
            // console.log("USER LEVEL: " + userLevel)
            let roleNumber = Object.keys(role_level).length;
            
            for(let i=1; i < roleNumber; i++){
                if(member.roles.cache.some(role => role.id === role_level[i])){
                    member.roles.remove(role_level[i]).catch(console.error)
                }
            }
            member.roles.add(theoretical_role).catch(console.error)
            levelup_log_thx(interaction, member, userLevel, theoretical_role)
            return theoretical_role;
        }
        let user_member = interaction.options.getMember('user');

        let role = role_level_manager(user_member, user_level)
        interaction.editReply({content: `Succesfully updated <@${user.id}>, new balance is ${balance} with role <@&${role}>`})

	},
};