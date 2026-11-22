/**
 * Duplo Seis: a sessão. Sem DOM.
 *
 * O Mestre apresenta uma cena, o jogador escolhe uma abordagem e as regras do
 * manual (regras.js) decidem. Tudo o que o manual deixa "a critério do Mestre"
 * está no bloco MESA, e só nele.
 *
 * Fases: 'cena' → ('insistir' | 'combate') → 'desfecho' → ('surto') → próxima
 * cena, 'acampamento' ou 'fim'.
 */
import * as R from './regras.js';
import { fluxo, comoFuncao, embaralhar, inteiro, sortear } from './rng.js';
import { t, idiomaAtual, nomeDaChave, nomeDaDificuldade } from './idioma.js';

/** Decisões do Mestre: nada aqui é regra do Clip. */
export const MESA = {
  brasa: 10,
  cenasPorAto: 4,
  atos: 3,
  noite: { brasa: -2 }, // cada acampamento é uma noite a menos de brasa
  aperto: [0, 0, 1, 1, 1], // o Mestre aperta a Dificuldade conforme o ato (a noite cai)
  pontosPorAto: 1, // Pontos de Evolução por ato vencido, mais 1 por marco de história
  repouso: { feridas: 'vida', cabeca: 'sanidade', brasa: 2 },
  quedas: 2, // na segunda vez sem Vida, o Mestre decide "morto"
  desmaio: { brasa: -2, brasaAcompanhado: -1 },
  surtos: 3, // na terceira vez sem Sanidade, o personagem não volta
  combate: { rodadas: 10, ajudaDeCompanheiro: 1 },
  cansaco: 1, // companheiro que une forças numa falha fica de fora da cena seguinte
  critico: {
    sucessoBonus: { sanidade: 2 }, // duplo seis num teste que já passou, sem desfecho próprio
    falhaExtra: { sanidade: -1 }, // duplo um num teste que já falhou, sem desfecho próprio
    sucessoCaro: { vida: -1 }, // duplo um num teste que passou
  },
};

const REACOES = ['furia', 'impulso', 'convulsao', 'torpor'];

/* ---------- Início ---------- */

export function nova({ semente, passado = 'desertora', nome, aventura }) {
  // `passado` é o id de um passado da aventura, ou uma ficha livre feita pelo jogador.
  const p = typeof passado === 'object' ? passado : aventura.passados.find((x) => x.id === passado) ?? aventura.passados[0];
  const ficha = R.novaFicha({ nome: nome || p.nome, atributos: p.atributos, aprimoramentos: p.aprimoramentos, pericias: p.pericias, antecedentes: p.antecedentes });
  const v = R.valores(ficha);
  const e = {
    semente: String(semente),
    aventura,
    passado: p.id,
    tituloDoPassado: p.titulo,
    nome: ficha.nome,
    ficha,
    max: { vida: v.vida, magia: v.magia, sanidade: v.sanidade },
    vida: v.vida,
    magia: v.magia,
    sanidade: v.sanidade,
    brasa: MESA.brasa,
    lacos: 0,
    marcas: [],
    itens: [...p.itens],
    companheiros: [],
    pontos: 0,
    marcosDoAto: 0,
    quedas: 0,
    surtos: 0,
    ato: 0,
    cenaNoAto: 0,
    vistas: [],
    cansados: [],
    cronica: [],
    trilha: [],
    fase: 'cena',
    cena: null,
    rolagem: null,
    combate: null,
    desfecho: null,
    acampamento: null,
    fim: null,
    r: fluxo(semente, 'dados'),
  };
  entrarNaCena(e, aventura.abertura);
  return e;
}

const rng = (e) => comoFuncao(e.r);
/** Texto de sistema: o da aventura, se ela tiver; senão o padrão, no idioma da mesa (textos/*.js, bloco `sistema`). */
const txt = (e, k) => e.aventura.textos?.[k] ?? t(`sistema.${k}`);
const lista = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const comNome = (e, texto) => String(texto).replaceAll('{nome}', e.nome);

function rolarTexto(e, expr) {
  const m = /^(\d+)d6$/.exec(expr);
  let s = 0;
  for (let i = 0; i < Number(m[1]); i++) s += R.d6(rng(e));
  return s;
}

/* ---------- Requisitos e efeitos ---------- */

