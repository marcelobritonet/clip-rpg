/**
 * Desvario — dungeon crawler do Sistema Clip em que a Sanidade distorce a
 * percepção.
 *
 * Lógica pura (sem DOM): roda no navegador e no Node. Toda regra de RPG vem do
 * motor (`motor/clip.js`): testes, ataques, valores, descrições sem número,
 * magia e o limite das Perícias. O que é só deste jogo fica em `PARAM` e está
 * explicado em `crawler/NOTAS.md`.
 *
 * Há duas camadas:
 * - a **verdade** (`estado.mapa`, `estado.entidades`, `estado.objetos`), que
 *   decide o que acontece;
 * - a **percepção** (`percebido(estado)`), que é o que a tela mostra e o que
 *   o robô do simulador enxerga. Quanto menor a Sanidade, mais ela mente.
 *
 * Tudo que é sorteado vem de fluxos com semente (`rng.js`): a mesma semente,
 * com as mesmas ações, gera a mesma partida.
 */
import * as clip from '../motor/clip.js';
import { dica } from '../motor/glossario.js';
import { fluxo, prox, inteiro, chance, escolher, embaralhar, ponderado, comoFuncao, ruido } from './rng.js';
import { T, gerarAndar, tile, por, visao, linhaLivre, distancia, pontosDaSala, primeiroPasso, VIZINHOS, dentro } from './mapa.js';
import { TEMAS } from './temas.js';

/* ------------------------------------------------------------------------ */
/* Parâmetros do jogo (não são regras do Clip; ver NOTAS.md)                */
/* ------------------------------------------------------------------------ */

export const PARAM = {
  andares: 5,
  /** Fôlego de aventureiro: soma à Vida do motor (Vida 5 morre com um golpe). */
  bonusVida: 8,
  /**
   * Sanidade do jogo a partir da do motor: comprime a distância (Espírito
   * começa com 18 e Corpo com 4 no manual) e dá fôlego a todos.
   */
  sanidade: (motor) => Math.round(motor * 0.75) + 9,
  /** Raio de visão por nível de lucidez (0 Lúcido … 5 Fora de si). */
  raioVisao: [7, 7, 6, 6, 5, 5],
  /** Turnos por −1 de Sanidade, por andar: o silêncio pesa mais lá no fundo. */
  drenagem: [40, 36, 32, 28, 24],
  /** Companhia ao lado faz o tempo pesar menos (multiplica o intervalo). */
  drenagemCompanhia: 1.6,
  /** Sanidade máxima em que o intervalo da drenagem é o da tabela. */
  sanidadeReferencia: 16,
  regenVida: 10,
  regenPM: 6,
  /** Mapa por andar. */
  mapa: (a) => ({ w: 34 + 2 * a, h: 22 + a, salas: 7 + a }),
  monstrosPorAndar: (a) => Math.min(5, 2 + a),
  itensPorAndar: (a) => 4 + (a >= 3 ? 1 : 0),
  /** Monstros sobem +1 em ataque e defesa nos andares 4 e 5 e +1 de Vida por andar. */
  escala: (a) => ({ combate: Math.floor((a - 1) / 3), vida: a - 1 }),
  /** Assombros "meio reais": soma à Defesa contra golpes físicos (0 = desligado; ver NOTAS). */
  defesaAssombro: 0,
  /** Teto de Sanidade perdida por sussurro de assombro (o dano pela diferença dos dados é letal com Sanidade baixa). */
  danoMentalMaximo: 2,
  aliado: { vida: 6, ataque: 1, defesa: 1, arma: 1 },
  inventario: 5,
  /** Vida recuperada ao trocar de andar. */
  folegoNaEscada: 5,
  itens: { cura: 6, calma: 4, ancora: 2, altar: 5 },
  /** Perdas de Sanidade por evento. */
  perda: { golpeNoVazio: 1, miragem: 1, emboscada: 1, matarHumano: 1, ferirAliado: 2, matarAliado: 4, encararFalhou: 1, verAssombro: 1 },
  /** Surto: turnos fora de controle; depois volta com metade da Sanidade e uma cicatriz. */
  surto: { turnos: 5, sanidadeDepois: 0.5, calmaDepois: 15, cicatriz: 3, maximo: 3 },
  ancora: { turnos: 12, dificuldade: 3, ganho: 2 },
  /** Dificuldade de Olhar de novo: base + nível de lucidez. */
  olhar: { base: 2, insistirMaximo: 2 },
  convencer: 3,
  encarar: 4,
  conversarAliado: 3,
  magia: { custo: 2, alcance: 6 },
  /** Chance por turno de notar sozinho que algo está errado, por nível de Sentidos + Discernimento. */
  notar: 0.05,
  /** Nível mínimo de alucinação por andar (só vale se você não estiver Lúcido). */
  pressaoDoAndar: [0, 0, 1, 2, 3],
  epocaParedes: 14,
  epocaMemoria: 20,
  /** Intensidade das alucinações por nível de lucidez. */
  alu: {
    fantasma: [0, 0.004, 0.015, 0.03, 0.05, 0.07],
    disfarce: [0, 0.08, 0.22, 0.42, 0.62, 0.8],
    miragem: [0, 0.004, 0.014, 0.028, 0.045, 0.06],
    paredes: [0, 0, 1, 3, 5, 7],
    memoria: [0, 0, 0.04, 0.1, 0.2, 0.3],
    esquecer: [0, 0, 0, 0, 0.12, 0.25],
    sussurro: [0, 0.006, 0.02, 0.04, 0.06, 0.08],
    golpeFalso: [0, 0, 0, 0.01, 0.025, 0.04],
    mentiraPalavras: [0, 0, 0, 0.5, 0.8, 1],
  },
};

/* ------------------------------------------------------------------------ */
/* Origens: três personagens de 10 Pontos de Evolução (Especialista Iniciante) */
/* ------------------------------------------------------------------------ */

export const ORIGENS = {
  corpo: {
    caminho: 'corpo',
    atributos: { forca: 2, destreza: 1, fisico: 2, percepcao: 1, vontade: 1 },
    aprimoramentos: { ataqueCorporal: 2, resistencia: 1 },
    pericias: [],
    arma: true,
    resumo: 'Luta bem e aguenta pancada. Enxerga mal o que é falso: para olhar de novo, insiste com o corpo.',
  },
  mente: {
    caminho: 'mente',
    atributos: { inteligencia: 2, percepcao: 2, sabedoria: 1 },
    aprimoramentos: { sentidos: 1, discernimento: 1, raciocinio: 1 },
    pericias: [{ id: 'magiaAtaqueFisico', nivel: 2 }],
    arma: false,
    resumo: 'Olha de novo e quase sempre acerta. Lança fogo à distância com Pontos de Magia. Morre fácil de perto.',
  },
  espirito: {
    caminho: 'espirito',
    atributos: { vontade: 2, presenca: 2, fe: 2, destreza: 1 },
    aprimoramentos: { empatia: 1, autocontrole: 1, conviccao: 1 },
    pericias: [],
    arma: false,
    resumo: 'Demora a enlouquecer. Convence gente, espanta bestas e assombros com fé e se ancora quando o mundo mente.',
  },
};

export const PISTAS = {
  sombra: 'O que é real projeta sombra no chão. O que não é, respira.',
  vazio: 'Golpear o vazio cansa a cabeça. Antes de bater, olhe de novo.',
  marca: 'Vultos acertam você, mas não deixam marca no corpo. Repare se o corpo piorou mesmo.',
  aproxima: 'Quem é aliado espera você. Quem vem andando até você, sorrindo, quer outra coisa.',
  grito: 'Monstros não gritam seu nome. Falar antes de bater é mais barato.',
  parede: 'Com a cabeça ruim, as paredes também mentem. A memória mente mais ainda.',
  palavras: 'As palavras mentem antes da imagem. Quando a cor some, você está pior do que diz.',
  ancora: 'Ancorar-se apaga o que é falso à vista e segura o mundo por um tempo.',
};

const soma = (l) => l.reduce((a, b) => a + b, 0);
const NOMES_LUCIDEZ = ['Lúcido', 'Inquieto', 'Abalado', 'Perturbado', 'Por um fio', 'Fora de si'];
const NOMES_VIDA = ['Intacto', 'Arranhado', 'Ferido', 'Muito ferido', 'À beira do colapso', 'Caído'];

/** Nível de lucidez (0 a 5), com as mesmas faixas de `descrever` do motor. */
export function nivelLucidez(san, max) {
  const i = NOMES_LUCIDEZ.indexOf(clip.descrever('sanidade', san, max));
  return i < 0 ? 0 : i;
}

/* ------------------------------------------------------------------------ */
/* Personagem                                                               */
/* ------------------------------------------------------------------------ */

export function fichaDaOrigem(origem, tema) {
  const o = ORIGENS[origem];
  const f = clip.novaFicha();
  f.nome = TEMAS[tema].origens[origem].nome;
  f.caminhoPrincipal = o.caminho;
  Object.assign(f.atributos, o.atributos);
  Object.assign(f.aprimoramentos, o.aprimoramentos);
  f.pericias = o.pericias.map((p) => {
    const base = clip.PERICIAS_EXEMPLO.find((x) => x.id === p.id);
    return { id: base.id, nome: base.nome, requisitos: [...base.requisitos], nivel: p.nivel, aplica: null, magica: !!base.magica };
  });
  if (o.arma) {
    const a = TEMAS[tema].itens.arma[0];
    f.equipamentos.push({ nome: a.nome, tipo: 'arma', modificador: a.mod });
  }
  f.pontosDeEvolucao = clip.pontosGastos(f).total;
  return f;
}

const n = (e, id) => clip.nivelDe(e.ficha, id);
const equip = (e, tipo) => Math.max(0, ...e.ficha.equipamentos.filter((q) => q.tipo === tipo).map((q) => q.modificador));

/** Valores do jogo: os do motor mais os parâmetros deste protótipo. */
export function derivados(e) {
  const v = clip.valores(e.ficha);
  return {
    ataque: v.ataqueCurta.valor,
    defesa: v.defesa.valor,
    defesaMental: n(e, 'vontade') + n(e, 'fe') + n(e, 'autocontrole'),
    vidaMax: v.vida.valor + PARAM.bonusVida,
    sanMax: Math.max(1, PARAM.sanidade(v.sanidade.valor) - e.cicatrizes),
    pmMax: v.magia.valor,
    arma: equip(e, 'arma'),
    armadura: equip(e, 'armadura'),
    cargasAncora: 1 + Math.floor((n(e, 'vontade') + n(e, 'fe')) / 2),
    limite: clip.limiteEquipamento(e.ficha),
  };
}

