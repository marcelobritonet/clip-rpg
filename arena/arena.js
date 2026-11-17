/**
 * Arena de duelos do Sistema Clip: montagem de builds, o duelo turno a turno,
 * a IA e o simulador de equilíbrio.
 *
 * Toda a matemática de combate vem do motor (`motor/clip.js`). Este módulo só
 * organiza o duelo: de quem é a vez, a distância, os recursos de cada lado e
 * o registro didático de cada cálculo.
 *
 * Onde o manual não diz como o combate anda (rodadas, defender, efeito dos
 * críticos, mover-se), a arena segue as propostas de PENDENCIAS.md, seção 5,
 * e deixa cada uma como opção em `OPCOES_PADRAO`. Nada aqui decide regra: as
 * opções existem para o simulador comparar as alternativas.
 *
 * Tudo que sorteia recebe `rng` (função que devolve [0, 1)), para que os
 * testes e o simulador sejam reproduzíveis.
 */
import {
  REGRAS,
  APRIMORAMENTOS,
  PERICIAS_EXEMPLO,
  novaFicha,
  nivelDe,
  valores,
  validar,
  pontosGastos,
  limiteEquipamento,
  iniciativa,
  resolverAtaque,
  lancarMagia,
  d6,
} from '../motor/clip.js';

/* ------------------------------------------------------------------------ */
/* Opções da arena                                                          */
/* ------------------------------------------------------------------------ */

export const OPCOES_PADRAO = {
  /** Pontos de Evolução de cada lado. */
  orcamento: 15,
  /** Distância no início do duelo: 'curta' ou 'longa'. */
  distanciaInicial: 'longa',
  /** Rodadas antes de declarar empate (cada lado age uma vez por rodada). */
  limiteRodadas: 30,
  /** REGRAS.resistenciaReduzDano do motor: Resistência conta duas vezes. */
  resistenciaReduzDano: true,
  /** Proposta 5.4: efeitos dos críticos. false = críticos só aparecem no registro. */
  criticos: true,
  /** Proposta 5.2: gastar a ação defendendo dá +2 na Defesa até a próxima ação. */
  defender: true,
  /** Bônus de Defesa da ação Defender. */
  bonusDefender: 2,
  /** Sanidade a zero tira o personagem do duelo ("fora de si"). */
  sanidadeDerruba: true,
};

/** Aplica as opções que mexem no motor só durante `fn` e restaura depois. */
function comRegras(opcoes, fn) {
  const antes = REGRAS.resistenciaReduzDano;
  REGRAS.resistenciaReduzDano = opcoes.resistenciaReduzDano;
  try {
    return fn();
  } finally {
    REGRAS.resistenciaReduzDano = antes;
  }
}

/* ------------------------------------------------------------------------ */
/* Builds                                                                   */
/* ------------------------------------------------------------------------ */

/** Perícias Mágicas de ataque que a arena usa. */
export const MAGIAS = ['magiaAtaqueFisico', 'magiaAtaqueMental'];

/**
 * Builds prontas. Em vez de níveis fixos, cada uma é uma receita: a ordem em
 * que os Pontos de Evolução são gastos, repetida até acabar o orçamento.
 * Assim a mesma build funciona com 10, 15 ou 25 pontos. `equipamento` diz em
 * que ordem o limite de Força vira arma, armadura ou escudo.
 */
export const BUILDS = {
  guerreiro: {
    nome: 'Guerreira de lâmina',
    resumo: 'Corpo a corpo: Ataque Corporal e Agilidade altos, arma e armadura.',
    receita: ['forca', 'ataqueCorporal', 'destreza', 'agilidade', 'fisico', 'resistencia', 'saude'],
    equipamento: ['arma', 'armadura', 'arma', 'escudo'],
  },
  atirador: {
    nome: 'Arqueiro do vale',
    resumo: 'Longa distância: Arremesso e Precisão, um arco melhor e Reflexo.',
    receita: ['forca', 'arremesso', 'destreza', 'precisao', 'reflexo', 'fisico', 'saude'],
    equipamento: ['arma', 'arma', 'armadura'],
  },
  conjurador: {
    nome: 'Conjuradora de faíscas',
    resumo: 'Mágicas de Ataque Físico: Inteligência e muitos Pontos de Magia.',
    receita: ['inteligencia', 'magiaAtaqueFisico', 'percepcao', 'inteligencia', 'magiaAtaqueFisico', 'sabedoria', 'destreza', 'reflexo'],
    equipamento: [],
  },
  mistico: {
    nome: 'Místico do silêncio',
    resumo: 'Mágicas de Ataque Mental: tira Sanidade em vez de Vida.',
    receita: ['sabedoria', 'vontade', 'magiaAtaqueMental', 'fe', 'percepcao', 'sabedoria', 'vontade', 'magiaAtaqueMental', 'inteligencia'],
    equipamento: [],
  },
  sentinela: {
    nome: 'Sentinela de ferro',
    resumo: 'Defensiva: Reflexo, Resistência e armadura pesada.',
    receita: ['fisico', 'resistencia', 'destreza', 'reflexo', 'forca', 'ataqueCorporal', 'saude', 'agilidade'],
    equipamento: ['armadura', 'escudo', 'arma'],
  },
};

