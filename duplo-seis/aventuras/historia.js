/**
 * História viva: a aventura que o jogador cria com uma IA de fora, um ato por
 * vez. Aqui ficam o formato (JSON puro, sem código), a leitura do que foi
 * colado e a conferência. Os prompts ficam em prompt.js.
 *
 * Dois documentos:
 *   duplo-seis/historia@1   o núcleo e o ato 1 (é também o arquivo exportado)
 *   duplo-seis/sequencia@1  o ato seguinte (2 ou 3) ou o final (ato 4)
 */
import * as R from '../regras.js';
import { validarCenas } from './validar.js';
import { PAISAGENS_DISPONIVEIS } from '../cenario.js';

export const FORMATO_HISTORIA = 'duplo-seis/historia@1';
export const FORMATO_SEQUENCIA = 'duplo-seis/sequencia@1';
export const CENAS_POR_ATO = 4;
export const ATOS = 3;
export const PONTOS = 12;
export const ITENS_INICIAIS = 3;

/** Textos de sistema que a história pode trocar; os quatro primeiros são obrigatórios. */
export const TEXTOS_OBRIGATORIOS = ['noite', 'velar', 'velou', 'subir'];
export const TEXTOS = [...TEXTOS_OBRIGATORIOS, 'pausa', 'seguir', 'desmaio', 'desmaioAcompanhado', 'furia', 'furiaSozinho', 'impulso', 'convulsao', 'torpor', 'cronicaDesmaio', 'cronicaSurto'];

const TIPOS_DE_ITEM = ['objeto', 'arma', 'armadura', 'escudo', 'consumivel'];
/** Faixas de efeito: uma IA mão-pesada não pode matar o personagem numa cena. */
const FAIXAS = { vida: [-4, 3], sanidade: [-4, 3], magia: [-3, 3], brasa: [-2, 1], lacos: [-1, 2] };
const LIMITES = { titulo: 70, rotulo: 60, texto: 900, desfecho: 600, cronica: 240, resumo: 260, rumo: 2400, final: 900 };

const ehObjeto = (x) => x != null && typeof x === 'object' && !Array.isArray(x);
const ehTexto = (x) => typeof x === 'string' && x.trim().length > 0;
const lista = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const ID = /^[a-z0-9][a-z0-9-]{0,39}$/;

/* ---------- Ler o que foi colado ---------- */

/**
 * Acha o JSON no meio do que a IA respondeu (cercas de código, frases antes e
 * depois). Devolve `{ doc }` ou `{ erro }`.
 */
export function lerColado(texto) {
  const bruto = String(texto ?? '').trim();
  if (!bruto) return { erro: 'Nada foi colado.' };
  const ini = bruto.indexOf('{');
  const fim = bruto.lastIndexOf('}');
  if (ini < 0 || fim <= ini) return { erro: 'Não achei um JSON no texto colado: ele precisa começar com { e terminar com }. Se a resposta foi cortada no meio, peça à IA para continuar e cole tudo junto.' };
  // Aspas tipográficas fora de lugar são o erro mais comum de quem copia de um chat.
  const corpo = bruto.slice(ini, fim + 1);
  try {
    const doc = JSON.parse(corpo);
    if (!ehObjeto(doc)) return { erro: 'O JSON colado precisa ser um objeto.' };
    return { doc };
  } catch (err) {
    return { erro: `O JSON está quebrado (${err.message}). Costuma ser resposta cortada no meio, vírgula sobrando ou aspas duplas dentro de um texto sem a barra (\\").` };
  }
}

/* ---------- Conferências ---------- */