export function fecha(e, requer) {
  if (!requer) return true;
  for (const [k, v] of Object.entries(requer)) {
    if (k === 'nivel') { for (const [c, n] of Object.entries(v)) if (R.nivel(e.ficha, c) < n) return false; }
    else if (k === 'antecedente') { if (!e.ficha.antecedentes[v]) return false; }
    else if (k === 'item') { if (!e.itens.includes(v)) return false; }
    else if (k === 'companheiro') { if (!e.companheiros.includes(v)) return false; }
    else if (k === 'marca') { if (!e.marcas.includes(v)) return false; }
    else if (k === 'semMarca') { if (e.marcas.includes(v)) return false; }
    else if (k === 'lacos') { if (e.lacos < v) return false; }
  }
  return true;
}

/** Aplica efeitos e devolve a lista do que mudou, para a mesa mostrar. */
function aplicar(e, efeitos) {
  const mudou = [];
  if (!efeitos) return mudou;
  const av = e.aventura;
  for (const [k, v] of Object.entries(efeitos)) {
    if (k === 'vida' || k === 'sanidade' || k === 'magia') {
      const antes = e[k];
      e[k] = Math.max(0, Math.min(e.max[k], e[k] + v));
      if (e[k] !== antes) mudou.push({ tipo: k, valor: e[k] - antes });
    } else if (k === 'brasa') {
      const antes = e.brasa;
      e.brasa = Math.max(0, Math.min(MESA.brasa, e.brasa + v));
      if (e.brasa !== antes) mudou.push({ tipo: 'brasa', valor: e.brasa - antes });
    } else if (k === 'lacos') {
      e.lacos = Math.max(0, e.lacos + v);
      mudou.push({ tipo: 'lacos', valor: v });
    } else if (k === 'item') {
      for (const id of lista(v)) { e.itens.push(id); mudou.push({ tipo: 'item', nome: av.itens[id].nome }); }
    } else if (k === 'semItem') {
      for (const id of lista(v)) {
        const i = e.itens.indexOf(id);
        if (i >= 0) { e.itens.splice(i, 1); mudou.push({ tipo: 'semItem', nome: av.itens[id].nome }); }
      }
    } else if (k === 'companheiro') {
      for (const id of lista(v)) if (!e.companheiros.includes(id)) { e.companheiros.push(id); mudou.push({ tipo: 'companheiro', nome: av.companheiros[id].nome }); }
    } else if (k === 'semCompanheiro') {
      for (const id of lista(v)) {
        const i = e.companheiros.indexOf(id);
        if (i >= 0) { e.companheiros.splice(i, 1); mudou.push({ tipo: 'semCompanheiro', nome: av.companheiros[id].nome }); }
      }
    } else if (k === 'marca') {
      for (const m of lista(v)) if (!e.marcas.includes(m)) e.marcas.push(m);
    } else if (k === 'marco' && v) {
      e.marcosDoAto += 1;
      mudou.push({ tipo: 'marco' });
    }
  }
  return mudou;
}

/* ---------- Equipamento (Limitação para Equipamentos) ---------- */

/**
 * O que o personagem usa em combate: a melhor combinação de arma, armadura e
 * escudo cuja soma de modificadores cabe na Força. Itens de modificador 0
 * entram sempre.
 */
export function equipado(e) {
  const av = e.aventura;
  const meus = e.itens.map((id) => ({ id, ...av.itens[id] }));
  const opcoes = (tipo, filtro = () => true) => [null, ...meus.filter((i) => i.tipo === tipo && filtro(i))];
  const limite = R.limiteDeEquipamento(e.ficha);
  let melhor = { arma: null, longa: null, armadura: null, escudo: null, soma: -1 };
  for (const arma of opcoes('arma', (i) => !i.longa)) {
    for (const longa of opcoes('arma', (i) => i.longa)) {
      for (const armadura of opcoes('armadura')) {
        for (const escudo of opcoes('escudo')) {
          const usados = [arma, longa, armadura, escudo].filter(Boolean);
          const peso = usados.reduce((s, i) => s + i.mod, 0);
          if (peso > limite) continue;
          const soma = peso * 10 + usados.length;
          if (soma > melhor.soma) melhor = { arma, longa, armadura, escudo, soma };
        }
      }
    }
  }
  return { ...melhor, limite };
}

/* ---------- Cenas ---------- */

function entrarNaCena(e, cena) {
  e.cansados = e.cansando ?? [];
  e.cansando = [];
  e.cena = cena;
  e.fase = 'cena';
  e.rolagem = null;
  e.combate = null;
  e.desfecho = null;
  e.vistas.push(cena.id);
  e.entrada = aplicar(e, cena.efeitosAoEntrar);
}

