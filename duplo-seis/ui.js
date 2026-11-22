/** Duplo Seis: a mesa na tela. Lê o estado de jogo.js e desenha. */
import * as J from './jogo.js';
import * as R from './regras.js';
import { aventurasPara } from './aventuras/index.js';
import { IDIOMAS, idiomaAtual, definirIdioma, t, plural, nomeDaChave, nomeDoCaminho } from './idioma.js';
import { sementeNova } from './rng.js';
import { som, alternarSom, somLigado } from './som.js';
import { VERSAO } from './versao.js';
import { cenario } from './cenario.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const RAPIDO = params.has('rapido') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const espera = (ms) => new Promise((ok) => setTimeout(ok, RAPIDO ? 0 : ms));

/** As aventuras no idioma da mesa (as que ainda não têm tradução vêm em português). */
const AVENTURAS = aventurasPara(idiomaAtual());
/** Quem chegou com ?idioma= no endereço continua com ele nos endereços que a mesa monta. */
const COM_IDIOMA = params.has('idioma') ? `&idioma=${idiomaAtual()}` : '';

let AVENTURA = AVENTURAS.find((a) => a.id === params.get('aventura')) ?? AVENTURAS[0];
let e = null;
let escolhido = null;

/** Cria um elemento: h('p.classe', { atributo }, ...filhos). */
function h(seletor, attrs = {}, ...filhos) {
  const [tag, ...classes] = seletor.split('.');
  const el = document.createElement(tag || 'div');
  if (classes.length) el.className = classes.join(' ');
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null || v === false) continue;
    if (k === 'onclick') el.addEventListener('click', v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const f of filhos.flat(Infinity)) if (f != null && f !== false) el.append(f);
  return el;
}

const nomeDoAntecedente = (k) => t(`nomes.antecedentes.${k}`);
const nomeDaMedida = (tipo) => (tipo === 'brasa' ? AVENTURA.relogio.nome : t(`nomes.medidas.${tipo}`));
const bolinhas = (n, max = 5) => '●'.repeat(n) + '○'.repeat(Math.max(0, max - n));
const estrelas = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

/* ---------- Idioma ---------- */

/** Preenche o que o index.html traz escrito: data-t (texto), data-t-aria (aria-label), data-t-content (meta). */
function traduzirPagina() {
  document.documentElement.lang = idiomaAtual() === 'pt' ? 'pt-BR' : idiomaAtual();
  document.title = t('pagina.titulo');
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
  for (const el of document.querySelectorAll('[data-t-aria]')) el.setAttribute('aria-label', t(el.dataset.tAria));
  for (const el of document.querySelectorAll('[data-t-content]')) el.setAttribute('content', t(el.dataset.tContent));
}

/** A troca de idioma, só na tela de início: guarda a escolha e recarrega a página. */
function montarIdiomas() {
  $('#idiomas').replaceChildren(...IDIOMAS.map((i) => h('button', { type: 'button', lang: i.id, title: i.nome, 'aria-label': i.nome, 'aria-pressed': String(i.id === idiomaAtual()), onclick: () => {
    if (i.id === idiomaAtual()) return;
    definirIdioma(i.id);
    // O ?idioma= do endereço ganharia da escolha: sai antes de recarregar.
    const u = new URL(location.href);
    if (u.searchParams.has('idioma')) { u.searchParams.delete('idioma'); location.href = u.href; } else location.reload();
  } }, i.id.toUpperCase())));
}

/* ---------- Guardado no aparelho ---------- */

const CHAVE = 'duplo-seis';
function guardado() {
  try { return JSON.parse(localStorage.getItem(CHAVE)) ?? {}; } catch { return {}; }
}
function guardar(d) {
  try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch { /* sem armazenamento */ }
}

/* ---------- Início ---------- */

let modoDia = false;
let rascunho = null; // a ficha livre em edição

const hoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
/** dd/mm em português; "Nov 21" em inglês. */
const dataCurta = (iso) => {
  if (idiomaAtual() === 'pt') return iso.split('-').reverse().slice(0, 2).join('/');
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(idiomaAtual(), { month: 'short', day: 'numeric' }).format(new Date(ano, mes - 1, dia));
};
const aventuraDoDia = () => AVENTURAS[Math.floor(new Date(`${hoje()}T12:00:00`).getTime() / 86400000) % AVENTURAS.length];
const totalDeFinais = (av) => av.finais.length + Object.keys(av.quedas).length;

function montarInicio() {
  $('#versao').textContent = t('pagina.versao', { numero: VERSAO.numero });
  const g = guardado();

  // Sessão em andamento.
  const salva = g.sessao ? J.retomar(g.sessao, AVENTURAS) : null;
  $('#retomar').replaceChildren(...(salva ? [
    h('p.rotulo', {}, t('inicio.emAndamento')),
    h('p', {}, h('b', {}, salva.nome), t('inicio.emAventura', { aventura: salva.aventura.nome })),
    h('div.linha.dupla', {},
      h('button.principal', { type: 'button', onclick: () => { AVENTURA = salva.aventura; e = salva; abrirMesa(); } }, t('inicio.continuar')),
      h('button.secundario', { type: 'button', onclick: () => { const x = guardado(); delete x.sessao; guardar(x); montarInicio(); } }, t('inicio.abandonar')),
    ),
  ] : []));
  $('#retomar').hidden = !salva;

  // Aventura do dia: a mesma semente para todo mundo.
  const dia = hoje();
  const feito = g.dias?.[dia];
  const doDia = aventuraDoDia();
  $('#dia').replaceChildren(
    h('p.rotulo', {}, t('inicio.doDia', { data: dataCurta(dia) })),
    h('p', {}, h('b', {}, doDia.nome), t('inicio.doDiaExplica')),
    feito
      ? h('p.feito', {}, t('inicio.hoje', { estrelas: estrelas(feito.estrelas), titulo: feito.titulo }))
      : h('button.secundario', { type: 'button', 'aria-pressed': String(modoDia), onclick: () => { modoDia = !modoDia; if (modoDia) AVENTURA = doDia; som.toque(); montarInicio(); } }, modoDia ? t('inicio.vaiJogarHoje') : t('inicio.jogarHoje')),
  );

  // Aventuras.
  $('#aventuras').replaceChildren(...AVENTURAS.map((av) => h('button.aventura', { type: 'button', role: 'radio', 'aria-checked': String(av === AVENTURA), disabled: modoDia && av !== AVENTURA, onclick: () => { AVENTURA = av; som.toque(); montarInicio(); } },
    h('small', {}, av.genero),
    h('strong', {}, av.nome),
    h('span', {}, av.resumo),
    h('em', {}, t('inicio.finaisDescobertos', { vistos: (g.vistos?.[av.id] ?? []).length, total: totalDeFinais(av) })),
  )));

  // Passados da aventura, mais a ficha livre.
  $('#passados').replaceChildren(
    ...AVENTURA.passados.map((p) => {
      const melhor = g.finais?.[`${AVENTURA.id}:${p.id}`];
      return h('button.passado', { type: 'button', role: 'radio', 'aria-checked': 'false', 'data-id': p.id, 'data-caminho': p.caminho, onclick: () => escolherPassado(p.id) },
        h('strong', {}, p.titulo),
        h('small', {}, nomeDoCaminho(p.caminho)),
        melhor != null ? h('span.estrelas', { title: t('inicio.melhorFinal') }, estrelas(melhor)) : null,
      );
    }),
    h('button.passado.livre', { type: 'button', role: 'radio', 'aria-checked': 'false', 'data-id': 'livre', 'data-caminho': 'livre', onclick: () => escolherPassado('livre') },
      h('strong', {}, t('inicio.fichaLivre')),
      h('small', {}, t('inicio.seuPassado')),
    ),
  );
  const pedido = params.get('passado') ?? g.ultimo?.[AVENTURA.id];
  escolherPassado(pedido === 'livre' || AVENTURA.passados.some((p) => p.id === pedido) ? pedido : AVENTURA.passados[0].id, false);
}

