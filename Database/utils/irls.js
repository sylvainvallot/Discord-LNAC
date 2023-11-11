const { getCity } = require('./user.js');
const { subThread, irlThreads, userIrlThreads } = require('./../models/irlThreads.model');

/**
 * 
 * @returns
 */
async function getAllThreads(){
    const threads = await irlThreads.find().catch(console.error);
    return threads;
}

async function createThread(threadName, threadType){
    return await irlThreads.create({
        name: threadName,
        type: threadType,
    }).catch(console.error)
}



/**
 * 
 * @param {string} threadName 
 * @param {'city' | 'university'} threadType 
 * @returns
 */
async function isThreadExist(threadName, threadType){
    const thread = await irlThreads.findOne({
        name: threadName,
        type: threadType
    }).catch(console.error)
    return thread;
}
/**
 * 
 * @param {string} threadName 
 * @param {'city' | 'university'} threadType 
 * @param {number} memberCount 
 * @param {number} messageCount 
 * @returns 
 */
async function updateThreadInfo(threadName, threadType, memberCount, messageCount){
    return await irlThreads.updateOne({
        name: threadName,
        type: threadType
    },
    {
        messageCount: memberCount,
        memberCount: memberCount,
    }).catch(console.error)
}

/**
 * 
 * @param {string} user_id 
 * @returns 
 */
async function createUser(user_id){
    return await userIrlThreads.create({
        user_id: user_id,
    }).catch(console.error)
}

async function getThreadType(user_id, threadName){
    return
}

/**
 * 
 * @param {string} user_id 
 * @param {string} threadName 
 * @param {'main' | 'secondary' | 'university'} threadType 
 * @param {'JOIN' | 'LEFT'} action 
 * @returns 
 */
async function updateUserThread(user_id, threadName, threadType, action){
    const user = await userIrlThreads.findOne({
        user_id: user_id,
    }).catch(console.error);
    
    if(!user){
        await createUser(user_id);
        return updateUserThread(user_id, threadName, threadType, action);
    }

    if (action == 'JOIN') {
        return await userIrlThreads.updateOne(
            {
                user_id: user_id,
            },
            {
                $push: {
                    [`${threadType}.joinedAt`]: new Date(),
                },
                $set: {
                    [`${threadType}.joined`]: true,
                    [`${threadType}.name`]: threadName,
                }
            }
        ).catch(console.error);
    };
    if (action == 'LEFT') {
        return await userIrlThreads.updateOne(
            {
                user_id: user_id,
            },
            {
                $push: {
                    [`${threadType}.leftAt`]: new Date(),
                },
                $set: {
                    [`${threadType}.joined`]: false,
                    [`${threadType}.name`]: '',
                }
            }
        ).catch(console.error);
    };
}

module.exports = {
    getAllThreads,
    isThreadExist,
    updateThreadInfo,
    updateUserThread
}