/* ------------------------------------------------------------------------ */
/* Nova partida e andares                                                   */
/* ------------------------------------------------------------------------ */

export function novaPartida({ semente, tema = 'sanatorio', origem = 'corpo', depurar = false } = {}) {
  const ficha = fichaDaOrigem(origem, tema);
  const e = {
    semente: String(semente),
    tema,
    origem,
    depurar,
    ficha,
    cicatrizes: 0,
    rDados: fluxo(semente, tema, 'dados'),
    rAlu: fluxo(semente, tema, 'alucinacao'),
    rIA: fluxo(semente, tema, 'ia'),
    andar: 0,
    turno: 0,
    proximoId: 1,
    log: [],
    eventos: [],
    efeitos: [],
    inventario: [],
    pistas: [],
    diario: [],
    fim: null,
    escolha: null,
    surto: 0,
    surtos: 0,
    ancorado: 0,
    stats: {
      turnos: 0, golpesNoVazio: 0, aliadosFeridos: 0, aliadosMortos: 0, emboscadas: 0, miragensPisadas: 0,
      paredesFalsas: 0, fantasmasRevelados: 0, disfarcesRevelados: 0, miragensReveladas: 0, fantasmasGolpes: 0,
      surtos: 0, vencidos: 0, pacificados: 0, espantados: 0, olhares: 0, olharesCertos: 0,
      turnosPorLucidez: [0, 0, 0, 0, 0, 0], perdas: {}, ganhos: {}, fantasmasCriados: 0, disfarcesCriados: 0, miragensCriadas: 0,
    },
  };
  const d = derivados(e);
  e.vida = d.vidaMax;
  e.san = d.sanMax;
  e.pm = d.pmMax;
  msg(e, TEMAS[tema].abertura, 'narra');
  entrarNoAndar(e, 1);
  return e;
}

/** Gera o andar só pela semente e pelo número: o mesmo andar para qualquer origem. */
export function gerarConteudoDoAndar(semente, tema, a) {
  const r = fluxo(semente, tema, 'andar', a);
  const th = TEMAS[tema];
  const mapa = gerarAndar(r, PARAM.mapa(a));
  const nomesSalas = embaralhar(r, th.salas);
  mapa.salas.forEach((s, i) => (s.nome = nomesSalas[i % nomesSalas.length]));
  const ocupado = new Set();
  const livre = (salas) => {
    for (let t = 0; t < 60; t++) {
      const s = escolher(r, salas);
      const p = escolher(r, pontosDaSala(s));
      const k = p.y * mapa.w + p.x;
      if (!ocupado.has(k)) { ocupado.add(k); return p; }
    }
    return null;
  };
  const entrada = mapa.salas[0];
  const inicio = { x: entrada.x + Math.floor(entrada.w / 2), y: entrada.y + Math.floor(entrada.h / 2) };
  ocupado.add(inicio.y * mapa.w + inicio.x);
  const ultima = mapa.salas[mapa.salas.length - 1];
  const fundo = mapa.salas.slice(1);
  const longe = mapa.salas.slice(Math.max(1, Math.floor(mapa.salas.length / 3)));

  const objetos = [];
  const pSaida = livre([ultima]);
  objetos.push({ tipo: a === PARAM.andares ? 'saida' : 'escada', ...pSaida, real: true });

  const esc = PARAM.escala(a);
  const pool = th.monstros.filter((m) => m.andar <= a && m.andar >= Math.min(a, 5) - 3);
  const entidades = [];
  const nMonstros = PARAM.monstrosPorAndar(a);
  for (let i = 0; i < nMonstros; i++) {
    const comuns = pool.filter((m) => m.andar < 5);
    const m = escolher(r, comuns);
    const p = livre(i < 2 ? longe : fundo);
    if (p) entidades.push(criarMonstro(m, p, esc));
  }
  if (a === PARAM.andares) {
    const chefe = th.monstros.find((m) => m.andar === 5);
    const p = livre([ultima]);
    if (chefe && p) entidades.push(criarMonstro(chefe, p, esc));
  }
  const aliados = embaralhar(r, th.aliados);
  const nAliados = a === 1 ? 1 : chance(r, 0.5) ? 2 : 1;
  for (let i = 0; i < nAliados; i++) {
    const al = aliados[(a + i) % aliados.length];
    const p = livre(fundo);
    if (p) entidades.push({ tipo: 'aliado', especie: al.id, categoria: 'aliado', x: p.x, y: p.y, ...PARAM.aliado, vidaMax: PARAM.aliado.vida, estado: 'parado' });
  }
  const nItens = PARAM.itensPorAndar(a);
  for (let i = 0; i < nItens; i++) {
    const tipo = ponderado(r, [['cura', 3], ['calma', 3.5], ['ancora', 1.2], ['arma', a <= 3 ? 1 : 0.5], ['armadura', 0.8]]);
    const p = livre(i === 0 ? [entrada, ...fundo] : fundo);
    if (p) objetos.push({ tipo: 'item', ...p, real: true, item: sortearItem(r, th, tipo, a) });
  }
  if (a >= 2 && chance(r, 0.75)) {
    const p = livre(fundo);
    if (p) objetos.push({ tipo: 'altar', ...p, real: true });
  }
  return { mapa, inicio, entidades, objetos };
}

function criarMonstro(m, p, esc) {
  return {
    tipo: 'monstro', especie: m.id, categoria: m.categoria, x: p.x, y: p.y,
    ataque: m.ataque + esc.combate, defesa: m.defesa + esc.combate, vida: m.vida + esc.vida, vidaMax: m.vida + esc.vida,
    arma: m.arma, armadura: 0, vontade: m.vontade, mental: m.mental ? m.mental + esc.combate : 0, rapido: !!m.rapido, estado: 'parado',
  };
}

function sortearItem(r, th, tipo, a) {
  if (tipo === 'arma') {
    const lista = th.itens.arma.filter((x) => x.mod <= (a >= 3 ? 2 : 1));
    const x = escolher(r, lista);
    return { tipo, nome: x.nome, mod: x.mod };
  }
  if (tipo === 'armadura') {
    const x = escolher(r, th.itens.armadura);
    return { tipo, nome: x.nome, mod: x.mod };
  }
  return { tipo, nome: escolher(r, th.itens[tipo]) };
}

function entrarNoAndar(e, a) {
  const c = gerarConteudoDoAndar(e.semente, e.tema, a);
  e.andar = a;
  e.mapa = c.mapa;
  e.visto = new Array(c.mapa.w * c.mapa.h).fill(0);
  e.jogador = { ...c.inicio };
  const companheiro = e.entidades?.find((x) => x.estado === 'seguindo' && x.vida > 0);
  e.entidades = c.entidades.map((x) => ({ ...x, id: 'e' + e.proximoId++ }));
  if (companheiro) {
    const p = vizinhoLivre(e, e.jogador) ?? e.jogador;
    e.entidades.push({ ...companheiro, x: p.x, y: p.y, aparencia: null, revelado: false, suspeito: false });
  }
  e.objetos = c.objetos.map((x) => ({ ...x, id: 'o' + e.proximoId++ }));
  e.ilusaoParedes = new Map();
  e.salaAtual = -1;
  e.cargasAncora = derivados(e).cargasAncora;
  atualizarVisao(e);
}

/* ------------------------------------------------------------------------ */
/* Utilidades de estado                                                     */
/* ------------------------------------------------------------------------ */

function msg(e, texto, tipo = 'info', extra = {}) {
  const m = { texto, tipo, turno: e.turno, ...extra };
  e.eventos.push(m);
  e.log.push(m);
  if (e.log.length > 200) e.log.splice(0, e.log.length - 200);
}

const efeito = (e, tipo) => e.efeitos.push({ tipo, turno: e.turno });

export const lucidez = (e) => nivelLucidez(e.san, derivados(e).sanMax);
const idx = (e, x, y) => y * e.mapa.w + x;
const rng = (e) => comoFuncao(e.rDados);
const temaDe = (e) => TEMAS[e.tema];

export function especie(e, ent) {
  const th = temaDe(e);
  return th.monstros.find((m) => m.id === ent.especie) ?? th.aliados.find((m) => m.id === ent.especie);
}

const vivos = (e) => e.entidades.filter((x) => x.vida > 0 || x.tipo === 'fantasma');
const reaisEm = (e, x, y) => e.entidades.find((o) => o.tipo !== 'fantasma' && o.vida > 0 && o.x === x && o.y === y);

function vizinhoLivre(e, p) {
  for (const [dx, dy] of VIZINHOS) {
    const x = p.x + dx, y = p.y + dy;
    if (tile(e.mapa, x, y) !== T.PAREDE && !reaisEm(e, x, y)) return { x, y };
  }
  return null;
}

function perderSan(e, quanto, { reduzivel = true, motivo = 'outro' } = {}) {
  const red = reduzivel ? n(e, 'serenidade') : 0;
  const q = Math.min(e.san, Math.max(0, quanto - red));
  e.stats.perdas[motivo] = (e.stats.perdas[motivo] ?? 0) + q;
  e.san = Math.max(0, e.san - q);
  return q;
}

function ganharSan(e, quanto, motivo = 'outro') {
  const antes = e.san;
  e.san = Math.min(derivados(e).sanMax, e.san + quanto);
  e.stats.ganhos[motivo] = (e.stats.ganhos[motivo] ?? 0) + e.san - antes;
}

function ganharPista(e, id) {
  if (e.pistas.includes(id)) return;
  e.pistas.push(id);
  msg(e, `Você reparou: ${PISTAS[id]}`, 'pista', { pista: id });
}

function anotar(e, texto) {
  e.diario.push({ andar: e.andar, turno: e.turno, texto });
}

/** Aparência atual de uma entidade (o que a pessoa acha que vê). */
function aparencia(e, ent) {
  if (ent.aparencia) return ent.aparencia;
  if (ent.tipo === 'aliado') return { especie: ent.especie, categoria: 'aliado' };
  return { especie: ent.especie, categoria: ent.categoria };
}

function nomeAparente(e, ent) {
  const ap = aparencia(e, ent);
  const th = temaDe(e);
  return (th.monstros.find((m) => m.id === ap.especie) ?? th.aliados.find((m) => m.id === ap.especie))?.nome ?? 'vulto';
}

const Maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------------------------------------------------ */
/* Visão                                                                    */
/* ------------------------------------------------------------------------ */

