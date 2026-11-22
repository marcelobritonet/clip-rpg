/** Ar Rarefeito: junta o catálogo, a abertura, os três atos e o Núcleo. */
import * as base from './base.js';
import * as ato1 from './ato1.js';
import * as ato2 from './ato2.js';
import * as ato3 from './ato3.js';
import { PASSADOS } from './passados.js';

const partes = [ato1, ato2, ato3];
const juntar = (campo) => Object.assign({}, base[campo], ...partes.map((p) => p[campo] ?? {}));

export const ar = {
  id: 'ar',
  nome: 'Ar Rarefeito',
  resumo: 'O reciclador da estação parou. Leve o último cartucho do Anel Verde ao Núcleo antes que o ar acabe.',
  genero: 'Ficção científica',
  atos: ['', 'O Anel Verde', 'As Docas', 'O Eixo', 'O Núcleo'],
  inicio: 'Anel Verde',
  cenarios: ['anel', 'anel', 'docas', 'eixo', 'nucleo'],
  passados: PASSADOS,
  relogio: { nome: 'Ar', palavras: ['acabou', 'um último fôlego', 'rarefeito', 'pesado', 'respirável', 'limpo e fresco'] },
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
