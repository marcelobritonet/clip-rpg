/**
 * As aventuras da casa. Cada uma traz cenas, passados, catálogo e finais
 * próprios; as regras são as mesmas. `aventurasPara(idioma)` devolve a lista
 * no idioma pedido, caindo no português quando não há tradução.
 */
import { brasa } from './brasa/index.js';
import { ar } from './ar/index.js';
import { brasa as brasaEn } from './brasa/en/index.js';
import { ar as arEn } from './ar/en/index.js';

const POR_IDIOMA = {
  pt: [brasa, ar],
  en: [brasaEn, arEn],
};

export const aventurasPara = (idioma = 'pt') => POR_IDIOMA[idioma] ?? POR_IDIOMA.pt;

/** A lista em português, para testes e para o simulador. */
export const AVENTURAS = POR_IDIOMA.pt;
