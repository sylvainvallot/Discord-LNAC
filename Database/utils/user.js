const users_db = require('./../models/user.model');
const reminder_db = require('./../models/reminder.model');

async function saveUser(guildMember, type){
    if(type === 'JOIN'){
        return users_db.create({
            id: guildMember.user.id,
            onServer: true,
            createdAt: guildMember.user.createdAt,
            joinedAt: guildMember.joinedAt,
        }).catch(console.error)
    }
    if(type === 'LEFT'){
        return users_db.create({
            id: guildMember.user.id,
            onServer: false,
            createdAt: guildMember.user.createdAt,
            joinedAt: guildMember.joinedAt,
            leftAt: new Date(),
        }).catch(console.error)
    }
    if(type === 'REMINDER'){
        return users_db.create({
            id: guildMember.user.id,
            onServer: true,
            createdAt: guildMember.user.createdAt,
            joinedAt: guildMember.joinedAt,
            remindersCount: 1,
        }).catch(console.error)
    }
}

async function userLeft(guildMember){
    const user = await users_db.findOne({
        id: guildMember.user.id,
    })
    if(!user){
        return saveUser(guildMember, 'LEFT');
    }
    return users_db.updateOne({
        id: guildMember.user.id,   
        },
        {
            $push: {
                leftAt: new Date(),
            },
            $set: {
                onServer: false
            }
        }
    ).catch(console.error)
}

async function userJoin(guildMember){
    const user = await users_db.findOne({
        id: guildMember.user.id,
    })
    if(!user){
        return saveUser(guildMember, 'JOIN');
    }
    return users_db.updateOne({
        id: guildMember.user.id,   
        },
        {
            $push: {
                joinedAt: new Date(),
            },
            $set: {
                onServer: true
            }
        }
    ).catch(console.error)
}

async function userReminder(guildMember){
    const user = await users_db.findOne({
        id: guildMember.user.id,
    })
    if(!user){
        return saveUser(guildMember, 'REMINDER')
    }
    return users_db.updateOne({
        id: guildMember.user.id,   
        },
        {
            $inc: {
                remindersCount: 1,
            }
        }
    ).catch(console.error)
}

module.exports = {
    saveUser,
    userLeft,
    userJoin,
    userReminder,
}