function conferirCatalogo(doc, erros) {
  for (const campo of ['itens', 'companheiros', 'inimigos']) {
    if (doc[campo] != null && !ehObjeto(doc[campo])) { erros.push(`"${campo}" precisa ser um objeto { id: {...} }`); doc[campo] = {}; }
    for (const id of Object.keys(doc[campo] ?? {})) if (!ID.test(id)) erros.push(`${campo}: id "${id}" precisa ser minúsculo, sem espaço nem acento`);
  }
  for (const [id, i] of Object.entries(doc.itens ?? {})) {
    const onde = `item ${id}`;
    if (!ehObjeto(i)) { erros.push(`${onde}: precisa ser um objeto`); continue; }
    if (!ehTexto(i.nome)) erros.push(`${onde}: falta nome`);
    if (!TIPOS_DE_ITEM.includes(i.tipo)) erros.push(`${onde}: tipo precisa ser um de ${TIPOS_DE_ITEM.join(', ')}`);
    if (i.tipo === 'consumivel') {
      const cura = ehObjeto(i.cura) ? Object.entries(i.cura) : [];
      if (!cura.length || !cura.every(([k, v]) => ['vida', 'sanidade'].includes(k) && /^[12]d6$/.test(v))) erros.push(`${onde}: consumível precisa de cura { "vida": "1d6" } ou { "sanidade": "1d6" }`);
    } else {
      if (!Number.isInteger(i.mod) || i.mod < 0 || i.mod > 2) erros.push(`${onde}: mod precisa ser 0, 1 ou 2`);
      if (i.tags != null && !(Array.isArray(i.tags) && i.tags.every(ehTexto))) erros.push(`${onde}: tags precisa ser uma lista de palavras`);
    }
  }
  for (const [id, c] of Object.entries(doc.companheiros ?? {})) {
    const onde = `companheiro ${id}`;
    if (!ehObjeto(c) || !ehTexto(c.nome) || !ehTexto(c.quem) || !ehObjeto(c.niveis)) { erros.push(`${onde}: precisa de nome, quem e niveis`); if (ehObjeto(c)) c.niveis = ehObjeto(c.niveis) ? c.niveis : {}; continue; }
    for (const [k, n] of Object.entries(c.niveis)) if (!Number.isInteger(n) || n < 1 || n > 3) erros.push(`${onde}: nível de ${k} precisa ser de 1 a 3`);
  }
  for (const [id, i] of Object.entries(doc.inimigos ?? {})) {
    const onde = `inimigo ${id}`;
    if (!ehObjeto(i)) { erros.push(`${onde}: precisa ser um objeto`); continue; }
    if (!ehTexto(i.nome)) erros.push(`${onde}: falta nome`);
    for (const k of ['ataque', 'defesa', 'vida', 'arma', 'armadura', 'resistencia', 'reflexo', 'vontade', 'fe']) {
      if (i[k] == null && !['ataque', 'defesa', 'vida'].includes(k)) continue;
      if (!Number.isInteger(i[k]) || i[k] < 0 || i[k] > (k === 'vida' ? 9 : 4)) erros.push(`${onde}: ${k} precisa ser inteiro de 0 a ${k === 'vida' ? 9 : 4}`);
    }
  }
}