function atualizarVisao(e) {
  const raio = PARAM.raioVisao[lucidez(e)];
  e.vis = visao(e.mapa, e.jogador.x, e.jogador.y, raio);
  for (const k of e.vis) e.visto[k] = 1;
  const visiveis = new Set();
  for (const ent of e.entidades) {
    const ve = e.vis.has(idx(e, ent.x, ent.y));
    if (ve) visiveis.add(ent.id);
    if (!ve && ent.visivel) {
      // Saiu de vista: a próxima vez que aparecer, a cabeça decide de novo.
      ent.aparencia = null;
      ent.revelado = false;
      ent.suspeito = false;
    }
    ent.visivel = ve;
  }
  // Sala nova: nome no registro (com a cabeça ruim, o nome pode mentir).
  const s = e.mapa.salas.findIndex((q) => e.jogador.x >= q.x && e.jogador.x < q.x + q.w && e.jogador.y >= q.y && e.jogador.y < q.y + q.h);
  if (s >= 0 && s !== e.salaAtual) {
    e.salaAtual = s;
    const lv = lucidez(e);
    let nome = e.mapa.salas[s].nome;
    if (lv >= 3 && ruido(e.semente, s, e.andar, e.turno) < 0.4) {
      nome = escolher(e.rAlu, temaDe(e).salas);
      msg(e, `${nome}. De novo?`, 'sala', { mentira: true });
    } else msg(e, nome + '.', 'sala');
  }
}

/* ------------------------------------------------------------------------ */
/* Ações do jogador                                                         */
/* ------------------------------------------------------------------------ */

/**
 * Executa uma ação e, se ela gastou o turno, faz o mundo andar.
 * Ações: mover {dx, dy}, atacar {dx, dy}, esperar, olhar {alvo}, falar {alvo},
 * encarar {alvo}, magia {alvo}, ancorar, usar {indice}, escolher {indice}.
 */
export function agir(e, acao) {
  e.eventos = [];
  e.efeitos = [];
  if (e.fim) return e;
  if (e.escolha) {
    if (acao.tipo === 'escolher') aplicarEscolha(e, acao.indice);
    return e;
  }
  let a = acao;
  if (e.surto > 0) a = acaoDoSurto(e);
  // No surto, o tempo passa mesmo que o corpo bata na parede.
  const gastou = executar(e, a) || e.surto > 0;
  if (gastou && !e.fim && !e.escolha) mundo(e);
  return e;
}

function executar(e, a) {
  switch (a.tipo) {
    case 'mover': return mover(e, a.dx, a.dy, false);
    case 'atacar': return mover(e, a.dx, a.dy, true);
    case 'esperar': return true;
    case 'olhar': return olhar(e, a.alvo);
    case 'falar': return falarCom(e, a.alvo);
    case 'encarar': return encarar(e, a.alvo);
    case 'magia': return magia(e, a.alvo);
    case 'ancorar': return ancorar(e);
    case 'usar': return usar(e, a.indice);
    default: return false;
  }
}

/** Entidade que a pessoa vê numa casa (a real ou um vulto). */
function visivelEm(e, x, y) {
  if (!e.vis.has(idx(e, x, y))) return reaisEm(e, x, y) ?? null;
  return reaisEm(e, x, y) ?? e.entidades.find((o) => o.tipo === 'fantasma' && o.x === x && o.y === y) ?? null;
}

function alvoPorId(e, id) {
  return e.entidades.find((x) => x.id === id && (x.vida > 0 || x.tipo === 'fantasma') && e.vis.has(idx(e, x.x, x.y))) ??
    e.objetos.find((o) => o.id === id && e.vis.has(idx(e, o.x, o.y))) ?? null;
}

function mover(e, dx, dy, forcarAtaque) {
  if (!dx && !dy) return true;
  const x = e.jogador.x + dx, y = e.jogador.y + dy;
  if (!dentro(e.mapa, x, y)) return false;
  const ent = visivelEm(e, x, y);
  if (ent) {
    const ap = aparencia(e, ent);
    if (forcarAtaque || ap.categoria !== 'aliado') return golpear(e, ent);
    if (ent.estado === 'seguindo' && !ent.aparencia) {
      [ent.x, ent.y, e.jogador.x, e.jogador.y] = [e.jogador.x, e.jogador.y, ent.x, ent.y];
      return true;
    }
    return conversar(e, ent);
  }
  const k = idx(e, x, y);
  const real = tile(e.mapa, x, y);
  const ilusao = e.ilusaoParedes.get(k);
  if (real === T.PAREDE) {
    if (ilusao === T.CHAO) {
      e.ilusaoParedes.delete(k);
      e.stats.paredesFalsas++;
      msg(e, 'Você bate de frente numa parede sólida. Você jurava que havia uma passagem.', 'mentira');
      ganharPista(e, 'parede');
      return true;
    }
    return false;
  }
  if (real === T.PORTA) {
    // A porta abrindo já aparece na imagem; o registro fica para o que importa.
    por(e.mapa, x, y, T.ABERTA);
    return true;
  }
  e.jogador.x = x;
  e.jogador.y = y;
  if (ilusao === T.PAREDE) {
    e.ilusaoParedes.delete(k);
    e.stats.paredesFalsas++;
    msg(e, 'Você atravessa a parede. Ela nunca esteve ali.', 'mentira');
    ganharPista(e, 'parede');
  }
  pisar(e);
  return true;
}

function pisar(e) {
  const { x, y } = e.jogador;
  for (const o of e.objetos.filter((q) => q.x === x && q.y === y && !q.usado)) {
    if (!o.real) {
      o.usado = true;
      e.stats.miragensPisadas++;
      // Item falso só decepciona; escada ou saída falsa abala.
      const q = o.tipo === 'item' ? 0 : perderSan(e, PARAM.perda.miragem, { motivo: 'miragem' });
      const oque = { item: 'Você estende a mão e', escada: 'Você pisa no primeiro degrau e', saida: 'Você corre para a saída e', altar: 'Você se ajoelha e' }[o.tipo];
      msg(e, `${oque} não há nada ali.${q ? ' Sua cabeça lateja.' : ''}`, 'mentira');
      continue;
    }
    if (o.tipo === 'item') pegar(e, o);
    else if (o.tipo === 'escada') descer(e);
    else if (o.tipo === 'saida') {
      e.fim = { tipo: 'fuga', turno: e.turno, andar: e.andar };
      msg(e, temaDe(e).fuga, 'fim');
    } else if (o.tipo === 'altar') {
      o.usado = true;
      ganharSan(e, PARAM.itens.altar + n(e, 'esperanca'), 'altar');
      e.cargasAncora += 1;
      msg(e, temaDe(e).altarTexto, 'bom');
    }
  }
}

function pegar(e, o) {
  const it = o.item;
  if (it.tipo === 'arma' || it.tipo === 'armadura') {
    const d = derivados(e);
    const atual = it.tipo === 'arma' ? d.arma : d.armadura;
    if (it.mod <= atual) { o.usado = true; msg(e, `Você deixa ${artigo(it.nome)} para trás: o seu é melhor.`); return; }
    const outro = it.tipo === 'arma' ? d.armadura : d.arma;
    if (it.mod + outro > d.limite) {
      msg(e, `${Maiuscula(artigo(it.nome))} é pesado demais para você usar direito.`);
      o.usado = true;
      return;
    }
    e.ficha.equipamentos = e.ficha.equipamentos.filter((q) => q.tipo !== it.tipo);
    e.ficha.equipamentos.push({ nome: it.nome, tipo: it.tipo, modificador: it.mod });
    o.usado = true;
    msg(e, `Você pega ${artigo(it.nome)}.`, 'bom');
    return;
  }
  if (e.inventario.length >= PARAM.inventario) { msg(e, `Não cabe mais nada. ${Maiuscula(artigo(it.nome))} fica no chão.`); return; }
  e.inventario.push(it);
  o.usado = true;
  msg(e, `Você guarda ${artigo(it.nome)}.`, 'bom');
}

const FEMININOS = new Set(['fotografia', 'carta', 'pulseira', 'pomada', 'tala', 'medalha', 'oração', 'erva', 'raiz', 'barra', 'jaqueta', 'clava', 'espada', 'ossada', 'ratazana', 'tocha', 'escada', 'escadaria', 'passagem', 'capela', 'boca', 'barricada', 'mancha', 'coisa']);

/** "o enfermeiro", "a fotografia", "as ataduras"; nomes próprios ficam sem artigo. */
export function artigo(nome) {
  const p = nome.split(' ')[0];
  if (/^[A-ZÀ-Ú]/.test(nome) || /^(irmão|doutora)/.test(nome)) return nome;
  if (p === 'ataduras') return 'as ' + nome;
  return (FEMININOS.has(p) ? 'a ' : 'o ') + nome;
}

/** Contração com "em": "no enfermeiro", "na ossada", "em Dona Ilda". */
function emArtigo(nome) {
  const a = artigo(nome);
  if (a.startsWith('o ')) return 'n' + a;
  if (a.startsWith('a ')) return 'n' + a;
  if (a.startsWith('as ')) return 'n' + a;
  return 'em ' + a;
}

function descer(e) {
  if (e.andar >= PARAM.andares) return;
  e.vida = Math.min(derivados(e).vidaMax, e.vida + PARAM.folegoNaEscada);
  msg(e, temaDe(e).descida, 'narra');
  anotar(e, `Novo andar: ${temaDe(e).andares[e.andar]}.`);
  entrarNoAndar(e, e.andar + 1);
  e.escolha = { opcoes: opcoesEvolucao(e) };
  if (!e.escolha.opcoes.length) e.escolha = null;
}

/* Combate ---------------------------------------------------------------- */

function golpear(e, ent) {
  const nome = nomeAparente(e, ent);
  if (ent.tipo === 'fantasma') {
    e.stats.golpesNoVazio++;
    perderSan(e, PARAM.perda.golpeNoVazio, { motivo: 'vazio' });
    msg(e, `Seu golpe atravessa ${artigoDe(nome)}. Não havia nada ali.`, 'mentira');
    if (ent.acertou) ganharPista(e, 'marca');
    removerFantasma(e, ent);
    ganharPista(e, 'vazio');
    return true;
  }
  const d = derivados(e);
  const extraDef = ent.categoria === 'assombro' ? PARAM.defesaAssombro : 0;
  const r = clip.resolverAtaque({
    ataque: d.ataque, defesa: Math.max(0, ent.defesa + extraDef - (ent.pontoFraco ?? 0)), arma: d.arma, armadura: ent.armadura ?? 0, rng: rng(e),
  });
  if (!r.acertou) {
    msg(e, r.critico.ataque === 'falha' ? 'Você tropeça no próprio golpe.' : `Você erra ${artigoDe(nome)}.`);
    return true;
  }
  const dano = r.critico.ataque === 'sucesso' ? r.dano * 2 : r.dano;
  ferir(e, ent, dano, nome, r.critico.ataque === 'sucesso' ? 'Golpe certeiro! ' : '');
  return true;
}

