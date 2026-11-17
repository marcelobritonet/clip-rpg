/** Interface da arena: montagem, duelo e simulador. A lógica está em arena.js. */
import * as arena from './arena.js';
import { ATRIBUTOS, APRIMORAMENTOS, pontosGastos, limiteEquipamento, slug } from '../motor/clip.js';
import { aposRender } from '../ficha/dicas.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const termo = (texto, dica) => (dica ? `<span class="termo" data-dica="${dica}" tabindex="0">${esc(texto)}</span>` : esc(texto));
const pct = (x) => `${Math.round(x * 100)}%`;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------------ */
/* Opções (chaves)                                                          */
/* ------------------------------------------------------------------------ */

const CHAVES = [
  { id: 'resistenciaReduzDano', rotulo: 'Resistência também reduz o dano', dica: 'resistencia', nota: 'Texto atual: conta na Defesa e de novo no dano.' },
  { id: 'criticos', rotulo: 'Efeitos dos críticos', dica: 'regras-especiais', nota: 'Proposta 5.4: dano dobrado, ação perdida, contra-ataque, armadura ignorada.' },
  { id: 'defender', rotulo: 'Ação Defender (+2)', dica: 'defesa', nota: 'Proposta 5.2.' },
  { id: 'sanidadeDerruba', rotulo: 'Sanidade a zero tira do duelo', dica: 'sanidade', nota: '"Fora de si" encerra a luta.' },
];

function desenharChaves(el, prefixo) {
  el.innerHTML = CHAVES.map((c) => `
    <label class="chave">
      <input type="checkbox" id="${prefixo}-${c.id}" ${arena.OPCOES_PADRAO[c.id] ? 'checked' : ''}>
      <span>${termo(c.rotulo, c.dica)}<small>${esc(c.nota)}</small></span>
    </label>`).join('');
}

function lerOpcoes(prefixo, orcamentoId, distanciaId) {
  const o = { orcamento: clamp(+$(orcamentoId).value || 15, 3, 40), distanciaInicial: $(distanciaId).value };
  for (const c of CHAVES) o[c.id] = $(`${prefixo}-${c.id}`).checked;
  return o;
}

const clamp = (n, a, b) => Math.max(a, Math.min(b, Math.round(n)));

/* ------------------------------------------------------------------------ */
/* Montagem                                                                 */
/* ------------------------------------------------------------------------ */

const APRIM_COMBATE = ['ataqueCorporal', 'arremesso', 'manipulacaoDePeso', 'agilidade', 'precisao', 'reflexo', 'resistencia', 'saude'];
const LIVRE_CAMPOS = [
  ...Object.keys(ATRIBUTOS).map((id) => ({ id, nome: ATRIBUTOS[id].nome, dica: slug(ATRIBUTOS[id].nome), grupo: 'Atributos' })),
  ...APRIM_COMBATE.map((id) => ({ id, nome: APRIMORAMENTOS[id].nome, dica: APRIMORAMENTOS[id].manual ?? slug(APRIMORAMENTOS[id].nome), grupo: 'Aprimoramentos', pai: APRIMORAMENTOS[id].atributo })),
  { id: 'magiaAtaqueFisico', nome: 'Mágicas de Ataque Físico', dica: 'magicas-de-ataque-fisico', grupo: 'Perícias Mágicas' },
  { id: 'magiaAtaqueMental', nome: 'Mágicas de Ataque Mental', dica: 'magicas-de-ataque-mental', grupo: 'Perícias Mágicas' },
];
const EQUIP = [
  { id: 'arma', nome: 'Arma', dica: 'armas' },
  { id: 'armadura', nome: 'Armadura', dica: 'limitacao-para-equipamentos' },
  { id: 'escudo', nome: 'Escudo', dica: 'limitacao-para-equipamentos' },
];

const lados = [
  { build: 'guerreiro', livre: { niveis: { forca: 2, ataqueCorporal: 2, destreza: 2, agilidade: 2, fisico: 2, resistencia: 1, saude: 1 }, equipamento: { arma: 1, armadura: 1 } } },
  { build: 'mistico', livre: { niveis: { sabedoria: 2, vontade: 2, magiaAtaqueMental: 2, fe: 2, destreza: 1, reflexo: 1, fisico: 1, saude: 1 }, equipamento: {} } },
];

