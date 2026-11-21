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
  bonusVida: 12,
  /**
   * Sanidade do jogo a partir da do motor: comprime a distância (Espírito
   * começa com 18 e Corpo com 4 no manual) e dá fôlego a todos.
   */
  sanidade: (motor) => Math.round(motor * 0.75) + 12,
  /** Raio de visão por nível de Consciência (0 Alerta … 5 Apagado): o cansaço fecha a vista. */
  raioVisao: [7, 7, 7, 6, 5, 4],
  /**
   * Consciência: medida só deste jogo (não existe no Clip). Diz o quanto você
   * percebe o espaço. Cai com o tempo, com pancadas e com o sangue perdido;
   * volta descansando, com fôlego e na escada. Em zero, você desmaia.
   */
  consciencia: {
    maximo: (fisico, percepcao, sabedoria) => 13 + 2 * (fisico + percepcao + sabedoria),
    /** Turnos por −1, por andar. */
    cansaco: [40, 36, 32, 28, 24],
    /** Com o corpo Muito ferido ou pior, o cansaço vem duas vezes mais rápido. */
    sangrando: 0.5,
    /** Golpe recebido com este dano ou mais tira 1 de Consciência. */
    pancada: 4,
    /** Esperar sem perigo à vista: +1 a cada tantos turnos seguidos. */
    descanso: 4,
    escada: 4,
    desmaio: { turnos: 5, depois: 0.5 },
  },
  /** O que o corpo ferido faz, por nível de Vida (0 Intacto … 5 Caído). */
  corpo: {
    /** Chance de um passo custar dois turnos (arrastar a perna). */
    lento: [0, 0, 0, 0.2, 0.4, 0.4],
    /** Mãos que tremem: menos no Ataque. */
    tremor: [0, 0, 0, 0, 1, 1],
    /** A partir deste nível, você deixa sangue por onde passa. */
    sangra: 2,
    /** Bestas farejam sangue fresco a esta distância e por este tempo. */
    faro: 6,
    sangueDura: 60,
  },
  /**
   * Fio do andar (0.3.0): o tempo antes de a ronda chegar. Acaba → a ronda
   * entra pela porta por onde você entrou, caça você sem parar e o tempo pesa
   * o dobro na cabeça. Cada peça do caminho devolve um pedaço do fio.
   */
  fio: { turnos: (a) => 420 + 30 * a + 100 * (a <= 2 ? 1 : a <= 4 ? 2 : 3), peca: 50, avisos: [0.5, 0.25, 0.1] },
  /** A ronda anda dois de cada três turnos: quem corre escapa; quem para, não. */
  ronda: { ataque: 1, defesa: 2, arma: 1, vontade: 6, passo: 3 },
  /**
   * Fôlego (0.3.1): correr sem parar cansa. Cada passo soma 1; qualquer turno
   * parado ou fazendo outra coisa tira 3. Acima de `limite`, cada tantos passos
   * tiram 1 de Consciência; acima de `forte`, alguns passos custam dois turnos.
   * Contrapeso do fio: a pressa tem preço.
   */
  folego: { limite: 22, forte: 38, custo: 7, passoDuplo: 0.3, recupera: 3 },
  /**
   * Gente que só vigia (0.4.0): humanos comuns começam vigiando. Não caçam; se
   * você fica perto por `paciencia` turnos, mandam você embora (viram caça).
   * Bater em quem vigia dá alarme (todos os humanos do andar caçam) e pesa.
   * Ver a intenção pede Percepção `percepcao` ou olhar de novo.
   */
  vigia: { ativo: true, paciencia: 4, percepcao: 2, distancia: 2 },
  /** Desfazer uma mentira devolve clareza (Sanidade). */
  clareza: 1,
  /**
   * Tarefas do andar (0.5.0): a passagem para a escada fica trancada até você
   * fazer, em ordem, as tarefas espalhadas pelas salas (1 nos andares 1 e 2,
   * 2 no 3º e 4º, 3 no 5º). Cada tarefa alonga o fio do andar em 40 turnos.
   */
  tarefas: (a) => (a <= 2 ? 1 : a <= 4 ? 2 : 3),
  /** Golpe preparado: chance de o monstro colado preparar, e o que o golpe pesado soma. */
  preparo: { chance: 0.3, ataque: 2, dano: 2, intervalo: 3 },
  /** Defender: soma à Defesa no turno do mundo (mais contra golpe preparado). */
  defender: { defesa: 2, contraPesado: 2 },
  /** Empurrar: Força (+ Ataque Corporal) contra 2 + Defesa do alvo. */
  empurrar: { base: 2, tontoParede: 2, tonto: 1 },
  /** Janelas: quantas por andar, chance de algo passar e de algo tentar entrar (por turno, por janela à vista). */
  janela: { porAndar: (a) => 2 + Math.min(2, a - 1), passa: 0.06, invasao: (a) => 0.002 + 0.002 * a, batidas: 3 },
  /** Coisas que fazem mal de olhar: perda de Sanidade ao examinar (e ao ver o corpo). */
  perturbador: { foto: 2, carta: 1, corpo: 1, verCorpo: 1 },
  perturbadoresPorAndar: (a) => (a === 1 ? 1 : 2),
  /** Buraco de verdade (andares 2 a 4): chance por andar e dano da queda. */
  buraco: { chance: 0.6, dano: 3 },
  /** Turnos por −1 de Sanidade, por andar: o silêncio pesa mais lá no fundo. */
  drenagem: [56, 50, 44, 38, 32],
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
  /** Sanidade que o Corpo recupera ao derrubar uma fera de verdade (0.8.0). */
  alivioCorpo: 1,
  /** Resistência reduz a Sanidade perdida para golpes de vulto e de assombro (0.8.0). */
  resistenciaNaCabeca: true,
  aliado: { vida: 6, ataque: 1, defesa: 1, arma: 1 },
  inventario: 5,
  /** Vida recuperada ao trocar de andar. */
  folegoNaEscada: 5,
  itens: { cura: 6, calma: 4, ancora: 2, altar: 5, folego: 6 },
  /** Perdas de Sanidade por evento. */
  perda: { golpeNoVazio: 1, miragem: 1, emboscada: 1, matarHumano: 1, ferirAliado: 2, matarAliado: 4, encararFalhou: 1, verAssombro: 1, atacarInocente: 1, matarInocente: 2, antipatia: 1 },
  /** Surto: turnos fora de controle; depois volta com metade da Sanidade e uma cicatriz. */
  surto: { turnos: 5, sanidadeDepois: 0.5, calmaDepois: 15, cicatriz: 3, maximo: 3 },
  ancora: { turnos: 12, dificuldade: 3, ganho: 2 },
  /** Dificuldade de Olhar de novo: base + nível de lucidez. */
  olhar: { base: 2, insistirMaximo: 2 },
  convencer: 3,
  encarar: 4,
  conversarAliado: 3,
  /** Dom da Mente: custo em PM, alcance e turnos de atordoamento de quem é atingido (0.3.2). */
  magia: { custo: 2, alcance: 6, tonto: 1, tontoRonda: 2 },
  /** Chance por turno de notar sozinho que algo está errado, por nível de Sentidos + Discernimento. */
  notar: 0.05,
  /** Nível mínimo de alucinação por andar (só vale se você não estiver Lúcido). */
  pressaoDoAndar: [0, 0, 1, 2, 3],
  epocaParedes: 14,
  epocaMemoria: 20,
  /** Sanidade baixa engana sobre **quem e o que** as coisas são (por nível de lucidez). */
  alu: {
    disfarce: [0, 0.08, 0.22, 0.42, 0.62, 0.8],
    /** Item de verdade que parece um monstro parado. */
    itemMonstro: [0, 0, 0.12, 0.28, 0.42, 0.55],
    sussurro: [0, 0.006, 0.02, 0.04, 0.06, 0.08],
    golpeFalso: [0, 0, 0, 0.01, 0.025, 0.04],
    mentiraPalavras: [0, 0, 0, 0.5, 0.8, 1],
  },
  /** Consciência baixa engana sobre **o espaço** (por nível de Consciência). */
  aluCons: {
    fantasma: [0, 0.004, 0.015, 0.03, 0.05, 0.07],
    miragem: [0, 0.004, 0.014, 0.028, 0.045, 0.06],
    paredes: [0, 0, 1, 3, 5, 7],
    /** Portas pintadas na parede, muitas vezes ao lado de uma porta de verdade. */
    portas: [0, 0, 1, 2, 3, 4],
    /** Buracos que não existem, de preferência nos corredores. */
    buracos: [0, 0, 0, 1, 2, 3],
    /** Chance de um passo no corredor não levar a lugar nenhum. */
    infinito: [0, 0, 0, 0.06, 0.12, 0.18],
    memoria: [0, 0, 0.04, 0.1, 0.2, 0.3],
    esquecer: [0, 0, 0, 0, 0.12, 0.25],
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
    resumo: 'Luta bem e aguenta pancada, até as que vêm da cabeça. Enxerga mal o que é falso: para olhar de novo, insiste com o corpo. Derrubar uma fera assenta os nervos.',
  },
  mente: {
    caminho: 'mente',
    atributos: { inteligencia: 2, percepcao: 2, sabedoria: 1 },
    aprimoramentos: { sentidos: 1, discernimento: 1, raciocinio: 1 },
    pericias: [{ id: 'magiaAtaqueFisico', nivel: 2 }],
    arma: false,
    resumo: 'Olha de novo e quase sempre acerta. Tem um dom que alcança longe e cansa a cabeça. Morre fácil de perto.',
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
  buraco: 'Nem todo buraco é buraco. O de verdade sopra ar frio de baixo.',
  infinito: 'Quando o corredor não acaba, é a cabeça cansada. Pare e descanse.',
  imovel: 'Bicho que nunca se mexe talvez nem seja bicho. Olhe de novo antes de quebrar.',
  sangue: 'Sangrando, você deixa rastro. As bestas seguem o rastro.',
  vigia: 'Nem todo mundo aqui quer te pegar. Quem só vigia não vem atrás; bater nele põe todos contra você.',
  clareza: 'Desfazer uma mentira clareia a cabeça. Olhar de novo vale mais que bater.',
  folego: 'Quem corre sem parar perde o ar e a vista. Um instante parado devolve o fôlego.',
  tarefa: 'A escada não basta: cada andar pede uma coisa antes da outra. O painel diz qual é a próxima e em que sala.',
  descanso: 'Esperar quieto, sem nada à vista, devolve a atenção. Mas o tempo pesa na cabeça.',
  preparo: 'Quem prepara um golpe pesado avisa. Saia de perto, defenda ou empurre antes.',
  janela: 'Janela que bate pode virar porta. Segure antes de o vidro ceder.',
  fio: 'O fio não espera. Cada peça do caminho devolve um pouco dele.',
  porta: 'Cansado, você vê portas onde há parede. A porta de verdade tem luz por baixo.',
};

const soma = (l) => l.reduce((a, b) => a + b, 0);
const NOMES_LUCIDEZ = ['Lúcido', 'Inquieto', 'Abalado', 'Perturbado', 'Por um fio', 'Fora de si'];
const NOMES_VIDA = ['Intacto', 'Arranhado', 'Ferido', 'Muito ferido', 'À beira do colapso', 'Caído'];
export const NOMES_CONSCIENCIA = ['Alerta', 'Desperto', 'Cansado', 'Zonzo', 'Apagando', 'Apagado'];