function escolherPassado(id, rolar = true) {
  som.toque();
  for (const b of document.querySelectorAll('.passado')) b.setAttribute('aria-checked', String(b.dataset.id === id));
  const caixa = $('#escolhido');
  caixa.hidden = false;
  if (id === 'livre') { montarFichaLivre(caixa); }
  else {
    const p = AVENTURA.passados.find((x) => x.id === id);
    escolhido = p;
    const ficha = R.novaFicha(p);
    const v = R.valores(ficha);
    caixa.dataset.caminho = p.caminho;
    caixa.replaceChildren(
      h('p.quem', {}, p.quem),
      h('p.motivo', {}, p.motivo),
      resumoDaFicha(ficha),
      h('p.numeros', {}, t('inicio.numeros', { vida: v.vida, magia: v.magia, sanidade: v.sanidade })),
      h('p.leva', {}, t('inicio.leva'), p.itens.map((i) => nomeDoItem(i)).join(', '), Object.keys(p.antecedentes).length ? t('inicio.antecedentes', { lista: Object.keys(p.antecedentes).map(nomeDoAntecedente).join(', ') }) : ''),
      h('label.campo', {}, t('inicio.nome'), h('input', { id: 'nome', type: 'text', maxlength: '18', value: p.nome, autocomplete: 'off' })),
      camposDaSemente(),
      h('button.principal', { type: 'button', onclick: comecar }, t('inicio.sentar')),
    );
  }
  if (rolar) caixa.scrollIntoView({ behavior: RAPIDO ? 'auto' : 'smooth', block: 'nearest' });
}

function camposDaSemente() {
  if (modoDia) return h('p.nota.escura', {}, t('inicio.sementeDoDia', { semente: `dia-${hoje()}` }));
  return h('details.semente', {}, h('summary', {}, t('inicio.sementeDaSessao')),
    h('label.campo', {}, t('inicio.sementeExplica'), h('input', { id: 'semente', type: 'text', maxlength: '24', value: params.get('semente') ?? '', placeholder: t('inicio.sementeEmBranco') })));
}

function nomeDoItem(id) {
  const i = AVENTURA.itens[id];
  return i.mod ? `${i.nome} ${i.mod}` : i.nome;
}

/** A ficha em bolinhas, como no papel. */
function resumoDaFicha(ficha, { completa = false } = {}) {
  const colunas = Object.entries(R.CAMINHOS).map(([c, def]) => h('div.coluna', { 'data-caminho': c },
    h('h4', {}, nomeDoCaminho(c)),
    def.atributos.map((a) => {
      const n = ficha.atributos[a];
      const aprs = Object.entries(R.APRIMORAMENTOS).filter(([k, d]) => d.pai === a && (ficha.aprimoramentos[k] ?? 0) > 0);
      if (!completa && n === 0) return h('p.atributo.vazio', {}, h('span', {}, nomeDaChave(a)), h('span.b', {}, bolinhas(0)));
      return [
        h('p.atributo', {}, h('span', {}, nomeDaChave(a)), h('span.b', {}, bolinhas(n))),
        aprs.map(([k]) => h('p.aprimoramento', {}, h('span', {}, nomeDaChave(k)), h('span.b', {}, bolinhas(ficha.aprimoramentos[k], n)))),
      ];
    }),
  ));
  const pericias = Object.entries(ficha.pericias).filter(([, n]) => n > 0);
  return h('div.resumo-ficha', {},
    h('div.colunas', {}, colunas),
    pericias.length ? h('p.pericias', {}, t('inicio.pericias'), pericias.map(([k, n]) => `${nomeDaChave(k)} ${n}`).join(', ')) : null,
  );
}

/* ---------- Ficha livre: o jogador distribui os pontos ---------- */

const PONTOS_LIVRES = 12;
const ITENS_LIVRES = 3;

