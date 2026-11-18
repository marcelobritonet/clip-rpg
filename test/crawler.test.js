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
  assert.ok(!/"(vida|san|pm|cons)":\d/.test(texto), "sem números de Vida, Sanidade, PM ou Consciência");
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
    e.cons = J.derivados(e).consMax;
    passo(robo, e);
  }
  assert.equal(e.stats.fantasmasCriados + e.stats.miragensCriadas + e.stats.disfarcesCriados + e.stats.itensDisfarcados, 0);
  assert.equal(e.ilusaoParedes.size, 0);
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
  e.cons = Math.ceil(J.derivados(e).consMax * lucidez);
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

/* Versão 0.2: Vida, Consciência e Sanidade, cada uma com o seu jeito de enganar. */

/** Andar limpo: só o jogador e a escada; a casa à direita vira chão. */
function salaLimpa({ origem = 'corpo', semente = 'limpa' } = {}) {
  const e = J.novaPartida({ semente, tema: 'sanatorio', origem });
  e.entidades = [];
  e.objetos = e.objetos.filter((o) => o.tipo === 'escada');
  const { x, y } = e.jogador;
  for (let dx = 1; dx <= 4; dx++) e.mapa.tiles[y * e.mapa.w + x + dx] = T.CHAO;
  return { e, x, y, k: (dx) => y * e.mapa.w + x + dx };
}

test('Corpo ferido deixa sangue, arrasta a perna e as bestas farejam o rastro', () => {
  const { e, x, y, k } = salaLimpa();
  const D = J.derivados(e);
  e.vida = Math.max(1, Math.floor(D.vidaMax * 0.2)); // À beira do colapso
  e.rDados = fluxo('perna', 1);
  const turno = e.turno;
  for (let i = 0; i < 20; i++) J.agir(e, { tipo: 'mover', dx: i % 2 ? -1 : 1, dy: 0 });
  assert.ok(e.sangue.size > 0, 'deixou sangue');
  assert.ok(e.stats.passosArrastados > 0 && e.turno - turno > 20, 'algum passo custou dois turnos');
  assert.ok(J.percebido(e).sangue.length > 0, 'o sangue aparece na tela');
  // Uma besta fora de vista, perto do sangue, sai caçando.
  e.vida = J.derivados(e).vidaMax;
  e.sangue.set(k(1), e.turno);
  e.entidades.push({ id: 'rato', tipo: 'monstro', especie: 'rato', categoria: 'besta', x: x + 4, y, ataque: 0, defesa: 0, vida: 3, vidaMax: 3, arma: 0, vontade: 0, estado: 'parado' });
  e.vis = new Set();
  J.agir(e, { tipo: 'esperar' });
  const rato = e.entidades.find((m) => m.id === 'rato');
  assert.equal(rato.estado, 'cacando');
  assert.ok(e.stats.farejado >= 1);
});

test('Consciência baixa: porta pintada na parede e buraco que não existe', () => {
  const { e, x, y, k } = salaLimpa();
  e.cons = Math.ceil(J.derivados(e).consMax * 0.4);
  // Porta pintada: bate na parede, gasta o turno, não sai do lugar.
  e.mapa.tiles[k(1)] = T.PAREDE;
  e.ilusaoParedes.set(k(1), T.PORTA);
  assert.equal(J.percebido(e).tiles[k(1)], T.PORTA);
  let turno = e.turno;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.stats.portasFalsas, 1);
  assert.equal(e.jogador.x, x);
  assert.ok(e.turno > turno);
  // Buraco falso: o primeiro passo só chega à beira; o segundo pula e cai em chão firme.
  e.mapa.tiles[k(1)] = T.CHAO;
  e.ilusaoParedes.clear();
  e.ilusaoParedes.set(k(1), T.BURACO);
  turno = e.turno;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.turno, turno, 'à beira, não gasta turno');
  const cons = e.cons;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.jogador.x, x + 1);
  assert.equal(e.stats.buracosFalsos, 1);
  assert.ok(e.cons < cons, 'o tombo cansa');
  assert.ok(e.pistas.includes('buraco') && e.pistas.includes('porta'));
});

