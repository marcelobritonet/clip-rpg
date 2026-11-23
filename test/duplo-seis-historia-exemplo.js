/**
 * Uma história viva de mentira, no papel da IA: o núcleo, os atos 2 e 3 e o
 * final, como chegariam colados. Serve aos testes e à conferência no navegador
 * (`node test/duplo-seis-historia-exemplo.js <pasta>` grava os quatro JSON).
 */
const desf = (texto, efeitos) => ({ texto, cronica: `{nome} ${texto.toLowerCase()}`, ...(efeitos ? { efeitos } : {}) });

/** Uma cena com as três abordagens abertas e o que mais vier em `extras`. */
export function cena(id, ato, titulo, { dificuldade = 6, extras = [], efeitos = {} } = {}) {
  const aberta = (aid, chave, rotulo) => ({
    id: aid,
    rotulo,
    teste: { chave, dificuldade },
    sucesso: desf(`Resolveu ${titulo} pelo caminho de ${chave}.`, { lacos: 1, ...efeitos }),
    falha: desf(`Tropeçou em ${titulo} tentando ${chave}.`, { vida: -1 }),
  });
  return {
    id,
    ato,
    titulo,
    texto: `Chove fino sobre ${titulo}. Alguém espera por você debaixo do toldo, com pressa e sem coragem de pedir. O relógio da praça parou às três, e ninguém aqui sabe dizer de que dia.`,
    abordagens: [aberta('corpo', 'forca', 'Fazer na marra'), aberta('mente', 'percepcao', 'Olhar com calma'), aberta('espirito', 'presenca', 'Pedir com jeito'), ...extras],
  };
}

export const FICHA = {
  id: 'livre',
  titulo: 'A Relojoeira',
  nome: 'Dora',
  quem: 'Conserta relógios na praça desde menina e desconfia de tudo que anda certo demais.',
  motivo: 'O relógio da praça parou, e o pai dela parou junto.',
  caminho: 'mente',
  atributos: { inteligencia: 3, percepcao: 2, destreza: 2, vontade: 1, fe: 1 },
  aprimoramentos: { precisao: 1 },
  pericias: { maquinas: 2 },
  antecedentes: { boaFama: { nivel: 1 } },
  itens: [],
};

export const FORMULARIO = { premissa: 'O relógio da praça parou e a cidade parou com ele.', lugar: 'cidade do interior, anos 1920', tom: 'mistério manso', relogio: 'a corda de um relógio de bolso', emJogo: 'o tempo de todo mundo', evitar: 'violência com crianças', fios: ['a praça', '', 'a torre'] };

export const NUCLEO = {
  formato: 'duplo-seis/historia@1',
  nome: 'As Três da Tarde',
  resumo: 'O relógio da praça parou às três e a cidade inteira ficou presa na mesma tarde. Só o seu relógio de bolso ainda anda.',
  genero: 'Mistério',
  inicio: 'Praça da Matriz',
  atos: ['', 'A Praça', 'O Ramal', 'A Oficina', 'A Torre do Relógio'],
  cenarios: ['oratorio', 'vila', 'mata', 'vilanova', 'torre'],
  relogio: { nome: 'Corda', palavras: ['parada', 'no último dente', 'frouxa', 'pela metade', 'firme', 'cheia'] },
  textos: {
    noite: 'Você se senta num banco da praça e dá um pouco de corda no relógio de bolso, só para ouvir alguma coisa andar.',
    velar: 'Dar corda com cuidado',
    velou: 'Você abre a tampa, limpa a engrenagem com a ponta do lenço e dá corda devagar.',
    subir: 'Subir à torre',
    pausa: 'Banco da praça',
  },
  rumo: 'O relojoeiro velho parou o relógio de propósito, para segurar a tarde em que a filha ainda estava viva. Quem acordar a cidade tira dele essa tarde.',
  quedas: {
    morte: { titulo: 'Sem corda', texto: 'O corpo para antes do relógio. Ele continua andando no seu bolso por mais um dia, e depois faz como a cidade.' },
    perdido: { titulo: 'Três em ponto', texto: 'Você se senta na praça e olha o mostrador. São três horas. Sempre foram. Você não lembra de ter achado isso estranho.' },
  },
  itens: {
    lupa: { nome: 'Lupa de Relojoeiro', mod: 1, tipo: 'objeto', tags: ['lente'] },
    chave: { nome: 'Chave de Corda', mod: 1, tipo: 'objeto', tags: ['alavanca'] },
    cha: { nome: 'Chá de Cidreira', tipo: 'consumivel', cura: { sanidade: '1d6' } },
  },
  companheiros: {
    nico: { nome: 'Nico', quem: 'engraxate de dez anos, o único que ainda sente fome', niveis: { destreza: 2, percepcao: 1 } },
  },
  inimigos: {},
  itensIniciais: ['lupa', 'cha'],
  abertura: cena('abertura', 0, 'o relógio parado', { dificuldade: 5 }),
  cenas: [
    cena('ato1-engraxate', 1, 'a caixa do engraxate', { efeitos: { companheiro: 'nico' } }),
    cena('ato1-padaria', 1, 'a padaria sem pão', { efeitos: { marca: 'pao' } }),
    cena('ato1-coreto', 1, 'o coreto mudo', {
      extras: [{ id: 'maquinas', rotulo: 'Abrir a caixa de música', requer: { nivel: { maquinas: 1 } }, teste: { chave: 'maquinas', dificuldade: 3 }, sucesso: desf('Fez o coreto tocar de novo.', { lacos: 1, marco: true, marca: 'coreto' }), falha: desf('Entortou a mola do coreto.', { sanidade: -1 }) }],
    }),
    cena('ato1-estacao', 1, 'a estação sem trem', { extras: [{ id: 'deixar', rotulo: 'Deixar o menino na estação', requer: { companheiro: 'nico' }, livre: true, resultado: desf('Deixou Nico esperando um trem que não vem.', { semCompanheiro: 'nico', marca: 'abandonou' }) }] }),
  ],
};