function montarFichaLivre(caixa) {
  const g = guardado();
  rascunho ??= g.livre?.[AVENTURA.id] ?? { id: 'livre', titulo: '', nome: '', quem: '', motivo: '', atributos: {}, aprimoramentos: {}, pericias: {}, antecedentes: {}, itens: [] };
  rascunho.itens = rascunho.itens.filter((i) => AVENTURA.itens[i]);
  const p = rascunho;
  caixa.dataset.caminho = 'livre';

  /** Depois de baixar um Atributo, nada pode ficar acima do teto. */
  const aparar = () => {
    const f = R.novaFicha(p);
    for (const k of Object.keys(p.aprimoramentos)) p.aprimoramentos[k] = Math.min(p.aprimoramentos[k], R.teto(f, k));
    const f2 = R.novaFicha(p);
    for (const k of Object.keys(p.pericias)) p.pericias[k] = Math.min(p.pericias[k], R.teto(f2, k));
    for (const o of [p.atributos, p.aprimoramentos, p.pericias]) for (const k of Object.keys(o)) if (!o[k]) delete o[k];
  };
  const mexer = (onde, chave, delta) => {
    const f = R.novaFicha(p);
    const atual = onde[chave] ?? 0;
    const novo = atual + delta;
    if (novo < 0 || novo > R.teto(f, chave)) return;
    if (delta > 0 && R.pontosGastos(f) >= PONTOS_LIVRES) return;
    onde[chave] = novo;
    aparar();
    som.toque();
    desenharLivre();
  };

  const desenharLivre = () => {
    const ficha = R.novaFicha(p);
    const v = R.valores(ficha);
    const gastos = R.pontosGastos(ficha);
    const livres = PONTOS_LIVRES - gastos;
    const linha = (onde, chave, tipo) => {
      const n = onde[chave] ?? 0;
      const teto = R.teto(ficha, chave);
      return h(`p.ajuste.${tipo}`, {},
        h('span.nome-ajuste', {}, nomeDaChave(chave)),
        h('button.mais', { type: 'button', disabled: n <= 0, 'aria-label': t('livre.baixar', { nome: nomeDaChave(chave) }), onclick: () => mexer(onde, chave, -1) }, '−'),
        h('span.b', {}, bolinhas(n, tipo === 'atributo' ? 5 : Math.max(teto, 1))),
        h('button.mais', { type: 'button', disabled: n >= teto || livres <= 0, 'aria-label': t('livre.subir', { nome: nomeDaChave(chave) }), onclick: () => mexer(onde, chave, 1) }, '+'),
      );
    };
    const colunas = Object.entries(R.CAMINHOS).map(([c, def]) => h('div.bloco', { 'data-caminho': c },
      h('h4', {}, nomeDoCaminho(c)),
      def.atributos.map((a) => [
        linha(p.atributos, a, 'atributo'),
        (p.atributos[a] ?? 0) > 0 ? Object.entries(R.APRIMORAMENTOS).filter(([, d]) => d.pai === a).map(([k]) => linha(p.aprimoramentos, k, 'aprimoramento')) : null,
      ]),
    ));
    const pericias = Object.keys(R.PERICIAS).filter((k) => R.teto(ficha, k) > 0);
    const jaVem = [AVENTURA.abertura.efeitosAoEntrar?.item].flat();
    const kit = Object.entries(AVENTURA.itens).filter(([id, i]) => (i.mod ?? 0) <= 1 && !jaVem.includes(id));
    const pronto = p.quem.trim().length >= 20 && livres === 0;
    const oQueFalta = () => (p.quem.trim().length < 20 ? t('livre.conteudoRei') : livres > 0 ? t('livre.faltam', { pontos: plural(livres, 'ponto') }) : '');

    const quem = h('textarea', { id: 'livre-quem', rows: '3', maxlength: '280', placeholder: t('livre.exemploQuem') });
    quem.value = p.quem;
    quem.addEventListener('input', () => { p.quem = quem.value; atualizarBotao(); });
    const titulo = h('input', { type: 'text', maxlength: '24', value: p.titulo, placeholder: t('livre.exemploTitulo'), autocomplete: 'off' });
    titulo.addEventListener('input', () => { p.titulo = titulo.value; });
    const nome = h('input', { id: 'nome', type: 'text', maxlength: '18', value: p.nome, placeholder: t('livre.exemploNome'), autocomplete: 'off' });
    nome.addEventListener('input', () => { p.nome = nome.value; });
    const botao = h('button.principal', { type: 'button', disabled: !pronto, onclick: () => { escolhido = fecharRascunho(); comecar(); } }, t('inicio.sentar'));
    const aviso = h('p.nota.escura', {}, oQueFalta());
    const atualizarBotao = () => {
      const ok = p.quem.trim().length >= 20 && livres === 0;
      botao.disabled = !ok;
      aviso.textContent = oQueFalta();
    };

    caixa.replaceChildren(
      h('p.quem', {}, t('livre.manual')),
      h('label.campo', {}, t('livre.quemEVoce'), quem),
      h('div.linha.dupla', {}, h('label.campo', {}, t('livre.comoChamam'), titulo), h('label.campo', {}, t('inicio.nome'), nome)),
      h('p.pontos-livres', {}, t('livre.pontos', { gastos, total: PONTOS_LIVRES }), h('small', {}, t('livre.nivelInicial'))),
      h('div.blocos', {}, colunas),
      pericias.length ? h('div.bloco', { 'data-caminho': 'livre' }, h('h4', {}, t('livre.pericias')), pericias.map((k) => linha(p.pericias, k, 'pericia'))) : h('p.nota.escura', {}, t('livre.periciasAparecem')),
      h('p.numeros', {}, t('livre.numeros', { vida: v.vida, magia: v.magia, sanidade: v.sanidade, ataque: v.ataqueCurta, defesa: v.defesa, caminho: nomeDoCaminho(v.dominante) })),
      blocoDeAntecedentes(p, ficha, desenharLivre),
      h('div.bloco', { 'data-caminho': 'livre' },
        h('h4', {}, t('livre.sacola', { n: p.itens.length, total: ITENS_LIVRES })),
        h('div.kit', {}, kit.map(([id]) => h('button.alavanca.clara', { type: 'button', 'aria-pressed': String(p.itens.includes(id)), disabled: !p.itens.includes(id) && p.itens.length >= ITENS_LIVRES, onclick: () => {
          const i = p.itens.indexOf(id);
          if (i >= 0) p.itens.splice(i, 1); else p.itens.push(id);
          som.toque(); desenharLivre();
        } }, nomeDoItem(id)))),
      ),
      camposDaSemente(),
      aviso,
      botao,
    );
  };
  desenharLivre();
}

/**
 * Antecedentes do manual: os pontos são o menor Caminho; cada Bom custa 1,
 * cada Mau devolve 1 (até o dobro), e antagônicos não andam juntos.
 */
const ANTAGONICOS = { boaFama: 'maFama', maFama: 'boaFama', recursos: 'semRecursos', semRecursos: 'recursos', aliado: null, inimigo: null };
const MAUS = new Set(['inimigo', 'maFama', 'semRecursos']);

function blocoDeAntecedentes(p, ficha, redesenhar) {
  // O que não cabe mais (o menor Caminho caiu) sai, começando pelos Bons.
  for (;;) {
    const sobra = R.pontosDeAntecedentes(R.novaFicha(p)).livres;
    const bom = Object.keys(p.antecedentes).find((k) => !p.antecedentes[k].mau);
    if (sobra >= 0 || !bom) break;
    delete p.antecedentes[bom];
  }
  const conta = R.pontosDeAntecedentes(R.novaFicha(p));
  const botoes = Object.keys(ANTAGONICOS).map((k) => {
    const tem = !!p.antecedentes[k];
    const mau = MAUS.has(k);
    const travado = !tem && (!!p.antecedentes[ANTAGONICOS[k]] || (!mau && conta.livres <= 0) || (mau && conta.base === 0));
    return h('button.alavanca.clara', { type: 'button', 'aria-pressed': String(tem), disabled: travado, onclick: () => {
      if (tem) delete p.antecedentes[k]; else p.antecedentes[k] = mau ? { nivel: 1, mau: true } : { nivel: 1 };
      som.toque(); redesenhar();
    } }, nomeDoAntecedente(k), h('b', {}, mau ? '+1' : '−1'));
  });
  return h('div.bloco', { 'data-caminho': 'livre' },
    h('h4', {}, t('livre.antecedentes', { livres: conta.livres, total: conta.total })),
    h('p.nota.escura', {}, conta.base === 0 ? t('livre.antecedentesZero') : t('livre.antecedentesNota')),
    h('div.kit', {}, botoes),
  );
}