/** Ficha do lado `i` com o orçamento atual e os erros (só na montagem livre). */
function fichaDoLado(i) {
  const orcamento = clamp(+$('orcamento').value || 15, 3, 40);
  const l = lados[i];
  if (l.build !== 'livre') return { ficha: arena.montarBuild(l.build, orcamento), problemas: [] };
  return arena.montarLivre({ nome: i === 0 ? 'Lutador livre A' : 'Lutador livre B', ...l.livre, orcamento });
}

const STATS = [
  ['ataqueCurta', 'Ataque curto', 'ataque-a-curta-distancia'],
  ['ataqueLonga', 'Ataque longo', 'ataque-a-longa-distancia'],
  ['defesa', 'Defesa', 'defesa'],
  ['defesaMental', 'Defesa mental', 'magicas-de-ataque-mental'],
  ['vida', 'Vida', 'pontos-de-vida'],
  ['magia', 'PM', 'pontos-de-magia'],
  ['sanidade', 'Sanidade', 'sanidade'],
  ['magiaFisica', 'Mágica física', 'magicas-de-ataque-fisico'],
  ['magiaMental', 'Mágica mental', 'magicas-de-ataque-mental'],
];

function resumoFicha(ficha) {
  const p = arena.perfil(ficha);
  const equip = ficha.equipamentos.map((e) => e.nome).join(', ') || 'nenhum';
  return `
    <dl class="stats">${STATS.filter(([k]) => p[k] > 0 || ['defesa', 'vida', 'sanidade'].includes(k))
      .map(([k, nome, dica]) => `<div><dt>${termo(nome, dica)}</dt><dd>${p[k]}</dd></div>`).join('')}</dl>
    <p class="equip">${termo('Equipamento', 'limitacao-para-equipamentos')}: ${esc(equip)} <small>(limite ${limiteEquipamento(ficha)} = Força + Manipulação de Peso)</small></p>`;
}

function desenharLado(i) {
  const l = lados[i];
  const el = $(`lado-${i}`);
  const opcoes = Object.entries(arena.BUILDS)
    .map(([id, b]) => `<option value="${id}" ${l.build === id ? 'selected' : ''}>${esc(b.nome)}</option>`)
    .join('');
  const { ficha, problemas } = fichaDoLado(i);
  const orc = clamp(+$('orcamento').value || 15, 3, 40);
  let corpo = '';
  if (l.build === 'livre') {
    const grupos = [...new Set(LIVRE_CAMPOS.map((c) => c.grupo))];
    corpo = grupos.map((g) => `
      <fieldset><legend>${esc(g)}</legend>
        ${LIVRE_CAMPOS.filter((c) => c.grupo === g).map((c) => `
          <label class="campo${problemas.some((p) => p.ref === c.id) ? ' erro' : ''}">${termo(c.nome, c.dica)}
            <input type="number" min="0" max="9" inputmode="numeric" data-lado="${i}" data-nivel="${c.id}" value="${l.livre.niveis[c.id] ?? 0}">
          </label>`).join('')}
      </fieldset>`).join('') + `
      <fieldset><legend>Equipamento (modificador)</legend>
        ${EQUIP.map((c) => `
          <label class="campo">${termo(c.nome, c.dica)}
            <input type="number" min="0" max="9" inputmode="numeric" data-lado="${i}" data-equip="${c.id}" value="${l.livre.equipamento[c.id] ?? 0}">
          </label>`).join('')}
      </fieldset>
      <p class="gasto">Gastos: <b>${pontosGastos(ficha).total}</b> de ${orc} Pontos de Evolução</p>
      ${problemas.length ? `<ul class="erros">${problemas.map((p) => `<li>${esc(p.mensagem)}</li>`).join('')}</ul>` : ''}`;
  } else {
    corpo = `<p class="sub">${esc(arena.BUILDS[l.build].resumo)}</p>`;
  }
  el.innerHTML = `
    <h2>${i === 0 ? 'Lado A' : 'Lado B'} <small class="quem">${quemJoga(i)}</small></h2>
    <label class="escolha">Build
      <select data-build="${i}">${opcoes}<option value="livre" ${l.build === 'livre' ? 'selected' : ''}>Montagem livre</option></select>
    </label>
    ${corpo}
    ${resumoFicha(ficha)}`;
  atualizarAviso();
  aposRender();
}

