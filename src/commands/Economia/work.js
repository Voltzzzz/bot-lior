const { EmbedBuilder } = require('discord.js');
const User = require('../../database/schemas/User');
const Client = require('../../database/schemas/Client');

module.exports = class WorkCommand {
  constructor(client) {
    this.client = client;
    this.name = 'work';
    this.aliases = ['trampo', 'trabalhar'];
    this.description = 'Você poderá trabalhar para ganhar dinheiro.';
    this.usage = `<prefixo>work`;
    this.category = '<:economia:1213823624402968607> Economia'
  }

  async run({ message, interaction, args }) {

    let database = await User.findOne({ idU: message.author.id });
    if (!database) { database = await User.create({ idU: message.author.id }); }

    const embedcomandoexecutado = new EmbedBuilder()
    .setDescription('<:aguarde:1210765489194926092>・Quando está no processo de compra da alguma construção, e ou, uma fazenda não pode executar qualquer outro comando.')

    if(database.cooldowns.emUsoFazenda === true) return message.reply({ embeds: [embedcomandoexecutado], ephemeral: true });
    
    const tempoagora = Date.now();
    const ganhos = calcularGanhos(database.levels.levelemprego) * database.levels.multiplicadoremprego;
    const proximotrabalho = tempoagora + 2 * 60 * 60 * 1000;

    if (database.cooldowns.emprego && tempoagora < database.cooldowns.emprego) {
        const embed = new EmbedBuilder()
        .setDescription(`<:falha:1210702559535308821>・Você já trabalhou recentemente, pode trabalhar novamente <t:${Math.floor(database.cooldowns.emprego / 1000)}:R>.`);
      return message.reply({ embeds: [embed] });
    }

    const xpGained = Math.floor(Math.random() * 11) + 5;
    database.levels.experienciaemprego += xpGained;

    if(database.levels.experienciaemprego >= database.levels.experiencianecessaria && database.levels.levelemprego < 10) {
        database.levels.levelemprego++;
        database.levels.experienciaemprego -= database.levels.experiencianecessaria;
        database.levels.multiplicadoremprego += 0.2;
        database.levels.experiencianecessaria += 25;
        await database.save();
      }
      
    database.dinheirocarteira += ganhos;
    database.cooldowns.emprego = proximotrabalho;
    await database.save();

    const experienciaquefalta = database.levels.experiencianecessaria - database.levels.experienciaemprego
    const embedtrabalhou = new EmbedBuilder()
      .setDescription(`<:trabalhar:1210972227391193149>・Você **trabalhou** como ${getNomeEmprego(database.levels.levelemprego)} e conseguiu um total de <:coins:1210682830711947365> **\`${formatarValorAbreviado(ganhos)}\` coins** e <:xp:1210979212744196189> **\`${xpGained}\` de experiência**, você necessita de mais <:xp:1210979212744196189> **\`${experienciaquefalta}\` de experiência** para evoluir o seu emprego, ao todo você tem <:xp:1210979212744196189> **\`${database.levels.experienciaemprego}\` de experiência**.`)
    const embedtrabalhoulevelfinal = new EmbedBuilder()
      .setDescription(`<:trabalhar:1210972227391193149>・Você **trabalhou** como ${getNomeEmprego(database.levels.levelemprego)} e conseguiu um total de <:coins:1210682830711947365> **\`${formatarValorAbreviado(ganhos)}\` coins**, você já tem o emprego evoluido no máximo!`)
    
      if (database.levels.levelemprego === 10) {
        message.reply({ embeds: [embedtrabalhoulevelfinal] });
    } else {
        message.reply({ embeds: [embedtrabalhou] });
    }
    

    }
};

function calcularGanhos(nivelEmprego) {
  const ganhosBase = [
    800, // Gari
    1200, // Frentista
    1600, // Recepcionista
    2000, // Repositor de Mercadorias
    2400, // Motorista de Caminhão
    2800, // Técnico de Enfermagem
    3200, // Auxiliar de escritório
    3600, // Engenheiro
    4000, // Desenvolvedor de back-end
    5000  // Especialista em cibersegurança
  ];

  const ganhosEmpregoAtual = ganhosBase[nivelEmprego - 1];
  const ganhos = Math.floor(ganhosEmpregoAtual);
  return ganhos;
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

function getNomeEmprego(nivelEmprego) {
  const nomesEmpregos = [
    '**<:lixeiro:1210976560257958030> \`Gari\`**',
    '**<:frentista:1210976927607816192> \`Frentista\`**',
    '**<:recepcionista:1210977152686760026> \`Recepcionista\`**',
    '**<:repositor:1210977329451503626> \`Repositor de Mercadorias\`**',
    '**<:motorista:1210977535916249089> \`Motorista de Caminhão\`**',
    '**<:tecnico:1210977754380767282> \`Técnico de Enfermagem\`**',
    '**<:assistente:1210977908550803518> \`Auxiliar de escritório\`**',
    '**<:engenheiro:1210978053782634597> \`Engenheiro\`**',
    '**<:desenvolvedor:1210978235676885043> \`Desenvolvedor de back-end\`**',
    '**<:cyber:1210978401960202280> \`Especialista em cibersegurança\`**'
  ];

  return nomesEmpregos[nivelEmprego - 1] || '**<:erro:SEU_ID_DE_ERRO> \`Emprego Inválido\`**';
}