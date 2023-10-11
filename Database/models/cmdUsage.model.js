const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commandsSchema = new Schema({
    uuid: {
        type: String,
        default: "",
    },
    permissions: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    usage: {
        type: Number,
        default: 0,
    },
});
const commands = mongoose.model("commands", commandsSchema);

let commandUsageSchema = new Schema({
    uuid: {
        type: String,
        default: "",
    },
    date: {
        type: String,
        default: () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() +1 ).padStart(2, '0');
            return `${year}-${month}`;
          }
    },
    usage: {
        type: Number,
        default: 1,
    },
});
const commandUsage = mongoose.model("commandUsage", commandUsageSchema);

module.exports = {
    commands,
    commandUsage,
}