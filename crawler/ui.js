/**
 * Interface do Desvario: desenha o que o personagem percebe e liga teclado e
 * toque às ações. A lógica fica em `jogo.js`; aqui só há tela.
 */
import * as J from './jogo.js';
import { TEMAS, LISTA_TEMAS } from './temas.js';
import { sementeNova, hash } from './rng.js';
import { T, primeiroPasso, distancia } from './mapa.js';
import { TAM, sprite, icone, desenharTile, desenharObjeto, desenharBuraco, desenharPerturbador, COR_CAMINHO } from './sprites.js';
import { VERSAO_DESVARIO } from './versao.js';

const $ = (id) => document.getElementById(id);
const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
const criarCanvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

/* Diário: o que se leva entre tentativas (só neste navegador) ------------- */

const CHAVE = 'clip-desvario-diario';
function lerDiario() {
  try {
    const d = JSON.parse(localStorage.getItem(CHAVE) ?? 'null');
    if (d && typeof d === 'object') return { pistas: [], partidas: [], quedas: {}, ...d };
  } catch { /* sem armazenamento: tudo bem */ }
  return { pistas: [], partidas: [], quedas: {} };
}
function gravarDiario(d) {
  try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch { /* idem */ }
}
let diario = lerDiario();

/* Estado da interface ----------------------------------------------------- */

let e = null;
let alvoId = null;
let depurar = params.get('depurar') === '1';
let escolhaTema = LISTA_TEMAS.includes(params.get('tema')) ? params.get('tema') : 'sanatorio';
let escolhaOrigem = ['corpo', 'mente', 'espirito'].includes(params.get('origem')) ? params.get('origem') : 'corpo';
let lampejo = { cor: null, ate: 0 };
let pistasAntes = [];

/* Abertura ---------------------------------------------------------------- */

function miniatura(nome, cores, fundo = '#14110d') {
  const c = criarCanvas(TAM + 2, TAM + 2);
  const ctx = c.getContext('2d');
  ctx.fillStyle = fundo;
  ctx.fillRect(0, 0, TAM + 2, TAM + 2);
  ctx.drawImage(sprite(criarCanvas, nome, cores), 1, 1);
  return c;
}

function montarInicio() {
  const temas = $('temas');
  temas.replaceChildren(...LISTA_TEMAS.map((id) => {
    const th = TEMAS[id];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'escolha';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(id === escolhaTema));
    const m = th.monstros[1];
    b.append(miniatura(m.sprite, m.cores, th.paleta.chao2));
    b.insertAdjacentHTML('beforeend', `<b>${th.nome}</b><span>${th.abertura}</span>`);
    b.onclick = () => { escolhaTema = id; montarInicio(); };
    return b;
  }));
  const origens = $('origens');
  origens.replaceChildren(...['corpo', 'mente', 'espirito'].map((id) => {
    const o = TEMAS[escolhaTema].origens[id];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `escolha c-${id}`;
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(id === escolhaOrigem));
    b.append(miniatura('heroi', COR_CAMINHO[id]));
    const caminho = { corpo: 'Corpo', mente: 'Mente', espirito: 'Espírito' }[id];
    b.insertAdjacentHTML('beforeend', `<b>${o.nome} · ${caminho}</b><span>${o.texto} ${J.ORIGENS[id].resumo}</span>`);
    b.onclick = () => { escolhaOrigem = id; montarInicio(); };
    return b;
  }));
  if (!$('semente').value) $('semente').value = params.get('semente') ?? sementeNova(Date.now());
  montarComo();
  montarDiario();
}

function montarComo() {
  $('como').innerHTML = `
    <p>Chegue à saída do quinto andar. Ninguém conta seus pontos: o estado aparece em palavras e na imagem. <b>As palavras podem mentir; a imagem não.</b></p>
    <table>
      <tr><th>O que está ruim</th><th>Como aparece</th><th>O que muda no jogo</th></tr>
      <tr><td><b>Corpo</b> (Vida)</td><td>Pulso vermelho nas bordas; gotas de sangue no chão</td><td>Você arrasta a perna (passos custam dois turnos), as mãos tremem e as bestas seguem o seu rastro.</td></tr>
      <tr><td><b>Consciência</b> (atenção)</td><td>A vista escurece, a imagem dobra e os olhos piscam devagar</td><td>Você enxerga menos. O espaço mente: portas pintadas na parede, buracos que não existem, corredores sem fim, vultos e miragens. Em zero, você desmaia. Descanse quieto, sem nada à vista, para voltar.</td></tr>
      <tr><td><b>Cabeça</b> (Sanidade)</td><td>A cor desbota, aparece grão e as cores se separam</td><td>Mente sobre quem e o que as coisas são: aliado com cara de monstro e o contrário, itens que parecem bichos parados, sussurros. As palavras do painel também mentem. Em zero, você perde o controle.</td></tr>
    </table>
    <p><b>O fio.</b> Cada andar tem um fio que queima (a linha na base da tela). Quando acaba, a ronda chega pela porta por onde você entrou: não cai, não se cansa, só dá para fugir dela ou atrasá-la. E a cabeça pesa o dobro. Quem prepara um golpe pesado avisa um turno antes (<b>!</b> vermelho): saia de perto, defenda ou empurre. Janelas mostram o que passa lá fora; quando algo bate, segure a janela (ande contra ela) antes de o vidro ceder.</p>
    <p><b>Nem todo mundo é inimigo.</b> Enfermeiros, guardas, carcereiros e saqueadores comuns só vigiam: não vêm atrás de você, mas não gostam de você por perto. Bater em quem só vigia põe o andar inteiro contra você e pesa na cabeça; matar gente pesa para todos, até para o Corpo. Com Percepção alta você vê quem só vigia (moldura amarela); sem ela, olhe de novo ou fale. Encarar gente de bem gera antipatia: aliados se fecham, vigias vêm tirar satisfação.</p>
    <p><b>A verdade compensa.</b> Desfazer uma mentira (olhar de novo, falar, encarar o que é falso) devolve um pouco de clareza à cabeça. Acreditar numa mentira (pegar item que não existe, segurar janela onde ninguém bate, empurrar porta pintada) sempre cobra. A Fé segura os sustos; a Percepção nota sozinha o que está errado.</p>
    <p><b>O caminho.</b> Nos andares 2, 3 e 4 há uma peça do caminho. Cada uma devolve fio e mostra a saída do andar. Com as três, você sai inteiro; sem elas, também dá para sair, mas o fim é outro.</p>
    <p>Fotografias, cartas e corpos fazem mal de olhar, mas mostram coisas: o caminho, um item, algo em que se agarrar. Pisar em cima examina.</p>
    <table>
      <tr><th>Ação</th><th>Quem faz bem</th><th>O que faz</th></tr>
      <tr><td>Andar contra algo</td><td>Todos</td><td>Bate no que parece hostil; conversa com o que parece aliado. É a aparência que decide, então cuidado.</td></tr>
      <tr><td>Olhar de novo <kbd>X</kbd></td><td>Mente (Percepção, Sabedoria)</td><td>Teste contra a sua lucidez. Desfaz vultos e miragens e mostra o que um disfarce esconde. O Corpo insiste e paga com Vida.</td></tr>
      <tr><td>Falar <kbd>T</kbd></td><td>Espírito (Presença)</td><td>Convence gente a ir embora. Com um aliado, ganha ajuda. Falar antes de bater desmascara aliados com cara de monstro.</td></tr>
      <tr><td>Encarar <kbd>E</kbd></td><td>Espírito (Vontade, Fé)</td><td>Espanta bestas, desfaz assombros e vultos. Falhar abala.</td></tr>
      <tr><td>${TEMAS[escolhaTema].dom.botao} <kbd>F</kbd></td><td>Mente (regra: Mágicas de Ataque Físico)</td><td>${TEMAS[escolhaTema].dom.nome}. ${TEMAS[escolhaTema].dom.descricao}</td></tr>
      <tr><td>${TEMAS[escolhaTema].ancora.acao} <kbd>Q</kbd></td><td>Espírito (Vontade, Fé)</td><td>${TEMAS[escolhaTema].ancora.descricao} O painel diz quantas vezes ainda dá neste andar; fotografias e altares dão mais. Os itens de lembrança na bolsa fazem o mesmo sem teste.</td></tr>
      <tr><td>Defender <kbd>Z</kbd></td><td>Corpo</td><td>Guarda alta por um turno. Contra golpe preparado, vale mais. Se o golpe errar, você devolve na hora.</td></tr>
      <tr><td>Empurrar <kbd>G</kbd></td><td>Corpo (Força)</td><td>Tira de perto e deixa tonto; contra a parede, mais tonto. Perto de um buraco de verdade, derruba de vez. Única coisa que segura a ronda, além de encarar.</td></tr>
      <tr><td>Fechar porta <kbd>C</kbd></td><td>Todos</td><td>Bichos não abrem porta; gente e a ronda abrem.</td></tr>
      <tr><td>Esperar <kbd>Espaço</kbd></td><td>Todos</td><td>Sem monstro à vista, é descanso: a atenção volta devagar. O tempo continua pesando na cabeça.</td></tr>
      <tr><td>Pular</td><td>Todos</td><td>Andar duas vezes contra um buraco. O de verdade leva ao andar de baixo, com tombo; o falso só derruba você de joelhos.</td></tr>
    </table>
    <p>Atacar um aliado tem consequência: ele grita, foge e não ajuda mais, e a culpa pesa. Matar gente também pesa. Sem Sanidade, você perde o controle por alguns turnos e volta com uma cicatriz; três vezes e não volta mais.</p>
    <p>Existem sinais que não mudam e que um olho atento aprende a ler. O diário guarda os que você descobrir.</p>
    <p class="nota">Depuração (mostra os números e a verdade): tecla <kbd>\`</kbd> ou <code>?depurar=1</code> na URL.</p>`;
}

