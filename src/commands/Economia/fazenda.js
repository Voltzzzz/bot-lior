const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const User = require('../../database/schemas/User');
const Guild = require('../../database/schemas/Guild')
const Client = require('../../database/schemas/Client');

module.exports = class Organizacao {
  constructor(client) {
    this.client = client;
    this.name = 'fazenda';
    this.aliases = ['quinta', 'roça'];
    this.description = 'Na sua fazenda pode fazer dinheiro, cuidar de seus animais, de suas plantações e muito mais.';
    this.usage = `<prefixo>fazenda`;
    this.category = '<:economia:1213823624402968607> Economia'

    setInterval(this.gerarEnergiaAutomaticaGlobal.bind(this), 3 * 60 * 1000);
  }

  async gerarEnergiaAutomaticaGlobal() {
    const users = await User.find({});
    users.forEach(async user => {
      if (user.coisasfazenda.energiaguardada < user.coisasfazenda.limiteenergia && user.contruções.moinho) {
        user.coisasfazenda.energiaguardada += 1;
        await user.save();
      }
    });
  }

  async run({ message, interaction, args }) {

    let database = await User.findOne({ idU: message.author.id, });
    let databaseGuild = await Guild.findOne({ idS: message.guild.id, });
    
    if (!database) { database = await User.create({ idU: message.author.id }) }

                             ////////////////////////////////// EMBEDS E ROWS FAZENDA //////////////////////////////////

    const semfazenda = new EmbedBuilder()
      .setDescription(`<:falha:1210702559535308821>・Você ainda não possuí uma fazenda, para comprar irá precisar de <:coins:1210682830711947365> **\`6000 Coins\`**.`);

    const tempodeinteraçãofalou = new EmbedBuilder()
      .setDescription(`<:aguarde:1210765489194926092>・O tempo da interação acabou, caso queira execute o comando novamente, \`${databaseGuild.prefix}fazenda\`.`)

    const fazendainicial = new EmbedBuilder()
      .setTitle(`**Fazenda de \`${message.author.tag}\`**`)
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setDescription(`Nome da Fazenda: \`${database.coisasfazenda.nomefazenda}\`\nCoins Gastos: \`${database.coisasfazenda.coinsgastosfazenda}\``)

    const rowsemfazenda = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('comprarFazenda')
        .setLabel(database.dinheirocarteira >= 6000 ? 'Comprar' : 'Sem dinheiro suficiente')
        .setStyle(database.dinheirocarteira >= 6000 ? ButtonStyle.Success : ButtonStyle.Danger)
        .setEmoji(database.dinheirocarteira >= 6000 ? '<:coins:1210682830711947365>' : '<:falha:1210702559535308821>')
        .setDisabled(database.dinheirocarteira < 6000),
    );

    const rowfazendainicial = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('irarmazém')
        .setLabel('Armazém')
        .setStyle(database.contruções.armazém ? ButtonStyle.Success : ButtonStyle.Danger)
        .setEmoji('<:armazem:1210757871776694332>')
        .setDisabled(!database.contruções.armazém),
      new ButtonBuilder()
        .setCustomId('irmoinho')
        .setLabel('Moinho')
        .setStyle(database.contruções.moinho ? ButtonStyle.Success : ButtonStyle.Danger)
        .setEmoji('<:moinho:1210951640769757246>')
        .setDisabled(!database.contruções.moinho),
      new ButtonBuilder()
        .setCustomId('irplantação')
        .setLabel('Plantações')
        .setStyle(database.contruções.plantação1 || database.contruções.plantação2 || database.contruções.plantação3 || database.contruções.plantação4 ? ButtonStyle.Success : ButtonStyle.Danger)
        .setEmoji('<:plantacao:1210950094711427122>')
        .setDisabled(!(database.contruções.plantação1 || database.contruções.plantação2 || database.contruções.plantação3 || database.contruções.plantação4)),
        new ButtonBuilder()
        .setCustomId('construir')
        .setLabel('Construções')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('<:construir:1211083675710525561>'),
        new ButtonBuilder()
        .setCustomId('gerenciarfazenda')
        .setLabel('Gerenciar Fazenda')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('<:gerenciar:1211058893032132628>')
    );

    const rowmoinho = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('efeitodecrescimento')
        .setLabel('Efeito de Crescimento')
        .setStyle(database.coisasfazenda.energiaguardada === '0' ? ButtonStyle.Danger : ButtonStyle.Success)
        .setEmoji('<:energia:1211106762145665095>')
        .setDisabled(database.coisasfazenda.energiaguardada === 0),
      new ButtonBuilder()
        .setCustomId('evoluirmoinho')
        .setLabel('Evolução de Moinho')
        .setStyle(database.coisasfazenda.podeuparmoinho ? ButtonStyle.Success : ButtonStyle.Danger)
        .setEmoji('<:energia:1211106762145665095>')
        .setDisabled(!database.cooldowns.podeuparmoinho),  
      new ButtonBuilder()
        .setCustomId('perksmoinho')
        .setLabel('Perks')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('<:energia:1211106762145665095>'),
    );

    const rowplantações = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('plantação1')
        .setLabel(database.contruções.plantação1 ? 'Campo de Plantação 1' : 'Você não tem este espaço')
        .setStyle(database.contruções.plantação1 ? ButtonStyle.Success : ButtonStyle.Danger )
        .setEmoji('<:plantacao:1210950094711427122>')
        .setDisabled(!database.contruções.plantação1),
        new ButtonBuilder()
        .setCustomId('plantação2')
        .setLabel(database.contruções.plantação2 ? 'Campo de Plantação 2' : 'Você não tem este espaço')
        .setStyle(database.contruções.plantação2 ? ButtonStyle.Success : ButtonStyle.Danger )
        .setEmoji('<:plantacao:1210950094711427122>')
        .setDisabled(!database.contruções.plantação2),
        new ButtonBuilder()
        .setCustomId('plantação3')
        .setLabel(database.contruções.plantação3 ? 'Campo de Plantação 3' : 'Você não tem este espaço')
        .setStyle(database.contruções.plantação3 ? ButtonStyle.Success : ButtonStyle.Danger )
        .setEmoji('<:plantacao:1210950094711427122>')
        .setDisabled(!database.contruções.plantação3),
        new ButtonBuilder()
        .setCustomId('plantação4')
        .setLabel(database.contruções.plantação4 ? 'Campo de Plantação 4' : 'Você não tem este espaço')
        .setStyle(database.contruções.plantação4 ? ButtonStyle.Success : ButtonStyle.Danger )
        .setEmoji('<:plantacao:1210950094711427122>')
        .setDisabled(!database.contruções.plantação4),
    );

                             ////////////////////////////////// COMPRAR FAZENDA //////////////////////////////////


      if(database.coisasfazenda.fazenda === false) {

        database.cooldowns.emUsoFazenda = true;
        await database.save();
      
        const messageResponse = await message.reply({ embeds: [semfazenda], components: [rowsemfazenda] });
        const filter = i => i.customId === 'comprarFazenda' && i.user.id === message.author.id;
        const collector = messageResponse.createMessageComponentCollector({ filter, time: 60000 });
      
        if (database.dinheirocarteira < 6000) {
          collector.stop();
          database.cooldowns.emUsoFazenda = false;
          await database.save();
          return;
        }
      
        collector.on('collect', async i => {
          if (database.dinheirocarteira >= 6000) {
            database.coisasfazenda.fazenda = true;
            database.coisasfazenda.coinsgastosfazenda += 6000;
            database.dinheirocarteira -= 6000;
            database.coisasfazenda.nomefazenda = `Fazenda de ${message.author.tag}`;
            await database.save();
      
            semfazenda.setDescription(`<:certo:1210760749102927882>・**Fazenda criada com sucesso, \`${database.coisasfazenda.nomefazenda}\`.**`);
            messageResponse.edit({ embeds: [semfazenda], components: [] });
            
            collector.stop();
          } else {
            const semDinheiro = new EmbedBuilder()
            .setDescription(`<:falha:1210702559535308821>・Você precisa de **<:coins:1210682830711947365> \`6000 Coins\`** em mão para comprar a fazenda.`);
            i.reply({ embeds: [semDinheiro], ephemeral: true });
      
            collector.stop();
          }
        });
      
        collector.on('end', async collected => {
          messageResponse.edit({ embeds: [], components: [] });
          database.cooldowns.emUsoFazenda = false;
          await database.save();
        });
        
        return;
        }

                         ////////////////////////////////// INICIO FAZENDA //////////////////////////////////

    const messageResponse = await message.reply({ embeds: [fazendainicial], components: [rowfazendainicial] });
      
    const filter = i => i.user.id === message.author.id;
    const collector = messageResponse.createMessageComponentCollector({ filter, time: 60000 });    
  
    collector.on('collect', async i => {
      if (i.customId === 'irarmazém') {

      const armazemEmbed = new EmbedBuilder()
        .setTitle(`\`${database.coisasfazenda.nomefazenda}\``)
        
      const nomeExibicao = {
        madeira: '**<:madeira:1211092529684946975> \`Madeira\`**',
        cercas: '**<:cerca:1211093337973727243> \`Cercas\`**',
        madeirarefinada: '**<:madeira:1211093112567504947> \`Madeira Refinada\`**',
      };

      const descricaoArmazem = Object.entries(database.itens)
        .filter(([nomeItem, quantidade]) => quantidade > 0 && nomeExibicao[nomeItem])
        .map(([nomeItem, quantidade]) => `**${nomeExibicao[nomeItem]}**: ${quantidade}`)
        .join('\n');

      armazemEmbed.setDescription(descricaoArmazem || '<:semstock:1211091085137547314>\`・O seu armazém está vazio.\`');

      i.update({ embeds: [armazemEmbed], components: []});

                               ////////////////////////////////// FIM BOTÃO ARMAZÉM FAZENDA //////////////////////////////////
                               ////////////////////////////////// INÍCIO BOTÃO MOINHO FAZENDA //////////////////////////////////

      } else if (i.customId === 'irmoinho') {

      const moinhoEmbed = new EmbedBuilder()
        .setTitle(`\`${database.coisasfazenda.nomefazenda}\``)
        .setDescription(`**No moinho você pode gerar **<:energia:1211106762145665095> \`Energia\`**, para comprar itens raros, buffar o tempo da sua plantação, ou até mesmo vender ela!\n\nVocê pode também evoluir o seu moinho para gerar mais energia.** \n <:energia:1211106762145665095> Energia Atual: \`${database.coisasfazenda.energiaguardada}/${database.coisasfazenda.limiteenergia}\``);
    
        i.update({ embeds: [moinhoEmbed], components: [rowmoinho] });

      } else if (i.customId === 'irplantação') {

        const plantaçõesEmbed = new EmbedBuilder()
        .setTitle(`\`${database.coisasfazenda.nomefazenda}\``)
        .setDescription(`**Aqui você pode fazer as suas plantações! Caso você não tenha materiais para as plantar ou fazer crescer você pode comprar pela cidade!**`);
    
        const plantaçãoResponse = await i.update({ embeds: [plantaçõesEmbed], components: [rowplantações] });

        const filter = i => i.user.id === message.author.id;
        const collector = plantaçãoResponse.createMessageComponentCollector({ filter, time: 60000 });    
      
        collector.on('collect', async i => {
          if (i.customId === 'plantação1') {

          }
        })

      } else if (i.customId === 'gerenciarfazenda') {

      const novaEmbed = new EmbedBuilder()
        .setTitle('Moinho')
        .setDescription('Conteúdo do seu moinho...');
    
        i.update({ embeds: [novaEmbed] });

      }
    });
    
  
    collector.on('end', async collected => {
      messageResponse.edit({ embeds: [tempodeinteraçãofalou], components: [] });
      await database.save();
    });

  }
};