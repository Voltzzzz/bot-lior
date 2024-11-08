const { connect } = require("mongoose");
const config = require("../config/config.json");

const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

module.exports = {
    async connectToDatabase() {
        try {
            let startedAt = performance.now();
            await connect(config.connect_string, { useUnifiedTopology: true });
            let finishedAt = performance.now();
            let time = (parseFloat(finishedAt - startedAt).toFixed(2)).replace(".00", "");
            console.log(`\x1b[36m[Database] Conexão com a database efetuada em ${time}ms \x1b[0m`);
        } catch (error) {
            console.log(`\x1b[91m[Database] Ocorreu um erro ao conectar-se com a database: ${error.message} \x1b[0m`);
        }
    }
}