function montarDiario() {
  const d = diario;
  const pistas = Object.entries(J.PISTAS);
  const sabidas = pistas.filter(([id]) => d.pistas.includes(id));
  const ultimas = d.partidas.slice(-8).reverse();
  const res = { fuga: 'saiu', morte: 'caiu', loucura: 'perdeu-se', desistiu: 'desistiu' };
  $('diario').innerHTML = `
    <h2>Diário</h2>
    <p class="nota">O que você aprendeu fica aqui entre as tentativas, só neste navegador. Não deixa ninguém mais forte; deixa mais atento.</p>
    <h3>Coisas que você reparou (${sabidas.length} de ${pistas.length})</h3>
    ${sabidas.length ? `<ul>${sabidas.map(([, t]) => `<li>${t}</li>`).join('')}</ul>` : '<p class="nota">Nada ainda. Jogue e preste atenção no que se desfaz.</p>'}
    ${ultimas.length ? `<h3>Últimas tentativas</h3><table><tr><th>Semente</th><th>Onde</th><th>Quem</th><th>Fim</th></tr>
      ${ultimas.map((p) => `<tr><td><button type="button" class="link" data-semente="${p.semente}" data-tema="${p.tema}" data-origem="${p.origem}">${p.semente}</button></td><td>${TEMAS[p.tema]?.curto ?? p.tema}, andar ${p.andar}</td><td>${TEMAS[p.tema]?.origens[p.origem]?.nome ?? p.origem}</td><td>${res[p.resultado] ?? p.resultado}</td></tr>`).join('')}</table>` : ''}`;
  for (const b of $('diario').querySelectorAll('[data-semente]')) {
    b.onclick = () => { $('semente').value = b.dataset.semente; escolhaTema = b.dataset.tema; escolhaOrigem = b.dataset.origem; montarInicio(); };
  }
}

/* Começar ----------------------------------------------------------------- */

function comecar(semente = $('semente').value.trim() || sementeNova(Date.now())) {
  e = J.novaPartida({ semente, tema: escolhaTema, origem: escolhaOrigem, depurar });
  pistasAntes = [...diario.pistas];
  alvoId = null;
  palavrasAntes = null;
  $('inicio').hidden = true;
  $('fim').hidden = true;
  $('partida').hidden = false;
  $('desistir').hidden = false;
  const url = new URL(location.href);
  url.searchParams.set('semente', semente);
  url.searchParams.set('tema', escolhaTema);
  url.searchParams.set('origem', escolhaOrigem);
  history.replaceState(null, '', url);
  montarControles();
  redimensionar();
  atualizar();
  if (window.innerWidth < 860) $('palco').scrollIntoView({ block: 'start', behavior: 'auto' });
  $('tela').focus?.();
}

/* Ações ------------------------------------------------------------------- */

function fazer(acao) {
  if (!e || e.fim) return;
  if (e.escolha && acao.tipo !== 'escolher') return;
  J.agir(e, acao);
  anotarMudancas(J.percebido(e));
  for (const f of e.efeitos) {
    const cor = { golpe: 'rgba(180,20,20,', mente: 'rgba(120,60,170,', surto: 'rgba(230,230,230,', magia: TEMAS[e.tema].dom.cor, desmaio: 'rgba(0,0,0,' }[f.tipo];
    if (cor) lampejo = { cor, ate: performance.now() + (f.tipo === 'surto' || f.tipo === 'desmaio' ? 450 : 170) };
  }
  atualizar();
}

function alvos(p) {
  const eu = p.jogador;
  const lista = [
    ...p.entidades.map((x) => ({ ...x, tipoAlvo: 'entidade' })),
    ...p.objetos.filter((o) => o.visivel).map((o) => ({ ...o, tipoAlvo: 'objeto' })),
  ];
  return lista.map((x) => ({ ...x, d: distancia(x, eu) })).sort((a, b) => (a.tipoAlvo === b.tipoAlvo ? a.d - b.d : a.tipoAlvo === 'entidade' ? -1 : 1));
}

function alvoAtual(p) {
  const lista = alvos(p);
  let a = lista.find((x) => x.id === alvoId);
  if (!a) {
    a = lista.find((x) => x.tipoAlvo === 'entidade' && x.categoria === 'hostil') ?? lista.find((x) => x.tipoAlvo === 'entidade') ?? null;
    alvoId = a?.id ?? null;
  }
  return a;
}

function trocarAlvo() {
  const p = J.percebido(e);
  const lista = alvos(p);
  if (!lista.length) return;
  const i = lista.findIndex((x) => x.id === alvoId);
  alvoId = lista[(i + 1) % lista.length].id;
  atualizar();
}

function acaoNoAlvo(tipo) {
  const p = J.percebido(e);
  const a = alvoAtual(p);
  if (!a) { avisar('Sem alvo à vista.'); return; }
  fazer({ tipo, alvo: a.id });
}

function avisar(texto) {
  e.log.push({ texto, tipo: 'info', turno: e.turno });
  atualizar();
}

/* Controles --------------------------------------------------------------- */

const DIRECOES = [[-1, -1, '↖'], [0, -1, '↑'], [1, -1, '↗'], [-1, 0, '←'], [0, 0, '·'], [1, 0, '→'], [-1, 1, '↙'], [0, 1, '↓'], [1, 1, '↘']];

function montarControles() {
  $('cruz').replaceChildren(...DIRECOES.map(([dx, dy, s]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = s;
    b.setAttribute('aria-label', dx || dy ? `Andar ${s}` : 'Esperar');
    b.onclick = () => fazer(dx || dy ? { tipo: 'mover', dx, dy } : { tipo: 'esperar' });
    return b;
  }));
}