function fecharRascunho() {
  const p = rascunho;
  const ficha = R.novaFicha(p);
  const pronto = { ...p, id: 'livre', titulo: p.titulo.trim() || t('livre.semTitulo'), nome: p.nome.trim() || t('livre.semNome'), caminho: R.caminhoDominante(ficha) };
  const g = guardado();
  g.livre ??= {};
  g.livre[AVENTURA.id] = pronto;
  guardar(g);
  return pronto;
}

function comecar() {
  const nome = $('#nome')?.value.trim() || escolhido.nome;
  const semente = modoDia ? `dia-${hoje()}` : $('#semente')?.value.trim() || sementeNova(Date.now());
  e = J.nova({ semente, passado: escolhido.id === 'livre' ? escolhido : escolhido.id, nome, aventura: AVENTURA });
  e.dia = modoDia ? hoje() : null;
  const g = guardado();
  g.ultimo ??= {};
  if (typeof g.ultimo !== 'object') g.ultimo = {};
  g.ultimo[AVENTURA.id] = escolhido.id;
  guardar(g);
  abrirMesa();
  som.brasa();
}

function abrirMesa() {
  history.replaceState(null, '', `?aventura=${AVENTURA.id}&semente=${encodeURIComponent(e.semente)}&passado=${e.passado}${COM_IDIOMA}`);
  $('#inicio').hidden = true;
  $('#mesa').hidden = false;
  window.scrollTo(0, 0);
  desenhar();
}

/* ---------- Cabeçalho da mesa ---------- */

function desenharTopo() {
  $('#topo-nome').textContent = e.nome;
  const ato = e.cena?.ato ?? e.ato;
  $('#topo-ato').textContent = e.fase === 'acampamento' ? (AVENTURA.textos.pausa ?? t('mesa.acampamento')) : ato === 0 ? AVENTURA.inicio : t('mesa.ato', { n: Math.min(ato, 4), nome: AVENTURA.atos[Math.min(ato, 4)] });
  document.documentElement.style.setProperty('--brasa', String(e.brasa / J.MESA.brasa));
  const barra = (tipo, atual, max) => h(`div.medida.${tipo}`, { title: t('mesa.medida', { nome: t(`nomes.medidas.${tipo}`), atual, max }) },
    h('span.nome', {}, nomeDaMedida(tipo)),
    h('span.trilho', {}, h('span.cheio', { style: `width:${max ? Math.round((atual / max) * 100) : 0}%` })),
    h('span.palavra', {}, J.emPalavras(tipo, atual, max, AVENTURA)),
  );
  $('#medidas').replaceChildren(
    barra('brasa', e.brasa, J.MESA.brasa),
    barra('vida', e.vida, e.max.vida),
    barra('sanidade', e.sanidade, e.max.sanidade),
    barra('magia', e.magia, e.max.magia),
  );
}

/* ---------- Dados ---------- */

const PONTOS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function face(el, v) {
  el.dataset.v = v;
  el.replaceChildren(...Array.from({ length: 9 }, (_, i) => h(PONTOS[v].includes(i) ? 'i.p' : 'i')));
}
function novoDado(classe = '') {
  const d = h(`span.dado${classe ? '.' + classe : ''}`);
  face(d, 1 + Math.floor(Math.random() * 6));
  return d;
}

/** Rola dados na bandeja até pousarem nos valores dados. */
async function rolarDados(bandeja, valoresFinais, { classe = () => '' } = {}) {
  const dados = valoresFinais.map((_, i) => novoDado(classe(i)));
  bandeja.append(...dados);
  if (RAPIDO) { dados.forEach((d, i) => face(d, valoresFinais[i])); return dados; }
  som.dados(dados.length);
  dados.forEach((d) => d.classList.add('rolando'));
  const gira = setInterval(() => dados.forEach((d) => d.classList.contains('rolando') && face(d, 1 + Math.floor(Math.random() * 6))), 70);
  for (let i = 0; i < dados.length; i++) {
    await espera(i === 0 ? 620 : 170);
    dados[i].classList.remove('rolando');
    dados[i].classList.add('pousou');
    face(dados[i], valoresFinais[i]);
    som.pouso();
  }
  clearInterval(gira);
  await espera(220);
  return dados;
}

/* ---------- Palco ---------- */

function salvarSessao() {
  const g = guardado();
  if (e.fase === 'fim') delete g.sessao; else g.sessao = J.guardar(e);
  guardar(g);
}

function desenhar() {
  desenharTopo();
  salvarSessao();
  const palco = $('#palco');
  palco.dataset.fase = e.fase;
  if (e.fase === 'cena') desenharCena(palco);
  else if (e.fase === 'combate') desenharCombate(palco);
  else if (e.fase === 'desfecho') desenharDesfecho(palco);
  else if (e.fase === 'surto') desenharSurto(palco);
  else if (e.fase === 'acampamento') desenharAcampamento(palco);
  else if (e.fase === 'fim') desenharFim(palco);
  window.scrollTo({ top: 0, behavior: RAPIDO ? 'auto' : 'smooth' });
}

function cartaDoMestre(cena) {
  const tipo = AVENTURA.cenarios?.[Math.min(cena.ato, 4)] ?? 'vale';
  return h('article.carta.mestre.com-cenario', {},
    h('div.cenario', { html: cenario(tipo, cena.id, e.brasa / J.MESA.brasa) }),
    h('p.sobre', {}, cena.titulo),
    h('p.narra', {}, cena.texto.replaceAll('{nome}', e.nome)),
    e.entrada?.length ? fichas(e.entrada) : null,
  );
}

function descreverOpcao(o) {
  if (o.tipo === 'teste') {
    if (o.magica) return o.disponivel ? t('cena.magica', { chave: o.nomeChave, dificuldade: o.nomeDificuldade, valor: o.dificuldade }) : t('cena.semPM', { chave: o.nomeChave });
    const dados = o.nivel > 0 ? plural(o.nivel, 'dado') : t('cena.umDadoMenos2');
    return t('cena.teste', { chave: o.nomeChave, dados, dificuldade: o.nomeDificuldade, valor: o.dificuldade });
  }
  if (o.tipo === 'combate') return t('cena.combate', { inimigo: o.inimigo });
  return o.custo ? t('cena.semDadosCusta', { custo: Object.entries(o.custo).map(([k, v]) => t('cena.custo', { valor: -v, medida: nomeDaMedida(k) })).join(', ') }) : t('cena.semDados');
}

function desenharCena(palco) {
  const ops = J.opcoes(e);
  const lista = h('div.escolhas');
  for (const o of ops) {
    const botao = h('button.escolha', { type: 'button', 'data-caminho': o.caminho ?? 'livre', disabled: !o.disponivel, 'aria-expanded': 'false', onclick: () => abrirPreparo(o, botao, lista) },
      h('span.rot', {}, o.rotulo, o.especial ? h('span.especial', { title: t('cena.especial') }, '★') : null),
      h('span.det', {}, descreverOpcao(o)),
    );
    lista.append(h('div.opcao', {}, botao));
  }
  palco.replaceChildren(cartaDoMestre(e.cena), h('p.pergunta', {}, t('cena.pergunta')), lista);
}

