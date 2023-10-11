require('dotenv').config()
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    uuid: "FA7457F808F6454EB3ACB134A2C7E6C3",
    permissions: "ADMIN",
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('[DEV] Send rule embed message')
        .setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    async execute(interaction){
        const embed = new EmbedBuilder()
            .setTitle(`Règlement de La Nouvelle Académie`)
            .setDescription(`Voici quelques règles de bienséance à suivre lorsque vous serez ici. Nous encourageons fortement les membres du serveur à prendre le temps de lire ce message.
            En cas de violation des règles du serveur (incluant les amendements), vous pourrez être averti voire banni du serveur.
            
            La loi française ainsi que les CGU de Discord France doivent aussi être respectées. 
            
            En cas de problème avec un autre membre, merci d'utiliser la commande \`!report @pseudo décrire ce qu'il s'est passé.\` 

            Lisez également <#${process.env.CHAN_ID_INFO}>`)
            .addFields(
                { name: '\u200b', value: `1️⃣ Les messages de haine, de discrimination, d'insultes, de diffamation, de contenu illégal ou soumis à des droits d'auteur, sont strictement interdits. Vos messages et pièces jointes n'engagent que vous. Le staff ne pourra en être tenu responsable.` },
                { name: '\u200b', value: `2️⃣ Il est strictement interdit de partager du contenu NSFW (Not Safe For Work)` },
                { name: '\u200b', value: `3️⃣ Le spam, le flood, l'abus de majuscules ou de mentions utilisateurs sont interdits.` },
                { name: '\u200b', value: `4️⃣ Quelques règles afin d'optimiser les demandes d'aide : \n - Préciser son niveau afin de recevoir une aide adaptée aux connaissances. \n - Poser une question claire et précise (éviter le "je comprends rien" ou "quelqu'un peut m'aider ?"). Ne pas envoyer un MP à un membre du serveur sauf si vous y êtes invité. \n - Si besoin d'une photo (capture d'écran ou autre), la poster dans le bon sens 🙃 !` },
                { name: '\u200b', value: `⚠️ Méfiez-vous des liens et fichiers partagés. Nous recommandons vivement l'utilisation de captures d'écran et de photos. (Pour partager vos énoncés d'exercices, par exemple) ⚠️` },
                { name: '\u200b', value: `5️⃣ Merci d'utiliser chaque salon de manière appropriée (si vous voulez demander de l’aide en mathématiques ou juste en parler, faites-le dans #mathématiques et non pas dans les autres salons). L'utilisation abusive des commandes bot est proscrite en dehors des salons d'aide ou dédiés à l'aide.` },
                { name: '\u200b', value: `6️⃣ Toute proposition de rémunération en échange d'un service est strictement prohibée.` },
                { name: '\u200b', value: `7️⃣ Veillez à être raisonnable et respectueux dans vos pseudos, photos de profil et statuts.` },
                { name: '\u200b', value: `8️⃣ Les membres de l'équipe se réservent le droit de prendre toute décision qu'ils jugent utile au bon fonctionnement du serveur (i.e. n'essayez pas de jouer avec les limites des membres du serveur, ni celles du règlement).` },
                { name: '\u200b', value: `9️⃣ Aucune pub n'est tolérée. Si vous souhaitez envoyer un questionnaire, dans le cadre d'un mémoire par exemple, nous vous invitons à contacter un membre de l'équipe pour qu'il vous y autorise.` },
                { name: '\u200b', value: `🔟 Tout envoie de message privé indésirable (pub, arnaques, etc.) par le biais du serveur est interdit.` },
                { name: '\u200b', value: `Pour accéder aux autres salons, veuillez accepter ces règles en réagissant avec ✅ à ce message. Si vous n'arrivez pas à accéder au reste du serveur, contactez un des <@&679406328967331861> suivant afin qu'il vous donne les accès manuellement : <@861705399622696960>, <@233956539675705344>, <@111522019912196096>` },
                { name: `Lire le règlement avant de l'accepter est obligatoire.`, value: '\u200b'}
            )
        await interaction.reply({embeds: [embed], ephemeral:true})
    }
}