function botao(rotulo, dica, onclick, desligado = false) {
  const b = document.createElement('button');
  b.type = 'button';
  b.innerHTML = `${rotulo}<small>${dica}</small>`;
  b.disabled = desligado;
  b.onclick = onclick;
  return b;
}

const teclas = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
  k: [0, -1], j: [0, 1], h: [-1, 0], l: [1, 0], y: [-1, -1], u: [1, -1], b: [-1, 1], n: [1, 1],
  Home: [-1, -1], PageUp: [1, -1], End: [-1, 1], PageDown: [1, 1],
};

document.addEventListener('keydown', (ev) => {
  if (ev.target instanceof HTMLInputElement) {
    if (ev.key === 'Enter' && ev.target.id === 'semente') comecar();
    return;
  }
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
  if (ev.key === '`' || ev.key === "'") {
    depurar = !depurar;
    if (e) e.depurar = depurar;
    atualizar();
    return;
  }
  if (!e || $('partida').hidden) return;
  if (e.fim) return;
  if (e.escolha) {
    const i = Number(ev.key) - 1;
    if (i >= 0 && i < e.escolha.opcoes.length) { fazer({ tipo: 'escolher', indice: i }); ev.preventDefault(); }
    return;
  }
  const k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
  const numpad = { 1: [-1, 1], 2: [0, 1], 3: [1, 1], 4: [-1, 0], 6: [1, 0], 7: [-1, -1], 8: [0, -1], 9: [1, -1] };
  let dir = teclas[k] ?? (ev.code?.startsWith('Numpad') ? numpad[ev.code.slice(6)] : null);
  if (dir) {
    ev.preventDefault();
    fazer({ tipo: ev.shiftKey ? 'atacar' : 'mover', dx: dir[0], dy: dir[1] });
    return;
  }
  const mapa = {
    x: () => acaoNoAlvo('olhar'), t: () => acaoNoAlvo('falar'), e: () => acaoNoAlvo('encarar'), f: () => acaoNoAlvo('magia'),
    o: () => (viagem ? pararViagem() : viajar('explorar')), q: () => fazer({ tipo: 'ancorar' }),
    z: () => fazer({ tipo: 'defender' }), g: () => acaoNoAlvo('empurrar'), c: () => fazer({ tipo: 'fechar' }), ' ': () => fazer({ tipo: 'esperar' }), '.': () => fazer({ tipo: 'esperar' }), Tab: () => trocarAlvo(),
  };
  if (mapa[k]) { ev.preventDefault(); mapa[k](); return; }
  const i = Number(k) - 1;
  if (!ev.code?.startsWith('Numpad') && i >= 0 && i < 5) { ev.preventDefault(); fazer({ tipo: 'usar', indice: i }); }
});

$('tela').addEventListener('click', (ev) => {
  if (!e || e.fim || e.escolha) return;
  const c = $('tela');
  const r = c.getBoundingClientRect();
  const col = Math.floor(((ev.clientX - r.left) / r.width) * vista.cols);
  const lin = Math.floor(((ev.clientY - r.top) / r.height) * vista.rows);
  const x = col + vista.x0, y = lin + vista.y0;
  const p = J.percebido(e);
  pararViagem();
  const sel = p.entidades.find((q) => q.x === x && q.y === y) ?? p.objetos.find((q) => q.x === x && q.y === y && q.visivel);
  if (sel && alvoId !== sel.id && sel.x !== undefined && (p.entidades.includes(sel) || distancia(sel, p.jogador) > 1)) { alvoId = sel.id; atualizar(); if (p.entidades.includes(sel)) return; }
  const eu = p.jogador;
  if (x === eu.x && y === eu.y) { fazer({ tipo: 'esperar' }); return; }
  if (distancia({ x, y }, eu) === 1) { fazer({ tipo: 'mover', dx: x - eu.x, dy: y - eu.y }); return; }
  viajar({ x, y });
});

/**
 * Viagem: anda sozinho até o ponto tocado, pelo mapa que você lembra (que pode
 * mentir). Para quando algo novo aparece, quando algo acontece ou ao chegar.
 */
let viagem = null;
function viajar(destino) {
  pararViagem();
  const perto = J.percebido(e).entidades.find((q) => q.categoria === 'hostil' && !q.fugindo && distancia(q, e.jogador) <= 4);
  if (perto) { avisar(`Não dá para sair andando: ${perto.nome} está perto.`); return; }
  viagem = { destino, vistos: new Set(J.percebido(e).entidades.map((q) => q.id)), objetos: new Set(J.percebido(e).objetos.map((q) => q.id)), log: e.log.length, passos: 0 };
  const passo = () => {
    if (!viagem || !e || e.fim || e.escolha) return pararViagem();
    const p = J.percebido(e);
    const eu = p.jogador;
    const explorando = viagem.destino === 'explorar';
    if (!explorando && eu.x === viagem.destino.x && eu.y === viagem.destino.y) return pararViagem();
    const novo = p.entidades.some((q) => !viagem.vistos.has(q.id) && !q.companheiro) || (explorando && p.objetos.some((q) => q.visivel && !viagem.objetos.has(q.id)));
    const algo = e.log.slice(viagem.log).some((m) => ['dano', 'perigo', 'surto', 'golpe', 'fala', 'mentira', 'pista', 'bom', 'peca'].includes(m.tipo));
    if (viagem.passos > 0 && (novo || algo)) return pararViagem();
    const passa = (xx, yy) => [T.CHAO, T.PORTA, T.ABERTA].includes(p.tiles[yy * p.w + xx]) && !p.entidades.some((q) => q.x === xx && q.y === yy && !q.companheiro);
    const d = viagem.destino;
    const k = (xx, yy) => yy * p.w + xx;
    const borda = (xx, yy) => passa(xx, yy) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => p.tiles[k(xx + a, yy + b)] === -1 && xx + a >= 0 && yy + b >= 0 && xx + a < p.w && yy + b < p.h);
    const pp = explorando
      ? primeiroPasso(p.w, p.h, eu, passa, borda, 6000)
      : primeiroPasso(p.w, p.h, eu, passa, (xx, yy) => xx === d.x && yy === d.y, 4000);
    const turno = e.turno;
    viagem.log = e.log.length;
    if (pp) fazer({ tipo: 'mover', dx: pp.dx, dy: pp.dy });
    else if (explorando) { avisar('Nada mais a explorar por aqui, ou o caminho está bloqueado. Procure a saída do andar.'); return pararViagem(); }
    else fazer({ tipo: 'mover', dx: Math.sign(d.x - eu.x), dy: Math.sign(d.y - eu.y) });
    viagem && (viagem.passos++);
    if (!viagem || e.turno === turno || viagem.passos > 80) return pararViagem();
    viagem.timer = setTimeout(passo, movimentoReduzido.matches ? 30 : 70);
  };
  passo();
}
function pararViagem() {
  if (viagem?.timer) clearTimeout(viagem.timer);
  viagem = null;
}
document.addEventListener('keydown', (ev) => { if (ev.key.toLowerCase() !== 'o') pararViagem(); }, true);

$('comecar').onclick = () => comecar();
$('sortear').onclick = () => { $('semente').value = sementeNova(Date.now() + Math.random()); };
$('desistir').onclick = () => {
  if (!e || e.fim) return voltarAoInicio();
  if (!confirm('Desistir desta partida? Ela entra no diário como desistência.')) return;
  e.fim = { tipo: 'desistiu', andar: e.andar, turno: e.turno };
  terminar();
};
$('denovo').onclick = () => comecar(e.semente);
$('outra').onclick = () => voltarAoInicio(true);
$('copiar').onclick = async () => {
  const url = new URL(location.href);
  try { await navigator.clipboard.writeText(url.href); $('copiar').textContent = 'Link copiado'; } catch { prompt('Copie o link:', url.href); }
};

