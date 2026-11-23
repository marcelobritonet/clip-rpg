import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../duplo-seis/regras.js';
import * as J from '../duplo-seis/jogo.js';
import { AVENTURAS } from '../duplo-seis/aventuras/index.js';
import { validarCenas } from '../duplo-seis/aventuras/validar.js';
import { jogar, seguir } from '../duplo-seis/robo.js';
import * as H from '../duplo-seis/aventuras/historia.js';
import * as P from '../duplo-seis/aventuras/prompt.js';
import { NUCLEO, ATO2, ATO3, FINAL, FICHA, FORMULARIO } from './duplo-seis-historia-exemplo.js';

const copia = (x) => JSON.parse(JSON.stringify(x));
const nova = () => H.montarHistoria(copia(NUCLEO), copia(FICHA), { agora: 1700000000000, formulario: FORMULARIO });

/* ---------- O formato é só dados ---------- */

test('uma aventura da casa vira JSON, volta e conta a mesma história', () => {
  for (const av of AVENTURAS) {
    const ida = copia(av);
    for (const p of av.passados.slice(0, 2)) for (let i = 0; i < 12; i++) {
      const a = jogar({ semente: `json-${i}`, passado: p.id, aventura: av });
      const b = jogar({ semente: `json-${i}`, passado: p.id, aventura: ida });
      assert.deepEqual(b.cronica, a.cronica, `${av.id} ${p.id} ${i}`);
      assert.equal(b.fim.id, a.fim.id);
    }
  }
});

test('requer aceita um id ou uma lista em item, companheiro e marca', () => {
  const e = { ficha: R.novaFicha({}), itens: ['a'], companheiros: ['c'], marcas: ['x', 'y'], lacos: 0 };
  assert.ok(J.fecha(e, { marca: 'x' }));
  assert.ok(J.fecha(e, { marca: ['x', 'y'], item: ['a'], companheiro: 'c' }));
  assert.ok(!J.fecha(e, { marca: ['x', 'z'] }));
  assert.ok(!J.fecha(e, { semMarca: ['z', 'y'] }));
  assert.ok(J.fecha(e, { semMarca: ['z'] }));
});

test('finais declarados: brasa, laços, marcas e companheiros', () => {
  const s = { brasa: 2, lacos: 5, vida: 3, marcas: ['a'], companheiros: ['tila'] };
  assert.ok(J.fechaFinal(s, undefined));
  assert.ok(J.fechaFinal(s, { brasa: { min: 2 }, lacos: { min: 5 }, marca: 'a' }));
  assert.ok(!J.fechaFinal(s, { brasa: { min: 3 } }));
  assert.ok(!J.fechaFinal(s, { brasa: { max: 0 } }));
  assert.ok(!J.fechaFinal(s, { marca: ['a', 'b'] }));
  assert.ok(J.fechaFinal(s, { semMarca: 'b', companheiro: 'tila' }));
  assert.ok(!J.fechaFinal(s, { semCompanheiro: 'tila' }));
  assert.ok(!J.fechaFinal(s, { inventada: 1 }), 'condição desconhecida não fecha');
});

/* ---------- Ler e conferir o que foi colado ---------- */

test('lerColado acha o JSON no meio da resposta da IA', () => {
  const texto = `Claro! Aqui está:\n\n\`\`\`json\n${JSON.stringify(NUCLEO)}\n\`\`\`\n\nQuer que eu continue?`;
  assert.equal(H.lerColado(texto).doc.nome, NUCLEO.nome);
  assert.ok(H.lerColado('').erro);
  assert.ok(H.lerColado('sem chaves').erro);
  assert.match(H.lerColado('{ "nome": "cortado').erro, /JSON/);
  assert.match(H.lerColado('{ "a": 1, }').erro, /quebrado/);
});

test('o exemplo passa na conferência, ato por ato', () => {
  assert.deepEqual(H.validarHistoria(copia(NUCLEO)), []);
  const h = nova();
  assert.deepEqual(H.validarSequencia(copia(ATO2), h, 2), []);
  J.anexar(h, copia(ATO2));
  assert.deepEqual(H.validarSequencia(copia(ATO3), h, 3), []);
  J.anexar(h, copia(ATO3));
  assert.deepEqual(H.validarSequencia(copia(FINAL), h, 4), []);
});

