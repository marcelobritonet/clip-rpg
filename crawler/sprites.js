/**
 * Pixel art do Desvario, toda gerada em código: sprites de 12×12 desenhados
 * por matriz e tiles gerados com ruído e a paleta do tema. Sem imagens.
 *
 * Letras das matrizes: `.` vazio, `k` contorno, `s` pele, `r` roupa,
 * `d` detalhe, `o` olho, `h` cabelo. As cores vêm de cada espécie.
 */
import { hash } from './rng.js';

export const TAM = 12;

const S = {
  heroi: [
    '....hhhh....',
    '...hhhhhh...',
    '...hssssh...',
    '...sossos...',
    '....ssss....',
    '...rrrrrr...',
    '..rrrddrrr..',
    '.s.rrrrrr.s.',
    '...rrrrrr...',
    '...dd..dd...',
    '...rr..rr...',
    '...kk..kk...',
  ],
  humano: [
    '....hhhh....',
    '...hhhhhh...',
    '...hssssh...',
    '...sossos...',
    '....ssss....',
    '..rrrrrrrr..',
    '.srrrddrrrs.',
    '.s.rrrrrr.s.',
    '...rrrrrr...',
    '...rr..rr...',
    '...rr..rr...',
    '...kk..kk...',
  ],
  paciente: [
    '....hhh.....',
    '...hhhhh....',
    '...sssss....',
    '...sosos....',
    '....sss.....',
    '...rrrrr....',
    '..rrrrrrr...',
    '..srrrrrs...',
    '...rrrrr....',
    '...rrrrr....',
    '...s...s....',
    '...k...k....',
  ],
  crianca: [
    '............',
    '............',
    '....hhhh....',
    '...hhhhhh...',
    '...hssssh...',
    '...sossos...',
    '....ssss....',
    '...rrrrrr...',
    '..srrddrrs..',
    '....rrrr....',
    '....d..d....',
    '....k..k....',
  ],
  encapuzado: [
    '....rrrr....',
    '...rrrrrr...',
    '..rrkkkkrr..',
    '..rkokkokr..',
    '..rrkkkkrr..',
    '..rrrrrrrr..',
    '.rrrrddrrrr.',
    '.srrrddrrrs.',
    '..rrrrrrrr..',
    '..rrrrrrrr..',
    '.rrrrrrrrrr.',
    '..kk....kk..',
  ],
  zumbi: [
    '.....hhh....',
    '....hhhhh...',
    '....sssss...',
    '....sokos...',
    '.....sdss...',
    '..ssrrrrr...',
    '.ss.rrrrrss.',
    '....rrdrr.ss',
    '....rrrrr...',
    '....rr.rr...',
    '...rr...rr..',
    '...kk...kk..',
  ],
  rato: [
    '............',
    '............',
    '............',
    '............',
    '............',
    '.......ss...',
    '...rrrrrrs..',
    '..rrrrrrros.',
    '.drrrrrrrrrk',
    'd..rrrrrrr..',
    '...s.s..s.s.',
    '............',
  ],
  cao: [
    '............',
    '............',
    '.........r..',
    '........rrr.',
    '........rork',
    '.......rrrrk',
    'r.rrrrrrrr..',
    '.rrrrrrrrr..',
    '..rrrrrrrr..',
    '..r.r..r.r..',
    '..r.r..r.r..',
    '..k.k..k.k..',
  ],
  espectro: [
    '....ssss....',
    '...ssssss...',
    '..sskkkkss..',
    '..skokkoks..',
    '..sskkkkss..',
    '..ssssssss..',
    '.rssssssssr.',
    '.r.rssssr.r.',
    '...rrssrr...',
    '...rrrrrr...',
    '...r.rr.r...',
    '..r..r...r..',
  ],
  esqueleto: [
    '....ssss....',
    '...ssssss...',
    '...skssks...',
    '...sossos...',
    '....sdds....',
    '.....ss.....',
    '..s.ssss.s..',
    '..s.s..s.s..',
    '....ssss....',
    '....s..s....',
    '...ss..ss...',
    '...kk..kk...',
  ],
};

