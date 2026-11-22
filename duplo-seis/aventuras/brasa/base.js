/**
 * A Última Brasa: catálogo comum (itens, companheiros, inimigos), a cena de
 * abertura, as cenas do Farol e os finais. As cenas dos atos ficam em
 * ato1.js, ato2.js e ato3.js.
 */

export const itens = {
  // Objetos que ajudam em testes: o modificador soma níveis (manual, Situação 4).
  peDeCabra: { nome: 'Pé de Cabra', mod: 2, tipo: 'objeto', tags: ['alavanca'] },
  corda: { nome: 'Corda', mod: 1, tipo: 'objeto', tags: ['corda'] },
  lamparina: { nome: 'Lamparina', mod: 1, tipo: 'objeto', tags: ['luz'] },
  mapa: { nome: 'Mapa Velho', mod: 1, tipo: 'objeto', tags: ['mapa'] },
  isca: { nome: 'Saco de Iscas', mod: 1, tipo: 'objeto', tags: ['isca'] },
  flauta: { nome: 'Flauta de Osso', mod: 1, tipo: 'objeto', tags: ['musica'] },
  amuleto: { nome: 'Amuleto do Sino', mod: 1, tipo: 'objeto', tags: ['amuleto'] },
  manto: { nome: 'Manto de Lã', mod: 1, tipo: 'objeto', tags: ['agasalho'] },
  lente: { nome: 'Lente de Vidro', mod: 1, tipo: 'objeto', tags: ['lente'] },
  almanaque: { nome: 'Almanaque do Vale', mod: 1, tipo: 'objeto', tags: ['livro'] },
  ervas: { nome: 'Maço de Ervas', mod: 1, tipo: 'objeto', tags: ['remedio'] },
  // Armas, armadura e escudo: entram no combate e contam no limite da Força.
  faca: { nome: 'Faca', mod: 0, tipo: 'arma' },
  cajado: { nome: 'Cajado', mod: 0, tipo: 'arma' },
  espadaCurta: { nome: 'Espada Curta', mod: 1, tipo: 'arma' },
  machado: { nome: 'Machado de Lenhador', mod: 2, tipo: 'arma' },
  funda: { nome: 'Funda', mod: 0, tipo: 'arma', longa: true },
  arco: { nome: 'Arco de Caça', mod: 1, tipo: 'arma', longa: true },
  escudo: { nome: 'Escudo de Tábua', mod: 1, tipo: 'escudo' },
  gibao: { nome: 'Gibão de Couro', mod: 1, tipo: 'armadura' },
  // De gastar: usa-se uma vez, fora de combate.
  unguento: { nome: 'Unguento', tipo: 'consumivel', cura: { vida: '1d6' } },
  cha: { nome: 'Chá de Melissa', tipo: 'consumivel', cura: { sanidade: '1d6' } },
};

export const companheiros = {};

export const inimigos = {};

