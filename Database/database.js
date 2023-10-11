const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

let server = process.env.MONGO_SERVER;
let database = process.env.MONGO_DATABASE;
let user = process.env.MONGO_USER;
let pass = process.env.MONGO_PASSWORD;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose
            .connect(
                `mongodb://${user}:${pass}@${server}/${database}?authSource=${database}&readPreference=primary&ssl=false`,
                {
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                }
            )
            .then(() => {
                console.log("Database connection successful");
            })
            .catch((err) => {
                console.error("Database connection error");
                console.log(err);
            });
    }
}

module.exports = new Database();
