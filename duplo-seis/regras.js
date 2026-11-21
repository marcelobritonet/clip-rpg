/**
 * O manual do Sistema Clip em código, escrito do zero a partir do README.md.
 * Sem DOM. Cada bloco cita a seção do manual que segue.
 *
 * Onde o manual é omisso, a decisão é do jogo ("a critério do Mestre") e fica
 * em `jogo.js` (bloco MESA) e no NOTAS.md, nunca aqui.
 */

/* ---------- Caminhos de Evolução, Atributos, Aprimoramentos ---------- */

export const CAMINHOS = {
  corpo: { nome: 'Corpo', atributos: ['forca', 'destreza', 'fisico'] },
  mente: { nome: 'Mente', atributos: ['inteligencia', 'percepcao', 'sabedoria'] },
  espirito: { nome: 'Espírito', atributos: ['vontade', 'presenca', 'fe'] },
};

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

/** "O nível num Aprimoramento jamais pode superar o nível do Atributo-pai." */
export const APRIMORAMENTOS = {
  ataqueCorporal: { nome: 'Ataque Corporal', pai: 'forca' },
  arremesso: { nome: 'Arremesso', pai: 'forca' },
  manipulacaoPeso: { nome: 'Manipulação de Peso', pai: 'forca' },
  agilidade: { nome: 'Agilidade', pai: 'destreza' },
  precisao: { nome: 'Precisão', pai: 'destreza' },
  reflexo: { nome: 'Reflexo', pai: 'destreza' },
  resistencia: { nome: 'Resistência', pai: 'fisico' },
  saude: { nome: 'Saúde', pai: 'fisico' },
  aparencia: { nome: 'Aparência', pai: 'fisico' },
  empatia: { nome: 'Empatia', pai: 'presenca' },
  intimidacao: { nome: 'Intimidação', pai: 'presenca' },
  lideranca: { nome: 'Liderança', pai: 'presenca' },
};

/**
 * Perícias: a tabela de exemplos do manual, mais as seis Perícias Mágicas.
 * "O nível da Perícia nunca pode ser mais alto que o Atributo de menor valor requerido."
 */
export const PERICIAS = {
  maquinas: { nome: 'Máquinas', requer: ['inteligencia'] },
  engenharia: { nome: 'Engenharia', requer: ['inteligencia'] },
  medicina: { nome: 'Medicina', requer: ['inteligencia'] },
  ciencias: { nome: 'Ciências', requer: ['inteligencia'] },
  cuidarAnimais: { nome: 'Cuidar de Animais', requer: ['inteligencia', 'medicina'] },
  lidarAnimais: { nome: 'Lidar com Animais', requer: ['presenca'] },
  montaria: { nome: 'Montaria', requer: ['presenca', 'fisico'] },
  futebol: { nome: 'Futebol', requer: ['fisico', 'destreza'] },
  sobrevivencia: { nome: 'Sobrevivência', requer: ['fisico', 'percepcao'] },
  investigacao: { nome: 'Investigação', requer: ['percepcao', 'sabedoria'] },
  interrogacao: { nome: 'Interrogação', requer: ['percepcao', 'sabedoria', 'intimidacao'] },
  historia: { nome: 'História', requer: ['inteligencia'] },
  artes: { nome: 'Artes', requer: ['inteligencia'] },
  idiomas: { nome: 'Idiomas', requer: ['inteligencia'] },
  furtividade: { nome: 'Furtividade', requer: ['agilidade'] },
  prestidigitacao: { nome: 'Prestidigitação', requer: ['agilidade'] },
  equilibrio: { nome: 'Equilíbrio', requer: ['agilidade'] },
  magiaAtaqueFisico: { nome: 'Mágicas de Ataque Físico', requer: ['inteligencia'], magica: true },
  magiaAtaqueMental: { nome: 'Mágicas de Ataque Mental', requer: ['sabedoria', 'vontade'], magica: true },
  magiaSuporte: { nome: 'Mágicas de Suporte', requer: ['sabedoria'], magica: true },
  magiaEncantamento: { nome: 'Mágicas de Encantamento', requer: ['percepcao', 'inteligencia'], magica: true },
  magiaElemental: { nome: 'Manipulação Elemental Mágica', requer: ['inteligencia'], magica: true },
  magiaControle: { nome: 'Mágicas de Controle', requer: ['sabedoria', 'vontade'], magica: true },
};