function quemJoga(i) {
  if (i === 0) return 'você';
  return $('modo').value === 'ia' ? 'IA' : 'jogador 2';
}

function atualizarAviso() {
  const erros = [0, 1].filter((i) => fichaDoLado(i).problemas.length);
  $('lutar').disabled = erros.length > 0;
  $('aviso-montagem').textContent = erros.length ? `Corrija a montagem livre do ${erros.map((i) => (i ? 'lado B' : 'lado A')).join(' e ')}.` : '';
}

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset.build) {
    lados[+t.dataset.build].build = t.value;
    desenharLado(+t.dataset.build);
  } else if (t.id === 'orcamento' || t.id === 'modo') {
    desenharLado(0);
    desenharLado(1);
  }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (!t.dataset.lado) return;
  const i = +t.dataset.lado;
  const v = clamp(+t.value || 0, 0, 9);
  if (t.dataset.nivel) lados[i].livre.niveis[t.dataset.nivel] = v;
  if (t.dataset.equip) lados[i].livre.equipamento[t.dataset.equip] = v;
  // Redesenha sem perder o foco do campo.
  const foco = t.dataset.nivel ? `[data-lado="${i}"][data-nivel="${t.dataset.nivel}"]` : `[data-lado="${i}"][data-equip="${t.dataset.equip}"]`;
  desenharLado(i);
  const novo = document.querySelector(foco);
  if (novo) {
    novo.focus();
    try { novo.setSelectionRange(novo.value.length, novo.value.length); } catch { /* number não aceita */ }
  }
});

/* ------------------------------------------------------------------------ */
/* Duelo                                                                    */
/* ------------------------------------------------------------------------ */

let estado = null;
let modoIA = true;
let pensando = false;

$('lutar').addEventListener('click', () => {
  const fa = fichaDoLado(0).ficha;
  const fb = fichaDoLado(1).ficha;
  if (fa.nome === fb.nome) fb.nome = `${fb.nome} (B)`;
  modoIA = $('modo').value === 'ia';
  estado = arena.criarDuelo(fa, fb, { opcoes: lerOpcoes('d', 'orcamento', 'distancia') });
  $('montagem').hidden = true;
  $('duelo').hidden = false;
  desenharDuelo();
  window.scrollTo({ top: 0 });
  proximo();
});

function barra(atual, max, classe, nome, dica) {
  const r = max > 0 ? Math.max(0, atual) / max : 0;
  return `
    <div class="barra ${classe}">
      <div class="barra-rotulo">${termo(nome, dica)} <b>${Math.max(0, atual)}</b>/${max}</div>
      <div class="barra-trilho"><div class="barra-cheio" style="width:${Math.round(r * 100)}%"></div></div>
    </div>`;
}

