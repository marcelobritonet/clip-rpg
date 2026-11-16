/**
 * Carrega um .md do repositório e o transforma em HTML com âncoras. Usado
 * pelo manual (README.md) e pelas novidades (CHANGELOG.md).
 *
 * Precisa do `marked` carregado antes (script global).
 */
import { slug } from '../motor/clip.js';

const REPO = 'https://raw.githubusercontent.com/marcelobritonet/clip-rpg/master/';

/**
 * Local (servidor estático), lê o arquivo do próprio repositório. No GitHub
 * Pages o Jekyll transforma o .md em página, então lê a versão publicada.
 */
export async function carregar(arquivo) {
  for (const url of [`../${arquivo}`, REPO + arquivo]) {
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      const tipo = r.headers.get('content-type') || '';
      if (r.ok && !tipo.includes('html')) return await r.text();
    } catch { /* tenta a próxima fonte */ }
  }
  throw new Error(`${arquivo} indisponível`);
}

/** Texto do próprio item de lista, sem as sublistas. */
function textoProprio(el) {
  let t = '';
  for (const n of el.childNodes) {
    if (n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName)) continue;
    t += n.textContent;
  }
  return t.trim();
}

/** Dá id a títulos e itens de lista (o mesmo `slug` usado pelo motor). */
export function ancorar(raiz) {
  const usados = new Set();
  const unico = (base) => {
    let id = base;
    let i = 2;
    while (usados.has(id)) id = `${base}-${i++}`;
    usados.add(id);
    return id;
  };
  for (const el of raiz.querySelectorAll('h1, h2, h3, h4, h5, h6, li')) {
    const texto = el.tagName === 'LI' ? textoProprio(el) : el.textContent.trim();
    const base = slug(texto);
    if (!base) continue;
    el.id = unico(base);
    if (el.tagName !== 'LI') {
      const a = document.createElement('a');
      a.href = `#${el.id}`;
      a.className = 'ancora-link';
      a.textContent = '#';
      a.setAttribute('aria-label', `Link para ${texto}`);
      el.append(a);
    }
  }
}

/** Renderiza o .md dentro de `destino`, com links .md apontando ao GitHub. */
export async function renderizar(arquivo, destino) {
  destino.innerHTML = window.marked.parse(await carregar(arquivo));
  for (const a of destino.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (/^\.?\/?[\w-]+\.md$/.test(href)) a.href = `https://github.com/marcelobritonet/clip-rpg/blob/master/${href.replace(/^\.?\//, '')}`;
  }
  ancorar(destino);
}

/** Rola até o elemento do hash e o destaca por um instante. */
export function irParaHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const el = id && document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: 'start' });
  el.classList.add('destaque');
  setTimeout(() => el.classList.remove('destaque'), 1600);
}
