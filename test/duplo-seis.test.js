import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../duplo-seis/regras.js';
import * as J from '../duplo-seis/jogo.js';
import { PASSADOS, PONTOS_INICIAIS } from '../duplo-seis/passados.js';
import { brasa } from '../duplo-seis/aventuras/brasa/index.js';
import { validarCenas } from '../duplo-seis/aventuras/validar.js';
import { jogar, chance } from '../duplo-seis/robo.js';

/** Dados marcados: devolve as faces pedidas, em ordem. */
const marcados = (...faces) => {
  let i = 0;
  return () => (faces[i++ % faces.length] - 0.5) / 6;
};

/* ---------- O manual, exemplo por exemplo ---------- */

test('porta de Dificuldade 10, Situação 1: Força 1 não alcança por meios normais', () => {
  const r = R.testar({ nivel: 1, dificuldade: 10, rng: marcados(6) });
  assert.equal(r.total, 6);
  assert.equal(r.sucesso, false);
});

test('porta, Situação 2: Força 3 rola 3D6 e derruba com 12', () => {
  const r = R.testar({ nivel: 3, dificuldade: 10, rng: marcados(4, 4, 4) });
  assert.deepEqual(r.dados, [4, 4, 4]);
  assert.equal(r.sucesso, true);
});

test('porta, Situação 3: insistir custa em Vida o que faltou (10 − 4 = 6)', () => {
  const r = R.testar({ nivel: 1, dificuldade: 10, rng: marcados(4) });
  assert.equal(R.custoDeInsistir('forca', r), 6);
});

test('insistir é só para o Caminho do Corpo', () => {
  const r = R.testar({ nivel: 1, dificuldade: 10, rng: marcados(4) });
  assert.equal(R.custoDeInsistir('agilidade', r), 6);
  assert.equal(R.custoDeInsistir('inteligencia', r), null);
  assert.equal(R.custoDeInsistir('presenca', r), null);
  assert.equal(R.custoDeInsistir('medicina', r), null);
});

test('porta, Situação 4: Força 1 com Pé de Cabra 2 rola 3D6', () => {
  const r = R.testar({ nivel: 1, objeto: 2, dificuldade: 10, rng: marcados(3, 3, 4) });
  assert.equal(r.dados.length, 3);
  assert.equal(r.sucesso, true);
});

test('porta, Situação 5: dois de Força 1 unem forças e rolam 2D6', () => {
  const r = R.testar({ nivel: 1, aliados: 1, dificuldade: 10, rng: marcados(5, 5) });
  assert.equal(r.dados.length, 2);
  assert.equal(r.sucesso, true);
});

test('porta, Situação 6: nível 0 rola 1D6−2 e jamais insiste', () => {
  const r = R.testar({ nivel: 0, dificuldade: 3, rng: marcados(4) });
  assert.equal(r.total, 2);
  assert.equal(r.incapaz, true);
  assert.equal(R.custoDeInsistir('forca', r), null);
});

test('forçar objeto encantado tira 1D6: Força 4 rola 3D6 contra 20', () => {
  const r = R.testar({ nivel: 4, reducao: 1, dificuldade: 20, rng: marcados(6, 6, 6) });
  assert.equal(r.dados.length, 3);
  assert.equal(r.sucesso, false);
});

test('Futebol: Destreza 2 e Físico 3 limitam a perícia em 2', () => {
  const f = R.novaFicha({ atributos: { destreza: 2, fisico: 3 }, pericias: { futebol: 2 } });
  assert.equal(R.teto(f, 'futebol'), 2);
  assert.deepEqual(R.validar(f), []);
  f.pericias.futebol = 3;
  assert.equal(R.validar(f).length, 1);
});

test('Aprimoramento jamais supera o Atributo-pai', () => {
  const f = R.novaFicha({ atributos: { forca: 1 }, aprimoramentos: { ataqueCorporal: 2 } });
  assert.equal(R.validar(f).length, 1);
});

test('Cuidar de Animais exige Inteligência e Medicina', () => {
  const f = R.novaFicha({ atributos: { inteligencia: 3 }, pericias: { medicina: 1 } });
  assert.equal(R.teto(f, 'cuidarAnimais'), 1);
});