/** O que o jogador pode tentar agora, com tudo o que a mesa precisa mostrar. */
export function opcoes(e) {
  if (e.fase !== 'cena') return [];
  const av = e.aventura;
  return e.cena.abordagens.filter((a) => fecha(e, a.requer)).map((a) => {
    const o = { id: a.id, rotulo: a.rotulo, especial: !!a.requer, tipo: a.teste ? 'teste' : a.combate ? 'combate' : 'livre' };
    if (a.teste) {
      const { chave } = a.teste;
      const magica = !!R.PERICIAS[chave]?.magica;
      const dificuldade = a.teste.dificuldade + (magica ? 0 : MESA.aperto[e.cena.ato] ?? 0);
      Object.assign(o, {
        chave,
        nomeChave: nomeDaChave(chave),
        caminho: R.caminhoDaChave(chave),
        dificuldade,
        nomeDificuldade: nomeDaDificuldade(dificuldade),
        nivel: R.nivel(e.ficha, chave),
        magica,
      });
      if (magica) {
        o.maxPM = R.maximoDePM(e.ficha, chave, e.magia);
        o.disponivel = o.maxPM > 0;
        o.objetos = [];
        o.aliados = [];
      } else {
        o.disponivel = true;
        o.objetos = e.itens
          .map((id) => ({ id, ...av.itens[id] }))
          .filter((i) => i.tipo === 'objeto' && i.tags?.some((t) => a.ajuda?.includes(t)))
          .map((i) => ({ id: i.id, nome: i.nome, mod: i.mod }));
        o.aliados = [
          ...(a.ajudantes ?? []).map((h, i) => ({ id: `cena:${i}`, nome: h.nome, nivel: h.nivel })),
          ...e.companheiros.filter((id) => !e.cansados?.includes(id)).map((id) => ({ id, nome: av.companheiros[id].nome, nivel: av.companheiros[id].niveis[chave] ?? 0 })).filter((c) => c.nivel > 0),
        ];
      }
    } else if (a.combate) {
      const ini = av.inimigos[a.combate];
      Object.assign(o, { caminho: 'corpo', inimigo: ini.nome, disponivel: true });
    } else {
      o.custo = a.custo ?? null;
      o.disponivel = !a.custo || Object.entries(a.custo).every(([k, v]) => e[k] + v >= 0);
    }
    return o;
  });
}

/**
 * Escolhe uma abordagem. `extras`: { objeto: id, unir: [ids], pm: n }.
 */
export function escolher(e, id, extras = {}) {
  if (e.fase !== 'cena') return e;
  const a = e.cena.abordagens.find((x) => x.id === id);
  const o = opcoes(e).find((x) => x.id === id);
  if (!a || !o || !o.disponivel) return e;
  e.abordagem = a;

  if (a.livre) {
    aplicar(e, a.custo);
    return fechar(e, a.resultado, { tipo: 'livre', ok: true });
  }
  if (a.combate) return comecarCombate(e, a);

  let rolagem;
  if (o.magica) {
    const pm = Math.max(1, Math.min(o.maxPM, extras.pm ?? o.maxPM));
    e.magia -= pm;
    rolagem = R.testar({ nivel: pm, dificuldade: o.dificuldade, rng: rng(e) });
    rolagem.pm = pm;
  } else {
    const objeto = o.objetos.find((x) => x.id === extras.objeto) ?? null;
    const unidos = o.aliados.filter((x) => (extras.unir ?? []).includes(x.id));
    rolagem = R.testar({
      nivel: o.nivel,
      objeto: objeto?.mod ?? 0,
      aliados: unidos.reduce((s, x) => s + x.nivel, 0),
      dificuldade: o.dificuldade,
      rng: rng(e),
    });
    rolagem.objeto = objeto;
    rolagem.unidos = unidos;
  }
  rolagem.chave = o.chave;
  rolagem.nomeChave = o.nomeChave;
  rolagem.caminho = o.caminho;
  // A sorte interfere: o primeiro dado é o "dado da sorte" (Regras Especiais).
  rolagem.sorte = R.critico(rolagem.dados[0], rng(e));
  e.rolagem = rolagem;

  const crit = rolagem.sorte.tipo;
  if (!rolagem.sucesso && crit !== 'sucesso') {
    const custo = R.custoDeInsistir(o.chave, rolagem);
    if (custo != null && e.vida > custo) {
      rolagem.custoInsistir = custo;
      e.fase = 'insistir';
      return e;
    }
  }
  return resolverTeste(e, false);
}

/** Depois de uma falha no Corpo: pagar em Vida o que faltou, ou aceitar. */
export function insistir(e, sim) {
  if (e.fase !== 'insistir') return e;
  if (sim) {
    e.vida -= e.rolagem.custoInsistir;
    e.rolagem.insistiu = true;
  }
  return resolverTeste(e, sim);
}

