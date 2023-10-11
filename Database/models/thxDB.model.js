const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let thxDb = new Schema({
    user_id: {
        type: String,
        default: "",
    },
    thx_point_received: {
        type: Number,
        default: 0,
    },
    thx_point_given: {
        type: Number,
        default: 0,
    },
    thx_given: {
        type: Array,
        default: []
    },
    thx_received: {
        type: Array,
        default: []
    }

});

module.exports = mongoose.model("thxDb", thxDb)
