const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    uuid: "B253916175414D8981597926E3C2AC66",
	permissions: "USER",
	data: new SlashCommandBuilder()
		.setName('orientation')
		.setDescription('Aide pour la mise en forme du code sur Discord'),

	async execute(interaction) {
        const embed1 = new EmbedBuilder()
            .setTitle(`Bonjour et bienvenue dans le salon orientation de LNAC`)
            .setDescription(
                `Bonjour, ceci est un message pour vous aider à mieux formuler une demande d'aide en orientation (et nous aider à vous répondre rapidement, vous comprendrez que beaucoup de questions sont très récurrentes).
             `)
            .setColor(interaction.client.config.color.info)

        const embed2 = new EmbedBuilder()
            .setColor(interaction.client.config.color.info)
            .setDescription(`
                :one: Dans un premier temps, explicitez votre venue et ce que vous cherchez. 
                e.g. _admission dans le supérieur, questions spécifiques à une formation, questions sur votre dossier, simples conseils d'orientation en période de déprime etc._

                :two: Dans un second  temps, donnez un maximum d'informations sur votre parcours académique (et professionnel si c'est pertinent), vos difficultés (pas besoin de vos notes précisément, on n'en fera pas grand chose honnêtement) ainsi que **vos attentes** à la fois envers la formation visée dans le cas où vous avez des questions sur votre futur parcours, ou même à propos d'un métier visé etc. 

                **Nous insistons beaucoup sur ce point**, car toute orientation dépend uniquement de vos attentes ainsi que de votre propre capacité à bosser! (Ne venez pas nous dire que vous voulez faire tel métier car c'est un métier "bien" ou telle école car elle est "mieux", _mieux sur quels plans? Dans quel but?_)

                :three: Dans un dernier temps, faites un pavé concis, résumez vos questions (même si on le souhaiterait, nous ne sommes pas un journal intime!), cela vous permettra à vous aussi d'y voir plus clair dans votre orientation.
                `)

        const embed3 = new EmbedBuilder()
            .setColor(interaction.client.config.color.info)
            .setTitle(`Enfin, quelques petits warnings sur ce que nous n'allons pas faire:`)
            .setDescription(`
                - Faire des recherches évidentes à votre place.
                e.g. "C'est quoi telle formation?" (_la solution est très certainement sur le site de l'établissement qui dispense la formation_)

                - Vous donner une solution miracle (_chaque problème d'orientation est très complexe voir théoriquement insolvable, alors imaginez pour nous en tant que simples personnes d'internet._)

                - Vous dire ce qui vous plaît uniquement pour vous faire plaisir (_l'orientation c'est quelque chose de sérieux, on ne met pas du miel dessus pour essayer de camoufler ce qui ne va pas, on l'affronte puis on corrige._)
                e.g. "Ma formation ne me plaît pas, en soit c'est de la faute des profs" (_vraiment?_)
                "Je suis dernier de ma classe en terminale, polytechnique possible avec de la motivation?" 

                **Avec des si on peut refaire le monde!**
                `)

		await interaction.reply({embeds: [embed1, embed2, embed3]});
	},
};