/**
 * História viva: os prompts que o jogador leva a uma IA de fora. Funções
 * puras, sem DOM. Cada prompt é completo sozinho (regras, formato, o que já
 * aconteceu), para funcionar em qualquer IA e em conversa nova.
 *
 * As regras de escrita são as de FORMATO.md, ditas para a IA e em JSON.
 */
import * as R from '../regras.js';
import { MESA, chanceDeSucesso } from '../jogo.js';
import { PAISAGENS_DISPONIVEIS } from '../cenario.js';
import { FORMATO_HISTORIA, FORMATO_SEQUENCIA, CENAS_POR_ATO, ITENS_INICIAIS, TEXTOS_OBRIGATORIOS } from './historia.js';

const IDIOMAS = { pt: 'português do Brasil', en: 'inglês' };

/** O que cada paisagem desenha, para a IA escolher a que combina com o ato. */
const PAISAGENS = {
  vila: 'aldeia de dia, casas com luz na janela',
  vale: 'colinas e estrada, de dia',
  mata: 'floresta antiga ao entardecer',
  cimo: 'montanha, noite e neve',
  farol: 'torre de farol no alto, noite fechada',
  oratorio: 'interior escuro com uma luz pequena',
  vilanova: 'rua de vila à noite, lampiões',
  margem: 'margem de lago seco, neblina',
  afogada: 'ruínas saindo da lama',
  torre: 'torre de igreja contra o céu escuro',
  anel: 'corredor curvo de estação espacial',
  docas: 'hangar e docas de estação espacial',
  eixo: 'túnel central de estação, gravidade zero',
  nucleo: 'sala de máquinas no vazio',
};

/** A cena de exemplo que vai no guia. Um teste garante que ela passa no validador. */
export const EXEMPLO = {
  itens: {
    corda: { nome: 'Corda de Sisal', mod: 1, tipo: 'objeto', tags: ['corda'] },
    cha: { nome: 'Chá de Erva-Cidreira', tipo: 'consumivel', cura: { sanidade: '1d6' } },
  },
  companheiros: {
    tila: { nome: 'Tila', quem: 'pastora de nove anos, olhos de gavião', niveis: { destreza: 2, percepcao: 2 } },
  },
  inimigos: {
    lobo: { nome: 'Lobo magro', ataque: 2, defesa: 1, vida: 4, arma: 0, armadura: 0, resistencia: 0, reflexo: 2, vontade: 1, fe: 0 },
  },
  cena: {
    id: 'ato1-ponte',
    ato: 1,
    titulo: 'A ponte do pedágio',
    texto: 'A ponte de corda balança sobre o rio cheio, e do outro lado uma menina grita que as ovelhas dela ficaram presas na ilhota. Um lobo magro ronda a margem de lá, sem pressa. O pedágio está vazio: o cobrador fugiu e deixou a cancela trancada.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Arrebentar a cancela',
        teste: { chave: 'forca', dificuldade: 7 },
        ajuda: ['corda'],
        ajudantes: [{ nome: 'a menina', nivel: 1 }],
        sucesso: { texto: 'A cancela cede com um estalo e você atravessa a tempo de espantar o lobo aos gritos. A menina conta as ovelhas duas vezes, sem acreditar.', cronica: '{nome} arrebentou a cancela do pedágio e salvou as ovelhas de Tila.', efeitos: { lacos: 1, companheiro: 'tila' } },
        falha: { texto: 'A cancela aguenta e o seu ombro não. Quando você enfim passa por cima, o lobo já levou uma ovelha para o mato.', cronica: '{nome} machucou o ombro na cancela e chegou tarde para uma das ovelhas.', efeitos: { vida: -2 } },
      },
      {
        id: 'percepcao',
        rotulo: 'Achar o vau raso',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: { texto: 'A água faz espuma onde as pedras estão perto. Você atravessa com o rio pelos joelhos e sai do outro lado antes de o lobo decidir.', cronica: '{nome} leu o rio e atravessou pelo vau.', efeitos: { lacos: 1, marca: 'vau' } },
        falha: { texto: 'O vau que você escolheu não era vau. O rio leva você vinte passos abaixo e devolve sem as botas.', cronica: '{nome} atravessou o rio a nado e perdeu as botas.', efeitos: { vida: -1, brasa: -1 } },
      },
      {
        id: 'presenca',
        rotulo: 'Gritar com o lobo',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: { texto: 'Você grita do alto da cancela com tudo o que tem. O lobo olha, pesa, e resolve que hoje não. Some no capim.', cronica: '{nome} espantou um lobo no grito, de cima de uma cancela.', efeitos: { lacos: 1 } },
        falha: { texto: 'O lobo não se impressiona. A menina, sim: ela ri, nervosa, e o riso dela é a última coisa boa da tarde.', cronica: '{nome} gritou com um lobo, que não deu ouvidos.', efeitos: { sanidade: -1 } },
      },
      {
        id: 'lutar',
        rotulo: 'Enfrentar o lobo',
        combate: 'lobo',
        vitoria: { texto: 'O lobo recua mancando e não volta. Você fica com as mãos tremendo e a manga rasgada.', cronica: '{nome} enfrentou o lobo da ponte e ficou de pé.', efeitos: { lacos: 1 } },
        derrota: { texto: 'O lobo é mais rápido. Você acorda com a menina jogando água no seu rosto e duas ovelhas a menos.', cronica: '{nome} caiu diante do lobo da ponte.' },
        fuga: { texto: 'Você recua para a ponte e o lobo não segue. Ele já tem o que queria.', cronica: '{nome} deixou a ilhota para o lobo.' },
      },
      {
        id: 'medicina',
        rotulo: 'Tratar a ovelha ferida',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        sucesso: { texto: 'Você estanca o corte com um pano e mel. A ovelha levanta, tonta, e a menina olha para você como quem viu milagre.', cronica: '{nome} costurou uma ovelha à beira do rio.', efeitos: { lacos: 1, marco: true } },
        falha: { texto: 'O corte é fundo demais. Você faz o que dá, e não dá.', cronica: '{nome} tentou salvar uma ovelha e não conseguiu.', efeitos: { sanidade: -1 } },
      },
      {
        id: 'esperar',
        rotulo: 'Esperar o rio baixar',
        livre: true,
        resultado: { texto: 'O rio baixa de madrugada. Você atravessa seco, e do outro lado já não há ovelha nem menina.', cronica: '{nome} esperou o rio baixar e chegou tarde.', efeitos: { brasa: -2 } },
      },
    ],
  },
};

