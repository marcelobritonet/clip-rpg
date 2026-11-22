/**
 * The Last Ember, Act 1: The Valley. Road, farmsteads, the toll bridge, the
 * crossroads fair and the river, by day. Small people and small problems.
 */

export const itens = {};

export const companheiros = {
  nicaSaltimbanca: {
    nome: 'Nica',
    quem: 'tumbler with the strolling players, falls well and laughs loud',
    niveis: { destreza: 2, presenca: 1 },
  },
  gansoAnselmo: {
    nome: 'Anselmo',
    quem: 'bad-tempered white goose, a better watchman than any dog',
    niveis: { percepcao: 1, intimidacao: 1 },
  },
};

export const inimigos = {
  gansoAnselmoBravo: {
    nome: 'Anselmo the Goose',
    ataque: 1,
    defesa: 1,
    vida: 3,
    arma: 0,
    armadura: 0,
    resistencia: 0,
    reflexo: 2,
    vontade: 2,
    fe: 0,
  },
};

export const cenas = [
  {
    id: 'ato1-coelho',
    ato: 1,
    titulo: 'Widow Zulmira\'s Rabbit',
    texto:
      'By the roadside, an old woman in an apron is running circles around a cabbage. The rabbit she meant to sell at the fair has chewed through its basket and is now eating the neighbour\'s vegetable patch, with one eye on you. "That\'s this month\'s rent," she pants. The rabbit, fat and without remorse, hops a little further off.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Chase the rabbit',
        teste: { chave: 'agilidade', dificuldade: 6 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Three feints, one dive, and you get up with dirt in your mouth and an indignant rabbit in your arms. Widow Zulmira pays with what she has: a little bag of balm tea and a kiss on the forehead.',
          cronica: '{nome} caught Widow Zulmira\'s rabbit in a single dive.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'You dive where the rabbit was. The rabbit is already somewhere else. You are left with a skinned knee and the cabbage, which Widow Zulmira takes to the fair in its place.',
          cronica: '{nome} lost a race to a fat rabbit.',
          efeitos: { vida: -1 },
        },
        desastre: {
          texto: 'The rabbit goes under the fence. You go over it and land flat on your back in the neighbour\'s pig trough. The lantern stays upright by a miracle. The neighbour would like a long explanation.',
          cronica: '{nome} fell into a pig trough chasing a rabbit.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find its escape route',
        teste: { chave: 'percepcao', dificuldade: 5 },
        sucesso: {
          texto: 'There is only one hole in the fence, with fur caught on the board. You lay the basket there and clap your hands on the far side. The rabbit turns itself in. Widow Zulmira stuffs a little bag of tea into your pocket.',
          cronica: '{nome} sent Widow Zulmira\'s rabbit running straight into the basket.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'You guard the wrong hole with great attention. The rabbit leaves by the right one. The three of you spend the morning at it, until it tires of you both and goes to sleep under the cart.',
          cronica: '{nome} spent the morning guarding the wrong hole in a fence.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Wait with a cabbage leaf',
        teste: { chave: 'vontade', dificuldade: 5 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'You sit on the ground with a leaf in your hand and do not move. Ants climb. A leg goes to sleep. The rabbit comes, suspicious, and eats until it dozes off in your lap. Widow Zulmira cries with relief and gives you tea.',
          cronica: '{nome} waited for a rabbit to come and eat from an open hand, and it came.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'The rabbit has more patience than you. When your leg starts to tingle you shift, and it starts the count again from nothing. The sun is high by the time Widow Zulmira corners it with her apron.',
          cronica: '{nome} lost a duel of patience to a rabbit.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Creep up from behind',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 3 },
        sucesso: {
          texto: 'The rabbit only notices once it is in the air, held by the ears. Widow Zulmira never saw you move. Along with the tea she hands you her late husband\'s bag of bait: "For someone who knows how to use it."',
          cronica: '{nome} caught Widow Zulmira\'s rabbit before it noticed.',
          efeitos: { lacos: 1, item: ['cha', 'isca'] },
        },
        falha: {
          texto: 'A twig snaps. The rabbit turns, looks you in the eye and bites the nearest finger. Then it lets itself be caught, satisfied with its work.',
          cronica: '{nome} was bitten by a rabbit and still handed it back to its owner.',
          efeitos: { vida: -1, lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ato1-agulha',
    ato: 1,
    titulo: 'The Bride and the Needle',
    texto:
      'In front of a farmhouse hung with ribbons, a bride holds up the hem of her dress, torn from top to bottom on a nail in the gate. Her mother, needle in one hand and thread in the other, is shaking too hard to find the eye. "It\'s a bad omen," she keeps saying. The chapel bell is already calling, and the groom is peeking from the window.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Thread the needle',
        teste: { chave: 'destreza', dificuldade: 6 },
        ajuda: ['lente'],
        sucesso: {
          texto: 'You wet the end of the thread, hold your breath, and it goes in. The mother sews up in two minutes what she cried over for twenty. On your way out she lays a wool cloak over your shoulders: "It\'s cold up there."',
          cronica: '{nome} threaded a needle and saved a wedding.',
          efeitos: { lacos: 1, item: 'manto' },
        },
        falha: {
          texto: 'The thread frays, bends, runs away. You prick your finger twice and the dress once. When it finally goes in, the bell has fallen silent and the priest is having lunch. The wedding happens, late.',
          cronica: '{nome} fought a needle until the chapel bell gave up.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Improvise a needle threader',
        teste: { chave: 'inteligencia', dificuldade: 5 },
        sucesso: {
          texto: 'A horsehair folded in half will pass through any hole and pull the thread along behind it. The mother stares as if at witchcraft, sews the hem and gives you a wool cloak for the secret.',
          cronica: '{nome} threaded the bride\'s needle with a horsehair.',
          efeitos: { lacos: 1, item: 'manto' },
        },
        falha: {
          texto: 'The candle wax stiffens the thread, the needle and your fingers. It was a good idea. The bride ends up marrying with her hem held by pins and the bell already hoarse.',
          cronica: '{nome} waxed a needle by mistake and held up a wedding.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Swear torn dresses bring luck',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You swear, by the ember you carry, that a bride in a torn dress is never widowed young. The mother wants to believe it, and so she does. Her hands go still. She threads the needle herself and wraps you in a cloak besides.',
          cronica: '{nome} convinced a mother that a torn dress is a good omen.',
          efeitos: { lacos: 1, item: 'manto' },
        },
        falha: {
          texto: '"And how many brides have you known?" the mother asks. You have known few. She cries, the bride cries, the groom shuts the window. A neighbour fixes it with pins while you stand there feeling like the nail.',
          cronica: '{nome} tried to comfort a bride and made the crying worse.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'prestidigitacao',
        rotulo: 'Thread it first try',
        requer: { nivel: { prestidigitacao: 1 } },
        teste: { chave: 'prestidigitacao', dificuldade: 3 },
        sucesso: {
          texto: 'Your fingers have done harder things in the dark. The thread goes in without a glance, and you even put in the first stitch. The mother hands you a wool cloak and a pot of salve from the pantry.',
          cronica: '{nome} threaded the needle first try, without looking, and the bride married on time.',
          efeitos: { lacos: 1, item: ['manto', 'unguento'] },
        },
        falha: {
          texto: 'Even a good hand shakes with a bride crying next to it. You get it on the fifth try. The wedding starts on time, barely, and the mother thanks you with a nod and nothing more.',
          cronica: '{nome} needed five tries for one needle.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ato1-barraca',
    ato: 1,
    titulo: 'Tiburcio\'s Apple',
    texto:
      'At the crossroads fair, a stallholder with a waxed moustache shouts louder than the rest: three darts, one apple on top of a barrel, ten paces. Hit it and you take the prize, a bone flute hanging from a string. The darts have crooked feathers. The apple, you notice, has gone wrinkled from all the waiting.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Hit the apple',
        teste: { chave: 'precisao', dificuldade: 7 },
        sucesso: {
          texto: 'The first dart flies crooked, and you learn from it. The second sinks into the apple with a wet sound. Tiburcio unties the flute slowly, like a man saying goodbye to a relative.',
          cronica: '{nome} hit Tiburcio\'s apple with the second dart and took the flute.',
          efeitos: { item: 'flauta' },
        },
        falha: {
          texto: 'The three darts find the barrel, the awning and a cheese from the stall next door. The apple remains untouched. You pay for the cheese with half an hour of apologies to the cheesemonger.',
          cronica: '{nome} missed the apple three times and hit a cheese.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'The dart splits the apple in two and stays quivering in the stall\'s pole. The fair applauds. Tiburcio, pale, hands over the flute and also the sling from the top shelf, on condition that you never come back.',
          cronica: '{nome} split Tiburcio\'s apple in two, and he paid to avoid a rematch.',
          efeitos: { item: ['flauta', 'funda'] },
        },
        desastre: {
          texto: 'The dart climbs, bends in a way nobody can explain and comes down in the rump of Tiburcio\'s mule. The mule takes the stall with it. You take a glancing kick and a lengthy talk with the fair warden.',
          cronica: '{nome} hit the stallholder\'s mule instead of the apple.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Study how the darts drift',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['lente'],
        sucesso: {
          texto: 'Feather bent to the left, heavy tip: the dart lands a hand low and to the right. You aim at nothing, above the barrel, and hit the apple. Tiburcio hands over the flute, grumbling about educated people.',
          cronica: '{nome} did the sums on the crooked darts and took the bone flute.',
          efeitos: { item: 'flauta' },
        },
        falha: {
          texto: 'Your sums are right for identical darts. All three are crooked in different ways. Tiburcio watches the calculations with a smile and picks the darts up off the ground, one by one, in no hurry.',
          cronica: '{nome} calculated a great deal and hit very little at Tiburcio\'s stall.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Dare him to hit it',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: '"Show us how it\'s done," you say, loudly, and the fair stops to watch. Tiburcio misses three times with his own darts. He hands over the flute quickly, so the laughing will end sooner.',
          cronica: '{nome} made Tiburcio miss his own apple in front of the whole fair.',
          efeitos: { item: 'flauta' },
        },
        falha: {
          texto: 'Tiburcio knows every dart by name. He hits the apple with his back turned, over his shoulder, and the fair laughs at you with relish. A boy follows you past two stalls doing an impression of your face.',
          cronica: '{nome} challenged the stallholder and became the stall\'s main attraction.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'maFama',
        rotulo: 'Let him recognise you',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'Tiburcio looks twice and the colour drains from his moustache. He has heard the stories. He takes the flute off its string and puts it in your hand without a single dart thrown, asking only that you keep travelling.',
          cronica: '{nome} won Tiburcio\'s flute without playing, simply for being the one in the stories.',
          efeitos: { item: 'flauta' },
        },
      },
    ],
  },
  {
    id: 'ato1-jarro',
    ato: 1,
    titulo: 'Honey on the Hill',
    texto:
      'On the slope down to the river, a beekeeper\'s cart jolts uphill behind a mule in no hurry. The owner is dozing on the seat. Up on top of the load the rope has gone slack, and a honey jar the size of a child is swaying outward, once, twice, right above your head.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Catch the falling jar',
        teste: { chave: 'reflexo', dificuldade: 6 },
        sucesso: {
          texto: 'The jar falls and finds your arms in the way. It weighs as much as a calf. The beekeeper wakes at the thud, understands everything at once and gives you a pot of beeswax salve.',
          cronica: '{nome} caught in mid-air a jar of honey worth a whole harvest.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'Your fingers brush the clay and nothing more. The jar opens on the road like a flower. The local bees arrive before the apologies do, and two of them prefer you.',
          cronica: '{nome} was half a hand too late for a jar of honey.',
          efeitos: { vida: -1 },
        },
        critico: {
          texto: 'You catch the jar with one hand and the lid with the other. You put it all back and retie the rope. The beekeeper, who woke up halfway through, takes off his hat and hands you salve and gratitude.',
          cronica: '{nome} caught the jar and the lid, and the beekeeper took to telling the story at every fair.',
          efeitos: { item: 'unguento', lacos: 1 },
        },
        desastre: {
          texto: 'You get there in time, underneath, in the exact spot. So does the jar. When the world comes back you are sitting in the road, sticky down to your boots, and the beekeeper is fanning you with his hat.',
          cronica: '{nome} caught a jar of honey head first.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find the knot that slipped',
        teste: { chave: 'percepcao', dificuldade: 5 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'The whole load hangs on one loop at the left rail. You pull the end, take two turns, and the jar settles with a sigh. The beekeeper wakes and repays the favour with beeswax salve.',
          cronica: '{nome} saved a beekeeper\'s honey with two turns of rope.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'You pull one end. It was the end holding up the rest. The big jar stays, and two small ones fall. You help gather the shards while the beekeeper counts his losses out loud.',
          cronica: '{nome} pulled the wrong rope on the beekeeper\'s cart.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Order the mule to stop',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'A single "whoa", dry, from someone who will not be argued with. The mule stops dead, the load settles, the jar thinks better of it. The beekeeper wakes, sees the slack rope and holds out a pot of salve.',
          cronica: '{nome} stopped a mule with one syllable and saved a jar of honey.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'The mule takes the shout as the order to go. The cart lurches off, and the jar stays behind, in the air, and then on the ground. The beekeeper wakes and decides the fault lies with whoever shouted.',
          cronica: '{nome} startled a mule and took the blame for the spilled honey.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'magia',
        rotulo: 'Hold the jar in mid-air',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 4 },
        sucesso: {
          texto: 'The jar falls halfway and stops, as if it had remembered an appointment. You lay it back on the load with a gesture. The beekeeper wakes, asks no questions and gives you salve and tea.',
          cronica: '{nome} left a jar of honey waiting in mid-air.',
          efeitos: { item: ['unguento', 'cha'] },
        },
        falha: {
          texto: 'The jar comes down slowly, almost politely, and cracks on touching the ground all the same. The honey runs. The beekeeper looks at your hands for a long while and drives on without a word.',
          cronica: '{nome} softened a jar\'s fall, but not enough.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 'ato1-plateia',
    ato: 1,
    titulo: 'The Players\' Stage',
    texto:
      'On a wagon stage in the middle of the fair, a troupe of strolling players is sinking. The clown is in bed with toothache, and the girl standing in for him, Nica, is telling the same joke for the third time. The audience folds its arms. Someone is already picking out a tomato. Nica spots you in the front row and holds out a hand, with the eyes of someone drowning.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Take falls on purpose',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'You climb up, trip on the step and land sitting on the bass drum. The audience wakes up. Nica catches on at once and starts knocking you over methodically. At the end, out of breath, she says she is coming along to see this Beacon of yours.',
          cronica: '{nome} fell seven times on a fairground stage, every one of them on purpose.',
          efeitos: { companheiro: 'nicaSaltimbanca' },
        },
        falha: {
          texto: 'The first fall is on purpose. The second is real, from the stage to the fairground dirt. The audience laughs anyway, which helps the troupe and does not help your shoulder.',
          cronica: '{nome} fell off the players\' stage without rehearsing it.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Tell the valley\'s joke',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        ajuda: ['livro'],
        sucesso: {
          texto: 'Every fair laughs at the people from the other bank of the river. You tell the one about the ferryman who charged for the trip over and forgot the trip back. Laughter of recognition, from the back. Nica decides then and there that she wants to travel with someone who knows people.',
          cronica: '{nome} saved the players with the oldest joke in the valley.',
          efeitos: { companheiro: 'nicaSaltimbanca' },
        },
        falha: {
          texto: 'The joke is about the people from the other bank. Half the audience came from the other bank, by ferry, this morning. The silence lasts until a tomato settles the matter.',
          cronica: '{nome} told the right joke to the wrong riverbank.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Make the audience laugh',
        teste: { chave: 'empatia', dificuldade: 6 },
        ajuda: ['musica'],
        ajudantes: [{ nome: 'Nica', nivel: 1 }],
        sucesso: {
          texto: 'You tell your own journey as it is: one person crossing the world with a pot of fire. The audience laughs because it is true. Nica laughs too, and asks for a place on the road beside you.',
          cronica: '{nome} made the crossroads fair laugh and gained a tumbler for company.',
          efeitos: { companheiro: 'nicaSaltimbanca', marco: true },
        },
        falha: {
          texto: 'You start well and forget the ending. The audience waits, politely, and then stops being polite. The tomato is well aimed. Nica lends you a handkerchief and a look between colleagues.',
          cronica: '{nome} forgot the end of the joke in front of the whole fair.',
          efeitos: { sanidade: -1 },
        },
        critico: {
          texto: 'The fair laughs until it cries. The man with the tomato eats the tomato. Inside the lantern the ember crackles and swells, as if it got the joke too. Nica is already packing her bundle to go with you.',
          cronica: '{nome} made the fair laugh so hard that even the ember burned brighter.',
          efeitos: { companheiro: 'nicaSaltimbanca', marco: true, brasa: 1 },
        },
        desastre: {
          texto: 'Nobody laughs. A child starts crying, and that is the only reaction of the afternoon. The tomatoes come in order, without anger, like a duty being done. You step down from the stage redder outside than in.',
          cronica: '{nome} was booed off with tomatoes at the crossroads fair.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Treat the clown\'s tooth',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        sucesso: {
          texto: 'Clove, a bitter mouthwash and ten minutes. The clown takes the stage swollen on one side only and brings the house down. The troupe gives you a bundle of herbs, and Nica, now out of a part, asks to come along.',
          cronica: '{nome} cured the clown\'s tooth and gave the players their laughter back.',
          efeitos: { companheiro: 'nicaSaltimbanca', item: 'ervas' },
        },
        falha: {
          texto: 'The tooth is worse than it looked, and the clown bites. It takes most of the afternoon. He only gets on stage as the fair is closing, for half a dozen stubborn souls.',
          cronica: '{nome} spent the afternoon wrestling a clown\'s tooth.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato1-ponte',
    ato: 1,
    titulo: 'The Toll Bridge',
    texto:
      'The stone bridge has a new barrier and a man in a large hat sitting on a little stool. "Toll\'s doubled. Baron\'s orders," he says, without looking at you. Behind him, nailed up crooked, is a notice with the ink still wet. As far as you know, the valley has no baron. The river runs below, wide and cold.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Swim across the river',
        teste: { chave: 'fisico', dificuldade: 6 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'You wade in with the lantern held above your head and come out the other side puffing, the ember dry. On the bridge, the man in the hat watches it all with the face of someone who has lost a customer.',
          cronica: '{nome} swam the river rather than pay a toll to any baron.',
        },
        falha: {
          texto: 'The current has opinions of its own. You come out half a league downstream, swallowing water, the lantern saved by a hair and your boots weighing double.',
          cronica: '{nome} was carried downriver and walked back, dripping.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Catch him in the lie',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: 'You ask the baron\'s name. Then you ask again, another way. Two different names come out. The farmhands in the queue look at one another. The man remembers an urgent appointment and leaves the barrier open.',
          cronica: '{nome} unmasked the false toll collector at the bridge with two questions.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'He lies well, and in detail: the baron, the baroness, the baron\'s horse. You argue until the sun has moved and end up crossing at the ford, far off, with wet feet.',
          cronica: '{nome} lost an argument about a baron who does not exist.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sit and outwait him',
        teste: { chave: 'vontade', dificuldade: 6 },
        sucesso: {
          texto: 'You set the lantern on the ground, sit down in front of him and say nothing. The queue grows behind you. Someone brings a bench, someone else brings bread. The man lifts the barrier before it can turn into a party.',
          cronica: '{nome} wore down the toll collector at the bridge without saying a word.',
        },
        falha: {
          texto: 'He has a stool, shade and all day. You have an ember burning down. After far too long you get up and go looking for the ford, listening to the man whistle.',
          cronica: '{nome} tried to beat a toll collector at stubbornness and lost.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Examine the notice',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'The ink stains your finger and the seal is a bottle stopper. Underneath is the old notice: toll abolished twenty years ago. You read it out loud. The man runs off and leaves a good oil lamp behind.',
          cronica: '{nome} read the true notice of the bridge out loud, and the toll collector vanished.',
          efeitos: { item: 'lamparina' },
        },
        falha: {
          texto: 'The man snatches the notice from your hand before you finish reading and swallows it, which is also an answer. With no paper left it is his word against yours, and he lifts the barrier with bad grace.',
          cronica: '{nome} watched the toll collector at the bridge eat the evidence.',
        },
      },
      {
        id: 'ganso',
        rotulo: 'Introduce Anselmo',
        requer: { companheiro: 'gansoAnselmo' },
        livre: true,
        resultado: {
          texto: 'Anselmo looks at the man in the hat and does not like him. He advances with his neck low, hissing. The toll collector climbs onto the parapet, then up the post, and from up there announces that the toll has been suspended.',
          cronica: '{nome} crossed the bridge behind a goose who pays no toll.',
        },
      },
    ],
  },
  {
    id: 'ato1-encruzilhada',
    ato: 1,
    titulo: 'Three Roads and a Carter',
    texto:
      'Where the road splits in three, the stone marker lies face down in the mud. A carter scratches his head over it, with a load of salt to deliver before dark. "One goes to the Heights, one to the marsh, one to my mother-in-law\'s house," he says. "I don\'t know which is worst."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Raise the fallen marker',
        teste: { chave: 'forca', dificuldade: 7 },
        ajuda: ['alavanca'],
        ajudantes: [{ nome: 'the carter', nivel: 1 }],
        sucesso: {
          texto: 'The stone comes out of the mud with a sound like an old boot. The three arrows can still be read. The carter finds his way and leaves you an old map: "Never could read the thing. Maybe you can."',
          cronica: '{nome} stood the crossroads marker back on its feet.',
          efeitos: { item: 'mapa' },
        },
        falha: {
          texto: 'The marker rises a hand, thinks it over and comes back down, this time on the toe of your boot. The arrows go on pointing into the earth. The two of you pick by guesswork, limping.',
          cronica: '{nome} lost an arm-wrestle to a stone.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Recall the valley\'s geography',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['mapa', 'livro'],
        sucesso: {
          texto: 'The river rises in the Heights, so the road that climbs against the water is yours. The marsh lies where the ground turns dark. That leaves the mother-in-law. The carter sighs and makes you a present of an old map.',
          cronica: '{nome} worked out the crossroads from the course of the river.',
          efeitos: { item: 'mapa' },
        },
        falha: {
          texto: 'You are certain. The certainty lasts to the first puddle, then up to the knee. The pair of you come back from the marsh at the end of the afternoon, and the carter no longer asks your opinion.',
          cronica: '{nome} led a carter into the marsh, with complete conviction.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Let the ember choose',
        teste: { chave: 'fe', dificuldade: 6 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You raise the lantern before each road. At two of them the ember sleeps. At the third it brightens, like someone recognising home. The carter takes off his hat and trusts you with the map he has been carrying for nothing.',
          cronica: '{nome} let the ember choose the road, and it chose right.',
          efeitos: { item: 'mapa' },
        },
        falha: {
          texto: 'The ember brightens toward wherever the wind blows, and the wind blows toward the marsh. You find this out with mud up to your shins. The carter, who did not follow, is still there when you get back.',
          cronica: '{nome} followed a sign from the ember that was only wind.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Read the ground',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'Deep cart ruts on one road, rushes on another, loose flood stone on the third: fair, marsh, hills. The carter gives you the map and a lump of salt, and you leave without losing a minute.',
          cronica: '{nome} read the three roads in the dirt, like reading a signpost.',
          efeitos: { item: ['mapa', 'isca'] },
        },
        falha: {
          texto: 'Yesterday\'s rain wiped out nearly everything. You get your own road right and the carter\'s wrong, and he ends up at his mother-in-law\'s. He will say, later, that it was on purpose.',
          cronica: '{nome} found the right road and sent a carter to his mother-in-law.',
        },
      },
    ],
  },
  {
    id: 'ato1-balsa',
    ato: 1,
    titulo: 'The Ferry on the Sandbank',
    texto:
      'On the river, the ferry has run aground on a sandbank twenty fathoms from shore with half the fair on board: hens, barrels, a seasick priest. The ferryman hauls on the rope alone and curses in three dialects. On the bank a whole crowd looks on with folded arms, offering advice. Without the ferry, nobody crosses today. Not even you.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Haul the rope by hand',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['corda', 'alavanca'],
        ajudantes: [{ nome: 'the ferryman', nivel: 1 }],
        sucesso: {
          texto: 'You wade in up to your waist and haul alongside him. The sand holds, holds, and lets go all at once. The ferry slides free. The ferryman, with no breath left to curse, carries you across for nothing, standing at the prow.',
          cronica: '{nome} hauled the ferry off the sand by hand, alongside the ferryman.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The rope burns your hands and the ferry does not budge. The bank offers more advice. Only in mid-afternoon does the water rise a finger and do by itself what the two of you could not.',
          cronica: '{nome} hauled on the ferry all afternoon, and it was the river that set it loose.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Read the current',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: {
          texto: 'The water is darker on the left: that is where it runs deep. You shout for everyone to move to the stern. The prow lifts, the current catches it sideways and the ferry spins free, with the priest clinging to a hen.',
          cronica: '{nome} freed the ferry by moving one priest and twelve hens.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'You send everyone to the stern. The stern sinks deeper into the sand. The ferryman adds a fourth dialect. The ferry only comes loose when the river rises, in mid-afternoon.',
          cronica: '{nome} offered one more piece of advice on the riverbank, and a wrong one.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Get the crowd hauling',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'You climb onto a barrel and say that advice never hauled a ferry. They laugh, and then they come. Forty hands on the rope, a single shout. The ferry comes free, and the whole bank crosses over singing with you.',
          cronica: '{nome} rallied the crowd on the bank and floated the ferry.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'You climb onto a barrel. The barrel was empty and had no lid. The crowd gets its talking point for the day, and the ferry stays where it is until the river rises of its own accord.',
          cronica: '{nome} fell into a barrel in the middle of a speech.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'The whole bank comes: the cheesemonger, the boys, the priest from the other parish. The ferry leaves the sand almost flying. The ferryman gives you a coil of new rope and swears you will never pay for a crossing again.',
          cronica: '{nome} set an entire fair hauling on the same rope.',
          efeitos: { lacos: 1, marco: true, item: 'corda' },
        },
      },
      {
        id: 'fama',
        rotulo: 'Say who you are',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Your name and the raised lantern are enough. The people who were giving advice roll up their sleeves without waiting for the end of the sentence. The ferry comes off in three heaves, and the ferryman makes you a gift of a coil of rope.',
          cronica: '{nome} spoke a name on the riverbank, and the whole bank came to help.',
          efeitos: { lacos: 1, item: 'corda' },
        },
      },
    ],
  },
  {
    id: 'ato1-ganso',
    ato: 1,
    titulo: 'The Goose at the Well',
    texto:
      'At a farmstead with a low fence, a grandmother and two grandchildren watch their own well from a distance, holding empty buckets. Between them and the water, a white goose patrols with his neck stretched out. "That\'s Anselmo," the old woman explains. "My late husband had the same temper and the same name. Since yesterday he won\'t let anyone near."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Fight the goose',
        combate: 'gansoAnselmoBravo',
        vitoria: {
          texto: 'After a great many feathers in the air, Anselmo retires to the roof, offended. The grandchildren fill the buckets. The grandmother thanks you with her lips pressed shut, looking at the goose the way one looks at a portrait.',
          cronica: '{nome} beat a goose in combat and was not very proud of it.',
        },
        derrota: {
          texto: 'You wake under the fig tree, with the grandmother fanning you and the grandchildren counting the pecks out loud. Anselmo is still at the well. The lantern he did not want.',
          cronica: '{nome} was defeated by a goose named Anselmo.',
          efeitos: { sanidade: -1 },
        },
        fuga: {
          texto: 'You jump the fence with Anselmo half a hand from your heels. The grandchildren applaud the goose. The grandmother offers you water from the rain barrel, which is what the family has been drinking.',
          cronica: '{nome} fled from a goose by jumping a fence.',
        },
      },
      {
        id: 'mente',
        rotulo: 'Work out what he guards',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'No animal guards a well. Behind the stone, in a nest of straw, his mate is sitting on her eggs. You draw water from the other side with a long rope, and teach the grandchildren. Anselmo keeps watch, but lets it be.',
          cronica: '{nome} found the nest behind the well and taught the family to go around.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'You conclude that he wants corn. You bring corn. Anselmo accepts the corn and then your shin. The nest behind the well you only see on the retreat, in passing.',
          cronica: '{nome} tried to bribe a goose with corn and paid with a shin.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ask the departed\'s leave',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You take off your hat and ask Mister Anselmo\'s leave, respectfully, explaining the family\'s thirst and the ember. The goose listens, makes way and, when you leave, comes along behind. "He always wanted to travel," says the grandmother.',
          cronica: '{nome} asked a goose\'s leave and left the farm with him for company.',
          efeitos: { lacos: 1, companheiro: 'gansoAnselmo' },
        },
        falha: {
          texto: 'You take off your hat. Anselmo makes use of the fact that your hands are busy. The grandmother remarks that her late husband was never one for talk either. The grandchildren fetch water from the stream, a long way off.',
          cronica: '{nome} spoke to a goose the way one speaks to the dead, and took a beating from the goose.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'animais',
        rotulo: 'Speak the goose\'s language',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        sucesso: {
          texto: 'Neck low, slow steps, no looking him in the face: you tell him in goose that you want nothing to do with the nest. Anselmo lets the family through. At the gate he decides you need an escort, and the grandmother sends salve.',
          cronica: '{nome} came to terms with the goose at the well and gained a bodyguard.',
          efeitos: { lacos: 1, companheiro: 'gansoAnselmo', item: 'unguento' },
        },
        falha: {
          texto: 'You get the posture right and the accent wrong. Anselmo tolerates you, and only you. The grandchildren spend the afternoon passing you buckets over the fence, one by one.',
          cronica: '{nome} became the only water carrier the goose at the well would accept.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },
];
