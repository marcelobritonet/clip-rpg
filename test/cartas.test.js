import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as clip from '../motor/clip.js';
import * as jogo from '../cartas/jogo.js';

/** rng que devolve os D6 pedidos, em ordem (depois repete). */
const dados = (...valores) => {
  let i = 0;
  return () => (valores[i++ % valores.length] - 1) / 6 + 0.01;
};

/** Jogo com um desafio fixo e a mão pedida. */
function jogoCom({ origem = 'sentinela', desafio, mao = [], pe = 10, rng = Math.random } = {}) {
  const e = jogo.novoJogo({ origem });
  e.rng = rng; // depois de embaralhar, para os dados do teste não irem para o baralho
  if (desafio) e.desafio = structuredClone([...jogo.DESAFIOS, jogo.DESAFIO_FINAL].find((d) => d.id === desafio));
  const baralho = jogo.montarBaralho();
  e.mao = mao.map((alvo) => ({ ...baralho.find((c) => c.alvo === alvo) }));
  e.pe = pe;
  return e;
}

test('o baralho usa só Aprimoramentos e Perícias do motor', () => {
  for (const c of jogo.montarBaralho()) {
    if (c.tipo === 'aprimoramento') assert.ok(c.alvo in clip.APRIMORAMENTOS, c.alvo);
    if (c.tipo === 'pericia') assert.ok(clip.PERICIAS_EXEMPLO.some((p) => p.id === c.alvo), c.alvo);
  }
  const uids = jogo.montarBaralho().map((c) => c.uid);
  assert.equal(new Set(uids).size, uids.length, 'uids únicas');
});

test('novo jogo: ficha válida pelo motor, Vida e Sanidade cheias e mão de 5', () => {
  for (const origem of Object.keys(jogo.ORIGENS)) {
    const e = jogo.novoJogo({ origem });
    const v = clip.valores(e.ficha);
    assert.equal(e.vida, v.vida.valor);
    assert.equal(e.sanidade, v.sanidade.valor);
    assert.equal(e.mao.length, jogo.JOGO.maoMaxima);
    assert.equal(e.cena, 1);
    assert.equal(e.pe, jogo.JOGO.pePorCena + jogo.JOGO.peCriacao);
    assert.equal(clip.caminhoDominante(e.ficha).id, jogo.ORIGENS[origem].caminho);
    assert.deepEqual(clip.validar(e.ficha).filter((p) => p.nivel === 'erro'), [], origem);
  }
});

test('Aprimoramento não passa do Atributo', () => {
  const e = jogoCom({ origem: 'sentinela', mao: ['ataqueCorporal'] });
  // Sentinela: Força 1 e Ataque Corporal 1.
  const r = jogo.podeJogar(e, e.mao[0]);
  assert.equal(r.ok, false);
  assert.match(r.motivo, /Força 2/);
  jogo.treinar(e, 'forca');
  assert.equal(jogo.podeJogar(e, e.mao[0]).ok, true);
  jogo.jogarCarta(e, e.mao[0].uid);
  assert.equal(clip.nivelDe(e.ficha, 'ataqueCorporal'), 2);
});

test('Perícia nunca passa do menor requisito (maximoPericia do motor)', () => {
  const e = jogoCom({ origem: 'sentinela', mao: ['investigacao'] });
  // Investigação exige Percepção e Sabedoria; a Sentinela tem Sabedoria 0.
  let r = jogo.podeJogar(e, e.mao[0]);
  assert.equal(r.ok, false);
  assert.match(r.motivo, /Sabedoria 1 \(tem 0\)/);
  jogo.treinar(e, 'sabedoria');
  r = jogo.podeJogar(e, e.mao[0]);
  assert.equal(r.ok, true);
  assert.equal(r.nivel, 1);
  jogo.jogarCarta(e, e.mao[0].uid);
  const p = e.ficha.pericias.find((x) => x.id === 'investigacao');
  assert.equal(p.nivel, clip.maximoPericia(e.ficha, p));
});

test('custo em PE: Atributo 2, carta 1; sem PE não joga', () => {
  const e = jogoCom({ mao: ['reflexo'], pe: 1 });
  assert.equal(jogo.podeTreinar(e, 'fe').ok, false);
  jogo.jogarCarta(e, e.mao[0].uid);
  assert.equal(e.pe, 0);
  assert.equal(clip.nivelDe(e.ficha, 'reflexo'), 1);
});

test('Saúde aumenta a Vida máxima e a atual', () => {
  const e = jogoCom({ mao: ['saude'] });
  const antes = e.vida;
  jogo.jogarCarta(e, e.mao[0].uid);
  assert.equal(e.vida, antes + 4);
});