const ICONES = {
  cura: [
    '..wwwwww..',
    '.wwwwwwww.',
    '.wwwrrwww.',
    '.wwrrrrww.',
    '.wwwrrwww.',
    '.wwwwwwww.',
    '..kkkkkk..',
  ],
  calma: [
    '...kkk....',
    '..kbbwk...',
    '..kbbwwk..',
    '...kbwwk..',
    '....kwwk..',
    '.....kkk..',
    '..........',
  ],
  ancora: [
    '.kkkkkkkk.',
    '.kyyyyyyk.',
    '.kybbbbyk.',
    '.kybssbyk.',
    '.kybbbbyk.',
    '.kyyyyyyk.',
    '.kkkkkkkk.',
  ],
  arma: [
    '........w.',
    '.......ww.',
    '......ww..',
    '..k..ww...',
    '...kww....',
    '...kk.....',
    '..k..k....',
  ],
  folego: [
    '...kkkk...',
    '...kwwk...',
    '..kwbbwk..',
    '..kbbbbk..',
    '..kbwbbk..',
    '..kbbbbk..',
    '...kkkk...',
  ],
  armadura: [
    '..r....r..',
    '.rrr..rrr.',
    '.rrrrrrrr.',
    '..rrddrr..',
    '..rrddrr..',
    '..rrrrrr..',
    '...kkkk...',
  ],
};

const COR_ICONE = { w: '#f2eee2', r: '#c0392b', k: '#1a1410', b: '#5b8fd1', y: '#d9b04a', s: '#e8c8a0', d: '#7a5a3a' };
const COR_ARMADURA = { ...COR_ICONE, r: '#7b5b3a' };

const cache = new Map();

