const Client = require("./src/index")
module.exports = Client;

process
  .on("uncaughtException", (err) => console.log(err))
  .on("unhandledRejection", (err) => console.log(err));