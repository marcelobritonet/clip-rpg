/**
 * Ar Rarefeito: os passados. Cada um é uma ficha de Especialista Iniciante
 * (12 Pontos de Evolução) conferida por `validar`, sobre as mesmas regras da
 * Brasa. A "sintonia" de quem nasceu em órbita usa as Perícias Mágicas do
 * manual sem mudar regra nenhuma (ver HISTORIA.md).
 */
export const PONTOS_INICIAIS = 12;

export const PASSADOS = [
  {
    id: 'estivadora',
    titulo: 'A Estivadora',
    nome: 'Dalva',
    caminho: 'corpo',
    quem: 'Você carrega contêiner nas Docas desde os quatorze e é campeã de queda de braço há seis safras seguidas. Metade da estação já foi ajudada por você numa mudança; a outra metade ainda vai ser.',
    motivo: 'O cartucho pesa trinta quilos e o caminho é longo. Todo mundo olhou para você ao mesmo tempo.',
    atributos: { forca: 3, destreza: 1, fisico: 2, percepcao: 1, presenca: 1 },
    aprimoramentos: { manipulacaoPeso: 1, ataqueCorporal: 1, resistencia: 1 },
    pericias: { sobrevivencia: 1 },
    antecedentes: { boaFama: { nivel: 1 } },
    itens: ['chaveDeGrifo', 'colete', 'cabo'],
  },
  {
    id: 'piloto',
    titulo: 'O Piloto de Rebocador',
    nome: 'Nilo',
    caminho: 'corpo',
    quem: 'Você manobra o rebocador Teimoso por fora do casco e conhece a estação melhor pelo lado de fora que pelo de dentro. Às vezes leva uma caixa que não consta em manifesto nenhum, e deve um favor grande a quem não devia.',
    motivo: 'O Teimoso está sem propelente desde a última safra. Desta vez o caminho é por dentro, a pé, como todo mundo.',
    atributos: { destreza: 3, fisico: 1, percepcao: 2, vontade: 1 },
    aprimoramentos: { reflexo: 2, agilidade: 1 },
    pericias: { equilibrio: 1, furtividade: 1 },
    antecedentes: { inimigo: { nivel: 1, mau: true }, aliado: { nivel: 1 } },
    itens: ['botas', 'lanterna', 'estilete'],
  },
  {
    id: 'medica',
    titulo: 'A Médica do Anel',
    nome: 'Iara',
    caminho: 'mente',
    quem: 'Você é a única médica para duzentas pessoas, quarenta cabras e um número incerto de galinhas. Fez parto, arrancou dente e assinou atestado de óbito, muitas vezes na mesma semana.',
    motivo: 'Você sabe em quantas horas o ar ruim começa a derrubar primeiro os velhos e depois as crianças. Fez a conta duas vezes.',
    atributos: { inteligencia: 3, percepcao: 1, sabedoria: 2, fisico: 1, presenca: 1 },
    aprimoramentos: {},
    pericias: { medicina: 2, ciencias: 1, investigacao: 1 },
    antecedentes: { recursos: { nivel: 1 } },
    itens: ['maleta', 'gel', 'bisturi'],
  },
  {
    id: 'tecnico',
    titulo: 'O Técnico de Sistemas',
    nome: 'Juca',
    caminho: 'mente',
    quem: 'Você mantém de pé uma estação que devia ter sido desmontada antes de o seu avô nascer. Nasceu em órbita e às vezes sente a máquina antes de o painel acusar: um zumbido atrás dos dentes, um calor fora do lugar.',
    motivo: 'Foi você quem assinou a última revisão do reciclador. Estava tudo dentro da tolerância.',
    atributos: { inteligencia: 3, percepcao: 2, destreza: 1, vontade: 1 },
    aprimoramentos: {},
    pericias: { maquinas: 2, engenharia: 1, magiaEncantamento: 1, magiaElemental: 1 },
    antecedentes: { semRecursos: { nivel: 1, mau: true }, aliado: { nivel: 1 } },
    itens: ['leitor', 'ferramentas', 'fita'],
  },
  {
    id: 'negociador',
    titulo: 'O Negociador do Mercado',
    nome: 'Quim',
    caminho: 'espirito',
    quem: 'Na Praça das Trocas, nada muda de mão sem passar pela sua conversa. Você lê os manuais dos fundadores na língua velha, fala o dialeto das Docas e já trocou um par de meias por meia tonelada de tomate.',
    motivo: 'Ar é a única mercadoria que você nunca conseguiu negociar. Não pretende começar hoje, e por isso vai buscar.',
    atributos: { presenca: 3, vontade: 1, inteligencia: 1, percepcao: 1, destreza: 1 },
    aprimoramentos: { empatia: 2, agilidade: 1 },
    pericias: { idiomas: 1, prestidigitacao: 1 },
    antecedentes: { recursos: { nivel: 1 }, maFama: { nivel: 1, mau: true } },
    itens: ['fichas', 'gaita'],
  },
  {
    id: 'sensitiva',
    titulo: 'A Sensitiva',
    nome: 'Lia',
    caminho: 'espirito',
    quem: 'Você nasceu na noite do apagão grande e desde pequena sintoniza: sabe quem está triste do outro lado da antepara, e as cabras vêm sem ser chamadas. O anel acha esquisito, mas bate na sua porta quando o filho não dorme.',
    motivo: 'Há três dias você sente a estação inteira prendendo a respiração. E alguma coisa no Eixo, fria e atenta, fazendo contas.',
    atributos: { vontade: 3, fe: 1, presenca: 1, sabedoria: 2, fisico: 1 },
    aprimoramentos: {},
    pericias: { magiaControle: 2, magiaSuporte: 1, lidarAnimais: 1 },
    antecedentes: { aliado: { nivel: 1 } },
    itens: ['medalha', 'racao', 'cha'],
  },
];

export const passado = (id) => PASSADOS.find((p) => p.id === id);