function abrirPreparo(o, botao, lista) {
  som.toque();
  for (const p of lista.querySelectorAll('.preparo')) p.remove();
  for (const b of lista.querySelectorAll('.escolha')) b.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-expanded', 'true');
  const extras = { objeto: null, unir: [], pm: o.maxPM ?? 0 };
  const caixa = h('div.preparo', { 'data-caminho': o.caminho ?? 'livre' });
  const principal = h('button.principal', { type: 'button' });
  const aviso = h('p.palpite');

  const atualizar = () => {
    if (o.tipo === 'combate') { principal.textContent = t('cena.lutar'); return; }
    if (o.tipo === 'livre') { principal.textContent = t('cena.fazer'); return; }
    let n;
    if (o.magica) n = extras.pm;
    else n = o.nivel + (o.objetos.find((x) => x.id === extras.objeto)?.mod ?? 0) + o.aliados.filter((x) => extras.unir.includes(x.id)).reduce((s, x) => s + x.nivel, 0);
    principal.textContent = n > 0 ? t('cena.rolar', { dados: plural(n, 'dado'), dificuldade: o.dificuldade }) : t('cena.rolarIncapaz', { dificuldade: o.dificuldade });
    aviso.textContent = t('cena.mestreAvisa', { palpite: J.palpite(n, o.dificuldade) });
  };

  if (o.tipo === 'teste' && !o.magica) {
    if (o.nivel === 0) caixa.append(h('p.nota', {}, t('cena.semNivel', { chave: o.nomeChave })));
    else if (o.caminho === 'corpo') caixa.append(h('p.nota', {}, t('cena.notaCorpo')));
    for (const obj of o.objetos) {
      const alavanca = h('button.alavanca', { type: 'button', 'aria-pressed': 'false', onclick: () => {
        extras.objeto = extras.objeto === obj.id ? null : obj.id;
        for (const b of caixa.querySelectorAll('.alavanca.objeto')) b.setAttribute('aria-pressed', String(b === alavanca && extras.objeto === obj.id));
        som.toque(); atualizar();
      } }, t('cena.usar', { nome: obj.nome }), h('b', {}, t('cena.maisDados', { dados: plural(obj.mod, 'dado') })));
      alavanca.classList.add('objeto');
      caixa.append(alavanca);
    }
    for (const al of o.aliados) {
      const alavanca = h('button.alavanca', { type: 'button', 'aria-pressed': 'false', onclick: () => {
        const i = extras.unir.indexOf(al.id);
        if (i >= 0) extras.unir.splice(i, 1); else extras.unir.push(al.id);
        alavanca.setAttribute('aria-pressed', String(i < 0));
        som.toque(); atualizar();
      } }, t('cena.unir', { nome: al.nome }), h('b', {}, t('cena.maisDados', { dados: plural(al.nivel, 'dado') })));
      caixa.append(alavanca);
    }
  }
  if (o.magica) {
    caixa.append(h('p.nota', {}, t('cena.notaMagia', { max: o.maxPM })));
    const linha = h('div.pm');
    for (let n = 1; n <= o.maxPM; n++) {
      const b = h('button.alavanca', { type: 'button', 'aria-pressed': String(n === extras.pm), onclick: () => {
        extras.pm = n;
        for (const x of linha.children) x.setAttribute('aria-pressed', String(x === b));
        som.toque(); atualizar();
      } }, t('cena.pm', { n }));
      linha.append(b);
    }
    caixa.append(linha);
  }
  if (o.tipo === 'combate') caixa.append(h('p.nota', {}, t('cena.notaCombate')));
  principal.addEventListener('click', () => confirmar(o, extras));
  atualizar();
  caixa.append(aviso, principal);
  botao.parentElement.append(caixa);
  caixa.scrollIntoView({ behavior: RAPIDO ? 'auto' : 'smooth', block: 'nearest' });
}

async function confirmar(o, extras) {
  J.escolher(e, o.id, extras);
  if (o.tipo === 'teste') { await mostrarRolagem(o); return; }
  desenhar();
}

/** A rolagem na mesa: dados, soma, a sorte, e a chance de insistir. */
async function mostrarRolagem(o) {
  const r = e.rolagem;
  const palco = $('#palco');
  desenharTopo();
  const bandeja = h('div.bandeja');
  const conta = h('p.conta');
  const selo = h('p.selo-resultado');
  const mesa = h('section.rolagem', { 'data-caminho': o.caminho },
    h('p.sobre', {}, t('rolagem.sobre', { rotulo: o.rotulo, chave: r.nomeChave, dificuldade: r.dificuldade })),
    bandeja, conta, selo);
  palco.replaceChildren(h('article.carta.mestre.curta', {}, h('p.sobre', {}, e.cena.titulo)), mesa);
  mesa.scrollIntoView({ block: 'center' });

  await rolarDados(bandeja, r.dados, { classe: (i) => (i === 0 ? 'sorte' : '') });
  const soma = r.dados.join(' + ') + (r.incapaz ? ' − 2' : '');
  conta.textContent = r.dados.length > 1 || r.incapaz ? `${soma} = ${r.total}` : `${r.total}`;
  await espera(350);

  if (r.sorte.confirma != null) {
    const linha = h('div.confirma', {}, h('p', {}, t('rolagem.sorteCaiu', { valor: r.dados[0] })));
    const b2 = h('div.bandeja.pequena');
    linha.append(b2);
    mesa.append(linha);
    await espera(500);
    await rolarDados(b2, [r.sorte.confirma], { classe: () => 'sorte' });
    if (r.sorte.tipo === 'sucesso') { linha.append(h('p.duplo.bom', {}, t('rolagem.duploSeis'))); som.critico(); }
    else if (r.sorte.tipo === 'falha') { linha.append(h('p.duplo.mau', {}, t('rolagem.duploUm'))); som.desastre(); }
    else linha.append(h('p.nada', {}, t('rolagem.naoRepetiu')));
    await espera(r.sorte.tipo ? 900 : 450);
  }

  if (e.fase === 'insistir') {
    selo.textContent = t('rolagem.faltou', { falta: r.falta });
    selo.className = 'selo-resultado falha';
    som.falha();
    mesa.append(h('div.insistir', {},
      h('p', {}, t('rolagem.daParaInsistir', { custo: r.custoInsistir, vida: e.vida })),
      h('button.principal.corpo', { type: 'button', onclick: () => { J.insistir(e, true); som.golpe(); desenhar(); } }, t('rolagem.insistir', { custo: r.custoInsistir })),
      h('button.secundario', { type: 'button', onclick: () => { J.insistir(e, false); desenhar(); } }, t('rolagem.aceitar')),
    ));
    return;
  }
  const ok = e.desfecho.ok;
  selo.textContent = r.viradaDaSorte ? t('rolagem.sorteVirou') : ok ? t('rolagem.sucesso') : t('rolagem.falhaFaltou', { falta: r.falta });
  selo.className = `selo-resultado ${ok ? 'sucesso' : 'falha'}`;
  if (!r.sorte.tipo) (ok ? som.sucesso : som.falha)();
  await espera(700);
  desenhar();
}

