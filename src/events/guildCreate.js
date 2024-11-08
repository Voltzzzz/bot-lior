const Guild = require("../database/schemas/Guild");

module.exports = class {
    constructor(client) {
        this.client = client;
        this.eventName = "guildCreate";
    }

    async run(guild) {
        try {
            const existingGuild = await Guild.findOne({ idS: guild.id });

            if (!existingGuild) {
                await Guild.create({ idS: guild.id });
                console.log(`Novo servidor adicionado: ${guild.name} (${guild.id})`);
            } else {
                console.log(`O bot foi adicionado novamente ao servidor: ${guild.name} (${guild.id})`);
            }
        } catch (error) {
            console.error("Erro ao lidar com o evento guildCreate:", error);
        }
    }
};
