const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    uuid: "26E1669B1F63432B95B0A5342F8799A2",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('aide')
		.setDescription('Rappel pour les mauvaises demandes d\'aide')
        .addUserOption(option =>
            option.setName('membre')
            .setDescription('académicien·ne à alerter que sa demande d\'aide est hors règles')
            .setRequired(true)       
        )
        .addStringOption(option =>
            option.setName('type')
            .setDescription('Quels infractions ?')
            .addChoices(
				{ name: 'Message Privé', value: 'mp' },
                { name: 'Proposition de rémunération ', value: 'money' },
				{ name: 'Contenu insuffisant', value: 'insufficient' },
				{ name: 'Tout', value: 'all' },
			)        
        )
        .setDMPermission(false),

	async execute(interaction) {
        const user = interaction.options.getUser('membre');
        const type = interaction.options.getString('type');
        
        if(user.bot){
            return interaction.reply({content: 'Des bots qui demandent de l\'aide ?! C\'est plutôt toi qui aurais besoin d\'aide pour mentionner la bonne personne !', ephemeral:true})
        }
        
        let header = `__Si tu reçois ce message, c'est que ta demande d'aide n'est pas très réglo...__\n\n`
        let message;

        switch (type) {
            case 'mp':
                message= 'Rappel au règlement: \n4️⃣ **Ne pas demander de l\'aide en MP.**\nPose directement ta question dans le salon ici, plus de personnes pourront t\'aider !'
                break;
            
            case 'money':
                message= 'Rappel au règlement: \n6️⃣ **Toute proposition de rémunération en échange d\'un service est strictement prohibée.**\nC\'est un avertissement avant sanction.'
                break;

            case 'insufficient':
                message='Montres tes pistes, posez des questions précises. On est là pour vous aider à comprendre, pas vous donner les solutions.'
                break;
    
            case 'all':
                message = `:one: ... pose directement ta question dans le salon ici (pas en MP)
                :two: ... précise ton niveau pour qu'on puisse adapter notre aide
                :three: ... écris le début de ta réponse, tes pistes de recherche
                :four: ... explique où tu bloques : ce que tu n'arrives pas à faire et ce que tu as déjà essayé de faire  !

                Avec tout ça on devrait pouvoir t'aider ! :smile:  <:jlm:698986016551338095>
                `
                break;

            default:
                message = `:one: ... pose directement ta question dans le salon ici (pas en MP)
                :two: ... précise ton niveau pour qu'on puisse adapter notre aide
                :three: ... écris le début de ta réponse, tes pistes de recherche
                :four: ... explique où tu bloques : ce que tu n'arrives pas à faire et ce que tu as déjà essayé de faire  !

                Avec tout ça on devrait pouvoir t'aider ! :smile:  <:jlm:698986016551338095>
                `
                break;
            }

        const embed = new EmbedBuilder()
            .setDescription(header + message)
        await interaction.reply({content: `Hello ${user} :wave:`, embeds: [embed]})

    }
};