const NIVEL_MAXIMO = REGRAS.nivelMaximoSugerido;

/** Perícia Mágica com os requisitos do manual, no formato da ficha. */
function periciaMagica(id, nivel = 0) {
  const p = PERICIAS_EXEMPLO.find((x) => x.id === id);
  return { id, nome: p.nome, requisitos: [...p.requisitos], nivel, aplica: null, magica: true };
}

/** Sobe um nível em `id` se couber no orçamento e nos limites do manual. */
function comprar(ficha, id, orcamento) {
  if (pontosGastos(ficha).total + 1 > orcamento) return false;
  if (nivelDe(ficha, id) + 1 > NIVEL_MAXIMO) return false;
  if (id in ficha.atributos) {
    ficha.atributos[id] += 1;
    return true;
  }
  if (id in APRIMORAMENTOS) {
    if (ficha.aprimoramentos[id] + 1 > nivelDe(ficha, APRIMORAMENTOS[id].atributo)) return false;
    ficha.aprimoramentos[id] += 1;
    return true;
  }
  let p = ficha.pericias.find((x) => x.id === id);
  if (!p) {
    p = periciaMagica(id);
    if (Math.min(...p.requisitos.map((r) => nivelDe(ficha, r))) < 1) return false;
    ficha.pericias.push(p);
  }
  if (p.nivel + 1 > Math.min(...p.requisitos.map((r) => nivelDe(ficha, r)))) {
    if (p.nivel === 0) ficha.pericias = ficha.pericias.filter((x) => x !== p);
    return false;
  }
  p.nivel += 1;
  return true;
}

/** Divide o limite de equipamento (Força + Manipulação de Peso) na ordem pedida. */
export function equipar(ficha, ordem) {
  const mods = { arma: 0, armadura: 0, escudo: 0 };
  let livre = limiteEquipamento(ficha);
  for (let i = 0; livre > 0 && ordem.length; i = (i + 1) % ordem.length) {
    mods[ordem[i]] += 1;
    livre -= 1;
  }
  const nomes = { arma: 'Arma', armadura: 'Armadura', escudo: 'Escudo' };
  ficha.equipamentos = Object.entries(mods)
    .filter(([, m]) => m > 0)
    .map(([tipo, m]) => ({ nome: `${nomes[tipo]}${m}`, tipo, modificador: m }));
  return ficha;
}

/**
 * Monta a ficha de uma build pronta com o orçamento dado. A receita é
 * percorrida em ciclos; cada passo compra um nível se for permitido. Para
 * quando o orçamento acaba ou nenhum passo da receita cabe mais.
 */
export function montarBuild(idOuBuild, orcamento = OPCOES_PADRAO.orcamento) {
  const b = typeof idOuBuild === 'string' ? BUILDS[idOuBuild] : idOuBuild;
  const ficha = novaFicha();
  ficha.nome = b.nome;
  ficha.pontosDeEvolucao = orcamento;
  let comprou = true;
  while (comprou && pontosGastos(ficha).total < orcamento) {
    comprou = false;
    for (const id of b.receita) {
      if (comprar(ficha, id, orcamento)) comprou = true;
    }
  }
  return equipar(ficha, b.equipamento);
}

/**
 * Monta uma ficha livre a partir de níveis `{ id: nivel }` (Atributos,
 * Aprimoramentos e as duas Perícias Mágicas) e de equipamento
 * `{ arma, armadura, escudo }`. Devolve a ficha e os erros do motor.
 */
