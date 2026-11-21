/**
 * Sorteio com semente: a mesma semente conta sempre a mesma sessão.
 * Um fluxo é `{ s: [a, b, c, d] }` (sfc32), que pode ser copiado e guardado.
 */

export function hash(texto) {
  let h = 2166136261 >>> 0;
  const s = String(texto);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15; h = Math.imul(h, 2246822507);
  h ^= h >>> 13; h = Math.imul(h, 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

export function fluxo(semente, ...rotulos) {
  const base = [semente, ...rotulos].join('|');
  const r = { s: [hash(base), hash(base + '#1'), hash(base + '#2'), hash(base + '#3')] };
  for (let i = 0; i < 12; i++) prox(r);
  return r;
}

/** Próximo número em [0, 1). */
export function prox(r) {
  let [a, b, c, d] = r.s;
  const t = (((a + b) | 0) + d) | 0;
  d = (d + 1) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  c = (c + t) | 0;
  r.s = [a, b, c, d];
  return (t >>> 0) / 4294967296;
}

export const comoFuncao = (r) => () => prox(r);
export const inteiro = (r, min, max) => min + Math.floor(prox(r) * (max - min + 1));
export const sortear = (r, lista) => lista[Math.floor(prox(r) * lista.length)];

export function embaralhar(r, lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(prox(r) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SILABAS = ['bra', 'sa', 'lu', 'me', 'fa', 'rol', 'vau', 'si', 'no', 'cin', 'za', 'ti', 'la', 'pe', 'dra', 'ven', 'to', 'ri'];

/** Semente legível (ex.: "brasa-4821") a partir de um número qualquer. */
export function sementeNova(n) {
  const r = fluxo('semente', n);
  return `${sortear(r, SILABAS)}${sortear(r, SILABAS)}-${inteiro(r, 1000, 9999)}`;
}