/** Canvas (ou OffscreenCanvas) pequeno com o sprite pronto, guardado em cache. */
export function sprite(criarCanvas, nome, cores) {
  const chave = nome + JSON.stringify(cores);
  if (cache.has(chave)) return cache.get(chave);
  const m = S[nome] ?? S.humano;
  const c = criarCanvas(TAM, TAM);
  const ctx = c.getContext('2d');
  const pal = { k: '#141018', ...cores };
  for (let y = 0; y < TAM; y++) {
    for (let x = 0; x < TAM; x++) {
      const ch = m[y][x];
      if (ch === '.') continue;
      ctx.fillStyle = pal[ch] ?? '#ff00ff';
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Contorno escuro de 1 px em volta de tudo que não é vazio: lê melhor no escuro.
  const img = ctx.getImageData(0, 0, TAM, TAM);
  const d = img.data;
  const cheio = (x, y) => x >= 0 && y >= 0 && x < TAM && y < TAM && d[(y * TAM + x) * 4 + 3] > 0;
  const borda = [];
  for (let y = 0; y < TAM; y++) for (let x = 0; x < TAM; x++) {
    if (cheio(x, y)) continue;
    if (cheio(x + 1, y) || cheio(x - 1, y) || cheio(x, y + 1) || cheio(x, y - 1)) borda.push([x, y]);
  }
  ctx.fillStyle = 'rgba(10,8,12,0.85)';
  for (const [x, y] of borda) ctx.fillRect(x, y, 1, 1);
  cache.set(chave, c);
  return c;
}

export function icone(criarCanvas, tipo) {
  const chave = 'icone:' + tipo;
  if (cache.has(chave)) return cache.get(chave);
  const m = ICONES[tipo];
  const c = criarCanvas(TAM, TAM);
  const ctx = c.getContext('2d');
  const pal = tipo === 'armadura' ? COR_ARMADURA : COR_ICONE;
  m.forEach((linha, y) => [...linha].forEach((ch, x) => {
    if (ch === '.') return;
    ctx.fillStyle = pal[ch];
    ctx.fillRect(x + 1, y + 3, 1, 1);
  }));
  cache.set(chave, c);
  return c;
}

/* Tiles ------------------------------------------------------------------ */

const misturar = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (p, s) => (p >> s) & 255;
  const c = (s) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};

/**
 * Desenha um tile no contexto, na posição (px, py). `variante` é um número
 * estável por casa (para o ruído não piscar). `frente` diz se a parede tem
 * chão embaixo (mostra a face com tijolos).
 */
export function desenharTile(ctx, tipo, px, py, pal, estilo, variante, frente) {
  const r = (i) => (hash(variante * 31 + i) & 1023) / 1024;
  if (tipo === 'chao' || tipo === 'aberta') {
    ctx.fillStyle = pal.chao;
    ctx.fillRect(px, py, TAM, TAM);
    ctx.fillStyle = pal.chao2;
    if (estilo === 'azulejo') {
      ctx.fillRect(px, py + 5, TAM, 1);
      ctx.fillRect(px + 5, py, 1, TAM);
      if (r(1) < 0.25) { ctx.fillStyle = misturar(pal.chao, '#000000', 0.25); ctx.fillRect(px + 1 + Math.floor(r(2) * 3), py + 7 + Math.floor(r(3) * 3), 2, 1); }
    } else if (estilo === 'pedra') {
      for (let i = 0; i < 5; i++) ctx.fillRect(px + Math.floor(r(i) * 11), py + Math.floor(r(i + 9) * 11), 1 + Math.floor(r(i + 20) * 2), 1);
      if (r(30) < 0.3) { ctx.fillRect(px + 2, py + 4, 4, 1); ctx.fillRect(px + 6, py + 5, 1, 2); }
    } else {
      for (let i = 0; i < 6; i++) ctx.fillRect(px + Math.floor(r(i) * 12), py + Math.floor(r(i + 9) * 12), 1, 1);
      if (r(30) < 0.18) { ctx.fillStyle = misturar(pal.chao, '#000000', 0.35); ctx.fillRect(px + 1, py + 6, 7, 1); ctx.fillRect(px + 7, py + 5, 3, 1); }
    }
    if (tipo === 'aberta') {
      ctx.fillStyle = pal.porta;
      ctx.fillRect(px, py, 2, TAM);
      ctx.fillRect(px + 10, py, 2, TAM);
    }
    return;
  }
  if (tipo === 'parede') {
    ctx.fillStyle = frente ? pal.parede : pal.parede2;
    ctx.fillRect(px, py, TAM, TAM);
    if (!frente) {
      // Topo da parede, visto de cima: escuro, para não confundir com chão.
      ctx.fillStyle = misturar(pal.parede2, pal.fundo, 0.62);
      ctx.fillRect(px, py, TAM, TAM);
      ctx.fillStyle = misturar(pal.parede2, pal.fundo, 0.45);
      ctx.fillRect(px + 1, py + 1, TAM - 2, 1);
      return;
    }
    ctx.fillStyle = pal.paredeTopo;
    ctx.fillRect(px, py, TAM, 2);
    ctx.fillStyle = pal.parede2;
    if (estilo === 'azulejo') {
      for (let y = 2; y < TAM; y += 4) ctx.fillRect(px, py + y, TAM, 1);
      for (let x = 3; x < TAM; x += 4) ctx.fillRect(px + x, py + 2, 1, TAM - 2);
      if (r(5) < 0.2) { ctx.fillStyle = '#6b7f74'; ctx.fillRect(px + 4, py + 8, 3, 2); }
    } else if (estilo === 'pedra') {
      for (let y = 2, l = 0; y < TAM; y += 3, l++) {
        ctx.fillRect(px, py + y, TAM, 1);
        for (let x = (l % 2) * 3; x < TAM; x += 6) ctx.fillRect(px + x, py + y, 1, 3);
      }
    } else {
      ctx.fillRect(px, py + 6, TAM, 1);
      ctx.fillRect(px + 6, py + 2, 1, 4);
      if (r(5) < 0.35) { ctx.fillStyle = misturar(pal.parede, '#3a2a1a', 0.4); ctx.fillRect(px + 2, py + 7, 2, 4); }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(px, py + TAM - 1, TAM, 1);
    return;
  }
  if (tipo === 'porta') {
    ctx.fillStyle = pal.parede2;
    ctx.fillRect(px, py, TAM, TAM);
    ctx.fillStyle = pal.porta;
    ctx.fillRect(px + 2, py + 1, 8, 11);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(px + 6, py + 1, 1, 11);
    ctx.fillStyle = pal.luz;
    ctx.fillRect(px + 8, py + 6, 1, 1);
    return;
  }
}

/** Buraco no chão: desenhado por cima do chão. */
export function desenharBuraco(ctx, px, py, pal) {
  ctx.fillStyle = misturar(pal.chao2, '#000000', 0.5);
  ctx.fillRect(px + 1, py + 2, 10, 9);
  ctx.fillStyle = '#050407';
  ctx.fillRect(px + 2, py + 3, 8, 7);
  ctx.fillRect(px + 1, py + 4, 10, 5);
  ctx.fillStyle = misturar(pal.chao, '#ffffff', 0.12);
  ctx.fillRect(px + 2, py + 2, 8, 1);
}

/** Coisas que fazem mal de olhar: fotografia, carta e corpo. */
export function desenharPerturbador(ctx, tipo, px, py, examinado) {
  if (tipo === 'corpo') {
    ctx.fillStyle = 'rgba(90,10,14,0.55)';
    ctx.fillRect(px + 1, py + 8, 10, 3);
    ctx.fillStyle = examinado ? '#5a5048' : '#6e6258';
    ctx.fillRect(px + 2, py + 6, 7, 3);
    ctx.fillStyle = '#c8a890';
    ctx.fillRect(px + 9, py + 6, 2, 2);
    ctx.fillStyle = '#3a3028';
    ctx.fillRect(px + 1, py + 8, 3, 1);
    ctx.fillRect(px + 4, py + 9, 4, 1);
    return;
  }
  if (tipo === 'foto') {
    ctx.fillStyle = '#ece6d6';
    ctx.fillRect(px + 3, py + 4, 7, 6);
    ctx.fillStyle = '#4a5058';
    ctx.fillRect(px + 4, py + 5, 5, 3);
    ctx.fillStyle = '#d8b898';
    ctx.fillRect(px + 6, py + 5, 1, 2);
    ctx.fillStyle = '#8a1a1a';
    ctx.fillRect(px + 5, py + 6, 3, 1);
    return;
  }
  // carta
  ctx.fillStyle = '#e8e0c8';
  ctx.fillRect(px + 2, py + 5, 8, 5);
  ctx.fillStyle = '#7a7060';
  ctx.fillRect(px + 3, py + 6, 6, 1);
  ctx.fillRect(px + 3, py + 8, 4, 1);
  ctx.fillStyle = '#8a1a1a';
  ctx.fillRect(px + 8, py + 8, 1, 1);
}

/** Objetos fixos: passagem para o próximo andar, saída e altar. */
export function desenharObjeto(ctx, tipo, px, py, pal, tema) {
  if (tipo === 'escada') {
    ctx.fillStyle = '#1a1612';
    ctx.fillRect(px + 1, py + 1, 10, 10);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = misturar(pal.chao, '#ffffff', 0.15 - i * 0.05);
      ctx.fillRect(px + 2 + i, py + 2 + i * 2, 8 - i, 2);
    }
    return;
  }
  if (tipo === 'saida') {
    ctx.fillStyle = pal.porta;
    ctx.fillRect(px + 1, py, 10, 12);
    ctx.fillStyle = pal.luz;
    ctx.fillRect(px + 3, py + 2, 6, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 5, py + 4, 2, 6);
    return;
  }
  if (tipo === 'altar') {
    if (tema === 'zumbi') {
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(px + 2, py + 9, 8, 2);
      ctx.fillStyle = '#e07a20'; ctx.fillRect(px + 4, py + 5, 4, 4);
      ctx.fillStyle = '#ffd060'; ctx.fillRect(px + 5, py + 3, 2, 4);
      return;
    }
    ctx.fillStyle = misturar(pal.parede, '#000000', 0.2);
    ctx.fillRect(px + 2, py + 7, 8, 4);
    ctx.fillStyle = pal.paredeTopo;
    ctx.fillRect(px + 2, py + 7, 8, 1);
    if (tema === 'sanatorio') {
      ctx.fillStyle = '#d9c070'; ctx.fillRect(px + 5, py + 1, 2, 6); ctx.fillRect(px + 3, py + 3, 6, 2);
    } else {
      ctx.fillStyle = '#f2eee2'; ctx.fillRect(px + 5, py + 3, 2, 4);
      ctx.fillStyle = '#ffcf7a'; ctx.fillRect(px + 5, py + 1, 2, 2);
    }
  }
}

export const COR_CAMINHO = {
  corpo: { s: '#e0b08a', r: '#b0472c', d: '#5a2a1a', o: '#1a1410', h: '#3a2414' },
  mente: { s: '#e6c0a0', r: '#2d64a8', d: '#c8d8f0', o: '#1a1410', h: '#1a1a22' },
  espirito: { s: '#d8a888', r: '#7646a8', d: '#e0c060', o: '#1a1410', h: '#c8c0b0' },
};