test('equipamento respeita o limite de Força (limiteEquipamento)', () => {
  const e = jogoCom({ origem: 'erudita', mao: ['adaga'] });
  // Erudita tem Força 0: nenhum equipamento cabe.
  const r = jogo.podeJogar(e, e.mao[0]);
  assert.equal(r.ok, false);
  assert.match(r.motivo, /limite/);
  jogo.treinar(e, 'forca');
  jogo.jogarCarta(e, e.mao[0].uid);
  assert.equal(e.ficha.equipamentos[0].modificador, 1);
});

test('o Mestre escolhe o desafio do Caminho mais fraco', () => {
  const e = jogo.novoJogo({ origem: 'sentinela' });
  const porta = jogo.DESAFIOS.find((d) => d.id === 'porta');
  const cripta = jogo.DESAFIOS.find((d) => d.id === 'cripta');
  e.pilhaMestre = [porta, cripta];
  const { desafio, motivo } = jogo.escolherDesafio(e);
  assert.equal(desafio.id, 'cripta');
  assert.match(motivo, /Espírito/);
  assert.equal(e.pilhaMestre[0].id, 'porta', 'o desafio recusado volta para o fim da pilha');
});

test('o desafio final vem depois da última cena', () => {
  const e = jogo.novoJogo();
  e.cena = jogo.JOGO.cenas;
  assert.equal(jogo.escolherDesafio(e).desafio.id, 'vau');
});

test('a escala endurece desafios a cada 3 cenas', () => {
  assert.equal(jogo.escala(1), 0);
  assert.equal(jogo.escala(3), 0);
  assert.equal(jogo.escala(4), 1);
});

test('teste usa testar do motor: sucesso dá Renome, falha cobra o desafio', () => {
  const e = jogoCom({ origem: 'sentinela', desafio: 'porta', rng: dados(4) });
  jogo.enfrentar(e);
  // Força 1 → 1D6 = 4 contra Dificuldade 6: falha, −2 Vida.
  const vida = e.vida;
  const r = jogo.resolverTeste(e, { abordagem: 'forca' });
  assert.equal(r.teste.sucesso, false);
  assert.equal(e.vida, vida - 2);
  assert.equal(e.renome, 0);
  assert.equal(e.fase, 'resultado');
});

test('objeto soma níveis ao teste (Situação 4)', () => {
  const e = jogoCom({ origem: 'sentinela', desafio: 'porta', mao: ['peDeCabra'], rng: dados(2) });
  jogo.jogarCarta(e, e.mao[0].uid);
  jogo.enfrentar(e);
  const ab = jogo.abordagens(e).find((a) => a.id === 'forca');
  assert.equal(ab.dados, '3D6');
  const r = jogo.resolverTeste(e, { abordagem: 'forca' });
  assert.deepEqual(r.teste.dados, [2, 2, 2]);
  assert.equal(r.teste.sucesso, true);
  assert.equal(e.renome, jogo.JOGO.renome.teste);
});

test('nível 0 rola 1D6−2', () => {
  const e = jogoCom({ origem: 'sentinela', desafio: 'cripta', rng: dados(6) });
  e.ficha.atributos.vontade = 0;
  jogo.enfrentar(e);
  const ab = jogo.abordagens(e).find((a) => a.id === 'fe');
  assert.equal(ab.dados, '1D6−2');
  const r = jogo.resolverTeste(e, { abordagem: 'fe' });
  assert.equal(r.teste.total, 4);
});

test('insistir: só Atributo do Corpo, pago com Vida', () => {
  const e = jogoCom({ origem: 'sentinela', desafio: 'porta', rng: dados(4) });
  jogo.enfrentar(e);
  const abs = jogo.abordagens(e);
  assert.deepEqual(abs.find((a) => a.id === 'forca').insistir, { paga: 'vida' });
  assert.equal(abs.find((a) => a.id === 'inteligencia').insistir, null);
  const vida = e.vida;
  const r = jogo.resolverTeste(e, { abordagem: 'forca', insistir: true });
  // 4 contra 6: insiste e paga 2 de Vida, sem a perda da falha.
  assert.equal(r.teste.sucesso, true);
  assert.equal(r.teste.custoVida, 2);
  assert.equal(e.vida, vida - 2);
});

test('Determinação (proposto) deixa insistir na Mente pagando Sanidade', () => {
  const e = jogoCom({ origem: 'erudita', desafio: 'mapa', rng: dados(3) });
  e.ficha.aprimoramentos.determinacao = 1;
  jogo.enfrentar(e);
  const san = e.sanidade;
  const r = jogo.resolverTeste(e, { abordagem: 'inteligencia', insistir: true });
  assert.equal(r.paga, 'sanidade');
  assert.equal(e.sanidade, san - 3);
});