export function montarLivre({ nome = 'Personagem livre', niveis = {}, equipamento = {}, orcamento = OPCOES_PADRAO.orcamento }) {
  const ficha = novaFicha();
  ficha.nome = nome;
  ficha.pontosDeEvolucao = orcamento;
  for (const [id, nivel] of Object.entries(niveis)) {
    if (!nivel) continue;
    if (id in ficha.atributos) ficha.atributos[id] = nivel;
    else if (id in ficha.aprimoramentos) ficha.aprimoramentos[id] = nivel;
    else if (MAGIAS.includes(id)) ficha.pericias.push(periciaMagica(id, nivel));
  }
  const nomes = { arma: 'Arma', armadura: 'Armadura', escudo: 'Escudo' };
  ficha.equipamentos = Object.entries(equipamento)
    .filter(([, m]) => m > 0)
    .map(([tipo, m]) => ({ nome: `${nomes[tipo]}${m}`, tipo, modificador: m }));
  return { ficha, problemas: validar(ficha).filter((p) => p.nivel === 'erro') };
}

/* ------------------------------------------------------------------------ */
/* Lutador                                                                  */
/* ------------------------------------------------------------------------ */

const mod = (ficha, tipo) => Math.max(0, ...ficha.equipamentos.filter((e) => e.tipo === tipo).map((e) => e.modificador));

/** Números de combate de uma ficha, já com os Valores Resumidos do motor. */
export function perfil(ficha) {
  const v = valores(ficha);
  return {
    ataqueCurta: v.ataqueCurta.valor,
    ataqueLonga: v.ataqueLonga.valor,
    defesa: v.defesa.valor,
    defesaMental: nivelDe(ficha, 'vontade') + nivelDe(ficha, 'fe'),
    vida: v.vida.valor,
    magia: v.magia.valor,
    sanidade: v.sanidade.valor,
    arma: mod(ficha, 'arma'),
    armadura: mod(ficha, 'armadura'),
    escudo: mod(ficha, 'escudo'),
    resistencia: nivelDe(ficha, 'resistencia'),
    agilidade: nivelDe(ficha, 'agilidade'),
    magiaFisica: nivelDe(ficha, 'magiaAtaqueFisico'),
    magiaMental: nivelDe(ficha, 'magiaAtaqueMental'),
  };
}

function novoLutador(ficha) {
  const p = perfil(ficha);
  return { nome: ficha.nome, ficha, p, vida: p.vida, pm: p.magia, san: p.sanidade, defendendo: false, perdeAcao: false };
}

/* ------------------------------------------------------------------------ */
/* Ações                                                                    */
/* ------------------------------------------------------------------------ */

export const ACOES = {
  curta: { nome: 'Ataque corpo a corpo', dica: 'ataque-a-curta-distancia' },
  longa: { nome: 'Ataque à distância', dica: 'ataque-a-longa-distancia' },
  magiaFisica: { nome: 'Mágica de Ataque Físico', dica: 'magicas-de-ataque-fisico' },
  magiaMental: { nome: 'Mágica de Ataque Mental', dica: 'magicas-de-ataque-mental' },
  aproximar: { nome: 'Aproximar-se', dica: 'combate' },
  afastar: { nome: 'Afastar-se', dica: 'combate' },
  defender: { nome: 'Defender', dica: 'defesa' },
};

/**
 * Ações de um lutador, cada uma com `disponivel` e, se não estiver, o
 * `motivo`. Ataque corpo a corpo só na distância curta; à distância e
 * mágicas, em qualquer uma.
 */
export function acoesDisponiveis(estado, i) {
  const l = estado.lutadores[i];
  const curta = estado.distancia === 'curta';
  const lista = [
    { id: 'curta', ok: curta, motivo: 'Só na distância curta.' },
    { id: 'longa', ok: true },
    { id: 'magiaFisica', ok: l.p.magiaFisica > 0 && l.pm > 0, motivo: l.p.magiaFisica > 0 ? 'Sem Pontos de Magia.' : 'Sem a Perícia Mágica.' },
    { id: 'magiaMental', ok: l.p.magiaMental > 0 && l.pm > 0, motivo: l.p.magiaMental > 0 ? 'Sem Pontos de Magia.' : 'Sem a Perícia Mágica.' },
    { id: curta ? 'afastar' : 'aproximar', ok: true },
    { id: 'defender', ok: estado.opcoes.defender, motivo: 'Desligado nas opções.' },
  ];
  return lista.map(({ id, ok, motivo }) => ({ id, ...ACOES[id], disponivel: ok, motivo: ok ? null : motivo }));
}