test('buraco de verdade leva ao andar de baixo, com queda', () => {
  const { e, k } = salaLimpa();
  e.mapa.tiles[k(1)] = T.BURACO;
  const vida = e.vida;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.andar, 2);
  assert.equal(e.stats.quedas, 1);
  assert.equal(e.vida, vida - J.PARAM.buraco.dano);
});

test('com a Consciência baixa aparecem portas e buracos falsos; com a Sanidade baixa, itens com cara de monstro', () => {
  let portas = 0, buracos = 0, itens = 0;
  for (let s = 0; s < 6; s++) {
    const e = J.novaPartida({ semente: 'cansado-' + s, tema: 'masmorra', origem: 'mente' });
    const robo = novoRobo('ingenuo', 'c' + s);
    for (let i = 0; i < 300 && !e.fim; i++) {
      const D = J.derivados(e);
      if (e.desmaio === 0) e.cons = Math.max(1, Math.floor(D.consMax * 0.2));
      if (e.surto === 0) e.san = Math.max(1, Math.floor(D.sanMax * 0.3));
      passo(robo, e);
      for (const t of e.ilusaoParedes.values()) { portas += t === T.PORTA; buracos += t === T.BURACO; }
    }
  }
  // Itens à vista, com a cabeça ruim: alguns ganham cara de bicho.
  for (let s = 0; s < 10; s++) {
    const { e, x, y } = salaLimpa({ semente: 'itens-' + s });
    for (let dx = 2; dx <= 4; dx++) e.objetos.push({ id: 'i' + dx, tipo: 'item', x: x + dx, y, real: true, item: { tipo: 'cura', nome: 'rolo de gaze' } });
    e.san = Math.max(1, Math.floor(J.derivados(e).sanMax * 0.2));
    J.agir(e, { tipo: 'esperar' });
    itens += e.stats.itensDisfarcados;
  }
  assert.ok(portas > 0, 'portas pintadas');
  assert.ok(buracos > 0, 'buracos falsos');
  assert.ok(itens > 0, 'itens com cara de monstro');
});

test('item com cara de monstro: bater quebra; olhar de novo mostra o que é', () => {
  const { e, x, y } = salaLimpa({ origem: 'mente' });
  e.san = Math.ceil(J.derivados(e).sanMax * 0.4);
  e.cons = Math.ceil(J.derivados(e).consMax * 0.6);
  const novoItem = (id, dx) => ({ id, tipo: 'item', x: x + dx, y, real: true, item: { tipo: 'cura', nome: 'rolo de gaze' }, aparencia: { especie: 'rato', categoria: 'besta' }, idFalso: 'falso-' + id, decidido: true, visivel: true });
  e.objetos.push(novoItem('a', 1), novoItem('b', 2));
  const p = J.percebido(e);
  assert.ok(p.entidades.some((q) => q.id === 'falso-a' && q.categoria === 'hostil'), 'aparece como bicho');
  assert.ok(!p.objetos.some((q) => q.id === 'a'), 'não aparece como item');
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.stats.itensQuebrados, 1);
  assert.ok(e.objetos.find((o) => o.id === 'a').usado, 'quebrou');
  e.rDados = fluxo('olhar-item', 2);
  let tent = 0;
  const b = e.objetos.find((o) => o.id === 'b');
  while (b.aparencia && tent++ < 10) J.agir(e, { tipo: 'olhar', alvo: 'falso-b' });
  assert.equal(b.aparencia, null);
  assert.equal(e.stats.itensRevelados, 1);
  assert.ok(e.pistas.includes('imovel'));
});

test('carta e corpo fazem mal de olhar, mas mostram o caminho e dão um item', () => {
  // Mente: sem Fé para segurar o susto (a Fé do Espírito anula a carta).
  const { e, x, y } = salaLimpa({ origem: 'mente' });
  e.objetos.push({ id: 'carta', tipo: 'perturbador', tipoP: 'carta', x: x + 1, y, real: true });
  e.objetos.push({ id: 'corpo', tipo: 'perturbador', tipoP: 'corpo', x: x + 2, y, real: true });
  const escada = e.objetos.find((o) => o.tipo === 'escada');
  const san = e.san;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.ok(e.san < san, 'a carta abala');
  assert.equal(e.visto[escada.y * e.mapa.w + escada.x], 1, 'a carta mostra a saída');
  const itens = e.inventario.length;
  const san2 = e.san;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.ok(e.san < san2, 'revistar o corpo abala');
  assert.equal(e.inventario.length, itens + 1, 'leva um item do corpo');
  assert.equal(e.stats.perturbadores, 2);
});

