/**
 * Sorteio com semente para o crawler. Sem DOM e sem Math.random: a mesma
 * semente gera sempre a mesma partida.
 *
 * Cada fluxo de sorteio é um objeto `{ s: [a, b, c, d] }` (sfc32), que pode ser
 * clonado e comparado. `fluxo(semente, ...rotulos)` deriva fluxos
 * independentes: o mapa do andar 3 não muda se o jogador rolar mais dados no
 * andar 2.
 */

/** Hash de texto em 32 bits (cyrb53 reduzido). */
export function hash(texto) {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  const s = String(texto);
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
}

/** Novo fluxo a partir da semente e de rótulos ("mapa", 3...). */
export function fluxo(semente, ...rotulos) {
  const base = [semente, ...rotulos].join('|');
  const r = { s: [hash(base), hash(base + '#1'), hash(base + '#2'), hash(base + '#3')] };
  for (let i = 0; i < 12; i++) prox(r);
  return r;
}

/** Próximo número em [0, 1). */
export function prox(r) {
  let [a, b, c, d] = r.s;
  a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
  const t = (((a + b) | 0) + d) | 0;
  d = (d + 1) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  c = (c + t) | 0;
  r.s = [a, b, c, d];
  return (t >>> 0) / 4294967296;
}

/** Função `() => número` para o motor (`testar`, `resolverAtaque`...). */
export const comoFuncao = (r) => () => prox(r);

/** Inteiro em [min, max]. */
export const inteiro = (r, min, max) => min + Math.floor(prox(r) * (max - min + 1));
export const chance = (r, p) => prox(r) < p;
export const escolher = (r, lista) => lista[Math.floor(prox(r) * lista.length)];

export function embaralhar(r, lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(prox(r) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Escolha ponderada: `[[item, peso], ...]`. */
export function ponderado(r, pares) {
  const total = pares.reduce((s, [, p]) => s + p, 0);
  let x = prox(r) * total;
  for (const [item, p] of pares) {
    x -= p;
    if (x < 0) return item;
  }
  return pares[pares.length - 1][0];
}

/** Ruído estável para (x, y, época): não consome fluxo. */
export function ruido(semente, x, y, epoca = 0) {
  return hash(`${semente}:${x}:${y}:${epoca}`) / 4294967296;
}

const SILABAS = ['ba', 'ce', 'di', 'fo', 'gu', 'la', 'me', 'ni', 'po', 'ru', 'sa', 'te', 'vi', 'zo', 'ma', 'lu', 'ra', 'no'];

/** Semente legível nova (ex.: "lume-7342"), a partir de um número qualquer. */
export function sementeNova(n) {
  const r = fluxo('semente', n);
  return `${escolher(r, SILABAS)}${escolher(r, SILABAS)}-${inteiro(r, 1000, 9999)}`;
}