const j = (x) => JSON.stringify(x, null, 1);

/** A Dificuldade que dá a chance mais próxima de `alvo` para quem rola `dados`. */
export function dificuldadePara(dados, alvo) {
  let melhor = 2;
  for (let d = 2; d <= 25; d++) if (Math.abs(chanceDeSucesso(dados, d) - alvo) < Math.abs(chanceDeSucesso(dados, melhor) - alvo)) melhor = d;
  return melhor;
}

/** Três degraus de aperto: a IA escolhe a Dificuldade pelos dados que o personagem rola, não por uma faixa fixa. */
export const DEGRAUS = { folgado: 0.85, justo: 0.65, apertado: 0.4 };

function tabelaDeDificuldade() {
  const linhas = [1, 2, 3, 4, 5, 6].map((n) => `| ${n} | ${dificuldadePara(n, DEGRAUS.folgado)} | ${dificuldadePara(n, DEGRAUS.justo)} | ${dificuldadePara(n, DEGRAUS.apertado)} |`);
  return ['| Dados que ele rola | Folgado (85%) | Justo (65%) | Apertado (40%) |', '|---|---|---|---|', ...linhas].join('\n');
}
const chaves = (tabela) => Object.keys(tabela).join(' ');

/** As regras de escrita, iguais em todos os prompts. */
export function guia() {
  return `## Como o jogo funciona

O Duplo Seis é uma sessão de RPG de mesa para um jogador só, sobre o Sistema Clip. Você é o Mestre: escreve as cenas. O jogo mostra uma cena, o jogador escolhe uma abordagem e os dados decidem. Físico, mental e social valem igual: combate nunca é a única saída nem a melhor, e ninguém ganha nada por matar.

A história tem uma abertura, três atos de ${CENAS_POR_ATO} cenas e um final. As cenas de um ato são jogadas na ordem em que você escrever, então uma pode partir da anterior. Entre os atos há uma pausa, e é nela que o jogador volta a você com o que aconteceu.

O personagem leva um relógio (uma chama, um tanque de ar, o que couber na história) que vai de ${MESA.brasa} a 0. Cada pausa entre atos gasta ${-MESA.noite.brasa}, e o resto quem gasta são as cenas que você escrever: falhas, desvios, esperas. Com o relógio em 0 os bons finais se fecham, então ele precisa apertar sem ser sentença: ponha \`brasa: -1\` em uma de cada três falhas, mais ou menos. No jogo esse efeito se chama sempre \`brasa\`, seja o que for na ficção.

## Uma cena

Toda cena tem **três abordagens abertas** (sem \`requer\`), uma por Caminho: uma do Corpo, uma da Mente, uma do Espírito. Cada uma testa um Atributo ou, com parcimônia, um Aprimoramento. Uma das três pode ser combate ou livre em vez de teste. Varie os Atributos entre as cenas.

Além delas, **0 a 2 especiais** com \`requer\`, que só aparecem para quem tem aquilo. É onde o passado do personagem e as escolhas anteriores brilham: devem ser claramente melhores (dificuldade menor, ganho maior). Melhor não é garantido: no máximo uma especial **livre** (sem dados) por ato; as outras são testes fáceis, que ainda podem falhar.

Chaves de teste:
- Atributos: ${Object.entries(R.CAMINHOS).map(([c, v]) => `${v.atributos.join(' ')} (${c})`).join(' / ')}
- Aprimoramentos: ${chaves(R.APRIMORAMENTOS)}
- Perícias (só em especiais, sempre com \`requer.nivel\` na mesma perícia): ${chaves(R.PERICIAS)}

Uma abordagem é exatamente um destes três tipos:
- **teste**: \`teste: { chave, dificuldade }\`, com \`sucesso\` e \`falha\` (e, se quiser, \`critico\` e \`desastre\`, que trocam o desfecho num duplo seis ou num duplo um). \`ajuda\` lista tags de itens que somam dados; \`ajudantes\` é gente da cena que une forças.
- **combate**: \`combate: "idDoInimigo"\`, com \`vitoria\`, \`derrota\` e \`fuga\`.
- **livre** (sem dados): \`livre: true\`, com \`resultado\`. Sempre tem um preço claro. \`custo: { magia: -1 }\` cobra antes.

O personagem rola 1D6 por nível na chave testada, contra a Dificuldade; com nível 0 rola 1D6-2 e quase nunca passa de 3. Cada item de \`ajuda\` que ele tenha soma o \`mod\` em dados, e cada ajudante ou companheiro soma o nível. Use \`ajuda\` e \`ajudantes\` sempre que fizer sentido, e conte esses dados.

**A Dificuldade se escolhe pelos dados que este personagem rola**, não por uma faixa fixa. Some os dados dele naquela chave (nível, mais a ajuda que a abordagem oferece e ele tem) e leia a tabela:

${tabelaDeDificuldade()}

- Aberta do Caminho forte dele (2 dados ou mais): **justo** no ato 1, entre justo e apertado no ato 2, **apertado** no ato 3 e no final.
- Aberta em que ele rola 0 ou 1 dado: Dificuldade de 4 a 6. Já é um aperto; não precisa de mais.
- Especial (com \`requer\`): **folgado**, um degrau mais fácil que a aberta. Nunca certeza.
- Perícia mágica (ele gasta Pontos de Magia e rola 1 dado por ponto, até o nível da perícia): folgado para esse número de dados.

A medida de uma boa mesa: jogando bem, ele acerta umas três em cada quatro. Se ele acerta tudo, não há história; se erra quase tudo, não há jogo.

\`requer\` de uma abordagem aceita: \`nivel: { chave: n }\`, \`antecedente\` (aliado inimigo boaFama maFama recursos semRecursos), \`item: "id"\`, \`companheiro: "id"\`, \`marca: "palavra"\`, \`semMarca: "palavra"\`, \`lacos: n\`. Item, companheiro e marca aceitam também uma lista (todos têm de valer). A cena em si não leva \`requer\`.

Combate é caro e arriscado de propósito: quem não é do Corpo tem 5 de Vida e ataque 0. Inimigo fraco: ataque 1, defesa 1, vida 3. Médio: ataque 2, defesa 2, vida 5, arma 1. Forte (só no ato 3 ou no final): ataque 3, defesa 3, vida 7, arma 1. \`"mental": true\` faz o inimigo atacar a Sanidade. Vitória nunca rende mais que a saída pacífica. No máximo uma cena com combate por ato.

## Efeitos (em \`efeitos\` de qualquer desfecho)

- \`vida\`: de -1 a -3 (quem não é do Corpo começa com 5). \`sanidade\`: medo, horror, culpa, de -1 a -4. \`magia\`: de -2 a +2.
- \`brasa\`: o relógio. De -1 a -2, raramente +1.
- \`lacos\`: +1 quando o personagem ajuda alguém que vai se lembrar dele. Decide os melhores finais.
- \`item\` / \`semItem\`: id de item (ou lista). \`companheiro\` / \`semCompanheiro\`: id.
- \`marca\`: uma palavra minúscula que registra um fato ("traiu-o-prefeito" não: use "traiu"). É a memória da história: cenas e finais seguintes podem exigir a marca ou a falta dela.
- \`marco: true\`: marco de história, rende ponto de evolução. Dois ou três por ato, nunca em vitória de combate.

Falhar não trava a história: custa (tempo, sangue, cabeça, um item, uma chance) e a viagem segue. Uma falha pode ter efeito interessante em vez de só punição.

## Itens, companheiros, inimigos

- Item de ajuda: \`{ "nome", "mod": 1 ou 2, "tipo": "objeto", "tags": ["palavra"] }\`. A tag é o que a abordagem cita em \`ajuda\`; só cite tags que algum item da história tenha.
- Arma, armadura ou escudo: \`{ "nome", "mod": 0 a 2, "tipo": "arma" | "armadura" | "escudo" }\`.
- De gastar: \`{ "nome", "tipo": "consumivel", "cura": { "vida": "1d6" } }\` ou \`{ "sanidade": "1d6" }\`.
- Companheiro: \`{ "nome", "quem", "niveis": { chave: 1 a 3 } }\`. Entra com o efeito \`companheiro\` e sai com \`semCompanheiro\`.
- Ids: minúsculos, sem espaço nem acento, únicos na história inteira. Id de cena com o prefixo do ato: \`ato2-mercado\`.

## Texto

- \`texto\` da cena: 40 a 70 palavras, em segunda pessoa ("você"), no presente. Termina na situação, sem perguntar "o que você faz?".
- \`texto\` do desfecho: 20 a 45 palavras. Mostre a consequência, não diga números.
- \`cronica\`: uma frase no passado, terceira pessoa, com \`{nome}\` no lugar do nome do personagem. É obrigatória em todo desfecho.
- \`rotulo\`: verbo no infinitivo, até 5 palavras.
- Frases curtas, concretas. Sem moral explícita. Nada de sangue gratuito.

## Exemplo

Itens, companheiro e inimigo que a cena usa:

\`\`\`json
${j({ itens: EXEMPLO.itens, companheiros: EXEMPLO.companheiros, inimigos: EXEMPLO.inimigos })}
\`\`\`

A cena (três abertas, um combate, uma especial de perícia e uma livre):

\`\`\`json
${j(EXEMPLO.cena)}
\`\`\``;
}