/** Forma das cenas, antes de `validarCenas`: o que veio de fora pode ter qualquer cara. */
function conferirForma(cenas, onde, erros) {
  if (!Array.isArray(cenas)) { erros.push(`"${onde}" precisa ser uma lista de cenas`); return []; }
  const boas = [];
  for (const [n, c] of cenas.entries()) {
    const aqui = `${onde}[${n}]`;
    if (!ehObjeto(c) || !ehTexto(c.id)) { erros.push(`${aqui}: cena sem id`); continue; }
    if (!ID.test(c.id)) erros.push(`cena ${c.id}: id precisa ser minúsculo, sem espaço nem acento`);
    if (!Array.isArray(c.abordagens) || !c.abordagens.every(ehObjeto)) { erros.push(`cena ${c.id}: "abordagens" precisa ser uma lista`); continue; }
    if (c.requer) erros.push(`cena ${c.id}: cena de história não leva "requer" (só as abordagens)`);
    if (ehTexto(c.titulo) && c.titulo.length > LIMITES.titulo) erros.push(`cena ${c.id}: título longo demais`);
    if (ehTexto(c.texto) && c.texto.length > LIMITES.texto) erros.push(`cena ${c.id}: texto longo demais (até ${LIMITES.texto} letras)`);
    let forma = true;
    for (const a of c.abordagens) {
      const ondeA = `cena ${c.id} / ${a.id}`;
      if (!ehTexto(a.id)) { forma = false; continue; }
      if (ehTexto(a.rotulo) && a.rotulo.length > LIMITES.rotulo) erros.push(`${ondeA}: rótulo longo demais`);
      if (a.teste != null && !ehObjeto(a.teste)) { erros.push(`${ondeA}: "teste" precisa ser { chave, dificuldade }`); forma = false; }
      if (a.requer != null && !ehObjeto(a.requer)) { erros.push(`${ondeA}: "requer" precisa ser um objeto`); forma = false; }
      if (a.requer?.nivel != null && !ehObjeto(a.requer.nivel)) { erros.push(`${ondeA}: "requer.nivel" precisa ser { chave: n }`); forma = false; }
      if (a.ajuda != null && !Array.isArray(a.ajuda)) { erros.push(`${ondeA}: "ajuda" precisa ser uma lista de tags`); forma = false; }
      if (a.ajudantes != null && !(Array.isArray(a.ajudantes) && a.ajudantes.every(ehObjeto))) { erros.push(`${ondeA}: "ajudantes" precisa ser uma lista de { nome, nivel }`); forma = false; }
      if (a.teste && !a.requer && (a.teste.dificuldade > 12)) erros.push(`${ondeA}: dificuldade de abordagem aberta vai até 12`);
      if (a.custo != null && !ehObjeto(a.custo)) { erros.push(`${ondeA}: "custo" precisa ser um objeto`); forma = false; }
      for (const d of ['sucesso', 'falha', 'critico', 'desastre', 'vitoria', 'derrota', 'fuga', 'resultado']) {
        const x = a[d];
        if (x == null) continue;
        if (!ehObjeto(x)) { erros.push(`${ondeA} ${d}: precisa ser { texto, cronica, efeitos }`); forma = false; continue; }
        if (x.efeitos != null && !ehObjeto(x.efeitos)) { erros.push(`${ondeA} ${d}: "efeitos" precisa ser um objeto`); forma = false; continue; }
        if (x.texto != null && !ehTexto(x.texto)) { erros.push(`${ondeA} ${d}: texto precisa ser texto`); forma = false; }
        if (x.cronica != null && !ehTexto(x.cronica)) { erros.push(`${ondeA} ${d}: cronica precisa ser texto`); forma = false; }
        if (ehTexto(x.texto) && x.texto.length > LIMITES.desfecho) erros.push(`${ondeA} ${d}: texto longo demais (até ${LIMITES.desfecho} letras)`);
        if (ehTexto(x.cronica) && x.cronica.length > LIMITES.cronica) erros.push(`${ondeA} ${d}: cronica longa demais`);
        for (const [k, v] of Object.entries(x.efeitos ?? {})) {
          const faixa = FAIXAS[k];
          if (faixa && Number.isInteger(v) && (v < faixa[0] || v > faixa[1])) erros.push(`${ondeA} ${d}: ${k} ${v} fora da faixa (${faixa[0]} a ${faixa[1]})`);
          if (k === 'marca' && !lista(v).every((m) => ehTexto(m) && ID.test(m))) erros.push(`${ondeA} ${d}: marca precisa ser uma palavra minúscula`);
        }
      }
    }
    if (c.efeitosAoEntrar != null && !ehObjeto(c.efeitosAoEntrar)) { erros.push(`cena ${c.id}: "efeitosAoEntrar" precisa ser um objeto`); forma = false; }
    if (forma) boas.push(c);
  }
  return boas;
}

