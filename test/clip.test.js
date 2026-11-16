import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as clip from '../motor/clip.js';

/** rng que devolve os D6 pedidos, em ordem. */
const dados = (...valores) => {
  let i = 0;
  return () => (valores[i++ % valores.length] - 1) / 6 + 0.01;
};

const ficha = (atributos = {}, aprimoramentos = {}, extra = {}) => {
  const f = clip.novaFicha();
  Object.assign(f.atributos, atributos);
  Object.assign(f.aprimoramentos, aprimoramentos);
  return Object.assign(f, extra);
};

test('slug gera as âncoras do manual', () => {
  assert.equal(clip.slug('Manipulação de Peso'), 'manipulacao-de-peso');
  assert.equal(clip.slug('Empatia/Carisma'), 'empatia-carisma');
  assert.equal(clip.slug('Ataque à Curta Distância'), 'ataque-a-curta-distancia');
});

test('d6 fica entre 1 e 6', () => {
  assert.equal(clip.d6(() => 0), 1);
  assert.equal(clip.d6(() => 0.9999), 6);
});

test('Perícia limitada pelo menor requisito (exemplo do Futebol)', () => {
  const f = ficha({ destreza: 2, fisico: 3 });
  const futebol = { id: 'futebol', nome: 'Futebol', requisitos: ['fisico', 'destreza'], nivel: 3 };
  f.pericias.push(futebol);
  assert.equal(clip.maximoPericia(f, futebol), 2);
  const erros = clip.validar(f).filter((p) => p.ref === 'futebol');
  assert.equal(erros.length, 1);
  assert.match(erros[0].mensagem, /Destreza 2/);
});

test('Perícia pode exigir outra Perícia (Cuidar de Animais exige Medicina)', () => {
  const f = ficha({ inteligencia: 3 });
  f.pericias.push({ id: 'medicina', nome: 'Medicina', requisitos: ['inteligencia'], nivel: 1 });
  const cuidar = { id: 'cuidarDeAnimais', nome: 'Cuidar de Animais', requisitos: ['inteligencia', 'medicina'], nivel: 1 };
  f.pericias.push(cuidar);
  assert.equal(clip.maximoPericia(f, cuidar), 1);
});

test('Aprimoramento não passa do Atributo-pai', () => {
  const f = ficha({ forca: 1 }, { ataqueCorporal: 2 });
  assert.ok(clip.validar(f).some((p) => p.ref === 'ataqueCorporal' && p.nivel === 'erro'));
});

test('Pontos gastos contam um por nível e acusam excesso', () => {
  const f = ficha({ forca: 3, destreza: 2 }, { agilidade: 2 }, { pontosDeEvolucao: 6 });
  assert.equal(clip.pontosGastos(f).total, 7);
  assert.ok(clip.validar(f).some((p) => /Gastou 7/.test(p.mensagem)));
});

test('Valores Resumidos para um guerreiro', () => {
  const f = ficha(
    { forca: 3, destreza: 2, fisico: 3, vontade: 1, fe: 1 },
    { ataqueCorporal: 2, agilidade: 1, reflexo: 2, resistencia: 2, saude: 1 },
  );
  const v = clip.valores(f);
  assert.equal(v.ataqueCurta.valor, 3);
  assert.equal(v.defesa.valor, 4);
  assert.equal(v.vida.valor, 8 + 2 + 4); // Corpo dominante
  assert.equal(v.sanidade.valor, 4 + 2 * 2);
  assert.equal(v.magia.valor, 0);
});

test('Caminho dominante muda Vida e Sanidade, e o empate pede escolha', () => {
  const mago = ficha({ inteligencia: 3, sabedoria: 2 }, {}, {});
  assert.equal(clip.caminhoDominante(mago).id, 'mente');
  assert.equal(clip.valores(mago).vida.valor, 5);
  assert.equal(clip.valores(mago).sanidade.valor, 7);

  const empate = ficha({ forca: 2, vontade: 2 });
  assert.deepEqual(clip.caminhoDominante(empate).empate, ['corpo', 'espirito']);
  assert.ok(clip.validar(empate).some((p) => p.ref === 'caminhoPrincipal'));
  empate.caminhoPrincipal = 'espirito';
  assert.equal(clip.valores(empate).sanidade.valor, 10 + 4);
  assert.ok(!clip.validar(empate).some((p) => p.ref === 'caminhoPrincipal'));
});