/** Faixa de 0 a 5 com os mesmos cortes de `descrever` do motor (cheio, ¾, ½, ¼, acima de zero, zero). */
function faixa(atual, max) {
  if (max <= 0 || atual <= 0) return 5;
  const r = atual / max;
  return r >= 1 ? 0 : r >= 0.75 ? 1 : r >= 0.5 ? 2 : r >= 0.25 ? 3 : 4;
}
export const nivelConsciencia = faixa;
export const nivelVida = (vida, max) => NOMES_VIDA.indexOf(clip.descrever('vida', vida, max));

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
    consMax: PARAM.consciencia.maximo(n(e, 'fisico'), n(e, 'percepcao'), n(e, 'sabedoria')),
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
    desmaio: 0,
    descanso: 0,
    pecas: [],
    defendendo: false,
    corrida: 0,
    variacao: {},
    stats: {
      turnos: 0, golpesNoVazio: 0, aliadosFeridos: 0, aliadosMortos: 0, emboscadas: 0, miragensPisadas: 0,
      paredesFalsas: 0, fantasmasRevelados: 0, disfarcesRevelados: 0, miragensReveladas: 0, fantasmasGolpes: 0,
      surtos: 0, vencidos: 0, pacificados: 0, espantados: 0, olhares: 0, olharesCertos: 0,
      turnosPorLucidez: [0, 0, 0, 0, 0, 0], perdas: {}, ganhos: {}, fantasmasCriados: 0, disfarcesCriados: 0, miragensCriadas: 0,
      turnosPorConsciencia: [0, 0, 0, 0, 0, 0], turnosPorVida: [0, 0, 0, 0, 0, 0], cansaco: {},
      desmaios: 0, portasFalsas: 0, buracosFalsos: 0, quedas: 0, passosPerdidos: 0, passosArrastados: 0, farejado: 0,
      itensQuebrados: 0, itensDisfarcados: 0, itensRevelados: 0, perturbadores: 0,
      rondas: 0, preparos: 0, pesadosRecebidos: 0, pesadosEvitados: 0, defesas: 0, contraGolpes: 0, empurroes: 0, empurroesCertos: 0,
      ofegante: 0, alarmes: 0, inocentesFeridos: 0, inocentesMortos: 0, antipatias: 0, clarezas: 0, convencidosVigias: 0, quedasDeMonstro: 0, portasFechadas: 0, invasoes: 0, janelasBarradas: 0, batidasFalsas: 0, turnosSemFio: 0,
    },
  };
  const d = derivados(e);
  e.vida = d.vidaMax;
  e.san = d.sanMax;
  e.pm = d.pmMax;
  e.cons = d.consMax;
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
    const tipo = ponderado(r, [['cura', 3], ['calma', 3.5], ['folego', 2], ['ancora', 1.2], ['arma', a <= 3 ? 1 : 0.5], ['armadura', 0.8]]);
    const p = livre(i === 0 ? [entrada, ...fundo] : fundo);
    if (p) objetos.push({ tipo: 'item', ...p, real: true, item: sortearItem(r, th, tipo, a) });
  }
  if (a >= 2 && chance(r, 0.75)) {
    const p = livre(fundo);
    if (p) objetos.push({ tipo: 'altar', ...p, real: true });
  }
  // Coisas que fazem mal de olhar.
  for (let i = 0; i < PARAM.perturbadoresPorAndar(a); i++) {
    const p = livre(fundo);
    if (p) objetos.push({ tipo: 'perturbador', tipoP: ponderado(r, [['foto', 1], ['carta', 1.2], ['corpo', 1.4]]), ...p, real: true });
  }
  // Um buraco de verdade, no meio de uma sala: atalho para baixo, com queda.
  if (a >= 2 && a < PARAM.andares && chance(r, PARAM.buraco.chance)) {
    const salas = fundo.filter((q) => q !== ultima && q.w >= 4 && q.h >= 4);
    if (salas.length) {
      const q = escolher(r, salas);
      const meio = pontosDaSala(q).filter((pt) => pt.x > q.x && pt.x < q.x + q.w - 1 && pt.y > q.y && pt.y < q.y + q.h - 1 && !ocupado.has(pt.y * mapa.w + pt.x));
      if (meio.length) {
        const pt = escolher(r, meio);
        ocupado.add(pt.y * mapa.w + pt.x);
        por(mapa, pt.x, pt.y, T.BURACO);
      }
    }
  }
  // Peça do caminho (andares 2 a 4), numa sala longe da entrada.
  if (a >= 2 && a <= 4) {
    const p = livre(longe);
    if (p) objetos.push({ tipo: 'peca', indice: a - 2, ...p, real: true });
  }
  // Janelas na parede de cima das salas.
  const janelas = [];
  const candidatas = [];
  for (const q of mapa.salas.slice(1)) {
    for (let x = q.x + 1; x < q.x + q.w - 1; x++) {
      const y = q.y - 1;
      if (tile(mapa, x, y) !== T.PAREDE || tile(mapa, x, y - 1) !== T.PAREDE || tile(mapa, x, y + 1) !== T.CHAO) continue;
      if (tile(mapa, x - 1, y) !== T.PAREDE || tile(mapa, x + 1, y) !== T.PAREDE) continue;
      candidatas.push({ x, y });
    }
  }
  for (const c of embaralhar(r, candidatas)) {
    if (janelas.length >= PARAM.janela.porAndar(a)) break;
    if (janelas.some((j) => Math.abs(j.x - c.x) + Math.abs(j.y - c.y) < 4)) continue;
    janelas.push({ ...c, estado: 'fechada' });
  }
  // Tarefas: tranca as entradas da última sala e espalha os passos pelas salas alcançáveis.
  const trancas = [];
  for (let y = ultima.y - 1; y <= ultima.y + ultima.h; y++) {
    for (let x = ultima.x - 1; x <= ultima.x + ultima.w; x++) {
      const borda = x === ultima.x - 1 || x === ultima.x + ultima.w || y === ultima.y - 1 || y === ultima.y + ultima.h;
      const canto = (x === ultima.x - 1 || x === ultima.x + ultima.w) && (y === ultima.y - 1 || y === ultima.y + ultima.h);
      if (!borda || canto) continue;
      const t = tile(mapa, x, y);
      if (t === T.CHAO || t === T.PORTA || t === T.ABERTA) { por(mapa, x, y, T.PORTA); trancas.push(y * mapa.w + x); }
    }
  }
  const bloqueado = new Set(trancas);
  const alcance = new Set([inicio.y * mapa.w + inicio.x]);
  const fila = [inicio];
  while (fila.length) {
    const c = fila.shift();
    for (const [dx, dy] of VIZINHOS) {
      const x = c.x + dx, y = c.y + dy, k = y * mapa.w + x;
      if (alcance.has(k) || bloqueado.has(k) || [T.PAREDE, T.BURACO].includes(tile(mapa, x, y))) continue;
      alcance.add(k);
      fila.push({ x, y });
    }
  }
  const salasTarefa = embaralhar(r, mapa.salas.slice(1, -1).filter((q) => alcance.has((q.y + Math.floor(q.h / 2)) * mapa.w + q.x + Math.floor(q.w / 2))));
  const nTarefas = Math.min(PARAM.tarefas(a), salasTarefa.length);
  for (let i = 0; i < nTarefas; i++) {
    const q = salasTarefa[i];
    const p = livre([q]);
    if (p) objetos.push({ tipo: 'tarefa', ordem: i, sala: q.nome, ...p, real: true });
  }
  const totalTarefas = objetos.filter((o) => o.tipo === 'tarefa').length;
  return { mapa, inicio, entidades, objetos, janelas, trancas: totalTarefas ? trancas : [], totalTarefas };
}

