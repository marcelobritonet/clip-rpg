/**
 * Thin Air, Act 2: The Docks. Half gravity, noise, grease, people who haul
 * weight and distrust anyone coming from the Green Ring. The first vacuum
 * turns up here, and fear starts to cost Sanity. The clock is the Air (the
 * `brasa` effect).
 */

export const itens = {};

export const companheiros = {
  ar2Icaro: {
    nome: 'Icaro',
    quem: 'a Docks lad who wanted to run away in a pod and now climbs anything for you',
    niveis: { destreza: 2, percepcao: 1 },
  },
  ar2ZeDoze: {
    nome: 'Ze-Twelve',
    quem: 'maintenance robot No. 12, who carries the weight and warns of dangers forty years old',
    niveis: { forca: 2, fisico: 1 },
  },
};

export const inimigos = {
  ar2ZeDozeSoldador: {
    nome: 'Ze-Twelve, torch lit',
    ataque: 1,
    defesa: 2,
    vida: 4,
    arma: 1,
    armadura: 0,
    resistencia: 1,
    reflexo: 0,
    vontade: 0,
    fe: 0,
  },
};

export const cenas = [
  {
    id: 'ar2-comporta',
    ato: 2,
    titulo: 'Bulkhead Door 3',
    texto:
      'Bulkhead Door 3 came down in the middle of the shift and stayed down. That is four tonnes of plate between you and the rest of the Docks, with a hand\'s width of gap underneath and a siren nobody knows how to switch off. Tonho Grease\'s crew looks on with folded arms. "Rationing," he says. "The motor comes back next harvest."',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Lever it up',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        ajudantes: [{ nome: 'Tonho Grease', nivel: 1 }],
        sucesso: {
          texto: 'The bar goes into the gap, Tonho Grease leans a shoulder in out of plain curiosity, and the plate groans up two hand spans. You shove the cartridge under and roll after it. The crew whistles.',
          cronica: '{nome} lifted Bulkhead Door 3 two hand spans and rolled through underneath.',
        },
        falha: {
          texto: 'The plate rises a finger and comes down on the toe of your boot. You pull the foot out in time, nearly. The other way is to take the grille off a cargo duct, screw by screw.',
          cronica: '{nome} lost to Bulkhead Door 3 and limped through a cargo duct.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Find the manual counterweight',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['manual', 'scanner'],
        sucesso: {
          texto: 'Behind a cover painted over three times there is a chain and a drawing of a stick figure pulling. You pull. The counterweight sinks down its shaft, the door rises by itself, and the siren shuts up at last.',
          cronica: '{nome} opened Bulkhead Door 3 with the counterweight the founders left behind.',
        },
        falha: {
          texto: 'You find a chain and pull it with a will. It belonged to the decontamination shower. You come out drenched, frozen, and still bound for the cargo duct, to the sound of laughter.',
          cronica: '{nome} pulled the wrong chain at Bulkhead Door 3 and took a cold shower.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
        critico: {
          texto: 'The door rises without a groan. In the counterweight niche, rolled up in a tube, is the station plan the crew has been hunting for harvests. Tonho Grease scratches the back of his neck. "Take it. You found it."',
          cronica: '{nome} opened Bulkhead Door 3 and found a station plan in the counterweight niche.',
          efeitos: { item: 'planta' },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Get the crew hauling',
        teste: { chave: 'presenca', dificuldade: 6 },
        ajuda: ['troca'],
        sucesso: {
          texto: 'You do not ask for a favour. You tell them where the cartridge is going. Tonho Grease spits to one side, runs a line through the ceiling pulley and bellows the count. Twelve people heave, and the plate goes up.',
          cronica: '{nome} put Tonho Grease\'s crew on a line, and Bulkhead Door 3 went up to the sound of shouting.',
        },
        falha: {
          texto: '"Ring folk are always in a hurry," says Tonho Grease, and the crew goes back to its coffee. You take the cargo duct, dragging the cartridge and your pride.',
          cronica: '{nome} asked the Docks for help and was told the shift was on its coffee break.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'maquinas',
        rotulo: 'Release the motor brake',
        requer: { nivel: { maquinas: 1 } },
        teste: { chave: 'maquinas', dificuldade: 4 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'The motor is sound. It is the brake that locked when the current went. You free the shoe by hand and the door rises on its own counterweight. Tonho Grease asks, quite seriously, whether you want a job.',
          cronica: '{nome} released the brake on Bulkhead Door 3 and was offered a job on the Docks.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The shoe lets go all at once and the plate jumps half a metre before it jams again, crooked. There is room to go through sideways, scraping your ribs and the label on the cartridge.',
          cronica: '{nome} got Bulkhead Door 3 halfway unstuck and went through sideways.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Read the old-tongue plate',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 3 },
        sucesso: {
          texto: 'The plate everyone took for a danger sign says, in the old tongue: "No power, turn the blue wheel." The blue wheel is the crew\'s coat rack. You take the coats off and turn it.',
          cronica: '{nome} read the founders\' plate and opened Bulkhead Door 3 with the crew\'s coat rack.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The paint has flaked off halfway through the sentence, and you turn the wheel the wrong way. The door drops the hand\'s width it had left. That leaves the cargo duct.',
          cronica: '{nome} read half a plate at Bulkhead Door 3 and closed what was left to close.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-zedoze',
    ato: 2,
    titulo: 'The Welder in the Corridor',
    texto:
      'In the service corridor, maintenance robot No. 12 is welding everything that moves. So far he has welded a wheelbarrow to the deck, and a boot, mercifully empty. The blue torch swings round to you. "Attention," says Ze-Twelve, in a voice like worn tape. "Commander\'s inspection at fourteen hundred hours." The commander died forty years ago.',
    abordagens: [
      {
        id: 'lutar',
        rotulo: 'Switch him off by force',
        combate: 'ar2ZeDozeSoldador',
        vitoria: {
          texto: 'The last blow lands on the fuse box. Ze-Twelve bends his knees slowly, like someone sitting down, and the torch goes out. "Inspection postponed," he says, and nothing more.',
          cronica: '{nome} switched Ze-Twelve off with a beating, in the service corridor.',
        },
        derrota: {
          texto: 'The torch sweeps past close and you go over backwards, sleeve smoking, in a smell of burnt cloth. Ze-Twelve loses interest and returns to welding the wheelbarrow.',
          cronica: '{nome} was beaten by a maintenance robot and came away singed.',
          efeitos: { brasa: -1 },
        },
        fuga: {
          texto: 'You back off to the junction and go round through the pipe tunnel, on hands and knees, pushing the cartridge ahead. Behind you, the voice announces the inspection once more.',
          cronica: '{nome} left Ze-Twelve to his welding and went round through the pipes.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Find the master switch',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['scanner', 'luz'],
        sucesso: {
          texto: 'He only looks at what moves. You stand still until you are part of the wall, spot the cover on his back and, on his next turn, reach out two fingers. A click. The torch dies.',
          cronica: '{nome} stood still and waited, then switched Ze-Twelve off at the back.',
        },
        falha: {
          texto: 'The cover you open belongs to the flux tank. Ze-Twelve swings round, offended, and welds your sleeve to the handrail. You leave without the sleeve and with your skin stinging.',
          cronica: '{nome} opened the wrong cover on Ze-Twelve and left a sleeve on the handrail.',
          efeitos: { vida: -2 },
        },
        critico: {
          texto: 'Next to the master switch there is a selector stuck on "works". You push it to "service". Ze-Twelve stows the torch, picks up the cartridge in two arms and asks where the delivery is going.',
          cronica: '{nome} found the right selector, and Ze-Twelve took to carrying the cartridge.',
          efeitos: { companheiro: 'ar2ZeDoze' },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Give the commander\'s order',
        teste: { chave: 'presenca', dificuldade: 7 },
        ajuda: ['manual'],
        sucesso: {
          texto: 'You straighten your back and speak the way nobody has spoken in forty years: "Number twelve. Inspection complete. Escort the cargo." The torch goes out. Ze-Twelve salutes with his gripper and falls in behind.',
          cronica: '{nome} gave the order in the founders\' protocol, and Ze-Twelve took to escorting the cargo.',
          efeitos: { companheiro: 'ar2ZeDoze' },
        },
        falha: {
          texto: '"Voice not authorised," says Ze-Twelve, and says it again, and again, closer each time. You run through under his arm with that sentence stuck to the back of your neck.',
          cronica: '{nome} tried giving Ze-Twelve orders and was told there was no authorisation.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Attune to No. 12',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 4 },
        sucesso: {
          texto: 'Inside him there is a loop: the same afternoon, forty years running, waiting for an inspection. You find the loose end and untie it. Ze-Twelve looks at his own hands. "What time is it?" he asks. And he follows you.',
          cronica: '{nome} attuned to Ze-Twelve and brought him out of an afternoon that had lasted forty years.',
          efeitos: { companheiro: 'ar2ZeDoze', lacos: 1 },
        },
        falha: {
          texto: 'The afternoon of forty years ago walks into your head whole: siren, fresh grease, people long dead hurrying by. When you come back to yourself, you are sitting on the far side of the corridor.',
          cronica: '{nome} attuned to Ze-Twelve and was stuck for a while in that afternoon of his.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-braco',
    ato: 2,
    titulo: 'The Old Arm',
    texto:
      'The crane they call the Old Arm has stopped with its jib stretched out over the dock well, and at the tip of it, twenty metres up, a lad is clinging to the lattice. It is Icaro. He climbed up to reach the emergency pod in the ceiling, the power dropped, and now he can go neither up nor down. In half gravity the fall is slow, but the deck is the same deck.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Throw a line up',
        teste: { chave: 'destreza', dificuldade: 6 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'The line climbs lazily in the half gravity, takes a curve no manual explains and lands in Icaro\'s lap. He ties it round his waist and comes down backwards, apologising at every metre.',
          cronica: '{nome} threw a line to the tip of the Old Arm and brought Icaro down in one piece.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro' },
        },
        falha: {
          texto: 'Three throws, three misses, and the fourth snags in the lattice. Icaro ends up sliding down it alone, burning his hands, and walks off without looking at you.',
          cronica: '{nome} missed the throw three times, and Icaro got down from the crane unaided.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Crank the jib down',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['manual', 'ferramenta'],
        sucesso: {
          texto: 'In the cab there is an emergency crank and a table of turns per metre. You count out loud so that Icaro can hear. Two hundred and forty turns later he steps onto the deck and helps you carry the cartridge.',
          cronica: '{nome} cranked the jib of the Old Arm down by hand, with Icaro on the end of it.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro' },
        },
        falha: {
          texto: 'The lever you release is the slewing one. The jib swings slowly out over the well, with Icaro yelling, until it touches the catwalk. He jumps across. You are left with your arms shaking.',
          cronica: '{nome} swung the Old Arm the wrong way with a lad hanging off it.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Tell him to let go',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You open your arms and do not take your eyes off him. "Let go. I am not moving from here." He lets go. He comes down like a leaf, turning, and arrives in your arms weighing no more than a child.',
          cronica: '{nome} talked Icaro into letting go of the Old Arm and caught him out of the air.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro', marco: true },
        },
        falha: {
          texto: 'Your voice cracks on the words "let go". Icaro hears the doubt and grips the lattice harder. He only comes down much later, when the crew brings the cargo net.',
          cronica: '{nome} asked Icaro to let go of the crane in a voice that did not believe it either.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Calm his fear',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 4 },
        sucesso: {
          texto: 'His fear reaches you as a thin hum. You bring the pitch down, slowly, the way one rocks a baby. Up there the hands stop shaking, and Icaro climbs down the lattice by himself, rung by rung.',
          cronica: '{nome} calmed Icaro from a distance, and he climbed down the Old Arm on his own two hands.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro', item: 'sinalizador' },
        },
        falha: {
          texto: 'His fear is bigger than your breath and pours into you all at once: the well, the height, the deck. You clutch the handrail. The crew brings the cargo net.',
          cronica: '{nome} attuned to Icaro\'s fear and ended up keeping it.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-armazem',
    ato: 2,
    titulo: 'The Warehouse That Does Not Exist',
    texto:
      'Between the scrap store and the hull wall, the plan shows an empty space. The space smells of real coffee. A stack of crates blocks the corridor, and behind it somebody is counting chits without hurry. Everyone on the Docks knows Madame Rute has pressure suits. Nobody knows where the door is.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Climb over the crates',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'You scale the stack without knocking down a single tin and land on your feet in front of a desk. Madame Rute does not even look up. "Those who come in by the ceiling pay up front." She takes one cargo shift in exchange for a patched pressure suit.',
          cronica: '{nome} came into Madame Rute\'s warehouse by the ceiling and left with a pressure suit.',
          efeitos: { item: 'traje', brasa: -1 },
        },
        falha: {
          texto: 'The stack comes down with you inside it. When the dust settles there are dented tins, a swollen knee and a calm voice from the other side: "That goes on your account."',
          cronica: '{nome} brought down half of Madame Rute\'s stock and ended up in her debt.',
          efeitos: { vida: -2, marca: 'a2-rute' },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Look for the hidden catch',
        teste: { chave: 'percepcao', dificuldade: 7 },
        ajuda: ['mapa', 'luz'],
        sucesso: {
          texto: 'The rivet that shines is the only one hands touch every day. You press it, and the wall slides. Madame Rute pours two cups. "Whoever finds the door is a customer." The pressure suit goes for the price of a future favour.',
          cronica: '{nome} found the catch of the warehouse that does not exist and walked out with a pressure suit.',
          efeitos: { item: 'traje', marca: 'a2-rute' },
        },
        falha: {
          texto: 'You feel your way rivet by rivet until your fingers ache. Nothing. On the other side the counting of chits stops for a moment, and somebody laughs quietly. The air gauge drops.',
          cronica: '{nome} looked for Madame Rute\'s door and did not find it.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Bargain with Madame Rute',
        teste: { chave: 'presenca', dificuldade: 7 },
        ajuda: ['troca'],
        sucesso: {
          texto: 'You speak up, to the wall: the whole station is her customer, and a customer with no air pays no debts. The wall slides. Madame Rute hands over the pressure suit and writes in a notebook. "Investment," she says.',
          cronica: '{nome} persuaded Madame Rute that air for two hundred was good business.',
          efeitos: { item: 'traje', lacos: 1 },
        },
        falha: {
          texto: '"Lovely," says the voice behind the crates. "Come back when you have something I do not." You go on talking to cardboard until you give up.',
          cronica: '{nome} made a speech to a stack of crates, and the stack was not moved.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'recursos',
        rotulo: 'Pay her price',
        requer: { antecedente: 'recursos' },
        livre: true,
        resultado: {
          texto: 'You knock three times and say a number. The wall slides. Madame Rute checks it, wraps the pressure suit and even lays a sachet of calming tea on top. It costs dear, and she makes a point of your knowing it.',
          cronica: '{nome} bought a pressure suit from Madame Rute at the price she named.',
          efeitos: { item: ['traje', 'cha'], marca: 'a2-rute' },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Follow the coffee duct in',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 4 },
        sucesso: {
          texto: 'The smell of coffee is coming from somewhere, and you go after it through the inside of the wall. You come out beside the coffee pot. Madame Rute laughs, which is rare. "Take the suit. And tell me which way you came."',
          cronica: '{nome} got into Madame Rute\'s warehouse by the coffee duct and was given a pressure suit for sheer nerve.',
          efeitos: { item: 'traje', lacos: 1 },
        },
        falha: {
          texto: 'The duct narrows and you stick fast, your face a hand\'s width from the grille and the coffee. Madame Rute sends somebody to pull you out by the feet. She charges for the service.',
          cronica: '{nome} got stuck in a duct chasing coffee and was pulled out by the feet.',
          efeitos: { vida: -1, marca: 'a2-rute' },
        },
      },
    ],
  },
  {
    id: 'ar2-garrafas',
    ato: 2,
    titulo: 'The Missing Bottles',
    texto:
      'The air bottle store stands open and six hooks are empty. Tonho Grease blocks the way with the whole of his body. Nobody crosses the Docks until the bottles turn up. He knows who took them, that much is plain, and he is not going to hand one of his crew to an outsider. Behind him, eight stevedores study their own boots.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Pay by unloading a container',
        teste: { chave: 'forca', dificuldade: 7 },
        ajudantes: [{ nome: 'a quiet stevedore', nivel: 1 }],
        sucesso: {
          texto: 'You empty the feed container without asking for a break. At the last sack, Tonho Grease speaks low: it was Bento, his wife is laid up in bed. The bottles go back on their hooks, all but one, which everybody pretends not to count.',
          cronica: '{nome} unloaded a whole container and earned the trust of Tonho Grease.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'At the tenth sack your back locks and you drop the load on somebody\'s foot. Tonho Grease opens the way just to be rid of you.',
          cronica: '{nome} tried working as a stevedore and lasted ten sacks.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Watch who looks away',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Seven study their boots. The eighth is looking at the door of the Docks infirmary. You point at nobody. You ask Tonho Grease who is ill. He lets his breath out, and the whole story comes with it.',
          cronica: '{nome} found out who took the air bottles without accusing anybody.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'You pick the fellow with the sourest face. He was the only one off shift. The whole crew turns sour with him, and the way only opens after a great deal of apology.',
          cronica: '{nome} accused the wrong stevedore and apologised to eight people.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Hold the silence',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You set the cartridge on the deck, sit on it and wait. The silence grows until it weighs more than the bottles. A slight man takes a step forward. "It was me. It was for my wife."',
          cronica: '{nome} sat on the cartridge and waited in silence until the confession came by itself.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A stevedore can take silence better than anyone: whole shifts are spent inside a helmet. You are the one who speaks first. Tonho Grease lets you through, out of weariness.',
          cronica: '{nome} tried to outlast the Docks at silence and lost.',
          efeitos: { brasa: -1 },
        },
        desastre: {
          texto: 'The silence turns into something else. You hear your own blood, then the hum of the ducts, then nothing, the way it is outside. When somebody touches your shoulder, you scream. The crew makes way, frightened.',
          cronica: '{nome} stayed silent too long in the air bottle store.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Study the dustless hooks',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'Six hooks with no dust, the track of a stretcher wheel, a smear of ointment on the latch. You tell Tonho Grease alone, off to one side. He thanks you for the discretion with a handshake that cracks.',
          cronica: '{nome} followed a stretcher track and settled the matter of the missing bottles in private.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'The wheel track leads to the coffee trolley. The crew finds it funny, and it is the laughing that opens the way.',
          cronica: '{nome} investigated the missing bottles and arrested a coffee trolley.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Ask who is ill',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        ajuda: ['remedio'],
        sucesso: {
          texto: 'Nobody steals air for sport. You ask after the sick woman, and a slight man takes you to her. It is tired lungs, a thing that little enough will treat. Five bottles go back on their hooks by his own hands.',
          cronica: '{nome} treated a stevedore\'s wife, and the air bottles came back by themselves.',
          efeitos: { lacos: 1, item: 'marreta' },
        },
        falha: {
          texto: 'You reach the sick woman, but what she has calls for a medicine the station has not seen in eleven years. You stay a while, hold her hand and go on with that in your chest.',
          cronica: '{nome} found the sick woman of the Docks and had nothing to give her.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-docaaberta',
    ato: 2,
    titulo: 'The Open Dock',
    texto:
      'The Open Dock lost its outer door two harvests ago. Between this airlock and the next lie ten metres of grated deck, and beyond the grating, nothing: the whole of the dark, with stars that do not twinkle. The far airlock opens and shuts by itself, on a stubborn cycle. There is no air at all in between. It is the first time you have seen the outside without glass.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Cross on empty lungs',
        teste: { chave: 'fisico', dificuldade: 7 },
        ajuda: ['traje', 'ima'],
        sucesso: {
          texto: 'You breathe out, the way children are taught, and go. Ten metres of absolute silence, your skin pulling tight, the cartridge suddenly light. The far airlock shuts behind you with a warm puff.',
          cronica: '{nome} crossed the Open Dock on empty lungs, ten metres with no air.',
        },
        falha: {
          texto: 'Halfway across, your sight darkens from the edges and your knees forget their job. You reach the airlock crawling, with blood in your nose and a taste of iron.',
          cronica: '{nome} very nearly stayed in the middle of the Open Dock.',
          efeitos: { vida: -2, sanidade: -1 },
        },
        desastre: {
          texto: 'You trip on the grating and, for one long second, float face to face with the dark. It has no bottom. One of your hands finds the handrail. You get into the airlock without knowing how, and do not speak for a good while.',
          cronica: '{nome} looked straight into the dark at the Open Dock, and the dark looked back.',
          efeitos: { vida: -2, sanidade: -3 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Time the airlock',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: {
          texto: 'Forty beats open, ninety shut, and a click three beats before it opens. You set off on the click. You arrive with the door still sliding and not a second to spare.',
          cronica: '{nome} counted the airlock cycle and crossed the Open Dock right on time.',
        },
        falha: {
          texto: 'You count ninety. It was a hundred. That makes ten heartbeats in front of a shut door, with no air and the dark at your back. It opens. Whoever goes in is not quite who set out.',
          cronica: '{nome} got the airlock count wrong and waited in vacuum in front of a shut door.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Trust and jump',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto', 'cabo'],
        sucesso: {
          texto: 'The founders crossed all of this with their eyes open to get here. You bend your knees and leap. Ten metres in a single flight, straight, quiet, and the far airlock opens as if it had been waiting.',
          cronica: '{nome} crossed the Open Dock in a single leap, on trust.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'The leap goes off crooked and you turn slowly, seeing star, grating, star, grating. You hit the airlock frame with your shoulder and drag yourself inside, sick to the soul.',
          cronica: '{nome} leapt at the Open Dock and reached the other side spinning.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'pressao',
        rotulo: 'Carry a bubble of air',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 5 },
        sucesso: {
          texto: 'You feel the pressure in the airlock like warm water and ask it to come along. A remnant comes, thin, clinging to your face. It lasts ten metres with a sigh left over, which you give back to the station.',
          cronica: '{nome} crossed the Open Dock wearing a remnant of air.',
          efeitos: { marco: true, brasa: 1 },
        },
        falha: {
          texto: 'The bubble bursts on the third step, with a tug behind the eyes. The rest is done on empty lungs and fright.',
          cronica: '{nome} lost the bubble of air in the middle of the Open Dock.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Take the outside handrail',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 3 },
        ajuda: ['ima'],
        sucesso: {
          texto: 'The outside of the hull is your own street. You strap the cartridge to your back and go hand over hand, in no hurry at all, and even tighten a loose bolt on the airlock in passing.',
          cronica: '{nome} crossed the Open Dock like somebody walking home.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'The handrail ends two metres sooner than you remembered. The last stretch is a push into the void and an ugly knock against the frame.',
          cronica: '{nome} discovered at the Open Dock that the handrail had shrunk.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-patio',
    ato: 2,
    titulo: 'The Yard That Moved',
    texto:
      'The Container Yard was rearranged last shift, to save power on the conveyors, and nobody redid the signs. It is corridors of steel six metres high, all the same shade of rust, with half the lamps out. Somewhere in there is the Loose Screw canteen. You can hear a spoon tapping on a mug.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Go over the containers',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['ima', 'cabo'],
        sucesso: {
          texto: 'In half gravity, six metres is one good jump. From up there the yard becomes a game board, and you go from square to square, cartridge on your shoulder, as far as the canvas roof of the canteen.',
          cronica: '{nome} crossed the Container Yard over the top, jump by jump.',
        },
        falha: {
          texto: 'Half gravity flatters you on the way up and collects on the way down. You miss the edge, scrape down a wall of steel and sit for a while in the dark, between two containers, listening to the yard tick.',
          cronica: '{nome} fell between two containers and took a long time finding the way out.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Decipher the paint marks',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['mapa', 'luz'],
        sucesso: {
          texto: 'The containers have moved, but the dock numbers painted on the deck have not. You ignore the walls, read the floor and reach the Loose Screw by a corridor not even the crew knew about.',
          cronica: '{nome} read the deck of the Container Yard and found a short cut.',
          efeitos: { item: 'cha' },
        },
        falha: {
          texto: 'The number fourteen turns up twice. The corridor lamps go out to save power, and you spend a long time feeling along cold steel, certain that the walls have walked.',
          cronica: '{nome} got lost in the dark of the Container Yard.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Endure the watchman\'s yarns',
        teste: { chave: 'vontade', dificuldade: 6 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'The watchman knows the way, but he only tells it after the story of the tank flood, his sister\'s wedding and the dominoes championship. You hear it all, standing. He walks you to the door and pours you a calming tea.',
          cronica: '{nome} heard three stories from the yard watchman and earned the way and a tea.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'During the second story you glance at the air gauge. The watchman sees it, takes offence and points down any old corridor. It is the wrong one, naturally.',
          cronica: '{nome} lost patience with the yard watchman and paid for it with a full lap.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'planta',
        rotulo: 'Cut through the plan\'s tunnel',
        requer: { item: 'planta' },
        livre: true,
        resultado: {
          texto: 'The station plan shows what the rust has hidden: a cable tunnel under the yard, dead straight, with a hatch every ten metres. You come up inside the canteen larder, ahead of time, and get a small telling-off.',
          cronica: '{nome} went underneath the Container Yard and gained time.',
          efeitos: { brasa: 1 },
        },
      },
      {
        id: 'aliado',
        rotulo: 'Whistle for an old acquaintance',
        requer: { antecedente: 'aliado' },
        livre: true,
        resultado: {
          texto: 'You whistle the usual three notes. From the top of a container another whistle answers, and a torch blinks out the way, turn by turn. That leaves a favour to repay, as always.',
          cronica: '{nome} crossed the yard guided by the torch of an old acquaintance.',
          efeitos: { marca: 'a2-favor' },
        },
      },
    ],
  },
  {
    id: 'ar2-casulos',
    ato: 2,
    titulo: 'The Queue for the Pods',
    texto:
      'The stevedores have downed tools and formed a queue in front of the emergency pods. There are twelve pods for sixty people, and the sum is already being worked out with elbows. The way through to the Spine lies behind the queue. Tonho Grease is trying to hold the crew by shouting, and he is losing. Somebody has already broken the seal on the first pod.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Do the work of three',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'You say nothing. You take the cargo stranded on the conveyor and carry it alone, three loads at a time, with the cartridge on your back. One by one, awkwardly, the stevedores leave the queue and go back to work.',
          cronica: '{nome} shamed the whole of the Docks by working for three.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'On the second load something cracks in your shoulder. The queue looks on, with pity, and goes on being a queue. You make your way through between the elbows, slowly.',
          cronica: '{nome} tried to set an example on the Docks and wrenched a shoulder.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Ask where they are going',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        ajuda: ['manual'],
        sucesso: {
          texto: 'You ask, without raising your voice, where a pod comes down. Nobody knows. The last ship came eleven years ago. A pod is the same lack of air, only alone. The queue breaks up in mutters.',
          cronica: '{nome} asked the Docks where the pods were going, and nobody could answer.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: '"A long way from here," somebody answers, and the queue applauds. There is no arguing with that. You squeeze through, catching an elbow that was not meant for you.',
          cronica: '{nome} argued with a frightened queue and lost.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Recall the founders\' promise',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'You climb onto the conveyor and lift the cartridge, label towards the queue. The great-grandparents of everyone here signed beneath one sentence: nobody breathes alone. All you do is read it out. Tonho Grease takes off his cap.',
          cronica: '{nome} read the founders\' label to the idle Docks, and the Docks went back to work.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'The sentence comes out, but the fear in the queue is louder. Somebody shouts that founders do not pay for bottles. For a moment you too look at the pods and do the sum.',
          cronica: '{nome} spoke of the founders to a queue that could only hear the air gauge.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
        critico: {
          texto: 'When you finish reading, the whole queue repeats the sentence, low, like a prayer. Tonho Grease remakes the seal on the pod with his own hands and sends two of the crew to clear your way to the Spine.',
          cronica: '{nome} had the Docks repeat the founders\' promise and went on with an escort.',
          efeitos: { lacos: 1, marco: true, brasa: 1 },
        },
      },
      {
        id: 'ciencias',
        rotulo: 'Do the pod sums',
        requer: { nivel: { ciencias: 1 } },
        teste: { chave: 'ciencias', dificuldade: 3 },
        sucesso: {
          texto: 'You scratch the sum on the side of the pod in cargo chalk: six hours of air, no engine, no ship in eleven years. The answer needs no explaining. The man at the head of the queue rubs his own name off the list.',
          cronica: '{nome} chalked the pod sums on the pod, and the queue broke up.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'The sum is right, but the chalk snaps, the figures come out shaky and somebody says doctors get it wrong too. The queue stays. You go through.',
          cronica: '{nome} did the right sum for the wrong queue.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Call each one by name',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'You know the entire queue: you carried the furniture for half of them and a father\'s coffin for the other half. You call them one by one, by name. It is hard to jump a queue while looking at you. The work starts again, slowly.',
          cronica: '{nome} broke up the queue for the pods by calling each stevedore by name.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ar2-assobio',
    ato: 2,
    titulo: 'The Whistle at the Loose Screw',
    texto:
      'The Loose Screw canteen is full and silent. Somewhere in the back wall, the one against the hull, air is whistling out, thin as a kettle. Nobody can find the hole. Mugs tremble in hands, the owner is holding a patch plate with no idea where to put it, and the canteen gauge drops a mark while you watch.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Plug it with your back',
        teste: { chave: 'fisico', dificuldade: 7 },
        ajuda: ['traje', 'remendo'],
        sucesso: {
          texto: 'You slide your back along the wall until the cold bites in one single spot, and you stay there, a human cork, while the owner welds the plate around you. You come away with a purple circle between your shoulder blades and a bowl of soup.',
          cronica: '{nome} plugged the leak at the Loose Screw with nothing but a back.',
          efeitos: { lacos: 1, vida: -1 },
        },
        falha: {
          texto: 'The cold burns before you find the spot. You step away with your back numb, and the hole only shows much later, when the frost draws a white flower on the wall.',
          cronica: '{nome} searched bodily for the canteen leak and came away burnt by cold.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Follow the stove smoke',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        ajuda: ['luz', 'remendo'],
        sucesso: {
          texto: 'A grandmother\'s trick: you blow on the stove and let the smoke choose. It lies flat, runs along the wall and vanishes behind the picture of the dominoes championship. The plate goes on there. The whistling stops.',
          cronica: '{nome} found the leak at the Loose Screw with the smoke from a stove.',
          efeitos: { lacos: 1, brasa: 1 },
        },
        falha: {
          texto: 'The smoke spreads through the whole canteen and points at nothing whatsoever. Now the place is smoky as well as leaking, and everybody coughs while looking at you.',
          cronica: '{nome} filled with smoke a canteen that was already short of air.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Ask for silence and listen',
        teste: { chave: 'fe', dificuldade: 6 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You ask everyone to hold their breath, together, and you close your eyes. In the silence of forty people, the whistle has an address. You walk up to it and put a finger on it. Somebody behind you starts praying with relief.',
          cronica: '{nome} hushed the entire canteen and found the leak with eyes closed.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'In the silence, the whistle seems to come from every side, and from inside you as well. It is the sound of the outside calling. You open your eyes in a hurry. The one who finds the hole is a child.',
          cronica: '{nome} listened too closely to the whistle of the vacuum at the Loose Screw.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'fita',
        rotulo: 'Seal it with patch tape',
        requer: { item: 'fita' },
        livre: true,
        resultado: {
          texto: 'You wet a finger, run it along the wall and feel the tug. Three turns of patch tape, crossed, the way no manual teaches. The whistle dies. The roll is finished, and the canteen breathes.',
          cronica: '{nome} spent the last roll of patch tape sealing the Loose Screw.',
          efeitos: { semItem: 'fita', lacos: 1, brasa: 1 },
        },
      },
      {
        id: 'amparo',
        rotulo: 'Settle the canteen',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'The fear of forty people makes more noise than the hole. You bring everyone\'s pitch down, like smothering a sound under a cloth. In the hush, the owner hears the whistle, finds it, patches it, and puts a calming tea in your hand.',
          cronica: '{nome} settled the whole canteen, and in the hush the leak was found.',
          efeitos: { lacos: 1, brasa: 1, item: 'cha' },
        },
        falha: {
          texto: 'It is too many people with too much fear. You hold what you can and the rest spills over into you. The hole gets found, but you spend a while sitting on the kitchen floor.',
          cronica: '{nome} tried to carry the fear of an entire canteen.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
];
