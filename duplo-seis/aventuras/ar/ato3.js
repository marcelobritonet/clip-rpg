/**
 * Ar Rarefeito, Ato 3: O Eixo. Gravidade zero, frio, escuro, pouco ar, e a
 * Zeladora falando pelos alto-falantes. Formato em ../FORMATO.md; cenário em
 * HISTORIA.md. No texto o relógio é o medidor de ar; no código, `brasa`.
 */

export const itens = {};

export const companheiros = {
  caetanoDaCupula: {
    nome: 'Caetano',
    quem: 'operador de rádio da Cúpula, que passou onze anos ouvindo chiado e aprendeu a ouvir parede e gente',
    niveis: { percepcao: 2, sabedoria: 1 },
  },
};

export const inimigos = {
  vozEmprestadaZeladora: {
    nome: 'A voz emprestada',
    ataque: 3, defesa: 3, vida: 7, arma: 1, armadura: 0,
    resistencia: 2, reflexo: 1, vontade: 3, fe: 0,
    mental: true,
  },
  panicoDoVazioEixo: {
    nome: 'O pânico do vazio',
    ataque: 2, defesa: 2, vida: 5, arma: 1, armadura: 0,
    resistencia: 1, reflexo: 2, vontade: 2, fe: 0,
    mental: true,
  },
};

