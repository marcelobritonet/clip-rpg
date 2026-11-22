/**
 * O Sino Afogado, ato 1: A Vila Nova. Anoitecer, lampião aceso em toda janela,
 * gente acordada à força. Dificuldades das abertas entre 4 e 8.
 */

export const itens = {};

export const companheiros = {};

export const inimigos = {};

export const cenas = [
  {
    id: 's1-juvenal',
    ato: 1,
    titulo: 'Seu Juvenal desce a rua',
    texto:
      'Seu Juvenal, o ferreiro, passa por você de pijama e pés descalços, de olho aberto e enxada no ombro, descendo a rua de pedra em direção ao lago. A mulher dele vem atrás de camisola, chorando baixo, sem coragem de encostar. Dizem que acordar sonâmbulo de repente faz a alma ficar do lado de lá.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Segurar sem acordar',
        teste: { chave: 'forca', dificuldade: 6 },
        sucesso: {
          texto: 'Você o abraça por trás, devagar, como quem segura um armário que vai cair, e vira o corpo dele de costas para o lago. Ele dá dois passos no ar e para. A mulher o leva para casa pela mão.',
          cronica: '{nome} segurou Seu Juvenal no meio da rua e o virou de costas para o lago.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ferreiro dorme forte. Ele arrasta você meia rua abaixo antes de tropeçar num degrau e sentar. A enxada cai perto demais do seu pé.',
          cronica: '{nome} foi arrastado meia rua por um ferreiro dormindo.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Lembrar o que acalma sonâmbulo',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'Sua avó dizia: sonâmbulo obedece cheiro de casa. Você pede à mulher o lenço dela e o passa debaixo do nariz dele. Seu Juvenal suspira, se vira e sobe a rua sozinho, de volta para a cama.',
          cronica: '{nome} levou Seu Juvenal de volta para casa com o cheiro do lenço da mulher.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você tenta água fria, palma, assobio. Nada. Quando ele enfim para, é por cansaço, na última casa da rua, e a vela já encurtou.',
          cronica: '{nome} seguiu Seu Juvenal até a última casa da rua sem conseguir pará-lo.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Chamar pelo nome dele',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: '"Juvenal", você diz, firme, como quem chama para o almoço. Ele para. "Juvenal, a forja." Os olhos dele piscam pela primeira vez. Ele não sabe onde está, mas sabe que tem uma forja, e isso basta para voltar.',
          cronica: '{nome} chamou Seu Juvenal pelo nome até ele lembrar da própria forja.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você diz o nome dele e ele vira a cabeça devagar, para você, sem reconhecer palavra nenhuma. Aquele olhar vazio fica com você a noite inteira.',
          cronica: '{nome} chamou Seu Juvenal pelo nome, e ele não sabia que era o dele.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'benzer',
        rotulo: 'Tirar o quebranto do sono',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 3 },
        sucesso: {
          texto: 'Três cruzes na testa com o polegar e a reza baixinho, que é a mesma de criança com mau-olhado. Seu Juvenal pisca, boceja e pergunta à mulher por que diabos ela está de camisola na rua.',
          cronica: '{nome} benzeu Seu Juvenal no meio da rua, e ele acordou inteiro.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'A reza escorrega nele como água em panela. Você sente frio no peito, um frio que vem do lago, e larga a mão dele depressa.',
          cronica: '{nome} tentou benzer um sonâmbulo e sentiu o frio do lago.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's1-tiao',
    ato: 1,
    titulo: 'O menino que não ouve',
    texto:
      'Na janela de uma casa azul, um menino de onze anos faz sinais para você, agitado, apontando o lago e depois o próprio peito. É Tião. Ele nasceu surdo e é o único na vila que dorme tranquilo: não ouve o sino. A mãe, Dona Lurdes, aparece atrás dele e fecha a janela com força.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Esperar ele pular a janela',
        teste: { chave: 'destreza', dificuldade: 5 },
        sucesso: {
          texto: 'Ele sai pela janela dos fundos, como já fez cem vezes, e você o pega no ar antes de ele cair no canteiro de couve. Tião ri sem som, bate no peito e aponta o lago. Ele vai junto.',
          cronica: '{nome} pegou Tião no ar quando ele pulou a janela para ir junto.',
          efeitos: { companheiro: 'tiao', marca: 's1-tiao', lacos: 1 },
        },
        falha: {
          texto: 'Você não alcança. Tião cai em cima das couves, a mãe ouve, e os dois somem lá para dentro numa bronca que dá para ouvir da rua.',
          cronica: '{nome} deixou Tião cair nas couves da mãe.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Entender os sinais dele',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: {
          texto: 'Lago, sino, olhos fechados, dedo que nega. Depois mão no peito. Você entende: ele não ouve, então pode ir onde os outros dormem. Você explica isso à mãe com os sinais dele mesmo. Ela chora e deixa.',
          cronica: '{nome} aprendeu os sinais de Tião e convenceu a mãe a deixá-lo ir.',
          efeitos: { companheiro: 'tiao', marca: 's1-tiao', lacos: 1 },
        },
        falha: {
          texto: 'Você acha que ele está com medo e faz sinal de "fica". Tião baixa os olhos, ofendido, e some da janela. Era o contrário.',
          cronica: '{nome} entendeu errado os sinais de Tião.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Bater e falar com a mãe',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Dona Lurdes abre a porta com a cara feia e fecha com o rosto molhado. "Ele não ouve, mas vê tudo", ela diz. "Traz de volta." Tião já está de botina, com um pão no bolso.',
          cronica: '{nome} convenceu Dona Lurdes a deixar Tião descer com a vela.',
          efeitos: { companheiro: 'tiao', marca: 's1-tiao', lacos: 1 },
        },
        falha: {
          texto: '"Já levaram o pai dele pro lago uma vez, na enchente", diz Dona Lurdes. "O menino não vai." Ela tem razão, e você vai embora sem argumento nenhum.',
          cronica: '{nome} pediu Tião à mãe e ouviu um não com razão.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'moeda',
        rotulo: 'Tirar uma moeda da orelha dele',
        requer: { nivel: { prestidigitacao: 1 } },
        livre: true,
        resultado: {
          texto: 'Pelo vidro, você tira uma moeda da orelha dele sem abrir a janela. Tião arregala os olhos. A mãe, atrás, ri sem querer pela primeira vez em três dias, e é ela quem abre a porta.',
          cronica: '{nome} tirou uma moeda da orelha de Tião através do vidro e ganhou um companheiro.',
          efeitos: { companheiro: 'tiao', marca: 's1-tiao', lacos: 1 },
        },
      },
    ],
  },
  {
    id: 's1-fotografo',
    ato: 1,
    titulo: 'As chapas de vidro',
    texto:
      'Seu Bené, o fotógrafo, sobe a escada do sótão com um caixote de chapas de vidro nos braços: a Pedra-Funda inteira, fotografada antes da água. Quer mostrar a você uma em particular. No meio do caminho o degrau range, o velho bambeia, e o caixote escorrega da mão dele.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Segurar o caixote',
        teste: { chave: 'reflexo', dificuldade: 6 },
        sucesso: {
          texto: 'Você pega o caixote a um palmo do chão. Nenhuma chapa quebra. Seu Bené tira uma de cima, contra o lampião: a procissão na frente da igreja velha, e na torre um homem de chapéu de palha que ninguém na vila quer reconhecer.',
          cronica: '{nome} salvou as chapas de Seu Bené e viu o homem de chapéu na torre da igreja velha.',
          efeitos: { marca: 'retrato', lacos: 1 },
        },
        falha: {
          texto: 'O caixote bate na quina e você ouve o vidro rachar lá dentro. Seu Bené senta no degrau e fica olhando os cacos, um por um, procurando o rosto de alguém.',
          cronica: '{nome} deixou cair as chapas de vidro da Pedra-Funda.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ler as chapas contra a luz',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'O caixote cai, mas a chapa que importa ficou na mão dele. Você a olha contra o lampião: a torre velha, e lá em cima, entre os sinos, um homem magro de chapéu de palha. Seu Bené diz que não lembra o nome. Mente mal.',
          cronica: '{nome} achou na chapa de Seu Bené o homem de chapéu na torre da Pedra-Funda.',
          efeitos: { marca: 'retrato' },
        },
        falha: {
          texto: 'Negativo de vidro é tudo ao contrário: a noite branca, a pele escura, a torre do lado errado. Você não acha nada, e Seu Bené guarda tudo de volta, aliviado demais.',
          cronica: '{nome} olhou as chapas de vidro e não soube o que procurar.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Deixar o velho contar',
        teste: { chave: 'empatia', dificuldade: 5 },
        sucesso: {
          texto: 'Sentado no degrau, entre os cacos, ele conta da festa do padroeiro, da banda, de quem casou com quem. Quando chega na torre, para. "Tinha um homem lá. Não me pede o nome." Ele aperta a sua mão por muito tempo.',
          cronica: '{nome} ouviu Seu Bené contar a Pedra-Funda até a hora em que ele parou de contar.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você pergunta depressa, de pé, com a vela na mão. Ele percebe a pressa e fecha a cara. "Isso é coisa velha, de afogado", diz, e manda você embora.',
          cronica: '{nome} teve pressa com Seu Bené e saiu sem história nenhuma.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's1-correio',
    ato: 1,
    titulo: 'A carta que não saiu',
    texto:
      'Na agência do correio, Dona Zica separa cartas à luz de vela, porque o lampião queimou. Ela jura que não sabe de nada. Mas você viu, quando entrou, a mão dela esconder debaixo do balcão um envelope amarelo de velho, com selo de trinta anos atrás, e a palavra "sineiro" escrita no lugar do nome.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Pegar a carta no descuido',
        teste: { chave: 'destreza', dificuldade: 7 },
        sucesso: {
          texto: 'Você derruba um maço de cartas de propósito e, enquanto ela junta, o envelope amarelo já está no seu bolso. Lá fora você lê, numa letra tremida de mulher: "Ao sineiro da Pedra-Funda. Sai da torre, pelo amor de Deus." Nunca foi entregue.',
          cronica: '{nome} furtou do correio uma carta de trinta anos endereçada ao sineiro.',
          efeitos: { marca: 'retrato', sanidade: -1 },
        },
        falha: {
          texto: 'Ela vê a sua mão antes de você ver a dela. "Saia da minha agência", diz Dona Zica, e o resto da rua fica sabendo antes de você chegar à esquina.',
          cronica: 'Dona Zica pegou {nome} com a mão no balcão do correio.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Notar a mentira dela',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: '"A senhora nunca jogou carta fora em trinta anos", você diz. "Por que essa?" Ela tira o envelope do balcão. É da mãe dela, pedindo a um homem que saísse da torre antes da água. "Ele não saiu", diz Zica. "E a carta também não."',
          cronica: '{nome} percebeu a mentira de Dona Zica e leu a carta que nunca foi entregue ao sineiro.',
          efeitos: { marca: 'retrato', lacos: 1 },
        },
        falha: {
          texto: 'Você insiste, ela nega, você insiste mais. Dona Zica fica com a cara vermelha e a carta onde está. Você perdeu o tempo e a amiga.',
          cronica: '{nome} discutiu com Dona Zica por uma carta e não viu a carta.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ajudar a separar as cartas',
        teste: { chave: 'vontade', dificuldade: 6 },
        sucesso: {
          texto: 'Você senta e separa cartas com ela em silêncio, rua por rua, até a vela dela acabar. Dona Zica não fala do envelope. Mas na saída põe na sua mão um selo antigo, sem dizer de onde é, e um bolinho de fubá.',
          cronica: '{nome} separou as cartas da vila com Dona Zica até a vela dela acabar.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'As cartas são muitas e os nomes começam a ficar estranhos, como palavras repetidas demais. Você levanta tonto, com a impressão de ter lido o seu próprio nome num envelope que não era seu.',
          cronica: '{nome} separou cartas até os nomes ficarem estranhos.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Ler o carimbo e a letra',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'Carimbo da Pedra-Funda, mês da enchente. Letra de mulher, tremida. Você diz em voz alta o nome da remetente, a mãe de Zica, e ela desaba na cadeira. "Ninguém nunca soube. Agora você sabe." Ela lhe entrega a carta.',
          cronica: '{nome} leu o carimbo e a letra, e Dona Zica entregou a carta do sineiro.',
          efeitos: { marca: 'retrato', marco: true },
        },
        falha: {
          texto: 'O carimbo está borrado e a letra é de quem escrevia chorando. Você chuta uma data errada, e Dona Zica guarda o envelope de vez.',
          cronica: '{nome} errou a data de uma carta velha.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'recursos',
        rotulo: 'Pagar o selo de trinta anos',
        requer: { antecedente: 'recursos' },
        livre: true,
        resultado: {
          texto: 'Você põe no balcão o que custa um selo, mais trinta anos de juros. "Para a carta chegar", diz. Dona Zica olha o dinheiro, olha você, e empurra o envelope por cima do balcão. "Entrega você, então."',
          cronica: '{nome} pagou o selo de uma carta de trinta anos para poder entregá-la ao sineiro.',
          efeitos: { marca: 'retrato', brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's1-venda',
    ato: 1,
    titulo: 'Cachaça para não dormir',
    texto:
      'A venda do Seu Brás está cheia de homens bebendo café com cachaça para não dormir. Ninguém tem coragem de ir embora sozinho. Dois deles discutem de quem é a culpa da enchente, trinta anos depois, e um já tirou a faca da cinta. Seu Brás limpa o mesmo copo há dez minutos.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Ficar no meio dos dois',
        teste: { chave: 'forca', dificuldade: 7 },
        sucesso: {
          texto: 'Você segura o pulso da faca com uma mão e o colarinho do outro com a outra, e não solta até os dois sentarem. Seu Brás serve uma rodada por conta da casa e lhe passa um pé de cabra. "Pra porta da igreja velha. Lá vai precisar."',
          cronica: '{nome} separou uma briga de faca na venda e ganhou um pé de cabra de Seu Brás.',
          efeitos: { item: 'pe' },
        },
        falha: {
          texto: 'A faca passa raspando o seu braço e corta a manga e um pouco mais. A briga acaba por si, de susto, quando os dois veem o sangue.',
          cronica: '{nome} levou um talho de faca numa briga que não era sua.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Perguntar quem assinou a enchente',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        sucesso: {
          texto: 'Não foi nenhum dos dois, você lembra: quem assinou foi a companhia, e quem leu a ordem em voz alta foi o Engenheiro Moura, que ainda mora na casa de máquinas lá embaixo. Os dois homens baixam a faca e a voz.',
          cronica: '{nome} lembrou à venda inteira quem assinou a ordem da enchente.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você fala da companhia, e eles se juntam contra você, que é de fora, ou parece. Saem os dois abraçados, e você fica com a conta.',
          cronica: '{nome} tentou explicar a enchente na venda e pagou a conta da briga.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Fazer a venda rir',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Você conta o causo do padre que benzeu a represa e pediu a Deus pouca chuva, e Deus caprichou. A venda ri, depois ri mais. O da faca guarda a faca para enxugar o olho. Ninguém briga rindo.',
          cronica: '{nome} fez a venda do Seu Brás rir até a faca voltar para a cinta.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O causo não pega. No silêncio que fica, lá de baixo, do lago, o sino toca uma vez. Todos olham a porta. Ninguém mais ri naquela noite.',
          cronica: '{nome} contou um causo, e o sino respondeu em vez da venda.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'boaFama',
        rotulo: 'Pedir que guardem a faca',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Você não diz nada de especial. Só pede. Os dois guardam a faca, envergonhados de brigar na sua frente, e Seu Brás lhe dá o pé de cabra que estava atrás do balcão. "Leva. Você é de confiança."',
          cronica: 'Na venda, bastou {nome} pedir para a faca voltar à cinta.',
          efeitos: { lacos: 1, item: 'pe' },
        },
      },
      {
        id: 'maFama',
        rotulo: 'Encarar os dois',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'Eles conhecem você, ou a sua fama. A briga acaba na hora, e a conversa também. A venda inteira bebe olhando para o copo até você sair. Seu Brás nem lhe vende o fumo.',
          cronica: 'A fama de {nome} acabou com a briga na venda, e com a conversa junto.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's1-padre',
    ato: 1,
    titulo: 'O padre que não acredita',
    texto:
      'Na igreja nova, Padre Olavo reza sozinho de luz acesa. Chegou à vila depois da enchente, estudou no seminário da capital e acha tudo isso superstição de gente cansada. Mas não dorme há três noites, e o terço treme na mão dele. Atrás do altar fica o livro de tombo, com os batismos e enterros da paróquia velha.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Levar o padre até a janela',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'Você o leva pelo braço até a janela da sacristia, de onde se vê o lago. Lá embaixo, entre a lama e a neblina, a torre velha. O sino toca. O padre vê a corda mexer de longe e não diz mais "superstição".',
          cronica: '{nome} mostrou a torre afogada a Padre Olavo, e ele parou de chamar aquilo de superstição.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ele se solta, irritado, e você derruba um castiçal no caminho. A cera quente cai na sua mão. O padre volta a rezar de costas para você.',
          cronica: '{nome} queimou a mão num castiçal da igreja nova.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Pedir o livro de tombo',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        sucesso: {
          texto: 'Você fala de registro, de documento, de direito canônico, a língua do seminário dele. Padre Olavo, aliviado de ter algo racional para fazer, entrega o livro de tombo. "Se for para provar que é bobagem", diz.',
          cronica: '{nome} convenceu Padre Olavo a emprestar o livro de tombo da paróquia velha.',
          efeitos: { item: 'tombo', lacos: 1 },
        },
        falha: {
          texto: 'Você pede o livro e ele pede justificativa, por escrito, com firma reconhecida. Os dois sabem que é medo. Nenhum dos dois diz.',
          cronica: 'Padre Olavo negou o livro de tombo a {nome}.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Rezar junto com ele',
        teste: { chave: 'fe', dificuldade: 6 },
        sucesso: {
          texto: 'Você ajoelha ao lado dele e reza o terço inteiro, sem pressa. No quinto mistério as mãos dele param de tremer. Na saída, ele lhe dá o livro de tombo. "Eu não acredito", diz. "Mas leva."',
          cronica: '{nome} rezou o terço com Padre Olavo, e ele emprestou o livro de tombo.',
          efeitos: { item: 'tombo', lacos: 1 },
        },
        falha: {
          texto: 'Você reza alto e ele reza baixo, e as duas rezas não se encontram. Lá fora o sino toca, e o padre para no meio da ave-maria e não termina.',
          cronica: '{nome} rezou com Padre Olavo, e o sino interrompeu os dois.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Ler a nota em latim',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 3 },
        sucesso: {
          texto: 'Na última página do livro de tombo há uma nota em latim do padre velho, na véspera da enchente. Você lê em voz alta: "Um ficou. Que Deus lembre o nome dele, porque nós combinamos esquecer." Padre Olavo senta no banco.',
          cronica: '{nome} leu a nota em latim do padre velho: um ficou, e a vila combinou esquecer.',
          efeitos: { item: 'tombo', marca: 'retrato' },
        },
        falha: {
          texto: 'O latim é de padre do interior, cheio de abreviatura e borrão. Você entende "Deus" e "água". O resto fica para depois.',
          cronica: '{nome} não decifrou a nota em latim do livro de tombo.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's1-escola',
    ato: 1,
    titulo: 'A noite na escola',
    texto:
      'As mães juntaram as crianças na escola, que tem lampião bom, para uma vigiar a outra. São vinte e poucas, de pijama, deitadas nas carteiras e caindo de sono. No quadro-negro, numa letra redonda, alguém escreveu "NAIR" muitas vezes. A professora Nair está sentada no fundo da sala, olhando o próprio nome sem reconhecer.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Correr pega-pega com eles',
        teste: { chave: 'fisico', dificuldade: 5 },
        sucesso: {
          texto: 'Você declara pega-pega e é o pegador. Corre entre carteiras, derruba giz, deixa os pequenos ganharem. Ninguém dorme rindo. Quando você sai, as crianças estão vermelhas e acordadas, e uma mãe na porta enxuga o olho.',
          cronica: '{nome} brincou de pega-pega com vinte crianças para que nenhuma dormisse.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você corre, tropeça num pé de carteira e cai de queixo no assoalho. As crianças riem, e você ri também, com gosto de sangue na boca.',
          cronica: '{nome} caiu de queixo no assoalho da escola brincando de pega-pega.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Inventar o jogo dos nomes',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        sucesso: {
          texto: 'Cada criança diz o próprio nome, o nome da mãe e uma coisa de que gosta, e o próximo repete tudo. Quem erra paga prenda. Ninguém dorme, e no fim a professora Nair levanta a mão e diz: "Nair. Gosto de goiabada."',
          cronica: '{nome} inventou na escola um jogo de nomes, e a professora Nair lembrou do dela.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'O jogo é complicado demais para quem está com sono. Na terceira rodada, duas crianças já dormem de boca aberta, e você precisa sacudi-las com cuidado.',
          cronica: '{nome} inventou um jogo complicado demais para crianças com sono.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Contar uma história',
        teste: { chave: 'presenca', dificuldade: 5 },
        sucesso: {
          texto: 'Você conta a do sapo que queria morar na lua, com vozes. Na parte do pulo, vinte e poucos pares de olhos estão arregalados. Ninguém dorme numa história boa. A professora Nair, no fundo, sorri na hora certa.',
          cronica: '{nome} contou na escola uma história que não deixou ninguém dormir.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Sua voz é baixa e a história é lenta. No meio, um menino pergunta se o sapo esqueceu o nome também, e uma menina começa a chorar.',
          cronica: '{nome} contou uma história lenta demais, e uma criança perguntou se o sapo tinha esquecido o nome.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'caderno',
        rotulo: 'Fazer a chamada',
        requer: { item: 'caderno' },
        livre: true,
        resultado: {
          texto: 'Você abre o caderno e faz a chamada, nome por nome, com voz de escola. Cada criança responde "presente" mais alto que a outra. No fim você chama "Nair", e lá do fundo, devagar, vem um "presente".',
          cronica: '{nome} fez a chamada na escola, e a professora Nair respondeu presente.',
          efeitos: { lacos: 1, sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's1-trovao',
    ato: 1,
    titulo: 'O cão na ladeira',
    texto:
      'A ladeira que desce para o lago tem dono: Trovão, o cão da venda, grande, malhado, com uma orelha comida. Ele não deixa ninguém passar desde que o sino começou. Rosna de cabeça baixa, e atrás dele, na valeta, há alguma coisa enrolada num cobertor que ele não para de olhar.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Passar por ele correndo',
        teste: { chave: 'agilidade', dificuldade: 6 },
        sucesso: {
          texto: 'Você finta para a esquerda e passa pela direita. Trovão late, mas não morde: ele só quer que ninguém desça. Lá de baixo, você olha para trás e vê o cão deitar de novo ao lado do cobertor.',
          cronica: '{nome} passou pela ladeira na finta, e Trovão nem chegou a morder.',
        },
        falha: {
          texto: 'O cão pega a barra da sua calça e não solta. Você desce a ladeira arrastando Trovão por três metros, até ele desistir com um pedaço de pano na boca.',
          cronica: 'Trovão rasgou a calça de {nome} na ladeira do lago.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ver o que ele vigia',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: 'Cão não rosna assim por maldade. No cobertor da valeta está Dinho, oito anos, dormindo de olho aberto: desceu ontem e Trovão o deteve no meio do caminho. Você o leva para a venda no colo. O cão vem atrás, abanando o rabo.',
          cronica: '{nome} achou o menino Dinho que o cão da venda vigiava na valeta.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você chega perto demais do cobertor e Trovão avança. Você recua para a rua de cima, e o cobertor fica lá, com o que tiver dentro.',
          cronica: '{nome} não chegou perto do que o cão da ladeira vigiava.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ficar parado e deixar cheirar',
        teste: { chave: 'vontade', dificuldade: 6 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Você para, mão aberta, olho baixo. Trovão cheira a sua mão, a vela, o seu sapato. Depois vira e vai até o cobertor, como quem mostra. Lá dentro está Dinho, oito anos, que desceu ontem. Vocês dois o levam de volta.',
          cronica: '{nome} deixou Trovão cheirar a mão, e o cão mostrou o menino que vigiava.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A sua mão treme e o cão sente. Ele rosna mais alto. Você recua até a esquina com o coração na boca e desce pela outra rua, mais longe.',
          cronica: '{nome} recuou do cão da ladeira e desceu pelo caminho longo.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'lidarAnimais',
        rotulo: 'Falar com o cão',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        sucesso: {
          texto: 'Você fala baixo com ele, como se fala com cavalo. Trovão senta. Depois deita. Depois deixa você ver Dinho no cobertor e levar o menino no colo, com o focinho dele encostado no seu joelho o caminho todo.',
          cronica: '{nome} falou com Trovão, e o cão deixou levar o menino que guardava.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'O cão não está para conversa. Ele mostra os dentes até você ir embora, e você vai.',
          cronica: 'Trovão não quis conversa com {nome}.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's1-delegado',
    ato: 1,
    titulo: 'A cadeia dos que dormem',
    texto:
      'O Delegado Firmino trancou na cadeia quatro dos que dormem, para não descerem ao lago. A cada badalada eles se levantam juntos e empurram as grades, de olho aberto, sem fazer barulho. O delegado está sentado de costas para a cela, fumando, e diz que você não sai daqui sem explicar o que vai fazer lá embaixo.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Reforçar a grade com ele',
        teste: { chave: 'manipulacaoPeso', dificuldade: 6 },
        sucesso: {
          texto: 'A dobradiça de baixo está solta. Você levanta a grade no ombro enquanto o delegado bate o pino de volta. Depois disso ele lhe oferece café e o caminho livre. "Ninguém aqui ajudou em nada", resmunga. "Até você."',
          cronica: '{nome} ergueu a grade da cadeia no ombro para o Delegado Firmino consertar.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A grade escorrega e prende os seus dedos contra o batente. Os quatro de olho aberto olham para você sem expressão nenhuma enquanto você grita.',
          cronica: '{nome} prendeu os dedos na grade da cadeia dos que dormem.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Conseguir a confissão dele',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Ele fuma de costas porque não aguenta olhar. Você pergunta o que o pai dele fazia na enchente. Firmino apaga o cigarro. "Foi ele que raspou o nome da parede da igreja", confessa. "Com o canivete. A vila pediu."',
          cronica: 'O Delegado Firmino confessou a {nome} que o pai raspou o nome do sineiro da parede da igreja.',
          efeitos: { marca: 'retrato' },
        },
        falha: {
          texto: 'Você pergunta demais e ele se lembra de que é delegado. Faz você esperar sentado no banco de madeira, por desacato, até cansar de olhar para a sua cara.',
          cronica: '{nome} perguntou demais ao Delegado Firmino e ficou de castigo no banco.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Explicar a vela',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Você mostra a vela da última missa e diz o que Dona Sinhá disse. O delegado não acredita em nada, mas é filho da Pedra-Funda. Tira o chapéu para a vela. "Vai", diz. "E se precisar de alguém lá embaixo, grita."',
          cronica: '{nome} mostrou a vela ao Delegado Firmino, e ele tirou o chapéu.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ele ri da vela, alto, e na mesma hora os quatro da cela se viram para olhar a chama ao mesmo tempo. O delegado para de rir. Você sai sem ele dizer mais nada.',
          cronica: 'Os quatro da cela olharam a vela de {nome} todos ao mesmo tempo.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'inimigo',
        rotulo: 'Ver o cartaz na parede',
        requer: { antecedente: 'inimigo' },
        livre: true,
        resultado: {
          texto: 'Na parede, entre os procurados da capital, um cartaz com o rosto de quem você deve. O delegado vê para onde você olhou. "Esse aí também me deve", diz, e solta o cinto. "Sai daqui antes que eu pergunte de onde você conhece."',
          cronica: '{nome} reconheceu na cadeia o cartaz de quem lhe cobra, e o delegado preferiu não perguntar.',
          efeitos: { lacos: 1, sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's1-radio',
    ato: 1,
    titulo: 'A Rádio Represa',
    texto:
      'A Rádio Represa fica num quartinho em cima da farmácia, com uma antena de bambu e fio. Esta noite ela não fala: o técnico dormiu na cadeira de olho aberto, e no alto-falante só sai estática. Por baixo da estática, se você prestar atenção, um sino toca no mesmo compasso do de lá de baixo.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir e firmar a antena',
        teste: { chave: 'destreza', dificuldade: 6 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Você sobe no telhado e endireita o bambu, amarrado no beiral. A estática some. Lá embaixo, na rua, os rádios das casas voltam a dar a hora certa, e as janelas acesas parecem respirar aliviadas.',
          cronica: '{nome} subiu no telhado e firmou a antena da Rádio Represa.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A telha quebra sob o seu pé e você desce o resto do telhado sentado, até a calha. A antena cai junto, com fio e tudo.',
          cronica: '{nome} caiu do telhado da Rádio Represa, com antena e tudo.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o sino na estática',
        teste: { chave: 'percepcao', dificuldade: 7 },
        sucesso: {
          texto: 'Você gira o dial bem devagar até o sino ficar nítido. Ele não toca à toa. Toca a mesma batida de sempre, de chamar enterro, e no fim de cada série alguém diz uma palavra que você quase entende. Começa com "Da".',
          cronica: 'Na estática da Rádio Represa, {nome} quase entendeu um nome.',
          efeitos: { marco: true, sanidade: -1 },
        },
        falha: {
          texto: 'De tanto escutar a estática, você começa a ouvir o seu nome nela, dito por uma voz que não é de ninguém. Desliga o rádio de um tapa.',
          cronica: '{nome} ouviu o próprio nome na estática da rádio.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Falar com a vila pelo ar',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Você liga o microfone e fala para a vila: que ninguém durma sozinho, que façam roda, que cantem. Daqui a pouco, de toda janela da rua, vem uma cantoria de roda desafinada. O sino lá embaixo fica pequeno.',
          cronica: '{nome} falou pela Rádio Represa, e a vila inteira cantou para não dormir.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você fala, mas a sua voz sai do alto-falante com um sino por baixo, bem baixinho, e a vila ouve os dois juntos. Lá na rua alguém grita de medo.',
          cronica: 'A voz de {nome} saiu na rádio com o sino por baixo.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'violao',
        rotulo: 'Tocar no ar',
        requer: { item: 'violao' },
        livre: true,
        resultado: {
          texto: 'Você toca uma moda de viola ao microfone, das antigas, que todo mundo sabe. Nas casas, gente velha canta junto, de olho fechado e acordada. O sino perde o compasso na estática e se cala por uma música inteira.',
          cronica: '{nome} tocou uma moda antiga na Rádio Represa, e o sino perdeu o compasso.',
          efeitos: { lacos: 1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's1-mascate',
    ato: 1,
    titulo: 'O elixir do mascate',
    texto:
      'No coreto, um mascate chegado hoje de caminhão vende "Elixir Vigília, contra o sono e o mau-olhado", a dois cruzeiros o vidro. Já há fila. Ele mostra um galo que, diz, bebeu o elixir e não dorme há um mês. O galo, de fato, não parece bem. Uma velha da fila já está bebendo o segundo vidro.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Derrubar a banca dele',
        teste: { chave: 'forca', dificuldade: 6 },
        sucesso: {
          texto: 'Você vira a banca com um tranco só, e os vidros quebram no chão do coreto. Cheiro de cachaça com canela. A fila entende sozinha. O mascate sobe no caminhão e vai embora sem ligar o farol.',
          cronica: '{nome} virou a banca do mascate e mostrou à vila que o elixir era cachaça com canela.',
        },
        falha: {
          texto: 'O mascate é mais forte do que parece e tem um ajudante. Você sai do coreto com o olho inchado, e a fila nem se mexe.',
          cronica: '{nome} apanhou do mascate no coreto.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Mostrar o que tem no vidro',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['remedio', 'lente'],
        sucesso: {
          texto: 'Você cheira, prova na ponta da língua, mostra a borra no fundo: cachaça, canela e açúcar queimado. A fila devolve os vidros. A velha do segundo vidro já está rindo sozinha e pede a sua mão para descer a escada.',
          cronica: '{nome} provou no coreto que o elixir do mascate era cachaça com canela.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você diz que é cachaça, e o mascate diz que é por isso que funciona. A fila concorda com ele. Até você fica em dúvida.',
          cronica: '{nome} perdeu um debate para um mascate no coreto.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Perceber a mentira dele',
        teste: { chave: 'empatia', dificuldade: 6 },
        sucesso: {
          texto: 'Ele mente bem, mas o olho dele escapa para o lago cada vez que o sino toca. Você diz baixo, só para ele: "O senhor está com medo também." Ele fecha a banca e distribui o elixir de graça, pelo calor.',
          cronica: '{nome} viu medo no mascate, e ele deu o elixir de graça.',
          efeitos: { lacos: 1, item: 'xarope' },
        },
        falha: {
          texto: 'O mascate percebe que você percebeu e muda de assunto com tanta graça que a fila aplaude. Ele vende mais dez vidros por sua causa.',
          cronica: '{nome} desafiou o mascate e ajudou a vender mais dez vidros.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'maleta',
        rotulo: 'Tratar a velha do segundo vidro',
        requer: { item: 'maleta' },
        livre: true,
        resultado: {
          texto: 'Você senta a velha no degrau, dá água e um sal de frutas da maleta, e conversa até a cor voltar. A fila assiste. Ninguém mais compra nada. O mascate fecha a banca olhando feio para você.',
          cronica: '{nome} tratou uma velha bêbada de elixir, e a fila do mascate se desfez.',
          efeitos: { lacos: 1 },
        },
      },
      {
        id: 'semRecursos',
        rotulo: 'Contar que você também já vendeu',
        requer: { antecedente: 'semRecursos' },
        livre: true,
        resultado: {
          texto: 'Você conta à fila, alto, do mês em que a conta não fechou e você vendeu xarope de açúcar com corante como remédio. Dói dizer. A fila se desfaz. O mascate, sem graça, lhe paga um café.',
          cronica: '{nome} confessou no coreto que já tinha vendido remédio de mentira, e a fila do mascate se desfez.',
          efeitos: { lacos: 1, sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's1-banda',
    ato: 1,
    titulo: 'A banda que toca a noite inteira',
    texto:
      'A Lira Pedra-Funda, a banda da vila, resolveu tocar no coreto a noite inteira para ninguém dormir. Já estão no terceiro dobrado e começam a falhar. O maestro, Seu Aristeu, adormeceu de pé com a batuta no ar, de olho aberto, e os músicos não sabem se param, se continuam ou se alguém o acorda.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Pegar o bumbo',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'Você pendura o bumbo no peito e bate o tempo, forte, como coração. A banda se agarra ao seu ritmo. Seu Aristeu pisca no quarto compasso, olha a batuta na mão e rege como se nunca tivesse parado.',
          cronica: '{nome} bateu o bumbo da Lira Pedra-Funda até o maestro acordar regendo.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O bumbo pesa mais que você pensava e o tempo foge do seu braço. A banda desanda, e no silêncio feio que fica o sino toca lá embaixo, sozinho.',
          cronica: '{nome} desandou a banda no bumbo, e o sino tocou no silêncio.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Escolher a música certa',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: 'Você pede o dobrado da festa do padroeiro da Pedra-Funda, o que a banda tocava antes da água. Os velhos músicos se olham. Tocam. Seu Aristeu acorda na segunda frase e chora regendo, e a praça toda fica.',
          cronica: '{nome} pediu à banda o dobrado da festa da Pedra-Funda, e o maestro acordou chorando.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Você pede uma marcha alegre, e ela sai triste, arrastada, quase de enterro. Os músicos param sozinhos, sem saber por quê.',
          cronica: '{nome} pediu uma marcha alegre que saiu de enterro.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Puxar a praça para dançar',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Você tira a dona da pensão para dançar, e depois a filha dela, e depois o delegado. Em cinco minutos a praça dança, e a banda toca melhor com gente na frente. Seu Aristeu acorda para não perder a festa.',
          cronica: '{nome} pôs a praça para dançar, e o maestro acordou para não perder a festa.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ninguém quer dançar com o lago ali embaixo. Você dança sozinho um pedaço de valsa, debaixo de olhares, e desiste.',
          cronica: '{nome} dançou sozinho na praça.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'violao',
        rotulo: 'Entrar na banda com o violão',
        requer: { item: 'violao' },
        livre: true,
        resultado: {
          texto: 'Violão não é instrumento de banda, mas você entra assim mesmo, fazendo a baixaria, e a banda acha graça e acompanha. Seu Aristeu acorda rindo e lhe passa a batuta por um dobrado inteiro.',
          cronica: '{nome} entrou com o violão na Lira Pedra-Funda e regeu um dobrado inteiro.',
          efeitos: { lacos: 1, brasa: -1 },
        },
      },
      {
        id: 'aliado',
        rotulo: 'Acenar para o compadre do trombone',
        requer: { antecedente: 'aliado' },
        livre: true,
        resultado: {
          texto: 'O trombonista é seu compadre e entende o aceno: sopra uma nota comprida e desafinada bem no ouvido do maestro. Seu Aristeu acorda pulando, rege com raiva, e a praça morre de rir.',
          cronica: '{nome} pediu ao compadre do trombone que acordasse o maestro com uma nota desafinada.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
];
