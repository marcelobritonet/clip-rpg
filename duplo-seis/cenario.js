/**
 * O cenário no alto da carta: silhuetas em SVG geradas em código, sem imagem.
 * A lanterna do viajante brilha conforme o relógio da aventura (de 0 a 1).
 */
import { hash } from './rng.js';

let uid = 0;
const W = 340;
const H = 112;

/** Números estáveis para uma cena: a mesma cena tem sempre o mesmo desenho. */
function acaso(semente) {
  let i = 0;
  return () => hash(`${semente}:${i++}`) / 4294967296;
}

function serra(r, base, altura, passos, cor, opacidade = 1) {
  let d = `M0 ${H} L0 ${base}`;
  for (let i = 1; i <= passos; i++) {
    const x = (W / passos) * i;
    const y = base - r() * altura;
    d += ` L${(x - W / passos / 2).toFixed(1)} ${(y - r() * altura * 0.4).toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `<path d="${d} L${W} ${H} Z" fill="${cor}" opacity="${opacidade}"/>`;
}

function colinas(r, base, altura, cor) {
  let d = `M0 ${H} L0 ${base}`;
  let x = 0;
  while (x < W) {
    const l = 60 + r() * 70;
    d += ` Q${(x + l / 2).toFixed(1)} ${(base - altura * (0.5 + r())).toFixed(1)} ${(x + l).toFixed(1)} ${base}`;
    x += l;
  }
  return `<path d="${d} L${W} ${H} Z" fill="${cor}"/>`;
}

const estrelas = (r, n, cor = '#fff') => Array.from({ length: n }, () => `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * H * 0.6).toFixed(1)}" r="${(0.4 + r() * 0.8).toFixed(2)}" fill="${cor}" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`).join('');

function arvore(x, base, alt, cor) {
  return `<path d="M${x} ${base} l${-alt * 0.28} 0 l${alt * 0.28} ${-alt} l${alt * 0.28} ${alt} Z" fill="${cor}"/>`;
}

function arvoreVelha(x, base, alt, cor) {
  return `<rect x="${x - 2.5}" y="${base - alt}" width="5" height="${alt}" fill="${cor}"/><ellipse cx="${x}" cy="${base - alt}" rx="${alt * 0.42}" ry="${alt * 0.36}" fill="${cor}"/>`;
}

function casa(x, base, l, cor, luz) {
  return `<path d="M${x} ${base} v${-l * 0.6} l${l / 2} ${-l * 0.45} l${l / 2} ${l * 0.45} v${l * 0.6} Z" fill="${cor}"/><rect x="${x + l * 0.38}" y="${base - l * 0.42}" width="${l * 0.2}" height="${l * 0.2}" fill="${luz}"/>`;
}

/** O viajante e a lanterna. */
function viajante(x, base, luz, cor = '#0b0907', corLuz = '#ffb347') {
  const forca = Math.max(0.06, luz);
  return `
    <circle cx="${x + 9}" cy="${base - 10}" r="${14 + 34 * forca}" fill="url(#halo-${uid})" opacity="${(0.25 + 0.75 * forca).toFixed(2)}"/>
    <path d="M${x} ${base} l2 -13 l-2 -5 a3.6 3.6 0 1 1 5 0 l-1 5 l3 13 l-3 0 l-1.2 -8 l-1 8 Z" fill="${cor}"/>
    <path d="M${x + 4} ${base - 14} l5 2" stroke="${cor}" stroke-width="1.6" fill="none"/>
    <rect x="${x + 7.6}" y="${base - 12.5}" width="3" height="4.5" rx="0.8" fill="${corLuz}" opacity="${(0.35 + 0.65 * forca).toFixed(2)}"/>`;
}

const CEUS = {
  dia: ['#e9b872', '#f3dba7', '#b8c9a8'],
  tarde: ['#3d2b4f', '#b4593f', '#f0a04b'],
  noite: ['#0a0d1c', '#141a33', '#2a2f4d'],
  breu: ['#05060c', '#0a0d1c', '#1a1d30'],
  estacao: ['#060913', '#0d1830', '#163a4a'],
  vazio: ['#020308', '#060913', '#0d1426'],
};

function ceu(tipo) {
  const [a, b, c] = CEUS[tipo];
  return `<defs>
    <linearGradient id="ceu-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="0.6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>
    <radialGradient id="halo-${uid}"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.95"/><stop offset="0.35" stop-color="#f0913a" stop-opacity="0.45"/><stop offset="1" stop-color="#f0913a" stop-opacity="0"/></radialGradient>
  </defs><rect width="${W}" height="${H}" fill="url(#ceu-${uid})"/>`;
}

