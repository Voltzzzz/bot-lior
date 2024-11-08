const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
    idS: String,
    prefix: { type: String, default: "l!" },
    welcome: {
        status: { type: Boolean, default: false },
        channel: { type: String, default: "null" },
        msg: { type: String, default: "null" },
      },
})

module.exports = mongoose.model('Guilds', guildSchema);