test('a conferência aponta cada erro pelo nome', () => {
  const com = (mexer) => { const d = copia(NUCLEO); mexer(d); return H.validarHistoria(d).join('\n'); };
  assert.match(com((d) => { d.formato = 'outro'; }), /formato/);
  assert.match(com((d) => { d.cenas.pop(); }), /exatamente 4 cenas/);
  assert.match(com((d) => { d.cenas[1].id = d.cenas[0].id; }), /id repetido/);
  assert.match(com((d) => { d.cenas[0].abordagens[0].sucesso.efeitos.item = 'nao-existe'; }), /item desconhecido/);
  assert.match(com((d) => { d.cenarios[2] = 'praia'; }), /cenarios/);
  assert.match(com((d) => { d.cenas[0].abordagens.pop(); d.cenas[0].abordagens.pop(); }), /3 abordagens/);
  assert.match(com((d) => { delete d.cenas[0].abordagens[0].falha.cronica; }), /falta cronica/);
  assert.match(com((d) => { d.cenas[0].abordagens[0].falha.efeitos.vida = -9; }), /fora da faixa/);
  assert.match(com((d) => { d.cenas[0].abordagens[0].teste.chave = 'carisma'; }), /chave desconhecida/);
  assert.match(com((d) => { d.cenas[0].requer = { marca: 'x' }; }), /não leva "requer"/);
  assert.match(com((d) => { d.cenas[2].abordagens[3].requer = { marca: 'fantasma' }; }), /nenhuma cena concede/);
  assert.match(com((d) => { d.itens['__proto__x'] = { nome: 'x', tipo: 'objeto', mod: 1 }; }), /id "__proto__x"/);
  assert.match(com((d) => { d.itensIniciais = ['lupa', 'cha', 'chave', 'lupa']; }), /itensIniciais/);
  assert.match(com((d) => { delete d.quedas.perdido; }), /quedas/);
  assert.match(com((d) => { delete d.textos.velar; }), /falta "velar"/);
  assert.match(com((d) => { d.cenas = 'quatro cenas'; }), /lista de cenas/);
  assert.match(com((d) => { d.cenas[0].abordagens = null; }), /abordagens/);
  assert.match(com((d) => { d.cenas[0].abordagens[0].teste = 'forca 6'; }), /teste/);

  const h = nova();
  const seq = (base, ato, mexer) => { const d = copia(base); mexer(d); return H.validarSequencia(d, h, ato).join('\n'); };
  assert.match(seq(ATO2, 2, (d) => { d.ato = 3; }), /"ato" precisa ser 2/);
  assert.match(seq(ATO2, 2, (d) => { d.cenas[0].id = 'ato1-padaria'; }), /já foi usado/);
  assert.match(seq(ATO2, 2, (d) => { d.itens.lupa = { nome: 'Outra Lupa', mod: 1, tipo: 'objeto' }; }), /já existe/);
  assert.match(seq(ATO2, 2, (d) => { d.cenas[1].abordagens[3].combate = 'dragao'; }), /inimigo desconhecido/);
  J.anexar(h, copia(ATO2)); J.anexar(h, copia(ATO3));
  assert.match(seq(FINAL, 4, (d) => { d.finais[3].quando = { brasa: { min: 0 } }; }), /último final/);
  assert.match(seq(FINAL, 4, (d) => { delete d.finais[1].quando; }), /falta "quando"/);
  assert.match(seq(FINAL, 4, (d) => { d.finais[0].quando.marca = 'inexistente'; }), /não é concedida/);
  assert.match(seq(FINAL, 4, (d) => { d.finais[0].estrelas = 5; }), /estrelas/);
  assert.match(seq(FINAL, 4, (d) => { d.finais[0].quando.brasa = 2; }), /"min"/);
  assert.match(seq(FINAL, 4, (d) => { d.desfecho = []; }), /1 ou 2 cenas/);
});

test('o exemplo do guia passa no validador de cenas', () => {
  const { cena, ...catalogo } = P.EXEMPLO;
  assert.deepEqual(validarCenas({ cenas: [cena], ...catalogo }), []);
});

/* ---------- A história viva na mesa ---------- */

