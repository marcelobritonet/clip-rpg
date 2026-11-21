/** A Última Brasa: junta o catálogo, a abertura, os três atos e o Farol. */
import * as base from './base.js';
import * as ato1 from './ato1.js';
import * as ato2 from './ato2.js';
import * as ato3 from './ato3.js';

const partes = [ato1, ato2, ato3];
const juntar = (campo) => Object.assign({}, base[campo], ...partes.map((p) => p[campo] ?? {}));

export const brasa = {
  id: 'brasa',
  nome: 'A Última Brasa',
  resumo: 'O fogo do Farol morreu. Leve uma brasa até o alto do monte antes que ela se apague.',
  atos: ['', 'O Vale', 'A Mata Velha', 'O Cimo', 'O Farol'],
  itens: juntar('itens'),
  companheiros: juntar('companheiros'),
  inimigos: juntar('inimigos'),
  abertura: base.abertura,
  cenas: partes.flatMap((p) => p.cenas),
  desfecho: base.desfecho,
  finais: base.finais,
  quedas: base.quedas,
};