/** Todas as marcas que as cenas dadas podem conceder. */
function marcasConcedidas(cenas) {
  const marcas = new Set();
  const ver = (ef) => { for (const m of lista(ef?.marca)) marcas.add(m); };
  for (const c of cenas) {
    ver(c.efeitosAoEntrar);
    for (const a of c.abordagens ?? []) for (const d of ['sucesso', 'falha', 'critico', 'desastre', 'vitoria', 'derrota', 'fuga', 'resultado']) ver(a[d]?.efeitos);
  }
  return marcas;
}

function conferirMarcas(cenas, anteriores, erros) {
  const marcas = new Set([...marcasConcedidas(anteriores), ...marcasConcedidas(cenas)]);
  for (const c of cenas) for (const a of c.abordagens ?? []) {
    for (const m of lista(a.requer?.marca)) if (!marcas.has(m)) erros.push(`cena ${c.id} / ${a.id}: exige a marca "${m}", que nenhuma cena concede`);
  }
  return marcas;
}

function conferirCenas(cenas, catalogo, erros) {
  try {
    erros.push(...validarCenas({ cenas, ...catalogo }));
  } catch (err) {
    erros.push(`cenas com formato inesperado (${err.message})`);
  }
}

function conferirAto(cenas, ato, erros) {
  if (cenas.length !== CENAS_POR_ATO) erros.push(`o ato ${ato} precisa de exatamente ${CENAS_POR_ATO} cenas (veio com ${cenas.length})`);
  for (const c of cenas) if (c.ato !== ato) erros.push(`cena ${c.id}: "ato" precisa ser ${ato}`);
}

function conferirCabecalho(doc, erros) {
  for (const k of ['nome', 'resumo', 'genero', 'inicio', 'rumo']) if (!ehTexto(doc[k])) erros.push(`falta "${k}"`);
  if (ehTexto(doc.resumo) && doc.resumo.length > LIMITES.resumo) erros.push(`"resumo" longo demais (até ${LIMITES.resumo} letras)`);
  if (ehTexto(doc.rumo) && doc.rumo.length > LIMITES.rumo) erros.push(`"rumo" longo demais (até ${LIMITES.rumo} letras)`);
  if (!Array.isArray(doc.atos) || doc.atos.length !== 5 || !doc.atos.slice(1).every(ehTexto)) erros.push('"atos" precisa de 5 nomes: o primeiro vazio (""), depois os três atos e o lugar do final');
  if (!Array.isArray(doc.cenarios) || doc.cenarios.length !== 5 || !doc.cenarios.every((c) => PAISAGENS_DISPONIVEIS.includes(c))) erros.push(`"cenarios" precisa de 5 paisagens (abertura, três atos, final) dentre: ${PAISAGENS_DISPONIVEIS.join(', ')}`);
  const rel = doc.relogio;
  if (!ehObjeto(rel) || !ehTexto(rel.nome) || !Array.isArray(rel.palavras) || rel.palavras.length !== 6 || !rel.palavras.every(ehTexto)) erros.push('"relogio" precisa de { nome, palavras } com 6 palavras, do vazio ao cheio');
  if (!ehObjeto(doc.textos)) erros.push('falta "textos"');
  else {
    for (const k of TEXTOS_OBRIGATORIOS) if (!ehTexto(doc.textos[k])) erros.push(`textos: falta "${k}"`);
    for (const [k, v] of Object.entries(doc.textos)) {
      if (!TEXTOS.includes(k)) erros.push(`textos: chave desconhecida "${k}"`);
      else if (!ehTexto(v)) erros.push(`textos: "${k}" precisa ser texto`);
    }
  }
  const q = doc.quedas;
  if (!ehObjeto(q) || !['morte', 'perdido'].every((k) => ehObjeto(q[k]) && ehTexto(q[k].titulo) && ehTexto(q[k].texto))) erros.push('"quedas" precisa de { morte: { titulo, texto }, perdido: { titulo, texto } }');
}