test('sem Consciência você desmaia; descansar sem perigo à vista devolve a atenção', () => {
  const { e, x } = salaLimpa();
  const D = J.derivados(e);
  e.cons = 4;
  const antes = e.cons;
  for (let i = 0; i < J.PARAM.consciencia.descanso * 2; i++) J.agir(e, { tipo: 'esperar' });
  assert.ok(e.cons > antes, 'descansou');
  e.cons = 0;
  J.agir(e, { tipo: 'esperar' });
  assert.ok(e.desmaio > 0);
  assert.equal(e.stats.desmaios, 1);
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.jogador.x, x, 'desmaiado, não anda');
  for (let i = 0; i < J.PARAM.consciencia.desmaio.turnos + 1; i++) J.agir(e, { tipo: 'esperar' });
  assert.equal(e.desmaio, 0);
  assert.ok(e.cons >= Math.floor(D.consMax * J.PARAM.consciencia.desmaio.depois) - 1, 'acorda com metade');
  assert.ok(J.percebido(e).estado.consciencia);
});

/* Versão 0.3: o fio, o combate com mais verbos, as janelas e o caminho. */

const monstroAo = (e, especie, dx, extra = {}) => {
  const base = TEMAS.sanatorio.monstros.find((m) => m.id === especie);
  const m = { id: 'm-' + dx, tipo: 'monstro', especie, categoria: base.categoria, x: e.jogador.x + dx, y: e.jogador.y, ataque: base.ataque, defesa: base.defesa, vida: base.vida, vidaMax: base.vida, arma: base.arma, armadura: 0, vontade: base.vontade, mental: 0, estado: 'cacando', ...extra };
  e.entidades.push(m);
  return m;
};

test('quando o fio acaba, a ronda chega, não cai e a cabeça pesa o dobro', () => {
  const { e } = salaLimpa();
  e.fio = 2;
  J.agir(e, { tipo: 'esperar' });
  J.agir(e, { tipo: 'esperar' });
  const r = e.entidades.find((x) => x.ronda);
  assert.ok(r, 'a ronda chegou');
  assert.equal(e.stats.rondas, 1);
  assert.equal(e.avisosFio, J.PARAM.fio.avisos.length, 'os avisos vieram antes');
  r.x = e.jogador.x + 1; r.y = e.jogador.y; r.tonto = 5;
  J.agir(e, { tipo: 'esperar' });
  assert.ok(J.percebido(e).entidades.some((x) => x.ameaca), 'a ronda aparece como ameaça');
  for (let i = 0; i < 10; i++) J.agir(e, { tipo: 'atacar', dx: 1, dy: 0 });
  assert.ok(r.vida > 900, 'não cai');
});

test('golpe preparado avisa; sair de perto faz o golpe cortar o ar', () => {
  const { e } = salaLimpa();
  const m = monstroAo(e, 'guarda', 1, { preparando: true });
  J.agir(e, { tipo: 'mover', dx: -1, dy: 0 });
  assert.equal(m.preparando, false);
  assert.ok(e.stats.pesadosEvitados >= 1);
  assert.ok(e.pistas.includes('preparo'));
  // E aparece na percepção enquanto prepara.
  m.preparando = true;
  assert.ok(J.percebido(e).entidades.find((x) => x.id === m.id)?.preparando);
});

test('defender segura golpes e devolve quando o golpe erra', () => {
  let contra = 0, acertos = 0;
  for (let s = 0; s < 40; s++) {
    const { e } = salaLimpa({ semente: 'defesa-' + s });
    monstroAo(e, 'guarda', 1);
    e.rDados = fluxo('d', s);
    const vida = e.vida;
    J.agir(e, { tipo: 'defender' });
    contra += e.stats.contraGolpes;
    acertos += e.vida < vida;
  }
  assert.ok(contra > 0, 'houve contra-golpe');
  assert.ok(acertos < 30, 'defendendo, apanha menos');
});

