/**
 * Duplo Seis: o idioma da mesa. Sem DOM na importação.
 *
 * O português é o idioma de origem: é o padrão, é o que vale fora do
 * navegador (testes, simulador) e é para onde `t()` cai quando falta uma
 * chave na tradução.
 */
import * as R from './regras.js';
import pt from './textos/pt.js';
import en from './textos/en.js';

export const IDIOMAS = [{ id: 'pt', nome: 'Português' }, { id: 'en', nome: 'English' }];

const DICIONARIOS = { pt, en };
const CHAVE = 'duplo-seis-idioma';
const existe = (id) => Object.hasOwn(DICIONARIOS, id);

let atual = null;

/** Endereço, depois a escolha guardada, depois o idioma do navegador. */
function detectar() {
  // Fora do navegador (Node também tem `navigator`), vale o português.
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'pt';
  try {
    const pedido = new URLSearchParams(window.location.search).get('idioma');
    if (existe(pedido)) return pedido;
  } catch { /* sem endereço */ }
  try {
    const guardado = window.localStorage.getItem(CHAVE);
    if (existe(guardado)) return guardado;
  } catch { /* sem armazenamento */ }
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.language === 'string' && navigator.language) {
      return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    }
  } catch { /* sem navegador */ }
  return 'pt';
}

export function idiomaAtual() {
  atual ??= detectar();
  return atual;
}

/** Troca o idioma ativo e guarda a escolha no aparelho, quando há onde guardar. */
export function definirIdioma(id) {
  if (!existe(id)) return idiomaAtual();
  atual = id;
  try {
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(CHAVE, id);
  } catch { /* sem armazenamento */ }
  return atual;
}

function buscar(dicionario, chave) {
  let x = dicionario;
  for (const parte of String(chave).split('.')) {
    if (x == null || typeof x !== 'object') return undefined;
    x = x[parte];
  }
  return x;
}

const preencher = (texto, vars) => (vars ? texto.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : texto);

/**
 * O texto de uma chave pontuada ('inicio.sentar'), com `{x}` trocado por
 * `vars.x`. Sem tradução, cai no português; sem português, devolve a chave.
 * Listas (escalas de palavras) voltam como estão.
 */
export function t(chave, vars) {
  const achado = buscar(DICIONARIOS[idiomaAtual()], chave) ?? buscar(pt, chave);
  if (achado === undefined) return chave;
  return typeof achado === 'string' ? preencher(achado, vars) : achado;
}

/** Número e palavra no singular ou no plural: plural(3, 'dado') → "3 dados". */
export function plural(n, chave) {
  const formas = t(`plural.${chave}`);
  if (!Array.isArray(formas)) return `${n} ${chave}`;
  return `${n} ${formas[n === 1 ? 0 : 1]}`;
}

const emPortugues = () => idiomaAtual() === 'pt';

/** Nome de um Atributo, Aprimoramento ou Perícia. */
export function nomeDaChave(chave) {
  if (emPortugues()) return R.nomeDaChave(chave);
  return buscar(DICIONARIOS[idiomaAtual()], `nomes.chaves.${chave}`) ?? R.nomeDaChave(chave);
}

/** Nome de um Caminho de Evolução. */
export function nomeDoCaminho(caminho) {
  if (emPortugues()) return R.CAMINHOS[caminho]?.nome ?? caminho;
  return buscar(DICIONARIOS[idiomaAtual()], `nomes.caminhos.${caminho}`) ?? R.CAMINHOS[caminho]?.nome ?? caminho;
}

/** Nome da faixa de Dificuldade (tabela "Definindo Dificuldades"). */
export function nomeDaDificuldade(d) {
  if (emPortugues()) return R.nomeDaDificuldade(d);
  const i = R.DIFICULDADES.findIndex((x) => d <= x.max);
  return buscar(DICIONARIOS[idiomaAtual()], `nomes.dificuldades.${i}`) ?? R.nomeDaDificuldade(d);
}