function conferirFinais(doc, marcas, companheiros, erros) {
  const finais = doc.finais;
  if (!Array.isArray(finais) || finais.length < 3 || finais.length > 6 || !finais.every(ehObjeto)) { erros.push('"finais" precisa de 3 a 6 finais'); return; }
  const ids = new Set();
  for (const [n, f] of finais.entries()) {
    const onde = `final ${f.id ?? n}`;
    if (!ehTexto(f.id) || !ID.test(f.id) || ids.has(f.id)) erros.push(`${onde}: id faltando, repetido ou fora do padrão`);
    ids.add(f.id);
    if (!ehTexto(f.titulo) || !ehTexto(f.texto)) erros.push(`${onde}: falta titulo ou texto`);
    if (ehTexto(f.texto) && f.texto.length > LIMITES.final) erros.push(`${onde}: texto longo demais`);
    if (!Number.isInteger(f.estrelas) || f.estrelas < 0 || f.estrelas > 3) erros.push(`${onde}: estrelas precisa ser de 0 a 3`);
    const ultimo = n === finais.length - 1;
    if (ultimo && f.quando && Object.keys(f.quando).length) erros.push(`${onde}: o último final não pode ter "quando" (é o que sobra)`);
    if (!ultimo && !(ehObjeto(f.quando) && Object.keys(f.quando).length)) erros.push(`${onde}: falta "quando" (só o último fica sem)`);
    for (const [k, v] of Object.entries(ehObjeto(f.quando) ? f.quando : {})) {
      if (['brasa', 'lacos', 'vida'].includes(k)) {
        if (!ehObjeto(v) || !Object.keys(v).length || !Object.entries(v).every(([m, x]) => ['min', 'max'].includes(m) && Number.isInteger(x))) erros.push(`${onde}: "${k}" precisa ser { "min": n } e/ou { "max": n }`);
      } else if (k === 'marca' || k === 'semMarca') {
        for (const m of lista(v)) if (!marcas.has(m)) erros.push(`${onde}: a marca "${m}" não é concedida por nenhuma cena`);
      } else if (k === 'companheiro' || k === 'semCompanheiro') {
        for (const c of lista(v)) if (!companheiros[c]) erros.push(`${onde}: companheiro desconhecido "${c}"`);
      } else erros.push(`${onde}: condição desconhecida "${k}"`);
    }
  }
  if (!finais.some((f) => f.estrelas === 3)) erros.push('finais: precisa haver ao menos um final de 3 estrelas');
}

/** Confere o núcleo e o ato 1 que a IA devolveu ao prompt inicial. */
export function validarHistoria(doc) {
  const erros = [];
  if (!ehObjeto(doc)) return ['o JSON precisa ser um objeto'];
  if (doc.formato !== FORMATO_HISTORIA) erros.push(`"formato" precisa ser "${FORMATO_HISTORIA}"`);
  conferirCabecalho(doc, erros);
  conferirCatalogo(doc, erros);
  const itens = doc.itens ?? {};
  const iniciais = doc.itensIniciais;
  if (!Array.isArray(iniciais) || iniciais.length > ITENS_INICIAIS) erros.push(`"itensIniciais" precisa ser uma lista de até ${ITENS_INICIAIS} ids de itens`);
  else for (const i of iniciais) if (!itens[i]) erros.push(`itensIniciais: item desconhecido "${i}"`);
  if (!ehObjeto(doc.abertura)) erros.push('falta "abertura"');
  const abertura = ehObjeto(doc.abertura) ? conferirForma([doc.abertura], 'abertura', erros) : [];
  if (abertura[0] && abertura[0].ato !== 0) erros.push('abertura: "ato" precisa ser 0');
  const cenas = conferirForma(doc.cenas, 'cenas', erros);
  if (Array.isArray(doc.cenas)) conferirAto(doc.cenas.filter(ehObjeto), 1, erros);
  const catalogo = { itens, companheiros: doc.companheiros ?? {}, inimigos: doc.inimigos ?? {} };
  conferirCenas([...abertura, ...cenas], catalogo, erros);
  conferirMarcas([...abertura, ...cenas], [], erros);
  return [...new Set(erros)];
}

