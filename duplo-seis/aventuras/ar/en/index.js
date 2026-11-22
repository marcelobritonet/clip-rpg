/** Thin Air: gathers the catalogue, the opening, the three acts and the Core. */
import * as base from './base.js';
import * as ato1 from './ato1.js';
import * as ato2 from './ato2.js';
import * as ato3 from './ato3.js';
import { PASSADOS } from './passados.js';

const partes = [ato1, ato2, ato3];
const juntar = (campo) => Object.assign({}, base[campo], ...partes.map((p) => p[campo] ?? {}));

export const ar = {
  id: 'ar',
  nome: 'Thin Air',
  resumo: 'The station\'s recycler has stopped. Carry the last cartridge from the Green Ring to the Core before the air runs out.',
  genero: 'Science fiction',
  atos: ['', 'The Green Ring', 'The Docks', 'The Spine', 'The Core'],
  inicio: 'Green Ring',
  cenarios: ['anel', 'anel', 'docas', 'eixo', 'nucleo'],
  passados: PASSADOS,
  relogio: { nome: 'Air', palavras: ['gone', 'one last breath', 'thin', 'heavy', 'breathable', 'clean and fresh'] },
  textos: base.textos,
  itens: juntar('itens'),
  companheiros: juntar('companheiros'),
  inimigos: juntar('inimigos'),
  abertura: base.abertura,
  cenas: partes.flatMap((p) => p.cenas),
  desfecho: base.desfecho,
  finais: base.finais,
  quedas: base.quedas,
};
