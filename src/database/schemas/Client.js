const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let clientSchema = new Schema({
  _id: { type: String },
  manutenção: { type: Boolean, default: false },
  reason: { type: String },
  comandosusados: { type: Number, default: 0},
  blacklist: { type: Array, default: [] },
});

let Client = mongoose.model("Client", clientSchema);
module.exports = Client;