const artigoDe = artigo;

function ferir(e, ent, dano, nome, prefixo = '') {
  ent.vida -= dano;
  const forte = dano >= 4;
  if (ent.tipo === 'aliado') {
    const esp = especie(e, ent);
    const disfarcado = !!ent.aparencia;
    msg(e, `${prefixo}Você acerta ${artigoDe(nome)}${forte ? ' em cheio' : ''}.`, 'golpe');
    msg(e, `${Maiuscula(disfarcado ? artigoDe(nome) : esp.nome)} grita: “${esp.grito}”`, 'perigo');
    ent.aparencia = null;
    ent.revelado = true;
    e.stats.aliadosFeridos++;
    ganharPista(e, 'grito');
    if (ent.vida <= 0) {
      e.stats.aliadosMortos++;
      perderSan(e, PARAM.perda.matarAliado, { reduzivel: false, motivo: 'aliado' });
      msg(e, `Era ${esp.nome}. Não levanta mais.`, 'perigo');
      anotar(e, `Matou ${esp.nome}, achando que era um monstro.`);
      e.culpa = true;
    } else {
      perderSan(e, PARAM.perda.ferirAliado, { motivo: 'aliado' });
      ent.estado = 'fugindo';
      ent.ferido = true;
      ent.fugaTtl = 30;
      msg(e, `Era ${esp.nome}. Foge de você, sangrando.`, 'perigo');
      anotar(e, `Feriu ${esp.nome}, achando que era um monstro.`);
    }
    return;
  }
  if (ent.vida <= 0) {
    msg(e, `${prefixo}Você derruba ${artigoDe(nome)}.`, 'golpe');
    e.stats.vencidos++;
    if (ent.aparencia && ent.aparencia.categoria === 'aliado') {
      // matou algo que parecia aliado: era monstro, mas a cabeça pesa
      perderSan(e, 1, { motivo: 'matar' });
    }
    if (ent.categoria === 'humano' && clip.caminhoDominante(e.ficha).id !== 'corpo') {
      // Quem vive do Corpo já se acostumou à violência; para os outros, pesa.
      perderSan(e, PARAM.perda.matarHumano, { motivo: 'matar' });
      msg(e, 'Era gente. Isso pesa.', 'info');
    }
  } else {
    msg(e, `${prefixo}Você acerta ${artigoDe(nome)}${forte ? ' em cheio' : ''}.`, 'golpe');
    ent.estado = 'cacando';
  }
}

function removerFantasma(e, f) {
  e.entidades = e.entidades.filter((x) => x !== f);
}

/* Olhar de novo (Percepção ou Sabedoria) --------------------------------- */

function olhar(e, alvoId) {
  const alvo = alvoPorId(e, alvoId);
  if (!alvo) { msg(e, 'Não há o que olhar ali.'); return false; }
  const lv = lucidez(e);
  const nivel = Math.max(n(e, 'percepcao'), n(e, 'sabedoria'));
  const objeto = Math.max(n(e, 'sentidos'), n(e, 'discernimento'));
  const dificuldade = PARAM.olhar.base + lv;
  const corpo = clip.caminhoDominante(e.ficha).id === 'corpo';
  let t = clip.testar({ nivel, objeto, dificuldade, insistir: corpo, caminho: corpo ? 'corpo' : null, rng: rng(e) });
  e.stats.olhares++;
  if (t.insistiu) {
    // Insistir (só o Corpo): o que falta sai da Vida. Acima do teto, desiste.
    if (t.custoVida > PARAM.olhar.insistirMaximo || e.vida - t.custoVida < 3) t = { ...t, sucesso: false };
    else {
      e.vida -= t.custoVida;
      msg(e, 'Você esfrega os olhos até doer.', 'dano');
    }
  }
  const nome = alvo.tipo && alvo.especie ? nomeAparente(e, alvo) : nomeObjeto(e, alvo);
  if (!t.sucesso) {
    msg(e, `Você olha de novo para ${artigoDe(nome)}. Não consegue ter certeza.`);
    return true;
  }
  e.stats.olharesCertos++;
  revelar(e, alvo, 'olhar');
  return true;
}

function nomeObjeto(e, o) {
  const th = temaDe(e);
  if (o.tipo === 'item') return o.item.nome;
  if (o.tipo === 'escada') return th.passagem;
  if (o.tipo === 'saida') return th.saida;
  if (o.tipo === 'altar') return th.altar;
  return 'coisa';
}

/** Mostra a verdade de uma entidade ou objeto. */
function revelar(e, alvo, como) {
  const quieto = como === 'ancora';
  if (alvo.tipo === 'fantasma') {
    e.stats.fantasmasRevelados++;
    if (!quieto) msg(e, `${Maiuscula(artigoDe(nomeAparente(e, alvo)))} se desfaz como fumaça. Não havia nada ali.`, 'bom');
    if (alvo.acertou) ganharPista(e, 'marca');
    removerFantasma(e, alvo);
    if (e.stats.fantasmasRevelados + e.stats.miragensReveladas >= 3) ganharPista(e, 'sombra');
    return;
  }
  if (alvo.real === false) {
    alvo.usado = true;
    e.stats.miragensReveladas++;
    if (!quieto) msg(e, `${Maiuscula(nomeObjeto(e, alvo))}? Não: só uma mancha na parede.`, 'bom');
    if (e.stats.fantasmasRevelados + e.stats.miragensReveladas >= 3) ganharPista(e, 'sombra');
    return;
  }
  if (alvo.real === true) { if (!quieto) msg(e, `${Maiuscula(nomeObjeto(e, alvo))}: é real.`); alvo.confirmado = true; return; }
  // entidade real
  if (alvo.aparencia) {
    const antes = nomeAparente(e, alvo);
    alvo.aparencia = null;
    e.stats.disfarcesRevelados++;
    if (!quieto) msg(e, `Não é ${artigoDe(antes)}. É ${artigoDe(especie(e, alvo).nome)}.`, alvo.tipo === 'aliado' ? 'bom' : 'perigo');
  } else if (!quieto) {
    msg(e, `${Maiuscula(artigoDe(especie(e, alvo).nome))} é real.`);
  }
  if (como === 'olhar' && alvo.tipo === 'monstro' && !alvo.pontoFraco) {
    // Olhar com calma também mostra onde bater.
    alvo.pontoFraco = 1;
    msg(e, 'Você nota onde a guarda dele abre.', 'bom');
  }
  alvo.revelado = true;
  alvo.suspeito = false;
}

/* Conversar e convencer (Presença) --------------------------------------- */

function falarCom(e, alvoId) {
  const alvo = alvoPorId(e, alvoId);
  if (!alvo || !alvo.especie) { msg(e, 'Não há com quem falar.'); return false; }
  if (distancia(alvo, e.jogador) > 1) { msg(e, 'Longe demais para conversar.'); return false; }
  return conversar(e, alvo);
}

function conversar(e, ent) {
  const th = temaDe(e);
  if (ent.tipo === 'fantasma') {
    msg(e, `Você fala com ${artigoDe(nomeAparente(e, ent))}. Ninguém responde. Ele some no meio da sua frase.`, 'bom');
    revelar(e, ent, 'falar');
    return true;
  }
  if (ent.tipo === 'monstro') {
    const ap = aparencia(e, ent);
    if (ap.categoria === 'aliado') {
      // Emboscada: parecia aliado.
      msg(e, `Você estende a mão para ${artigoDe(nomeAparente(e, ent))}.`, 'info');
      ataqueDoMonstro(e, ent, 0);
      ent.estado = 'cacando';
      return true;
    }
    const nome = especie(e, ent).nome;
    if (ent.categoria !== 'humano') {
      msg(e, ent.categoria === 'besta' ? `Não há o que conversar com ${artigoDe(nome)}.` : `${Maiuscula(artigoDe(nome))} não ouve palavras.`);
      return true;
    }
    const t = clip.testar({
      nivel: n(e, 'presenca'), objeto: Math.max(n(e, 'empatia'), n(e, 'intimidacao'), n(e, 'lideranca')),
      dificuldade: PARAM.convencer + ent.vontade + e.andar, rng: rng(e),
    });
    if (t.sucesso) {
      ent.estado = 'pacificado';
      e.stats.pacificados++;
      msg(e, `Você fala baixo e firme. ${Maiuscula(artigoDe(nome))} abaixa a guarda e se afasta.`, 'bom');
    } else {
      msg(e, `${Maiuscula(artigoDe(nome))} não quer conversa.`);
      ent.estado = 'cacando';
    }
    return true;
  }
  // Aliado de verdade
  const esp = especie(e, ent);
  if (ent.aparencia) {
    ent.aparencia = null;
    e.stats.disfarcesRevelados++;
    msg(e, `“Sou eu!” Não era um monstro: é ${esp.nome}.`, 'bom');
  }
  if (ent.ferido) { msg(e, `${Maiuscula(esp.nome)} recua de você, com medo.`); return true; }
  if (ent.estado === 'seguindo') { msg(e, `${Maiuscula(esp.nome)} faz que sim com a cabeça. Ainda com você.`); return true; }
  if (ent.usado) { msg(e, `${Maiuscula(esp.nome)}: “Já disse o que sabia. Vai.”`); return true; }
  ent.usado = true;
  msg(e, `${Maiuscula(esp.nome)}: “${esp.fala}”`, 'fala');
  const t = clip.testar({ nivel: n(e, 'presenca'), objeto: n(e, 'empatia'), dificuldade: PARAM.conversarAliado, rng: rng(e) });
  const temCompanhia = e.entidades.some((x) => x.estado === 'seguindo' && x.vida > 0);
  const presente = esp.presente === 'companhia' && (temCompanhia || e.culpa) ? 'item' : esp.presente;
  darPresente(e, ent, presente);
  if (t.sucesso && presente !== 'lucidez') {
    ganharSan(e, 2, 'conversa');
    msg(e, 'Uma conversa de verdade. Você lembra quem é.', 'bom');
  }
  return true;
}

