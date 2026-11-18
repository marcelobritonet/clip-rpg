import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as clip from '../motor/clip.js';
import * as J from '../crawler/jogo.js';
import { TEMAS, LISTA_TEMAS } from '../crawler/temas.js';
import { fluxo, prox, hash } from '../crawler/rng.js';
import { T, gerarAndar, visao, tile, primeiroPasso } from '../crawler/mapa.js';
import { jogarPartida, novoRobo, passo } from '../crawler/robo.js';

const ORIGENS = ['corpo', 'mente', 'espirito'];

/** Copia o que importa do estado para comparar duas partidas. */
const retrato = (e) => JSON.stringify({
  tiles: e.mapa.tiles, salas: e.mapa.salas, jogador: e.jogador, vida: e.vida, san: e.san, turno: e.turno, andar: e.andar,
  entidades: e.entidades.map(({ id, tipo, especie, x, y, vida, aparencia }) => ({ id, tipo, especie, x, y, vida, aparencia })),
  objetos: e.objetos.map(({ id, tipo, x, y, real, usado }) => ({ id, tipo, x, y, real, usado })),
  log: e.log.map((m) => m.texto),
});

test('sorteio com semente é estável e independente por fluxo', () => {
  const a = fluxo('abc', 'mapa', 1);
  const b = fluxo('abc', 'mapa', 1);
  const c = fluxo('abc', 'mapa', 2);
  const la = Array.from({ length: 20 }, () => prox(a));
  assert.deepEqual(la, Array.from({ length: 20 }, () => prox(b)));
  assert.notDeepEqual(la, Array.from({ length: 20 }, () => prox(c)));
  assert.ok(la.every((x) => x >= 0 && x < 1));
  assert.equal(hash('x'), hash('x'));
});

test('a mesma semente gera o mesmo andar, em qualquer tema', () => {
  for (const tema of LISTA_TEMAS) {
    for (let a = 1; a <= J.PARAM.andares; a++) {
      const x = J.gerarConteudoDoAndar('semente-teste', tema, a);
      const y = J.gerarConteudoDoAndar('semente-teste', tema, a);
      assert.deepEqual(x, y, `${tema} andar ${a}`);
    }
  }
  const outro = J.gerarConteudoDoAndar('outra-semente', 'sanatorio', 1);
  assert.notDeepEqual(outro.mapa.tiles, J.gerarConteudoDoAndar('semente-teste', 'sanatorio', 1).mapa.tiles);
});

test('a mesma semente e as mesmas ações geram a mesma partida (robô do começo ao fim)', () => {
  for (const origem of ORIGENS) {
    const r1 = jogarPartida({ semente: 'repetir', tema: 'masmorra', origem });
    const r2 = jogarPartida({ semente: 'repetir', tema: 'masmorra', origem });
    assert.deepEqual(r1, r2, origem);
  }
  const a = J.novaPartida({ semente: 's1', tema: 'zumbi', origem: 'mente' });
  const b = J.novaPartida({ semente: 's1', tema: 'zumbi', origem: 'mente' });
  const ra = novoRobo('atento', 's1');
  const rb = novoRobo('atento', 's1');
  for (let i = 0; i < 300; i++) { passo(ra, a); passo(rb, b); }
  assert.equal(retrato(a), retrato(b));
});

test('o andar é conexo: dá para ir da entrada até a saída', () => {
  for (const tema of LISTA_TEMAS) {
    for (let s = 0; s < 15; s++) {
      for (let a = 1; a <= J.PARAM.andares; a++) {
        const c = J.gerarConteudoDoAndar('conexo-' + s, tema, a);
        const saida = c.objetos.find((o) => o.tipo === 'escada' || o.tipo === 'saida');
        assert.ok(saida, 'tem saída');
        assert.equal(saida.tipo, a === J.PARAM.andares ? 'saida' : 'escada');
        const p = primeiroPasso(c.mapa.w, c.mapa.h, c.inicio, (x, y) => tile(c.mapa, x, y) !== T.PAREDE, (x, y) => x === saida.x && y === saida.y, 1e6);
        assert.ok(p, `${tema} ${s} andar ${a}: saída alcançável`);
      }
    }
  }
});

