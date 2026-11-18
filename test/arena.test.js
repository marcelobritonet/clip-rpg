import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as arena from '../arena/arena.js';
import { REGRAS, validar, pontosGastos, limiteEquipamento } from '../motor/clip.js';

/** rng que devolve os D6 pedidos, em ordem (mesmo truque de clip.test.js). */
const dados = (...valores) => {
  let i = 0;
  return () => (valores[i++ % valores.length] - 1) / 6 + 0.01;
};

/** Força a ordem da rodada para o teste não depender da Iniciativa. */
const primeiro = (est, i) => {
  est.ordem = [i, 1 - i];
  est.passo = 0;
  return est;
};

test('builds prontas respeitam orçamento e limites do manual', () => {
  for (const orcamento of [8, 15, 25]) {
    for (const id of Object.keys(arena.BUILDS)) {
      const f = arena.montarBuild(id, orcamento);
      const erros = validar(f).filter((p) => p.nivel === 'erro');
      assert.deepEqual(erros, [], `${id} com ${orcamento}`);
      assert.ok(pontosGastos(f).total <= orcamento);
      const equip = f.equipamentos.reduce((s, e) => s + e.modificador, 0);
      assert.equal(equip, limiteEquipamento(f), `${id} usa todo o limite de equipamento`);
    }
  }
});

test('build pronta gasta o orçamento inteiro quando a receita permite', () => {
  assert.equal(pontosGastos(arena.montarBuild('guerreiro', 15)).total, 15);
  const g = arena.perfil(arena.montarBuild('guerreiro', 15));
  assert.ok(g.ataqueCurta > 0 && g.arma > 0);
  const m = arena.perfil(arena.montarBuild('mistico', 15));
  assert.ok(m.magiaMental > 0 && m.magia > 0);
});

test('montagem livre aponta os erros do motor', () => {
  const { problemas } = arena.montarLivre({ niveis: { forca: 1, ataqueCorporal: 3 }, orcamento: 15 });
  assert.ok(problemas.some((p) => p.ref === 'ataqueCorporal'));
  const caro = arena.montarLivre({ niveis: { forca: 5, destreza: 5, fisico: 5, ataqueCorporal: 1 }, orcamento: 15 });
  assert.ok(caro.problemas.some((p) => /Pontos de Evolução/.test(p.mensagem)));
  const equip = arena.montarLivre({ niveis: { forca: 1 }, equipamento: { arma: 2 } });
  assert.ok(equip.problemas.some((p) => /limite em combate/.test(p.mensagem)));
});

test('expectativa conta as 36 combinações; empate favorece a defesa', () => {
  const e = arena.expectativa({ ataque: 0, defesa: 0 });
  assert.equal(e.chance, 15 / 36);
  assert.equal(arena.expectativa({ ataque: 0, defesa: 6 }).chance, 0);
  assert.equal(arena.expectativa({ ataque: 6, defesa: 0 }).chance, 1);
});

test('ataque corpo a corpo: cálculo e registro seguem o motor', () => {
  const a = arena.montarBuild('guerreiro', 15);
  const b = arena.montarBuild('atirador', 15);
  const est = primeiro(arena.criarDuelo(a, b, { opcoes: { distanciaInicial: 'curta', criticos: false }, rng: dados(3) }), 0);
  const pa = est.lutadores[0].p;
  const pb = est.lutadores[1].p;
  arena.executar(est, 'curta', dados(6, 1));
  const e = est.log.at(-1);
  assert.equal(e.acertou, true);
  const esperado = Math.max(1, pa.ataqueCurta + 6 - (pb.defesa + 1) + pa.arma - pb.armadura - pb.escudo - pb.resistencia);
  assert.equal(e.dano, esperado);
  assert.equal(est.lutadores[1].vida, pb.vida - esperado);
  assert.ok(e.linhas.some((l) => l.rotulo === 'Valor de Ataque'));
  assert.equal(arena.daVez(est), 1);
});

test('opção de Resistência só na Defesa muda o dano e restaura o motor', () => {
  const a = arena.montarBuild('guerreiro', 15);
  const b = arena.montarBuild('guerreiro', 15);
  const danos = [true, false].map((resistenciaReduzDano) => {
    const est = primeiro(arena.criarDuelo(a, b, { opcoes: { distanciaInicial: 'curta', criticos: false, resistenciaReduzDano }, rng: dados(4, 2) }), 0);
    arena.executar(est, 'curta', dados(5, 2));
    return est.log.at(-1).dano;
  });
  assert.equal(danos[1] - danos[0], arena.perfil(b).resistencia);
  assert.equal(REGRAS.resistenciaReduzDano, true);
});

test('Ataque Mental gasta PM, usa Vontade + Fé e tira Sanidade', () => {
  const m = arena.montarBuild('mistico', 15);
  const g = arena.montarBuild('guerreiro', 15);
  const est = primeiro(arena.criarDuelo(m, g, { opcoes: { criticos: false }, rng: dados(1) }), 0);
  const antes = { pm: est.lutadores[0].pm, san: est.lutadores[1].san, vida: est.lutadores[1].vida };
  arena.executar(est, 'magiaMental', dados(5, 2));
  const pm = arena.perfil(m).magiaMental;
  assert.equal(est.lutadores[0].pm, antes.pm - pm);
  const dano = pm + 5 - (arena.perfil(g).defesaMental + 2);
  assert.equal(est.lutadores[1].san, antes.san - dano);
  assert.equal(est.lutadores[1].vida, antes.vida);
});