function resolverTeste(e, insistiu) {
  const a = e.abordagem;
  const r = e.rolagem;
  const crit = r.sorte.tipo;
  let ok = r.sucesso || insistiu;
  let desf;
  let extra = null;
  if (crit === 'sucesso') {
    if (ok) { desf = a.critico ?? a.sucesso; if (!a.critico) extra = MESA.critico.sucessoBonus; }
    else { ok = true; desf = a.sucesso; r.viradaDaSorte = true; }
  } else if (crit === 'falha') {
    if (ok) { desf = a.sucesso; extra = MESA.critico.sucessoCaro; }
    else { desf = a.desastre ?? a.falha; if (!a.desastre) extra = MESA.critico.falhaExtra; }
  } else {
    desf = ok ? a.sucesso : a.falha;
  }
  const antes = insistiu ? [{ tipo: 'vida', valor: -r.custoInsistir }] : [];
  // Quem uniu forças numa falha precisa de fôlego: fica de fora da próxima cena.
  const juntos = (r.unidos ?? []).map((u) => u.id).filter((id) => e.companheiros.includes(id));
  e.cansando = !ok && MESA.cansaco ? juntos : [];
  fechar(e, desf, { tipo: 'teste', ok, critico: crit, antes, extra });
  for (const id of e.cansando) e.desfecho.mudou.push({ tipo: 'cansado', nome: e.aventura.companheiros[id].nome });
  return e;
}

/** Fecha a cena com um desfecho: aplica efeitos, escreve a crônica. */
function fechar(e, desf, { tipo, ok, critico = null, antes = [], extra = null }) {
  const mudou = [...antes, ...aplicar(e, desf.efeitos), ...aplicar(e, extra)];
  e.cronica.push(comNome(e, desf.cronica));
  e.trilha.push({ cena: e.cena.id, abordagem: e.abordagem.id, caminho: caminhoDaAbordagem(e.abordagem), ok, critico });
  e.desfecho = { tipo, ok, critico, texto: comNome(e, desf.texto), mudou, avisos: [] };
  e.fase = 'desfecho';
  conferirLimites(e);
  return e;
}

function caminhoDaAbordagem(a) {
  if (a.teste) return R.caminhoDaChave(a.teste.chave);
  if (a.combate) return 'corpo';
  return a.caminho ?? null;
}

/** Sem Vida: desmaiado ou morto. Sem Sanidade: fora de si. */
function conferirLimites(e) {
  const d = e.desfecho;
  if (e.vida <= 0) {
    e.quedas += 1;
    if (e.quedas >= MESA.quedas) { d.fatal = 'morte'; return; }
    const quem = e.companheiros[0] ? e.aventura.companheiros[e.companheiros[0]].nome : null;
    const perde = quem ? MESA.desmaio.brasaAcompanhado : MESA.desmaio.brasa;
    e.vida = Math.min(e.max.vida, rolarTexto(e, '1d6'));
    const antes = e.brasa;
    e.brasa = Math.max(0, e.brasa + perde);
    d.avisos.push({ tipo: 'desmaio', texto: quem ? txt(e, 'desmaioAcompanhado').replace('{quem}', quem) : txt(e, 'desmaio'), mudou: [{ tipo: 'brasa', valor: e.brasa - antes }] });
    e.cronica.push(comNome(e, txt(e, 'cronicaDesmaio')));
  }
  if (e.sanidade <= 0) {
    e.surtos += 1;
    if (e.surtos >= MESA.surtos) { d.fatal = 'perdido'; return; }
    d.surto = sortear(e.r, REACOES);
  }
}

/* ---------- Combate (Sequência de Combate) ---------- */

function comecarCombate(e, a) {
  const base = e.aventura.inimigos[a.combate];
  const ini = { arma: 0, armadura: 0, resistencia: 0, reflexo: 0, agilidade: 0, destreza: 0, corpo: 0, vontade: 0, fe: 0, ...base };
  const n = (k) => R.nivel(e.ficha, k);
  const vez = R.iniciativa(
    { reflexo: n('reflexo'), agilidade: n('agilidade'), destreza: n('destreza'), corpo: R.valorDoCaminho(e.ficha, 'corpo') },
    ini,
    rng(e),
  );
  e.combate = { inimigo: ini, vida: ini.vida, rodada: 0, primeiro: vez === 'a' ? 'voce' : 'inimigo', log: [], fim: null };
  e.fase = 'combate';
  return e;
}