function darPresente(e, ent, presente) {
  const th = temaDe(e);
  if (presente === 'dica') {
    const saida = e.objetos.find((o) => o.real && (o.tipo === 'escada' || o.tipo === 'saida'));
    if (saida) {
      const caminho = caminhoReal(e, ent, saida);
      for (const p of caminho) e.visto[idx(e, p.x, p.y)] = 1;
      e.visto[idx(e, saida.x, saida.y)] = 1;
      saida.conhecida = true;
      msg(e, `Ela desenha o caminho até ${artigoDe(th.passagem === nomeObjeto(e, saida) ? th.passagem : th.saida)} na poeira do chão.`, 'bom');
    }
  } else if (presente === 'item') {
    const tipo = e.san < derivados(e).sanMax / 2 ? 'calma' : 'cura';
    const it = { tipo, nome: escolher(e.rIA, th.itens[tipo]) };
    if (e.inventario.length < PARAM.inventario) {
      e.inventario.push(it);
      msg(e, `Você recebe ${artigo(it.nome)}.`, 'bom');
    } else { ganharSan(e, 2, 'aliado'); msg(e, 'Você não tem onde guardar, mas agradece. Isso ajuda.', 'bom'); }
  } else if (presente === 'lucidez') {
    ganharSan(e, 5, 'aliado');
    msg(e, 'As palavras dele assentam o mundo no lugar.', 'bom');
  } else if (presente === 'companhia') {
    ent.estado = 'seguindo';
    msg(e, `${Maiuscula(especie(e, ent).nome)} agora segue você.`, 'bom');
    anotar(e, `${Maiuscula(especie(e, ent).nome)} juntou-se a você.`);
  }
}

function caminhoReal(e, de, ate) {
  const prev = new Map();
  const k = (x, y) => y * e.mapa.w + x;
  const fila = [{ x: de.x, y: de.y }];
  prev.set(k(de.x, de.y), null);
  while (fila.length) {
    const c = fila.shift();
    if (c.x === ate.x && c.y === ate.y) break;
    for (const [dx, dy] of VIZINHOS) {
      const x = c.x + dx, y = c.y + dy;
      if (prev.has(k(x, y)) || tile(e.mapa, x, y) === T.PAREDE) continue;
      prev.set(k(x, y), c);
      fila.push({ x, y });
    }
  }
  const caminho = [];
  let p = prev.has(k(ate.x, ate.y)) ? { x: ate.x, y: ate.y } : null;
  while (p) { caminho.push(p); p = prev.get(k(p.x, p.y)); }
  return caminho;
}

/* Encarar com fé (Vontade ou Fé) ----------------------------------------- */

function encarar(e, alvoId) {
  const alvo = alvoPorId(e, alvoId);
  if (!alvo || !alvo.especie) { msg(e, 'Não há o que encarar.'); return false; }
  if (distancia(alvo, e.jogador) > 4) { msg(e, 'Longe demais. Chegue mais perto para encarar.'); return false; }
  const nome = nomeAparente(e, alvo);
  const vontade = alvo.vontade ?? 1;
  const t = clip.testar({
    nivel: Math.max(n(e, 'vontade'), n(e, 'fe')), objeto: Math.max(n(e, 'conviccao'), n(e, 'devocao'), n(e, 'autocontrole')),
    dificuldade: PARAM.encarar + vontade + e.andar, rng: rng(e),
  });
  if (alvo.tipo === 'fantasma') {
    if (t.sucesso) { msg(e, `Você encara ${artigoDe(nome)} sem piscar.`); revelar(e, alvo, 'encarar'); }
    else { perderSan(e, PARAM.perda.encararFalhou, { motivo: 'encarar' }); msg(e, `Você encara ${artigoDe(nome)}. Ele encara de volta.`, 'dano'); }
    return true;
  }
  if (alvo.tipo === 'aliado') {
    if (alvo.aparencia) { revelar(e, alvo, 'encarar'); msg(e, 'Ele não foge. Só te olha, assustado.', 'bom'); }
    else msg(e, `${Maiuscula(artigoDe(nome))} estranha o seu olhar.`);
    return true;
  }
  if (alvo.categoria === 'humano') {
    msg(e, `${Maiuscula(artigoDe(nome))} ri do seu olhar.`);
    alvo.estado = 'cacando';
    return true;
  }
  if (t.sucesso) {
    if (alvo.aparencia) revelar(e, alvo, 'encarar');
    if (alvo.categoria === 'assombro') {
      alvo.vida = 0;
      e.stats.espantados++;
      msg(e, `Você encara ${artigoDe(especie(e, alvo).nome)} até ele perder a forma. Some.`, 'bom');
    } else {
      alvo.estado = 'fugindo';
      alvo.fugaTtl = 25;
      e.stats.espantados++;
      msg(e, `${Maiuscula(artigoDe(especie(e, alvo).nome))} recua diante do seu olhar e foge.`, 'bom');
    }
  } else {
    perderSan(e, PARAM.perda.encararFalhou, { motivo: 'encarar' });
    msg(e, `Você encara ${artigoDe(nome)}. Ele não recua, e algo em você treme.`, 'dano');
    alvo.estado = 'cacando';
  }
  return true;
}

/* Magia (Mágicas de Ataque Físico) --------------------------------------- */

function magia(e, alvoId) {
  if (n(e, 'magiaAtaqueFisico') < 1) { msg(e, 'Você não sabe nenhuma mágica.'); return false; }
  const alvo = alvoPorId(e, alvoId);
  if (!alvo || !alvo.especie) { msg(e, 'Sem alvo para a mágica.'); return false; }
  if (distancia(alvo, e.jogador) > PARAM.magia.alcance || !linhaLivre(e.mapa, e.jogador, alvo)) { msg(e, 'O alvo está fora de alcance.'); return false; }
  const m = clip.lancarMagia(e.ficha, { pericia: 'magiaAtaqueFisico', pm: PARAM.magia.custo, pmDisponivel: e.pm, rng: rng(e) });
  if (m.falhou) { msg(e, 'Você está sem Pontos de Magia. Nada acontece.'); return false; }
  e.pm -= m.gasto;
  const nome = nomeAparente(e, alvo);
  efeito(e, 'magia');
  if (alvo.tipo === 'fantasma') {
    e.stats.golpesNoVazio++;
    msg(e, `O fogo atravessa ${artigoDe(nome)} e lambe a parede. Não havia nada ali.`, 'mentira');
    removerFantasma(e, alvo);
    ganharPista(e, 'vazio');
    return true;
  }
  // Dano: diferença + PM gastos, como o modificador de uma arma (ver dúvida D2 da arena).
  const r = clip.resolverAtaque({
    ataque: m.gasto + n(e, 'raciocinio'), dadoAtaque: m.dado, arma: m.gasto + n(e, 'raciocinio'), defesa: Math.max(0, alvo.defesa - (alvo.pontoFraco ?? 0)), armadura: alvo.armadura ?? 0, rng: rng(e),
  });
  if (!r.acertou) { msg(e, `O fogo passa raspando ${artigoDe(nome)}.`); if (alvo.tipo === 'monstro') alvo.estado = 'cacando'; return true; }
  ferir(e, alvo, r.dano, nome, 'Fogo! ');
  return true;
}

/* Ancorar-se (Vontade ou Fé) --------------------------------------------- */

function ancorar(e) {
  if (e.cargasAncora <= 0) { msg(e, 'Você não tem mais em que se agarrar neste lugar.'); return false; }
  const t = clip.testar({
    nivel: Math.max(n(e, 'vontade'), n(e, 'fe')), objeto: Math.max(n(e, 'autocontrole'), n(e, 'conviccao'), n(e, 'esperanca')),
    dificuldade: PARAM.ancora.dificuldade, rng: rng(e),
  });
  if (!t.sucesso) { msg(e, 'Você tenta se agarrar a uma lembrança. Ela escorrega.'); return true; }
  e.cargasAncora--;
  ancorarMundo(e, PARAM.ancora.ganho + n(e, 'esperanca'));
  msg(e, 'Você respira, diz seu nome em voz alta e conta as paredes. O mundo para de mentir, por um tempo.', 'bom');
  return true;
}

function ancorarMundo(e, ganho) {
  ganharSan(e, ganho, 'ancora');
  e.ancorado = PARAM.ancora.turnos;
  let desfeitos = 0;
  for (const ent of [...e.entidades]) {
    if (!e.vis.has(idx(e, ent.x, ent.y))) continue;
    if (ent.tipo === 'fantasma' || ent.aparencia) { revelar(e, ent, 'ancora'); desfeitos++; }
  }
  for (const o of e.objetos) if (!o.real && !o.usado && e.vis.has(idx(e, o.x, o.y))) { revelar(e, o, 'ancora'); desfeitos++; }
  e.ilusaoParedes.clear();
  if (desfeitos) msg(e, desfeitos === 1 ? 'Uma coisa que você via some.' : 'Coisas que você via somem.', 'bom');
  ganharPista(e, 'ancora');
}

/* Itens ------------------------------------------------------------------ */

function usar(e, i) {
  const it = e.inventario[i];
  if (!it) return false;
  e.inventario.splice(i, 1);
  const d = derivados(e);
  if (it.tipo === 'cura') {
    e.vida = Math.min(d.vidaMax, e.vida + PARAM.itens.cura + n(e, 'medicina'));
    msg(e, `Você usa ${artigo(it.nome)}. O corpo agradece.`, 'bom');
  } else if (it.tipo === 'calma') {
    ganharSan(e, PARAM.itens.calma, 'calma');
    msg(e, `Você usa ${artigo(it.nome)}. Os contornos voltam ao lugar.`, 'bom');
  } else if (it.tipo === 'ancora') {
    ancorarMundo(e, PARAM.itens.ancora);
    msg(e, `Você segura ${artigo(it.nome)} com força. Você sabe quem é.`, 'bom');
  }
  return true;
}

/* ------------------------------------------------------------------------ */
/* O mundo anda                                                             */
/* ------------------------------------------------------------------------ */

function mundo(e) {
  e.turno++;
  e.stats.turnos++;
  e.stats.turnosPorLucidez[lucidez(e)]++;
  for (const ent of [...e.entidades]) {
    if (e.fim) break;
    if (ent.tipo === 'fantasma') agirFantasma(e, ent);
    else if (ent.vida > 0) {
      if (ent.tipo === 'monstro') agirMonstro(e, ent);
      else agirAliado(e, ent);
    }
  }
  e.entidades = e.entidades.filter((x) => x.tipo === 'fantasma' || x.vida > 0 || (x.tipo === 'aliado' && x.morto !== true && x.vida > 0));
  // O tempo pesa.
  const companhia = e.entidades.some((x) => x.estado === 'seguindo' && distancia(x, e.jogador) <= 2);
  // O intervalo cresce com a Sanidade máxima: o tempo tira a mesma fração de todos.
  const ritmo = Math.max(6, Math.round((PARAM.drenagem[e.andar - 1] * PARAM.sanidadeReferencia) / derivados(e).sanMax * (companhia ? PARAM.drenagemCompanhia : 1)));
  if (e.turno % ritmo === 0) perderSan(e, 1, { reduzivel: false, motivo: 'tempo' });
  const d = derivados(e);
  if (e.turno % PARAM.regenVida === 0 && e.vida < d.vidaMax) e.vida++;
  if (e.turno % PARAM.regenPM === 0 && e.pm < d.pmMax) e.pm++;
  if (e.ancorado > 0) e.ancorado--;
  // Surto
  if (e.surto > 0) {
    e.surto--;
    if (e.surto === 0) sairDoSurto(e);
  } else if (e.san <= 0) entrarNoSurto(e);
  if (e.vida <= 0 && !e.fim) {
    e.fim = { tipo: 'morte', turno: e.turno, andar: e.andar, causa: e.ultimoGolpe };
    msg(e, temaDe(e).morte, 'fim');
    anotar(e, `Caiu em ${temaDe(e).andares[e.andar - 1]}${e.ultimoGolpe ? ', diante de ' + e.ultimoGolpe : ''}.`);
  }
  if (e.fim) return;
  atualizarVisao(e);
  alucinar(e);
}