const SAIDA = `## Como responder

Responda com **um único bloco de código JSON** e nada mais: nenhum texto antes, nenhum depois. JSON válido: aspas duplas nas chaves e nos textos, sem comentários, sem vírgula sobrando. Dentro dos textos, escreva as falas com aspas simples ('assim'), para não quebrar o JSON. Se a resposta for longa, não resuma nem corte: escreva tudo.`;

/* ---------- O personagem e o que já aconteceu ---------- */

/** Os nove Atributos, inclusive os zerados: é por aqui que a IA escolhe a Dificuldade. */
const dados = (ficha) => Object.keys(R.ATRIBUTOS).map((k) => `${k} ${ficha.atributos[k] ?? 0}`).join(', ');
const niveis = (o) => Object.entries(o ?? {}).filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join(', ') || 'nenhum';

function fichaEmTexto(p, ficha = R.novaFicha(p)) {
  const v = R.valores(ficha);
  const ant = Object.keys(ficha.antecedentes ?? {}).join(', ') || 'nenhum';
  return [
    `- Quem é: ${p.titulo}${p.nome ? `, chamado(a) ${p.nome}` : ''}. ${p.quem ?? ''}`.trim(),
    p.motivo ? `- Por que está nisso: ${p.motivo}` : null,
    `- Caminho dominante: ${v.dominante}`,
    `- Dados que rola em cada Atributo: ${dados(ficha)}`,
    `- Aprimoramentos: ${niveis(ficha.aprimoramentos)}`,
    `- Perícias: ${niveis(ficha.pericias)}`,
    `- Antecedentes: ${ant}`,
    `- Começa com Vida ${v.vida}, Sanidade ${v.sanidade}, Magia ${v.magia}`,
  ].filter(Boolean).join('\n');
}