/** Ações possíveis na rodada. */
export function acoesDeCombate(e) {
  if (e.fase !== 'combate') return [];
  const eq = equipado(e);
  const v = R.valores(e.ficha);
  const ajuda = e.companheiros.length ? MESA.combate.ajudaDeCompanheiro : 0;
  const acoes = [{ id: 'golpear', rotulo: eq.arma ? t('acoes.golpearCom', { arma: eq.arma.nome }) : t('acoes.maosNuas'), ataque: v.ataqueCurta + ajuda, arma: eq.arma?.mod ?? 0 }];
  if (eq.longa) acoes.push({ id: 'atirar', rotulo: t('acoes.atirarCom', { arma: eq.longa.nome }), ataque: v.ataqueLonga + ajuda, arma: eq.longa.mod });
  const pmFisico = R.maximoDePM(e.ficha, 'magiaAtaqueFisico', e.magia);
  if (pmFisico > 0) acoes.push({ id: 'magia', rotulo: t('acoes.ataqueMagico'), maxPM: pmFisico });
  const pmMental = R.maximoDePM(e.ficha, 'magiaAtaqueMental', e.magia);
  if (pmMental > 0) acoes.push({ id: 'mental', rotulo: t('acoes.ataqueMente'), maxPM: pmMental });
  acoes.push({ id: 'recuar', rotulo: t('acoes.recuar') });
  return acoes;
}

/** Ajusta um ataque pelos críticos: é o Mestre punindo a falha e bonificando o sucesso. */
function comCriticos(g, semProtecao) {
  const r = { ...g, critico: null };
  if (g.critAtaque.tipo === 'falha') { r.acertou = false; r.dano = 0; r.critico = 'ataque-falha'; }
  else if (g.critDefesa.tipo === 'sucesso') { r.acertou = false; r.dano = 0; r.critico = 'defesa-sucesso'; }
  else if (g.acertou) {
    if (g.critDefesa.tipo === 'falha') { r.dano = Math.max(1, semProtecao); r.critico = 'defesa-falha'; }
    if (g.critAtaque.tipo === 'sucesso') { r.dano *= 2; r.critico = 'ataque-sucesso'; }
  }
  return r;
}

function meuGolpe(e, acao, pm) {
  const c = e.combate;
  const ini = c.inimigo;
  const acoes = acoesDeCombate(e);
  const a = acoes.find((x) => x.id === acao) ?? acoes[0];
  let g;
  let alvo = 'vida';
  if (a.id === 'magia' || a.id === 'mental') {
    const gasto = Math.max(1, Math.min(a.maxPM, pm ?? a.maxPM));
    e.magia -= gasto;
    if (a.id === 'magia') {
      g = R.ataqueMagicoFisico({ pm: gasto, defesa: ini.defesa, armadura: ini.armadura, resistencia: ini.resistencia, rng: rng(e) });
      g = comCriticos(g, g.valorAtaque - g.valorDefesa);
    } else {
      g = R.ataqueMental({ ataque: gasto, vontade: ini.vontade, fe: ini.fe, rng: rng(e) });
      g = comCriticos(g, g.dano);
    }
    g.pm = gasto;
  } else {
    g = R.atacar({ ataque: a.ataque, defesa: ini.defesa, arma: a.arma, armadura: ini.armadura, resistencia: ini.resistencia, rng: rng(e) });
    g = comCriticos(g, g.valorAtaque - g.valorDefesa + a.arma);
  }
  c.vida = Math.max(0, c.vida - g.dano);
  c.log.push({ quem: 'voce', acao: a.id, rotulo: a.rotulo, alvo, ...g });
}

function golpeDoInimigo(e) {
  const c = e.combate;
  const ini = c.inimigo;
  const eq = equipado(e);
  const n = (k) => R.nivel(e.ficha, k);
  let g;
  let alvo;
  if (ini.mental) {
    g = R.ataqueMental({ ataque: ini.ataque, vontade: n('vontade'), fe: n('fe'), rng: rng(e) });
    g = comCriticos(g, g.dano);
    alvo = 'sanidade';
    e.sanidade = Math.max(0, e.sanidade - g.dano);
  } else {
    const armadura = eq.armadura?.mod ?? 0;
    const escudo = eq.escudo?.mod ?? 0;
    g = R.atacar({ ataque: ini.ataque, defesa: R.valores(e.ficha).defesa, arma: ini.arma, armadura, escudo, resistencia: n('resistencia'), rng: rng(e) });
    g = comCriticos(g, g.valorAtaque - g.valorDefesa + ini.arma);
    alvo = 'vida';
    e.vida = Math.max(0, e.vida - g.dano);
  }
  c.log.push({ quem: 'inimigo', rotulo: ini.nome, alvo, ...g });
}