const SINAL = (v) => (v > 0 ? `+${v}` : `−${Math.abs(v)}`);
function fichas(mudou) {
  if (!mudou?.length) return null;
  return h('p.fichas', {}, mudou.map((m) => {
    if (m.tipo === 'item') return h('span.ficha-m.ganho', {}, t('mudou.ganhou', { nome: m.nome }));
    if (m.tipo === 'semItem') return h('span.ficha-m.perda', {}, t('mudou.perdeu', { nome: m.nome }));
    if (m.tipo === 'companheiro') return h('span.ficha-m.ganho', {}, t('mudou.segue', { nome: m.nome }));
    if (m.tipo === 'semCompanheiro') return h('span.ficha-m.perda', {}, t('mudou.foiEmbora', { nome: m.nome }));
    if (m.tipo === 'cansado') return h('span.ficha-m.perda', {}, t('mudou.cansado', { nome: m.nome }));
    if (m.tipo === 'marco') return h('span.ficha-m.marco', {}, t('mudou.marco'));
    return h(`span.ficha-m.${m.valor > 0 ? 'ganho' : 'perda'}.${m.tipo}`, {}, `${nomeDaMedida(m.tipo)} ${SINAL(m.valor)}`);
  }));
}

function linhaDeGolpe(g) {
  const eu = g.quem === 'voce';
  let texto;
  if (g.critico === 'ataque-falha') texto = eu ? t('combate.duploUmMeu') : t('combate.duploUmDele');
  else if (g.critico === 'defesa-sucesso') texto = eu ? t('combate.defesaSeisDele') : t('combate.defesaSeisMinha');
  else if (!g.acertou) texto = eu ? t('combate.defendido') : t('combate.voceDefende');
  else {
    const alvo = t(`nomes.medidas.${g.alvo === 'sanidade' ? 'sanidade' : 'vida'}`);
    texto = eu ? t('combate.acertou', { dano: g.dano }) : t('combate.acertouVoce', { dano: g.dano, alvo });
    if (g.critico === 'ataque-sucesso') texto = t('combate.comDuploSeis', { texto });
    if (g.critico === 'defesa-falha') texto = t('combate.guardaAbriu', { texto });
  }
  const d1 = novoDado(); face(d1, g.dadoAtaque);
  const d2 = novoDado(); face(d2, g.dadoDefesa);
  return h(`div.golpe.${eu ? 'meu' : 'dele'}`, {},
    h('p.quem', {}, eu ? g.rotulo : t('combate.ataca', { nome: g.rotulo })),
    h('p.conta-golpe', {}, d1, h('span', {}, `${g.valorAtaque}`), h('em', {}, t('combate.contra')), d2, h('span', {}, `${g.valorDefesa}`)),
    h('p.efeito', {}, texto),
  );
}

function desenharCombate(palco) {
  const c = e.combate;
  const acoes = J.acoesDeCombate(e);
  const botoes = h('div.acoes');
  for (const a of acoes) {
    if (a.maxPM) {
      for (let n = 1; n <= a.maxPM; n++) botoes.append(h('button.escolha', { type: 'button', 'data-caminho': 'mente', onclick: () => rodada(a.id, n) }, h('span.rot', {}, t('combate.comPM', { rotulo: a.rotulo, n })), h('span.det', {}, t('combate.dadoMais', { n }))));
    } else if (a.id === 'recuar') {
      botoes.append(h('button.escolha', { type: 'button', 'data-caminho': 'livre', onclick: () => rodada('recuar') }, h('span.rot', {}, a.rotulo), h('span.det', {}, t('combate.recuarDetalhe'))));
    } else {
      botoes.append(h('button.escolha', { type: 'button', 'data-caminho': 'corpo', onclick: () => rodada(a.id) }, h('span.rot', {}, a.rotulo), h('span.det', {}, t('combate.dadoMais', { n: a.ataque }) + (a.arma ? t('combate.armaNoDano', { n: a.arma }) : ''))));
    }
  }
  palco.replaceChildren(
    h('article.carta.mestre.curta', {}, h('p.sobre', {}, e.cena.titulo)),
    h('section.combate', {},
      h('h3', {}, c.inimigo.nome),
      h('p.estado', {}, t('combate.estado', { estado: J.estadoDoInimigo(e), resto: c.rodada === 0 ? (c.primeiro === 'voce' ? t('combate.voceMaisRapido') : t('combate.eleMaisRapido')) : t('combate.rodada', { n: c.rodada + 1 }) })),
      h('div.log', {}, c.log.map(linhaDeGolpe)),
      botoes,
    ),
  );
}

async function rodada(acao, pm) {
  som.golpe();
  J.lutar(e, acao, { pm });
  desenhar();
}

function desenharDesfecho(palco) {
  const d = e.desfecho;
  // A mesa sente o resultado: treme na falha, clareia no duplo seis.
  if (!RAPIDO && d.tipo !== 'livre') {
    const classe = d.critico === 'sucesso' ? 'clareia' : d.ok ? '' : 'treme';
    if (classe) { palco.classList.remove('treme', 'clareia'); void palco.offsetWidth; palco.classList.add(classe); }
  }
  const filhos = [h('article.carta.mestre.curta', {}, h('p.sobre', {}, e.cena.titulo))];
  if (d.combate) filhos.push(h('section.combate', {}, h('div.log', {}, d.combate.log.map(linhaDeGolpe))));
  if (e.rolagem && d.tipo === 'teste') {
    const r = e.rolagem;
    const bandeja = h('div.bandeja.pequena', {}, r.dados.map((v, i) => { const x = novoDado(i === 0 ? 'sorte' : ''); face(x, v); x.classList.add('pousou'); return x; }));
    filhos.push(h('section.rolagem.resumo', { 'data-caminho': r.caminho }, bandeja,
      h('p.conta', {}, t('desfecho.resumo', { chave: r.nomeChave, total: r.total, dificuldade: r.dificuldade }) + (r.insistiu ? t('desfecho.insistiu') : ''))));
  }
  const carimbo = d.tipo === 'livre' ? null : h(`p.selo-resultado.${d.ok ? 'sucesso' : 'falha'}`, {},
    d.critico === 'sucesso' ? t('desfecho.sucessoCritico') : d.critico === 'falha' ? (d.ok ? t('desfecho.sucessoMas') : t('desfecho.falhaCritica')) : d.tipo === 'combate' ? t(`desfecho.${d.combate.fim}`) : d.ok ? t('desfecho.sucesso') : t('desfecho.falha'));
  filhos.push(h('article.carta.desfecho', { 'data-ok': String(d.ok) }, carimbo, h('p.narra', {}, d.texto), fichas(d.mudou)));
  for (const a of d.avisos) filhos.push(h('article.carta.aviso', {}, h('p.narra', {}, a.texto), fichas(a.mudou)));
  if (d.fatal) filhos.push(h('article.carta.aviso', {}, h('p.narra', {}, d.fatal === 'morte' ? t('desfecho.morte') : t('desfecho.perdido'))));
  filhos.push(h('button.principal', { type: 'button', onclick: () => { som.toque(); J.continuar(e); desenhar(); } }, d.fatal ? t('desfecho.verFim') : t('desfecho.continuar')));
  palco.replaceChildren(...filhos);
  if (d.mudou.some((m) => m.tipo === 'brasa')) som.brasa();
}

