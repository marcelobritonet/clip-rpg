/**
 * The Last Ember: shared catalogue (items, companions, enemies), the opening
 * scene, the Beacon scenes and the endings. The act scenes live in ato1.js,
 * ato2.js and ato3.js.
 */

export const itens = {
  // Objects that help on tests: the modifier adds levels.
  peDeCabra: { nome: 'Crowbar', mod: 2, tipo: 'objeto', tags: ['alavanca'] },
  corda: { nome: 'Rope', mod: 1, tipo: 'objeto', tags: ['corda'] },
  lamparina: { nome: 'Oil Lamp', mod: 1, tipo: 'objeto', tags: ['luz'] },
  mapa: { nome: 'Old Map', mod: 1, tipo: 'objeto', tags: ['mapa'] },
  isca: { nome: 'Bag of Bait', mod: 1, tipo: 'objeto', tags: ['isca'] },
  flauta: { nome: 'Bone Flute', mod: 1, tipo: 'objeto', tags: ['musica'] },
  amuleto: { nome: 'Bell Charm', mod: 1, tipo: 'objeto', tags: ['amuleto'] },
  manto: { nome: 'Wool Cloak', mod: 1, tipo: 'objeto', tags: ['agasalho'] },
  lente: { nome: 'Glass Lens', mod: 1, tipo: 'objeto', tags: ['lente'] },
  almanaque: { nome: 'Valley Almanac', mod: 1, tipo: 'objeto', tags: ['livro'] },
  ervas: { nome: 'Bundle of Herbs', mod: 1, tipo: 'objeto', tags: ['remedio'] },
  // Weapons, armour and shield: used in combat and counted against Strength.
  faca: { nome: 'Knife', mod: 0, tipo: 'arma' },
  cajado: { nome: 'Staff', mod: 0, tipo: 'arma' },
  espadaCurta: { nome: 'Short Sword', mod: 1, tipo: 'arma' },
  machado: { nome: 'Woodcutter\'s Axe', mod: 2, tipo: 'arma' },
  funda: { nome: 'Sling', mod: 0, tipo: 'arma', longa: true },
  arco: { nome: 'Hunting Bow', mod: 1, tipo: 'arma', longa: true },
  escudo: { nome: 'Plank Shield', mod: 1, tipo: 'escudo' },
  gibao: { nome: 'Leather Jerkin', mod: 1, tipo: 'armadura' },
  // Consumables: used once, outside combat.
  unguento: { nome: 'Salve', tipo: 'consumivel', cura: { vida: '1d6' } },
  cha: { nome: 'Balm Tea', tipo: 'consumivel', cura: { sanidade: '1d6' } },
};

export const companheiros = {};

export const inimigos = {};