test('Sanidade a zero termina o duelo', () => {
  const m = arena.montarBuild('mistico', 15);
  const g = arena.montarBuild('guerreiro', 15);
  const est = primeiro(arena.criarDuelo(m, g, { opcoes: { criticos: false }, rng: dados(1) }), 0);
  est.lutadores[1].san = 1;
  arena.executar(est, 'magiaMental', dados(6, 1));
  assert.equal(est.fim.vencedor, 0);
  assert.equal(est.fim.motivo, 'sanidade');
});

test('corpo a corpo só na distância curta; aproximar muda a distância', () => {
  const est = arena.criarDuelo(arena.montarBuild('guerreiro'), arena.montarBuild('atirador'), { rng: dados(3) });
  const i = arena.daVez(est);
  assert.equal(arena.acoesDisponiveis(est, i).find((x) => x.id === 'curta').disponivel, false);
  assert.throws(() => arena.executar(est, 'curta', dados(3)));
  arena.executar(est, 'aproximar');
  assert.equal(est.distancia, 'curta');
});

test('sucesso crítico no ataque dobra o dano (proposta 5.4)', () => {
  const a = arena.montarBuild('guerreiro', 15);
  const b = arena.montarBuild('atirador', 15);
  const est = primeiro(arena.criarDuelo(a, b, { opcoes: { distanciaInicial: 'curta' }, rng: dados(3) }), 0);
  // dado de ataque 6, defesa 1; confirmações: 6 (crítico) e 3 (defesa sem crítico)
  arena.executar(est, 'curta', dados(6, 1, 6, 3));
  const e = est.log.at(-1);
  assert.equal(e.critico.ataque, 'sucesso');
  assert.ok(e.linhas.some((l) => l.rotulo === 'Sucesso crítico'));
  const pa = est.lutadores[0].p;
  const pb = est.lutadores[1].p;
  const simples = Math.max(1, pa.ataqueCurta + 6 - (pb.defesa + 1) + pa.arma - pb.armadura - pb.escudo - pb.resistencia);
  assert.equal(e.dano, 2 * simples);
});

test('falha crítica no ataque faz perder a próxima ação', () => {
  const est = primeiro(arena.criarDuelo(arena.montarBuild('guerreiro'), arena.montarBuild('atirador'), { opcoes: { distanciaInicial: 'curta' }, rng: dados(3) }), 0);
  arena.executar(est, 'curta', dados(1, 4, 1, 2)); // ataque 1, confirma 1
  assert.equal(est.lutadores[0].perdeAcao, true);
  arena.executar(est, 'longa', dados(2, 5)); // vez do atirador; depois pula o guerreiro
  assert.equal(arena.daVez(est), 1);
  assert.equal(est.rodada, 2);
  assert.ok(est.log.some((e) => e.titulo === 'Ação perdida'));
});

test('IA faz escolhas plausíveis', () => {
  const g = arena.montarBuild('guerreiro');
  const t = arena.montarBuild('atirador');
  const longe = primeiro(arena.criarDuelo(g, t, { rng: dados(3) }), 0);
  assert.equal(arena.escolherIA(longe), 'aproximar', 'guerreira longe avança');
  const perto = primeiro(arena.criarDuelo(g, t, { opcoes: { distanciaInicial: 'curta' }, rng: dados(3) }), 0);
  assert.equal(arena.escolherIA(perto), 'curta', 'guerreira perto ataca');
  const m = primeiro(arena.criarDuelo(arena.montarBuild('mistico'), g, { rng: dados(3) }), 0);
  assert.equal(arena.escolherIA(m), 'magiaMental', 'místico mira a Sanidade baixa da guerreira');
});

test('simulador é determinístico com a mesma semente', () => {
  const ids = ['guerreiro', 'mistico'];
  const r1 = arena.simular({ ids, n: 50, rng: arena.semente(7) });
  const r2 = arena.simular({ ids, n: 50, rng: arena.semente(7) });
  assert.deepEqual(r1.geral, r2.geral);
  const c = r1.confrontos['guerreiro|mistico'];
  assert.equal(c.vitoriasA + c.vitoriasB + c.empates, 50);
  assert.ok(c.rodadas >= 1);
  const t = arena.taxa(r1, 'mistico', 'guerreiro');
  assert.equal(t, c.vitoriasB / 50);
});

test('todo duelo simulado termina dentro do limite de rodadas', () => {
  const rng = arena.semente(3);
  for (const a of Object.keys(arena.BUILDS)) {
    for (const b of Object.keys(arena.BUILDS)) {
      const r = arena.simularDuelo(arena.montarBuild(a), arena.montarBuild(b), { rng, opcoes: { limiteRodadas: 20 } });
      assert.ok(r.rodadas <= 20);
      assert.ok([0, 1, null].includes(r.vencedor));
    }
  }
});