test('as origens são fichas válidas pelo motor, com 10 Pontos de Evolução', () => {
  for (const tema of LISTA_TEMAS) {
    for (const origem of ORIGENS) {
      const f = J.fichaDaOrigem(origem, tema);
      const erros = clip.validar(f).filter((p) => p.nivel === 'erro');
      assert.deepEqual(erros, [], `${tema}/${origem}`);
      assert.equal(clip.pontosGastos(f).total, 10);
      assert.equal(clip.caminhoDominante(f).id, origem);
    }
  }
});

test('Vida e Sanidade do jogo partem dos valores do motor (com os desvios de PARAM)', () => {
  const e = J.novaPartida({ semente: 'v', tema: 'sanatorio', origem: 'espirito' });
  const v = clip.valores(e.ficha);
  const d = J.derivados(e);
  assert.equal(d.vidaMax, v.vida.valor + J.PARAM.bonusVida);
  assert.equal(d.sanMax, J.PARAM.sanidade(v.sanidade.valor));
  assert.equal(e.vida, d.vidaMax);
  assert.equal(e.san, d.sanMax);
  // Espírito resiste mais à loucura que Corpo, como no manual.
  const corpo = J.derivados(J.novaPartida({ semente: 'v', tema: 'sanatorio', origem: 'corpo' }));
  assert.ok(d.sanMax > corpo.sanMax);
  assert.ok(corpo.vidaMax > d.vidaMax);
});

test('lucidez segue as faixas de descrever do motor', () => {
  assert.equal(J.nivelLucidez(10, 10), 0);
  assert.equal(J.nivelLucidez(8, 10), 1);
  assert.equal(J.nivelLucidez(5, 10), 2);
  assert.equal(J.nivelLucidez(3, 10), 3);
  assert.equal(J.nivelLucidez(1, 10), 4);
  assert.equal(J.nivelLucidez(0, 10), 5);
});

test('percebido não vaza a verdade fora do modo de depuração', () => {
  const e = J.novaPartida({ semente: 'p', tema: 'zumbi', origem: 'corpo' });
  e.san = 3;
  for (let i = 0; i < 200 && !e.fim; i++) J.agir(e, { tipo: 'esperar' });
  const p = J.percebido(e);
  const texto = JSON.stringify(p);
  for (const chave of ['"verdade"', '"numeros"', '"real"']) assert.ok(!texto.includes(chave), chave);
  assert.ok(!/"(vida|san|pm)":\d/.test(texto), 'sem números de Vida, Sanidade ou PM');
  assert.ok(typeof p.estado.vida === 'string' && typeof p.estado.sanidade === 'string');
  e.depurar = true;
  assert.ok(J.percebido(e).numeros);
});

test('com Sanidade baixa o mundo mente: vultos, miragens e disfarces aparecem', () => {
  let fantasmas = 0, miragens = 0, disfarces = 0;
  for (let s = 0; s < 6; s++) {
    const e = J.novaPartida({ semente: 'louco-' + s, tema: 'masmorra', origem: 'corpo' });
    const robo = novoRobo('ingenuo', 'x' + s);
    for (let i = 0; i < 300 && !e.fim; i++) {
      if (e.san > 3 && e.surto === 0) e.san = 3; // mantém a cabeça ruim
      passo(robo, e);
    }
    fantasmas += e.stats.fantasmasCriados;
    miragens += e.stats.miragensCriadas;
    disfarces += e.stats.disfarcesCriados;
  }
  assert.ok(fantasmas > 0 && miragens > 0 && disfarces > 0, `${fantasmas}/${miragens}/${disfarces}`);
});

test('lúcido, nada mente', () => {
  const e = J.novaPartida({ semente: 'lucido', tema: 'sanatorio', origem: 'espirito' });
  const robo = novoRobo('ingenuo', 'l');
  for (let i = 0; i < 150 && !e.fim; i++) {
    e.san = J.derivados(e).sanMax;
    passo(robo, e);
  }
  assert.equal(e.stats.fantasmasCriados + e.stats.miragensCriadas + e.stats.disfarcesCriados, 0);
});