test('Perícias marcadas somam no valor correspondente', () => {
  const f = ficha({ destreza: 2 }, { precisao: 1 });
  f.pericias.push({ id: 'arco', nome: 'Arco', requisitos: ['precisao'], nivel: 1, aplica: 'longa' });
  assert.equal(clip.valores(f).ataqueLonga.valor, 2);
});

test('Limite de equipamento: Força4 usa Espada2, Escudo1 e Armadura1', () => {
  const f = ficha({ forca: 4 });
  f.equipamentos = [
    { nome: 'Espada', tipo: 'arma', modificador: 2 },
    { nome: 'Escudo', tipo: 'escudo', modificador: 1 },
    { nome: 'Armadura', tipo: 'armadura', modificador: 1 },
  ];
  assert.ok(!clip.validar(f).some((p) => p.manual === clip.SECOES.equipamentos));
  f.equipamentos.push({ nome: 'Elmo', tipo: 'armadura', modificador: 1 });
  assert.ok(clip.validar(f).some((p) => p.manual === clip.SECOES.equipamentos));
  f.aprimoramentos.manipulacaoDePeso = 1;
  assert.ok(!clip.validar(f).some((p) => p.manual === clip.SECOES.equipamentos));
});

test('Antecedentes: exemplo do manual (Corpo 3, Má Fama 2 e Inimigo 1)', () => {
  const f = ficha({ forca: 1, destreza: 1, fisico: 1, inteligencia: 2, percepcao: 2, vontade: 2, presenca: 2 });
  f.antecedentes = [
    { nome: 'Má Fama', tipo: 'mau', nivel: 2 },
    { nome: 'Inimigo', tipo: 'mau', nivel: 1 },
  ];
  const a = clip.pontosAntecedentes(f);
  assert.equal(a.inicial, 3);
  assert.equal(a.disponivel, 6);
  f.antecedentes.push({ nome: 'Deficiência Física', tipo: 'mau', nivel: 1 });
  assert.equal(clip.pontosAntecedentes(f).disponivel, 6); // teto: dobro
});

test('Sequência de Combate: dano com arma, armadura, escudo e Resistência', () => {
  const r = clip.resolverAtaque({
    ataque: 4, defesa: 2, arma: 2, armadura: 1, escudo: 0, resistencia: 1,
    dadoAtaque: 5, dadoDefesa: 3, rng: dados(3),
  });
  assert.equal(r.valorAtaque, 9);
  assert.equal(r.valorDefesa, 5);
  assert.ok(r.acertou);
  assert.equal(r.dano, 4 + 2 - 1 - 1);
});

test('Empate favorece o defensor e acerto tira no mínimo 1', () => {
  assert.equal(clip.resolverAtaque({ ataque: 2, defesa: 2, dadoAtaque: 3, dadoDefesa: 3, rng: dados(3) }).acertou, false);
  const r = clip.resolverAtaque({ ataque: 3, defesa: 2, armadura: 5, dadoAtaque: 3, dadoDefesa: 3, rng: dados(3) });
  assert.equal(r.dano, 1);
});

test('Críticos: 1 seguido de 1 e 6 seguido de 6', () => {
  assert.equal(clip.verificarCritico(1, dados(1)).critico, 'falha');
  assert.equal(clip.verificarCritico(6, dados(6)).critico, 'sucesso');
  assert.equal(clip.verificarCritico(6, dados(2)).critico, null);
  assert.equal(clip.verificarCritico(4, dados(6)).confirmacao, null);
});

