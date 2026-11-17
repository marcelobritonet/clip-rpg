/**
 * Travessia — protótipo de jogo de cartas solo do Sistema Clip.
 *
 * Lógica pura (sem DOM): roda no navegador e nos testes do Node. Toda regra de
 * RPG vem do motor (`motor/clip.js`): testes, combate, iniciativa, valores e o
 * limite das Perícias. O que é só do jogo de cartas (custos em PE por cena,
 * frentes de conflito, Ímpeto dos oponentes, Renome) fica aqui, em `JOGO`, e
 * as dúvidas que isso levanta estão em `cartas/NOTAS.md`.
 *
 * O estado é um objeto simples, alterado no lugar pelas funções. Cada função
 * que rola dados recebe `rng` no estado, para os testes fixarem os dados.
 */
import {
  ATRIBUTOS,
  APRIMORAMENTOS,
  PERICIAS_EXEMPLO,
  CAMINHOS,
  DIFICULDADES,
  NIVEIS_INICIAIS,
  REGRAS,
  novaFicha,
  nivelDe,
  maximoPericia,
  valores,
  valoresCaminhos,
  limiteEquipamento,
  pontosGastos,
  testar,
  resolverAtaque,
  iniciativa,
  descrever,
  nomeDe,
} from '../motor/clip.js';

/* ------------------------------------------------------------------------ */
/* Parâmetros do jogo (não são regras do Clip)                              */
/* ------------------------------------------------------------------------ */

export const JOGO = {
  /** Pontos de Evolução recebidos no começo de cada cena. */
  pePorCena: 3,
  /** PE extras da primeira cena: é a criação do personagem. */
  peCriacao: 4,
  /** Quanto Defender soma à Defesa na rodada (proposta 5.2 do PENDENCIAS). */
  bonusDefender: 2,
  /** Custo em PE. Atributo custa mais porque é o "terreno" que libera o resto. */
  custo: { atributo: 2, aprimoramento: 1, pericia: 1, equipamento: 1, objeto: 1, momento: 0 },
  maoMaxima: 5,
  /** Nível máximo de um Atributo no jogo (o manual sugere 0 a 5). */
  atributoMaximo: REGRAS.nivelMaximoSugerido,
  /** Cenas da travessia; a última é sempre o desafio final. */
  cenas: 7,
  renome: { teste: 2, conflito: 3, semViolencia: 2, fuga: 0 },
  /** Dificuldade de Analisar e de Fugir num conflito. */
  dificuldadeAnalisar: 4,
  dificuldadeFugir: 5,
  /** Quanto o ponto fraco revelado por Analisar baixa a defesa do oponente. */
  pontoFraco: 2,
  /** Rodadas até o conflito terminar em impasse (a cena acaba sem vencedor). */
  rodadasMaximas: 4,
  rodadasFinal: 8,
  /** Descanso entre cenas: Vida e Sanidade recuperadas. */
  descanso: { vida: 1, sanidade: 1 },
};

/**
 * Os desafios endurecem com a travessia: +1 na Dificuldade dos testes e nos
 * valores dos oponentes a cada 3 cenas. O desafio final já vem calibrado.
 */
export function escala(cena) {
  return Math.floor((cena - 1) / 3);
}

const soma = (lista) => lista.reduce((a, b) => a + b, 0);
const caminhoDe = (id) =>
  ATRIBUTOS[id]?.caminho ?? ATRIBUTOS[APRIMORAMENTOS[id]?.atributo]?.caminho ?? null;
const pericia = (id) => PERICIAS_EXEMPLO.find((p) => p.id === id);

/* ------------------------------------------------------------------------ */
/* Cartas                                                                   */
/* ------------------------------------------------------------------------ */

/**
 * Baralho do jogador. `copias` diz quantas vezes a carta entra no baralho:
 * jogar a mesma carta de novo sobe o nível em 1, até o limite do requisito.
 */
const APRIMORAMENTOS_NO_BARALHO = {
  ataqueCorporal: 2, agilidade: 2, reflexo: 2, resistencia: 1, saude: 1, precisao: 1,
  atencao: 2, discernimento: 1, serenidade: 1,
  empatia: 2, intimidacao: 1, lideranca: 1, conviccao: 2, devocao: 2, autocontrole: 1, esperanca: 1, determinacao: 1,
};
const PERICIAS_NO_BARALHO = {
  equilibrio: 1, furtividade: 1, sobrevivencia: 1, investigacao: 2, medicina: 1, historia: 1, maquinas: 1, interrogacao: 1,
};

export const EQUIPAMENTOS = {
  adaga: { nome: 'Adaga', tipo: 'arma', modificador: 1, texto: 'Arma +1 no dano.' },
  espada: { nome: 'Espada', tipo: 'arma', modificador: 2, texto: 'Arma +2 no dano.' },
  gibao: { nome: 'Gibão de couro', tipo: 'armadura', modificador: 1, texto: 'Armadura: −1 no dano físico recebido.' },
  broquel: { nome: 'Broquel', tipo: 'escudo', modificador: 1, texto: 'Escudo: −1 no dano físico recebido.' },
};

/** Objetos ajudam testes (Situação 4 dos Testes): somam níveis ao teste. */
export const OBJETOS = {
  peDeCabra: { nome: 'Pé de cabra', modificador: 2, ajuda: ['forca', 'maquinas'] },
  lupa: { nome: 'Lupa de latão', modificador: 2, ajuda: ['percepcao', 'investigacao', 'medicina'] },
  amuleto: { nome: 'Amuleto da avó', modificador: 2, ajuda: ['fe', 'vontade', 'conviccao'] },
  carta: { nome: 'Carta de recomendação', modificador: 2, ajuda: ['presenca', 'empatia', 'lideranca'] },
  corda: { nome: 'Corda e gancho', modificador: 2, ajuda: ['destreza', 'equilibrio', 'agilidade'] },
};