function desenharSurto(palco) {
  const s = e.surto;
  som.desastre();
  palco.replaceChildren(
    h('article.carta.aviso.surto', {},
      h('p.sobre', {}, t('surto.titulo')),
      h('p.narra', {}, s.texto),
      fichas(s.mudou),
      h('p.nota', {}, s.restam === 1 ? t('surto.ultimaVez') : t('surto.volta')),
    ),
    h('button.principal', { type: 'button', onclick: () => { J.continuar(e); desenhar(); } }, t('surto.levantar')),
  );
}

function desenharAcampamento(palco) {
  const a = e.acampamento;
  const lojas = J.compras(e);
  const grupos = Object.keys(R.CAMINHOS).map((c) => h('div.coluna', { 'data-caminho': c },
    h('h4', {}, nomeDoCaminho(c)),
    lojas.filter((l) => l.caminho === c && (l.tipo === 'atributo' || l.teto > 0)).map((l) => h(`p.compra.${l.tipo}`, {},
      h('span', {}, l.nome),
      h('span.b', {}, bolinhas(l.nivel, l.tipo === 'atributo' ? 5 : Math.max(l.teto, l.nivel))),
      h('button.mais', { type: 'button', disabled: !l.pode, 'aria-label': t('livre.subir', { nome: l.nome }), onclick: () => { J.comprar(e, l.chave); som.sucesso(); desenhar(); } }, '+'),
    )),
  ));
  const rep = a.repousou;
  const repouso = rep
    ? h('div.repouso', {}, h('p', {}, rep.tipo === 'brasa' ? AVENTURA.textos.velou : t(`acampamento.${rep.tipo}`)), fichas(rep.mudou))
    : h('div.repouso', {},
      h('p.rotulo', {}, t('acampamento.umaCoisa')),
      h('button.escolha', { type: 'button', 'data-caminho': 'corpo', disabled: e.vida >= e.max.vida, onclick: () => { J.repousar(e, 'feridas'); desenhar(); } }, h('span.rot', {}, t('acampamento.tratar')), h('span.det', {}, t('acampamento.tratarDetalhe'))),
      h('button.escolha', { type: 'button', 'data-caminho': 'espirito', disabled: e.sanidade >= e.max.sanidade, onclick: () => { J.repousar(e, 'cabeca'); desenhar(); } }, h('span.rot', {}, t('acampamento.aquietar')), h('span.det', {}, t('acampamento.aquietarDetalhe'))),
      h('button.escolha', { type: 'button', 'data-caminho': 'livre', disabled: e.brasa >= J.MESA.brasa, onclick: () => { J.repousar(e, 'brasa'); som.brasa(); desenhar(); } }, h('span.rot', {}, AVENTURA.textos.velar), h('span.det', {}, `${AVENTURA.relogio.nome} +${J.MESA.repouso.brasa}`)),
    );
  palco.replaceChildren(
    h('article.carta.mestre', {},
      h('p.sobre', {}, t('acampamento.fimDoAto', { n: a.ato })),
      h('p.narra', {}, a.texto),
      fichas(a.mudou),
    ),
    h('section.evolucao', {},
      h('h3', {}, t('acampamento.pontos', { n: e.pontos })),
      h('p.nota', {}, a.marcos ? t('acampamento.ensinouComMarcos', { pontos: plural(a.ganhos, 'ponto'), marcos: plural(a.marcos, 'porMarco') }) : t('acampamento.ensinou', { pontos: plural(a.ganhos, 'ponto') })),
      h('div.colunas', {}, grupos),
    ),
    repouso,
    h('button.principal', { type: 'button', onclick: () => { som.toque(); J.continuar(e); desenhar(); } }, e.ato >= J.MESA.atos ? AVENTURA.textos.subir : (AVENTURA.textos.seguir ?? t('acampamento.seguir'))),
  );
}

function desenharFim(palco) {
  const f = e.fim;
  som.fim();
  const g = guardado();
  if (!e.contada) {
    const chave = `${AVENTURA.id}:${e.passado}`;
    g.finais ??= {};
    g.finais[chave] = Math.max(g.finais[chave] ?? 0, f.estrelas);
    if (Array.isArray(g.vistos) || !g.vistos) g.vistos = {};
    g.vistos[AVENTURA.id] = [...new Set([...(g.vistos[AVENTURA.id] ?? []), f.id])];
    g.sessoes = (g.sessoes ?? 0) + 1;
    if (e.dia) { g.dias ??= {}; g.dias[e.dia] ??= { estrelas: f.estrelas, titulo: f.titulo, passado: e.passado }; }
    e.contada = true;
    guardar(g);
  }
  const vistos = g.vistos?.[AVENTURA.id] ?? [];
  const endereco = `${location.origin}${location.pathname}?aventura=${AVENTURA.id}&semente=${encodeURIComponent(e.semente)}`;
  const texto = `${J.cronica(e)}\n${endereco}`;
  const aviso = h('span.copiado', { role: 'status' });
  const todos = [...AVENTURA.finais, ...Object.values(AVENTURA.quedas)];
  palco.replaceChildren(
    h('article.carta.final', { 'data-estrelas': f.estrelas },
      h('p.sobre', {}, e.dia ? t('inicio.doDia', { data: dataCurta(e.dia) }) : t('fim.daSessao')),
      h('h2', {}, f.titulo),
      h('p.estrelas', { 'aria-label': t('fim.estrelas', { n: f.estrelas }) }, estrelas(f.estrelas)),
      h('p.narra', {}, f.texto),
    ),
    h('section.cronica', {},
      h('h3', {}, t('fim.cronicaDe', { nome: e.nome })),
      h('ol', {}, e.cronica.map((l) => h('li', {}, l))),
      h('div.linha', {},
        h('button.secundario', { type: 'button', onclick: async () => {
          try {
            if (navigator.share) await navigator.share({ text: texto });
            else { await navigator.clipboard.writeText(texto); aviso.textContent = t('fim.copiada'); }
          } catch { aviso.textContent = t('fim.naoCopiou'); }
        } }, t('fim.compartilhar')),
        aviso,
      ),
    ),
    h('section.cronica', {},
      h('h3', {}, t('fim.caderno', { vistos: vistos.length, total: todos.length })),
      h('ul.caderno', {}, todos.map((x) => h(`li${vistos.includes(x.id) ? '' : '.oculto'}`, {}, vistos.includes(x.id) ? `${estrelas(x.estrelas)} ${x.titulo}` : t('fim.porDescobrir')))),
      h('p.nota', {}, t('cronica.semente', { semente: e.semente })),
    ),
    h('button.principal', { type: 'button', onclick: () => { location.search = `?aventura=${AVENTURA.id}${COM_IDIOMA}`; } }, t('fim.outraSessao')),
    e.dia ? null : h('button.secundario', { type: 'button', onclick: () => { location.search = `?aventura=${AVENTURA.id}&semente=${encodeURIComponent(e.semente)}${COM_IDIOMA}`; } }, t('fim.mesmaSemente')),
  );
}

