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

if (import.meta.url === `file://${process.argv[1]}`) {
  const [pasta = 'brasa', idioma = 'en', arquivo] = process.argv.slice(2);
  const nome = arquivo ?? 'index.js';
  const original = await import(new URL(`./${pasta}/${nome}`, import.meta.url));
  const traducao = await import(new URL(`./${pasta}/${idioma}/${nome}`, import.meta.url));
  const erros = diferencas({ ...original }, { ...traducao });
  if (erros.length) { console.log(erros.slice(0, 60).join('\n')); console.log(`${erros.length} diferenças`); process.exit(1); }
  console.log(`ok: ${pasta}/${idioma}/${nome} tem a mesma mecânica`);
}
