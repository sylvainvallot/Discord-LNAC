require("dotenv").config();
const { EmbedBuilder } = require('discord.js');
const  Geonames = require('geonames.js');
const { checkBirthday, saveBirthday, saveCity } = require('./../../Database/utils/user.js');

module.exports = {
    async execute(interaction) {
        if (interaction.customId.split('-')[0] === 'ticket') {
            const ticketType = interaction.customId.split('-')[1]
            await interaction.reply({ content: 'Ton ticket a bien été reçu ! On pourra te contacter si nous avons besoin de plus d\'informations. Merci de surveiller tes messages directs.', ephemeral:true });
            const ticketTitle = interaction.fields.getTextInputValue('ticket-title')
            const ticketContent = interaction.fields.getTextInputValue('ticket-content')
            const ticketAuhtor = interaction.user.id
            
            const ticket = {
                type: ticketType,
                title: ticketTitle,
                content: ticketContent,
                author: ticketAuhtor
            } 
            
            async function sendTicket(ticketObj){
                const thread = interaction.guild.channels.cache.find(x => x.name === `ticket-${ticketObj.type}`);
                await thread.setArchived(false);
                if (thread.joinable) await thread.join();
                thread.send({content: `**NEW ${ticketObj.type.toUpperCase()}** from <@${ticketObj.author}>`})
                thread.send({content: `**${ticketObj.title}**`})
                thread.send({content: ticketObj.content})
            }
            
            return sendTicket(ticket);
            
        }
        if(interaction.customId === 'birthday-modal'){
            const birthdayInput = interaction.fields.getTextInputValue('birthdayInput');
            const [check, checkMessage, ...birthday] = checkBirthday(birthdayInput);
            
            if(!check){
                let errorMsg;
                switch (checkMessage) {
                    case 'FORMAT':
                        errorMsg = 'Format invalide, vérifie bien que tu as renseigné ta date au format JJ/MM ou JJ/MM/AAAA';
                        break;
                        case 'INVALID_YEAR':
                            errorMsg = 'Format invalide, vérifie bien que tu as renseigné l\'année au format AAAA';
                    break;
                    case 'INVALID_MONTH':
                        errorMsg = 'Format invalide, vérifie que tu as renseigné un bon numéro de mois au format MM, entre 1 et 12';
                        break;
                        case 'INVALID_DAY':
                            errorMsg = 'Format invalide, vérifie que tu as renseigné un bon numéro de jour au format DD, entre 1 et 31';
                            break;
                            default:
                                errorMsg = 'Format invalide, vérifie bien que tu as renseigné ta date au format JJ/MM ou JJ/MM/AAAA';
                                break;
                            }
                            return await interaction.reply({content: errorMsg, ephemeral: true})
                        }
                        const birthdayOutput = birthday.filter(i => i).join('/');
                        saveBirthday(interaction.member, birthday);
                        return await interaction.reply({content: `Ton anniveraire le ${birthdayOutput} a bien été enregistré`, ephemeral: true})
        }
        if(interaction.customId === 'city-modal'){
            const geonames = Geonames({
                username: process.env.GEONAME,
                lan: 'fr',
                encoding: 'JSON',
            });
            const cityInput = interaction.fields.getTextInputValue('cityInput');
            const city = await geonames.search({q: cityInput}).then(res => {return res.geonames[0]});
            saveCity(interaction.member, city);
            return await interaction.reply({content: `La ville de ton profil a été définie sur **${city.name}, ${city.countryName}**.\nPour la modifier, refait la même commande \`/profile reglage ville\`.\nPour supprimer la ville de ton profil, utilise la commande \`/profil supprimer ville\``, ephemeral: true});
        }
    }
}