/** Partida com um único monstro ou aliado colado no jogador, num andar limpo. */
function cena({ origem = 'corpo', tipo = 'monstro', especie, aparencia = null, fantasma = false, lucidez = 0.6 } = {}) {
  const e = J.novaPartida({ semente: 'cena', tema: 'sanatorio', origem });
  e.entidades = [];
  e.objetos = e.objetos.filter((o) => o.tipo === 'escada');
  const { x, y } = e.jogador;
  const th = TEMAS.sanatorio;
  const base = th.monstros.find((m) => m.id === especie) ?? th.aliados.find((m) => m.id === especie);
  const ent = {
    id: 'alvo', tipo: fantasma ? 'fantasma' : tipo, especie: base.id, categoria: base.categoria ?? 'aliado', x: x + 1, y,
    ataque: base.ataque ?? 1, defesa: base.defesa ?? 1, vida: base.vida ?? 6, vidaMax: base.vida ?? 6, arma: base.arma ?? 1, vontade: base.vontade ?? 1, mental: base.mental ?? 0,
    estado: 'parado', aparencia, ttl: 40, decidido: true,
  };
  // Abalado (sem isso, lúcido, o mundo se assenta e desfaz vultos e disfarces).
  e.san = Math.ceil(J.derivados(e).sanMax * lucidez);
  e.mapa.tiles[y * e.mapa.w + x + 1] = T.CHAO;
  e.entidades.push(ent);
  J.agir(e, { tipo: 'esperar' });
  e.vida = J.derivados(e).vidaMax;
  return { e, ent };
}

test('bater num vulto custa Sanidade e o desfaz', () => {
  const { e } = cena({ especie: 'enfermeiro', fantasma: true });
  const antes = e.san;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.stats.golpesNoVazio, 1);
  assert.ok(!e.entidades.some((x) => x.id === 'alvo'));
  assert.ok(e.san < antes || e.san === 0);
  assert.ok(e.pistas.includes('vazio'));
});

test('atacar um aliado com cara de monstro tem consequência e se descobre', () => {
  const { e, ent } = cena({ tipo: 'aliado', especie: 'lucida', aparencia: { especie: 'enfermeiro', categoria: 'humano' } });
  ent.vida = 99; // garante que sobrevive ao golpe
  let tent = 0;
  while (!ent.ferido && tent++ < 30) J.agir(e, { tipo: 'mover', dx: ent.x - e.jogador.x, dy: ent.y - e.jogador.y });
  assert.ok(ent.ferido, 'acertou o aliado');
  assert.equal(ent.aparencia, null, 'o disfarce caiu');
  assert.equal(ent.estado, 'fugindo');
  assert.ok(e.log.some((m) => m.texto.includes('Pare! Sou eu, a Ilda!')));
  assert.ok(e.diario.some((d) => d.texto.includes('Feriu')));
  assert.ok(e.pistas.includes('grito'));
  // Ferido, não ajuda mais.
  ent.estado = 'parado';
  ent.x = e.jogador.x + 1; ent.y = e.jogador.y;
  J.agir(e, { tipo: 'falar', alvo: ent.id });
  assert.ok(e.log.at(-1).texto.includes('recua de você') || e.log.some((m) => m.texto.includes('recua de você')));
});

test('falar antes de bater desmascara o aliado e rende ajuda', () => {
  const { e, ent } = cena({ origem: 'espirito', tipo: 'aliado', especie: 'faxineiro', aparencia: { especie: 'guarda', categoria: 'humano' } });
  const itens = e.inventario.length;
  J.agir(e, { tipo: 'falar', alvo: ent.id });
  assert.equal(ent.aparencia, null);
  assert.ok(ent.usado);
  assert.equal(e.inventario.length, itens + 1);
});

test('monstro disfarçado de aliado embosca quem chega perto', () => {
  const { e, ent } = cena({ especie: 'enfermeiro', aparencia: { especie: 'faxineiro', categoria: 'aliado' } });
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.stats.emboscadas, 1);
  assert.equal(ent.aparencia, null);
  assert.ok(e.pistas.includes('aproxima'));
});

test('olhar de novo (Mente) desfaz um vulto quase sempre', () => {
  let desfeitos = 0;
  for (let i = 0; i < 20; i++) {
    const { e } = cena({ origem: 'mente', especie: 'guarda', fantasma: true });
    e.rDados = fluxo('olhar', i);
    e.san = Math.ceil(J.derivados(e).sanMax * 0.6); // Abalado
    J.agir(e, { tipo: 'olhar', alvo: 'alvo' });
    if (!e.entidades.some((x) => x.id === 'alvo')) desfeitos++;
  }
  assert.ok(desfeitos >= 16, `${desfeitos}/20`);
});