test('Iniciativa segue a ordem dos critérios', () => {
  const a = ficha({ destreza: 3 }, { reflexo: 1 });
  const b = ficha({ destreza: 2 }, { reflexo: 1, agilidade: 2 });
  assert.deepEqual(clip.iniciativa(a, b), { vencedor: 'b', criterio: 'Agilidade', valores: [0, 2] });
  const c = ficha();
  const d = ficha();
  const r = clip.iniciativa(c, d, { rng: dados(2, 2, 5, 3) });
  assert.equal(r.criterio, 'Rolagem de dados (D6)');
  assert.equal(r.vencedor, 'a');
});

test('Testes: exemplos da porta (Dificuldade 10)', () => {
  // Força3 rola 3D6 e tira 12
  assert.equal(clip.testar({ nivel: 3, dificuldade: 10, rng: dados(4, 4, 4) }).sucesso, true);
  // Força1 insiste: tira 4 e paga 6 de Vida
  const insistiu = clip.testar({ nivel: 1, dificuldade: 10, insistir: true, caminho: 'corpo', rng: dados(4) });
  assert.equal(insistiu.custoVida, 6);
  assert.equal(insistiu.sucesso, true);
  // Pé de Cabra2: Força1 rola 3D6
  assert.equal(clip.testar({ nivel: 1, objeto: 2, dificuldade: 10, rng: dados(4) }).dados.length, 3);
  // Força0: 1D6-2, sem insistir
  const zero = clip.testar({ nivel: 0, dificuldade: 2, insistir: true, caminho: 'corpo', rng: dados(3) });
  assert.equal(zero.total, 1);
  assert.equal(zero.sucesso, false);
  // Insistir só vale no Corpo
  assert.equal(clip.testar({ nivel: 1, dificuldade: 10, insistir: true, caminho: 'mente', rng: dados(4) }).sucesso, false);
});

test('Magia: forma livre, efeito limitado pela Perícia e pelos PM', () => {
  const f = ficha({ inteligencia: 3, percepcao: 1 });
  f.pericias.push({ id: 'magiaAtaqueFisico', nome: 'Mágicas de Ataque Físico', requisitos: ['inteligencia'], nivel: 1, magica: true });
  // Meteoro de fogo com Perícia 1: pede 5 PM, só 1 vale
  const meteoro = clip.lancarMagia(f, { pericia: 'magiaAtaqueFisico', pm: 5, rng: dados(4) });
  assert.equal(meteoro.gasto, 1);
  assert.equal(meteoro.limitado, true);
  assert.equal(meteoro.valorAtaque, 5);
  // Sem PM disponível
  assert.equal(clip.lancarMagia(f, { pericia: 'magiaAtaqueFisico', pmDisponivel: 0 }).falhou, true);
});

test('Modo sem números descreve o estado', () => {
  assert.equal(clip.descrever('vida', 10, 10), 'Intacto');
  assert.equal(clip.descrever('vida', 4, 10), 'Muito ferido');
  assert.equal(clip.descrever('vida', 0, 10), 'Caído');
  assert.equal(clip.descrever('sanidade', 1, 10), 'Por um fio');
});

test('Toda âncora usada pelo motor existe no manual', () => {
  // Mesmo algoritmo da página manual/: títulos e itens de lista curtos.
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const ids = new Set();
  for (const linha of readme.split('\n')) {
    const m = linha.match(/^#{1,6}\s+(.*?)\s*$/) || linha.match(/^\s*[*-]\s+(.*?)\s*$/);
    if (m) ids.add(clip.slug(m[1].replace(/[*_`]/g, '')));
  }
  const usadas = [
    ...Object.values(clip.SECOES),
    ...clip.CAMINHOS.map((c) => c.manual),
    ...[...Object.keys(clip.ATRIBUTOS), ...Object.keys(clip.APRIMORAMENTOS), ...clip.PERICIAS_EXEMPLO.map((p) => p.id)]
      .map(clip.ancora)
      .filter(Boolean),
  ];
  const faltando = usadas.filter((a) => !ids.has(a));
  assert.deepEqual(faltando, []);
});