function voltarAoInicio(novaSemente = false) {
  $('fim').hidden = true;
  $('partida').hidden = true;
  $('desistir').hidden = true;
  $('inicio').hidden = false;
  if (novaSemente) $('semente').value = sementeNova(Date.now());
  diario = lerDiario();
  montarInicio();
}

/* Atualizar a tela -------------------------------------------------------- */

function atualizar() {
  if (!e) return;
  const p = J.percebido(e);
  alvoAtual(p);
  desenharEstado(p);
  desenharAlvo(p);
  desenharAcoes(p);
  desenharItens(p);
  desenharRegistro();
  $('faixa').innerHTML = `<span>${TEMAS[e.tema].curto} · ${p.nomeAndar} (${p.andar}/5)</span><span class="semente">${e.semente}</span>`;
  if (e.escolha) mostrarEvolucao(); else { $('evolucao').hidden = true; pararRelogioEscolha(); }
  if (e.fim && $('fim').hidden) setTimeout(terminar, 700);
}

function embaralharTexto(t, lv) {
  if (lv < 3) return t;
  const quadro = movimentoReduzido.matches ? 0 : Math.floor(performance.now() / 1400);
  const letras = [...t];
  const trocas = lv - 2;
  for (let i = 0; i < trocas; i++) {
    const a = hash(t + quadro + i) % letras.length;
    const b = Math.min(letras.length - 1, a + 1);
    [letras[a], letras[b]] = [letras[b], letras[a]];
  }
  return letras.join('');
}

/** Com a atenção indo embora, a palavra apaga letras, como vista que falha. */
function apagarTexto(t, lc) {
  if (lc < 3) return t;
  const quadro = movimentoReduzido.matches ? 0 : Math.floor(performance.now() / 1800);
  return [...t].map((ch, i) => (ch !== ' ' && (hash(t + i + quadro) % 7) < lc - 2 ? '·' : ch)).join('');
}

/*
 * Estado sem números: cada palavra tem uma frase curta que diz como é estar
 * assim, e cada mudança aparece como ▼ (perdeu) ou ▲ (ganhou) por alguns
 * segundos, com uma linha no registro quando a palavra muda.
 */
const ESCALAS = {
  vida: {
    nomes: ['Intacto', 'Arranhado', 'Ferido', 'Muito ferido', 'À beira do colapso', 'Caído'],
    frases: ['sem um arranhão', 'cortes que ardem', 'sangrando', 'mal se aguenta em pé', 'mais um golpe e acabou', 'no chão'],
    piora: 'Seu corpo piorou', melhora: 'Seu corpo melhorou',
  },
  consciencia: {
    nomes: ['Alerta', 'Desperto', 'Cansado', 'Zonzo', 'Apagando', 'Apagado'],
    frases: ['tudo nítido', 'atento, por enquanto', 'pálpebras pesadas', 'o chão balança', 'a vista falha', 'escuro'],
    piora: 'Sua atenção caiu', melhora: 'Sua atenção voltou',
  },
  sanidade: {
    nomes: ['Lúcido', 'Inquieto', 'Abalado', 'Perturbado', 'Por um fio', 'Fora de si'],
    frases: ['o mundo é o que é', 'algo incomoda', 'as coisas tremem', 'nem tudo o que vê é real', 'quase nada é real', 'perdido'],
    piora: 'Sua cabeça piorou', melhora: 'Sua cabeça melhorou',
  },
};
const MUDOU = { vida: 'vida', consciencia: 'cons', sanidade: 'san' };
let palavrasAntes = null;
const sinais = {}; // medida → { tipo, ate }

/** Compara com o turno anterior: setas na tela e uma linha no registro quando a palavra muda. */
function anotarMudancas(p) {
  const agora = performance.now();
  for (const [medida, chave] of Object.entries(MUDOU)) {
    const v = p.variacao?.[chave];
    if (v) sinais[medida] = { tipo: v, ate: agora + 2600 };
  }
  if (p.variacao?.pm) sinais.magia = { tipo: p.variacao.pm, ate: agora + 2600 };
  if (palavrasAntes && e.turno > 0) {
    for (const medida of Object.keys(ESCALAS)) {
      const E = ESCALAS[medida];
      const a = E.nomes.indexOf(palavrasAntes[medida]), b = E.nomes.indexOf(p.estado[medida]);
      if (a < 0 || b < 0 || a === b) continue;
      const pior = b > a;
      e.log.push({ texto: `${pior ? '▼' : '▲'} ${pior ? E.piora : E.melhora}: agora, ${p.estado[medida]} (${E.frases[b]}).`, tipo: pior ? 'dano' : 'bom', turno: e.turno });
    }
  }
  palavrasAntes = { ...p.estado };
  clearTimeout(anotarMudancas.t);
  anotarMudancas.t = setTimeout(() => { if (e && !$('partida').hidden) desenharEstado(J.percebido(e)); }, 2700);
}

function seta(medida) {
  const s = sinais[medida];
  if (!s || performance.now() > s.ate) return '';
  const perdeu = s.tipo.startsWith('perdeu');
  const muito = s.tipo.endsWith('muito');
  return ` <span class="seta ${perdeu ? 'perdeu' : 'ganhou'}" title="${perdeu ? 'piorou agora' : 'melhorou agora'}">${(perdeu ? '▼' : '▲').repeat(muito ? 2 : 1)}</span>`;
}
const frase = (medida, palavra) => {
  const i = ESCALAS[medida].nomes.indexOf(palavra);
  return i >= 0 ? `<small class="frase">${ESCALAS[medida].frases[i]}</small>` : '';
};

function desenharEstado(p) {
  const s = p.estado;
  const n = p.numeros;
  const ofego = ['', ' <small class="frase ofego">ofegante</small>', ' <small class="frase ofego">sem fôlego</small>'][p.ofegante ?? 0];
  $('estado').innerHTML = `
    <dt>Corpo</dt><dd class="${p.ferimento >= 3 ? 'ferido' : ''}">${embaralharTexto(s.vida, p.lucidez)}${seta('vida')} ${frase('vida', s.vida)}</dd>
    <dt>Consciência</dt><dd class="${p.atencao >= 3 ? 'apagando' : ''}">${apagarTexto(s.consciencia, p.atencao)}${seta('consciencia')} ${frase('consciencia', s.consciencia)}${ofego}</dd>
    <dt>Cabeça</dt><dd>${embaralharTexto(s.sanidade, p.lucidez)}${seta('sanidade')} ${frase('sanidade', s.sanidade)}</dd>
    ${s.magia ? `<dt>${TEMAS[e.tema].dom.recurso}</dt><dd title="${TEMAS[e.tema].dom.descricao}">${s.magia}${seta('magia')}</dd>` : ''}
    <dt>Espírito</dt><dd class="ancoras" title="${TEMAS[e.tema].ancora.descricao}">${TEMAS[e.tema].ancora.restam[Math.min(2, Math.max(0, p.cargasAncora))]}</dd>
    <dt>Caminho</dt><dd class="pecas" title="${p.pecas.map((x) => x ?? '?').join(' · ')}">${p.pecas.map((x) => (x ? '◆' : '◇')).join('')}</dd>
    <div class="fio-hud${p.fio <= 0 ? ' sem-fio' : p.fio < 0.25 ? ' curto' : ''}" title="O fio do andar: quando acaba, ${TEMAS[e.tema].ronda.nome.replace(/^./, (c) => c)} chega"><span style="transform: scaleX(${Math.max(0, p.fio).toFixed(3)})"></span></div>
    ${depurar && n ? `<div class="numeros">Vida ${n.vida}/${n.vidaMax} · Cons ${n.cons}/${n.consMax} · San ${n.san}/${n.sanMax} · PM ${n.pm}/${n.pmMax} · lucidez ${p.lucidez} · atenção ${p.atencao} · corpo ${p.ferimento} · turno ${n.turno}${s.mentindo ? ' · palavras mentindo' : ''}</div>` : ''}`;
}