function desenharDuelo() {
  const vez = estado.fim ? null : arena.daVez(estado);
  $('placar').innerHTML = estado.lutadores.map((l, i) => `
    <div class="cartao lutador ${vez === i ? 'davez' : ''} ${estado.fim?.vencedor === i ? 'venceu' : ''}">
      <h2>${esc(l.nome)} <small class="quem">${i === 0 ? (modoIA ? 'você' : 'jogador 1') : (modoIA ? 'IA' : 'jogador 2')}</small></h2>
      ${barra(l.vida, l.p.vida, 'vida', 'Vida', 'pontos-de-vida')}
      ${l.p.magia ? barra(l.pm, l.p.magia, 'pm', 'PM', 'pontos-de-magia') : ''}
      ${barra(l.san, l.p.sanidade, 'san', 'Sanidade', 'sanidade')}
      <p class="estados">${l.defendendo ? '<span class="selo">defendendo +' + estado.opcoes.bonusDefender + '</span>' : ''}${l.perdeAcao ? '<span class="selo ruim">perde a próxima ação</span>' : ''}</p>
    </div>`).join('');

  $('faixa').innerHTML = `
    <span>Rodada <b>${Math.min(estado.rodada, estado.opcoes.limiteRodadas)}</b></span>
    <span class="distancia ${estado.distancia}">Distância ${termo(estado.distancia, estado.distancia === 'curta' ? 'ataque-a-curta-distancia' : 'ataque-a-longa-distancia')}</span>`;

  const c = $('comandos');
  if (estado.fim) {
    c.innerHTML = `
      <p class="fim">${esc(estado.fim.texto)}</p>
      <div class="botoes">
        <button class="primario" id="revanche">Revanche</button>
        <button id="trocar">Trocar builds</button>
      </div>`;
    $('revanche').onclick = () => $('lutar').click();
    $('trocar').onclick = voltar;
  } else {
    const humano = !(modoIA && vez === 1);
    const l = estado.lutadores[vez];
    const acoes = arena.acoesDisponiveis(estado, vez);
    c.innerHTML = `
      <p class="vez">Vez de <b>${esc(l.nome)}</b>${humano ? ': escolha a ação.' : ' (IA pensando…)'}</p>
      <div class="botoes acoes">
        ${acoes.map((a) => `
          <button data-acao="${a.id}" ${!humano || !a.disponivel || pensando ? 'disabled' : ''} title="${esc(a.motivo ?? '')}">
            ${esc(a.nome)}${a.disponivel ? previa(a.id, vez) : `<small>${esc(a.motivo)}</small>`}
          </button>`).join('')}
      </div>
      <p class="sub"><button class="link" id="desistir">Encerrar duelo</button></p>`;
    c.querySelectorAll('[data-acao]').forEach((b) => { b.onclick = () => agir(b.dataset.acao); });
    $('desistir').onclick = voltar;
  }

  $('registro').innerHTML = [...estado.log].reverse().map(entradaHTML).join('');
  aposRender();
}

/** Chance de acerto e dano médio, para ajudar quem joga (e ensinar a conta). */
function previa(acao, i) {
  if (!['curta', 'longa', 'magiaFisica', 'magiaMental'].includes(acao)) return '';
  const a = estado.lutadores[i];
  const d = estado.lutadores[1 - i];
  const bonus = d.defendendo ? estado.opcoes.bonusDefender : 0;
  let n;
  if (acao === 'magiaMental') n = { ataque: Math.min(a.p.magiaMental, a.pm), defesa: d.p.defesaMental, bonus };
  else {
    const reducao = d.p.armadura + d.p.escudo + (estado.opcoes.resistenciaReduzDano ? d.p.resistencia : 0);
    const ataque = acao === 'curta' ? a.p.ataqueCurta : acao === 'longa' ? a.p.ataqueLonga : Math.min(a.p.magiaFisica, a.pm);
    n = { ataque, defesa: d.p.defesa, bonus, arma: acao.startsWith('magia') ? 0 : a.p.arma, reducao };
  }
  const e = arena.expectativa(n);
  return `<small>${pct(e.chance)} de acerto · ${e.media.toFixed(1)} de dano médio</small>`;
}

function entradaHTML(e) {
  const lado = e.ator === 0 ? 'a' : 'b';
  return `
    <li class="entrada lado-${lado}">
      <div class="entrada-topo"><span class="rod">${e.rodada ? `R${e.rodada}` : 'Início'}</span> <b>${termo(e.titulo, e.dica)}</b> — ${esc(e.resumo)}</div>
      ${e.linhas.length ? `<dl class="conta">${e.linhas.map((l) => `<div><dt>${termo(l.rotulo, l.dica)}</dt><dd>${esc(l.valor)}</dd></div>`).join('')}</dl>` : ''}
      ${e.nota ? `<p class="nota">${esc(e.nota)}</p>` : ''}
    </li>`;
}

function agir(acao) {
  if (pensando || estado.fim) return;
  arena.executar(estado, acao);
  desenharDuelo();
  proximo();
}