function entrarNoSurto(e) {
  e.surto = PARAM.surto.turnos;
  e.surtos++;
  e.stats.surtos++;
  msg(e, temaDe(e).surto, 'surto');
  efeito(e, 'surto');
  anotar(e, 'Perdeu o controle.');
  ganharPista(e, 'palavras');
}

function sairDoSurto(e) {
  e.cicatrizes += PARAM.surto.cicatriz;
  if (e.surtos >= PARAM.surto.maximo || derivados(e).sanMax <= PARAM.surto.cicatriz) {
    e.fim = { tipo: 'loucura', turno: e.turno, andar: e.andar };
    msg(e, temaDe(e).loucura, 'fim');
    anotar(e, 'Não voltou do último surto.');
    return;
  }
  e.san = Math.ceil(derivados(e).sanMax * PARAM.surto.sanidadeDepois);
  e.ancorado = PARAM.surto.calmaDepois;
  for (const f of e.entidades.filter((x) => x.tipo === 'fantasma')) removerFantasma(e, f);
  msg(e, 'Você volta a si, de joelhos, sem saber quanto tempo passou. Algo ficou quebrado.', 'perigo');
}

function acaoDoSurto(e) {
  const perto = e.entidades.filter((x) => (x.vida > 0 || x.tipo === 'fantasma') && distancia(x, e.jogador) === 1);
  if (perto.length && chance(e.rIA, 0.7)) {
    const alvo = escolher(e.rIA, perto);
    return { tipo: 'atacar', dx: alvo.x - e.jogador.x, dy: alvo.y - e.jogador.y };
  }
  const [dx, dy] = escolher(e.rIA, VIZINHOS);
  return { tipo: 'mover', dx, dy };
}

const livreParaAndar = (e, x, y, quem) =>
  tile(e.mapa, x, y) !== T.PAREDE && !(e.jogador.x === x && e.jogador.y === y) && !e.entidades.some((o) => o !== quem && o.tipo !== 'fantasma' && o.vida > 0 && o.x === x && o.y === y);

function passoPara(e, ent, alvo, afastar = false) {
  if (!afastar) {
    const p = primeiroPasso(e.mapa.w, e.mapa.h, ent, (x, y) => livreParaAndar(e, x, y, ent), (x, y) => x === alvo.x && y === alvo.y, 400);
    if (p) {
      const x = ent.x + p.dx, y = ent.y + p.dy;
      if (livreParaAndar(e, x, y, ent)) andar(e, ent, x, y);
      return;
    }
  }
  let melhor = null, md = afastar ? -1 : 1e9;
  for (const [dx, dy] of VIZINHOS) {
    const x = ent.x + dx, y = ent.y + dy;
    if (!livreParaAndar(e, x, y, ent)) continue;
    const d = (x - alvo.x) ** 2 + (y - alvo.y) ** 2;
    if (afastar ? d > md : d < md) { md = d; melhor = { x, y }; }
  }
  if (melhor) andar(e, ent, melhor.x, melhor.y);
}

function andar(e, ent, x, y) {
  if (tile(e.mapa, x, y) === T.PORTA) { por(e.mapa, x, y, T.ABERTA); return; }
  ent.x = x;
  ent.y = y;
}

function vagar(e, ent) {
  if (!chance(e.rIA, 0.35)) return;
  const [dx, dy] = escolher(e.rIA, VIZINHOS);
  const x = ent.x + dx, y = ent.y + dy;
  if (livreParaAndar(e, x, y, ent) && tile(e.mapa, x, y) !== T.PORTA) andar(e, ent, x, y);
}

function agirMonstro(e, m) {
  // Assombros flutuam devagar: dá para fugir deles.
  if (m.categoria === 'assombro' && e.turno % 2 === 0 && distancia(m, e.jogador) > 1) return;
  const ve = e.vis.has(idx(e, m.x, m.y)) && distancia(m, e.jogador) <= 8;
  if (m.estado === 'pacificado') {
    if (ve) passoPara(e, m, e.jogador, true);
    else if (chance(e.rIA, 0.05)) m.vida = 0; // vai embora de vez
    return;
  }
  if (m.estado === 'fugindo') {
    m.fugaTtl--;
    passoPara(e, m, e.jogador, true);
    if (m.fugaTtl <= 0) { m.estado = ve ? 'cacando' : 'parado'; if (!ve) m.vida = 0; }
    return;
  }
  if (ve) {
    if (!m.jaVisto && m.categoria === 'assombro') {
      m.jaVisto = true;
      const q = perderSan(e, PARAM.perda.verAssombro, { motivo: 'assombro' });
      if (q) msg(e, `Ver ${artigoDe(nomeAparente(e, m))} gela sua espinha.`, 'dano');
    }
    m.estado = 'cacando';
    m.ultimo = { x: e.jogador.x, y: e.jogador.y };
  }
  if (m.estado === 'cacando') {
    const companheiro = e.entidades.find((x) => x.estado === 'seguindo' && x.vida > 0 && distancia(x, m) === 1);
    if (distancia(m, e.jogador) === 1) { ataqueDoMonstro(e, m, 0); return; }
    if (companheiro && chance(e.rIA, 0.6)) { ataqueAoCompanheiro(e, m, companheiro); return; }
    if (m.ultimo) {
      passoPara(e, m, m.ultimo);
      // Os rápidos dão dois passos quando estão longe.
      if (m.rapido && distancia(m, e.jogador) > 1) passoPara(e, m, m.ultimo);
      if (m.x === m.ultimo.x && m.y === m.ultimo.y && !ve) { m.estado = 'parado'; m.ultimo = null; }
    }
    return;
  }
  vagar(e, m);
}

function ataqueDoMonstro(e, m, bonus) {
  const d = derivados(e);
  const nome = nomeAparente(e, m);
  if (m.aparencia?.categoria === 'aliado') {
    // Disfarçado de aliado: o primeiro golpe pega você desprevenido e tira a máscara.
    bonus += 2;
    m.aparencia = null;
    m.revelado = true;
    e.stats.emboscadas++;
    perderSan(e, PARAM.perda.emboscada, { motivo: 'emboscada' });
    msg(e, `${Maiuscula(artigoDe(nome))} sorri, chega perto demais e mostra o que é: ${artigoDe(especie(e, m).nome)}.`, 'perigo');
    ganharPista(e, 'aproxima');
  }
  if (m.categoria === 'assombro') {
    const r = clip.resolverAtaque({ ataque: m.mental, defesa: d.defesaMental, outrosAtaque: bonus, rng: rng(e) });
    if (r.acertou) {
      perderSan(e, Math.min(PARAM.danoMentalMaximo, r.dano), { motivo: 'assombro' });
      efeito(e, 'mente');
      msg(e, `${Maiuscula(artigoDe(nome))} sussurra dentro da sua cabeça${r.dano >= 3 ? ', fundo' : ''}.`, 'dano');
    } else msg(e, `${Maiuscula(artigoDe(nome))} tenta entrar na sua cabeça. Você não deixa.`);
    return;
  }
  const r = clip.resolverAtaque({ ataque: m.ataque, defesa: d.defesa, arma: m.arma, armadura: d.armadura, outrosAtaque: bonus, rng: rng(e) });
  if (r.acertou) {
    e.vida -= r.dano;
    e.ultimoGolpe = artigoDe(especie(e, m).nome);
    efeito(e, 'golpe');
    msg(e, `${Maiuscula(artigoDe(nome))} acerta você${r.dano >= 4 ? ' em cheio' : ''}.`, 'dano');
  } else msg(e, `${Maiuscula(artigoDe(nome))} erra você.`);
}

function ataqueAoCompanheiro(e, m, c) {
  const r = clip.resolverAtaque({ ataque: m.ataque, defesa: c.defesa, arma: m.arma, rng: rng(e) });
  const nc = especie(e, c).nome;
  if (r.acertou) {
    c.vida -= r.dano;
    msg(e, `${Maiuscula(artigoDe(nomeAparente(e, m)))} acerta ${nc}.`, 'perigo');
    if (c.vida <= 0) {
      msg(e, `${Maiuscula(nc)} cai e não levanta.`, 'perigo');
      perderSan(e, 2, { motivo: 'companheiro' });
      anotar(e, `Perdeu ${nc}.`);
    }
  }
}

function agirAliado(e, a) {
  if (a.estado === 'fugindo') {
    a.fugaTtl--;
    passoPara(e, a, e.jogador, true);
    if (a.fugaTtl <= 0) a.estado = 'parado';
    return;
  }
  if (a.estado !== 'seguindo') return;
  // Companhia: bate em monstro ao lado (só nos reais), senão segue.
  const inimigo = e.entidades.find((x) => x.tipo === 'monstro' && x.vida > 0 && x.estado === 'cacando' && distancia(x, a) === 1);
  if (inimigo) {
    const r = clip.resolverAtaque({ ataque: a.ataque, defesa: inimigo.defesa, arma: a.arma, rng: rng(e) });
    const nc = especie(e, a).nome;
    if (r.acertou) {
      inimigo.vida -= r.dano;
      if (inimigo.vida <= 0) { msg(e, `${Maiuscula(nc)} derruba ${artigoDe(nomeAparente(e, inimigo))}.`, 'golpe'); e.stats.vencidos++; }
      else msg(e, `${Maiuscula(nc)} acerta ${artigoDe(nomeAparente(e, inimigo))}.`, 'golpe');
    }
    return;
  }
  if (distancia(a, e.jogador) > 1) passoPara(e, a, e.jogador);
}

