require("dotenv").config();
const { EmbedBuilder } = require('discord.js');

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

            sendTicket(ticket);

            // switch (ticketType) {
            //     case 'report':
            //         sendTicket(ticket)
            //         break;
            
            //     case 'bug':
            //         sendTicket(ticket)
            //         break;

            //     case 'suggestion':
            //         sendTicket(ticket)
            //     default:
            //         break;
            // }
            
            // if (thread.joinable) await thread.join();
            // thread.send({content: 'TICKET RECEIVED'})

        }
    }


}
