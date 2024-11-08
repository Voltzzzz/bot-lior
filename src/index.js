const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
const config = require("./config/config.json");
const { connectToDatabase } = require("./database/index.js");

class SystemClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.database = new Collection();
        this.config = config;
    }

    async start() {
        await connectToDatabase();
        this.login(this.config.token);
        this.loadCommands();
        this.loadEvents();
    }

loadCommands() {
    let startedAt = performance.now();
    let commandsCount = 0;

    const folderCategories = readdirSync(path.join(__dirname, "commands"));

    for (const Category of folderCategories) {
        const commands = readdirSync(path.join(__dirname, "commands", Category)).filter(file => file.endsWith('.js'));

        for (const File of commands) {
            try {
                const Command = new (require(path.join(__dirname, "commands", Category, File)))(this);
                this.commands.set(Command.name, Command);

                if (Command.aliases && Array.isArray(Command.aliases)) {
                    for (const alias of Command.aliases) {
                        if (Command.aliases && Array.isArray(Command.aliases)) {
                            for (const alias of Command.aliases) {
                                this.aliases.set(alias, Command.name);
                            }
                        }
                        
                    }
                }

                commandsCount++;
            } catch (error) {
                console.log(error);
                console.log(`\x1b[91m[Commands] Ocorreu um erro ao carregar o comando ${File} \x1b[0m`);
            }
        }
    }

    let finishedAt = performance.now();
    let time = (parseFloat(finishedAt - startedAt).toFixed(2)).replace(".00", "");
    console.log(`\x1b[32m✔ [Commands] Foram carregados ${commandsCount} comandos em ${time}ms\x1b[0m`);
}

    loadEvents() {
        let eventsCount = 0;
        const events = readdirSync(path.join(__dirname, "events")).filter(file => file.endsWith('.js'));

        events.forEach(async eventFile => {
            try {
                const event = new (require(path.join(__dirname, "events", eventFile)))(this);
                this.on(event.eventName, (...args) => event.run(...args));
                eventsCount++;
            } catch (error) {
                console.error(error);
                console.log(`\x1b[91m[Events] Ocorreu um erro ao carregar o evento ${eventFile} \x1b[0m`);
            }
        });

        let startedAt = performance.now();
        let finishedAt = performance.now();
        let time = (parseFloat(finishedAt - startedAt).toFixed(2)).replace(".00", "");
        console.log(`\x1b[32m✔ [Events] Foram carregados ${eventsCount} eventos em ${time}ms\x1b[0m`);
    }
}

const SystemBot = new SystemClient({
    intents: 33415,
    partials: ["CHANNEL"]
});

SystemBot.start();