/**
 * Mapa do crawler: geração de andares por salas e corredores, campo de visão
 * e caminhos. Sem DOM; todo sorteio vem de um fluxo de `rng.js`.
 */
import { inteiro, chance } from './rng.js';

export const T = { PAREDE: 0, CHAO: 1, PORTA: 2, ABERTA: 3 };

export const bloqueiaVisao = (t) => t === T.PAREDE || t === T.PORTA;
export const passavel = (t) => t !== T.PAREDE;

export function novoMapa(w, h) {
  return { w, h, tiles: new Array(w * h).fill(T.PAREDE), salas: [] };
}

export const dentro = (m, x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h;
export const tile = (m, x, y) => (dentro(m, x, y) ? m.tiles[y * m.w + x] : T.PAREDE);
export const por = (m, x, y, t) => {
  if (dentro(m, x, y)) m.tiles[y * m.w + x] = t;
};

const centro = (s) => ({ x: s.x + Math.floor(s.w / 2), y: s.y + Math.floor(s.h / 2) });

function cavarSala(m, s) {
  for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) por(m, x, y, T.CHAO);
}

function cavarCorredor(m, r, a, b) {
  let { x, y } = a;
  const horizontalPrimeiro = chance(r, 0.5);
  const passo = (eixo) => {
    if (eixo === 'x') while (x !== b.x) { x += Math.sign(b.x - x); if (tile(m, x, y) === T.PAREDE) por(m, x, y, T.CHAO); }
    else while (y !== b.y) { y += Math.sign(b.y - y); if (tile(m, x, y) === T.PAREDE) por(m, x, y, T.CHAO); }
  };
  if (horizontalPrimeiro) { passo('x'); passo('y'); } else { passo('y'); passo('x'); }
}

const sobrepoe = (a, b, folga = 1) =>
  a.x - folga < b.x + b.w && a.x + a.w + folga > b.x && a.y - folga < b.y + b.h && a.y + a.h + folga > b.y;

/**
 * Gera um andar. Devolve o mapa com `salas` (a primeira é a de entrada, a
 * última a mais distante, onde fica a descida).
 */
export function gerarAndar(r, { w = 40, h = 28, salas: alvo = 9 } = {}) {
  const m = novoMapa(w, h);
  const salas = [];
  for (let tent = 0; tent < 400 && salas.length < alvo; tent++) {
    const sw = inteiro(r, 4, 8);
    const sh = inteiro(r, 3, 6);
    const s = { x: inteiro(r, 1, w - sw - 2), y: inteiro(r, 1, h - sh - 2), w: sw, h: sh };
    if (salas.some((o) => sobrepoe(s, o, 2))) continue;
    salas.push(s);
  }
  // Ordena num caminho que serpenteia pelo mapa: vizinho mais próximo.
  const ordem = [salas.shift()];
  while (salas.length) {
    const u = centro(ordem[ordem.length - 1]);
    salas.sort((a, b) => dist2(centro(a), u) - dist2(centro(b), u));
    ordem.push(salas.shift());
  }
  for (const s of ordem) cavarSala(m, s);
  for (let i = 1; i < ordem.length; i++) cavarCorredor(m, r, centro(ordem[i - 1]), centro(ordem[i]));
  // Alguns atalhos: laços deixam fugir e dão rotas alternativas.
  const extras = Math.max(1, Math.floor(ordem.length / 4));
  for (let i = 0; i < extras; i++) {
    const a = ordem[inteiro(r, 0, ordem.length - 1)];
    const b = ordem[inteiro(r, 0, ordem.length - 1)];
    if (a !== b) cavarCorredor(m, r, centro(a), centro(b));
  }
  // Portas onde um corredor encosta na borda de uma sala.
  for (const s of ordem) {
    for (let x = s.x - 1; x <= s.x + s.w; x++) {
      for (const y of [s.y - 1, s.y + s.h]) tentarPorta(m, r, x, y, 'h');
    }
    for (let y = s.y; y < s.y + s.h; y++) {
      for (const x of [s.x - 1, s.x + s.w]) tentarPorta(m, r, x, y, 'v');
    }
  }
  m.salas = ordem;
  return m;
}