test('a história para no acampamento até a sequência chegar, e segue na ordem escrita', () => {
  for (let i = 0; i < 30; i++) {
    const h = nova();
    const e = J.nova({ semente: `viva-${i}`, passado: 'criador', aventura: h });
    assert.deepEqual(e.itens, ['lupa', 'cha']);
    seguir(e);
    if (e.fase === 'fim') { assert.ok(['morte', 'perdido'].includes(e.fim.id)); continue; }
    assert.equal(J.faltaSequencia(e), 2);
    assert.deepEqual(e.vistas, ['abertura', ...NUCLEO.cenas.map((c) => c.id)], 'ordem escrita');
    const antes = e.ato;
    J.continuar(e);
    assert.equal(e.fase, 'acampamento', 'sem sequência, não parte');
    assert.equal(e.ato, antes);

    // Guardar e retomar no meio da espera.
    const volta = J.retomar(copia(J.guardar(e)), [copia(h)]);
    assert.equal(J.faltaSequencia(volta), 2);

    J.anexar(h, copia(ATO2));
    assert.equal(J.faltaSequencia(e), 0);
    seguir(e);
    if (e.fase === 'fim') continue;
    assert.equal(J.faltaSequencia(e), 3);
    J.anexar(h, copia(ATO3));
    seguir(e);
    if (e.fase === 'fim') continue;
    assert.equal(J.faltaSequencia(e), 4);
    J.anexar(h, copia(FINAL));
    seguir(e);
    assert.equal(e.fase, 'fim');
    assert.ok(FINAL.finais.some((f) => f.id === e.fim.id) || ['morte', 'perdido'].includes(e.fim.id));
    if (!['morte', 'perdido'].includes(e.fim.id)) assert.equal(e.vistas.length, 1 + 12 + 2);
  }
});

test('a história terminada é uma aventura comum: exporta, importa e joga de novo', () => {
  const h = nova();
  for (const s of [ATO2, ATO3, FINAL]) J.anexar(h, copia(s));
  assert.equal(H.escritaAte(h), 4);
  const arquivo = copia(h);
  assert.deepEqual(H.validarArquivo(arquivo), []);
  const importada = H.daImportacao(arquivo, { agora: 1800000000000 });
  assert.notEqual(importada.id, h.id);
  const vistos = new Set();
  for (let i = 0; i < 60; i++) for (const perfil of ['atento', 'acaso']) {
    const e = jogar({ semente: `imp-${i}`, passado: 'criador', aventura: importada, perfil });
    assert.equal(e.fase, 'fim');
    vistos.add(e.fim.id);
  }
  assert.ok(vistos.size >= 3, [...vistos].join(' '));
  // Pela metade também vale; quebrada, não.
  const metade = copia(nova());
  assert.deepEqual(H.validarArquivo(metade), []);
  assert.equal(H.escritaAte(H.daImportacao(metade)), 1);
  assert.ok(H.validarArquivo({ nome: 'x' }).length);
  const ruim = copia(h); ruim.passados[0].atributos.forca = 9;
  assert.ok(H.validarArquivo(ruim).length);
  const semAto = copia(h); semAto.cenas = semAto.cenas.filter((c) => c.ato !== 2);
  assert.match(H.validarArquivo(semAto).join('\n'), /falta o ato 2/);
});

/* ---------- Os prompts ---------- */

test('o prompt inicial leva o pedido, a ficha e o formato', () => {
  const p = P.promptInicial(FORMULARIO, FICHA, 'pt');
  assert.ok(p.includes(FORMULARIO.premissa));
  assert.ok(p.includes('violência com crianças'));
  assert.ok(p.includes('A Relojoeira'));
  assert.ok(p.includes('maquinas 2'));
  assert.ok(p.includes('inteligencia 3, percepcao 2, sabedoria 0'), 'os dados de todos os Atributos');
  assert.ok(p.includes('| 3 | 8 | 10 | 12 |'), 'a tabela de Dificuldade por dados');
  assert.ok(p.includes(H.FORMATO_HISTORIA));
  assert.ok(p.includes('Ato 3: a torre'));
  assert.ok(p.includes('português do Brasil'));
  assert.ok(P.promptInicial(FORMULARIO, FICHA, 'en').includes('inglês'));
});