export const abertura = {
  id: 'paiol',
  ato: 0,
  titulo: 'A porta do paiol',
  efeitosAoEntrar: { item: 'peDeCabra' },
  texto:
    'O fogo do Farol do Alto morreu, e sem ele a Longa Noite desce o vale. Alguém precisa levar uma brasa da lareira de Vau-do-Sino até lá em cima. Esse alguém é você. A lanterna de levar brasa está no paiol, atrás de uma porta de madeira grossa que a chuva inchou. Otto, o vizinho, estende um pé de cabra e arregaça as mangas.',
  abordagens: [
    {
      id: 'forca',
      rotulo: 'Derrubar a porta',
      teste: { chave: 'forca', dificuldade: 10 },
      ajuda: ['alavanca'],
      ajudantes: [{ nome: 'Otto', nivel: 1 }],
      sucesso: {
        texto: 'A madeira geme, estala e cede de uma vez. Otto cai sentado, rindo. A lanterna está lá, intacta, com cheiro de óleo velho.',
        cronica: '{nome} derrubou a porta do paiol e saiu de Vau-do-Sino antes do meio-dia.',
      },
      falha: {
        texto: 'A porta nem treme. Vocês passam a manhã cavando a soleira até ela abrir um palmo, e a brasa já queima há horas quando você enfim parte.',
        cronica: '{nome} perdeu a manhã com a porta do paiol.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'mente',
      rotulo: 'Procurar onde ela prende',
      teste: { chave: 'percepcao', dificuldade: 5 },
      sucesso: {
        texto: 'Não é a tranca: são os pinos da dobradiça, quase soltos de ferrugem. Dois toques do pé de cabra e a porta sai inteira, como uma tampa.',
        cronica: '{nome} tirou a porta do paiol pelos pinos, sem um arranhão.',
      },
      falha: {
        texto: 'Você examina a tranca, a soleira, o batente. Nada. No fim é Otto quem acha a tábua podre, depois de uma manhã perdida.',
        cronica: '{nome} perdeu a manhã com a porta do paiol.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'espirito',
      rotulo: 'Chamar a vila inteira',
      teste: { chave: 'presenca', dificuldade: 5 },
      sucesso: {
        texto: 'Você sobe no cocho e fala do Farol. Vem gente de todas as portas. Vinte ombros, um empurrão só, e a vila inteira vê você partir com a lanterna.',
        cronica: '{nome} reuniu Vau-do-Sino inteira diante do paiol e partiu sob aplausos.',
        efeitos: { lacos: 1 },
      },
      falha: {
        texto: 'Duas janelas se abrem, uma se fecha. Ninguém vem. Você e Otto perdem a manhã na soleira.',
        cronica: '{nome} chamou a vila, e a vila não veio.',
        efeitos: { brasa: -1 },
      },
    },
  ],
};

export const desfecho = [
  {
    id: 'farol-porta',
    ato: 4,
    titulo: 'A porta do Farol',
    texto:
      'O Farol do Alto é uma torre negra contra um céu sem estrela. A porta de ferro está trancada por dentro. Pela fresta, uma voz velha: "Vá embora. Eu deixei o fogo morrer. A luz também chama o que mora no escuro."',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Arrombar o ferro',
        teste: { chave: 'forca', dificuldade: 12 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'A tranca salta do batente com um grito de metal. O velho recua para a escada, sem resistir, olhando a lanterna na sua mão.',
          cronica: 'No alto, {nome} arrombou a porta de ferro do Farol.',
        },
        falha: {
          texto: 'O ferro não cede. Você acaba entrando por uma seteira estreita, rasgando o ombro na pedra, enquanto a brasa míngua.',
          cronica: '{nome} entrou no Farol por uma seteira, sangrando.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Entender a tranca',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['lente', 'livro'],
        sucesso: {
          texto: 'A tranca é um contrapeso: quem a fez queria que abrisse por fora com o peso certo na argola. Uma pedra, um nó, e o ferro gira sozinho.',
          cronica: '{nome} abriu o Farol com uma pedra e um nó.',
        },
        falha: {
          texto: 'Você tenta argola, corrente, dobradiça. Quando o contrapeso enfim desce, a lanterna já pesa menos do que devia.',
          cronica: '{nome} demorou demais na tranca do Farol.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Falar com o Faroleiro',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'Você não discute. Conta do vale, das janelas, de quem ficou esperando. O silêncio dura muito. Depois, a tranca corre. "Eu subo com você", diz o velho.',
          cronica: '{nome} convenceu o Faroleiro a abrir a porta e a subir junto.',
          efeitos: { marca: 'faroleiro' },
        },
        falha: {
          texto: '"Palavras", diz a voz, e se afasta. Você fica falando com o ferro até achar uma seteira por onde se espremer.',
          cronica: 'O Faroleiro não quis ouvir {nome}.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
      },
      {
        id: 'encanto',
        rotulo: 'Desfazer o que sela a porta',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 6 },
        sucesso: {
          texto: 'Há um encantamento antigo e cansado na tranca. Você puxa o fio certo e ele se desfaz como geada ao sol.',
          cronica: '{nome} desfez o encanto que selava o Farol.',
        },
        falha: {
          texto: 'O encanto morde de volta, frio, por dentro da cabeça. A porta fica onde está; você entra pela seteira.',
          cronica: 'O encanto do Farol resistiu a {nome}.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'farol-chama',
    ato: 4,
    titulo: 'Trezentos degraus',
    texto:
      'A escada sobe em caracol por dentro do escuro. A cada volta a Longa Noite encosta mais: sussurra o seu nome, promete descanso, pede só que você pare um pouco. Lá em cima, o braseiro frio espera.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir sem parar',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'Você conta os degraus em voz alta para não ouvir mais nada. Trezentos. O ar lá em cima corta, e é o ar mais limpo que você já respirou.',
          cronica: '{nome} subiu os trezentos degraus de um fôlego só.',
        },
        falha: {
          texto: 'As pernas falham na volta duzentos. Você sobe o resto de joelhos, protegendo a lanterna com o corpo.',
          cronica: '{nome} subiu o Farol de joelhos.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Não acreditar nas vozes',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'As vozes sabem o seu nome, mas erram todo o resto. Mentira mal contada. Você sobe sorrindo, e elas se calam de vergonha.',
          cronica: '{nome} ouviu a Longa Noite mentir e não acreditou.',
        },
        falha: {
          texto: 'Uma das vozes é igual à de alguém que você perdeu. Você para. Quando volta a si, não sabe quanto tempo ficou sentado no degrau.',
          cronica: 'A Longa Noite fez {nome} parar na escada.',
          efeitos: { sanidade: -3, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Subir cantando',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'Você canta a cantiga de ninar de Vau-do-Sino, desafinado e alto. O escuro recua um degrau por verso.',
          cronica: '{nome} subiu o Farol cantando.',
        },
        falha: {
          texto: 'A voz some na garganta. O resto da subida é em silêncio, com o escuro respirando no seu ouvido.',
          cronica: '{nome} perdeu a voz na escada do Farol.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'velho',
        rotulo: 'Contar ao velho quem você encontrou',
        requer: { lacos: 5, semMarca: 'faroleiro' },
        livre: true,
        resultado: {
          texto: 'O Faroleiro sobe atrás de você, calado. Você fala do caminho: de cada rosto, de cada porta que se abriu. No último lance ele passa à frente e segura o braseiro com as duas mãos.',
          cronica: '{nome} subiu o Farol contando ao velho os nomes de quem encontrou no caminho.',
          efeitos: { marca: 'faroleiro' },
        },
      },
    ],
  },
];

/**
 * Finais: vale o primeiro cuja condição fecha. `quando` recebe o resumo da
 * sessão: { brasa, lacos, marcas (Set), vida, companheiros }.
 */
export const finais = [
  {
    id: 'muitos',
    titulo: 'Farol de muitos',
    estrelas: 3,
    quando: (s) => s.brasa >= 2 && s.marcas.has('faroleiro') && s.lacos >= 5,
    texto:
      'O Faroleiro segura o braseiro; você deita a brasa. O fogo pega devagar e depois de uma vez, e a luz varre o vale. Lá embaixo, uma a uma, janelas respondem: gente que você encontrou no caminho, acendendo o que tem. O velho chora sem esconder. "Não é uma luz", ele diz. "São muitas."',
  },
  {
    id: 'emprestado',
    titulo: 'Fogo emprestado',
    estrelas: 3,
    quando: (s) => s.brasa <= 0 && s.lacos >= 6,
    texto:
      'A lanterna chega fria. Você se senta ao lado do braseiro morto e espera a Longa Noite. O que sobe a escada, porém, são passos, muitos. Gente do caminho, cada um com uma brasa da própria lareira. "Você não achou que ia sozinho", diz alguém. O Farol acende com fogo de todo o vale.',
  },
  {
    id: 'aceso',
    titulo: 'Farol aceso',
    estrelas: 2,
    quando: (s) => s.brasa >= 3,
    texto:
      'A brasa ainda está viva e gorda quando toca a lenha. O Farol do Alto acende como se nunca tivesse apagado, e a Longa Noite recua para trás das montanhas. Você desce no dia seguinte, sem pressa, com a lanterna vazia batendo na perna.',
  },
  {
    id: 'fraca',
    titulo: 'Luz fraca',
    estrelas: 1,
    quando: (s) => s.brasa > 0,
    texto:
      'Resta um ponto vermelho no fundo da lanterna. Você sopra, protege, reza. O fogo pega, miúdo. Não é o farol das histórias, mas é uma luz, e o vale lá embaixo vai atravessar o inverno olhando para ela.',
  },
  {
    id: 'cinza',
    titulo: 'Cinza',
    estrelas: 0,
    quando: () => true,
    texto:
      'A lanterna chega fria. No braseiro, só cinza velha. Você se senta no alto da torre e vê a Longa Noite descer sobre Vau-do-Sino como uma maré. Alguém vai ter de tentar de novo. Talvez você.',
  },
];

/** Finais de quem não chega. */
export const quedas = {
  morte: {
    id: 'morte',
    titulo: 'A lanterna na neve',
    estrelas: 0,
    texto: 'O corpo não vai mais longe. A lanterna rola da sua mão e fica ali, acesa ainda por um tempo, esperando quem a levante.',
  },
  perdido: {
    id: 'perdido',
    titulo: 'Fora de si',
    estrelas: 0,
    texto: 'A Longa Noite entrou e não saiu mais. Dizem que ainda há alguém vagando pela encosta com uma lanterna apagada, perguntando o caminho de casa.',
  },
};
