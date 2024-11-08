const { EmbedBuilder } = require('discord.js');
const User = require('../../database/schemas/User');
const Client = require('../../database/schemas/Client');

function gerardaily() {
    const base = Math.random();
    const numero = 1000 + Math.pow(base, 2) * 4000;
    return Math.round(numero);
}

function formatarValorAbreviado(valor) {
    const abreviacoes = ["", "k", "M", "B", "T"];
    const magnitude = Math.floor(Math.log10(valor) / 3);
    if (magnitude >= 1) {
        const valorFormatado = (valor / Math.pow(10, magnitude * 3)).toFixed(1);
        const unidadesFormatadas = Math.floor(valor).toLocaleString().replace(/\s+/g, ',');
        return `${valorFormatado}${abreviacoes[magnitude]} (${unidadesFormatadas})`;
    } else {
        return valor.toFixed(0);
    }
}

function gerargemas() {
    const base = Math.random();
    const numero = base <= 0.9 ? Math.floor(base * 2) + 1 : Math.floor(base * 2) + 2;
    return numero;
}

module.exports = class Organizacao {
    constructor(client) {
        this.client = client;
        this.name = 'daily';
        this.aliases = ['diário', 'diario'];
        this.description = 'Aqui você ganha uma quantia de dinheiro e de gemas por dia.';
        this.usage = `<prefixo>daily`;
        this.category = '<:economia:1213823624402968607> Economia'
}

    async run({ message, interaction, args }) {
        
        let database = await User.findOne({ idU: message.author.id });
        if (!database) { database = await User.create({ idU: message.author.id }) }
        
        const embedcomandoexecutado = new EmbedBuilder()
            .setDescription('<:aguarde:1210765489194926092>・Quando está no processo de compra de alguma construção, e ou, uma fazenda não pode executar qualquer outro comando.')
    
        if(database.cooldowns.emUsoFazenda === true) return message.reply({ embeds: [embedcomandoexecutado], ephemeral: true });
        
        const tempoagora = Date.now();

        if (database.cooldowns.daily && tempoagora < database.cooldowns.daily) {
            const falhahoras = new EmbedBuilder()
                .setDescription(`<:falha:1210702559535308821>・O seu daily ainda está em cooldown, volte <t:${Math.floor(database.cooldowns.daily / 1000)}:R>.`);
            return message.reply({ embeds: [falhahoras] });
        }

        const quantiadaily = gerardaily();
        const quantiagemas = gerargemas();

        const proximoDaily = tempoagora + 24 * 60 * 60 * 1000;
        database.cooldowns.daily = proximoDaily;

        database.dinheirocarteira += quantiadaily;
        database.gemas += quantiagemas
        await database.save();

        const proximaColeta = new Date(proximoDaily);

        const embedresposta = new EmbedBuilder()
            .setDescription(`<:dailyrecompensa:1210698637034790972>・Você recebeu um total de: <:coins:1210682830711947365> **\`${formatarValorAbreviado(quantiadaily)}\` coins** e <:gemas:1210701326070321253> **\`${quantiagemas}\` gemas** hoje. Volte <t:${Math.floor(proximaColeta.getTime() / 1000)}:R>.`);

        message.reply({ embeds: [embedresposta] });

    }
};