test('o prompt da sequência conta o que o personagem fez e como ele está', () => {
  const h = nova();
  const e = J.nova({ semente: 'conta', passado: 'criador', aventura: h });
  // Joga o ato 1 à mão: ganha Nico e depois o deixa na estação.
  const jogarCena = (id) => {
    J.escolher(e, id);
    if (e.fase === 'insistir') J.insistir(e, false);
    J.continuar(e);
    if (e.fase === 'surto') J.continuar(e);
  };
  jogarCena('mente');
  for (let i = 0; i < 3 && e.fase === 'cena'; i++) jogarCena('mente');
  if (e.fase !== 'cena') return; // a semente levou a um surto fatal: outro teste cobre
  e.companheiros = ['nico'];
  jogarCena('deixar');
  assert.equal(e.fase, 'acampamento');
  assert.deepEqual(e.perdidos, ['nico']);
  const p = P.promptSequencia(h, e, J.faltaSequencia(e), 'pt');
  for (const linha of e.cronica) assert.ok(p.includes(linha), linha);
  assert.ok(p.includes('`abandonou` (Dora deixou nico esperando um trem que não vem.)'), 'a marca e de onde veio');
  assert.ok(/ficaram pelo caminho: Nico/.test(p), 'o companheiro perdido');
  assert.ok(p.includes('escolheu "Deixar o menino na estação"'));
  assert.ok(p.includes(h.rumo));
  assert.ok(p.includes(FORMULARIO.premissa));
  assert.ok(p.includes('`ato1-estacao`'));
  assert.ok(p.includes('"ato": 2'));
  assert.ok(p.includes(H.FORMATO_SEQUENCIA));
  assert.ok(!p.includes('"finais"'));

  const fim = P.promptSequencia(h, e, 4, 'pt');
  assert.ok(fim.includes('"finais"'));
  assert.ok(fim.includes('A Torre do Relógio'));
});

test('o pedido de conserto lista os erros', () => {
  const p = P.promptConserto(['cena x: falta texto', 'falta "rumo"']);
  assert.ok(p.includes('- cena x: falta texto'));
  assert.ok(p.includes('inteiro'));
});

test('a ficha do exemplo cabe nos 12 pontos', () => {
  assert.deepEqual(R.validar(R.novaFicha(FICHA), H.PONTOS), []);
});

/* ---------- Medir o que foi colado ---------- */

test('o medidor acusa a história fácil demais e a que tem escolha sem dados em toda cena', async () => {
  const { medir } = await import('../duplo-seis/aventuras/medir.js');
  const { readFileSync } = await import('node:fs');
  const exemplo = JSON.parse(readFileSync(new URL('../duplo-seis/aventuras/exemplos/as-tres-da-tarde.json', import.meta.url), 'utf8'));
  const ato1 = { ...exemplo, cenas: exemplo.cenas.filter((c) => c.ato === 1), desfecho: [], finais: [] };
  const m = medir(ato1, null, { n: 60 });
  assert.ok(m.sucesso > 0.9);
  assert.ok(m.avisos.includes('facil'));
  assert.equal(m.final, null, 'sem final escrito, não mede finais');
  const p = P.promptAjuste(m);
  assert.ok(p.includes('fácil demais') && p.includes('60 vezes') && p.includes('inteiro'));
});

test('o medidor parte de onde o jogador está, sem mexer na sessão dele, e mede os finais', async () => {
  const { medir } = await import('../duplo-seis/aventuras/medir.js');
  const h = nova();
  const e = J.nova({ semente: 'viva-0', passado: 'criador', aventura: h });
  seguir(e);
  assert.equal(J.faltaSequencia(e), 2);
  const antes = JSON.stringify(J.guardar(e));
  const prova = J.anexar(copia(h), copia(ATO2));
  const m = medir(prova, J.guardar(e), { n: 40 });
  assert.equal(JSON.stringify(J.guardar(e)), antes, 'a sessão do jogador fica como estava');
  assert.equal(h.cenas.length, 4, 'e a história dele também');
  assert.ok(m.sucesso > 0 && m.sucesso <= 1 && m.queda >= 0 && m.relogio <= 10);
  // Até o final: a medida traz a chance de 3 estrelas.
  for (const s of [ATO2, ATO3]) { J.anexar(h, copia(s)); seguir(e); if (e.fase === 'fim') return; }
  const fim = medir(J.anexar(copia(h), copia(FINAL)), J.guardar(e), { n: 40 });
  assert.ok(fim.final.tres >= 0 && fim.final.tres <= 1);
  assert.ok(Object.keys(fim.final.finais).every((id) => FINAL.finais.some((f) => f.id === id)));
});