const PERGUNTAS = [
  ['premissa', 'A história'],
  ['lugar', 'Lugar e época'],
  ['tom', 'Tom'],
  ['relogio', 'O relógio da jornada (o que se gasta e não pode acabar)'],
  ['emJogo', 'O que está em jogo'],
  ['evitar', 'O que o jogador não quer ver'],
];

function pedidoEmTexto(f = {}) {
  const linhas = PERGUNTAS.filter(([k]) => f[k]?.trim()).map(([k, rot]) => `- ${rot}: ${f[k].trim()}`);
  const fios = (f.fios ?? []).map((x, i) => (x?.trim() ? `- Ato ${i + 1}: ${x.trim()}` : null)).filter(Boolean);
  return [...linhas, ...fios].join('\n') || '- (o jogador deixou em branco: invente)';
}

/* ---------- Prompt inicial ---------- */

/** O formato do núcleo e as notas de cada campo: igual na história nova e no capítulo seguinte. */
function oQueDevolverNoComeco(idioma) {
  const esquema = {
    formato: FORMATO_HISTORIA,
    nome: 'título da história',
    resumo: 'uma ou duas frases que vendem a história, sem entregar o segredo',
    genero: 'uma ou duas palavras',
    inicio: 'nome do lugar onde tudo começa',
    atos: ['', 'nome do ato 1', 'nome do ato 2', 'nome do ato 3', 'nome do lugar do final'],
    cenarios: ['paisagem da abertura', 'do ato 1', 'do ato 2', 'do ato 3', 'do final'],
    relogio: { nome: 'uma palavra, com maiúscula', palavras: ['vazio', 'quase nada', 'pouco', 'metade', 'bastante', 'cheio'] },
    textos: {
      noite: 'o que o personagem faz na pausa entre os atos, em segunda pessoa (uma ou duas frases)',
      velar: 'rótulo do botão de cuidar do relógio na pausa (2 a 4 palavras)',
      velou: 'o que acontece quando ele cuida do relógio (uma frase)',
      subir: 'rótulo do botão que leva ao final (2 a 4 palavras)',
    },
    rumo: 'SEGREDO DO MESTRE, que o jogador não lê: o que de fato está acontecendo, quem ou o que se opõe, as duas ou três direções que a história pode tomar e que tipo de final cada uma daria. Até 250 palavras.',
    quedas: {
      morte: { titulo: 'título do fim', texto: 'o fim de quem morre no caminho, 30 a 50 palavras' },
      perdido: { titulo: 'título do fim', texto: 'o fim de quem perde a cabeça de vez, 30 a 50 palavras' },
    },
    itens: { idDoItem: '...' },
    companheiros: { idDoCompanheiro: '...' },
    inimigos: { idDoInimigo: '...' },
    itensIniciais: ['idDoItem'],
    abertura: { id: 'abertura', ato: 0, titulo: '...', texto: '...', abordagens: ['...'] },
    cenas: ['4 cenas com "ato": 1, na ordem em que acontecem'],
  };
  return `\`\`\`json
${j(esquema)}
\`\`\`

- \`cenarios\`: cinco paisagens, só dentre estas: ${PAISAGENS_DISPONIVEIS.map((x) => `\`${x}\` (${PAISAGENS[x] ?? 'paisagem'})`).join(', ')}. Escolha as que mais se aproximam; o desenho é só o fundo.
- \`relogio.palavras\`: seis estados, do vazio ao cheio, para o jogo dizer em palavras quanto resta.
- \`textos\`: obrigatórios ${TEXTOS_OBRIGATORIOS.map((k) => `\`${k}\``).join(', ')}. Pode acrescentar \`pausa\` (nome da pausa) e \`seguir\` (rótulo do botão de seguir viagem).
- \`itens\`: todos os que a abertura e o ato 1 usam, mais os iniciais. \`itensIniciais\`: até ${ITENS_INICIAIS} itens que esse personagem teria consigo.
- \`abertura\`: a cena que entrega o relógio e a missão. Tem \`"ato": 0\` e três abordagens abertas, com Dificuldade no degrau justo.
- \`cenas\`: exatamente ${CENAS_POR_ATO}, com \`"ato": 1\`. Problemas humanos, pequenos, que apresentam o lugar e as pessoas.

Escreva todos os textos da história em ${IDIOMAS[idioma] ?? idioma}. As chaves do JSON ficam como estão.

${SAIDA}`;
}

