const { EmbedBuilder } = require('discord.js');
const User = require('../../database/schemas/User');
const Client = require('../../database/schemas/Client');

module.exports = class DepositarCommand {
  constructor(client) {
    this.client = client;
    this.name = 'sacar';
    this.aliases = ['levantar'];
    this.description = 'Caso queira ter o seu dinheiro em mão poderá usar este comando para o retirar do banco.';
    this.usage = `<prefixo>sacar <quantia | tudo | all>`;
    this.category = '<:economia:1213823624402968607> Economia'
  }

  async run({ message, args }) {

    let database = await User.findOne({ idU: message.author.id });
    if (!database) { database = await User.create({ idU: message.author.id }) }
    
    const embedcomandoexecutado = new EmbedBuilder()
        .setDescription('<:aguarde:1210765489194926092>・Quando está no processo de compra da alguma construção, e ou, uma fazenda não pode executar qualquer outro comando.')

    const erroquantiaEmbed = new EmbedBuilder()
        .setDescription(`<:falha:1210702559535308821>・Você tem de inserir uma quantidade válida.`)

    const quantiainexistenteEmbed = new EmbedBuilder()
        .setDescription(`<:falha:1210702559535308821>・Você não tem esse dinheiro todo no banco.`)

    const quantidadeADepositar = parseFloat(args[0]);

    const sucessoEmbed = new EmbedBuilder()
        .setDescription(`<:banco:1210685797087313951>・Você levantou <:coins:1210682830711947365> **\`${formatarValorAbreviado(quantidadeADepositar)}\` coins** para a sua carteira com sucesso.`)

    const sucessoALLEmbed = new EmbedBuilder()
        .setDescription(`<:banco:1210685797087313951>・Você levantou <:coins:1210682830711947365> **\`${formatarValorAbreviado(database.dinheirobanco)}\` coins** para a sua carteira com sucesso.`)


    if(database.cooldowns.emUsoFazenda === true) return message.reply({ embeds: [embedcomandoexecutado], ephemeral: true });

    if(args[0] === 'tudo' || args[0] === 'all') {
        database.dinheirocarteira += database.dinheirobanco;
        database.dinheirobanco -= database.dinheirobanco;
        await database.save();
        return message.reply({ embeds: [sucessoALLEmbed] });
    }

    if (!args[0] || isNaN(args[0])) {
      return message.reply({ embeds: [erroquantiaEmbed] });
    }

    if (quantidadeADepositar <= 0) {
      return message.reply({ embeds: [erroquantiaEmbed] });
    }

    if (database.dinheirobanco < quantidadeADepositar) {
        return message.reply({ embeds: [quantiainexistenteEmbed] });
    }

    database.dinheirocarteira += quantidadeADepositar;
    database.dinheirobanco -= quantidadeADepositar;
    await database.save();

    message.reply({ embeds: [sucessoEmbed] });
  }
};

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