function agirFantasma(e, f) {
  f.ttl--;
  if (f.ttl <= 0) {
    const via = e.vis.has(idx(e, f.x, f.y));
    removerFantasma(e, f);
    if (via) msg(e, `${Maiuscula(artigoDe(nomeAparente(e, f)))} dobra uma esquina que não existe e some.`, 'mentira');
    return;
  }
  if (distancia(f, e.jogador) === 1) {
    if (!chance(e.rAlu, 0.75)) return;
    const d = derivados(e);
    const r = clip.resolverAtaque({ ataque: 1 + Math.floor(e.andar / 2), defesa: d.defesaMental, rng: comoFuncao(e.rAlu) });
    const nome = nomeAparente(e, f);
    if (r.acertou) {
      perderSan(e, 1, { motivo: 'vulto' });
      f.acertou = true;
      e.stats.fantasmasGolpes++;
      efeito(e, 'golpe');
      msg(e, `${Maiuscula(artigoDe(nome))} acerta você${r.dano >= 4 ? ' em cheio' : ''}.`, 'dano', { mentira: true });
    } else msg(e, `${Maiuscula(artigoDe(nome))} erra você.`, 'info', { mentira: true });
    return;
  }
  // Anda em direção ao jogador, atravessando gente (é só uma ideia).
  let melhor = null, md = 1e9;
  for (const [dx, dy] of VIZINHOS) {
    const x = f.x + dx, y = f.y + dy;
    if (tile(e.mapa, x, y) === T.PAREDE || (x === e.jogador.x && y === e.jogador.y)) continue;
    const dd = (x - e.jogador.x) ** 2 + (y - e.jogador.y) ** 2;
    if (dd < md) { md = dd; melhor = { x, y }; }
  }
  if (melhor) { f.x = melhor.x; f.y = melhor.y; }
}

/* ------------------------------------------------------------------------ */
/* Alucinações                                                              */
/* ------------------------------------------------------------------------ */

function alucinar(e) {
  // Os andares mais fundos mentem para todos, até para quem está lúcido.
  const lucido = lucidez(e);
  const lv = lucido === 0 ? 0 : Math.max(lucido, PARAM.pressaoDoAndar[e.andar - 1]);
  const A = PARAM.alu;
  const r = e.rAlu;
  if (lv === 0) {
    // Lúcido: o mundo se assenta.
    for (const f of e.entidades.filter((x) => x.tipo === 'fantasma')) removerFantasma(e, f);
    for (const x of e.entidades) x.aparencia = null;
    for (const o of e.objetos) if (!o.real) o.usado = true;
    e.ilusaoParedes.clear();
    return;
  }
  const notar = PARAM.notar * (n(e, 'sentidos') + n(e, 'discernimento'));
  // Disfarces para quem acabou de entrar em vista.
  for (const ent of e.entidades) {
    if (ent.tipo === 'fantasma' || !ent.visivel) continue;
    if (!ent.decidido) {
      ent.decidido = true;
      const p = A.disfarce[lv] * (ent.estado === 'seguindo' ? 0.35 : 1) * (e.ancorado > 0 ? 0 : 1);
      if (!ent.revelado && chance(r, p)) {
        const th = temaDe(e);
        if (ent.tipo === 'aliado') {
          const m = escolher(r, th.monstros.filter((q) => q.andar <= Math.max(2, e.andar) && q.andar < 5));
          ent.aparencia = { especie: m.id, categoria: m.categoria };
        } else {
          const al = escolher(r, th.aliados);
          ent.aparencia = { especie: al.id, categoria: 'aliado' };
        }
        e.stats.disfarcesCriados++;
      }
    }
    if ((ent.aparencia || ent.tipo === 'fantasma') && !ent.suspeito && notar && chance(r, notar)) marcarSuspeito(e, ent);
  }
  for (const ent of e.entidades) if (!ent.visivel) ent.decidido = false;
  for (const f of e.entidades.filter((x) => x.tipo === 'fantasma' && x.visivel && !x.suspeito)) {
    if (notar && chance(r, notar)) marcarSuspeito(e, f);
  }
  if (e.ancorado > 0) return;
  // Vultos
  if (chance(r, A.fantasma[lv])) criarFantasma(e);
  // Miragens
  if (chance(r, A.miragem[lv])) criarMiragem(e);
  // Paredes que mentem
  if (e.turno % PARAM.epocaParedes === 0) refazerParedes(e, A.paredes[lv]);
  // Sussurros e golpes que não aconteceram
  if (chance(r, A.sussurro[lv])) msg(e, escolher(r, temaDe(e).sussurros), 'sussurro', { mentira: true });
  if (chance(r, A.golpeFalso[lv])) {
    efeito(e, 'golpe');
    msg(e, temaDe(e).golpeFalso, 'dano', { mentira: true });
  }
}

function marcarSuspeito(e, ent) {
  ent.suspeito = true;
  msg(e, `Algo ${emArtigo(nomeAparente(e, ent))} não está certo.`, 'pista');
}

function casasLivresVisiveis(e, minDist) {
  const casas = [];
  for (const k of e.vis) {
    const x = k % e.mapa.w, y = Math.floor(k / e.mapa.w);
    if (tile(e.mapa, x, y) !== T.CHAO) continue;
    if (distancia({ x, y }, e.jogador) < minDist) continue;
    if (reaisEm(e, x, y) || e.objetos.some((o) => o.x === x && o.y === y && !o.usado)) continue;
    casas.push({ x, y });
  }
  return casas;
}

function criarFantasma(e) {
  const th = temaDe(e);
  // Nasce na borda da visão ou logo fora dela, e vem andando.
  const raio = PARAM.raioVisao[lucidez(e)];
  const casas = [];
  for (let y = e.jogador.y - raio - 2; y <= e.jogador.y + raio + 2; y++) {
    for (let x = e.jogador.x - raio - 2; x <= e.jogador.x + raio + 2; x++) {
      const d = distancia({ x, y }, e.jogador);
      if (d < raio - 1 || d > raio + 2 || tile(e.mapa, x, y) !== T.CHAO || reaisEm(e, x, y)) continue;
      casas.push({ x, y });
    }
  }
  if (!casas.length) return;
  const p = escolher(e.rAlu, casas);
  const m = escolher(e.rAlu, th.monstros.filter((q) => q.andar <= Math.max(2, e.andar) && q.andar < 5));
  e.entidades.push({
    id: 'e' + e.proximoId++, tipo: 'fantasma', especie: m.id, categoria: m.categoria, x: p.x, y: p.y, ttl: inteiro(e.rAlu, 25, 45), vida: 1, vontade: 0,
  });
  e.stats.fantasmasCriados++;
}

function criarMiragem(e) {
  const casas = casasLivresVisiveis(e, 3);
  if (!casas.length) return;
  const p = escolher(e.rAlu, casas);
  const final = e.andar === PARAM.andares;
  const tipo = ponderado(e.rAlu, [['item', 3], [final ? 'saida' : 'escada', 2], ['altar', 0.6]]);
  const th = temaDe(e);
  const o = { id: 'o' + e.proximoId++, tipo, x: p.x, y: p.y, real: false };
  if (tipo === 'item') {
    const t = ponderado(e.rAlu, [['cura', 2], ['calma', 3], ['ancora', 1]]);
    o.item = { tipo: t, nome: escolher(e.rAlu, th.itens[t]) };
  }
  e.objetos.push(o);
  e.stats.miragensCriadas++;
}

function refazerParedes(e, quantas) {
  e.ilusaoParedes.clear();
  if (!quantas) return;
  const passagens = [];
  const bloqueios = [];
  for (const k of e.vis) {
    const x = k % e.mapa.w, y = Math.floor(k / e.mapa.w);
    if (distancia({ x, y }, e.jogador) < 2) continue;
    const t = tile(e.mapa, x, y);
    const h = tile(e.mapa, x - 1, y) === T.CHAO && tile(e.mapa, x + 1, y) === T.CHAO;
    const v = tile(e.mapa, x, y - 1) === T.CHAO && tile(e.mapa, x, y + 1) === T.CHAO;
    const hw = tile(e.mapa, x - 1, y) === T.PAREDE && tile(e.mapa, x + 1, y) === T.PAREDE;
    const vw = tile(e.mapa, x, y - 1) === T.PAREDE && tile(e.mapa, x, y + 1) === T.PAREDE;
    if (t === T.PAREDE && (h || v)) passagens.push(k); // parede entre dois chãos: parece passagem
    if (t === T.CHAO && (hw || vw) && !reaisEm(e, x, y)) bloqueios.push(k); // corredor: parece parede
  }
  const ps = embaralhar(e.rAlu, passagens);
  const bs = embaralhar(e.rAlu, bloqueios);
  for (let i = 0; i < quantas; i++) {
    if (i % 2 === 0 && ps.length) e.ilusaoParedes.set(ps.pop(), T.CHAO);
    else if (bs.length) e.ilusaoParedes.set(bs.pop(), T.PAREDE);
  }
}

/* ------------------------------------------------------------------------ */
/* Evolução entre andares                                                   */
/* ------------------------------------------------------------------------ */

const EVOLUIVEIS = {
  atributos: Object.keys(clip.ATRIBUTOS),
  aprimoramentos: ['ataqueCorporal', 'agilidade', 'reflexo', 'resistencia', 'saude', 'empatia', 'intimidacao', 'sentidos', 'discernimento', 'serenidade', 'memoria', 'raciocinio', 'autocontrole', 'conviccao', 'esperanca'],
  pericias: ['magiaAtaqueFisico', 'medicina'],
};

export const EFEITO_NO_JOGO = {
  forca: 'Arma e armadura mais pesadas.',
  destreza: 'Libera Agilidade e Reflexo.',
  fisico: 'Libera Resistência e Saúde.',
  inteligencia: 'Libera a mágica de fogo e Raciocínio.',
  percepcao: 'Olhar de novo com mais dados.',
  sabedoria: 'Olhar de novo; libera Serenidade e Discernimento.',
  vontade: 'Mais Sanidade; ancorar e encarar.',
  presenca: 'Convencer gente e conversar melhor.',
  fe: 'Mais Sanidade; ancorar e encarar; o altar rende mais.',
  ataqueCorporal: 'Bate com mais precisão.',
  agilidade: 'Bate com mais precisão.',
  reflexo: 'Defende melhor.',
  resistencia: 'Defende melhor e aguenta um pouco mais.',
  saude: 'Muito mais Vida.',
  empatia: 'Convencer e conversar com mais dados.',
  intimidacao: 'Convencer pelo medo.',
  sentidos: 'Olhar de novo; nota sozinho o que está errado.',
  discernimento: 'Olhar de novo; nota sozinho o que está errado.',
  serenidade: 'Cada susto tira menos Sanidade.',
  memoria: 'O mapa lembrado não mente.',
  raciocinio: 'O fogo acerta melhor.',
  autocontrole: 'Resiste a sussurros e ajuda a ancorar.',
  conviccao: 'Encarar e ancorar com mais dados.',
  esperanca: 'Ancorar e rezar devolvem mais Sanidade.',
  magiaAtaqueFisico: 'Lança fogo à distância, gastando Pontos de Magia.',
  medicina: 'Curativos rendem mais.',
};