/* ------------------------------------------------------------------------ */
/* Duelo                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Cria o duelo e rola a Iniciativa (motor). Quem vence age primeiro em toda
 * rodada (proposta 5.1).
 */
export function criarDuelo(fichaA, fichaB, { opcoes = {}, rng = Math.random } = {}) {
  const o = { ...OPCOES_PADRAO, ...opcoes };
  const ini = iniciativa(fichaA, fichaB, { rng });
  const primeiro = ini.vencedor === 'a' ? 0 : 1;
  const estado = {
    opcoes: o,
    lutadores: [novoLutador(fichaA), novoLutador(fichaB)],
    distancia: o.distanciaInicial,
    rodada: 1,
    ordem: [primeiro, 1 - primeiro],
    passo: 0,
    log: [],
    fim: null,
  };
  const [na, nb] = [fichaA.nome, fichaB.nome];
  estado.log.push({
    rodada: 0,
    ator: primeiro,
    titulo: 'Iniciativa',
    dica: 'iniciativa',
    linhas: [
      { rotulo: 'Critério decisivo', valor: `${ini.criterio}: ${na} ${ini.valores[0]} × ${nb} ${ini.valores[1]}` },
    ],
    nota: 'Os critérios são conferidos em ordem (Reflexo, Agilidade, Destreza, Caminho do Corpo, dado); o primeiro que desempata decide. Quem vence ataca primeiro em cada rodada.',
    resumo: `${estado.lutadores[primeiro].nome} age primeiro.`,
  });
  return estado;
}

/** Índice de quem age agora. */
export const daVez = (estado) => estado.ordem[estado.passo];

/** Valor de Ataque e Defesa de uma ação, sem o dado. */
function numerosDoAtaque(estado, i, tipo) {
  const a = estado.lutadores[i];
  const d = estado.lutadores[1 - i];
  const bonus = d.defendendo ? estado.opcoes.bonusDefender : 0;
  if (tipo === 'magiaMental') {
    return { ataque: Math.min(a.p.magiaMental, a.pm), defesa: d.p.defesaMental, bonus, arma: 0, reducao: 0, recurso: 'san' };
  }
  const reducao = d.p.armadura + d.p.escudo + (estado.opcoes.resistenciaReduzDano ? d.p.resistencia : 0);
  if (tipo === 'magiaFisica') {
    return { ataque: Math.min(a.p.magiaFisica, a.pm), defesa: d.p.defesa, bonus, arma: 0, reducao, recurso: 'vida' };
  }
  const ataque = tipo === 'curta' ? a.p.ataqueCurta : a.p.ataqueLonga;
  return { ataque, defesa: d.p.defesa, bonus, arma: a.p.arma, reducao, recurso: 'vida' };
}

/**
 * Chance de acerto e dano médio de uma ação, contando as 36 combinações de
 * dados (sem críticos). É o que a IA usa para escolher.
 */
export function expectativa({ ataque, defesa, bonus = 0, arma = 0, reducao = 0 }) {
  let acertos = 0;
  let dano = 0;
  for (let da = 1; da <= 6; da++) {
    for (let dd = 1; dd <= 6; dd++) {
      const dif = ataque + da - (defesa + bonus + dd);
      if (dif > 0) {
        acertos += 1;
        dano += Math.max(REGRAS.danoMinimo, dif + arma - reducao);
      }
    }
  }
  return { chance: acertos / 36, media: dano / 36 };
}

const sinal = (n) => (n >= 0 ? `+ ${n}` : `− ${-n}`);

