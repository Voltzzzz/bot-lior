const Discord = require('discord.js')
const Guild = require("../database/schemas/Guild")
const User = require("../database/schemas/User")
const colors = require('colors');
const Client = require("../database/schemas/Client")

module.exports = class {
    constructor(client) {
        this.client = client;
        this.eventName = "messageCreate";
    }
    async run(message) {

        const server = await Guild.findOne({ idS: message.guild.id})
        if(!server) return

        try {
            if (message.author.bot === true) return;

            let data = await Guild.findOne({
                idS: message.guild.id
            })

            let user = await User.findOne({
                idU: message.author.id,
            })

            let client = await Client.findOne({
                _id: this.client.user.id,
            })

            if (!user) await User.create({ idU: message.author.id, });
            if (!client) await Client.create({ _id: this.client.user.id });

            client.comandosusados += 1 
            await client.save();
            
            const prefix = data.prefix;

            if (message.mentions.has(this.client.user) || message.content.startsWith(prefix)) {
                let args;
                let commandName;
                let command;
            
                if (message.mentions.has(this.client.user)) {
                    args = message.content.slice(`<@!${this.client.user.id}>`.length).trim().split(/ +/g);
                    commandName = args.shift().toLowerCase();
                } else if (message.content.startsWith(prefix)) {
                    args = message.content.slice(prefix.length).split(/ +/g);
            
                    if (args.includes('')) return;
                    commandName = args.shift().toLowerCase();
                }
            
                command = this.client.commands.get(commandName) || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                if (command) {
                    if (command.ownerOnly) {
                        const check = this.client.config.owners.filter(id => id == message.author.id);
                        if (check.length != 1) {
                            message.reply("Este comando apenas pode ser executado pelos desenvolvedores do bot.").then(message => { setTimeout(() => { message.delete().catch(() => { }); }, 5000) });
                            return;
                        }
                    }
                    try { command.run({ args, message, prefix }); } catch (error) { console.log(error); console.log(colors.red("[Commands] Ocorreu um erro ao executar o comando " + commandName + "."))}
                }
            }
            
        } catch (error) {
            if (error) console.error(error);
        }
    }
};