export const abertura = {
  id: 'paiol',
  ato: 0,
  titulo: 'The Storehouse Door',
  efeitosAoEntrar: { item: 'peDeCabra' },
  texto:
    'The fire at the High Beacon has died, and without it the Long Night comes down the valley. Someone has to carry an ember from the hearth in Bellford all the way up there. That someone is you. The ember lantern is in the storehouse, behind a thick wooden door the rain has swollen shut. Otto, your neighbour, holds out a crowbar and rolls up his sleeves.',
  abordagens: [
    {
      id: 'forca',
      rotulo: 'Break down the door',
      teste: { chave: 'forca', dificuldade: 10 },
      ajuda: ['alavanca'],
      ajudantes: [{ nome: 'Otto', nivel: 1 }],
      sucesso: {
        texto: 'The wood groans, cracks and gives all at once. Otto lands on his backside, laughing. The lantern is there, unharmed, smelling of old oil.',
        cronica: '{nome} broke down the storehouse door and left Bellford before noon.',
      },
      falha: {
        texto: 'The door does not so much as shiver. The two of you spend the morning digging out the sill until it opens a hand\'s width, and the ember has been burning for hours by the time you finally set off.',
        cronica: '{nome} lost the morning to the storehouse door.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'mente',
      rotulo: 'Find where it sticks',
      teste: { chave: 'percepcao', dificuldade: 5 },
      sucesso: {
        texto: 'It is not the lock. It is the hinge pins, nearly loose with rust. Two taps of the crowbar and the door comes away whole, like a lid.',
        cronica: '{nome} took the storehouse door off by its pins, without a scratch.',
      },
      falha: {
        texto: 'You study the lock, the sill, the frame. Nothing. In the end it is Otto who finds the rotten plank, after a wasted morning.',
        cronica: '{nome} lost the morning to the storehouse door.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'espirito',
      rotulo: 'Call the whole village',
      teste: { chave: 'presenca', dificuldade: 5 },
      sucesso: {
        texto: 'You climb onto the trough and speak of the Beacon. People come out of every door. Twenty shoulders, a single shove, and the whole village watches you leave with the lantern.',
        cronica: '{nome} gathered all of Bellford at the storehouse door and set off to applause.',
        efeitos: { lacos: 1 },
      },
      falha: {
        texto: 'Two windows open. One closes. Nobody comes. You and Otto lose the morning on the doorstep.',
        cronica: '{nome} called the village, and the village did not come.',
        efeitos: { brasa: -1 },
      },
    },
  ],
};

export const desfecho = [
  {
    id: 'farol-porta',
    ato: 4,
    titulo: 'The Beacon Door',
    texto:
      'The High Beacon is a black tower against a sky without a star. The iron door is bolted from the inside. Through the crack, an old voice: "Go away. I let the fire die. Light also calls what lives in the dark."',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Force the iron door',
        teste: { chave: 'forca', dificuldade: 12 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'The bolt jumps from the frame with a scream of metal. The old man backs toward the stairs without a fight, his eyes on the lantern in your hand.',
          cronica: 'At the top, {nome} forced the iron door of the Beacon.',
        },
        falha: {
          texto: 'The iron will not give. You end up squeezing in through a narrow arrow slit, tearing your shoulder on the stone while the ember dwindles.',
          cronica: '{nome} entered the Beacon through an arrow slit, bleeding.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Work out the lock',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['lente', 'livro'],
        sucesso: {
          texto: 'The lock is a counterweight. Whoever made it meant it to open from outside, given the right weight on the ring. A stone, a knot, and the iron turns by itself.',
          cronica: '{nome} opened the Beacon with a stone and a knot.',
        },
        falha: {
          texto: 'You try the ring, the chain, the hinge. By the time the counterweight finally drops, the lantern weighs less than it should.',
          cronica: '{nome} took too long over the Beacon lock.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Talk to the Keeper',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'You do not argue. You tell him about the valley, the windows, the people left waiting. The silence lasts a long time. Then the bolt slides back. "I\'ll climb with you," says the old man.',
          cronica: '{nome} persuaded the Keeper to open the door and climb along.',
          efeitos: { marca: 'faroleiro' },
        },
        falha: {
          texto: '"Words," says the voice, and moves away. You go on talking to the iron until you find an arrow slit to squeeze through.',
          cronica: 'The Keeper would not listen to {nome}.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
      },
      {
        id: 'encanto',
        rotulo: 'Undo the door\'s seal',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 6 },
        sucesso: {
          texto: 'There is an enchantment on the lock, old and tired. You pull the right thread and it comes apart like frost in the sun.',
          cronica: '{nome} undid the enchantment that sealed the Beacon.',
        },
        falha: {
          texto: 'The enchantment bites back, cold, inside your head. The door stays where it is. You go in through the arrow slit.',
          cronica: 'The Beacon\'s enchantment held against {nome}.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'farol-chama',
    ato: 4,
    titulo: 'Three Hundred Steps',
    texto:
      'The stair winds up through the dark. With every turn the Long Night leans closer: it whispers your name, promises rest, asks only that you stop a little while. At the top, the cold brazier waits.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Climb without stopping',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'You count the steps out loud so you hear nothing else. Three hundred. The air up there cuts, and it is the cleanest air you have ever breathed.',
          cronica: '{nome} climbed the three hundred steps in a single breath.',
        },
        falha: {
          texto: 'Your legs give out on turn two hundred. You climb the rest on your knees, shielding the lantern with your body.',
          cronica: '{nome} went up the Beacon on hands and knees.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Disbelieve the voices',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'The voices know your name and get everything else wrong. A badly told lie. You climb smiling, and they fall silent out of shame.',
          cronica: '{nome} heard the Long Night lie and did not believe it.',
        },
        falha: {
          texto: 'One of the voices sounds just like someone you lost. You stop. When you come back to yourself, you cannot tell how long you have been sitting on the step.',
          cronica: 'The Long Night made {nome} stop on the stairs.',
          efeitos: { sanidade: -3, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Climb singing',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'You sing the Bellford lullaby, loud and off key. The dark backs down one step per verse.',
          cronica: '{nome} climbed the Beacon singing.',
        },
        falha: {
          texto: 'Your voice dies in your throat. The rest of the climb is silent, with the dark breathing in your ear.',
          cronica: '{nome} lost all voice on the Beacon stairs.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'velho',
        rotulo: 'Tell him who you met',
        requer: { lacos: 5, semMarca: 'faroleiro' },
        livre: true,
        resultado: {
          texto: 'The Keeper climbs behind you, saying nothing. You talk about the road: every face, every door that opened. On the last flight he steps ahead of you and takes hold of the brazier with both hands.',
          cronica: '{nome} climbed the Beacon telling the old man the names of everyone met along the way.',
          efeitos: { marca: 'faroleiro' },
        },
      },
    ],
  },
];

/**
 * Endings: the first one whose condition holds wins. `quando` is declared as data
 * (see `fechaFinal` in jogo.js); the last one has no condition.
 */
export const finais = [
  {
    id: 'muitos',
    titulo: 'A Beacon of Many',
    estrelas: 3,
    quando: { brasa: { min: 2 }, marca: 'faroleiro', lacos: { min: 5 } },
    texto:
      'The Keeper holds the brazier and you lay the ember down. The fire catches slowly and then all at once, and the light sweeps the valley. Down below, one by one, windows answer: people you met on the road, lighting whatever they have. The old man weeps and does not hide it. "It isn\'t one light," he says. "It\'s many."',
  },
  {
    id: 'emprestado',
    titulo: 'Borrowed Fire',
    estrelas: 3,
    quando: { brasa: { max: 0 }, lacos: { min: 6 } },
    texto:
      'The lantern arrives cold. You sit down beside the dead brazier and wait for the Long Night. What comes up the stairs, though, is footsteps, a great many. People from the road, each with an ember from their own hearth. "You didn\'t think you were going alone," someone says. The Beacon is lit with fire from the whole valley.',
  },
  {
    id: 'aceso',
    titulo: 'The Beacon Lit',
    estrelas: 2,
    quando: { brasa: { min: 3 } },
    texto:
      'The ember is still alive, fat and bright, when it touches the kindling. The High Beacon lights as if it had never gone out, and the Long Night draws back behind the mountains. You walk down the next day, in no hurry, with the empty lantern knocking against your leg.',
  },
  {
    id: 'fraca',
    titulo: 'A Faint Light',
    estrelas: 1,
    quando: { brasa: { min: 1 } },
    texto:
      'One red speck is left at the bottom of the lantern. You blow, you shelter it, you pray. The fire catches, small. It is not the beacon from the stories, but it is a light, and the valley below will cross the winter looking up at it.',
  },
  {
    id: 'cinza',
    titulo: 'Ash',
    estrelas: 0,
    texto:
      'The lantern arrives cold. In the brazier, only old ash. You sit at the top of the tower and watch the Long Night come down over Bellford like a tide. Someone will have to try again. Maybe you.',
  },
];

/** Endings for those who never arrive. */
export const quedas = {
  morte: {
    id: 'morte',
    titulo: 'The Lantern in the Snow',
    estrelas: 0,
    texto: 'Your body will go no further. The lantern rolls out of your hand and lies there, still lit for a while, waiting for someone to pick it up.',
  },
  perdido: {
    id: 'perdido',
    titulo: 'No Longer Yourself',
    estrelas: 0,
    texto: 'The Long Night got in and never left. They say there is still someone wandering the slope with a dead lantern, asking the way home.',
  },
};
