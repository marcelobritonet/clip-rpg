/**
 * Confere cenas de aventura contra o formato (ver FORMATO.md).
 * Uso em linha de comando: node duplo-seis/aventuras/validar.js brasa/ato1.js
 */
import { tipoDaChave, PERICIAS } from '../regras.js';

const EFEITOS = new Set(['vida', 'sanidade', 'magia', 'brasa', 'lacos', 'item', 'semItem', 'companheiro', 'semCompanheiro', 'marca', 'marco']);
const REQUER = new Set(['nivel', 'antecedente', 'item', 'companheiro', 'marca', 'semMarca', 'lacos']);
const ANTECEDENTES = new Set(['aliado', 'inimigo', 'boaFama', 'maFama', 'recursos', 'semRecursos']);
const lista = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

export function validarCenas({ cenas, itens = {}, companheiros = {}, inimigos = {} }) {
  const erros = [];
  const ids = new Set();
  const tags = new Set(Object.values(itens).flatMap((i) => i.tags ?? []));

  const conferirRequer = (onde, r) => {
    if (!r) return;
    for (const [k, v] of Object.entries(r)) {
      if (!REQUER.has(k)) erros.push(`${onde}: requer desconhecido "${k}"`);
      if (k === 'nivel') for (const c of Object.keys(v)) if (!tipoDaChave(c)) erros.push(`${onde}: chave desconhecida "${c}"`);
      if (k === 'antecedente' && !ANTECEDENTES.has(v)) erros.push(`${onde}: antecedente desconhecido "${v}"`);
      if (k === 'item' && !itens[v]) erros.push(`${onde}: item desconhecido "${v}"`);
      if (k === 'companheiro' && !companheiros[v]) erros.push(`${onde}: companheiro desconhecido "${v}"`);
    }
  };

  const conferirEfeitos = (onde, ef) => {
    if (!ef) return;
    for (const [k, v] of Object.entries(ef)) {
      if (!EFEITOS.has(k)) erros.push(`${onde}: efeito desconhecido "${k}"`);
      if (['vida', 'sanidade', 'magia', 'brasa', 'lacos'].includes(k) && !Number.isInteger(v)) erros.push(`${onde}: ${k} precisa ser inteiro`);
      if (k === 'item' || k === 'semItem') for (const i of lista(v)) if (!itens[i]) erros.push(`${onde}: item desconhecido "${i}"`);
      if (k === 'companheiro' || k === 'semCompanheiro') for (const c of lista(v)) if (!companheiros[c]) erros.push(`${onde}: companheiro desconhecido "${c}"`);
    }
  };

  const conferirDesfecho = (onde, d) => {
    if (!d) { erros.push(`${onde}: falta o desfecho`); return; }
    if (!d.texto) erros.push(`${onde}: falta texto`);
    if (!d.cronica) erros.push(`${onde}: falta cronica`);
    else if (!d.cronica.includes('{nome}')) erros.push(`${onde}: a cronica precisa citar {nome}`);
    conferirEfeitos(onde, d.efeitos);
  };

  for (const c of cenas) {
    const onde = `cena ${c.id}`;
    if (!c.id) erros.push('cena sem id');
    if (ids.has(c.id)) erros.push(`${onde}: id repetido`);
    ids.add(c.id);
    if (!Number.isInteger(c.ato)) erros.push(`${onde}: falta ato`);
    if (!c.titulo || !c.texto) erros.push(`${onde}: falta titulo ou texto`);
    conferirRequer(onde, c.requer);
    conferirEfeitos(onde, c.efeitosAoEntrar);
    const abertas = (c.abordagens ?? []).filter((a) => !a.requer);
    if (abertas.length < 3) erros.push(`${onde}: precisa de 3 abordagens sem "requer" (tem ${abertas.length})`);
    const idsA = new Set();
    for (const a of c.abordagens ?? []) {
      const ondeA = `${onde} / ${a.id}`;
      if (!a.id || idsA.has(a.id)) erros.push(`${ondeA}: id de abordagem faltando ou repetido`);
      idsA.add(a.id);
      if (!a.rotulo) erros.push(`${ondeA}: falta rotulo`);
      conferirRequer(ondeA, a.requer);
      const tipos = ['teste', 'combate', 'livre'].filter((t) => a[t]);
      if (tipos.length !== 1) erros.push(`${ondeA}: precisa de exatamente um entre teste, combate e livre`);
      if (a.teste) {
        if (!tipoDaChave(a.teste.chave)) erros.push(`${ondeA}: chave desconhecida "${a.teste.chave}"`);
        if (!Number.isInteger(a.teste.dificuldade) || a.teste.dificuldade < 2 || a.teste.dificuldade > 25) erros.push(`${ondeA}: dificuldade fora de 2 a 25`);
        if (PERICIAS[a.teste.chave] && !a.requer?.nivel?.[a.teste.chave]) erros.push(`${ondeA}: teste de perícia precisa de requer.nivel na mesma perícia`);
        for (const t of a.ajuda ?? []) if (!tags.has(t)) erros.push(`${ondeA}: nenhuma item tem a tag "${t}"`);
        for (const h of a.ajudantes ?? []) if (!h.nome || !Number.isInteger(h.nivel)) erros.push(`${ondeA}: ajudante precisa de nome e nivel`);
        conferirDesfecho(`${ondeA} sucesso`, a.sucesso);
        conferirDesfecho(`${ondeA} falha`, a.falha);
        if (a.critico) conferirDesfecho(`${ondeA} critico`, a.critico);
        if (a.desastre) conferirDesfecho(`${ondeA} desastre`, a.desastre);
      }
      if (a.combate) {
        if (!inimigos[a.combate]) erros.push(`${ondeA}: inimigo desconhecido "${a.combate}"`);
        conferirDesfecho(`${ondeA} vitoria`, a.vitoria);
        conferirDesfecho(`${ondeA} derrota`, a.derrota);
        conferirDesfecho(`${ondeA} fuga`, a.fuga);
      }
      if (a.livre) {
        conferirDesfecho(`${ondeA} resultado`, a.resultado);
        if (a.custo) conferirEfeitos(`${ondeA} custo`, a.custo);
      }
    }
  }
  for (const [id, i] of Object.entries(inimigos)) {
    for (const k of ['nome', 'ataque', 'defesa', 'vida']) if (i[k] == null) erros.push(`inimigo ${id}: falta ${k}`);
  }
  for (const [id, c] of Object.entries(companheiros)) {
    if (!c.nome || !c.niveis) erros.push(`companheiro ${id}: falta nome ou niveis`);
    for (const k of Object.keys(c.niveis ?? {})) if (!tipoDaChave(k)) erros.push(`companheiro ${id}: chave desconhecida "${k}"`);
  }
  return erros;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const base = await import('./brasa/base.js');
  const alvo = process.argv[2];
  const mod = alvo ? await import(new URL(alvo, import.meta.url)) : { cenas: [] };
  const erros = validarCenas({
    cenas: [...(mod.cenas ?? []), ...(alvo ? [] : [base.abertura, ...base.desfecho])],
    itens: { ...base.itens, ...mod.itens },
    companheiros: { ...base.companheiros, ...mod.companheiros },
    inimigos: { ...base.inimigos, ...mod.inimigos },
  });
  if (erros.length) { console.log(erros.join('\n')); process.exit(1); }
  console.log(`ok: ${alvo ? mod.cenas.length : 1 + base.desfecho.length} cenas`);
}
