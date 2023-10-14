const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reminder = require('./reminder.model')

let userSchema = new Schema({
    id: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: "",
    },
    onServer: {
        type: Boolean,
    },
    joinedAt: {
        type: Array,
        default: [],
    },
    leftAt: {
        type: Array,
        default: [],
    },
    remindersCount: {
        type: Number,
        default: 0,
    },
    birthday: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "", 
    },
    country: {
        type: String,
        default: "",
    }
})

module.exports = mongoose.model("users", userSchema)