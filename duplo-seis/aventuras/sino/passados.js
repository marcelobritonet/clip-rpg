/**
 * O Sino Afogado: os passados. Cada um é uma ficha de Especialista Iniciante
 * (12 Pontos de Evolução) conferida por `validar`, sobre as mesmas regras da
 * Brasa. A "benzeção" usa as Perícias Mágicas do manual sem mudar regra
 * nenhuma (ver HISTORIA.md).
 */
export const PONTOS_INICIAIS = 12;

export const PASSADOS = [
  {
    id: 'barqueiro',
    titulo: 'O Barqueiro da Represa',
    nome: 'Bento',
    caminho: 'corpo',
    quem: 'Você leva gente e saco de farinha de uma margem à outra desde que a represa encheu. Rema de noite sem lampião e conhece o lago pelo cheiro. Nasceu na Pedra-Funda e tinha seis anos quando a água subiu.',
    motivo: 'Você foi quem puxou da água os onze que dormiam. Todos olharam para você do mesmo jeito, como quem não conhece ninguém.',
    atributos: { forca: 3, destreza: 1, fisico: 2, percepcao: 1, presenca: 1 },
    aprimoramentos: { manipulacaoPeso: 1, ataqueCorporal: 1, resistencia: 1 },
    pericias: { sobrevivencia: 1 },
    antecedentes: { boaFama: { nivel: 1 } },
    itens: ['remo', 'capa', 'lampiao'],
  },
  {
    id: 'trapezista',
    titulo: 'A Trapezista do Circo',
    nome: 'Estela',
    caminho: 'corpo',
    quem: 'O Circo Irmãos Faria ficou preso na vila quando a ponte do rio caiu, e você ficou com ele. Anda no arame sem rede e tira moeda da orelha de criança. Deixou para trás, na capital, um homem a quem deve dinheiro e explicação.',
    motivo: 'O palhaço da trupe foi o terceiro a dormir. Hoje de manhã ele olhou a própria cara no espelho e perguntou quem era aquele.',
    atributos: { destreza: 3, fisico: 1, percepcao: 2, vontade: 1 },
    aprimoramentos: { reflexo: 2, agilidade: 1 },
    pericias: { equilibrio: 1, prestidigitacao: 1 },
    antecedentes: { inimigo: { nivel: 1, mau: true }, aliado: { nivel: 1 } },
    itens: ['corda', 'lanterna', 'canivete'],
  },
  {
    id: 'professora',
    titulo: 'A Professora',
    nome: 'Celina',
    caminho: 'mente',
    quem: 'Você ensina as quatro séries juntas na escola da vila, numa sala só. Sabe a história da Pedra-Funda melhor que quem morou lá, porque leu o que ninguém quis guardar. Lê latim de missal e letra de médico.',
    motivo: 'A professora Nair, sua amiga, foi a sétima. Ela agora escreve o próprio nome no quadro-negro, todo dia, e não reconhece a letra.',
    atributos: { inteligencia: 3, percepcao: 1, sabedoria: 2, fisico: 1, presenca: 1 },
    aprimoramentos: {},
    pericias: { historia: 2, investigacao: 1, idiomas: 1 },
    antecedentes: { recursos: { nivel: 1 } },
    itens: ['caderno', 'lanterna', 'cha'],
  },
  {
    id: 'farmaceutico',
    titulo: 'O Farmacêutico',
    nome: 'Otávio',
    caminho: 'mente',
    quem: 'Você manipula xarope, arranca dente e vende fiado para a vila inteira. Diz que não acredita em benzedeira, mas aprendeu com a sua avó a acalmar uma febre só com a mão em cima da água, e às vezes funciona.',
    motivo: 'Você examinou os onze. Pulso bom, pupila boa, nada no sangue. Nenhum remédio da prateleira serve para quem esqueceu o nome.',
    atributos: { inteligencia: 3, percepcao: 2, destreza: 1, vontade: 1 },
    aprimoramentos: {},
    pericias: { medicina: 2, ciencias: 1, historia: 1, magiaElemental: 1 },
    antecedentes: { semRecursos: { nivel: 1, mau: true }, aliado: { nivel: 1 } },
    itens: ['maleta', 'lupa', 'xarope'],
  },
  {
    id: 'radialista',
    titulo: 'O Locutor da Rádio',
    nome: 'Odair',
    caminho: 'espirito',
    quem: 'A voz da Rádio Represa, a única da região, é a sua: a hora certa, o recado de doente, o pedido de música. Todo mundo conhece a sua voz e pouca gente a sua cara. Já disse no ar o que não devia, sobre gente que manda.',
    motivo: 'Ontem, no meio do programa, você disse a hora certa e ouviu, por baixo da estática, um sino responder.',
    atributos: { presenca: 3, vontade: 1, inteligencia: 1, percepcao: 1, destreza: 1 },
    aprimoramentos: { empatia: 2, agilidade: 1 },
    pericias: { historia: 1, prestidigitacao: 1 },
    antecedentes: { recursos: { nivel: 1 }, maFama: { nivel: 1, mau: true } },
    itens: ['violao', 'lampiao'],
  },
  {
    id: 'benzedeira',
    titulo: 'A Neta da Benzedeira',
    nome: 'Rosário',
    caminho: 'espirito',
    quem: 'Dona Sinhá é sua avó e lhe ensinou tudo o que sabe, menos o que tem medo de ensinar. Você tira quebranto de criança, acalma cavalo bravo com a palma da mão e sente quando alguém vai chegar.',
    motivo: 'Há três noites você sonha com uma rua debaixo d\'água e uma voz que pede, com educação, que você diga o nome dele. Você não sabe qual é.',
    atributos: { vontade: 3, fe: 1, presenca: 1, sabedoria: 2, fisico: 1 },
    aprimoramentos: {},
    pericias: { magiaControle: 2, magiaSuporte: 1, lidarAnimais: 1 },
    antecedentes: { aliado: { nivel: 1 } },
    itens: ['terco', 'milho', 'cha'],
  },
];

export const passado = (id) => PASSADOS.find((p) => p.id === id);
