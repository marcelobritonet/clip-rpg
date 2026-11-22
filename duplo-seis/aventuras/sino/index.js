/** O Sino Afogado: junta o catálogo, a abertura, os três atos e a torre. */
import * as base from './base.js';
import * as ato1 from './ato1.js';
import * as ato2 from './ato2.js';
import * as ato3 from './ato3.js';
import { PASSADOS } from './passados.js';

const partes = [ato1, ato2, ato3];
const juntar = (campo) => Object.assign({}, base[campo], ...partes.map((p) => p[campo] ?? {}));

export const sino = {
  id: 'sino',
  nome: 'O Sino Afogado',
  resumo: 'Um sino toca no fundo do lago seco, e quem ouve dormindo esquece o nome. Desça com a vela da última missa e descubra quem toca.',
  genero: 'Horror',
  atos: ['', 'A Vila Nova', 'A Margem', 'A Cidade Afogada', 'A Torre'],
  inicio: 'Vila Nova da Represa',
  cenarios: ['oratorio', 'vilanova', 'margem', 'afogada', 'torre'],
  passados: PASSADOS,
  relogio: { nome: 'Vela', palavras: ['apagada', 'um pavio fumegando', 'um toco', 'pela metade', 'alta', 'inteira'] },
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