test('Valores Resumidos: Vida, Magia e Sanidade seguem o Caminho dominante', () => {
  const corpo = R.novaFicha({ atributos: { forca: 3, fisico: 2, vontade: 1 }, aprimoramentos: { resistencia: 1, saude: 1 } });
  assert.equal(R.valores(corpo).vida, 8 + 1 + 4);
  assert.equal(R.valores(corpo).sanidade, 4 + 2);
  const mente = R.novaFicha({ atributos: { inteligencia: 3, percepcao: 1, sabedoria: 2, vontade: 1 } });
  assert.equal(R.valores(mente).vida, 5);
  assert.equal(R.valores(mente).magia, 12);
  assert.equal(R.valores(mente).sanidade, 7 + 2);
  const espirito = R.novaFicha({ atributos: { fe: 3, vontade: 2 } });
  assert.equal(R.valores(espirito).sanidade, 10 + 10);
});

test('ataque e defesa: Ataque Corporal + Agilidade; Reflexo + Resistência', () => {
  const f = R.novaFicha({ atributos: { forca: 3, destreza: 2, fisico: 1 }, aprimoramentos: { ataqueCorporal: 2, agilidade: 1, reflexo: 1, resistencia: 1, precisao: 2 } });
  const v = R.valores(f);
  assert.equal(v.ataqueCurta, 3);
  assert.equal(v.ataqueLonga, 2);
  assert.equal(v.defesa, 2);
});

test('Força 4 usa Espada 2, Escudo 1 e Armadura 1', () => {
  const f = R.novaFicha({ atributos: { forca: 4 } });
  assert.equal(R.limiteDeEquipamento(f), 4);
  f.aprimoramentos.manipulacaoPeso = 1;
  assert.equal(R.limiteDeEquipamento(f), 5);
});

test('Antecedentes: Corpo 3 dá 3 pontos; Má Fama 2 e Inimigo 1 levam a 6, o máximo', () => {
  const f = R.novaFicha({ atributos: { forca: 3, inteligencia: 3, vontade: 3 }, antecedentes: { maFama: { nivel: 2, mau: true }, inimigo: { nivel: 1, mau: true } } });
  assert.equal(R.pontosDeAntecedentes(f).base, 3);
  assert.equal(R.pontosDeAntecedentes(f).total, 6);
  f.antecedentes.inimigo.nivel = 5;
  assert.equal(R.pontosDeAntecedentes(f).total, 6);
});

test('combate: empate é da defesa', () => {
  const g = R.atacar({ ataque: 2, defesa: 2, rng: marcados(3, 3) });
  assert.equal(g.acertou, false);
  assert.equal(g.dano, 0);
});

test('combate: Espada 2 transforma Dano 3 em Dano 5', () => {
  const g = R.atacar({ ataque: 3, defesa: 0, arma: 2, rng: marcados(4, 4) });
  assert.equal(g.valorAtaque - g.valorDefesa, 3);
  assert.equal(g.dano, 5);
});

test('combate: armadura, escudo e Resistência descontam, mas o dano mínimo é 1', () => {
  const g = R.atacar({ ataque: 1, defesa: 0, armadura: 1, escudo: 1, resistencia: 2, rng: marcados(3, 3) });
  assert.equal(g.acertou, true);
  assert.equal(g.dano, 1);
});

test('crítico: 6 e 6 de novo é sucesso crítico; 1 e 1 de novo é falha crítica', () => {
  assert.equal(R.critico(6, marcados(6)).tipo, 'sucesso');
  assert.equal(R.critico(6, marcados(5)).tipo, null);
  assert.equal(R.critico(1, marcados(1)).tipo, 'falha');
  assert.equal(R.critico(1, marcados(2)).tipo, null);
  assert.equal(R.critico(3, marcados(3)).confirma, null);
});

test('magia: o gasto por mágica é limitado pelo nível da Perícia Mágica e pelos PM', () => {
  const f = R.novaFicha({ atributos: { percepcao: 3, inteligencia: 1 }, pericias: { magiaEncantamento: 1 } });
  assert.equal(R.teto(f, 'magiaEncantamento'), 1);
  assert.equal(R.maximoDePM(f, 'magiaEncantamento', 8), 1);
  assert.equal(R.maximoDePM(f, 'magiaEncantamento', 0), 0);
});