test('a tabela de Dificuldade acompanha os dados', () => {
  assert.equal(P.dificuldadePara(2, P.DEGRAUS.justo), 7);
  assert.equal(P.dificuldadePara(3, P.DEGRAUS.folgado), 8);
  assert.ok(P.dificuldadePara(4, P.DEGRAUS.apertado) > P.dificuldadePara(4, P.DEGRAUS.justo));
});

/* ---------- Capítulo seguinte ---------- */

/** Joga a história de mentira até um final que não seja queda. */
function terminada() {
  for (let i = 0; i < 40; i++) {
    const h = nova();
    // Sem a saída de deixar Nico na estação, que o robô sempre escolhe por ser livre.
    for (const c of h.cenas) c.abordagens = c.abordagens.filter((x) => x.id !== 'deixar');
    for (const s of [ATO2, ATO3, FINAL]) J.anexar(h, copia(s));
    const e = jogar({ semente: `cap-${i}`, passado: 'criador', aventura: h });
    if (!['morte', 'perdido'].includes(e.fim.id) && e.companheiros.includes('nico') && e.marcas.length) return { h, e };
  }
  throw new Error('nenhuma semente terminou com Nico e marcas');
}

test('o capítulo seguinte leva a ficha evoluída, as marcas e os companheiros', () => {
  const { h, e } = terminada();
  h.ultimoFim = H.resumoDoFim(e);
  assert.ok(H.podeSeguir(h));
  assert.ok(!H.podeSeguir({ ultimoFim: { final: { id: 'morte' } } }));
  const herda = H.herancaDe(h);
  assert.deepEqual(herda.marcas, e.marcas);
  assert.deepEqual(Object.keys(herda.catalogo), ['nico']);

  const p = P.promptCapitulo(h, 'quero saber o que houve com a filha', 'pt');
  assert.ok(p.includes('capítulo 2'));
  for (const linha of e.cronica) assert.ok(p.includes(linha));
  assert.ok(p.includes(e.fim.titulo));
  assert.ok(p.includes('`nico`: Nico'));
  assert.ok(p.includes(`\`${e.marcas[0]}\``));
  assert.ok(p.includes('quero saber o que houve com a filha'));
  assert.ok(p.includes(H.FORMATO_HISTORIA));

  // A IA devolve um núcleo novo que usa o que ele traz, sem declarar Nico de novo.
  const doc = copia(NUCLEO);
  doc.nome = 'As Quatro e Meia';
  delete doc.companheiros.nico;
  doc.cenas[0].abordagens[0].sucesso.efeitos = { lacos: 1 };
  doc.cenas[1].abordagens.push({ id: 'lembra', rotulo: 'Lembrar a velha dívida', requer: { marca: e.marcas[0] }, livre: true, resultado: { texto: 'A dívida antiga abre a porta nova.', cronica: '{nome} cobrou uma dívida do capítulo anterior.', efeitos: { brasa: -1 } } });
  assert.match(H.validarHistoria(copia(doc)).join('\n'), /companheiro desconhecido "nico"|nenhuma cena concede/, 'sem a herança, não passa');
  assert.deepEqual(H.validarHistoria(copia(doc), { herda }), []);

  const cap2 = H.montarHistoria(doc, { ...h.ultimoFim.ficha, id: 'livre', itens: [] }, { agora: 1900000000000, herda, capitulo: 2, anterior: { nome: h.nome, resumo: h.resumo, final: e.fim.titulo, cronica: e.cronica } });
  assert.equal(cap2.capitulo, 2);
  assert.ok(cap2.pontos >= H.PONTOS);
  const s = J.nova({ semente: 'cap2', passado: 'criador', aventura: cap2 });
  assert.deepEqual(s.marcas, e.marcas);
  assert.deepEqual(s.companheiros, ['nico']);
  assert.equal(R.nivel(s.ficha, 'inteligencia'), R.nivel(e.ficha, 'inteligencia'), 'a ficha chega evoluída');
  seguir(s);
  assert.ok(s.fase === 'fim' || J.faltaSequencia(s) === 2);

  // E o capítulo 2 exporta e importa com a herança.
  const arquivo = copia(cap2);
  assert.deepEqual(H.validarArquivo(arquivo), []);
  const volta = H.daImportacao(arquivo);
  assert.equal(volta.capitulo, 2);
  assert.deepEqual(volta.passados[0].marcas, e.marcas);
  assert.deepEqual(volta.passados[0].companheiros, ['nico']);
  assert.equal(volta.anterior.nome, h.nome);
  assert.ok(volta.companheiros.nico);
});