export const MOMENTOS = {
  folego: { nome: 'Fôlego', texto: 'Recupera 3 Pontos de Vida.', vida: 3, copias: 2 },
  prece: { nome: 'Prece', texto: 'Recupera 3 de Sanidade.', sanidade: 3, copias: 2 },
  companheiro: { nome: 'Companheiro de estrada', texto: 'Unindo forças: +1 nível no próximo teste.', ajuda: 1, copias: 1 },
  inspiracao: { nome: 'Inspiração', texto: '+2 Pontos de Evolução nesta cena.', pe: 2, copias: 1 },
};

function cartaAprimoramento(id) {
  const ap = APRIMORAMENTOS[id];
  return {
    tipo: 'aprimoramento', alvo: id, nome: ap.nome, caminho: caminhoDe(id), requisitos: [ap.atributo],
    proposto: !!ap.proposto, texto: ap.efeito ?? null, dica: ap.proposto ? 'aprimoramentos-propostos' : (ap.manual ?? id),
  };
}

function cartaPericia(id) {
  const p = pericia(id);
  const caminhos = p.requisitos.map(caminhoDe).filter(Boolean);
  return { tipo: 'pericia', alvo: id, nome: p.nome, caminho: caminhos[0], requisitos: p.requisitos, texto: null, dica: id };
}

/** Lista de cartas do baralho, já com uma `uid` por cópia. */
export function montarBaralho() {
  const cartas = [];
  const add = (carta, n = 1) => { for (let i = 0; i < n; i++) cartas.push({ ...carta, uid: `${carta.tipo}-${carta.alvo}-${i}` }); };
  for (const [id, n] of Object.entries(APRIMORAMENTOS_NO_BARALHO)) add(cartaAprimoramento(id), n);
  for (const [id, n] of Object.entries(PERICIAS_NO_BARALHO)) add(cartaPericia(id), n);
  for (const [id, e] of Object.entries(EQUIPAMENTOS)) add({ tipo: 'equipamento', alvo: id, nome: e.nome, caminho: 'corpo', requisitos: [], texto: e.texto, dica: 'armas' });
  for (const [id, o] of Object.entries(OBJETOS)) {
    const nomes = o.ajuda.map((a) => nomeDe(a)).join(', ');
    add({ tipo: 'objeto', alvo: id, nome: o.nome, caminho: caminhoDe(o.ajuda[0]) ?? 'mente', requisitos: [], texto: `Objeto +${o.modificador} em testes de ${nomes}.`, dica: 'objeto' });
  }
  for (const [id, m] of Object.entries(MOMENTOS)) add({ tipo: 'momento', alvo: id, nome: m.nome, caminho: null, requisitos: [], texto: m.texto, dica: null }, m.copias);
  return cartas;
}

/* ------------------------------------------------------------------------ */
/* Origens                                                                  */
/* ------------------------------------------------------------------------ */

export const ORIGENS = {
  sentinela: {
    nome: 'Sentinela', caminho: 'corpo',
    texto: 'Guardou muralhas a vida inteira. Forte e atento, mas pouco acostumado a conversas e a assombros.',
    atributos: { forca: 1, destreza: 1, fisico: 1, percepcao: 1, vontade: 1 },
    aprimoramentos: { ataqueCorporal: 1 },
  },
  erudita: {
    nome: 'Erudita', caminho: 'mente',
    texto: 'Copista de um mosteiro, leu tudo o que havia lá. Nota o que os outros não notam, mas se cansa fácil.',
    atributos: { inteligencia: 1, percepcao: 1, sabedoria: 1, vontade: 1, destreza: 1 },
    pericias: { historia: 1 },
  },
  romeira: {
    nome: 'Romeira', caminho: 'espirito',
    texto: 'Caminha de santuário em santuário. Tem fé, conversa com qualquer um e já dormiu ao relento.',
    atributos: { vontade: 1, presenca: 1, fe: 1, fisico: 1, percepcao: 1 },
    aprimoramentos: { empatia: 1 },
  },
};

/* ------------------------------------------------------------------------ */
/* Desafios do Mestre                                                       */
/* ------------------------------------------------------------------------ */

/**
 * Dois tipos:
 * - `teste`: obstáculo resolvido com um teste do motor. `abordagens` lista o
 *   que pode ser testado e a Dificuldade de cada um. `falha` diz o que se perde.
 * - `conflito`: um oponente com Ímpeto (vontade de seguir). Qualquer frente
 *   (físico, palavra, fé) o reduz; ele ataca na frente dele.
 */
