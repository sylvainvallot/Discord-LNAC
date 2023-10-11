require('dotenv').config()
const { SlashCommandBuilder, Events, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	uuid: "820F1FB1751C4BB1A31ACC1DC1EB642B",
	permissions: "DEV",
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('[DEV] Setup')
		.addStringOption(option =>
            option.setName('type')
                .setDescription('what need to be setup ?')
                .setRequired(true)
                .addChoices(
                    { name: 'Tickets Threads', value: 'ticket-threads' },
					{ name: 'Pomodoro Infos', value: 'pomodoro'},
                ))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
		const type = interaction.options.getString('type');
		
		if(type == 'ticket-threads'){
			const threadToCreate = [
				{name: 'ticket-bug', reason: 'Bug tickets'},
				{name: 'ticket-suggestion', reason: 'Suggestion tickets'},
				{name: 'ticket-feedback', reason: 'Feedback tickets'},
				{name: 'ticket-help', reason: 'Help tickets'}
			] 
			
			for(i in threadToCreate){
				const thread = await interaction.channel.threads.create({
					name: threadToCreate[i].name,
					reason: threadToCreate[i].reason,
				});
				if (thread.joinable) await thread.join()
			}
		interaction.reply({content: 'All threads created'})
		}
		if(type == 'pomodoro'){
			const embed = new EmbedBuilder()
				.setTitle(":tomato: - Le Pomotimer - Présentation")
				.setColor("#ff6347")
				.setDescription(`
Le pomodoro est une technique de travail chronométrée dont le but est de travailler sur sa tâche définie pendant toute la durée du minuteur. À la fin, il y a une courte pause et on repart sur un nouveau pomodoro. 
**Un seul objectif : être productif <:stonks:836003405088292883> !**

<:prof:679432344490475546> __**Règles :**__

- Lors d'un pomodoro, si vous êtes dans un salon vocal : les microphones sont coupés ! 
- Vous pouvez si vous le souhaitez, avoir votre caméra allumée. (On pourra vous juger si vous travaillez pas <:yup:705115650062024784> !)
- Vous pouvez rejoindre un pomodoro en cours de route, cependant, veillez à ne pas déranger les personnes qui sont en train de travailler.
- Toute personne qui viendrait nuire à l'ambiance de travail sera sanctionnée !

:tomato: - __**Fontionnement :**__

__Pomodoro :__
Les durées usuelles vont de \`25\` à \`50\` minutes.

__Les pauses :__
Les pauses peuvent aller de \`3\` à \`30\` minutes

Vous pouvez ajouter des répétitions automatiques et/ou d'être mentionné à la fin de la session.

Exemple de lancement d'un pomodoro \`/pomodoro durée_travail durée_pause\`

_En cas de problème, merci de contacter <@${process.env.BOT_OWNER_ID}>_
					`)
			interaction.reply({content:'pomodoro_message sent', ephemeral: true});
			interaction.channel.send({embeds: [embed]});
		}
	}
};