/** Resolve um ataque (arma ou mágica) e devolve a entrada do registro. */
function resolver(estado, i, tipo, rng, { contra = false } = {}) {
  const o = estado.opcoes;
  const a = estado.lutadores[i];
  const d = estado.lutadores[1 - i];
  const n = numerosDoAtaque(estado, i, tipo);
  const linhas = [];
  let dadoAtaque;
  let gasto = 0;

  if (tipo === 'magiaFisica' || tipo === 'magiaMental') {
    const pericia = tipo === 'magiaFisica' ? 'magiaAtaqueFisico' : 'magiaAtaqueMental';
    const m = lancarMagia(a.ficha, { pericia, pmDisponivel: a.pm, rng });
    gasto = m.gasto;
    dadoAtaque = m.dado;
    a.pm -= gasto;
    linhas.push({
      rotulo: 'Pontos de Magia',
      dica: 'pontos-de-magia',
      valor: `gasta ${gasto} PM (no máximo o nível da Perícia Mágica, ${nivelDe(a.ficha, pericia)}); restam ${a.pm}`,
    });
  }

  const r = resolverAtaque({
    ataque: n.ataque,
    defesa: n.defesa,
    outrosDefesa: n.bonus,
    arma: n.arma,
    armadura: tipo === 'magiaMental' ? 0 : d.p.armadura,
    escudo: tipo === 'magiaMental' ? 0 : d.p.escudo,
    resistencia: tipo === 'magiaMental' ? 0 : d.p.resistencia,
    dadoAtaque,
    rng,
  });

  const formulaAtaque = {
    curta: 'Ataque Corporal + Agilidade',
    longa: 'Arremesso + Precisão',
    magiaFisica: 'PM gastos',
    magiaMental: 'PM gastos',
  }[tipo];
  const dicaAtaque = ACOES[tipo].dica;
  linhas.push({
    rotulo: 'Valor de Ataque',
    dica: dicaAtaque,
    valor: `${n.ataque} (${formulaAtaque}) + 🎲${r.dadoAtaque} = ${r.valorAtaque}`,
  });
  const formulaDefesa = tipo === 'magiaMental' ? 'Vontade + Fé' : 'Reflexo + Resistência';
  linhas.push({
    rotulo: 'Valor de Defesa',
    dica: tipo === 'magiaMental' ? 'magicas-de-ataque-mental' : 'defesa',
    valor: `${n.defesa} (${formulaDefesa})${n.bonus ? ` + ${n.bonus} (defendendo)` : ''} + 🎲${r.dadoDefesa} = ${r.valorDefesa}`,
  });

  const crit = o.criticos ? r.critico : { ataque: null, defesa: null };
  const notas = [];
  if (r.critico.ataque || r.critico.defesa) {
    const nome = { sucesso: 'sucesso crítico', falha: 'falha crítica' };
    const qual = [r.critico.ataque && `no ataque, ${nome[r.critico.ataque]}`, r.critico.defesa && `na defesa, ${nome[r.critico.defesa]}`]
      .filter(Boolean).join('; ');
    linhas.push({ rotulo: 'Crítico', dica: 'regras-especiais', valor: `${qual}${o.criticos ? '' : ' (sem efeito nas opções)'}` });
  }

  let dano = 0;
  let resumo;
  if (!r.acertou) {
    linhas.push({ rotulo: 'Resultado', dica: 'sequencia-de-combate', valor: `${r.valorAtaque} ≤ ${r.valorDefesa}: defendido` });
    notas.push(r.valorAtaque === r.valorDefesa ? 'Empate favorece quem defende.' : 'A Defesa foi maior: o golpe foi bloqueado ou esquivado.');
    resumo = `${a.nome} erra.`;
  } else {
    let passos = r.passos;
    dano = r.dano;
    if (crit.defesa === 'falha' && tipo !== 'magiaMental' && d.p.armadura > 0) {
      // Proposta 5.4: falha crítica na defesa ignora a armadura.
      passos = passos.map((p) => (p.nome === 'Armadura' ? { ...p, valor: 0, nome: 'Armadura (ignorada: falha crítica)' } : p));
      const bruto = passos.filter((p) => p.nome !== 'Mínimo por acerto').reduce((s, p) => s + p.valor, 0);
      dano = Math.max(REGRAS.danoMinimo, bruto);
      passos = passos.filter((p) => p.nome !== 'Mínimo por acerto');
      if (bruto < REGRAS.danoMinimo) passos.push({ nome: 'Mínimo por acerto', valor: REGRAS.danoMinimo - bruto });
    }
    const conta = passos
      .filter((p, k) => k === 0 || p.valor !== 0)
      .map((p, k) => (k === 0 ? `${p.valor} (${p.nome})` : `${sinal(p.valor)} (${p.nome})`))
      .join(' ');
    linhas.push({ rotulo: 'Dano', dica: 'sequencia-de-combate', valor: `${conta} = ${dano}` });
    if (passos.some((p) => p.nome === 'Mínimo por acerto')) notas.push('Todo acerto tira pelo menos 1.');
    if (tipo !== 'magiaMental' && o.resistenciaReduzDano && d.p.resistencia > 0) {
      notas.push(`A Resistência ${d.p.resistencia} já estava na Defesa e reduziu o dano de novo (o texto atual manda subtrair duas vezes).`);
    }
    if (crit.ataque === 'sucesso') {
      dano *= 2;
      linhas.push({ rotulo: 'Sucesso crítico', dica: 'regras-especiais', valor: `dano dobrado: ${dano}` });
    }
    const alvo = n.recurso === 'san' ? 'Sanidade' : 'Vida';
    if (n.recurso === 'san') d.san -= dano;
    else d.vida -= dano;
    linhas.push({
      rotulo: alvo,
      dica: n.recurso === 'san' ? 'sanidade' : 'pontos-de-vida',
      valor: `${d.nome}: ${(n.recurso === 'san' ? d.san : d.vida) + dano} − ${dano} = ${n.recurso === 'san' ? d.san : d.vida}`,
    });
    if (tipo === 'magiaMental') notas.push('Ataque Mental ignora armadura, escudo e Resistência e tira Sanidade.');
    resumo = `${a.nome} acerta: −${dano} ${alvo}.`;
  }

  const entrada = {
    rodada: estado.rodada,
    ator: i,
    titulo: `${contra ? 'Contra-ataque' : ACOES[tipo].nome}${tipo.startsWith('magia') ? '' : estado.distancia === 'curta' ? ' (curta)' : ' (longa)'}`,
    dica: dicaAtaque,
    linhas,
    nota: notas.join(' '),
    resumo,
    dano,
    acertou: r.acertou,
    critico: r.critico,
  };
  estado.log.push(entrada);

  if (!contra) {
    if (crit.ataque === 'falha') {
      a.perdeAcao = true;
      entrada.nota = `${entrada.nota} Falha crítica: ${a.nome} perde a próxima ação.`.trim();
    }
    if (crit.defesa === 'sucesso' && !r.acertou && !foraDeCombate(estado, 1 - i)) {
      const t = melhorAtaqueBasico(estado, 1 - i);
      if (t) resolver(estado, 1 - i, t, rng, { contra: true });
    }
  }
  return entrada;
}

