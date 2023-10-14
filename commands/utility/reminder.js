const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const humanID = require('human-id');
const reminder_db = require('./../../Database/models/reminder.model');
const { saveReminder, deleteReminder, getUserReminder } = require('./../../Database/utils/reminder.js');
const { userReminder } = require('./../../Database/utils/user.js');


async function getMessage(interaction, url){
    const msg_ranking = {
        url: url,
        id: "",
        channel: "",
        content: "",
    }
    const parsedURL = msg_ranking.url.split('/');
    msg_ranking.id = parsedURL.pop();
    msg_ranking.channel = parsedURL[parsedURL.length - 1];

    const channel = await interaction.guild.channels.fetch(msg_ranking.channel);
    const msg = await channel.messages.fetch(msg_ranking.id)
    return msg;
}

function getDate(interaction){
    const day = interaction.options.getInteger('jour');
    const month = interaction.options.getInteger('mois');
    let year = interaction.options.getInteger('annee');
    if(!year){
        year = new Date().getFullYear()
    }

    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return date
}

function formatDate(date){
    const arr = date.split('-');
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]]
    return arr.join('-');

}


module.exports = {
    uuid: "AF17118D4AE443D79007E14CB0CFE708",
	permissions: "USER",
    data: new SlashCommandBuilder()
        .setName('rappel')
        .setDescription('Créer un rappel qui est envoyé dans le canal d\'où est exécutée la commande')
        .addSubcommand(subcommand => 
            subcommand.setName('nouveau')
                .setDescription('Créer un rappel qui est envoyé dans le canal d\'où est exécutée la commande')
                .addIntegerOption(option =>
                    option.setName('jour')
                        .setDescription('Jour')
                        .setMinValue(1)
                        .setMaxValue(31)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('mois')
                        .setDescription('Mois')
                        .addChoices(
                            { name: 'Janvier', value: 1 },
                            { name: 'Février', value: 2 },
                            { name: 'Mars', value: 3 },
                            { name: 'Avril', value: 4 },
                            { name: 'Mai', value: 5 },
                            { name: 'Juin', value: 6 },
                            { name: 'Juillet', value: 7 },
                            { name: 'Août', value: 8 },
                            { name: 'Septembre', value: 9 },
                            { name: 'Octobre', value: 10 },
                            { name: 'Novembre', value: 11 },
                            { name: 'Décembre', value: 12 }
                        )
                        .setMinValue(1)
                        .setMaxValue(12)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('annee')
                        .setDescription('Année')
                        .setMinValue(new Date().getFullYear())
                )
                .addStringOption(option => 
                    option.setName('contenu')
                    .setDescription('Contenu du rappel')
                )
                .addStringOption(option =>
                    option.setName('lien-message')
                    .setDescription('Lien du message à rappeler')
                )
            
        )
        .addSubcommand(subcommand =>
            subcommand.setName('annuler')
                .setDescription('Annuler un rappel')
                .addStringOption(option =>
                    option.setName('id-rappel')
                        .setDescription('ID du rappel à supprimer')
                        .setRequired(true)
                    )

        )
        .addSubcommand(subcommand =>
            subcommand.setName('liste')
                .setDescription('Lister ses rappels à venir')
        ),
    
    async execute(interaction) {
        
        if(interaction.options.getSubcommand() == 'nouveau'){
            const reminderID = humanID.humanId();
            const date = getDate(interaction);
            const content = interaction.options.getString('contenu');
            const url_message = interaction.options.getString('lien-message');
            
            if(!content && !url_message){
                return interaction.reply({content: 'Tu dois me préciser au moins quelque chose à te rappler', ephemeral: true});
            }
            
            const reminder = {
                author: interaction.user.id,
                date: date,
                content: content,
                message_url: url_message,
                localisation: interaction.channelId,
            }
            
            const reminderDB = await saveReminder(reminder);
            await userReminder(interaction.member);
            if(reminderDB){
                const reminderCreated = `**Rappel crée!** \nPour le supprimer utilise \`/rappel annuler ${reminderDB.id}\` \nPour connaître tous tes rappels à venir utilise \`/rappel liste\``
                return interaction.reply({content: reminderCreated, ephemeral: true});
            } else {
                return interaction.reply({content: `Une erreur s'est produite, si cela recommence, contacte le dévelopeur <@${process.env.BOT_OWNER_ID}`, ephemeral: true});
            }
        }

        if(interaction.options.getSubcommand() == 'annuler'){
            await interaction.deferReply({ephemeral: true});
            const id = interaction.options.getString('id-rappel');
            const reminderToDelete = await deleteReminder(interaction, id);
            if(reminderToDelete == 'NOT_FOUND'){
                return interaction.editReply({content: `Aucun rappel trouvé pour l'ID ${id}`, ephemeral: true});
            }
            if(reminderToDelete == 'ACCESS_DENIED'){
                return interaction.editReply({content: `Ce rappel n'est pas à toi ! Tu ne peux pas le supprimer`, ephemeral: true});
            }
            if(reminderToDelete == 'SUCCESS'){
                return interaction.editReply({content: `Le rappel ${id} a été supprimé`, ephemeral: true});
            }
        }

        if(interaction.options.getSubcommand() == 'liste'){
            await interaction.deferReply({ephemeral: true});
            const author = interaction.user.id;
            const userReminders = await getUserReminder(author);
            let embedTitle;
            let reminderToList;

            if(userReminders.length === 0){
                embedTitle = 'Tu as aucun rappel de programmé';
                reminderToList = userReminders;

            } else if(userReminders.length === 1){
                embedTitle = 'Tu as un rappel de programmé';
                reminderToList = userReminders;

            } else if(userReminders.length > 1 && userReminders.length <= 25){
                embedTitle = `Voici tes ${userReminders.length} rappels programmés`;
                reminderToList = userReminders;

            } else {
                embedTitle = `Voici tes 25 prochains rappels sur tes ${userReminders.length} programmés`;
                reminderToList = userReminders.slice(0, 25);
            }

            const embed = new EmbedBuilder()
                .setTitle(`${embedTitle}`)

            reminderToList.forEach(reminder => {
                let content;
                if(reminder.message_url){
                    content = `${reminder.message_url} > ${reminder.content}`;
                } else {
                    content = `${reminder.content}`;
                }
                let localisation;
                if(reminder.localisation === reminder.author){
                    localisation = "message privé";
                } else {
                    localisation = `<#${reminder.localisation}>`;
                }
                embed.addFields({ name: `Le ${formatDate(reminder.date)} dans ${localisation} - id: ${reminder.id}`, value: `${content}`})
            });
            
            return interaction.editReply({embeds: [embed] , ephemeral: true});
        }

    }
}