test('empurrar contra a parede deixa tonto; para dentro do buraco, derruba', () => {
  let tonto = false, caiu = false;
  for (let s = 0; s < 30 && !(tonto && caiu); s++) {
    const { e, k } = salaLimpa({ semente: 'empurra-' + s });
    e.rDados = fluxo('e', s);
    const m = monstroAo(e, 'enfermeiro', 1);
    e.mapa.tiles[k(2)] = T.PAREDE;
    J.agir(e, { tipo: 'empurrar', alvo: m.id });
    if (e.stats.empurroesCertos) tonto ||= m.tonto > 0 || m.vida <= 0;
    const b = salaLimpa({ semente: 'buraco-' + s });
    b.e.rDados = fluxo('b', s);
    const m2 = monstroAo(b.e, 'enfermeiro', 1);
    b.e.mapa.tiles[b.k(2)] = T.BURACO;
    J.agir(b.e, { tipo: 'empurrar', alvo: m2.id });
    caiu ||= b.e.stats.quedasDeMonstro === 1 && m2.vida <= 0;
  }
  assert.ok(tonto, 'ficou tonto contra a parede');
  assert.ok(caiu, 'caiu no buraco');
});

test('bestas não abrem porta fechada', () => {
  const { e, x, y, k } = salaLimpa();
  e.mapa.tiles[k(1)] = T.ABERTA;
  const rato = monstroAo(e, 'rato', 2);
  assert.ok(J.agir(e, { tipo: 'fechar' }));
  assert.equal(e.mapa.tiles[k(1)], T.PORTA);
  for (let i = 0; i < 6; i++) J.agir(e, { tipo: 'esperar' });
  assert.equal(e.mapa.tiles[k(1)], T.PORTA, 'a porta continua fechada');
  assert.ok(!(rato.x === x + 1 && rato.y === y), 'o rato não entrou na porta');
});

test('janela que bate: se ninguém segura, algo entra; segurada, não', () => {
  const { e, x, y } = salaLimpa();
  // Janela logo acima do jogador.
  e.mapa.tiles[(y - 1) * e.mapa.w + x] = T.PAREDE;
  const j = { x, y: y - 1, estado: 'batendo', batidas: 0, falsa: false };
  e.janelas = [j];
  const antes = e.entidades.length;
  // Sai de baixo dela para a invasão ter onde entrar.
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  for (let i = 0; i < 4; i++) J.agir(e, { tipo: 'esperar' });
  assert.equal(j.estado, 'quebrada');
  assert.equal(e.stats.invasoes, 1);
  assert.ok(e.entidades.length > antes);
  // Outra janela, segurada a tempo.
  const s2 = salaLimpa({ semente: 'janela-2' });
  s2.e.mapa.tiles[(s2.y - 1) * s2.e.mapa.w + s2.x] = T.PAREDE;
  const j2 = { x: s2.x, y: s2.y - 1, estado: 'batendo', batidas: 0, falsa: false };
  s2.e.janelas = [j2];
  J.agir(s2.e, { tipo: 'mover', dx: 0, dy: -1 });
  assert.equal(j2.estado, 'barrada');
  assert.ok(s2.e.pistas.includes('janela'));
});

test('as peças do caminho devolvem fio e decidem o fim', () => {
  const { e, x, y } = salaLimpa();
  e.objetos.push({ id: 'p0', tipo: 'peca', indice: 0, x: x + 1, y, real: true });
  e.fio = 10;
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.deepEqual(e.pecas, [0]);
  assert.ok(e.fio > 10 + J.PARAM.fio.peca - 3, 'devolveu fio');
  // Saída com uma peça: fuga pela metade.
  e.andar = J.PARAM.andares;
  e.objetos.push({ id: 's', tipo: 'saida', x: x + 2, y, real: true });
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.fim.tipo, 'fuga');
  assert.equal(e.fim.inteira, false);
  // Com as três: inteira.
  const b = salaLimpa({ semente: 'inteira' });
  b.e.pecas = [0, 1, 2];
  b.e.andar = J.PARAM.andares;
  b.e.objetos.push({ id: 's', tipo: 'saida', x: b.x + 1, y: b.y, real: true });
  J.agir(b.e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(b.e.fim.inteira, true);
  assert.equal(J.resumo(b.e).inteira, true);
});