export const DESAFIOS = [
  // Corpo
  { id: 'porta', tipo: 'teste', caminho: 'corpo', nome: 'Porta emperrada',
    texto: 'A única saída do celeiro é uma porta de carvalho inchada pela chuva.',
    abordagens: [{ id: 'forca', dificuldade: 6 }, { id: 'maquinas', dificuldade: 4 }, { id: 'inteligencia', dificuldade: 8 }],
    falha: { vida: 2, texto: 'Você força até machucar o ombro.' } },
  { id: 'correnteza', tipo: 'teste', caminho: 'corpo', nome: 'Rio de correnteza',
    texto: 'A ponte caiu. A água está rápida e fria.',
    abordagens: [{ id: 'fisico', dificuldade: 5 }, { id: 'sobrevivencia', dificuldade: 4 }, { id: 'sabedoria', dificuldade: 7 }],
    falha: { vida: 3, texto: 'A correnteza arrasta você contra as pedras.' } },
  { id: 'muro', tipo: 'teste', caminho: 'corpo', nome: 'Muro do convento',
    texto: 'Os portões estão fechados ao anoitecer. O muro é alto e liso.',
    abordagens: [{ id: 'destreza', dificuldade: 5 }, { id: 'equilibrio', dificuldade: 4 }, { id: 'presenca', dificuldade: 6 }],
    falha: { vida: 2, texto: 'Você escorrega e cai de costas.' } },
  { id: 'emboscada', tipo: 'conflito', caminho: 'corpo', nome: 'Emboscada na estrada',
    texto: 'Dois salteadores saem do mato com porretes. Parecem mais famintos do que cruéis.',
    oponente: { nome: 'Salteadores', impeto: 4, defesa: { fisico: 1, palavra: 0, fe: 2 }, armadura: 0,
      ataque: { frente: 'fisico', valor: 0, arma: 0 }, iniciativa: { reflexo: 1, agilidade: 1, destreza: 1 } } },
  { id: 'lobo', tipo: 'conflito', caminho: 'corpo', nome: 'Lobo da serra',
    texto: 'Um lobo magro bloqueia a trilha, rosnando sobre um filhote ferido.',
    oponente: { nome: 'Lobo', impeto: 3, defesa: { fisico: 2, palavra: 1, fe: 0 }, armadura: 0,
      ataque: { frente: 'fisico', valor: 0, arma: 0 }, iniciativa: { reflexo: 2, agilidade: 2, destreza: 2 } } },

  // Mente
  { id: 'veneno', tipo: 'teste', caminho: 'mente', nome: 'Vinho do estalajadeiro',
    texto: 'O estalajadeiro sorri demais ao servir a sua taça.',
    abordagens: [{ id: 'percepcao', dificuldade: 5 }, { id: 'medicina', dificuldade: 3 }, { id: 'discernimento', dificuldade: 4 }],
    falha: { vida: 3, texto: 'Você bebe. A noite é longa e febril.' } },
  { id: 'rastro', tipo: 'teste', caminho: 'mente', nome: 'Rastro perdido',
    texto: 'A neblina apagou a trilha. Há pegadas, galhos quebrados, cheiro de fumaça.',
    abordagens: [{ id: 'percepcao', dificuldade: 5 }, { id: 'sobrevivencia', dificuldade: 4 }, { id: 'investigacao', dificuldade: 4 }],
    falha: { sanidade: 2, texto: 'Horas andando em círculos minam a sua calma.' } },
  { id: 'mapa', tipo: 'teste', caminho: 'mente', nome: 'Mapa em língua antiga',
    texto: 'O mapa do vau está escrito numa língua que ninguém fala há séculos.',
    abordagens: [{ id: 'inteligencia', dificuldade: 6 }, { id: 'historia', dificuldade: 3 }, { id: 'sabedoria', dificuldade: 7 }],
    falha: { sanidade: 1, vida: 1, texto: 'Você escolhe a trilha errada e paga com cansaço.' } },
  { id: 'mercador', tipo: 'teste', caminho: 'mente', nome: 'O mercador gentil',
    texto: 'Um mercador oferece um atalho pelo pântano, de graça.',
    abordagens: [{ id: 'sabedoria', dificuldade: 5 }, { id: 'discernimento', dificuldade: 3 }, { id: 'investigacao', dificuldade: 4 }],
    falha: { vida: 2, sanidade: 1, texto: 'O atalho era uma armadilha. Você escapa, ferido e humilhado.' } },
  { id: 'enigma', tipo: 'conflito', caminho: 'mente', nome: 'O inquisidor da ponte',
    texto: 'Um inquisidor exige saber quem você é, de onde vem e por que viaja. Cada resposta errada pesa.',
    oponente: { nome: 'Inquisidor', impeto: 4, defesa: { fisico: 3, palavra: 1, fe: 1 }, armadura: 1,
      ataque: { frente: 'mente', valor: 0, arma: 0 }, iniciativa: { reflexo: 0, agilidade: 0, destreza: 1 } } },

  // Espírito
  { id: 'cripta', tipo: 'teste', caminho: 'espirito', nome: 'Noite na cripta',
    texto: 'O único abrigo da tempestade é uma cripta. Algo sussurra lá dentro.',
    abordagens: [{ id: 'vontade', dificuldade: 5 }, { id: 'fe', dificuldade: 4 }, { id: 'serenidade', dificuldade: 3 }],
    falha: { sanidade: 3, texto: 'Você não dorme. Os sussurros conhecem o seu nome.' } },
  { id: 'aldeia', tipo: 'teste', caminho: 'espirito', nome: 'Aldeia desconfiada',
    texto: 'Os aldeões trancam as portas quando você chega. Só querem saber de onde veio a peste.',
    abordagens: [{ id: 'presenca', dificuldade: 5 }, { id: 'empatia', dificuldade: 4 }, { id: 'lideranca', dificuldade: 4 }],
    falha: { vida: 2, texto: 'Pedras voam. Você passa a noite no mato.' } },
  { id: 'tentacao', tipo: 'teste', caminho: 'espirito', nome: 'Bolsa no caminho',
    texto: 'Uma bolsa de moedas caída ao lado de um peregrino adormecido.',
    abordagens: [{ id: 'fe', dificuldade: 4 }, { id: 'conviccao', dificuldade: 3 }, { id: 'vontade', dificuldade: 5 }],
    falha: { sanidade: 2, texto: 'Você pega as moedas. A culpa pesa mais que elas.' } },
  { id: 'chefe', tipo: 'conflito', caminho: 'espirito', nome: 'Pedágio do barão',
    texto: 'O capataz do barão cobra pedágio de quem passa. Dois guardas atrás dele, entediados.',
    oponente: { nome: 'Capataz', impeto: 4, defesa: { fisico: 3, palavra: 0, fe: 2 }, armadura: 1,
      ataque: { frente: 'fisico', valor: 0, arma: 0 }, iniciativa: { reflexo: 1, agilidade: 0, destreza: 1 } } },
  { id: 'aparicao', tipo: 'conflito', caminho: 'espirito', nome: 'A aparição do moinho',
    texto: 'Uma mulher pálida chora no moinho abandonado. O frio vem dela.',
    oponente: { nome: 'Aparição', impeto: 4, defesa: { fisico: 5, palavra: 1, fe: 0 }, armadura: 2,
      ataque: { frente: 'mente', valor: 0, arma: 0 }, iniciativa: { reflexo: 2, agilidade: 0, destreza: 0 } } },
];

