const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  idU: { type: String },
  dinheirobanco: { type: Number, default: 0 },
  dinheirocarteira: { type: Number, default: 0 },
  gemas: { type: Number, default: 0 },
  coisasfazenda: {
    fazenda: {type: Boolean, default: false},
    podeuparmoinho: {type: Boolean, default: false},
    nomefazenda: { type: String },
    coinsgastosfazenda: { type: Number, default: 0 },
    energiaguardada: { type: Number, default: 0 },
    limiteenergia: { type: Number, default: 50 },
  },
  levels: {
    experienciaemprego: { type: Number, default: 0 },
    multiplicadoremprego: { type: Number, default: 1.2 },
    levelemprego: { type: Number, default: 1 },
    experiencianecessaria: { type: Number, default: 50 },
  },
  cooldowns: {
    daily: { type: Number, default: 0 },
    emprego: { type: Number, default: 0 },
    emUsoFazenda: {type: Boolean, default: false},
    gerarenergia: { type: Number, default: 0 },
  },
  contruções: {
    armazém: {type: Boolean, default: false},
    moinho: {type: Boolean, default: false},
    plantação1: {type: Boolean, default: false},
    plantação2: {type: Boolean, default: false},
    plantação3: {type: Boolean, default: false},
    plantação4: {type: Boolean, default: false},
  },
  npcs: {
    carpinteiro: {type: Boolean, default: false},
    lenhador: {type: Boolean, default: false},
    cdcarpinteiro: { type: Number, default: 0 },
    cdlenhador: { type: Number, default: 0 },
  },
  itens: {
    madeira: {type: Number, default: 0},
    cercas: {type: Number, default: 0},
    madeirarefinada: {type: Number, default: 0},
  },
});
const User = mongoose.model("Users", userSchema);
module.exports = User;