test('ataque mental: a defesa é 1D6 + Vontade + Fé', () => {
  const g = R.ataqueMental({ ataque: 3, vontade: 2, fe: 1, rng: marcados(4, 4) });
  assert.equal(g.valorDefesa, 7);
  assert.equal(g.acertou, false);
});

test('Mágica de Controle exige Vontade superior à do alvo', () => {
  assert.equal(R.controlar({ vontade: 2, nivelControle: 2, vontadeAlvo: 2 }).possivel, false);
  assert.equal(R.controlar({ vontade: 3, nivelControle: 2, vontadeAlvo: 2 }).sucesso, true);
});

test('tabela de Dificuldades', () => {
  assert.equal(R.nomeDaDificuldade(2), 'Muito Fácil');
  assert.equal(R.nomeDaDificuldade(4), 'Normal');
  assert.equal(R.nomeDaDificuldade(10), 'Difícil');
  assert.equal(R.nomeDaDificuldade(15), 'Muito Difícil');
  assert.equal(R.nomeDaDificuldade(20), 'Quase Impossível');
});

/* ---------- Os passados e a aventura ---------- */

test('todo passado é uma ficha válida de Especialista Iniciante', () => {
  for (const p of PASSADOS) {
    const f = R.novaFicha(p);
    assert.deepEqual(R.validar(f, PONTOS_INICIAIS), [], p.titulo);
    assert.equal(R.pontosGastos(f), PONTOS_INICIAIS, p.titulo);
    assert.equal(R.caminhoDominante(f), p.caminho, p.titulo);
    for (const i of p.itens) assert.ok(brasa.itens[i], `${p.titulo}: item ${i}`);
  }
});

test('nenhum passado começa com equipamento além da Força', () => {
  for (const p of PASSADOS) {
    const e = J.nova({ semente: 'equip', passado: p.id, aventura: brasa });
    const eq = J.equipado(e);
    const peso = [eq.arma, eq.longa, eq.armadura, eq.escudo].filter(Boolean).reduce((s, i) => s + i.mod, 0);
    assert.ok(peso <= eq.limite, p.titulo);
  }
});

test('a aventura fecha com o formato e não repete ids', () => {
  const erros = validarCenas({
    cenas: [brasa.abertura, ...brasa.cenas, ...brasa.desfecho],
    itens: brasa.itens,
    companheiros: brasa.companheiros,
    inimigos: brasa.inimigos,
  });
  assert.deepEqual(erros, []);
  for (const ato of [1, 2, 3]) assert.ok(brasa.cenas.filter((c) => c.ato === ato && !c.requer).length >= J.MESA.cenasPorAto, `ato ${ato}`);
});

test('os nove Atributos têm cena em que valem', () => {
  const vistos = new Set();
  for (const c of brasa.cenas) for (const a of c.abordagens) {
    if (!a.teste) continue;
    const k = a.teste.chave;
    vistos.add(R.ATRIBUTOS[k] ? k : R.APRIMORAMENTOS[k]?.pai);
  }
  for (const a of Object.keys(R.ATRIBUTOS)) assert.ok(vistos.has(a), a);
});

test('nenhum desfecho de combate rende marco: experiência não vem de inimigo caído', () => {
  for (const c of [...brasa.cenas, ...brasa.desfecho]) for (const a of c.abordagens) {
    if (a.combate) for (const d of ['vitoria', 'derrota', 'fuga']) assert.ok(!a[d].efeitos?.marco, `${c.id}/${a.id}`);
  }
});

/* ---------- A sessão ---------- */

test('a abertura é a porta do manual: Dificuldade 10, pé de cabra e Otto', () => {
  const e = J.nova({ semente: 'porta', passado: 'boticaria', aventura: brasa });
  const forca = J.opcoes(e).find((o) => o.id === 'forca');
  assert.equal(forca.dificuldade, 10);
  assert.equal(forca.nivel, 0);
  assert.deepEqual(forca.objetos.map((o) => o.mod), [2]);
  assert.deepEqual(forca.aliados.map((a) => a.nivel), [1]);
});