/** Tabela "Nível Inicial": sugestão de Pontos de Evolução. */
export const NIVEIS_INICIAIS = [
  { nome: 'Pessoa comum', min: 0, max: 4 },
  { nome: 'Pessoa bem treinada', min: 5, max: 9 },
  { nome: 'Especialista Iniciante', min: 10, max: 12 },
  { nome: 'Especialista Médio', min: 13, max: 15 },
  { nome: 'Especialista Muito Experiente', min: 16, max: 19 },
  { nome: 'Consagrado', min: 20, max: 25 },
  { nome: 'Lenda', min: 26, max: Infinity },
];

/** Tabela "Definindo Dificuldades". */
export const DIFICULDADES = [
  { nome: 'Muito Fácil', min: 0, max: 2 },
  { nome: 'Normal', min: 3, max: 4 },
  { nome: 'Difícil', min: 5, max: 10 },
  { nome: 'Muito Difícil', min: 11, max: 15 },
  { nome: 'Quase Impossível', min: 16, max: Infinity },
];

export const nomeDaDificuldade = (d) => DIFICULDADES.find((x) => d <= x.max).nome;

/* ---------- Ficha ---------- */

export function novaFicha(dados = {}) {
  return {
    nome: dados.nome ?? '',
    atributos: { ...Object.fromEntries(Object.keys(ATRIBUTOS).map((k) => [k, 0])), ...dados.atributos },
    aprimoramentos: { ...dados.aprimoramentos },
    pericias: { ...dados.pericias },
    antecedentes: { ...dados.antecedentes },
  };
}

/** Em que tipo de coisa a chave cai: atributo, aprimoramento ou perícia. */
export function tipoDaChave(chave) {
  if (ATRIBUTOS[chave]) return 'atributo';
  if (APRIMORAMENTOS[chave]) return 'aprimoramento';
  if (PERICIAS[chave]) return 'pericia';
  return null;
}

export function nomeDaChave(chave) {
  return (ATRIBUTOS[chave] ?? APRIMORAMENTOS[chave] ?? PERICIAS[chave])?.nome ?? chave;
}

/** Nível do personagem em qualquer Atributo, Aprimoramento ou Perícia. */
export function nivel(ficha, chave) {
  return ficha.atributos[chave] ?? ficha.aprimoramentos[chave] ?? ficha.pericias[chave] ?? 0;
}

/** Caminho a que a chave pertence (a perícia segue o primeiro requisito). */
export function caminhoDaChave(chave) {
  if (ATRIBUTOS[chave]) return ATRIBUTOS[chave].caminho;
  if (APRIMORAMENTOS[chave]) return ATRIBUTOS[APRIMORAMENTOS[chave].pai].caminho;
  if (PERICIAS[chave]) return caminhoDaChave(PERICIAS[chave].requer[0]);
  return null;
}

/** Valor de um Caminho: a soma dos seus três Atributos. */
export function valorDoCaminho(ficha, caminho) {
  return CAMINHOS[caminho].atributos.reduce((s, a) => s + (ficha.atributos[a] ?? 0), 0);
}

/** "Maior valor no Caminho...": em empate vale a ordem Corpo, Mente, Espírito. */
export function caminhoDominante(ficha) {
  let melhor = 'corpo';
  for (const c of Object.keys(CAMINHOS)) {
    if (valorDoCaminho(ficha, c) > valorDoCaminho(ficha, melhor)) melhor = c;
  }
  return melhor;
}

/** Teto de nível de uma chave nesta ficha (Atributo: 5, a média do manual). */
export function teto(ficha, chave) {
  if (ATRIBUTOS[chave]) return 5;
  if (APRIMORAMENTOS[chave]) return nivel(ficha, APRIMORAMENTOS[chave].pai);
  if (PERICIAS[chave]) return Math.min(...PERICIAS[chave].requer.map((r) => nivel(ficha, r)));
  return 0;
}

/** "Basicamente tudo é comprado com pontos": um Ponto de Evolução por nível. */
export function pontosGastos(ficha) {
  const soma = (o) => Object.values(o).reduce((s, n) => s + n, 0);
  return soma(ficha.atributos) + soma(ficha.aprimoramentos) + soma(ficha.pericias);
}

/** Antecedentes: pontos = menor Caminho; maus devolvem, até o dobro. */
export function pontosDeAntecedentes(ficha) {
  const base = Math.min(...Object.keys(CAMINHOS).map((c) => valorDoCaminho(ficha, c)));
  let bons = 0;
  let maus = 0;
  for (const [, a] of Object.entries(ficha.antecedentes)) {
    if (a.mau) maus += a.nivel; else bons += a.nivel;
  }
  const total = Math.min(base + maus, base * 2);
  return { base, total, gastos: bons, livres: total - bons };
}

