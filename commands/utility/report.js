const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    uuid: "ADC547B72E4C4A1188AAE68E19BCBAA7",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Signaler un utilisateur à la modération')
        .addUserOption(option =>
            option.setName('membre')
            .setDescription('académicien·ne à signaler')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('raison')
            .setDescription('Raison du signalement')
            .setMaxLength(1000)
            .setRequired(true)
        )
        .setDMPermission(false),

	async execute(interaction) {
        const user = interaction.options.getUser('membre');
        const channel = interaction.channel;
        const reason = interaction.options.getString('raison');

        const reportChan = interaction.guild.channels.cache.find(x => x.id === process.env.CHAN_ID_REPORT);
        
        let message;
        
        if(user.bot){
            return interaction.reply({content: `Merci de l'alerte ! Nos bots sont un peu comme des enfants turbulents parfois. On va leur donner une petite leçon de bonnes manières. 😄`, ephemeral: true});
        }
        if(user.id === interaction.member.id){
            return interaction.reply({content: `Tu as réussi à te signaler toi-même ? Tu mérites un badge d'honnêteté extraordinaire ! Mais nous allons jeter un œil !`, ephemeral: true});
        }

        await interaction.reply({content: `Les licornes de l'équipe de modération sont en route avec leurs baguettes magiques pour faire régner l'ordre ! 🌈🦄✨`, ephemeral: true});
        await reportChan.send({content: `**REPORT by ${interaction.user}:** ${user} in ${channel}\nReason: ${reason}`})

	}
};