test('unir forças e usar objeto somam dados na rolagem', () => {
  const e = J.nova({ semente: 'soma', passado: 'desertora', aventura: brasa });
  J.escolher(e, 'forca', { objeto: 'peDeCabra', unir: ['cena:0'] });
  assert.equal(e.rolagem.dados.length, 3 + 2 + 1);
});

test('insistir paga a diferença em Vida e vira sucesso', () => {
  for (let i = 0; i < 200; i++) {
    const e = J.nova({ semente: `ins-${i}`, passado: 'desertora', aventura: brasa });
    J.escolher(e, 'forca');
    if (e.fase !== 'insistir') continue;
    const vida = e.vida;
    const custo = e.rolagem.custoInsistir;
    assert.equal(custo, e.rolagem.falta);
    J.insistir(e, true);
    assert.equal(e.vida, vida - custo);
    assert.equal(e.desfecho.ok, true);
    return;
  }
  assert.fail('nenhuma semente levou a insistir');
});

test('a mesma semente e as mesmas escolhas contam a mesma história', () => {
  const a = jogar({ semente: 'igual', passado: 'menestrel', aventura: brasa });
  const b = jogar({ semente: 'igual', passado: 'menestrel', aventura: brasa });
  assert.deepEqual(a.cronica, b.cronica);
  assert.equal(a.fim.id, b.fim.id);
  const c = jogar({ semente: 'outra', passado: 'menestrel', aventura: brasa });
  assert.notDeepEqual(a.vistas, c.vistas);
});

test('o robô termina a sessão com todo passado e todo perfil', () => {
  for (const p of PASSADOS) for (const perfil of ['atento', 'teimoso', 'acaso']) {
    for (let i = 0; i < 25; i++) {
      const e = jogar({ semente: `fim-${i}`, passado: p.id, aventura: brasa, perfil });
      assert.equal(e.fase, 'fim', `${p.id} ${perfil} ${i}`);
      assert.ok(e.fim.titulo);
      assert.ok(e.vida >= 0 && e.sanidade >= 0 && e.magia >= 0 && e.brasa >= 0);
      assert.ok(e.vida <= e.max.vida && e.sanidade <= e.max.sanidade && e.magia <= e.max.magia);
      assert.deepEqual(R.validar(e.ficha), [], 'a evolução respeita os tetos');
      assert.ok(J.cronica(e).includes(e.nome));
    }
  }
});

test('a sessão tem a forma certa: abertura, três atos de quatro cenas e o Farol', () => {
  const e = jogar({ semente: 'forma', passado: 'peregrina', aventura: brasa });
  if (!['morte', 'perdido'].includes(e.fim.id)) {
    assert.equal(e.vistas.length, 1 + 3 * J.MESA.cenasPorAto + brasa.desfecho.length);
    assert.equal(new Set(e.vistas).size, e.vistas.length);
  }
});

test('todos os finais são alcançáveis', () => {
  const vistos = new Set();
  for (const p of PASSADOS) for (const perfil of ['atento', 'teimoso', 'acaso']) {
    for (let i = 0; i < 120; i++) vistos.add(jogar({ semente: `finais-${i}`, passado: p.id, aventura: brasa, perfil }).fim.id);
  }
  for (const f of [...brasa.finais.map((x) => x.id), ...Object.keys(brasa.quedas)]) assert.ok(vistos.has(f), f);
});

test('comprar nível recalcula o valor inicial de Vida e Sanidade', () => {
  const e = J.nova({ semente: 'compra', passado: 'desertora', aventura: brasa });
  e.fase = 'acampamento';
  e.acampamento = {};
  e.pontos = 2;
  const vida = e.max.vida;
  J.comprar(e, 'saude');
  assert.equal(e.max.vida, vida + 4);
  const san = e.max.sanidade;
  J.comprar(e, 'fe');
  assert.equal(e.max.sanidade, san + 2);
  assert.equal(e.pontos, 0);
  J.comprar(e, 'forca');
  assert.equal(R.nivel(e.ficha, 'forca'), 3, 'sem pontos, não compra');
});

test('chance do robô confere com a conta: 2D6 contra 7 é 21 em 36', () => {
  assert.ok(Math.abs(chance(2, 7) - 21 / 36) < 1e-9);
  assert.ok(Math.abs(chance(0, 3) - 2 / 6) < 1e-9);
});
