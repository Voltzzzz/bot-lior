const { EmbedBuilder } = require('discord.js');const Guild = require('../../database/schemas/Guild');const Client = require('../../database/schemas/Client');module.exports = class HelpCommand {    constructor(client) {        this.client = client;        this.name = 'help';        this.aliases = ['ajuda'];        this.description = 'Mostra a lista de comandos disponíveis.';        this.category = '<:liz:1213824559602597948> Bot'    }    async run({ message, args }) {        let databaseGuild = await Guild.findOne({ idS: message.guild.id });        const databaseClient = await Client.findOne({ _id: this.client.user.id });        const prefix = databaseGuild.prefix;        const commandsByCategory = new Map();        this.client.commands.forEach(command => {            const category = command.category || 'Outros';            if (!commandsByCategory.has(category)) {                commandsByCategory.set(category, []);            }            commandsByCategory.get(category).push(command);        });        if (args && args.length > 0) {            const commandName = args[0].toLowerCase()            const command = this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName));            if (command) {                const commandUsage = command.usage ? command.usage.replace(/<prefixo>/g, prefix) : 'N/A';                const embed = new EmbedBuilder()                    .setAuthor({ name: 'Suporte ao usuário', iconURL: this.client.user.displayAvatarURL({ format: 'png', dynamic: true })})                    .setTitle(`\`${prefix}${command.name}\``)                    .setDescription(`Descrição do comando: \`${command.description}\``)                    .addFields({ name: 'Como Usar', value: `\`${commandUsage}\`` })                    .setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true }))                message.reply({ embeds: [embed] });                return;            }        }        const categoriesAndCommands = Array.from(commandsByCategory.entries()).map(([category, commands]) => {            const categoryWithCount = `${category} [${commands.length}]`;            const commandList = commands.map(cmd => `\`${cmd.name}\``).join(', ');            return { name: categoryWithCount, value: commandList };        });                let totalChannels = 0;        this.client.guilds.cache.forEach(guild => {            totalChannels += guild.channels.cache.size;        });            const embed = new EmbedBuilder()            .setAuthor({ name: 'Suporte ao usuário', iconURL: this.client.user.displayAvatarURL({ format: 'png', dynamic: true })})            .setDescription(`Olá ${message.author}! Sou a ${this.client.user} um bot simples de Economia, Moderação com objetivo de mais tarde ajudar na Defesa de seu servidor de Discord! Atualmente estou inserida em *\`${this.client.guilds.cache.size}\`* guildas com *\`${this.client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0)}\`* usuários, já tendo sido executados *\`${databaseClient.comandosusados}\`* comandos, em *\`${totalChannels}\`* canais!\n\n*Se tiver dúvida da maneira de utilização de algum comando, use **\`${databaseGuild.prefix}help [command]\`***\n\n`)            .addFields({ name: '\u200A', value: '\u200A' })            .setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true }))            .addFields(categoriesAndCommands);        message.reply({ embeds: [embed] });    }};