/**
 * The Last Ember, Act 3: The Top. Greytop mountain by night: cold, height,
 * wind and the things of the Long Night. Format in ../../FORMATO.md.
 */

export const itens = {};

export const companheiros = {
  fuligemCadela: {
    nome: 'Soot',
    quem: 'a sheepdog from the Top, black with a white muzzle, who knows every trail by its smell',
    niveis: { percepcao: 2, fisico: 1 },
  },
};

export const inimigos = {
  geadaPensante: {
    nome: 'The cold that thinks',
    ataque: 3, defesa: 3, vida: 7, arma: 1, armadura: 0,
    resistencia: 3, reflexo: 1, vontade: 3, fe: 0,
    mental: true,
  },
  loboBrancoDoCimo: {
    nome: 'White wolf of the Top',
    ataque: 2, defesa: 2, vida: 5, arma: 1, armadura: 0,
    resistencia: 1, reflexo: 2, vontade: 1, fe: 0,
  },
};

export const cenas = [
  {
    id: 'ato3-geada',
    ato: 3,
    titulo: 'The Wall of Wind',
    texto:
      'Above the last tree, the trail presses against a wall of bare rock, and the wind pours off Greytop like water through a burst dam. Your eyelashes stick together. The fingers on the lantern handle are no longer quite yours. Some three hundred paces of ledge lie between you and the next fold of the mountain, and the whole night is blowing against every one of them.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Walk through the cold',
        teste: { chave: 'resistencia', dificuldade: 8 },
        ajuda: ['agasalho'],
        sucesso: {
          texto: 'You put your head down and count your steps. The cold bites, then gets tired of biting. At the fold of the mountain the wind drops all at once, and the silence feels almost warm.',
          cronica: '{nome} crossed the wall of wind without stopping once.',
        },
        falha: {
          texto: 'Halfway along the ledge your knees stop taking orders. You reach the fold dragging one foot, with two fingers white as candle wax and the lantern knocking against the rock.',
          cronica: 'The wind off the Top charged {nome} two fingers.',
          efeitos: { vida: -3, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find the wind\'s gentle side',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        sucesso: {
          texto: 'The drifts tell you where the wind comes from. Tight against the wall there is a hand\'s width of still air where not even frost settles. You go sideways, flat to the rock, like a crab, and arrive in one piece.',
          cronica: '{nome} read the wind in the snow and passed the wall flat against the rock.',
        },
        falha: {
          texto: 'You pick the outer edge, where the snow is shallowest, and that is exactly where the wind hits whole. You go back and start again close to the rock. The lantern paid for the lesson.',
          cronica: '{nome} picked the wrong side of the wind and had to start the ledge over.',
          efeitos: { vida: -1, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Refuse to think of stopping',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'Your body asks for one minute sitting down. You say yes, just over there, at the fold. You say it three hundred times. At the fold, out of the wind, you find you no longer need it.',
          cronica: '{nome} lied to exhaustion all the way to the end of the wall.',
        },
        falha: {
          texto: 'You sit. Just a minute. The sleep that comes is warm and a liar, and you wake with snow in your lap and no idea how much of the ember slept along with you.',
          cronica: '{nome} dozed off on the ledge and woke up under snow.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'elemental',
        rotulo: 'Ask the ember for warmth',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 4 },
        sucesso: {
          texto: 'You speak low to the fire, the way you speak to a skittish animal. The ember answers: a round warmth comes out of the lantern and walks with you, and the snow hisses where it touches.',
          cronica: '{nome} crossed the wall inside a pocket of warmth.',
        },
        falha: {
          texto: 'The warmth comes, but the wind takes it before it reaches your skin. You cross like everybody else, teeth chattering, with your head emptier than before.',
          cronica: 'The wind off the Top carried away the spell {nome} cast.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'manto',
        rotulo: 'Pull the wool cloak tight',
        requer: { item: 'manto' },
        livre: true,
        resultado: {
          texto: 'Valley wool, carded by hand, smelling of sheep and smoke. You make the cloak a tent for yourself and the lantern. The wind beats on it, complains and gives up.',
          cronica: '{nome} passed the wall of wind bundled in a cloak of Valley wool.',
        },
      },
    ],
  },

  {
    id: 'ato3-refugio',
    ato: 3,
    titulo: 'The Shepherds\' Shelter',
    texto:
      'A low stone house, smoke at the chimney, sheep packed tight in the pen. Inside, six shepherds are tying up bundles by the light of the hearth. They mean to leave the flock and go down tonight, far from the Valley, anywhere at all. "The Beacon is dead," says Jacinta, the eldest, without looking up from her knot. "Whoever stays up here stays for the Night."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Shore up the pen together',
        teste: { chave: 'forca', dificuldade: 7 },
        ajudantes: [{ nome: 'the shepherds', nivel: 1 }],
        sucesso: {
          texto: 'You don\'t argue. You pick up the loose stake and start hammering. One of them drops a bundle to hold it steady, then another. With the pen standing firm, running away looks like too much work. Somebody puts more wood on the fire.',
          cronica: '{nome} mended the shepherds\' pen, and they stayed to watch over it.',
          efeitos: { lacos: 1, brasa: 1 },
        },
        falha: {
          texto: 'The stake splits in your hand and takes a piece of your palm with it. The shepherds look at the crooked pen the way people read a warning, and file out the door one after another.',
          cronica: '{nome} could hold neither the pen nor the shepherds of the Top.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Hear what frightens them',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'The fear has a name: Bras, who went up after a ewe and never came back. You promise to look for him on your way. Jacinta undoes her knot, slowly, and puts a pot of salve in your hand.',
          cronica: '{nome} learned the shepherds were running because of one lost man, and promised to look for him.',
          efeitos: { lacos: 1, item: 'unguento' },
        },
        falha: {
          texto: 'You ask too much, in the wrong order. They tell you about the voices in the wind, the names called out at night. You leave knowing more than you wanted to.',
          cronica: '{nome} heard stories from the shepherds that were better left unheard.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Address them by the fire',
        teste: { chave: 'lideranca', dificuldade: 8 },
        sucesso: {
          texto: 'You raise the lantern and tell them where it comes from and where it is going. You speak of a Valley that will wake tomorrow looking up. Jacinta lets go of her bundle. "Then we\'ll keep the climb for you," she says. They give you the place by the hearth.',
          cronica: '{nome} spoke to the shepherds of the Top, and not one of them went down the mountain.',
          efeitos: { lacos: 1, brasa: 1, marco: true },
        },
        falha: {
          texto: 'The words come out handsome and hollow. A young shepherd laughs with no joy in it. They go down in single file, and you are left alone in a house going cold, thinking they may be right.',
          cronica: 'The shepherds of the Top listened to {nome} and left all the same.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Let them recognise you',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'The young shepherd looks twice and whispers. Your name goes round the room before you open your mouth. If people like that are climbing, going down is a disgrace. Jacinta has the soup put back on.',
          cronica: 'The shepherds of the Top recognised {nome} and decided to stay.',
          efeitos: { lacos: 1, brasa: 1 },
        },
      },
      {
        id: 'animais',
        rotulo: 'Settle the flock first',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 4 },
        sucesso: {
          texto: 'You step into the pen and have a word with the bellwether. One by one they lie down. A shepherd trusts sheep more than people: if the flock has settled, the night has not got here yet.',
          cronica: '{nome} settled the flock, and the shepherds settled with it.',
          efeitos: { lacos: 1, brasa: 1, item: 'unguento' },
        },
        falha: {
          texto: 'The bellwether is in no mood to talk, and the flock swirls round the pen like water in a pan. The shepherds watch in silence. Then they go back to their bundles.',
          cronica: '{nome} could not calm the sheep of the Top.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },

  {
    id: 'ato3-ponte',
    ato: 3,
    titulo: 'The Rope Bridge',
    texto:
      'The gorge splits the mountain from top to bottom, and the only way over is a bridge of rope and plank that some optimistic shepherd strung up many winters ago. It sways on its own. Far below, the river is a thread of noise. Planks are missing, the left handrail is frayed, and the wind is trying the bridge like someone tuning an instrument.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Cross in step',
        teste: { chave: 'destreza', dificuldade: 8 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'The bridge has a beat, and you fall in with it: a step when it rises, a pause when it drops. On the far side your legs only start shaking once you no longer need them.',
          cronica: '{nome} crossed the rope bridge in time with the wind.',
        },
        falha: {
          texto: 'A plank rolls under your foot. You hang by one elbow, the lantern spinning over nothing, and haul yourself to the far edge with your arm on fire.',
          cronica: '{nome} nearly fell from the rope bridge and reached the far side by one arm.',
          efeitos: { vida: -2, brasa: -1 },
        },
        critico: {
          texto: 'You cross lightly, almost dancing, and still find time to set two loose planks back in place. On the last post, hanging from a nail, someone has left a cloak for whoever came next.',
          cronica: '{nome} danced across the rope bridge and left it better than it was.',
          efeitos: { item: 'manto' },
        },
        desastre: {
          texto: 'The frayed handrail snaps. You fall a full body\'s length before the lower rope catches you, and the lantern strikes the rock with a sound you will go on hearing for many nights.',
          cronica: 'The rope bridge nearly took {nome} and the lantern together.',
          efeitos: { vida: -3, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Pick the sound planks',
        teste: { chave: 'percepcao', dificuldade: 7 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'Rotten wood goes dark and holds the snow; sound wood shrugs it off. You step only on the bare planks and cross slowly, without a single creak, with time even to look at the river.',
          cronica: '{nome} crossed the rope bridge stepping only where the wood was sound.',
        },
        falha: {
          texto: 'In the dark, every plank looks rotten. You test each one with your heel, go back, test it again. You cross unharmed and very, very late.',
          cronica: '{nome} took an age to cross the rope bridge.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Trust and don\'t look down',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Whoever built this bridge built it to be crossed. You fix your eyes on the post at the far end and leave your feet to themselves. You arrive unable to say how it went.',
          cronica: '{nome} crossed the rope bridge without looking down even once.',
        },
        falha: {
          texto: 'Halfway over, you look. The bottom of the gorge looks back, dark and patient, and tells you falling is quick. You cross on all fours with your eyes shut.',
          cronica: 'In the middle of the rope bridge, {nome} looked down.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'corda',
        rotulo: 'Rig a lifeline',
        requer: { item: 'corda' },
        livre: true,
        resultado: {
          texto: 'You tie the rope to the post, pass it round your waist and cross on a tether. On the far side you pull it taut and knot it off: the bridge has a new handrail. The rope stays, for whoever comes next.',
          cronica: '{nome} crossed the bridge tied to a rope and left it there as a handrail.',
          efeitos: { semItem: 'corda' },
        },
      },
    ],
  },

  {
    id: 'ato3-ferido',
    ato: 3,
    titulo: 'The Man in the Snow',
    texto:
      'A black dog with a white muzzle comes out of the dark, barks twice and goes back the way she came, looking over her shoulder. You follow. At the foot of a bank lies a big shepherd, Bras, with his leg bent at a bad angle and his beard full of ice. "Get out of here with that light," he grumbles. "I weigh more than a door." The shelter is half an hour away, uphill.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Carry Bras on your back',
        teste: { chave: 'forca', dificuldade: 9 },
        ajudantes: [{ nome: 'the dog, tugging at your sleeve', nivel: 1 }],
        sucesso: {
          texto: 'He really does weigh as much as a door, and he complains the whole way. You set him down in front of the shelter with your back burning. "Soot goes with you," says Bras. "She knows the Top better than I do."',
          cronica: '{nome} carried the shepherd Bras up the hill and gained the company of the dog Soot.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: 'Halfway up, your legs fold and the two of you roll in the snow. You reach the shelter crawling side by side, and something in your back stayed behind at that bank.',
          cronica: '{nome} got the shepherd Bras to the shelter and left a good back somewhere on the way.',
          efeitos: { vida: -3, lacos: 1 },
        },
        critico: {
          texto: 'You climb the hill with Bras over your shoulder like a sack of wool. At the shelter he takes off his own cloak and throws it over you. "Soot goes too. And don\'t argue with me."',
          cronica: '{nome} carried the shepherd Bras as if he weighed nothing, and came away with a cloak and a dog.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela', item: 'manto' },
        },
      },
      {
        id: 'mente',
        rotulo: 'Improvise a sled',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Two juniper branches, his staff, both your belts. The sled is ugly and it slides. Bras rides lying down, offering advice. At the shelter door he tells the dog to go on with you.',
          cronica: '{nome} built a sled out of branches and dragged the shepherd Bras to the shelter.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: 'The sled falls apart three times, and three times you rebuild it with stiff fingers. Bras reaches the shelter alive. The ember reaches it smaller, and the dog will not leave her master\'s door.',
          cronica: '{nome} saved the shepherd Bras on a sled that fell apart every hundred paces.',
          efeitos: { brasa: -2, lacos: 1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Make Bras want to walk',
        teste: { chave: 'presenca', dificuldade: 7 },
        sucesso: {
          texto: 'You ask after his sheep, one by one, by name. He answers, gets annoyed, leans on your shoulder to set you straight. He goes up limping and talking. At the top, he puts the dog in your care.',
          cronica: '{nome} talked sheep until the shepherd Bras climbed the hill on his own two legs.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: '"Leave me," he says again, and shuts his eyes. You cover the man with branches, shout for the shelter until you see a light start down, and go on. His face goes with you, on the inside.',
          cronica: '{nome} left the shepherd Bras for others to fetch, and forgiveness was slow in coming.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Set his leg',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 4 },
        sucesso: {
          texto: 'One sharp pull, two splints, the binding good and tight. Bras says a long bad word and then stands up. He climbs leaning on you, amazed at his own leg, and gives you the dog and a pot of salve.',
          cronica: '{nome} set the shepherd Bras\'s leg in the snow, and he walked up the hill.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela', item: 'unguento' },
        },
        falha: {
          texto: 'The bone will not go back where it belongs in this cold. You bind it as best you can and climb with him hanging off your shoulder, stopping every ten paces.',
          cronica: '{nome} tried to set the shepherd Bras\'s leg and ended up hauling him on one shoulder.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
      {
        id: 'suporte',
        rotulo: 'Lend his leg strength',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'You lay a hand on the twisted knee and lend what you have. The bone warms. Bras gets up warily, takes three steps and bursts out laughing. The dog goes with you, on his orders.',
          cronica: '{nome} put the shepherd Bras on his feet with a word and a hand on his knee.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: 'The strength goes out of you, but the leg cannot hold it: it runs through like water in a sieve. You climb with him leaning on you, more tired inside than out.',
          cronica: 'The magic {nome} offered would not hold in the shepherd Bras\'s leg.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ato3-nevasca',
    ato: 3,
    titulo: 'White on Every Side',
    texto:
      'The snow starts gently, and in ten minutes there is no mountain left: only white above, below and all around, and a wind that changes its mind every moment. The trail is gone. Somewhere to the right there is a cliff. The lantern lights a circle the size of a table, and inside it you have to decide which way the Top lies.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Climb straight up',
        teste: { chave: 'fisico', dificuldade: 8 },
        ajuda: ['agasalho'],
        sucesso: {
          texto: 'Up is up, trail or no trail. You sink your legs to the knee and climb on breath alone. When the blizzard tires, you are above it, looking down on the clouds.',
          cronica: '{nome} beat the blizzard by climbing straight up, on breath alone.',
        },
        falha: {
          texto: 'The deep snow drinks your strength in gulps. You dig a hole, curl up around the lantern and wait for the worst to pass, shaking so hard your teeth hurt.',
          cronica: '{nome} sat out the worst of the blizzard curled up in a hole in the snow.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Read sky and trail',
        teste: { chave: 'percepcao', dificuldade: 8 },
        ajuda: ['mapa', 'luz'],
        sucesso: {
          texto: 'The real wind always comes from the same side; the rest is eddies. And there are evenly spaced humps under the snow: the shepherds\' stone cairns. You go from one to the next, like someone crossing a river.',
          cronica: '{nome} found the stone cairns under the snow and never lost the trail.',
        },
        falha: {
          texto: 'You walk for an hour in perfect confidence and come upon your own footprints, already half filled in. You sit, breathe, and start again the other way.',
          cronica: '{nome} walked in a circle in the blizzard on the Top.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
        desastre: {
          texto: 'The ground ends without warning. You slide over the lip of the cliff and only stop on a shelf of rock, three body lengths down. Climbing back, in the dark and the white, takes all you had.',
          cronica: '{nome} found the cliff the worst way possible and clawed back up by the fingernails.',
          efeitos: { vida: -3, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Keep walking blind',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'You choose a direction and do not reopen the matter. One step, another, the ground always rising. The white tries to persuade you there is nothing else left, and you give it no answer. It parts.',
          cronica: '{nome} crossed the blizzard without once doubting the way.',
        },
        falha: {
          texto: 'Things begin to appear inside the white: a door, a lit window, someone waving. You run after three of them before you understand that none was ever there.',
          cronica: 'In the blizzard, {nome} chased after lights that did not exist.',
          efeitos: { sanidade: -4, brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Wait for a lull',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 4 },
        sucesso: {
          texto: 'A mountain blizzard breathes: it blows, stops, blows. You dig a shallow shelter, shield the lantern and count. On the third pause the sky opens a crack, and the Top stands there whole, right in front of you.',
          cronica: '{nome} waited for the blizzard to draw breath and slipped through the gap.',
        },
        falha: {
          texto: 'The pause you were counting on takes twice as long to come. The shelter holds off the wind, but the ember does not know how to wait the way you do.',
          cronica: '{nome} waited too long for the blizzard to let up.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'fuligem',
        rotulo: 'Send Soot ahead',
        requer: { companheiro: 'fuligemCadela' },
        livre: true,
        resultado: {
          texto: 'The dog sniffs the air, sneezes and trots off like someone heading home. You follow the white muzzle and the raised tail. Every twenty paces she stops to see whether you are still coming.',
          cronica: 'The dog Soot led {nome} through the blizzard without one wrong step.',
        },
      },
    ],
  },

  {
    id: 'ato3-capela',
    ato: 3,
    titulo: 'The Chapel Vigil',
    texto:
      'The chapel on the Top has no door any more and only half a roof, but a candle is burning on the altar. Sister Anselma, small and very old, watches the flame from inside three blankets. "As long as someone keeps vigil here, they don\'t come in," she says, pointing at the dark that shifts behind the windows. She has not slept in two nights. The bell is locked in ice.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Climb and free the bell',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'The belfry ladder has lost half its rungs. You climb the ones that are left, crack the ice off the clapper with the butt of the lantern, and the bell speaks. Outside, the dark draws back to the edge of the churchyard.',
          cronica: '{nome} climbed the belfry of the chapel on the Top and made the bell ring again.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A rung gives way, and you come down the belfry a good deal faster than you went up. The bell stays dumb. Sister Anselma makes the sign of the cross and sees to your ankle without a word.',
          cronica: '{nome} fell from the belfry of the chapel on the Top.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'See where the dark enters',
        teste: { chave: 'percepcao', dificuldade: 7 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'The candle always leans the same way: there is a gap behind the altar, and that is where the cold does its talking. You stop it up with a bench and a blanket. The chapel goes quiet. The sister, at last, nods off.',
          cronica: '{nome} found the gap where the Night was getting into the chapel and stopped it with a bench.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'You search the windows, and the windows search you back. There are faces in what glass is left. One of them tilts its head the way you do.',
          cronica: '{nome} looked too long through the windows of the chapel on the Top.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Keep vigil in her place',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You kneel and send the old woman to sleep. The voices come, plead, threaten, weep. You watch the candle. When Anselma wakes, the flame is the same size, and she brews you a balm tea with shaking hands.',
          cronica: '{nome} kept vigil all night in the chapel on the Top so that an old nun could sleep.',
          efeitos: { lacos: 1, item: 'cha', marco: true },
        },
        falha: {
          texto: 'Around the third hour, a voice outside calls you by your childhood nickname. You are on your feet before you think. It is the sister who catches you by the sleeve, and the sister who finishes the vigil.',
          cronica: '{nome} nearly walked out of the chapel after a voice, halfway through the vigil.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'amuleto',
        rotulo: 'Hang up the Bell Charm',
        requer: { item: 'amuleto' },
        livre: true,
        resultado: {
          texto: 'The little bell from Bellford, hung on the altar, chimes by itself in the draught. It is not much of a sound, but it is the sound of home. The dark backs away from the windows, and the sister sleeps sitting up, smiling. The charm stays with her.',
          cronica: '{nome} left the charm from Bellford chiming on the altar of the chapel on the Top.',
          efeitos: { lacos: 1, item: 'cha', semItem: 'amuleto' },
        },
      },
      {
        id: 'historia',
        rotulo: 'Recall the vigil rite',
        requer: { nivel: { historia: 1 } },
        teste: { chave: 'historia', dificuldade: 4 },
        sucesso: {
          texto: 'The old vigil was never kept in silence: the names of those who climbed the mountain were read aloud. They are carved in the wall. You read, the sister answers, and at every name the dark takes one step back.',
          cronica: '{nome} read aloud the names on the chapel wall, as the old rite required.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'You remember half the rite and make up the rest. The sister corrects you with a schoolteacher\'s patience. The night passes, longer than it needed to be.',
          cronica: '{nome} got the vigil rite wrong, and Sister Anselma had to teach it.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ato3-sopro',
    ato: 3,
    titulo: 'The Cold That Thinks',
    texto:
      'In a saddle of the mountain where no wind blows, the cold changes character. It pays attention. A voice with no mouth speaks inside your head, gently, in your own words: the ember hurts, light draws things, the Valley sleeps better in the dark. All it takes is to open the little door and blow. You notice, with some interest, that your hand is already on the lantern latch.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Face the cold head-on',
        combate: 'geadaPensante',
        vitoria: {
          texto: 'There is nothing to strike, so you strike the fear: you shout, stamp, charge at nothing with the lantern held high. The cold loses interest, like an animal giving up on its prey, and goes back to being only cold.',
          cronica: '{nome} shouted down the cold that thinks and made it give up.',
        },
        derrota: {
          texto: 'The voice wins by wearing you out. You open the little door and blow, once, before your hand is yours again. The ember shrinks to a point. You shut the latch crying with rage.',
          cronica: 'The cold that thinks made {nome} blow on the ember.',
          efeitos: { brasa: -2 },
        },
        fuga: {
          texto: 'You run down off the saddle with your free hand clamped around the other wrist. The voice stays behind, laughing softly, in no hurry at all.',
          cronica: '{nome} fled the cold that thinks, holding one hand back with the other.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Pick apart the argument',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['livro'],
        sucesso: {
          texto: 'If the dark really were better, the voice would not spend so much sweet talk on so small an ember. You say so out loud. The silence that answers is the silence of someone caught out. Your hand lets go of the latch.',
          cronica: '{nome} caught the cold that thinks in a contradiction and left it without a reply.',
        },
        falha: {
          texto: 'You argue, and the voice argues better. It has an answer for everything, and every answer sounds like a thought of yours. When you finally tear yourself away, you no longer know which ideas you brought and which you were given.',
          cronica: '{nome} argued with the cold that thinks and came away unsure who had won.',
          efeitos: { sanidade: -4 },
        },
        critico: {
          texto: 'You take its speech apart piece by piece, calm as a watchmaker, and the voice stammers. Before it goes, out of sheer spite, it lets slip what it fears most: fire shared out, light in many hands.',
          cronica: '{nome} out-talked the cold that thinks and pulled a secret out of it besides.',
          efeitos: { magia: 1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Let go of the latch',
        teste: { chave: 'vontade', dificuldade: 9 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Finger by finger. The voice promises rest, then threatens, then begs. You close your empty hand and put it away in your pocket. "No," you say, and it is the longest word you have ever spoken. The cold withdraws.',
          cronica: '{nome} heard the cold that thinks ask for the ember and answered no.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'The little door opens. You watch your own lips purse to blow, and turn your face at the last instant. The breath catches the ember a glancing blow. It darkens and is slow to come back.',
          cronica: '{nome} had sworn to carry the ember, and blew on it all the same, if only a glancing breath.',
          efeitos: { brasa: -2, sanidade: -2 },
        },
        desastre: {
          texto: 'You blow. Truly, and with a will, believing the idea is your own. The ember all but dies. What brings you back is the smell of smoke from home, and a shame too big for your chest.',
          cronica: '{nome} blew on the ember at the bidding of the cold that thinks and nearly lost it.',
          efeitos: { brasa: -2, sanidade: -4 },
        },
      },
      {
        id: 'controle',
        rotulo: 'Turn the command back',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 5 },
        sucesso: {
          texto: 'You know this trick from the inside: it is yours, badly done. You take hold of the thread of the command and pull it the other way. "Go," you order. The cold obeys, astonished to be obeying.',
          cronica: '{nome} turned the spell of the cold that thinks back on itself.',
        },
        falha: {
          texto: 'For an instant the two of you hold the same thread, and you see what is at the other end. You let go fast. Your hand leaves the latch, but the picture does not leave your head.',
          cronica: '{nome} saw, for an instant, what does the thinking inside the cold.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'lamparina',
        rotulo: 'Split the fire in two',
        requer: { item: 'lamparina' },
        livre: true,
        resultado: {
          texto: 'Before your hand can finish the gesture, you touch the wick of the oil lamp to the ember. Now there are two flames, and the voice only knows how to ask for one thing at a time. It tangles, hesitates and falls silent.',
          cronica: '{nome} lit the oil lamp from the ember, and the cold that thinks could not tell which of the two to put out.',
        },
      },
    ],
  },

  {
    id: 'ato3-vulto',
    ato: 3,
    titulo: 'Otto at the Bend in the Trail',
    texto:
      'At the bend in the trail, sitting on a rock, is Otto, your neighbour from Bellford, sleeves rolled up in spite of the snow. "I took the shortcut," he says, smiling. "You must be dead on your feet. Give me the lantern, I\'ll carry it a while." He holds out his hand. The smile is Otto\'s. The snow around the rock is smooth, without a single footprint.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Slip past untouched',
        teste: { chave: 'destreza', dificuldade: 8 },
        sucesso: {
          texto: 'The trail here is as wide as a bench. You shift the lantern to your other hand, turn your body and pass tight against the bank. His fingers close on air. Behind you, the rock is already empty.',
          cronica: '{nome} got past the false Otto without letting him touch the lantern.',
        },
        falha: {
          texto: 'His hand brushes the lantern handle, and it is like putting your tongue to frozen iron. You wrench the lantern away and run. The ember has gone darker where he touched.',
          cronica: 'The shape with Otto\'s face laid a hand on the lantern {nome} carried.',
          efeitos: { brasa: -2, vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Notice what Otto wouldn\'t do',
        teste: { chave: 'sabedoria', dificuldade: 8 },
        sucesso: {
          texto: 'Otto has a bad knee and cannot even manage the church hill. Otto would complain about the cold before saying good evening. "You\'re not him," you say. The smile stays, but the face around it comes apart like frost on a windowpane.',
          cronica: '{nome} saw that the shape on the trail was not Otto, however alike the smile.',
        },
        falha: {
          texto: 'It is Otto. It has to be. Your arm is already reaching out when the ember hisses and shrinks away from him. You pull back late, certain you will never trust a familiar face again.',
          cronica: '{nome} nearly handed the lantern to a shape wearing a neighbour\'s face.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Make him name himself',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: '"Tell me your wife\'s name." He opens his mouth and nothing comes out. You take a step forward and ask again, louder. The shape confesses the only way it knows how: it stops being there.',
          cronica: '{nome} stared down the false Otto and forced him to come undone.',
        },
        falha: {
          texto: 'He answers. He knows the name of Otto\'s wife, of the dog, of your father. He knows things you have never told anyone. You walk past him with your eyes on the ground, and he keeps talking until you are gone round the bend.',
          cronica: 'The shape with Otto\'s face knew far too much about {nome}.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Point out the trackless snow',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 4 },
        sucesso: {
          texto: 'No footprints, no breath in the air, no shadow on the lantern side. You list them aloud, counting on your fingers. With each proof the shape grows thinner. At the third, you can see the rock through him.',
          cronica: '{nome} proved to the false Otto, point by point, that he did not exist.',
        },
        falha: {
          texto: 'You crouch to examine the snow, and when you look up he is standing, very close, still smiling. You go past at a run. The proofs can wait for another day.',
          cronica: '{nome} went looking for footprints and found the shape much too close.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'encanto',
        rotulo: 'Unmake the borrowed face',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 5 },
        sucesso: {
          texto: 'It is an enchantment stitched in a hurry, with thread from a memory of yours. You find the loose end and pull. Otto\'s face comes away whole, like a mask, and goes back inside your memory, where it belongs.',
          cronica: '{nome} unpicked Otto\'s face from the shape that wore it.',
          efeitos: { magia: 1 },
        },
        falha: {
          texto: 'The enchantment comes undone, and you would rather not have seen what is underneath. It has no face at all. You hurry past, and it turns slowly to watch you go.',
          cronica: '{nome} saw what was under Otto\'s face.',
          efeitos: { sanidade: -3 },
        },
      },
    ],
  },

  {
    id: 'ato3-lobos',
    ato: 3,
    titulo: 'The White Wolves',
    texto:
      'On a shelf of hard snow, three white wolves circle a tall rock. On top of it Dito, a shepherd boy of ten or so, hugs a lamb and is not crying out of pure stubbornness. The wolves are thin, ribs showing. They do not growl. Every so often one of them stops and looks back, into the dark they came from, with its ears flat.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Drive the wolves off',
        combate: 'loboBrancoDoCimo',
        vitoria: {
          texto: 'The biggest one comes at you and gets what it has earned. The other two weigh you up, weigh up their hunger, and choose the slope. Dito climbs down from the rock with the lamb in his arms and his legs like jelly.',
          cronica: '{nome} fought the white wolf of the Top to get a boy down off a rock.',
          efeitos: { lacos: 1 },
        },
        derrota: {
          texto: 'The wolf is quicker than its hunger would suggest. You go down, and it is Dito, yelling from up above and throwing stones, who makes the pack fall back. The two of you go down the mountain holding each other up.',
          cronica: '{nome} was beaten by the white wolf and saved by a boy with a good throwing arm.',
          efeitos: { brasa: -1, lacos: 1 },
        },
        fuga: {
          texto: 'You back away, lantern in front of you. The wolves let you. Dito stays on the rock, watching you go, and you only breathe properly when you hear, much later, the shepherds coming up with torches.',
          cronica: '{nome} left a boy ringed by wolves and hoped the shepherds would get there.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Read what the wolves want',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'They are not hemming the boy in: they are running from something, and the rock is the highest point around. You set the lantern on the ground and step back a pace. All three lie down around the warmth, and Dito climbs down the other side.',
          cronica: '{nome} saw that the wolves of the Top were more afraid of the Night than they were hungry.',
          efeitos: { lacos: 1, item: 'unguento' },
        },
        falha: {
          texto: 'You conclude they are too weak to attack. The thinnest one disagrees and shuts its teeth on your shin. Dito makes use of the confusion and jumps down beside you, lamb and all.',
          cronica: '{nome} misjudged the white wolves\' hunger and took a bite for it.',
          efeitos: { vida: -3, lacos: 1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Raise the lantern and advance',
        teste: { chave: 'fe', dificuldade: 8 },
        ajuda: ['amuleto', 'luz'],
        sucesso: {
          texto: 'You walk into the middle of them with the ember held high, unhurried and unarmed. The light strikes yellow eyes. The wolves make way, like people at a procession. Dito climbs down and takes your hand.',
          cronica: '{nome} walked through the pack with the lantern raised, and the wolves made way.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'On the third step your hand shakes, and the wolves see it. One of them leaps at the lantern. You shield it with your body and pay with your shoulder. The boy gets away in the uproar.',
          cronica: '{nome} shielded the lantern from a wolf and paid with a shoulder.',
          efeitos: { vida: -2, sanidade: -2 },
        },
      },
      {
        id: 'animais',
        rotulo: 'Talk to the lead wolf',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 4 },
        sucesso: {
          texto: 'You crouch, look off to one side, yawn. The lead wolf yawns too. Hunger, fear and cold you understand, and it understands that you understand. The pack follows you down the slope, at a distance, as far as the shelter.',
          cronica: '{nome} held a conversation with the white wolves of the Top in the language of yawns.',
          efeitos: { lacos: 1, item: 'unguento' },
        },
        falha: {
          texto: 'The lead wolf is not in a talking mood and shows you every tooth it has. You back off slowly. Dito, who is nobody\'s fool, takes his chance and climbs down the far side.',
          cronica: '{nome} tried to calm the white wolves, and they wanted none of it.',
          efeitos: { sanidade: -1, lacos: 1 },
        },
      },
      {
        id: 'ataque',
        rotulo: 'Crack lightning into the snow',
        requer: { nivel: { magiaAtaqueFisico: 1 } },
        teste: { chave: 'magiaAtaqueFisico', dificuldade: 4 },
        sucesso: {
          texto: 'You aim at the snow, two paces from their muzzles. The crash climbs the mountain and comes back as an echo. The wolves vanish down the slope without a scratch, and Dito asks you to do it again.',
          cronica: '{nome} scared off the white wolves with a thunderclap and hurt none of them.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The spell comes out weak, the snap of a twig. The wolves do not even blink. You spend the night shouting and banging the lantern on the rock until they get tired.',
          cronica: '{nome} drove off the white wolves by shouting, after the magic failed.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },
];