/** Confere a ficha contra as limitações do manual. Devolve a lista de erros. */
export function validar(ficha, pontos = Infinity) {
  const erros = [];
  for (const [k, n] of Object.entries(ficha.atributos)) {
    if (!ATRIBUTOS[k]) erros.push(`Atributo desconhecido: ${k}`);
    if (n < 0 || n > 5) erros.push(`${nomeDaChave(k)} fora de 0 a 5`);
  }
  for (const [k, n] of Object.entries(ficha.aprimoramentos)) {
    if (!APRIMORAMENTOS[k]) { erros.push(`Aprimoramento desconhecido: ${k}`); continue; }
    if (n > teto(ficha, k)) erros.push(`${nomeDaChave(k)} ${n} supera ${nomeDaChave(APRIMORAMENTOS[k].pai)}`);
  }
  for (const [k, n] of Object.entries(ficha.pericias)) {
    if (!PERICIAS[k]) { erros.push(`Perícia desconhecida: ${k}`); continue; }
    if (n > teto(ficha, k)) erros.push(`${nomeDaChave(k)} ${n} supera o menor requisito`);
  }
  if (pontosGastos(ficha) > pontos) erros.push(`Gastou ${pontosGastos(ficha)} de ${pontos} Pontos de Evolução`);
  if (pontosDeAntecedentes(ficha).livres < 0) erros.push('Antecedentes além dos pontos');
  return erros;
}

/* ---------- Valores Resumidos ---------- */

export function valores(ficha) {
  const n = (k) => nivel(ficha, k);
  const dominante = caminhoDominante(ficha);
  return {
    dominante,
    ataqueCurta: n('ataqueCorporal') + n('agilidade'),
    ataqueLonga: n('arremesso') + n('precisao'),
    defesa: n('reflexo') + n('resistencia'),
    vida: (dominante === 'corpo' ? 8 : 5) + n('resistencia') + 4 * n('saude'),
    magia: 2 * (n('inteligencia') + n('percepcao') + n('sabedoria')),
    sanidade: { corpo: 4, mente: 7, espirito: 10 }[dominante] + 2 * (n('vontade') + n('fe')),
  };
}

/**
 * Limitação para Equipamentos: a soma dos modificadores em uso é no máximo a
 * Força. Manipulação de Peso deixa usar "1 nível a mais" por nível.
 */
export const limiteDeEquipamento = (ficha) => nivel(ficha, 'forca') + nivel(ficha, 'manipulacaoPeso');

/* ---------- Dados e Regras Especiais (críticos) ---------- */

export const d6 = (rng = Math.random) => 1 + Math.floor(rng() * 6);

/**
 * "Caso seja obtido 1 na rolagem de dados role novamente o D6. Caso seja
 * obtido 1 novamente houve uma falha crítica." O mesmo para o 6.
 * Devolve `{ confirma, tipo }`: o dado de confirmação e 'sucesso' | 'falha' | null.
 */
export function critico(valor, rng = Math.random) {
  if (valor !== 1 && valor !== 6) return { confirma: null, tipo: null };
  const confirma = d6(rng);
  const tipo = confirma === valor ? (valor === 6 ? 'sucesso' : 'falha') : null;
  return { confirma, tipo };
}

/* ---------- Testes ---------- */

/**
 * "Para cada nível no Atributo, Aprimoramento ou Perícia testada 1D6 será
 * lançado; se o valor de Dificuldade foi alcançado o personagem obteve sucesso."
 *
 * - `nivel`: nível próprio do personagem no que é testado.
 * - `objeto`: modificador de um objeto que ajuda (Situação 4).
 * - `aliados`: níveis somados de quem une forças (Situação 5).
 * - `reducao`: dados a menos (forçar um objeto encantado: −1D6).
 * - Nível total 0: rola 1D6−2 e jamais pode insistir (Situação 6).
 */
export function testar({ nivel: proprio = 0, objeto = 0, aliados = 0, reducao = 0, dificuldade, rng = Math.random }) {
  const total0 = proprio + objeto + aliados - reducao;
  const incapaz = total0 <= 0;
  const quantos = incapaz ? 1 : total0;
  const dados = Array.from({ length: quantos }, () => d6(rng));
  const total = dados.reduce((s, x) => s + x, 0) - (incapaz ? 2 : 0);
  const sucesso = total >= dificuldade;
  return { dados, incapaz, total, dificuldade, sucesso, falta: sucesso ? 0 : dificuldade - total };
}

