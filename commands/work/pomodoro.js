const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const moment = require("moment");

const pomodoroSession = new Set();
let pomoTimer;

function timeLeft(session) {
    let length;
    const start = session.start;
    switch (session.type) {
        case 'break':
            length = session.workLength;
            break;
    
        case 'work':
            length = session.breakLength;
            break;
    }
    let now = new moment();
    let end = new moment(start).add(length, "m");
    return end.diff(now, "minutes");
  }
  
function pomodoro(interaction, session){
    const notification = `<@${session.user.id}>`

    switch (session.type) {
        case 'work':
            interaction.channel.send({content: `> ${session.mention ? notification : ''} Début du pomodoro ${session.loop}/${session.length} de ${session.workLength}min`})
            pomoTimer = setTimeout(() => {
                interaction.channel.send({content:`> ${session.mention ? notification : ''} Fin de la session de travail, c'est l'heure d'une pause de ${session.breakLength}min...`})
                session.type = 'break';
                pomodoro(interaction, session);
            }, session.workLength * 1000 * 60);
            break;

        case 'break':
            if(session.loop < session.length){
                session.type = 'work';
                session.loop = session.loop + 1;
                pomoTimer = setTimeout(() => {
                    interaction.channel.send({content: `> ${session.mention ? notification : ''} La pause est finie`});
                    pomodoro(interaction, session);
                }, session.breakLength * 1000 * 60);
            } else {
                pomoTimer = setTimeout(() => {
                    interaction.channel.send({content: `> ${session.mention ? notification : ''} Le pomodoro est terminé`});
                    clearTimeout(pomoTimer);
                }, session.breakLength * 1000 * 60)
                pomodoroSession.clear()
            }
            break;   
            
            default:
                // console.log('DEFAULT', pomodoroSession)
                break;
            }
        }
        
const message = {
    work: 'travail',
    break: 'pause',
}

module.exports = {
    uuid: "1455CC4AFAA94AC29FA577FB0D3F0778",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('pomodoro')
		.setDescription('Pomodoro')
        .addSubcommand(subcommand =>
            subcommand
                .setName('marche')
                .setDescription('Lancer une session de pomodoro')
                .addIntegerOption(option =>
                    option.setName('temps-session')
                        .setDescription('Durée de la session de travail')
                        .setRequired(true)
                        .setMinValue(5)
                        .setMaxValue(120)
                )
                .addIntegerOption(option =>
                    option.setName('temps-pause')
                        .setDescription('Durée de la pause')
                        .setRequired(true)
                        .setMinValue(2)
                        .setMaxValue(30)
                )
                .addBooleanOption(option =>
                    option.setName('notification')
                        .setDescription('Être mentionner à la fin du minuteur')
                )
                .addIntegerOption(option =>
                    option.setName('repetition')
                        .setDescription('Nombre de répétition')
                        .setMinValue(1)
                        .setMaxValue(10)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('arret')
                .setDescription('Arrêter une session en cours')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Status sur la session')
        )
        .setDMPermission(false),

	
    async execute(interaction) {
        const session = {
            start: new Date(),
            user: interaction.user,
            channel: interaction.channel,
            workLength: interaction.options.getInteger('temps-session'),
            breakLength: interaction.options.getInteger('temps-pause'),
            loop: 1,
            length: interaction.options.getInteger('repetition') ? interaction.options.getInteger('repetition') : 1,
            type: 'work',
            mention: interaction.options.getBoolean('notification'),
        }

        if(interaction.options.getSubcommand() == 'marche'){
            
            if(pomodoroSession.size == 1){
                const [runningSession] = pomodoroSession;
                const pomodoroType = `${runningSession.workLength}-${runningSession.breakLength}`;
                const nbLoop = runningSession.length;
                const currentLoop = runningSession.loop;
                
                const time = timeLeft(runningSession);
                const leftLoops = `(${currentLoop}/${nbLoop})`

                return interaction.reply({
                    content: `Une session de ${nbLoop} ${nbLoop>1 ? leftLoops : ''} pomodoro ${pomodoroType} en cours. Il reste ${time} minutes de ${message[runningSession.type]}`,
                    ephemeral:true
                })
            }
            
            pomodoroSession.add(session);
            await interaction.reply({content: `_Lancement de ${(session.length === 0) ? 1 : session.length} pomodoro ${session.workLength}-${session.breakLength}_`})

            pomodoro(interaction, session)            
        }

        if(interaction.options.getSubcommand() == 'arret'){
            if(pomodoroSession.size == 0) return interaction.reply({
                content: `Aucun pomodoro est en cours`,
                ephemeral: true
            });
            const [runningSession] = pomodoroSession;
            if(runningSession.user.id !== interaction.user.id) return interaction.reply({
                content: `Tu ne peux pas arrêter un pomodoro que tu n'as pas lancé`, 
                ephemeral: true
            });
            clearTimeout(pomoTimer)
            pomodoroSession.clear()
            return interaction.reply({
                content: `Le pomodoro est interrompu`,
                ephemeral: true
            })
        }

        if(interaction.options.getSubcommand() == 'status'){
            if(pomodoroSession.size == 1){
                const [runningSession] = pomodoroSession;
                const time = timeLeft(runningSession);
                return interaction.reply({
                    content: `Il reste ${time} minutes de ${message[runningSession.type]}`, 
                    ephemeral: true
                })
            } else {
                return interaction.reply({
                    content: `Aucun pomodoro est en cours`,
                    ephemeral: true,
                })
            }
        }
	},
};