/** O núcleo da história e o ato 1, a partir do formulário e da ficha do jogador. */
export function promptInicial(formulario, passado, idioma = 'pt') {
  return `Você vai ser o Mestre de uma história para o jogo Duplo Seis. Leia as regras, o pedido do jogador e o personagem, e devolva o começo da história no formato pedido.

${guia()}

## O pedido do jogador

${pedidoEmTexto(formulario)}

## O personagem

${fichaEmTexto(passado)}

Escreva em volta dele. Nas especiais, use as perícias e os antecedentes que ele tem: ao menos metade das cenas deve ter uma especial que esse personagem alcance. Escolha cada Dificuldade pelos dados dele naquela chave, como manda a tabela.

## O que devolver agora

O núcleo da história, a abertura e o ato 1. Os atos 2 e 3 e o final ficam para depois: o jogador vai jogar o ato 1 e voltar com o que fez, e você escreve a sequência a partir disso. Por isso, plante coisas que possam voltar: gente com nome, dívidas, promessas, e \`marca\` nos desfechos que mudam alguma coisa.

${oQueDevolverNoComeco(idioma)}`;
}

/**
 * O capítulo seguinte: uma história nova, com o mesmo personagem, que parte do
 * final a que ele chegou na anterior. `fim` é o `resumoDoFim` guardado nela.
 */
