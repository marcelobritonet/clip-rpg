/**
 * Thin Air: the pasts. Each one is a Beginner Specialist sheet (12 Evolution
 * Points) checked by `validar`, on the same rules as the Ember. The
 * "attunement" of those born in orbit uses the manual's Magic Skills without
 * changing a single rule (see HISTORIA.md).
 */
export const PONTOS_INICIAIS = 12;

export const PASSADOS = [
  {
    id: 'estivadora',
    titulo: 'The Stevedore',
    nome: 'Dalva',
    caminho: 'corpo',
    quem: 'You have hauled containers on the Docks since you were fourteen, and you have been arm-wrestling champion six harvests running. Half the station has had your help moving house. The other half will, sooner or later.',
    motivo: 'The cartridge weighs thirty kilos and the way is long. Everybody looked at you at the same moment.',
    atributos: { forca: 3, destreza: 1, fisico: 2, percepcao: 1, presenca: 1 },
    aprimoramentos: { manipulacaoPeso: 1, ataqueCorporal: 1, resistencia: 1 },
    pericias: { sobrevivencia: 1 },
    antecedentes: { boaFama: { nivel: 1 } },
    itens: ['chaveDeGrifo', 'colete', 'cabo'],
  },
  {
    id: 'piloto',
    titulo: 'The Tug Pilot',
    nome: 'Nilo',
    caminho: 'corpo',
    quem: 'You fly the tug Stubborn along the outside of the hull, and you know the station better from out there than from in here. Now and then you carry a crate that appears on no manifest, and you owe a large favour to someone you should never have owed.',
    motivo: 'The Stubborn has been out of propellant since the last harvest. This time the way is through the inside, on foot, like everybody else.',
    atributos: { destreza: 3, fisico: 1, percepcao: 2, vontade: 1 },
    aprimoramentos: { reflexo: 2, agilidade: 1 },
    pericias: { equilibrio: 1, furtividade: 1 },
    antecedentes: { inimigo: { nivel: 1, mau: true }, aliado: { nivel: 1 } },
    itens: ['botas', 'lanterna', 'estilete'],
  },
  {
    id: 'medica',
    titulo: 'The Ring Medic',
    nome: 'Iara',
    caminho: 'mente',
    quem: 'You are the only doctor for two hundred people, forty goats and an uncertain number of chickens. You have delivered babies, pulled teeth and signed death certificates, often in the same week.',
    motivo: 'You know how many hours it takes for bad air to start felling the old first, and then the children. You did the sum twice.',
    atributos: { inteligencia: 3, percepcao: 1, sabedoria: 2, fisico: 1, presenca: 1 },
    aprimoramentos: {},
    pericias: { medicina: 2, ciencias: 1, investigacao: 1 },
    antecedentes: { recursos: { nivel: 1 } },
    itens: ['maleta', 'gel', 'bisturi'],
  },
  {
    id: 'tecnico',
    titulo: 'The Systems Tech',
    nome: 'Juca',
    caminho: 'mente',
    quem: 'You keep a station standing that should have been taken apart before your grandfather was born. You were born in orbit, and sometimes you feel the machine before the panel reports it: a hum behind the teeth, a warmth in the wrong place.',
    motivo: 'You were the one who signed off the recycler\'s last inspection. Everything was within tolerance.',
    atributos: { inteligencia: 3, percepcao: 2, destreza: 1, vontade: 1 },
    aprimoramentos: {},
    pericias: { maquinas: 2, engenharia: 1, magiaEncantamento: 1, magiaElemental: 1 },
    antecedentes: { semRecursos: { nivel: 1, mau: true }, aliado: { nivel: 1 } },
    itens: ['leitor', 'ferramentas', 'fita'],
  },
  {
    id: 'negociador',
    titulo: 'The Market Broker',
    nome: 'Quim',
    caminho: 'espirito',
    quem: 'On Barter Square, nothing changes hands without passing through your patter. You read the founders\' manuals in the old tongue, speak the Docks dialect, and once traded a pair of socks for half a tonne of tomatoes.',
    motivo: 'Air is the one commodity you have never managed to haggle over. You do not mean to start today, so you are going to fetch it.',
    atributos: { presenca: 3, vontade: 1, inteligencia: 1, percepcao: 1, destreza: 1 },
    aprimoramentos: { empatia: 2, agilidade: 1 },
    pericias: { idiomas: 1, prestidigitacao: 1 },
    antecedentes: { recursos: { nivel: 1 }, maFama: { nivel: 1, mau: true } },
    itens: ['fichas', 'gaita'],
  },
  {
    id: 'sensitiva',
    titulo: 'The Sensitive',
    nome: 'Lia',
    caminho: 'espirito',
    quem: 'You were born on the night of the great blackout and have attuned since you were small: you know who is sad on the far side of the bulkhead, and the goats come without being called. The ring finds it odd, but knocks on your door when the baby will not sleep.',
    motivo: 'For three days you have felt the whole station holding its breath. And something in the Spine, cold and watchful, doing sums.',
    atributos: { vontade: 3, fe: 1, presenca: 1, sabedoria: 2, fisico: 1 },
    aprimoramentos: {},
    pericias: { magiaControle: 2, magiaSuporte: 1, lidarAnimais: 1 },
    antecedentes: { aliado: { nivel: 1 } },
    itens: ['medalha', 'racao', 'cha'],
  },
];

export const passado = (id) => PASSADOS.find((p) => p.id === id);