/** Uma rodada: a sua ação e a do inimigo, na ordem da iniciativa. */
export function lutar(e, acao, { pm } = {}) {
  if (e.fase !== 'combate') return e;
  const c = e.combate;
  const a = e.abordagem;
  c.rodada += 1;
  c.log = [];
  const caiu = () => e.vida <= 0 || e.sanidade <= 0;

  if (acao === 'recuar') {
    golpeDoInimigo(e);
    return fecharCombate(e, caiu() ? 'derrota' : 'fuga');
  }
  const ordem = c.primeiro === 'voce' ? ['voce', 'inimigo'] : ['inimigo', 'voce'];
  for (const quem of ordem) {
    if (quem === 'voce') meuGolpe(e, acao, pm); else golpeDoInimigo(e);
    if (c.vida <= 0) return fecharCombate(e, 'vitoria');
    if (caiu()) return fecharCombate(e, 'derrota');
  }
  if (c.rodada >= MESA.combate.rodadas) return fecharCombate(e, 'fuga');
  void a;
  return e;
}

function fecharCombate(e, como) {
  const a = e.abordagem;
  e.combate.fim = como;
  const logFinal = e.combate.log;
  fechar(e, a[como], { tipo: 'combate', ok: como === 'vitoria' });
  e.desfecho.combate = { fim: como, log: logFinal };
  return e;
}

/** Em palavras, como o inimigo está: o Mestre não diz Pontos de Vida. */
export function estadoDoInimigo(e) {
  const c = e.combate;
  if (!c) return '';
  const f = c.vida / c.inimigo.vida;
  if (f >= 1) return t('inimigo.inteiro');
  if (f > 0.6) return t('inimigo.arranhado');
  if (f > 0.3) return t('inimigo.ferido');
  if (f > 0) return t('inimigo.quaseCaindo');
  return t('inimigo.caido');
}

/* ---------- Depois do desfecho ---------- */

/** Segue a sessão: surto, próxima cena, acampamento ou fim. */
export function continuar(e) {
  if (e.fase === 'desfecho') {
    const d = e.desfecho;
    if (d.fatal) return terminar(e, e.aventura.quedas[d.fatal]);
    if (d.surto) return surtar(e, d.surto);
    return avancar(e);
  }
  if (e.fase === 'surto') return avancar(e);
  if (e.fase === 'acampamento') return partir(e);
  return e;
}

/**
 * Sem Sanidade o personagem "perde o controle sobre suas ações": fúria,
 * loucura impulsiva, convulsões ou torpor. Quem escolhe é o Mestre.
 */
function surtar(e, reacao) {
  let texto = txt(e, reacao);
  let mudou = [];
  if (reacao === 'furia') {
    if (e.companheiros.length) mudou = aplicar(e, { semCompanheiro: e.companheiros[e.companheiros.length - 1], vida: -1 });
    else { texto = txt(e, 'furiaSozinho'); mudou = aplicar(e, { vida: -1 }); }
  } else if (reacao === 'impulso') {
    const perde = e.itens.length ? sortear(e.r, e.itens) : null;
    mudou = aplicar(e, { ...(perde ? { semItem: perde } : {}), brasa: -1 });
  } else if (reacao === 'convulsao') {
    mudou = aplicar(e, { vida: -2 });
  } else {
    mudou = aplicar(e, { brasa: -2 });
  }
  if (e.vida <= 0) e.vida = 1;
  e.sanidade = Math.min(e.max.sanidade, rolarTexto(e, '1d6'));
  e.cronica.push(comNome(e, txt(e, 'cronicaSurto')));
  e.surto = { reacao, texto, mudou, restam: MESA.surtos - e.surtos };
  e.fase = 'surto';
  return e;
}

function avancar(e) {
  const av = e.aventura;
  // Dentro do Farol: as cenas finais em ordem.
  if (e.ato > MESA.atos) {
    const i = av.desfecho.findIndex((c) => c.id === e.cena.id);
    if (i + 1 < av.desfecho.length) { entrarNaCena(e, av.desfecho[i + 1]); return e; }
    return terminar(e, finalDaSessao(e));
  }
  if (e.ato === 0) { e.ato = 1; e.cenaNoAto = 0; }
  if (e.cenaNoAto >= MESA.cenasPorAto) return acampar(e);
  const proxima = sortearCena(e);
  if (!proxima) return acampar(e);
  e.cenaNoAto += 1;
  entrarNaCena(e, proxima);
  return e;
}

