/**
 * Um jogador automático, para medir a mesa. Usa só a mesma interface que a
 * tela usa (opcoes, escolher, insistir, lutar, comprar, repousar, continuar).
 *
 * Perfis: 'atento' escolhe pela melhor chance; 'teimoso' só anda pelo próprio
 * Caminho; 'acaso' sorteia.
 */
import * as J from './jogo.js';
import * as R from './regras.js';
import { fluxo, prox } from './rng.js';

export const chance = J.chanceDeSucesso;

function avaliar(e, o, perfil, r) {
  if (!o.disponivel) return { nota: -1 };
  if (perfil === 'acaso') return { nota: prox(r), extras: {} };
  if (o.tipo === 'livre') return { nota: o.especial ? 1.2 : 0.35, extras: {} };
  if (o.tipo === 'combate') {
    const v = R.valores(e.ficha);
    return { nota: v.ataqueCurta >= 2 && e.vida >= 6 ? 0.5 : 0.05, extras: {} };
  }
  if (o.magica) return { nota: chance(o.maxPM, o.dificuldade) * 0.95, extras: { pm: o.maxPM } };
  const objeto = [...o.objetos].sort((a, b) => b.mod - a.mod)[0];
  const dados = o.nivel + (objeto?.mod ?? 0) + o.aliados.reduce((s, a) => s + a.nivel, 0);
  let nota = chance(dados, o.dificuldade);
  // Insistir vale alguma coisa para quem tem Vida sobrando.
  if (o.caminho === 'corpo' && o.nivel > 0 && e.vida >= 7) nota = Math.min(1, nota + 0.15);
  if (perfil === 'teimoso' && o.caminho !== R.caminhoDominante(e.ficha)) nota *= 0.2;
  return { nota, extras: { objeto: objeto?.id, unir: o.aliados.map((a) => a.id) } };
}

function gastarPontos(e) {
  const dom = R.caminhoDominante(e.ficha);
  for (let i = 0; i < 12 && e.pontos > 0; i++) {
    const lojas = J.compras(e).filter((l) => l.pode);
    if (!lojas.length) break;
    // Primeiro o que aguenta a viagem; depois o próprio Caminho.
    const pesos = lojas.map((l) => {
      let p = l.caminho === dom ? 3 : 1;
      if (l.tipo === 'atributo') p += 2 - l.nivel * 0.5;
      if (l.chave === 'saude' && e.max.vida < 9) p += 4;
      if ((l.chave === 'vontade' || l.chave === 'fe') && e.max.sanidade < 9) p += 3;
      return [l, p];
    });
    pesos.sort((a, b) => b[1] - a[1]);
    J.comprar(e, pesos[0][0].chave);
  }
}

/** Joga uma sessão inteira e devolve o estado final. */
export function jogar({ semente, passado, aventura, perfil = 'atento', limite = 400 }) {
  const e = J.nova({ semente, passado, aventura });
  const r = fluxo(semente, 'robo', perfil);
  for (let passo = 0; passo < limite && e.fase !== 'fim'; passo++) {
    if (e.fase === 'cena') {
      // Trata-se antes de escolher, se dá.
      if (e.vida <= e.max.vida / 2) { J.curar(e); if (e.itens.includes('unguento')) J.usar(e, 'unguento'); }
      if (e.sanidade <= e.max.sanidade / 2 && e.itens.includes('cha')) J.usar(e, 'cha');
      const ops = J.opcoes(e).map((o) => ({ o, ...avaliar(e, o, perfil, r) })).sort((a, b) => b.nota - a.nota);
      J.escolher(e, ops[0].o.id, ops[0].extras);
    } else if (e.fase === 'insistir') {
      J.insistir(e, perfil !== 'acaso' ? e.vida - e.rolagem.custoInsistir >= 4 : prox(r) < 0.5);
    } else if (e.fase === 'combate') {
      const acoes = J.acoesDeCombate(e);
      const fraco = e.vida <= 2 || (e.combate.inimigo.mental && e.sanidade <= 2);
      if (fraco && e.combate.rodada >= 1) J.lutar(e, 'recuar');
      else {
        const a = acoes.find((x) => x.id === 'magia') ?? acoes.find((x) => x.id === 'atirar' && x.ataque > acoes[0].ataque) ?? acoes[0];
        J.lutar(e, a.id, { pm: a.maxPM });
      }
    } else if (e.fase === 'acampamento') {
      gastarPontos(e);
      const falta = { feridas: 1 - e.vida / e.max.vida, cabeca: 1 - e.sanidade / e.max.sanidade, brasa: e.brasa <= 4 ? 0.45 : 0.2 };
      J.repousar(e, Object.entries(falta).sort((a, b) => b[1] - a[1])[0][0]);
      J.continuar(e);
    } else {
      J.continuar(e);
    }
  }
  return e;
}