function criarMonstro(m, p, esc) {
  const vigia = PARAM.vigia.ativo && m.categoria === 'humano' && m.andar < 5;
  return {
    vigia,
    tipo: 'monstro', especie: m.id, categoria: m.categoria, x: p.x, y: p.y,
    ataque: m.ataque + esc.combate, defesa: m.defesa + esc.combate, vida: m.vida + esc.vida, vidaMax: m.vida + esc.vida,
    arma: m.arma, armadura: 0, vontade: m.vontade, mental: m.mental ? m.mental + esc.combate : 0, rapido: !!m.rapido, estado: vigia ? 'vigiando' : 'parado',
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
  return { tipo, nome: escolher(r, tipo === 'folego' ? th.folego : th.itens[tipo]) };
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
  e.sangue = new Map();
  e.beira = null;
  e.salaAtual = -1;
  e.alarmeNoAndar = false;
  e.cargasAncora = derivados(e).cargasAncora;
  e.janelas = c.janelas.map((j) => ({ ...j }));
  e.trancas = new Set(c.trancas);
  e.missao = { total: c.totalTarefas, feitos: 0 };
  marcarProximaTarefa(e, true);
  e.entrada = { ...c.inicio };
  e.fioMax = PARAM.fio.turnos(a);
  e.fio = e.fioMax;
  e.avisosFio = 0;
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

/** O que o personagem pensa, na primeira pessoa; a narração fala com você. */
const VOZ = { voz: true };

const efeito = (e, tipo) => e.efeitos.push({ tipo, turno: e.turno });

export const lucidez = (e) => nivelLucidez(e.san, derivados(e).sanMax);
/** Nível de Consciência (0 Alerta … 5 Apagado). */
export const atencao = (e) => nivelConsciencia(e.cons, derivados(e).consMax);
/** Nível de Vida (0 Intacto … 5 Caído). */
export const ferimento = (e) => Math.max(0, nivelVida(e.vida, derivados(e).vidaMax));
const idx = (e, x, y) => y * e.mapa.w + x;
const rng = (e) => comoFuncao(e.rDados);
const temaDe = (e) => TEMAS[e.tema];

/** Espécie por id: monstros, aliados e a ronda do tema. */
const catalogo = (th, id) => (id === 'ronda' ? { id: 'ronda', ...th.ronda } : th.monstros.find((m) => m.id === id) ?? th.aliados.find((m) => m.id === id));

export function especie(e, ent) {
  const th = temaDe(e);
  return catalogo(th, ent.especie);
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
  // Serenidade e Fé seguram os sustos (0.4.0: a Fé passa a contar).
  // 0.8.0: pancada de vulto ou de assombro é pancada; quem tem Resistência aguenta também na cabeça.
  const fisico = PARAM.resistenciaNaCabeca && (motivo === 'vulto' || motivo === 'assombro') ? n(e, 'resistencia') : 0;
  const red = reduzivel ? n(e, 'serenidade') + Math.floor(n(e, 'fe') / 2) + fisico : 0;
  const q = Math.min(e.san, Math.max(0, quanto - red));
  e.stats.perdas[motivo] = (e.stats.perdas[motivo] ?? 0) + q;
  e.san = Math.max(0, e.san - q);
  return q;
}

function perderCons(e, quanto, motivo = 'outro') {
  const q = Math.min(e.cons, Math.max(0, quanto));
  e.stats.cansaco[motivo] = (e.stats.cansaco[motivo] ?? 0) + q;
  e.cons -= q;
  return q;
}

function ganharCons(e, quanto) {
  e.cons = Math.min(derivados(e).consMax, e.cons + quanto);
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
  if (ent.item) return { especie: null, categoria: 'item' };
  if (ent.tipo === 'aliado') return { especie: ent.especie, categoria: 'aliado' };
  return { especie: ent.especie, categoria: ent.categoria };
}

function nomeAparente(e, ent) {
  const ap = aparencia(e, ent);
  const th = temaDe(e);
  if (ap.categoria === 'item') return ent.item.nome;
  return catalogo(th, ap.especie)?.nome ?? 'vulto';
}

const Maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Os andares mais fundos mentem para todos, até para quem está bem. */
const comPressao = (e, nivel) => (nivel === 0 ? 0 : Math.max(nivel, PARAM.pressaoDoAndar[e.andar - 1]));
/** Quanto a Sanidade engana (quem e o que as coisas são). */
const nivelCabeca = (e) => comPressao(e, lucidez(e));
/** Quanto a Consciência engana (o espaço). */
const nivelEspaco = (e) => comPressao(e, atencao(e));

/* ------------------------------------------------------------------------ */
/* Visão                                                                    */
/* ------------------------------------------------------------------------ */

function atualizarVisao(e) {
  const raio = PARAM.raioVisao[atencao(e)];
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
  for (const o of e.objetos) {
    const ve = e.vis.has(idx(e, o.x, o.y));
    if (!ve && o.visivel) { o.aparencia = null; o.decidido = false; }
    o.visivel = ve;
  }
  // Sala nova: nome no registro (com a cabeça ruim, o nome pode mentir).
  const s = e.mapa.salas.findIndex((q) => e.jogador.x >= q.x && e.jogador.x < q.x + q.w && e.jogador.y >= q.y && e.jogador.y < q.y + q.h);
  if (s >= 0 && s !== e.salaAtual) {
    e.salaAtual = s;
    const lv = nivelCabeca(e);
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
  if (e.desmaio > 0) a = { tipo: 'esperar' };
  else if (a.tipo !== 'esperar') e.avisoSemDescanso = false;
  else if (e.surto > 0) a = acaoDoSurto(e);
  e.arrastou = false;
  e.descansou = false;
  e.defendendo = false;
  const antes = { vida: e.vida, cons: e.cons, san: e.san, pm: e.pm, x: e.jogador.x, y: e.jogador.y, andar: e.andar };
  // No surto e no desmaio, o tempo passa mesmo que o corpo não faça nada útil.
  const gastou = executar(e, a) || e.surto > 0 || e.desmaio > 0;
  if (gastou && !e.fim && !e.escolha) mundo(e);
  // A perna arrastada: o mundo anda mais uma vez.
  if (gastou && e.arrastou && !e.fim && !e.escolha) mundo(e);
  // Parou, ou fez outra coisa: o fôlego volta.
  const andou = e.andar === antes.andar && (e.jogador.x !== antes.x || e.jogador.y !== antes.y);
  if (gastou && !andou) {
    const antesCorrida = e.corrida;
    e.corrida = Math.max(0, e.corrida - PARAM.folego.recupera);
    if (antesCorrida > PARAM.folego.limite && e.corrida <= PARAM.folego.limite) msg(e, 'O ar volta aos poucos. Já consigo seguir.', 'bom', VOZ);
  }
  // Quanto cada medida mudou neste turno (a tela mostra a direção, não o número).
  e.variacao = { vida: e.vida - antes.vida, cons: e.cons - antes.cons, san: e.san - antes.san, pm: e.pm - antes.pm };
  return e;
}

function executar(e, a) {
  switch (a.tipo) {
    case 'mover': return mover(e, a.dx, a.dy, false);
    case 'atacar': return mover(e, a.dx, a.dy, true);
    case 'esperar': return esperar(e);
    case 'olhar': return olhar(e, a.alvo);
    case 'falar': return falarCom(e, a.alvo);
    case 'encarar': return encarar(e, a.alvo);
    case 'magia': return magia(e, a.alvo);
    case 'ancorar': return ancorar(e);
    case 'usar': return usar(e, a.indice);
    case 'defender': e.defendendo = true; e.stats.defesas++; return true;
    case 'empurrar': return empurrar(e, a.alvo);
    case 'fechar': return fecharPorta(e);
    default: return false;
  }
}

/** Entidade que a pessoa vê numa casa (a real ou um vulto). */
/** Entidade que a pessoa vê numa casa (a real, um vulto ou um item com cara de monstro). */
function visivelEm(e, x, y) {
  if (!e.vis.has(idx(e, x, y))) return reaisEm(e, x, y) ?? null;
  return reaisEm(e, x, y) ?? e.entidades.find((o) => o.tipo === 'fantasma' && o.x === x && o.y === y) ??
    e.objetos.find((o) => o.aparencia && !o.usado && o.x === x && o.y === y) ?? null;
}

function alvoPorId(e, id) {
  return e.entidades.find((x) => x.id === id && (x.vida > 0 || x.tipo === 'fantasma') && e.vis.has(idx(e, x.x, x.y))) ??
    e.objetos.find((o) => (o.id === id || (o.aparencia && o.idFalso === id)) && !o.usado && e.vis.has(idx(e, o.x, o.y))) ?? null;
}

/** Ficar parado. Sem perigo à vista, é descanso; com perigo, o personagem diz que não consegue. */
function esperar(e) {
  e.descansou = e.desmaio === 0 && semPerigo(e);
  if (!e.descansou && e.desmaio === 0 && e.cons < derivados(e).consMax && !e.avisoSemDescanso) {
    const quem = e.entidades.find((m) => perigoVisivel(e, m));
    if (quem) {
      e.avisoSemDescanso = true;
      msg(e, `Não consigo fechar os olhos com ${artigoDe(nomeAparente(e, quem))} ali. Preciso de um canto sem ninguém à vista.`, 'perigo', VOZ);
    }
  }
  return true;
}

const perigoVisivel = (e, m) => m.tipo === 'monstro' && m.vida > 0 && e.vis.has(idx(e, m.x, m.y)) && m.estado !== 'pacificado' && m.estado !== 'fugindo' && m.estado !== 'vigiando';

/** Nenhum monstro de verdade à vista, caçando você: dá para fechar os olhos. */
function semPerigo(e) {
  return !e.entidades.some((m) => perigoVisivel(e, m));
}

const ehCorredor = (e, x, y) =>
  (tile(e.mapa, x - 1, y) === T.PAREDE && tile(e.mapa, x + 1, y) === T.PAREDE) || (tile(e.mapa, x, y - 1) === T.PAREDE && tile(e.mapa, x, y + 1) === T.PAREDE);

const CORREDOR_SEM_FIM = [
  'Você anda, e o corredor anda junto.',
  'A mesma mancha na parede. De novo.',
  'Você conta os passos. O fim do corredor não chega mais perto.',
];

function mover(e, dx, dy, forcarAtaque) {
  if (!dx && !dy) return true;
  const x = e.jogador.x + dx, y = e.jogador.y + dy;
  if (!dentro(e.mapa, x, y)) return false;
  const ent = visivelEm(e, x, y);
  if (ent) {
    if (ent.item) return golpearObjeto(e, ent);
    const ap = aparencia(e, ent);
    if (!forcarAtaque && !ent.aparencia && intencaoVisivel(e, ent)) {
      // Já conversaram: dá para passar espremido por quem só vigia (ele repara, mas deixa).
      if (ent.conversou) {
        [ent.x, ent.y, e.jogador.x, e.jogador.y] = [e.jogador.x, e.jogador.y, ent.x, ent.y];
        ent.atencao = (ent.atencao ?? 0) + 1;
        msg(e, `Você passa espremido por ${artigoDe(nomeAparente(e, ent))}.`);
        return true;
      }
      return conversar(e, ent);
    }
    if (forcarAtaque || ap.categoria !== 'aliado') return golpear(e, ent);
    if (ent.estado === 'pacificado' && !ent.aparencia && !forcarAtaque) {
      [ent.x, ent.y, e.jogador.x, e.jogador.y] = [e.jogador.x, e.jogador.y, ent.x, ent.y];
      return true;
    }
    if (ent.estado === 'seguindo' && !ent.aparencia) {
      [ent.x, ent.y, e.jogador.x, e.jogador.y] = [e.jogador.x, e.jogador.y, ent.x, ent.y];
      return true;
    }
    return conversar(e, ent);
  }
  const k = idx(e, x, y);
  const real = tile(e.mapa, x, y);
  const ilusao = e.ilusaoParedes.get(k);
  const janela = e.janelas.find((j) => j.x === x && j.y === y);
  if (real === T.PAREDE && janela) return mexerNaJanela(e, janela);
  if (real === T.PAREDE) {
    if (ilusao === T.CHAO) {
      e.ilusaoParedes.delete(k);
      e.stats.paredesFalsas++;
      msg(e, 'Você bate de frente numa parede sólida. Você jurava que havia uma passagem.', 'mentira');
      ganharPista(e, 'parede');
      return true;
    }
    if (ilusao === T.PORTA) {
      e.ilusaoParedes.delete(k);
      e.stats.portasFalsas++;
      perderCons(e, 1, 'porta');
      msg(e, 'Você empurra a porta e a mão encontra parede. Era só o desenho de uma porta. A cabeça gira.', 'mentira');
      ganharPista(e, 'porta');
      return true;
    }
    return false;
  }
  // Buraco (de verdade ou da cabeça): o primeiro passo só chega à beira.
  const pareceBuraco = ilusao === T.BURACO || (real === T.BURACO && ilusao === undefined);
  if (pareceBuraco) {
    if (e.beira !== k) {
      e.beira = k;
      msg(e, 'Um buraco no chão. Ande de novo para pular.', 'info');
      return false;
    }
    e.beira = null;
    if (real === T.BURACO) return cair(e);
    e.ilusaoParedes.delete(k);
    e.stats.buracosFalsos++;
    perderCons(e, 1, 'buraco');
    msg(e, 'Você pula no buraco e cai de joelhos no chão firme. Não havia buraco.', 'mentira');
    ganharPista(e, 'buraco');
  }
  e.beira = null;
  if (e.trancas.has(k)) {
    const prox = proximaTarefa(e);
    msg(e, `${temaDe(e).tarefas.trancada}${prox ? ` Falta: ${prox.nome}, ${emSala(prox.sala)}.` : ''}`);
    ganharPista(e, 'tarefa');
    return false;
  }
  if (real === T.PORTA) {
    // A porta abrindo já aparece na imagem; o registro fica para o que importa.
    por(e.mapa, x, y, T.ABERTA);
    return true;
  }
  // Corredor sem fim: a cabeça cansada não deixa o passo render.
  const cl = nivelEspaco(e);
  if (ehCorredor(e, e.jogador.x, e.jogador.y) && chance(e.rAlu, PARAM.aluCons.infinito[cl])) {
    e.stats.passosPerdidos++;
    msg(e, escolher(e.rAlu, CORREDOR_SEM_FIM), 'mentira', { mentira: true });
    if (e.stats.passosPerdidos >= 3) ganharPista(e, 'infinito');
    return true;
  }
  const antes = idx(e, e.jogador.x, e.jogador.y);
  const fv = ferimento(e);
  if (fv >= PARAM.corpo.sangra) e.sangue.set(antes, e.turno);
  e.jogador.x = x;
  e.jogador.y = y;
  if (ilusao === T.PAREDE) {
    e.ilusaoParedes.delete(k);
    e.stats.paredesFalsas++;
    msg(e, 'Você atravessa a parede. Ela nunca esteve ali.', 'mentira');
    ganharPista(e, 'parede');
  }
  // Fôlego: correr sem parar cobra da vista e, no limite, das pernas.
  const F = PARAM.folego;
  e.corrida++;
  // Os avisos são o que o personagem sente, não instrução de jogo.
  if (e.corrida === F.limite + 1) { msg(e, 'Estou ofegante. O peito arde e o corredor parece mais comprido. Seria prudente parar um pouco, ou recorrer ao que trago comigo.', 'perigo', VOZ); ganharPista(e, 'folego'); }
  if (e.corrida === F.forte + 1) msg(e, 'As pernas pesam e o ar não vem. Se eu continuar correndo assim, vou cair. Preciso parar.', 'dano', VOZ);
  if (e.corrida > F.limite) {
    e.stats.ofegante++;
    if ((e.corrida - F.limite) % F.custo === 0) perderCons(e, 1, 'corrida');
    if (e.corrida > F.forte && chance(e.rDados, F.passoDuplo)) {
      e.arrastou = true;
      if (!e.ultimoFolego || e.turno - e.ultimoFolego > 10) msg(e, 'Sem ar, paro a cada poucos passos, apoiado na parede.', 'dano', VOZ);
      e.ultimoFolego = e.turno;
    }
  }
  if (chance(e.rDados, PARAM.corpo.lento[fv])) {
    e.arrastou = true;
    e.stats.passosArrastados++;
    if (!e.ultimaPerna || e.turno - e.ultimaPerna > 12) msg(e, 'Você arrasta a perna. Cada passo custa dois.', 'dano');
    e.ultimaPerna = e.turno;
  }
  pisar(e);
  return true;
}

/** Empurrar (Força): tira de perto; contra a parede deixa tonto; num buraco, derruba. */
function empurrar(e, alvoId) {
  const alvo = alvoPorId(e, alvoId);
  if (!alvo || !(alvo.especie || alvo.aparencia)) { msg(e, 'Não há o que empurrar.'); return false; }
  if (distancia(alvo, e.jogador) !== 1) { msg(e, 'Precisa estar colado para empurrar.'); return false; }
  const nome = nomeAparente(e, alvo);
  e.stats.empurroes++;
  if (alvo.tipo === 'fantasma') {
    e.stats.golpesNoVazio++;
    perderSan(e, PARAM.perda.golpeNoVazio, { motivo: 'vazio' });
    msg(e, `Suas mãos atravessam ${artigoDe(nome)}. Não havia nada ali.`, 'mentira');
    removerFantasma(e, alvo);
    ganharPista(e, 'vazio');
    return true;
  }
  if (alvo.item) {
    msg(e, `Você empurra ${artigoDe(nome)} e ele tomba, leve demais. É ${artigo(alvo.item.nome)}.`, 'mentira');
    alvo.aparencia = null;
    alvo.confirmado = true;
    e.stats.itensRevelados++;
    ganharPista(e, 'imovel');
    return true;
  }
  const dx = Math.sign(alvo.x - e.jogador.x), dy = Math.sign(alvo.y - e.jogador.y);
  const t = clip.testar({
    nivel: n(e, 'forca'), objeto: Math.max(n(e, 'ataqueCorporal'), n(e, 'agilidade')),
    dificuldade: PARAM.empurrar.base + (alvo.defesa ?? 1) + (alvo.ronda ? 2 : 0), rng: rng(e),
  });
  if (alvo.tipo === 'aliado') {
    msg(e, `Você empurra ${artigoDe(nome)}. “Ei! O que é isso?”`, 'perigo');
    if (alvo.aparencia) { alvo.aparencia = null; e.stats.disfarcesRevelados++; }
    perderSan(e, 1, { motivo: 'aliado' });
    return true;
  }
  if (!t.sucesso) {
    msg(e, `Você empurra ${artigoDe(nome)}, que finca o pé e não sai do lugar.`);
    if (alvo.tipo === 'monstro') alvo.estado = 'cacando';
    return true;
  }
  e.stats.empurroesCertos++;
  alvo.preparando = false;
  if (alvo.estado === 'vigiando') provocar(e, alvo);
  const x = alvo.x + dx, y = alvo.y + dy;
  if (tile(e.mapa, x, y) === T.BURACO && !alvo.ronda) {
    alvo.vida = 0;
    e.stats.quedasDeMonstro++;
    e.stats.vencidos++;
    msg(e, `Você empurra ${artigoDe(nome)} para dentro do buraco. Um baque lá embaixo, e silêncio.`, 'golpe');
    return true;
  }
  const livre = tile(e.mapa, x, y) !== T.PAREDE && tile(e.mapa, x, y) !== T.PORTA && tile(e.mapa, x, y) !== T.BURACO && !reaisEm(e, x, y);
  if (livre) {
    alvo.x = x;
    alvo.y = y;
    alvo.tonto = PARAM.empurrar.tonto;
    msg(e, `Você empurra ${artigoDe(nome)} para longe.`, 'golpe');
  } else {
    alvo.tonto = PARAM.empurrar.tontoParede;
    msg(e, `Você joga ${artigoDe(nome)} contra a parede. Fica tonto.`, 'golpe');
  }
  if (alvo.tipo === 'monstro') alvo.estado = 'cacando';
  return true;
}

/** Fechar uma porta aberta ao lado: as bestas não abrem portas. */
function fecharPorta(e) {
  for (const [dx, dy] of VIZINHOS) {
    const x = e.jogador.x + dx, y = e.jogador.y + dy;
    if (tile(e.mapa, x, y) !== T.ABERTA || reaisEm(e, x, y)) continue;
    por(e.mapa, x, y, T.PORTA);
    e.stats.portasFechadas++;
    msg(e, 'Você fecha a porta. Bichos não abrem portas; gente abre.', 'info');
    return true;
  }
  msg(e, 'Não há porta aberta ao seu lado.');
  return false;
}

/** Andar contra uma janela: olhar lá fora, ou segurar se algo está batendo. */
function mexerNaJanela(e, j) {
  const th = temaDe(e);
  if (j.estado === 'batendo' && j.falsa) {
    j.estado = 'fechada';
    e.stats.batidasFalsas++;
    perderSan(e, PARAM.perda.miragem, { motivo: 'miragem' });
    msg(e, 'Você segura a janela com toda a força. Lá fora, nada. Ninguém batia.', 'mentira');
    return true;
  }
  if (j.estado === 'batendo') {
    j.estado = 'barrada';
    e.stats.janelasBarradas++;
    msg(e, th.janela.barra, 'bom');
    ganharPista(e, 'janela');
    return true;
  }
  if (j.estado === 'barrada') { msg(e, 'A janela está escorada.'); return false; }
  if (j.estado === 'quebrada') {
    j.estado = 'barrada';
    e.stats.janelasBarradas++;
    msg(e, 'Você tapa o buraco da janela com o que encontra.', 'info');
    return true;
  }
  msg(e, th.janela.fora);
  return false;
}

/** Janelas: algo passa lá fora; às vezes algo bate e entra. */
function janelas(e) {
  const th = temaDe(e);
  const J = PARAM.janela;
  const lv = nivelCabeca(e);
  for (const j of e.janelas) {
    const k = idx(e, j.x, j.y);
    const perto = e.vis.has(k) || e.vis.has(idx(e, j.x, j.y + 1));
    if (j.estado === 'batendo') {
      j.batidas++;
      if (j.batidas < J.batidas) { if (perto) msg(e, th.janela.bate, 'perigo', j.falsa ? { mentira: true } : {}); continue; }
      if (j.falsa) {
        j.estado = 'fechada';
        e.stats.batidasFalsas++;
        if (perto) msg(e, th.janela.falsa, 'mentira', { mentira: true });
        continue;
      }
      const dentro = { x: j.x, y: j.y + 1 };
      j.estado = 'quebrada';
      if (perto) msg(e, th.janela.quebra, 'perigo');
      if (!livreParaAndar(e, dentro.x, dentro.y, null)) continue;
      const comuns = th.monstros.filter((q) => q.andar <= Math.max(2, e.andar) && q.andar < 5 && q.categoria !== 'assombro');
      const m = criarMonstro(escolher(e.rIA, comuns), dentro, PARAM.escala(e.andar));
      m.id = 'e' + e.proximoId++;
      m.estado = 'cacando';
      m.ultimo = { ...e.jogador };
      e.entidades.push(m);
      e.stats.invasoes++;
      continue;
    }
    if (j.estado !== 'fechada' || !perto) continue;
    if (chance(e.rIA, J.passa)) {
      j.passou = e.turno;
      j.quem = escolher(e.rIA, th.monstros.filter((q) => q.andar < 5)).id;
      if (!e.viuPassar) { e.viuPassar = true; msg(e, th.janela.passa, 'sussurro'); }
    }
    // Mais perto do fim do fio, mais vontade de entrar. Com a cabeça ruim, há batidas que ninguém dá.
    const urgencia = 1 + 2 * (1 - e.fio / e.fioMax);
    const real = chance(e.rIA, J.invasao(e.andar) * urgencia);
    const falsa = !real && lv >= 3 && chance(e.rAlu, J.invasao(e.andar) * (lv - 2));
    if (real || falsa) {
      j.estado = 'batendo';
      j.batidas = 0;
      j.falsa = falsa;
      msg(e, th.janela.bate, 'perigo', falsa ? { mentira: true } : {});
    }
  }
}

/** Cair pelo buraco de verdade: atalho para o andar de baixo, com tombo. */
function cair(e) {
  const dano = PARAM.buraco.dano;
  e.vida -= dano;
  e.stats.quedas++;
  e.ultimoGolpe = 'a queda';
  efeito(e, 'golpe');
  msg(e, 'O chão some debaixo de você. Você cai no escuro e bate com força lá embaixo.', 'dano');
  if (e.vida <= 0) return true;
  anotar(e, 'Caiu por um buraco até o andar de baixo.');
  descer(e, true);
  return true;
}

function pisar(e) {
  const { x, y } = e.jogador;
  for (const o of e.objetos.filter((q) => q.x === x && q.y === y && !q.usado)) {
    if (!o.real) {
      o.usado = true;
      e.stats.miragensPisadas++;
      // Item falso só decepciona; escada ou saída falsa abala.
      // 0.4.0: acreditar numa mentira sempre custa, até num item falso.
      const q = perderSan(e, PARAM.perda.miragem, { motivo: 'miragem' });
      if (o.tipo === 'peca') ganharPista(e, 'sombra');
      const oque = { item: 'Você estende a mão e', escada: 'Você pisa no primeiro degrau e', saida: 'Você corre para a saída e', altar: 'Você se ajoelha e', peca: 'Você se abaixa para pegar e' }[o.tipo];
      msg(e, `${oque} não há nada ali.${q ? ' Sua cabeça lateja.' : ''}`, 'mentira');
      continue;
    }
    if (o.tipo === 'item') pegar(e, o);
    else if (o.tipo === 'perturbador') examinar(e, o);
    else if (o.tipo === 'escada') descer(e);
    else if (o.tipo === 'peca') pegarPeca(e, o);
    else if (o.tipo === 'tarefa') fazerTarefa(e, o);
    else if (o.tipo === 'saida') {
      const inteira = e.pecas.length >= 3;
      e.fim = { tipo: 'fuga', turno: e.turno, andar: e.andar, pecas: e.pecas.length, inteira };
      msg(e, temaDe(e).fuga, 'fim');
      msg(e, inteira ? temaDe(e).pecas.inteiro : temaDe(e).pecas.falta, 'fim');
      anotar(e, inteira ? 'Saiu com o caminho inteiro.' : `Saiu com ${['nenhuma', 'uma', 'duas'][e.pecas.length]} das três peças do caminho.`);
    } else if (o.tipo === 'altar') {
      o.usado = true;
      ganharSan(e, PARAM.itens.altar + n(e, 'esperanca'), 'altar');
      e.cargasAncora += 1;
      msg(e, temaDe(e).altarTexto, 'bom');
    }
  }
}

/** O próximo passo da tarefa do andar (nome e sala), ou null se já abriu. */
function proximaTarefa(e) {
  if (!e.missao || e.missao.feitos >= e.missao.total) return null;
  const o = e.objetos.find((x) => x.tipo === 'tarefa' && x.ordem === e.missao.feitos);
  return o ? { nome: temaDe(e).tarefas.passos[o.ordem].nome, sala: o.sala, x: o.x, y: o.y } : null;
}

/** A próxima tarefa fica marcada no mapa (você sabe onde ir, não o que há no caminho). */
function marcarProximaTarefa(e, inicio = false) {
  const prox = proximaTarefa(e);
  if (!prox) return;
  e.visto[idx(e, prox.x, prox.y)] = 1;
  if (inicio) msg(e, `${temaDe(e).tarefas.trancada} Primeiro: ${artigo(prox.nome)}, ${emSala(prox.sala)}.`, 'pista');
}

/** Fazer um passo da tarefa: só serve na ordem certa. */
function fazerTarefa(e, o) {
  const th = temaDe(e);
  const passo = th.tarefas.passos[o.ordem];
  if (o.ordem > e.missao.feitos) {
    const prox = proximaTarefa(e);
    msg(e, `${Maiuscula(artigo(passo.nome))}. Ainda não serve: antes, ${artigo(prox.nome)}, ${emSala(prox.sala)}.`);
    ganharPista(e, 'tarefa');
    return;
  }
  o.usado = true;
  e.missao.feitos++;
  e.stats.tarefas = (e.stats.tarefas ?? 0) + 1;
  msg(e, passo.texto, 'peca');
  const prox = proximaTarefa(e);
  if (prox) {
    msg(e, `Agora: ${artigo(prox.nome)}, ${emSala(prox.sala)}.`, 'bom');
    marcarProximaTarefa(e);
    return;
  }
  e.trancas.clear();
  msg(e, th.tarefas.aberta, 'bom');
  ganharSan(e, 1, 'tarefa');
  const saida = e.objetos.find((x) => x.real && (x.tipo === 'escada' || x.tipo === 'saida'));
  if (saida) {
    for (const c of caminhoReal(e, e.jogador, saida)) e.visto[idx(e, c.x, c.y)] = 1;
    e.visto[idx(e, saida.x, saida.y)] = 1;
  }
}

/** Peça do caminho: devolve fio, acalma e mostra a saída do andar. */
function pegarPeca(e, o) {
  const th = temaDe(e);
  o.usado = true;
  if (!e.pecas.includes(o.indice)) e.pecas.push(o.indice);
  e.fio += PARAM.fio.peca;
  ganharSan(e, 2, 'peca');
  msg(e, `Você encontra ${artigo(th.pecas.nomes[o.indice])}. ${th.pecas.textos[o.indice]}`, 'peca');
  anotar(e, `Achou ${artigo(th.pecas.nomes[o.indice])}.`);
  const saida = e.objetos.find((x) => x.real && (x.tipo === 'escada' || x.tipo === 'saida'));
  if (saida) {
    for (const c of caminhoReal(e, e.jogador, saida)) e.visto[idx(e, c.x, c.y)] = 1;
    e.visto[idx(e, saida.x, saida.y)] = 1;
    msg(e, 'Junto da peça, um rabisco mostra o caminho até a saída deste andar. O fio parece mais longo.', 'bom');
  }
  ganharPista(e, 'fio');
}

/** Fotografia, carta, corpo: examinar custa Sanidade e dá alguma coisa. */
function examinar(e, o) {
  if (o.examinado) return;
  const th = temaDe(e);
  const pt = th.perturbadores[o.tipoP];
  e.stats.perturbadores++;
  if (o.tipoP === 'corpo') {
    o.examinado = true;
    const q = perderSan(e, PARAM.perturbador.corpo, { motivo: 'perturbador' });
    msg(e, pt.revistar + (q ? '' : ' Você aguenta firme.'), 'dano');
    const tipo = ponderado(e.rDados, [['cura', 2], ['folego', 2], ['calma', 1]]);
    const it = { tipo, nome: escolher(e.rDados, tipo === 'folego' ? th.folego : th.itens[tipo]) };
    if (e.inventario.length < PARAM.inventario) { e.inventario.push(it); msg(e, `Você leva ${artigo(it.nome)}.`, 'bom'); }
    else msg(e, `Havia ${artigo(it.nome)}, mas não cabe mais nada.`);
    return;
  }
  o.usado = true;
  if (o.tipoP === 'foto') {
    const q = perderSan(e, PARAM.perturbador.foto, { motivo: 'perturbador' });
    msg(e, `${Maiuscula(artigo(pt.nome))}. ${pt.texto}`, q ? 'dano' : 'info');
    e.cargasAncora += 1;
    msg(e, 'Você guarda a imagem. Pelo menos agora você sabe que alguém viu você aqui.', 'bom');
    anotar(e, `Achou ${artigo(pt.nome)}.`);
    return;
  }
  // carta
  const q = perderSan(e, PARAM.perturbador.carta, { motivo: 'perturbador' });
  msg(e, `${Maiuscula(artigo(pt.nome))}. ${pt.texto}`, q ? 'dano' : 'info');
  const saida = e.objetos.find((x) => x.real && (x.tipo === 'escada' || x.tipo === 'saida'));
  if (saida) {
    for (const c of caminhoReal(e, e.jogador, saida)) e.visto[idx(e, c.x, c.y)] = 1;
    e.visto[idx(e, saida.x, saida.y)] = 1;
    saida.conhecida = true;
    msg(e, 'Você memoriza o caminho que ela descreve.', 'bom');
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

const FEMININOS = new Set(['chave', 'enfermaria', 'solitária', 'lavanderia', 'sala', 'cela', 'cripta', 'capela', 'despensa', 'câmara', 'galeria', 'farmácia', 'garagem', 'escola', 'igreja', 'loja', 'horda', 'foto', 'medalha', 'bateria', 'antena', 'página', 'primeira', 'segunda', 'última', 'ampola', 'folha', 'garrafa', 'pílula', 'mistura', 'fotografia', 'carta', 'pulseira', 'pomada', 'tala', 'medalha', 'oração', 'erva', 'raiz', 'barra', 'jaqueta', 'clava', 'espada', 'ossada', 'ratazana', 'tocha', 'escada', 'escadaria', 'passagem', 'capela', 'boca', 'barricada', 'mancha', 'coisa']);

/** "o enfermeiro", "a fotografia", "as ataduras"; nomes próprios ficam sem artigo. */
export function artigo(nome) {
  const p = nome.split(' ')[0];
  if (/^[A-ZÀ-Ú]/.test(nome) || /^(irmão|doutora)/.test(nome)) return nome;
  if (p === 'ataduras') return 'as ' + nome;
  return (FEMININOS.has(p) ? 'a ' : 'o ') + nome;
}

/** Lugar: "na Câmara do eco", "no Arquivo" (o nome da sala mantém a maiúscula). */
function emSala(nome) {
  const p = nome.split(' ')[0].toLowerCase();
  return (FEMININOS.has(p) ? 'na ' : 'no ') + nome;
}

/** Contração com "em": "no enfermeiro", "na ossada", "em Dona Ilda". */
function emArtigo(nome) {
  const a = artigo(nome);
  if (a.startsWith('o ')) return 'n' + a;
  if (a.startsWith('a ')) return 'n' + a;
  if (a.startsWith('as ')) return 'n' + a;
  return 'em ' + a;
}

function descer(e, queda = false) {
  if (e.andar >= PARAM.andares) return;
  if (!queda) {
    e.vida = Math.min(derivados(e).vidaMax, e.vida + PARAM.folegoNaEscada);
    ganharCons(e, PARAM.consciencia.escada);
    msg(e, temaDe(e).descida, 'narra');
  }
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
  const tremor = PARAM.corpo.tremor[ferimento(e)];
  if (tremor && chance(e.rDados, 0.2)) msg(e, 'Suas mãos tremem.', 'info');
  const r = clip.resolverAtaque({
    ataque: Math.max(0, d.ataque - tremor), defesa: Math.max(0, ent.defesa + extraDef - (ent.pontoFraco ?? 0)), arma: d.arma, armadura: ent.armadura ?? 0, rng: rng(e),
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

/** Bater num item que parecia monstro: ele quebra. */
function golpearObjeto(e, o) {
  const nome = nomeAparente(e, o);
  o.usado = true;
  o.aparencia = null;
  e.stats.itensQuebrados++;
  msg(e, `Você acerta ${artigoDe(nome)} e algo se parte. Era ${artigo(o.item.nome)}. Agora é caco.`, 'mentira');
  ganharPista(e, 'imovel');
  return true;
}

function ferir(e, ent, dano, nome, prefixo = '') {
  const eraInocente = ent.estado === 'vigiando';
  if (eraInocente) provocar(e, ent);
  if (ent.ronda) {
    if (dano >= 3) { ent.tonto = 1; msg(e, `${prefixo}Você acerta ${artigoDe(nome)} com força. Ele cambaleia, mas não cai.`, 'golpe'); }
    else msg(e, `${prefixo}Você acerta ${artigoDe(nome)}. Ele nem sente.`, 'golpe');
    return;
  }
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
    // 0.8.0: o Corpo assenta a cabeça agindo. Derrubar uma fera de verdade (não gente) acalma.
    const alivio = PARAM.alivioCorpo;
    if (alivio && ent.categoria !== 'humano' && !ent.aparencia && clip.caminhoDominante(e.ficha).id === 'corpo' && e.san < derivados(e).sanMax) {
      ganharSan(e, alivio, 'luta');
      msg(e, 'Derrubei. As mãos param de tremer e o mundo volta para o lugar.', 'bom', VOZ);
    }
    if (ent.categoria === 'humano') {
      // 0.4.0: pesa para todos, até para o Corpo. Quem só vigiava pesa mais.
      perderSan(e, eraInocente ? PARAM.perda.matarInocente : PARAM.perda.matarHumano, { motivo: 'matar' });
      if (eraInocente) { e.stats.inocentesMortos++; anotar(e, `Matou ${artigoDe(especie(e, ent).nome)}, que só vigiava.`); }
      msg(e, eraInocente ? 'Ele não queria briga. Isso pesa muito.' : 'Era gente. Isso pesa.', 'dano');
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
  const nome = (alvo.especie || alvo.aparencia) ? nomeAparente(e, alvo) : nomeObjeto(e, alvo);
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
  if (o.tipo === 'perturbador') return th.perturbadores[o.tipoP].nome;
  if (o.tipo === 'peca') return th.pecas.nomes[o.indice ?? 0];
  if (o.tipo === 'tarefa') return th.tarefas.passos[o.ordem].nome;
  return 'coisa';
}

/** Mostra a verdade de uma entidade ou objeto. */
function revelar(e, alvo, como) {
  const quieto = como === 'ancora';
  // Desfazer uma mentira clareia a cabeça (a âncora já dá a sua parte).
  const clareza = () => {
    if (quieto) return;
    ganharSan(e, PARAM.clareza, 'clareza');
    e.stats.clarezas++;
    if (e.stats.clarezas === 2) ganharPista(e, 'clareza');
  };
  if (alvo.tipo === 'fantasma') {
    clareza();
    e.stats.fantasmasRevelados++;
    if (!quieto) msg(e, `${Maiuscula(artigoDe(nomeAparente(e, alvo)))} se desfaz como fumaça. Não havia nada ali.`, 'bom');
    if (alvo.acertou) ganharPista(e, 'marca');
    removerFantasma(e, alvo);
    if (e.stats.fantasmasRevelados + e.stats.miragensReveladas >= 3) ganharPista(e, 'sombra');
    return;
  }
  if (alvo.real === false) {
    clareza();
    alvo.usado = true;
    e.stats.miragensReveladas++;
    if (!quieto) msg(e, `${Maiuscula(nomeObjeto(e, alvo))}? Não: só uma mancha na parede.`, 'bom');
    if (e.stats.fantasmasRevelados + e.stats.miragensReveladas >= 3) ganharPista(e, 'sombra');
    return;
  }
  if (alvo.real === true && alvo.aparencia) {
    const antes = nomeAparente(e, alvo);
    alvo.aparencia = null;
    alvo.confirmado = true;
    e.stats.itensRevelados++;
    clareza();
    if (!quieto) msg(e, `Não é ${artigoDe(antes)}. É ${artigo(alvo.item.nome)}, parado no chão.`, 'bom');
    ganharPista(e, 'imovel');
    return;
  }
  if (alvo.real === true) { if (!quieto) msg(e, `${Maiuscula(nomeObjeto(e, alvo))}: é real.`); alvo.confirmado = true; return; }
  // entidade real
  if (alvo.aparencia) {
    const antes = nomeAparente(e, alvo);
    alvo.aparencia = null;
    e.stats.disfarcesRevelados++;
    clareza();
    if (!quieto) msg(e, `Não é ${artigoDe(antes)}. É ${artigoDe(especie(e, alvo).nome)}.`, alvo.tipo === 'aliado' ? 'bom' : 'perigo');
  } else if (!quieto && alvo.estado === 'vigiando') {
    msg(e, `${Maiuscula(artigoDe(especie(e, alvo).nome))} só vigia. Não quer briga, se você não der motivo.`, 'bom');
    ganharPista(e, 'vigia');
  } else if (!quieto) {
    msg(e, `${Maiuscula(artigoDe(especie(e, alvo).nome))} é real.`);
  }
  if (como === 'olhar' && alvo.tipo === 'monstro' && !alvo.pontoFraco && alvo.estado !== 'vigiando') {
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
  if (alvo?.aparencia && alvo.item) {
    if (distancia(alvo, e.jogador) > 1) { msg(e, 'Longe demais para conversar.'); return false; }
    msg(e, `Você fala com ${artigoDe(nomeAparente(e, alvo))}. Nada responde. Nada se mexe.`);
    revelar(e, alvo, 'falar');
    return true;
  }
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
    if (ent.ronda) { msg(e, `${Maiuscula(artigoDe(nome))} não para para ouvir.`); return true; }
    if (ent.categoria !== 'humano') {
      msg(e, ent.categoria === 'besta' ? `Não há o que conversar com ${artigoDe(nome)}.` : `${Maiuscula(artigoDe(nome))} não ouve palavras.`);
      return true;
    }
    const t = clip.testar({
      nivel: n(e, 'presenca'), objeto: Math.max(n(e, 'empatia'), n(e, 'intimidacao'), n(e, 'lideranca')),
      dificuldade: PARAM.convencer + ent.vontade + e.andar, rng: rng(e),
    });
    const vigiava = ent.estado === 'vigiando';
    ent.conversou = true;
    if (t.sucesso) {
      ent.estado = 'pacificado';
      e.stats.pacificados++;
      if (vigiava) { e.stats.convencidosVigias++; ganharSan(e, 1, 'conversa'); }
      msg(e, vigiava ? `Você explica, com calma. ${Maiuscula(artigoDe(nome))} faz que não viu você e vai embora.` : `Você fala baixo e firme. ${Maiuscula(artigoDe(nome))} abaixa a guarda e se afasta.`, 'bom');
    } else if (vigiava) {
      ent.atencao = (ent.atencao ?? 0) + 2;
      msg(e, `${Maiuscula(artigoDe(nome))} não acredita em você. Fica de olho.`);
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
  if (ent.magoado) { msg(e, `${Maiuscula(esp.nome)} desvia o olhar. Não quer falar com você.`); return true; }
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
  if (alvo?.aparencia && alvo.item) {
    if (distancia(alvo, e.jogador) > 4) { msg(e, 'Longe demais. Chegue mais perto para encarar.'); return false; }
    msg(e, `Você encara ${artigoDe(nomeAparente(e, alvo))}. Ele não pisca. Não tem como piscar.`);
    revelar(e, alvo, 'encarar');
    return true;
  }
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
    else {
      // Encarar quem é do bem é uma agressão: gera antipatia.
      alvo.magoado = true;
      e.stats.antipatias++;
      perderSan(e, PARAM.perda.antipatia, { reduzivel: false, motivo: 'antipatia' });
      if (alvo.estado === 'seguindo') { alvo.estado = 'parado'; msg(e, `${Maiuscula(artigoDe(nome))} para de seguir você.`, 'perigo'); }
      msg(e, `${Maiuscula(artigoDe(nome))} se encolhe com o seu olhar. Você assustou alguém que queria ajudar.`, 'perigo');
      ganharPista(e, 'vigia');
    }
    return true;
  }
  if (alvo.estado === 'vigiando') {
    e.stats.antipatias++;
    alvo.estado = 'cacando';
    alvo.ultimo = { ...e.jogador };
    msg(e, `${Maiuscula(artigoDe(nome))} não gosta nada do seu olhar e vem tirar satisfação.`, 'perigo');
    ganharPista(e, 'vigia');
    return true;
  }
  if (alvo.ronda) {
    if (t.sucesso) {
      alvo.estado = 'fugindo';
      alvo.fugaTtl = 4;
      msg(e, `${Maiuscula(artigoDe(nome))} hesita diante do seu olhar e recua alguns passos. Vai voltar.`, 'bom');
    } else { perderSan(e, PARAM.perda.encararFalhou, { motivo: 'encarar' }); msg(e, `${Maiuscula(artigoDe(nome))} encara você de volta.`, 'dano'); }
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

/** Texto do dom do tema: {alvo}, {Alvo} e {item}. */
function textoDom(modelo, nome, item) {
  return modelo
    .replace('{Alvo}', Maiuscula(artigoDe(nome)))
    .replace('{alvo}', artigoDe(nome))
    .replace('{item}', item ? artigo(item) : '');
}

/**
 * O dom da Mente (regra: Mágicas de Ataque Físico). Cada tema o lê de um jeito:
 * diagnóstico no sanatório, fórmula de fogo na masmorra, frasco incendiário no
 * prédio. A regra é a mesma; muda a pele.
 */
function magia(e, alvoId) {
  const dom = temaDe(e).dom;
  if (n(e, 'magiaAtaqueFisico') < 1) { msg(e, 'Você não sabe fazer isso.'); return false; }
  const alvo = alvoPorId(e, alvoId);
  if (!alvo || !(alvo.especie || alvo.aparencia)) { msg(e, 'Sem alvo para a mágica.'); return false; }
  if (distancia(alvo, e.jogador) > PARAM.magia.alcance || !linhaLivre(e.mapa, e.jogador, alvo)) { msg(e, 'O alvo está fora de alcance.'); return false; }
  const m = clip.lancarMagia(e.ficha, { pericia: 'magiaAtaqueFisico', pm: PARAM.magia.custo, pmDisponivel: e.pm, rng: rng(e) });
  if (m.falhou) { msg(e, dom.semRecurso); return false; }
  e.pm -= m.gasto;
  const nome = nomeAparente(e, alvo);
  efeito(e, 'magia');
  if (alvo.item) {
    alvo.usado = true;
    alvo.aparencia = null;
    e.stats.itensQuebrados++;
    msg(e, textoDom(dom.item, nome, alvo.item.nome), 'mentira');
    if (!dom.quebraItem) {
      alvo.usado = false;
      alvo.confirmado = true;
      e.stats.itensQuebrados--;
      e.stats.itensRevelados++;
    }
    ganharPista(e, 'imovel');
    return true;
  }
  if (alvo.tipo === 'fantasma') {
    e.stats.golpesNoVazio++;
    msg(e, textoDom(dom.vazio, nome), 'mentira');
    removerFantasma(e, alvo);
    ganharPista(e, 'vazio');
    return true;
  }
  // Dano: diferença + PM gastos, como o modificador de uma arma (ver dúvida D2 da arena).
  const r = clip.resolverAtaque({
    ataque: m.gasto + n(e, 'raciocinio'), dadoAtaque: m.dado, arma: m.gasto + n(e, 'raciocinio'), defesa: Math.max(0, alvo.defesa - (alvo.pontoFraco ?? 0)), armadura: alvo.armadura ?? 0, rng: rng(e),
  });
  if (!r.acertou) { msg(e, textoDom(dom.erra, nome)); if (alvo.tipo === 'monstro') alvo.estado = 'cacando'; return true; }
  if (dom.acertaTexto) msg(e, textoDom(dom.acertaTexto, nome), 'golpe');
  ferir(e, alvo, r.dano, nome, dom.acerta);
  // O dom atordoa: quem é atingido perde o turno seguinte (a ronda, dois). É o jeito da Mente de ganhar distância.
  if (alvo.vida > 0) {
    alvo.tonto = Math.max(alvo.tonto ?? 0, alvo.ronda ? PARAM.magia.tontoRonda : PARAM.magia.tonto);
    alvo.preparando = false;
    if (alvo.ronda) msg(e, `${Maiuscula(artigoDe(nome))} para, confuso, por um instante.`, 'bom');
  }
  return true;
}

/* Ancorar-se (Vontade ou Fé) --------------------------------------------- */

function ancorar(e) {
  if (e.cargasAncora <= 0) { msg(e, temaDe(e).ancora.restam[0] + '.'); return false; }
  const t = clip.testar({
    nivel: Math.max(n(e, 'vontade'), n(e, 'fe')), objeto: Math.max(n(e, 'autocontrole'), n(e, 'conviccao'), n(e, 'esperanca')),
    dificuldade: PARAM.ancora.dificuldade, rng: rng(e),
  });
  if (!t.sucesso) { msg(e, temaDe(e).ancora.falha); return true; }
  e.cargasAncora--;
  ancorarMundo(e, PARAM.ancora.ganho + n(e, 'esperanca'));
  msg(e, temaDe(e).ancora.certo, 'bom');
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
  for (const o of e.objetos) {
    if (o.usado || !e.vis.has(idx(e, o.x, o.y))) continue;
    if (!o.real || o.aparencia) { revelar(e, o, 'ancora'); desfeitos++; }
  }
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
  } else if (it.tipo === 'folego') {
    ganharCons(e, PARAM.itens.folego);
    const ofegava = e.corrida > PARAM.folego.limite;
    e.corrida = 0;
    msg(e, `Você usa ${artigo(it.nome)}. A vista clareia${ofegava ? ' e o ar volta ao peito' : ', as bordas param de fugir'}.`, 'bom');
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
  e.stats.turnosPorConsciencia[atencao(e)]++;
  e.stats.turnosPorVida[ferimento(e)]++;
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
  if (e.turno % (e.fio > 0 ? ritmo : Math.max(3, Math.round(ritmo / 2))) === 0) perderSan(e, 1, { reduzivel: false, motivo: 'tempo' });
  const d = derivados(e);
  if (e.turno % PARAM.regenVida === 0 && e.vida < d.vidaMax) e.vida++;
  if (e.turno % PARAM.regenPM === 0 && e.pm < d.pmMax) e.pm++;
  if (e.ancorado > 0) e.ancorado--;
  // O fio do andar.
  if (e.fio > 0) {
    e.fio--;
    const A = PARAM.fio.avisos;
    while (e.avisosFio < A.length && e.fio <= e.fioMax * A[e.avisosFio]) {
      msg(e, temaDe(e).ronda.avisos[e.avisosFio], 'perigo');
      e.avisosFio++;
    }
    if (e.fio === 0) chamarRonda(e);
  } else e.stats.turnosSemFio++;
  janelas(e);
  // O cansaço pesa; o sangue perdido pesa mais.
  const C = PARAM.consciencia;
  const sangrando = ferimento(e) >= 3;
  const ritmoCons = Math.max(6, Math.round(C.cansaco[e.andar - 1] * (sangrando ? C.sangrando : 1)));
  if (e.turno % ritmoCons === 0) perderCons(e, 1, sangrando ? 'sangue' : 'tempo');
  if (e.descansou && semPerigo(e)) {
    e.descanso++;
    if (e.descanso % C.descanso === 0 && e.cons < d.consMax) {
      if (e.descanso === C.descanso) msg(e, 'Fico quieto um pouco, encostado na parede. A cabeça desanuvia devagar.', 'bom', VOZ);
      ganharCons(e, 1);
      if (e.cons >= d.consMax) msg(e, 'Você abre os olhos. A vista está limpa de novo.', 'bom');
    }
    if (e.descanso === C.descanso * 2) ganharPista(e, 'descanso');
  } else e.descanso = 0;
  if (semPerigo(e)) e.avisoSemDescanso = false;
  // Desmaio
  if (e.desmaio > 0) {
    e.desmaio--;
    if (e.desmaio === 0) {
      e.cons = Math.max(1, Math.ceil(d.consMax * C.desmaio.depois));
      msg(e, 'Você acorda no chão, sem saber quanto tempo ficou ali.', 'perigo');
    }
  } else if (e.cons <= 0 && e.surto === 0) {
    e.desmaio = C.desmaio.turnos;
    e.stats.desmaios++;
    msg(e, temaDe(e).desmaio, 'surto');
    efeito(e, 'desmaio');
    anotar(e, 'Desmaiou de cansaço.');
  }
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
  // Ver um corpo pela primeira vez pesa.
  for (const o of e.objetos) {
    if (o.tipo !== 'perturbador' || o.tipoP !== 'corpo' || o.visto || !e.vis.has(idx(e, o.x, o.y))) continue;
    o.visto = true;
    // Quem vive do Corpo já viu gente caída antes (como em matar gente).
    const acostumado = clip.caminhoDominante(e.ficha).id === 'corpo';
    const q = acostumado ? 0 : perderSan(e, PARAM.perturbador.verCorpo, { motivo: 'perturbador' });
    msg(e, temaDe(e).perturbadores.corpo.ver, q ? 'dano' : 'info');
  }
  // Sangue velho seca.
  for (const [k, t] of e.sangue) if (e.turno - t > PARAM.corpo.sangueDura * 2) e.sangue.delete(k);
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

// Bestas não abrem portas fechadas (a ronda abre tudo).
const livreParaAndar = (e, x, y, quem) =>
  tile(e.mapa, x, y) !== T.PAREDE && tile(e.mapa, x, y) !== T.BURACO && !e.trancas?.has(y * e.mapa.w + x) &&
  !(quem?.categoria === 'besta' && !quem.ronda && tile(e.mapa, x, y) === T.PORTA) && !(e.jogador.x === x && e.jogador.y === y) && !e.entidades.some((o) => o !== quem && o.tipo !== 'fantasma' && o.vida > 0 && o.x === x && o.y === y);

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
  if (m.tonto > 0) { m.tonto--; m.preparando = false; return; }
  if (m.ronda) return agirRonda(e, m);
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
  if (m.estado === 'vigiando') { vigiar(e, m, ve); return; }
  if (ve) {
    if (!m.jaVisto && m.categoria === 'assombro') {
      m.jaVisto = true;
      const q = perderSan(e, PARAM.perda.verAssombro, { motivo: 'assombro' });
      if (q) msg(e, `Ver ${artigoDe(nomeAparente(e, m))} gela sua espinha.`, 'dano');
    }
    m.estado = 'cacando';
    m.ultimo = { x: e.jogador.x, y: e.jogador.y };
  }
  if (!ve && m.categoria === 'besta' && (m.estado !== 'cacando' || !m.ultimo)) farejar(e, m);
  if (m.estado === 'cacando') {
    const companheiro = e.entidades.find((x) => x.estado === 'seguindo' && x.vida > 0 && distancia(x, m) === 1);
    if (m.preparando) { golpePesado(e, m); return; }
    if (distancia(m, e.jogador) === 1) {
      if (prepara(e, m)) return;
      ataqueDoMonstro(e, m, 0);
      return;
    }
    if (companheiro && chance(e.rIA, 0.6)) { ataqueAoCompanheiro(e, m, companheiro); return; }
    if (m.ultimo) {
      passoPara(e, m, m.ultimo);
      // Os rápidos dão dois passos quando estão longe.
      if (m.rapido && distancia(m, e.jogador) > 1) passoPara(e, m, m.ultimo);
      if (m.x === m.ultimo.x && m.y === m.ultimo.y && !ve) {
        m.estado = 'parado';
        m.ultimo = null;
        if (m.categoria === 'besta') farejar(e, m);
      }
    }
    return;
  }
  vagar(e, m);
}

/* Ler o inimigo (0.5.0) ----------------------------------------------------- */

export const FORCAS = ['muito mais fraco que você', 'mais fraco que você', 'parelho com você', 'mais forte que você', 'muito mais forte que você: melhor fugir'];

/** Números que a pessoa acha que vê: os da aparência (vulto e disfarce têm números coerentes com a mentira). */
function numerosAparentes(e, ent) {
  if (!ent.aparencia && ent.tipo !== 'fantasma' && !ent.item) return ent;
  const esp = catalogo(temaDe(e), aparencia(e, ent).especie) ?? {};
  const esc = PARAM.escala(e.andar);
  return { ataque: (esp.ataque ?? 1) + esc.combate, defesa: (esp.defesa ?? 1) + esc.combate, arma: esp.arma ?? 0, vida: (esp.vida ?? 4) + esc.vida, vidaMax: (esp.vida ?? 4) + esc.vida, mental: esp.mental ?? 0, categoria: aparencia(e, ent).categoria };
}

/**
 * Quem ganha uma troca de golpes? Compara quantos turnos cada um aguenta.
 * Devolve 0 (muito mais fraco) a 4 (muito mais forte).
 */
function forcaRelativa(e, m) {
  const d = derivados(e);
  if (m.categoria === 'assombro') {
    const meu = Math.max(0.4, d.defesaMental - (m.mental ?? 1) + 2);
    const r = meu / 1.5;
    return r >= 2.5 ? 1 : r >= 1.3 ? 2 : r >= 0.8 ? 3 : 4;
  }
  const domDano = n(e, 'magiaAtaqueFisico') > 0 && e.pm >= PARAM.magia.custo ? PARAM.magia.custo + n(e, 'raciocinio') : 0;
  const meuDano = Math.max(0.3, Math.max(d.ataque + d.arma - (m.defesa ?? 1), domDano - (m.defesa ?? 1)) + 1.5);
  const deleDano = Math.max(0.3, (m.ataque ?? 1) + (m.arma ?? 0) - d.defesa - d.armadura + 1.5);
  const r = (e.vida / deleDano) / ((m.vida ?? 1) / meuDano);
  return r >= 3 ? 0 : r >= 1.5 ? 1 : r >= 0.75 ? 2 : r >= 0.4 ? 3 : 4;
}

/**
 * O que a pessoa lê do inimigo. Percepção 2 (ou ter olhado de novo) lê certo;
 * Percepção 1 erra às vezes por um grau; sem Percepção, só gente se lê (com
 * Empatia). Com a cabeça Perturbada ou pior, a leitura também mente.
 */
function lerInimigo(e, ent) {
  const ap = aparencia(e, ent);
  if (ap.categoria === 'aliado' || ent.estado === 'pacificado') return { forca: null, ferido: false };
  if (ent.ronda) return { forca: 'não dá para derrubar: só fugir ou atrasar', nivelForca: 4, ferido: false };
  const m = numerosAparentes(e, ent);
  const gente = (m.categoria ?? ent.categoria) === 'humano';
  const leitura = n(e, 'percepcao') + (gente ? n(e, 'empatia') : 0);
  if (!ent.revelado && leitura <= 0) return { forca: null, nivelForca: null, ferido: false, sem: true };
  let nv = forcaRelativa(e, { ...m, categoria: m.categoria ?? ent.categoria });
  const z = ruido(e.semente, ent.id ?? ent.idFalso ?? 0, e.andar, Math.floor(e.turno / 15));
  if (!ent.revelado && leitura === 1 && z < 0.35) nv += z < 0.17 ? -1 : 1;
  const lv = nivelCabeca(e);
  if (lv >= 3 && ruido(e.semente, 9, ent.id ?? 0, Math.floor(e.turno / 9)) < PARAM.alu.mentiraPalavras[lv]) nv += z < 0.5 ? -1 : 1;
  nv = Math.max(0, Math.min(4, nv));
  const ferido = leitura >= 1 && !ent.item && ent.tipo !== 'fantasma' && !ent.aparencia && m.vida < (m.vidaMax ?? m.vida) / 2;
  return { forca: (m.categoria ?? ent.categoria) === 'assombro' ? FORCAS[nv].replace('que você', 'que a sua cabeça') : FORCAS[nv], nivelForca: nv, ferido };
}

/** Quem vigia anda pela sala; se você fica perto demais por tempo demais, manda você embora. */
function vigiar(e, m, ve) {
  if (ve && distancia(m, e.jogador) <= PARAM.vigia.distancia) m.atencao = (m.atencao ?? 0) + 1;
  else m.atencao = Math.max(0, (m.atencao ?? 0) - 1);
  if (m.atencao >= PARAM.vigia.paciencia) {
    m.estado = 'cacando';
    m.ultimo = { ...e.jogador };
    msg(e, `${Maiuscula(artigoDe(nomeAparente(e, m)))} decide que você não devia estar aqui.`, 'perigo');
    return;
  }
  if (m.atencao === PARAM.vigia.paciencia - 1 && ve) msg(e, `${Maiuscula(artigoDe(nomeAparente(e, m)))} olha para você e franze a testa.`, 'perigo');
  vagar(e, m);
}

/** Dá para ver que ele só vigia? Percepção alta, ou ter olhado de novo, ou ter falado com ele. */
const intencaoVisivel = (e, m) => m.estado === 'vigiando' && (n(e, 'percepcao') >= PARAM.vigia.percepcao || m.revelado || m.conversou);

/** Bateu em quem só vigiava: ele grita, todos os humanos do andar vêm, e pesa. */
function provocar(e, ent) {
  if (ent.estado !== 'vigiando') return;
  e.stats.inocentesFeridos++;
  perderSan(e, PARAM.perda.atacarInocente, { reduzivel: false, motivo: 'antipatia' });
  msg(e, `${Maiuscula(artigoDe(especie(e, ent).nome))} só estava vigiando. Ele grita por ajuda.`, 'perigo');
  ganharPista(e, 'vigia');
  alarme(e);
}

function alarme(e) {
  let n2 = 0;
  for (const m of e.entidades) {
    if (m.tipo !== 'monstro' || m.categoria !== 'humano' || m.vida <= 0 || m.ronda) continue;
    if (m.estado === 'vigiando' || m.estado === 'parado') { m.estado = 'cacando'; m.ultimo = { ...e.jogador }; n2++; }
  }
  if (!e.alarmeNoAndar) {
    e.alarmeNoAndar = true;
    e.stats.alarmes++;
    msg(e, 'Passos correndo por todo o andar. Agora todos sabem de você.', 'perigo');
    anotar(e, `Deu alarme em ${temaDe(e).andares[e.andar - 1]}.`);
  }
  return n2;
}

/** Monstro colado, com arma ou força, às vezes prepara um golpe pesado: avisa um turno antes. */
function prepara(e, m) {
  if (m.categoria === 'assombro' || (m.arma < 1 && m.ataque < 2)) return false;
  if (m.ultimoPreparo && e.turno - m.ultimoPreparo < PARAM.preparo.intervalo) return false;
  if (!chance(e.rIA, PARAM.preparo.chance)) return false;
  m.preparando = true;
  m.ultimoPreparo = e.turno;
  e.stats.preparos++;
  msg(e, `${Maiuscula(artigoDe(nomeAparente(e, m)))} recua meio passo e prepara um golpe pesado.`, 'perigo');
  return true;
}

function golpePesado(e, m) {
  m.preparando = false;
  if (distancia(m, e.jogador) > 1) {
    e.stats.pesadosEvitados++;
    msg(e, `O golpe pesado ${emArtigo(nomeAparente(e, m)).replace(/^n/, 'd')} corta o ar onde você estava.`, 'bom');
    ganharPista(e, 'preparo');
    return;
  }
  ataqueDoMonstro(e, m, PARAM.preparo.ataque, true);
}

/** A ronda: sabe onde você está, não se cansa e não cai. Só dá para atrasá-la. */
function agirRonda(e, m) {
  if (m.estado === 'fugindo') {
    m.fugaTtl--;
    passoPara(e, m, e.jogador, true);
    if (m.fugaTtl <= 0) m.estado = 'cacando';
    return;
  }
  m.estado = 'cacando';
  if (m.preparando) { golpePesado(e, m); return; }
  if (distancia(m, e.jogador) === 1) {
    if (prepara(e, m)) return;
    ataqueDoMonstro(e, m, 0);
    return;
  }
  if (e.turno % PARAM.ronda.passo === 0) return; // ela não corre
  passoPara(e, m, e.jogador);
}

function chamarRonda(e) {
  const th = temaDe(e);
  const p = (livreParaAndar(e, e.entrada.x, e.entrada.y, null) && distancia(e.entrada, e.jogador) > 3) ? e.entrada : (() => {
    // Longe de você, numa casa livre.
    let melhor = null, md = -1;
    for (let y = 0; y < e.mapa.h; y++) for (let x = 0; x < e.mapa.w; x++) {
      if (!livreParaAndar(e, x, y, null)) continue;
      const d = distancia({ x, y }, e.jogador);
      if (d > md && d < 30) { md = d; melhor = { x, y }; }
    }
    return melhor;
  })();
  if (!p) return;
  const R = PARAM.ronda;
  const esc = PARAM.escala(e.andar);
  e.entidades.push({
    id: 'e' + e.proximoId++, tipo: 'monstro', ronda: true, especie: 'ronda', categoria: th.ronda.categoria, x: p.x, y: p.y,
    ataque: R.ataque + esc.combate, defesa: R.defesa + esc.combate, vida: 999, vidaMax: 999, arma: R.arma, armadura: 0,
    vontade: R.vontade, mental: 0, rapido: false, estado: 'cacando',
  });
  e.stats.rondas++;
  msg(e, th.ronda.chegada, 'surto');
  efeito(e, 'surto');
  anotar(e, `${Maiuscula(artigo(th.ronda.nome))} alcançou você em ${th.andares[e.andar - 1]}.`);
}

/** Besta acha sangue fresco por perto e segue o rastro, do mais velho para o mais novo. */
function farejar(e, m) {
  let melhor = null;
  for (const [k, t] of e.sangue) {
    if (e.turno - t > PARAM.corpo.sangueDura) continue;
    const x = k % e.mapa.w, y = Math.floor(k / e.mapa.w);
    if (distancia({ x, y }, m) > PARAM.corpo.faro) continue;
    if (!melhor || t > melhor.t) melhor = { x, y, t };
  }
  if (!melhor || (m.x === melhor.x && m.y === melhor.y)) return;
  if (m.estado !== 'cacando') {
    e.stats.farejado++;
    if (distancia(m, e.jogador) <= 12) msg(e, 'Em algum lugar atrás de você, algo fareja o chão.', 'perigo');
    ganharPista(e, 'sangue');
  }
  m.estado = 'cacando';
  m.ultimo = { x: melhor.x, y: melhor.y };
}

function ataqueDoMonstro(e, m, bonus, pesado = false) {
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
  // Quem enxerga o golpe vindo defende melhor: Percepção soma metade (0.3.2).
  const def = e.defendendo ? PARAM.defender.defesa + Math.floor(n(e, 'percepcao') / 2) + (pesado ? PARAM.defender.contraPesado : 0) : 0;
  const r = clip.resolverAtaque({ ataque: m.ataque, defesa: d.defesa, arma: m.arma + (pesado ? PARAM.preparo.dano : 0), armadura: d.armadura, outrosAtaque: bonus, outrosDefesa: def, rng: rng(e) });
  if (pesado) {
    if (r.acertou) e.stats.pesadosRecebidos++; else e.stats.pesadosEvitados++;
    ganharPista(e, 'preparo');
  }
  if (r.acertou) {
    e.vida -= r.dano;
    e.ultimoGolpe = artigoDe(especie(e, m).nome);
    efeito(e, 'golpe');
    if (r.dano >= PARAM.consciencia.pancada) perderCons(e, 1, 'pancada');
    if (ferimento(e) >= PARAM.corpo.sangra) e.sangue.set(idx(e, e.jogador.x, e.jogador.y), e.turno);
    msg(e, `${Maiuscula(artigoDe(nome))} acerta você${pesado ? ' com o golpe pesado' : r.dano >= 4 ? ' em cheio' : ''}.`, 'dano');
  } else if (e.defendendo) {
    msg(e, `Você apara ${pesado ? 'o golpe pesado ' : ''}${emArtigo(nome).replace(/^n/, 'd')}.`, 'bom');
    // Defendendo, quem luta devolve na hora.
    if (d.ataque > 0 || d.arma > 0) {
      e.stats.contraGolpes++;
      e.defendendo = false;
      msg(e, 'E devolve.', 'golpe');
      golpear(e, m);
    }
  } else msg(e, `${Maiuscula(artigoDe(nome))} erra você${pesado ? ' por pouco' : ''}.`);
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
  // Duas fontes de engano: a Sanidade (quem e o que as coisas são) e a Consciência (o espaço).
  const lv = nivelCabeca(e);
  const lc = nivelEspaco(e);
  const A = PARAM.alu;
  const AC = PARAM.aluCons;
  const r = e.rAlu;
  if (lv === 0) {
    // Lúcido: ninguém tem a cara errada.
    for (const x of e.entidades) x.aparencia = null;
    for (const o of e.objetos) o.aparencia = null;
  }
  if (lc === 0) {
    // Alerta: o espaço se assenta.
    for (const f of e.entidades.filter((x) => x.tipo === 'fantasma')) removerFantasma(e, f);
    for (const o of e.objetos) if (!o.real) o.usado = true;
    e.ilusaoParedes.clear();
  }
  if (lv === 0 && lc === 0) return;
  const notar = PARAM.notar * (n(e, 'sentidos') + n(e, 'discernimento') + n(e, 'percepcao'));
  const th = temaDe(e);
  const comuns = th.monstros.filter((q) => q.andar <= Math.max(2, e.andar) && q.andar < 5);
  // Disfarces para quem acabou de entrar em vista.
  for (const ent of e.entidades) {
    if (ent.tipo === 'fantasma' || !ent.visivel || ent.ronda) continue; // a ronda não se disfarça: ela é a verdade que chega
    if (!ent.decidido) {
      ent.decidido = true;
      const p = A.disfarce[lv] * (ent.estado === 'seguindo' ? 0.35 : 1) * (e.ancorado > 0 ? 0 : 1);
      if (!ent.revelado && chance(r, p)) {
        if (ent.tipo === 'aliado') {
          const m = escolher(r, comuns);
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
  // Itens de verdade com cara de monstro (parados, à espera).
  for (const o of e.objetos) {
    if (o.tipo !== 'item' || !o.real || o.usado || !o.visivel || o.decidido) continue;
    o.decidido = true;
    if (o.confirmado || e.ancorado > 0) continue;
    if (distancia(o, e.jogador) >= 2 && chance(r, A.itemMonstro[lv])) {
      const m = escolher(r, comuns);
      o.aparencia = { especie: m.id, categoria: m.categoria };
      o.idFalso = o.idFalso ?? 'e' + e.proximoId++;
      e.stats.itensDisfarcados++;
    }
  }
  if (e.ancorado > 0) return;
  // O espaço mente (Consciência).
  if (chance(r, AC.fantasma[lc])) criarFantasma(e);
  if (chance(r, AC.miragem[lc])) criarMiragem(e);
  if (e.turno % PARAM.epocaParedes === 0) refazerParedes(e, AC.paredes[lc], AC.portas[lc], AC.buracos[lc]);
  desconfiarDeParedes(e, notar);
  // A cabeça mente (Sanidade).
  if (chance(r, A.sussurro[lv])) msg(e, escolher(r, th.sussurros), 'sussurro', { mentira: true });
  if (chance(r, A.golpeFalso[lv])) {
    efeito(e, 'golpe');
    msg(e, th.golpeFalso, 'dano', { mentira: true });
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
  const raio = PARAM.raioVisao[atencao(e)];
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
  const pecaFalta = e.andar >= 2 && e.andar <= 4 && !e.pecas.includes(e.andar - 2);
  const tipo = ponderado(e.rAlu, [['item', 3], [final ? 'saida' : 'escada', 2], ['altar', 0.6], ['peca', pecaFalta ? 0.8 : 0]]);
  const th = temaDe(e);
  const o = { id: 'o' + e.proximoId++, tipo, x: p.x, y: p.y, real: false, indice: e.andar - 2 };
  if (tipo === 'item') {
    const t = ponderado(e.rAlu, [['cura', 2], ['calma', 3], ['folego', 1.5], ['ancora', 1]]);
    o.item = { tipo: t, nome: escolher(e.rAlu, t === 'folego' ? th.folego : th.itens[t]) };
  }
  e.objetos.push(o);
  e.stats.miragensCriadas++;
}

/** Uma parede que fecha um corredor bem à frente pode dar a sensação de que não estava ali. */
function desconfiarDeParedes(e, notar) {
  e.paredesSuspeitas ??= new Set();
  for (const [k, t] of e.ilusaoParedes) {
    if (t !== T.PAREDE || e.paredesSuspeitas.has(k) || !e.vis.has(k)) continue;
    const x = k % e.mapa.w, y = Math.floor(k / e.mapa.w);
    if (distancia({ x, y }, e.jogador) > 2) continue;
    if (!chance(e.rAlu, 0.4 + notar)) continue;
    e.paredesSuspeitas.add(k);
    msg(e, 'Essa parede bem aí na frente… não lembro dela. Ou lembro? Talvez valha encostar a mão.', 'pista', VOZ);
    return;
  }
}

function refazerParedes(e, quantas, portas = 0, buracos = 0) {
  e.ilusaoParedes.clear();
  if (!quantas && !portas && !buracos) return;
  const passagens = [];
  const bloqueios = [];
  const portasFalsas = [];
  const portasAoLado = [];
  const covas = [];
  for (const k of e.vis) {
    const x = k % e.mapa.w, y = Math.floor(k / e.mapa.w);
    if (distancia({ x, y }, e.jogador) < 2) continue;
    const t = tile(e.mapa, x, y);
    const h = tile(e.mapa, x - 1, y) === T.CHAO && tile(e.mapa, x + 1, y) === T.CHAO;
    const v = tile(e.mapa, x, y - 1) === T.CHAO && tile(e.mapa, x, y + 1) === T.CHAO;
    const hw = tile(e.mapa, x - 1, y) === T.PAREDE && tile(e.mapa, x + 1, y) === T.PAREDE;
    const vw = tile(e.mapa, x, y - 1) === T.PAREDE && tile(e.mapa, x, y + 1) === T.PAREDE;
    const livre = !reaisEm(e, x, y) && !e.objetos.some((o) => o.x === x && o.y === y && !o.usado);
    if (t === T.PAREDE && (h || v)) passagens.push(k); // parede entre dois chãos: parece passagem
    if (t === T.CHAO && (hw || vw) && livre) { bloqueios.push(k); covas.push(k); } // corredor: parece parede, ou buraco
    else if (t === T.CHAO && livre && distancia({ x, y }, e.jogador) >= 3) covas.push(k);
    if (t === T.PAREDE) {
      // Parede de frente para o chão: dá para pintar uma porta nela.
      const chaoAoLado = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => tile(e.mapa, x + dx, y + dy) === T.CHAO);
      if (!chaoAoLado) continue;
      const portaVizinha = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => [T.PORTA, T.ABERTA].includes(tile(e.mapa, x + dx, y + dy)));
      (portaVizinha ? portasAoLado : portasFalsas).push(k);
    }
  }
  const ps = embaralhar(e.rAlu, passagens);
  const bs = embaralhar(e.rAlu, bloqueios);
  for (let i = 0; i < quantas; i++) {
    if (i % 2 === 0 && ps.length) e.ilusaoParedes.set(ps.pop(), T.CHAO);
    else if (bs.length) e.ilusaoParedes.set(bs.pop(), T.PAREDE);
  }
  // Portas: primeiro as que duplicam uma porta de verdade.
  const pf = [...embaralhar(e.rAlu, portasFalsas), ...embaralhar(e.rAlu, portasAoLado)];
  for (let i = 0; i < portas && pf.length; i++) {
    const k = pf.pop();
    if (!e.ilusaoParedes.has(k)) e.ilusaoParedes.set(k, T.PORTA);
  }
  const cs = embaralhar(e.rAlu, covas);
  for (let i = 0; i < buracos && cs.length; i++) {
    const k = cs.pop();
    if (!e.ilusaoParedes.has(k)) e.ilusaoParedes.set(k, T.BURACO);
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
  inteligencia: 'Libera o dom da Mente e Raciocínio.',
  percepcao: 'Olhar de novo com mais dados.',
  sabedoria: 'Olhar de novo; libera Serenidade e Discernimento.',
  vontade: 'Mais Sanidade; ancorar-se e encarar.',
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
  raciocinio: 'O dom da Mente acerta melhor.',
  autocontrole: 'Resiste a sussurros e ajuda a ancorar.',
  conviccao: 'Encarar e ancorar com mais dados.',
  esperanca: 'Ancorar e rezar devolvem mais Sanidade.',
  magiaAtaqueFisico: 'O dom da Mente: ataque à distância que cansa a cabeça.',
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
  const lc = atencao(e);
  const lcp = nivelEspaco(e);
  const tiles = new Array(w * h).fill(-1);
  const visivel = new Uint8Array(w * h);
  const memoriaBoa = n(e, 'memoria') > 0;
  const epoca = Math.floor(e.turno / PARAM.epocaMemoria);
  // Sinais que não mentem: a porta de verdade tem luz por baixo; o buraco de verdade sopra ar frio.
  const sinais = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) {
    if (!e.visto[k]) continue;
    const x = k % w, y = Math.floor(k / w);
    let t = tile(e.mapa, x, y);
    if (e.vis.has(k)) {
      visivel[k] = 1;
      if ((t === T.PORTA || t === T.BURACO) && !e.ilusaoParedes.has(k)) sinais[k] = 1;
      if (e.ilusaoParedes.has(k)) t = e.ilusaoParedes.get(k);
    } else {
      if (e.ilusaoParedes.has(k)) t = e.ilusaoParedes.get(k);
      else if (!memoriaBoa && lcp >= 2) {
        const z = ruido(e.semente + e.andar, x, y, epoca);
        if (z < PARAM.aluCons.esquecer[lcp]) { tiles[k] = -1; continue; }
        if (z < PARAM.aluCons.esquecer[lcp] + PARAM.aluCons.memoria[lcp] && bordaDeParede(e, x, y) && t !== T.BURACO) t = t === T.PAREDE ? T.CHAO : T.PAREDE;
      }
    }
    if (e.trancas.has(k) && t === T.PORTA) t = T.TRANCADA;
    tiles[k] = t;
  }
  const th = temaDe(e);
  const entidades = [];
  for (const ent of e.entidades) {
    if (ent.tipo !== 'fantasma' && ent.vida <= 0) continue;
    if (!e.vis.has(idx(e, ent.x, ent.y))) continue;
    const ap = aparencia(e, ent);
    const esp = catalogo(th, ap.especie);
    const real = ent.tipo !== 'fantasma';
    entidades.push({
      id: ent.id, x: ent.x, y: ent.y, sprite: esp.sprite, cores: esp.cores, nome: esp.nome,
      categoria: ap.categoria === 'aliado' ? 'aliado' : !ent.aparencia && intencaoVisivel(e, ent) ? 'neutro' : 'hostil', especie: ap.categoria,
      sombra: real, respira: !real,
      companheiro: ent.estado === 'seguindo' && !ent.aparencia,
      preparando: !!ent.preparando, tonto: ent.tonto > 0, ameaca: !!ent.ronda,
      ...lerInimigo(e, ent),
      fugindo: ent.estado === 'fugindo' || ent.estado === 'pacificado',
      marca: ent.suspeito ? 'suspeito' : ent.revelado ? 'real' : null,
      ...(e.depurar ? { verdade: { tipo: ent.tipo, especie: ent.especie, vida: ent.vida, disfarce: !!ent.aparencia } } : {}),
    });
  }
  // Itens com cara de monstro: na tela, são criaturas paradas (com sombra, porque são reais).
  for (const o of e.objetos) {
    if (o.usado || !o.aparencia || !e.vis.has(idx(e, o.x, o.y))) continue;
    const esp = th.monstros.find((m) => m.id === o.aparencia.especie);
    entidades.push({
      id: o.idFalso, x: o.x, y: o.y, sprite: esp.sprite, cores: esp.cores, nome: esp.nome,
      categoria: 'hostil', especie: o.aparencia.categoria, sombra: true, respira: false, ...lerInimigo(e, o),
      companheiro: false, fugindo: false, marca: null,
      ...(e.depurar ? { verdade: { tipo: 'item', especie: o.item.nome, vida: 0, disfarce: true } } : {}),
    });
  }
  const objetos = [];
  for (const o of e.objetos) {
    if (o.usado || o.aparencia) continue;
    const k = idx(e, o.x, o.y);
    // Fora de vista, só o que é real e já foi visto fica na memória.
    if (!e.vis.has(k) && !(o.real && e.visto[k])) continue; // tarefas marcadas entram aqui (o.real e visto)
    objetos.push({
      id: o.id, x: o.x, y: o.y, tipo: o.tipo, item: o.item?.tipo ?? null, nome: nomeObjeto(e, o),
      perturbador: o.tipoP ?? null, examinado: !!o.examinado,
      ...(o.tipo === 'tarefa' ? { ordem: o.ordem, proxima: o.ordem === e.missao.feitos } : {}),
      sombra: o.real, respira: !o.real, visivel: e.vis.has(k), confirmado: !!o.confirmado,
      ...(e.depurar ? { verdade: { real: o.real } } : {}),
    });
  }
  // Sangue: o seu, no chão que você vê ou lembra.
  const sangue = [];
  for (const [k, t] of e.sangue) if (e.visto[k]) sangue.push({ x: k % w, y: Math.floor(k / w), idade: e.turno - t });
  const d = derivados(e);
  return {
    w, h, tiles, visivel, sinais, tema: e.tema, andar: e.andar, nomeAndar: th.andares[e.andar - 1],
    sangue,
    turno: e.turno,
    missao: { total: e.missao.total, feitos: e.missao.feitos, proxima: proximaTarefa(e) ? { nome: proximaTarefa(e).nome, sala: proximaTarefa(e).sala } : null },
    fio: e.fioMax ? Math.round((e.fio / e.fioMax) * 100) / 100 : 1,
    pecas: [0, 1, 2].map((i) => (e.pecas.includes(i) ? th.pecas.nomes[i] : null)),
    janelas: e.janelas.filter((j) => e.visto[idx(e, j.x, j.y)]).map((j) => ({ x: j.x, y: j.y, estado: j.estado, passou: j.passou ?? -99, quem: j.quem ? catalogo(th, j.quem) : null })),
    atencao: lc,
    ferimento: ferimento(e),
    desmaio: e.desmaio > 0,
    ofegante: e.corrida > PARAM.folego.forte ? 2 : e.corrida > PARAM.folego.limite ? 1 : 0,
    variacao: Object.fromEntries(Object.entries(e.variacao ?? {}).map(([k, v]) => [k, v < 0 ? (v <= -3 ? 'perdeu muito' : 'perdeu') : v > 0 ? (v >= 3 ? 'ganhou muito' : 'ganhou') : null])),
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
    ...(e.depurar ? { numeros: { vida: e.vida, vidaMax: d.vidaMax, san: e.san, sanMax: d.sanMax, pm: e.pm, pmMax: d.pmMax, cons: e.cons, consMax: d.consMax, turno: e.turno, ancorado: e.ancorado } } : {}),
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
    magia: n(e, 'magiaAtaqueFisico') > 0 ? temaDe(e).dom.palavras[faixa(e.pm, d.pmMax)] : null,
    consciencia: NOMES_CONSCIENCIA[nivelConsciencia(e.cons, d.consMax)],
    mentindo: vidaDita !== vida || san !== clip.descrever('sanidade', e.san, d.sanMax),
  };
}

/** Resumo para o fim da partida e para o diário. */
export function resumo(e) {
  const s = e.stats;
  const enganos = s.golpesNoVazio + s.aliadosFeridos + s.emboscadas + s.miragensPisadas + s.paredesFalsas + s.portasFalsas + s.buracosFalsos + s.itensQuebrados;
  return {
    semente: e.semente, tema: e.tema, origem: e.origem,
    resultado: e.fim?.tipo ?? 'andando', andar: e.andar, turnos: s.turnos,
    enganos, revelados: s.fantasmasRevelados + s.disfarcesRevelados + s.miragensReveladas + s.itensRevelados,
    stats: { ...s }, pistas: [...e.pistas], diario: [...e.diario], pecas: e.pecas.length, inteira: !!e.fim?.inteira,
  };
}
