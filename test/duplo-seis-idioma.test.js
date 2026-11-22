import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../duplo-seis/regras.js';
import * as J from '../duplo-seis/jogo.js';
import pt from '../duplo-seis/textos/pt.js';
import en from '../duplo-seis/textos/en.js';
import { IDIOMAS, idiomaAtual, definirIdioma, t, plural, nomeDaChave, nomeDoCaminho, nomeDaDificuldade } from '../duplo-seis/idioma.js';
import { brasa } from '../duplo-seis/aventuras/brasa/index.js';
import { jogar } from '../duplo-seis/robo.js';

/** Todo texto do dicionário, achatado: { 'inicio.sentar': 'Sentar à mesa', 'escala.vida.0': 'caído', … }. */
function folhas(o, onde = '', saida = {}) {
  for (const [k, v] of Object.entries(o)) {
    const aqui = onde ? `${onde}.${k}` : k;
    if (v !== null && typeof v === 'object') folhas(v, aqui, saida);
    else saida[aqui] = v;
  }
  return saida;
}
const marcadores = (texto) => (String(texto).match(/\{\w+\}/g) ?? []).sort().join();

/** Roda em inglês e devolve a mesa ao português, aconteça o que acontecer. */
function emIngles(fazer) {
  definirIdioma('en');
  try { return fazer(); } finally { definirIdioma('pt'); }
}

test('fora do navegador a mesa fala português', () => {
  assert.equal(idiomaAtual(), 'pt');
  assert.deepEqual(IDIOMAS.map((i) => i.id), ['pt', 'en']);
});

test('português e inglês têm exatamente as mesmas chaves', () => {
  const a = folhas(pt);
  const b = folhas(en);
  assert.deepEqual(Object.keys(b).filter((k) => !(k in a)), [], 'só no inglês');
  assert.deepEqual(Object.keys(a).filter((k) => !(k in b)), [], 'só no português');
});

test('todo texto é texto, não está vazio e leva os mesmos marcadores {…} nos dois idiomas', () => {
  const a = folhas(pt);
  const b = folhas(en);
  for (const k of Object.keys(a)) {
    assert.equal(typeof a[k], 'string', k);
    assert.equal(typeof b[k], 'string', k);
    assert.ok(a[k].trim() && b[k].trim(), `${k}: vazio`);
    assert.equal(marcadores(b[k]), marcadores(a[k]), k);
  }
});

test('o inglês traduz todo nome do manual', () => {
  for (const k of [...Object.keys(R.ATRIBUTOS), ...Object.keys(R.APRIMORAMENTOS), ...Object.keys(R.PERICIAS)]) assert.ok(en.nomes.chaves[k], k);
  for (const c of Object.keys(R.CAMINHOS)) assert.ok(en.nomes.caminhos[c], c);
  assert.equal(en.nomes.dificuldades.length, R.DIFICULDADES.length);
});

test('t() troca os marcadores e deixa em paz os que não recebeu', () => {
  assert.equal(t('inicio.sentar'), 'Sentar à mesa');
  assert.equal(t('cena.rolar', { dados: '3 dados', dificuldade: 10 }), 'Rolar 3 dados contra 10');
  assert.equal(t('cena.rolar', { dados: '3 dados' }), 'Rolar 3 dados contra {dificuldade}');
  assert.deepEqual(t('escala.vida'), pt.escala.vida);
});

test('t() cai no português quando falta a tradução, e na chave quando falta tudo', () => {
  assert.equal(t('nao.existe'), 'nao.existe');
  assert.equal(t('inicio.sentar.mais.fundo'), 'inicio.sentar.mais.fundo');
  const guardado = en.inicio.sentar;
  delete en.inicio.sentar;
  try {
    emIngles(() => {
      assert.equal(t('inicio.sentar'), 'Sentar à mesa');
      assert.equal(t('inicio.continuar'), 'Continue');
      assert.equal(t('nao.existe'), 'nao.existe');
    });
  } finally { en.inicio.sentar = guardado; }
});

test('definirIdioma recusa idioma que não existe', () => {
  assert.equal(definirIdioma('tlh'), 'pt');
  assert.equal(idiomaAtual(), 'pt');
});

test('plural() escolhe a forma pelo número, em cada idioma', () => {
  assert.equal(plural(1, 'dado'), '1 dado');
  assert.equal(plural(3, 'dado'), '3 dados');
  assert.equal(plural(0, 'ponto'), '0 pontos');
  emIngles(() => {
    assert.equal(plural(1, 'dado'), '1 die');
    assert.equal(plural(3, 'dado'), '3 dice');
  });
});

test('os nomes do manual vêm de regras.js em português e do glossário em inglês', () => {
  assert.equal(nomeDaChave('resistencia'), R.nomeDaChave('resistencia'));
  assert.equal(nomeDoCaminho('espirito'), 'Espírito');
  assert.equal(nomeDaDificuldade(10), 'Difícil');
  for (const k of Object.keys(pt.nomes.chaves)) assert.equal(pt.nomes.chaves[k], R.nomeDaChave(k), k);
  emIngles(() => {
    assert.equal(nomeDaChave('resistencia'), 'Toughness');
    assert.equal(nomeDaChave('ataqueCorporal'), 'Melee Attack');
    assert.equal(nomeDaChave('magiaElemental'), 'Elemental Manipulation');
    assert.equal(nomeDoCaminho('espirito'), 'Spirit');
    assert.deepEqual([2, 4, 10, 15, 20].map(nomeDaDificuldade), ['Very Easy', 'Normal', 'Hard', 'Very Hard', 'Nearly Impossible']);
    assert.equal(nomeDaChave('nao-existe'), 'nao-existe');
  });
});

test('em inglês a sessão do robô termina e a crônica não fala "semente"', () => {
  emIngles(() => {
    const e = jogar({ semente: 'idioma', passado: 'desertora', aventura: brasa });
    assert.equal(e.fase, 'fim');
    const cronica = J.cronica(e);
    assert.ok(!/semente/i.test(cronica), cronica);
    assert.ok(cronica.includes('seed idioma'));
    assert.ok(cronica.includes(`${e.nome}, ${e.tituloDoPassado}`), 'em inglês o título vai como está');
    assert.equal(J.palpite(3, 4), 'almost certain');
    assert.equal(J.emPalavras('vida', 0, 10), 'down');
    assert.equal(J.emPalavras('brasa', 10, 10, brasa), brasa.relogio.palavras[5], 'as palavras do relógio são da aventura');
    const o = J.opcoes(J.nova({ semente: 'porta', passado: 'boticaria', aventura: brasa })).find((x) => x.id === 'forca');
    assert.equal(o.nomeChave, 'Strength');
    assert.equal(o.nomeDificuldade, 'Hard');
  });
  assert.equal(idiomaAtual(), 'pt');
  assert.ok(J.cronica(jogar({ semente: 'idioma', passado: 'desertora', aventura: brasa })).includes('semente idioma'));
});

test('o idioma não mexe na mecânica: mesma semente, mesma sessão', () => {
  const a = jogar({ semente: 'paridade', passado: 'menestrel', aventura: brasa });
  const b = emIngles(() => jogar({ semente: 'paridade', passado: 'menestrel', aventura: brasa }));
  assert.deepEqual(b.trilha, a.trilha);
  assert.deepEqual(b.vistas, a.vistas);
  assert.equal(b.fim.id, a.fim.id);
  assert.deepEqual([b.vida, b.sanidade, b.magia, b.brasa, b.lacos], [a.vida, a.sanidade, a.magia, a.brasa, a.lacos]);
});
