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

function checkBirthday(string){
    //FORMAT ASKED DD/MM or DD/MM/YYYY
    if(string.includes('/')){
        const array = string.split('/');
        if(array.length < 1) return [false, 'FORMAT'];
        if(array.length > 3) return [false, 'FORMAT'];
        if(array.length === 3){
            if(array[2].length !== 4) return [false, 'INVALID_YEAR'];
            if(parseInt(array[2]) < 1900) return [false, 'INVALID_YEAR'];
        }
        if(parseInt(array[0]) > 31 || parseInt(array[0]) <= 0) return [false, 'INVALID_DAY'];
        if(parseInt(array[1]) > 13 || parseInt(array[1]) <= 0) return [false, 'INVALID_MONTH'];

        return [true, 'GOOD', array[0], array[1], array[2]];
    } else {
        return [false, 'FORMAT'];
    }
}

async function saveBirthday(guildMember, birthday){
    if(birthday[2] === undefined){
        birthday[2] = "0000";
    }
    const birthdayToSave = birthday.join('/');
    
    const user = await users_db.findOne({
        id: guildMember.user.id,
    })
    if(!user){
        await saveUser(guildMember, 'JOIN');
        return saveBirthday(guildMember, birthday);
    }
    return users_db.updateOne({
        id: guildMember.user.id,   
        },
        {
            birthday: birthdayToSave
        }
    ).catch(console.error)
}

async function saveCity(guildMember, city){
    const user = await users_db.findOne({
        id: guildMember.user.id,
    }) 
    if(!user){
        await saveUser(guildMember, 'JOIN');
        return saveCity(guildMember, city);
    }
    return users_db.updateOne({
        id: guildMember.user.id,   
        },
        {
            city: city.name,
            country: city.countryName,
        }
    ).catch(console.error);
}

async function getCity(guildMember){
    const user = await users_db.findOne({
        id: guildMember.user.id,
    }).catch(console.error) 
    return user.city;
}

async function getUser(guildMember){
    const user = await users_db.findOne({
        id: guildMember.user.id,
    }).catch(console.error);
    if(!user){
        await saveUser(guildMember, 'JOIN');
        return getUser(guildMember);
    }
    return user;
}

async function deleteProfile(guildMember){
    const user = await users_db.findOne({
        id: guildMember.user.id,
    }).catch(console.error);
    if(!user){
        return await saveUser(guildMember, 'JOIN');
    }
    return users_db.updateOne({
        id: guildMember.user.id,   
        },
        {
            birthday: "",
            city: "",
            country: "",
        }
    ).catch(console.error)

}

function today(){
	const now = new Date();
	const month = String(now.getMonth()+1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0')
	return `${day}/${month}/`;
}

async function sendHappyBirthday(client){
    const channel = await client.channels.cache.find(c => c.id === process.env.CHAN_ID_HOME).fetch();
    const todayBirthday = await users_db.find({
        birthday: { $regex: new RegExp(today(), 'i') }
    }).catch(console.error)
    if(todayBirthday.length === 0) return 0;
    let userList = [];
    for (const member of todayBirthday) {
        userList.push(`<@${member.id}>`)
    }
    let message = '## :birthday: Joyeux Anniversaire à '
    if(userList.length === 1){
         message = message + userList[0] + " :champagne:";
    } else if(userList.length < 3 && userList.length > 1){
        message = message + userList[0] + " et à " + userList[1] + " :champagne:";
    } else if (userList.length > 2){
        const lastButNotLeast = userList[userList.length-1];
        userList.pop()
        message = message + userList.join(', à ') + " et à " + lastButNotLeast + " :champagne:";
    } 
    await channel.send({content: message});
    return todayBirthday.length;
}

module.exports = {
    saveUser,
    userLeft,
    userJoin,
    userReminder,
    checkBirthday,
    saveBirthday,
    saveCity,
    getUser,
    deleteProfile,
    sendHappyBirthday,
    getCity,
}