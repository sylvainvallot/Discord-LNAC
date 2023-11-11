const { Events } = require('discord.js');
const { updateUserThread } = require('./../Database/utils/irls.js');

module.exports = {
	name: Events.ThreadMembersUpdate,
	async execute(addedMembers, removedMembers, thread) {
        console.log(addedMembers.size, removedMembers.size, thread.name)
        const threadName = thread.name;

        
        if(addedMembers.size === 1){
            const threadMember = addedMembers.first();
            const user_id = threadMember.member.user.id;            
            // updateUserThread(user_id, threadName, 'ADDED');
            return console.log('ADD');
        }
        
        if(removedMembers.size === 1){
            const threadMember = removedMembers.first();
            const user_id = threadMember.member.user.id;            
            // updateUserThread(user_id, threadName, 'REMOVED');
            return console.log('REMOVED');
        }
        },
};