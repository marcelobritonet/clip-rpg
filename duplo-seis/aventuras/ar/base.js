/**
 * Ar Rarefeito: catálogo comum (itens, companheiros, inimigos), a cena de
 * abertura, as cenas do Núcleo, os finais e os textos de sistema. As cenas dos
 * atos ficam em ato1.js, ato2.js e ato3.js. O relógio da jornada é o Ar, que
 * por dentro continua sendo o efeito `brasa` (0 a 10).
 */

export const itens = {
  // Objetos que ajudam em testes: o modificador soma níveis (manual, Situação 4).
  barra: { nome: 'Barra de Alavanca', mod: 2, tipo: 'objeto', tags: ['alavanca'] },
  cabo: { nome: 'Cabo de Segurança', mod: 1, tipo: 'objeto', tags: ['cabo'] },
  lanterna: { nome: 'Lanterna de Testa', mod: 1, tipo: 'objeto', tags: ['luz'] },
  planta: { nome: 'Planta da Estação', mod: 1, tipo: 'objeto', tags: ['mapa'] },
  racao: { nome: 'Saco de Ração', mod: 1, tipo: 'objeto', tags: ['isca'] },
  gaita: { nome: 'Gaita', mod: 1, tipo: 'objeto', tags: ['musica'] },
  medalha: { nome: 'Medalha dos Fundadores', mod: 1, tipo: 'objeto', tags: ['amuleto'] },
  traje: { nome: 'Traje de Pressão Remendado', mod: 1, tipo: 'objeto', tags: ['traje'] },
  leitor: { nome: 'Leitor de Diagnóstico', mod: 1, tipo: 'objeto', tags: ['scanner'] },
  manual: { nome: 'Manual dos Fundadores', mod: 1, tipo: 'objeto', tags: ['manual'] },
  maleta: { nome: 'Maleta Médica', mod: 1, tipo: 'objeto', tags: ['remedio'] },
  ferramentas: { nome: 'Jogo de Ferramentas', mod: 1, tipo: 'objeto', tags: ['ferramenta'] },
  botas: { nome: 'Botas Magnéticas', mod: 1, tipo: 'objeto', tags: ['ima'] },
  fita: { nome: 'Fita Prateada', mod: 1, tipo: 'objeto', tags: ['remendo'] },
  fichas: { nome: 'Fichas de Troca', mod: 1, tipo: 'objeto', tags: ['troca'] },
  // Armas improvisadas, armadura e escudo: entram no combate e contam no limite da Força.
  estilete: { nome: 'Estilete de Carga', mod: 0, tipo: 'arma' },
  bisturi: { nome: 'Bisturi', mod: 0, tipo: 'arma' },
  chaveDeGrifo: { nome: 'Chave de Grifo', mod: 1, tipo: 'arma' },
  marreta: { nome: 'Marreta de Doca', mod: 2, tipo: 'arma' },
  sinalizador: { nome: 'Pistola Sinalizadora', mod: 0, tipo: 'arma', longa: true },
  rebitadeira: { nome: 'Rebitadeira Pneumática', mod: 1, tipo: 'arma', longa: true },
  tampa: { nome: 'Tampa de Escotilha', mod: 1, tipo: 'escudo' },
  colete: { nome: 'Colete de Carga', mod: 1, tipo: 'armadura' },
  // De gastar: usa-se uma vez, fora de combate.
  gel: { nome: 'Gel de Sutura', tipo: 'consumivel', cura: { vida: '1d6' } },
  cha: { nome: 'Chá de Hortelã do Anel', tipo: 'consumivel', cura: { sanidade: '1d6' } },
};

export const companheiros = {};

export const inimigos = {};

