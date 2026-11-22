/**
 * The Last Ember, Act 2: The Old Wood. Ancient forest, ruins of the folk who
 * came before, lost travellers and the first signs of the Long Night. Dusk.
 */

export const itens = {};

export const companheiros = {
  nunoCartografo: {
    nome: 'Nuno',
    quem: 'a mapmaker who got lost inside his own map, good with sums and a ruler',
    niveis: { inteligencia: 2, percepcao: 1 },
  },
  dalvaPeregrina: {
    nome: 'Sister Dalva',
    quem: 'a pilgrim in a grey habit, climbing to the Beacon to keep a vow',
    niveis: { fe: 2, vontade: 1 },
  },
};

export const inimigos = {
  ato2VultoDaBeira: {
    nome: 'Shade at the edge of the light',
    ataque: 2,
    defesa: 2,
    vida: 4,
    arma: 0,
    armadura: 0,
    resistencia: 0,
    reflexo: 1,
    vontade: 2,
    fe: 0,
    mental: true,
  },
};

export const cenas = [
  {
    id: 'ato2-labirinto',
    ato: 2,
    titulo: 'The blackthorn maze',
    texto:
      'The trail runs into a blackthorn hedge taller than a horse, planted in coils by people who are no longer anywhere. Ten turns in, every wall looks the same and the light comes in sideways, the colour of honey. Somewhere inside, a man is counting his steps out loud. He loses count and starts again.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Force a way through',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'You pick a direction and refuse all others. Branch by branch, the hedge gives. Past the third breach stands a thin man with an inkwell at his belt, who follows you out without asking a single question.',
          cronica: '{nome} crossed the blackthorn maze in a straight line and brought a mapmaker out of it.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'The blackthorn is older than you and more stubborn. An hour later you come out exactly where you went in, hands torn, and walk the whole way round the outside.',
          cronica: '{nome} picked a fight with a blackthorn hedge and lost.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Memorise every turn',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['mapa'],
        sucesso: {
          texto: 'An empty nest, a snapped branch, a stone with moss on one side only. You keep them all. You find the man who was counting steps, a mapmaker and rather embarrassed about it, and unwind the way back without missing a turn.',
          cronica: '{nome} remembered the way back out of the blackthorn maze and brought Nuno the mapmaker along.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'The empty nest turns up three times. Or there are three nests. When the hedge finally lets go of you, it is on the wrong side, and the voice counting steps is still in there, starting again.',
          cronica: '{nome} got lost in the blackthorn maze and came out without knowing how.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
        critico: {
          texto: 'You remember even what the mapmaker forgot. At the way out he pulls an old map of the wood from his satchel, corrects three trails while you dictate, and hands you the sheet. "Better with someone who can use it."',
          cronica: '{nome} left the blackthorn maze with a mapmaker and with his map.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1, item: 'mapa' },
        },
      },
      {
        id: 'fe',
        rotulo: 'Follow the ember\'s warmth',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You shut your eyes and let the lantern choose. It warms one way and cools the other. The lost mapmaker hears you go by and catches the hem of your coat, and the ember leads you both out.',
          cronica: '{nome} walked out of the maze with eyes shut, towing a mapmaker by the hem of a coat.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'The lantern is lukewarm in every direction. You walk with your eyes shut until your face meets the blackthorn, and come out much later, alone, through a fox hole.',
          cronica: '{nome} trusted the ember inside the maze, and the ember did not answer.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Mark the way with knots',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'A knot of grass at every turn, always on the left. A child\'s trick, and it works. You reach the mapmaker, who stares at the knots as if they were magic, and the two of you walk back reading your own trail.',
          cronica: '{nome} beat the blackthorn maze with knots of grass and came out with a mapmaker.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'The grass here falls apart in your fingers. Half the knots are gone before the way back. You get out, but late, and without ever reaching the voice that counted steps.',
          cronica: '{nome} marked the maze with knots that did not last.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-trava',
    ato: 2,
    titulo: 'The door with no handle',
    texto:
      'The dusk wind comes in cold and the lantern flame lies down flat. Among the roots of a fig tree stands a stone house of the old folk, almost whole, with a smooth door: no handle, no keyhole, only carved spirals and the deep print of a hand. One corner of the roof fell in long ago. Inside, the air is still.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Climb in through the roof',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'The fig tree makes a ladder and the wall has places for a foot. You drop down inside, light as you like, and sit out the worst of the wind in the dry, with the ember quiet between your knees.',
          cronica: '{nome} got into the house of the old folk through the roof and waited for the wind to pass.',
        },
        falha: {
          texto: 'A loose stone, a branch that was not a branch. You land badly on the outside and ride out the wind huddled against the wall, your body wrapped around the lantern.',
          cronica: '{nome} fell off the roof of a ruin and shielded the ember with a set of ribs.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Look for the hidden catch',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'One of the spirals turns the opposite way from the rest. You press its centre and the stone slides aside without a creak. Inside there is a bench, firewood a hundred years dry, and no wind at all.',
          cronica: '{nome} found the secret catch on the house of the old folk and sheltered the ember from the wind.',
          efeitos: { brasa: 1, marco: true },
        },
        falha: {
          texto: 'You press spiral after spiral until the light runs out. The door keeps its secret. The wind goes over the top of you and takes a little of the ember with it.',
          cronica: '{nome} never found how to open the door of the old folk.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Leave your hand there',
        teste: { chave: 'vontade', dificuldade: 7 },
        sucesso: {
          texto: 'The handprint is ice, and the cold climbs your arm to the shoulder. You stay. At the last moment you can bear, the stone warms, cracks and opens. Whoever made this door wanted to know who had patience.',
          cronica: '{nome} opened the door of the old folk by doing nothing but staying put.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'The cold reaches your elbow and brings a sorrow with it, someone else\'s, from the people who shut this door for the last time. You pull your hand away. The door goes on being a door.',
          cronica: '{nome} laid a hand on the door of the old folk and felt a sorrow that belonged to someone else.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'historia',
        rotulo: 'Read the spirals',
        requer: { nivel: { historia: 1 } },
        teste: { chave: 'historia', dificuldade: 3 },
        sucesso: {
          texto: 'It is a greeting: "Come in asking, go out thanking." You ask, in the old words, and the door opens. On the inside wall someone has drawn the Beacon alight and a line of people climbing to it.',
          cronica: '{nome} read the greeting of the old folk and saw, on a wall, the Beacon of other days.',
          efeitos: { brasa: 1, marco: true },
        },
        falha: {
          texto: 'The language is older than any book you have read. You ask wrongly, three times. The door takes no offence, but it does not open either, and the wind is not one for waiting.',
          cronica: '{nome} tried speaking the tongue of the old folk to a door.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'encanto',
        rotulo: 'Wake the door\'s enchantment',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 4 },
        sucesso: {
          texto: 'The enchantment is asleep, but alive. You blow on it the way you blow on an ember, and the door opens slowly, pleased to be of use again. Inside, the air still holds a scrap of very old warmth.',
          cronica: '{nome} woke the enchantment on a door of the old folk.',
          efeitos: { brasa: 1, marco: true },
        },
        falha: {
          texto: 'The enchantment wakes in a fright and shuts tighter. For a moment you feel the door looking back at you, and there is no welcome in the look.',
          cronica: '{nome} startled the enchantment on an ancient door.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-picada',
    ato: 2,
    titulo: 'The bite',
    texto:
      'You put a hand on a fallen log to hop a stream, and the log bites. A thin snake the colour of dead leaves is gone into the litter before the shock is over. Two holes in your wrist. Your hand starts to tingle, then your arm, and the trees around you grow an edge they did not have before.',
    abordagens: [
      {
        id: 'saude',
        rotulo: 'Walk the venom off',
        teste: { chave: 'saude', dificuldade: 6 },
        sucesso: {
          texto: 'You bind the arm, drink water and walk. You sweat cold, throw up once, walk some more. By the time the sun touches the treetops, the tingling has gone down into your fingers and stayed there, small.',
          cronica: '{nome} took a snakebite in the Old Wood and kept walking until the venom gave up.',
        },
        falha: {
          texto: 'Your legs fold before the fever breaks. You wake face down in the moss with no idea how long you slept, your arm swollen and the lantern lying on its side.',
          cronica: '{nome} went down with fever after a snakebite.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Recall the healing leaf',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['livro', 'remedio'],
        sucesso: {
          texto: 'Broad leaf, silver underside, always grows near where the snake lives. There it is, three steps away. You chew it, spit it on the wound and tie it down. Before long the trees have their proper outlines back.',
          cronica: '{nome} treated a snakebite with the right leaf.',
        },
        falha: {
          texto: 'Silver underside or purple? You go with purple. The leaf does no harm at all, and no good. The venom carries on with its business while you chew weeds.',
          cronica: '{nome} chewed the wrong leaf against a snake\'s venom.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Slow your heart',
        teste: { chave: 'vontade', dificuldade: 7 },
        sucesso: {
          texto: 'Fear makes blood run, and running blood carries venom. You sit, breathe to a count of four and make your heart go slowly. The venom tires out before it reaches your shoulder.',
          cronica: '{nome} beat a snake\'s venom by staying calmer than the snake.',
        },
        falha: {
          texto: 'You count to four and your heart counts to a hundred. The edges of the trees are moving. One of them says your name, very clearly, before the fever comes down.',
          cronica: '{nome} raved with venom and heard a tree call out a name.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Bleed and dress the wound',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        sucesso: {
          texto: 'A small cut, suction, cold ash over the top. Clean work. There is silver leaf left over for a paste, which you keep in a rag: someone else in this wood is going to need it.',
          cronica: '{nome} treated the snakebite single-handed and came away with a salve besides.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'The hand that shakes is the hand that holds the blade. The cut goes too deep. The venom leaves, but takes a little blood along as a tip.',
          cronica: '{nome} treated the snakebite with a shaking hand.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'ervas',
        rotulo: 'Use up the herbs',
        requer: { item: 'ervas' },
        livre: true,
        resultado: {
          texto: 'There is a bit of everything in the bundle, including the bit that helps. You spend the lot on one poultice, and the tingling backs off before it gets past your elbow. The bundle is gone. The arm is still here.',
          cronica: '{nome} spent the whole bundle of herbs on one snakebite.',
          efeitos: { semItem: 'ervas' },
        },
      },
    ],
  },
  {
    id: 'ato2-corda',
    ato: 2,
    titulo: 'The honey-woman in the oak',
    texto:
      'In an oak the size of a church, six men high, an old woman sits on a branch among the bees with a pot of honey in her lap. Her ladder lies on the ground in two pieces, next to a coil of rope. "No hurry," she calls down. "But the night is in one, and I can\'t see in the dark."',
    abordagens: [
      {
        id: 'arremesso',
        rotulo: 'Throw her the rope',
        teste: { chave: 'arremesso', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'The rope goes up spinning, clears the branch and drops into her lap beside the honey. The old woman ties a knot like someone who has tied a great many things in her life, and comes down slowly, grumbling at the bees.',
          cronica: '{nome} threw a rope six men high and got Sabina the honey-woman down from the oak.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The rope goes up and comes back, goes up and comes back. On the tenth try the old woman loses patience, hugs the trunk and climbs down by herself, half an hour of near misses. "Thanks for the company," she says, dry as a husk.',
          cronica: '{nome} missed ten throws of a rope while an old woman climbed down the oak by herself.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'The rope finds the branch first time and takes a turn around it for good measure. "That was luck," says the old woman, already on her way down. "But you say thank you for luck as well." She fills your hand with lemon balm leaves.',
          cronica: '{nome} hit the branch of Sabina the honey-woman on the first throw and was paid in balm tea.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        desastre: {
          texto: 'The rope goes straight into the hive. What happens next is quick and has a lot of wings. The old woman climbs down by herself in the middle of it all, and she is the one who ends up daubing mud on your stings.',
          cronica: '{nome} hit a beehive with a rope and was rescued by the person in need of rescue.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Mend the ladder',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'The two halves meet on a slant, and wet vine tightens as it dries. You wedge the splice and climb first, to prove it. The old woman follows you down, rung by rung, without spilling the honey.',
          cronica: '{nome} mended a ladder with vine and a wedge and got Sabina the honey-woman down from the oak.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The splice holds your weight on the way up and resigns on the way down. You reach the ground ahead of schedule. Up above, the old woman sighs and starts down the trunk on her own account.',
          cronica: '{nome} fell off a ladder only just mended.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Talk her down',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: '"Left foot, a hand\'s width lower. Now the big knot, on your right." She leans on your voice like a handrail. On the ground she smooths her skirt, takes a good look at you and pulls a little bag of lemon balm from her apron.',
          cronica: '{nome} got Sabina the honey-woman down from the oak with nothing but a voice, and was paid in balm tea.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: '"Left. No, the other left." She freezes halfway down the trunk and stops listening to anybody. You climb up to fetch her and the two of you come down together, slowly, while the afternoon walks off.',
          cronica: '{nome} mixed up left and right and had to climb the oak after an old woman.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'abelhas',
        rotulo: 'Settle the bees',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        sucesso: {
          texto: 'Green-leaf smoke and a low hum, pitched the way they like it. The swarm draws in. With no bees about, the old woman comes down the trunk like a girl, and repays the kindness in lemon balm and advice.',
          cronica: '{nome} calmed a swarm so Sabina the honey-woman could climb down from the oak.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'The bees round here have a different accent. Three stings later you give up on the humming, and the old woman comes down anyway, laughing at you the whole length of the trunk.',
          cronica: '{nome} tried to make conversation with the bees of the Old Wood and took three stings.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-salteador',
    ato: 2,
    titulo: 'The knife and the peddler',
    texto:
      'At a bend in the trail a peddler kneels beside his handcart, the buckles of his pack already undone. Behind him a hooded man holds a knife and looks everywhere except at the knife. He is young, he is thin, and he has not seen you yet. The blade shakes a little.',
    abordagens: [
      {
        id: 'golpe',
        rotulo: 'Knock the lad out cold',
        teste: { chave: 'ataqueCorporal', dificuldade: 7 },
        sucesso: {
          texto: 'One step, a fist in the right spot behind the ear. The lad drops like washing off a line, still breathing. The peddler ties his hands with satin ribbon and presses an oil lamp into yours, out of gratitude.',
          cronica: '{nome} laid out a robber with a single blow and hurt him no more than was needed.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'The blow lands on the hood. The lad yells, slashes blind at the air and catches your forearm before bolting into the trees with the peddler\'s pack under his arm.',
          cronica: '{nome} missed a swing at a robber and took a cut on the arm.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Notice how scared he is',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: 'Nobody who holds a knife like that has ever used one. You say so out loud, calmly, and offer him half your bread. The lad looks at the bread, looks at the knife and picks the bread. The peddler, stunned, gives you an oil lamp.',
          cronica: '{nome} disarmed a robber with half a loaf.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'You tell him he hasn\'t the nerve to use that knife. It was true until you said it. He lunges to prove you wrong, misses badly and runs, but the fright and a scratch stay with you.',
          cronica: '{nome} doubted a robber\'s courage at the wrong moment.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Offer them both a deal',
        teste: { chave: 'presenca', dificuldade: 7 },
        ajudantes: [{ nome: 'the peddler', nivel: 1 }],
        sucesso: {
          texto: 'You speak up, hands where they can be seen. The peddler needs someone to pull the cart down to the valley; the lad needs to eat. Ten minutes later the two of them are arguing about wages. The spare oil lamp on the cart comes to you.',
          cronica: '{nome} turned a robbery into a contract of employment.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'The lad hears "deal" and understands "trap". He grabs the pack and is gone among the trees. You help the peddler pick what is left off the ground, and the afternoon gets shorter while you do.',
          cronica: '{nome} offered a robber a deal, and the robber preferred the pack.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Lower your hood, name yourself',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'The lad has heard the stories. He drops the knife as if it burned and apologises to you, without a glance at the peddler. The peddler has heard them too: he sets an oil lamp on the ground, from a distance, and makes himself scarce.',
          cronica: 'The name of {nome} was enough to disarm a robber, and to frighten the victim as well.',
          efeitos: { item: 'lamparina', sanidade: -1 },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Vanish with the peddler',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 3 },
        sucesso: {
          texto: 'You come up behind the cart without cracking a twig and haul the peddler into the brush by his collar. When the lad looks round again, he is robbing an empty trail. He gives up, baffled. The peddler gives you an oil lamp and a hug.',
          cronica: '{nome} stole a robber\'s victim from right under the robber\'s hood.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'A twig. There is always a twig. The lad spins round, sees two where there was one, and runs with as much as he can carry. The knife passes far too close on his way out.',
          cronica: '{nome} trod on a twig behind a robber.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-costume',
    ato: 2,
    titulo: 'The table in the clearing',
    texto:
      'In a clearing a stone table is laid: gourd bowls, dark bread, a jug. Three people in bark masks sit in silence, and the fourth place is empty and turned towards you. Nobody waves. Nobody eats. The eldest rests her hands on the table, palms up, waiting for something you are supposed to know.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Pour without spilling a drop',
        teste: { chave: 'destreza', dificuldade: 7 },
        sucesso: {
          texto: 'The jug is heavy and the bowls are shallow. You fill all four to the brim, the old woman\'s first, and lose not a drop. The masks bow. As you leave, someone hangs a wool cloak on your shoulder.',
          cronica: '{nome} served at the table of the wood folk without spilling a drop and left in a new cloak.',
          efeitos: { item: 'manto', lacos: 1 },
        },
        falha: {
          texto: 'The broth runs across the stone and into the eldest\'s lap. Nobody says a word, and that is the worst of it. The three of them stand, gather the bowls and leave you alone with an empty table.',
          cronica: '{nome} spilled the broth into the lap of the elder of the wood folk.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Recall the wood\'s custom',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        ajuda: ['livro'],
        sucesso: {
          texto: 'In the wood, the guest serves from eldest to youngest, drinks last and leaves something of their own on the table. You leave a coat button. The old woman takes off her own cloak and lays it on your shoulders, without a word.',
          cronica: '{nome} sat at the table of the wood folk, knew what to do and left wearing the elder\'s cloak.',
          efeitos: { item: 'manto', lacos: 1 },
        },
        falha: {
          texto: 'You say thank you out loud before the first sip. The masks all turn at once. In the wood, a word before food calls whatever is listening. They leave quickly, watching the trees, and you watch them too.',
          cronica: '{nome} spoke before the first sip at the table of the wood folk.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Share the ember\'s warmth',
        teste: { chave: 'fe', dificuldade: 6 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You set the lantern down among the bowls and open its little door. The three masks draw in to the warmth as if to an altar. Then each one touches your forehead with two fingers. You do not know the prayer, but you know a blessing when you get one.',
          cronica: '{nome} shared the ember\'s warmth with the wood folk and was blessed for it.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The open door lets the wind in. The ember pales, the masks pull back, and you shut the lantern with shaking hands, not knowing whether you have offended someone or been warned of something.',
          cronica: '{nome} opened the lantern before the wood folk and almost lost the ember.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'flauta',
        rotulo: 'Play for the table',
        requer: { item: 'flauta' },
        livre: true,
        resultado: {
          texto: 'You play the Bellford lullaby, very softly. The youngest takes off her mask to hear it better: she is a little girl. She asks for the flute with her eyes. You give it. In its place she leaves you a wool cloak and a smile with two teeth missing.',
          cronica: '{nome} traded a bone flute for a cloak and the smile of a girl of the wood.',
          efeitos: { semItem: 'flauta', item: 'manto', lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ato2-confissao',
    ato: 2,
    titulo: 'The pilgrims going in circles',
    texto:
      'Four pilgrims are resting around a waystone they swear they have already passed three times today. Their guide, a man with an easy smile called Jeronimo, blames the wood, which "moves about". A woman in a grey habit, Sister Dalva, watches him without blinking. Everyone is muddy to the knee. Jeronimo\'s boots are clean.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Lead the march yourself',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'You pick the side where the sun is dying and walk, with the oldest pilgrim\'s pack on your back, and allow no stops. Before dark the party steps onto the stone road. Sister Dalva lets you know that from here on she climbs with you.',
          cronica: '{nome} marched four pilgrims out of the wood on stamina alone, with no guide, and gained the company of Sister Dalva.',
          efeitos: { lacos: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'The old man\'s pack weighs as much as the old man. Halfway up the slope your wind gives out, and it is the party that waits for you. Jeronimo offers you water, very kindly, and takes the lead again.',
          cronica: '{nome} set out to lead the pilgrims on stamina and ran out of it.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Point out the guide\'s boots',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: {
          texto: 'A clean boot knows a dry path. You point, and the whole party looks down. Jeronimo shows the right trail without lifting his eyes. Sister Dalva picks up her staff. "I have had a guide. I will go with someone who can see."',
          cronica: '{nome} caught a guide out by his clean boots and gained the company of Sister Dalva.',
          efeitos: { lacos: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'Jeronimo notices you looking before you notice anything at all. "Lost something, friend?" The party laughs, uneasily. You go on alone, and the waystone still comes past you one more time.',
          cronica: '{nome} suspected a guide and walked in a circle all the same.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'intimidacao',
        rotulo: 'Wring out the truth',
        teste: { chave: 'intimidacao', dificuldade: 7 },
        ajudantes: [{ nome: 'Sister Dalva', nivel: 1 }],
        sucesso: {
          texto: 'You step in close, keep your voice low and count his laps on your fingers. At the third finger Jeronimo confesses: he charges by the day, so he stretches the days. For a penance he shows you the shortcut along the dry stream bed. Sister Dalva decides to go on with you.',
          cronica: '{nome} wrung a confession out of a crooked guide and won a shortcut through the wood.',
          efeitos: { lacos: 1, marco: true, brasa: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'Jeronimo cowers, weeps and calls you a brute, and the pilgrims feel sorry for the wrong man. You walk away with four pairs of eyes on your back.',
          cronica: '{nome} leaned on a crooked guide and came out as the villain of the story.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Retrace the day\'s route',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'The ashes of three campfires, all theirs, all within a hundred paces of the waystone. You show them one by one. At the third, Jeronimo confesses without anyone raising a voice and gives up the shortcut along the dry stream bed. Sister Dalva goes on with you.',
          cronica: '{nome} proved with three campfires that a guide was walking in circles on purpose.',
          efeitos: { lacos: 1, marco: true, brasa: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'The footprints of four pilgrims walking in circles all day make a pattern that is handsome and no use. You are lost in it for a good while.',
          cronica: '{nome} followed footprints in a circle until worn out.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-baixada',
    ato: 2,
    titulo: 'The hollow of still air',
    texto:
      'The trail dips into a hollow where nothing moves. A grey mist covers the ground chest-deep, and in it the small birds lie where they fell, asleep with their eyes open. On the far side, two hundred paces off, the trail climbs again. The mist smells sweet and, far down inside it, seems to be whispering.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Cross on one breath',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'One deep breath at the edge and two hundred long strides. At a hundred and fifty your chest is burning, at a hundred and eighty your sight goes dark. You come out the far side and drink the clean air like water.',
          cronica: '{nome} crossed the misty hollow on a single breath.',
        },
        falha: {
          texto: 'Your air runs out twenty paces before the mist does. You breathe in just once, sweet, and finish the crossing listening to someone very dear ask you to lie down for a while.',
          cronica: '{nome} breathed the mist of the hollow and heard someone who was not there.',
          efeitos: { sanidade: -2 },
        },
        critico: {
          texto: 'You have breath to spare. Halfway across you even scoop up a bag somebody dropped in their hurry. On the far side you open it: a pot of salve and a note of one word. "Run."',
          cronica: '{nome} crossed the mist with breath to spare and found the salve of someone in more of a hurry.',
          efeitos: { item: 'unguento' },
        },
        desastre: {
          texto: 'You trip on a bird, let your air out in fright and take a deep breath by mistake. You wake on the far side with skinned knees and no memory of getting there. The ember remembers: it is smaller.',
          cronica: '{nome} lost a piece of the afternoon inside the mist and never learned which piece.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Find a way over',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        sucesso: {
          texto: 'Heavy mist runs downhill like water. You read the ground: a root, a fallen trunk, three tall stones. You cross with your head in clean air, hopping from island to island, and not a whisper reaches you.',
          cronica: '{nome} crossed the misty hollow over the top, from stone to stone.',
        },
        falha: {
          texto: 'The fallen trunk is rotten in the middle. You go into the mist up to your neck, hold your breath too late, and come out the far side with a split shin and a head full of low voices.',
          cronica: '{nome} fell off a rotten trunk into the mist.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Breathe and don\'t listen',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'You walk in and breathe as usual. The mist offers sleep, then offers home, then offers people who have died. You thank it and turn everything down, politely, all the way to the other edge. It does not press the matter.',
          cronica: '{nome} breathed the mist of the Long Night and turned down everything it offered.',
        },
        falha: {
          texto: 'The third offer comes in the right voice. You sit down for just a moment. When you get up, the light has changed, the birds are different birds and the lantern weighs less.',
          cronica: '{nome} sat down for a moment inside the mist, and the moment was a long one.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'vento',
        rotulo: 'Call up a wind',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 4 },
        sucesso: {
          texto: 'You ask for little: a breeze the size of a door. It comes, and opens a clean corridor through the mist from edge to edge. The birds along the way wake up and fly off, late for something.',
          cronica: '{nome} parted the mist of the hollow with a wind the size of a door.',
        },
        falha: {
          texto: 'The wind comes in crooked and spreads the mist instead of parting it. Now it is everywhere, you included, and whispering louder.',
          cronica: '{nome} called up a wind that spread the mist instead of parting it.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
  {
    id: 'ato2-vulto',
    ato: 2,
    titulo: 'The shade at the edge of the light',
    texto:
      'The sun is gone and a long blue is left between the trunks. At the exact limit of the lantern light, a shade keeps pace with you: tall, faceless, made of a darker dark. When you stop, it stops. When you walk, it comes a hand\'s width closer. The air around it is cold, and it repeats, very quietly, the last thing you said.',
    abordagens: [
      {
        id: 'lutar',
        rotulo: 'Face the shade',
        combate: 'ato2VultoDaBeira',
        vitoria: {
          texto: 'There is nothing there to hit, and you hit it anyway. The shade comes apart in rags of cold that the wind carries off. The silence afterwards is enormous. You stand still for a while, waiting for your heart to come back.',
          cronica: '{nome} faced a shade of the Long Night and unmade it.',
        },
        derrota: {
          texto: 'The cold comes in through your eyes. For a while you do not know your own name, only what the shade keeps repeating. When it passes, the shade is gone, and it has taken something with it that you cannot quite remember.',
          cronica: '{nome} faced a shade of the Long Night and lost something that has no name.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
        fuga: {
          texto: 'You run until your chest burns. The shade does not run: it is simply there, always, a hand\'s width outside the light. It only goes when the trail comes out from under the trees, and the ember has paid for the running.',
          cronica: '{nome} ran from a shade that had no need to run.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Work out what it wants',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'It repeats, it follows, it copies your step. A thing that imitates wants to be somebody. You wish it good night, as you would a neighbour. The shade tries the words out, slowly, and falls behind, repeating them to the trees.',
          cronica: '{nome} wished a shade of the Long Night good night, and the shade stayed behind, practising the words.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'To understand it, you look too long. That dark has no bottom. You look away too late, and spend the rest of the stretch hearing your own voice come from outside you.',
          cronica: '{nome} looked too long at a shade of the Long Night.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Raise the lantern and pray',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You lift the ember and say the bell prayer, the one for closing the shutters. The light does not grow, but it steadies. The shade draws back to the first tree, then to the second, and the wood goes back to being only a wood.',
          cronica: '{nome} said the bell prayer before a shade of the Long Night, and the shade drew back.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'The words come out in the wrong order, and the shade hands them back in the right one. Hearing the prayer in that voice is worse than not praying. You walk fast, with the lantern held low.',
          cronica: '{nome} got the bell prayer wrong, and a shade corrected it.',
          efeitos: { sanidade: -2 },
        },
        critico: {
          texto: 'You pray, and from deep in the wood another voice answers with the second line: someone, in some cabin, closing the shutters. The shade shrinks between the two prayers and is gone. There are more people awake in this wood.',
          cronica: '{nome} prayed in the dark of the Old Wood, and an unknown voice answered with the next line.',
          efeitos: { marco: true, magia: 1 },
        },
      },
      {
        id: 'suporte',
        rotulo: 'Steady the ember\'s light',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'You lend the ember a little of yourself. The light grows a pace in every direction, round and quiet, and the shade is left outside it like a dog in the rain. After a while it gives up.',
          cronica: '{nome} widened the lantern light until a shade of the Long Night gave up.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'The light grows and then shrinks, smaller than before. The shade takes the hand\'s width it has gained. You feel its cold on the back of your neck until the trail opens out.',
          cronica: '{nome} tried to steady the ember\'s light and left it smaller.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
    ],
  },
];