test('Percepção ou Sabedoria 2 revela o número da Dificuldade', () => {
  const f = clip.novaFicha();
  assert.equal(jogo.enxergaDificuldade(f), false);
  f.atributos.sabedoria = 2;
  assert.equal(jogo.enxergaDificuldade(f), true);
  assert.equal(jogo.faixa(6), 'Difícil');
});

test('frentes: físico vem dos Valores Resumidos, palavra e fé dos Aprimoramentos', () => {
  const f = clip.novaFicha();
  Object.assign(f.aprimoramentos, { ataqueCorporal: 1, agilidade: 2, empatia: 2, intimidacao: 1, lideranca: 3, conviccao: 1, devocao: 2 });
  const fr = jogo.frentes(f);
  assert.equal(fr.fisico.ataque, clip.valores(f).ataqueCurta.valor);
  assert.equal(fr.palavra.ataque, 5);
  assert.equal(fr.fe.ataque, 3);
  const d = jogo.defesas(f);
  assert.equal(d.fisico.defesa, clip.valores(f).defesa.valor);
});

test('conflito: o dano do resolverAtaque tira Ímpeto; vencer sem Lutar dá bônus', () => {
  // Iniciativa: tudo zero até o Caminho do Corpo (Físico 1 contra 0): você primeiro.
  const e = jogoCom({ origem: 'romeira', desafio: 'lobo', rng: dados(6, 1, 1, 6) });
  e.ficha.atributos.destreza = 0;
  e.desafio.oponente.iniciativa = { reflexo: 0, agilidade: 0, destreza: 0 };
  jogo.enfrentar(e);
  assert.equal(e.conflito.iniciativa.vencedor, 'a');
  // Convencer: 1 (Empatia) + 6 contra 1 (Lobo, palavra) + 1 → dano 5 ≥ Ímpeto 3.
  jogo.agir(e, 'palavra');
  assert.equal(e.resultado.fim, 'vitoria');
  assert.equal(e.resultado.semViolencia, true);
  assert.equal(e.renome, jogo.JOGO.renome.conflito + jogo.JOGO.renome.semViolencia);
});

test('conflito: o oponente esconde os números até Analisar', () => {
  const e = jogoCom({ origem: 'erudita', desafio: 'emboscada', rng: dados(6, 1) });
  jogo.iniciarConflito(e);
  assert.equal(jogo.leituraOponente(e).numeros, null);
  e.rng = dados(6);
  jogo.agir(e, 'analisar');
  const l = jogo.leituraOponente(e);
  assert.ok(l.numeros);
  // A menor defesa dos Salteadores é a palavra (0); não fica negativa.
  assert.equal(l.numeros.pontoFraco, 'palavra');
  assert.equal(l.numeros.defesa.palavra, 0);
});

test('conflito termina em impasse depois do limite de rodadas', () => {
  const e = jogoCom({ origem: 'erudita', desafio: 'emboscada', rng: dados(1) });
  jogo.iniciarConflito(e);
  while (e.fase === 'conflito') jogo.agir(e, 'defender');
  assert.equal(e.resultado.fim, 'impasse');
  assert.equal(e.conflito.rodada, jogo.JOGO.rodadasMaximas);
});

test('partida inteira com escolhas automáticas termina', () => {
  for (let i = 0; i < 50; i++) {
    const e = jogo.novoJogo({ origem: Object.keys(jogo.ORIGENS)[i % 3] });
    let passos = 0;
    while (e.fase !== 'fim' && passos++ < 500) {
      if (e.fase === 'preparo') {
        for (const c of [...e.mao]) if (jogo.podeJogar(e, c).ok) jogo.jogarCarta(e, c.uid);
        jogo.enfrentar(e);
      } else if (e.fase === 'teste') jogo.resolverTeste(e, { abordagem: jogo.abordagens(e)[0].id });
      else if (e.fase === 'conflito') jogo.agir(e, 'fisico');
      else jogo.continuar(e);
    }
    assert.equal(e.fase, 'fim');
    assert.ok(['vitoria', 'derrota', 'parcial'].includes(e.fim.tipo));
    const b = jogo.balanco(e);
    assert.equal(typeof b.renome, 'number');
    const exp = jogo.fichaParaExportar(e);
    assert.deepEqual(clip.validar(exp).filter((p) => p.nivel === 'erro'), []);
  }
});
