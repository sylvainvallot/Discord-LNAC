const { commands, commandUsage } = require('./../models/cmdUsage.model');

function getDate(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2, '0');
    return `${year}-${month}`;
}


async function saveCommandList(command){
    //Check if command present uuid
    if(!command.uuid){
        return console.log(`[DataBase] Command ${command.name} don't have uuid. Please add one!`)
    }
    //Check if command is indexed in the database
    const cmd_is_in_db = await commands.findOne({
        uuid: command.uuid
    })
    if(cmd_is_in_db === null){
        commands.create({
            uuid: command.uuid,
            permissions: command.permissions,
            name: command.data.name,
            description: command.data.description,
        }).catch(console.error)
        return console.log(`[DataBase] Command ${command.data.name} is now indexed.`)
    }
}

async function saveCommandUsage(command){
    //Check if command present uuid
    if(!command.uuid){
        return console.log(`[DataBase] Command ${command.name} don't have uuid. Please add one!`)
    }

    //As commands are already indexed from deploy commands script during startup,
    //directly updating the command usage.
    //CHECK FOR SUBCOMMAND BEHAVIOR

    //Update global usage
    commands.updateOne(
        {uuid: command.uuid},
        {
            $inc: {usage: 1},
        }
    ).catch(console.error);

    //Update monthly usage

    //Check if command have been runned this month
    const cmd_is_in_db = await commandUsage.findOne({
        uuid: command.uuid,
        date: getDate(),
    })

    if(cmd_is_in_db === null){
        return commandUsage.create({
            uuid: command.uuid,
        }).catch(console.error)
    } else {
        return commandUsage.updateOne(
            {
                uuid: command.uuid,
                date: getDate(),
            },
            {
                $inc: {usage: 1},
            }
        )
    }
}

module.exports = {
    saveCommandList,
    saveCommandUsage,
}