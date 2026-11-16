/**
 * Dicas ao passar o mouse: qualquer elemento com `data-dica="<chave>"` mostra
 * um bloco com o resumo do termo (do glossário) e um link para o manual.
 *
 * - Mouse: aparece depois de um instante; dá para mover o mouse até o bloco
 *   e clicar no link.
 * - Teclado: aparece ao focar; Esc fecha.
 * - Toque: o primeiro toque mostra a dica; o segundo segue o link do termo.
 */
import { dica } from '../motor/glossario.js';

const ATRASO_ABRIR = 250;
const ATRASO_FECHAR = 180;
const MARGEM = 12;

const caixa = document.createElement('div');
caixa.className = 'dica';
caixa.id = 'dica';
caixa.setAttribute('role', 'tooltip');
caixa.hidden = true;
document.body.append(caixa);

let alvo = null;
let timerAbrir = 0;
let timerFechar = 0;
let ultimoPonteiro = 'mouse';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function posicionar(el) {
  const r = el.getBoundingClientRect();
  const largura = Math.min(320, window.innerWidth - 2 * MARGEM);
  caixa.style.width = `${largura}px`;
  const altura = caixa.offsetHeight;
  let x = r.left + r.width / 2 - largura / 2;
  x = Math.max(MARGEM, Math.min(x, window.innerWidth - largura - MARGEM));
  const abaixo = r.bottom + 8;
  const cabeAbaixo = abaixo + altura < window.innerHeight - MARGEM;
  const y = cabeAbaixo ? abaixo : Math.max(MARGEM, r.top - altura - 8);
  caixa.dataset.lado = cabeAbaixo ? 'baixo' : 'cima';
  caixa.style.left = `${x}px`;
  caixa.style.top = `${y}px`;
}

function abrir(el) {
  const d = dica(el.dataset.dica);
  if (!d) return;
  clearTimeout(timerFechar);
  if (alvo && alvo !== el) alvo.removeAttribute('aria-describedby');
  alvo = el;
  caixa.innerHTML = `
    <strong class="dica-termo">${esc(d.termo)}</strong>
    <p>${esc(d.resumo)}</p>
    ${d.regra ? `<p class="dica-regra">${esc(d.regra)}</p>` : ''}
    <a class="dica-link" href="../manual/#${d.manual}" data-manual="${d.manual}">Ler no manual →</a>`;
  caixa.hidden = false;
  posicionar(el);
  el.setAttribute('aria-describedby', 'dica');
}

function fechar() {
  clearTimeout(timerAbrir);
  caixa.hidden = true;
  if (alvo) alvo.removeAttribute('aria-describedby');
  alvo = null;
}

const fecharDepois = () => {
  clearTimeout(timerAbrir);
  clearTimeout(timerFechar);
  timerFechar = setTimeout(fechar, ATRASO_FECHAR);
};

document.addEventListener('pointerdown', (e) => { ultimoPonteiro = e.pointerType; }, true);

document.addEventListener('pointerover', (e) => {
  if (e.pointerType === 'touch') return;
  const el = e.target.closest('[data-dica]');
  if (el) {
    clearTimeout(timerFechar);
    if (el === alvo) return;
    clearTimeout(timerAbrir);
    timerAbrir = setTimeout(() => abrir(el), alvo ? 0 : ATRASO_ABRIR);
  } else if (caixa.contains(e.target)) {
    clearTimeout(timerFechar);
  }
});

document.addEventListener('pointerout', (e) => {
  if (e.pointerType === 'touch') return;
  const de = e.target.closest('[data-dica]') || (caixa.contains(e.target) ? caixa : null);
  if (!de) return;
  const para = e.relatedTarget;
  if (para && (de.contains(para) || caixa.contains(para) || (alvo && alvo.contains(para)))) return;
  fecharDepois();
});

document.addEventListener('focusin', (e) => {
  const el = e.target.closest?.('[data-dica]');
  if (el && ultimoPonteiro !== 'touch') abrir(el);
});

document.addEventListener('focusout', (e) => {
  if (caixa.contains(e.relatedTarget) || (alvo && alvo.contains(e.relatedTarget))) return;
  if (alvo && (alvo.contains(e.target) || caixa.contains(e.target))) fecharDepois();
});

// Toque: o primeiro toque num termo mostra a dica em vez de seguir o link.
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-dica]');
  if (ultimoPonteiro === 'touch' && el && el !== alvo && dica(el.dataset.dica)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    abrir(el);
    return;
  }
  if (caixa.contains(e.target)) {
    if (e.target.closest('a')) setTimeout(fechar, 0);
    return;
  }
  if (!el) fechar();
}, true);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !caixa.hidden) {
    fechar();
    e.stopPropagation();
  }
}, true);

window.addEventListener('scroll', () => { if (!caixa.hidden && ultimoPonteiro !== 'touch') fechar(); }, { passive: true });
window.addEventListener('resize', fechar);

/** Chamar depois de redesenhar a ficha: o alvo antigo pode ter sumido. */
export function aposRender() {
  if (alvo && !alvo.isConnected) fechar();
}