export const DESAFIO_FINAL = {
  id: 'vau', tipo: 'conflito', caminho: null, final: true, nome: 'O Guardião do Vau',
  texto: 'No vau, uma figura de armadura antiga barra a passagem. "Mostre que é digno", diz, e a voz ecoa por dentro da cabeça.',
  oponente: { nome: 'Guardião', impeto: 6, defesa: { fisico: 2, palavra: 2, fe: 2 }, armadura: 1,
    ataque: { frente: 'alterna', valor: 1, arma: 0 }, iniciativa: { reflexo: 2, agilidade: 1, destreza: 2 } },
};

/* ------------------------------------------------------------------------ */
/* Estado                                                                   */
/* ------------------------------------------------------------------------ */

function embaralhar(lista, rng) {
  const l = [...lista];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

/** Ficha do motor com uma Perícia de exemplo no nível pedido. */
function porPericia(ficha, id, nivel) {
  let p = ficha.pericias.find((x) => x.id === id);
  if (!p) {
    const ex = pericia(id);
    p = { id, nome: ex.nome, requisitos: [...ex.requisitos], nivel: 0, aplica: null };
    ficha.pericias.push(p);
  }
  p.nivel = nivel;
}

export function novoJogo({ origem = 'sentinela', rng = Math.random } = {}) {
  const o = ORIGENS[origem];
  const ficha = novaFicha();
  ficha.nome = o.nome;
  ficha.conceito = o.texto;
  ficha.caminhoPrincipal = o.caminho;
  Object.assign(ficha.atributos, o.atributos);
  Object.assign(ficha.aprimoramentos, o.aprimoramentos ?? {});
  for (const [id, n] of Object.entries(o.pericias ?? {})) porPericia(ficha, id, n);

  const v = valores(ficha);
  const desafios = embaralhar(DESAFIOS, rng);
  const estado = {
    rng,
    origem,
    ficha,
    objetos: [],
    vida: v.vida.valor,
    sanidade: v.sanidade.valor,
    pe: 0,
    renome: 0,
    cena: 0,
    baralho: embaralhar(montarBaralho(), rng),
    descarte: [],
    mao: [],
    pilhaMestre: desafios,
    desafio: null,
    motivoMestre: null,
    fase: 'preparo', // preparo → teste | conflito → resultado → (preparo | fim)
    ajuda: 0, // níveis de "Companheiro de estrada" para o próximo teste
    conflito: null,
    resultado: null,
    historico: [],
    fim: null,
    trocou: 0,
  };
  proximaCena(estado);
  return estado;
}

function comprar(estado, n) {
  for (let i = 0; i < n; i++) {
    if (!estado.baralho.length) {
      if (!estado.descarte.length) return;
      estado.baralho = embaralhar(estado.descarte, estado.rng);
      estado.descarte = [];
    }
    estado.mao.push(estado.baralho.shift());
  }
}

/* ------------------------------------------------------------------------ */
/* O Mestre (IA)                                                            */
/* ------------------------------------------------------------------------ */

const NOME_CAMINHO = Object.fromEntries(CAMINHOS.map((c) => [c.id, c.nome]));

/**
 * O Mestre revela dois desafios e escolhe o que mira o Caminho mais fraco do
 * personagem. É o jeito do jogo de desencorajar o meta-jogo: especializar
 * demais num Caminho atrai os desafios dos outros dois.
 */
export function escolherDesafio(estado) {
  if (estado.cena >= JOGO.cenas) return { desafio: DESAFIO_FINAL, motivo: 'A travessia termina no vau.' };
  const opcoes = estado.pilhaMestre.splice(0, 2);
  const vc = valoresCaminhos(estado.ficha);
  opcoes.sort((a, b) => vc[a.caminho] - vc[b.caminho]);
  const [escolhido, outro] = opcoes;
  if (outro) estado.pilhaMestre.push(outro);
  let motivo;
  if (!outro || vc[escolhido.caminho] === vc[outro.caminho]) {
    motivo = 'O Mestre vira uma carta.';
  } else {
    motivo = `O Mestre tinha ${outro.nome} na mão, mas notou que seu ${NOME_CAMINHO[escolhido.caminho]} é o mais frágil.`;
  }
  return { desafio: escolhido, motivo };
}

/** Cópia do desafio com a escala da cena aplicada. */
function escalar(desafio, e) {
  const d = structuredClone(desafio);
  d.escala = e;
  if (!e) return d;
  if (d.abordagens) for (const a of d.abordagens) a.dificuldade += e;
  if (d.oponente) {
    for (const k of Object.keys(d.oponente.defesa)) d.oponente.defesa[k] += e;
    d.oponente.ataque.valor += e;
    d.oponente.impeto += e;
  }
  return d;
}

/** Começa a próxima cena: PE, compra e o desafio do Mestre. */
export function proximaCena(estado) {
  estado.cena += 1;
  estado.pe += JOGO.pePorCena + (estado.cena === 1 ? JOGO.peCriacao : 0);
  // Esperança (proposto): recupera Sanidade a cada descanso entre cenas.
  if (estado.cena > 1) {
    curar(estado, { vida: JOGO.descanso.vida, sanidade: JOGO.descanso.sanidade + nivelDe(estado.ficha, 'esperanca') });
  }
  comprar(estado, Math.max(0, JOGO.maoMaxima - estado.mao.length));
  const { desafio, motivo } = escolherDesafio(estado);
  estado.desafio = escalar(desafio, desafio.final ? 0 : escala(estado.cena));
  estado.motivoMestre = motivo;
  estado.fase = 'preparo';
  estado.resultado = null;
  estado.conflito = null;
}

/* ------------------------------------------------------------------------ */
/* Evolução: jogar cartas e treinar Atributos                               */
/* ------------------------------------------------------------------------ */

const maximos = (estado) => {
  const v = valores(estado.ficha);
  return { vida: v.vida.valor, sanidade: v.sanidade.valor };
};

function curar(estado, { vida = 0, sanidade = 0 }) {
  const max = maximos(estado);
  estado.vida = Math.min(max.vida, estado.vida + vida);
  estado.sanidade = Math.min(max.sanidade, estado.sanidade + sanidade);
}

/** Aplica uma mudança na ficha e ajusta Vida e Sanidade atuais pelo novo máximo. */
function mudarFicha(estado, fn) {
  const antes = maximos(estado);
  fn(estado.ficha);
  const depois = maximos(estado);
  estado.vida += Math.max(0, depois.vida - antes.vida);
  estado.sanidade += Math.max(0, depois.sanidade - antes.sanidade);
  estado.vida = Math.min(estado.vida, depois.vida);
  estado.sanidade = Math.min(estado.sanidade, depois.sanidade);
}

/** Nível que a característica teria depois de jogar a carta. */
function nivelMaximo(ficha, carta) {
  if (carta.tipo === 'aprimoramento') return nivelDe(ficha, APRIMORAMENTOS[carta.alvo].atributo);
  if (carta.tipo === 'pericia') return maximoPericia(ficha, pericia(carta.alvo));
  return Infinity;
}

/** Requisito que trava a carta: o de menor nível (o que limita a Perícia). */
function requisitoLimitante(ficha, carta) {
  return carta.requisitos.reduce((a, b) => (nivelDe(ficha, a) <= nivelDe(ficha, b) ? a : b));
}

/**
 * A carta pode ser jogada agora? Devolve `{ ok, motivo, nivel }`, em que
 * `nivel` é o nível que a característica teria depois de jogar.
 */
export function podeJogar(estado, carta) {
  const custo = JOGO.custo[carta.tipo];
  const naFase = carta.tipo === 'momento' ? estado.fase !== 'fim' : estado.fase === 'preparo';
  if (!naFase) return { ok: false, motivo: 'Só na preparação da cena.' };
  if (custo > estado.pe) return { ok: false, motivo: `Custa ${custo} PE.` };
  const f = estado.ficha;
  if (carta.tipo === 'aprimoramento' || carta.tipo === 'pericia') {
    const nivel = nivelDe(f, carta.alvo) + 1;
    const max = nivelMaximo(f, carta);
    if (nivel > max) {
      const r = requisitoLimitante(f, carta);
      return { ok: false, motivo: `Precisa de ${nomeDe(r, f)} ${nivel} (tem ${nivelDe(f, r)}).`, nivel };
    }
    return { ok: true, nivel };
  }
  if (carta.tipo === 'equipamento') {
    const e = EQUIPAMENTOS[carta.alvo];
    const outros = f.equipamentos.filter((x) => x.tipo !== e.tipo);
    const total = soma(outros.map((x) => x.modificador)) + e.modificador;
    const limite = limiteEquipamento(f);
    if (total > limite) return { ok: false, motivo: `Equipamentos somariam ${total}; o limite (Força) é ${limite}.` };
    return { ok: true };
  }
  if (carta.tipo === 'objeto' && estado.objetos.includes(carta.alvo)) return { ok: false, motivo: 'Você já tem um.' };
  if (carta.tipo === 'momento') {
    const m = MOMENTOS[carta.alvo];
    if (m.pe && estado.fase !== 'preparo') return { ok: false, motivo: 'Só na preparação da cena.' };
    const max = maximos(estado);
    if (m.vida && !m.sanidade && estado.vida >= max.vida) return { ok: false, motivo: 'Vida já está cheia.' };
    if (m.sanidade && !m.vida && estado.sanidade >= max.sanidade) return { ok: false, motivo: 'Sanidade já está cheia.' };
  }
  return { ok: true };
}

/** Joga a carta da mão. Lança erro se não puder (a interface checa antes). */
export function jogarCarta(estado, uid) {
  const i = estado.mao.findIndex((c) => c.uid === uid);
  if (i < 0) throw new Error(`Carta ${uid} não está na mão.`);
  const carta = estado.mao[i];
  const pode = podeJogar(estado, carta);
  if (!pode.ok) throw new Error(pode.motivo);
  estado.pe -= JOGO.custo[carta.tipo];
  estado.mao.splice(i, 1);

  if (carta.tipo === 'aprimoramento') {
    mudarFicha(estado, (f) => { f.aprimoramentos[carta.alvo] = pode.nivel; });
  } else if (carta.tipo === 'pericia') {
    mudarFicha(estado, (f) => porPericia(f, carta.alvo, pode.nivel));
  } else if (carta.tipo === 'equipamento') {
    const e = EQUIPAMENTOS[carta.alvo];
    const f = estado.ficha;
    f.equipamentos = f.equipamentos.filter((x) => x.tipo !== e.tipo);
    f.equipamentos.push({ id: carta.alvo, nome: e.nome, tipo: e.tipo, modificador: e.modificador });
  } else if (carta.tipo === 'objeto') {
    estado.objetos.push(carta.alvo);
  } else if (carta.tipo === 'momento') {
    const m = MOMENTOS[carta.alvo];
    curar(estado, m);
    if (m.ajuda) estado.ajuda += m.ajuda;
    if (m.pe) estado.pe += m.pe;
    estado.descarte.push(carta);
  }
  return carta;
}

/** Troca uma carta da mão por outra do baralho (uma vez por cena, sem custo). */
export function trocarCarta(estado, uid) {
  if (estado.trocou === estado.cena || estado.fase !== 'preparo') throw new Error('Só uma troca por cena, na preparação.');
  const i = estado.mao.findIndex((c) => c.uid === uid);
  if (i < 0) throw new Error(`Carta ${uid} não está na mão.`);
  estado.descarte.push(...estado.mao.splice(i, 1));
  comprar(estado, 1);
  estado.trocou = estado.cena;
}

/** Pode treinar este Atributo agora? */
export function podeTreinar(estado, atributo) {
  if (estado.fase !== 'preparo') return { ok: false, motivo: 'Só na preparação da cena.' };
  const custo = JOGO.custo.atributo;
  if (estado.pe < custo) return { ok: false, motivo: `Custa ${custo} PE.` };
  if (nivelDe(estado.ficha, atributo) >= JOGO.atributoMaximo) return { ok: false, motivo: 'No máximo.' };
  return { ok: true };
}

export function treinar(estado, atributo) {
  const pode = podeTreinar(estado, atributo);
  if (!pode.ok) throw new Error(pode.motivo);
  estado.pe -= JOGO.custo.atributo;
  mudarFicha(estado, (f) => { f.atributos[atributo] += 1; });
}

/* ------------------------------------------------------------------------ */
/* Testes                                                                   */
/* ------------------------------------------------------------------------ */

/** Faixa de dificuldade do manual ("Normal", "Difícil"...). */
export function faixa(dificuldade) {
  return DIFICULDADES.find((d) => dificuldade >= d.min && dificuldade <= d.max)?.nome ?? 'Quase Impossível';
}

/**
 * Mente lê o mundo: com Percepção ou Sabedoria 2 ou mais, o jogador vê o
 * número da Dificuldade; abaixo disso, só a faixa.
 */
export function enxergaDificuldade(ficha) {
  return Math.max(nivelDe(ficha, 'percepcao'), nivelDe(ficha, 'sabedoria')) >= 2;
}

/** Objetos do jogador que ajudam numa abordagem. */
export function objetosPara(estado, id) {
  return estado.objetos.filter((o) => OBJETOS[o].ajuda.includes(id));
}

/**
 * Como insistir numa abordagem. O manual só deixa insistir em Atributos do
 * Corpo, pagando com Vida. Determinação (proposto) estende para a Mente,
 * pagando com Sanidade.
 */
export function insistencia(ficha, id) {
  const caminho = caminhoDe(id) ?? caminhoDe(pericia(id)?.requisitos?.[0]);
  if (caminho === 'corpo' && id in ATRIBUTOS) return { paga: 'vida' };
  if (caminho === 'mente' && nivelDe(ficha, 'determinacao') > 0) return { paga: 'sanidade' };
  return null;
}

/** Abordagens do desafio com o nível do personagem em cada uma. */
export function abordagens(estado) {
  const f = estado.ficha;
  return estado.desafio.abordagens.map((a) => {
    const objetos = objetosPara(estado, a.id);
    const objeto = soma(objetos.map((o) => OBJETOS[o].modificador)) + estado.ajuda;
    const nivel = nivelDe(f, a.id);
    return {
      ...a,
      nome: nomeDe(a.id, f),
      caminho: caminhoDe(a.id) ?? caminhoDe(pericia(a.id)?.requisitos?.[0]),
      nivel,
      objetos,
      objeto,
      dados: nivel + objeto > 0 ? `${nivel + objeto}D6` : '1D6−2',
      faixa: faixa(a.dificuldade),
      insistir: insistencia(f, a.id),
    };
  });
}

export function enfrentar(estado) {
  if (estado.fase !== 'preparo') throw new Error('Fora da preparação.');
  if (estado.desafio.tipo === 'teste') {
    estado.fase = 'teste';
  } else {
    iniciarConflito(estado);
  }
}

/** Resolve o teste com a abordagem escolhida, pelo `testar` do motor. */
export function resolverTeste(estado, { abordagem, insistir = false }) {
  if (estado.fase !== 'teste') throw new Error('Não há teste em andamento.');
  const a = abordagens(estado).find((x) => x.id === abordagem);
  if (!a) throw new Error(`Abordagem ${abordagem} não serve para este desafio.`);
  const modo = insistir ? a.insistir : null;
  const r = testar({
    nivel: a.nivel,
    dificuldade: a.dificuldade,
    objeto: a.objeto,
    insistir: !!modo,
    // O motor só deixa insistir com caminho "corpo"; Determinação usa a mesma conta.
    caminho: modo ? 'corpo' : a.caminho,
    rng: estado.rng,
  });
  estado.ajuda = 0;
  const perdas = { vida: 0, sanidade: 0 };
  if (r.insistiu) perdas[modo.paga] += r.custoVida;
  if (!r.sucesso) {
    perdas.vida += estado.desafio.falha.vida ?? 0;
    perdas.sanidade += estado.desafio.falha.sanidade ?? 0;
  }
  estado.vida -= perdas.vida;
  estado.sanidade -= perdas.sanidade;
  const renome = r.sucesso ? JOGO.renome.teste : 0;
  estado.renome += renome;
  estado.resultado = { tipo: 'teste', abordagem: a, teste: r, perdas, renome, paga: modo?.paga ?? null };
  estado.historico.push({ cena: estado.cena, desafio: estado.desafio.nome, sucesso: r.sucesso, via: a.nome, caminho: a.caminho });
  concluirCena(estado);
  return estado.resultado;
}

/* ------------------------------------------------------------------------ */
/* Conflitos                                                                */
/* ------------------------------------------------------------------------ */

const doisMaiores = (lista) => soma([...lista].sort((a, b) => b - a).slice(0, 2));
const modEquip = (ficha, tipo) => Math.max(0, ...ficha.equipamentos.filter((e) => e.tipo === tipo).map((e) => e.modificador));

/**
 * As três frentes de um conflito. O físico é o Ataque do manual; palavra e
 * fé são o mesmo cálculo (dois Aprimoramentos + 1D6) com os Aprimoramentos
 * de Presença e de Fé. É proposta do protótipo, não regra (ver NOTAS.md).
 */
export function frentes(ficha) {
  const n = (id) => nivelDe(ficha, id);
  const v = valores(ficha);
  const longa = v.ataqueLonga.valor > v.ataqueCurta.valor;
  return {
    fisico: {
      nome: 'Lutar', caminho: 'corpo', dica: longa ? 'ataque-a-longa-distancia' : 'ataque-a-curta-distancia',
      ataque: Math.max(v.ataqueCurta.valor, v.ataqueLonga.valor),
      arma: modEquip(ficha, 'arma'),
      formula: longa ? 'Arremesso + Precisão' : 'Ataque Corporal + Agilidade',
    },
    palavra: {
      nome: 'Convencer', caminho: 'espirito', dica: 'empatia-carisma',
      ataque: doisMaiores([n('empatia'), n('intimidacao'), n('lideranca')]) + n('interrogacao'),
      arma: 0,
      formula: 'Os dois maiores entre Empatia, Intimidação e Liderança + Interrogação',
    },
    fe: {
      nome: 'Encarar com fé', caminho: 'espirito', dica: 'fe',
      ataque: n('conviccao') + n('devocao'),
      arma: 0,
      formula: 'Convicção + Devoção',
    },
  };
}

/** Defesa do personagem contra cada tipo de ataque do oponente. */
export function defesas(ficha) {
  const n = (id) => nivelDe(ficha, id);
  return {
    // Defesa do manual; a Resistência entra de novo no dano, como no motor.
    fisico: { defesa: valores(ficha).defesa.valor, armadura: modEquip(ficha, 'armadura'), escudo: modEquip(ficha, 'escudo'), resistencia: n('resistencia'), recurso: 'vida' },
    // Como a Defesa contra Mágicas de Ataque Mental: Vontade + Fé (+ Autocontrole); Serenidade reduz a perda.
    mente: { defesa: n('vontade') + n('fe') + n('autocontrole'), armadura: n('serenidade'), escudo: 0, resistencia: 0, recurso: 'sanidade' },
  };
}

function fichaOponente(op) {
  const f = novaFicha();
  f.nome = op.nome;
  Object.assign(f.aprimoramentos, { reflexo: op.iniciativa.reflexo, agilidade: op.iniciativa.agilidade });
  f.atributos.destreza = op.iniciativa.destreza;
  return f;
}

export function iniciarConflito(estado) {
  const op = estado.desafio.oponente;
  // Atenção (proposto) entra como a "Perícia correspondente" da Iniciativa.
  const ini = iniciativa(estado.ficha, fichaOponente(op), { pericia: 'atencao', rng: estado.rng });
  estado.fase = 'conflito';
  estado.conflito = {
    oponente: { ...op, defesa: { ...op.defesa } },
    impeto: op.impeto,
    rodada: 0,
    iniciativa: ini,
    analisado: false,
    pontoFraco: null,
    usouFisico: false,
    log: [{ tipo: 'iniciativa', texto: ini.vencedor === 'a' ? `Você age primeiro (${ini.criterio}).` : `${op.nome} age primeiro (${ini.criterio}).` }],
  };
  if (ini.vencedor === 'b') ataqueOponente(estado);
  return estado.conflito;
}

function frenteOponente(estado) {
  const c = estado.conflito;
  const f = c.oponente.ataque.frente;
  if (f !== 'alterna') return f;
  return c.rodada % 2 === 0 ? 'fisico' : 'mente';
}

function ataqueOponente(estado, { defendendo = false } = {}) {
  const c = estado.conflito;
  const op = c.oponente;
  const frente = frenteOponente(estado);
  const d = defesas(estado.ficha)[frente];
  const r = resolverAtaque({
    ataque: op.ataque.valor,
    defesa: d.defesa,
    outrosDefesa: defendendo ? JOGO.bonusDefender : 0,
    arma: op.ataque.arma,
    armadura: d.armadura,
    escudo: d.escudo,
    resistencia: d.resistencia,
    rng: estado.rng,
  });
  estado[d.recurso] -= r.dano;
  c.log.push({ tipo: 'oponente', frente, recurso: d.recurso, ataque: r,
    texto: r.acertou
      ? `${op.nome} ${frente === 'fisico' ? 'acerta você' : 'abala você'}: −${r.dano} ${d.recurso === 'vida' ? 'Vida' : 'Sanidade'}.`
      : `${op.nome} ${frente === 'fisico' ? 'ataca' : 'pressiona'}, mas você resiste.` });
  c.rodada += 1;
}

/** O que o jogador vê do oponente: palavras, ou números depois de Analisar. */
export function leituraOponente(estado) {
  const c = estado.conflito;
  const estadoTexto = descrever('vida', c.impeto, c.oponente.impeto);
  if (!c.analisado) return { estado: estadoTexto, numeros: null };
  return { estado: estadoTexto, numeros: { impeto: c.impeto, maximo: c.oponente.impeto, defesa: c.oponente.defesa, armadura: c.oponente.armadura, pontoFraco: c.pontoFraco } };
}

/**
 * Uma ação do jogador no conflito, seguida da resposta do oponente.
 * `acao`: 'fisico' | 'palavra' | 'fe' | 'analisar' | 'defender' | 'fugir'.
 */
export function agir(estado, acao) {
  if (estado.fase !== 'conflito') throw new Error('Não há conflito em andamento.');
  const c = estado.conflito;
  const op = c.oponente;
  const f = estado.ficha;
  let fim = null;

  if (acao === 'analisar') {
    const nivel = Math.max(nivelDe(f, 'percepcao'), nivelDe(f, 'investigacao'));
    const r = testar({ nivel, dificuldade: JOGO.dificuldadeAnalisar, objeto: objetosPara(estado, 'percepcao').length ? 2 : 0, rng: estado.rng });
    if (r.sucesso && !c.analisado) {
      c.analisado = true;
      const [fraca] = Object.entries(op.defesa).sort((a, b) => a[1] - b[1])[0];
      c.pontoFraco = fraca;
      op.defesa[fraca] = Math.max(0, op.defesa[fraca] - JOGO.pontoFraco);
    }
    c.log.push({ tipo: 'analisar', teste: r, texto: r.sucesso
      ? `Você lê ${op.nome}: o ponto fraco é ${frentes(f)[c.pontoFraco].nome.toLowerCase()} (−${JOGO.pontoFraco} na defesa).`
      : 'Você observa, mas não entende o que tem à frente.' });
  } else if (acao === 'defender') {
    c.log.push({ tipo: 'defender', texto: `Você se guarda (+${JOGO.bonusDefender} na Defesa nesta rodada).` });
  } else if (acao === 'fugir') {
    const nivel = Math.max(nivelDe(f, 'destreza'), nivelDe(f, 'furtividade'));
    const r = testar({ nivel, dificuldade: JOGO.dificuldadeFugir, rng: estado.rng });
    c.log.push({ tipo: 'fugir', teste: r, texto: r.sucesso ? 'Você escapa.' : 'Não há por onde fugir.' });
    if (r.sucesso) fim = 'fuga';
  } else {
    const fr = frentes(f)[acao];
    if (!fr) throw new Error(`Ação desconhecida: ${acao}`);
    if (acao === 'fisico') c.usouFisico = true;
    const r = resolverAtaque({ ataque: fr.ataque, defesa: op.defesa[acao], arma: fr.arma, armadura: acao === 'fisico' ? op.armadura : 0, rng: estado.rng });
    c.impeto -= r.dano;
    c.log.push({ tipo: 'jogador', frente: acao, ataque: r, texto: r.acertou ? `${fr.nome}: ${op.nome} perde ímpeto (−${r.dano}).` : `${fr.nome}: não surte efeito.` });
    if (c.impeto <= 0) fim = 'vitoria';
  }

  if (!fim) {
    ataqueOponente(estado, { defendendo: acao === 'defender' });
    if (estado.vida <= 0 || estado.sanidade <= 0) fim = 'derrota';
    else if (c.rodada >= limiteRodadas(estado)) fim = 'impasse';
  }
  if (fim) terminarConflito(estado, fim);
  return c.log.at(-1);
}

/** Rodadas que o conflito dura antes do impasse. */
export function limiteRodadas(estado) {
  return estado.desafio.final ? JOGO.rodadasFinal : JOGO.rodadasMaximas;
}

function terminarConflito(estado, fim) {
  const c = estado.conflito;
  let renome = 0;
  if (fim === 'vitoria') renome = JOGO.renome.conflito + (c.usouFisico ? 0 : JOGO.renome.semViolencia);
  estado.renome += renome;
  estado.resultado = { tipo: 'conflito', fim, renome, semViolencia: fim === 'vitoria' && !c.usouFisico };
  estado.historico.push({ cena: estado.cena, desafio: estado.desafio.nome, sucesso: fim === 'vitoria', via: { fuga: 'fugiu', impasse: 'impasse', derrota: 'caiu' }[fim] ?? (c.usouFisico ? 'Lutar' : 'sem violência'), caminho: estado.desafio.caminho });
  concluirCena(estado);
}

/* ------------------------------------------------------------------------ */
/* Fim da cena e da partida                                                 */
/* ------------------------------------------------------------------------ */

function concluirCena(estado) {
  estado.fase = 'resultado';
  if (estado.vida <= 0) estado.fim = { tipo: 'derrota', motivo: 'Caído: a Vida chegou a zero.' };
  else if (estado.sanidade <= 0) estado.fim = { tipo: 'derrota', motivo: 'Fora de si: a Sanidade chegou a zero.' };
  else if (estado.desafio.final) {
    estado.fim = estado.resultado.fim === 'vitoria'
      ? { tipo: 'vitoria', motivo: 'O Guardião abre passagem.' }
      : { tipo: 'parcial', motivo: estado.resultado.fim === 'fuga' ? 'Você fugiu do vau. A travessia fica para outro dia.' : 'O Guardião não cede, nem você. O vau fica para outro dia.' };
  }
}

export function continuar(estado) {
  if (estado.fase !== 'resultado') throw new Error('A cena ainda não terminou.');
  if (estado.fim) { estado.fase = 'fim'; return; }
  proximaCena(estado);
}

/** Resumo final: Renome, equilíbrio entre Caminhos e nível do personagem. */
export function balanco(estado) {
  const gastos = pontosGastos(estado.ficha).total;
  const nivel = NIVEIS_INICIAIS.find((n) => gastos >= n.min && (n.max === null || gastos <= n.max));
  const vc = valoresCaminhos(estado.ficha);
  const porCaminho = Object.fromEntries(CAMINHOS.map((c) => [c.id, estado.historico.filter((h) => h.caminho === c.id && h.sucesso).length]));
  return { renome: estado.renome, gastos, nivel: nivel?.nome, caminhos: vc, porCaminho, fim: estado.fim };
}

/** Ficha no formato da ficha digital, para abrir em `ficha/#ficha=...`. */
export function fichaParaExportar(estado) {
  const f = structuredClone(estado.ficha);
  f.pontosDeEvolucao = pontosGastos(f).total;
  f.equipamentos = [
    ...f.equipamentos.map(({ nome, tipo, modificador }) => ({ nome, tipo, modificador })),
    ...estado.objetos.map((o) => ({ nome: OBJETOS[o].nome, tipo: 'outro', modificador: 0 })),
  ];
  const max = maximos(estado);
  f.atual = { vida: Math.max(0, estado.vida) < max.vida ? Math.max(0, estado.vida) : null, magia: null, sanidade: Math.max(0, estado.sanidade) < max.sanidade ? Math.max(0, estado.sanidade) : null };
  f.notas = `Personagem da Travessia (jogo de cartas). Renome ${estado.renome}.`;
  return f;
}