/** Ataque com arma de maior valor possível na distância atual (para contra-ataques). */
function melhorAtaqueBasico(estado, i) {
  const p = estado.lutadores[i].p;
  if (estado.distancia === 'curta' && p.ataqueCurta >= p.ataqueLonga) return 'curta';
  return 'longa';
}

function foraDeCombate(estado, i) {
  const l = estado.lutadores[i];
  return l.vida <= 0 || (estado.opcoes.sanidadeDerruba && l.san <= 0);
}

function conferirFim(estado) {
  for (const i of [0, 1]) {
    if (foraDeCombate(estado, i)) {
      const l = estado.lutadores[i];
      const motivo = l.vida <= 0 ? 'vida' : 'sanidade';
      estado.fim = {
        vencedor: 1 - i,
        motivo,
        texto: `${estado.lutadores[1 - i].nome} vence: ${l.nome} ${motivo === 'vida' ? 'está desmaiado (Vida a zero)' : 'está fora de si (Sanidade a zero)'}.`,
      };
      // Se os dois caíram (contra-ataque), vence quem estava agindo.
      if (foraDeCombate(estado, 1 - i)) estado.fim.vencedor = daVez(estado);
      return true;
    }
  }
  return false;
}

/** Passa a vez; pula quem perdeu a ação por falha crítica. */
function avancar(estado) {
  for (;;) {
    estado.passo += 1;
    if (estado.passo > 1) {
      estado.passo = 0;
      estado.rodada += 1;
      if (estado.rodada > estado.opcoes.limiteRodadas) {
        estado.fim = { vencedor: null, motivo: 'tempo', texto: `Empate: ${estado.opcoes.limiteRodadas} rodadas sem vencedor.` };
        return;
      }
    }
    const l = estado.lutadores[daVez(estado)];
    l.defendendo = false; // o bônus de Defender dura até a próxima ação de quem defendeu
    if (!l.perdeAcao) return;
    l.perdeAcao = false;
    estado.log.push({ rodada: estado.rodada, ator: daVez(estado), titulo: 'Ação perdida', dica: 'regras-especiais', linhas: [], nota: 'Efeito da falha crítica no ataque anterior.', resumo: `${l.nome} se recompõe e não age nesta rodada.` });
  }
}

