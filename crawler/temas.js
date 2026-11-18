/**
 * Temas do Desvario: a "pele" de cada partida. A mecânica é a mesma; muda o
 * vocabulário, a paleta, os monstros, os aliados, os itens e o que a cabeça
 * inventa quando a Sanidade cai.
 *
 * Categorias de monstro (mecânica comum):
 * - `besta`: só luta ou foge. Encarar com fé a espanta.
 * - `humano`: luta, mas dá para Convencer (Presença).
 * - `assombro`: ataca a Sanidade; golpes físicos pegam mal (+2 na Defesa).
 *   Encarar com fé o desfaz.
 *
 * Os números de cada monstro são do jogo, não do manual (ver NOTAS.md).
 * `andar` é o primeiro andar em que a espécie aparece.
 */

const cores = (s, r, d, o = '#f4e9c8', h = null) => ({ s, r, d, o, h: h ?? d });

export const TEMAS = {
  sanatorio: {
    id: 'sanatorio',
    nome: 'Fuga do sanatório',
    curto: 'Sanatório',
    abertura:
      'Você acorda numa cama de ferro. A porta do quarto está aberta, o que nunca acontece. ' +
      'Cinco alas separam você do portão do jardim.',
    andares: ['Enfermaria', 'Ala das camisas', 'Lavanderia', 'Ala dos esquecidos', 'Jardim de inverno'],
    passagem: 'escada de serviço',
    saida: 'portão do jardim',
    salas: ['Enfermaria', 'Refeitório', 'Solitária', 'Lavanderia', 'Sala de visitas', 'Consultório', 'Arquivo', 'Banheiro coletivo', 'Sala de recreação', 'Corredor das janelas gradeadas'],
    paleta: { fundo: '#0e1114', chao: '#9aa7a3', chao2: '#7f8d89', parede: '#d9dccf', parede2: '#a9b3ab', paredeTopo: '#eef0e6', porta: '#6c8a96', luz: '#e8f1d8' },
    estilo: 'azulejo',
    origens: {
      corpo: { nome: 'Interno da ala pesada', texto: 'Forte demais para as correias. A cabeça é o que falha primeiro.' },
      mente: { nome: 'Médica internada', texto: 'Já foi do outro lado da mesa. Sabe ler sintomas, inclusive os próprios.' },
      espirito: { nome: 'Capelão esquecido', texto: 'Ninguém lembra por que ele está aqui. Ele lembra de quem é.' },
    },
    monstros: [
      { id: 'rato', nome: 'rato do porão', categoria: 'besta', sprite: 'rato', cores: cores('#6b5a4c', '#4a3e35', '#d48a8a', '#ff5050'), andar: 1, ataque: 0, defesa: 0, vida: 3, arma: 0, vontade: 0 },
      { id: 'enfermeiro', nome: 'enfermeiro do turno da noite', categoria: 'humano', sprite: 'humano', cores: cores('#e0b48f', '#e8ece6', '#7aa0b0', '#202020', '#3a2a20'), andar: 1, ataque: 1, defesa: 1, vida: 5, arma: 0, vontade: 1 },
      { id: 'semrosto', nome: 'paciente sem rosto', categoria: 'assombro', sprite: 'espectro', cores: cores('#cfd6d0', '#b8c2bc', '#8a9690', '#101010'), andar: 2, ataque: 0, defesa: 1, vida: 3, arma: 0, vontade: 1, mental: 1 },
      { id: 'guarda', nome: 'guarda com o cassetete', categoria: 'humano', sprite: 'humano', cores: cores('#c99772', '#2f3e57', '#c9b45a', '#202020', '#1e1a16'), andar: 2, ataque: 1, defesa: 1, vida: 6, arma: 2, vontade: 1 },
      { id: 'cao', nome: 'cão de guarda', categoria: 'besta', sprite: 'cao', cores: cores('#7b5b3a', '#5a4028', '#e8d0a0', '#ffd040'), andar: 3, ataque: 2, defesa: 1, vida: 4, arma: 1, vontade: 0 },
      { id: 'diretor', nome: 'diretor de jaleco', categoria: 'humano', sprite: 'humano', cores: cores('#d8a888', '#f2f2ee', '#8a2a2a', '#202020', '#c8c8c8'), andar: 5, ataque: 2, defesa: 1, vida: 8, arma: 1, vontade: 2 },
    ],
    aliados: [
      { id: 'lucida', nome: 'Dona Ilda, a paciente lúcida', sprite: 'paciente', cores: cores('#e2b896', '#c9d7e0', '#8aa2b2', '#202020', '#b8b8b8'), presente: 'dica', fala: 'Eu sei onde fica a escada. Ninguém acredita em mim.', grito: 'Pare! Sou eu, a Ilda!' },
      { id: 'faxineiro', nome: 'Seu Bento, o faxineiro', sprite: 'humano', cores: cores('#9a6a48', '#5f7a4a', '#d0c080', '#202020', '#202020'), presente: 'item', fala: 'Achei isto no bolso de um jaleco. Leve.', grito: 'Ai! Calma, rapaz, sou o Bento!' },
      { id: 'colega', nome: 'Caio, seu colega de quarto', sprite: 'paciente', cores: cores('#c48a64', '#c9d7e0', '#7a8ea0', '#202020', '#3a2010'), presente: 'companhia', fala: 'Eu vou com você. Sozinho eu não saio.', grito: 'Sou o Caio! Para!' },
    ],
    itens: {
      cura: ['rolo de gaze', 'pomada cicatrizante', 'tala improvisada'],
      calma: ['comprimido azul', 'chá de cidreira frio', 'calmante sem rótulo'],
      ancora: ['fotografia de casa', 'carta que você escreveu', 'pulseira com seu nome verdadeiro'],
      arma: [{ nome: 'pé de cama de ferro', mod: 1 }, { nome: 'extintor', mod: 2 }],
      armadura: [{ nome: 'avental de borracha', mod: 1 }],
    },
    altar: 'capela da ala',
    altarTexto: 'Você senta no banco da capela. Aqui, o silêncio não pesa.',
    sussurros: [
      'Alguém chama você pelo número do quarto.',
      'Um carrinho de remédios range no corredor ao lado.',
      'A luz pisca três vezes. Você conta quatro.',
      'Passos de borracha atrás de você.',
      'Uma voz no alto-falante diz seu nome errado.',
      'Você tem certeza de que já passou por esta porta.',
      'Alguém ri baixinho do outro lado da parede.',
      'Você sente cheiro de éter.',
    ],
    golpeFalso: 'Uma seringa raspa seu braço.',
    dom: {
      nome: 'Diagnóstico', botao: 'Diagnosticar', recurso: 'Foco', cor: 'rgba(200,190,255,',
      palavras: ['Afiado', 'Atento', 'Disperso', 'Esgotado', 'Em branco', 'Em branco'],
      descricao: 'Você diz em voz baixa o nome exato do que o outro tem. Não é poder: é saber demais. E dói nele de verdade. Gasta foco; alcança longe.',
      acerta: 'Certeiro! ', acertaTexto: 'Você diz o nome do que {alvo} tem. Ele leva as mãos à cabeça.',
      erra: '{Alvo} não escuta o que você diz.',
      vazio: 'Você descreve em voz alta o que vê em {alvo}. Não há sintoma: não havia ninguém ali.',
      item: 'Você examina {alvo} de longe. Não tem sintoma nenhum: é {item}.', quebraItem: false,
      semRecurso: 'Sua cabeça está em branco. Não sai diagnóstico nenhum.',
    },
    ancora: {
      acao: 'Olhar a foto de casa', item: 'foto de casa',
      descricao: 'Cura para o espírito: olhar uma foto sua com firmeza e lembrar quem você é. Acalma a cabeça e, por um tempo, o que é falso some da vista.',
      restam: ['Nada mais em que se agarrar neste andar', 'Ainda dá para olhar a foto de casa uma vez', 'Dá para olhar a foto de casa mais vezes'],
      certo: 'Você olha a foto de casa com firmeza e diz o seu nome em voz alta. O mundo para de mentir, por um tempo.',
      falha: 'Você olha a foto, mas o rosto não parece o seu. Ainda não.',
    },
    tarefas: {
      trancada: 'A porta da escada de serviço está trancada.',
      aberta: 'Um estalo metálico ao longe: a porta da escada de serviço destrancou.',
      passos: [
        { nome: 'molho de chaves do zelador', texto: 'Num gancho atrás da porta, o molho de chaves do zelador. Uma delas tem etiqueta: QUADRO.' },
        { nome: 'quadro de luz', texto: 'Você abre o quadro com a chave e abaixa a alavanca da trava. Lá longe, um zumbido para.' },
        { nome: 'livro de ocorrências', texto: 'No livro de ocorrências, a senha da porta da escada, anotada a lápis. Você decora.' },
      ],
    },
    ronda: {
      nome: 'enfermeiro-chefe da ronda', sprite: 'humano', cores: cores('#d0a080', '#f2f2ee', '#3a5a8a', '#101010', '#202020'), categoria: 'humano',
      avisos: ['Longe, um molho de chaves balança. A ronda da noite começou.', 'As chaves estão mais perto. Portas batem, uma a uma.', 'Passos de borracha no fim do corredor. Ele sabe o número do seu quarto.'],
      chegada: 'O enfermeiro-chefe chegou a este andar. Ele não para, e não se cansa.',
    },
    pecas: {
      nomes: ['primeira página do seu prontuário', 'segunda página do seu prontuário', 'última página do seu prontuário'],
      textos: ['Seu nome verdadeiro, datilografado. Alguém riscou e escreveu um número por cima.', 'O motivo da internação. Não é o que disseram para você.', 'Uma assinatura de alta, nunca entregue. Com data de anos atrás.'],
      inteiro: 'Com o prontuário inteiro no bolso, você sabe quem é e por que nunca deveria ter entrado.',
      falta: 'Você sai, mas sem o prontuário inteiro. Lá fora, não sabe direito para onde voltar.',
    },
    janela: {
      fora: 'Lá fora, o jardim escuro e a chuva.',
      passa: 'Alguém passa do lado de fora da janela, devagar.',
      bate: 'Batem no vidro da janela. Com os nós dos dedos, como visita.',
      quebra: 'O vidro estoura para dentro.',
      barra: 'Você empurra uma maca contra a janela até as batidas pararem.',
      falsa: 'As batidas param. Do lado de fora, só a chuva.',
    },
    surto: 'Você grita. As paredes de azulejo gritam junto.',
    descida: 'Você sobe a escada de serviço. O cheiro de desinfetante muda.',
    fuga: 'O portão do jardim range e abre. Lá fora, a grama molhada é real. Você tem certeza.',
    morte: 'Você deita no chão frio. Amanhã alguém vai achar você e chamar de recaída.',
    loucura: 'Você volta para a enfermaria por conta própria e deita na cama de ferro. Está tudo bem. Está tudo bem.',
    perturbadores: {
      foto: { nome: 'fotografia sem data', texto: 'É você, dormindo nesta cama, fotografado de dentro do quarto.' },
      carta: { nome: 'carta amassada', texto: 'Está assinada com o seu nome, na sua letra. Diz por onde fugir.' },
      corpo: { nome: 'corpo coberto por um lençol', ver: 'Um lençol cobre alguém no chão. Os pés são do seu tamanho.', revistar: 'Você levanta o lençol só o bastante para mexer nos bolsos. Não olha o rosto.' },
    },
    buraco: 'O piso de azulejo afundou aqui.',
    desmaio: 'O teto gira devagar e as luzes se apagam uma por uma.',
    folego: ['ampola de cafeína', 'copo de água gelada', 'sais de cheiro'],
  },

  masmorra: {
    id: 'masmorra',
    nome: 'Masmorra',
    curto: 'Masmorra',
    abertura:
      'A corrente da cela cedeu durante a noite. Acima de você, cinco níveis de pedra, tochas e coisas ' +
      'que não dormem. Lá no alto, a boca da masmorra respira ar frio.',
    andares: ['Celas do fundo', 'Ossário', 'Galerias inundadas', 'Templo afundado', 'Portão da guarda'],
    passagem: 'escadaria de pedra',
    saida: 'boca da masmorra',
    salas: ['Cela', 'Cripta', 'Sala da tortura', 'Arsenal saqueado', 'Salão de pilares', 'Poço', 'Capela profanada', 'Despensa', 'Câmara do eco', 'Galeria de estátuas'],
    paleta: { fundo: '#0d0b0f', chao: '#5f5a55', chao2: '#4d4844', parede: '#8a7d6c', parede2: '#655a4d', paredeTopo: '#a8987f', porta: '#7a5230', luz: '#ffcf7a' },
    estilo: 'pedra',
    origens: {
      corpo: { nome: 'Mercenária acorrentada', texto: 'Já saiu de lugares piores com as próprias mãos. Nunca de um lugar assim.' },
      mente: { nome: 'Alquimista prisioneiro', texto: 'Conhece três fórmulas de fogo e a planta de metade destas galerias.' },
      espirito: { nome: 'Peregrina', texto: 'Desceu por vontade própria, atrás de uma oração. Agora quer subir.' },
    },
    monstros: [
      { id: 'ratazana', nome: 'ratazana do esgoto', categoria: 'besta', sprite: 'rato', cores: cores('#5c5048', '#3c342e', '#c08080', '#ff4040'), andar: 1, ataque: 0, defesa: 0, vida: 3, arma: 0, vontade: 0 },
      { id: 'carcereiro', nome: 'carcereiro', categoria: 'humano', sprite: 'humano', cores: cores('#c08a62', '#5a3a28', '#a0a0a0', '#202020', '#2a1a10'), andar: 1, ataque: 1, defesa: 1, vida: 5, arma: 0, vontade: 1 },
      { id: 'ossada', nome: 'ossada inquieta', categoria: 'besta', sprite: 'esqueleto', cores: cores('#e6dcc2', '#b8ac90', '#6a5f4a', '#60ff90'), andar: 2, ataque: 1, defesa: 1, vida: 5, arma: 1, vontade: 0 },
      { id: 'lamento', nome: 'lamento', categoria: 'assombro', sprite: 'espectro', cores: cores('#9fb6c8', '#7890a8', '#4a6078', '#e0f0ff'), andar: 2, ataque: 0, defesa: 1, vida: 3, arma: 0, vontade: 1, mental: 1 },
      { id: 'cultista', nome: 'cultista encapuzado', categoria: 'humano', sprite: 'encapuzado', cores: cores('#b08060', '#4a2848', '#c8a040', '#ff6040'), andar: 3, ataque: 1, defesa: 2, vida: 6, arma: 1, vontade: 2 },
      { id: 'cao', nome: 'cão de caça', categoria: 'besta', sprite: 'cao', cores: cores('#5a4a3a', '#3a3028', '#c0a080', '#ffd040'), andar: 3, ataque: 2, defesa: 1, vida: 4, arma: 1, vontade: 0 },
      { id: 'capitao', nome: 'capitão da guarda', categoria: 'humano', sprite: 'humano', cores: cores('#c89870', '#7a7a80', '#c03030', '#202020', '#3a2a1a'), andar: 5, ataque: 2, defesa: 1, vida: 8, arma: 1, vontade: 2 },
    ],
    aliados: [
      { id: 'prisioneira', nome: 'Odete, prisioneira da cela vizinha', sprite: 'humano', cores: cores('#d0a07a', '#8a7a60', '#5a4a3a', '#202020', '#8a3a1a'), presente: 'dica', fala: 'Conheço estas galerias pelo som da água. Vem, eu te mostro.', grito: 'Não! Sou a Odete, da cela ao lado!' },
      { id: 'monge', nome: 'irmão Anselmo', sprite: 'encapuzado', cores: cores('#c09070', '#6a5a3a', '#c8b070', '#202020'), presente: 'lucidez', fala: 'Respire. A pedra é só pedra. Você é você.', grito: 'Filho, sou eu, o Anselmo!' },
      { id: 'escudeiro', nome: 'Tito, o escudeiro perdido', sprite: 'humano', cores: cores('#e0b090', '#3a5a8a', '#c0c0c0', '#202020', '#c89040'), presente: 'companhia', fala: 'Posso carregar a tocha. Por favor, não me deixe aqui.', grito: 'Sou o Tito! Eu carrego a tocha!' },
    ],
    itens: {
      cura: ['ataduras de linho', 'unguento de arnica', 'pão duro e água'],
      calma: ['erva de cheiro', 'vinho de missa', 'raiz amarga'],
      ancora: ['medalha da sua mãe', 'oração escrita a carvão', 'anel da sua casa'],
      arma: [{ nome: 'clava de osso', mod: 1 }, { nome: 'espada enferrujada', mod: 2 }],
      armadura: [{ nome: 'gibão de couro', mod: 1 }],
    },
    altar: 'santuário esquecido',
    altarTexto: 'Uma vela ainda acesa diante de um santo sem nome. Você reza o que lembra.',
    sussurros: [
      'Água pinga num ritmo que parece uma palavra.',
      'Correntes se arrastam em algum lugar acima.',
      'A tocha diz seu nome. Tochas não falam.',
      'Você ouve alguém cavando do outro lado da pedra.',
      'Um sino toca uma vez, muito longe.',
      'O ar fica frio só do seu lado esquerdo.',
      'Você lembra desta galeria. Você nunca esteve aqui.',
      'Alguém sussurra uma prece de trás para a frente.',
    ],
    golpeFalso: 'Uma lâmina fria encosta nas suas costas.',
    dom: {
      nome: 'Fórmula de fogo', botao: 'Fogo', recurso: 'Fórmulas', cor: 'rgba(255,170,60,',
      palavras: ['Na ponta da língua', 'Lembradas', 'Confusas', 'Quase esquecidas', 'Esquecidas', 'Esquecidas'],
      descricao: 'Uma das três fórmulas de fogo do alquimista. Queima à distância e gasta a memória das fórmulas, que volta com o tempo.',
      acerta: 'Fogo! ', acertaTexto: '',
      erra: 'O fogo passa raspando {alvo}.',
      vazio: 'O fogo atravessa {alvo} e lambe a parede. Não havia nada ali.',
      item: 'O fogo pega {alvo}, que não foge. Era {item}. Virou cinza.', quebraItem: true,
      semRecurso: 'As palavras da fórmula fogem. Nada acontece.',
    },
    ancora: {
      acao: 'Apertar a medalha', item: 'medalha da sua mãe',
      descricao: 'Cura para o espírito: apertar a medalha da sua mãe e rezar o que lembra. Acalma a cabeça e, por um tempo, o que é falso some da vista.',
      restam: ['Nada mais em que se agarrar neste nível', 'Ainda dá para apertar a medalha uma vez', 'Dá para apertar a medalha mais vezes'],
      certo: 'Você aperta a medalha até doer e reza o que lembra. As pedras param de mentir, por um tempo.',
      falha: 'Você aperta a medalha, mas a oração some no meio.',
    },
    tarefas: {
      trancada: 'A grade da escadaria está baixada.',
      aberta: 'Correntes rangem ao longe: a grade da escadaria subiu.',
      passos: [
        { nome: 'chave de ferro', texto: 'Uma chave de ferro, presa ao cinto de um esqueleto. Ela abre a casa do guincho.' },
        { nome: 'guincho da grade', texto: 'Você destrava o guincho. A corrente fica frouxa, esperando o contrapeso.' },
        { nome: 'contrapeso', texto: 'Você empurra o contrapeso para o poço. A corrente estica com um estalo.' },
      ],
    },
    ronda: {
      nome: 'carrasco encapuzado', sprite: 'encapuzado', cores: cores('#b08060', '#1a1a1a', '#8a1a1a', '#ff3030'), categoria: 'humano',
      avisos: ['Um sino toca lá em cima. Alguém notou a cela vazia.', 'Ferro arrastado na pedra, mais perto a cada volta da escada.', 'Você ouve a respiração dele através das paredes.'],
      chegada: 'O carrasco desceu a este nível. Ele não corre. Não precisa.',
    },
    pecas: {
      nomes: ['primeiro pedaço do selo', 'segundo pedaço do selo', 'último pedaço do selo'],
      textos: ['Bronze frio com metade de um brasão. O da sua família.', 'O meio do selo. Alguém o partiu de propósito.', 'A última parte. Encaixada nas outras, forma a palavra que abre o portão.'],
      inteiro: 'O selo inteiro abre o portão da guarda por dentro. Ninguém vai atrás de você.',
      falta: 'Você força a passagem sem o selo. Os sinos tocam atrás de você a noite inteira.',
    },
    janela: {
      fora: 'Pela seteira, só a água negra correndo lá embaixo.',
      passa: 'Algo passa na água do lado de fora da seteira.',
      bate: 'Algo arranha as grades da seteira.',
      quebra: 'A grade enferrujada cede. Algo se espreme para dentro.',
      barra: 'Você encaixa uma tábua na seteira e segura com as costas.',
      falsa: 'O arranhar para. Era a água batendo nas grades.',
    },
    surto: 'Você arranha a pedra até as unhas sangrarem, procurando uma porta que não existe.',
    descida: 'Você sobe a escadaria de pedra. O ar fica um pouco menos pesado.',
    fuga: 'A boca da masmorra cospe você na noite aberta. As estrelas estão no lugar certo.',
    morte: 'A pedra fria é a última coisa que você sente. A masmorra guarda mais um.',
    loucura: 'Você senta numa cela vazia e fecha a grade por dentro. Aqui, pelo menos, você sabe onde estão as paredes.',
    perturbadores: {
      foto: { nome: 'retrato a carvão', texto: 'É o seu rosto, mais velho, desenhado na parede da cela de alguém.' },
      carta: { nome: 'carta lacrada', texto: 'O lacre tem o brasão da sua família. Lá dentro, um mapa e um pedido de perdão.' },
      corpo: { nome: 'prisioneiro caído', ver: 'Um prisioneiro caído contra a parede. Usa a mesma corrente que você usava.', revistar: 'Você revira os trapos dele sem olhar para o rosto. Ele está frio.' },
    },
    buraco: 'As pedras do chão cederam para o nível de baixo.',
    desmaio: 'A tocha fica longe, cada vez mais longe, até virar um ponto.',
    folego: ['cantil de água fria', 'folha de hortelã', 'punhado de sal grosso'],
  },

  zumbi: {
    id: 'zumbi',
    nome: 'Resistência zumbi',
    curto: 'Zumbi',
    abertura:
      'O rádio do abrigo chiou uma última vez: helicóptero no topo do hospital, ao amanhecer. ' +
      'Entre você e o telhado, cinco quadras e o que sobrou da cidade.',
    andares: ['Abrigo do metrô', 'Avenida', 'Shopping', 'Estacionamento do hospital', 'Telhado do hospital'],
    passagem: 'passagem entre os escombros',
    saida: 'helicóptero de resgate',
    salas: ['Farmácia saqueada', 'Garagem', 'Escola', 'Mercadinho', 'Ponto de ônibus', 'Lavanderia', 'Igreja de bairro', 'Loja de ferragens', 'Apartamento arrombado', 'Posto de gasolina'],
    paleta: { fundo: '#0c0e0b', chao: '#5d6058', chao2: '#4b4e47', parede: '#8c8778', parede2: '#6a665a', paredeTopo: '#a8a392', porta: '#8a3a2a', luz: '#f0e0a0' },
    estilo: 'concreto',
    origens: {
      corpo: { nome: 'Bombeira', texto: 'Carrega gente nas costas desde antes do fim do mundo. Dorme pouco.' },
      mente: { nome: 'Farmacêutico', texto: 'Sabe o que cada frasco faz. Faz fogo com o que sobra na prateleira.' },
      espirito: { nome: 'Pastora do bairro', texto: 'Conhece todo mundo pelo nome, inclusive os que voltaram.' },
    },
    monstros: [
      { id: 'errante', nome: 'errante', categoria: 'besta', sprite: 'zumbi', cores: cores('#8aa070', '#5a5a6a', '#a04040', '#f0f080'), andar: 1, ataque: 0, defesa: 0, vida: 4, arma: 0, vontade: 0 },
      { id: 'saqueador', nome: 'saqueador', categoria: 'humano', sprite: 'humano', cores: cores('#c89070', '#3a4a3a', '#c06030', '#202020', '#1a1a1a'), andar: 1, ataque: 1, defesa: 1, vida: 5, arma: 0, vontade: 1 },
      { id: 'gritador', nome: 'gritador', categoria: 'assombro', sprite: 'zumbi', cores: cores('#b0b8a0', '#6a5a7a', '#e0e0e0', '#ff3030'), andar: 2, ataque: 0, defesa: 1, vida: 3, arma: 0, vontade: 1, mental: 1 },
      { id: 'cao', nome: 'cão infectado', categoria: 'besta', sprite: 'cao', cores: cores('#6a6a4a', '#4a4a30', '#a04040', '#f0f080'), andar: 2, ataque: 1, defesa: 1, vida: 4, arma: 1, vontade: 0 },
      { id: 'corredor', nome: 'corredor', categoria: 'besta', sprite: 'zumbi', cores: cores('#a0a878', '#8a2a2a', '#5a1a1a', '#ffff60'), andar: 3, ataque: 1, defesa: 1, vida: 4, arma: 1, vontade: 0, rapido: true },
      { id: 'chefe', nome: 'chefe dos saqueadores', categoria: 'humano', sprite: 'humano', cores: cores('#b88060', '#2a2a2a', '#d0a030', '#202020', '#a0a0a0'), andar: 5, ataque: 2, defesa: 1, vida: 8, arma: 1, vontade: 2 },
    ],
    aliados: [
      { id: 'sobrevivente', nome: 'Rita, sobrevivente do prédio', sprite: 'humano', cores: cores('#a87050', '#4a6a8a', '#d0d0d0', '#202020', '#2a1a10'), presente: 'dica', fala: 'Por ali tem uma passagem. Os errantes não sabem subir escada.', grito: 'Ei! Sou gente! Sou a Rita!' },
      { id: 'medica', nome: 'doutora Júlia', sprite: 'humano', cores: cores('#e0b090', '#f0f0f0', '#4a8a6a', '#202020', '#6a3a1a'), presente: 'item', fala: 'Fica com isto. Eu já não tenho em quem usar.', grito: 'Sou médica! Não!' },
      { id: 'garoto', nome: 'Davi, o garoto do rádio', sprite: 'crianca', cores: cores('#c08a60', '#d04040', '#3a3a6a', '#202020', '#1a1a1a'), presente: 'companhia', fala: 'Eu ouvi o rádio também. Vou com você até o telhado.', grito: 'Para! Sou o Davi!' },
    ],
    itens: {
      cura: ['kit de primeiros socorros', 'esparadrapo e álcool', 'antibiótico vencido'],
      calma: ['café solúvel', 'cigarro amassado', 'barra de chocolate'],
      ancora: ['rádio a pilha', 'desenho de criança', 'chaveiro de casa'],
      arma: [{ nome: 'cano de ferro', mod: 1 }, { nome: 'machado de incêndio', mod: 2 }],
      armadura: [{ nome: 'jaqueta de couro grossa', mod: 1 }],
    },
    altar: 'barricada com fogueira',
    altarTexto: 'Alguém deixou uma fogueira acesa atrás de uma barricada. Você se aquece e lembra de casa.',
    sussurros: [
      'Um celular toca em algum lugar. Ninguém tem bateria há meses.',
      'Vidro estala sob passos que não são os seus.',
      'O rádio na sua cabeça repete: "telhado, amanhecer".',
      'Alguém bate três vezes numa porta de metal.',
      'Você ouve um helicóptero. Não, não ouve.',
      'Uma criança ri do outro lado da rua.',
      'Gemidos baixos, bem perto, depois nada.',
      'Você sente o cheiro do almoço de domingo da sua avó.',
    ],
    golpeFalso: 'Dentes raspam no seu ombro.',
    dom: {
      nome: 'Frasco incendiário', botao: 'Arremessar', recurso: 'Mistura', cor: 'rgba(255,150,40,',
      palavras: ['Frascos cheios', 'Frascos bons', 'Pela metade', 'No fundo', 'Acabou', 'Acabou'],
      descricao: 'Mistura do farmacêutico, improvisada com o que sobra na prateleira. Arremessada, pega fogo. Acaba; com tempo, dá para misturar de novo.',
      acerta: 'O frasco estoura! ', acertaTexto: '',
      erra: 'O frasco quebra no chão, longe de {alvo}.',
      vazio: 'O frasco atravessa {alvo} e estoura na parede. Não havia nada ali.',
      item: 'O frasco pega {alvo}, que não foge. Era {item}. Queimou.', quebraItem: true,
      semRecurso: 'Não sobrou mistura. Precisa de tempo para improvisar outra.',
    },
    ancora: {
      acao: 'Ouvir o recado no rádio', item: 'recado gravado',
      descricao: 'Cura para o espírito: ouvir de novo a voz de quem espera você em casa. Acalma a cabeça e, por um tempo, o que é falso some da vista.',
      restam: ['Nada mais em que se agarrar neste andar', 'Ainda dá para ouvir o recado uma vez', 'Dá para ouvir o recado mais vezes'],
      certo: 'Você ouve o recado de novo, baixinho. Alguém espera você. O mundo para de mentir, por um tempo.',
      falha: 'O rádio chia. Você não reconhece a voz.',
    },
    tarefas: {
      trancada: 'A porta corta-fogo da escada está travada.',
      aberta: 'Um bipe e um clique: a porta corta-fogo destravou.',
      passos: [
        { nome: 'cartão de acesso', texto: 'Um cartão de acesso no bolso de um jaleco. A tarja diz: MANUTENÇÃO.' },
        { nome: 'gerador', texto: 'Com o cartão, você entra na casa de máquinas e liga o gerador. As luzes de emergência piscam.' },
        { nome: 'painel da portaria', texto: 'No painel da portaria, você aperta o botão da porta da escada. Uma luz verde acende.' },
      ],
    },
    ronda: {
      nome: 'horda', sprite: 'zumbi', cores: cores('#7a9070', '#4a4a3a', '#2a2a2a', '#d0ff60'), categoria: 'besta',
      avisos: ['O barulho atraiu alguma coisa. Muitas coisas.', 'Gemidos subindo pela escada. Mãos nas paredes.', 'O prédio inteiro treme com os passos deles.'],
      chegada: 'A horda entrou neste andar. Não dá para lutar com todos.',
    },
    pecas: {
      nomes: ['bateria do rádio', 'antena do rádio', 'papel com a frequência'],
      textos: ['Uma bateria ainda carregada. Alguém guardou para isto.', 'A antena dobrada. Ainda serve.', 'A frequência do resgate, escrita a caneta. E a hora: hoje, ao amanhecer.'],
      inteiro: 'No telhado, o rádio chia e uma voz responde. O helicóptero vem buscar você.',
      falta: 'Você sai pela rua sem chamar ninguém. Por enquanto, continua de pé.',
    },
    janela: {
      fora: 'Lá fora, carros abandonados e um poste piscando.',
      passa: 'Um vulto cambaleia do lado de fora da janela.',
      bate: 'Mãos batem no vidro da janela, sem ritmo.',
      quebra: 'O vidro estoura. Braços, depois o resto.',
      barra: 'Você arrasta um armário até a janela e segura com o corpo.',
      falsa: 'As batidas param. Era o vento num toldo rasgado.',
    },
    surto: 'Você corre sem direção, gritando nomes de quem já se foi.',
    descida: 'Você passa pelos escombros. A cidade muda de cara, mas não de cheiro.',
    fuga: 'As hélices cortam o amanhecer. Alguém estende a mão e puxa você para dentro.',
    morte: 'Você cai no asfalto. Daqui a pouco, você levanta. Mas não vai ser você.',
    loucura: 'Você se tranca num banheiro e liga o rádio. Só chiado. Você conversa com ele até o sol nascer.',
    perturbadores: {
      foto: { nome: 'foto de família', texto: 'Uma família sorrindo num churrasco. No fundo, desfocado, alguém igual a você.' },
      carta: { nome: 'bilhete na parede', texto: 'Escrito às pressas: “Se você ler isto, ainda dá tempo.” Embaixo, setas.' },
      corpo: { nome: 'corpo de um sobrevivente', ver: 'Alguém que não chegou. A mochila ainda está nas costas.', revistar: 'Você abre a mochila depressa. Ele não se mexe. Ele não vai se mexer.' },
    },
    buraco: 'O assoalho cedeu e mostra o andar de baixo.',
    desmaio: 'O barulho da rua vai ficando abafado, como se você afundasse na água.',
    folego: ['energético morno', 'pílula de cafeína', 'garrafa de água'],
  },
};

export const LISTA_TEMAS = Object.keys(TEMAS);