export function promptCapitulo(historia, desejo = '', idioma = 'pt') {
  const fim = historia.ultimoFim;
  const n = (historia.capitulo ?? 1) + 1;
  const seguem = fim.companheiros.filter((id) => historia.companheiros[id]).map((id) => {
    const c = historia.companheiros[id];
    return `- \`${id}\`: ${c.nome}, ${c.quem} (${niveis(c.niveis)})`;
  });
  const ficaram = fim.perdidos.map((id) => historia.companheiros[id]?.nome ?? id);
  return `Você vai ser o Mestre do capítulo ${n} de uma história do jogo Duplo Seis. O capítulo anterior terminou; o personagem é o mesmo, mais vivido, e o que ele fez lá continua valendo. Leia as regras, o que aconteceu e como ele está, e devolva o começo de uma história nova que parte dali.

${guia()}

## O capítulo anterior: ${historia.nome} (${historia.genero})

- Resumo: ${historia.resumo}
- Atos: ${historia.atos.slice(1).join(' / ')}
- O segredo de Mestre, como terminou: ${historia.rumo}

### A crônica

${fim.cronica.map((l) => `- ${l}`).join('\n')}

### O final a que ele chegou: ${fim.final.titulo} (${fim.final.estrelas} de 3 estrelas)

${fim.final.texto}

## O personagem, agora

${fichaEmTexto(fim.ficha)}
- Laços que fez no capítulo anterior: ${fim.lacos} (recomeçam em zero, mas as pessoas lembram)
- Tinha consigo: ${fim.itens.join(', ') || 'nada'}

### O que ele traz (já está no jogo: não declare de novo)

- Marcas: ${fim.marcas.map((m) => `\`${m.id}\`${m.de ? ` (${m.de})` : ''}`).join('; ') || 'nenhuma'}
- Companheiros que seguem com ele:
${seguem.join('\n') || '- ninguém'}
- Companheiros que ficaram pelo caminho: ${ficaram.join(', ') || 'ninguém'}

As marcas e os companheiros acima começam o capítulo com ele. Use-os: \`requer: { "marca": "..." }\` e \`requer: { "companheiro": "..." }\` nas especiais, \`ajudantes\`, e \`semCompanheiro\` se a história levar alguém embora. Não repita os ids deles em \`companheiros\`.

## O que o jogador quer deste capítulo

${desejo.trim() ? `- ${desejo.trim()}` : '- (em branco: decida você, a partir de como o anterior terminou)'}

## A história é viva, e este capítulo é consequência

- Não recomece do zero: o lugar, as pessoas e as dívidas do capítulo anterior existem. O final a que ele chegou é o ponto de partida, com o que ele ganhou e o que deixou por resolver.
- Um capítulo novo precisa de um problema novo, maior ou mais íntimo, e de um relógio próprio (pode ser outro objeto).
- Quem ele ajudou aparece para retribuir; quem ele feriu, para cobrar. Ao menos duas cenas do ato 1 devem ter uma especial que só existe por causa de uma marca ou de um companheiro que ele traz.
- Ele evoluiu: escolha as Dificuldades pelos dados que ele rola agora.

## O que devolver agora

O núcleo do capítulo ${n}, a abertura e o ato 1, no mesmo formato de uma história nova. Os atos 2 e 3 e o final ficam para depois, a partir do que ele fizer.

${oQueDevolverNoComeco(idioma)}`;
}

/* ---------- Prompt da sequência ---------- */

const RESULTADOS = { sucesso: 'sucesso crítico', falha: 'falha crítica' };

function oQueAconteceu(historia, e) {
  const cenas = new Map([historia.abertura, ...historia.cenas, ...(historia.desfecho ?? [])].map((c) => [c.id, c]));
  const escolhas = e.trilha.map((t) => {
    const c = cenas.get(t.cena);
    const a = c?.abordagens.find((x) => x.id === t.abordagem);
    const como = t.critico ? `${t.ok ? 'deu certo' : 'deu errado'} (${RESULTADOS[t.critico]})` : t.ok ? 'deu certo' : 'deu errado';
    return `- ${c?.titulo ?? t.cena}: escolheu "${a?.rotulo ?? t.abordagem}" e ${como}`;
  });
  return `### A crônica (na ordem em que aconteceu)

${e.cronica.map((l) => `- ${l}`).join('\n') || '- (nada ainda)'}

### As escolhas

${escolhas.join('\n') || '- (nenhuma)'}`;
}

function estado(historia, e) {
  const nomeDe = (campo) => (id) => `${historia[campo][id]?.nome ?? id} (\`${id}\`)`;
  const evoluida = { titulo: e.tituloDoPassado, nome: e.nome, quem: historia.passados?.[0]?.quem, motivo: historia.passados?.[0]?.motivo };
  const v = R.valores(e.ficha);
  return [
    `- Quem é: ${evoluida.titulo}, chamado(a) ${evoluida.nome}. ${evoluida.quem ?? ''}`.trim(),
    `- Caminho dominante: ${v.dominante}`,
    `- Dados que rola em cada Atributo: ${dados(e.ficha)}`,
    `- Aprimoramentos: ${niveis(e.ficha.aprimoramentos)}`,
    `- Perícias: ${niveis(e.ficha.pericias)}`,
    `- Antecedentes: ${Object.keys(e.ficha.antecedentes ?? {}).join(', ') || 'nenhum'}`,
    `- Vida ${e.vida} de ${e.max.vida}; Sanidade ${e.sanidade} de ${e.max.sanidade}; Magia ${e.magia} de ${e.max.magia}`,
    `- ${historia.relogio.nome} (o relógio, efeito \`brasa\`): ${e.brasa} de ${MESA.brasa}`,
    `- Laços: ${e.lacos}`,
    `- Marcas que ele tem: ${e.marcas.map((m) => `\`${m}\`${e.origens?.[m] != null ? ` (${e.cronica[e.origens[m]]})` : ''}`).join('; ') || 'nenhuma'}`,
    `- Leva consigo: ${e.itens.map(nomeDe('itens')).join(', ') || 'nada'}`,
    `- Companheiros que seguem com ele: ${e.companheiros.map(nomeDe('companheiros')).join(', ') || 'ninguém'}`,
    `- Companheiros que ficaram pelo caminho: ${(e.perdidos ?? []).map(nomeDe('companheiros')).join(', ') || 'ninguém'}`,
    e.quedas ? `- Já caiu sem sentidos ${e.quedas} vez(es)` : null,
    e.surtos ? `- Já perdeu o controle de si ${e.surtos} vez(es)` : null,
  ].filter(Boolean).join('\n');
}

function cabecalhoDaHistoria(historia) {
  return `## A história até aqui