/* ---------- Ficha ---------- */

function abrirFicha() {
  const d = $('#ficha');
  const v = R.valores(e.ficha);
  const eq = J.equipado(e);
  const emUso = new Set([eq.arma, eq.longa, eq.armadura, eq.escudo].filter(Boolean).map((i) => i.id));
  const podeAgir = ['cena', 'acampamento'].includes(e.fase);
  const itens = e.itens.map((id) => {
    const i = AVENTURA.itens[id];
    const usar = i.tipo === 'consumivel' && podeAgir ? h('button.mais', { type: 'button', onclick: () => { J.usar(e, id); som.sucesso(); desenharTopo(); abrirFicha(); } }, t('ficha.usar')) : null;
    return h('li', {}, nomeDoItem(id), emUso.has(id) ? h('small', {}, t('ficha.emUso')) : null, i.tipo === 'objeto' ? h('small', {}, t('ficha.ajuda')) : null, usar);
  });
  const podeCurar = podeAgir && R.maximoDePM(e.ficha, 'magiaSuporte', e.magia) > 0 && e.vida < e.max.vida;
  d.replaceChildren(
    h('form', { method: 'dialog' },
      h('header', {}, h('h2', {}, e.nome), h('button.icone', { type: 'submit', 'aria-label': t('ficha.fechar') }, '×')),
      h('p.nota', {}, e.tituloDoPassado, t('ficha.gastos', { pontos: plural(R.pontosGastos(e.ficha), 'pontoGasto') }), e.pontos ? t('ficha.paraGastar', { n: e.pontos }) : ''),
      resumoDaFicha(e.ficha, { completa: true }),
      h('table.valores', {},
        h('tr', {}, h('th', {}, ''), h('th', {}, t('ficha.inicial')), h('th', {}, t('ficha.atual'))),
        h('tr', {}, h('td', {}, t('ficha.pontosDeVida')), h('td', {}, e.max.vida), h('td', {}, e.vida)),
        h('tr', {}, h('td', {}, t('ficha.pontosDeMagia')), h('td', {}, e.max.magia), h('td', {}, e.magia)),
        h('tr', {}, h('td', {}, t('ficha.sanidade')), h('td', {}, e.max.sanidade), h('td', {}, e.sanidade)),
      ),
      h('p.numeros', {}, t('ficha.numeros', { curto: v.ataqueCurta, longo: v.ataqueLonga, defesa: v.defesa, limite: eq.limite })),
      podeCurar ? h('button.secundario', { type: 'button', onclick: () => { J.curar(e); som.sucesso(); desenharTopo(); abrirFicha(); } }, t('ficha.curar')) : null,
      Object.keys(e.ficha.antecedentes).length ? h('p', {}, h('b', {}, t('ficha.antecedentes')), Object.entries(e.ficha.antecedentes).map(([k, a]) => `${nomeDoAntecedente(k)} ${a.nivel}`).join(', ')) : null,
      h('h4', {}, t('ficha.armas')),
      itens.length ? h('ul.itens', {}, itens) : h('p.nota', {}, t('ficha.nadaNaSacola')),
      h('h4', {}, t('ficha.companhia')),
      e.companheiros.length
        ? h('ul.itens', {}, e.companheiros.map((id) => { const c = AVENTURA.companheiros[id]; return h('li', {}, h('b', {}, c.nome), c.quem ? `, ${c.quem}` : '', h('small', {}, ' · ' + Object.entries(c.niveis).map(([k, n]) => `${nomeDaChave(k)} ${n}`).join(', '))); }))
        : h('p.nota', {}, t('ficha.viajaSo')),
      h('p.nota', {}, t('ficha.lacos', { lacos: e.lacos, relogio: AVENTURA.relogio.nome, atual: e.brasa, max: J.MESA.brasa })),
    ),
  );
  if (!d.open) d.showModal();
}

/* ---------- Ligações ---------- */

$('#abrir-ficha').addEventListener('click', () => { som.toque(); abrirFicha(); });
$('#som').setAttribute('aria-pressed', String(somLigado()));
$('#som').addEventListener('click', () => { const l = alternarSom(); $('#som').setAttribute('aria-pressed', String(l)); if (l) som.toque(); });
$('#ficha').addEventListener('click', (ev) => { if (ev.target === $('#ficha')) $('#ficha').close(); });

traduzirPagina();
montarIdiomas();
/** Teclado: 1 a 6 escolhem, Enter confirma ou continua, F abre a ficha. */
document.addEventListener('keydown', (ev) => {
  if ($('#mesa').hidden || $('#ficha').open || ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if (['INPUT', 'TEXTAREA'].includes(ev.target.tagName)) return;
  const palco = $('#palco');
  if (/^[1-9]$/.test(ev.key)) {
    const alvo = [...palco.querySelectorAll('.escolha:not(:disabled)')][Number(ev.key) - 1];
    if (alvo) { ev.preventDefault(); alvo.click(); }
  } else if (ev.key === 'Enter') {
    const alvo = palco.querySelector('.preparo .principal') ?? palco.querySelector('.insistir .principal') ?? [...palco.querySelectorAll(':scope > .principal')].pop();
    if (alvo && document.activeElement?.tagName !== 'BUTTON') { ev.preventDefault(); alvo.click(); }
  } else if (ev.key.toLowerCase() === 'f') {
    $('#abrir-ficha').click();
  }
});

montarInicio();
if (params.get('jogar') === '1') comecar();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* sem instalação, o jogo segue igual */ });
}

window.duploSeis = { get e() { return e; }, J, R, desenhar };
