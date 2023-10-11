require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    uuid: "58D3758335DE47898707555E9095CD3D",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('code')
		.setDescription('Code à executer')
        .addSubcommand(subcommand =>
            subcommand
                .setName('aide')
                .setDescription('Aide pour la mise en forme du code sur Discord')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('executer')
                .setDescription('Exectuer un bloc de code')
                .addStringOption(option =>
                    option.setName('langage')
                    .setDescription('Langage')
                    .setRequired(true)
                .addChoices(
                    { name: 'Bash', value: 'bash-4' },
                    { name: 'Brainf**k', value: 'brainfuck-0' },
                    { name: 'C', value: 'c-4' },
                    { name: 'C++', value: 'cpp-5' },
                    { name: 'Fortran', value: 'fortran-4' },
                    { name: 'GO Lang', value: 'go-4' },
                    { name: 'Java', value: 'java-4' },
                    { name: 'NodeJS', value: 'nodejs-4' },
                    { name: 'Octave', value: 'octave-4' },
                    { name: 'Ocaml', value: 'ocaml-2' },
                    { name: 'Pascal', value: 'pascal-3' },
                    { name: 'Python3', value: 'python3-4' },
                    { name: 'R', value: 'r-4' }
                    ))
                .addStringOption(option =>
                    option.setName('lien-message')
                    .setDescription('Lien du message contenant le code à executer')
                    .setRequired(true)
                )
        )
        .setDMPermission(false),

	async execute(interaction) {
        if(interaction.options.getSubcommand() == 'aide'){
            const embed = new EmbedBuilder()
                .setTitle(`Mise en forme du code sur Discord`)
                .setDescription(`Il suffit d'encadrer son code par 3 apostrophes inversées (\`) [AtlGr+7] et de préciser le langage.`)
                .addFields(
                    { name:`Exemple pour du JavaScript`, value: `\`\`\`js\nfor(let i=0; i<10; i++){\nconsole.log("Hello LNAC");\n};`},
                    { name:`\`\`\``, value:"A vous d'adapter le langage à votre convenance : py, c, cpp, js, etc..." },
                    { name:`Résultat`, value:`\`\`\`js\nfor(let i=0; i<10; i++){\nconsole.log("Hello LNAC");\n};\`\`\`` },
                )
                .setColor(interaction.client.config.color.info)
		    await interaction.reply({embeds: [embed]});
        }

        if(interaction.options.getSubcommand() == 'executer'){

            await interaction.deferReply({ephemeral: false});
            const codeLanguage = interaction.options.getString('langage');
        
            const codeMessage = {
                url: interaction.options.getString('lien-message'),
                id: "",
                channel: "",
                content: "",
            }
            
            const parsedURL = codeMessage.url.split('/')
            codeMessage.id = parsedURL.pop();
            codeMessage.channel = parsedURL[parsedURL.length - 1];
            
            const channel = await interaction.guild.channels.fetch(codeMessage.channel);
            const msg = await channel.messages.fetch(codeMessage.id)
            codeMessage.content = msg.content;
            
            if(!codeMessage.content.startsWith('```')){
                return interaction.editReply({content: `Le message fourni ne contient pas de bloc de code, vérifies le message ou utilises la commande \`/code aide\` pour plus d'information.`})
            }
            
            function removeCodeBlock(msg){
                const lines = msg.trim().split('\n');
                const trimmedLines = lines.slice(1, -1);
                return trimmedLines.join('\n')
            }
            
            let data = JSON.stringify({
                "clientId": process.env.JDOODLE_CLIENT,
                "clientSecret": process.env.JDOODLE_SECRET,
                "script": removeCodeBlock(codeMessage.content),
                "language": codeLanguage.split('-')[0],
                "versionIndex": codeLanguage.split('-')[1]
            });
            
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.jdoodle.com/v1/execute',
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };
            
            const execution = await axios.request(config)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
            
            interaction.editReply({content: `\`\`\`${execution.output}\`\`\``});
        
        }
	}
};