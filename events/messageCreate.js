require('dotenv').config()
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if(message.content.startsWith('!merci')){
            return message.channel.send('La commande `!merci` est obsolète, utilise `/merci` à la place.');
        };
        
    }
};