function desenharAlvo(p) {
  const a = alvoAtual(p);
  if (p.desmaio) { $('alvo').textContent = 'Escuro. Você não está aqui.'; return; }
  if (!a) { $('alvo').textContent = p.surto ? 'Você não controla o próprio corpo.' : 'Nada à vista. Toque ou clique em algo para escolher um alvo.'; return; }
  const dist = a.d === 0 ? 'aqui' : a.d === 1 ? 'colado em você' : `a ${a.d} passos`;
  let jeito = '';
  if (a.tipoAlvo === 'entidade') {
    jeito = a.companheiro ? 'está com você' : a.categoria === 'aliado' ? 'parece um aliado' : a.categoria === 'neutro' ? 'só vigia (não bata: andar contra é conversar)' : a.fugindo ? 'está se afastando' : 'parece hostil';
    if (a.marca === 'suspeito') jeito += '; algo nele não está certo';
    if (a.marca === 'real') jeito += '; você confirmou que é real';
    if (a.preparando) jeito += '; <b>prepara um golpe pesado</b>';
    if (a.tonto) jeito += '; está tonto';
    if (a.ameaca) jeito += '; não dá para derrubar';
  } else jeito = a.confirmado ? 'é real' : '';
  const verdade = depurar && a.verdade ? ` <span class="nota">[${JSON.stringify(a.verdade)}]</span>` : '';
  $('alvo').innerHTML = `Alvo: <b>${a.nome}</b>, ${dist}${jeito ? ', ' + jeito : ''}.${verdade}`;
}

function desenharAcoes(p) {
  const a = alvoAtual(p);
  const ent = a?.tipoAlvo === 'entidade' ? a : null;
  const lista = [
    botao('Olhar de novo', 'X', () => acaoNoAlvo('olhar'), !a),
    botao('Falar', 'T', () => acaoNoAlvo('falar'), !ent || ent.d > 1),
    botao('Encarar', 'E', () => acaoNoAlvo('encarar'), !ent || ent.d > 4),
    botao(TEMAS[e.tema].ancora.acao, 'Q', () => fazer({ tipo: 'ancorar' }), p.cargasAncora <= 0),
    botao('Defender', 'Z', () => fazer({ tipo: 'defender' }), false),
    botao('Empurrar', 'G', () => acaoNoAlvo('empurrar'), !ent || ent.d !== 1),
    botao('Fechar porta', 'C', () => fazer({ tipo: 'fechar' }), false),
  ];
  if (p.temMagia) lista.splice(3, 0, botao(TEMAS[e.tema].dom.botao, 'F', () => acaoNoAlvo('magia'), !ent || ent.d > 6));
  lista.push(botao('Trocar alvo', 'Tab', trocarAlvo, false));
  lista.push(botao('Explorar', 'O', () => (viagem ? pararViagem() : viajar('explorar')), false));
  $('acoes').replaceChildren(...lista);
}

function desenharItens(p) {
  const el = $('itens');
  if (!p.inventario.length) { el.innerHTML = `<span class="vazio">Bolsa vazia. ${p.equipamento.length ? 'Na mão: ' + p.equipamento.join(', ') + '.' : ''}</span>`; return; }
  el.replaceChildren(...p.inventario.map((it, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    const ic = criarCanvas(TAM, TAM);
    ic.getContext('2d').drawImage(icone(criarCanvas, it.tipo), 0, 0);
    b.append(ic, document.createTextNode(`${i + 1}. ${it.nome}`));
    b.title = { cura: 'Cuida do corpo', calma: 'Acalma a cabeça', folego: 'Desperta: a vista clareia', ancora: 'Lembrança sua: cura para o espírito; apaga o que é falso à vista' }[it.tipo] ?? '';
    b.onclick = () => fazer({ tipo: 'usar', indice: i });
    return b;
  }));
  if (p.equipamento.length) el.insertAdjacentHTML('beforeend', `<span class="vazio">Na mão: ${p.equipamento.join(', ')}.</span>`);
}

let ultimoLog = 0;
function desenharRegistro() {
  const ol = $('registro');
  const ultimos = e.log.slice(-40);
  const turnoAtual = e.turno;
  ol.innerHTML = ultimos.map((m) => `<li class="t-${m.tipo}${m.turno < turnoAtual - 1 ? ' velho' : ''}">${m.texto}${depurar && m.mentira ? '<span class="depura">[mentira]</span>' : ''}</li>`).join('');
  if (e.log.length !== ultimoLog) ol.scrollTop = ol.scrollHeight;
  ultimoLog = e.log.length;
}

/** A escolha entre andares tem fio próprio: se acabar, o lugar escolhe por você. */
const TEMPO_ESCOLHA = 15000;
let relogioEscolha = null;
function pararRelogioEscolha() { if (relogioEscolha) cancelAnimationFrame(relogioEscolha.raf); relogioEscolha = null; }
function relogioDaEscolha() {
  pararRelogioEscolha();
  relogioEscolha = { resta: TEMPO_ESCOLHA, antes: performance.now(), raf: 0 };
  const barra = $('fio-escolha');
  const passo = (agora) => {
    if (!relogioEscolha || !e?.escolha) return pararRelogioEscolha();
    // Com a aba escondida, o tempo não corre.
    if (!document.hidden) relogioEscolha.resta -= agora - relogioEscolha.antes;
    relogioEscolha.antes = agora;
    const f = Math.max(0, relogioEscolha.resta / TEMPO_ESCOLHA);
    barra.style.transform = `scaleX(${f.toFixed(3)})`;
    barra.classList.toggle('acabando', f < 0.3);
    if (f <= 0) {
      const i = hash(e.semente + e.andar) % e.escolha.opcoes.length;
      pararRelogioEscolha();
      e.log.push({ texto: 'Você hesitou. O lugar escolheu por você.', tipo: 'perigo', turno: e.turno });
      fazer({ tipo: 'escolher', indice: i });
      return;
    }
    relogioEscolha.raf = requestAnimationFrame(passo);
  };
  relogioEscolha.raf = requestAnimationFrame(passo);
}

function mostrarEvolucao() {
  const caixa = $('evolucao');
  if (!caixa.hidden && caixa.dataset.andar === String(e.andar)) return;
  caixa.dataset.andar = String(e.andar);
  relogioDaEscolha();
  $('opcoes').replaceChildren(...e.escolha.opcoes.map((o, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `c-${o.caminho}`;
    b.innerHTML = `<b>${i + 1}. ${o.nome} ${o.nivel}</b><span class="efeito">${o.efeito}</span><span class="resumo">${o.resumo}</span>`;
    b.onclick = () => fazer({ tipo: 'escolher', indice: i });
    return b;
  }));
  caixa.hidden = false;
  caixa.querySelector('button')?.focus();
}