function tentarPorta(m, r, x, y, orient) {
  if (tile(m, x, y) !== T.CHAO) return;
  const [a, b] = orient === 'h' ? [tile(m, x - 1, y), tile(m, x + 1, y)] : [tile(m, x, y - 1), tile(m, x, y + 1)];
  if (a === T.PAREDE && b === T.PAREDE && chance(r, 0.45)) por(m, x, y, T.PORTA);
}

const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
export const distancia = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

/** Pontos de chão livres dentro de uma sala. */
export function pontosDaSala(s) {
  const p = [];
  for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) p.push({ x, y });
  return p;
}

/* Campo de visão: sombra recursiva (shadowcasting) em 8 octantes. ---------- */

const OCTANTES = [
  [1, 0, 0, 1], [0, 1, 1, 0], [0, -1, 1, 0], [-1, 0, 0, 1],
  [-1, 0, 0, -1], [0, -1, -1, 0], [0, 1, -1, 0], [1, 0, 0, -1],
];

/** Conjunto de índices visíveis a partir de (ox, oy) com raio `raio`. */
export function visao(m, ox, oy, raio, bloqueia = (x, y) => bloqueiaVisao(tile(m, x, y))) {
  const vis = new Set([oy * m.w + ox]);
  const r2 = raio * raio;
  for (const [xx, xy, yx, yy] of OCTANTES) {
    const lancar = (linha, inicio, fim) => {
      if (inicio < fim) return;
      let novoInicio = 0;
      for (let j = linha; j <= raio; j++) {
        let bloqueado = false;
        for (let dx = -j, dy = -j; dx <= 0; dx++) {
          const X = ox + dx * xx + dy * xy;
          const Y = oy + dx * yx + dy * yy;
          const ls = (dx - 0.5) / (dy + 0.5);
          const rs = (dx + 0.5) / (dy - 0.5);
          if (inicio < rs) continue;
          if (fim > ls) break;
          if (dx * dx + dy * dy <= r2 && dentro(m, X, Y)) vis.add(Y * m.w + X);
          const b = !dentro(m, X, Y) || bloqueia(X, Y);
          if (bloqueado) {
            if (b) { novoInicio = rs; continue; }
            bloqueado = false;
            inicio = novoInicio;
          } else if (b && j < raio) {
            bloqueado = true;
            lancar(j + 1, inicio, ls);
            novoInicio = rs;
          }
        }
        if (bloqueado) break;
      }
    };
    lancar(1, 1.0, 0.0);
  }
  return vis;
}

/** Linha de visão simples entre dois pontos (Bresenham). */
export function linhaLivre(m, a, b) {
  let x0 = a.x, y0 = a.y;
  const dx = Math.abs(b.x - x0), dy = -Math.abs(b.y - y0);
  const sx = x0 < b.x ? 1 : -1, sy = y0 < b.y ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    if (x0 === b.x && y0 === b.y) return true;
    if (!(x0 === a.x && y0 === a.y) && bloqueiaVisao(tile(m, x0, y0))) return false;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

export const VIZINHOS = [
  [0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1],
];

/**
 * Busca em largura. `passa(x, y)` diz se dá para pisar; `alvo(x, y)` diz se
 * chegou. Devolve o primeiro passo `{dx, dy}` e o comprimento, ou null.
 */
export function primeiroPasso(w, h, origem, passa, alvo, limite = 4000) {
  const ant = new Map();
  const k = (x, y) => y * w + x;
  const fila = [origem];
  ant.set(k(origem.x, origem.y), null);
  let n = 0;
  while (fila.length && n++ < limite) {
    const c = fila.shift();
    if (!(c.x === origem.x && c.y === origem.y) && alvo(c.x, c.y)) {
      let p = c, len = 0;
      while (ant.get(k(p.x, p.y)) && !(ant.get(k(p.x, p.y)).x === origem.x && ant.get(k(p.x, p.y)).y === origem.y)) {
        p = ant.get(k(p.x, p.y));
        len++;
      }
      return { dx: p.x - origem.x, dy: p.y - origem.y, comprimento: len + 1, destino: c };
    }
    for (const [dx, dy] of VIZINHOS) {
      const x = c.x + dx, y = c.y + dy;
      if (x < 0 || y < 0 || x >= w || y >= h || ant.has(k(x, y))) continue;
      if (!passa(x, y) && !alvo(x, y)) continue;
      ant.set(k(x, y), c);
      fila.push({ x, y });
    }
  }
  return null;
}

