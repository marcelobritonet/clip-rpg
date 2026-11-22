/** Sons gerados em código (WebAudio). Nenhum arquivo de áudio. */
let ctx = null;
let ligado = true;

try { ligado = localStorage.getItem('duplo-seis-som') !== '0'; } catch { /* sem armazenamento */ }

function audio() {
  if (!ligado) return null;
  const Ctor = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export const somLigado = () => ligado;
export function alternarSom() {
  ligado = !ligado;
  try { localStorage.setItem('duplo-seis-som', ligado ? '1' : '0'); } catch { /* sem armazenamento */ }
  return ligado;
}

function nota(freq, inicio, dur, { tipo = 'sine', vol = 0.12, ate = null } = {}) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime + inicio;
  o.type = tipo;
  o.frequency.setValueAtTime(freq, t);
  if (ate) o.frequency.exponentialRampToValueAtTime(ate, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function estalo(inicio, dur = 0.035, vol = 0.25, grave = 1800) {
  const c = audio();
  if (!c) return;
  const n = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = grave;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(f).connect(g).connect(c.destination);
  s.start(c.currentTime + inicio);
}

/** Vibração curta no celular: o dado pesa na mão. */
function vibrar(padrao) {
  try { if (ligado && !matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate?.(padrao); } catch { /* sem vibração */ }
}

export const som = {
  toque: () => estalo(0, 0.02, 0.12, 2600),
  dados: (quantos = 1) => {
    const batidas = 5 + Math.min(6, quantos * 2);
    for (let i = 0; i < batidas; i++) estalo(i * 0.07 + Math.random() * 0.03, 0.04, 0.22 - i * 0.012, 1200 + Math.random() * 1600);
  },
  pouso: () => { vibrar(10); estalo(0, 0.06, 0.3, 700); nota(140, 0, 0.09, { tipo: 'triangle', vol: 0.1 }); },
  sucesso: () => { nota(523, 0, 0.16, { tipo: 'triangle' }); nota(659, 0.1, 0.16, { tipo: 'triangle' }); nota(784, 0.2, 0.3, { tipo: 'triangle' }); },
  falha: () => { nota(220, 0, 0.25, { tipo: 'sawtooth', vol: 0.07, ate: 130 }); nota(110, 0.12, 0.35, { tipo: 'triangle', vol: 0.1, ate: 80 }); },
  critico: () => { vibrar([30, 50, 30, 50, 80]); [523, 659, 784, 1047, 1319].forEach((f, i) => nota(f, i * 0.08, 0.35, { tipo: 'triangle', vol: 0.11 })); },
  desastre: () => { vibrar([120, 60, 120]); nota(180, 0, 0.5, { tipo: 'sawtooth', vol: 0.09, ate: 50 }); estalo(0.05, 0.3, 0.3, 300); },
  golpe: () => { vibrar(25); estalo(0, 0.09, 0.35, 500); nota(90, 0, 0.12, { tipo: 'square', vol: 0.06, ate: 50 }); },
  brasa: () => { for (let i = 0; i < 4; i++) estalo(i * 0.09 + Math.random() * 0.05, 0.03, 0.08, 3000 + Math.random() * 2000); },
  fim: () => { [392, 494, 587, 784].forEach((f, i) => nota(f, i * 0.18, 0.7, { tipo: 'sine', vol: 0.1 })); },
};