/** A ordem das cenas de um ato depende só da semente; o que entra, do que já aconteceu. */
function sortearCena(e) {
  const doAto = e.aventura.cenas.filter((c) => c.ato === e.ato);
  const ordem = embaralhar(fluxo(e.semente, 'roteiro', e.ato), doAto);
  return ordem.find((c) => !e.vistas.includes(c.id) && fecha(e, c.requer)) ?? null;
}

/* ---------- Acampamento: marcos, evolução e repouso ---------- */

function acampar(e) {
  const ganhos = MESA.pontosPorAto + e.marcosDoAto;
  e.pontos += ganhos;
  const mudou = aplicar(e, MESA.noite);
  const pm = e.max.magia - e.magia;
  e.magia = e.max.magia;
  if (pm > 0) mudou.push({ tipo: 'magia', valor: pm });
  e.acampamento = { ato: e.ato, ganhos, marcos: e.marcosDoAto, texto: txt(e, 'noite'), mudou, repousou: null };
  e.marcosDoAto = 0;
  e.fase = 'acampamento';
  return e;
}

/** O que dá para comprar com um Ponto de Evolução, dentro dos tetos do manual. */
export function compras(e) {
  const f = e.ficha;
  const linha = (chave) => ({ chave, nome: nomeDaChave(chave), tipo: R.tipoDaChave(chave), caminho: R.caminhoDaChave(chave), nivel: R.nivel(f, chave), teto: R.teto(f, chave) });
  const todas = [
    ...Object.keys(R.ATRIBUTOS),
    ...Object.keys(R.APRIMORAMENTOS),
    ...Object.keys(R.PERICIAS).filter((k) => R.nivel(f, k) > 0),
  ].map(linha);
  return todas.map((l) => ({ ...l, pode: e.pontos > 0 && l.nivel < l.teto }));
}

/** Compra um nível. Evoluir a base de Vida, Magia ou Sanidade recalcula o valor inicial. */
export function comprar(e, chave) {
  if (e.fase !== 'acampamento' || e.pontos <= 0) return e;
  const f = e.ficha;
  if (R.nivel(f, chave) >= R.teto(f, chave)) return e;
  const tipo = R.tipoDaChave(chave);
  const onde = tipo === 'atributo' ? f.atributos : tipo === 'aprimoramento' ? f.aprimoramentos : f.pericias;
  onde[chave] = (onde[chave] ?? 0) + 1;
  e.pontos -= 1;
  const v = R.valores(f);
  for (const k of ['vida', 'magia', 'sanidade']) {
    const delta = v[k] - e.max[k];
    e.max[k] = v[k];
    e[k] = Math.max(0, Math.min(e.max[k], e[k] + Math.max(0, delta)));
  }
  return e;
}

/** Um repouso por noite: tratar feridas, aquietar a cabeça ou velar a brasa. */
export function repousar(e, tipo) {
  if (e.fase !== 'acampamento' || e.acampamento.repousou) return e;
  let mudou = [];
  if (tipo === 'feridas') mudou = aplicar(e, { vida: rolarTexto(e, '1d6') + R.nivel(e.ficha, 'saude') });
  else if (tipo === 'cabeca') mudou = aplicar(e, { sanidade: rolarTexto(e, '1d6') });
  else if (tipo === 'brasa') mudou = aplicar(e, { brasa: MESA.repouso.brasa });
  else return e;
  e.acampamento.repousou = { tipo, mudou };
  return e;
}

function partir(e) {
  e.acampamento = null;
  e.ato += 1;
  e.cenaNoAto = 0;
  if (e.ato > MESA.atos) { entrarNaCena(e, e.aventura.desfecho[0]); return e; }
  return avancar(e);
}

/* ---------- Coisas de fazer a qualquer hora, fora de combate ---------- */

/** Usa um item de gastar (unguento, chá). */
export function usar(e, id) {
  if (!['cena', 'acampamento'].includes(e.fase)) return null;
  const i = e.itens.indexOf(id);
  const item = e.aventura.itens[id];
  if (i < 0 || item?.tipo !== 'consumivel') return null;
  e.itens.splice(i, 1);
  const ef = Object.fromEntries(Object.entries(item.cura).map(([k, v]) => [k, rolarTexto(e, v)]));
  return aplicar(e, ef);
}