export function opcoesEvolucao(e) {
  const f = e.ficha;
  const validas = [];
  for (const id of EVOLUIVEIS.atributos) if (n(e, id) < clip.REGRAS.nivelMaximoSugerido) validas.push({ tipo: 'atributo', id });
  for (const id of EVOLUIVEIS.aprimoramentos) {
    if (n(e, id) < n(e, clip.APRIMORAMENTOS[id].atributo)) validas.push({ tipo: 'aprimoramento', id });
  }
  for (const id of EVOLUIVEIS.pericias) {
    const base = clip.PERICIAS_EXEMPLO.find((p) => p.id === id);
    if (n(e, id) < clip.maximoPericia(f, base)) validas.push({ tipo: 'pericia', id });
  }
  const r = fluxo(e.semente, e.tema, 'evolucao', e.andar, e.origem);
  const caminho = (o) => clip.ATRIBUTOS[o.id]?.caminho ?? clip.ATRIBUTOS[clip.APRIMORAMENTOS[o.id]?.atributo]?.caminho ?? 'mente';
  const porCaminho = { corpo: [], mente: [], espirito: [] };
  for (const o of embaralhar(r, validas)) porCaminho[caminho(o)].push(o);
  const escolhidas = [];
  for (const c of embaralhar(r, ['corpo', 'mente', 'espirito'])) if (porCaminho[c].length) escolhidas.push(porCaminho[c][0]);
  return escolhidas.slice(0, 3).map((o) => ({
    ...o,
    nome: clip.nomeDe(o.id, f),
    nivel: n(e, o.id) + 1,
    caminho: caminho(o),
    efeito: EFEITO_NO_JOGO[o.id] ?? '',
    resumo: dica(clip.ancora(o.id) ?? '')?.resumo ?? clip.APRIMORAMENTOS[o.id]?.efeito ?? '',
  }));
}

function aplicarEscolha(e, i) {
  const o = e.escolha?.opcoes[i];
  if (!o) return;
  const antes = derivados(e);
  if (o.tipo === 'atributo') e.ficha.atributos[o.id]++;
  else if (o.tipo === 'aprimoramento') e.ficha.aprimoramentos[o.id]++;
  else {
    const p = e.ficha.pericias.find((q) => q.id === o.id);
    if (p) p.nivel++;
    else {
      const base = clip.PERICIAS_EXEMPLO.find((q) => q.id === o.id);
      e.ficha.pericias.push({ id: base.id, nome: base.nome, requisitos: [...base.requisitos], nivel: 1, aplica: null, magica: !!base.magica });
    }
  }
  e.ficha.pontosDeEvolucao = clip.pontosGastos(e.ficha).total;
  const depois = derivados(e);
  e.vida = Math.max(1, Math.min(depois.vidaMax, e.vida + depois.vidaMax - antes.vidaMax));
  e.san = Math.max(1, Math.min(depois.sanMax, e.san + depois.sanMax - antes.sanMax));
  e.pm = Math.min(depois.pmMax, e.pm + depois.pmMax - antes.pmMax);
  e.cargasAncora += depois.cargasAncora - antes.cargasAncora;
  e.escolha = null;
  msg(e, `${o.nome} ${o.nivel}. ${o.efeito}`, 'bom');
  atualizarVisao(e);
}

/* ------------------------------------------------------------------------ */
/* Percepção: o que a tela mostra                                           */
/* ------------------------------------------------------------------------ */

/**
 * O mundo como o personagem o percebe. É a única coisa que a interface e o
 * robô do simulador enxergam (fora o modo de depuração).
 *
 * - `tiles[k]`: tile aparente ou -1 (nunca visto); `visivel[k]`: na vista agora.
 * - `entidades`: o que parece estar ali, com `sombra` (é real) e `respira`
 *   (não é). São os sinais que um jogador atento aprende a ler.
 */
export function percebido(e) {
  const { w, h } = e.mapa;
  const lv = lucidez(e);
  const tiles = new Array(w * h).fill(-1);
  const visivel = new Uint8Array(w * h);
  const memoriaBoa = n(e, 'memoria') > 0;
  const epoca = Math.floor(e.turno / PARAM.epocaMemoria);
  for (let k = 0; k < w * h; k++) {
    if (!e.visto[k]) continue;
    const x = k % w, y = Math.floor(k / w);
    let t = tile(e.mapa, x, y);
    if (e.vis.has(k)) {
      visivel[k] = 1;
      if (e.ilusaoParedes.has(k)) t = e.ilusaoParedes.get(k);
    } else {
      if (e.ilusaoParedes.has(k)) t = e.ilusaoParedes.get(k);
      else if (!memoriaBoa && lv >= 2) {
        const z = ruido(e.semente + e.andar, x, y, epoca);
        if (z < PARAM.alu.esquecer[lv]) { tiles[k] = -1; continue; }
        if (z < PARAM.alu.esquecer[lv] + PARAM.alu.memoria[lv] && bordaDeParede(e, x, y)) t = t === T.PAREDE ? T.CHAO : T.PAREDE;
      }
    }
    tiles[k] = t;
  }
  const th = temaDe(e);
  const entidades = [];
  for (const ent of e.entidades) {
    if (ent.tipo !== 'fantasma' && ent.vida <= 0) continue;
    if (!e.vis.has(idx(e, ent.x, ent.y))) continue;
    const ap = aparencia(e, ent);
    const esp = th.monstros.find((m) => m.id === ap.especie) ?? th.aliados.find((m) => m.id === ap.especie);
    const real = ent.tipo !== 'fantasma';
    entidades.push({
      id: ent.id, x: ent.x, y: ent.y, sprite: esp.sprite, cores: esp.cores, nome: esp.nome,
      categoria: ap.categoria === 'aliado' ? 'aliado' : 'hostil', especie: ap.categoria,
      sombra: real, respira: !real,
      companheiro: ent.estado === 'seguindo' && !ent.aparencia,
      fugindo: ent.estado === 'fugindo' || ent.estado === 'pacificado',
      marca: ent.suspeito ? 'suspeito' : ent.revelado ? 'real' : null,
      ...(e.depurar ? { verdade: { tipo: ent.tipo, especie: ent.especie, vida: ent.vida, disfarce: !!ent.aparencia } } : {}),
    });
  }
  const objetos = [];
  for (const o of e.objetos) {
    if (o.usado) continue;
    const k = idx(e, o.x, o.y);
    // Fora de vista, só o que é real e já foi visto fica na memória.
    if (!e.vis.has(k) && !(o.real && e.visto[k])) continue;
    objetos.push({
      id: o.id, x: o.x, y: o.y, tipo: o.tipo, item: o.item?.tipo ?? null, nome: nomeObjeto(e, o),
      sombra: o.real, respira: !o.real, visivel: e.vis.has(k), confirmado: !!o.confirmado,
      ...(e.depurar ? { verdade: { real: o.real } } : {}),
    });
  }
  const d = derivados(e);
  return {
    w, h, tiles, visivel, tema: e.tema, andar: e.andar, nomeAndar: th.andares[e.andar - 1],
    jogador: { ...e.jogador, caminho: e.origem },
    entidades, objetos,
    lucidez: lv,
    estado: palavras(e, d, lv),
    surto: e.surto > 0,
    ancorado: e.ancorado > 0,
    cargasAncora: e.cargasAncora,
    temMagia: n(e, 'magiaAtaqueFisico') > 0,
    inventario: e.inventario.map((it) => ({ tipo: it.tipo, nome: it.nome })),
    equipamento: e.ficha.equipamentos.map((q) => q.nome),
    ...(e.depurar ? { numeros: { vida: e.vida, vidaMax: d.vidaMax, san: e.san, sanMax: d.sanMax, pm: e.pm, pmMax: d.pmMax, turno: e.turno, ancorado: e.ancorado } } : {}),
  };
}

function bordaDeParede(e, x, y) {
  let c = 0, p = 0;
  for (const [dx, dy] of VIZINHOS.slice(0, 4)) {
    const t = tile(e.mapa, x + dx, y + dy);
    if (t === T.PAREDE) p++; else c++;
  }
  return c > 0 && p > 0;
}

/**
 * Estado em palavras. A Vida e a Sanidade vêm de `descrever` do motor; com a
 * cabeça ruim, as palavras mentem (a imagem não: a cor e a vinheta seguem a
 * lucidez verdadeira).
 */
function palavras(e, d, lv) {
  const vida = clip.descrever('vida', e.vida, d.vidaMax);
  let san = clip.descrever('sanidade', e.san, d.sanMax);
  let vidaDita = vida;
  const janela = Math.floor(e.turno / 9);
  const z = ruido(e.semente, e.andar, 7, janela);
  if (z < PARAM.alu.mentiraPalavras[lv]) {
    const iv = NOMES_VIDA.indexOf(vida);
    if (iv > 0 && iv < 5 && ruido(e.semente, 1, 2, janela) < 0.5) vidaDita = NOMES_VIDA[iv - 1];
    const recua = 1 + Math.floor(ruido(e.semente, 3, 4, janela) * (lv - 1));
    san = NOMES_LUCIDEZ[Math.max(0, lv - recua)];
  }
  return {
    vida: vidaDita,
    sanidade: san,
    magia: n(e, 'magiaAtaqueFisico') > 0 ? clip.descrever('magia', e.pm, d.pmMax) : null,
    mentindo: vidaDita !== vida || san !== clip.descrever('sanidade', e.san, d.sanMax),
  };
}

/** Resumo para o fim da partida e para o diário. */
export function resumo(e) {
  const s = e.stats;
  const enganos = s.golpesNoVazio + s.aliadosFeridos + s.emboscadas + s.miragensPisadas + s.paredesFalsas;
  return {
    semente: e.semente, tema: e.tema, origem: e.origem,
    resultado: e.fim?.tipo ?? 'andando', andar: e.andar, turnos: s.turnos,
    enganos, revelados: s.fantasmasRevelados + s.disfarcesRevelados + s.miragensReveladas,
    stats: { ...s }, pistas: [...e.pistas], diario: [...e.diario],
  };
}
