/**
 * O Sino Afogado, ato 2: A Margem. Noite, lama rachada, eucalipto, sapo e
 * neblina. Dificuldades das abertas entre 5 e 9.
 */

export const itens = {};

export const companheiros = {};

export const inimigos = {};

export const cenas = [
  {
    id: 's2-estrada',
    ato: 2,
    titulo: 'A estrada rachada',
    texto:
      'A estrada que desce o morro até a margem rachou com a seca: uma fenda de dois palmos corre pelo meio, e um pedaço inteiro do barranco cedeu para o lado do lago. Lá embaixo, a lama brilha de lua. Mais acima, uma trilha de boi some entre o capim, e a chama da vela deita para lá.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Descer pelo barranco',
        teste: { chave: 'agilidade', dificuldade: 6 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Você desce de lado, de calcanhar, agarrando tufo de capim e raiz. Chega lá embaixo sujo até o joelho e com a vela acesa, bem antes de quem fosse pela estrada.',
          cronica: '{nome} desceu o barranco rachado de calcanhar, com a vela acesa.',
        },
        falha: {
          texto: 'O barranco desce junto com você. Você chega à margem rolando, com terra na boca, protegendo a vela com o corpo e deixando o resto apanhar.',
          cronica: '{nome} rolou barranco abaixo protegendo a vela com o corpo.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Lembrar a estrada velha',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['mapa'],
        sucesso: {
          texto: 'Antes da represa havia outra estrada, de carro de boi, que a água cobriu. Com o lago baixo, ela está ali de novo: as pedras de calçamento aparecem na lama como dentes. Você desce por ela, firme e seco.',
          cronica: '{nome} desceu à margem pela estrada velha que a seca devolveu.',
        },
        falha: {
          texto: 'Você acha a estrada velha, mas ela acaba num atoleiro que engole a sua bota até a canela. Para tirar, leva tempo e paciência que você não tem.',
          cronica: '{nome} atolou na estrada velha da Pedra-Funda.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ir para onde a chama deita',
        teste: { chave: 'fe', dificuldade: 6 },
        sucesso: {
          texto: 'Você segue a chama como quem segue um cão: quando ela deita, você vira. A trilha de boi faz curvas que não têm razão nenhuma e termina na margem, num ponto seco, a passos de onde você queria estar.',
          cronica: '{nome} desceu à margem seguindo para onde a chama da vela deitava.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'A chama deita para todo lado, porque venta de todo lado. Você roda o capim por muito tempo e chega lá embaixo com a vela bem mais curta.',
          cronica: '{nome} rodou o capim seguindo uma chama que não sabia o caminho.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Ler a terra rachada',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'Fenda que range ainda vai ceder; fenda com capim dentro já cedeu tudo o que tinha. Você pisa só nas velhas e chega à margem pelo caminho mais curto que há, com tempo sobrando.',
          cronica: '{nome} leu as rachaduras da estrada e desceu pelo caminho mais curto.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'Você escolhe a fenda errada para pular. Ela abre mais um palmo debaixo do seu pé, e você fica um tempo pendurado na beirada.',
          cronica: '{nome} pulou na fenda errada da estrada rachada.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's2-moura',
    ato: 2,
    titulo: 'A casa de máquinas',
    texto:
      'O Engenheiro Moura mora sozinho na casa de máquinas da represa, entre turbinas que ninguém liga há anos. Foi ele quem leu em voz alta a ordem de encher o lago. A porta de ferro está trancada por dentro, mas há luz. Na parede da sala, pela janela, você vê emoldurada uma planta da velha Pedra-Funda.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Forçar a porta de ferro',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'A tranca salta e a porta corre com um grito de ferrugem. O engenheiro, velho e de pijama, recua até a parede, com medo de você. Você pega a planta da moldura e sai sem ouvir o que ele diz.',
          cronica: '{nome} arrombou a casa de máquinas da represa e levou a planta da Pedra-Funda.',
          efeitos: { item: 'planta', sanidade: -1 },
        },
        falha: {
          texto: 'A porta não cede e o barulho ecoa nas turbinas lá dentro como um sino. A luz apaga. Ninguém abre, e você desiste com o ombro roxo.',
          cronica: '{nome} bateu o ombro na porta da casa de máquinas, e a luz lá dentro apagou.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Falar a língua dele',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        sucesso: {
          texto: 'Você fala pela janela de cota, de vazão, de quanto a seca baixou o nível. Ele abre para corrigir os seus números, como todo engenheiro. Acaba lhe dando a planta, para você não se perder "naquilo lá embaixo", e pede que você volte para contar.',
          cronica: '{nome} falou de vazão com o Engenheiro Moura e saiu com a planta da Pedra-Funda.',
          efeitos: { item: 'planta', lacos: 1 },
        },
        falha: {
          texto: 'Você erra a primeira conta e ele perde o interesse. "Volta quando souber o que é uma cota", diz, e fecha a janela.',
          cronica: '{nome} errou uma conta na frente do engenheiro da represa.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Perguntar o que ele leu',
        teste: { chave: 'empatia', dificuldade: 7 },
        sucesso: {
          texto: 'Ele abre a porta para não ter que gritar. Senta, olha as mãos e conta: leu a ordem lá na torre, de baixo, para um homem que não quis descer. "Ele disse que sineiro não larga sino. Eu mandei abrir a comporta assim mesmo." Dá a você a planta.',
          cronica: 'O Engenheiro Moura contou a {nome} que mandou abrir a comporta com um homem na torre.',
          efeitos: { item: 'planta', marca: 'retrato', lacos: 1 },
        },
        falha: {
          texto: 'Você pergunta, e ele ri, um riso que não é riso. "Eu li o que mandaram ler." Depois fecha a janela e você fica ouvindo, lá dentro, um homem velho chorar.',
          cronica: '{nome} ouviu o Engenheiro Moura chorar atrás da janela.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'ciencias',
        rotulo: 'Ver o nível no medidor',
        requer: { nivel: { ciencias: 1 } },
        teste: { chave: 'ciencias', dificuldade: 4 },
        sucesso: {
          texto: 'Pela janela, você lê a régua da represa: o lago baixou tanto que a torre está de pé em terra firme. "Dá para chegar a pé", você diz alto, e o engenheiro, surpreso de ouvir alguém entender, abre e lhe entrega a planta.',
          cronica: '{nome} leu a régua da represa, e o engenheiro entregou a planta da Pedra-Funda.',
          efeitos: { item: 'planta', marco: true },
        },
        falha: {
          texto: 'A régua está suja de limo e você lê um metro a mais. O engenheiro corrige pelo vidro, com desprezo, e fecha a cortina.',
          cronica: '{nome} leu errado a régua da represa.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's2-cemiterio',
    ato: 2,
    titulo: 'O cemitério que não mudou',
    texto:
      'A companhia prometeu mudar o cemitério de cima para a Vila Nova, e mudou metade. A outra metade está aqui, na lama da margem: cruzes tortas saindo do barro seco, um anjo de pedra sem cabeça, e no meio, recém-cavada, uma cova vazia do tamanho de um homem. Os sapos pararam de cantar quando você chegou.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Atravessar sem olhar',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'Você atravessa em linha reta, de olho na vela, pulando cruz e pedra. A lama segura o seu pé uma vez, duas, e solta. Do outro lado, os sapos voltam a cantar atrás de você.',
          cronica: '{nome} atravessou o cemitério afogado sem olhar para a cova aberta.',
        },
        falha: {
          texto: 'O pé afunda até o joelho num túmulo mole, e por um momento comprido alguma coisa lá dentro parece segurar. Você puxa com as duas mãos e sai sem a bota.',
          cronica: '{nome} afundou o pé num túmulo da margem e deixou a bota lá.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ler as cruzes',
        teste: { chave: 'percepcao', dificuldade: 7 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'Nome, data, nome, data. Uma cruz de ferro, ao lado da cova vazia, tem a data da enchente e o lugar do nome raspado a faca. Embaixo, alguém gravou bem pequeno um sino. A cova é para ele, e nunca teve dono.',
          cronica: '{nome} achou no cemitério afogado a cruz sem nome com um sino gravado.',
          efeitos: { marca: 'retrato' },
        },
        falha: {
          texto: 'As letras dançam na luz da vela. Por um instante, numa das cruzes, você lê o seu próprio nome. Pisca. Não era. Mas era a sua letra.',
          cronica: '{nome} leu o próprio nome numa cruz do cemitério afogado.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Rezar pelos que ficaram',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você ajoelha na beira da cova vazia e reza um pai-nosso pelos que a companhia esqueceu de mudar. Os sapos voltam, um por um. A cova, quando você levanta, parece só uma cova.',
          cronica: '{nome} rezou na beira da cova vazia pelos mortos que ninguém mudou.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'A reza falha na metade, e no silêncio você ouve, de dentro da cova vazia, alguém terminar o pai-nosso por você, em voz baixa.',
          cronica: 'No cemitério afogado, alguém terminou a reza de {nome}.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'suporte',
        rotulo: 'Encomendar as almas',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'Você canta a encomendação das almas, do jeito da sua avó, batendo matraca na palma da mão. As cruzes da margem parecem ficar mais retas. Uma coruja pousa no anjo sem cabeça e fica olhando você ir.',
          cronica: '{nome} encomendou as almas do cemitério afogado como fazem as benzedeiras.',
          efeitos: { marco: true, sanidade: 1 },
        },
        falha: {
          texto: 'A encomendação pede mais do que você tem. Você termina tonto, sentado numa lápide, sem lembrar a última estrofe.',
          cronica: '{nome} esqueceu a última estrofe da encomendação das almas.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's2-luzia',
    ato: 2,
    titulo: 'A canoa encalhada',
    texto:
      'Luzia, a pescadora, está tentando arrastar a canoa dela da lama até o que sobrou de água, sozinha, de pé no barro até as coxas. O lago fugiu da casa dela e levou o peixe. "Com o lago baixo eu sei onde fica cada telhado da Pedra-Funda", diz, sem parar de puxar. "Mas não com a canoa atolada."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Puxar a canoa com ela',
        teste: { chave: 'forca', dificuldade: 7 },
        ajudantes: [{ nome: 'Luzia', nivel: 1 }],
        sucesso: {
          texto: 'Dois puxões juntos, no mesmo grito, e a canoa sai da lama com um estalo de beijo. Luzia ri pela primeira vez na semana. "Leva", diz, e empurra o remo para você. "Me devolve com a vila acordada."',
          cronica: '{nome} desatolou a canoa de Luzia, e ela a emprestou para descer o lago.',
          efeitos: { item: 'canoa', lacos: 1 },
        },
        falha: {
          texto: 'A canoa não sai e você cai sentado no barro. Luzia ri, mas não de alegria. "Deixa", diz. "Vai a pé, que a pé ainda dá."',
          cronica: '{nome} caiu sentado no barro tentando desatolar a canoa de Luzia.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar água pelo reflexo',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        sucesso: {
          texto: 'Onde a lua brilha mais lisa, tem água por baixo. Você aponta um fio de lago que corre a vinte passos, e as duas arrastam a canoa até lá pela parte firme. Luzia lhe dá um gole de café do cantil.',
          cronica: '{nome} achou com Luzia um fio de água para a canoa dela.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O brilho que você apontou é lama molhada. As duas atolam juntas, rindo de nervoso, e saem de lá cobertas até o peito.',
          cronica: '{nome} e Luzia atolaram juntos no lago seco.',
          efeitos: { brasa: -1, vida: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Pedir que ela venha junto',
        teste: { chave: 'presenca', dificuldade: 7 },
        sucesso: {
          texto: 'Você diz que vai até a torre. Luzia larga a corda da canoa, enxuga a mão na calça e pega a lanterna dela. "Meu pai foi no último barco da enchente", diz. "Eu devo isso a alguém lá embaixo."',
          cronica: 'Luzia, a pescadora, largou a canoa para descer com {nome} até a torre.',
          efeitos: { companheiro: 'luzia', lacos: 1 },
        },
        falha: {
          texto: '"Lá embaixo é coisa de afogado", diz ela, e volta a puxar a canoa. Você fica um tempo olhando, sem saber ajudar, e segue.',
          cronica: 'Luzia não quis descer à torre com {nome}.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Fazer a canoa deslizar',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'Você corta capim e forra o barro na frente da quilha, como se faz na seca. A canoa desliza como em água. Luzia lhe dá o remo e um tapa nas costas. "Esse é dos meus", diz, e vem junto.',
          cronica: '{nome} fez a canoa de Luzia deslizar no capim, e ela desceu com ele.',
          efeitos: { item: 'canoa', companheiro: 'luzia' },
        },
        falha: {
          texto: 'O capim está seco demais e esfarela debaixo da quilha. Luzia agradece o esforço e manda você seguir sem ela.',
          cronica: '{nome} não conseguiu fazer a canoa deslizar no capim.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's2-fila',
    ato: 2,
    titulo: 'A fila dos que dormem',
    texto:
      'Pela margem desce uma fila de gente de pijama, devagar, um atrás do outro, de olho aberto. São os onze. Ninguém pisa em falso, ninguém faz barulho. Vão para a torre. Na frente de todos, muito à frente, um homem magro de chapéu de palha, que não deixa pegada na lama, olha para trás de vez em quando, como quem conta.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Andar contra a fila',
        teste: { chave: 'resistencia', dificuldade: 7 },
        sucesso: {
          texto: 'Você anda contra eles, ombro a ombro, virando cada um de costas para a torre com a mão no peito. Eles param ali, quietos, como quem espera ônibus. O homem de chapéu olha para você um tempo e some na neblina.',
          cronica: '{nome} andou contra a fila dos que dormem e virou os onze de costas para a torre.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Eles não empurram, mas também não param. São onze, e o passo deles carrega o seu. Quando você se dá conta, desceu cem metros na fila, de olho aberto, e não lembra de ter decidido.',
          cronica: '{nome} foi levado cem metros pela fila dos que dormem.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Contar quantos são',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Onze, e um na frente. O da frente não está na lista da vila. Você grita para ele: "O senhor não é daqui!" O homem de chapéu para, tira o chapéu para você, devagar, e a fila inteira para junto, e senta na lama.',
          cronica: '{nome} contou a fila dos que dormem e viu que o da frente não era da vila.',
          efeitos: { lacos: 1, sanidade: -1 },
        },
        falha: {
          texto: 'Você conta onze, depois doze, depois treze. Cada vez que conta tem mais um. Para de contar antes que o próximo seja você.',
          cronica: '{nome} contou a fila dos que dormem, e a conta não parava de crescer.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ficar fora da fila',
        teste: { chave: 'vontade', dificuldade: 8 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'A fila chama sem dizer nada, e o seu pé quer ir. Você planta os dois na lama e aperta a vela. Eles passam. O último, Dinho, para do seu lado, pisca e pega a sua mão. "Tô com frio", diz. Acordou.',
          cronica: '{nome} ficou fora da fila dos que dormem, e o menino Dinho acordou do lado dele.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você entra na fila sem querer, como quem entra numa conversa. Volta a si com a água fria nos tornozelos, muito longe de onde estava.',
          cronica: '{nome} entrou na fila dos que dormem sem querer, e acordou com os pés na água.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'benzer',
        rotulo: 'Benzer a fila inteira',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 4 },
        sucesso: {
          texto: 'Você corre na frente deles e faz no ar, com a vela, o sinal de fechar caminho. Os onze param na linha da chama. Um por um, sentam na lama e fecham os olhos de verdade, num sono que é só sono.',
          cronica: '{nome} fechou o caminho da fila dos que dormem com o sinal da vela.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'A fila atravessa o seu sinal como se não fosse nada. O homem de chapéu, lá na frente, balança a cabeça, quase com pena de você.',
          cronica: 'O homem de chapéu teve pena da benzeção de {nome}.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
  {
    id: 's2-ponte',
    ato: 2,
    titulo: 'A ponte que voltou',
    texto:
      'A ponte de tábua da Pedra-Funda reapareceu com a seca, por cima do leito do rio velho, que ainda corre fundo e escuro lá embaixo. No meio dela falta um pedaço. Pendurado na beira do buraco, pelos braços, está Seu Alcino, o padeiro, que desceu atrás da filha. Ele não grita: tem medo de acordar o lago.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Puxar pelo braço',
        teste: { chave: 'forca', dificuldade: 7 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Você deita na tábua, pega o pulso dele com as duas mãos e puxa. O padeiro é pesado de tanto provar massa. Ele sobe, abraça você em cima da ponte e chora de nariz no seu ombro.',
          cronica: '{nome} puxou Seu Alcino, o padeiro, do buraco da ponte velha.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A tábua em que você deita também cede. Os dois descem meio metro juntos, e só não caem porque o padeiro acha um prego com a mão. Você sobe primeiro, ele depois, ambos sangrando.',
          cronica: '{nome} e o padeiro quase caíram juntos no rio velho.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Firmar uma tábua de alavanca',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['alavanca', 'corda'],
        sucesso: {
          texto: 'Você tira uma tábua solta do parapeito, passa por baixo do braço dele e apoia na viga. Uma alavanca de pobre. O padeiro rola para cima devagar, sem que você precise ser forte.',
          cronica: '{nome} tirou Seu Alcino do buraco da ponte com uma tábua de alavanca.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A tábua escorrega e cai no rio. O barulho da água lá embaixo é alto demais, e o sino, longe, responde. O padeiro sobe sozinho, de susto, com as unhas.',
          cronica: '{nome} derrubou uma tábua no rio velho, e o sino respondeu.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Dizer onde ele põe o pé',
        teste: { chave: 'lideranca', dificuldade: 7 },
        sucesso: {
          texto: 'Você fala com voz de comando, devagar: mão direita no prego, pé esquerdo na viga, agora o joelho. Ele obedece como quem amassa pão, sem pensar. Sobe sozinho, inteiro, e ainda pergunta pela filha.',
          cronica: '{nome} guiou Seu Alcino para fora do buraco da ponte só com a voz.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ele não ouve você direito e pisa onde não devia. Fica pendurado por uma mão só, e você precisa se arriscar para puxá-lo.',
          cronica: '{nome} se arriscou na ponte velha por um padeiro que não ouviu.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Ir pela viga',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 3 },
        sucesso: {
          texto: 'Por baixo da ponte corre uma viga da largura de um pé. Para quem anda em arame, é calçada. Você vai por ela, por baixo do padeiro, e o empurra para cima pelos sapatos.',
          cronica: '{nome} andou na viga por baixo da ponte velha e empurrou o padeiro para cima.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'A viga é de madeira molhada, não de arame. Você escorrega e fica pendurado ao lado do padeiro, e é ele quem acha graça.',
          cronica: '{nome} ficou pendurado na ponte velha ao lado do padeiro.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 's2-barco',
    ato: 2,
    titulo: 'O lampião no barco',
    texto:
      'Um barco de fundo chato está encalhado na lama, inclinado, com um lampião aceso pendurado no mastro. Não há ninguém. O querosene parece não acabar nunca. Pelo casco, em letras de tinta descascada, "Último Barco". Na cabine, aberto em cima do banco, um caderno de capa dura com a letra de um barqueiro.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir no barco inclinado',
        teste: { chave: 'destreza', dificuldade: 6 },
        sucesso: {
          texto: 'Você sobe pela borda, de quatro, contra a inclinação. Lá dentro, além do caderno, há um lampião reserva, cheio, embrulhado em oleado, como se alguém tivesse deixado para você.',
          cronica: '{nome} subiu no Último Barco e achou um lampião embrulhado, cheio.',
          efeitos: { item: 'lampiao' },
        },
        falha: {
          texto: 'O barco gira na lama com o seu peso e você escorrega de volta, de costas. O lampião do mastro balança e não apaga, e isso é pior.',
          cronica: '{nome} escorregou do Último Barco, e o lampião de ninguém continuou aceso.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ler o caderno do barqueiro',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'O barqueiro anotava as famílias que levava, viagem por viagem. A última linha, do dia da enchente: "Fui à torre três vezes. Ele não quis vir. Deixei o lampião para ele." A página tem um sino desenhado na margem.',
          cronica: '{nome} leu o caderno do Último Barco: o barqueiro foi à torre três vezes.',
          efeitos: { marca: 'retrato' },
        },
        falha: {
          texto: 'A letra está borrada de água velha. Você lê nomes de famílias, viagens, e no fim uma linha que diz só "não quis". Quem não quis o quê, a água levou.',
          cronica: '{nome} leu o caderno do Último Barco e só entendeu "não quis".',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Apagar o lampião de ninguém',
        teste: { chave: 'vontade', dificuldade: 7 },
        sucesso: {
          texto: 'Você sobe, abre o vidro e sopra. A chama resiste, como quem pede, e depois apaga. Toda a margem fica mais escura e, de algum jeito, mais leve. Você desce com o lampião vazio, que é seu agora.',
          cronica: '{nome} apagou o lampião que ardia sozinho no Último Barco.',
          efeitos: { item: 'lampiao', marco: true },
        },
        falha: {
          texto: 'Você sopra e a chama não se mexe. A sua vela, sim: deita, treme e quase apaga. Você desce do barco depressa, de mão em concha, sem olhar para trás.',
          cronica: 'O lampião do Último Barco quase apagou a vela de {nome}.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'barqueiro',
        rotulo: 'Reconhecer o barco',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Na vila todo mundo sabe de quem era o Último Barco, e você sabe também: do velho que lhe ensinou a remar. Na cabine, o caderno dele termina numa linha sobre a torre e um homem que não quis vir.',
          cronica: '{nome} reconheceu o Último Barco e leu a última linha do velho que o ensinou a remar.',
          efeitos: { marca: 'retrato', sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's2-neblina',
    ato: 2,
    titulo: 'A neblina fria',
    texto:
      'A neblina sobe do lago de uma vez, grossa como algodão molhado, e o frio vem junto, um frio de dentro da água, que não tem nada a ver com a noite de seca. Em cinco passos você não vê a própria mão. A chama da vela encolhe até virar um ponto azul.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Aguentar o frio andando',
        teste: { chave: 'resistencia', dificuldade: 7 },
        sucesso: {
          texto: 'Você fecha a gola, cerra os dentes e anda. O frio entra pelos ossos e não acha ninguém em casa. Do outro lado da neblina, a chama volta a ficar amarela, como se respirasse.',
          cronica: '{nome} atravessou a neblina fria do lago de dentes cerrados.',
        },
        falha: {
          texto: 'O frio pega nos dedos primeiro, depois nos joelhos. Você sai da neblina tremendo tanto que a vela pinga cera na sua mão, e você nem sente.',
          cronica: '{nome} saiu da neblina do lago tremendo de um frio de afogado.',
          efeitos: { vida: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Andar pelo som da água',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Você fecha os olhos, que não servem para nada, e escuta. À esquerda, o fio de rio. À frente, o sapo. Atrás, o sino. Você anda com o sino sempre às costas e sai da neblina onde queria.',
          cronica: '{nome} saiu da neblina andando pelo som da água, com o sino às costas.',
        },
        falha: {
          texto: 'Na neblina, os sons trocam de lugar. O sino toca na sua frente, depois do lado, depois dentro do ouvido. Você anda em círculo até a neblina cansar de você.',
          cronica: '{nome} andou em círculos na neblina, com o sino trocando de lugar.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Chamar o próprio nome',
        teste: { chave: 'fe', dificuldade: 7 },
        sucesso: {
          texto: 'Você diz o seu nome em voz alta, como quem chama alguém perdido. E repete, e repete. A neblina tem medo de nome dito com vontade. Ela se abre um palmo em volta de você, e mais nada.',
          cronica: '{nome} atravessou a neblina dizendo o próprio nome em voz alta.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Você chama o seu nome e a neblina devolve, de longe, numa voz que não é a sua. Você não chama mais.',
          cronica: 'A neblina devolveu o nome de {nome} numa voz que não era a dele.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'chama',
        rotulo: 'Abrir a neblina com a chama',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 4 },
        sucesso: {
          texto: 'Você põe a mão em cima da chama como sua avó punha em cima da água da febre, e pede. A chama cresce, amarela, e a neblina recua três passos para todo lado, como bicho com medo de fogo.',
          cronica: '{nome} abriu a neblina do lago fazendo a chama da vela crescer.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'A chama cresce demais, lambe o pavio e encolhe de novo. Você ganhou três passos de claro e perdeu um dedo de vela.',
          cronica: '{nome} fez a chama crescer demais na neblina e gastou a vela.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's2-cavalo',
    ato: 2,
    titulo: 'O cavalo do leiteiro',
    texto:
      'O cavalo do leiteiro desceu sozinho, atrás do sino, e atolou até a barriga na lama da margem. Relincha baixo, de olho branco. Tonico, o leiteiro, um rapaz magro de chapéu na mão, puxa a rédea chorando, sem força nenhuma. Se o cavalo deitar, não levanta mais.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Empurrar por trás',
        teste: { chave: 'manipulacaoPeso', dificuldade: 7 },
        ajudantes: [{ nome: 'Tonico', nivel: 1 }],
        sucesso: {
          texto: 'Você entra na lama até a cintura e empurra a anca do cavalo, enquanto Tonico puxa. Um tranco, dois. O cavalo sai com um gemido e fica de pé tremendo, coberto de barro. Tonico abraça o pescoço dele e você.',
          cronica: '{nome} empurrou o cavalo do leiteiro para fora da lama.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O cavalo escoiceia na lama e acerta a sua coxa. Ele sai sozinho, de pânico, e você fica lá, preso até a cintura, até Tonico voltar com uma tábua.',
          cronica: '{nome} levou um coice do cavalo do leiteiro na lama da margem.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Forrar o barro com galho',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['alavanca', 'corda'],
        sucesso: {
          texto: 'Você e Tonico cortam galho de eucalipto e forram a lama na frente do cavalo, até ele ter onde apoiar as patas. Ele sai sozinho, passo por passo, como quem sobe escada.',
          cronica: '{nome} forrou a lama com galhos, e o cavalo do leiteiro saiu sozinho.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Os galhos afundam um atrás do outro. Quando o cavalo sai, de tanto lutar, já é bem mais tarde, e ele sai mancando.',
          cronica: '{nome} gastou a noite forrando lama com galhos que afundavam.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Acalmar o cavalo',
        teste: { chave: 'vontade', dificuldade: 6 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Você chega perto da cabeça, devagar, fala qualquer coisa num tom baixo e põe a mão na testa dele. O olho branco fecha. Quieto, o cavalo para de afundar, e os dois o tiram dali sem pressa.',
          cronica: '{nome} acalmou o cavalo atolado, e ele parou de afundar.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O cavalo sente o seu medo e joga a cabeça. Leva um pedaço da sua orelha com a rédea. Tonico pede desculpa por ele.',
          cronica: 'O cavalo atolado cortou a orelha de {nome} com a rédea.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'lidarAnimais',
        rotulo: 'Ensinar o cavalo a nadar no barro',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        sucesso: {
          texto: 'Cavalo atolado tem de deitar de lado e rolar, não lutar. Você o convence, de mão no pescoço. Ele rola, sai, levanta. Tonico olha para você como para um santo e lhe dá um litro de leite ainda morno.',
          cronica: '{nome} ensinou o cavalo do leiteiro a sair rolando da lama.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'O cavalo não confia. Você desiste antes que ele se machuque, e os dois o tiram dali na força, tarde e mal.',
          cronica: 'O cavalo do leiteiro não confiou em {nome}.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'aliado',
        rotulo: 'Gritar pela turma do compadre',
        requer: { antecedente: 'aliado' },
        livre: true,
        resultado: {
          texto: 'O seu compadre tem rancho ali perto e acorda com o grito. Vêm ele, os dois filhos e uma corda de laçar boi. Em dez minutos o cavalo está de pé, e Tonico quer pagar a todos em leite.',
          cronica: '{nome} chamou a turma do compadre, e o cavalo do leiteiro saiu da lama na corda de laçar.',
          efeitos: { lacos: 1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's2-candida',
    ato: 2,
    titulo: 'O café de Dona Cândida',
    texto:
      'Num rancho de pescador, à beira da lama, uma senhora de xale acena da porta. Dona Cândida. Tem café no fogo, broa na mesa e uma cama feita com lençol de linho. "Senta, que você está com cara de cansado", diz. "Ninguém vem me ver desde a enchente." Ela não pisca. O café cheira muito bem.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Beber o café e aguentar',
        teste: { chave: 'saude', dificuldade: 7 },
        sucesso: {
          texto: 'O café é forte e doce, e o sono vem atrás dele, macio como lençol. Você aguenta. Belisca a própria perna por baixo da mesa e agradece a broa. Dona Cândida parece decepcionada, depois parece aliviada.',
          cronica: '{nome} tomou o café de Dona Cândida e não dormiu.',
          efeitos: { item: 'unguento' },
        },
        falha: {
          texto: 'Você cochila na cadeira, um minuto, dois. Acorda com a vela inclinada pingando no chão e Dona Cândida de pé ao seu lado, olhando, sem piscar.',
          cronica: '{nome} cochilou no rancho de Dona Cândida.',
          efeitos: { sanidade: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Notar o que está errado',
        teste: { chave: 'percepcao', dificuldade: 7 },
        sucesso: {
          texto: 'O lençol está seco, mas a barra da saia dela está molhada. Há duas xícaras na mesa e a outra tem café frio de muito tempo. Você recusa a cama com educação. Ela entende. "Meu irmão também nunca quis sentar", diz.',
          cronica: '{nome} recusou a cama de Dona Cândida, e ela falou de um irmão que nunca quis sentar.',
          efeitos: { marca: 'retrato' },
        },
        falha: {
          texto: 'Você não nota nada de errado, só que a cama é boa. Senta na beirada para tirar a bota. Quando percebe, já está deitado, e a vela está no chão.',
          cronica: '{nome} sentou na cama de Dona Cândida e quase não levantou.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ouvir e ir embora com carinho',
        teste: { chave: 'empatia', dificuldade: 7 },
        sucesso: {
          texto: 'Você toma meia xícara e ouve. Ela fala do irmão que tocava o sino, que era teimoso e bom. Não diz o nome, que ninguém diz. Quando você levanta, ela beija a sua testa. "Diz a ele que eu esperei", pede.',
          cronica: 'Dona Cândida contou a {nome} do irmão que tocava o sino, e pediu um recado.',
          efeitos: { marca: 'retrato', lacos: 1 },
        },
        falha: {
          texto: 'Você ouve tanto que esquece de ir. A conversa dela não acaba, e o sono vai chegando pela beira dos olhos. Você sai de repente, quase grosseiro, e ela chora na porta.',
          cronica: '{nome} saiu às pressas do rancho de Dona Cândida e a deixou chorando.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Cheirar o café',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        sucesso: {
          texto: 'Tem flor de maracujá e casca de mulungu no café, o bastante para derrubar um boi. Você troca a xícara pela de água sem ela ver e ouve a história dela acordado. Ela fala de um irmão sineiro.',
          cronica: '{nome} sentiu o mulungu no café de Dona Cândida e ouviu a história do irmão sineiro acordado.',
          efeitos: { marca: 'retrato', marco: true },
        },
        falha: {
          texto: 'O cheiro é bom demais para você desconfiar. Você só percebe o mulungu no segundo gole, e sai do rancho tropeçando.',
          cronica: '{nome} bebeu café com mulungu no rancho da margem.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'suporte',
        rotulo: 'Benzer a tristeza dela',
        requer: { nivel: { magiaSuporte: 1 } },
        livre: true,
        custo: { magia: -1 },
        resultado: {
          texto: 'Você põe a mão na cabeça branca dela e reza a reza de tirar tristeza parada. Dona Cândida pisca, pela primeira vez, e chora. "Meu irmão tocava o sino", diz. "Fazia trinta anos que eu não conseguia chorar por ele."',
          cronica: '{nome} benzeu a tristeza de Dona Cândida, e ela chorou pelo irmão sineiro.',
          efeitos: { lacos: 1, marca: 'retrato' },
        },
      },
    ],
  },
  {
    id: 's2-eucaliptal',
    ato: 2,
    titulo: 'As vozes no eucaliptal',
    texto:
      'A companhia plantou eucalipto em fileiras retas por toda a encosta, e de noite cada fileira é igual à outra. O caminho para a margem passa pelo meio. Entre os troncos, de longe, vozes chamam nomes: Maria, Joaquim, Benedito, Rosa. Nomes de gente que morava lá embaixo. De vez em quando, o seu.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Correr em linha reta',
        teste: { chave: 'fisico', dificuldade: 7 },
        sucesso: {
          texto: 'Fileira é fileira: se você não virar, sai do outro lado. Você corre sem virar a cabeça, com os nomes passando dos dois lados, e sai do eucaliptal ofegante, de frente para o lago.',
          cronica: '{nome} atravessou o eucaliptal correndo em linha reta, sem virar para os nomes.',
        },
        falha: {
          texto: 'No meio da corrida uma voz diz o seu nome perto demais, e você vira. Quando olha de novo para a frente, todas as fileiras são a mesma, e leva tempo para achar de onde veio.',
          cronica: '{nome} virou a cabeça no eucaliptal e se perdeu nas fileiras.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Contar as fileiras',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['mapa'],
        sucesso: {
          texto: 'A companhia plantou de cinco em cinco metros, e o lago fica a noventa e oito fileiras da estrada. Você conta em voz alta, para cobrir as vozes, e sai na nonagésima oitava, exatamente onde devia.',
          cronica: '{nome} saiu do eucaliptal contando as fileiras em voz alta.',
        },
        falha: {
          texto: 'Lá pela quinquagésima fileira, uma das vozes começa a contar junto com você, um número à frente. Você perde a conta e o rumo.',
          cronica: 'No eucaliptal, uma voz contou as fileiras junto com {nome}.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Não responder a nenhuma voz',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Seu nome vem de trás, de cima, de dentro de um tronco. Você não responde. A vela não treme. As vozes vão ficando mais baixas, como quem desiste, até sobrar só o vento no eucalipto.',
          cronica: '{nome} atravessou o eucaliptal sem responder a nenhuma voz.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Uma voz chama com o jeito exato da sua mãe. Você responde antes de pensar. As outras vozes calam de uma vez, todas juntas, e esse silêncio é o pior de tudo.',
          cronica: '{nome} respondeu a uma voz no eucaliptal, e todas as outras calaram.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'tiao',
        rotulo: 'Deixar Tião ir na frente',
        requer: { companheiro: 'tiao' },
        livre: true,
        resultado: {
          texto: 'Tião não ouve voz nenhuma. Vai na frente, assobiando sem som, chutando pedra, e você vai atrás com a mão no ombro dele. Na saída do eucaliptal ele pergunta por sinais por que você está tão pálido.',
          cronica: 'Tião, que não ouve, guiou {nome} pelo eucaliptal das vozes.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 's2-comporta',
    ato: 2,
    titulo: 'A comporta',
    texto:
      'Na barragem, Seu Dirceu, o guarda da represa, está com as duas mãos no volante da comporta de cima. Quer soltar a água que sobrou na barragem para afogar a torre de novo e calar o sino. Lá embaixo, na margem, os onze que dormem estão parados na lama, bem no caminho da água.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Segurar o volante',
        teste: { chave: 'forca', dificuldade: 8 },
        sucesso: {
          texto: 'Você agarra o volante do outro lado e segura. Os dois ficam ali, braço contra braço, até Seu Dirceu cansar, sentar no chão de concreto e cobrir o rosto. A comporta fica fechada.',
          cronica: '{nome} segurou a comporta da represa contra o guarda que queria afogar a torre.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ele gira meia volta antes de você conseguir travar. Um jorro de água desce a barragem e corre para a margem. Lá embaixo, alguém grita.',
          cronica: '{nome} não segurou a comporta a tempo, e a água desceu para a margem.',
          efeitos: { sanidade: -2, vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Travar o mecanismo',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Volante de comporta tem pino de trava, para manutenção. Você acha o pino pendurado na corrente, enfia no furo e pronto: nem dez Dirceus giram aquilo. Ele olha, olha você, e solta. Depois agradece, baixinho, por não ter deixado.',
          cronica: '{nome} travou a comporta da represa com o pino de manutenção.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você procura a trava no lugar errado enquanto ele gira. Quando acha, já desceu água o bastante para molhar os onze até o joelho. Eles nem se mexem.',
          cronica: '{nome} demorou a achar a trava da comporta.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Mostrar quem está lá embaixo',
        teste: { chave: 'lideranca', dificuldade: 7 },
        sucesso: {
          texto: 'Você aponta a lanterna para a margem e diz os nomes: Juvenal, Nair, o menino Dinho. "Seu Dirceu, eles estão lá." O guarda solta o volante como se queimasse e vem com você até a escada.',
          cronica: '{nome} mostrou ao guarda da represa quem estava no caminho da água.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: '"Eles já foram", diz Seu Dirceu. "Quem esquece o nome já foi." Ele não gira o volante, mas também não sai de perto. Você o deixa lá, de guarda, sem saber o que ele vai fazer.',
          cronica: '{nome} deixou o guarda da represa de mão no volante da comporta.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'boaFama',
        rotulo: 'Chamar o guarda pelo apelido',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: '"Dirceu Bigode", você diz, como na pescaria de domingo. Ele ri sem querer, e o riso derruba a coragem dele. Larga o volante e vem chorar no seu ombro.',
          cronica: '{nome} chamou o guarda da represa pelo apelido, e ele largou a comporta.',
          efeitos: { lacos: 1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Ir pela crista da barragem',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 3 },
        sucesso: {
          texto: 'Você chega por trás dele andando no parapeito da barragem, onde ninguém anda, um palmo de concreto entre a água e o vão. Segura as mãos dele no volante antes que ele perceba. Seu Dirceu solta, assustado, e depois agradece.',
          cronica: '{nome} chegou pela crista da barragem e tirou as mãos do guarda do volante da comporta.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O vento da barragem é mais forte que o do circo. Você desce do parapeito antes de cair, e chega pela escada, tarde, com Dirceu já girando.',
          cronica: '{nome} desistiu da crista da barragem e chegou tarde à comporta.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
    ],
  },
];
