/**
 * Glossário do Sistema Clip: um resumo curto de cada termo, mostrado nas
 * dicas da ficha ao passar o mouse.
 *
 * A chave é a âncora do termo no manual (a mesma de `data-manual`) ou, para
 * Perícias e controles da ficha, um id próprio. Cada entrada tem:
 * - `termo`: o nome exibido;
 * - `resumo`: uma ou duas frases do que o termo significa;
 * - `regra` (opcional): o efeito em números, em uma linha;
 * - `manual`: âncora para "ler no manual" (quando a chave não é a âncora).
 *
 * Os resumos seguem o manual (README.md). Também servem de base para a seção
 * "Glossário" do manual, que ainda está vazia.
 */
export const GLOSSARIO = {
  /* Construção e pontos ------------------------------------------------- */
  'construcao-do-personagem': {
    termo: 'Construção do Personagem',
    resumo: 'Primeiro a história, depois os números. O background combinado com o Mestre define quantos pontos o personagem recebe e onde faz sentido gastá-los.',
  },
  'conteudo-e-o-rei': {
    termo: 'Conteúdo é o Rei',
    resumo: 'Sem um passado, motivações e vivências definidos com o Mestre, as regras não se aplicam. A ficha começa pela história.',
  },
  'distribuicao-de-pontos': {
    termo: 'Pontos de Evolução',
    resumo: 'A moeda do sistema: tudo é comprado com eles, nível a nível. O Mestre define quantos o personagem recebe de acordo com o quão experiente ele é.',
    regra: 'Pessoa comum 0–4 · Especialista Iniciante 10–12 · Lenda acima de 25.',
  },
  'pontos-de-experiencia': {
    termo: 'Experiência',
    resumo: 'Como o personagem ganha novos Pontos de Evolução durante a campanha. O manual ainda não define; a ficha cobra 1 ponto por nível enquanto isso.',
  },
  'caminhos-de-evolucao': {
    termo: 'Caminhos de Evolução',
    resumo: 'Corpo, Mente e Espírito: as três direções em que um personagem cresce. Não são classes: um guerreiro pode ser espiritualizado e um sacerdote, forte.',
  },
  atributos: {
    termo: 'Atributos',
    resumo: 'Cada Caminho se divide em três Atributos. Eles definem as capacidades gerais do personagem e liberam Aprimoramentos e Perícias.',
  },
  aprimoramentos: {
    termo: 'Aprimoramentos',
    resumo: 'Especializações de um Atributo para ações mais específicas, como Agilidade dentro de Destreza.',
    regra: 'Nunca passam do nível do Atributo-pai.',
  },
  'limitacoes-para-o-caminho-de-evolucao-do-personagem': {
    termo: 'Limites de evolução',
    resumo: 'Um Aprimoramento ou uma Perícia nunca passa do nível do Atributo de que depende. Para subir o específico, primeiro suba o geral.',
  },
  pericias: {
    termo: 'Perícias',
    resumo: 'O conhecimento mais específico do personagem, em número infinito. Cada uma exige certos Atributos, Aprimoramentos ou outras Perícias.',
    regra: 'O nível máximo é o do requisito mais baixo.',
  },

  /* Caminhos ------------------------------------------------------------ */
  corpo: {
    termo: 'Caminho do Corpo',
    resumo: 'Força, Destreza e Físico. É o Caminho do combate físico, da resistência a danos e do esforço bruto.',
    regra: 'Se for o maior Caminho: Vida começa em 8 e Sanidade em 4.',
  },
  mente: {
    termo: 'Caminho da Mente',
    resumo: 'Inteligência, Percepção e Sabedoria. É o Caminho do conhecimento, da atenção e da magia praticada com mais perfeição.',
    regra: 'Se for o maior Caminho: Vida começa em 5 e Sanidade em 7.',
  },
  espirito: {
    termo: 'Caminho do Espírito',
    resumo: 'Vontade, Presença e Fé. É o Caminho da força interior e do impacto sobre as pessoas e o ambiente.',
    regra: 'Se for o maior Caminho: Vida começa em 5 e Sanidade em 10.',
  },

  /* Atributos ----------------------------------------------------------- */
  forca: {
    termo: 'Força',
    resumo: 'Potência física. Sustenta golpes corpo a corpo, arremessos e quanto equipamento o personagem consegue usar em combate.',
    regra: 'A soma dos modificadores do equipamento em uso não passa da Força.',
  },
  destreza: {
    termo: 'Destreza',
    resumo: 'Coordenação e rapidez do corpo: mover-se, mirar e reagir.',
    regra: 'Critério de desempate na Iniciativa.',
  },
  fisico: {
    termo: 'Físico',
    resumo: 'A constituição do corpo: aguentar dano, resistir a venenos e aparentar vitalidade.',
  },
  inteligencia: {
    termo: 'Inteligência',
    resumo: 'Não é ser mais ou menos esperto: é a capacidade de aprender e o quanto já se acumulou de conhecimento.',
    regra: 'Entra nos Pontos de Magia: 2×(Inteligência + Percepção + Sabedoria).',
  },
  percepcao: {
    termo: 'Percepção',
    resumo: 'A capacidade de notar o ambiente: detalhes, caminhos, travas escondidas.',
    regra: 'Entra nos Pontos de Magia.',
  },
  sabedoria: {
    termo: 'Sabedoria',
    resumo: 'Entender o mundo e as pessoas, e aprender com o que se viveu: perceber mentiras, conhecer culturas.',
    regra: 'Entra nos Pontos de Magia.',
  },
  vontade: {
    termo: 'Vontade',
    resumo: 'A força da mente. Resiste a controle mental e sustenta a sanidade sob pressão.',
    regra: 'Entra na Sanidade: base + 2×(Vontade + Fé).',
  },
  presenca: {
    termo: 'Presença',
    resumo: 'O impacto que o personagem causa no ambiente e nas pessoas, para o bem ou para o mal.',
  },
  fe: {
    termo: 'Fé',
    resumo: 'Não tem a ver com religião: é a capacidade de acreditar, seja na própria força ou em forças invisíveis.',
    regra: 'Entra na Sanidade: base + 2×(Vontade + Fé).',
  },

  /* Aprimoramentos ------------------------------------------------------ */
  'ataque-corporal': {
    termo: 'Ataque Corporal',
    resumo: 'Golpear com armas de corpo a corpo.',
    regra: '+1 no Ataque à Curta Distância por nível.',
  },
  arremesso: {
    termo: 'Arremesso',
    resumo: 'Atacar à distância lançando armas: lanças, machados, adagas.',
    regra: '+1 no Ataque à Longa Distância por nível.',
  },
  'manipulacao-de-peso': {
    termo: 'Manipulação de Peso',
    resumo: 'Carregar e usar mais armas, armaduras e pertences sem perder a eficiência.',
    regra: 'Na ficha: +1 no limite de modificadores de equipamento por nível.',
  },
  agilidade: {
    termo: 'Agilidade',
    resumo: 'Mover-se com rapidez. Ajuda no combate próximo e na furtividade.',
    regra: '+1 no Ataque à Curta Distância por nível.',
  },
  precisao: {
    termo: 'Precisão',
    resumo: 'Mira apurada para arremessar, laçar e disparar.',
    regra: '+1 no Ataque à Longa Distância por nível.',
  },
  reflexo: {
    termo: 'Reflexo',
    resumo: 'Reagir rápido a um estímulo: esquivar, aparar, segurar o jarro antes de cair.',
    regra: '+1 na Defesa por nível; primeiro critério de Iniciativa.',
  },
  resistencia: {
    termo: 'Resistência',
    resumo: 'Suportar esforço e dano físico.',
    regra: '+1 na Defesa e −1 no dano sofrido, por nível.',
  },
  saude: {
    termo: 'Saúde',
    resumo: 'Vitalidade: resistir a venenos e doenças e se recuperar.',
    regra: '+4 Pontos de Vida por nível.',
  },
  aparencia: {
    termo: 'Aparência',
    resumo: 'Não é só beleza: é o quanto a criatura parece saudável e inteira.',
  },
  'empatia-carisma': {
    termo: 'Empatia/Carisma',
    resumo: 'Impacto positivo e amistoso: fazer a plateia rir, conquistar confiança.',
  },
  intimidacao: {
    termo: 'Intimidação',
    resumo: 'Impacto hostil e agressivo: arrancar uma confissão, fazer recuar.',
  },
  lideranca: {
    termo: 'Liderança',
    resumo: 'Impacto positivo e firme: conduzir um grupo, discursar para mover pessoas.',
  },

  /* Valores Resumidos --------------------------------------------------- */
  'valores-resumidos': {
    termo: 'Valores Resumidos',
    resumo: 'Os números que se usam em jogo, calculados a partir dos níveis. Mudou um nível de base, recalcule.',
  },
  'ataque-a-curta-distancia': {
    termo: 'Ataque à Curta Distância',
    resumo: 'O quanto o personagem acerta em combate próximo.',
    regra: 'Ataque Corporal + Agilidade + Perícias correspondentes; na luta, + 1D6.',
  },
  'ataque-a-longa-distancia': {
    termo: 'Ataque à Longa Distância',
    resumo: 'O quanto acerta arremessando armas ou disparando projéteis.',
    regra: 'Arremesso + Precisão + Perícias correspondentes; na luta, + 1D6.',
  },
  defesa: {
    termo: 'Defesa',
    resumo: 'O quanto o personagem evita ou absorve um golpe.',
    regra: 'Reflexo + Resistência + Perícias correspondentes; na luta, + 1D6. Empate favorece quem defende.',
  },
  'pontos-de-vida': {
    termo: 'Pontos de Vida',
    resumo: 'Quanto dano físico o personagem aguenta. Sem nenhum, está desmaiado ou morto.',
    regra: '8 (Corpo) ou 5 (Mente/Espírito) + Resistência + 4×Saúde.',
  },
  'pontos-de-magia': {
    termo: 'Pontos de Magia',
    resumo: 'O fôlego para lançar mágicas antes de precisar descansar. Sem nenhum, não há magia.',
    regra: '2×(Inteligência + Percepção + Sabedoria).',
  },
  sanidade: {
    termo: 'Sanidade',
    resumo: 'O quanto a mente aguenta de horror e pressão. Sem nenhuma, o personagem perde o controle: fúria, pânico, torpor.',
    regra: '4 (Corpo), 7 (Mente) ou 10 (Espírito) + 2×(Vontade + Fé).',
  },

  /* Combate ------------------------------------------------------------- */
  combate: {
    termo: 'Combate',
    resumo: 'Ataque contra Defesa, cada um com 1D6. A diferença, ajustada por armas e proteções, vira dano.',
  },
  armas: {
    termo: 'Armas',
    resumo: 'Escritas como Nome(modificador), por exemplo Espada2. Armas comuns têm modificador 0; as especiais ou mágicas somam o modificador ao dano.',
  },
  'limitacao-para-equipamentos': {
    termo: 'Limite de equipamento',
    resumo: 'Em combate, só se usa equipamento cuja soma de modificadores caiba na Força. Itens com modificador 0 não contam.',
    regra: 'Força4 usa, por exemplo, Espada2 + Escudo1 + Armadura1.',
  },
  iniciativa: {
    termo: 'Iniciativa',
    resumo: 'Quem ataca primeiro. Desempata, em ordem: Mestre, Perícia da situação, Reflexo, Agilidade, Destreza, Caminho do Corpo e, por fim, 1D6.',
  },
  'sequencia-de-combate': {
    termo: 'Sequência de Combate',
    resumo: 'Atacante e defensor rolam 1D6 e somam aos seus valores. Se o ataque for maior, a diferença vira dano.',
    regra: 'Dano = diferença + arma − armadura − escudo − Resistência; mínimo 1 por acerto.',
  },
  'regras-especiais': {
    termo: 'Críticos',
    resumo: 'Tirou 1 no dado? Role de novo: outro 1 é falha crítica. Tirou 6? Outro 6 é sucesso crítico. O Mestre decide o efeito.',
  },

  /* Testes -------------------------------------------------------------- */
  testes: {
    termo: 'Testes',
    resumo: 'Para ações fora do combate: role um D6 por nível no que está sendo testado e tente alcançar a Dificuldade.',
    regra: 'Nível 0: 1D6 − 2, a critério do Mestre.',
  },
  'definindo-dificuldades': {
    termo: 'Dificuldade',
    resumo: 'O número que o teste precisa alcançar, definido pelo Mestre.',
    regra: 'Muito fácil 2 · Normal 3–4 · Difícil 5–10 · Muito difícil 11–15 · Quase impossível 16–25.',
  },
  insistir: {
    termo: 'Insistir',
    resumo: 'Esforço acima do limite para forçar um sucesso. Só vale para o Caminho do Corpo e se o Mestre autorizar.',
    regra: 'O que faltar para a Dificuldade sai dos Pontos de Vida.',
    manual: 'testes',
  },
  objeto: {
    termo: 'Objeto que ajuda',
    resumo: 'Uma ferramenta adequada soma níveis ao teste, como um pé de cabra para forçar uma porta. O Mestre define o modificador.',
    regra: 'Força1 com Pé de Cabra2 rola 3D6.',
    manual: 'testes',
  },

  /* Magia --------------------------------------------------------------- */
  magia: {
    termo: 'Magia',
    resumo: 'Qualquer manifestação fora do normal que mexe com a física do mundo. A forma é livre; o efeito depende da Perícia Mágica e dos Pontos de Magia gastos.',
  },
  'limitacoes-para-magias': {
    termo: 'Limites da magia',
    resumo: 'O nível de uma Perícia Mágica não passa do menor requisito, e uma mágica não gasta mais PM do que esse nível. Descrever um meteoro não faz o efeito ser maior.',
  },
  'magicas-de-ataque-fisico': {
    termo: 'Mágicas de Ataque Físico',
    resumo: 'Ataques mágicos instantâneos com qualquer elemento ou magia bruta, que não se sustentam além de um instante.',
    regra: 'Valor de Ataque = 1D6 + PM gastos (até o nível da Perícia).',
  },
  'magicas-de-ataque-mental': {
    termo: 'Mágicas de Ataque Mental',
    resumo: 'Ataques invisíveis à mente do alvo. O alvo sabe que algo está errado.',
    regra: 'Defesa do alvo: 1D6 + Vontade + Fé. O dano sai da Sanidade.',
  },
  'magicas-de-suporte': {
    termo: 'Mágicas de Suporte',
    resumo: 'Bônus ou penalidades em qualquer característica de um alvo, e curas.',
    regra: '1 PM por modificador e por alvo; curar: 1D6 de Vida por PM.',
  },
  'magicas-de-encantamento': {
    termo: 'Mágicas de Encantamento',
    resumo: 'Mudar objetos ao toque: criar itens mágicos, trancar portas, desfazer encantamentos alheios. Exige calma, nunca em combate.',
  },
  'manipulacao-elemental-magica': {
    termo: 'Manipulação Elemental',
    resumo: 'Mover e moldar elementos da natureza e criar elementais. Não serve para causar dano direto.',
    regra: 'Simples 1 PM · complexa 2 PM · elemental: 1 PM por Atributo.',
  },
  'magica-de-controle': {
    termo: 'Mágicas de Controle',
    resumo: 'Impor medo, amor, confiança a um alvo inteligente. Exige Vontade maior que a do alvo e dura até ele ter motivo para desacreditar.',
  },

  /* Antecedentes -------------------------------------------------------- */
  antecedentes: {
    termo: 'Antecedentes',
    resumo: 'Aspectos sociais da vida pregressa, fora do controle do personagem: fama, aliados, inimigos, recursos.',
  },
  'regras-para-antecedentes': {
    termo: 'Pontos de Antecedentes',
    resumo: 'Começam iguais ao menor Caminho. Bons Antecedentes custam 1 por nível; Maus devolvem 1 por nível.',
    regra: 'Maus Antecedentes não levam o total acima do dobro do inicial.',
  },

  /* Controles da ficha -------------------------------------------------- */
  'caminho-principal': {
    termo: 'Caminho principal',
    resumo: 'Quando dois Caminhos empatam no maior valor, o jogador escolhe qual é o principal. Isso muda a base de Vida e de Sanidade.',
    manual: 'valores-resumidos',
  },
  'em-combate': {
    termo: 'Perícias correspondentes',
    resumo: 'Uma Perícia ligada à arma ou à situação (Espada, Arco, Esquiva) soma o nível dela ao ataque ou à Defesa. O Mestre aprova qual soma onde.',
    manual: 'valores-resumidos',
  },
  'modo-jogador': {
    termo: 'Modo jogador',
    resumo: 'Mostra Vida, Magia e Sanidade em palavras em vez de números, para o jogador interpretar o estado e não fazer meta-jogo.',
    manual: 'por-que-mais-um-sistema',
  },
  'aprimoramentos-propostos': {
    termo: 'Aprimoramentos propostos',
    resumo: 'Sugestão de Aprimoramentos para Mente, Vontade e Fé, que o manual ainda não tem. Ligue para testar na ficha; a decisão está em PENDENCIAS.md.',
    manual: 'aprimoramentos',
  },
  'potencia-magica': {
    termo: 'Potência',
    resumo: 'Quantos PM realmente valeram na mágica. É isso que define o efeito, por mais grandiosa que seja a descrição.',
    manual: 'limitacoes-para-magias',
  },

  /* Perícias de exemplo (id do motor) ----------------------------------- */
  maquinas: { termo: 'Máquinas', resumo: 'Operar, consertar e entender mecanismos.', manual: 'pericias' },
  engenharia: { termo: 'Engenharia', resumo: 'Projetar e construir estruturas e dispositivos.', manual: 'pericias' },
  medicina: { termo: 'Medicina', resumo: 'Diagnosticar e tratar ferimentos e doenças. É requisito de Cuidar de Animais.', manual: 'pericias' },
  ciencias: { termo: 'Ciências', resumo: 'Conhecimento formal sobre a natureza: química, física, astronomia.', manual: 'pericias' },
  cuidarDeAnimais: { termo: 'Cuidar de Animais', resumo: 'Tratar e manter animais saudáveis. Exige Inteligência e a Perícia Medicina.', manual: 'pericias' },
  lidarComAnimais: { termo: 'Lidar com Animais', resumo: 'Acalmar, adestrar e conquistar a confiança de animais.', manual: 'pericias' },
  montaria: { termo: 'Montaria', resumo: 'Cavalgar e conduzir montarias em situações difíceis.', manual: 'pericias' },
  futebol: { termo: 'Futebol', resumo: 'O exemplo do manual: uma Perícia limitada pelo menor entre Físico e Destreza.', manual: 'pericias' },
  sobrevivencia: { termo: 'Sobrevivência', resumo: 'Achar abrigo, água e comida e se orientar em lugares selvagens.', manual: 'pericias' },
  investigacao: { termo: 'Investigação', resumo: 'Juntar pistas, reconstituir o que aconteceu.', manual: 'pericias' },
  interrogacao: { termo: 'Interrogação', resumo: 'Arrancar informação de quem não quer dar. Exige Percepção, Sabedoria e Intimidação.', manual: 'pericias' },
  historia: { termo: 'História', resumo: 'Conhecer o passado do mundo, seus povos e acontecimentos.', manual: 'pericias' },
  artes: { termo: 'Artes', resumo: 'Criar e apreciar música, pintura, escrita, teatro.', manual: 'pericias' },
  idiomas: { termo: 'Idiomas', resumo: 'Falar e ler uma língua. Cada idioma é uma Perícia separada.', manual: 'pericias' },
  furtividade: { termo: 'Furtividade', resumo: 'Mover-se sem ser visto nem ouvido.', manual: 'pericias' },
  prestidigitacao: { termo: 'Prestidigitação', resumo: 'Truques com as mãos: bater carteiras, esconder objetos, ilusionismo.', manual: 'pericias' },
  equilibrio: { termo: 'Equilíbrio', resumo: 'Manter-se de pé em superfícies estreitas, instáveis ou em movimento.', manual: 'pericias' },
};

/**
 * Entrada do glossário para uma chave (âncora ou id). Devolve
 * `{ termo, resumo, regra?, manual }` com a âncora já resolvida, ou null.
 */
export function dica(chave) {
  const e = GLOSSARIO[chave];
  if (!e) return null;
  return { ...e, manual: e.manual ?? chave };
}
