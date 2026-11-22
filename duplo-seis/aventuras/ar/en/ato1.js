/**
 * Thin Air, Act 1: The Green Ring. Normal gravity, sun-lamp light, vegetable
 * beds, hens, a goat and people. Small, neighbourly problems while the air
 * gauge drops (in the code, the `brasa` effect).
 */

export const itens = {};

export const companheiros = {
  biaDoGalinheiro: {
    nome: 'Bia',
    quem: 'ten years old, boss of the High Coop, knows every duct in the ring',
    niveis: { agilidade: 1, percepcao: 2 },
  },
  daviEnfermeiro: {
    nome: 'Davi',
    quem: 'the ring\'s nurse, tired and kind, with empty pockets and steady hands',
    niveis: { sabedoria: 1, empatia: 1 },
  },
};

export const inimigos = {
  galoBrigadeiro: {
    nome: 'Brigadier the Cockerel',
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
    id: 'ar1-mirtes',
    ato: 1,
    titulo: 'The Council Goat',
    texto:
      'The Big Garden has been dry since early morning. The irrigation pump has stopped, and the clamp it is missing is wandering off between the beds in the mouth of Mirtes, the council goat. The corridor to the Docks runs through here, flooded shin-deep by the loose pipe. Mirtes chews slowly, looking at you. The tomato plants wilt all around.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Grab the goat',
        teste: { chave: 'agilidade', dificuldade: 6 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'Mirtes feints left, and so do you. An arm round the neck, an offended bleat, and the clamp drops into your hand, slick with drool. The pump starts to throb again and the corridor drains in minutes.',
          cronica: '{nome} caught the council goat and gave the pump its clamp back.',
        },
        falha: {
          texto: 'You catch a lettuce, then a stake, then the ground. Mirtes drops the clamp on her own once she tires of the taste. You cross the garden covered in mud, with the air gauge one notch lower.',
          cronica: '{nome} chased a goat the whole length of the Big Garden and lost.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'You vault the kale bed and land astride Mirtes, who stops dead from the shock. The whole garden applauds, hoes in hand. Somebody stuffs a sack of feed into your pack: "For the next goat."',
          cronica: '{nome} rode the council goat in front of the entire Big Garden.',
          efeitos: { item: 'racao' },
        },
        desastre: {
          texto: 'Mirtes waits until you are good and close, then lowers her head. The butt catches your thigh and lays you on your back in the ditch under the loose pipe. She finishes the clamp right there, watching.',
          cronica: '{nome} was butted by the council goat and landed in the ditch.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Rig up another clamp',
        teste: { chave: 'inteligencia', dificuldade: 5 },
        ajuda: ['remendo', 'ferramenta'],
        sucesso: {
          texto: 'A length of tomato wire, three turns, and a scrap of old hose underneath. It is ugly and it holds. The pump starts to throb again, and Mirtes loses interest in the clamp the moment nobody else wants it.',
          cronica: '{nome} mended the Big Garden pump with tomato wire.',
        },
        falha: {
          texto: 'The wire holds until the pump builds pressure. Then it lets go, and the jet takes you in the chest. The proper repair eats the rest of the shift, with Mirtes chewing in the background.',
          cronica: '{nome} took an irrigation bath trying to mend the garden pump.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Call Mirtes by name',
        teste: { chave: 'presenca', dificuldade: 5 },
        ajuda: ['isca'],
        sucesso: {
          texto: '"Mirtes." You say it in the voice of someone chairing a meeting. The goat knows authority when she hears it. She comes over, spits the clamp at your feet and waits for the next item on the agenda.',
          cronica: '{nome} called the council goat by name, and she obeyed.',
        },
        falha: {
          texto: 'You call, you whistle, you make promises. Mirtes listens to all of it carefully and swallows the clamp. The gardeners bend a new one out of a strip of guttering, and you lose the morning holding the other end.',
          cronica: '{nome} made a speech to a goat, who swallowed the evidence.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'lidarAnimais',
        rotulo: 'Scratch behind the horn',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'You come in sideways, not looking at her, and scratch the spot no goat can reach. Mirtes shuts her eyes and opens her mouth. The gardeners, who have been at it since dawn, pay for the lesson with a sack of feed.',
          cronica: '{nome} got the clamp out of Mirtes\'s mouth with a scratch behind the horn.',
          efeitos: { item: 'racao' },
        },
        falha: {
          texto: 'Mirtes accepts the entire scratch, sighs, and only then walks off with the clamp. You follow, still scratching, to the end of the bed, where she finally swaps the metal for a kale stalk.',
          cronica: '{nome} scratched the council goat down a whole garden bed before she gave in.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-filtro',
    ato: 1,
    titulo: 'The Nursery Filter',
    texto:
      'At the nursery door, Dona Celeste sits on a crate with an air filter in her lap, as wide as a bedsheet. She has the needle in one hand and the thread in the other, and the two will not meet. "My eyes left with last harvest," she says. Inside, fifteen children are taking their nap, breathing through a torn filter.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Sew it yourself',
        teste: { chave: 'destreza', dificuldade: 6 },
        sucesso: {
          texto: 'The thread goes in on the third try. You close the tear in tiny stitches, and Dona Celeste checks them with her fingernail, one by one. She approves with a grunt and a little bag of calming tea.',
          cronica: '{nome} sewed up the nursery filter under Dona Celeste\'s exacting fingernail.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Your stitches come out as gappy as a child\'s teeth. Dona Celeste patiently unpicks the lot and dictates every stitch again, slowly, while the air gauge drops a notch.',
          cronica: '{nome} sewed the nursery filter twice, the second time under dictation.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Look for the hidden tear',
        teste: { chave: 'percepcao', dificuldade: 5 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'Everybody saw the big tear. You hold the filter up against the sun-lamp and find the other one, fine as a hair, right in the fold. Dona Celeste says nothing for a while. Then she gives you tea.',
          cronica: '{nome} found the tear in the nursery filter that nobody else had seen.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'You go over the cloth a hand\'s width at a time and find nothing but the obvious tear. A neighbour comes to thread the needle. The filter goes back on its grille with a faint wheeze, and the doubt goes with you.',
          cronica: '{nome} looked for a flaw in the nursery filter and left without being sure.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Hear the filter\'s story',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'The cloth came up with the founders, she tells you, and every patch carries the name of whoever stitched it. While she talks, her hands remember on their own. The thread goes in. She leaves the last stitch for you.',
          cronica: '{nome} put a stitch in the founders\' filter, next to the old names.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'The story is long and has three generations of seamstresses in it. You glance at the air gauge once, and she sees. "Go on, go. People in a hurry don\'t mend." You go, with your face burning.',
          cronica: '{nome} looked at the gauge in the middle of Dona Celeste\'s story.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'prestidigitacao',
        rotulo: 'Thread the needle blind',
        requer: { nivel: { prestidigitacao: 1 } },
        teste: { chave: 'prestidigitacao', dificuldade: 3 },
        sucesso: {
          texto: 'Fingers that can lift a chit from a stranger\'s pocket can thread a needle with eyes shut. You sew while you chat, and your stitches come out finer than hers. Dona Celeste gives you the tea, and her spare needle wrapped round a tube of healing gel.',
          cronica: '{nome} sewed the nursery filter with eyes shut and left Dona Celeste with nothing to say.',
          efeitos: { lacos: 1, item: ['cha', 'gel'] },
        },
        falha: {
          texto: 'The hand is good, but Dona Celeste knows your reputation and keeps her bad eyes fixed on your fingers. You slip twice out of sheer nerves. The filter gets finished all the same.',
          cronica: '{nome} sewed the nursery filter with Dona Celeste watching very closely.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ar1-algas',
    ato: 1,
    titulo: 'The Bottom Valve',
    texto:
      'The algae tanks make a third of the ring\'s air, and the biggest of them is going down the drain. The bottom valve has jammed open, three metres under a warm green soup. Half a dozen residents watch from the rim, each with a bucket and not one idea between them. The level drops a finger\'s width as you arrive.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Dive down to the valve',
        teste: { chave: 'fisico', dificuldade: 6 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'You go down with your eyes shut, since open makes no difference. You find the wheel by touch and turn it until your chest burns. You come up green from head to foot, and the tank stops dropping.',
          cronica: '{nome} dived into the algae tank and shut the valve on a single breath.',
        },
        falha: {
          texto: 'Your breath runs out with the valve half shut. You come up choking, swallow algae, go down again, come up again. It closes on the fourth go, with half the tank lost and your chest aching.',
          cronica: '{nome} needed four dives to shut the algae valve.',
          efeitos: { vida: -1, brasa: -1 },
        },
        critico: {
          texto: 'The valve closes easily, and there is breath left over to feel around the bottom. A head torch is snagged on the grating, lost by somebody many harvests ago. You come up with it lit, and the whole rim shouts.',
          cronica: '{nome} shut the algae valve and came up from the bottom with a lit torch.',
          efeitos: { item: 'lanterna' },
        },
        desastre: {
          texto: 'Your sleeve catches on the wheel. For a long while there is only green and the urge to open your mouth. Somebody hauls you out by the collar. The valve gets shut later, with buckets and shouting.',
          cronica: '{nome} got stuck at the bottom of the algae tank and was hauled out by the collar.',
          efeitos: { vida: -2, sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Drain it by siphon',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['ferramenta', 'manual'],
        sucesso: {
          texto: 'A watering hose, filled and kinked at the end, pulls the soup into the next tank faster than the drain can take it. With the level at waist height, anybody can walk to the valve.',
          cronica: '{nome} saved the algae with a watering hose and a siphon.',
        },
        falha: {
          texto: 'The siphon works, only backwards: the next tank starts dropping too. You rip the hose out in a fright and shut the valve last of all, late, in a hand\'s depth of algae.',
          cronica: '{nome} nearly emptied two algae tanks instead of one.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Organise the bucket line',
        teste: { chave: 'lideranca', dificuldade: 5 },
        sucesso: {
          texto: 'You put the tallest on the rim and the children at the far end, and clap out the rhythm. The soup passes hand to hand into the tank next door. By the time the bottom shows, the line is singing.',
          cronica: '{nome} lined up the Green Ring and saved the algae one bucket at a time.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Everybody wants the rim and nobody wants the far end. Two buckets collide, and an offended neighbour walks off. The line moves in fits and starts, and half the tank runs out before the bottom shows.',
          cronica: '{nome} tried to organise a bucket line and organised an argument.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'engenharia',
        rotulo: 'Shut the upper stopcock',
        requer: { nivel: { engenharia: 1 } },
        teste: { chave: 'engenharia', dificuldade: 3 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'Every founders\' tank has two stopcocks, and the second is always behind a cover somebody has painted over. You scrape off the paint and give it half a turn. The tank stops, then starts to bubble again. The air gauge climbs a notch.',
          cronica: '{nome} found the algae tank\'s second stopcock under three coats of paint.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'The stopcock is where it should be, welded shut with rust. You beat it with patience and cooking oil, and the tank stops a third lower than it was.',
          cronica: '{nome} fought a rusted stopcock on the algae tank.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Go down sparing your breath',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'Anyone who works in a pressure suit learns to make one lungful last. You let the air out a little at a time, go down unhurried, count the turns of the wheel and even check the seal before coming up.',
          cronica: '{nome} shut the algae valve with the calm of someone who knows short air.',
        },
        falha: {
          texto: 'Your breath sums were right for water. Algae soup is thicker. You shut the valve and come up seeing stars, coughing green for a good while.',
          cronica: '{nome} shut the algae valve and coughed green for the rest of the shift.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-sementes',
    ato: 1,
    titulo: 'The Founders\' Shelves',
    texto:
      'The shortcut runs through the seed room, hard against the nursery. Just as you walk in, the founders\' shelves crack and begin to lean: four tiers of jars labelled in the old tongue, each one the last seed of something. Underneath, on a mat, three children who have escaped their nap look up with their mouths open.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Shoulder the shelves',
        teste: { chave: 'forca', dificuldade: 7 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'You jam your shoulder under the second shelf and lock your knees. The jars clink and stay put. The children crawl out between your legs and come back with the teacher and a wedge.',
          cronica: '{nome} held the founders\' seed shelves up on one shoulder.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The weight wins slowly. The children get clear, the shelves sink to your knee and six jars burst open on the floor. You spend a good while picking up seeds one by one with a fingertip.',
          cronica: '{nome} broke the fall of the seed shelves and picked up what had spilled.',
          efeitos: { vida: -1, brasa: -1 },
        },
        desastre: {
          texto: 'Your foot slides on the mat. The shelves come all the way down, with you underneath serving as the wedge. The children get out without a scratch. As of today, the founders\' cowpea exists only in photographs.',
          cronica: '{nome} served as a wedge for the seed shelves, and one seed was lost for good.',
          efeitos: { vida: -3, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find the screw that gave',
        teste: { chave: 'percepcao', dificuldade: 5 },
        ajuda: ['ferramenta', 'luz'],
        sucesso: {
          texto: 'The shelves are not falling, they are pivoting: three screws are holding, and the top left one has come out. You push the handle of a garden trowel into the hole, and the whole thing stops halfway through the motion.',
          cronica: '{nome} stopped the seed shelves falling with a garden trowel.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'You look for the fault up top while it is happening down below. You drag the children out by the mat at the last instant. Two jars burst on the floor, and the smell of old coriander fills the room.',
          cronica: '{nome} got the children out from under the shelves but did not save every jar.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Keep the children still',
        teste: { chave: 'vontade', dificuldade: 5 },
        sucesso: {
          texto: 'One shout and they will run the wrong way. You crouch, smile as if there were all the time in the world and call a game of statues. They turn to statues. They tiptoe out one at a time, and only then do you yell for help.',
          cronica: '{nome} got three children out from under the shelves with a game of statues.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Your voice comes out thin. The smallest starts to cry, the others bolt, and one of them knocks a leg of the shelves. Nobody is hurt, but a jar falls, and the crying wakes the whole nursery.',
          cronica: '{nome} frightened the nursery children under the seed shelves.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Attune to the three',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 4 },
        sucesso: {
          texto: 'Three small fears, shrill as whistles. You find their pitch and bring it down, the way you would damp a string. The children yawn and walk out holding hands. The teacher arrives, sees, and decides not to ask.',
          cronica: '{nome} calmed three children under the shelves without saying a word.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Their fear comes into you instead of going out of them. For a moment the shelves look enormous and you are four years old. It passes. The children have already run for the door by themselves.',
          cronica: '{nome} felt the fear of three children from the inside.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
  {
    id: 'ar1-praca',
    ato: 1,
    titulo: 'The Little Bottles in the Square',
    texto:
      'The Barter Square has stopped bartering. In the middle of it, the man from the pickle stall and a weaver are each pulling one handle of the same crate: the ring\'s emergency air bottles. Around them, fifty people are picking sides. Somebody counts out loud and gets to eighteen bottles. The lid of the crate says twenty-four.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Pull the two apart',
        teste: { chave: 'forca', dificuldade: 7 },
        sucesso: {
          texto: 'You step in between, take a handle in each hand and lift the crate over everybody\'s heads. The two of them are left gripping nothing. The square laughs, the anger cools, and the count starts again on top of a stall.',
          cronica: '{nome} lifted the crate of bottles above the quarrel in the Barter Square.',
        },
        falha: {
          texto: 'An elbow that was not meant for you finds your nose. The crate falls, the bottles roll under the stalls, and the square spends the shift on all fours going after them.',
          cronica: '{nome} broke up a fight in the square nose first.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Redo the stock count',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        ajuda: ['troca'],
        sucesso: {
          texto: 'Nobody stole anything. You ask who had a sick child this harvest, and six hands go up slowly. The Infirmary borrowed them and never wrote it down. The quarrel loses its footing, and the square decides to share them out by household.',
          cronica: '{nome} found the six missing bottles without accusing anybody.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'You add it up out loud and get nineteen. Now the square is fighting over three numbers. It goes on a long time, until an old woman counts again with beans and everybody runs out of steam.',
          cronica: '{nome} recounted the bottles in the square and arrived at a third total.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Make the square laugh',
        teste: { chave: 'presenca', dificuldade: 6 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'You climb onto a stall and auction off the air the pair of them are wasting on shouting: who will bid higher? The weaver laughs first, against her will. Then the whole square. They share the bottles out by household, still laughing.',
          cronica: '{nome} auctioned off the breath of two brawlers and made the Barter Square laugh.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The joke lands in the silence of fifty frightened people. "Funny for the one who\'s leaving," somebody says. You get down off the stall. The quarrel picks up again with more relish, and without you.',
          cronica: '{nome} told a joke in the Barter Square and nobody laughed.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'boaFama',
        rotulo: 'Ask to speak',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Half the square has had a wardrobe carried by you at one time or another. Raising a hand is enough. They go quiet, they listen, they share out by household. The weaver even slips a few chits into your pocket, for the road.',
          cronica: '{nome} raised a hand in the Barter Square and the quarrel stopped to listen.',
          efeitos: { lacos: 1, item: 'fichas' },
        },
      },
      {
        id: 'maFama',
        rotulo: 'Let them blame you',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'Somebody points: "Wherever things go missing, that one\'s close by." You do not deny it. The two let go of the crate to watch your pockets, and the square unites on the spot. Against you, but it unites.',
          cronica: '{nome} ended the quarrel in the square by taking the blame.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-galinheiro',
    ato: 1,
    titulo: 'The High Coop Alarm',
    texto:
      'The smoke alarm in the High Coop has gone off with no smoke at all, and the corridor fire door has shut in your face. The silencing button is ten metres away, inside, behind the wire mesh. Between the mesh and the button are three hundred panicking hens and Brigadier the cockerel, who has never liked visitors and today has a point.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Face the cockerel',
        combate: 'galoBrigadeiro',
        vitoria: {
          texto: 'Brigadier retreats to the highest perch, ruffled, swearing revenge. You press the button with a pecked hand. Silence falls, the fire door opens, and three hundred hens look at you with disapproval.',
          cronica: '{nome} defeated Brigadier the cockerel and tells nobody about it.',
        },
        derrota: {
          texto: 'You leave through the mesh backwards, shielding your eyes. Brigadier crows inside, over the top of the alarm. A neighbour in thick gloves goes in and sorts it out in a minute, without comment.',
          cronica: '{nome} was thrown out of the High Coop by a cockerel.',
          efeitos: { brasa: -1 },
        },
        fuga: {
          texto: 'Two pecks are enough to make you reconsider. You get out, shut the mesh and wait for the alarm to wear itself out, which takes most of a shift. Brigadier spends the whole time watching.',
          cronica: '{nome} beat a retreat from the cockerel of the High Coop.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find the power board',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['mapa', 'scanner'],
        sucesso: {
          texto: 'An old alarm has its own breaker, and the founders put everything behind the water trough. There is the board. Inside its door, folded in eight, is a station plan nobody has looked at since before you were born.',
          cronica: '{nome} silenced the coop alarm at the power board and found a station plan.',
          efeitos: { item: 'planta' },
        },
        falha: {
          texto: 'You find a board, and with great conviction you switch off the coop\'s sun-lamp. In the dark the hens go quiet. The alarm does not. It is a good while before somebody shows you the right breaker.',
          cronica: '{nome} put out the light in the High Coop instead of the alarm.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ask Bia for the duct',
        teste: { chave: 'presenca', dificuldade: 5 },
        sucesso: {
          texto: 'Bia listens with her arms folded, sizes you up from head to foot and vanishes through a ventilation grille. The alarm stops. She reappears on the far side of the door: "From here to the Docks I know a better way than yours."',
          cronica: '{nome} talked Bia into silencing the alarm by the duct, and she decided to come along.',
          efeitos: { companheiro: 'biaDoGalinheiro', marca: 'a1-bia' },
        },
        falha: {
          texto: '"The duct\'s mine," says Bia, and she charges a toll: you sweep the outside of the coop while she thinks about it. She thinks about it for some time. Then she goes in, presses the button and gets on with the hens.',
          cronica: '{nome} swept the High Coop to pay the toll on a duct.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Cross by the perch beam',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 3 },
        sucesso: {
          texto: 'The beam is a hand wide and runs above everything. For someone who walks the hull, that is a high street. You pass over Brigadier, who cannot believe it, and press the button with the tip of your foot. From the door, Bia whistles in admiration: "Even I don\'t walk up there."',
          cronica: '{nome} crossed the High Coop along the beam and silenced the alarm with one foot.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A coop beam has something on it that a station hull does not. You slip halfway and come down sitting in a heap of straw, one step from the button and two from the cockerel. You press and run.',
          cronica: '{nome} slipped off the coop beam and landed close enough to the button.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'bia',
        rotulo: 'Leave it to Bia',
        requer: { companheiro: 'biaDoGalinheiro' },
        livre: true,
        resultado: {
          texto: 'Bia does not even wait to be asked. She vanishes through the grille, the alarm stops, and from inside comes her voice telling the cockerel off by his full name. The door opens. She comes back with an egg in her pocket.',
          cronica: 'Bia silenced the High Coop alarm before {nome} could finish the sentence.',
        },
      },
    ],
  },
  {
    id: 'ar1-fichas',
    ato: 1,
    requer: { semMarca: 'a1-bia' },
    titulo: 'The Council\'s Chits',
    texto:
      'The council\'s chit box was empty this morning, and without a chit nobody will open the service passage to the Docks. Bia, ten years old, sitting on the steps of the High Coop, swears she saw nothing. She swears it quickly, before the question. There is fresh corn in her pockets, on a shift when the feed has been cut by half.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Climb to her hideout',
        teste: { chave: 'destreza', dificuldade: 6 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'Behind the last grille, right at the top, there is a nest of blankets and a tin holding the chits that are left. You hand the tin back to the council without saying where you found it. Dona Celeste counts you out a handful for the journey.',
          cronica: '{nome} found the council\'s chits in a duct and did not say whose hideout it was.',
          efeitos: { item: 'fichas' },
        },
        falha: {
          texto: 'The duct is the size of a ten-year-old girl. You wedge fast at the second bend, and it is Bia herself who pulls you out by the feet, laughing, and hands over the tin just to end the scene.',
          cronica: '{nome} got stuck in a coop duct and was rescued by the suspect.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Spot the lie',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'Whoever swears before the question has already answered it. All you say is that a hungry hen does not lay, and that somebody had to do the sums. Bia looks at the floor, goes to fetch the tin and hands over the chits that are left.',
          cronica: '{nome} saw through Bia\'s lie and understood the reason before asking for anything back.',
        },
        falha: {
          texto: 'You believe her. You spend half a shift questioning the pickle man, who has looked guilty since the day he was born. The chits turn up in the box by themselves, later, a fair few short.',
          cronica: '{nome} accused the pickle man over the missing chits, and was wrong.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sit and let her tell',
        teste: { chave: 'empatia', dificuldade: 5 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'You sit on the step below hers and talk about hens. Somewhere along the way she tells you everything, all at once, angrily. You take the tin back together. "If the air runs out, the corn\'s no use," she concludes, and picks up her pack.',
          cronica: '{nome} heard Bia\'s confession on a coop step and gained a guide.',
          efeitos: { companheiro: 'biaDoGalinheiro', marca: 'a1-bia' },
        },
        falha: {
          texto: 'She talks about hens for a long time, in great detail, and about chits not at all. When you stand up, you know thirty layers by name. The tin only appears in the council box at the change of shift.',
          cronica: '{nome} learned the names of thirty hens and nothing about the chits.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Follow the corn trail',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'Fresh corn comes from one stall only, and its owner well remembers the small customer who paid in advance. You let Bia see that you know and that you will not tell. She gives the chits back and decides to keep an eye on you from close up.',
          cronica: '{nome} followed a trail of corn to Bia and kept her secret.',
          efeitos: { companheiro: 'biaDoGalinheiro', marca: 'a1-bia', item: 'fichas' },
        },
        falha: {
          texto: 'The trail leads to the right stall, but the owner does not give up her customers. Bia sees you prowling and returns the tin of her own accord, in the small hours, with a rude note.',
          cronica: '{nome} prowled round the corn stall until the chits came back by themselves.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Follow Bia unseen',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 3 },
        sucesso: {
          texto: 'She checks the tin every hour, like every first-time thief. You wait for her to leave, take the chits and put your handkerchief in their place. The council pays for the find with a handful of them.',
          cronica: '{nome} recovered the council\'s chits and left a handkerchief in their place.',
          efeitos: { item: 'fichas' },
        },
        falha: {
          texto: 'Nobody follows Bia through her own ducts. You go the whole way round the coop and find her sitting on the same step, waiting, with the tin in her lap and the face of someone who has won.',
          cronica: '{nome} tried to follow Bia through the ducts and was followed by her.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-capela',
    ato: 1,
    titulo: 'The Vigil at the Window',
    texto:
      'The shortcut to the Docks runs straight through the Window Chapel, and it is the hour of vigil. Twenty people sit on the floor with their backs to the door, facing the glass, where there is only the dark and a few stars that do not move. Sister Lucia is reading out the names of the founders, one by one. About a hundred and sixty to go.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Run the long way round',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'It is six hundred metres of service corridor with the cartridge thumping on your back. You reach the far side out of breath and on time, and you can still hear the sister at name forty-three.',
          cronica: '{nome} ran round the Window Chapel with the cartridge on one shoulder.',
        },
        falha: {
          texto: 'Halfway round your wind gives out, and the service corridor has no benches. You finish at a walk, with a stitch in your side, and arrive after the vigil does.',
          cronica: '{nome} went round the chapel and arrived after the ones who stayed to pray.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Cross as the rite asks',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'Shoes in hand, head down, and never between the sister and the glass. You pass along the back wall and touch the door frame on the way out, as one should. Nobody turns. An old man signs you a safe journey.',
          cronica: '{nome} crossed the vigil in the Window Chapel without breaking the rite.',
        },
        falha: {
          texto: 'You cross in front of the glass. Twenty heads come up, the sister loses count and starts again from the first name. Nobody complains, which is worse. You slip out quietly, and that takes time as well.',
          cronica: '{nome} made Sister Lucia start the list of founders again from the first name.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Stay for the vigil',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You sit down facing the dark, and the dark does nothing. Somewhere around the hundredth name, your chest loosens. On your way out, Sister Lucia hangs a founders\' medal round your neck. "They went on foot too."',
          cronica: '{nome} stayed for the vigil, looked the dark in the face and left with a medal.',
          efeitos: { item: 'medalha', marco: true },
        },
        falha: {
          texto: 'The dark in the glass is too big to keep looking at. The names turn into a hum, and the air gauge weighs on your wrist. You leave in the middle, with the feeling that the Window looked back.',
          cronica: '{nome} could not bear the vigil and left before the last name.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'aliado',
        rotulo: 'Signal to Sister Lucia',
        requer: { antecedente: 'aliado' },
        livre: true,
        resultado: {
          texto: 'Sister Lucia has known you since the cradle. Without stopping her reading, she points her chin at the sacristy door, which opens straight onto the corridor. On the bench in there is a little bag of tea with your name on it.',
          cronica: 'Sister Lucia opened the sacristy for {nome} without interrupting the list of founders.',
          efeitos: { item: 'cha' },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Read in the old tongue',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 3 },
        sucesso: {
          texto: 'The sister reads the names by ear, and half of them have gone crooked. You take the other end of the list and read them as they are written. With two voices the vigil ends early, and the whole chapel repeats a surname it has not heard in generations.',
          cronica: '{nome} read the founders\' names in the old tongue, the way they were once said.',
          efeitos: { item: 'medalha' },
        },
        falha: {
          texto: 'You correct the pronunciation of a name which, you find out later, belonged to Sister Lucia\'s great-grandmother. She thanks you very politely. The vigil carries on at her pace.',
          cronica: '{nome} corrected the pronunciation of the wrong name in the Window Chapel.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-enfermaria',
    ato: 1,
    titulo: 'The Infirmary Bellows',
    texto:
      'The bad air reached the Infirmary first. Five old people on five cots, lips gone purple, share one founders\' concentrator that these days only runs by hand, off a bellows. Davi, the nurse, has been pumping since last shift and sleeps on his feet between one pull and the next. The medicine cabinet behind him stands open and empty.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Take over the bellows',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'You pump until your arms turn into something else. Davi sleeps a full hour sitting on the floor. When he wakes, the five have their colour back, and at the bottom of his coat pocket he finds a healing gel he could have sworn was gone.',
          cronica: '{nome} worked the Infirmary bellows for an hour so the nurse could sleep.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'The bellows has a rhythm, and you lose it. Within twenty minutes your arms are shaking and your head is spinning from the same bad air. Davi wakes and takes over again, apologising on your behalf.',
          cronica: '{nome} tried to relieve Davi at the bellows and had to be relieved.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Motorise the bellows',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['ferramenta', 'remendo'],
        sucesso: {
          texto: 'The ceiling fan is turning for no good reason. One apron strap, one pulley off a drip stand, and now the fan pulls the bellows and never tires. Davi looks at his own idle hands and pays with a healing gel.',
          cronica: '{nome} set the Infirmary fan to work the bellows in Davi\'s place.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'The strap lasts ten pulls and snaps, taking a fan blade with it. Now the Infirmary has a hand bellows and no breeze. You help mend what you made worse.',
          cronica: '{nome} broke the Infirmary fan trying to retire the bellows.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Calm their breathing',
        teste: { chave: 'vontade', dificuldade: 5 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'Frightened people breathe for two. You sit down between the cots and breathe slowly, out loud, until all five are keeping time. The bellows now gives enough and to spare. Davi hands the crank to the midwife: "I\'m going where the air gets fixed."',
          cronica: '{nome} taught the Infirmary to breathe slowly, and Davi decided to come along.',
          efeitos: { lacos: 1, companheiro: 'daviEnfermeiro' },
        },
        falha: {
          texto: 'You breathe slowly. One of the old men asks, perfectly calmly, whether the air is coming back. You take too long to answer, and all five notice. The bellows creaks faster as you leave.',
          cronica: '{nome} did not know what to say to an old man in the Infirmary.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Do the triage',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        ajuda: ['remedio'],
        sucesso: {
          texto: 'Two of the five do not need the concentrator. They need to sit up straight and to have a duct hatch opened. That leaves air for the other three. Davi gives you the last gel and reaches for his coat: "I\'ll learn more with you than I will here."',
          cronica: '{nome} reorganised the Infirmary in ten minutes and took the nurse along.',
          efeitos: { lacos: 1, companheiro: 'daviEnfermeiro', item: 'gel' },
        },
        falha: {
          texto: 'The diagnosis is right, but nobody here wants to let go of the mouthpiece to prove your theory. You win them over one by one, each in their own time. It works, and it takes a while.',
          cronica: '{nome} spent a shift persuading five stubborn old people in the Infirmary.',
          efeitos: { lacos: 1, brasa: -1 },
        },
      },
      {
        id: 'recursos',
        rotulo: 'Fetch what you put by',
        requer: { antecedente: 'recursos' },
        livre: true,
        resultado: {
          texto: 'You have a bottle of oxygen put by for a bad day, on the other side of the ring. This is the bad day. There and back costs a notch on the air gauge, and Davi, without a word, pays with the last healing gel.',
          cronica: '{nome} crossed the ring to bring the Infirmary a bottle of oxygen that had been put by.',
          efeitos: { lacos: 1, brasa: -1, item: 'gel' },
        },
      },
    ],
  },
];