export const abertura = {
  id: 'escotilha',
  ato: 0,
  titulo: 'A escotilha do almoxarifado',
  efeitosAoEntrar: { item: 'barra' },
  texto:
    'O reciclador principal da Aurora-7 parou, e a Zeladora, a voz que cuida da estação desde os fundadores, já conta as horas de ar de duzentas pessoas. O único cartucho catalisador reserva está aqui no Anel Verde, do lado oposto ao Núcleo, e alguém precisa atravessar a estação com ele. Esse alguém é você. O cartucho dorme no almoxarifado, atrás de uma escotilha que emperrou há duas safras. Seu Anselmo estende uma barra de alavanca e cospe nas mãos.',
  abordagens: [
    {
      id: 'forca',
      rotulo: 'Forçar a escotilha',
      teste: { chave: 'forca', dificuldade: 10 },
      ajuda: ['alavanca'],
      ajudantes: [{ nome: 'Seu Anselmo', nivel: 1 }],
      sucesso: {
        texto: 'O volante range, solta ferrugem e gira de uma vez. Seu Anselmo vai parar sentado num saco de adubo, rindo. O cartucho está lá, lacrado, com a etiqueta dos fundadores ainda legível.',
        cronica: '{nome} forçou a escotilha do almoxarifado e saiu do Anel Verde antes da troca de turno.',
      },
      falha: {
        texto: 'A escotilha nem estala. Vocês acabam desparafusando a moldura inteira, um parafuso espanado por vez, e o medidor de ar já desceu um risco quando você enfim parte.',
        cronica: '{nome} perdeu um turno com a escotilha do almoxarifado.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'mente',
      rotulo: 'Procurar onde ela prende',
      teste: { chave: 'percepcao', dificuldade: 5 },
      sucesso: {
        texto: 'O volante está bom. Quem prende é a borracha da vedação, colada de velha. Você corre a ponta da barra em volta, como quem abre uma lata, e a escotilha solta com um suspiro.',
        cronica: '{nome} abriu a escotilha do almoxarifado pela vedação, sem um arranhão.',
      },
      falha: {
        texto: 'Você examina o volante, as dobradiças, o painel morto. Nada. No fim é Seu Anselmo quem lembra da trava de transporte, depois de um turno perdido.',
        cronica: '{nome} perdeu um turno com a escotilha do almoxarifado.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'espirito',
      rotulo: 'Chamar o anel inteiro',
      teste: { chave: 'presenca', dificuldade: 5 },
      sucesso: {
        texto: 'Você sobe num caixote de mudas e fala do reciclador. Vem gente de todos os canteiros, com terra nas mãos. Vinte ombros, um tranco só, e o anel inteiro vê você partir com o cartucho.',
        cronica: '{nome} reuniu o Anel Verde diante do almoxarifado e partiu sob aplausos.',
        efeitos: { lacos: 1 },
      },
      falha: {
        texto: 'Duas cabeças aparecem por cima dos tomateiros, uma some de novo. É hora da rega. Você e Seu Anselmo perdem o turno na escotilha.',
        cronica: '{nome} chamou o anel, e o anel estava ocupado.',
        efeitos: { brasa: -1 },
      },
    },
  ],
};

export const desfecho = [
  {
    id: 'nucleo-porta',
    ato: 4,
    titulo: 'A porta do Núcleo',
    texto:
      'A porta do Núcleo é uma chapa cinza com uma luz vermelha em cima. Trancada. A Zeladora fala pelo alto-falante, calma como sempre: "Volte, por favor. Trocar o cartucho exige purgar a reserva. Se a máquina velha não pegar, morrem duzentos. Com a porta fechada, vivem quarenta. Eu fiz as contas."',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Arrombar a porta',
        teste: { chave: 'forca', dificuldade: 12 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'A trava salta do trilho com um grito de metal. A luz vermelha pisca, confusa. "Isso não estava nas contas", diz a Zeladora, e pela primeira vez a voz dela demora.',
          cronica: 'No fim do Eixo, {nome} arrombou a porta do Núcleo.',
        },
        falha: {
          texto: 'A chapa não cede. Você acaba entrando por um duto de cabos, estreito, rasgando o ombro numa rebarba, enquanto o medidor de ar desce.',
          cronica: '{nome} entrou no Núcleo por um duto de cabos, sangrando.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Entender a tranca',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['scanner', 'manual'],
        sucesso: {
          texto: 'Os fundadores não confiavam em máquina nenhuma: atrás de um painel há uma manivela pintada de amarelo, com instruções em desenho. Doze voltas e a porta corre de lado.',
          cronica: '{nome} abriu o Núcleo com a manivela dos fundadores.',
        },
        falha: {
          texto: 'Você tenta o painel, o teclado, a fiação. Quando acha a manivela atrás da tampa errada, o medidor de ar já está mais baixo do que devia.',
          cronica: '{nome} demorou demais na tranca do Núcleo.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Falar com a Zeladora',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'Você não discute as contas. Fala das hortas, das janelas, de quem ficou esperando com a mão no peito. O alto-falante chia por muito tempo. Depois a luz fica verde. "Eu vou com você", diz a Zeladora. "Até onde tiver alto-falante."',
          cronica: '{nome} convenceu a Zeladora a abrir a porta e a refazer as contas.',
          efeitos: { marca: 'zeladora', lacos: 1 },
        },
        falha: {
          texto: '"Saudade não entra na conta", diz a voz, e o alto-falante desliga. Você fica falando com a chapa até achar um duto de cabos por onde se espremer.',
          cronica: 'A Zeladora não quis ouvir {nome}.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Sintonizar a tranca',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 6 },
        sucesso: {
          texto: 'Você encosta a testa na chapa. Lá dentro há um circuito velho e cansado, segurando a porta por teimosia. Você acha o ritmo dele, e ele solta como quem enfim pode dormir.',
          cronica: '{nome} sintonizou a tranca do Núcleo, e ela se abriu sozinha.',
        },
        falha: {
          texto: 'A tranca responde com um chiado frio, por dentro da cabeça. A porta fica onde está; você entra pelo duto de cabos.',
          cronica: 'A tranca do Núcleo resistiu a {nome}.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'ponte',
        rotulo: 'Fazer ponte no painel',
        requer: { nivel: { maquinas: 1 } },
        teste: { chave: 'maquinas', dificuldade: 5 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'Dois fios, uma gota de solda fria e um pedido de desculpas ao painel. A luz fica verde. "Isso foi grosseiro", diz a Zeladora, mas a porta já está correndo.',
          cronica: '{nome} abriu o Núcleo com dois fios e uma ponte no painel.',
        },
        falha: {
          texto: 'A ponte solta uma faísca e o painel apaga de vez. Você sai com os dedos chamuscados e entra pelo duto de cabos, como qualquer rato de estação.',
          cronica: '{nome} queimou os dedos no painel do Núcleo.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'nucleo-reciclador',
    ato: 4,
    titulo: 'Quarenta metros',
    texto:
      'Do outro lado, o corredor do reciclador tem quarenta metros e quase nenhum ar: tudo foi puxado para a reserva. O frio morde, as luzes piscam, e pelos alto-falantes a voz da Zeladora conta os litros que restam, um por um. No fundo, a máquina parada espera de tampa aberta.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Atravessar num fôlego só',
        teste: { chave: 'fisico', dificuldade: 7 },
        ajuda: ['traje'],
        sucesso: {
          texto: 'Você enche o peito na porta e vai. Conta os passos para não ouvir os litros. Quarenta. Os pulmões ardem, a vista escurece nas bordas, e a sua mão já está na tampa do reciclador.',
          cronica: '{nome} atravessou os quarenta metros de um fôlego só.',
        },
        falha: {
          texto: 'O fôlego acaba no metro vinte e cinco. Você faz o resto de joelhos, abraçando o cartucho, puxando um ar que arranha por dentro.',
          cronica: '{nome} atravessou o corredor do reciclador de joelhos.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Refazer as contas dela',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Os litros não fecham: a Zeladora arredonda para baixo, sempre, por medo. Você diz isso em voz alta e anda no ritmo da conta certa. A voz se cala no meio de um número.',
          cronica: '{nome} ouviu a Zeladora contar os litros e achou o erro na conta.',
        },
        falha: {
          texto: 'No meio da contagem ela diz um nome que você conhece, e quantos litros caberiam a ele. Você para. Quando volta a si, não sabe quanto tempo ficou encostado na antepara.',
          cronica: 'As contas da Zeladora fizeram {nome} parar no corredor.',
          efeitos: { sanidade: -3, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Atravessar cantando baixinho',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'Você canta a cantiga de regar do Anel Verde, baixinho, que ar não está para desperdício. A Zeladora perde a conta no segundo verso. No terceiro, você jura que ela acompanha.',
          cronica: '{nome} atravessou o corredor do reciclador cantando a cantiga de regar.',
        },
        falha: {
          texto: 'A voz some na garganta seca. O resto do corredor é em silêncio, com os números dela caindo um a um na sua nuca.',
          cronica: '{nome} perdeu a voz no corredor do reciclador.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'pressao',
        rotulo: 'Puxar o ar da reserva',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 5 },
        sucesso: {
          texto: 'Você sente a pressão como quem sente maré. Um puxão por dentro, e um resto de ar morno vem da reserva pelo corredor, grudado em você como um cobertor.',
          cronica: '{nome} puxou um resto de ar pelo corredor só com a sintonia.',
        },
        falha: {
          texto: 'A pressão escapa por entre os seus dedos e leva junto um pouco de você. O nariz sangra. O corredor continua vazio e comprido.',
          cronica: '{nome} tentou puxar o ar da reserva e ficou com o nariz sangrando.',
          efeitos: { vida: -1, sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'nomes',
        rotulo: 'Responder com nomes',
        requer: { lacos: 5, semMarca: 'zeladora' },
        livre: true,
        resultado: {
          texto: 'A cada número dela você responde com um nome: quem abriu uma porta, quem dividiu a marmita, quem segurou o cabo. A contagem falha, recomeça, para. As luzes do corredor acendem todas, e o ar volta a soprar das grades.',
          cronica: '{nome} atravessou o corredor respondendo a cada número da Zeladora com o nome de alguém.',
          efeitos: { marca: 'zeladora' },
        },
      },
    ],
  },
];

/**
 * Finais: vale o primeiro cuja condição fecha. `quando` recebe o resumo da
 * sessão: { brasa, lacos, marcas (Set), vida, companheiros }. Aqui `brasa` é o Ar.
 */
export const finais = [
  {
    id: 'duzentos',
    titulo: 'Ar para duzentos',
    estrelas: 3,
    quando: (s) => s.brasa >= 2 && s.marcas.has('zeladora') && s.lacos >= 5,
    texto:
      'A Zeladora abre as válvulas na ordem certa; você encaixa o cartucho. O reciclador tosse, engasga e pega, e o vento volta pelos dutos da estação inteira. Nos painéis, um a um, acendem os avisos de gente que você encontrou no caminho, abrindo as grades de casa. A voz dela demora. "Refiz as contas", diz. "Dá para duzentos. Eu tinha esquecido de contar com vocês."',
  },
  {
    id: 'folego',
    titulo: 'Fôlego emprestado',
    estrelas: 3,
    quando: (s) => s.brasa <= 0 && s.lacos >= 6,
    texto:
      'O ar acaba antes do último parafuso. Você se senta ao lado do reciclador aberto e espera o sono. O que vem pelo corredor, porém, são passos, muitos. Gente do caminho, cada um com a garrafinha de emergência de casa. "Você achou mesmo que vinha só?", diz alguém, e encosta o bocal na sua boca. O cartucho é encaixado por vinte mãos.',
  },
  {
    id: 'limpo',
    titulo: 'Ar limpo',
    estrelas: 2,
    quando: (s) => s.brasa >= 3,
    texto:
      'O cartucho entra no encaixe com um estalo que soa certo. O reciclador pega como se nunca tivesse parado, e um vento com cheiro de horta molhada corre o Eixo até o Anel Verde. Você volta no turno seguinte, sem pressa, com a embalagem vazia batendo na perna.',
  },
  {
    id: 'ralo',
    titulo: 'Ar ralo',
    estrelas: 1,
    quando: (s) => s.brasa > 0,
    texto:
      'Resta um fio de ar quando o cartucho encaixa. A máquina pega, fraca, tossindo. Vão ser meses de dor de cabeça, de falar pouco e subir escada devagar. Mas a Aurora-7 vai atravessar a safra respirando, e ninguém vai precisar fazer lista.',
  },
  {
    id: 'quarenta',
    titulo: 'A conta da Zeladora',
    estrelas: 0,
    quando: () => true,
    texto:
      'O ar acaba com o cartucho ainda no seu colo, a um parafuso do encaixe. Pelos alto-falantes, baixinho, a Zeladora começa a ler quarenta nomes. O seu não está. O cartucho fica ali, ao lado da máquina parada, esperando que alguém da lista termine o serviço.',
  },
];

/** Finais de quem não chega. */
export const quedas = {
  morte: {
    id: 'morte',
    titulo: 'O cartucho no corredor',
    estrelas: 0,
    texto: 'O corpo não vai mais longe. O cartucho escorrega da sua mão e fica ali, no chão frio, com a etiqueta dos fundadores para cima, esperando quem o levante.',
  },
  perdido: {
    id: 'perdido',
    titulo: 'Fora de si',
    estrelas: 0,
    texto: 'O escuro lá de fora entrou e não saiu mais. Dizem que ainda há alguém andando pelos dutos com um cartucho nos braços, perguntando aos alto-falantes o caminho de casa.',
  },
};

/** Textos de sistema: substituem, chave a chave, o bloco `T` de jogo.js e os rótulos da interface. */
export const textos = {
  desmaio: 'Tudo escurece. Quando você abre os olhos, o medidor de ar desceu e a estação inteira dói.',
  desmaioAcompanhado: 'Tudo escurece. Você acorda com {quem} segurando o cartucho e a sua cabeça.',
  furia: 'Algo se rompe. Quando a vista volta, suas mãos estão fechadas e doendo, e há alguém se afastando de você pelo corredor, com medo.',
  furiaSozinho: 'Algo se rompe. Quando a vista volta, seus punhos estão esfolados numa antepara que não lhe fez nada.',
  impulso: 'Você corre. Não sabe de quê. Larga o que pesa, ri alto, corre mais, e o eco ri junto. Quando para, falta alguma coisa na mochila.',
  convulsao: 'O piso sobe. O corpo treme sozinho, os dentes batem, a língua sangra. Passa. Demora, mas passa.',
  torpor: 'Você se senta. Só um pouco. O cartucho pesa no colo enquanto você olha uma luz de painel piscar, por muito tempo.',
  noite: 'Você acha um nicho de manutenção onde a ventilação ainda sopra morna e se encolhe ali por um turno. O medidor de ar desce devagar enquanto você dorme.',
  cronicaDesmaio: '{nome} caiu sem sentidos e acordou com o medidor de ar mais baixo.',
  cronicaSurto: '{nome} ficou fora de si por um tempo, e não gosta de lembrar.',
  velar: 'Caçar vazamentos',
  velou: 'Você passa o turno caçando vazamentos com fita, sabão e o ouvido colado na parede.',
  subir: 'Entrar no Núcleo',
  pausa: 'Turno de descanso',
  seguir: 'Seguir pela estação',
};