test('cada andar do meio tem uma peça do caminho; o primeiro e o último, não', () => {
  for (const tema of LISTA_TEMAS) {
    for (let a = 1; a <= 5; a++) {
      const c = J.gerarConteudoDoAndar('pecas', tema, a);
      const pecas = c.objetos.filter((o) => o.tipo === 'peca');
      assert.equal(pecas.length, a >= 2 && a <= 4 ? 1 : 0, `${tema} andar ${a}`);
      assert.ok(c.janelas.length >= 1, 'há janelas');
    }
  }
});

/* Versão 0.3.1: fôlego, retorno das perdas e o dom de cada tema. */

test('correr sem parar deixa ofegante e cansa a vista; parar recupera o fôlego', () => {
  const { e } = salaLimpa();
  const cons = e.cons;
  for (let i = 0; i < J.PARAM.folego.limite + 12; i++) J.agir(e, { tipo: 'mover', dx: i % 2 ? -1 : 1, dy: 0 });
  assert.ok(J.percebido(e).ofegante >= 1, 'ofegante');
  assert.ok(e.cons < cons, 'a vista cansou');
  assert.ok(e.pistas.includes('folego'));
  for (let i = 0; i < 12; i++) J.agir(e, { tipo: 'esperar' });
  assert.equal(J.percebido(e).ofegante, 0, 'parado, o fôlego volta');
});

test('a percepção diz a direção de cada perda ou cura, sem números', () => {
  const { e } = salaLimpa();
  monstroAo(e, 'guarda', 1);
  e.rDados = fluxo('apanha', 3);
  let viu = false;
  for (let i = 0; i < 20 && !viu; i++) {
    J.agir(e, { tipo: 'esperar' });
    viu = J.percebido(e).variacao.vida?.startsWith('perdeu');
  }
  assert.ok(viu, 'perdeu Vida e a percepção mostra');
  assert.ok(!/"variacao":\{[^}]*\d/.test(JSON.stringify(J.percebido(e))), 'sem números na variação');
});

test('cada tema lê a magia da Mente de um jeito, com palavras próprias para o recurso', () => {
  for (const tema of LISTA_TEMAS) {
    const e = J.novaPartida({ semente: 'dom', tema, origem: 'mente' });
    const p = J.percebido(e);
    assert.ok(TEMAS[tema].dom.palavras.includes(p.estado.magia), tema);
    assert.ok(TEMAS[tema].ancora.acao && TEMAS[tema].ancora.restam.length === 3);
  }
});

test('o dom da Mente deixa tonto quem acerta, inclusive a ronda', () => {
  let tonto = false;
  for (let s = 0; s < 30 && !tonto; s++) {
    const { e } = salaLimpa({ origem: 'mente', semente: 'dom-' + s });
    e.rDados = fluxo('dom', s);
    const m = monstroAo(e, 'guarda', 3, { ronda: true, especie: 'ronda', vida: 999, vidaMax: 999 });
    J.agir(e, { tipo: 'magia', alvo: m.id });
    tonto = m.tonto >= J.PARAM.magia.tontoRonda - 1 && m.vida > 900; // um turno de tontura já passou no mundo
  }
  assert.ok(tonto, 'a ronda ficou tonta e não caiu');
});

/* Versão 0.4: consequências. */

