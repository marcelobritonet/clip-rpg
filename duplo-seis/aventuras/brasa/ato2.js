/**
 * A Última Brasa, Ato 2: A Mata Velha. Floresta antiga, ruínas do povo de
 * antes, viajantes perdidos e os primeiros sinais da Longa Noite. Entardecer.
 */

export const itens = {};

export const companheiros = {
  nunoCartografo: {
    nome: 'Nuno',
    quem: 'cartógrafo que se perdeu dentro do próprio mapa, bom de conta e de régua',
    niveis: { inteligencia: 2, percepcao: 1 },
  },
  dalvaPeregrina: {
    nome: 'Irmã Dalva',
    quem: 'peregrina de hábito cinza que sobe ao Farol para pagar uma promessa',
    niveis: { fe: 2, vontade: 1 },
  },
};

export const inimigos = {
  ato2VultoDaBeira: {
    nome: 'Vulto da beira da luz',
    ataque: 2,
    defesa: 2,
    vida: 4,
    arma: 0,
    armadura: 0,
    resistencia: 0,
    reflexo: 1,
    vontade: 2,
    fe: 0,
    mental: true,
  },
};

export const cenas = [
  {
    id: 'ato2-labirinto',
    ato: 2,
    titulo: 'O labirinto de espinheiro',
    texto:
      'A trilha entra numa sebe de espinheiro mais alta que um cavalo, plantada em voltas por gente que já não existe. Dez curvas depois, todas as paredes são iguais e a luz entra de lado, cor de mel. De algum lugar lá dentro, uma voz de homem conta passos em voz alta, erra a conta e recomeça.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Abrir caminho no braço',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Você escolhe uma direção e não aceita outra. Galho por galho, a sebe cede. Depois do terceiro rombo há um homem magro, de tinteiro na cintura, que segue você para fora sem fazer pergunta.',
          cronica: '{nome} atravessou o labirinto de espinheiro em linha reta e tirou de lá um cartógrafo.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'O espinheiro é mais velho e mais teimoso que você. Uma hora depois, você sai pelo mesmo lugar por onde entrou, de mãos rasgadas, e contorna a sebe inteira por fora.',
          cronica: '{nome} brigou com uma sebe de espinheiro e perdeu.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Guardar cada curva',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['mapa'],
        sucesso: {
          texto: 'Um ninho vazio, um galho partido, uma pedra com musgo de um lado só. Você guarda tudo. Acha o homem que contava passos, um cartógrafo envergonhado, e desfaz o caminho de volta sem errar uma curva.',
          cronica: '{nome} lembrou o caminho de volta do labirinto de espinheiro e trouxe junto Nuno, o cartógrafo.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'O ninho vazio aparece três vezes. Ou são três ninhos. Quando a sebe enfim solta você, é do lado errado, e a voz que contava passos ficou lá dentro, recomeçando.',
          cronica: '{nome} se perdeu no labirinto de espinheiro e saiu sem saber por onde.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
        critico: {
          texto: 'Você lembra até o que o cartógrafo esqueceu. Na saída, ele tira da bolsa um mapa antigo da mata, corrige três trilhas enquanto você dita e entrega a folha. "Fica com quem sabe usar."',
          cronica: '{nome} saiu do labirinto de espinheiro com um cartógrafo e com o mapa dele.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1, item: 'mapa' },
        },
      },
      {
        id: 'fe',
        rotulo: 'Seguir o calor da brasa',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você fecha os olhos e deixa a lanterna escolher. Ela esquenta para um lado, esfria para o outro. O cartógrafo perdido ouve você passar, agarra a ponta do seu casaco, e a brasa leva os dois para fora.',
          cronica: '{nome} saiu do labirinto de olhos fechados, guiando um cartógrafo pela ponta do casaco.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'A lanterna fica morna para todos os lados. Você anda de olhos fechados até dar com o rosto no espinheiro, e sai muito depois, sozinho, por um buraco de raposa.',
          cronica: '{nome} confiou na brasa dentro do labirinto, e a brasa não respondeu.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Marcar o caminho com nós',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'Um nó de capim a cada curva, sempre do lado esquerdo. Coisa de criança, e funciona. Você chega ao cartógrafo, que olha os nós como quem vê magia, e os dois voltam lendo o seu rastro.',
          cronica: '{nome} venceu o labirinto de espinheiro com nós de capim e saiu de lá com um cartógrafo.',
          efeitos: { companheiro: 'nunoCartografo', lacos: 1 },
        },
        falha: {
          texto: 'O capim daqui se desmancha na mão. Metade dos nós some antes da volta. Você sai, mas tarde, e sem ter chegado até a voz que contava passos.',
          cronica: '{nome} marcou o labirinto com nós que não duraram.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-trava',
    ato: 2,
    titulo: 'A porta sem maçaneta',
    texto:
      'O vento do entardecer vem frio e a chama da lanterna se deita. Entre as raízes de uma figueira há uma casa de pedra do povo antigo, quase inteira, com uma porta lisa: nem maçaneta, nem fechadura, só espirais gravadas e a marca funda de uma mão. Um canto do telhado caiu faz tempo. Lá dentro o ar está parado.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Entrar pelo telhado caído',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'A figueira serve de escada e a parede tem onde pôr o pé. Você desce por dentro, leve, e passa a pior hora do vento sentado no seco, com a brasa quieta entre os joelhos.',
          cronica: '{nome} entrou na casa do povo antigo pelo telhado e esperou o vento passar.',
        },
        falha: {
          texto: 'Uma pedra solta, um galho que não era galho. Você cai de mau jeito do lado de fora e atravessa o vento encolhido contra a parede, com o corpo em volta da lanterna.',
          cronica: '{nome} caiu do telhado de uma ruína e protegeu a brasa com as costelas.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Procurar a trava escondida',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'Uma das espirais gira para o lado contrário das outras. Você aperta o centro dela e a pedra desliza sem um rangido. Dentro há um banco, lenha seca de cem anos e nenhum vento.',
          cronica: '{nome} achou a trava secreta da casa do povo antigo e abrigou a brasa do vento.',
          efeitos: { brasa: 1, marco: true },
        },
        falha: {
          texto: 'Você aperta espiral por espiral até a luz faltar. A porta guarda o segredo. O vento passa por cima de você e leva um pouco da brasa junto.',
          cronica: '{nome} não achou como abrir a porta do povo antigo.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Deixar a mão na pedra',
        teste: { chave: 'vontade', dificuldade: 7 },
        sucesso: {
          texto: 'A marca da mão é gelada e o frio sobe pelo braço até o ombro. Você fica. No último instante suportável, a pedra amorna, estala e abre. Quem fez a porta queria saber quem tinha paciência.',
          cronica: '{nome} abriu a porta do povo antigo sem fazer nada além de ficar.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'O frio chega ao cotovelo e traz junto uma tristeza alheia, de gente que fechou esta porta pela última vez. Você puxa a mão. A porta continua porta.',
          cronica: '{nome} pôs a mão na porta do povo antigo e sentiu uma tristeza que não era sua.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'historia',
        rotulo: 'Ler as espirais',
        requer: { nivel: { historia: 1 } },
        teste: { chave: 'historia', dificuldade: 3 },
        sucesso: {
          texto: 'É uma saudação: "Entra quem pede, sai quem agradece." Você pede, com as palavras antigas, e a porta abre. Na parede de dentro, alguém desenhou o Farol aceso e uma fila de gente subindo.',
          cronica: '{nome} leu a saudação do povo antigo e viu, numa parede, o Farol de outros tempos.',
          efeitos: { brasa: 1, marco: true },
        },
        falha: {
          texto: 'A língua é mais velha do que os livros que você leu. Você pede errado, três vezes. A porta não se ofende, mas também não abre, e o vento não espera.',
          cronica: '{nome} tentou falar a língua do povo antigo com uma porta.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'encanto',
        rotulo: 'Acordar o encanto da porta',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 4 },
        sucesso: {
          texto: 'O encanto dorme, mas vive. Você sopra nele como se sopra uma brasa e a porta abre devagar, satisfeita de ainda servir. Lá dentro, o ar guarda um resto de calor muito antigo.',
          cronica: '{nome} acordou o encanto de uma porta do povo antigo.',
          efeitos: { brasa: 1, marco: true },
        },
        falha: {
          texto: 'O encanto acorda assustado e fecha mais. Por um instante você sente a porta olhando de volta, e o olhar não tem nada de boas-vindas.',
          cronica: '{nome} assustou o encanto de uma porta antiga.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-picada',
    ato: 2,
    titulo: 'A picada',
    texto:
      'Você apoia a mão num tronco caído para saltar um córrego e o tronco morde. Uma cobra fina, cor de folha seca, some na serrapilheira antes do susto acabar. Dois furos no pulso. A mão começa a formigar, depois o braço, e as árvores em volta ganham uma borda que não tinham.',
    abordagens: [
      {
        id: 'saude',
        rotulo: 'Aguentar o veneno andando',
        teste: { chave: 'saude', dificuldade: 6 },
        sucesso: {
          texto: 'Você amarra o braço, bebe água e anda. Sua frio, vomita uma vez, anda mais. Quando o sol encosta nas copas, o formigamento já desceu para os dedos e ficou lá, pequeno.',
          cronica: '{nome} levou uma picada de cobra na Mata Velha e seguiu andando até o veneno desistir.',
        },
        falha: {
          texto: 'As pernas dobram antes de a febre passar. Você acorda de cara no musgo, sem saber quanto dormiu, com o braço inchado e a lanterna caída de lado.',
          cronica: '{nome} desabou de febre depois de uma picada de cobra.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Lembrar qual folha cura',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['livro', 'remedio'],
        sucesso: {
          texto: 'Folha larga, avesso prateado, nasce sempre perto de onde a cobra mora. Está ali, a três passos. Você mastiga, cospe na ferida e amarra. Em pouco tempo as árvores voltam a ter o contorno certo.',
          cronica: '{nome} tratou uma picada de cobra com a folha certa.',
        },
        falha: {
          texto: 'Avesso prateado ou avesso roxo? Você escolhe o roxo. A folha não faz mal nenhum, nem bem. O veneno segue o caminho dele enquanto você mastiga mato.',
          cronica: '{nome} mastigou a folha errada contra o veneno de uma cobra.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Acalmar o coração',
        teste: { chave: 'vontade', dificuldade: 7 },
        sucesso: {
          texto: 'Medo faz o sangue correr, e sangue correndo leva o veneno. Você senta, respira contando até quatro e obriga o coração a ir devagar. O veneno se cansa antes de chegar ao ombro.',
          cronica: '{nome} venceu o veneno de uma cobra ficando mais calmo do que ela.',
        },
        falha: {
          texto: 'Você conta até quatro e o coração conta até cem. As bordas das árvores se mexem. Uma delas diz o seu nome com muita clareza antes de a febre baixar.',
          cronica: '{nome} delirou de veneno e ouviu uma árvore chamar seu nome.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Sangrar e tratar a ferida',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        sucesso: {
          texto: 'Corte pequeno, sucção, cinza fria por cima. Trabalho limpo. Sobra folha prateada para uma pasta, que você guarda num trapo: alguém mais vai precisar dela nesta mata.',
          cronica: '{nome} tratou a própria picada de cobra e ainda saiu com um unguento.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'A mão que treme é a mesma que segura a lâmina. O corte sai fundo demais. O veneno vai embora, mas leva um pouco de sangue de brinde.',
          cronica: '{nome} tratou a própria picada com a mão tremendo.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'ervas',
        rotulo: 'Gastar o maço de ervas',
        requer: { item: 'ervas' },
        livre: true,
        resultado: {
          texto: 'Tem de tudo no maço, até o que serve. Você gasta as ervas inteiras num emplastro, e o formigamento recua antes de passar do cotovelo. O maço acabou. O braço ficou.',
          cronica: '{nome} gastou o maço de ervas inteiro numa picada de cobra.',
          efeitos: { semItem: 'ervas' },
        },
      },
    ],
  },
  {
    id: 'ato2-corda',
    ato: 2,
    titulo: 'A meleira no carvalho',
    texto:
      'Num carvalho do tamanho de uma igreja, a seis homens de altura, uma velha está sentada num galho, entre abelhas, com um pote de mel no colo. A escada dela jaz no chão em dois pedaços, ao lado de um rolo de corda. "Não tenha pressa", ela diz lá de cima. "Mas a noite tem, e eu não enxergo no escuro."',
    abordagens: [
      {
        id: 'arremesso',
        rotulo: 'Lançar a corda até ela',
        teste: { chave: 'arremesso', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'A corda sobe girando, passa por cima do galho e cai no colo dela, ao lado do mel. A velha dá um nó de quem já amarrou muita coisa na vida e desce devagar, resmungando com as abelhas.',
          cronica: '{nome} lançou uma corda a seis homens de altura e desceu Sabina, a meleira, do carvalho.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A corda sobe e volta, sobe e volta. Na décima vez a velha perde a paciência, abraça o tronco e desce sozinha, em meia hora de sustos. "Obrigada pela companhia", diz, seca.',
          cronica: '{nome} errou dez lances de corda enquanto uma velha descia sozinha do carvalho.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'A corda acerta o galho de primeira e ainda dá uma volta sozinha. "Foi sorte", diz a velha, já descendo. "Mas sorte também se agradece." Ela enche a sua mão de folhas de melissa.',
          cronica: '{nome} acertou o galho de Sabina, a meleira, no primeiro lance e ganhou chá de melissa.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        desastre: {
          texto: 'A corda entra direto na colmeia. O que acontece depois é rápido e tem muitas asas. A velha desce sozinha no meio da confusão, e ainda é ela quem passa barro nas suas ferroadas.',
          cronica: '{nome} acertou uma colmeia com uma corda e foi socorrido por quem ia socorrer.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Emendar a escada',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Os dois pedaços se encaixam em bisel, e cipó molhado aperta quando seca. Você calça a emenda com uma cunha e sobe primeiro, para provar. A velha desce atrás, degrau por degrau, sem derramar o mel.',
          cronica: '{nome} consertou uma escada com cipó e cunha e desceu Sabina, a meleira, do carvalho.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A emenda aguenta o seu peso na subida e desiste na descida. Você chega ao chão antes do previsto. A velha, lá em cima, suspira e começa a descer pelo tronco por conta própria.',
          cronica: '{nome} caiu de uma escada que tinha acabado de consertar.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Guiar a descida pela voz',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: '"Pé esquerdo, um palmo abaixo. Agora o nó grande, à direita." Ela confia na sua voz como num corrimão. No chão, alisa a saia, olha bem para você e tira do avental um saquinho de melissa.',
          cronica: '{nome} desceu Sabina, a meleira, do carvalho só com a voz, e ganhou chá de melissa.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: '"Esquerdo. Não, o outro esquerdo." Ela trava no meio do tronco e não ouve mais ninguém. Você sobe para buscá-la, e descem os dois, lentos, com a tarde indo embora.',
          cronica: '{nome} confundiu esquerda e direita e precisou subir no carvalho atrás de uma velha.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'abelhas',
        rotulo: 'Assentar as abelhas',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        sucesso: {
          texto: 'Fumaça de folha verde e um zumbido baixo, no tom delas. O enxame se recolhe. Sem abelha em volta, a velha desce pelo tronco como uma menina, e paga a gentileza com melissa e conselhos.',
          cronica: '{nome} acalmou um enxame para Sabina, a meleira, descer do carvalho.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'As abelhas daqui têm outro sotaque. Três ferroadas depois, você desiste do zumbido, e a velha desce assim mesmo, rindo de você o tronco inteiro.',
          cronica: '{nome} tentou conversar com abelhas da Mata Velha e levou três ferroadas.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-salteador',
    ato: 2,
    titulo: 'A faca e o mascate',
    texto:
      'Numa curva da trilha, um mascate está de joelhos ao lado da carroça de mão, com as fivelas da mochila já abertas. Atrás dele, um homem de capuz segura uma faca e olha para todos os lados menos para a faca. É jovem, está magro e ainda não viu você. A lâmina treme um pouco.',
    abordagens: [
      {
        id: 'golpe',
        rotulo: 'Apagar o rapaz num golpe',
        teste: { chave: 'ataqueCorporal', dificuldade: 7 },
        sucesso: {
          texto: 'Um passo, o punho no ponto certo atrás da orelha. O rapaz desaba como roupa sem dono, respirando. O mascate amarra as mãos dele com fita de cetim e põe uma lamparina nas suas, por gratidão.',
          cronica: '{nome} desmaiou um salteador com um golpe só, sem machucar mais do que o necessário.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'O golpe pega no capuz. O rapaz grita, corta o ar às cegas e acerta o seu antebraço antes de fugir pela mata com a mochila do mascate debaixo do braço.',
          cronica: '{nome} errou o golpe num salteador e levou um corte no braço.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Reparar no medo dele',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: 'Quem segura faca daquele jeito nunca usou uma. Você diz isso em voz alta, calmo, e oferece metade do seu pão. O rapaz olha o pão, olha a faca e escolhe o pão. O mascate, pasmo, lhe dá uma lamparina.',
          cronica: '{nome} desarmou um salteador com meio pão.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'Você diz que ele não tem coragem de usar a faca. Era verdade até você dizer. Ele avança para provar o contrário, erra feio e foge, mas o susto e um arranhão ficam com você.',
          cronica: '{nome} duvidou da coragem de um salteador na hora errada.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Propor um acordo aos dois',
        teste: { chave: 'presenca', dificuldade: 7 },
        ajudantes: [{ nome: 'o mascate', nivel: 1 }],
        sucesso: {
          texto: 'Você fala alto, de mãos à mostra. O mascate precisa de quem puxe a carroça até o vale; o rapaz precisa comer. Em dez minutos os dois discutem salário. A lamparina que sobra na carroça vem para você.',
          cronica: '{nome} transformou um assalto num contrato de trabalho.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'O rapaz ouve "acordo" e entende "armadilha". Agarra a mochila e some entre as árvores. Você ajuda o mascate a catar do chão o que sobrou, e a tarde encurta nisso.',
          cronica: '{nome} propôs um acordo a um salteador, que preferiu a mochila.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Baixar o capuz e dizer seu nome',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'O rapaz já ouviu as histórias. Larga a faca como se queimasse e pede desculpas a você, nem olha o mascate. O mascate também ouviu: deixa uma lamparina no chão, de longe, e se afasta ligeiro.',
          cronica: 'O nome de {nome} bastou para desarmar um salteador e para assustar a vítima também.',
          efeitos: { item: 'lamparina', sanidade: -1 },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Sumir com o mascate',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 3 },
        sucesso: {
          texto: 'Você chega por trás da carroça sem estalar um graveto e puxa o mascate pela gola para o mato. Quando o rapaz olha de novo, está assaltando uma trilha vazia. Desiste, confuso. O mascate lhe dá uma lamparina e um abraço.',
          cronica: '{nome} roubou a vítima de um salteador bem debaixo do capuz dele.',
          efeitos: { lacos: 1, item: 'lamparina' },
        },
        falha: {
          texto: 'Um graveto. Sempre tem um graveto. O rapaz se vira, vê dois onde havia um, e foge levando o que consegue carregar. A faca passa perto demais na saída.',
          cronica: '{nome} pisou num graveto atrás de um salteador.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-costume',
    ato: 2,
    titulo: 'A mesa na clareira',
    texto:
      'Numa clareira há uma mesa de pedra posta: cuias, pão escuro, uma jarra. Três pessoas de máscara de casca estão sentadas em silêncio, e o quarto lugar está vazio, virado para você. Ninguém acena. Ninguém come. A mais velha tem as mãos pousadas na mesa, de palmas para cima, e espera alguma coisa que você deveria saber.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Servir sem derramar gota',
        teste: { chave: 'destreza', dificuldade: 7 },
        sucesso: {
          texto: 'A jarra é pesada e as cuias são rasas. Você enche as quatro até a borda, a da velha primeiro, sem perder uma gota. As máscaras se inclinam. Na saída, alguém pendura um manto de lã no seu ombro.',
          cronica: '{nome} serviu a mesa do povo da mata sem derramar uma gota e saiu de manto novo.',
          efeitos: { item: 'manto', lacos: 1 },
        },
        falha: {
          texto: 'O caldo escorre pela pedra até o colo da mais velha. Ninguém diz nada, e isso é o pior. As três se levantam, recolhem as cuias e deixam você sozinho com uma mesa vazia.',
          cronica: '{nome} derramou o caldo no colo da anciã do povo da mata.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Lembrar o costume da mata',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        ajuda: ['livro'],
        sucesso: {
          texto: 'Na mata, o convidado serve do mais velho ao mais novo, bebe por último e deixa na mesa uma coisa sua. Você deixa um botão do casaco. A velha tira o próprio manto e o põe nos seus ombros, sem uma palavra.',
          cronica: '{nome} sentou à mesa do povo da mata, soube o que fazer e saiu com o manto da anciã.',
          efeitos: { item: 'manto', lacos: 1 },
        },
        falha: {
          texto: 'Você agradece em voz alta antes do primeiro gole. As máscaras se viram todas de uma vez. Na mata, palavra antes da comida chama o que escuta. Eles saem depressa, olhando as árvores, e você também olha.',
          cronica: '{nome} falou antes do primeiro gole à mesa do povo da mata.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Pôr a brasa no meio da mesa',
        teste: { chave: 'fe', dificuldade: 6 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você pousa a lanterna entre as cuias e abre a portinhola. As três máscaras se chegam ao calor como a um altar. Depois, cada uma toca a sua testa com dois dedos. Você não conhece a reza, mas reconhece uma bênção.',
          cronica: '{nome} repartiu o calor da brasa com o povo da mata e foi abençoado.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A portinhola aberta deixa o vento entrar. A brasa empalidece, as máscaras recuam, e você fecha a lanterna com as mãos tremendo, sem saber se ofendeu alguém ou se foi avisado de alguma coisa.',
          cronica: '{nome} abriu a lanterna diante do povo da mata e quase perdeu a brasa.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'flauta',
        rotulo: 'Tocar para a mesa',
        requer: { item: 'flauta' },
        livre: true,
        resultado: {
          texto: 'Você toca a cantiga de Vau-do-Sino, baixinho. A mais nova tira a máscara para ouvir melhor: é uma menina. Pede a flauta com os olhos. Você dá. Ela deixa no seu lugar um manto de lã e um sorriso com dois dentes faltando.',
          cronica: '{nome} trocou uma flauta de osso por um manto e pelo sorriso de uma menina da mata.',
          efeitos: { semItem: 'flauta', item: 'manto', lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ato2-confissao',
    ato: 2,
    titulo: 'Os peregrinos em círculo',
    texto:
      'Quatro peregrinos descansam em volta de um marco de pedra que eles juram já ter passado três vezes hoje. O guia, um homem de sorriso fácil chamado Jerônimo, culpa a mata, que "muda de lugar". Uma mulher de hábito cinza, Irmã Dalva, olha para ele sem piscar. Todos têm lama até o joelho. As botas de Jerônimo estão limpas.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Puxar a marcha você mesmo',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'Você escolhe o lado em que o sol morre e anda, com a mochila do mais velho nas costas, sem aceitar parada. Antes do escuro o grupo pisa a estrada de pedra. Irmã Dalva avisa que daqui em diante sobe com você.',
          cronica: '{nome} tirou quatro peregrinos da mata no fôlego, sem guia, e ganhou a companhia de Irmã Dalva.',
          efeitos: { lacos: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'A mochila do velho pesa como o velho. No meio da subida o seu fôlego acaba, e é o grupo que espera por você. Jerônimo oferece água, muito gentil, e retoma a frente.',
          cronica: '{nome} quis guiar os peregrinos no fôlego e ficou sem fôlego.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Mostrar as botas do guia',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: {
          texto: 'Bota limpa conhece caminho seco. Você aponta, e o grupo inteiro olha para baixo. Jerônimo indica a trilha certa sem levantar os olhos. Irmã Dalva pega o cajado: "Guia eu já tive. Vou com quem enxerga."',
          cronica: '{nome} desmascarou um guia pelas botas limpas e ganhou a companhia de Irmã Dalva.',
          efeitos: { lacos: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'Jerônimo percebe o seu olhar antes de você perceber qualquer coisa. "Perdeu algo, amigo?" O grupo ri, sem graça. Você segue sozinho, e o marco de pedra ainda passa por você mais uma vez.',
          cronica: '{nome} desconfiou de um guia e andou em círculo do mesmo jeito.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'intimidacao',
        rotulo: 'Arrancar a verdade do guia',
        teste: { chave: 'intimidacao', dificuldade: 7 },
        ajudantes: [{ nome: 'Irmã Dalva', nivel: 1 }],
        sucesso: {
          texto: 'Você chega perto, fala baixo e conta nos dedos as voltas que ele deu. No terceiro dedo, Jerônimo confessa: cobra por dia, então estica os dias. De castigo, mostra o atalho do córrego seco. Irmã Dalva resolve seguir com você.',
          cronica: '{nome} arrancou a confissão de um guia desonesto e ganhou um atalho pela mata.',
          efeitos: { lacos: 1, marco: true, brasa: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'Jerônimo se encolhe, chora, chama você de bruto, e os peregrinos ficam com pena do homem errado. Você vai embora com quatro pares de olhos nas costas.',
          cronica: '{nome} apertou um guia desonesto e saiu como o vilão da história.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Refazer o trajeto do dia',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'Cinza de três fogueiras, todas do grupo, todas a cem passos do marco. Você mostra uma por uma. Diante da terceira, Jerônimo confessa sem ninguém levantar a voz e entrega o atalho do córrego seco. Irmã Dalva segue com você.',
          cronica: '{nome} provou com três fogueiras que um guia andava em círculo de propósito.',
          efeitos: { lacos: 1, marco: true, brasa: 1, companheiro: 'dalvaPeregrina' },
        },
        falha: {
          texto: 'As pegadas de quatro peregrinos andando em círculo o dia inteiro formam um desenho bonito e inútil. Você se perde nele por um bom tempo.',
          cronica: '{nome} seguiu pegadas em círculo até cansar.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato2-baixada',
    ato: 2,
    titulo: 'A baixada do ar parado',
    texto:
      'A trilha desce para uma baixada onde nada se mexe. Uma névoa cinzenta cobre o chão até a altura do peito, e dentro dela os passarinhos estão caídos, dormindo de olhos abertos. Do outro lado, a duzentos passos, a trilha sobe de novo. A névoa tem um cheiro doce e, bem no fundo, parece cochichar.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Atravessar sem respirar',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'Um fôlego fundo na borda e duzentos passos largos. No cento e cinquenta o peito arde, no cento e oitenta a vista escurece. Você sai do outro lado e bebe o ar limpo como água.',
          cronica: '{nome} atravessou a baixada da névoa num fôlego só.',
        },
        falha: {
          texto: 'O ar acaba vinte passos antes da névoa. Você respira uma vez só, doce, e termina a travessia ouvindo alguém muito querido pedir que você se deite um pouco.',
          cronica: '{nome} respirou a névoa da baixada e ouviu quem não estava lá.',
          efeitos: { sanidade: -2 },
        },
        critico: {
          texto: 'Sobra fôlego. No meio do caminho você ainda apanha uma sacola que alguém largou na pressa. Do outro lado, abre: um pote de unguento e um bilhete de uma palavra só. "Corra."',
          cronica: '{nome} atravessou a névoa com fôlego de sobra e achou o unguento de alguém mais apressado.',
          efeitos: { item: 'unguento' },
        },
        desastre: {
          texto: 'Você tropeça num passarinho, solta o ar de susto e respira fundo sem querer. Acorda do outro lado, de joelhos ralados, sem lembrar como chegou. A brasa lembra: está menor.',
          cronica: '{nome} perdeu um pedaço da tarde dentro da névoa e nunca soube qual.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Achar o caminho por cima',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        sucesso: {
          texto: 'Névoa pesada escorre para baixo como água. Você lê o terreno: uma raiz, um tronco caído, três pedras altas. Atravessa com a cabeça no ar limpo, pulando de ilha em ilha, sem cochicho nenhum.',
          cronica: '{nome} cruzou a baixada da névoa por cima, de pedra em pedra.',
        },
        falha: {
          texto: 'O tronco caído está podre no meio. Você afunda até o pescoço na névoa, prende o fôlego tarde demais e sai do outro lado com a canela aberta e a cabeça cheia de vozes baixas.',
          cronica: '{nome} caiu de um tronco podre para dentro da névoa.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Respirar e não escutar',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'Você entra andando e respira normal. A névoa oferece sono, depois oferece casa, depois oferece gente que já morreu. Você agradece e recusa tudo, educado, até a outra borda. Ela não insiste.',
          cronica: '{nome} respirou a névoa da Longa Noite e recusou tudo o que ela ofereceu.',
        },
        falha: {
          texto: 'A terceira oferta tem a voz certa. Você senta só um instante. Quando levanta, a luz mudou, os passarinhos são outros e a lanterna pesa menos.',
          cronica: '{nome} sentou um instante dentro da névoa, e o instante foi comprido.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'vento',
        rotulo: 'Chamar um vento',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 4 },
        sucesso: {
          texto: 'Você pede pouco: uma brisa do tamanho de uma porta. Ela vem e abre um corredor limpo na névoa, de borda a borda. Os passarinhos do caminho acordam e saem voando, atrasados para alguma coisa.',
          cronica: '{nome} abriu a névoa da baixada com um vento do tamanho de uma porta.',
        },
        falha: {
          texto: 'O vento vem torto e espalha a névoa em vez de abrir. Agora ela está em toda parte, inclusive em você, e cochicha mais alto.',
          cronica: '{nome} chamou um vento que espalhou a névoa em vez de abrir.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
  {
    id: 'ato2-vulto',
    ato: 2,
    titulo: 'O vulto na beira da luz',
    texto:
      'O sol se foi e sobra um azul comprido entre os troncos. No limite exato da luz da lanterna, um vulto acompanha você: alto, sem rosto, feito de um escuro mais escuro. Quando você para, ele para. Quando você anda, ele chega um palmo mais perto. O ar em volta dele é frio, e ele repete baixinho a última coisa que você disse.',
    abordagens: [
      {
        id: 'lutar',
        rotulo: 'Enfrentar o vulto',
        combate: 'ato2VultoDaBeira',
        vitoria: {
          texto: 'Não há o que acertar, e mesmo assim você acerta. O vulto se desfaz em farrapos de frio que o vento leva. O silêncio depois é enorme. Você fica um tempo parado, esperando o coração voltar.',
          cronica: '{nome} enfrentou um vulto da Longa Noite e o desfez.',
        },
        derrota: {
          texto: 'O frio entra pelos olhos. Por um tempo você não sabe o próprio nome, só o que o vulto repete. Quando passa, ele se foi, e levou alguma coisa que você não consegue lembrar o que era.',
          cronica: '{nome} enfrentou um vulto da Longa Noite e perdeu algo que não sabe nomear.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
        fuga: {
          texto: 'Você corre até o peito queimar. O vulto não corre: apenas está, sempre, um palmo fora da luz. Só some quando a trilha sai de baixo das copas, e a brasa pagou a corrida.',
          cronica: '{nome} correu de um vulto que não precisava correr.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Entender o que ele quer',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Ele repete, ele segue, ele copia o seu passo. Coisa que imita quer ser alguém. Você lhe dá boa-noite, como a um vizinho. O vulto experimenta a palavra, devagar, e fica para trás, repetindo-a para as árvores.',
          cronica: '{nome} deu boa-noite a um vulto da Longa Noite, e o vulto ficou para trás, ensaiando a palavra.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Para entender, você olha demais. Não há fundo naquele escuro. Você desvia os olhos tarde, e passa o resto do trecho ouvindo a própria voz vinda de fora.',
          cronica: '{nome} olhou demais para um vulto da Longa Noite.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Erguer a lanterna e rezar',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você ergue a brasa e diz a reza do sino, a que se diz ao fechar as janelas. A luz não cresce, mas firma. O vulto recua até a primeira árvore, depois até a segunda, e a mata volta a ser só mata.',
          cronica: '{nome} rezou a reza do sino diante de um vulto da Longa Noite, e o vulto recuou.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'As palavras saem na ordem errada, e o vulto as devolve na ordem certa. Ouvir a reza naquela voz é pior do que não rezar. Você anda depressa, de lanterna baixa.',
          cronica: '{nome} errou a reza do sino, e um vulto a corrigiu.',
          efeitos: { sanidade: -2 },
        },
        critico: {
          texto: 'Você reza, e do fundo da mata outra voz responde o segundo verso: alguém, em alguma cabana, fechando as janelas. O vulto se encolhe entre as duas rezas e some. Há mais gente acordada nesta mata.',
          cronica: '{nome} rezou no escuro da Mata Velha, e uma voz desconhecida respondeu o verso seguinte.',
          efeitos: { marco: true, magia: 1 },
        },
      },
      {
        id: 'suporte',
        rotulo: 'Firmar a luz da brasa',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'Você empresta um pouco de si à brasa. A luz cresce um passo para todos os lados, redonda e quieta, e o vulto fica do lado de fora como um cachorro na chuva. Depois desiste.',
          cronica: '{nome} alargou a luz da lanterna até um vulto da Longa Noite desistir.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'A luz cresce e logo encolhe, menor do que antes. O vulto aproveita o palmo que ganhou. Você sente o frio dele na nuca até a trilha clarear.',
          cronica: '{nome} tentou firmar a luz da brasa e a deixou menor.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
    ],
  },
];