function terminar() {
  if (!e?.fim || !$('fim').hidden) return;
  const r = J.resumo(e);
  const th = TEMAS[e.tema];
  const titulo = r.resultado === 'fuga' ? (r.inteira ? 'Você saiu inteiro' : 'Você saiu, pela metade') : { morte: 'Você caiu', loucura: 'Você se perdeu', desistiu: 'Você desistiu', limite: 'Fim' }[r.resultado];
  $('fim-titulo').textContent = titulo;
  $('fim-texto').textContent = { fuga: `${th.fuga} ${r.inteira ? th.pecas.inteiro : th.pecas.falta}`, morte: th.morte, loucura: th.loucura, desistiu: 'Você senta no chão e espera. Talvez outra noite.' }[r.resultado] ?? '';
  const s = r.stats;
  const linhas = [
    ['Onde parou', `${th.andares[e.andar - 1]} (andar ${e.andar} de 5)`],
    ['Turnos', s.turnos],
    ['Peças do caminho', `${r.pecas} de 3`],
    ['Vezes que a ronda alcançou você', s.rondas],
    ['Golpes pesados que você evitou', s.pesadosEvitados],
    ['Janelas que você segurou', s.janelasBarradas],
    ['Golpes no vazio', s.golpesNoVazio],
    ['Aliados feridos por engano', s.aliadosFeridos + (s.aliadosMortos ? ` (${s.aliadosMortos} não levantaram)` : '')],
    ['Falsos aliados que pegaram você', s.emboscadas],
    ['Miragens em que você acreditou', s.miragensPisadas],
    ['Paredes que mentiram', s.paredesFalsas],
    ['Portas pintadas que você empurrou', s.portasFalsas],
    ['Buracos que não existiam', s.buracosFalsos],
    ['Itens quebrados achando que eram bichos', s.itensQuebrados],
    ['Coisas que fizeram mal de olhar', s.perturbadores],
    ['Desmaios', s.desmaios],
    ['Mentiras desfeitas a tempo', r.revelados],
    ['Gente convencida', s.pacificados],
    ['Criaturas espantadas com fé', s.espantados],
    ['Perdas de controle', s.surtos],
  ];
  const novas = r.pistas.filter((id) => !pistasAntes.includes(id));
  $('fim-resumo').innerHTML = `
    ${r.diario.length ? `<h3>O que aconteceu</h3><ul>${r.diario.map((d) => `<li>${d.texto}</li>`).join('')}</ul>` : ''}
    ${novas.length ? `<h3>Para o diário</h3><ul>${novas.map((id) => `<li class="pista-nova">${J.PISTAS[id]}</li>`).join('')}</ul>` : ''}
    <table>${linhas.map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join('')}</table>
    <p class="nota">Semente <code>${e.semente}</code>. A mesma semente repete o lugar e as criaturas; o resto depende do que você fizer.</p>`;
  diario.pistas = [...new Set([...diario.pistas, ...r.pistas])];
  diario.partidas.push({ semente: e.semente, tema: e.tema, origem: e.origem, resultado: r.resultado, andar: e.andar, turnos: s.turnos, data: new Date().toISOString().slice(0, 10) });
  diario.partidas = diario.partidas.slice(-30);
  if (r.resultado === 'morte' || r.resultado === 'loucura') diario.quedas[`${e.semente}|${e.tema}|${e.andar}`] = { x: e.jogador.x, y: e.jogador.y };
  gravarDiario(diario);
  $('copiar').textContent = 'Copiar link da semente';
  $('fim').hidden = false;
  $('denovo').focus();
}

/* Desenho do mapa --------------------------------------------------------- */

const tela = $('tela');
const baixa = criarCanvas(1, 1);
const vista = { cols: 15, rows: 11, escala: 3, x0: 0, y0: 0 };

function redimensionar() {
  const palco = $('palco');
  const largura = palco.clientWidth || 360;
  const celular = largura < 600;
  const alturaMax = Math.max(220, Math.min(window.innerHeight * (celular ? 0.44 : 0.74), 760));
  let escala = celular ? 2 : 3;
  let cols = Math.floor(largura / (TAM * escala));
  if (cols > 23) { escala = 4; cols = Math.floor(largura / (TAM * escala)); }
  if (cols < 11 && escala > 2) { escala = 2; cols = Math.floor(largura / (TAM * escala)); }
  cols = Math.max(9, cols - (cols % 2 === 0 ? 1 : 0));
  let rows = Math.floor(alturaMax / (TAM * escala));
  rows = Math.max(7, rows - (rows % 2 === 0 ? 1 : 0));
  Object.assign(vista, { cols, rows, escala });
  baixa.width = cols * TAM;
  baixa.height = rows * TAM;
  tela.width = cols * TAM * escala;
  tela.height = rows * TAM * escala;
  tela.style.width = `${tela.width}px`;
  tela.style.height = `${tela.height}px`;
}
window.addEventListener('resize', () => { if (e) { redimensionar(); } });

const DESBOTA = [0, 0.12, 0.32, 0.52, 0.72, 0.88];
const TINTA = { sanatorio: [150, 190, 160], masmorra: [150, 110, 80], zumbi: [140, 160, 90] };

function quadro(agora) {
  requestAnimationFrame(quadro);
  if (!e || $('partida').hidden) return;
  desenharMapa(agora);
}
requestAnimationFrame(quadro);