test('gente comum só vigia; bater nela dá alarme e pesa', () => {
  const { e } = salaLimpa();
  const base = TEMAS.sanatorio.monstros.find((m) => m.id === 'enfermeiro');
  const c = J.gerarConteudoDoAndar('vigia', 'sanatorio', 1);
  assert.ok(c.entidades.filter((m) => m.categoria === 'humano').every((m) => m.estado === 'vigiando'), 'humanos comuns começam vigiando');
  const v = monstroAo(e, 'enfermeiro', 1, { estado: 'vigiando', vigia: true });
  const outro = monstroAo(e, 'guarda', 4, { estado: 'vigiando', vigia: true });
  const san = e.san;
  e.rDados = fluxo('bate', 1);
  let tent = 0;
  while (!e.stats.inocentesFeridos && tent++ < 20) J.agir(e, { tipo: 'atacar', dx: 1, dy: 0 });
  assert.equal(e.stats.inocentesFeridos, 1);
  assert.ok(e.san < san, 'pesa');
  assert.equal(outro.estado, 'cacando', 'o andar inteiro vem');
  assert.equal(e.stats.alarmes, 1);
  assert.ok(base);
});

test('com Percepção alta, quem vigia aparece como neutro e andar contra é conversar', () => {
  const { e } = salaLimpa({ origem: 'mente' });
  const v = monstroAo(e, 'enfermeiro', 1, { estado: 'vigiando', vigia: true });
  assert.equal(J.percebido(e).entidades.find((x) => x.id === v.id).categoria, 'neutro');
  J.agir(e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.equal(e.stats.inocentesFeridos, 0, 'não bateu');
  assert.ok(v.conversou, 'conversou');
  // Sem Percepção, parece hostil.
  const c = salaLimpa({ origem: 'espirito', semente: 'sem-percepcao' });
  const w = monstroAo(c.e, 'enfermeiro', 1, { estado: 'vigiando', vigia: true });
  assert.equal(J.percebido(c.e).entidades.find((x) => x.id === w.id).categoria, 'hostil');
});

test('encarar gente de bem gera antipatia', () => {
  const { e, x, y } = salaLimpa({ origem: 'espirito' });
  const al = { id: 'al', tipo: 'aliado', especie: 'lucida', categoria: 'aliado', x: x + 1, y, vida: 6, vidaMax: 6, ataque: 1, defesa: 1, arma: 1, estado: 'parado', decidido: true };
  e.entidades.push(al);
  e.san = J.derivados(e).sanMax - 2;
  const san = e.san;
  J.agir(e, { tipo: 'encarar', alvo: 'al' });
  assert.ok(al.magoado);
  assert.ok(e.san < san);
  J.agir(e, { tipo: 'falar', alvo: 'al' });
  assert.ok(e.log.some((m) => m.texto.includes('Não quer falar com você')));
});

test('desfazer uma mentira devolve clareza; acreditar numa mentira cobra', () => {
  const { e } = cena({ origem: 'mente', especie: 'enfermeiro', fantasma: true, lucidez: 0.5 });
  e.rDados = fluxo('clareza', 4);
  const san = e.san;
  let tent = 0;
  while (e.entidades.some((x) => x.id === 'alvo') && tent++ < 10) J.agir(e, { tipo: 'olhar', alvo: 'alvo' });
  assert.ok(e.stats.clarezas >= 1);
  assert.ok(e.san >= san, 'a cabeça não piorou');
  // Item falso: acreditar cobra.
  const s2 = salaLimpa({ origem: 'mente', semente: 'item-falso' });
  s2.e.cons = Math.ceil(J.derivados(s2.e).consMax * 0.5);
  s2.e.objetos.push({ id: 'f', tipo: 'item', x: s2.x + 1, y: s2.y, real: false, item: { tipo: 'cura', nome: 'rolo de gaze' } });
  const san2 = s2.e.san;
  J.agir(s2.e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.ok(s2.e.san < san2, 'item falso cobra');
});

test('a Fé segura os sustos', () => {
  const comFe = salaLimpa({ origem: 'espirito' });
  const semFe = salaLimpa({ origem: 'mente' });
  for (const { e, x, y } of [comFe, semFe]) e.objetos.push({ id: 'c', tipo: 'perturbador', tipoP: 'carta', x: x + 1, y, real: true });
  const a = comFe.e.san, b = semFe.e.san;
  J.agir(comFe.e, { tipo: 'mover', dx: 1, dy: 0 });
  J.agir(semFe.e, { tipo: 'mover', dx: 1, dy: 0 });
  assert.ok(a - comFe.e.san < b - semFe.e.san);
});
