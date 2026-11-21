/** Duplo Seis: a mesa na tela. Lê o estado de jogo.js e desenha. */
import * as J from './jogo.js';
import * as R from './regras.js';
import { PASSADOS, PONTOS_INICIAIS } from './passados.js';
import { brasa as AVENTURA } from './aventuras/brasa/index.js';
import { sementeNova } from './rng.js';
import { som, alternarSom, somLigado } from './som.js';
import { VERSAO } from './versao.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const RAPIDO = params.has('rapido') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const espera = (ms) => new Promise((ok) => setTimeout(ok, RAPIDO ? 0 : ms));

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

const CAMINHO = { corpo: 'Corpo', mente: 'Mente', espirito: 'Espírito' };
const ANTECEDENTE = { aliado: 'Aliado', inimigo: 'Inimigo', boaFama: 'Boa Fama', maFama: 'Má Fama', recursos: 'Recursos', semRecursos: 'Sem Recursos' };
const MEDIDA = { vida: 'Vida', magia: 'Magia', sanidade: 'Sanidade', brasa: 'Brasa', lacos: 'Laço' };
const bolinhas = (n, max = 5) => '●'.repeat(n) + '○'.repeat(Math.max(0, max - n));
const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`;

/* ---------- Guardado no aparelho ---------- */

const CHAVE = 'duplo-seis';
function guardado() {
  try { return JSON.parse(localStorage.getItem(CHAVE)) ?? {}; } catch { return {}; }
}
function guardar(d) {
  try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch { /* sem armazenamento */ }
}

/* ---------- Início ---------- */

function montarInicio() {
  $('#aventura-nome').textContent = AVENTURA.nome;
  $('#aventura-resumo').textContent = AVENTURA.resumo;
  $('#versao').textContent = `Duplo Seis ${VERSAO.numero}`;
  const g = guardado();
  const lista = $('#passados');
  lista.replaceChildren(...PASSADOS.map((p) => {
    const melhor = g.finais?.[p.id];
    return h('button.passado', { type: 'button', role: 'radio', 'aria-checked': 'false', 'data-id': p.id, 'data-caminho': p.caminho, onclick: () => escolherPassado(p.id) },
      h('strong', {}, p.titulo),
      h('small', {}, CAMINHO[p.caminho]),
      melhor != null ? h('span.estrelas', { title: 'Melhor final' }, '★'.repeat(melhor) + '☆'.repeat(3 - melhor)) : null,
    );
  }));
  escolherPassado(params.get('passado') ?? g.ultimo ?? PASSADOS[0].id, false);
}

function escolherPassado(id, rolar = true) {
  const p = PASSADOS.find((x) => x.id === id) ?? PASSADOS[0];
  escolhido = p;
  som.toque();
  for (const b of document.querySelectorAll('.passado')) b.setAttribute('aria-checked', String(b.dataset.id === p.id));
  const ficha = R.novaFicha(p);
  const v = R.valores(ficha);
  const caixa = $('#escolhido');
  caixa.hidden = false;
  caixa.dataset.caminho = p.caminho;
  caixa.replaceChildren(
    h('p.quem', {}, p.quem),
    h('p.motivo', {}, p.motivo),
    resumoDaFicha(ficha),
    h('p.numeros', {}, `Vida ${v.vida} · Magia ${v.magia} · Sanidade ${v.sanidade}`),
    h('p.leva', {}, 'Leva: ', p.itens.map((i) => nomeDoItem(i)).join(', '), Object.keys(p.antecedentes).length ? ` · Antecedentes: ${Object.keys(p.antecedentes).map((a) => ANTECEDENTE[a]).join(', ')}` : ''),
    h('label.campo', {}, 'Nome', h('input', { id: 'nome', type: 'text', maxlength: '18', value: p.nome, autocomplete: 'off' })),
    h('details.semente', {}, h('summary', {}, 'Semente da sessão'),
      h('label.campo', {}, 'A mesma semente conta a mesma história', h('input', { id: 'semente', type: 'text', maxlength: '24', value: params.get('semente') ?? '', placeholder: 'em branco: sorteia uma' }))),
    h('button.principal', { type: 'button', onclick: comecar }, 'Sentar à mesa'),
  );
  if (rolar) caixa.scrollIntoView({ behavior: RAPIDO ? 'auto' : 'smooth', block: 'nearest' });
}

function nomeDoItem(id) {
  const i = AVENTURA.itens[id];
  return i.mod ? `${i.nome} ${i.mod}` : i.nome;
}

/** A ficha em bolinhas, como no papel. */
function resumoDaFicha(ficha, { completa = false } = {}) {
  const colunas = Object.entries(R.CAMINHOS).map(([c, def]) => h('div.coluna', { 'data-caminho': c },
    h('h4', {}, def.nome),
    def.atributos.map((a) => {
      const n = ficha.atributos[a];
      const aprs = Object.entries(R.APRIMORAMENTOS).filter(([k, d]) => d.pai === a && (ficha.aprimoramentos[k] ?? 0) > 0);
      if (!completa && n === 0) return h('p.atributo.vazio', {}, h('span', {}, R.ATRIBUTOS[a].nome), h('span.b', {}, bolinhas(0)));
      return [
        h('p.atributo', {}, h('span', {}, R.ATRIBUTOS[a].nome), h('span.b', {}, bolinhas(n))),
        aprs.map(([k, d]) => h('p.aprimoramento', {}, h('span', {}, d.nome), h('span.b', {}, bolinhas(ficha.aprimoramentos[k], n)))),
      ];
    }),
  ));
  const pericias = Object.entries(ficha.pericias).filter(([, n]) => n > 0);
  return h('div.resumo-ficha', {},
    h('div.colunas', {}, colunas),
    pericias.length ? h('p.pericias', {}, 'Perícias: ', pericias.map(([k, n]) => `${R.nomeDaChave(k)} ${n}`).join(', ')) : null,
  );
}

function comecar() {
  const nome = $('#nome')?.value.trim() || escolhido.nome;
  const semente = $('#semente')?.value.trim() || sementeNova(Date.now());
  e = J.nova({ semente, passado: escolhido.id, nome, aventura: AVENTURA });
  const g = guardado();
  g.ultimo = escolhido.id;
  guardar(g);
  history.replaceState(null, '', `?semente=${encodeURIComponent(semente)}&passado=${escolhido.id}`);
  $('#inicio').hidden = true;
  $('#mesa').hidden = false;
  window.scrollTo(0, 0);
  som.brasa();
  desenhar();
}

/* ---------- Cabeçalho da mesa ---------- */

function desenharTopo() {
  $('#topo-nome').textContent = e.nome;
  const ato = e.cena?.ato ?? e.ato;
  $('#topo-ato').textContent = e.fase === 'acampamento' ? 'Acampamento' : ato === 0 ? 'Vau-do-Sino' : `Ato ${Math.min(ato, 4)} · ${AVENTURA.atos[Math.min(ato, 4)]}`;
  document.documentElement.style.setProperty('--brasa', String(e.brasa / J.MESA.brasa));
  const barra = (tipo, atual, max) => h(`div.medida.${tipo}`, { title: `${MEDIDA[tipo]}: ${atual} de ${max}` },
    h('span.nome', {}, MEDIDA[tipo]),
    h('span.trilho', {}, h('span.cheio', { style: `width:${max ? Math.round((atual / max) * 100) : 0}%` })),
    h('span.palavra', {}, J.emPalavras(tipo, atual, max)),
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

function desenhar() {
  desenharTopo();
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
  return h('article.carta.mestre', {},
    h('p.sobre', {}, cena.titulo),
    h('p.narra', {}, cena.texto.replaceAll('{nome}', e.nome)),
    e.entrada?.length ? fichas(e.entrada) : null,
  );
}

function descreverOpcao(o) {
  if (o.tipo === 'teste') {
    if (o.magica) return o.disponivel ? `${o.nomeChave} · 1 dado por Ponto de Magia · ${o.nomeDificuldade} ${o.dificuldade}` : `${o.nomeChave} · sem Pontos de Magia`;
    const dados = o.nivel > 0 ? plural(o.nivel, 'dado', 'dados') : '1 dado −2';
    return `${o.nomeChave} · ${dados} · ${o.nomeDificuldade} ${o.dificuldade}`;
  }
  if (o.tipo === 'combate') return `Combate · ${o.inimigo}`;
  return o.custo ? `Sem dados · custa ${Object.entries(o.custo).map(([k, v]) => `${-v} de ${MEDIDA[k]}`).join(', ')}` : 'Sem dados';
}

function desenharCena(palco) {
  const ops = J.opcoes(e);
  const lista = h('div.escolhas');
  for (const o of ops) {
    const botao = h('button.escolha', { type: 'button', 'data-caminho': o.caminho ?? 'livre', disabled: !o.disponivel, 'aria-expanded': 'false', onclick: () => abrirPreparo(o, botao, lista) },
      h('span.rot', {}, o.rotulo, o.especial ? h('span.especial', { title: 'Só para quem tem esse passado ou esse objeto' }, '★') : null),
      h('span.det', {}, descreverOpcao(o)),
    );
    lista.append(h('div.opcao', {}, botao));
  }
  palco.replaceChildren(cartaDoMestre(e.cena), h('p.pergunta', {}, 'O que você faz?'), lista);
}

function abrirPreparo(o, botao, lista) {
  som.toque();
  for (const p of lista.querySelectorAll('.preparo')) p.remove();
  for (const b of lista.querySelectorAll('.escolha')) b.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-expanded', 'true');
  const extras = { objeto: null, unir: [], pm: o.maxPM ?? 0 };
  const caixa = h('div.preparo', { 'data-caminho': o.caminho ?? 'livre' });
  const principal = h('button.principal', { type: 'button' });

  const atualizar = () => {
    if (o.tipo === 'combate') { principal.textContent = 'Partir para a luta'; return; }
    if (o.tipo === 'livre') { principal.textContent = 'Fazer isso'; return; }
    let n;
    if (o.magica) n = extras.pm;
    else n = o.nivel + (o.objetos.find((x) => x.id === extras.objeto)?.mod ?? 0) + o.aliados.filter((x) => extras.unir.includes(x.id)).reduce((s, x) => s + x.nivel, 0);
    principal.textContent = n > 0 ? `Rolar ${plural(n, 'dado', 'dados')} contra ${o.dificuldade}` : `Rolar 1 dado −2 contra ${o.dificuldade}`;
  };

  if (o.tipo === 'teste' && !o.magica) {
    if (o.nivel === 0) caixa.append(h('p.nota', {}, `Você não tem nível em ${o.nomeChave}: rola um dado e tira 2, e não pode insistir.`));
    else if (o.caminho === 'corpo') caixa.append(h('p.nota', {}, 'Teste do Corpo: se falhar, dá para insistir pagando em Vida o que faltar.'));
    for (const obj of o.objetos) {
      const t = h('button.alavanca', { type: 'button', 'aria-pressed': 'false', onclick: () => {
        extras.objeto = extras.objeto === obj.id ? null : obj.id;
        for (const b of caixa.querySelectorAll('.alavanca.objeto')) b.setAttribute('aria-pressed', String(b === t && extras.objeto === obj.id));
        som.toque(); atualizar();
      } }, `Usar ${obj.nome}`, h('b', {}, `+${plural(obj.mod, 'dado', 'dados')}`));
      t.classList.add('objeto');
      caixa.append(t);
    }
    for (const al of o.aliados) {
      const t = h('button.alavanca', { type: 'button', 'aria-pressed': 'false', onclick: () => {
        const i = extras.unir.indexOf(al.id);
        if (i >= 0) extras.unir.splice(i, 1); else extras.unir.push(al.id);
        t.setAttribute('aria-pressed', String(i < 0));
        som.toque(); atualizar();
      } }, `Unir forças com ${al.nome}`, h('b', {}, `+${plural(al.nivel, 'dado', 'dados')}`));
      caixa.append(t);
    }
  }
  if (o.magica) {
    caixa.append(h('p.nota', {}, `Magia: cada Ponto de Magia gasto rola um dado. Seu limite nesta perícia é ${o.maxPM}.`));
    const linha = h('div.pm');
    for (let n = 1; n <= o.maxPM; n++) {
      const b = h('button.alavanca', { type: 'button', 'aria-pressed': String(n === extras.pm), onclick: () => {
        extras.pm = n;
        for (const x of linha.children) x.setAttribute('aria-pressed', String(x === b));
        som.toque(); atualizar();
      } }, `${n} PM`);
      linha.append(b);
    }
    caixa.append(linha);
  }
  if (o.tipo === 'combate') caixa.append(h('p.nota', {}, 'Combate é por rodadas: seu valor mais um dado contra o do inimigo. Custa caro para quem não é do Corpo.'));
  principal.addEventListener('click', () => confirmar(o, extras));
  atualizar();
  caixa.append(principal);
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
    h('p.sobre', {}, `${o.rotulo} · ${r.nomeChave} contra ${r.dificuldade}`),
    bandeja, conta, selo);
  palco.replaceChildren(h('article.carta.mestre.curta', {}, h('p.sobre', {}, e.cena.titulo)), mesa);
  mesa.scrollIntoView({ block: 'center' });

  await rolarDados(bandeja, r.dados, { classe: (i) => (i === 0 ? 'sorte' : '') });
  const soma = r.dados.join(' + ') + (r.incapaz ? ' − 2' : '');
  conta.textContent = r.dados.length > 1 || r.incapaz ? `${soma} = ${r.total}` : `${r.total}`;
  await espera(350);

  if (r.sorte.confirma != null) {
    const linha = h('div.confirma', {}, h('p', {}, `O dado da sorte caiu ${r.dados[0]}. O Mestre manda rolar de novo.`));
    const b2 = h('div.bandeja.pequena');
    linha.append(b2);
    mesa.append(linha);
    await espera(500);
    await rolarDados(b2, [r.sorte.confirma], { classe: () => 'sorte' });
    if (r.sorte.tipo === 'sucesso') { linha.append(h('p.duplo.bom', {}, 'Duplo seis! Sucesso crítico.')); som.critico(); }
    else if (r.sorte.tipo === 'falha') { linha.append(h('p.duplo.mau', {}, 'Duplo um. Falha crítica.')); som.desastre(); }
    else linha.append(h('p.nada', {}, 'Não se repetiu. Segue o jogo.'));
    await espera(r.sorte.tipo ? 900 : 450);
  }

  if (e.fase === 'insistir') {
    selo.textContent = `Faltou ${r.falta}`;
    selo.className = 'selo-resultado falha';
    som.falha();
    mesa.append(h('div.insistir', {},
      h('p', {}, `Dá para insistir: um esforço acima das suas forças. Custa ${r.custoInsistir} de Vida (você tem ${e.vida}).`),
      h('button.principal.corpo', { type: 'button', onclick: () => { J.insistir(e, true); som.golpe(); desenhar(); } }, `Insistir (−${r.custoInsistir} Vida)`),
      h('button.secundario', { type: 'button', onclick: () => { J.insistir(e, false); desenhar(); } }, 'Aceitar a falha'),
    ));
    return;
  }
  const ok = e.desfecho.ok;
  selo.textContent = r.viradaDaSorte ? 'A sorte virou: sucesso' : ok ? 'Sucesso' : `Falha: faltou ${r.falta}`;
  selo.className = `selo-resultado ${ok ? 'sucesso' : 'falha'}`;
  if (!r.sorte.tipo) (ok ? som.sucesso : som.falha)();
  await espera(700);
  desenhar();
}

const SINAL = (v) => (v > 0 ? `+${v}` : `−${Math.abs(v)}`);
function fichas(mudou) {
  if (!mudou?.length) return null;
  return h('p.fichas', {}, mudou.map((m) => {
    if (m.tipo === 'item') return h('span.ficha-m.ganho', {}, `Ganhou: ${m.nome}`);
    if (m.tipo === 'semItem') return h('span.ficha-m.perda', {}, `Perdeu: ${m.nome}`);
    if (m.tipo === 'companheiro') return h('span.ficha-m.ganho', {}, `${m.nome} segue com você`);
    if (m.tipo === 'semCompanheiro') return h('span.ficha-m.perda', {}, `${m.nome} foi embora`);
    if (m.tipo === 'marco') return h('span.ficha-m.marco', {}, 'Marco da história');
    return h(`span.ficha-m.${m.valor > 0 ? 'ganho' : 'perda'}.${m.tipo}`, {}, `${MEDIDA[m.tipo]} ${SINAL(m.valor)}`);
  }));
}

function linhaDeGolpe(g) {
  const eu = g.quem === 'voce';
  let texto;
  if (g.critico === 'ataque-falha') texto = eu ? 'Duplo um: seu golpe se perde no ar.' : 'Duplo um: o ataque dele se perde.';
  else if (g.critico === 'defesa-sucesso') texto = eu ? 'Duplo seis na defesa: ele escapa por um fio.' : 'Duplo seis na defesa: você sai ileso.';
  else if (!g.acertou) texto = eu ? 'Defendido.' : 'Você defende.';
  else {
    const alvo = g.alvo === 'sanidade' ? 'Sanidade' : 'Vida';
    texto = eu ? `Acertou: ${g.dano} de dano.` : `Acertou você: −${g.dano} de ${alvo}.`;
    if (g.critico === 'ataque-sucesso') texto = `Duplo seis! ${texto}`;
    if (g.critico === 'defesa-falha') texto = `A guarda abriu. ${texto}`;
  }
  const d1 = novoDado(); face(d1, g.dadoAtaque);
  const d2 = novoDado(); face(d2, g.dadoDefesa);
  return h(`div.golpe.${eu ? 'meu' : 'dele'}`, {},
    h('p.quem', {}, eu ? g.rotulo : `${g.rotulo} ataca`),
    h('p.conta-golpe', {}, d1, h('span', {}, `${g.valorAtaque}`), h('em', {}, 'contra'), d2, h('span', {}, `${g.valorDefesa}`)),
    h('p.efeito', {}, texto),
  );
}

function desenharCombate(palco) {
  const c = e.combate;
  const acoes = J.acoesDeCombate(e);
  const botoes = h('div.acoes');
  for (const a of acoes) {
    if (a.maxPM) {
      for (let n = 1; n <= a.maxPM; n++) botoes.append(h('button.escolha', { type: 'button', 'data-caminho': 'mente', onclick: () => rodada(a.id, n) }, h('span.rot', {}, `${a.rotulo} (${n} PM)`), h('span.det', {}, `1 dado + ${n}`)));
    } else if (a.id === 'recuar') {
      botoes.append(h('button.escolha', { type: 'button', 'data-caminho': 'livre', onclick: () => rodada('recuar') }, h('span.rot', {}, 'Recuar'), h('span.det', {}, 'Ele ainda ataca uma vez')));
    } else {
      botoes.append(h('button.escolha', { type: 'button', 'data-caminho': 'corpo', onclick: () => rodada(a.id) }, h('span.rot', {}, a.rotulo), h('span.det', {}, `1 dado + ${a.ataque}${a.arma ? ` · arma +${a.arma} no dano` : ''}`)));
    }
  }
  palco.replaceChildren(
    h('article.carta.mestre.curta', {}, h('p.sobre', {}, e.cena.titulo)),
    h('section.combate', {},
      h('h3', {}, c.inimigo.nome),
      h('p.estado', {}, `Está ${J.estadoDoInimigo(e)}. ${c.rodada === 0 ? (c.primeiro === 'voce' ? 'Você é mais rápido: ataca primeiro.' : 'Ele é mais rápido: ataca primeiro.') : `Rodada ${c.rodada + 1}.`}`),
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
  const filhos = [h('article.carta.mestre.curta', {}, h('p.sobre', {}, e.cena.titulo))];
  if (d.combate) filhos.push(h('section.combate', {}, h('div.log', {}, d.combate.log.map(linhaDeGolpe))));
  if (e.rolagem && d.tipo === 'teste') {
    const r = e.rolagem;
    const bandeja = h('div.bandeja.pequena', {}, r.dados.map((v, i) => { const x = novoDado(i === 0 ? 'sorte' : ''); face(x, v); x.classList.add('pousou'); return x; }));
    filhos.push(h('section.rolagem.resumo', { 'data-caminho': r.caminho }, bandeja,
      h('p.conta', {}, `${r.nomeChave}: ${r.total} contra ${r.dificuldade}${r.insistiu ? ' · insistiu' : ''}`)));
  }
  const carimbo = d.tipo === 'livre' ? null : h(`p.selo-resultado.${d.ok ? 'sucesso' : 'falha'}`, {},
    d.critico === 'sucesso' ? 'Sucesso crítico' : d.critico === 'falha' ? (d.ok ? 'Sucesso, mas…' : 'Falha crítica') : d.tipo === 'combate' ? ({ vitoria: 'Vitória', derrota: 'Derrota', fuga: 'Recuo' }[d.combate.fim]) : d.ok ? 'Sucesso' : 'Falha');
  filhos.push(h('article.carta.desfecho', { 'data-ok': String(d.ok) }, carimbo, h('p.narra', {}, d.texto), fichas(d.mudou)));
  for (const a of d.avisos) filhos.push(h('article.carta.aviso', {}, h('p.narra', {}, a.texto), fichas(a.mudou)));
  if (d.fatal) filhos.push(h('article.carta.aviso', {}, h('p.narra', {}, d.fatal === 'morte' ? 'Desta vez o corpo não levanta.' : 'Desta vez a cabeça não volta.')));
  filhos.push(h('button.principal', { type: 'button', onclick: () => { som.toque(); J.continuar(e); desenhar(); } }, d.fatal ? 'Ver o fim' : 'Continuar'));
  palco.replaceChildren(...filhos);
  if (d.mudou.some((m) => m.tipo === 'brasa')) som.brasa();
}

function desenharSurto(palco) {
  const s = e.surto;
  som.desastre();
  palco.replaceChildren(
    h('article.carta.aviso.surto', {},
      h('p.sobre', {}, 'Fora de si'),
      h('p.narra', {}, s.texto),
      fichas(s.mudou),
      h('p.nota', {}, s.restam === 1 ? 'Da próxima vez, você não volta.' : 'A cabeça volta aos poucos. Não vai aguentar isso muitas vezes.'),
    ),
    h('button.principal', { type: 'button', onclick: () => { J.continuar(e); desenhar(); } }, 'Levantar e seguir'),
  );
}

function desenharAcampamento(palco) {
  const a = e.acampamento;
  const lojas = J.compras(e);
  const grupos = Object.keys(R.CAMINHOS).map((c) => h('div.coluna', { 'data-caminho': c },
    h('h4', {}, CAMINHO[c]),
    lojas.filter((l) => l.caminho === c && (l.tipo === 'atributo' || l.teto > 0)).map((l) => h(`p.compra.${l.tipo}`, {},
      h('span', {}, l.nome),
      h('span.b', {}, bolinhas(l.nivel, l.tipo === 'atributo' ? 5 : Math.max(l.teto, l.nivel))),
      h('button.mais', { type: 'button', disabled: !l.pode, 'aria-label': `Subir ${l.nome}`, onclick: () => { J.comprar(e, l.chave); som.sucesso(); desenhar(); } }, '+'),
    )),
  ));
  const rep = a.repousou;
  const repouso = rep
    ? h('div.repouso', {}, h('p', {}, { feridas: 'Você trata as feridas.', cabeca: 'Você deixa a cabeça assentar.', brasa: 'Você vela a brasa a noite toda.' }[rep.tipo]), fichas(rep.mudou))
    : h('div.repouso', {},
      h('p.rotulo', {}, 'A noite dá para uma coisa só'),
      h('button.escolha', { type: 'button', 'data-caminho': 'corpo', disabled: e.vida >= e.max.vida, onclick: () => { J.repousar(e, 'feridas'); desenhar(); } }, h('span.rot', {}, 'Tratar as feridas'), h('span.det', {}, 'Recupera 1 dado de Vida')),
      h('button.escolha', { type: 'button', 'data-caminho': 'espirito', disabled: e.sanidade >= e.max.sanidade, onclick: () => { J.repousar(e, 'cabeca'); desenhar(); } }, h('span.rot', {}, 'Aquietar a cabeça'), h('span.det', {}, 'Recupera 1 dado de Sanidade')),
      h('button.escolha', { type: 'button', 'data-caminho': 'livre', disabled: e.brasa >= J.MESA.brasa, onclick: () => { J.repousar(e, 'brasa'); som.brasa(); desenhar(); } }, h('span.rot', {}, 'Velar a brasa'), h('span.det', {}, 'Brasa +1')),
    );
  palco.replaceChildren(
    h('article.carta.mestre', {},
      h('p.sobre', {}, `Fim do Ato ${a.ato}`),
      h('p.narra', {}, a.texto),
      fichas(a.mudou),
    ),
    h('section.evolucao', {},
      h('h3', {}, `Pontos de Evolução: ${e.pontos}`),
      h('p.nota', {}, a.marcos ? `O caminho ensinou: ${plural(a.ganhos, 'ponto', 'pontos')} neste ato, ${plural(a.marcos, 'deles por marco', 'deles por marcos')} da história. Ninguém aprende nada por derrubar inimigo.` : `O caminho ensinou: ${plural(a.ganhos, 'ponto', 'pontos')} neste ato. Marcos da história valem mais.`),
      h('div.colunas', {}, grupos),
    ),
    repouso,
    h('button.principal', { type: 'button', onclick: () => { som.toque(); J.continuar(e); desenhar(); } }, e.ato >= J.MESA.atos ? 'Subir ao Farol' : 'Seguir viagem'),
  );
}

function desenharFim(palco) {
  const f = e.fim;
  som.fim();
  const g = guardado();
  g.finais ??= {};
  g.finais[e.passado] = Math.max(g.finais[e.passado] ?? 0, f.estrelas);
  g.vistos = [...new Set([...(g.vistos ?? []), f.id])];
  g.sessoes = (g.sessoes ?? 0) + (e.contada ? 0 : 1);
  e.contada = true;
  guardar(g);
  const texto = J.cronica(e);
  const aviso = h('span.copiado', { role: 'status' });
  palco.replaceChildren(
    h('article.carta.final', { 'data-estrelas': f.estrelas },
      h('p.sobre', {}, 'Fim da sessão'),
      h('h2', {}, f.titulo),
      h('p.estrelas', { 'aria-label': `${f.estrelas} de 3 estrelas` }, '★'.repeat(f.estrelas) + '☆'.repeat(3 - f.estrelas)),
      h('p.narra', {}, f.texto),
    ),
    h('section.cronica', {},
      h('h3', {}, `A crônica de ${e.nome}`),
      h('ol', {}, e.cronica.map((l) => h('li', {}, l))),
      h('p.nota', {}, `Finais descobertos: ${g.vistos.length} de ${AVENTURA.finais.length + Object.keys(AVENTURA.quedas).length} · semente ${e.semente}`),
      h('div.linha', {},
        h('button.secundario', { type: 'button', onclick: async () => {
          try {
            if (navigator.share) await navigator.share({ text: texto });
            else { await navigator.clipboard.writeText(texto); aviso.textContent = 'Crônica copiada.'; }
          } catch { aviso.textContent = 'Não deu para copiar.'; }
        } }, 'Compartilhar a crônica'),
        aviso,
      ),
    ),
    h('button.principal', { type: 'button', onclick: () => { location.search = ''; } }, 'Outra sessão'),
    h('button.secundario', { type: 'button', onclick: () => { location.search = `?semente=${encodeURIComponent(e.semente)}&passado=${e.passado}`; } }, 'Mesma semente, outro passado'),
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
    const usar = i.tipo === 'consumivel' && podeAgir ? h('button.mais', { type: 'button', onclick: () => { J.usar(e, id); som.sucesso(); desenharTopo(); abrirFicha(); } }, 'usar') : null;
    return h('li', {}, nomeDoItem(id), emUso.has(id) ? h('small', {}, ' em uso') : null, i.tipo === 'objeto' ? h('small', {}, ' ajuda em testes') : null, usar);
  });
  const podeCurar = podeAgir && R.maximoDePM(e.ficha, 'magiaSuporte', e.magia) > 0 && e.vida < e.max.vida;
  d.replaceChildren(
    h('form', { method: 'dialog' },
      h('header', {}, h('h2', {}, e.nome), h('button.icone', { type: 'submit', 'aria-label': 'Fechar' }, '×')),
      h('p.nota', {}, PASSADOS.find((p) => p.id === e.passado).titulo, ` · ${plural(R.pontosGastos(e.ficha), 'Ponto', 'Pontos')} de Evolução gastos`, e.pontos ? ` · ${e.pontos} para gastar no acampamento` : ''),
      resumoDaFicha(e.ficha, { completa: true }),
      h('table.valores', {},
        h('tr', {}, h('th', {}, ''), h('th', {}, 'Inicial'), h('th', {}, 'Atual')),
        h('tr', {}, h('td', {}, 'Pontos de Vida'), h('td', {}, e.max.vida), h('td', {}, e.vida)),
        h('tr', {}, h('td', {}, 'Pontos de Magia'), h('td', {}, e.max.magia), h('td', {}, e.magia)),
        h('tr', {}, h('td', {}, 'Sanidade'), h('td', {}, e.max.sanidade), h('td', {}, e.sanidade)),
      ),
      h('p.numeros', {}, `Ataque curto ${v.ataqueCurta} · Ataque longo ${v.ataqueLonga} · Defesa ${v.defesa} · Limite de equipamento ${eq.limite}`),
      podeCurar ? h('button.secundario', { type: 'button', onclick: () => { J.curar(e); som.sucesso(); desenharTopo(); abrirFicha(); } }, 'Curar com magia (1 PM, 1 dado de Vida)') : null,
      Object.keys(e.ficha.antecedentes).length ? h('p', {}, h('b', {}, 'Antecedentes: '), Object.entries(e.ficha.antecedentes).map(([k, a]) => `${ANTECEDENTE[k]} ${a.nivel}`).join(', ')) : null,
      h('h4', {}, 'Armas e equipamentos'),
      itens.length ? h('ul.itens', {}, itens) : h('p.nota', {}, 'Nada na sacola.'),
      h('h4', {}, 'Companhia'),
      e.companheiros.length
        ? h('ul.itens', {}, e.companheiros.map((id) => { const c = AVENTURA.companheiros[id]; return h('li', {}, h('b', {}, c.nome), c.quem ? `, ${c.quem}` : '', h('small', {}, ' · ' + Object.entries(c.niveis).map(([k, n]) => `${R.nomeDaChave(k)} ${n}`).join(', '))); }))
        : h('p.nota', {}, 'Você viaja só.'),
      h('p.nota', {}, `Laços pelo caminho: ${e.lacos} · Brasa: ${e.brasa} de ${J.MESA.brasa}`),
    ),
  );
  if (!d.open) d.showModal();
}

/* ---------- Ligações ---------- */

$('#abrir-ficha').addEventListener('click', () => { som.toque(); abrirFicha(); });
$('#som').setAttribute('aria-pressed', String(somLigado()));
$('#som').addEventListener('click', () => { const l = alternarSom(); $('#som').setAttribute('aria-pressed', String(l)); if (l) som.toque(); });
$('#ficha').addEventListener('click', (ev) => { if (ev.target === $('#ficha')) $('#ficha').close(); });

montarInicio();
if (params.get('jogar') === '1') comecar();

window.duploSeis = { get e() { return e; }, J, R, desenhar, PONTOS_INICIAIS };
