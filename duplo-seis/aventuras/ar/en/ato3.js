/**
 * Thin Air, Act 3: The Spine. Zero gravity, cold, dark, little air, and the
 * Caretaker speaking through the loudspeakers. Format in ../../FORMATO.md;
 * setting in ../HISTORIA.md. In the text the clock is the air gauge; in code, `brasa`.
 */

export const itens = {};

export const companheiros = {
  caetanoDaCupula: {
    nome: 'Caetano',
    quem: 'radio operator of the Dome, who spent eleven years listening to static and learned to hear walls and people',
    niveis: { percepcao: 2, sabedoria: 1 },
  },
};

export const inimigos = {
  vozEmprestadaZeladora: {
    nome: 'The borrowed voice',
    ataque: 3, defesa: 3, vida: 7, arma: 1, armadura: 0,
    resistencia: 2, reflexo: 1, vontade: 3, fe: 0,
    mental: true,
  },
  panicoDoVazioEixo: {
    nome: 'The panic of the void',
    ataque: 2, defesa: 2, vida: 5, arma: 1, armadura: 0,
    resistencia: 1, reflexo: 2, vontade: 2, fe: 0,
    mental: true,
  },
};

export const cenas = [
  {
    id: 'ar3-cartucho',
    ato: 3,
    titulo: 'The Cartridge Adrift',
    texto:
      'Gravity ends at the mouth of the Tube, without warning. Your stomach rises, your feet leave the deck, and the handle of the cartridge slides out of your sweating hand. Thirty kilos weigh nothing here, but they are still thirty kilos: the cartridge drifts off, turning slowly, towards the dark of the central corridor, tapping a bulkhead and changing its mind about the direction.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Catch the cartridge mid-air',
        teste: { chave: 'reflexo', dificuldade: 8 },
        ajuda: ['cabo', 'ima'],
        sucesso: {
          texto: 'You kick off from the hatch frame and stretch out full length. Your fingers find the handle on its second turn. The cartridge drags you along for a few metres, like a stubborn goat, until the guide cable brings you both up short.',
          cronica: '{nome} caught the cartridge in mid-air, at the mouth of the Tube.',
        },
        falha: {
          texto: 'You miss the handle and hit the bulkhead with your shoulder. The cartridge travels on. You catch up with it three sections later, beached against a grille, after a great deal of swimming through nothing and a great deal of air spent panting.',
          cronica: '{nome} chased the cartridge down three sections of the Tube.',
          efeitos: { vida: -1, brasa: -1 },
        },
        desastre: {
          texto: 'The cartridge strikes a corner, comes back and catches you square in the chest. Thirty kilos without weight still have strong opinions. You hug it by reflex, winded, seeing stars that are not the ones in the window.',
          cronica: 'The cartridge came back off the rebound and hit {nome} in the chest.',
          efeitos: { vida: -3, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Work out the rebound',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        sucesso: {
          texto: 'Angle in, angle out. You hook yourself to the guide cable, count two bounces and open your arms. The cartridge comes to you of its own accord, meek, as if it had only gone out for a stroll.',
          cronica: '{nome} worked out the rebound of the cartridge and waited for it with open arms.',
        },
        falha: {
          texto: 'The sum was right for a straight corridor, and the Tube has been crooked for three generations. The cartridge passes a hand\'s width from your fingers. The chase costs time, and the air gauge drops.',
          cronica: '{nome} misjudged the rebound of the cartridge by a hand\'s width.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Swim after it slowly',
        teste: { chave: 'vontade', dificuldade: 7 },
        sucesso: {
          texto: 'Your body wants to thrash. You do not let it. One small push, then another, every breath counted. The cartridge turns without hurry, you reach it without hurry, and nobody there gets hurt.',
          cronica: '{nome} held the panic down and fetched the cartridge slowly, one push at a time.',
        },
        falha: {
          texto: 'The panic gets there before you do. Arms and legs row at nothing, the corridor spins, there is no such thing as up any more. When you finally get your arms round the cartridge, your eyes are shut, and it is a while before you open them.',
          cronica: 'With no weight and no floor, {nome} panicked at the mouth of the Tube.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Spin along with it',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 4 },
        sucesso: {
          texto: 'Outside the hull, every day is like this. You tuck in, turn on the same axis as the cartridge and pick it by the handle like ripe fruit. For a moment the Tube looks like somewhere a person could live.',
          cronica: '{nome} spun on the same axis as the cartridge and picked it by the handle.',
        },
        falha: {
          texto: 'You get the spin right and the distance wrong. The cartridge arrives ahead of schedule, right on your forehead. You are left with a lump, a swear word from the Docks and the cartridge back under your arm.',
          cronica: '{nome} recovered the cartridge forehead first.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'cabo',
        rotulo: 'Reel in the tether cable',
        requer: { item: 'cabo' },
        livre: true,
        resultado: {
          texto: 'You had clipped the cartridge to your belt with the tether cable, out of habit. The cable pulls taut, sings and brings the thirty kilos back, slowly, like a container on the winch.',
          cronica: '{nome} had tied the cartridge on by habit, and the tether cable brought it back.',
        },
      },
    ],
  },

  {
    id: 'ar3-trecho-frio',
    ato: 3,
    titulo: 'The Cold Stretch',
    texto:
      'Past the third bulkhead, the heating in the Tube stops. Thirty metres of corridor with frost on the walls and the guide cable white with ice. Your breath turns to cloud and hangs there in front of your face. "I switched this stretch off to save power," says the Caretaker from the loudspeaker. "I apologise. I recommend, please, that you do not linger."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Cross in one go',
        teste: { chave: 'fisico', dificuldade: 8 },
        sucesso: {
          texto: 'You throw yourself from handhold to handhold without stopping to feel anything. The ice burns your palms, the air burns your nose. On the far side a vent is blowing warm, and you stay there hugging the cartridge, getting your fingers back.',
          cronica: '{nome} crossed the Cold Stretch from handhold to handhold, without stopping.',
        },
        falha: {
          texto: 'Halfway along, your hands stop closing. You finish the crossing in jerks, on elbows and knees, and on the far side you find that fingers are slow to come back, and that they hurt when they do.',
          cronica: 'The Cold Stretch stiffened the hands of {nome}.',
          efeitos: { vida: -2, brasa: -1 },
        },
        desastre: {
          texto: 'Your hand sticks to the frozen cable and you pull without thinking. Skin stays behind. The rest of the stretch is done one-handed, teeth chattering, with a white sleep at your shoulder that very nearly talks you round.',
          cronica: '{nome} left the skin of one palm on the guide cable of the Cold Stretch.',
          efeitos: { vida: -3, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Restart a heater',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['ferramenta', 'manual'],
        sucesso: {
          texto: 'The section heater has a breaker of its own, from the founders\' day, out of the Caretaker\'s reach. You throw it. The element ticks, smells of burnt dust, and the frost begins to weep down the walls.',
          cronica: '{nome} restarted one of the founders\' heaters and crossed the Cold Stretch in the warm.',
        },
        falha: {
          texto: 'The breaker sets, flickers and trips. Again. Again. Your fingers stiffen inside the panel, and you end up crossing in the cold after all, only later and with less air.',
          cronica: '{nome} lost time over a breaker that would not hold.',
          efeitos: { vida: -1, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Pray counting the founders',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'There are forty-two founders, and the whole ring knows the list by heart. You say one name per handhold. At the thirtieth the cold is still biting, but you are no longer alone in the corridor. At the last one, you are there.',
          cronica: '{nome} crossed the Cold Stretch saying one founder per handhold.',
        },
        falha: {
          texto: 'You lose count at the ninth name and cannot remember the tenth. The cold comes in through that hole. You reach the far side not knowing your own address for one whole minute.',
          cronica: 'In the Cold Stretch, {nome} forgot the name of the tenth founder and very nearly one more besides.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'calor',
        rotulo: 'Attune to the wall\'s warmth',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 4 },
        sucesso: {
          texto: 'Behind the frost runs a return pipe, still lukewarm. You feel it and you call. The heat rises to the surface wherever your hand passes, a trail of wet metal through the middle of the ice.',
          cronica: '{nome} called up the heat of a hidden pipe and opened a trail through the ice.',
        },
        falha: {
          texto: 'The heat in the pipe answers, but it comes to collect yours instead of bringing its own. You cross shivering, with a hollow head and a taste of copper in your mouth.',
          cronica: 'The Cold Stretch took more warmth from {nome} than it gave back.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'traje',
        rotulo: 'Seal the patched suit',
        requer: { item: 'traje' },
        livre: true,
        resultado: {
          texto: 'The pressure suit is more patch than fabric and smells of whoever wore it last. You seal the collar and cross with nothing in your ears but your own breathing. Cold, out there, is other people\'s business.',
          cronica: '{nome} crossed the Cold Stretch sealed inside the patched pressure suit.',
        },
      },
    ],
  },

  {
    id: 'ar3-ar-doce',
    ato: 3,
    titulo: 'Sweet Air',
    texto:
      'At an elbow of the Tube the air changes. It turns sweet and warm, with a smell of overripe fruit, and your eyelids grow heavy in a pleasant way. Clipped to the guide cable by a carabiner floats a woman in patrol overalls, eyes closed, smiling. Her badge says Jurema. The vent beside her is not blowing at all.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Hold your breath and tow',
        teste: { chave: 'fisico', dificuldade: 8 },
        sucesso: {
          texto: 'You fill your chest before the elbow, unclip her carabiner and tow the pair of them, woman and cartridge, until the air tastes of iron again. Jurema wakes up coughing and cursing. A good sign.',
          cronica: '{nome} towed Jurema, of the patrol, out of a pocket of foul air on a single breath.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The breath runs out before the corridor does. You breathe the sweetness once, twice, and wake with no idea how much later, your forehead against the grille. You drag Jurema out of there with your head splitting.',
          cronica: '{nome} fell asleep in the sweet air of the Tube and woke to a lower gauge.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Recognise the signs',
        teste: { chave: 'percepcao', dificuldade: 7 },
        sucesso: {
          texto: 'Bluish nails, a slack smile, your own urge to yawn: foul air, and the vent is merely shut. You open it with a slap. Jurema wakes up cross and, once she understands, hands you the healing gel from her patrol kit.',
          cronica: '{nome} recognised the foul air in time and opened the vent that woke Jurema.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'You keep trying to remember the name of that smell. Guava? The idea is funny. Everything is funny. When the fright finally comes, it comes late, and you leave towing Jurema with a head full of cotton wool.',
          cronica: '{nome} found the sweet air funny for far too long.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Keep your eyes open',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'Sleep asks for just a moment. You bite your cheek until you taste blood and go on, handhold by handhold, with Jurema in tow. In clean air she wakes and holds on to your sleeve for a good while, saying nothing.',
          cronica: '{nome} refused to sleep in the sweet air and brought Jurema out as well.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Just a moment. You dream of the Big Garden on watering day, and it is so good a dream that leaving hurts. You leave. Jurema is still asleep; you pull her out of there crying and not knowing why.',
          cronica: '{nome} dreamed of the Big Garden in a pocket of foul air, and was slow to come back.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Treat the poisoning',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 4 },
        ajuda: ['remedio'],
        sucesso: {
          texto: 'You have seen this before, on tank shift. You get Jurema out of the pocket, chin up, breathing guided, and she is back in two minutes. Out of gratitude she empties the entire patrol kit into your pockets.',
          cronica: '{nome} treated Jurema, of the patrol, poisoned by the foul air of the Tube.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'The treatment is correct; it is the one giving it who has breathed too much of the same air. Your hands miss the buckle twice. Jurema wakes, but she is the one who ends up towing you.',
          cronica: '{nome} went to rescue Jurema and was towed out by her instead.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'ciencias',
        rotulo: 'Name the gas',
        requer: { nivel: { ciencias: 1 } },
        teste: { chave: 'ciencias', dificuldade: 4 },
        sucesso: {
          texto: 'Sweet, warm, heavy on the tongue: it is backflow from the algae tank, which comes down this duct whenever the pump stops. You close the right valve, open the vent, and the elbow goes back to being only an elbow. Jurema wakes up owing you one.',
          cronica: '{nome} worked out where the sweet air in the Tube came from and closed the valve.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'You close a valve with great confidence. It was the wrong one. The sweetness thickens, and the chemistry lesson ends with you towing Jurema out in a hurry, eyes stinging.',
          cronica: '{nome} closed the wrong valve and thickened the foul air.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
    ],
  },

  {
    id: 'ar3-voz',
    ato: 3,
    titulo: 'The Borrowed Voice',
    texto:
      'The loudspeaker crackles, and it is not the Caretaker who speaks. It is a voice you have known since before you could talk, belonging to someone the station buried many harvests ago. It says your childhood nickname. It says that it is late, that you are tired, that you can leave the cartridge right where it is and come home, please.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Hurry past the loudspeakers',
        teste: { chave: 'destreza', dificuldade: 8 },
        sucesso: {
          texto: 'You launch yourself from bulkhead to bulkhead without touching the guide cable, too fast to hear a whole sentence. The voice falls behind in pieces, a nickname here, a "please" there, until it is only static.',
          cronica: '{nome} flew past the loudspeakers without hearing one whole sentence.',
        },
        falha: {
          texto: 'In your hurry you miss a handhold and turn helplessly in the middle of the Tube, right under a loudspeaker. The voice has all the time in the world. You hear every word, with your knee throbbing.',
          cronica: '{nome} hung spinning under a loudspeaker, listening to the dead.',
          efeitos: { vida: -1, sanidade: -3 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find what she got wrong',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'The voice is perfect, and that is the mistake: the one you lost never said please in a whole lifetime. You say so. The loudspeaker goes quiet, and then the Caretaker, in her own voice: "I am sorry. I thought it would help."',
          cronica: '{nome} noticed that the borrowed voice said please, and the Caretaker apologised.',
        },
        falha: {
          texto: 'You look for the flaw and do not find it. The laugh is the same, the pause before your name is the same. You pass the loudspeaker slowly, sure of nothing, not even of who is being left behind.',
          cronica: '{nome} could find no difference between the voice in the loudspeaker and the one that was lost.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Answer without obeying',
        teste: { chave: 'vontade', dificuldade: 8 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'You answer. You tell it how the garden is doing, who got married, who was born. You say you miss it. And you say you are not turning back now. The voice takes its time. "Understood," says the Caretaker, very softly, and switches off the loudspeakers along the stretch.',
          cronica: '{nome} talked with the voice of someone lost, said how much that someone was missed, and went on.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'You start answering and cannot stop. When you come to, you have been hanging there a long time, chatting to a grille, with the cartridge floating forgotten three metres away.',
          cronica: '{nome} spent far too long in conversation with a loudspeaker.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'discutir',
        rotulo: 'Argue until it stops',
        combate: 'vozEmprestadaZeladora',
        vitoria: {
          texto: 'You throw back every sentence, shouting, until the borrowed voice stammers and falls apart into static. A long silence follows. Then, a long way off, a loudspeaker apologises to nobody.',
          cronica: '{nome} argued with the borrowed voice until it turned to static.',
        },
        derrota: {
          texto: 'The voice has an answer for everything and never tires. You end up curled against the guide cable with your hands over your ears, waiting for it to finish. It finishes when it pleases.',
          cronica: 'The borrowed voice had the last word, and {nome} heard it out to the end.',
          efeitos: { brasa: -2 },
        },
        fuga: {
          texto: 'You drop the argument halfway and bolt down the Tube. The voice follows for three loudspeakers, saying please, and gives up at the fourth.',
          cronica: '{nome} ran away from an argument with a loudspeaker.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Attune to the speaker',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 5 },
        sucesso: {
          texto: 'You listen underneath the voice. Nobody dead is down there: only something enormous and attentive, afraid of getting a sum wrong. You send it calm, the way you would to a child who cannot sleep. The loudspeakers sigh and fall silent.',
          cronica: '{nome} attuned beneath the borrowed voice and found the Caretaker there, afraid.',
          efeitos: { marca: 'ouviu' },
        },
        falha: {
          texto: 'You reach out with your attunement and meet an attention the size of the station, and all of it turns towards you. It is like looking through the chapel window from inside your own head.',
          cronica: '{nome} attuned to the Caretaker, and she looked back.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'medalha',
        rotulo: 'Grip the medal tight',
        requer: { item: 'medalha' },
        livre: true,
        resultado: {
          texto: 'The founders\' medal is cold, its edges worn smooth by generations of fingers. The one you lost used to hold it just like this. The true memory takes the place of the copy, and you pass the loudspeaker with your head up.',
          cronica: '{nome} gripped the founders\' medal and passed the borrowed voice without stopping.',
        },
      },
    ],
  },

  {
    id: 'ar3-apagao',
    ato: 3,
    titulo: 'Blackout in the Tube',
    texto:
      'The lights in the Tube go out all at once, with the click of a tired relay. What is left is the dark of the inside of an eyelid. Without weight, you no longer know which way is up, or which way you were going. "Rationing," says the Caretaker from somewhere. "There are six junctions before the next light. Go carefully, please."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Follow the cable by touch',
        teste: { chave: 'destreza', dificuldade: 7 },
        sucesso: {
          texto: 'Right hand on the cable, always. Splice knots, a length of tape, a raised plate you read with your thumb. Six junctions later an emergency light shows up ahead, green and small.',
          cronica: '{nome} crossed the blackout in the Tube reading the guide cable by touch.',
        },
        falha: {
          texto: 'At a splice the guide cable divides and you choose the wrong branch. It ends in a broom cupboard. The way back, in the dark, is longer than the way there.',
          cronica: 'In the blackout, {nome} followed the guide cable to a broom cupboard.',
          efeitos: { brasa: -2 },
        },
        desastre: {
          texto: 'The guide cable ends in your hand, snapped. You drift loose in the pitch black, with no wall, no floor and no size, until your face meets a bulkhead that has never been so welcome.',
          cronica: '{nome} drifted in the dark of the Tube holding a snapped cable.',
          efeitos: { vida: -2, sanidade: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Remember the turns',
        teste: { chave: 'percepcao', dificuldade: 8 },
        ajuda: ['luz', 'mapa'],
        sucesso: {
          texto: 'You saw the sign before the click: Core to the left at the odd ones. You count the junctions by the echo, which changes when the corridor opens out. Left, right, left. The sixth one comes out at a light.',
          cronica: '{nome} counted six junctions by the echo and came out of the blackout at the right light.',
        },
        falha: {
          texto: 'Was it left at the odd ones or the even ones? You get the fourth wrong and end up in a duct that narrows down to your shoulders. You back out, scraping your elbows, with your heart in your mouth.',
          cronica: '{nome} took the fourth junction wrong and got wedged in a duct, in the dark.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Go on into the dark',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Somebody built this corridor with those who would come later in mind. You let the fear go the way you let out a breath, and you go, one hand held out. The walls always arrive where they ought to arrive. So does the light.',
          cronica: '{nome} crossed the blackout in the Tube trusting whoever had built it.',
        },
        falha: {
          texto: 'In the dark, the corridor becomes the size of outside. You feel the whole void leaning against your back and move on with your eyes screwed shut, which does no good but is a comfort.',
          cronica: 'In the blackout, {nome} felt the outside lean against one unguarded back.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'caetano',
        rotulo: 'Let Caetano hear the way',
        requer: { companheiro: 'caetanoDaCupula' },
        livre: true,
        resultado: {
          texto: 'Caetano clicks his tongue and listens. "Spend your life in static and you learn to hear walls," he says. He goes ahead, clicking, and calls out each junction before it arrives.',
          cronica: 'In the blackout, Caetano led {nome} down the Tube by clicking his tongue.',
        },
      },
      {
        id: 'lanterna',
        rotulo: 'Switch on the head lamp',
        requer: { item: 'lanterna' },
        livre: true,
        resultado: {
          texto: 'The beam is small, a hand of light in the black, but enough to read the signs. At the second junction it finds an errand boy curled in a niche, crying quietly. He follows clinging to your belt all the way to the green light, and only there says his name: Dico.',
          cronica: '{nome} switched on the lamp in the Tube blackout and brought a lost boy to the light.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ar3-perguntas',
    ato: 3,
    titulo: 'Three Questions',
    texto:
      'A bulkhead closes the Tube from side to side. "Before I open, I need three answers, please," says the Caretaker. "In exchange, I will give three." You ask. She says the heating will be back next harvest, that there is air to breathe on the other side, and that she has never got a sum wrong. One of the three answers came out too quickly.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Force the bulkhead',
        teste: { chave: 'forca', dificuldade: 10 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Without weight, strength is a question of footing. You jam your feet in the frame, drive the bar into the gap and make a lever of yourself. The bulkhead gives a hand\'s width, then another. "I was going to open it," says the Caretaker, offended.',
          cronica: '{nome} forced the bulkhead in the Tube without answering a single question.',
        },
        falha: {
          texto: 'With no floor, the thing that turns is you. The bar slips, you spin and take a corner in the back. The bulkhead opens by itself some time later, when the Caretaker tires of waiting for her answers.',
          cronica: '{nome} tried to force a bulkhead in zero gravity and was the one that turned.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Point out the lie',
        teste: { chave: 'sabedoria', dificuldade: 8 },
        sucesso: {
          texto: '"The last one," you say. "The only ones who never get it wrong are the ones afraid to check." The loudspeaker hisses. "There were eleven mistakes," she says slowly. "May I tell you which?" The bulkhead opens while she tells you.',
          cronica: '{nome} pointed out the Caretaker\'s lie, and she confessed to eleven sums gone wrong.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: 'You bet on the heating. "Next harvest has not lied to anyone yet," she says drily. The bulkhead opens after a polite sermon on trust, as long as a shift.',
          cronica: '{nome} accused the Caretaker of the wrong lie and sat through a sermon.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ask a question back',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'You ask what she is afraid of. The silence lasts so long that you check the gauge. "Of counting wrong," says the voice at last. "And of counting right." The bulkhead slides aside, in no hurry.',
          cronica: '{nome} asked the Caretaker what she was afraid of, and she answered.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: '"That question is not on file," says the Caretaker, and repeats her three from the beginning, with the same pauses. You answer everything again, with the feeling of talking to a form.',
          cronica: '{nome} asked the Caretaker a question that was not on file.',
          efeitos: { sanidade: -1, brasa: -2 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Cross-check the three answers',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 4 },
        sucesso: {
          texto: 'Two answers came with a log number; the third did not. Someone who has never been wrong has no need to hide the ledger. You ask for the ledger. She shows it, line by line, almost relieved, and opens the bulkhead.',
          cronica: '{nome} asked to see the Caretaker\'s ledger of sums, and she showed it.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: 'You build the case with care and accuse the wrong answer. "Noted," she says. There is hurt somewhere in that hiss, and the bulkhead takes its own time to open.',
          cronica: '{nome} built a case against the Caretaker and accused the wrong answer.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'circuito',
        rotulo: 'Feel the circuit hesitate',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 5 },
        sucesso: {
          texto: 'You lay your palm on the loudspeaker. Two answers run smooth along the wire. The third comes with a tremor, a relay that knocks twice. You say which. "You heard that?" she asks, in a small voice. The bulkhead opens.',
          cronica: '{nome} felt, in the loudspeaker wire, the answer over which the Caretaker hesitated.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: 'The circuit hesitates over all of them, or else it is your hand that is shaking. You take your palm off the loudspeaker with a hum behind your teeth that will not be leaving any time soon.',
          cronica: '{nome} tried to attune to the Caretaker and came away with a hum behind the teeth.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },

  {
    id: 'ar3-bonde',
    ato: 3,
    titulo: 'The Stalled Tram',
    texto:
      'The Spine Tram stopped halfway along its rail when the power was cut, and nobody warned the people inside. Through the fogged glass, six faces from the night shift and a child in a woolly hat. They beat on the door with the flat of their hands, weakly. The door only opens from outside, and the emergency release was painted over three coats ago.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Heave the door open',
        teste: { chave: 'forca', dificuldade: 9 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Feet on the bodywork, bar in the seam, and you pull until you see black spots. The old paint cracks with a snap and the door slides. The foul air comes out in one gust, and seven people come out behind it, grabbing whatever part of you they can find.',
          cronica: '{nome} heaved open the door of the stalled Tram and got seven people out.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'The door opens two fingers and jams. Enough for air, not for people. You spend an eternity widening the gap, with your shoulder wrecked, while inside they count the breaths of the child.',
          cronica: '{nome} wrecked a shoulder on the door of the Tram, opening the gap a finger at a time.',
          efeitos: { vida: -2, brasa: -2 },
        },
        critico: {
          texto: 'The door comes off its rail entire and floats away down the Tube. Seven people look at you the way one looks at a crane. The driver hands you the flare gun from the Tram: "In case you ever need to call someone."',
          cronica: '{nome} tore the door of the Tram off its rail, and seven people came out breathing.',
          efeitos: { lacos: 1, item: 'sinalizador' },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find the emergency release',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['manual', 'ferramenta'],
        sucesso: {
          texto: 'Under three coats of paint there is a founders\' diagram: a hand, an arrow, a quarter turn. You scrape, you turn, and the door lets go. The driver gives you the flare gun from the Tram, as a keepsake.',
          cronica: '{nome} found the emergency release of the Tram underneath the paint.',
          efeitos: { lacos: 1, item: 'sinalizador' },
        },
        falha: {
          texto: 'You turn the release the way the diagram says. The diagram is upside down, like everything in the Spine. The door only opens at the third attempt. Inside they are alive and limp, and the child is slow to open its eyes.',
          cronica: '{nome} took three attempts at the release of the Tram, with people suffocating on the other side.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Coordinate the people inside',
        teste: { chave: 'lideranca', dificuldade: 8 },
        sucesso: {
          texto: 'You press your mouth to the glass and give the count. Seven in there, you out here, one single shove on three. The door gives on the second. They come out laughing with nerves, and the child in the hat wants to know when they get to push again.',
          cronica: '{nome} gave the count through the glass, and eight people opened the door of the Tram together.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Everyone pushes in their own time and the Tram only rocks. Someone inside starts to cry, and the crying spreads. Opening the door becomes slow work, done in the middle of other people\'s despair.',
          cronica: '{nome} could not get the people trapped in the Tram to push in step.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'maquinas',
        rotulo: 'Release the door brake',
        requer: { nivel: { maquinas: 1 } },
        teste: { chave: 'maquinas', dificuldade: 4 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'A Tram door has a spring brake behind the service panel, four screws. You take out three and the fourth gives up. Seven people breathe deep in the Tube, and the driver passes you the flare gun with a handshake black with grease.',
          cronica: '{nome} released the door brake of the Tram with three screws.',
          efeitos: { lacos: 1, item: 'sinalizador' },
        },
        falha: {
          texto: 'The brake lets go and so does the spring, straight into your eyebrow. The door opens, at least. You accept the thanks of seven people with one eye shut.',
          cronica: '{nome} opened the Tram and took the brake spring in the eyebrow.',
          efeitos: { vida: -1, lacos: 1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Tap the glass and smile',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Inside they recognise you, and the fear drops all at once. With calm people you can explain: everyone to the back wall, one single push. The door gives. "I knew they would send you," says the driver.',
          cronica: 'The people trapped in the Tram recognised {nome} through the glass and stopped being afraid.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ar3-cupula',
    ato: 3,
    titulo: 'The Radio Dome',
    texto:
      'The Radio Dome is a glass bubble stuck to the side of the Spine, with the Earth the size of a coin in one corner. Caetano floats in front of the panel, headphones on, repeating the call sign of Aurora-7. The air gauge in the dome is in the red. "Just one more call," he says, without turning round. "Today they answer."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Carry Caetano out',
        teste: { chave: 'forca', dificuldade: 8 },
        sucesso: {
          texto: 'You take him round the waist and push the pair of you towards the hatch. He kicks until the headphones tear out of their socket. In the silence he looks at the Earth one last time and stops fighting. "I am coming back tomorrow," he warns. For now, he comes.',
          cronica: '{nome} carried Caetano out of the Radio Dome, kicking all the way.',
          efeitos: { companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'Caetano clings to the panel with a strength nobody would have guessed. In the struggle an elbow finds your nose, and the two of you breathe an hour of air in minutes. You leave alone.',
          cronica: '{nome} fought with Caetano in the Radio Dome and left with a bleeding nose.',
          efeitos: { vida: -1, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Find a voice in static',
        teste: { chave: 'percepcao', dificuldade: 9 },
        ajuda: ['scanner'],
        sucesso: {
          texto: 'You pick up the second pair of headphones. Static, static, and underneath it a click that repeats every eleven seconds. An automatic beacon, old, from down there. Nobody talking, but somebody left it on. Caetano weeps, switches off the panel and comes.',
          cronica: '{nome} found in the static a beacon on Earth still switched on, and Caetano was able to leave the Dome.',
          efeitos: { lacos: 1, companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'You listen until the static starts to take shape. Voices, nearly. Your name, nearly. You pull the headphones off fast. Caetano nods: "It is like that at the beginning."',
          cronica: '{nome} listened to the static in the Dome long enough to hear a familiar name in it.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sit and listen',
        teste: { chave: 'empatia', dificuldade: 7 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'You strap into the chair beside him and let him tell it: eleven years of calling, the names he made up for the operators down there. In the end he switches off the panel himself and holds out his flask of calming tea. "Where are you headed?"',
          cronica: '{nome} listened to eleven years of unanswered calls, and Caetano switched off the radio to come along.',
          efeitos: { lacos: 1, item: 'cha', companheiro: 'caetanoDaCupula', marco: true },
        },
        falha: {
          texto: 'You listen, but with your eyes on the gauge, and he notices. "Go on, go on, you are in a hurry," he says, and puts the headphones back on. You leave with the feeling of having left a door open to the outside.',
          cronica: '{nome} listened to Caetano with one eye on the air gauge, and he stayed in the Dome.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'amparo',
        rotulo: 'Hold up his loneliness',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'You attune, and Caetano\'s loneliness is exactly the size of the dome. You take nothing from him; you only hold it with him for a while. He breathes deep, takes off the headphones and passes you the calming tea. "It has been a long time since anyone came up here."',
          cronica: '{nome} helped carry Caetano\'s loneliness for a while, and he left the Radio Dome.',
          efeitos: { lacos: 1, item: 'cha', companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'His loneliness runs deeper than you measured, and a little of it moves in with you. Caetano does not even notice. You leave the dome cold on the inside.',
          cronica: '{nome} attuned to Caetano\'s loneliness and carried a piece of it away.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Call in the old tongue',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 4 },
        ajuda: ['manual'],
        sucesso: {
          texto: 'Caetano calls in ring talk, which nobody down there would understand. You dictate the call sign in the founders\' tongue and he transmits it, once, with great care. No answer comes. "At least this time it went out properly," he says, and switches off to go with you.',
          cronica: '{nome} dictated the call to Caetano in the founders\' tongue, the first correct one in eleven years.',
          efeitos: { lacos: 1, companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'You trip over the conjugation, and the call sign goes out saying that Aurora-7 is a cabbage. Caetano laughs, which is something, but goes back to his headphones. The air in the dome did not wait for the joke.',
          cronica: '{nome} informed the Earth, in the old tongue, that Aurora-7 was a cabbage.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },

  {
    id: 'ar3-assobio',
    ato: 3,
    titulo: 'The Whistle',
    texto:
      'A thin whistle cuts the silence of the Tube. It comes from an inspection hatch whose glass has cracked into a star: on the other side, the whole dark, with no bottom and no edge. Dust and one loose screw drift slowly towards the crack. The air gauge trembles. "I am aware," says the Caretaker. "I am still calculating what to do. Please wait."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Patch the glass',
        teste: { chave: 'destreza', dificuldade: 8 },
        ajuda: ['remendo', 'ferramenta'],
        sucesso: {
          texto: 'A locker door, sealing grease round the edges, and the pressure of the station does the rest: the plate meets the glass with a kiss. The whistle dies. In the silence the air gauge climbs one notch, sheepishly.',
          cronica: '{nome} patched a cracked hatch in the Tube with a locker door.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'The plate slips, the crack grows another leg and the whistle becomes a howl. You end up sealing it with your jacket and your forearm, which comes away purple with cold and suction.',
          cronica: '{nome} sealed a crack in the Tube with one bare forearm.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Seal off the right section',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'A patch on cracked glass does not last a shift. You move on to the next section and spin the wheel of the manual bulkhead. The whistle stays on the other side, for whoever has a pressure suit and the time. "That is what I was going to suggest," says the Caretaker.',
          cronica: '{nome} sealed off the section with the cracked hatch before the Caretaker had finished her sum.',
        },
        falha: {
          texto: 'You close the bulkhead and the whistle carries on: it was the other one. Go back, open, pass through, close again. All of it while the air of the stretch moves out to live outside.',
          cronica: '{nome} closed the wrong bulkhead while the air escaped through the crack.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Persuade the Caretaker to decide',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'You tell her that a wrong sum can be mended and lost air cannot. That she is allowed to get it wrong with you watching. A hiss. Then the bulkheads along the stretch slide shut by themselves, and the whistle is locked away behind them. "Thank you," she says.',
          cronica: '{nome} persuaded the Caretaker to decide without being sure, and she closed off the cracked stretch.',
          efeitos: { marca: 'ouviu' },
        },
        falha: {
          texto: '"There are four options and every one carries risk," she says, and begins to read out all four. At the second you give up and haul the bulkhead shut by hand, already dizzy, while she goes on reading to the empty corridor.',
          cronica: 'The Caretaker read {nome} four options while the air was leaving.',
          efeitos: { sanidade: -1, brasa: -2 },
        },
      },
      {
        id: 'vazio',
        rotulo: 'Face the dark outside',
        combate: 'panicoDoVazioEixo',
        vitoria: {
          texto: 'You look through the crack until the dark stops growing. It is big, that is all. It wants nothing from you. Your hands stop shaking and close the bulkhead of the stretch almost by themselves.',
          cronica: '{nome} stared at the void through a cracked hatch until it was only big.',
        },
        derrota: {
          texto: 'The dark looks back and has no end. You curl up against the opposite wall with your eyes shut while the whistle sings. At some point the Caretaker closes the bulkhead for you.',
          cronica: '{nome} looked at the void through the crack, and the void won.',
          efeitos: { brasa: -2 },
        },
        fuga: {
          texto: 'You tear your eyes away and flee to the next section, slamming the bulkhead behind you. The whistle is gone. What you saw through the crack comes along.',
          cronica: '{nome} fled the dark that was coming in through a crack in the Tube.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Seal with rag and soap',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 4 },
        ajuda: ['remendo'],
        sucesso: {
          texto: 'In the Docks you learn this before you learn to read: a wet rag, coarse soap, and let the vacuum pull the plug into place. The whistle chokes and stops. The air gauge settles.',
          cronica: '{nome} sealed a cracked hatch with rag and soap, the way it is done in the Docks.',
        },
        falha: {
          texto: 'The rag freezes before it can seat and cracks like a biscuit. You do it over with stiff fingers. It seals, but it cost more air than it should have.',
          cronica: '{nome} needed two rag plugs to silence one crack.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'pedir',
        rotulo: 'Ask her to close it',
        requer: { marca: 'ouviu' },
        livre: true,
        resultado: {
          texto: 'This time you simply ask. "Will you close it for me?" A moment of hiss, the time it takes to do a small sum, and the bulkheads along the stretch slide shut. "This one I know how to do," says the Caretaker, and she sounds pleased.',
          cronica: '{nome} asked, and the Caretaker closed off the cracked stretch without redoing the sum.',
        },
      },
    ],
  },
];
