const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let humanID = require('human-id');

let reminderSchema = new Schema({
    id: {
        type: String,
        default: () => humanID.humanId(),
    },
    author: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    date: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        default: "", 
    },
    message_url: {
        type: String,
        default: "",
    },
    localisation: {
        type: String,
        default: "",
    }
})

module.exports = mongoose.model("reminders", reminderSchema)