const PAISAGENS = {
  vila(r) {
    return ceu('dia') + `<circle cx="270" cy="30" r="13" fill="#fff3c9" opacity="0.9"/>`
      + colinas(r, 78, 26, '#8a9a6a') + colinas(r, 90, 16, '#5d6e45')
      + casa(40, 92, 26, '#3a2c20', '#ffd27a') + casa(72, 94, 20, '#2f241a', '#ffd27a') + casa(250, 93, 24, '#3a2c20', '#ffd27a')
      + `<rect y="94" width="${W}" height="20" fill="#2a2018"/>`;
  },
  vale(r) {
    return ceu('dia') + `<circle cx="60" cy="26" r="12" fill="#fff3c9" opacity="0.9"/>`
      + serra(r, 70, 26, 6, '#a7a98a', 0.8) + colinas(r, 80, 24, '#7c8f5c') + colinas(r, 92, 14, '#566a40')
      + `<path d="M0 104 Q90 84 170 98 T${W} 90 L${W} ${H} L0 ${H} Z" fill="#2f2a1c"/>`
      + arvoreVelha(250 + r() * 40, 92, 20, '#33402a') + casa(20 + r() * 30, 94, 18, '#3a2c20', '#ffd27a');
  },
  mata(r) {
    let s = ceu('tarde') + `<circle cx="285" cy="62" r="16" fill="#ffcf7a" opacity="0.75"/>`;
    for (let i = 0; i < 14; i++) s += arvore(r() * W, 84, 30 + r() * 26, '#3b2a3a');
    for (let i = 0; i < 9; i++) s += arvoreVelha(r() * W, 100, 44 + r() * 40, '#1d1420');
    return s + `<rect y="98" width="${W}" height="16" fill="#120c12"/>`;
  },
  cimo(r) {
    return ceu('noite') + estrelas(r, 46) + `<circle cx="70" cy="24" r="9" fill="#dfe6ff" opacity="0.85"/>`
      + serra(r, 78, 50, 5, '#39405e', 0.9) + serra(r, 92, 34, 7, '#1f2338')
      + `<path d="M0 ${H} L0 102 L120 96 L230 84 L${W} 70 L${W} ${H} Z" fill="#0d0f1a"/>`
      + `<path d="M150 60 l14 -18 l10 14 Z M214 52 l9 -12 l8 10 Z" fill="#dfe6ff" opacity="0.5"/>`;
  },
  farol(r) {
    return ceu('breu') + estrelas(r, 30)
      + serra(r, 96, 30, 6, '#141829')
      + `<path d="M236 100 l6 -70 l16 0 l6 70 Z" fill="#06070d"/><rect x="238" y="22" width="24" height="9" fill="#06070d"/><path d="M240 22 l10 -9 l10 9 Z" fill="#06070d"/><rect x="246" y="23.5" width="8" height="6" fill="#2a2f4d"/>`
      + `<rect y="100" width="${W}" height="14" fill="#06070d"/>`;
  },
  anel(r) {
    let s = ceu('estacao') + estrelas(r, 24, '#bfe');
    s += `<path d="M-20 70 Q170 6 360 70 L360 82 Q170 20 -20 82 Z" fill="#1d3b45"/>`;
    for (let i = 0; i < 9; i++) { const x = 20 + i * 36 + r() * 8; s += `<rect x="${x}" y="${84 - r() * 6}" width="14" height="${14 + r() * 6}" rx="2" fill="#2f6b4a"/><rect x="${x + 2}" y="78" width="10" height="3" fill="#7fd69a" opacity="0.7"/>`; }
    return s + `<rect y="98" width="${W}" height="16" fill="#0c1a20"/>` + `<path d="M0 98 h${W}" stroke="#3ea6a0" stroke-width="1" opacity="0.5"/>`;
  },
  docas(r) {
    let s = ceu('estacao') + estrelas(r, 30, '#bfe');
    for (let i = 0; i < 7; i++) { const x = r() * W; const hh = 16 + r() * 22; s += `<rect x="${x.toFixed(1)}" y="${98 - hh}" width="${22 + r() * 16}" height="${hh}" fill="${r() > 0.5 ? '#1a2a36' : '#243a3a'}"/>`; }
    s += `<path d="M30 0 v40 h36 v-40 M52 40 v18" stroke="#30505c" stroke-width="3" fill="none"/><rect x="42" y="58" width="20" height="12" fill="#b4593f"/>`;
    s += `<rect x="238" y="30" width="70" height="68" rx="6" fill="#0c141c" stroke="#30505c" stroke-width="2"/><circle cx="273" cy="64" r="10" fill="none" stroke="#3ea6a0" stroke-width="2" opacity="0.7"/>`;
    return s + `<rect y="98" width="${W}" height="16" fill="#0a1218"/>`;
  },
  eixo(r) {
    let s = ceu('vazio') + estrelas(r, 60, '#dfe6ff');
    s += `<path d="M0 30 L${W} 46 L${W} 60 L0 52 Z" fill="#101a2a"/><path d="M0 76 L${W} 84 L${W} 100 L0 100 Z" fill="#0c1422"/>`;
    for (let i = 0; i < 8; i++) s += `<rect x="${(i * 44 + 10).toFixed(0)}" y="${34 + i * 2}" width="18" height="4" fill="#3ea6a0" opacity="${(0.15 + r() * 0.5).toFixed(2)}"/>`;
    return s + `<rect y="100" width="${W}" height="14" fill="#070b14"/>`;
  },
  nucleo(r) {
    let s = ceu('vazio') + estrelas(r, 18, '#dfe6ff');
    s += `<circle cx="250" cy="56" r="40" fill="#0c1422" stroke="#30505c" stroke-width="3"/><circle cx="250" cy="56" r="24" fill="none" stroke="#3ea6a0" stroke-width="2" opacity="0.6"/><circle cx="250" cy="56" r="7" fill="#b4593f" opacity="0.8"/>`;
    return s + `<rect y="100" width="${W}" height="14" fill="#070b14"/>`;
  },
};

/**
 * SVG do cenário. `tipo` é uma das paisagens; `chave` fixa o desenho (id da
 * cena); `luz` vai de 0 a 1.
 */
export function cenario(tipo, chave, luz) {
  uid += 1;
  const pintar = PAISAGENS[tipo] ?? PAISAGENS.vale;
  const r = acaso(`${tipo}:${chave}`);
  const corpo = pintar(r);
  const escuro = (1 - luz) * 0.35;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">${corpo}<rect width="${W}" height="${H}" fill="#04050a" opacity="${escuro.toFixed(2)}"/>${viajante(120 + r() * 60, 101, luz)}</svg>`;
}
