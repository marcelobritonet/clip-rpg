/**
 * Thin Air: shared catalogue (items, companions, enemies), the opening scene,
 * the Core scenes, the endings and the system texts. The act scenes live in
 * ato1.js, ato2.js and ato3.js. The journey's clock is the Air, which under
 * the hood is still the `brasa` effect (0 to 10).
 */

export const itens = {
  // Objects that help on tests: the modifier adds levels (manual, Situation 4).
  barra: { nome: 'Pry Bar', mod: 2, tipo: 'objeto', tags: ['alavanca'] },
  cabo: { nome: 'Tether Cable', mod: 1, tipo: 'objeto', tags: ['cabo'] },
  lanterna: { nome: 'Head Torch', mod: 1, tipo: 'objeto', tags: ['luz'] },
  planta: { nome: 'Station Blueprint', mod: 1, tipo: 'objeto', tags: ['mapa'] },
  racao: { nome: 'Bag of Feed', mod: 1, tipo: 'objeto', tags: ['isca'] },
  gaita: { nome: 'Harmonica', mod: 1, tipo: 'objeto', tags: ['musica'] },
  medalha: { nome: 'Founders\' Medal', mod: 1, tipo: 'objeto', tags: ['amuleto'] },
  traje: { nome: 'Patched Pressure Suit', mod: 1, tipo: 'objeto', tags: ['traje'] },
  leitor: { nome: 'Diagnostic Reader', mod: 1, tipo: 'objeto', tags: ['scanner'] },
  manual: { nome: 'Founders\' Manual', mod: 1, tipo: 'objeto', tags: ['manual'] },
  maleta: { nome: 'Medical Kit', mod: 1, tipo: 'objeto', tags: ['remedio'] },
  ferramentas: { nome: 'Tool Kit', mod: 1, tipo: 'objeto', tags: ['ferramenta'] },
  botas: { nome: 'Magnetic Boots', mod: 1, tipo: 'objeto', tags: ['ima'] },
  fita: { nome: 'Patch Tape', mod: 1, tipo: 'objeto', tags: ['remendo'] },
  fichas: { nome: 'Trade Chits', mod: 1, tipo: 'objeto', tags: ['troca'] },
  // Improvised weapons, armour and shield: used in combat and counted against Strength.
  estilete: { nome: 'Cargo Knife', mod: 0, tipo: 'arma' },
  bisturi: { nome: 'Scalpel', mod: 0, tipo: 'arma' },
  chaveDeGrifo: { nome: 'Pipe Wrench', mod: 1, tipo: 'arma' },
  marreta: { nome: 'Dock Sledgehammer', mod: 2, tipo: 'arma' },
  sinalizador: { nome: 'Flare Gun', mod: 0, tipo: 'arma', longa: true },
  rebitadeira: { nome: 'Rivet Gun', mod: 1, tipo: 'arma', longa: true },
  tampa: { nome: 'Hatch Cover', mod: 1, tipo: 'escudo' },
  colete: { nome: 'Cargo Vest', mod: 1, tipo: 'armadura' },
  // Consumables: used once, outside combat.
  gel: { nome: 'Healing Gel', tipo: 'consumivel', cura: { vida: '1d6' } },
  cha: { nome: 'Calming Tea', tipo: 'consumivel', cura: { sanidade: '1d6' } },
};

export const companheiros = {};

export const inimigos = {};

