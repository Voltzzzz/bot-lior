const { EmbedBuilder } = require('discord.js');
const User = require('../../database/schemas/User');
const Client = require('../../database/schemas/Client');

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

module.exports = class Organizacao {
  constructor(client) {
    this.client = client;
    this.name = 'money';
    this.aliases = ["carteira", "banco", "dinheiro", "balance", "bal"];
    this.description = 'Aqui você poderá ver sua economia.';
    this.usage = `<prefixo>money <user>`;
    this.category = '<:economia:1213823624402968607> Economia'
  }

  async run({ message, interaction, args }) {
    let database = await User.findOne({ idU: message.author.id, });
    if (!database) { database = await User.create({ idU: message.author.id }) }

    const embedcomandoexecutado = new EmbedBuilder()
    .setDescription('<:aguarde:1210765489194926092>・Quando está no processo de compra da alguma construção, e ou, uma fazenda não pode executar qualquer outro comando.')

    if(database.cooldowns.emUsoFazenda === true) return message.reply({ embeds: [embedcomandoexecutado], ephemeral: true });

    const dinheirocarteira = database.dinheirocarteira;
    const dinheirobanco = database.dinheirobanco;
    const gemasguardadas = database.gemas;

    const embedresposta = new EmbedBuilder()
      .setTitle(`**Dinheiro de \`${message.author.tag}\`**`)
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .addFields(
        {name: '<:coins:1210682830711947365> **Coins em mão**', value: `\`${formatarValorAbreviado(dinheirocarteira)}\``, inline: false}, 
        {name: '<:banco:1210685797087313951> **Coins no banco**', value:`\`${formatarValorAbreviado(dinheirobanco)}\``, inline: false},
        {name: '<:gemas:1210701326070321253> **Gemas**', value: `\`${gemasguardadas}\``, inline: false})

    message.reply({ embeds: [embedresposta] });
  }
};
