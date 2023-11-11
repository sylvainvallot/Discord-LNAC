require('dotenv').config()
const { ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getUser } = require('./../../Database/utils/user.js');
const { getAvailableThreads, isThreadExist, updateThreadInfo, updateUserThread } = require('./../../Database/utils/irls.js');

module.exports = {
    uuid: "822AB771560D4FCA8C52D96E623E4E15",
    permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('irl')
		.setDescription('Commandes liées aux threads IRL')
        .addSubcommand(subcommand =>
            subcommand.setName('rejoindre')
                .setDescription('Rejoinre un thread IRL')
                .addStringOption(option =>
                    option.setName('thread')
                        .setDescription('Quel thread veux-tu rejoindre ?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Ville renseigné dans /profile', value: 'main' },
                            { name: 'Ville secondaire', value: 'secondary' },
                            // { name: 'Université', value: 'university' },
                        ))
        )
        // .addSubcommand(subcommand =>
        //     subcommand.setName('gerer')
        //         .setDescription('Gérer les threads')
        //         .addChoices(options => 
        //             { name: 'Ville Principale', value: 'main' },
        //             { name: 'Ville Secondaire', value: 'secondary' },
        //             // { name: 'Université', value: 'university' }
        //         )
        // )
        .setDMPermission(false),
    
	async execute(interaction) {
        
        if(interaction.options.getSubcommand() == 'rejoindre'){
            const threadType = interaction.options.getString('thread');
            
            if(threadType == 'main'){
                let message;
                // GET primary user thread
                const users_db = await getUser(interaction.member);
                if(!users_db.city){
                    message = "> Aucune ville renseignée - Complète d'abord ton profil via `/profile reglage ville`";
                    return await interaction.reply({content: message, ephemeral: true});
                } 
                
                // Check if the thread exist
                const threadExist = await isThreadExist(users_db.city, 'city');
                if(!threadExist) {
                    message = "> Il n'y a pas de threads IRL disponible pour cette ville";
                    return await interaction.reply({content: message, ephemeral: true});
                }
                // Get Thread and Add user
                const irlChannel = interaction.guild.channels.cache.find(x => x.id === process.env.CHAN_ID_IRL);
                const thread = irlChannel.threads.cache.find(x => x.name === threadExist.name);
                await thread.members.add(interaction.member);
                
                updateThreadInfo(threadExist.name, 'city', thread.memberCount, thread.messageCount);
                updateUserThread(interaction.member.id, threadExist.name, 'main', 'JOIN');
                message = `> Tu as rejoins le thread : **${threadExist.name}**`
                return interaction.reply({content: message, ephemeral: true});
            }
        }
	},
};