/** Mágicas de Suporte: "role 1D6 e some aos PV do alvo", 1 PM por rolagem. */
export function curar(e) {
  if (!['cena', 'acampamento'].includes(e.fase)) return null;
  if (R.maximoDePM(e.ficha, 'magiaSuporte', e.magia) < 1 || e.vida >= e.max.vida) return null;
  e.magia -= 1;
  return [{ tipo: 'magia', valor: -1 }, ...aplicar(e, { vida: R.curaMagica(rng(e)) })];
}

/* ---------- Fim ---------- */

function finalDaSessao(e) {
  const s = { brasa: e.brasa, lacos: e.lacos, marcas: new Set(e.marcas), vida: e.vida, companheiros: e.companheiros };
  return e.aventura.finais.find((f) => f.quando(s));
}

function terminar(e, final) {
  e.fim = { id: final.id, titulo: final.titulo, texto: final.texto, estrelas: final.estrelas };
  e.fase = 'fim';
  return e;
}

/** Vida, Sanidade e brasa em palavras: o Mestre não narra em números. */
export function emPalavras(tipo, atual, max, aventura = null) {
  const f = max > 0 ? atual / max : 0;
  let escala = t(`escala.${tipo}`);
  if (tipo === 'brasa' && aventura?.relogio?.palavras) escala = aventura.relogio.palavras;
  if (atual <= 0) return escala[0];
  if (f >= 1) return escala[5];
  return escala[1 + Math.min(3, Math.floor(f * 4))];
}

/** A crônica da sessão, pronta para copiar. */
export function cronica(e) {
  const marcas = e.trilha.map((t) => (t.caminho === 'corpo' ? '🟥' : t.caminho === 'mente' ? '🟦' : t.caminho === 'espirito' ? '🟪' : '⬜') ).join('');
  // "Lia, a Ferreira": baixar o artigo do título é coisa do português.
  const titulo = idiomaAtual() === 'pt' ? e.tituloDoPassado.replace(/^(O|A) /, (m) => m.toLowerCase()) : e.tituloDoPassado;
  const linhas = [
    t('cronica.cabecalho', { aventura: e.aventura.nome }),
    t('cronica.personagem', { nome: e.nome, titulo }),
    '',
    ...e.cronica,
    '',
    e.fim ? `${'★'.repeat(e.fim.estrelas)}${'☆'.repeat(3 - e.fim.estrelas)} ${e.fim.titulo}` : '',
    marcas,
    t('cronica.semente', { semente: e.semente }),
  ];
  return linhas.join('\n');
}

/* ---------- O palpite do Mestre ---------- */

/** Chance de nD6 (ou 1D6−2, com 0 dados) alcançar a Dificuldade. */
export function chanceDeSucesso(dados, dificuldade) {
  if (dados <= 0) return Math.max(0, Math.min(6, 6 - (dificuldade + 2) + 1)) / 6;
  let dist = new Map([[0, 1]]);
  for (let i = 0; i < dados; i++) {
    const nova = new Map();
    for (const [s, p] of dist) for (let f = 1; f <= 6; f++) nova.set(s + f, (nova.get(s + f) ?? 0) + p / 6);
    dist = nova;
  }
  let ok = 0;
  for (const [s, p] of dist) if (s >= dificuldade) ok += p;
  return ok;
}

/** O Mestre não dá porcentagem: dá um aviso. */
export function palpite(dados, dificuldade) {
  const c = chanceDeSucesso(dados, dificuldade);
  if (c <= 0) return t('palpite.impossivel');
  if (c < 0.2) return t('palpite.muitaSorte');
  if (c < 0.45) return t('palpite.arriscado');
  if (c < 0.7) return t('palpite.qualquerLado');
  if (c < 0.93) return t('palpite.provavel');
  return t('palpite.quaseCerto');
}

/* ---------- Guardar e retomar ---------- */

/** O estado da sessão como dados simples, para guardar no aparelho. */
export function guardar(e) {
  const { aventura, cena, abordagem, ...resto } = e;
  return JSON.parse(JSON.stringify({ ...resto, aventura: aventura.id, cena: cena?.id ?? null, abordagem: abordagem?.id ?? null }));
}

/** Retoma uma sessão guardada. Devolve null se a aventura ou a cena não existem mais. */
export function retomar(dados, aventuras) {
  const aventura = aventuras.find((a) => a.id === dados?.aventura);
  if (!aventura) return null;
  const cena = [aventura.abertura, ...aventura.cenas, ...aventura.desfecho].find((c) => c.id === dados.cena);
  if (!cena) return null;
  const abordagem = cena.abordagens.find((a) => a.id === dados.abordagem) ?? null;
  return { ...JSON.parse(JSON.stringify(dados)), aventura, cena, abordagem };
}
