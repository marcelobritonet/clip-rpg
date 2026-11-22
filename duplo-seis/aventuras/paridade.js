/**
 * Confere que uma tradução tem exatamente a mesma mecânica do original:
 * mesmos ids, testes, dificuldades, efeitos e requisitos. Só o texto muda.
 * Uso: node aventuras/paridade.js brasa en
 */
const TEXTO = new Set(['texto', 'cronica', 'rotulo', 'titulo', 'nome', 'quem', 'motivo', 'resumo', 'genero', 'inicio']);
const SO_TEXTO = new Set(['textos', 'atos', 'palavras']);

export function diferencas(a, b, onde = '') {
  const erros = [];
  if (typeof a === 'function' && typeof b === 'function') {
    if (a.toString() !== b.toString()) erros.push(`${onde}: função diferente`);
    return erros;
  }
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    if (a !== b) erros.push(`${onde}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
    return erros;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return [`${onde}: tipos diferentes`];
  const chaves = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of chaves) {
    const aqui = onde ? `${onde}.${k}` : k;
    if (!(k in a) || !(k in b)) { erros.push(`${aqui}: só existe de um lado`); continue; }
    if (SO_TEXTO.has(k)) {
      // A tradução pode trazer textos a mais (os de sistema), nunca a menos.
      const faltam = Object.keys(a[k]).filter((x) => !(x in b[k]));
      if (faltam.length) erros.push(`${aqui}: faltam ${faltam.join(', ')}`);
      continue;
    }
    if (TEXTO.has(k) && typeof a[k] === 'string') {
      if (typeof b[k] !== 'string' || !b[k].trim()) erros.push(`${aqui}: tradução vazia`);
      else if ((a[k].match(/\{\w+\}/g) ?? []).sort().join() !== (b[k].match(/\{\w+\}/g) ?? []).sort().join()) erros.push(`${aqui}: marcadores {…} diferentes`);
      continue;
    }
    erros.push(...diferencas(a[k], b[k], aqui));
  }
  return erros;
}

/**
 * Cenas novas podem nascer só em português e esperar a tradução (pendência
 * 8.11). Tira do original o que a tradução ainda não tem (cenas, itens,
 * companheiros, inimigos) e devolve a lista do que ficou de fora. As cenas
 * novas entram no fim de cada ato, então a ordem das antigas não muda.
 */
export function alinhar(original, traducao) {
  if (!Array.isArray(original?.cenas) || !Array.isArray(traducao?.cenas)) return { original, pendentes: [] };
  const ids = new Set(traducao.cenas.map((c) => c.id));
  const pendentes = original.cenas.filter((c) => !ids.has(c.id)).map((c) => c.id);
  const alinhado = { ...original, cenas: original.cenas.filter((c) => ids.has(c.id)) };
  for (const campo of ['itens', 'companheiros', 'inimigos']) {
    if (!original[campo] || !traducao[campo]) continue;
    const sobra = Object.keys(original[campo]).filter((k) => !(k in traducao[campo]));
    pendentes.push(...sobra.map((k) => `${campo}.${k}`));
    alinhado[campo] = Object.fromEntries(Object.entries(original[campo]).filter(([k]) => k in traducao[campo]));
  }
  return { original: alinhado, pendentes };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [pasta = 'brasa', idioma = 'en', arquivo] = process.argv.slice(2);
  const nome = arquivo ?? 'index.js';
  const original = await import(new URL(`./${pasta}/${nome}`, import.meta.url));
  const traducao = await import(new URL(`./${pasta}/${idioma}/${nome}`, import.meta.url));
  const o = { ...original }, tr = { ...traducao };
  const pendentes = [];
  for (const k of Object.keys(o)) {
    if (!tr[k]) continue;
    if (Array.isArray(o[k]) && k === 'cenas') {
      const r = alinhar({ cenas: o[k] }, { cenas: tr[k] }); o[k] = r.original.cenas; pendentes.push(...r.pendentes);
    } else if (['itens', 'companheiros', 'inimigos'].includes(k)) {
      const sobra = Object.keys(o[k]).filter((x) => !(x in tr[k]));
      pendentes.push(...sobra.map((x) => `${k}.${x}`));
      o[k] = Object.fromEntries(Object.entries(o[k]).filter(([x]) => x in tr[k]));
    } else if (o[k] && typeof o[k] === 'object' && Array.isArray(o[k].cenas)) {
      const r = alinhar(o[k], tr[k]); o[k] = r.original; pendentes.push(...r.pendentes);
    }
  }
  const erros = diferencas(o, tr);
  if (pendentes.length) console.log(`só em português, esperando tradução (8.11): ${pendentes.join(', ')}`);
  if (erros.length) { console.log(erros.slice(0, 60).join('\n')); console.log(`${erros.length} diferenças`); process.exit(1); }
  console.log(`ok: ${pasta}/${idioma}/${nome} tem a mesma mecânica`);
}