export const abertura = {
  id: 'escotilha',
  ato: 0,
  titulo: 'The Storeroom Hatch',
  efeitosAoEntrar: { item: 'barra' },
  texto:
    'The main recycler on Aurora-7 has stopped, and the air of two hundred people is down to a matter of hours. The only spare catalyst cartridge is here in the Green Ring, on the far side from the Core, and someone has to cross the station with it. That someone is you. The cartridge sleeps in the storeroom, behind a hatch that seized up two harvests ago. Old Anselmo holds out a pry bar and spits on his hands.',
  abordagens: [
    {
      id: 'forca',
      rotulo: 'Force the hatch',
      teste: { chave: 'forca', dificuldade: 10 },
      ajuda: ['alavanca'],
      ajudantes: [{ nome: 'Old Anselmo', nivel: 1 }],
      sucesso: {
        texto: 'The wheel groans, sheds rust and spins all at once. Old Anselmo ends up sitting on a sack of fertiliser, laughing. The cartridge is there, sealed, the founders\' label still legible.',
        cronica: '{nome} forced the storeroom hatch and left the Green Ring before the shift change.',
      },
      falha: {
        texto: 'The hatch does not so much as click. The two of you end up unscrewing the whole frame, one stripped bolt at a time, and the air gauge has already dropped a mark by the time you finally set off.',
        cronica: '{nome} lost a shift to the storeroom hatch.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'mente',
      rotulo: 'Find where it sticks',
      teste: { chave: 'percepcao', dificuldade: 5 },
      sucesso: {
        texto: 'The wheel is fine. What holds it is the rubber seal, glued fast with age. You run the tip of the bar around it, like opening a tin, and the hatch lets go with a sigh.',
        cronica: '{nome} opened the storeroom hatch by its seal, without a scratch.',
      },
      falha: {
        texto: 'You go over the wheel, the hinges, the dead panel. Nothing. In the end it is Old Anselmo who remembers the transport lock, after a wasted shift.',
        cronica: '{nome} lost a shift to the storeroom hatch.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'espirito',
      rotulo: 'Call the whole ring',
      teste: { chave: 'presenca', dificuldade: 5 },
      sucesso: {
        texto: 'You climb onto a crate of seedlings and speak of the recycler. People come from every bed, with soil on their hands. Twenty shoulders, a single heave, and the whole ring watches you leave with the cartridge.',
        cronica: '{nome} gathered the Green Ring at the storeroom and set off to applause.',
        efeitos: { lacos: 1 },
      },
      falha: {
        texto: 'Two heads appear above the tomato vines. One goes back down. It is watering time. You and Old Anselmo lose the shift at the hatch.',
        cronica: '{nome} called the ring, and the ring was busy.',
        efeitos: { brasa: -1 },
      },
    },
  ],
};

export const desfecho = [
  {
    id: 'nucleo-porta',
    ato: 4,
    titulo: 'The Core Door',
    texto:
      'The Core door is a grey plate with a red light above it. Locked. The Caretaker speaks through the loudspeaker, calm as ever: "Go back, please. Changing the cartridge means purging the reserve. If the old machine does not catch, two hundred die. With the door shut, forty live. I have done the sums."',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Break the door open',
        teste: { chave: 'forca', dificuldade: 12 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'The lock jumps its rail with a shriek of metal. The red light blinks, confused. "That was not in the sums," says the Caretaker, and for the first time her voice is slow to come.',
          cronica: 'At the end of the Spine, {nome} broke open the Core door.',
        },
        falha: {
          texto: 'The plate does not give. You end up going in through a cable duct, a narrow one, tearing your shoulder on a burr while the air gauge drops.',
          cronica: '{nome} entered the Core through a cable duct, bleeding.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Work out the lock',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['scanner', 'manual'],
        sucesso: {
          texto: 'The founders did not trust any machine. Behind a panel there is a hand crank painted yellow, with instructions in pictures. Twelve turns and the door slides aside.',
          cronica: '{nome} opened the Core with the founders\' crank.',
        },
        falha: {
          texto: 'You try the panel, the keypad, the wiring. By the time you find the crank behind the wrong cover, the air gauge is lower than it ought to be.',
          cronica: '{nome} took too long over the Core lock.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Talk to the Caretaker',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'You do not argue with the sums. You speak of the gardens, of the windows, of the people left waiting with a hand on their chest. The loudspeaker hisses for a long time. Then the light turns green. "I am coming with you," says the Caretaker. "As far as there are loudspeakers."',
          cronica: '{nome} persuaded the Caretaker to open the door and do the sums again.',
          efeitos: { marca: 'zeladora', lacos: 1 },
        },
        falha: {
          texto: '"Missing people does not go into the sums," says the voice, and the loudspeaker cuts out. You go on talking to the plate until you find a cable duct to squeeze through.',
          cronica: 'The Caretaker would not listen to {nome}.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Attune to the lock',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 6 },
        sucesso: {
          texto: 'You rest your forehead against the plate. Inside there is an old, tired circuit, holding the door out of sheer stubbornness. You find its rhythm, and it lets go like something finally allowed to sleep.',
          cronica: '{nome} attuned to the Core lock, and it opened by itself.',
        },
        falha: {
          texto: 'The lock answers with a cold hiss, inside your head. The door stays where it is. You go in through the cable duct.',
          cronica: 'The Core lock held out against {nome}.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'ponte',
        rotulo: 'Bridge the panel',
        requer: { nivel: { maquinas: 1 } },
        teste: { chave: 'maquinas', dificuldade: 5 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'Two wires, a drop of cold solder and an apology to the panel. The light turns green. "That was rude," says the Caretaker, but the door is already sliding.',
          cronica: '{nome} opened the Core with two wires and a bridge across the panel.',
        },
        falha: {
          texto: 'The bridge throws a spark and the panel goes dark for good. You come away with singed fingers and go in through the cable duct, like any station rat.',
          cronica: '{nome} burned a few fingers on the Core panel.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'nucleo-reciclador',
    ato: 4,
    titulo: 'Forty Metres',
    texto:
      'On the other side, the recycler corridor is forty metres long and holds almost no air: all of it has been drawn into the reserve. The cold bites, the lights flicker, and through the loudspeakers the Caretaker\'s voice counts the litres that remain, one by one. At the far end, the stopped machine waits with its cover open.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Cross on one breath',
        teste: { chave: 'fisico', dificuldade: 7 },
        ajuda: ['traje'],
        sucesso: {
          texto: 'You fill your chest at the door and go. You count your steps so as not to hear the litres. Forty. Your lungs burn, your sight darkens at the edges, and your hand is already on the recycler\'s cover.',
          cronica: '{nome} crossed the forty metres on a single breath.',
        },
        falha: {
          texto: 'The breath runs out at metre twenty-five. You do the rest on your knees, hugging the cartridge, dragging in an air that scrapes on the way down.',
          cronica: '{nome} crossed the recycler corridor on both knees.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Do her sums again',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'The litres do not add up: the Caretaker rounds down, always, out of fear. You say so out loud and walk in time with the right sum. The voice falls silent in the middle of a number.',
          cronica: '{nome} heard the Caretaker count the litres and found the mistake in the sum.',
        },
        falha: {
          texto: 'Halfway through the count she says a name you know, and how many litres would fall to it. You stop. When you come back to yourself, you cannot tell how long you have been leaning on the bulkhead.',
          cronica: 'The Caretaker\'s sums stopped {nome} dead in the corridor.',
          efeitos: { sanidade: -3, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Cross singing softly',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'You sing the Green Ring\'s watering song, softly, since air is not for wasting. The Caretaker loses count in the second verse. By the third, you would swear she is singing along.',
          cronica: '{nome} crossed the recycler corridor singing the watering song.',
        },
        falha: {
          texto: 'The voice dies in your dry throat. The rest of the corridor passes in silence, with her numbers dropping one by one on the back of your neck.',
          cronica: '{nome} lost all voice in the recycler corridor.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'pressao',
        rotulo: 'Draw air from the reserve',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 5 },
        sucesso: {
          texto: 'You feel the pressure the way some people feel a tide. One pull from the inside, and a remnant of warm air comes down the corridor from the reserve, clinging to you like a blanket.',
          cronica: '{nome} drew a remnant of air down the corridor by attunement alone.',
        },
        falha: {
          texto: 'The pressure slips between your fingers and takes a little of you with it. Your nose bleeds. The corridor is still empty, and still long.',
          cronica: '{nome} tried to draw air from the reserve and came away with a nosebleed.',
          efeitos: { vida: -1, sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'nomes',
        rotulo: 'Answer with names',
        requer: { lacos: 5, semMarca: 'zeladora' },
        livre: true,
        resultado: {
          texto: 'To each of her numbers you answer with a name: who opened a door, who shared a lunch tin, who held the cable. The count falters, starts again, stops. Every light in the corridor comes on, and air begins to blow from the grilles once more.',
          cronica: '{nome} crossed the corridor answering each of the Caretaker\'s numbers with somebody\'s name.',
          efeitos: { marca: 'zeladora' },
        },
      },
    ],
  },
];

/**
 * Endings: the first one whose condition holds wins. `quando` is declared as data
 * (see `fechaFinal` in jogo.js); the last one has no condition. Here `brasa` is the Air.
 */
export const finais = [
  {
    id: 'duzentos',
    titulo: 'Air for Two Hundred',
    estrelas: 3,
    quando: { brasa: { min: 2 }, marca: 'zeladora', lacos: { min: 5 } },
    texto:
      'The Caretaker opens the valves in the right order; you seat the cartridge. The recycler coughs, chokes and catches, and the wind comes back through the ducts of the whole station. On the panels, one by one, lights come on for the people you met along the way, opening the grilles at home. Her voice is slow to come. "I have done the sums again," she says. "There is enough for two hundred. I had forgotten to count on all of you."',
  },
  {
    id: 'folego',
    titulo: 'Borrowed Breath',
    estrelas: 3,
    quando: { brasa: { max: 0 }, lacos: { min: 6 } },
    texto:
      'The air runs out before the last bolt. You sit down beside the open recycler and wait for sleep. What comes down the corridor, though, is footsteps, a great many. People from along the way, each with the emergency bottle from home. "Did you really think you had come alone?" someone says, and presses the mouthpiece to your lips. The cartridge is seated by twenty hands.',
  },
  {
    id: 'limpo',
    titulo: 'Clean Air',
    estrelas: 2,
    quando: { brasa: { min: 3 } },
    texto:
      'The cartridge goes into its seat with a click that sounds right. The recycler catches as if it had never stopped, and a wind smelling of watered garden runs the Spine all the way to the Green Ring. You walk back on the next shift, in no hurry, with the empty casing knocking against your leg.',
  },
  {
    id: 'ralo',
    titulo: 'Thin Air',
    estrelas: 1,
    quando: { brasa: { min: 1 } },
    texto:
      'A thread of air is left when the cartridge seats. The machine catches, weakly, coughing. There will be months of headaches, of saying little and taking the stairs slowly. But Aurora-7 will get through the harvest breathing, and nobody will have to draw up a list.',
  },
  {
    id: 'quarenta',
    titulo: 'The Caretaker\'s Sum',
    estrelas: 0,
    texto:
      'The air runs out with the cartridge still in your lap, one bolt short of its seat. Through the loudspeakers, very quietly, the Caretaker begins to read out forty names. Yours is not among them. The cartridge stays there, beside the stopped machine, waiting for someone on the list to finish the job.',
  },
];

/** Endings for those who never arrive. */
export const quedas = {
  morte: {
    id: 'morte',
    titulo: 'The Cartridge in the Corridor',
    estrelas: 0,
    texto: 'The body will go no further. The cartridge slides from your hand and stays there, on the cold floor, with the founders\' label facing up, waiting for someone to lift it.',
  },
  perdido: {
    id: 'perdido',
    titulo: 'No Longer Yourself',
    estrelas: 0,
    texto: 'The dark from outside came in and never left. They say there is still someone walking the ducts with a cartridge in their arms, asking the loudspeakers the way home.',
  },
};

/** System texts: they replace, key by key, the `T` block in jogo.js and the interface labels. */
export const textos = {
  desmaio: 'Everything goes dark. When you open your eyes, the air gauge has dropped and the whole station hurts.',
  desmaioAcompanhado: 'Everything goes dark. You wake to find {quem} holding the cartridge and your head.',
  furia: 'Something snaps. When your sight returns, your hands are clenched and aching, and someone is backing away from you down the corridor, afraid.',
  furiaSozinho: 'Something snaps. When your sight returns, your knuckles are skinned raw on a bulkhead that never did you any harm.',
  impulso: 'You run. From what, you could not say. You drop whatever is heavy, laugh out loud, run some more, and the echo laughs along. When you stop, something is missing from your pack.',
  convulsao: 'The deck comes up. Your body shakes by itself, your teeth rattle, your tongue bleeds. It passes. It takes a while, but it passes.',
  torpor: 'You sit down. Just for a moment. The cartridge weighs on your lap while you watch a panel light blink, for a long time.',
  noite: 'You find a maintenance alcove where the vents still blow warm and curl up there for a shift. The air gauge drops slowly while you sleep.',
  cronicaDesmaio: '{nome} fell senseless and woke to a lower air gauge.',
  cronicaSurto: '{nome} came unmoored for a while, and does not care to remember it.',
  velar: 'Hunt for leaks',
  velou: 'You spend the shift hunting leaks with tape, soapy water and an ear pressed to the wall.',
  subir: 'Enter the Core',
  pausa: 'Rest shift',
  seguir: 'Move on through the station',
};
