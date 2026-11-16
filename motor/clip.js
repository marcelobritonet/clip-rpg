/**
 * Motor de regras do Sistema Clip.
 *
 * Módulo ES sem dependências: roda no navegador (a ficha digital importa daqui)
 * e no Node (os testes em `test/` também).
 *
 * Cada regra aponta para o trecho do manual (README.md) em que se apoia, pelo
 * campo `manual`. É a âncora da página `manual/`, gerada por `slug()` a partir
 * do título ou do item de lista do README.
 *
 * Onde o manual é omisso ou se contradiz, o motor segue uma interpretação e
 * marca o ponto em PENDENCIAS.md. Esses pontos ficam em `REGRAS`, para que
 * mudem num lugar só quando a regra for fechada.
 */

/* ------------------------------------------------------------------------ */
/* Utilidades                                                               */
/* ------------------------------------------------------------------------ */

/**
 * Âncora usada pela página do manual: minúsculas, sem acentos, só letras,
 * números e hífens. "Manipulação de Peso" → "manipulacao-de-peso".
 */
export function slug(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Rola 1D6. `rng` devolve um número em [0, 1) e pode ser trocado nos testes. */
export function d6(rng = Math.random) {
  return 1 + Math.floor(rng() * 6);
}

/** Rola `n` D6 e devolve a lista de resultados. */
export function rolar(n, rng = Math.random) {
  return Array.from({ length: Math.max(0, n) }, () => d6(rng));
}

const soma = (lista) => lista.reduce((a, b) => a + b, 0);

/* ------------------------------------------------------------------------ */
/* Pontos em aberto no manual (ver PENDENCIAS.md)                            */
/* ------------------------------------------------------------------------ */

export const REGRAS = {
  /** Custo em Pontos de Evolução por nível comprado. Manual: "XX". */
  custoPorNivel: { atributo: 1, aprimoramento: 1, pericia: 1 },
  /**
   * Valor de um Caminho. O manual fala em "maior valor no Caminho" e em
   * "Corpo 3" sem definir o cálculo. Adotado: soma dos 3 Atributos.
   */
  valorCaminho: 'soma',
  /** "Os níveis variam em média entre zero e cinco": acima disso, só aviso. */
  nivelMaximoSugerido: 5,
  /**
   * Manipulação de Peso: "permite utilizar armas 1 nível a mais". Adotado:
   * cada nível soma 1 ao limite de modificadores de equipamento.
   */
  manipulacaoAumentaLimite: true,
  /**
   * A Sequência de Combate subtrai a Resistência do dano, embora ela já entre
   * no Valor de Defesa. O motor segue o texto (subtrai duas vezes).
   */
  resistenciaReduzDano: true,
  /** "Sempre desconte pelo menos 1 a cada ataque bem sucedido." */
  danoMinimo: 1,
};

/* ------------------------------------------------------------------------ */
/* Estrutura do personagem                                                  */
/* ------------------------------------------------------------------------ */

export const CAMINHOS = [
  { id: 'corpo', nome: 'Corpo', atributos: ['forca', 'destreza', 'fisico'], manual: 'corpo' },
  { id: 'mente', nome: 'Mente', atributos: ['inteligencia', 'percepcao', 'sabedoria'], manual: 'mente' },
  { id: 'espirito', nome: 'Espírito', atributos: ['vontade', 'presenca', 'fe'], manual: 'espirito' },
];

export const ATRIBUTOS = {
  forca: { nome: 'Força', caminho: 'corpo' },
  destreza: { nome: 'Destreza', caminho: 'corpo' },
  fisico: { nome: 'Físico', caminho: 'corpo' },
  inteligencia: { nome: 'Inteligência', caminho: 'mente' },
  percepcao: { nome: 'Percepção', caminho: 'mente' },
  sabedoria: { nome: 'Sabedoria', caminho: 'mente' },
  vontade: { nome: 'Vontade', caminho: 'espirito' },
  presenca: { nome: 'Presença', caminho: 'espirito' },
  fe: { nome: 'Fé', caminho: 'espirito' },
};

/**
 * Aprimoramentos. Os marcados `proposto` ainda não estão no manual: são a
 * sugestão para fechar a lacuna de Mente e Espírito (ver PENDENCIAS.md) e só
 * aparecem na ficha quando se liga "aprimoramentos propostos".
 */
export const APRIMORAMENTOS = {
  ataqueCorporal: { nome: 'Ataque Corporal', atributo: 'forca', manual: 'ataque-corporal' },
  arremesso: { nome: 'Arremesso', atributo: 'forca' },
  manipulacaoDePeso: { nome: 'Manipulação de Peso', atributo: 'forca' },
  agilidade: { nome: 'Agilidade', atributo: 'destreza' },
  precisao: { nome: 'Precisão', atributo: 'destreza' },
  reflexo: { nome: 'Reflexo', atributo: 'destreza' },
  resistencia: { nome: 'Resistência', atributo: 'fisico' },
  saude: { nome: 'Saúde', atributo: 'fisico' },
  aparencia: { nome: 'Aparência', atributo: 'fisico' },
  empatia: { nome: 'Empatia/Carisma', atributo: 'presenca', manual: 'empatia-carisma' },
  intimidacao: { nome: 'Intimidação', atributo: 'presenca' },
  lideranca: { nome: 'Liderança', atributo: 'presenca' },

  // Propostos: Mente
  memoria: { nome: 'Memória', atributo: 'inteligencia', proposto: true, efeito: 'Lembrar fatos, rotas e detalhes vistos antes.' },
  raciocinio: { nome: 'Raciocínio', atributo: 'inteligencia', proposto: true, efeito: '+1 no Valor de Ataque de Mágicas de Ataque Físico.' },
  erudicao: { nome: 'Erudição', atributo: 'inteligencia', proposto: true, efeito: 'Conhecimento acumulado: história, línguas mortas, ciência.' },
  atencao: { nome: 'Atenção', atributo: 'percepcao', proposto: true, efeito: 'Critério de Iniciativa antes de Reflexo; notar emboscadas.' },
  sentidos: { nome: 'Sentidos', atributo: 'percepcao', proposto: true, efeito: 'Visão, audição e olfato apurados; rastrear.' },
  intuicao: { nome: 'Intuição', atributo: 'percepcao', proposto: true, efeito: 'Pressentir perigo e intenções sem prova.' },
  discernimento: { nome: 'Discernimento', atributo: 'sabedoria', proposto: true, efeito: 'Perceber mentiras e julgar situações.' },
  vivencia: { nome: 'Vivência', atributo: 'sabedoria', proposto: true, efeito: 'Costumes, culturas e "como as coisas funcionam".' },
  serenidade: { nome: 'Serenidade', atributo: 'sabedoria', proposto: true, efeito: '-1 em cada perda de Sanidade (espelho de Resistência).' },

  // Propostos: Espírito
  determinacao: { nome: 'Determinação', atributo: 'vontade', proposto: true, efeito: 'Permite Insistir em testes de Mente, pagando com Sanidade.' },
  autocontrole: { nome: 'Autocontrole', atributo: 'vontade', proposto: true, efeito: '+1 na Defesa contra Ataque Mental e Controle.' },
  foco: { nome: 'Foco', atributo: 'vontade', proposto: true, efeito: '+1 no limite de PM gastos por mágica.' },
  conviccao: { nome: 'Convicção', atributo: 'fe', proposto: true, efeito: 'Resistir a dúvida, tentação e Mágicas de Controle.' },
  devocao: { nome: 'Devoção', atributo: 'fe', proposto: true, efeito: 'Canalizar forças em que se acredita (magia de fé).' },
  esperanca: { nome: 'Esperança', atributo: 'fe', proposto: true, efeito: 'Recuperar Sanidade própria e de aliados no descanso.' },
};

/**
 * Perícias de exemplo do manual. `requisitos` aceita Atributos,
 * Aprimoramentos ou outras Perícias (ex.: Cuidar de Animais exige Medicina).
 */
export const PERICIAS_EXEMPLO = [
  { id: 'maquinas', nome: 'Máquinas', requisitos: ['inteligencia'] },
  { id: 'engenharia', nome: 'Engenharia', requisitos: ['inteligencia'] },
  { id: 'medicina', nome: 'Medicina', requisitos: ['inteligencia'] },
  { id: 'ciencias', nome: 'Ciências', requisitos: ['inteligencia'] },
  { id: 'cuidarDeAnimais', nome: 'Cuidar de Animais', requisitos: ['inteligencia', 'medicina'] },
  { id: 'lidarComAnimais', nome: 'Lidar com Animais', requisitos: ['presenca'] },
  { id: 'montaria', nome: 'Montaria', requisitos: ['presenca', 'fisico'] },
  { id: 'futebol', nome: 'Futebol', requisitos: ['fisico', 'destreza'] },
  { id: 'sobrevivencia', nome: 'Sobrevivência', requisitos: ['fisico', 'percepcao'] },
  { id: 'investigacao', nome: 'Investigação', requisitos: ['percepcao', 'sabedoria'] },
  { id: 'interrogacao', nome: 'Interrogação', requisitos: ['percepcao', 'sabedoria', 'intimidacao'] },
  { id: 'historia', nome: 'História', requisitos: ['inteligencia'] },
  { id: 'artes', nome: 'Artes', requisitos: ['inteligencia'] },
  { id: 'idiomas', nome: 'Idiomas (cada um)', requisitos: ['inteligencia'] },
  { id: 'furtividade', nome: 'Furtividade', requisitos: ['agilidade'] },
  { id: 'prestidigitacao', nome: 'Prestidigitação', requisitos: ['agilidade'] },
  { id: 'equilibrio', nome: 'Equilíbrio', requisitos: ['agilidade'] },
  // Perícias Mágicas (Suplemento)
  { id: 'magiaAtaqueFisico', nome: 'Mágicas de Ataque Físico', requisitos: ['inteligencia'], magica: true, manual: 'magicas-de-ataque-fisico' },
  { id: 'magiaAtaqueMental', nome: 'Mágicas de Ataque Mental', requisitos: ['sabedoria', 'vontade'], magica: true, manual: 'magicas-de-ataque-mental' },
  { id: 'magiaSuporte', nome: 'Mágicas de Suporte', requisitos: ['sabedoria'], magica: true, manual: 'magicas-de-suporte' },
  { id: 'magiaEncantamento', nome: 'Mágicas de Encantamento', requisitos: ['percepcao', 'inteligencia'], magica: true, manual: 'magicas-de-encantamento' },
  { id: 'magiaElemental', nome: 'Manipulação Elemental Mágica', requisitos: ['inteligencia'], magica: true, manual: 'manipulacao-elemental-magica' },
  { id: 'magiaControle', nome: 'Mágicas de Controle', requisitos: ['sabedoria', 'vontade'], magica: true, manual: 'magica-de-controle' },
];

export const NIVEIS_INICIAIS = [
  { nome: 'Pessoa comum', min: 0, max: 4 },
  { nome: 'Pessoa bem treinada', min: 5, max: 9 },
  { nome: 'Especialista Iniciante', min: 10, max: 12 },
  { nome: 'Especialista Médio', min: 13, max: 15 },
  { nome: 'Especialista Muito Experiente', min: 16, max: 19 },
  { nome: 'Consagrado', min: 20, max: 25 },
  { nome: 'Lenda', min: 26, max: null },
];

export const ANTECEDENTES_EXEMPLO = {
  bons: ['Boa Fama', 'Aliado', 'Recursos Financeiros', 'Raça Incomum bem aceita'],
  maus: ['Má Fama', 'Inimigo', 'Falta de Recursos Financeiros', 'Raça Incomum não aceita', 'Deficiência Física'],
};

/** Âncora no manual para atributos, aprimoramentos e perícias de exemplo. */
export function ancora(id) {
  const a = ATRIBUTOS[id];
  if (a) return a.manual ?? slug(a.nome);
  const ap = APRIMORAMENTOS[id];
  if (ap) return ap.proposto ? null : ap.manual ?? slug(ap.nome);
  const p = PERICIAS_EXEMPLO.find((x) => x.id === id);
  if (p) return p.manual ?? 'pericias';
  return null;
}

/** Nome legível de qualquer id do sistema (ou da perícia própria da ficha). */
export function nomeDe(id, ficha) {
  return (
    ATRIBUTOS[id]?.nome ??
    APRIMORAMENTOS[id]?.nome ??
    ficha?.pericias?.find((p) => p.id === id)?.nome ??
    PERICIAS_EXEMPLO.find((p) => p.id === id)?.nome ??
    id
  );
}

/** Âncoras de seções do manual usadas pela ficha. */
export const SECOES = {
  caminhos: 'caminhos-de-evolucao',
  distribuicao: 'distribuicao-de-pontos',
  atributos: 'atributos',
  aprimoramentos: 'aprimoramentos',
  limitacoes: 'limitacoes-para-o-caminho-de-evolucao-do-personagem',
  pericias: 'pericias',
  experiencia: 'pontos-de-experiencia',
  valores: 'valores-resumidos',
  ataqueCurta: 'ataque-a-curta-distancia',
  ataqueLonga: 'ataque-a-longa-distancia',
  defesa: 'defesa',
  vida: 'pontos-de-vida',
  magia: 'pontos-de-magia',
  sanidade: 'sanidade',
  combate: 'combate',
  armas: 'armas',
  equipamentos: 'limitacao-para-equipamentos',
  iniciativa: 'iniciativa',
  sequencia: 'sequencia-de-combate',
  criticos: 'regras-especiais',
  testes: 'testes',
  dificuldades: 'definindo-dificuldades',
  magiaSuplemento: 'magia',
  limitesMagia: 'limitacoes-para-magias',
  antecedentes: 'antecedentes',
  regrasAntecedentes: 'regras-para-antecedentes',
};

/* ------------------------------------------------------------------------ */
/* Ficha                                                                    */
/* ------------------------------------------------------------------------ */

/** Ficha vazia, com todos os níveis em zero. */
export function novaFicha() {
  return {
    versao: 1,
    nome: '',
    jogador: '',
    conceito: '',
    pontosDeEvolucao: 10,
    caminhoPrincipal: null, // desempate quando dois Caminhos têm o mesmo valor
    atributos: Object.fromEntries(Object.keys(ATRIBUTOS).map((k) => [k, 0])),
    aprimoramentos: Object.fromEntries(Object.keys(APRIMORAMENTOS).map((k) => [k, 0])),
    /** { id, nome, requisitos: [ids], nivel, aplica: null|'curta'|'longa'|'defesa', magica? } */
    pericias: [],
    /** { nome, tipo: 'arma'|'armadura'|'escudo'|'outro', modificador } */
    equipamentos: [],
    /** { nome, tipo: 'bom'|'mau', nivel } */
    antecedentes: [],
    /** Valores atuais; null = cheio (igual ao inicial). */
    atual: { vida: null, magia: null, sanidade: null },
    notas: '',
  };
}

/** Nível de qualquer característica: Atributo, Aprimoramento ou Perícia. */
export function nivelDe(ficha, id) {
  if (id in ATRIBUTOS) return ficha.atributos[id] ?? 0;
  if (id in APRIMORAMENTOS) return ficha.aprimoramentos[id] ?? 0;
  return ficha.pericias.find((p) => p.id === id)?.nivel ?? 0;
}

/** Valor de cada Caminho (ver REGRAS.valorCaminho). */
export function valoresCaminhos(ficha) {
  return Object.fromEntries(
    CAMINHOS.map((c) => {
      const niveis = c.atributos.map((a) => nivelDe(ficha, a));
      return [c.id, REGRAS.valorCaminho === 'maior' ? Math.max(...niveis) : soma(niveis)];
    }),
  );
}

/**
 * Caminho de maior valor. Em empate, usa `ficha.caminhoPrincipal` se ele
 * estiver entre os empatados; senão, o primeiro na ordem Corpo, Mente,
 * Espírito. `empate` lista os empatados para a ficha avisar.
 */
export function caminhoDominante(ficha) {
  const v = valoresCaminhos(ficha);
  const max = Math.max(...Object.values(v));
  const empatados = CAMINHOS.map((c) => c.id).filter((id) => v[id] === max);
  const escolhido = empatados.includes(ficha.caminhoPrincipal) ? ficha.caminhoPrincipal : empatados[0];
  // Ficha zerada não tem empate a resolver.
  return { id: escolhido, empate: empatados.length > 1 && max > 0 ? empatados : null };
}

/** Nível máximo permitido para uma Perícia: o menor dos requisitos. */
export function maximoPericia(ficha, pericia) {
  if (!pericia.requisitos?.length) return 0;
  return Math.min(...pericia.requisitos.map((r) => nivelDe(ficha, r)));
}

/** Pontos de Evolução gastos, por tipo e no total. */
export function pontosGastos(ficha, custo = REGRAS.custoPorNivel) {
  const atributos = soma(Object.values(ficha.atributos)) * custo.atributo;
  const aprimoramentos = soma(Object.values(ficha.aprimoramentos)) * custo.aprimoramento;
  const pericias = soma(ficha.pericias.map((p) => p.nivel)) * custo.pericia;
  return { atributos, aprimoramentos, pericias, total: atributos + aprimoramentos + pericias };
}

const bonusPericias = (ficha, aplica) =>
  soma(ficha.pericias.filter((p) => p.aplica === aplica).map((p) => p.nivel));

/** Limite de modificadores de equipamento que podem ser usados em combate. */
export function limiteEquipamento(ficha) {
  return nivelDe(ficha, 'forca') + (REGRAS.manipulacaoAumentaLimite ? nivelDe(ficha, 'manipulacaoDePeso') : 0);
}

/** Pontos de Antecedentes disponíveis, gastos e o teto (dobro do inicial). */
export function pontosAntecedentes(ficha) {
  const inicial = Math.min(...Object.values(valoresCaminhos(ficha)));
  const ganhosBrutos = soma(ficha.antecedentes.filter((a) => a.tipo === 'mau').map((a) => a.nivel));
  const ganhos = Math.min(ganhosBrutos, inicial); // nunca acima do dobro do inicial
  const gastos = soma(ficha.antecedentes.filter((a) => a.tipo === 'bom').map((a) => a.nivel));
  return { inicial, ganhos, ganhosBrutos, gastos, disponivel: inicial + ganhos - gastos, teto: inicial * 2 };
}

/**
 * Valores Resumidos. Cada item traz o valor, a fórmula em texto e a âncora
 * no manual, para a ficha mostrar de onde veio o número.
 */
export function valores(ficha) {
  const n = (id) => nivelDe(ficha, id);
  const dom = caminhoDominante(ficha).id;

  const baseVida = dom === 'corpo' ? 8 : 5;
  const baseSanidade = { corpo: 4, mente: 7, espirito: 10 }[dom];

  return {
    ataqueCurta: {
      nome: 'Ataque à Curta Distância',
      valor: n('ataqueCorporal') + n('agilidade') + bonusPericias(ficha, 'curta'),
      formula: 'Ataque Corporal + Agilidade + Perícias',
      manual: SECOES.ataqueCurta,
    },
    ataqueLonga: {
      nome: 'Ataque à Longa Distância',
      valor: n('arremesso') + n('precisao') + bonusPericias(ficha, 'longa'),
      formula: 'Arremesso + Precisão + Perícias',
      manual: SECOES.ataqueLonga,
    },
    defesa: {
      nome: 'Defesa',
      valor: n('reflexo') + n('resistencia') + bonusPericias(ficha, 'defesa'),
      formula: 'Reflexo + Resistência + Perícias',
      manual: SECOES.defesa,
    },
    vida: {
      nome: 'Pontos de Vida',
      valor: baseVida + n('resistencia') + 4 * n('saude'),
      formula: `${baseVida} (${dom === 'corpo' ? 'Corpo' : 'Mente/Espírito'}) + Resistência + 4×Saúde`,
      manual: SECOES.vida,
    },
    magia: {
      nome: 'Pontos de Magia',
      valor: 2 * (n('inteligencia') + n('percepcao') + n('sabedoria')),
      formula: '2×(Inteligência + Percepção + Sabedoria)',
      manual: SECOES.magia,
    },
    sanidade: {
      nome: 'Sanidade',
      valor: baseSanidade + 2 * (n('vontade') + n('fe')),
      formula: `${baseSanidade} (${CAMINHOS.find((c) => c.id === dom).nome}) + 2×(Vontade + Fé)`,
      manual: SECOES.sanidade,
    },
  };
}

/**
 * Confere a ficha contra as regras. Devolve uma lista de
 * `{ nivel: 'erro'|'aviso', mensagem, ref, manual }`, em que `ref` é o id do
 * campo com problema (ou null).
 */
export function validar(ficha) {
  const problemas = [];
  const add = (nivel, mensagem, ref, manual) => problemas.push({ nivel, mensagem, ref, manual });

  const gastos = pontosGastos(ficha).total;
  if (gastos > ficha.pontosDeEvolucao) {
    add('erro', `Gastou ${gastos} Pontos de Evolução de ${ficha.pontosDeEvolucao} disponíveis.`, null, SECOES.distribuicao);
  }

  for (const [id, ap] of Object.entries(APRIMORAMENTOS)) {
    const nivel = nivelDe(ficha, id);
    const pai = nivelDe(ficha, ap.atributo);
    if (nivel > pai) {
      add('erro', `${ap.nome} ${nivel} passa de ${ATRIBUTOS[ap.atributo].nome} ${pai}.`, id, SECOES.limitacoes);
    }
  }

  for (const p of ficha.pericias) {
    const max = maximoPericia(ficha, p);
    if (p.nivel > max) {
      const menor = p.requisitos.reduce((a, b) => (nivelDe(ficha, a) <= nivelDe(ficha, b) ? a : b));
      add('erro', `${p.nome} ${p.nivel} passa de ${nomeDe(menor, ficha)} ${nivelDe(ficha, menor)}, o menor requisito.`, p.id, SECOES.pericias);
    }
  }

  const todos = [
    ...Object.keys(ATRIBUTOS).map((id) => [id, nivelDe(ficha, id)]),
    ...Object.keys(APRIMORAMENTOS).map((id) => [id, nivelDe(ficha, id)]),
    ...ficha.pericias.map((p) => [p.id, p.nivel]),
  ];
  for (const [id, nivel] of todos) {
    if (nivel > REGRAS.nivelMaximoSugerido) {
      add('aviso', `${nomeDe(id, ficha)} ${nivel} está acima da média do sistema (0 a ${REGRAS.nivelMaximoSugerido}).`, id, SECOES.distribuicao);
    }
  }

  const somaEquip = soma(ficha.equipamentos.map((e) => Math.max(0, e.modificador)));
  const limite = limiteEquipamento(ficha);
  if (somaEquip > limite) {
    add('erro', `Equipamentos somam ${somaEquip} de modificador; o limite em combate é ${limite}.`, null, SECOES.equipamentos);
  }

  const ant = pontosAntecedentes(ficha);
  if (ant.disponivel < 0) {
    add('erro', `Antecedentes bons custam ${ant.gastos} pontos; há ${ant.inicial + ant.ganhos}.`, null, SECOES.regrasAntecedentes);
  }
  if (ant.ganhosBrutos > ant.inicial) {
    add('aviso', `Maus Antecedentes dão no máximo ${ant.inicial} pontos (teto de ${ant.teto}).`, null, SECOES.regrasAntecedentes);
  }

  const emp = caminhoDominante(ficha).empate;
  if (emp && !emp.includes(ficha.caminhoPrincipal)) {
    const nomes = emp.map((id) => CAMINHOS.find((c) => c.id === id).nome).join(' e ');
    add('aviso', `${nomes} estão empatados; escolha o Caminho principal (muda Vida e Sanidade).`, 'caminhoPrincipal', SECOES.valores);
  }

  return problemas;
}

/* ------------------------------------------------------------------------ */
/* Dados, testes e críticos                                                 */
/* ------------------------------------------------------------------------ */

/**
 * Crítico de um único D6 (Regras Especiais): tirou 1, rola de novo, e outro 1
 * é falha crítica; tirou 6, rola de novo, e outro 6 é sucesso crítico.
 */
export function verificarCritico(dado, rng = Math.random) {
  if (dado !== 1 && dado !== 6) return { critico: null, confirmacao: null };
  const confirmacao = d6(rng);
  if (dado === 1 && confirmacao === 1) return { critico: 'falha', confirmacao };
  if (dado === 6 && confirmacao === 6) return { critico: 'sucesso', confirmacao };
  return { critico: null, confirmacao };
}

/**
 * Teste (seção Testes): rola um D6 por nível e compara com a Dificuldade.
 *
 * - `objeto`: modificador de um objeto que ajuda (soma níveis ao teste).
 * - Nível 0: rola 1D6-2 e não pode insistir.
 * - `insistir`: só no Caminho do Corpo; o que faltar é pago com Pontos de Vida.
 */
export function testar({ nivel, dificuldade, objeto = 0, insistir = false, caminho = null, rng = Math.random }) {
  const efetivo = nivel + objeto;
  let dados;
  let total;
  if (efetivo <= 0) {
    dados = rolar(1, rng);
    total = dados[0] - 2;
  } else {
    dados = rolar(efetivo, rng);
    total = soma(dados);
  }
  const sucesso = total >= dificuldade;
  const podeInsistir = caminho === 'corpo' && efetivo > 0;
  let custoVida = 0;
  if (!sucesso && insistir && podeInsistir) custoVida = dificuldade - total;
  return {
    dados,
    total,
    dificuldade,
    sucesso: sucesso || custoVida > 0,
    insistiu: custoVida > 0,
    custoVida,
    podeInsistir,
  };
}

/** Faixas de dificuldade sugeridas pelo manual. */
export const DIFICULDADES = [
  { nome: 'Muito Fácil', min: 2, max: 2 },
  { nome: 'Normal', min: 3, max: 4 },
  { nome: 'Difícil', min: 5, max: 10 },
  { nome: 'Muito Difícil', min: 11, max: 15 },
  { nome: 'Quase Impossível', min: 16, max: 25 },
];

/* ------------------------------------------------------------------------ */
/* Combate                                                                  */
/* ------------------------------------------------------------------------ */

const modEquip = (ficha, tipo) =>
  Math.max(0, ...ficha.equipamentos.filter((e) => e.tipo === tipo).map((e) => e.modificador));

/**
 * Iniciativa: compara dois personagens pelos critérios do manual, em ordem.
 * O critério 1 ("à critério do Mestre") fica de fora; `pericia` é o id da
 * Perícia correspondente à situação, se houver. Devolve
 * `{ vencedor: 'a'|'b', criterio, dados? }`.
 */
export function iniciativa(a, b, { pericia = null, rng = Math.random } = {}) {
  const criterios = [
    pericia && { nome: `Perícia ${nomeDe(pericia, a)}`, valor: (f) => nivelDe(f, pericia) },
    { nome: 'Reflexo', valor: (f) => nivelDe(f, 'reflexo') },
    { nome: 'Agilidade', valor: (f) => nivelDe(f, 'agilidade') },
    { nome: 'Destreza', valor: (f) => nivelDe(f, 'destreza') },
    { nome: 'Caminho do Corpo', valor: (f) => valoresCaminhos(f).corpo },
  ].filter(Boolean);

  for (const c of criterios) {
    const va = c.valor(a);
    const vb = c.valor(b);
    if (va !== vb) return { vencedor: va > vb ? 'a' : 'b', criterio: c.nome, valores: [va, vb] };
  }
  for (;;) {
    const da = d6(rng);
    const db = d6(rng);
    if (da !== db) return { vencedor: da > db ? 'a' : 'b', criterio: 'Rolagem de dados (D6)', valores: [da, db] };
  }
}

/**
 * Um ataque da Sequência de Combate, a partir de números.
 *
 * Dano = (Valor de Ataque − Valor de Defesa) + Arma − Armadura − Escudo
 *        − Resistência, com no mínimo 1 quando o ataque acerta.
 * Empate favorece o defensor.
 */
export function resolverAtaque({
  ataque, // valor base de ataque (sem o dado)
  defesa, // valor base de defesa (sem o dado)
  arma = 0,
  armadura = 0,
  escudo = 0,
  resistencia = 0,
  outrosAtaque = 0,
  outrosDefesa = 0,
  dadoAtaque,
  dadoDefesa,
  rng = Math.random,
}) {
  const da = dadoAtaque ?? d6(rng);
  const dd = dadoDefesa ?? d6(rng);
  const valorAtaque = ataque + outrosAtaque + da;
  const valorDefesa = defesa + outrosDefesa + dd;
  const acertou = valorAtaque > valorDefesa;
  const passos = [];
  let dano = 0;
  if (acertou) {
    const diferenca = valorAtaque - valorDefesa;
    const reducao = armadura + escudo + (REGRAS.resistenciaReduzDano ? resistencia : 0);
    const bruto = diferenca + arma - reducao;
    dano = Math.max(REGRAS.danoMinimo, bruto);
    passos.push(
      { nome: 'Diferença', valor: diferenca },
      { nome: 'Arma', valor: +arma },
      { nome: 'Armadura', valor: -armadura },
      { nome: 'Escudo', valor: -escudo },
    );
    if (REGRAS.resistenciaReduzDano) passos.push({ nome: 'Resistência', valor: -resistencia });
    if (bruto < REGRAS.danoMinimo) passos.push({ nome: 'Mínimo por acerto', valor: REGRAS.danoMinimo - bruto });
  }
  return {
    dadoAtaque: da,
    dadoDefesa: dd,
    valorAtaque,
    valorDefesa,
    acertou,
    dano,
    passos,
    critico: { ataque: verificarCritico(da, rng).critico, defesa: verificarCritico(dd, rng).critico },
  };
}

/** Atalho: ataque entre duas fichas, usando Valores Resumidos e equipamentos. */
export function atacar(atacante, defensor, { distancia = 'curta', ...resto } = {}) {
  const va = valores(atacante);
  const vd = valores(defensor);
  return resolverAtaque({
    ataque: distancia === 'longa' ? va.ataqueLonga.valor : va.ataqueCurta.valor,
    defesa: vd.defesa.valor,
    arma: modEquip(atacante, 'arma'),
    armadura: modEquip(defensor, 'armadura'),
    escudo: modEquip(defensor, 'escudo'),
    resistencia: nivelDe(defensor, 'resistencia'),
    ...resto,
  });
}

/* ------------------------------------------------------------------------ */
/* Magia                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Lança uma mágica. A forma é livre (o meteoro de fogo, o sussurro na mente);
 * o efeito mecânico vem só do que se paga: `pm` Pontos de Magia, limitados
 * pelo nível da Perícia Mágica e pelos PM disponíveis.
 *
 * - `ataqueFisico`: Valor de Ataque = 1D6 + PM gastos (mínimo 1).
 * - `ataqueMental`: o mesmo, mas o alvo defende com 1D6 + Vontade + Fé e o
 *   dano sai da Sanidade.
 * Outros tipos devolvem só a potência, para o Mestre aplicar.
 */
export function lancarMagia(ficha, { pericia, pm, pmDisponivel, rng = Math.random }) {
  const nivel = nivelDe(ficha, pericia);
  const disponivel = pmDisponivel ?? valores(ficha).magia.valor;
  const teto = Math.min(nivel, disponivel);
  const pedido = Math.max(1, pm ?? teto);
  const gasto = Math.min(pedido, teto);
  const limitado = gasto < pedido;
  if (gasto < 1) {
    return { falhou: true, motivo: nivel < 1 ? 'Sem a Perícia Mágica.' : 'Sem Pontos de Magia.', gasto: 0, teto, limitado };
  }
  const dado = d6(rng);
  return {
    falhou: false,
    gasto,
    teto,
    limitado,
    potencia: gasto,
    dado,
    valorAtaque: pericia === 'magiaAtaqueFisico' || pericia === 'magiaAtaqueMental' ? dado + gasto : null,
  };
}

/* ------------------------------------------------------------------------ */
/* Modo sem números                                                         */
/* ------------------------------------------------------------------------ */

const DESCRICOES = {
  vida: ['Intacto', 'Arranhado', 'Ferido', 'Muito ferido', 'À beira do colapso', 'Caído'],
  magia: ['Transbordando', 'Desperto', 'Cansado', 'Exausto', 'Vazio', 'Vazio'],
  sanidade: ['Lúcido', 'Inquieto', 'Abalado', 'Perturbado', 'Por um fio', 'Fora de si'],
};

/**
 * Descrição sem números para um recurso (vida, magia ou sanidade). É o que a
 * ficha mostra no "modo jogador", para desencorajar o meta-jogo.
 */
export function descrever(tipo, atual, maximo) {
  const nomes = DESCRICOES[tipo];
  if (maximo <= 0 || atual <= 0) return nomes[5];
  const r = atual / maximo;
  if (r >= 1) return nomes[0];
  if (r >= 0.75) return nomes[1];
  if (r >= 0.5) return nomes[2];
  if (r >= 0.25) return nomes[3];
  return nomes[4];
}
