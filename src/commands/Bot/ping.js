const { EmbedBuilder } = require('discord.js');
const Client = require('../../database/schemas/Client');

module.exports = class PingCommand {
    constructor(client) {
        this.client = client;
        this.name = 'ping';
        this.description = 'Verifica o ping do bot.';
        this.usage = '<prefixo>ping';
        this.category = '<:liz:1213824559602597948> Bot'
    }

    async run({ message }) {

        const pingMessage = await message.reply('<:pong:1213522571975196724> **Pong**');
        const latency = pingMessage.createdTimestamp - message.createdTimestamp;

        pingMessage.edit({ content: `<:ping:1213520155473084497> **Latência do Bot**: \`${latency}ms\`\n:zap: **Latência da API**: \`${this.client.ws.ping}ms\``});
    }
};