/** Teste de Afastar-se: Agilidade + 1D6 contra Agilidade + 1D6; empate fica perto. */
function afastar(estado, i, rng) {
  const a = estado.lutadores[i];
  const d = estado.lutadores[1 - i];
  const da = d6(rng);
  const dd = d6(rng);
  const va = a.p.agilidade + da;
  const vd = d.p.agilidade + dd;
  const ok = va > vd;
  if (ok) estado.distancia = 'longa';
  estado.log.push({
    rodada: estado.rodada,
    ator: i,
    titulo: 'Afastar-se',
    dica: 'agilidade',
    linhas: [
      { rotulo: 'Quem foge', dica: 'agilidade', valor: `${a.p.agilidade} (Agilidade) + 🎲${da} = ${va}` },
      { rotulo: 'Quem persegue', dica: 'agilidade', valor: `${d.p.agilidade} (Agilidade) + 🎲${dd} = ${vd}` },
    ],
    nota: 'Regra da arena (o manual não trata de movimento): para abrir distância é preciso vencer a Agilidade do oponente; empate fica perto.',
    resumo: ok ? `${a.nome} abre distância.` : `${d.nome} não deixa ${a.nome} se afastar.`,
  });
}

/**
 * Executa a ação de quem está na vez e passa a vez. `acao` é um id de
 * `ACOES`. Devolve o próprio estado (alterado).
 */
export function executar(estado, acao, rng = Math.random) {
  if (estado.fim) return estado;
  const i = daVez(estado);
  const disp = acoesDisponiveis(estado, i).find((x) => x.id === acao);
  if (!disp || !disp.disponivel) throw new Error(`Ação indisponível: ${acao}`);
  const l = estado.lutadores[i];
  comRegras(estado.opcoes, () => {
    if (acao === 'aproximar') {
      estado.distancia = 'curta';
      estado.log.push({ rodada: estado.rodada, ator: i, titulo: 'Aproximar-se', dica: 'ataque-a-curta-distancia', linhas: [], nota: 'Gasta a ação para entrar na distância curta, onde vale o Ataque Corporal.', resumo: `${l.nome} avança: distância curta.` });
    } else if (acao === 'afastar') {
      afastar(estado, i, rng);
    } else if (acao === 'defender') {
      l.defendendo = true;
      estado.log.push({ rodada: estado.rodada, ator: i, titulo: 'Defender', dica: 'defesa', linhas: [{ rotulo: 'Defesa', dica: 'defesa', valor: `+${estado.opcoes.bonusDefender} até a próxima ação` }], nota: 'Proposta 5.2 de PENDENCIAS.md: quem gasta a ação só defendendo ganha bônus na Defesa.', resumo: `${l.nome} se protege.` });
    } else {
      resolver(estado, i, acao, rng);
    }
  });
  if (!conferirFim(estado)) avancar(estado);
  return estado;
}

/* ------------------------------------------------------------------------ */
/* IA                                                                       */
/* ------------------------------------------------------------------------ */

const ATAQUES = ['curta', 'longa', 'magiaFisica', 'magiaMental'];

/**
 * Rodadas que `i` leva, em média, para derrubar o oponente na distância
 * `dist`, usando o melhor ataque disponível ali. Infinity se não houver.
 */
function rodadasParaVencer(estado, i, dist, semBonus = false) {
  const sim = { ...estado, distancia: dist, lutadores: estado.lutadores.map((l) => ({ ...l, defendendo: semBonus ? false : l.defendendo })) };
  const d = estado.lutadores[1 - i];
  let melhor = { rodadas: Infinity, acao: null };
  for (const id of ATAQUES) {
    const disp = acoesDisponiveis(sim, i).find((x) => x.id === id);
    if (!disp?.disponivel) continue;
    const n = numerosDoAtaque(sim, i, id);
    if (n.ataque <= 0 && id !== 'curta' && id !== 'longa') continue;
    const e = expectativa(n);
    if (e.media <= 0) continue;
    const recurso = n.recurso === 'san' ? (estado.opcoes.sanidadeDerruba ? d.san : Infinity) : d.vida;
    let rodadas = recurso / e.media;
    if (id.startsWith('magia')) {
      const custo = n.ataque;
      const usos = Math.floor(estado.lutadores[i].pm / custo);
      if (usos < Math.ceil(rodadas)) rodadas += 3 * (Math.ceil(rodadas) - usos); // vai faltar PM
    }
    if (rodadas < melhor.rodadas) melhor = { rodadas, acao: id };
  }
  return melhor;
}

/**
 * Escolha da IA: compara a corrida "quantas rodadas eu levo para vencer"
 * contra "quantas o oponente leva", na distância atual e na outra. Muda de
 * distância quando a troca compensa a ação gasta; senão usa o ataque mais
 * rápido. Defende quando não tem como causar dano.
 */