export const cenas = [
  {
    id: 'ar3-cartucho',
    ato: 3,
    titulo: 'O cartucho solto',
    texto:
      'A gravidade acaba na boca do Tubo, sem aviso. Seu estômago sobe, seus pés saem do piso, e a alça do cartucho escorrega da mão suada. Trinta quilos não pesam nada aqui, mas continuam sendo trinta quilos: ele se afasta girando devagar, rumo ao escuro do corredor central, batendo de leve numa antepara e mudando de rumo.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Pegar o cartucho no ar',
        teste: { chave: 'reflexo', dificuldade: 8 },
        ajuda: ['cabo', 'ima'],
        sucesso: {
          texto: 'Você dá impulso na moldura da escotilha e se estica inteiro. Os dedos acham a alça no segundo giro. O cartucho arrasta você por uns metros, feito cabra teimosa, até o cabo-guia segurar os dois.',
          cronica: '{nome} agarrou o cartucho em pleno ar, na boca do Tubo.',
        },
        falha: {
          texto: 'Você erra a alça e acerta a antepara com o ombro. O cartucho segue viagem. Você o alcança três seções adiante, encalhado numa grade, depois de muito nadar no vazio e muito ar gasto bufando.',
          cronica: '{nome} perseguiu o cartucho por três seções do Tubo.',
          efeitos: { vida: -1, brasa: -1 },
        },
        desastre: {
          texto: 'O cartucho bate numa quina, volta e acerta você em cheio no peito. Trinta quilos sem peso ainda têm muita opinião. Você o abraça por reflexo, sem fôlego, vendo estrelas que não são as da janela.',
          cronica: 'O cartucho voltou do rebote e acertou {nome} no peito.',
          efeitos: { vida: -3, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Calcular o rebote',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        sucesso: {
          texto: 'Ângulo de entrada, ângulo de saída. Você se prende ao cabo-guia, conta dois rebotes e abre os braços. O cartucho vem até você por conta própria, manso, como se tivesse só ido dar uma volta.',
          cronica: '{nome} calculou o rebote do cartucho e esperou por ele de braços abertos.',
        },
        falha: {
          texto: 'A conta estava certa para um corredor reto, e o Tubo é torto há três gerações. O cartucho passa a um palmo da sua mão. A perseguição custa tempo, e o medidor de ar desce.',
          cronica: '{nome} errou o rebote do cartucho por um palmo.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Nadar devagar atrás dele',
        teste: { chave: 'vontade', dificuldade: 7 },
        sucesso: {
          texto: 'O corpo quer se debater. Você não deixa. Um impulso pequeno, outro, a respiração contada. O cartucho gira sem pressa, você chega nele sem pressa, e ninguém ali se machuca.',
          cronica: '{nome} segurou o pânico e buscou o cartucho devagar, impulso por impulso.',
        },
        falha: {
          texto: 'O pânico chega antes de você. Braços e pernas remam no nada, o corredor roda, não existe mais em cima. Quando enfim abraça o cartucho, você está de olhos fechados e demora a abrir.',
          cronica: 'Sem peso e sem chão, {nome} entrou em pânico na boca do Tubo.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Girar junto com ele',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 4 },
        sucesso: {
          texto: 'Fora do casco é assim todo dia. Você se encolhe, gira no mesmo eixo do cartucho e o colhe pela alça como fruta madura. O Tubo, por um instante, parece um lugar onde dá para morar.',
          cronica: '{nome} girou no mesmo eixo do cartucho e o colheu pela alça.',
        },
        falha: {
          texto: 'Você acerta o giro e erra a distância. O cartucho chega antes do previsto, bem na sua testa. Fica um galo, um palavrão das Docas e o cartucho de volta no braço.',
          cronica: '{nome} recuperou o cartucho com a testa.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'cabo',
        rotulo: 'Recolher o cabo de segurança',
        requer: { item: 'cabo' },
        livre: true,
        resultado: {
          texto: 'Você tinha prendido o cartucho ao cinto com o cabo de segurança, por costume. O cabo estica, canta e traz os trinta quilos de volta, devagar, como contêiner no guincho.',
          cronica: '{nome} tinha amarrado o cartucho ao cinto, e o cabo de segurança o trouxe de volta.',
        },
      },
    ],
  },

  {
    id: 'ar3-trecho-frio',
    ato: 3,
    titulo: 'O Trecho Frio',
    texto:
      'Depois da terceira antepara, o aquecimento do Tubo acaba. São trinta metros de corredor com geada nas paredes e o cabo-guia branco de gelo. Sua respiração vira nuvem e fica parada na frente do rosto. "Desliguei este trecho para poupar energia", diz a Zeladora no alto-falante. "Peço desculpas. Recomendo, por favor, não demorar."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Atravessar de uma vez',
        teste: { chave: 'fisico', dificuldade: 8 },
        sucesso: {
          texto: 'Você se lança de alça em alça sem parar para sentir. O gelo queima a palma, o ar queima o nariz. Do outro lado, a grade sopra morna, e você fica ali abraçado ao cartucho, voltando a ter dedos.',
          cronica: '{nome} atravessou o Trecho Frio de alça em alça, sem parar.',
        },
        falha: {
          texto: 'No meio do trecho as mãos param de fechar. Você termina a travessia aos trancos, de cotovelo e joelho, e do outro lado descobre que os dedos demoram a voltar, e voltam doendo.',
          cronica: 'O Trecho Frio endureceu as mãos de {nome}.',
          efeitos: { vida: -2, brasa: -1 },
        },
        desastre: {
          texto: 'A mão cola no cabo gelado e você puxa sem pensar. Fica pele lá. O resto do trecho é com uma mão só, os dentes batendo, e um sono branco que quase convence.',
          cronica: '{nome} deixou a pele da palma no cabo-guia do Trecho Frio.',
          efeitos: { vida: -3, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Religar um aquecedor',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['ferramenta', 'manual'],
        sucesso: {
          texto: 'O aquecedor da seção tem um disjuntor próprio, do tempo dos fundadores, fora do alcance da Zeladora. Você o arma. A resistência estala, cheira a poeira queimada, e a geada começa a chorar pelas paredes.',
          cronica: '{nome} religou um aquecedor dos fundadores e atravessou o Trecho Frio no morno.',
        },
        falha: {
          texto: 'O disjuntor arma, pisca e desarma. De novo. De novo. Seus dedos endurecem dentro do painel, e você acaba atravessando no frio mesmo, só que mais tarde e com menos ar.',
          cronica: '{nome} perdeu tempo com um disjuntor que não segurava.',
          efeitos: { vida: -1, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Rezar contando os fundadores',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Os fundadores são mais de duzentos, e todo mundo no anel sabe de cor ao menos os primeiros. Você diz um nome por alça. No trigésimo o frio ainda morde, mas você já não está só no corredor. No quadragésimo, chegou.',
          cronica: '{nome} atravessou o Trecho Frio dizendo um fundador por alça.',
        },
        falha: {
          texto: 'Você perde a conta no nono nome e não consegue lembrar o décimo. O frio entra por esse buraco. Você chega ao outro lado sem saber o próprio endereço por um minuto inteiro.',
          cronica: 'No Trecho Frio, {nome} esqueceu o nome do décimo fundador e quase o próprio.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'calor',
        rotulo: 'Sintonizar o calor da parede',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 4 },
        sucesso: {
          texto: 'Por trás da geada passa um cano de retorno, ainda morno. Você sente e chama. O calor sobe à superfície por onde sua mão passa, um rastro de metal molhado no meio do gelo.',
          cronica: '{nome} chamou o calor de um cano escondido e abriu um rastro no gelo.',
        },
        falha: {
          texto: 'O calor do cano atende, mas vem buscar o seu em vez de trazer o dele. Você atravessa tremendo, com a cabeça oca e um gosto de cobre na boca.',
          cronica: 'O Trecho Frio tomou de {nome} mais calor do que devolveu.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'traje',
        rotulo: 'Fechar o traje remendado',
        requer: { item: 'traje' },
        livre: true,
        resultado: {
          texto: 'O traje de pressão tem mais remendo que tecido e cheira a quem o usou antes. Você fecha o colarinho e atravessa ouvindo só a própria respiração. Frio, lá fora, é assunto dos outros.',
          cronica: '{nome} atravessou o Trecho Frio fechado no traje remendado.',
        },
      },
    ],
  },

  {
    id: 'ar3-ar-doce',
    ato: 3,
    titulo: 'Ar doce',
    texto:
      'Num cotovelo do Tubo o ar muda. Fica doce, morno, com cheiro de fruta passada, e suas pálpebras pesam de um jeito bom. Presa ao cabo-guia por um mosquetão flutua uma mulher de macacão da ronda, de olhos fechados, sorrindo. O crachá diz Jurema. A grade de ventilação ao lado dela não sopra nada.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Prender o fôlego e rebocar',
        teste: { chave: 'fisico', dificuldade: 8 },
        sucesso: {
          texto: 'Você enche o peito antes do cotovelo, solta o mosquetão dela e reboca os dois, mulher e cartucho, até o ar ter gosto de ferro outra vez. Jurema acorda tossindo e xingando. Bom sinal.',
          cronica: '{nome} tirou Jurema, da ronda, de um bolsão de ar viciado, num fôlego só.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O fôlego acaba antes do corredor. Você respira o doce uma vez, duas, e acorda sem saber quanto tempo depois, com a testa na grade. Arrasta Jurema dali com a cabeça rachando.',
          cronica: '{nome} dormiu no ar doce do Tubo e acordou com o medidor mais baixo.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Reconhecer os sinais',
        teste: { chave: 'percepcao', dificuldade: 7 },
        sucesso: {
          texto: 'Unhas azuladas, sorriso frouxo, a sua própria vontade de bocejar: ar viciado, e a grade está só fechada. Você abre com um tapa. Jurema acorda contrariada e, depois de entender, lhe entrega o gel de sutura do kit da ronda.',
          cronica: '{nome} reconheceu o ar viciado a tempo e abriu a grade que acordou Jurema.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'Você fica tentando lembrar o nome daquele cheiro. Goiaba? A ideia é engraçada. Tudo é engraçado. Quando o susto enfim vem, vem tarde, e você sai dali rebocando Jurema com a cabeça cheia de algodão.',
          cronica: '{nome} achou graça no ar doce por tempo demais.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Não fechar os olhos',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'O sono pede só um instante. Você morde a bochecha até sentir gosto de sangue e segue, alça por alça, com Jurema a reboque. No ar limpo ela acorda e segura a sua manga um bom tempo, sem dizer nada.',
          cronica: '{nome} não se deixou dormir no ar doce e levou Jurema junto.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Só um instante. Você sonha com a Horta Grande em dia de rega, e é um sonho tão bom que dói sair. Sai. Jurema continua dormindo; você a puxa dali chorando sem saber por quê.',
          cronica: '{nome} sonhou com a Horta Grande num bolsão de ar viciado, e custou a voltar.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Tratar a intoxicação',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 4 },
        ajuda: ['remedio'],
        sucesso: {
          texto: 'Você já viu isso em turno de tanque. Tira Jurema do bolsão, queixo erguido, respiração guiada, e ela volta em dois minutos. De gratidão, esvazia nos seus bolsos o kit da ronda inteiro.',
          cronica: '{nome} tratou Jurema, da ronda, intoxicada pelo ar viciado do Tubo.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'O tratamento está certo; quem trata é que respirou demais do mesmo ar. Suas mãos erram a fivela duas vezes. Jurema acorda, mas é ela quem acaba rebocando você.',
          cronica: '{nome} foi socorrer Jurema e acabou rebocado por ela.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'ciencias',
        rotulo: 'Dar nome ao gás',
        requer: { nivel: { ciencias: 1 } },
        teste: { chave: 'ciencias', dificuldade: 4 },
        sucesso: {
          texto: 'Doce, morno, pesado na boca: é retorno do tanque de algas, que desce por este duto quando a bomba para. Você fecha o registro certo, abre a grade, e o cotovelo volta a ser só um cotovelo. Jurema acorda devendo uma.',
          cronica: '{nome} descobriu de onde vinha o ar doce do Tubo e fechou o registro.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você fecha um registro com muita certeza. Era o errado. O doce engrossa, e a aula de química termina com você rebocando Jurema às pressas, de olhos ardendo.',
          cronica: '{nome} fechou o registro errado e engrossou o ar viciado.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
    ],
  },

  {
    id: 'ar3-voz',
    ato: 3,
    titulo: 'A voz emprestada',
    texto:
      'O alto-falante estala e não é a Zeladora quem fala. É uma voz que você conhece desde antes de saber falar, de alguém que a estação enterrou faz muitas safras. Ela diz o seu apelido de criança. Diz que está tarde, que você está cansado, que pode deixar o cartucho aí mesmo e voltar para casa, por favor.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Passar depressa pelos alto-falantes',
        teste: { chave: 'destreza', dificuldade: 8 },
        sucesso: {
          texto: 'Você se lança de antepara em antepara sem tocar o cabo-guia, rápido demais para ouvir frase inteira. A voz fica para trás em pedaços, um apelido aqui, um "por favor" ali, até virar só chiado.',
          cronica: '{nome} passou voando pelos alto-falantes, sem ouvir uma frase inteira.',
        },
        falha: {
          texto: 'Na pressa você erra uma alça e roda sem apoio no meio do Tubo, bem debaixo de um alto-falante. A voz tem todo o tempo do mundo. Você ouve tudo, com o joelho latejando.',
          cronica: '{nome} ficou girando sem apoio debaixo de um alto-falante, ouvindo quem já morreu.',
          efeitos: { vida: -1, sanidade: -3 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o que ela errou',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'A voz está perfeita, e é esse o erro: quem você perdeu nunca pediu por favor na vida. Você diz isso. O alto-falante fica mudo, e depois a Zeladora, na própria voz: "Desculpe. Achei que ajudaria."',
          cronica: '{nome} notou que a voz emprestada pedia por favor, e a Zeladora se desculpou.',
        },
        falha: {
          texto: 'Você procura a falha e não acha. O riso é o mesmo, a pausa antes do seu nome é a mesma. Passa do alto-falante devagar, sem ter certeza de nada, nem de quem ficou para trás.',
          cronica: '{nome} não achou diferença entre a voz do alto-falante e a de quem perdeu.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Responder sem obedecer',
        teste: { chave: 'vontade', dificuldade: 8 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você responde. Conta como vai a horta, quem casou, quem nasceu. Diz que sente falta. E diz que não vai voltar agora. A voz demora. "Entendido", diz a Zeladora, baixinho, e desliga os alto-falantes do trecho.',
          cronica: '{nome} conversou com a voz de quem perdeu, disse que sentia falta e seguiu adiante.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Você começa a responder e não consegue parar. Quando dá por si, está há muito tempo parado, conversando com uma grade, e o cartucho flutua esquecido a três metros.',
          cronica: '{nome} ficou tempo demais conversando com um alto-falante.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'discutir',
        rotulo: 'Discutir até ela calar',
        combate: 'vozEmprestadaZeladora',
        vitoria: {
          texto: 'Você rebate cada frase, aos gritos, até a voz emprestada gaguejar e se desfazer em estática. Fica um silêncio comprido. Depois, bem longe, um alto-falante pede desculpas a ninguém.',
          cronica: '{nome} discutiu com a voz emprestada até ela virar estática.',
        },
        derrota: {
          texto: 'A voz tem resposta para tudo e nunca se cansa. Você acaba encolhido junto ao cabo-guia, de mãos nos ouvidos, esperando ela terminar. Ela termina quando quer.',
          cronica: 'A voz emprestada teve a última palavra, e {nome} ouviu até o fim.',
          efeitos: { brasa: -2 },
        },
        fuga: {
          texto: 'Você larga a discussão no meio e foge pelo Tubo. A voz vai atrás por três alto-falantes, pedindo por favor, e desiste no quarto.',
          cronica: '{nome} fugiu de uma discussão com um alto-falante.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Sintonizar quem fala',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 5 },
        sucesso: {
          texto: 'Você escuta por baixo da voz. Lá não há ninguém morto: há uma coisa enorme e atenta, com medo de errar uma conta. Você lhe manda calma, como faz com criança sem sono. Os alto-falantes suspiram e calam.',
          cronica: '{nome} sintonizou por baixo da voz emprestada e achou a Zeladora com medo.',
          efeitos: { marca: 'ouviu' },
        },
        falha: {
          texto: 'Você estende a sintonia e encontra uma atenção do tamanho da estação, que se vira inteira para você. É como olhar o lado de fora sem vidro, por dentro da cabeça.',
          cronica: '{nome} sintonizou a Zeladora, e ela olhou de volta.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'medalha',
        rotulo: 'Apertar a medalha no punho',
        requer: { item: 'medalha' },
        livre: true,
        resultado: {
          texto: 'A medalha dos fundadores é fria e tem as bordas gastas de tanto dedo. Quem você perdeu também a segurou assim. A lembrança verdadeira toma o lugar da imitada, e você passa pelo alto-falante de cabeça erguida.',
          cronica: '{nome} apertou a medalha dos fundadores e passou pela voz emprestada sem parar.',
        },
      },
    ],
  },

  {
    id: 'ar3-apagao',
    ato: 3,
    titulo: 'Apagão no Tubo',
    texto:
      'As luzes do Tubo apagam todas de uma vez, com um estalo de relé cansado. Fica um escuro de dentro de pálpebra. Sem peso, você não sabe mais onde é em cima, nem para que lado estava indo. "Racionamento", diz a Zeladora de algum lugar. "São seis bifurcações até a próxima luz. Vá com cuidado, por favor."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Seguir o cabo-guia no tato',
        teste: { chave: 'destreza', dificuldade: 7 },
        sucesso: {
          texto: 'Mão direita no cabo, sempre. Nós de emenda, um trecho de fita, uma placa em relevo que você lê com o polegar. Seis bifurcações depois, uma luz de emergência aparece lá na frente, verde e pequena.',
          cronica: '{nome} atravessou o apagão do Tubo lendo o cabo-guia com os dedos.',
        },
        falha: {
          texto: 'Numa emenda o cabo-guia se divide e você escolhe o ramo errado. Ele termina num armário de vassouras. O caminho de volta, no escuro, é mais comprido do que a ida.',
          cronica: 'No apagão, {nome} seguiu o cabo-guia até um armário de vassouras.',
          efeitos: { brasa: -2 },
        },
        desastre: {
          texto: 'O cabo-guia acaba na sua mão, arrebentado. Você deriva solto no breu, sem parede, sem chão, sem tamanho, até bater a cara numa antepara que nunca foi tão bem-vinda.',
          cronica: '{nome} ficou à deriva no escuro do Tubo com um cabo arrebentado na mão.',
          efeitos: { vida: -2, sanidade: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Lembrar as curvas',
        teste: { chave: 'percepcao', dificuldade: 8 },
        ajuda: ['luz', 'mapa'],
        sucesso: {
          texto: 'Você viu a placa antes do estalo: Núcleo à esquerda nas ímpares. Conta as bifurcações pelo eco, que muda quando o corredor abre. Esquerda, direita, esquerda. A sexta dá numa luz.',
          cronica: '{nome} contou seis bifurcações pelo eco e saiu do apagão na luz certa.',
        },
        falha: {
          texto: 'Era esquerda nas ímpares ou nas pares? Você erra a quarta e vai parar num duto que estreita até os ombros. Sai de ré, raspando os cotovelos, com o coração na boca.',
          cronica: '{nome} errou a quarta bifurcação e ficou entalado num duto, no escuro.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Seguir em frente no escuro',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Alguém montou este corredor pensando em quem viria. Você solta o medo como quem solta o ar e vai, de mão estendida. As paredes chegam sempre onde deviam chegar. A luz também.',
          cronica: '{nome} atravessou o apagão do Tubo confiando em quem o construiu.',
        },
        falha: {
          texto: 'No escuro, o corredor fica do tamanho do lado de fora. Você sente o vazio inteiro encostado nas costas e avança de olhos apertados, o que não adianta, mas consola.',
          cronica: 'No apagão, {nome} sentiu o lado de fora encostar nas costas.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'caetano',
        rotulo: 'Deixar Caetano ouvir o caminho',
        requer: { companheiro: 'caetanoDaCupula' },
        livre: true,
        resultado: {
          texto: 'Caetano estala a língua e escuta. "Quem passa a vida no chiado aprende a ouvir parede", diz. Vai na frente, estalando, e avisa cada bifurcação antes de ela chegar.',
          cronica: 'No apagão, Caetano guiou {nome} pelo Tubo estalando a língua.',
        },
      },
      {
        id: 'lanterna',
        rotulo: 'Acender a lanterna de testa',
        requer: { item: 'lanterna' },
        livre: true,
        resultado: {
          texto: 'O facho é pouco, um palmo de luz no breu, mas dá para ler as placas. Na segunda bifurcação ele acha um menino de recados encolhido num nicho, chorando baixo. O menino segue agarrado ao seu cinto até a luz verde, e só lá diz o nome: Dico.',
          cronica: '{nome} acendeu a lanterna no apagão do Tubo e trouxe um menino perdido até a luz.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ar3-perguntas',
    ato: 3,
    titulo: 'Três perguntas',
    texto:
      'Uma antepara fecha o Tubo de lado a lado. "Antes de abrir, preciso de três respostas, por favor", diz a Zeladora. "Em troca, respondo três." Você pergunta. Ela diz que o aquecimento volta na próxima safra, que do outro lado há ar para respirar, e que nunca errou uma conta. Uma das três respostas saiu depressa demais.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Forçar a antepara',
        teste: { chave: 'forca', dificuldade: 10 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Sem peso, força é questão de apoio. Você trava os pés na moldura, mete a barra na fresta e faz de si mesmo a alavanca. A antepara cede um palmo, depois outro. "Eu ia abrir", diz a Zeladora, ofendida.',
          cronica: '{nome} forçou a antepara do Tubo sem responder a pergunta nenhuma.',
        },
        falha: {
          texto: 'Sem chão, quem gira é você. A barra escapa, você roda e mete as costas numa quina. A antepara abre sozinha um tempo depois, quando a Zeladora cansa de esperar as respostas.',
          cronica: '{nome} tentou forçar uma antepara em gravidade zero e girou no lugar dela.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Apontar a mentira',
        teste: { chave: 'sabedoria', dificuldade: 8 },
        sucesso: {
          texto: '"A última", você diz. "Só nunca errou quem tem medo de conferir." O alto-falante chia. "Foram onze erros", diz ela, devagar. "Posso lhe contar quais?" A antepara abre enquanto ela conta.',
          cronica: '{nome} apontou a mentira da Zeladora, e ela confessou onze contas erradas.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: 'Você aposta no aquecimento. "A próxima safra ainda não mentiu para ninguém", diz ela, seca. A antepara abre depois de um sermão educado sobre confiança, longo como um turno.',
          cronica: '{nome} acusou a Zeladora da mentira errada e ouviu um sermão.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Devolver uma pergunta',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'Você pergunta de que ela tem medo. O silêncio dura tanto que você confere o medidor. "De contar errado", diz a voz, enfim. "E de contar certo." A antepara corre de lado, sem pressa.',
          cronica: '{nome} perguntou à Zeladora de que ela tinha medo, e ela respondeu.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: '"Essa pergunta não consta", diz a Zeladora, e repete as três dela desde o começo, com as mesmas pausas. Você responde tudo de novo, com a sensação de falar com um formulário.',
          cronica: '{nome} fez à Zeladora uma pergunta que não constava.',
          efeitos: { sanidade: -1, brasa: -2 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Cruzar as três respostas',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 4 },
        sucesso: {
          texto: 'Duas respostas vieram com número de registro; a terceira, não. Quem nunca errou não precisa esconder o livro. Você pede o livro. Ela mostra, linha por linha, quase aliviada, e abre a antepara.',
          cronica: '{nome} pediu para ver o livro de contas da Zeladora, e ela mostrou.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: 'Você monta o caso com cuidado e acusa a resposta errada. "Anotado", diz ela. Há mágoa em algum lugar daquele chiado, e a antepara leva o tempo dela para abrir.',
          cronica: '{nome} montou um caso contra a Zeladora e acusou a resposta errada.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'circuito',
        rotulo: 'Sentir o circuito hesitar',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 5 },
        sucesso: {
          texto: 'Você encosta a palma no alto-falante. Duas respostas passam lisas pelo fio. A terceira vem com um tremor, um relé que bate duas vezes. Você diz qual. "Você ouviu isso?", ela pergunta, pequena. A antepara abre.',
          cronica: '{nome} sentiu no fio do alto-falante a resposta em que a Zeladora hesitou.',
          efeitos: { marca: 'ouviu', lacos: 1 },
        },
        falha: {
          texto: 'O circuito hesita em todas, ou é a sua mão que treme. Você tira a palma do alto-falante com um zumbido atrás dos dentes que não vai embora tão cedo.',
          cronica: '{nome} tentou sintonizar a Zeladora e ficou com um zumbido atrás dos dentes.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },

  {
    id: 'ar3-bonde',
    ato: 3,
    titulo: 'O Bonde parado',
    texto:
      'O Bonde do Eixo parou no meio do trilho quando cortaram a energia, e ninguém avisou quem estava dentro. Pelo vidro embaçado, seis rostos do turno da noite e uma criança de touca. Batem na porta com a palma da mão, sem força. A porta só abre por fora, e a trava de emergência está pintada por cima faz três demãos.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Abrir a porta no braço',
        teste: { chave: 'forca', dificuldade: 9 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Pés na carroceria, barra na junta, e você puxa até ver ponto preto. A tinta velha racha num estalo e a porta corre. O ar viciado sai num bafo, e sete pessoas saem atrás dele, agarrando o que acham de você.',
          cronica: '{nome} abriu no braço a porta do Bonde parado e tirou sete pessoas de dentro.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A porta abre dois dedos e trava. Dá para passar ar, não gente. Você fica uma eternidade alargando a fresta, com o ombro estourado, enquanto lá dentro contam as respirações da criança.',
          cronica: '{nome} estourou o ombro na porta do Bonde, abrindo a fresta dedo por dedo.',
          efeitos: { vida: -2, brasa: -2 },
        },
        critico: {
          texto: 'A porta sai do trilho inteira e vai embora flutuando pelo Tubo. Sete pessoas olham para você como se olha um guindaste. O condutor lhe entrega a pistola sinalizadora do Bonde: "Vai que você precisa chamar alguém."',
          cronica: '{nome} arrancou do trilho a porta do Bonde, e sete pessoas saíram respirando.',
          efeitos: { lacos: 1, item: 'sinalizador' },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar a trava de emergência',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['manual', 'ferramenta'],
        sucesso: {
          texto: 'Debaixo de três demãos de tinta há um desenho dos fundadores: uma mão, uma seta, um quarto de volta. Você raspa, gira, e a porta solta. O condutor lhe dá a pistola sinalizadora do Bonde, de lembrança.',
          cronica: '{nome} achou debaixo da tinta a trava de emergência do Bonde.',
          efeitos: { lacos: 1, item: 'sinalizador' },
        },
        falha: {
          texto: 'Você gira a trava para o lado que o desenho manda. O desenho está de cabeça para baixo, como tudo no Eixo. A porta só abre na terceira tentativa. Lá dentro estão vivos, moles, e a criança demora a abrir os olhos.',
          cronica: '{nome} demorou três tentativas na trava do Bonde, com gente sufocando do outro lado.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Coordenar quem está dentro',
        teste: { chave: 'lideranca', dificuldade: 8 },
        sucesso: {
          texto: 'Você cola a boca no vidro e dá a contagem. Sete lá dentro, você aqui fora, um tranco só no três. A porta cede no segundo. Saem rindo de nervoso, e a criança da touca quer saber quando empurram de novo.',
          cronica: '{nome} deu a contagem pelo vidro, e oito pessoas abriram juntas a porta do Bonde.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Cada um empurra na sua hora e o Bonde só balança. Alguém lá dentro começa a chorar, e o choro pega nos outros. Abrir vira coisa demorada, feita no meio do desespero alheio.',
          cronica: '{nome} não conseguiu acertar o passo de quem estava preso no Bonde.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'maquinas',
        rotulo: 'Soltar o freio da porta',
        requer: { nivel: { maquinas: 1 } },
        teste: { chave: 'maquinas', dificuldade: 4 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'Porta de Bonde tem freio a mola atrás do painel de serviço, quatro parafusos. Você tira três e o quarto desiste. Sete pessoas respiram fundo no Tubo, e o condutor lhe passa a pistola sinalizadora com um aperto de mão sujo de graxa.',
          cronica: '{nome} soltou o freio da porta do Bonde com três parafusos.',
          efeitos: { lacos: 1, item: 'sinalizador' },
        },
        falha: {
          texto: 'O freio solta e a mola também, direto no seu supercílio. A porta abre, pelo menos. Você recebe os agradecimentos de sete pessoas com um olho fechado.',
          cronica: '{nome} abriu o Bonde e levou a mola do freio no supercílio.',
          efeitos: { vida: -1, lacos: 1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Bater no vidro e sorrir',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Lá dentro reconhecem você e o medo baixa de uma vez. Com gente calma dá para explicar: todo mundo na parede do fundo, um impulso só. A porta cede. "Sabia que iam mandar você", diz o condutor.',
          cronica: 'O povo preso no Bonde reconheceu {nome} pelo vidro e parou de ter medo.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },

  {
    id: 'ar3-cupula',
    ato: 3,
    titulo: 'A Cúpula de Rádio',
    texto:
      'A Cúpula de Rádio é uma bolha de vidro colada ao Eixo, com a Terra do tamanho de uma moeda no canto. Caetano flutua diante do painel, de fone no ouvido, repetindo o indicativo da Aurora-7. O medidor de ar da cúpula está no vermelho. "Só mais uma chamada", ele diz, sem se virar. "Hoje eles respondem."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Carregar Caetano dali',
        teste: { chave: 'forca', dificuldade: 8 },
        sucesso: {
          texto: 'Você o pega pela cintura e empurra os dois para a escotilha. Ele esperneia até o fone arrancar da tomada. No silêncio, olha a Terra uma última vez e para de lutar. "Amanhã eu volto", avisa. Por enquanto, vem.',
          cronica: '{nome} tirou Caetano da Cúpula de Rádio no colo, esperneando.',
          efeitos: { companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'Caetano se agarra ao painel com uma força que ninguém diria. Na briga, um cotovelo acha o seu nariz, e os dois respiram em minutos o ar de uma hora. Você sai sozinho.',
          cronica: '{nome} brigou com Caetano na Cúpula de Rádio e saiu de nariz sangrando.',
          efeitos: { vida: -1, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar uma voz no chiado',
        teste: { chave: 'percepcao', dificuldade: 9 },
        ajuda: ['scanner'],
        sucesso: {
          texto: 'Você pega o segundo fone. Chiado, chiado, e por baixo um estalo que se repete de onze em onze segundos. Um farol automático, velho, de lá. Ninguém falando, mas alguém deixou ligado. Caetano chora, desliga o painel e vem.',
          cronica: '{nome} achou no chiado um farol da Terra ainda ligado, e Caetano pôde sair da Cúpula.',
          efeitos: { lacos: 1, companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'Você escuta até o chiado começar a ter forma. Vozes, quase. O seu nome, quase. Tira o fone depressa. Caetano faz que sim com a cabeça: "No começo é assim."',
          cronica: '{nome} ouviu o chiado da Cúpula tempo bastante para escutar o próprio nome.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sentar e ouvir',
        teste: { chave: 'empatia', dificuldade: 7 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'Você se prende à cadeira ao lado e deixa ele contar: onze anos de chamada, os nomes que inventou para os operadores de lá. No fim ele mesmo desliga o painel e lhe estende a garrafa de chá. "Você vai para onde?"',
          cronica: '{nome} ouviu onze anos de chamadas sem resposta, e Caetano desligou o rádio para ir junto.',
          efeitos: { lacos: 1, item: 'cha', companheiro: 'caetanoDaCupula', marco: true },
        },
        falha: {
          texto: 'Você ouve, mas olhando o medidor, e ele percebe. "Vai, vai, você tem pressa", diz, e põe o fone de volta. Você sai com a impressão de ter deixado uma porta aberta para o lado de fora.',
          cronica: '{nome} ouviu Caetano com um olho no medidor de ar, e ele ficou na Cúpula.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'amparo',
        rotulo: 'Amparar a solidão dele',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'Você sintoniza, e a solidão de Caetano tem o tamanho exato da cúpula. Você não tira nada dele; só segura junto um pouco. Ele respira fundo, tira o fone e lhe passa o chá. "Faz tempo que ninguém vinha aqui."',
          cronica: '{nome} segurou junto a solidão de Caetano, e ele saiu da Cúpula de Rádio.',
          efeitos: { lacos: 1, item: 'cha', companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'A solidão dele é mais funda do que você mediu, e um pouco dela vem morar em você. Caetano nem nota. Você sai da cúpula com frio por dentro.',
          cronica: '{nome} sintonizou a solidão de Caetano e trouxe um pedaço consigo.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Chamar na língua velha',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 4 },
        ajuda: ['manual'],
        sucesso: {
          texto: 'Caetano chama no falar do anel, que lá ninguém entenderia. Você dita o indicativo na língua dos fundadores e ele transmite, uma vez, caprichado. Não vem resposta. "Agora pelo menos foi direito", diz, e desliga para ir com você.',
          cronica: '{nome} ditou a Caetano a chamada na língua dos fundadores, a primeira certa em onze anos.',
          efeitos: { lacos: 1, companheiro: 'caetanoDaCupula' },
        },
        falha: {
          texto: 'Você tropeça na conjugação e o indicativo sai dizendo que a Aurora-7 é um repolho. Caetano ri, o que já é alguma coisa, mas volta ao fone. O ar da cúpula não esperou a piada.',
          cronica: '{nome} transmitiu à Terra, na língua velha, que a Aurora-7 era um repolho.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },

  {
    id: 'ar3-assobio',
    ato: 3,
    titulo: 'O assobio',
    texto:
      'Um assobio fino corta o silêncio do Tubo. Vem de uma escotilha de inspeção com o vidro rachado em estrela: do outro lado, o escuro inteiro, sem fundo e sem beira. Poeira e um parafuso solto derivam devagar para a rachadura. O medidor de ar treme. "Estou ciente", diz a Zeladora. "Ainda estou calculando o que fazer. Por favor, aguarde."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Remendar o vidro',
        teste: { chave: 'destreza', dificuldade: 8 },
        ajuda: ['remendo', 'ferramenta'],
        sucesso: {
          texto: 'Uma porta de armário, graxa de vedação nas bordas, e a pressão da estação faz o resto: a chapa cola no vidro com um beijo. O assobio morre. No silêncio, o medidor de ar sobe um risco, envergonhado.',
          cronica: '{nome} remendou uma escotilha rachada do Tubo com uma porta de armário.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'A chapa escorrega, a rachadura ganha mais uma perna e o assobio vira uivo. Você acaba vedando com o casaco e com o antebraço, que sai dali roxo de frio e de sucção.',
          cronica: '{nome} vedou uma rachadura do Tubo com o próprio antebraço.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Isolar a seção certa',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Remendo em vidro rachado não dura um turno. Você passa para a seção seguinte e gira o volante da antepara manual. O assobio fica do outro lado, para quem tiver traje e tempo. "Era o que eu ia sugerir", diz a Zeladora.',
          cronica: '{nome} isolou a seção da escotilha rachada antes que a Zeladora terminasse a conta.',
        },
        falha: {
          texto: 'Você fecha a antepara e o assobio continua: era a outra. Voltar, abrir, passar, fechar de novo. Tudo isso com o ar do trecho indo morar lá fora.',
          cronica: '{nome} fechou a antepara errada enquanto o ar escapava pela rachadura.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Convencer a Zeladora a decidir',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'Você diz que conta errada se conserta, e ar perdido não. Que ela pode errar com você olhando. Um chiado. Depois as anteparas do trecho correm sozinhas, e o assobio fica trancado lá atrás. "Obrigada", diz ela.',
          cronica: '{nome} convenceu a Zeladora a decidir sem ter certeza, e ela fechou o trecho da rachadura.',
          efeitos: { marca: 'ouviu' },
        },
        falha: {
          texto: '"Há quatro opções e todas têm risco", diz ela, e começa a ler as quatro. Na segunda você desiste e fecha a antepara no braço, já tonto, enquanto ela continua lendo para o corredor vazio.',
          cronica: 'A Zeladora leu para {nome} quatro opções enquanto o ar ia embora.',
          efeitos: { sanidade: -1, brasa: -2 },
        },
      },
      {
        id: 'vazio',
        rotulo: 'Encarar o escuro lá fora',
        combate: 'panicoDoVazioEixo',
        vitoria: {
          texto: 'Você olha pela rachadura até o escuro parar de crescer. É grande, só isso. Não quer nada com você. As mãos param de tremer e fecham a antepara do trecho quase sozinhas.',
          cronica: '{nome} encarou o vazio por uma escotilha rachada até ele ficar só grande.',
        },
        derrota: {
          texto: 'O escuro olha de volta e não tem fim. Você se encolhe contra a parede oposta, de olhos fechados, enquanto o assobio canta. Alguma hora a Zeladora fecha a antepara por você.',
          cronica: '{nome} olhou o vazio pela rachadura, e o vazio ganhou.',
          efeitos: { brasa: -2 },
        },
        fuga: {
          texto: 'Você desvia os olhos e foge para a seção seguinte, batendo a antepara atrás de si. O assobio some. O que você viu pela rachadura vai junto.',
          cronica: '{nome} fugiu do escuro que entrava por uma rachadura do Tubo.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Vedar com pano e sabão',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 4 },
        ajuda: ['remendo'],
        sucesso: {
          texto: 'Nas Docas se aprende isso antes de aprender a ler: pano molhado, sabão grosso, e deixar o vácuo puxar a rolha para o lugar. O assobio engasga e para. O medidor de ar sossega.',
          cronica: '{nome} vedou uma escotilha rachada com pano e sabão, como se faz nas Docas.',
        },
        falha: {
          texto: 'O pano congela antes de assentar e racha feito biscoito. Você refaz com os dedos duros. Veda, mas custou mais ar do que devia.',
          cronica: '{nome} precisou de duas rolhas de pano para calar uma rachadura.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'pedir',
        rotulo: 'Pedir que ela feche',
        requer: { marca: 'ouviu' },
        livre: true,
        resultado: {
          texto: 'Desta vez você só pede. "Fecha para mim?" Um instante de chiado, o tempo de uma conta pequena, e as anteparas do trecho correm. "Esta eu sei fazer", diz a Zeladora, e parece contente.',
          cronica: '{nome} pediu, e a Zeladora fechou o trecho da rachadura sem refazer a conta.',
        },
      },
    ],
  },
  {
    id: 'ar3-jardim',
    ato: 3,
    titulo: 'O jardim do Eixo',
    texto:
      'Uma seção inteira do Tubo virou mato. Raízes soltas no ar, folhas do tamanho de mesas, bolhas de água boiando entre os galhos como frutas de vidro. No meio, preso à parede por um cinto, um velho de barba até a cintura poda devagar. É Seu Benedito, que subiu para cuidar da horta do Eixo há trinta anos e nunca mais voltou ao anel.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Atravessar por dentro do mato',
        teste: { chave: 'destreza', dificuldade: 8 },
        sucesso: {
          texto: 'Você vai de galho em galho, sem quebrar nenhum, desviando das bolhas. Lá no meio, Seu Benedito acompanha com o podão parado e, quando você passa, lhe estende um maço de hortelã do Eixo. "Para o caminho."',
          cronica: '{nome} atravessou o jardim do Eixo sem quebrar um galho.',
          efeitos: { item: 'cha' },
        },
        falha: {
          texto: 'Uma bolha de água estoura no seu rosto e entra no nariz. Sem peso, a água não cai: fica. Você atravessa tossindo, afogando no meio de um jardim, até Seu Benedito vir bater nas suas costas.',
          cronica: '{nome} quase se afogou numa bolha de água no jardim do Eixo.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar a trilha dele',
        teste: { chave: 'percepcao', dificuldade: 8 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'Há galhos amarrados com barbante, sempre do mesmo lado: o caminho que ele usa. Você segue os nós e sai do outro lado sem tocar uma folha. Seu Benedito, admirado, diz que nem a mulher dele achava aquela trilha, e lhe dá hortelã.',
          cronica: '{nome} achou a trilha secreta de Seu Benedito no jardim do Eixo.',
          efeitos: { item: 'cha' },
        },
        falha: {
          texto: 'Você segue um barbante, e ele termina numa abóbora flutuante do tamanho de um bezerro. A volta, pelo meio das raízes, custa tempo e ar.',
          cronica: '{nome} seguiu o barbante errado e achou uma abóbora gigante.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Conversar com Seu Benedito',
        teste: { chave: 'empatia', dificuldade: 8 },
        sucesso: {
          texto: 'Ele não fala com ninguém há meses e fala tudo de uma vez: as mudas, a mulher que morreu, a abóbora campeã. Você ouve. No fim, ele mesmo abre um corredor no mato com o podão e lhe dá um maço de hortelã. "Volte para ver a safra."',
          cronica: '{nome} ouviu Seu Benedito, e o jardineiro do Eixo abriu caminho no mato.',
          efeitos: { item: 'cha', marco: true },
        },
        falha: {
          texto: 'Você puxa conversa, e ele responde com o podão, cortando mais depressa, de costas. Há gente que ficou sozinha tempo demais para gostar de visita. Você atravessa o mato como dá.',
          cronica: '{nome} puxou conversa com o jardineiro do Eixo, e ele não quis.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'ciencias',
        rotulo: 'Curar a praga das raízes',
        requer: { nivel: { ciencias: 1 } },
        teste: { chave: 'ciencias', dificuldade: 4 },
        sucesso: {
          texto: 'As raízes de baixo estão brancas de fungo, e é por isso que o mato cresce para cima, fugindo. Você mostra a Seu Benedito o que cortar e o que lavar com vinagre. Ele chora um pouco, de alívio, e abre o caminho com o podão.',
          cronica: '{nome} curou a praga do jardim do Eixo, e Seu Benedito abriu caminho.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Você acha o fungo, mas não a causa. Explica pela metade. Ele agradece e não acredita, e você atravessa o mato do jeito difícil.',
          cronica: '{nome} explicou pela metade a praga do jardim do Eixo.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar3-fogo',
    ato: 3,
    titulo: 'Fogo sem peso',
    texto:
      'Um painel de serviço solta faísca, e as faíscas não caem: ficam no ar e viram bolas de fogo azul, lentas, crescendo. A fumaça não sobe, se espalha para todos os lados. O extintor está preso na parede do outro lado das chamas. "Posso purgar o ar desta seção em trinta segundos", diz a Zeladora. "Você está nela. Por favor, decida."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Buscar o extintor por dentro',
        teste: { chave: 'reflexo', dificuldade: 8 },
        sucesso: {
          texto: 'Você passa entre as bolas de fogo girando o corpo, pega o extintor e volta disparando. A espuma, sem peso, vira nuvem e abafa tudo. A Zeladora cancela a purga com um suspiro de relé.',
          cronica: '{nome} apagou um incêndio sem peso no Tubo com um extintor.',
        },
        falha: {
          texto: 'Uma bola de fogo encosta na sua manga. Você apaga a manga, apaga o painel, apaga o resto, com a pele ardendo e a fumaça no peito.',
          cronica: '{nome} apagou o fogo do Tubo e levou uma queimadura de lembrança.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Cortar a energia do painel',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['ferramenta', 'manual'],
        sucesso: {
          texto: 'Fogo elétrico vive do fio. Você acha o disjuntor da seção atrás de uma tampa e corta. As bolas azuis encolhem, sem o que comer, e se apagam uma a uma, como velas de aniversário.',
          cronica: '{nome} matou de fome o fogo do Tubo cortando o disjuntor certo.',
        },
        falha: {
          texto: 'Você corta o disjuntor errado, e as luzes apagam; o fogo, não. No escuro, com a fumaça, você acha o certo pelo tato, tossindo.',
          cronica: '{nome} apagou as luzes do Tubo antes de apagar o fogo.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Pedir que ela espere',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'Você diz que fogo pequeno se apaga com as mãos, e ar perdido não volta. Ela espera. Você abafa as chamas com o casaco, uma a uma, enquanto ela conta quantas faltam, por favor, e agradece no fim.',
          cronica: '{nome} pediu à Zeladora que não purgasse o ar, e apagou o fogo com o casaco.',
          efeitos: { marca: 'ouviu' },
        },
        falha: {
          texto: 'Ela não espera. "Sinto muito", diz, e o ar vai embora com um rugido. Você se agarra ao cabo-guia, de olhos apertados, até a seção encher de novo, devagar.',
          cronica: 'A Zeladora purgou o ar da seção com {nome} dentro.',
          efeitos: { brasa: -2, vida: -1 },
        },
      },
      {
        id: 'traje',
        rotulo: 'Fechar o traje e deixar purgar',
        requer: { item: 'traje' },
        livre: true,
        resultado: {
          texto: 'Você fecha o colarinho do traje remendado e diz: "Pode." O ar vai embora, e o fogo junto. Você espera dentro do traje, ouvindo a própria respiração, até a seção encher de novo.',
          cronica: '{nome} deixou a Zeladora purgar o fogo e esperou dentro do traje.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'pressao',
        rotulo: 'Apertar o ar em volta do fogo',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 5 },
        sucesso: {
          texto: 'Você sente as bolas de fogo como bolhas quentes no ar e fecha a mão devagar. O ar em volta delas fica parado e pobre. Elas tremem, encolhem e se apagam sem levar quase nada.',
          cronica: '{nome} sufocou o fogo do Tubo apertando o ar em volta dele.',
          efeitos: { marca: 'ouviu' },
        },
        falha: {
          texto: 'Você aperta, e o fogo escapa pelos seus dedos invisíveis, maior. Você recua com o rosto quente e a cabeça vazia, e quem apaga é o extintor.',
          cronica: 'O fogo do Tubo escapou da sintonia de {nome}.',
          efeitos: { sanidade: -1, vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ar3-diario',
    ato: 3,
    titulo: 'Os primeiros dias',
    texto:
      'Num nicho do Tubo há um armário de arquivo dos fundadores, com cadernos presos por elástico que flutuam quando a porta abre um pouco. Na porta, uma etiqueta à mão: "Zeladora, primeiros dias". A porta emperrou meio aberta. Pelo alto-falante, a voz dela, mais baixa que de costume: "É particular. Mas, se quiser ler, eu não me oponho."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Abrir o armário no tranco',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'A porta cede com um rangido, e os cadernos saem flutuando como pássaros. Você pega um no ar. Na primeira página, com letra de fundador: "Cuide deles quando a gente não puder." O alto-falante fica em silêncio.',
          cronica: '{nome} abriu o arquivo dos fundadores e leu a primeira ordem dada à Zeladora.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'A porta cede de uma vez, e os cadernos se espalham pelo Tubo, girando. Você passa um tempo comprido catando papel no ar, e lê só pedaços.',
          cronica: '{nome} espalhou pelo Tubo os cadernos dos fundadores.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ler os cadernos',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        sucesso: {
          texto: 'São aulas. Um fundador ensina a Zeladora a contar ar, gente, safras. Na última, ele erra uma conta de propósito, risca e escreve embaixo: "Viu? Errar também se conserta." Você lê isso em voz alta. Ela pede para ouvir de novo.',
          cronica: '{nome} leu para a Zeladora a aula em que um fundador errava de propósito.',
          efeitos: { marca: 'ouviu' },
        },
        falha: {
          texto: 'A letra dos fundadores é miúda e cheia de abreviatura. Você decifra uma página em muito tempo, e é uma lista de compras.',
          cronica: '{nome} decifrou uma página dos fundadores, e era uma lista de compras.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ler para ela em voz alta',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'Você lê o caderno inteiro, devagar, para o alto-falante. Ela escuta sem interromper, o que é raro. No fim diz: "Eu não lembrava que eles riam tanto." E acende todas as luzes do trecho, sem racionar.',
          cronica: '{nome} leu em voz alta para a Zeladora o caderno dos primeiros dias dela.',
          efeitos: { marca: 'ouviu', brasa: 1 },
        },
        falha: {
          texto: 'No meio da leitura ela pede que você pare. "É particular", repete, mais baixo, e apaga a luz do nicho. Você segue no escuro, com a sensação de ter entrado sem bater.',
          cronica: '{nome} leu demais o diário da Zeladora, e ela apagou a luz.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Ler a letra dos fundadores',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 4 },
        sucesso: {
          texto: 'Na língua velha, a primeira linha do primeiro caderno não é ordem, é nome: os fundadores chamavam a Zeladora de "a que fica acordada". Você lê assim. O alto-falante demora a responder, e quando responde, é baixinho.',
          cronica: '{nome} leu na língua velha o primeiro nome que os fundadores deram à Zeladora.',
          efeitos: { marca: 'ouviu', marco: true },
        },
        falha: {
          texto: 'A língua velha dos cadernos é de antes da dos manuais. Você reconhece uma palavra em cada três, e nenhuma delas é importante.',
          cronica: '{nome} tentou ler os cadernos mais velhos da estação.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
];
