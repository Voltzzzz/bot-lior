const { performance } = require('perf_hooks');

module.exports = class {
    constructor(client) {
        this.client = client;
        this.eventName = "ready";
    }

    async run() {
        try {
            this.client.user.setActivity('meus joguinhos', { type: 'STREAMING' });
            this.client.user.setStatus("online"); 
            let startedAt = performance.now();
            await new Promise(resolve => setTimeout(resolve, 2000));
            let finishedAt = performance.now();
            let time = (parseFloat(finishedAt - startedAt).toFixed(2)).replace(".00", "");
            console.log(`\x1b[38;5;75m✔ [${this.client.user.username}] Conexão com o Discord efetuada em ${time}ms\x1b[0m`);
        } catch (error) {
            console.error(error);
        }
    }
};