export function escolherIA(estado, i = daVez(estado)) {
  const atual = estado.distancia;
  const outra = atual === 'curta' ? 'longa' : 'curta';
  const eu = rodadasParaVencer(estado, i, atual);
  const ele = rodadasParaVencer(estado, 1 - i, atual, true);
  const euOutra = rodadasParaVencer(estado, i, outra);
  const eleOutra = rodadasParaVencer(estado, 1 - i, outra, true);

  const margem = (m, t) => Math.min(t.rodadas, 99) - Math.min(m.rodadas, 99);
  const ficar = margem(eu, ele);
  let mudar = margem({ rodadas: euOutra.rodadas + 1 }, eleOutra);
  if (outra === 'longa') {
    const a = estado.lutadores[i].p.agilidade;
    const b = estado.lutadores[1 - i].p.agilidade;
    const chance = expectativa({ ataque: a, defesa: b }).chance;
    mudar = chance * mudar + (1 - chance) * (ficar - 1);
  }
  if (mudar > ficar + 0.5) return outra === 'curta' ? 'aproximar' : 'afastar';
  if (eu.acao) return eu.acao;
  if (euOutra.acao) return outra === 'curta' ? 'aproximar' : 'afastar';
  return estado.opcoes.defender ? 'defender' : 'longa';
}

/* ------------------------------------------------------------------------ */
/* Simulador                                                                */
/* ------------------------------------------------------------------------ */

/** Gerador determinístico (mulberry32): mesma semente, mesmos dados. */
export function semente(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Um duelo inteiro IA contra IA. Devolve vencedor (0, 1 ou null), rodadas e motivo. */
export function simularDuelo(fichaA, fichaB, { opcoes = {}, rng = Math.random } = {}) {
  const estado = criarDuelo(fichaA, fichaB, { opcoes, rng });
  while (!estado.fim) executar(estado, escolherIA(estado), rng);
  return { vencedor: estado.fim.vencedor, rodadas: Math.min(estado.rodada, estado.opcoes.limiteRodadas), motivo: estado.fim.motivo };
}

/**
 * Roda `n` duelos para cada par de builds (incluindo espelhos). Devolve
 * `{ ids, confrontos: { 'a|b': {...} }, geral: { id: {...} } }` com taxa de
 * vitória, empates, duração média em rodadas e como os duelos terminaram.
 */
export function simular({ ids = Object.keys(BUILDS), n = 500, opcoes = {}, rng = semente(1), fichas = null } = {}) {
  const o = { ...OPCOES_PADRAO, ...opcoes };
  const f = fichas ?? Object.fromEntries(ids.map((id) => [id, montarBuild(id, o.orcamento)]));
  const confrontos = {};
  const geral = Object.fromEntries(ids.map((id) => [id, { vitorias: 0, derrotas: 0, empates: 0, duelos: 0 }]));
  for (const [x, a] of ids.entries()) {
    for (const b of ids.slice(x)) {
      const c = { a, b, n, vitoriasA: 0, vitoriasB: 0, empates: 0, rodadas: 0, porVida: 0, porSanidade: 0 };
      for (let k = 0; k < n; k++) {
        const r = simularDuelo(f[a], f[b], { opcoes: o, rng });
        c.rodadas += r.rodadas;
        if (r.vencedor === 0) c.vitoriasA += 1;
        else if (r.vencedor === 1) c.vitoriasB += 1;
        else c.empates += 1;
        if (r.motivo === 'vida') c.porVida += 1;
        if (r.motivo === 'sanidade') c.porSanidade += 1;
      }
      c.rodadas /= n;
      confrontos[`${a}|${b}`] = c;
      if (a !== b) {
        geral[a].vitorias += c.vitoriasA; geral[a].derrotas += c.vitoriasB; geral[a].empates += c.empates; geral[a].duelos += n;
        geral[b].vitorias += c.vitoriasB; geral[b].derrotas += c.vitoriasA; geral[b].empates += c.empates; geral[b].duelos += n;
      }
    }
  }
  for (const g of Object.values(geral)) g.taxa = g.duelos ? g.vitorias / g.duelos : 0;
  return { ids, opcoes: o, confrontos, geral };
}

/** Taxa de vitória de `a` contra `b` no resultado do simulador (0 a 1). */
export function taxa(resultado, a, b) {
  const c = resultado.confrontos[`${a}|${b}`];
  if (c) return c.vitoriasA / c.n;
  const r = resultado.confrontos[`${b}|${a}`];
  return r.vitoriasB / r.n;
}