async function proximo() {
  if (!estado || estado.fim || !modoIA || arena.daVez(estado) !== 1) return;
  pensando = true;
  desenharDuelo();
  await espera(700);
  pensando = false;
  if (!estado || estado.fim) return;
  arena.executar(estado, arena.escolherIA(estado, 1));
  desenharDuelo();
  proximo();
}

function voltar() {
  estado = null;
  pensando = false;
  $('duelo').hidden = true;
  $('montagem').hidden = false;
  desenharLado(0);
  desenharLado(1);
}

/* ------------------------------------------------------------------------ */
/* Simulador                                                                */
/* ------------------------------------------------------------------------ */

const VARIANTES = [
  { nome: 'Texto atual', opcoes: {} },
  { nome: 'Resistência só na Defesa', opcoes: { resistenciaReduzDano: false } },
  { nome: 'Críticos sem efeito', opcoes: { criticos: false } },
  { nome: 'Sanidade a zero não derruba', opcoes: { sanidadeDerruba: false } },
];

function corTaxa(t) {
  // 50% neutro; mais vitória puxa para o verde, menos para o vermelho.
  const d = Math.max(-1, Math.min(1, (t - 0.5) * 2));
  return d >= 0 ? `color-mix(in srgb, var(--ok) ${Math.round(d * 55)}%, transparent)` : `color-mix(in srgb, var(--erro) ${Math.round(-d * 55)}%, transparent)`;
}

function tabelaGeral(r) {
  const linhas = r.ids.map((id) => {
    const g = r.geral[id];
    const dur = r.ids.filter((b) => b !== id).map((b) => (r.confrontos[`${id}|${b}`] ?? r.confrontos[`${b}|${id}`]).rodadas);
    const media = dur.reduce((s, x) => s + x, 0) / dur.length;
    return { id, g, media };
  }).sort((a, b) => b.g.taxa - a.g.taxa);
  return `
    <table class="tabela">
      <thead><tr><th>Build</th><th>Vitórias</th><th>Derrotas</th><th>Empates</th><th>Rodadas (média)</th></tr></thead>
      <tbody>${linhas.map(({ id, g, media }) => `
        <tr><th>${esc(arena.BUILDS[id].nome)}</th>
          <td style="background:${corTaxa(g.taxa)}"><b>${pct(g.taxa)}</b></td>
          <td>${pct(g.derrotas / g.duelos)}</td><td>${pct(g.empates / g.duelos)}</td><td>${media.toFixed(1)}</td></tr>`).join('')}
      </tbody>
    </table>`;
}

function matriz(r) {
  const curto = (id) => esc(arena.BUILDS[id].nome.split(' ')[0]);
  return `
    <table class="tabela matriz">
      <thead><tr><th>Linha vence coluna</th>${r.ids.map((b) => `<th>${curto(b)}</th>`).join('')}</tr></thead>
      <tbody>${r.ids.map((a) => `
        <tr><th>${curto(a)}</th>${r.ids.map((b) => {
          const c = r.confrontos[`${a}|${b}`] ?? r.confrontos[`${b}|${a}`];
          const t = arena.taxa(r, a, b);
          const emp = c.empates / c.n;
          const san = c.porSanidade / c.n;
          return `<td style="background:${corTaxa(t)}" title="${c.rodadas.toFixed(1)} rodadas em média">${pct(t)}${emp >= 0.05 ? `<small>${pct(emp)} empate</small>` : ''}${san >= 0.05 && a !== b ? `<small>${pct(san)} por Sanidade</small>` : ''}</td>`;
        }).join('')}</tr>`).join('')}
      </tbody>
    </table>`;
}

function opcoesSim() {
  return lerOpcoes('s', 'sim-orcamento', 'sim-distancia');
}

function travar(sim) {
  $('sim-rodar').disabled = sim;
  $('sim-variantes').disabled = sim;
}