function desenharMapa(agora) {
  const p = J.percebido(e);
  const th = TEMAS[e.tema];
  const pal = th.paleta;
  const ctx = baixa.getContext('2d');
  const { cols, rows } = vista;
  const eu = p.jogador;
  vista.x0 = eu.x - Math.floor(cols / 2);
  vista.y0 = eu.y - Math.floor(rows / 2);
  const reduz = movimentoReduzido.matches;
  const respira = !reduz && Math.floor(agora / 380) % 2 === 0;
  const lv = p.lucidez;
  const lc = p.atencao;
  const raio = J.PARAM.raioVisao[lc];
  ctx.fillStyle = pal.fundo;
  ctx.fillRect(0, 0, baixa.width, baixa.height);
  const tileEm = (x, y) => (x < 0 || y < 0 || x >= p.w || y >= p.h ? -1 : p.tiles[y * p.w + x]);
  for (let ly = 0; ly < rows; ly++) {
    for (let lx = 0; lx < cols; lx++) {
      const x = lx + vista.x0, y = ly + vista.y0;
      const t = tileEm(x, y);
      if (t < 0) continue;
      const px = lx * TAM, py = ly * TAM;
      const nome = t === T.PAREDE ? 'parede' : t === T.PORTA ? 'porta' : t === T.ABERTA ? 'aberta' : 'chao';
      const abaixo = tileEm(x, y + 1);
      desenharTile(ctx, nome, px, py, pal, th.estilo, x * 7919 + y * 104729 + e.andar * 31, abaixo >= 0 && abaixo !== T.PAREDE);
      const vis = p.visivel[y * p.w + x];
      const sinal = p.sinais[y * p.w + x];
      if (t === T.BURACO) {
        desenharBuraco(ctx, px, py, pal);
        // O de verdade sopra: um fiapo de ar claro que sobe.
        if (sinal) { const f = reduz ? 0 : Math.floor(agora / 260 + x) % 3; ctx.fillStyle = 'rgba(220,230,240,0.55)'; ctx.fillRect(px + 4 + f, py + 4 - f, 1, 2); ctx.fillRect(px + 7 - f, py + 5 - f, 1, 1); }
      }
      // A porta de verdade tem luz por baixo.
      if (t === T.PORTA && sinal) { ctx.fillStyle = pal.luz; ctx.fillRect(px + 3, py + TAM - 1, 6, 1); }
      if (!vis) {
        ctx.fillStyle = 'rgba(8,6,12,0.62)';
        ctx.fillRect(px, py, TAM, TAM);
      } else {
        const d = Math.hypot(x - eu.x, y - eu.y) / (raio + 0.5);
        const a = Math.min(0.7, d * d * 0.65);
        if (a > 0.02) { ctx.fillStyle = `rgba(8,6,12,${a.toFixed(3)})`; ctx.fillRect(px, py, TAM, TAM); }
      }
    }
  }
  const naTela = (x, y) => x >= vista.x0 && y >= vista.y0 && x < vista.x0 + cols && y < vista.y0 + rows;
  const pos = (x, y) => [(x - vista.x0) * TAM, (y - vista.y0) * TAM];
  for (const j of p.janelas) if (naTela(j.x, j.y)) desenharJanela(ctx, j, ...pos(j.x, j.y), agora, reduz, p);
  // Onde você caiu da outra vez, nesta mesma semente.
  const queda = diario.quedas[`${e.semente}|${e.tema}|${e.andar}`];
  if (queda && naTela(queda.x, queda.y) && p.tiles[queda.y * p.w + queda.x] >= 0) {
    const [px, py] = pos(queda.x, queda.y);
    ctx.fillStyle = 'rgba(120,20,30,0.55)';
    ctx.fillRect(px + 3, py + 6, 6, 3);
    ctx.fillRect(px + 5, py + 5, 2, 5);
  }
  // Seu sangue no chão: escurece com o tempo.
  for (const g of p.sangue) {
    if (!naTela(g.x, g.y)) continue;
    const [px, py] = pos(g.x, g.y);
    const a = Math.max(0.18, 0.7 - g.idade / 120);
    ctx.fillStyle = `rgba(${g.idade < 30 ? 150 : 95},12,16,${a.toFixed(2)})`;
    const z = hash(g.x * 31 + g.y * 17);
    ctx.fillRect(px + 3 + (z % 5), py + 4 + ((z >> 3) % 4), 2, 2);
    ctx.fillRect(px + 6 + ((z >> 5) % 3), py + 7 + ((z >> 7) % 3), 1, 1);
    if (g.idade < 30) ctx.fillRect(px + 2 + ((z >> 9) % 6), py + 8, 1, 1);
  }
  for (const o of p.objetos) {
    if (!naTela(o.x, o.y)) continue;
    let [px, py] = pos(o.x, o.y);
    if (o.tipo === 'perturbador') {
      desenharPerturbador(ctx, o.perturbador, px, py, o.examinado);
      if (!o.visivel) { ctx.fillStyle = 'rgba(8,6,12,0.5)'; ctx.fillRect(px, py, TAM, TAM); }
      continue;
    }
    if (o.sombra) { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(px + 2, py + 10, 8, 2); }
    else if (respira) py -= 1;
    if (o.tipo === 'item') ctx.drawImage(icone(criarCanvas, o.item), px, py);
    else if (o.tipo === 'peca') desenharPeca(ctx, px, py, agora, reduz);
    else desenharObjeto(ctx, o.tipo, px, py, pal, e.tema);
    if (!o.visivel) { ctx.fillStyle = 'rgba(8,6,12,0.5)'; ctx.fillRect(px, py, TAM, TAM); }
    if (depurar && !o.verdade?.real) marcaDepura(ctx, px, py, '#ff3060');
  }
  const atual = alvoAtual(p);
  for (const ent of p.entidades) {
    if (!naTela(ent.x, ent.y)) continue;
    let [px, py] = pos(ent.x, ent.y);
    if (ent.sombra) { ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(px + 3, py + 10, 6, 2); ctx.fillRect(px + 2, py + 11, 8, 1); }
    else if (respira) py -= 1;
    ctx.drawImage(sprite(criarCanvas, ent.sprite, ent.cores), px, py);
    if (ent.companheiro) { ctx.fillStyle = COR_CAMINHO[e.origem].r; ctx.fillRect(px + 5, py - 1, 2, 1); }
    if (ent.preparando) { ctx.fillStyle = '#ff3a2a'; ctx.fillRect(px + 5, py - 4, 2, 3); ctx.fillRect(px + 5, py, 2, 1); }
    if (ent.tonto) { ctx.fillStyle = '#f0e070'; const f = reduz ? 0 : Math.floor(agora / 200) % 3; ctx.fillRect(px + 2 + f * 3, py - 1, 1, 1); ctx.fillRect(px + 8 - f * 2, py - 2, 1, 1); }
    if (ent.ameaca) { ctx.fillStyle = 'rgba(200,20,20,0.5)'; ctx.fillRect(px, py + 11, TAM, 1); }
    if (ent.marca === 'suspeito') { ctx.fillStyle = pal.luz; ctx.fillRect(px + 9, py, 2, 1); ctx.fillRect(px + 10, py + 1, 1, 1); ctx.fillRect(px + 9, py + 3, 1, 1); }
    if (depurar && ent.verdade) {
      if (ent.verdade.tipo === 'fantasma') marcaDepura(ctx, px, py, '#ff3060');
      else if (ent.verdade.disfarce) marcaDepura(ctx, px, py, '#ffb020');
    }
  }
  // Você.
  {
    const [px, py] = pos(eu.x, eu.y);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(px + 3, py + 10, 6, 2);
    ctx.fillRect(px + 2, py + 11, 8, 1);
    ctx.drawImage(sprite(criarCanvas, 'heroi', COR_CAMINHO[e.origem]), px, py);
  }
  if (atual && naTela(atual.x, atual.y)) {
    const [px, py] = pos(atual.x, atual.y);
    ctx.fillStyle = atual.categoria === 'aliado' || atual.tipoAlvo === 'objeto' ? '#e8e0c8' : atual.categoria === 'neutro' ? '#e8c860' : '#ff7060';
    for (const [x, y, w, h] of [[0, 0, 3, 1], [0, 0, 1, 3], [9, 0, 3, 1], [11, 0, 1, 3], [0, 11, 3, 1], [0, 9, 1, 3], [9, 11, 3, 1], [11, 9, 1, 3]]) ctx.fillRect(px + x, py + y, w, h);
  }
  posProcessar(ctx, lv, lc, agora, reduz);
  // Ampliar para a tela, com tremor quando a cabeça vai mal.
  const t = tela.getContext('2d');
  t.imageSmoothingEnabled = false;
  t.fillStyle = '#07060a';
  t.fillRect(0, 0, tela.width, tela.height);
  let ox = 0, oy = 0;
  if (!reduz && lv >= 3 && !p.ancorado) {
    const forca = lv - 2;
    const z = hash(Math.floor(agora / 90));
    if ((z & 7) < forca) { ox = ((z >> 3) % 3 - 1) * vista.escala; oy = ((z >> 6) % 3 - 1) * vista.escala; }
  }
  if (p.surto && !reduz) { ox += Math.round(Math.sin(agora / 40) * 2) * vista.escala; }
  t.drawImage(baixa, ox, oy, tela.width, tela.height);
  // Consciência: a imagem dobra (visão dupla) e os olhos piscam devagar.
  if (lc >= 3 && !p.desmaio) {
    const deriva = reduz ? 1 : Math.sin(agora / 900) * 1.5 + 1.5;
    t.globalAlpha = 0.14 * (lc - 2);
    t.drawImage(baixa, ox + Math.round(deriva * vista.escala), oy + Math.round(deriva * 0.5 * vista.escala), tela.width, tela.height);
    t.globalAlpha = 1;
  }
  if (lc >= 4 && !reduz && !p.desmaio) {
    // Piscada longa a cada poucos segundos: a tela some e volta.
    const ciclo = 5200 - (lc - 4) * 1800;
    const fase = agora % ciclo;
    if (fase < 520) { t.fillStyle = `rgba(0,0,0,${(Math.sin((fase / 520) * Math.PI) * 0.92).toFixed(3)})`; t.fillRect(0, 0, tela.width, tela.height); }
  }
  // Corpo: pulso vermelho nas bordas, mais rápido quanto pior.
  if (p.ferimento >= 2) {
    const periodo = [0, 0, 1400, 1000, 700, 700][p.ferimento];
    const batida = reduz ? 0.5 : Math.max(0, Math.sin(((agora % periodo) / periodo) * Math.PI * 2)) ** 3;
    const forca = (p.ferimento - 1) * 0.16 * (0.45 + 0.55 * batida);
    const g = t.createRadialGradient(tela.width / 2, tela.height / 2, Math.min(tela.width, tela.height) * 0.3, tela.width / 2, tela.height / 2, Math.hypot(tela.width, tela.height) / 2);
    g.addColorStop(0, 'rgba(120,0,10,0)');
    g.addColorStop(1, `rgba(120,0,10,${forca.toFixed(3)})`);
    t.fillStyle = g;
    t.fillRect(0, 0, tela.width, tela.height);
  }
  if (p.desmaio) { t.fillStyle = 'rgba(0,0,0,0.94)'; t.fillRect(0, 0, tela.width, tela.height); }
  // O fio: uma linha que queima na base da tela. Acabou: risco vermelho pulsando.
  {
    const alt = Math.max(3, vista.escala);
    const y0 = tela.height - alt;
    if (p.fio > 0) {
      const larg = Math.round(tela.width * p.fio);
      t.fillStyle = p.fio < 0.25 ? '#e0603a' : TEMAS[e.tema].paleta.luz;
      t.globalAlpha = p.fio < 0.1 && !reduz ? 0.55 + 0.45 * Math.abs(Math.sin(agora / 160)) : 0.85;
      t.fillRect(0, y0, larg, alt);
      t.globalAlpha = 1;
      // a brasa na ponta
      t.fillStyle = '#fff2c0';
      t.fillRect(Math.max(0, larg - alt * 2), y0, alt * 2, alt);
    } else {
      t.fillStyle = `rgba(200,20,20,${reduz ? 0.8 : (0.45 + 0.4 * Math.abs(Math.sin(agora / 300))).toFixed(2)})`;
      t.fillRect(0, y0, tela.width, alt);
    }
  }
  if (lampejo.cor && agora < lampejo.ate) {
    const falta = (lampejo.ate - agora) / 170;
    t.fillStyle = `${lampejo.cor}${Math.min(0.45, falta * 0.4).toFixed(3)})`;
    t.fillRect(0, 0, tela.width, tela.height);
  }
}

