const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { getUser, deleteProfile } = require('./../../Database/utils/user.js');

function formatBirthday(birthday){
    if(!birthday){
        return "Non renseigné"
    }
    const arr = birthday.split('/');
    if(arr[2] === "0000"){
        return arr.slice(0,2).join('/');
    }
    return birthday;
}

function formatLocalisation(string){
    if(!string) return "Non renseigné";
    return string
}

function joinedDate(date){
    const joined = new Date(date);
    const year = joined.getFullYear();
	const month = String(joined.getMonth()+1).padStart(2, '0');
	const day = String(joined.getDate()).padStart(2, '0');
    return day + "/" + month + "/" + year;
}

module.exports = {
    uuid: "9DB8A2FEEC1A4BB8963E2F3EF0C9E544",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('profil')
		.setDescription('Consulte et gère ton profil sur le serveur')
        .addSubcommand(subcommand =>
            subcommand.setName('info')
                .setDescription('Ton profil sur le serveur')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('reglage')
                .setDescription('Renseigne les informations de ton profil')
                .addStringOption(option =>
                    option.setName('valeur')
                        .setDescription('Choisis l\'information que tu veux renseigner ou modifier')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Anniversaire', value: 'birthday' },
                            { name: 'Ville', value: 'city'}
                ))        
        )
        .addSubcommand(subcommand =>
            subcommand.setName('supprimer')
                .setDescription('Supprime toutes les valeurs de ton profil')
        )
        .setDMPermission(false),

	async execute(interaction) {
        if(interaction.options.getSubcommand() == 'info'){
            const profile = await getUser(interaction.member);

            const embed = new EmbedBuilder()
                .setTitle('Ton profil sur le serveur LNAC')
                .setDescription(`Pour supprimer les données de ton profil, utilises la commande \`/profil supprimer\`\n
                    Pour mettre à jour, modifier une donnée, utilises la commande \`/profil reglage\``)
                .addFields(
                    {name: 'Anniversaire', value: `${formatBirthday(profile.birthday)}`, inline: true},
                    {name: 'Ville', value: `${formatLocalisation(profile.city)}`, inline: true}
                )
                .setFooter({text: `Pour connaître tes statistiques sur le serveur utilises la commande /stats`})   
            return await interaction.reply({embeds: [embed], ephemeral: true});
        }

        if(interaction.options.getSubcommand() == 'reglage'){
            const type = interaction.options.getString('valeur');
            if(type == 'birthday'){
                const modal = new ModalBuilder()
			        .setCustomId('birthday-modal')
			        .setTitle('Quand est ton anniversaire ?');

                const birthdayInput = new TextInputBuilder()
                    .setCustomId('birthdayInput')
                    .setLabel("Ton annivesaire au format JJ/MM ou JJ/MM/AAAA")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(10)
                    .setMinLength(5)
                    .setRequired(true);

                const actionRow = new ActionRowBuilder().addComponents(birthdayInput);
                modal.addComponents(actionRow);
                return await interaction.showModal(modal);
            }

            if(type == 'city'){
                const modal = new ModalBuilder()
			        .setCustomId('city-modal')
			        .setTitle('Quand est ta ville ?');

                const cityInput = new TextInputBuilder()
                    .setCustomId('cityInput')
                    .setLabel("La ville que tu souhaites renseigner")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(1)
                    .setRequired(true);

                const actionRow = new ActionRowBuilder().addComponents(cityInput);
                modal.addComponents(actionRow);
                return await interaction.showModal(modal);
            }
        }

        if(interaction.options.getSubcommand() == 'supprimer'){
            await deleteProfile(interaction.member);
            return interaction.reply({content: 'Les  données de ton profil ont bien été supprimés', ephemeral: true})

        }
	},
};