$('sim-rodar').addEventListener('click', async () => {
  travar(true);
  $('sim-estado').textContent = 'Rodando…';
  await espera(30);
  const n = +$('sim-n').value;
  const t0 = performance.now();
  const r = arena.simular({ n, opcoes: opcoesSim(), rng: arena.semente(+$('sim-semente').value || 1) });
  const total = Object.values(r.confrontos).reduce((s, c) => s + c.n, 0);
  $('sim-estado').textContent = `${total.toLocaleString('pt-BR')} duelos em ${((performance.now() - t0) / 1000).toFixed(1)} s.`;
  $('sim-saida').innerHTML = `
    <div class="cartao"><h2>Taxa de vitória geral</h2><p class="sub">Contra todas as outras builds, sem contar o espelho.</p><div class="rolagem">${tabelaGeral(r)}</div></div>
    <div class="cartao"><h2>Confronto a confronto</h2><p class="sub">Quanto a build da linha vence a da coluna. Empates são duelos que chegaram a ${r.opcoes.limiteRodadas} rodadas.</p><div class="rolagem">${matriz(r)}</div></div>`;
  travar(false);
  aposRender();
});

$('sim-variantes').addEventListener('click', async () => {
  travar(true);
  const n = +$('sim-n').value;
  const base = { orcamento: opcoesSim().orcamento, distanciaInicial: opcoesSim().distanciaInicial };
  const resultados = [];
  for (const [k, v] of VARIANTES.entries()) {
    $('sim-estado').textContent = `Variante ${k + 1} de ${VARIANTES.length}…`;
    await espera(30);
    resultados.push(arena.simular({ n, opcoes: { ...arena.OPCOES_PADRAO, ...base, ...v.opcoes }, rng: arena.semente(+$('sim-semente').value || 1) }));
  }
  const ids = resultados[0].ids;
  const empates = (r) => Object.values(r.confrontos).filter((c) => c.a !== c.b).reduce((s, c) => s + c.empates, 0) / Object.values(r.confrontos).filter((c) => c.a !== c.b).reduce((s, c) => s + c.n, 0);
  const duracao = (r) => { const cs = Object.values(r.confrontos).filter((c) => c.a !== c.b); return cs.reduce((s, c) => s + c.rodadas, 0) / cs.length; };
  $('sim-estado').textContent = 'Pronto.';
  $('sim-saida').innerHTML = `
    <div class="cartao"><h2>Variantes de regra</h2>
      <p class="sub">Taxa de vitória geral de cada build em cada variante (mesma semente). As outras opções seguem o padrão.</p>
      <div class="rolagem"><table class="tabela">
        <thead><tr><th>Build</th>${VARIANTES.map((v) => `<th>${esc(v.nome)}</th>`).join('')}</tr></thead>
        <tbody>
          ${ids.map((id) => `<tr><th>${esc(arena.BUILDS[id].nome)}</th>${resultados.map((r) => `<td style="background:${corTaxa(r.geral[id].taxa)}">${pct(r.geral[id].taxa)}</td>`).join('')}</tr>`).join('')}
          <tr class="resumo"><th>Empates</th>${resultados.map((r) => `<td>${pct(empates(r))}</td>`).join('')}</tr>
          <tr class="resumo"><th>Rodadas (média)</th>${resultados.map((r) => `<td>${duracao(r).toFixed(1)}</td>`).join('')}</tr>
        </tbody>
      </table></div>
    </div>`;
  travar(false);
});

/* ------------------------------------------------------------------------ */
/* Abas e início                                                            */
/* ------------------------------------------------------------------------ */

function abrirAba(qual) {
  const sim = qual === 'sim';
  $('aba-duelo').setAttribute('aria-selected', String(!sim));
  $('aba-sim').setAttribute('aria-selected', String(sim));
  $('painel-duelo').hidden = sim;
  $('painel-sim').hidden = !sim;
  try { localStorage.setItem('clip-arena-aba', qual); } catch { /* sem armazenamento */ }
}
$('aba-duelo').onclick = () => abrirAba('duelo');
$('aba-sim').onclick = () => abrirAba('sim');

desenharChaves($('chaves-duelo'), 'd');
desenharChaves($('chaves-sim'), 's');
desenharLado(0);
desenharLado(1);
try { if (localStorage.getItem('clip-arena-aba') === 'sim' || location.hash === '#simulador') abrirAba('sim'); } catch { /* idem */ }