/** Peça do caminho: um brilho no chão. */
function desenharPeca(ctx, px, py, agora, reduz) {
  const b = reduz ? 1 : 0.7 + 0.3 * Math.sin(agora / 300);
  ctx.fillStyle = `rgba(255,220,120,${(0.25 * b).toFixed(2)})`;
  ctx.fillRect(px + 1, py + 3, 10, 8);
  ctx.fillStyle = '#e8c860';
  ctx.fillRect(px + 4, py + 4, 4, 5);
  ctx.fillStyle = '#fff4c8';
  ctx.fillRect(px + 5, py + 5, 1, 2);
}

/** Janela na parede: vidro escuro; algo passa; batidas tremem o vidro; quebrada; escorada. */
function desenharJanela(ctx, j, px, py, agora, reduz, p) {
  const k = j.y * p.w + j.x;
  if (p.tiles[k] < 0) return;
  const pal = TEMAS[e.tema].paleta;
  ctx.fillStyle = '#2a2a30';
  ctx.fillRect(px + 2, py + 2, 8, 8);
  ctx.fillStyle = j.estado === 'quebrada' ? '#050508' : '#141a24';
  ctx.fillRect(px + 3, py + 3, 6, 6);
  // Algo passando lá fora (desenha por ~1 s depois do turno em que passou).
  const idade = p.turno - j.passou;
  if (j.estado === 'fechada' && idade >= 0 && idade <= 1 && j.quem) {
    const vistaEm = passagens.get(k);
    if (!vistaEm || vistaEm.turno !== j.passou) passagens.set(k, { turno: j.passou, t0: agora });
    const t0 = passagens.get(k).t0;
    const f = reduz ? 0.5 : Math.min(1, (agora - t0) / 1100);
    if (f < 1) {
      const sx = Math.round(-6 + f * 18);
      ctx.save();
      ctx.beginPath();
      ctx.rect(px + 3, py + 3, 6, 6);
      ctx.clip();
      ctx.fillStyle = 'rgba(10,8,12,0.95)';
      ctx.fillRect(px + 3 + sx, py + 4, 3, 5);
      ctx.fillRect(px + 3 + sx + 1, py + 3, 2, 1);
      ctx.restore();
    }
  }
  if (j.estado === 'batendo' && !reduz && Math.floor(agora / 140) % 2 === 0) { ctx.fillStyle = 'rgba(230,230,240,0.35)'; ctx.fillRect(px + 3, py + 3, 6, 6); }
  if (j.estado === 'batendo' || j.estado === 'quebrada') { ctx.fillStyle = '#c8ccd4'; ctx.fillRect(px + 4, py + 4, 1, 1); ctx.fillRect(px + 5, py + 5, 1, 1); ctx.fillRect(px + 7, py + 4, 1, 2); }
  // Caixilho.
  ctx.fillStyle = pal.parede2;
  ctx.fillRect(px + 5, py + 3, 1, 6);
  ctx.fillRect(px + 3, py + 6, 6, 1);
  if (j.estado === 'barrada') { ctx.fillStyle = '#6a4a2a'; ctx.fillRect(px + 1, py + 4, 10, 2); ctx.fillRect(px + 1, py + 8, 10, 1); }
}
const passagens = new Map();

function marcaDepura(ctx, px, py, cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(px, py, 2, 2);
}

/**
 * A imagem segue o estado verdadeiro, cada medida com o seu jeito:
 * a Sanidade tira a cor, põe grão e separa as cores; a Consciência fecha a vinheta.
 */
function posProcessar(ctx, lv, lc, agora, reduz) {
  if (lv === 0 && lc === 0) return;
  const w = baixa.width, h = baixa.height;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const des = DESBOTA[lv];
  const [tr, tg, tb] = TINTA[e.tema];
  const cx = w / 2, cy = h / 2;
  const maxR = Math.hypot(cx, cy);
  const vinheta = 0.25 + lc * 0.13;
  const semente = reduz ? 7 : Math.floor(agora / 120);
  const grao = lv >= 3 ? (lv - 2) * 10 : 0;
  const tremula = !reduz && lv >= 3 && (hash(Math.floor(agora / 250)) % 23) === 0 ? 0.75 : 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      let r = d[i], g = d[i + 1], b = d[i + 2];
      const cinza = r * 0.3 + g * 0.59 + b * 0.11;
      r += (cinza * 0.85 + tr * 0.15 - r) * des;
      g += (cinza * 0.85 + tg * 0.15 - g) * des;
      b += (cinza * 0.85 + tb * 0.15 - b) * des;
      const dist = Math.hypot(x - cx, y - cy) / maxR;
      const v = Math.max(0, 1 - Math.max(0, dist - (1 - vinheta)) / vinheta * 0.95) * tremula;
      let ruido = 0;
      if (grao) ruido = ((hash(x * 131 + y * 977 + semente * 7) & 255) / 255 - 0.5) * grao;
      d[i] = r * v + ruido;
      d[i + 1] = g * v + ruido;
      d[i + 2] = b * v + ruido;
    }
  }
  if (lv >= 4) {
    // Cores que se separam: o vermelho escorrega um pixel.
    const desloc = reduz ? 1 : 1 + (Math.floor(agora / 500) % 2);
    for (let y = 0; y < h; y++) for (let x = w - 1; x >= desloc; x--) {
      d[(y * w + x) * 4] = d[(y * w + x - desloc) * 4];
    }
  }
  ctx.putImageData(img, 0, 0);
}

// Rodapé: o `assets/rodape.js` (que roda depois deste módulo) escreve as versões do Clip; a do jogo entra em seguida.
document.addEventListener('DOMContentLoaded', () => {
  const [a, m, d] = VERSAO_DESVARIO.data.split('-');
  $('rodape')?.insertAdjacentHTML('afterbegin', `<span>Desvario <b>v${VERSAO_DESVARIO.numero}</b> · ${d}/${m}/${a}</span>`);
});

montarInicio();
if (params.get('jogar') === '1') comecar(params.get('semente') ?? undefined);

// Depuração: acesso ao estado pelo console (só com ?depurar=1).
if (depurar) window.desvario = { estado: () => e, atualizar, J };