export const ATO2 = {
  formato: 'duplo-seis/sequencia@1',
  ato: 2,
  rumo: 'O relojoeiro já sabe que alguém mexeu no coreto. Ele vai tentar convencer, não ferir.',
  itens: { lampiao: { nome: 'Lampião do Ramal', mod: 1, tipo: 'objeto', tags: ['luz'] } },
  companheiros: {},
  inimigos: { cao: { nome: 'Cão do Guarda-Linha', ataque: 1, defesa: 1, vida: 3 } },
  cenas: [
    cena('ato2-trilho', 2, 'o trilho torto', { dificuldade: 7, efeitos: { item: 'lampiao' } }),
    cena('ato2-guarda', 2, 'a casa do guarda-linha', { dificuldade: 7, extras: [{ id: 'lutar', rotulo: 'Enfrentar o cão', combate: 'cao', vitoria: desf('Pôs o cão para correr.'), derrota: desf('Foi derrubada pelo cão.'), fuga: desf('Fugiu do cão pela cerca.') }] }),
    cena('ato2-tunel', 2, 'o túnel', { dificuldade: 7, extras: [{ id: 'coreto', rotulo: 'Assobiar a valsa do coreto', requer: { marca: 'coreto' }, livre: true, resultado: desf('Atravessou o túnel assobiando a valsa.', { lacos: 1, marca: 'valsa' }) }] }),
    cena('ato2-vagao', 2, 'o vagão parado', { dificuldade: 7 }),
  ],
};

export const ATO3 = {
  formato: 'duplo-seis/sequencia@1',
  ato: 3,
  rumo: 'A filha do relojoeiro está na oficina, parada no meio de um passo.',
  itens: {},
  companheiros: {},
  inimigos: {},
  cenas: [
    cena('ato3-vitrine', 3, 'a vitrine', { dificuldade: 8 }),
    cena('ato3-bancada', 3, 'a bancada', { dificuldade: 8 }),
    cena('ato3-escada', 3, 'a escada dos fundos', { dificuldade: 8 }),
    cena('ato3-quarto', 3, 'o quarto da filha', { dificuldade: 8, efeitos: { marca: 'filha' } }),
  ],
};

export const FINAL = {
  formato: 'duplo-seis/sequencia@1',
  ato: 4,
  rumo: 'Fim.',
  desfecho: [cena('fim-maquina', 4, 'a máquina do relógio', { dificuldade: 9 }), cena('fim-relojoeiro', 4, 'o relojoeiro', { dificuldade: 9, efeitos: { marca: 'perdoou' } })],
  finais: [
    { id: 'quatro', titulo: 'Quatro horas', estrelas: 3, quando: { brasa: { min: 1 }, lacos: { min: 4 }, marca: 'perdoou' }, texto: 'O relógio bate quatro, e a cidade solta o ar.' },
    { id: 'sozinha', titulo: 'A tarde dele', estrelas: 2, quando: { brasa: { min: 1 }, semMarca: 'abandonou' }, texto: 'A cidade anda. O relojoeiro fica na torre.' },
    { id: 'tres-e-um', titulo: 'Três e um', estrelas: 1, quando: { brasa: { min: 1 } }, texto: 'O ponteiro anda um minuto e basta.' },
    { id: 'tres', titulo: 'Três em ponto, de novo', estrelas: 0, texto: 'A corda acaba no último degrau.' },
  ],
};

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const { writeFileSync } = await import('node:fs');
  const pasta = process.argv[2] ?? '.';
  for (const [nome, doc] of Object.entries({ nucleo: NUCLEO, ato2: ATO2, ato3: ATO3, final: FINAL })) writeFileSync(`${pasta}/${nome}.json`, JSON.stringify(doc, null, 2));
  console.log(`gravados em ${pasta}`);
}