- Título: ${historia.nome} (${historia.genero})
- Resumo: ${historia.resumo}
- Atos: ${historia.atos.slice(1).join(' / ')}
${historia.formulario ? `\n### O pedido original do jogador\n\n${pedidoEmTexto(historia.formulario)}\n` : ''}
### O seu segredo de Mestre (o jogador não leu)

${historia.rumo}`;
}

function catalogo(historia) {
  const ids = (campo) => Object.entries(historia[campo]).map(([id, x]) => `\`${id}\` (${x.nome}${x.tags?.length ? `, tags: ${x.tags.join(' ')}` : ''})`).join(', ') || 'nenhum';
  const cenas = [historia.abertura, ...historia.cenas].map((c) => `\`${c.id}\``).join(', ');
  return `## O que já existe (pode usar; não repita os ids)

- Itens: ${ids('itens')}
- Companheiros: ${ids('companheiros')}
- Inimigos: ${ids('inimigos')}
- Ids de cena já usados: ${cenas}`;
}

const VIVA = `## A história é viva

O que o personagem fez conta, e tem de aparecer:
- Quem morreu ou foi embora não volta, a não ser como consequência (um parente, uma falta, uma culpa).
- Quem ele ajudou lembra e pode retribuir. Quem ele enganou, feriu ou abandonou cobra.
- O que falhou deixou marca no mundo: a ponte que caiu continua caída.
- Use \`requer: { "marca": "..." }\` e \`requer: { "companheiro": "..." }\` nas especiais para que as escolhas dele abram portas que outro personagem não teria; use \`semMarca\` para o contrário. Só exija marcas que ele tem (ou que esta mesma sequência concede).
- Leve em conta o estado dele: ferido, sem relógio ou sozinho, a história aperta de outro jeito; não o mate por descuido.
- Ele evoluiu: confira de novo os dados que rola em cada Atributo antes de escolher as Dificuldades. O que era justo no ato anterior pode ter ficado fácil.
- Atualize o \`rumo\` com o que mudou no seu plano por causa do que ele fez.`;

