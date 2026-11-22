/** The Last Ember: gathers the catalogue, the opening, the three acts and the Beacon. */
import * as base from './base.js';
import * as ato1 from './ato1.js';
import * as ato2 from './ato2.js';
import * as ato3 from './ato3.js';
import { PASSADOS } from './passados.js';

const partes = [ato1, ato2, ato3];
const juntar = (campo) => Object.assign({}, base[campo], ...partes.map((p) => p[campo] ?? {}));

export const brasa = {
  id: 'brasa',
  nome: 'The Last Ember',
  resumo: 'The fire at the Beacon has died. Carry an ember to the top of the mountain before it goes out.',
  genero: 'Fantasy',
  atos: ['', 'The Valley', 'The Old Wood', 'The Top', 'The Beacon'],
  inicio: 'Bellford',
  cenarios: ['vila', 'vale', 'mata', 'cimo', 'farol'],
  passados: PASSADOS,
  relogio: { nome: 'Ember', palavras: ['ash', 'one red speck', 'faint', 'alive', 'strong', 'fat and bright'] },
  textos: {
    velar: 'Watch over the ember',
    velou: 'You watch over the ember all night long.',
    subir: 'Climb to the Beacon',
    pausa: 'Camp',
    seguir: 'Move on',
    desmaio: 'Everything goes dark. When you open your eyes, the ember is smaller and the world hurts.',
    desmaioAcompanhado: 'Everything goes dark. You wake to find {quem} holding the lantern and your head.',
    furia: 'Something snaps. When your sight returns, your hands are clenched and aching, and someone is backing away from you, afraid.',
    furiaSozinho: 'Something snaps. When your sight returns, your knuckles are skinned raw on the bark of a tree that never did you any harm.',
    impulso: 'You run. From what, you could not say. You drop whatever is heavy, laugh out loud, run some more. When you stop, something is missing from your bag.',
    convulsao: 'The ground comes up. Your body shakes by itself, your teeth rattle, your tongue bleeds. It passes. It takes a while, but it passes.',
    torpor: 'You sit down. Just for a moment. The lantern burns beside you while you stare at nothing, for a long time.',
    noite: 'You find a sheltered corner and light a small fire beside the lantern. The ember eats the night slowly.',
    cronicaDesmaio: '{nome} fell senseless and woke to a smaller ember.',
    cronicaSurto: '{nome} came unmoored for a while, and does not care to remember it.',
  },
  itens: juntar('itens'),
  companheiros: juntar('companheiros'),
  inimigos: juntar('inimigos'),
  abertura: base.abertura,
  cenas: partes.flatMap((p) => p.cenas),
  desfecho: base.desfecho,
  finais: base.finais,
  quedas: base.quedas,
};