test('encarar com fé (Espírito) espanta bestas e desfaz assombros', () => {
  let ok = 0;
  for (let i = 0; i < 20; i++) {
    const { e, ent } = cena({ origem: 'espirito', especie: i % 2 ? 'rato' : 'semrosto' });
    e.rDados = fluxo('encarar', i);
    J.agir(e, { tipo: 'encarar', alvo: ent.id });
    if (ent.estado === 'fugindo' || ent.vida <= 0) ok++;
  }
  assert.ok(ok >= 15, `${ok}/20`);
});

test('convencer (Presença) só funciona com gente', () => {
  const { e, ent } = cena({ origem: 'espirito', especie: 'rato' });
  J.agir(e, { tipo: 'falar', alvo: ent.id });
  assert.notEqual(ent.estado, 'pacificado');
  let ok = 0;
  for (let i = 0; i < 20; i++) {
    const c = cena({ origem: 'espirito', especie: 'enfermeiro' });
    c.e.rDados = fluxo('convencer', i);
    J.agir(c.e, { tipo: 'falar', alvo: c.ent.id });
    if (c.ent.estado === 'pacificado') ok++;
  }
  assert.ok(ok >= 12, `${ok}/20`);
});

test('sem Sanidade, o personagem perde o controle e volta com cicatriz', () => {
  const e = J.novaPartida({ semente: 'surto', tema: 'zumbi', origem: 'mente' });
  e.entidades = [];
  const max = J.derivados(e).sanMax;
  e.san = 0;
  J.agir(e, { tipo: 'esperar' });
  assert.equal(e.surtos, 1);
  for (let i = 0; i < J.PARAM.surto.turnos; i++) J.agir(e, { tipo: 'esperar' });
  assert.equal(e.surto, 0);
  assert.equal(J.derivados(e).sanMax, max - J.PARAM.surto.cicatriz);
  assert.ok(e.san > 0);
});

test('a evolução entre andares respeita os limites do Clip', () => {
  for (const origem of ORIGENS) {
    const e = J.novaPartida({ semente: 'evo', tema: 'masmorra', origem });
    for (let k = 0; k < 4; k++) {
      const ops = J.opcoesEvolucao(e);
      assert.ok(ops.length >= 1 && ops.length <= 3);
      e.escolha = { opcoes: ops };
      J.agir(e, { tipo: 'escolher', indice: 0 });
      const erros = clip.validar(e.ficha).filter((p) => p.nivel === 'erro');
      assert.deepEqual(erros, [], origem);
    }
  }
});

test('Ancorar apaga o que é falso à vista', () => {
  const { e } = cena({ origem: 'espirito', especie: 'enfermeiro', fantasma: true });
  e.rDados = fluxo('ancora', 1);
  let tent = 0;
  while (e.entidades.some((x) => x.id === 'alvo') && tent++ < 5) J.agir(e, { tipo: 'ancorar' });
  assert.ok(!e.entidades.some((x) => x.id === 'alvo'));
  assert.ok(e.pistas.includes('ancora'));
});

test('campo de visão é simétrico numa sala aberta e para nas paredes', () => {
  const r = fluxo('fov');
  const m = gerarAndar(r, { w: 30, h: 20, salas: 5 });
  const s = m.salas[0];
  const cx = s.x + 1, cy = s.y + 1;
  const v = visao(m, cx, cy, 6);
  assert.ok(v.has(cy * m.w + cx));
  for (const k of v) {
    const x = k % m.w, y = Math.floor(k / m.w);
    assert.ok(Math.hypot(x - cx, y - cy) <= 6.01);
  }
});

test('o robô termina partidas nos três temas e origens', () => {
  for (const tema of LISTA_TEMAS) {
    for (const origem of ORIGENS) {
      const r = jogarPartida({ semente: 'fim', tema, origem });
      assert.ok(['fuga', 'morte', 'loucura'].includes(r.resultado), `${tema}/${origem}: ${r.resultado}`);
      assert.ok(r.turnos > 20);
    }
  }
});