/** A sequência do ato que falta (2 ou 3), ou o final (4), a partir do que o jogador fez. */
export function promptSequencia(historia, e, ato, idioma = 'pt') {
  const final = ato > MESA.atos;
  const esquema = final
    ? {
      formato: FORMATO_SEQUENCIA,
      ato: 4,
      rumo: 'o segredo, como ficou',
      itens: {},
      companheiros: {},
      inimigos: {},
      desfecho: ['1 ou 2 cenas com "ato": 4, na ordem'],
      finais: [
        { id: 'melhor', titulo: '...', estrelas: 3, quando: { brasa: { min: 2 }, lacos: { min: 5 }, marca: 'palavra' }, texto: '50 a 90 palavras' },
        { id: 'outro', titulo: '...', estrelas: 2, quando: { brasa: { min: 3 } }, texto: '...' },
        { id: 'pior', titulo: '...', estrelas: 0, texto: 'o último não tem "quando": é o que sobra' },
      ],
    }
    : {
      formato: FORMATO_SEQUENCIA,
      ato,
      rumo: 'o segredo de Mestre atualizado com o que o jogador fez (até 250 palavras)',
      itens: { idNovo: '...' },
      companheiros: { idNovo: '...' },
      inimigos: { idNovo: '...' },
      cenas: [`${CENAS_POR_ATO} cenas com "ato": ${ato}, na ordem em que acontecem`],
    };
  const pedido = final
    ? `O final da história: \`desfecho\` (1 ou 2 cenas com \`"ato": 4\`, em "${historia.atos[4]}", onde tudo se decide) e \`finais\`.

- As cenas do desfecho são as mais difíceis (abertas no degrau apertado) e é nelas que as marcas e os companheiros dele mais devem pesar. Podem conceder a marca que o melhor final exige.
- \`finais\`: de 4 a 5, do melhor para o pior. O jogo fica com o **primeiro** cuja condição \`quando\` fecha, então a ordem importa. O último não tem \`quando\`.
- \`quando\` aceita: \`brasa\`, \`lacos\` e \`vida\` com \`{ "min": n }\` e/ou \`{ "max": n }\`; \`marca\`, \`semMarca\`, \`companheiro\`, \`semCompanheiro\` com um id ou uma lista.
- Os finais têm de nascer do que ele fez: ao menos dois devem depender de marcas que ele tem, de quem está (ou não está) com ele, ou dos laços. Um final de 3 estrelas tem de estar ao alcance dele, sem estar garantido: as falhas do desfecho ainda podem gastar o relógio.
- Cada final tem \`estrelas\` de 0 a 3 e um \`texto\` de 50 a 90 palavras, em segunda pessoa, que fecha a história dele e de quem ele encontrou.`
    : `O ato ${ato}, "${historia.atos[ato]}": exatamente ${CENAS_POR_ATO} cenas com \`"ato": ${ato}\`, na ordem em que acontecem, mais os itens, companheiros e inimigos **novos** que elas usarem (se não houver, mande \`{}\`).${ato === MESA.atos ? ' É o último ato antes do final: aperte, e deixe pronto o que o final vai decidir.' : ' É o meio da história: complique, revele parte do segredo, cobre o que ficou do ato 1.'}`;
  return `Você é o Mestre de uma história em andamento no jogo Duplo Seis. O jogador terminou ${final ? 'os três atos' : `o ato ${ato - 1}`} e voltou para pedir ${final ? 'o final' : 'a sequência'}. Leia as regras, a história até aqui e o que ele fez, e escreva o que vem agora.

${guia()}

${cabecalhoDaHistoria(historia)}

## O que o personagem fez

${oQueAconteceu(historia, e)}

## Como ele está agora

${estado(historia, e)}

${catalogo(historia)}

${VIVA}

## O que devolver agora

${pedido}

\`\`\`json
${j(esquema)}
\`\`\`

Escreva todos os textos em ${IDIOMAS[idioma] ?? idioma}. As chaves do JSON ficam como estão.

${SAIDA}`;
}

/** Quando o que foi colado não passa na conferência: o que pedir à IA. */
export function promptConserto(erros) {
  return `O JSON que você mandou não passou na conferência do jogo. Corrija só o que está listado e devolva o JSON **inteiro** de novo, num único bloco de código, sem texto antes nem depois.

${erros.map((x) => `- ${x}`).join('\n')}`;
}

const pc = (x) => `${Math.round(x * 100)}%`;

/**
 * Quando o trecho passa na conferência mas o robô o achou fácil ou difícil
 * demais (`medir`): o que pedir à IA, sem mudar a história.
 */
export function promptAjuste(medida) {
  const oQue = {
    facil: `Está fácil demais: ele acertou ${pc(medida.sucesso)} das escolhas (o saudável é entre 50% e 90%). Suba as Dificuldades das abordagens em que ele rola mais dados, pela tabela, e deixe as especiais no degrau folgado, sem certeza.`,
    dificil: `Está difícil demais: ele acertou só ${pc(medida.sucesso)} das escolhas (o saudável é entre 50% e 90%). Baixe as Dificuldades pela tabela e dê a ele ao menos uma abordagem no degrau justo por cena.`,
    mortal: `Ele morreu ou perdeu a cabeça neste trecho em ${pc(medida.queda)} das vezes. Reduza as perdas de vida e de sanidade nas falhas: ele está com pouco.`,
    semDados: `${pc(medida.semDados)} das escolhas foram sem dados. Troque especiais livres por testes no degrau folgado: no máximo uma livre por ato.`,
    garantido: `O final de 3 estrelas saiu em ${pc(medida.final?.tres ?? 0)} das vezes: está garantido. Aperte a condição do melhor final (mais laços, uma marca que se ganha num teste apertado) ou as cenas do desfecho.`,
    inalcancavel: `O final de 3 estrelas quase nunca saiu (${pc(medida.final?.tres ?? 0)} das vezes). Confira se as marcas que ele exige podem ser ganhas no desfecho por uma abordagem com boa chance para este personagem, e afrouxe a condição do relógio ou dos laços.`,
  };
  return `O JSON passou na conferência, mas o jogo testou o trecho jogando ${medida.n} vezes com este personagem, e o equilíbrio saiu fora da faixa. Não mude a história, as cenas nem os ids: ajuste só Dificuldades, efeitos e, se for o caso, as condições dos finais. Devolva o JSON **inteiro** de novo, num único bloco de código, sem texto antes nem depois.

${medida.avisos.map((a) => `- ${oQue[a]}`).join('\n')}`;
}