/** Confere a sequência do ato pedido (2, 3, ou 4 para o final) contra a história até aqui. */
export function validarSequencia(doc, historia, ato) {
  const erros = [];
  if (!ehObjeto(doc)) return ['o JSON precisa ser um objeto'];
  if (doc.formato !== FORMATO_SEQUENCIA) erros.push(`"formato" precisa ser "${FORMATO_SEQUENCIA}"`);
  if (doc.ato !== ato) erros.push(`"ato" precisa ser ${ato}`);
  if (doc.rumo != null && !ehTexto(doc.rumo)) erros.push('"rumo" precisa ser texto');
  if (ehTexto(doc.rumo) && doc.rumo.length > LIMITES.rumo) erros.push('"rumo" longo demais');
  conferirCatalogo(doc, erros);
  const catalogo = {};
  for (const campo of ['itens', 'companheiros', 'inimigos']) {
    for (const id of Object.keys(doc[campo] ?? {})) if (historia[campo][id]) erros.push(`${campo}: "${id}" já existe na história; use outro id ou não repita`);
    catalogo[campo] = { ...historia[campo], ...doc[campo] };
  }
  const anteriores = [historia.abertura, ...historia.cenas];
  const final = ato > ATOS;
  const campo = final ? 'desfecho' : 'cenas';
  const cenas = conferirForma(doc[campo], campo, erros);
  if (Array.isArray(doc[campo])) {
    const todas = doc[campo].filter(ehObjeto);
    if (final) {
      if (todas.length < 1 || todas.length > 2) erros.push('"desfecho" precisa de 1 ou 2 cenas');
      for (const c of todas) if (c.ato !== 4) erros.push(`cena ${c.id}: "ato" precisa ser 4`);
    } else conferirAto(todas, ato, erros);
  }
  const usados = new Set(anteriores.map((c) => c.id));
  for (const c of cenas) if (usados.has(c.id)) erros.push(`cena ${c.id}: esse id já foi usado num ato anterior`);
  conferirCenas(cenas, catalogo, erros);
  const marcas = conferirMarcas(cenas, anteriores, erros);
  if (final) conferirFinais(doc, marcas, catalogo.companheiros, erros);
  return [...new Set(erros)];
}

/* ---------- Do documento à aventura que o jogo joga ---------- */

const semAcento = (s) => s.normalize('NFD').replace(/[^\w\s-]/g, '').trim().toLowerCase().replace(/[\s_]+/g, '-').slice(0, 24) || 'historia';

/** Monta a aventura a partir do núcleo conferido e da ficha do criador. */
export function montarHistoria(doc, ficha, { agora = Date.now(), formulario = null } = {}) {
  const passado = { ...ficha, id: 'criador', itens: [...doc.itensIniciais] };
  return {
    formato: FORMATO_HISTORIA,
    id: `h-${semAcento(doc.nome)}-${agora.toString(36)}`,
    ordem: 'escrita',
    criada: new Date(agora).toISOString().slice(0, 10),
    formulario,
    nome: doc.nome,
    resumo: doc.resumo,
    genero: doc.genero,
    inicio: doc.inicio,
    atos: [...doc.atos],
    cenarios: [...doc.cenarios],
    relogio: doc.relogio,
    textos: doc.textos,
    rumo: doc.rumo,
    passados: [passado],
    itens: { ...doc.itens },
    companheiros: { ...doc.companheiros },
    inimigos: { ...doc.inimigos },
    abertura: doc.abertura,
    cenas: [...doc.cenas],
    desfecho: [],
    finais: [],
    quedas: {
      morte: { id: 'morte', titulo: doc.quedas.morte.titulo, estrelas: 0, texto: doc.quedas.morte.texto },
      perdido: { id: 'perdido', titulo: doc.quedas.perdido.titulo, estrelas: 0, texto: doc.quedas.perdido.texto },
    },
  };
}

