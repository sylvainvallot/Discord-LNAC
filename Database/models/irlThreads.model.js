const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let subThreadSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    joinedAt: {
        type: Array,
        default: [],
    },
    leftAt: {
        type: Array,
        default: [],
    },
    joined: {
        type: Boolean,
        default: false,
    }
});
const subThread = mongoose.model('sub-thread', subThreadSchema);

let userIrlThreadSchema = new Schema({
    user_id: {
        type: String,
        default: "",
    },
    main: {
        type: subThreadSchema,
        default: () => ({})
    },
    secondary: {
        type: subThreadSchema,
        default: () => ({})
    },
    university: {
        type: subThreadSchema,
        default: () => ({})
    },
});
const userIrlThreads = mongoose.model('user-threads', userIrlThreadSchema)


let irlThreadsSchema = new Schema({
    name: {
        type: String,
        default: '',
    },
    messageCount: {
        type: Number,
        default: 0
    },
    memberCount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: ''
    }
})
const irlThreads = mongoose.model("irls-threads", irlThreadsSchema)

module.exports = {
    subThread,
    irlThreads,
    userIrlThreads
}