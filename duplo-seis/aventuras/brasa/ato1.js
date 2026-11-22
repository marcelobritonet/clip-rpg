/**
 * A Última Brasa, Ato 1: O Vale. Estrada, sítios, a ponte do pedágio, a feira
 * da encruzilhada e o rio, de dia. Gente e problemas pequenos.
 */

export const itens = {};

export const companheiros = {
  nicaSaltimbanca: {
    nome: 'Nica',
    quem: 'saltimbanca dos mambembes, cai bem e ri alto',
    niveis: { destreza: 2, presenca: 1 },
  },
  gansoAnselmo: {
    nome: 'Anselmo',
    quem: 'ganso branco de gênio ruim, vigia melhor que cachorro',
    niveis: { percepcao: 1, intimidacao: 1 },
  },
};

export const inimigos = {
  gansoAnselmoBravo: {
    nome: 'Anselmo, o ganso',
    ataque: 1,
    defesa: 1,
    vida: 3,
    arma: 0,
    armadura: 0,
    resistencia: 0,
    reflexo: 2,
    vontade: 2,
    fe: 0,
  },
};

export const cenas = [
  {
    id: 'ato1-coelho',
    ato: 1,
    titulo: 'O coelho de dona Zulmira',
    texto:
      'Na beira da estrada, uma velha de avental corre em círculos em volta de um pé de couve. O coelho que ela ia vender na feira roeu o cesto e agora mastiga a horta do vizinho, de olho em você. "É o aluguel do mês", ela arfa. O coelho, gordo e sem remorso, dá mais um pulo para longe.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Correr atrás do coelho',
        teste: { chave: 'agilidade', dificuldade: 6 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Três fintas, um mergulho, e você se levanta com terra na boca e um coelho indignado nos braços. Dona Zulmira paga com o que tem: um saquinho de chá de melissa e um beijo na testa.',
          cronica: '{nome} apanhou o coelho de dona Zulmira num mergulho só.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Você mergulha onde o coelho estava. O coelho já está em outro lugar. Sobra um joelho ralado e a couve, que dona Zulmira leva para a feira no lugar dele.',
          cronica: '{nome} perdeu uma corrida para um coelho gordo.',
          efeitos: { vida: -1 },
        },
        desastre: {
          texto: 'O coelho passa por baixo da cerca. Você passa por cima e cai de costas no cocho dos porcos do vizinho. A lanterna fica de pé por milagre. O vizinho quer explicações demoradas.',
          cronica: '{nome} caiu no cocho dos porcos atrás de um coelho.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar por onde ele foge',
        teste: { chave: 'percepcao', dificuldade: 5 },
        sucesso: {
          texto: 'Há um só buraco na cerca, com pelo preso na tábua. Você deita o cesto ali e bate palmas do outro lado. O coelho se entrega sozinho. Dona Zulmira lhe enfia um saquinho de chá no bolso.',
          cronica: '{nome} fez o coelho de dona Zulmira correr direto para o cesto.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Você vigia o buraco errado com muita atenção. O coelho sai pelo certo. Passam a manhã os três nisso, até ele cansar de vocês e dormir debaixo da carroça.',
          cronica: '{nome} gastou a manhã vigiando o buraco errado de uma cerca.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Esperar com uma couve',
        teste: { chave: 'vontade', dificuldade: 5 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Você se senta no chão com uma folha na mão e não se mexe. Formiga sobe, perna dorme. O coelho vem, desconfiado, e come até dormir no seu colo. Dona Zulmira chora de alívio e lhe dá chá.',
          cronica: '{nome} esperou um coelho vir comer na sua mão, e ele veio.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'O coelho tem mais paciência que você. Quando a perna formiga, você se mexe, e ele recomeça a conta do zero. O sol já vai alto quando dona Zulmira o encurrala com o avental.',
          cronica: '{nome} perdeu um duelo de paciência com um coelho.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Chegar por trás, sem ruído',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 3 },
        sucesso: {
          texto: 'O coelho só percebe quando já está no ar, seguro pelas orelhas. Dona Zulmira nem viu você se mexer. Além do chá, ela lhe passa o saco de iscas do falecido: "Para quem sabe usar."',
          cronica: '{nome} pegou o coelho de dona Zulmira antes que ele notasse.',
          efeitos: { lacos: 1, item: ['cha', 'isca'] },
        },
        falha: {
          texto: 'Um graveto estala. O coelho se vira, olha você nos olhos e morde o dedo que estava mais perto. Depois se deixa pegar, satisfeito com o que fez.',
          cronica: '{nome} foi mordido por um coelho e ainda assim o entregou à dona.',
          efeitos: { vida: -1, lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ato1-agulha',
    ato: 1,
    titulo: 'A noiva e a agulha',
    texto:
      'Diante de um sítio enfeitado de fitas, uma noiva segura a barra do vestido, rasgada de alto a baixo num prego da porteira. A mãe, de agulha numa mão e linha na outra, treme tanto que não acerta o buraco. "É mau agouro", ela repete. O sino da capela já chama, e o noivo espia da janela.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Passar a linha na agulha',
        teste: { chave: 'destreza', dificuldade: 6 },
        ajuda: ['lente'],
        sucesso: {
          texto: 'Você molha a ponta da linha, prende a respiração e ela entra. A mãe costura em dois minutos o que chorou em vinte. Na saída, põe nos seus ombros um manto de lã: "Lá em cima faz frio."',
          cronica: '{nome} passou a linha na agulha e salvou um casamento.',
          efeitos: { lacos: 1, item: 'manto' },
        },
        falha: {
          texto: 'A linha desfia, dobra, foge. Você fura o dedo duas vezes e o vestido uma. Quando enfim entra, o sino já se calou e o padre almoça. O casamento sai, com atraso.',
          cronica: '{nome} brigou com uma agulha até o sino da capela desistir.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Improvisar um passador',
        teste: { chave: 'inteligencia', dificuldade: 5 },
        sucesso: {
          texto: 'Um fio de crina dobrado ao meio passa em qualquer buraco e puxa a linha junto. A mãe olha aquilo como quem vê feitiço, costura a barra e lhe dá um manto de lã pelo segredo.',
          cronica: '{nome} enfiou a linha da noiva com um fio de crina.',
          efeitos: { lacos: 1, item: 'manto' },
        },
        falha: {
          texto: 'A cera de vela endurece a linha, a agulha e os seus dedos. A ideia era boa. A noiva acaba casando com a barra presa por alfinetes e o sino já rouco.',
          cronica: '{nome} encerou uma agulha por engano e atrasou um casamento.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Jurar que rasgo dá sorte',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você jura, pela brasa que carrega, que noiva de vestido rasgado nunca enviúva cedo. A mãe quer acreditar e acredita. As mãos param. Ela mesma enfia a linha e ainda lhe cobre com um manto.',
          cronica: '{nome} convenceu uma mãe de que vestido rasgado é bom agouro.',
          efeitos: { lacos: 1, item: 'manto' },
        },
        falha: {
          texto: '"E o senhor conhece muita noiva?", pergunta a mãe. Você conhece poucas. Ela chora, a noiva chora, o noivo fecha a janela. Uma vizinha resolve com alfinetes enquanto você se sente o prego.',
          cronica: '{nome} tentou consolar uma noiva e piorou o choro.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'prestidigitacao',
        rotulo: 'Enfiar a linha de primeira',
        requer: { nivel: { prestidigitacao: 1 } },
        teste: { chave: 'prestidigitacao', dificuldade: 3 },
        sucesso: {
          texto: 'Seus dedos já fizeram coisa mais difícil no escuro. A linha entra sem olhar, e você ainda dá o primeiro ponto. A mãe lhe entrega um manto de lã e um pote de unguento da despensa.',
          cronica: '{nome} enfiou a linha de primeira, sem olhar, e a noiva casou na hora.',
          efeitos: { lacos: 1, item: ['manto', 'unguento'] },
        },
        falha: {
          texto: 'Mão boa também treme com uma noiva chorando do lado. Você acerta na quinta tentativa. O casamento sai no horário por pouco, e a mãe agradece só com a cabeça.',
          cronica: '{nome} precisou de cinco tentativas para uma agulha.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ato1-barraca',
    ato: 1,
    titulo: 'A maçã do Tibúrcio',
    texto:
      'Na feira da encruzilhada, um barraqueiro de bigode encerado grita mais alto que os outros: três dardos, uma maçã em cima de um barril, a dez passos. Quem acertar leva o prêmio, uma flauta de osso pendurada num barbante. Os dardos têm as penas tortas. A maçã, você repara, já está murcha de tanto esperar.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Acertar a maçã',
        teste: { chave: 'precisao', dificuldade: 7 },
        sucesso: {
          texto: 'O primeiro dardo vai torto, e você aprende com ele. O segundo crava na maçã com um som molhado. Tibúrcio desamarra a flauta devagar, como quem se despede de um parente.',
          cronica: '{nome} acertou a maçã do Tibúrcio no segundo dardo e levou a flauta.',
          efeitos: { item: 'flauta' },
        },
        falha: {
          texto: 'Os três dardos acham o barril, a lona e um queijo da barraca vizinha. A maçã segue intacta. Você paga o queijo com meia hora de desculpas à queijeira.',
          cronica: '{nome} errou a maçã três vezes e acertou um queijo.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'O dardo parte a maçã ao meio e fica vibrando no mastro da barraca. A feira aplaude. Tibúrcio, pálido, entrega a flauta e também a funda da prateleira de cima, contanto que você não volte.',
          cronica: '{nome} partiu a maçã do Tibúrcio ao meio, e ele pagou para não haver revanche.',
          efeitos: { item: ['flauta', 'funda'] },
        },
        desastre: {
          texto: 'O dardo sobe, faz uma curva que ninguém explica e desce no traseiro da mula do Tibúrcio. A mula leva a barraca embora. Você leva um coice de raspão e uma conversa comprida com o fiscal da feira.',
          cronica: '{nome} acertou a mula do barraqueiro em vez da maçã.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Estudar o desvio dos dardos',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['lente'],
        sucesso: {
          texto: 'Pena torta para a esquerda, ponta pesada: o dardo cai um palmo abaixo e à direita. Você mira no nada, acima do barril, e acerta a maçã. Tibúrcio entrega a flauta resmungando sobre gente estudada.',
          cronica: '{nome} fez a conta dos dardos tortos e levou a flauta de osso.',
          efeitos: { item: 'flauta' },
        },
        falha: {
          texto: 'A sua conta está certa para dardos iguais. Os três são tortos de jeitos diferentes. Tibúrcio assiste aos cálculos com um sorriso e recolhe os dardos do chão, um por um, sem pressa.',
          cronica: '{nome} calculou muito e acertou pouco na barraca do Tibúrcio.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Desafiar o barraqueiro a acertar',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: '"Mostre como se faz", você diz, alto, e a feira para para ver. Tibúrcio erra três vezes com os próprios dardos. Entrega a flauta depressa, para as risadas acabarem logo.',
          cronica: '{nome} fez o Tibúrcio errar a própria maçã diante da feira inteira.',
          efeitos: { item: 'flauta' },
        },
        falha: {
          texto: 'Tibúrcio conhece cada dardo pelo nome. Acerta a maçã de costas, por cima do ombro, e a feira ri de você com gosto. Um menino o segue por duas barracas imitando sua cara.',
          cronica: '{nome} desafiou o barraqueiro e virou a atração da barraca.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'maFama',
        rotulo: 'Deixar que ele reconheça você',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'Tibúrcio olha duas vezes e perde a cor do bigode. Já ouviu as histórias. Tira a flauta do barbante e põe na sua mão sem dardo nenhum, pedindo só que você siga viagem.',
          cronica: '{nome} ganhou a flauta do Tibúrcio sem jogar, só por ser quem dizem que é.',
          efeitos: { item: 'flauta' },
        },
      },
    ],
  },
  {
    id: 'ato1-jarro',
    ato: 1,
    titulo: 'O mel da ladeira',
    texto:
      'Na ladeira do rio, uma carroça de apicultor sobe aos trancos atrás de uma mula sem pressa. O dono cochila na boleia. Lá em cima da carga, a corda afrouxou, e um jarro de mel do tamanho de uma criança balança para fora, uma vez, duas, bem acima da sua cabeça.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Aparar o jarro no ar',
        teste: { chave: 'reflexo', dificuldade: 6 },
        sucesso: {
          texto: 'O jarro cai e encontra os seus braços no caminho. Pesa como um bezerro. O apicultor acorda com o baque, entende tudo de uma vez e lhe dá um pote de unguento de cera.',
          cronica: '{nome} aparou no ar um jarro de mel que valia uma colheita.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'Seus dedos roçam o barro e mais nada. O jarro se abre na estrada como uma flor. As abelhas da vizinhança chegam antes das desculpas, e duas delas preferem você.',
          cronica: '{nome} chegou meio palmo atrasado a um jarro de mel.',
          efeitos: { vida: -1 },
        },
        critico: {
          texto: 'Você apara o jarro com uma mão e, com a outra, a tampa. Devolve tudo ao lugar e reata a corda. O apicultor, que acordou no meio, tira o chapéu e lhe entrega unguento e gratidão.',
          cronica: '{nome} aparou o jarro e a tampa, e o apicultor passou a contar a história em toda feira.',
          efeitos: { item: 'unguento', lacos: 1 },
        },
        desastre: {
          texto: 'Você chega a tempo, embaixo, no lugar exato. O jarro também. Quando o mundo volta, você está sentado na estrada, melado até as botas, e o apicultor lhe abana com o chapéu.',
          cronica: '{nome} aparou um jarro de mel com a cabeça.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o nó que cedeu',
        teste: { chave: 'percepcao', dificuldade: 5 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'A carga inteira pende de uma laçada no varal esquerdo. Você puxa a ponta, dá duas voltas, e o jarro assenta com um suspiro. O apicultor acorda e paga o favor com unguento de cera.',
          cronica: '{nome} salvou o mel de um apicultor com duas voltas de corda.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'Você puxa uma ponta. Era a ponta que segurava o resto. O jarro grande fica; caem dois pequenos. Você ajuda a catar os cacos enquanto o apicultor conta o prejuízo em voz alta.',
          cronica: '{nome} puxou a corda errada na carroça do apicultor.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Mandar a mula parar',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Um "ô" só, seco, de quem não aceita discussão. A mula estaca, a carga assenta, o jarro pensa melhor. O apicultor acorda, vê a corda frouxa e lhe estende um pote de unguento.',
          cronica: '{nome} parou uma mula com uma sílaba e salvou um jarro de mel.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'A mula entende o grito como ordem de partida. A carroça arranca, o jarro fica para trás, no ar, e depois no chão. O apicultor acorda e decide que a culpa é de quem gritou.',
          cronica: '{nome} assustou uma mula e levou a culpa pelo mel derramado.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'magia',
        rotulo: 'Segurar o jarro no ar',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 4 },
        sucesso: {
          texto: 'O jarro cai até a metade e para, como se tivesse lembrado de um compromisso. Você o deita na carga com um gesto. O apicultor acorda, não pergunta nada e lhe dá unguento e chá.',
          cronica: '{nome} deixou um jarro de mel esperando no ar.',
          efeitos: { item: ['unguento', 'cha'] },
        },
        falha: {
          texto: 'O jarro desce devagar, quase com educação, e mesmo assim racha ao tocar o chão. O mel escorre. O apicultor olha para as suas mãos por um tempo comprido e segue viagem calado.',
          cronica: '{nome} amorteceu a queda de um jarro, mas não o bastante.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 'ato1-plateia',
    ato: 1,
    titulo: 'O palco dos mambembes',
    texto:
      'Numa carroça-palco no meio da feira, uma trupe de mambembes afunda. O palhaço está de cama com dor de dente, e a moça que o substitui, Nica, conta a mesma piada pela terceira vez. A plateia cruza os braços. Alguém já escolhe um tomate. Nica vê você na primeira fila e estende a mão, com olhos de afogada.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Levar tombos de propósito',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'Você sobe, tropeça no degrau, cai sentado no bumbo. A plateia acorda. Nica entende na hora e passa a derrubá-lo com método. No fim, ofegante, ela diz que vai junto ver esse tal Farol.',
          cronica: '{nome} caiu sete vezes num palco de feira, todas de propósito.',
          efeitos: { companheiro: 'nicaSaltimbanca' },
        },
        falha: {
          texto: 'O primeiro tombo é de propósito. O segundo é de verdade, do palco para o chão da feira. A plateia ri assim mesmo, o que ajuda a trupe e não ajuda o seu ombro.',
          cronica: '{nome} caiu do palco dos mambembes sem ter ensaiado.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Contar a piada do vale',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        ajuda: ['livro'],
        sucesso: {
          texto: 'Toda feira ri do povo da outra margem do rio. Você conta a do balseiro que cobrava a ida e esquecia a volta. Riso de reconhecimento, do fundo. Nica decide ali que quer viajar com quem conhece gente.',
          cronica: '{nome} salvou os mambembes com a piada mais velha do vale.',
          efeitos: { companheiro: 'nicaSaltimbanca' },
        },
        falha: {
          texto: 'A piada é sobre o povo da outra margem. Metade da plateia veio da outra margem, de balsa, hoje cedo. O silêncio dura até um tomate resolver a questão.',
          cronica: '{nome} contou a piada certa para a margem errada.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Fazer a plateia rir',
        teste: { chave: 'empatia', dificuldade: 6 },
        ajuda: ['musica'],
        ajudantes: [{ nome: 'Nica', nivel: 1 }],
        sucesso: {
          texto: 'Você fala da própria viagem como ela é: uma pessoa atravessando o mundo com uma panela de fogo. A plateia ri porque é verdade. Nica ri também, e pede um lugar na estrada ao seu lado.',
          cronica: '{nome} fez a feira da encruzilhada rir e ganhou uma saltimbanca de companhia.',
          efeitos: { companheiro: 'nicaSaltimbanca', marco: true },
        },
        falha: {
          texto: 'Você começa bem e esquece o fim. A plateia espera, educada, e depois deixa de ser educada. O tomate tem boa pontaria. Nica lhe empresta um lenço e um olhar de colega.',
          cronica: '{nome} esqueceu o fim da piada diante da feira inteira.',
          efeitos: { sanidade: -1 },
        },
        critico: {
          texto: 'A feira ri até chorar. O homem do tomate come o tomate. Dentro da lanterna, a brasa estala e cresce, como se também tivesse entendido. Nica já está arrumando a trouxa para ir com você.',
          cronica: '{nome} fez a feira rir tanto que até a brasa pegou mais fogo.',
          efeitos: { companheiro: 'nicaSaltimbanca', marco: true, brasa: 1 },
        },
        desastre: {
          texto: 'Ninguém ri. Uma criança começa a chorar e é a única reação da tarde. Os tomates vêm em ordem, sem raiva, como quem cumpre um dever. Você desce do palco mais vermelho por fora que por dentro.',
          cronica: '{nome} foi vaiado com tomates na feira da encruzilhada.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Tratar o dente do palhaço',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        sucesso: {
          texto: 'Cravo, um bochecho amargo e dez minutos. O palhaço sobe ao palco inchado de um lado só e a plateia vem abaixo. A trupe lhe dá um maço de ervas, e Nica, agora sem papel, pede estrada.',
          cronica: '{nome} curou o dente do palhaço e devolveu o riso aos mambembes.',
          efeitos: { companheiro: 'nicaSaltimbanca', item: 'ervas' },
        },
        falha: {
          texto: 'O dente é pior do que parecia e o palhaço morde. Leva a tarde quase toda. Ele só sobe ao palco no fim da feira, para meia dúzia de teimosos.',
          cronica: '{nome} passou a tarde lutando com o dente de um palhaço.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ato1-ponte',
    ato: 1,
    titulo: 'A ponte do pedágio',
    texto:
      'A ponte de pedra tem uma cancela nova e um homem de chapéu grande sentado num banquinho. "Pedágio dobrou. Ordem do barão", diz ele, sem olhar para você. Atrás, pregado torto, um edital com a tinta ainda fresca. Que você saiba, o vale não tem barão. O rio corre embaixo, largo e frio.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Atravessar o rio a nado',
        teste: { chave: 'fisico', dificuldade: 6 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Você entra na água com a lanterna erguida acima da cabeça e sai do outro lado bufando, de brasa seca. Na ponte, o homem do chapéu acompanha tudo com cara de quem perdeu um freguês.',
          cronica: '{nome} atravessou o rio a nado para não pagar pedágio a barão nenhum.',
        },
        falha: {
          texto: 'A correnteza tem opinião própria. Você sai meia légua rio abaixo, engolindo água, com a lanterna salva por um triz e as botas pesando o dobro.',
          cronica: '{nome} foi levado rio abaixo e voltou a pé, pingando.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Apanhar a mentira dele',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: 'Você pergunta o nome do barão. Depois pergunta de novo, de outro jeito. Saem dois nomes diferentes. Os lavradores da fila se entreolham. O homem lembra de um compromisso urgente e deixa a cancela aberta.',
          cronica: '{nome} desmascarou o falso cobrador da ponte com duas perguntas.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Ele mente bem e com detalhes: o barão, a baronesa, o cavalo do barão. Você discute até o sol mudar de lugar e acaba cruzando pelo vau, longe, de pés molhados.',
          cronica: '{nome} perdeu uma discussão sobre um barão que não existe.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sentar e esperar ele ceder',
        teste: { chave: 'vontade', dificuldade: 6 },
        sucesso: {
          texto: 'Você põe a lanterna no chão, senta na frente dele e não diz nada. A fila cresce atrás. Alguém traz um banco, outro traz pão. O homem levanta a cancela antes que aquilo vire festa.',
          cronica: '{nome} venceu o cobrador da ponte no cansaço, sem dizer palavra.',
        },
        falha: {
          texto: 'Ele tem banquinho, sombra e o dia todo. Você tem uma brasa queimando. Depois de um tempo comprido demais, levanta e vai procurar o vau, ouvindo o homem assobiar.',
          cronica: '{nome} tentou vencer um cobrador pela teimosia e perdeu.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Examinar o edital',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'A tinta mancha o dedo e o selo é uma tampa de garrafa. Por baixo, o edital antigo: pedágio extinto há vinte anos. Você lê em voz alta. O homem foge e esquece uma lamparina boa.',
          cronica: '{nome} leu em voz alta o edital verdadeiro da ponte, e o cobrador sumiu.',
          efeitos: { item: 'lamparina' },
        },
        falha: {
          texto: 'O homem arranca o edital da sua mão antes do fim da leitura e o engole, o que também é uma resposta. Sem papel, sobra a palavra dele contra a sua, e ele levanta a cancela de má vontade.',
          cronica: '{nome} viu o cobrador da ponte comer a própria prova.',
        },
      },
      {
        id: 'ganso',
        rotulo: 'Apresentar o Anselmo',
        requer: { companheiro: 'gansoAnselmo' },
        livre: true,
        resultado: {
          texto: 'Anselmo olha o homem do chapéu e não gosta. Avança de pescoço baixo, chiando. O cobrador sobe no parapeito, depois no poste, e de lá de cima informa que o pedágio foi suspenso.',
          cronica: '{nome} cruzou a ponte atrás de um ganso que não paga pedágio.',
        },
      },
    ],
  },
  {
    id: 'ato1-encruzilhada',
    ato: 1,
    titulo: 'Três caminhos e um carroceiro',
    texto:
      'Onde a estrada se parte em três, o marco de pedra está tombado de cara na lama. Um carroceiro coça a cabeça diante dele, com uma carga de sal para entregar antes do escuro. "Um vai para o Alto, um para o brejo, um para a casa da minha sogra", diz. "Não sei qual é o pior."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Erguer o marco tombado',
        teste: { chave: 'forca', dificuldade: 7 },
        ajuda: ['alavanca'],
        ajudantes: [{ nome: 'o carroceiro', nivel: 1 }],
        sucesso: {
          texto: 'A pedra sai da lama com um som de bota velha. As três setas ainda se leem. O carroceiro acha o rumo dele e lhe deixa um mapa velho: "Nunca soube ler isso. Vai ver você sabe."',
          cronica: '{nome} pôs de pé o marco da encruzilhada.',
          efeitos: { item: 'mapa' },
        },
        falha: {
          texto: 'O marco sobe um palmo, pensa e volta, desta vez sobre a ponta da sua bota. As setas continuam apontando para dentro da terra. Vocês escolhem no palpite, mancando.',
          cronica: '{nome} perdeu uma queda de braço para uma pedra.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Lembrar a geografia do vale',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['mapa', 'livro'],
        sucesso: {
          texto: 'O rio nasce no Alto, então o caminho que sobe contra a água é o seu. O brejo fica onde o chão escurece. Sobra a sogra. O carroceiro suspira e lhe dá um mapa velho de presente.',
          cronica: '{nome} decifrou a encruzilhada pelo curso do rio.',
          efeitos: { item: 'mapa' },
        },
        falha: {
          texto: 'Você tem certeza. A certeza dura até a primeira poça, depois até o joelho. Os dois voltam do brejo no fim da tarde, e o carroceiro já não pede a sua opinião.',
          cronica: '{nome} guiou um carroceiro para dentro do brejo, com toda a convicção.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Deixar a brasa escolher',
        teste: { chave: 'fe', dificuldade: 6 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você ergue a lanterna diante de cada caminho. Em dois, a brasa dorme. No terceiro ela clareia, como quem reconhece a casa. O carroceiro tira o chapéu e lhe confia o mapa que carregava à toa.',
          cronica: '{nome} deixou a brasa escolher o caminho, e ela escolheu certo.',
          efeitos: { item: 'mapa' },
        },
        falha: {
          texto: 'A brasa clareia para onde o vento sopra, e o vento sopra para o brejo. Você descobre isso com lama pela canela. O carroceiro, que não foi atrás, ainda está lá quando você volta.',
          cronica: '{nome} seguiu um sinal da brasa que era só vento.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Ler o chão dos caminhos',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'Sulco fundo de carroça num caminho, junco no outro, pedra solta de enxurrada no terceiro: feira, brejo, serra. O carroceiro lhe dá o mapa e um naco de sal, e você sai sem perder um minuto.',
          cronica: '{nome} leu os três caminhos no chão, como quem lê uma placa.',
          efeitos: { item: ['mapa', 'isca'] },
        },
        falha: {
          texto: 'A chuva de ontem apagou quase tudo. Você acerta o seu caminho e erra o do carroceiro, que vai parar na casa da sogra. Ele dirá, mais tarde, que foi de propósito.',
          cronica: '{nome} achou o próprio rumo e mandou um carroceiro para a sogra.',
        },
      },
    ],
  },
  {
    id: 'ato1-balsa',
    ato: 1,
    titulo: 'A balsa no banco de areia',
    texto:
      'No rio, a balsa encalhou num banco de areia a vinte braças da margem, com meia feira em cima: galinhas, tonéis, um padre enjoado. O balseiro puxa a corda sozinho e xinga em três dialetos. Na margem, um povo inteiro assiste de braços cruzados, dando palpite. Sem a balsa, ninguém atravessa hoje. Nem você.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Puxar a corda no braço',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['corda', 'alavanca'],
        ajudantes: [{ nome: 'o balseiro', nivel: 1 }],
        sucesso: {
          texto: 'Você entra na água até a cintura e puxa junto. A areia segura, segura, e solta de uma vez. A balsa desliza. O balseiro, sem fôlego para xingar, atravessa você de graça e de pé na proa.',
          cronica: '{nome} desencalhou a balsa no braço, com o balseiro.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A corda queima as mãos e a balsa não sai do lugar. A margem dá mais palpites. Só no meio da tarde a água sobe um dedo e faz sozinha o que vocês dois não fizeram.',
          cronica: '{nome} puxou a balsa a tarde inteira, e quem a soltou foi o rio.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ler a correnteza',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: {
          texto: 'A água é mais escura à esquerda: ali é fundo. Você grita para todo mundo ir para a popa. A proa levanta, a corrente pega de lado e a balsa sai girando, com o padre agarrado a uma galinha.',
          cronica: '{nome} soltou a balsa mudando de lugar um padre e doze galinhas.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você manda todos para a popa. A popa afunda mais na areia. O balseiro acrescenta um quarto dialeto. A balsa só sai quando o rio enche, no meio da tarde.',
          cronica: '{nome} deu um palpite a mais na margem do rio, e errado.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Pôr a margem na corda',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Você sobe num tonel e diz que palpite não puxa balsa. Riem, e depois vêm. Quarenta mãos na corda, um grito só. A balsa solta, e a margem inteira atravessa cantando com você.',
          cronica: '{nome} reuniu a multidão da margem e desencalhou a balsa.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Você sobe num tonel. O tonel estava vazio e sem tampa. A multidão ganha o assunto do dia, e a balsa fica onde está até o rio encher por conta própria.',
          cronica: '{nome} caiu dentro de um tonel no meio do discurso.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'Vem a margem toda: a queijeira, os meninos, o padre da outra paróquia. A balsa sai da areia quase voando. O balseiro lhe dá um rolo de corda nova e jura que você nunca mais paga travessia.',
          cronica: '{nome} pôs uma feira inteira para puxar a mesma corda.',
          efeitos: { lacos: 1, marco: true, item: 'corda' },
        },
      },
      {
        id: 'fama',
        rotulo: 'Dizer quem você é',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Basta o seu nome e a lanterna erguida. Quem dava palpite arregaça as mangas sem esperar o fim da frase. A balsa sai em três puxões, e o balseiro lhe presenteia com um rolo de corda.',
          cronica: '{nome} disse o nome na margem do rio, e a margem inteira veio ajudar.',
          efeitos: { item: 'corda' },
        },
      },
    ],
  },
  {
    id: 'ato1-ganso',
    ato: 1,
    titulo: 'O ganso do poço',
    texto:
      'Num sítio de cerca baixa, uma avó e dois netos olham o próprio poço de longe, com baldes vazios. Entre eles e a água, um ganso branco patrulha de pescoço esticado. "É o Anselmo", explica a velha. "Meu falecido tinha o mesmo gênio e o mesmo nome. Desde ontem não deixa ninguém chegar perto."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Enfrentar o ganso',
        combate: 'gansoAnselmoBravo',
        vitoria: {
          texto: 'Depois de muita pena no ar, Anselmo se retira para o telhado, ofendido. Os netos enchem os baldes. A avó agradece de boca fechada, olhando o ganso como quem olha um retrato.',
          cronica: '{nome} venceu um ganso em combate e não se orgulhou muito disso.',
          efeitos: { lacos: 1 },
        },
        derrota: {
          texto: 'Você acorda debaixo da figueira, com a avó abanando e os netos contando as bicadas em voz alta. Anselmo continua no poço. A lanterna, ele não quis.',
          cronica: '{nome} foi derrotado por um ganso chamado Anselmo.',
          efeitos: { sanidade: -1 },
        },
        fuga: {
          texto: 'Você pula a cerca com Anselmo a meio palmo dos calcanhares. Os netos aplaudem o ganso. A avó oferece água do barril da chuva, que é o que a família anda bebendo.',
          cronica: '{nome} fugiu de um ganso pulando uma cerca.',
        },
      },
      {
        id: 'mente',
        rotulo: 'Entender o que ele guarda',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'Bicho nenhum guarda poço. Atrás da pedra, num ninho de palha, a gansa choca. Você puxa água pelo outro lado, com uma corda comprida, e ensina os netos. Anselmo vigia, mas deixa.',
          cronica: '{nome} descobriu o ninho atrás do poço e ensinou a família a dar a volta.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você conclui que ele quer milho. Leva milho. Anselmo aceita o milho e depois a sua canela. O ninho atrás do poço, você só vê na retirada, de relance.',
          cronica: '{nome} tentou subornar um ganso com milho e pagou com a canela.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Pedir licença ao falecido',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você tira o chapéu e pede licença a seu Anselmo, com respeito, explicando a sede da família e a brasa. O ganso escuta, abre caminho e, quando você parte, vem atrás. "Ele sempre quis viajar", diz a avó.',
          cronica: '{nome} pediu licença a um ganso e saiu do sítio com ele de companhia.',
          efeitos: { lacos: 1, companheiro: 'gansoAnselmo' },
        },
        falha: {
          texto: 'Você tira o chapéu. Anselmo aproveita que as suas mãos estão ocupadas. A avó comenta que o falecido também nunca foi de conversa. Os netos buscam água no riacho, longe.',
          cronica: '{nome} falou com um ganso como quem fala com um morto, e apanhou do ganso.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'animais',
        rotulo: 'Falar a língua do ganso',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        sucesso: {
          texto: 'Pescoço baixo, passo lento, sem olhar de frente: você diz em língua de ganso que não quer nada com o ninho. Anselmo deixa a família passar. Na porteira, decide que você precisa de escolta, e a avó manda unguento.',
          cronica: '{nome} se entendeu com o ganso do poço e ganhou um guarda-costas.',
          efeitos: { lacos: 1, companheiro: 'gansoAnselmo', item: 'unguento' },
        },
        falha: {
          texto: 'Você acerta a postura e erra o sotaque. Anselmo tolera você, e só você. Os netos passam a tarde lhe entregando baldes por cima da cerca, um por um.',
          cronica: '{nome} virou o único aguadeiro que o ganso do poço aceitava.',
          efeitos: { brasa: -1, lacos: 1 },
        },
      },
    ],
  },
];