/** Até onde a história já foi escrita: 1, 2, 3, ou 4 quando tem final. */
export function escritaAte(historia) {
  if (historia.desfecho?.length && historia.finais?.length) return 4;
  for (let ato = ATOS; ato >= 1; ato--) if (historia.cenas.some((c) => c.ato === ato)) return ato;
  return 0;
}

/**
 * Confere um arquivo de história importado (inteira ou pela metade): refaz as
 * mesmas conferências, ato a ato, sobre o que estiver lá.
 */
export function validarArquivo(doc) {
  if (!ehObjeto(doc)) return ['o arquivo precisa ser um objeto JSON'];
  const erros = [];
  if (!Array.isArray(doc.passados) || !doc.passados.length || !doc.passados.every(ehObjeto)) return ['o arquivo não traz o personagem da história ("passados")'];
  if (!Array.isArray(doc.cenas) || !ehObjeto(doc.itens) || !ehObjeto(doc.companheiros ?? {}) || !ehObjeto(doc.inimigos ?? {})) return ['o arquivo não parece uma história do Duplo Seis'];
  const p = doc.passados[0];
  for (const k of ['atributos', 'aprimoramentos', 'pericias', 'antecedentes']) if (p[k] != null && !ehObjeto(p[k])) return [`personagem: "${k}" precisa ser um objeto`];
  if (!ehTexto(p.titulo) || !ehTexto(p.nome)) erros.push('personagem: falta titulo ou nome');
  erros.push(...R.validar(R.novaFicha(p), PONTOS).map((x) => `personagem: ${x}`));
  if (!Array.isArray(p.itens)) erros.push('personagem: falta "itens"');
  const nucleo = { ...doc, formato: FORMATO_HISTORIA, itensIniciais: Array.isArray(p.itens) ? p.itens : [], cenas: doc.cenas.filter((c) => c?.ato === 1) };
  erros.push(...validarHistoria(nucleo));
  if (erros.length) return [...new Set(erros)];
  // Os atos seguintes entram um a um, como entraram na criação.
  const ate = { ...doc, cenas: nucleo.cenas, desfecho: [], finais: [] };
  for (let ato = 2; ato <= ATOS; ato++) {
    const cenas = doc.cenas.filter((c) => c?.ato === ato);
    if (!cenas.length) { if (doc.cenas.some((c) => c?.ato > ato)) erros.push(`falta o ato ${ato}`); break; }
    erros.push(...validarSequencia({ formato: FORMATO_SEQUENCIA, ato, cenas }, ate, ato));
    ate.cenas = [...ate.cenas, ...cenas];
  }
  if (doc.desfecho?.length || doc.finais?.length) {
    if (escritaAte({ ...ate, desfecho: [], finais: [] }) < ATOS) erros.push('o arquivo tem final mas faltam atos');
    else erros.push(...validarSequencia({ formato: FORMATO_SEQUENCIA, ato: 4, desfecho: doc.desfecho, finais: doc.finais }, ate, 4));
  }
  return [...new Set(erros)];
}

/** Um arquivo importado vira aventura: só os campos conhecidos, com id próprio. */
export function daImportacao(doc, { agora = Date.now() } = {}) {
  const p = doc.passados[0];
  const base = montarHistoria({ ...doc, itensIniciais: p.itens }, p, { agora, formulario: null });
  base.passados = [{ id: 'criador', titulo: p.titulo, nome: p.nome, quem: p.quem ?? '', motivo: p.motivo ?? '', caminho: R.caminhoDominante(R.novaFicha(p)), atributos: { ...p.atributos }, aprimoramentos: { ...p.aprimoramentos }, pericias: { ...p.pericias }, antecedentes: { ...p.antecedentes }, itens: [...p.itens] }];
  base.cenas = [...doc.cenas];
  base.desfecho = doc.desfecho?.length ? [...doc.desfecho] : [];
  base.finais = doc.finais?.length ? doc.finais.map((f) => ({ id: f.id, titulo: f.titulo, estrelas: f.estrelas, texto: f.texto, ...(f.quando ? { quando: f.quando } : {}) })) : [];
  return base;
}
