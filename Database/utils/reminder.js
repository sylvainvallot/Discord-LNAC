const reminder_db = require('./../models/reminder.model');
const user = require('./../models/reminder.model');

function today(){
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth()+1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`;
}

async function saveReminder(reminder){

    return reminder_db.create({
        author: reminder.author,
        date: reminder.date,
        content: reminder.content,
        message_url: reminder.message_url,
        localisation: reminder.localisation,
    }).catch(console.error)
}

async function getReminders(){
    const todayReminders = await reminder_db.find({
        date: today()
      }).catch(console.error);
    return todayReminders;
}

async function replyRemindersTask(client, reminder, content){
    const parsedURL = reminder.message_url.split('/');
    const msgID = parsedURL.pop();
    const msgChannel = parsedURL[parsedURL.length - 1];
    const dmChannel = await client.users.cache.find(u => u.id == reminder.author).fetch();
    
    if(reminder.author === reminder.localisation){
        return await dmChannel.send({content: content + '\n> ' + reminder.message_url });
    }
    const channel = await client.channels.cache.find(c => c.id == msgChannel).fetch();
    if(channel.isThread()){
        channel.join()
    }
    const msgToReply = await channel.messages.fetch(msgID).catch((err) =>  {if(err.status === '404'){console.log('NOT_FOUND')}});
    
    if(!msgToReply){
        return await dmChannel.send({content: content + '\nLe message associé est introuvable : ' + reminder.message_url });
    }
    return await msgToReply.reply({content: content});
}

async function sendRemindersTask(client, reminder){
    const content = `**:bell: Rappel de <@${reminder.author}>** \n ${reminder.content ? reminder.content : ''}`;
    let channel = await client.channels.cache.find(c => c.id == reminder.localisation);
    if(!channel){
        channel = await client.users.cache.find(u => u.id == reminder.localisation)
    }
    const channelToSend = await channel.fetch()
    
    if(!reminder.message_url){
        return await channelToSend.send({content: content});
    } else {
        return await replyRemindersTask(client, reminder, content);
    }

}

async function getUserReminder(author){
    const userReminder = await reminder_db.find({
        author: author
    }).catch(console.error);
    userReminder.sort((a, b) => new Date(a.date) - new Date(b.date));
    return userReminder;
}


async function deleteReminder(interaction, id){
    const reminderToDelete = await reminder_db.findOne({
        id: id
    })
    if(!reminderToDelete){
        return 'NOT_FOUND';
    }
    if(reminderToDelete.author !== interaction.user.id){
        return 'ACCESS_DENIED';
    }
    await reminder_db.deleteOne({
        id: id
    }).catch(console.error);
    return 'SUCCESS';
}



module.exports = {
    saveReminder,
    getReminders,
    replyRemindersTask,
    sendRemindersTask,
    getUserReminder,
    deleteReminder,
}