/**
 * A Última Brasa, Ato 3: O Cimo. A montanha Cimo-Cinzento, de noite: frio,
 * altura, vento e as coisas da Longa Noite. Formato em ../FORMATO.md.
 */

export const itens = {};

export const companheiros = {
  fuligemCadela: {
    nome: 'Fuligem',
    quem: 'cadela pastora do Cimo, preta de focinho branco, que conhece cada trilha pelo cheiro',
    niveis: { percepcao: 2, fisico: 1 },
  },
};

export const inimigos = {
  geadaPensante: {
    nome: 'O frio que pensa',
    ataque: 3, defesa: 3, vida: 7, arma: 1, armadura: 0,
    resistencia: 3, reflexo: 1, vontade: 3, fe: 0,
    mental: true,
  },
  loboBrancoDoCimo: {
    nome: 'Lobo branco do Cimo',
    ataque: 2, defesa: 2, vida: 5, arma: 1, armadura: 0,
    resistencia: 1, reflexo: 2, vontade: 1, fe: 0,
  },
};

export const cenas = [
  {
    id: 'ato3-geada',
    ato: 3,
    titulo: 'O paredão do vento',
    texto:
      'Acima da última árvore, a trilha encosta num paredão de pedra nua e o vento desce do Cimo-Cinzento como água de açude rompido. Os cílios colam. Os dedos na alça da lanterna já não são bem seus. Faltam uns trezentos passos de cornija até a próxima dobra da montanha, e a noite inteira sopra contra cada um deles.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Aguentar o frio andando',
        teste: { chave: 'resistencia', dificuldade: 8 },
        ajuda: ['agasalho'],
        sucesso: {
          texto: 'Você baixa a cabeça e conta os passos. O frio morde, depois cansa de morder. Na dobra da montanha o vento some de repente, e o silêncio chega a dar calor.',
          cronica: '{nome} atravessou o paredão do vento sem parar uma vez.',
        },
        falha: {
          texto: 'No meio da cornija os joelhos param de obedecer. Você chega à dobra arrastando um pé, com dois dedos brancos feito cera e a lanterna batendo na pedra.',
          cronica: 'O vento do Cimo cobrou dois dedos de {nome}.',
          efeitos: { vida: -3, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o lado manso do vento',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        sucesso: {
          texto: 'A neve acumulada conta de onde o vento vem. Rente ao paredão há um palmo de ar parado, onde nem geada pega. Você segue colado à pedra, de lado, feito caranguejo, e chega inteiro.',
          cronica: '{nome} leu o vento na neve e passou o paredão colado à pedra.',
        },
        falha: {
          texto: 'Você escolhe a beirada, onde a neve é mais rasa, e é justo ali que o vento bate inteiro. Volta, recomeça rente à pedra. A lanterna pagou pela aula.',
          cronica: '{nome} errou o lado do vento e teve de recomeçar a cornija.',
          efeitos: { vida: -1, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Não pensar em parar',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'O corpo pede só um minuto sentado. Você responde que sim, logo ali, na dobra. Diz isso trezentas vezes. Na dobra, já sem vento, descobre que não precisa mais.',
          cronica: '{nome} enganou o próprio cansaço até o fim do paredão.',
        },
        falha: {
          texto: 'Você senta. Só um minuto. O sono que vem é morno e mentiroso, e você acorda com neve no colo, sem saber quanto da brasa dormiu junto.',
          cronica: '{nome} cochilou na cornija e acordou coberto de neve.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'elemental',
        rotulo: 'Pedir calor à brasa',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 4 },
        sucesso: {
          texto: 'Você fala baixo com o fogo, do jeito que se fala com bicho arisco. A brasa responde: um calor redondo sai da lanterna e anda com você, e a neve chia ao tocá-lo.',
          cronica: '{nome} atravessou o paredão dentro de um bolsão de calor.',
        },
        falha: {
          texto: 'O calor vem, mas o vento o leva antes que chegue à sua pele. Você atravessa como todo mundo, batendo os dentes, com a cabeça mais vazia do que antes.',
          cronica: 'O vento do Cimo levou o feitiço de {nome}.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'manto',
        rotulo: 'Fechar o manto de lã',
        requer: { item: 'manto' },
        livre: true,
        resultado: {
          texto: 'Lã do vale, cardada à mão, com cheiro de ovelha e de fumaça. Você faz do manto uma tenda para si e para a lanterna. O vento bate, reclama e desiste.',
          cronica: '{nome} passou o paredão do vento embrulhado num manto de lã do vale.',
        },
      },
    ],
  },

  {
    id: 'ato3-refugio',
    ato: 3,
    titulo: 'O refúgio dos pastores',
    texto:
      'Uma casa de pedra baixa, fumaça na chaminé, ovelhas apertadas no cercado. Dentro, seis pastores amarram trouxas à luz da lareira. Vão largar o rebanho e descer ainda esta noite, para longe do vale, para qualquer lugar. "O Farol morreu", diz Jacinta, a mais velha, sem levantar os olhos do nó. "Quem fica aqui em cima fica para a Noite."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Escorar o cercado com eles',
        teste: { chave: 'forca', dificuldade: 7 },
        ajudantes: [{ nome: 'os pastores', nivel: 1 }],
        sucesso: {
          texto: 'Você não discute: pega a estaca solta e bate. Um larga a trouxa para segurar, depois outro. Com o cercado firme, fugir parece trabalho demais. Alguém põe mais lenha no fogo.',
          cronica: '{nome} consertou o cercado dos pastores, e eles ficaram para vigiá-lo.',
          efeitos: { lacos: 1, brasa: 1 },
        },
        falha: {
          texto: 'A estaca racha na sua mão e leva um pedaço da palma. Os pastores olham o cercado torto como quem lê um aviso, e saem pela porta um atrás do outro.',
          cronica: '{nome} não segurou o cercado nem os pastores do Cimo.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ouvir do que eles têm medo',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'O medo tem nome: Brás, que subiu atrás de uma ovelha e não voltou. Você promete procurar por ele no caminho. Jacinta desfaz o nó, devagar, e põe um pote de unguento na sua mão.',
          cronica: '{nome} descobriu que os pastores fugiam por causa de um homem perdido, e prometeu procurá-lo.',
          efeitos: { lacos: 1, item: 'unguento' },
        },
        falha: {
          texto: 'Você pergunta demais e na ordem errada. Eles contam das vozes no vento, dos nomes chamados à noite. Você sai de lá sabendo mais do que queria.',
          cronica: '{nome} ouviu dos pastores histórias que era melhor não ouvir.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Falar a todos junto ao fogo',
        teste: { chave: 'lideranca', dificuldade: 8 },
        sucesso: {
          texto: 'Você ergue a lanterna e diz de onde ela vem e para onde vai. Fala do vale que vai amanhecer olhando para cima. Jacinta solta a trouxa. "Então a gente guarda a subida", diz. Dão a você o lugar junto à lareira.',
          cronica: '{nome} falou aos pastores do Cimo, e nenhum deles desceu a montanha.',
          efeitos: { lacos: 1, brasa: 1, marco: true },
        },
        falha: {
          texto: 'As palavras saem bonitas e ocas. Um pastor moço ri sem alegria. Eles descem em fila, e você fica sozinho numa casa que esfria, pensando que talvez tenham razão.',
          cronica: 'Os pastores do Cimo ouviram {nome} e foram embora assim mesmo.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Deixar que reconheçam você',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'O pastor moço olha duas vezes e cochicha. Seu nome corre a sala antes de você abrir a boca. Se gente assim está subindo, descer é vergonha. Jacinta manda esquentar a sopa.',
          cronica: 'Os pastores do Cimo reconheceram {nome} e resolveram ficar.',
          efeitos: { lacos: 1, brasa: 1 },
        },
      },
      {
        id: 'animais',
        rotulo: 'Acalmar o rebanho primeiro',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 4 },
        sucesso: {
          texto: 'Você entra no cercado e fala com a ovelha-guia. Uma a uma elas se deitam. Pastor confia mais em ovelha do que em gente: se o rebanho sossegou, a noite ainda não chegou ali.',
          cronica: '{nome} sossegou o rebanho, e os pastores sossegaram com ele.',
          efeitos: { lacos: 1, brasa: 1, item: 'unguento' },
        },
        falha: {
          texto: 'A ovelha-guia não quer conversa e o rebanho gira no cercado feito água em tacho. Os pastores assistem em silêncio. Depois voltam às trouxas.',
          cronica: '{nome} não conseguiu acalmar as ovelhas do Cimo.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },

  {
    id: 'ato3-ponte',
    ato: 3,
    titulo: 'A ponte de corda',
    texto:
      'A garganta corta a montanha de alto a baixo, e a única passagem é uma ponte de corda e tábua que algum pastor otimista armou há muitos invernos. Ela balança sozinha. Lá no fundo, o rio é um fio de barulho. Faltam tábuas, o corrimão da esquerda está desfiado, e o vento experimenta a ponte como quem afina um instrumento.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Atravessar no passo certo',
        teste: { chave: 'destreza', dificuldade: 8 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'A ponte tem um compasso, e você entra nele: um passo quando ela sobe, espera quando ela desce. Do outro lado, as pernas só começam a tremer depois que já não precisam de você.',
          cronica: '{nome} atravessou a ponte de corda no compasso do vento.',
        },
        falha: {
          texto: 'Uma tábua vira sob o pé. Você fica pendurado pelo cotovelo, a lanterna girando sobre o vazio, e se arrasta até a outra borda com o braço em fogo.',
          cronica: '{nome} quase caiu da ponte de corda e chegou do outro lado pelo braço.',
          efeitos: { vida: -2, brasa: -1 },
        },
        critico: {
          texto: 'Você cruza leve, quase dançando, e ainda repõe no lugar duas tábuas soltas. No último mourão, pendurado num prego, alguém deixou um manto para quem viesse depois.',
          cronica: '{nome} atravessou a ponte de corda como quem dança e a deixou melhor do que achou.',
          efeitos: { item: 'manto' },
        },
        desastre: {
          texto: 'O corrimão desfiado arrebenta. Você cai um corpo inteiro até a corda de baixo segurar, e a lanterna bate na pedra com um som que você vai ouvir por muitas noites.',
          cronica: 'A ponte de corda quase levou {nome} e a lanterna juntos.',
          efeitos: { vida: -3, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Escolher as tábuas boas',
        teste: { chave: 'percepcao', dificuldade: 7 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'Madeira podre fica escura e guarda neve; madeira boa a sacode. Você pisa só nas tábuas nuas e atravessa devagar, sem um estalo, com tempo até de olhar o rio.',
          cronica: '{nome} atravessou a ponte de corda pisando só onde a madeira era boa.',
        },
        falha: {
          texto: 'No escuro, toda tábua parece podre. Você testa cada uma com o calcanhar, volta, testa de novo. Atravessa ileso e muito, muito tarde.',
          cronica: '{nome} levou uma eternidade para cruzar a ponte de corda.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Confiar e não olhar para baixo',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Quem fez esta ponte fez para ser atravessada. Você põe os olhos no mourão do outro lado e deixa os pés por conta deles. Chega sem saber dizer como foi.',
          cronica: '{nome} cruzou a ponte de corda sem olhar para baixo uma só vez.',
        },
        falha: {
          texto: 'No meio da ponte você olha. O fundo da garganta olha de volta, escuro e paciente, e diz que cair é rápido. Você atravessa de gatinhas, de olhos fechados.',
          cronica: 'No meio da ponte de corda, {nome} olhou para baixo.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'corda',
        rotulo: 'Amarrar uma linha de vida',
        requer: { item: 'corda' },
        livre: true,
        resultado: {
          texto: 'Você prende a corda no mourão, passa-a pela cintura e atravessa amarrado. Do outro lado, estica e dá o nó: agora a ponte tem um corrimão novo. A corda fica, para quem vier depois.',
          cronica: '{nome} atravessou a ponte amarrado à própria corda e a deixou lá, de corrimão.',
          efeitos: { semItem: 'corda' },
        },
      },
    ],
  },

  {
    id: 'ato3-ferido',
    ato: 3,
    titulo: 'O homem na neve',
    texto:
      'Uma cadela preta de focinho branco sai do escuro, late duas vezes e volta por onde veio, olhando para trás. Você a segue. Ao pé de um barranco está um pastor grande, Brás, com a perna torcida num ângulo ruim e a barba cheia de gelo. "Vá embora com essa luz", ele resmunga. "Eu peso mais que uma porta." O refúgio fica a meia hora, morro acima.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Carregar Brás nas costas',
        teste: { chave: 'forca', dificuldade: 9 },
        ajudantes: [{ nome: 'a cadela, puxando pela manga', nivel: 1 }],
        sucesso: {
          texto: 'Ele pesa mesmo como uma porta, e reclama o caminho todo. Você o larga diante do refúgio com as costas em brasa. "Fuligem vai com você", diz Brás. "Ela sabe o Cimo melhor do que eu."',
          cronica: '{nome} carregou o pastor Brás morro acima e ganhou a companhia da cadela Fuligem.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: 'Na metade da subida as pernas dobram e vocês dois rolam na neve. Chegam ao refúgio rastejando lado a lado, e alguma coisa nas suas costas ficou lá no barranco.',
          cronica: '{nome} levou o pastor Brás até o refúgio e deixou as costas no caminho.',
          efeitos: { vida: -3, lacos: 1 },
        },
        critico: {
          texto: 'Você sobe o morro com Brás no ombro como quem leva um saco de lã. No refúgio, ele tira o próprio manto e o joga sobre você. "Fuligem vai junto. E não discuta comigo."',
          cronica: '{nome} carregou o pastor Brás como se ele não pesasse, e saiu de lá com manto e cadela.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela', item: 'manto' },
        },
      },
      {
        id: 'mente',
        rotulo: 'Improvisar um trenó',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Dois galhos de zimbro, o cajado dele, o cinto dos dois. O trenó é feio e desliza. Brás vai deitado, dando palpite. Na porta do refúgio, manda a cadela seguir com você.',
          cronica: '{nome} fez um trenó de galhos e arrastou o pastor Brás até o refúgio.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: 'O trenó desmancha três vezes, e três vezes você o refaz com os dedos duros. Brás chega vivo ao refúgio. A brasa chega menor, e a cadela não larga a porta do dono.',
          cronica: '{nome} salvou o pastor Brás num trenó que desmanchava a cada cem passos.',
          efeitos: { brasa: -2, lacos: 1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Fazer Brás querer andar',
        teste: { chave: 'presenca', dificuldade: 7 },
        sucesso: {
          texto: 'Você pergunta das ovelhas, uma por uma, pelo nome. Ele responde, se irrita, se apoia no seu ombro para corrigir. Sobe mancando e falando. Lá em cima, entrega a cadela aos seus cuidados.',
          cronica: '{nome} fez o pastor Brás subir o morro com as próprias pernas, de tanto falar de ovelha.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: '"Me deixe", ele repete, e fecha os olhos. Você cobre o homem com ramos, grita pelo refúgio até ver uma luz descer, e segue. O rosto dele vai junto, por dentro.',
          cronica: '{nome} deixou o pastor Brás para os outros buscarem e não se perdoou depressa.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Encanar a perna dele',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 4 },
        sucesso: {
          texto: 'Um puxão seco, duas talas, a faixa bem apertada. Brás diz um palavrão comprido e depois fica de pé. Sobe apoiado em você, espantado com a própria perna, e lhe dá a cadela e um pote de unguento.',
          cronica: '{nome} encanou a perna do pastor Brás na neve, e ele subiu andando.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela', item: 'unguento' },
        },
        falha: {
          texto: 'O osso não quer voltar ao lugar com o frio. Você imobiliza como dá e sobe com ele pendurado no ombro, parando a cada dez passos.',
          cronica: '{nome} tentou encanar a perna do pastor Brás e acabou levando-o no ombro.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
      {
        id: 'suporte',
        rotulo: 'Emprestar força à perna dele',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'Você põe a mão sobre o joelho torto e empresta o que tem. O osso aquece. Brás se levanta desconfiado, dá três passos e desata a rir. A cadela vai com você, por ordem dele.',
          cronica: '{nome} pôs o pastor Brás de pé com uma palavra e a mão no joelho.',
          efeitos: { lacos: 1, companheiro: 'fuligemCadela' },
        },
        falha: {
          texto: 'A força vai, mas a perna não a segura: escorre feito água em peneira. Você sobe com ele apoiado, mais cansado por dentro do que por fora.',
          cronica: 'A magia de {nome} não segurou na perna do pastor Brás.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ato3-nevasca',
    ato: 3,
    titulo: 'Branco por todos os lados',
    texto:
      'A neve começa de mansinho e em dez minutos não há mais montanha: só branco em cima, embaixo e dos lados, e o vento mudando de ideia a cada instante. A trilha sumiu. Em algum ponto à direita há um despenhadeiro. A lanterna ilumina um círculo do tamanho de uma mesa, e é nele que você tem de decidir para onde fica o Cimo.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir em linha reta',
        teste: { chave: 'fisico', dificuldade: 8 },
        ajuda: ['agasalho'],
        sucesso: {
          texto: 'Para cima é para cima, com trilha ou sem. Você enterra as pernas até o joelho e sobe no fôlego. Quando a nevasca cansa, você está acima dela, olhando as nuvens por cima.',
          cronica: '{nome} venceu a nevasca subindo em linha reta, no fôlego.',
        },
        falha: {
          texto: 'A neve funda bebe as suas forças aos goles. Você cava um buraco, encolhe-se em volta da lanterna e espera o pior passar, tremendo tanto que os dentes doem.',
          cronica: '{nome} passou o pior da nevasca encolhido num buraco na neve.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ler o tempo e o caminho',
        teste: { chave: 'percepcao', dificuldade: 8 },
        ajuda: ['mapa', 'luz'],
        sucesso: {
          texto: 'O vento de verdade vem sempre do mesmo lado; o resto é redemoinho. E há montinhos regulares sob a neve: os marcos de pedra dos pastores. Você vai de um a outro, como quem atravessa um rio.',
          cronica: '{nome} achou os marcos de pedra debaixo da neve e não perdeu a trilha.',
        },
        falha: {
          texto: 'Você anda uma hora com toda a certeza e reencontra as próprias pegadas, já meio cobertas. Senta, respira, recomeça pelo outro lado.',
          cronica: '{nome} andou em círculo na nevasca do Cimo.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
        desastre: {
          texto: 'O chão acaba sem avisar. Você escorrega pela borda do despenhadeiro e só para numa saliência, três corpos abaixo. Subir de volta, no escuro e no branco, leva o que você tinha.',
          cronica: '{nome} achou o despenhadeiro da pior maneira e subiu de volta com as unhas.',
          efeitos: { vida: -3, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Seguir andando sem enxergar',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'Você escolhe uma direção e não a renegocia. Um passo, outro, o chão sempre subindo. O branco tenta convencer você de que não há mais nada, e você não dá conversa. Ele abre.',
          cronica: '{nome} atravessou a nevasca sem duvidar da direção.',
        },
        falha: {
          texto: 'Dentro do branco começam a aparecer coisas: uma porta, uma janela acesa, alguém acenando. Você corre atrás de três delas antes de entender que nenhuma estava lá.',
          cronica: 'Na nevasca, {nome} correu atrás de luzes que não existiam.',
          efeitos: { sanidade: -4, brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Esperar a janela da nevasca',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 4 },
        sucesso: {
          texto: 'Nevasca de montanha respira: sopra, para, sopra. Você faz um abrigo raso, protege a lanterna e conta. Na terceira pausa o céu abre uma fresta, e o Cimo aparece inteiro, bem ali.',
          cronica: '{nome} esperou a nevasca tomar fôlego e passou pela fresta.',
        },
        falha: {
          texto: 'A pausa que você esperava demora o dobro. O abrigo segura o vento, mas a brasa não sabe esperar como você.',
          cronica: '{nome} esperou demais pela trégua da nevasca.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'fuligem',
        rotulo: 'Soltar Fuligem na frente',
        requer: { companheiro: 'fuligemCadela' },
        livre: true,
        resultado: {
          texto: 'A cadela fareja o ar, espirra e sai trotando como quem volta para casa. Você segue o focinho branco e o rabo erguido. Ela para a cada vinte passos para ver se você ainda vem.',
          cronica: 'A cadela Fuligem guiou {nome} pela nevasca sem errar um passo.',
        },
      },
    ],
  },

  {
    id: 'ato3-capela',
    ato: 3,
    titulo: 'A vigília da capela',
    texto:
      'A capela do Cimo não tem mais porta nem metade do telhado, mas há uma vela acesa no altar. Irmã Anselma, pequena e muito velha, vigia a chama enrolada em três cobertores. "Enquanto alguém velar aqui, elas não entram", diz, apontando o escuro que se mexe atrás das janelas. Ela não dorme há duas noites. O sino está preso no gelo.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir e soltar o sino',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'A escada da sineira perdeu metade dos degraus. Você sobe pelos que restam, quebra o gelo do badalo com o cabo da lanterna, e o sino fala. Lá fora, o escuro recua até a beira do adro.',
          cronica: '{nome} subiu à sineira da capela do Cimo e fez o sino tocar de novo.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Um degrau cede e você desce a sineira bem mais depressa do que subiu. O sino continua mudo. Irmã Anselma faz o sinal da cruz e ajeita o seu tornozelo sem dizer nada.',
          cronica: '{nome} caiu da sineira da capela do Cimo.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ver por onde o escuro entra',
        teste: { chave: 'percepcao', dificuldade: 7 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'A vela treme sempre para o mesmo lado: há uma fresta atrás do altar, e é por ela que o frio fala. Você a tapa com um banco e um cobertor. A capela fica quieta. A irmã, enfim, cochila.',
          cronica: '{nome} achou a fresta por onde a Noite entrava na capela e a tapou com um banco.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Você procura nas janelas, e as janelas procuram de volta. Há rostos no vidro que sobrou. Um deles tem o seu jeito de inclinar a cabeça.',
          cronica: '{nome} olhou demais pelas janelas da capela do Cimo.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Velar no lugar da irmã',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você se ajoelha e manda a velha dormir. As vozes vêm, pedem, ameaçam, choram. Você olha a vela. Quando Anselma acorda, a chama está do mesmo tamanho, e ela lhe prepara um chá de melissa com as mãos trêmulas.',
          cronica: '{nome} velou a noite na capela do Cimo para que uma velha freira dormisse.',
          efeitos: { lacos: 1, item: 'cha', marco: true },
        },
        falha: {
          texto: 'Lá pela terceira hora, uma voz do lado de fora chama você pelo apelido de criança. Você se levanta antes de pensar. É a irmã quem o segura pela manga, e é ela quem termina a vigília.',
          cronica: '{nome} quase saiu da capela atrás de uma voz, no meio da vigília.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'amuleto',
        rotulo: 'Pendurar o amuleto no altar',
        requer: { item: 'amuleto' },
        livre: true,
        resultado: {
          texto: 'O sininho de Vau-do-Sino, pendurado no altar, tine sozinho com a corrente de ar. É pouco som, mas é som de casa. O escuro se afasta das janelas, e a irmã dorme sentada, sorrindo. O amuleto fica com ela.',
          cronica: '{nome} deixou o amuleto de Vau-do-Sino tinindo no altar da capela do Cimo.',
          efeitos: { lacos: 1, item: 'cha', semItem: 'amuleto' },
        },
      },
      {
        id: 'historia',
        rotulo: 'Lembrar o rito da vigília',
        requer: { nivel: { historia: 1 } },
        teste: { chave: 'historia', dificuldade: 4 },
        sucesso: {
          texto: 'A vigília antiga não se fazia calada: liam-se em voz alta os nomes dos que subiram a montanha. Estão gravados na parede. Você lê, a irmã responde, e a cada nome o escuro dá um passo atrás.',
          cronica: '{nome} leu em voz alta os nomes na parede da capela, como mandava o rito antigo.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Você lembra do rito pela metade e inventa o resto. A irmã corrige com paciência de professora. A noite passa, mais comprida do que precisava.',
          cronica: '{nome} errou o rito da vigília, e Irmã Anselma teve de ensinar.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ato3-sopro',
    ato: 3,
    titulo: 'O frio que pensa',
    texto:
      'Numa selada sem vento, o frio muda de qualidade. Fica atento. Uma voz sem boca fala por dentro da sua cabeça, mansa, com as suas próprias palavras: a brasa dói, a luz chama coisas, o vale dorme melhor no escuro. Basta abrir a portinhola e soprar. Você nota, com algum interesse, que a sua mão já está no trinco da lanterna.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Enfrentar o frio de frente',
        combate: 'geadaPensante',
        vitoria: {
          texto: 'Não há o que golpear, então você golpeia o medo: grita, bate o pé, avança contra o nada com a lanterna erguida. O frio perde a atenção, como bicho que desiste da presa, e volta a ser só frio.',
          cronica: '{nome} enfrentou o frio que pensa no grito e o fez desistir.',
        },
        derrota: {
          texto: 'A voz vence por cansaço. Você abre a portinhola e sopra, uma vez, antes de a sua mão voltar a ser sua. A brasa encolhe para um ponto. Você fecha o trinco chorando de raiva.',
          cronica: 'O frio que pensa fez {nome} soprar a própria brasa.',
          efeitos: { brasa: -2 },
        },
        fuga: {
          texto: 'Você corre selada abaixo com a mão livre agarrando o pulso da outra. A voz fica para trás, rindo baixo, sem pressa nenhuma.',
          cronica: '{nome} fugiu do frio que pensa segurando a própria mão.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o furo no argumento',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['livro'],
        sucesso: {
          texto: 'Se o escuro fosse mesmo melhor, a voz não gastaria tanta lábia com uma brasa tão pequena. Você diz isso em voz alta. O silêncio que responde é o de quem foi pego. A sua mão solta o trinco.',
          cronica: '{nome} pegou o frio que pensa numa contradição e o deixou sem resposta.',
        },
        falha: {
          texto: 'Você discute, e a voz discute melhor. Tem resposta para tudo, e todas soam como pensamento seu. Quando você enfim se arranca dali, não sabe mais quais ideias trouxe e quais ganhou.',
          cronica: '{nome} discutiu com o frio que pensa e saiu sem saber quem tinha vencido.',
          efeitos: { sanidade: -4 },
        },
        critico: {
          texto: 'Você desmonta a fala peça por peça, com calma de relojoeiro, e a voz gagueja. Antes de sumir, de pura raiva, deixa escapar o que mais teme: fogo dividido, luz em muitas mãos.',
          cronica: '{nome} venceu o frio que pensa na conversa e ainda lhe arrancou um segredo.',
          efeitos: { magia: 1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Tirar a mão do trinco',
        teste: { chave: 'vontade', dificuldade: 9 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Dedo por dedo. A voz promete descanso, depois ameaça, depois implora. Você fecha a mão vazia e a guarda no bolso. "Não", diz, e é a palavra mais comprida que já disse. O frio se retira.',
          cronica: '{nome} ouviu o frio que pensa pedir a brasa e respondeu que não.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'A portinhola abre. Você vê os próprios lábios se juntarem para soprar e vira o rosto no último instante. O sopro pega a brasa de raspão. Ela escurece e demora a voltar.',
          cronica: '{nome} soprou de raspão a brasa que jurou levar.',
          efeitos: { brasa: -2, sanidade: -2 },
        },
        desastre: {
          texto: 'Você sopra. De verdade, com vontade, achando que a ideia é sua. A brasa quase morre. O que traz você de volta é o cheiro de fumaça de casa, e uma vergonha que não cabe no peito.',
          cronica: '{nome} soprou a brasa por ordem do frio que pensa e quase a perdeu.',
          efeitos: { brasa: -2, sanidade: -4 },
        },
      },
      {
        id: 'controle',
        rotulo: 'Devolver a ordem a quem mandou',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 5 },
        sucesso: {
          texto: 'Você conhece esse truque por dentro: é o seu, malfeito. Pega o fio da ordem e o puxa ao contrário. "Vá embora", manda. O frio obedece, espantado de obedecer.',
          cronica: '{nome} virou o feitiço do frio que pensa contra ele mesmo.',
        },
        falha: {
          texto: 'Por um instante vocês dois seguram o mesmo fio, e você vê o que há do outro lado. Larga depressa. A mão sai do trinco, mas a imagem não sai da cabeça.',
          cronica: '{nome} viu por um instante o que pensa dentro do frio.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'lamparina',
        rotulo: 'Dividir o fogo em dois',
        requer: { item: 'lamparina' },
        livre: true,
        resultado: {
          texto: 'Antes que a mão termine o gesto, você encosta o pavio da lamparina na brasa. Agora são duas chamas, e a voz só sabe pedir uma coisa de cada vez. Ela se enrola, hesita e se cala.',
          cronica: '{nome} acendeu a lamparina na brasa, e o frio que pensa não soube qual das duas apagar.',
        },
      },
    ],
  },

  {
    id: 'ato3-vulto',
    ato: 3,
    titulo: 'Otto na curva da trilha',
    texto:
      'Na curva da trilha, sentado numa pedra, está Otto, o vizinho de Vau-do-Sino, de mangas arregaçadas apesar da neve. "Vim pelo atalho", diz, sorrindo. "Você deve estar morto de cansaço. Me dê a lanterna, eu levo um pouco." Ele estende a mão. O sorriso é o de Otto. A neve em volta da pedra está lisa, sem uma pegada.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Passar sem deixar que toque',
        teste: { chave: 'destreza', dificuldade: 8 },
        sucesso: {
          texto: 'A trilha ali tem a largura de um banco. Você troca a lanterna de mão, gira o corpo e passa rente ao barranco. Os dedos dele fecham no ar. Atrás de você, a pedra já está vazia.',
          cronica: '{nome} passou pelo falso Otto sem deixar que ele tocasse a lanterna.',
        },
        falha: {
          texto: 'A mão dele roça a alça da lanterna, e é como encostar a língua em ferro gelado. Você arranca a lanterna com um tranco e corre. A brasa ficou mais escura onde ele tocou.',
          cronica: 'O vulto com a cara de Otto encostou na lanterna de {nome}.',
          efeitos: { brasa: -2, vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Reparar no que Otto não faria',
        teste: { chave: 'sabedoria', dificuldade: 8 },
        sucesso: {
          texto: 'Otto tem o joelho ruim e não sobe nem a ladeira da igreja. Otto reclamaria do frio antes de dar boa-noite. "Você não é ele", você diz. O sorriso continua, mas o rosto em volta se desfaz feito geada na vidraça.',
          cronica: '{nome} reconheceu que o vulto na trilha não era Otto, por mais que sorrisse igual.',
        },
        falha: {
          texto: 'É Otto. Tem de ser. Você já está esticando o braço quando a brasa chia e encolhe para longe dele. Você recua tarde, com a certeza de que nunca mais vai confiar num rosto conhecido.',
          cronica: '{nome} quase entregou a lanterna a um vulto com a cara do vizinho.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Exigir que diga quem é',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: '"Diga o nome da sua mulher." Ele abre a boca e não sai nada. Você dá um passo à frente e pergunta de novo, mais alto. O vulto confessa do único jeito que sabe: deixa de estar ali.',
          cronica: '{nome} encarou o falso Otto e o obrigou a se desfazer.',
        },
        falha: {
          texto: 'Ele responde. Sabe o nome da mulher de Otto, o do cachorro, o do seu pai. Sabe coisas que você nunca contou a ninguém. Você passa por ele de olhos no chão, e ele fala até você sumir na curva.',
          cronica: 'O vulto com a cara de Otto sabia coisas demais sobre {nome}.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Apontar a neve sem pegadas',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 4 },
        sucesso: {
          texto: 'Sem pegadas, sem bafo no ar, sem sombra do lado da lanterna. Você enumera em voz alta, contando nos dedos. A cada prova o vulto fica mais ralo. Na terceira, dá para ver a pedra através dele.',
          cronica: '{nome} provou ao falso Otto, ponto por ponto, que ele não existia.',
        },
        falha: {
          texto: 'Você se abaixa para examinar a neve, e ao erguer os olhos ele está de pé, muito perto, ainda sorrindo. Você passa correndo. As provas ficam para outro dia.',
          cronica: '{nome} foi procurar pegadas e achou o vulto perto demais.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'encanto',
        rotulo: 'Desfazer o rosto emprestado',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 5 },
        sucesso: {
          texto: 'É um encanto costurado às pressas, com linha de lembrança sua. Você acha a ponta e puxa. O rosto de Otto sai inteiro, como uma máscara, e volta para dentro da sua memória, onde é o lugar dele.',
          cronica: '{nome} descosturou o rosto de Otto de cima do vulto.',
          efeitos: { magia: 1 },
        },
        falha: {
          texto: 'O encanto se desfaz, e o que há embaixo você preferia não ter visto. Não tem rosto nenhum. Você passa depressa, e ele se vira devagar para acompanhar.',
          cronica: '{nome} viu o que havia debaixo do rosto de Otto.',
          efeitos: { sanidade: -3 },
        },
      },
    ],
  },

  {
    id: 'ato3-lobos',
    ato: 3,
    titulo: 'Os lobos brancos',
    texto:
      'Num platô de neve dura, três lobos brancos rodeiam uma pedra alta. Em cima dela, Nuno, um pastorzinho de uns dez anos, abraça um cordeiro e não chora por pura teimosia. Os lobos estão magros, de costela à mostra. Não rosnam. Volta e meia um deles para e olha para trás, para o escuro de onde vieram, de orelhas baixas.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Espantar os lobos na marra',
        combate: 'loboBrancoDoCimo',
        vitoria: {
          texto: 'O maior avança e leva o que merece. Os outros dois medem você, medem a fome, e escolhem a encosta. Nuno desce da pedra com o cordeiro no colo e as pernas bambas.',
          cronica: '{nome} enfrentou o lobo branco do Cimo para tirar um menino de cima de uma pedra.',
          efeitos: { lacos: 1 },
        },
        derrota: {
          texto: 'O lobo é mais rápido do que a fome faria supor. Você cai, e é o grito de Nuno, lá de cima, jogando pedras, que faz a alcateia recuar. Os dois descem a montanha amparando um ao outro.',
          cronica: '{nome} apanhou do lobo branco e foi salvo pelas pedradas de um menino.',
          efeitos: { brasa: -1, lacos: 1 },
        },
        fuga: {
          texto: 'Você recua de costas, lanterna à frente. Os lobos deixam. Nuno fica na pedra, olhando você ir, e você só respira direito quando ouve, bem depois, os pastores subindo com tochas.',
          cronica: '{nome} deixou um menino cercado de lobos e torceu para os pastores chegarem.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Entender o que os lobos querem',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Eles não cercam o menino: fogem de alguma coisa, e a pedra é o ponto mais alto. Você põe a lanterna no chão e se afasta um passo. Os três se deitam em volta do calor, e Nuno desce pelo outro lado.',
          cronica: '{nome} percebeu que os lobos do Cimo tinham mais medo da Noite do que fome.',
          efeitos: { lacos: 1, item: 'unguento' },
        },
        falha: {
          texto: 'Você conclui que estão fracos demais para atacar. O mais magro discorda e fecha os dentes na sua canela. Nuno aproveita a confusão e pula para o seu lado, com cordeiro e tudo.',
          cronica: '{nome} julgou mal a fome dos lobos brancos e levou uma mordida.',
          efeitos: { vida: -3, lacos: 1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Erguer a lanterna e avançar',
        teste: { chave: 'fe', dificuldade: 8 },
        ajuda: ['amuleto', 'luz'],
        sucesso: {
          texto: 'Você anda para o meio deles com a brasa no alto, sem pressa e sem arma. A luz bate nos olhos amarelos. Os lobos abrem passagem, como gente em procissão. Nuno desce e segura a sua mão.',
          cronica: '{nome} atravessou a alcateia com a lanterna erguida, e os lobos deram passagem.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'No terceiro passo a mão treme, e os lobos veem. Um deles salta na lanterna. Você a protege com o corpo e paga com o ombro. O menino escapa na gritaria.',
          cronica: '{nome} protegeu a lanterna de um lobo com o próprio ombro.',
          efeitos: { vida: -2, sanidade: -2 },
        },
      },
      {
        id: 'animais',
        rotulo: 'Falar com o lobo da frente',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 4 },
        sucesso: {
          texto: 'Você se agacha, olha de lado, boceja. O lobo da frente boceja também. Fome, medo e frio você entende, e ele entende que você entende. A alcateia desce a encosta atrás de você, de longe, até o refúgio.',
          cronica: '{nome} conversou com os lobos brancos do Cimo no idioma do bocejo.',
          efeitos: { lacos: 1, item: 'unguento' },
        },
        falha: {
          texto: 'O lobo da frente não está para conversa e mostra todos os dentes. Você recua devagar. Nuno, que não é bobo, aproveita e desce pelo lado de lá.',
          cronica: '{nome} tentou acalmar os lobos brancos, e eles não quiseram assunto.',
          efeitos: { sanidade: -1, lacos: 1 },
        },
      },
      {
        id: 'ataque',
        rotulo: 'Estalar um raio na neve',
        requer: { nivel: { magiaAtaqueFisico: 1 } },
        teste: { chave: 'magiaAtaqueFisico', dificuldade: 4 },
        sucesso: {
          texto: 'Você mira a neve, a dois passos do focinho deles. O estrondo sobe pela montanha e volta em eco. Os lobos somem na encosta sem um arranhão, e Nuno pede para você fazer de novo.',
          cronica: '{nome} espantou os lobos brancos com um estrondo, sem ferir nenhum.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O feitiço sai fraco, um estalo de graveto. Os lobos nem piscam. Você gasta a noite gritando e batendo a lanterna na pedra até eles cansarem.',
          cronica: '{nome} espantou os lobos brancos no grito, depois que a magia falhou.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },
];