/**
 * Insistindo no teste (Situação 3): "permitido apenas para Atributos do
 * Caminho do Corpo". O que falta é pago em Pontos de Vida.
 * Devolve o custo em Vida, ou null quando não se pode insistir.
 */
export function custoDeInsistir(chave, resultado) {
  if (resultado.sucesso || resultado.incapaz) return null;
  if (caminhoDaChave(chave) !== 'corpo') return null;
  return resultado.falta;
}

/* ---------- Combate ---------- */

/**
 * Iniciativa: Reflexo, depois Agilidade, Destreza, Caminho do Corpo e por fim
 * o D6. Recebe dois objetos `{ reflexo, agilidade, destreza, corpo }`.
 * Devolve 'a' ou 'b'.
 */
export function iniciativa(a, b, rng = Math.random) {
  for (const k of ['reflexo', 'agilidade', 'destreza', 'corpo']) {
    if ((a[k] ?? 0) !== (b[k] ?? 0)) return (a[k] ?? 0) > (b[k] ?? 0) ? 'a' : 'b';
  }
  for (;;) {
    const x = d6(rng);
    const y = d6(rng);
    if (x !== y) return x > y ? 'a' : 'b';
  }
}

/**
 * Sequência de Combate. `ataque` e `defesa` são os valores já somados
 * (Aprimoramentos, Perícias e outros modificadores), sem o dado.
 * "Em caso de empate ou se o Defensor possuir o maior Valor, a defesa foi bem
 * sucedida." Dano = diferença + Arma − Armadura − Escudo − Resistência, e
 * "sempre desconte pelo menos 1 a cada ataque bem sucedido".
 */
export function atacar({ ataque, defesa, arma = 0, armadura = 0, escudo = 0, resistencia = 0, rng = Math.random }) {
  const dadoAtaque = d6(rng);
  const dadoDefesa = d6(rng);
  const critAtaque = critico(dadoAtaque, rng);
  const critDefesa = critico(dadoDefesa, rng);
  const valorAtaque = ataque + dadoAtaque;
  const valorDefesa = defesa + dadoDefesa;
  const acertou = valorAtaque > valorDefesa;
  const dano = acertou ? Math.max(1, valorAtaque - valorDefesa + arma - armadura - escudo - resistencia) : 0;
  return { dadoAtaque, dadoDefesa, critAtaque, critDefesa, valorAtaque, valorDefesa, acertou, dano };
}

/* ---------- Magia (Suplemento) ---------- */

/** "O máximo de Pontos de Magia que pode ser gasto em cada mágica é o Nível da Perícia Mágica." */
export const maximoDePM = (ficha, pericia, pmAtual) => Math.max(0, Math.min(nivel(ficha, pericia), pmAtual));

/**
 * Mágicas de Ataque Físico: "O Valor de Ataque será 1D6 + modificador. Gaste
 * 1PM para cada modificador", no mínimo 1. A defesa é a de combate.
 */
export function ataqueMagicoFisico({ pm, defesa, armadura = 0, escudo = 0, resistencia = 0, rng = Math.random }) {
  return atacar({ ataque: pm, defesa, armadura, escudo, resistencia, rng });
}

/**
 * Mágicas de Ataque Mental: a defesa do alvo é "1D6 + Vontade + Fé" e o dano
 * sai da Sanidade. Vale também para o que ataca a mente do personagem.
 */
export function ataqueMental({ ataque, vontade = 0, fe = 0, rng = Math.random }) {
  return atacar({ ataque, defesa: vontade + fe, rng });
}

/** Mágicas de Suporte, cura: "role 1D6 e some aos PV do alvo", 1 PM por rolagem. */
export const curaMagica = (rng = Math.random) => d6(rng);

/**
 * Mágicas de Controle: exige Vontade superior à do alvo. Se o alvo resiste,
 * "1D6 + Nível de Mágica de Controle" contra "1D6 + Vontade".
 */
export function controlar({ vontade, nivelControle, vontadeAlvo, resiste = false, rng = Math.random }) {
  if (vontade <= vontadeAlvo) return { possivel: false, sucesso: false };
  if (!resiste) return { possivel: true, sucesso: true };
  const meu = d6(rng) + nivelControle;
  const dele = d6(rng) + vontadeAlvo;
  return { possivel: true, sucesso: meu > dele, meu, dele };
}
