const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const thx_db = require('./../../Database/models/thxDB.model')
const { log_thx, levelup_log_thx } = require('./../../handler/logger')
const { thx_params, role_level_id, level_point, thx_received_msg, thx_creator, thx_message } = require("./thx_settings.json");


function is_limited(value, limit){
    if(value < limit){
        return false
    } else {
        return true
    }
}

function is_limited_thanks(value, limit){
    if(value <= limit){
        return false
    } else {
        return true
    }
}

function get_user_level(my_point) {
    let max_level;
    for (let i in level_point) {
        if (my_point > level_point[i]) {
            max_level = i
        }
    }
    return max_level;
}

function infoEmbed(interaction, content){
    return new EmbedBuilder()
        .setColor(interaction.client.config.color.palette.firstDate)
        .setDescription(content)
}

function thxEmbed(interaction, user_thanked, content){
    return new EmbedBuilder()
        .setColor(interaction.client.config.color.palette.firstDate)
        .setDescription(thx_message[getRandomInt(thx_message.length)].replace('USER_ID', `<@${user_thanked}>`))
        // .setFooter({text: content})

}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const DEV = false;

module.exports = {
    uuid: "FDBDBCC847AD44E0AE2A5385410482A4",
	permissions: "USER",
    data: new SlashCommandBuilder()
    .setName('merci')
    .setDescription(`Remercie un·e académicien·ne de t'avoir aidé·e`)
    .addUserOption(option =>
        option.setName('membre')
        .setDescription('académicien·ne à remercier')
        .setRequired(true)
        )
        .setDMPermission(false),
        
    async execute(interaction) {
        
        let day = new Date().toISOString().split('T')[0];
        
        const user = interaction.options.getUser('membre');
        
        //Disable thx system on bot user
        if(user.bot){
            let embed = infoEmbed(interaction,  `Au lieu de remercier un bot, remercie plutôt son créateur <@${thx_creator}> :ok_hand:`)
            return interaction.reply({embeds: [embed], ephemeral: true});
        }
        
        if(user.id === interaction.member.id){
            let content = [
                "On se doute que tu es probablement génial, mais tu ne peux pas te remercier toi-même :wink: voyons.",
                "Tiens, tiens, tiens, ... On cherche à s'auto-remercier ? :thinking:",
                "On prend la grosse tête ? :face_with_monocle: Je vais en dire deux mots à mes supérieurs ...",
                "Je serais toi, je quitterai vite mes chaussures, ta cheville va commencer à enfler. :foot:",
                "Bon je vois que tu insistes. Allez tiens, c'est exclusivement pour toi. :heart: :blush:",
                ":scroll: Il n'y a pas de bonne ou mauvaise façon de remercier. \nMais là tu as réussi à te tromper !",
                `Des ${interaction.guild.memberCount} personnes présentes sur le serveur, il n'y avait que toi à remercier ? :rolling_eyes:`,
                "Merci à toi. :hugging:",
                ":nerd: Belle tentative de ta part ! Ce n'est pas comme ça que tu gagneras des points.\nPeut-être même que je vais t'en enlever quelques-uns :upside_down:",
                ":slot_machine: BINGO! Tu as gagné le droit de remercier une autre personne que toi."
            ]
            let embed = infoEmbed(interaction, content[getRandomInt(content.length)]);
            return interaction.reply({embeds: [embed], ephemeral: false});
        }

        
        await interaction.deferReply({ ephemeral: false });

        
        let user_thx_id = user.id;
        let author_id = interaction.member.id;
        
        async function get_user_limits(initiator) {
            // Admin limits
            if(initiator.permissions.has(PermissionFlagsBits.BanMembers)){
                return [thx_params.admin.role_point, thx_params.admin.role_point_limit, thx_params.admin.role_member_day_limit]
            }
            // Mod limits
            if(initiator.permissions.has(PermissionFlagsBits.KickMembers)){
                return [thx_params.mod.role_point, thx_params.mod.role_point_limit, thx_params.mod.role_member_day_limit]
            }
            return [thx_params.member.role_point, thx_params.member.role_point_limit, thx_params.member.role_member_day_limit]
        }
        
        //GET user limits
        [point_to_give, max_point_to_give, max_user_day] = await get_user_limits(interaction.member);

        //Checking if the user already thx someone
        let user_in_thx_given = await thx_db.findOne({
            user_id: author_id
        });
        let user_in_thx_received = await thx_db.findOne({
            user_id: user_thx_id
        });

        ////////////////////////////////////////////
        // HANDLING THX GIVER
        //
        //        
        // User is not in thx_given_db
        if (user_in_thx_given === null){
            if(DEV == false){
                thx_db.create({
                    user_id: author_id,
                    thx_point_received: 0,
                    thx_point_given: point_to_give,
                    thx_given: {
                        day: day,
                        user_list: {
                            [user_thx_id]: point_to_give,
                        }
                    }
                }).catch(console.error)
            }
            log_thx(interaction, author_id, user_thx_id, point_to_give);
            let embed = thxEmbed(interaction, user_thx_id, thx_received_msg[getRandomInt(thx_received_msg.length)]);
            interaction.editReply({embeds: [embed]});
        }

        //User is in thx_given_db
        let entry_thx_today_given;
        if(user_in_thx_given){
            let entry_thx_given_id = user_in_thx_given._id;

            // Checking if the user thx someone today
            entry_thx_today_given = user_in_thx_given.thx_given.find(
                (entry) => entry.day === day
            );
            
            // Checking if the author already thx the user on the same day
            let day_user_entry_given;
            if(entry_thx_today_given){
                if(entry_thx_today_given.user_list === undefined){
                    day_user_entry_given = null;
                } else {
                    day_user_entry_given = entry_thx_today_given.user_list[user_thx_id];
                }
            }

            if(!entry_thx_today_given){
                if(!DEV){
                    thx_db.updateOne(
                        { _id: entry_thx_given_id},
                        {
                            $inc: {
                                thx_point_given: point_to_give,
                            },
                            $push: {
                                thx_given: {
                                    day: day,
                                    user_list: {
                                        [user_thx_id]: point_to_give,
                                    }
                                }
                            }
                        }
       
                    ).catch(console.error)
                }
                log_thx(interaction, author_id, user_thx_id, point_to_give);
                let embed = thxEmbed(interaction, user_thx_id, thx_received_msg[getRandomInt(thx_received_msg.length)]);
                interaction.editReply({embeds: [embed]});
                
            } else {
                if (!day_user_entry_given) {
                    if(is_limited(Object.keys(entry_thx_today_given.user_list).length, max_user_day) === false){
                        if(!DEV){
                            thx_db.updateOne(
                                {_id: entry_thx_given_id, "thx_given.day": day},
                                {
                                    $inc: {
                                        thx_point_given: point_to_give,
                                    },
                                    $set: {
                                        ["thx_given.$.user_list." + user_thx_id]: point_to_give,
                                    }
                                }
                            )
                                .exec()
                                .catch(console.error)
                        }
                        log_thx(interaction, author_id, user_thx_id, point_to_give);
                        let embed = thxEmbed(interaction, user_thx_id, thx_received_msg[getRandomInt(thx_received_msg.length)]);
                        interaction.editReply({embeds: [embed]});
    
                    } else {
                        let embed = infoEmbed(interaction, `Tu as déjà remercié ${max_user_day} personnes aujourd'hui.`);
                        interaction.editReply({embeds: [embed]});
                    }
                } else {    
                    if(is_limited(day_user_entry_given, max_point_to_give) === false){
                        if(!DEV){
                            thx_db.updateOne(
                                {_id: entry_thx_given_id, "thx_given.day": day},
                                {
                                    $inc: {
                                        ["thx_given.$.user_list." + user_thx_id]: point_to_give,
                                        thx_point_given: point_to_give,
                                    }
                                }
                            )
                                .exec()
                                .catch(console.error)
                        }
                        log_thx(interaction, author_id, user_thx_id, point_to_give);
                        let embed = thxEmbed(interaction, user_thx_id, thx_received_msg[getRandomInt(thx_received_msg.length)]);
                        interaction.editReply({embeds: [embed]});
    
                    } else {
                        let embed = infoEmbed(interaction, `Tu as déjà remercié ${max_point_to_give / point_to_give} fois <@${user_thx_id}> aujourd'hui.`);
                        interaction.editReply({embeds: [embed]});
                    }
                }
            }

        }

        ////////////////////////////////////////////
        // HANDLING THX RECEIVED
        //
        //   

        //Checking if the user already have been thx by someone
        let pass_value;
        if(entry_thx_today_given){
            pass_value = Object.keys(entry_thx_today_given.user_list).length
        } else {
            pass_value = 0
        }


        if(is_limited_thanks(pass_value, max_user_day) === false){

            // User is not in thx_received_db
            if (user_in_thx_received === null && is_limited(pass_value, max_user_day) === false){
                if(!DEV){
                    return thx_db.create({
                        user_id: user_thx_id,
                        thx_point_received: point_to_give,
                        thx_point_given: 0,
                        thx_received: {
                            day: day,
                            user_list: {
                                [author_id]: point_to_give
                            }
                        }
                    }).catch(console.error)
                }
            }
            if(user_in_thx_received){
            //User is in the thx_given_db
                let entry_thx_received_id = user_in_thx_received._id;
    
                //Checking if the user received thx today
                let entry_thx_today_received = user_in_thx_received.thx_received.find(
                    (entry) => entry.day === day
                );
    
                let day_user_entry_received;
                if(entry_thx_today_received){
                    if(entry_thx_today_received.user_list === undefined){
                        day_user_entry_received = null;
                    } else {
                        day_user_entry_received = entry_thx_today_received.user_list[author_id];
                    }
                }
    
                // Do not have thx_received today
                if (!entry_thx_today_received){
                    if(!DEV){
                        thx_db.updateOne(
                           {_id: entry_thx_received_id},
                            {
                                $inc: {
                                    thx_point_received:point_to_give,
                                },
                                $push:{
                                    thx_received: {
                                        day: day,
                                        user_list: {
                                            [author_id]: point_to_give
                                        }
                                    }
                                }
                            }
                        ).catch(console.error)
                    }
                } else {
    
                    if (!day_user_entry_received) {
                        if(!DEV){
                            thx_db.updateOne(
                                {_id: entry_thx_received_id, "thx_received.day": day},
                                {
                                    $inc: {
                                        thx_point_received: point_to_give,
                                    },
                                    $set: {
                                        ["thx_received.$.user_list." + author_id]: point_to_give,
                                    }
                                }
                            )
                                .exec()
                                .catch(console.error)
                        }
                    } else {    
                        if (is_limited(day_user_entry_received, max_point_to_give) === false) {
                            if(!DEV){
                                thx_db.updateOne(
                                    {_id: entry_thx_received_id, "thx_received.day": day},
                                    {
                                        $inc: {
                                            ["thx_received.$.user_list." + author_id]: point_to_give,
                                            thx_point_received: point_to_give,
                                        }
                                    }
                                )
                                    .exec()
                                    .catch(console.error)
                            }
                        }
                    }
    
                }
            }
        }
        


        ////////////////////////////////////////////
        // HANDLING ROLE UPDATE
        //
        //

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

        let user_member = interaction.options.getMember('membre');
        
        let user_db = await thx_db.findOne({
            user_id: user_thx_id
        });
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
            let previousRole = role_level[user_level  - 1]
            if(member.roles.cache.has(theoretical_role) == false){
                if(previousRole !== role_level[0]){
                    member.roles.remove(previousRole).catch(console.error);
                }
                member.roles.add(theoretical_role).catch(console.error)
                levelup_log_thx(interaction, member, userLevel, theoretical_role)
            }
        }
        role_level_manager(user_member, user_level)


	},
};