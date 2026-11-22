/**
 * O Sino Afogado, ato 3: A Cidade Afogada. Madrugada, neblina, as ruas da
 * Pedra-Funda saindo da lama. Dificuldades das abertas entre 6 e 11.
 */

export const itens = {};

export const companheiros = {};

export const inimigos = {};

export const cenas = [
  {
    id: 's3-rua',
    ato: 3,
    titulo: 'A rua do comércio',
    texto:
      'A rua do comércio da Pedra-Funda sai da lama inteira, sem nenhum telhado. Pelas portas abertas se vê o balcão da farmácia, a máquina de costura da modista, a mesa posta da pensão com pratos de lama. As placas ainda dizem o nome das lojas. Na neblina as ruas se cruzam de um jeito que você não lembra, e todas descem.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Ir por cima dos muros',
        teste: { chave: 'agilidade', dificuldade: 8 },
        sucesso: {
          texto: 'Lá de cima dos muros a cidade vira um desenho: a praça, o coreto, a igreja no fim de tudo. Você anda de muro em muro, como gato, sem pisar em casa de ninguém, e desce na esquina certa.',
          cronica: '{nome} atravessou a Pedra-Funda por cima dos muros, como gato.',
        },
        falha: {
          texto: 'Um muro de adobe esfarela debaixo de você e você cai dentro de uma sala, numa mesa posta para quatro. Os pratos estão cheios de lama até a borda, e as cadeiras, puxadas, esperando.',
          cronica: '{nome} caiu dentro de uma sala afogada com a mesa posta para quatro.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar a rua da igreja',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['mapa', 'livro'],
        sucesso: {
          texto: 'Cidade velha se faz em volta da igreja: as ruas mais largas vão para ela, as mais estreitas fogem. Você segue sempre a mais larga, de placa em placa, e a torre aparece na neblina no fim da rua da farmácia.',
          cronica: '{nome} achou a rua da igreja afogada pelas placas do comércio.',
        },
        falha: {
          texto: 'Você passa três vezes pela mesma placa de alfaiate. Na terceira, a porta está fechada, e você tem certeza de que nas outras duas estava aberta.',
          cronica: '{nome} passou três vezes pela porta do alfaiate afogado.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Seguir o som do sino',
        teste: { chave: 'fe', dificuldade: 8 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Se o sino chama, que chame. Você vai para onde ele toca, de vela na frente, sem deixar que ele chame mais nada além dos seus pés. A rua acaba na praça, e a praça acaba na igreja.',
          cronica: '{nome} seguiu o sino pelas ruas afogadas sem deixar que ele levasse mais nada.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'O sino chama e você vai, e depois de um tempo não sabe mais se foi você quem decidiu. Acorda andando, numa rua que não leva a lugar nenhum.',
          cronica: '{nome} seguiu o sino até não saber se andava por conta própria.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'planta',
        rotulo: 'Seguir a planta da cidade',
        requer: { item: 'planta' },
        livre: true,
        resultado: {
          texto: 'Com a planta do engenheiro aberta na mão, a Pedra-Funda é só uma cidade. Rua do Rosário, Travessa do Bispo, Largo da Matriz. Você chega à praça pelo caminho mais curto e com a vela inteira.',
          cronica: '{nome} atravessou a Pedra-Funda pela planta do engenheiro, sem errar uma esquina.',
          efeitos: { brasa: 1 },
        },
      },
      {
        id: 'luzia',
        rotulo: 'Deixar Luzia guiar',
        requer: { companheiro: 'luzia' },
        livre: true,
        resultado: {
          texto: 'Luzia conhece cada telhado daqui por baixo, de tanto passar de canoa por cima. "Ali era a farmácia, ali o meu avô cortava cabelo." Ela vai na frente, falando baixo, e as ruas obedecem.',
          cronica: 'Luzia guiou {nome} pela Pedra-Funda dizendo o que era cada casa.',
          efeitos: { marco: true },
        },
      },
    ],
  },
  {
    id: 's3-marina',
    ato: 3,
    titulo: 'A menina na cama de lama',
    texto:
      'Num quarto sem teto, numa cama de ferro que a lama não comeu, uma menina dorme de olho aberto, abraçada a uma boneca de pano. É Marina, a filha do padeiro, que sumiu da Vila Nova ontem. Ela respira, mas devagar demais. A cada badalada do sino, afunda um dedo no colchão de barro.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Arrancar a menina da cama',
        teste: { chave: 'forca', dificuldade: 8 },
        sucesso: {
          texto: 'A lama segura, mas você é mais teimoso. Puxa a menina com cobertor e tudo, de uma vez, e a leva no colo até a rua. Lá fora, Marina tosse, pisca e pergunta pelo pai.',
          cronica: '{nome} arrancou Marina, a filha do padeiro, de uma cama de lama na cidade afogada.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você puxa e a cama puxa de volta. A menina não acorda. Você só consegue tirá-la de lá muito depois, cavando com as mãos, e ela continua de olho aberto no seu colo.',
          cronica: '{nome} cavou a cama de lama com as mãos para tirar Marina, e ela não acordou.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Perguntar o nome da boneca',
        teste: { chave: 'sabedoria', dificuldade: 8 },
        sucesso: {
          texto: 'Quem esqueceu o próprio nome talvez lembre o da boneca. Você pergunta baixinho. A menina mexe a boca: "Filó." E depois, devagar: "Marina." Ela pisca, se encolhe de frio e estende os braços para você.',
          cronica: 'Marina lembrou o nome da boneca e depois o dela, e {nome} a trouxe de volta.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Você pergunta e a boneca responde, com a boca de pano, numa voz que não é de menina. Você leva Marina de lá assim mesmo, sem olhar para a boneca.',
          cronica: 'A boneca de Marina respondeu a {nome} com uma voz que não era de menina.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Cantar a cantiga de ninar',
        teste: { chave: 'vontade', dificuldade: 8 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'Você canta a cantiga do boi da cara preta, que é para fazer dormir, mas canta do jeito ao contrário, para acordar. A menina ri no meio do verso. É o riso mais bonito da madrugada. Ela vem no seu colo.',
          cronica: '{nome} cantou a cantiga do boi da cara preta até Marina rir e acordar.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A cantiga de ninar faz o que foi feita para fazer: dá sono. Você boceja no meio do verso, a vela pende, e por pouco não deita ao lado da menina.',
          cronica: '{nome} quase dormiu cantando cantiga de ninar na cidade afogada.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'suporte',
        rotulo: 'Esquentar o sangue dela',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'Mão no peito, mão na testa, a reza de esquentar criança friorenta. A cor volta às bochechas de Marina. Ela pisca, espirra e pergunta onde está a mãe dela, que é a pergunta certa.',
          cronica: '{nome} esquentou com reza o sangue de Marina, e ela acordou espirrando.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'O frio dela é maior que o calor que você tem. Você treme também, e os dois saem dali gelados, ela no seu colo, de olho aberto.',
          cronica: '{nome} gastou o próprio calor numa menina que não acordou.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'bala',
        rotulo: 'Tirar uma bala da orelha dela',
        requer: { nivel: { prestidigitacao: 1 } },
        livre: true,
        resultado: {
          texto: 'Você tira uma bala de coco da orelha de Marina, devagar, com a mão bem perto do olho aberto dela. O olho acompanha a bala. Depois a boca se mexe: "De novo." Ela acorda querendo mais truque.',
          cronica: '{nome} tirou uma bala de coco da orelha de Marina, e ela acordou pedindo outro truque.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 's3-casa',
    ato: 3,
    titulo: 'A casa do sineiro',
    texto:
      'Ao lado da igreja, uma casinha de duas peças, a única com a porta fechada. Lá dentro, uma mesa posta para um, uma cadeira, um chapéu de palha no prego, seco. Nada aqui tem lama. Na parede, a lápis, a lista de todos os enterros para que ele tocou, com data. A cômoda tem uma gaveta trancada.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Arrombar a gaveta',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'A gaveta salta e espalha no chão o que um homem sozinho guarda: um terço, um retrato de moça, um papel de batismo dobrado em quatro, com o nome rasgado na dobra, de tanto abrir e fechar.',
          cronica: '{nome} arrombou a gaveta do sineiro e achou o papel de batismo dele.',
          efeitos: { marca: 'retrato' },
        },
        falha: {
          texto: 'A cômoda vira com o tranco e cai de frente, e o barulho ecoa na casa como uma badalada. O chapéu cai do prego sozinho. Você sai sem olhar para ele.',
          cronica: '{nome} derrubou a cômoda do sineiro, e o chapéu caiu do prego sozinho.',
          efeitos: { sanidade: -2, vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar a trava da gaveta',
        teste: { chave: 'percepcao', dificuldade: 9 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'Não tem fechadura: tem um prego que trava por dentro, e se solta empurrando o fundo. Lá dentro, dobrado em quatro, um papel de batismo da paróquia velha. Você o guarda junto ao peito, onde fica quente.',
          cronica: '{nome} achou a trava escondida da gaveta do sineiro e guardou o papel de batismo dele.',
          efeitos: { marca: 'retrato', marco: true },
        },
        falha: {
          texto: 'Você procura a trava tanto tempo que começa a ler a lista dos enterros na parede, nome por nome. São muitos. Os últimos três, de letra mais nova, são os seus vizinhos.',
          cronica: 'Na casa do sineiro, {nome} leu na lista dos enterros o nome dos vizinhos.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sentar na cadeira dele',
        teste: { chave: 'fe', dificuldade: 8 },
        sucesso: {
          texto: 'Você senta na única cadeira, de frente para o prato vazio, e espera. Por um tempo, a casa é só uma casa de homem sozinho. Depois o chapéu no prego balança, como quem cumprimenta. Você entende o que é ser esquecido de propósito.',
          cronica: '{nome} sentou na cadeira do sineiro e entendeu o que é ser esquecido de propósito.',
          efeitos: { marca: 'retrato', sanidade: -1 },
        },
        falha: {
          texto: 'Você senta e a cadeira é confortável demais. A vela pesa na mão. Acorda com o pavio quase no fim e o prato da mesa, que estava vazio, cheio de lama.',
          cronica: '{nome} cochilou na cadeira do sineiro, e o prato vazio se encheu de lama.',
          efeitos: { brasa: -2, sanidade: -2 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Ler a lista dos enterros',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 4 },
        sucesso: {
          texto: 'A lista para no dia da enchente. A última linha não é um enterro: é a letra dele, firme, dizendo que tocou pela Pedra-Funda inteira. E assina. A assinatura foi coberta de cal, mas a cal descascou num canto.',
          cronica: '{nome} leu a lista dos enterros do sineiro até a última linha, que ele tocou pela cidade inteira.',
          efeitos: { marca: 'retrato', marco: true },
        },
        falha: {
          texto: 'São centenas de nomes e datas a lápis. Você se perde na conta dos anos, dos mortos, das famílias, e sai da casa com a cabeça cheia de enterro.',
          cronica: '{nome} se perdeu na lista dos enterros do sineiro.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
  {
    id: 's3-coreto',
    ato: 3,
    titulo: 'A banda afogada',
    texto:
      'O coreto da praça velha está atolado até o parapeito, e dentro dele, na lama, os instrumentos da banda de trinta anos atrás: tuba, bombardino, caixa. Ninguém os toca. Mesmo assim, tocam. É o dobrado da festa do padroeiro, e o seu pé começa a marcar o compasso sozinho, puxando você para o lado da água.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Tapar os ouvidos e passar',
        teste: { chave: 'resistencia', dificuldade: 9 },
        sucesso: {
          texto: 'Dedo nos ouvidos, vela no cotovelo, e você atravessa a praça com o dobrado batendo nas costelas. O pé quer dançar e você não deixa. Do outro lado, a música para, como quem perdeu a graça.',
          cronica: '{nome} atravessou a praça afogada de ouvidos tapados enquanto a banda dos mortos tocava.',
        },
        falha: {
          texto: 'Você dança. Não quer, mas dança, um passo para a frente, dois para o lado, sempre em direção à água. Só para quando a lama do lago chega aos joelhos e o frio o acorda.',
          cronica: 'A banda afogada fez {nome} dançar até a beira da água.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o erro da música',
        teste: { chave: 'sabedoria', dificuldade: 9 },
        sucesso: {
          texto: 'É o dobrado da festa, mas tocado de trás para a frente. Você assobia a primeira frase do jeito certo, alto. A banda tropeça, recomeça, tropeça de novo, e se cala no meio de um compasso.',
          cronica: '{nome} assobiou o dobrado do jeito certo, e a banda afogada se calou.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Você procura o erro, e de tanto procurar decora a música. Ela vai tocar na sua cabeça por semanas, de trás para a frente, sempre que você estiver quase dormindo.',
          cronica: '{nome} decorou a música da banda afogada.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Cantar outra coisa por cima',
        teste: { chave: 'vontade', dificuldade: 9 },
        ajuda: ['musica', 'amuleto'],
        sucesso: {
          texto: 'Você canta o hino da Vila Nova, aquele chato da escola, a plenos pulmões. Dois compassos de briga, e a banda perde. A tuba solta um último bufo na lama e o coreto fica quieto.',
          cronica: '{nome} cantou o hino da Vila Nova por cima da banda afogada até ela desistir.',
        },
        falha: {
          texto: 'A sua voz entra no dobrado e vira parte dele. Por um tempo você canta com os mortos, e é bonito, e isso é o que mais assusta depois.',
          cronica: '{nome} cantou com a banda afogada, e achou bonito.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'violao',
        rotulo: 'Acompanhar a banda',
        requer: { item: 'violao' },
        livre: true,
        resultado: {
          texto: 'Você não briga com a música: acompanha. Faz a baixaria do dobrado no violão, do jeito certo, e a banda afogada encontra o rumo. Toca a festa inteira até o fim, e para, satisfeita, como quem agradece.',
          cronica: '{nome} acompanhou no violão a banda afogada até ela terminar a festa.',
          efeitos: { marco: true, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 's3-padre',
    ato: 3,
    titulo: 'O padre de joelhos',
    texto:
      'Padre Olavo desceu atrás de você, sozinho, de batina e lanterna. Está ajoelhado no meio da praça velha, na lama, com o terço arrebentado na mão e as contas espalhadas em volta. Não reza. Olha a torre e mexe a boca sem som. Quando você chega perto, ele diz: "Eu não sei mais o resto da oração."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Levantar o padre',
        teste: { chave: 'forca', dificuldade: 8 },
        sucesso: {
          texto: 'Você o levanta pelos sovacos, como se levanta bêbado de festa, e o põe de pé. Ele se apoia no seu ombro, trêmulo. Depois de alguns passos, sozinho, ele cata as contas do terço da lama, uma por uma.',
          cronica: '{nome} levantou Padre Olavo da lama da praça afogada.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ele está pesado de lama e de medo. Vocês caem juntos. Quando levantam, o padre está mais sujo e mais perdido, e você também.',
          cronica: '{nome} e Padre Olavo caíram juntos na lama da praça.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Dar a ele o latim',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['livro'],
        sucesso: {
          texto: '"Pater noster, qui es in caelis", você começa, e ele segura a frase como quem segura corda. Termina a oração sozinho, em latim de seminário, firme. Depois se levanta e pergunta o que precisa fazer.',
          cronica: '{nome} deu a Padre Olavo o começo do pai-nosso em latim, e ele terminou sozinho.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O seu latim é de missa de criança e tropeça no segundo verso. O padre olha para você como quem perdeu a última esperança e volta a olhar para a torre.',
          cronica: 'O latim de {nome} não bastou para Padre Olavo.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Rezar o que ele esqueceu',
        teste: { chave: 'fe', dificuldade: 8 },
        sucesso: {
          texto: 'Você ajoelha ao lado dele e reza o pai-nosso devagar, em português de casa. Na segunda vez, ele reza junto. Na terceira, chora. Depois se levanta, limpa a batina e diz que vai com você até a porta.',
          cronica: '{nome} rezou com Padre Olavo na praça afogada até ele lembrar a oração.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Você reza, e no meio a reza some da sua boca também. Os dois ficam ajoelhados na lama, de boca aberta, procurando a mesma palavra. Quando ela volta, a vela encurtou.',
          cronica: '{nome} e Padre Olavo esqueceram juntos a mesma oração.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'terco',
        rotulo: 'Dar a ele o terço da avó',
        requer: { item: 'terco' },
        livre: true,
        resultado: {
          texto: 'Você põe o terço da sua avó na mão dele, que é inteiro, e fecha os dedos dele em volta. Padre Olavo começa a rezar na hora, no primeiro mistério, e se levanta no quinto. Ele fica com o terço.',
          cronica: '{nome} deu o terço da avó a Padre Olavo, e ele voltou a rezar.',
          efeitos: { lacos: 1, semItem: 'terco' },
        },
      },
    ],
  },
  {
    id: 's3-relogio',
    ato: 3,
    titulo: 'O relógio da praça',
    texto:
      'No alto do poste da praça velha, o relógio da Pedra-Funda parou na hora em que a água chegou: duas e dez. Debaixo dele o ar é diferente, espesso. A chama da vela fica imóvel, sem tremer, como pintada. Você percebe que, ali, o tempo não passa, e que a vela também não queima.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir e mover os ponteiros',
        teste: { chave: 'destreza', dificuldade: 9 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Você sobe pelo poste de ferro e empurra o ponteiro grande para a frente, uma volta, duas. O relógio tosse e começa a andar. Lá embaixo, a vela volta a tremer, mais alta do que você lembrava.',
          cronica: '{nome} subiu no relógio da praça afogada e fez o tempo voltar a andar.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'O poste é escorregadio de limo e você cai de costas na lama. O ponteiro, lá em cima, anda um minuto para trás. Você não sabe o que isso quer dizer, e prefere não saber.',
          cronica: '{nome} caiu do poste do relógio afogado, e o ponteiro andou para trás.',
          efeitos: { vida: -2, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Dar corda pela portinhola',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        sucesso: {
          texto: 'Na base do poste há uma portinhola de ferro, e dentro a chave da corda, enferrujada no lugar. Você gira, vinte vezes, trinta. O relógio pega, e a vela acorda na sua mão, como quem ganhou fôlego.',
          cronica: '{nome} deu corda no relógio da praça afogada pela portinhola do poste.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'A chave quebra na sua mão no terceiro giro. O relógio continua parado, e você sai da praça com a estranha sensação de ter deixado alguma coisa sua lá dentro.',
          cronica: '{nome} quebrou a chave do relógio da praça afogada.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ficar um pouco no tempo parado',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'Você senta no banco debaixo do relógio e descansa, só um pouco, num lugar onde a vela não gasta. Quando levanta, por força de vontade, está inteiro. Lá fora do círculo, tudo volta a andar.',
          cronica: '{nome} descansou debaixo do relógio parado, onde a vela não gastava.',
          efeitos: { sanidade: 1, marco: true },
        },
        falha: {
          texto: 'É tão bom não ter pressa. Você fica. Quando enfim sai do círculo, a vela de fora do tempo cobra de uma vez tudo o que não gastou.',
          cronica: '{nome} ficou tempo demais debaixo do relógio parado, e a vela cobrou tudo de uma vez.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's3-poco',
    ato: 3,
    titulo: 'O poço da praça',
    texto:
      'Do poço da praça vem uma voz de homem, rouca, pedindo socorro baixinho. É o Delegado Firmino. Desceu atrás de você e caiu procurando, no fundo seco do poço, o canivete com que o pai dele raspou um nome na parede da igreja. Está a seis metros, de perna torcida, e já não sabe direito o sobrenome.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Puxar o delegado',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Você baixa a corda do sarilho e puxa, mão sobre mão, um delegado gordo e assustado. Ele sai pela boca do poço, deita na lama e diz o nome completo, alto, para ter certeza. Na mão dele, um canivete velho.',
          cronica: '{nome} puxou o Delegado Firmino do poço da praça afogada.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A corda corre pelas suas mãos e queima a pele até o osso. Você segura no fim, com o delegado pendurado, e só depois de muito tempo e muita dor ele sai.',
          cronica: '{nome} queimou as mãos na corda do poço para tirar o delegado.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Firmar o sarilho',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        ajuda: ['alavanca', 'corda'],
        sucesso: {
          texto: 'O sarilho está bom; falta a trava. Você enfia um pedaço de pau no raio, e a manivela não volta mais. Com paciência, você sobe o delegado como balde. Ele sai abraçado ao canivete.',
          cronica: '{nome} travou o sarilho do poço e subiu o delegado como balde.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O pau quebra, a manivela gira solta e o delegado cai de volta, de mais alto. Você desce e o traz nas costas, a duras penas.',
          cronica: '{nome} deixou o delegado cair de novo no poço.',
          efeitos: { vida: -1, sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Fazê-lo subir pela parede',
        teste: { chave: 'lideranca', dificuldade: 8 },
        sucesso: {
          texto: '"Delegado! A perna boa no tijolo, a mão na corda. Firmino!" Você fala como quem manda num quartel, e ele obedece de hábito. Sobe pela parede do poço, de pedra em pedra, e chega lá em cima rindo de nervoso.',
          cronica: '{nome} comandou o Delegado Firmino para fora do poço só com a voz.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Lá do fundo, ele pergunta com quem você está falando. Não lembra que é delegado. Você precisa descer e subir com ele, devagar, e a voz dele no escuro pergunta o caminho toda hora.',
          cronica: '{nome} precisou descer ao poço, porque lá no fundo o delegado não lembrava mais que era delegado.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'luzia',
        rotulo: 'Deixar Luzia descer',
        requer: { companheiro: 'luzia' },
        livre: true,
        resultado: {
          texto: 'Luzia amarra a corda na cintura e desce de costas pela parede como quem desce de barranco. Sobe com o delegado e o canivete. "Pai dele também me devia", diz, mas o ajuda a andar.',
          cronica: 'Luzia desceu ao poço da praça e trouxe o delegado de volta para {nome}.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 's3-confessionario',
    ato: 3,
    titulo: 'O confessionário',
    texto:
      'Na lateral da igreja afogada, um confessionário de madeira escura ficou de pé, de cortina fechada. Lá dentro alguém sussurra. Não é reza: são pecados. Os da vila inteira, um atrás do outro, na voz de cada um. A sua vizinha. O seu tio. Você reconhece as vozes. Todos confessam a mesma coisa.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Abrir a cortina',
        teste: { chave: 'fisico', dificuldade: 8 },
        sucesso: {
          texto: 'Você puxa a cortina com força. Lá dentro, nada: um banco de madeira e um banquinho vazio. O sussurro para no meio de uma frase. Fica no ar o cheiro de quem chorou muito tempo num lugar pequeno.',
          cronica: '{nome} abriu a cortina do confessionário afogado e calou os sussurros.',
        },
        falha: {
          texto: 'A cortina não abre. Você puxa e ela puxa de volta, como se alguém lá dentro segurasse com as duas mãos. Você solta antes de ver de quem são as mãos.',
          cronica: 'Alguém segurou a cortina do confessionário por dentro contra {nome}.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ouvir até o fim',
        teste: { chave: 'sabedoria', dificuldade: 9 },
        sucesso: {
          texto: 'Você escuta tudo. Todos confessam o mesmo: que viram um homem na torre na hora da água, e que combinaram não dizer o nome dele nunca mais, para que a culpa fosse de ninguém. A última voz é a de Dona Sinhá.',
          cronica: '{nome} ouviu a vila inteira confessar no confessionário afogado o mesmo segredo.',
          efeitos: { marca: 'retrato', sanidade: -1 },
        },
        falha: {
          texto: 'São confissões demais. Na vigésima, você começa a sentir culpa de coisas que não fez, e na trigésima tem certeza de que fez. Sai dali andando torto.',
          cronica: '{nome} ouviu confissões demais e saiu do confessionário com a culpa da vila inteira.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Dizer que estão perdoados',
        teste: { chave: 'presenca', dificuldade: 9 },
        sucesso: {
          texto: 'Você não é padre, mas diz, de fora da cortina, com toda a firmeza que tem: "Vão em paz." Os sussurros param. Um suspiro comprido, de muitas bocas, sai da madeira escura, e depois o silêncio fica limpo.',
          cronica: '{nome} disse aos sussurros do confessionário afogado que fossem em paz.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Os sussurros riem de você, baixinho, todos juntos. Quem perdoa sem saber o pecado não perdoa nada. Você sai envergonhado, como menino pego na mentira.',
          cronica: 'O confessionário afogado riu do perdão de {nome}.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'maFama',
        rotulo: 'Confessar também',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'Você entra, ajoelha e confessa o que disse no ar sobre quem manda, e o que deixou de dizer. Lá de dentro, uma voz que não é de padre responde: "Pelo menos você disse." Os sussurros param.',
          cronica: '{nome} se confessou no confessionário afogado, e uma voz disse que pelo menos ele tinha dito.',
          efeitos: { marco: true, sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 's3-poca',
    ato: 3,
    titulo: 'A água que sobrou',
    texto:
      'Entre a praça e a igreja, o que sobrou do lago virou um poço largo de água parada e preta, de uns vinte metros. Não tem outro caminho. A água está morna, e no fundo, se você olhar, há janelas acesas: casas que a seca não devolveu, com gente sentada à mesa, olhando para cima.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Atravessar a nado',
        teste: { chave: 'fisico', dificuldade: 9 },
        ajuda: ['barco'],
        sucesso: {
          texto: 'Você nada de costas, com a vela erguida no braço esticado e o rosto para o céu, para não olhar para baixo. Vinte braçadas. A água tenta puxar pelos pés e não consegue segurar quem não olha.',
          cronica: '{nome} atravessou a água parada de costas, com a vela erguida, sem olhar para baixo.',
        },
        falha: {
          texto: 'No meio, a água puxa. Você afunda até o queixo, e por um segundo comprido olha para baixo, para uma janela acesa onde alguém, à mesa, ergue a mão e acena. Sai do outro lado tossindo e tremendo.',
          cronica: 'No meio da água parada, alguém lá no fundo acenou para {nome}.',
          efeitos: { vida: -1, sanidade: -3 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o vau pelos telhados',
        teste: { chave: 'percepcao', dificuldade: 8 },
        ajuda: ['mapa'],
        sucesso: {
          texto: 'Logo abaixo da superfície, as cumeeiras das casas afogadas formam um caminho de telha, e telha não engana o pé. Você atravessa por cima delas, molhado até a canela, com a vela seca.',
          cronica: '{nome} atravessou a água parada por cima dos telhados afogados.',
        },
        falha: {
          texto: 'Uma telha cede e o seu pé entra pela clarabóia de uma casa. Você sente, na sola, o tampo de uma mesa posta. Puxa o pé tão depressa que perde a bota e quase a vela.',
          cronica: 'O pé de {nome} entrou por um telhado afogado e tocou numa mesa posta.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Pedir licença aos de baixo',
        teste: { chave: 'fe', dificuldade: 9 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você se ajoelha na beira e pede licença, como se pede para entrar em casa alheia. Lá no fundo, as janelas acesas, uma por uma, apagam. A água fica só água. Você atravessa com ela pela cintura e nada puxa.',
          cronica: '{nome} pediu licença aos de baixo, e as janelas afogadas se apagaram para ele passar.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Você pede licença, e lá de baixo, de todas as janelas, eles olham para cima ao mesmo tempo. Ninguém responde. Você atravessa assim, olhado por todos.',
          cronica: '{nome} atravessou a água parada olhado pelas janelas do fundo.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'canoa',
        rotulo: 'Atravessar na canoa',
        requer: { item: 'canoa' },
        livre: true,
        resultado: {
          texto: 'A canoa da Luzia desliza por cima das janelas acesas sem fazer marola. Você rema sem olhar para baixo, e lá do fundo ninguém pede nada a quem vai de barco. Na outra margem, você a deixa amarrada num poste.',
          cronica: '{nome} atravessou a água parada na canoa da Luzia, sem olhar para baixo.',
          efeitos: { semItem: 'canoa' },
        },
      },
    ],
  },
  {
    id: 's3-roda',
    ato: 3,
    titulo: 'A roda em volta da igreja',
    texto:
      'Os onze que dormem chegaram antes de você. Estão de mãos dadas, em roda, em volta da igreja afogada, de olho aberto e de costas para ela, como quem guarda. Seu Juvenal, a professora Nair, o menino Dinho. A roda gira devagar, sem barulho. Para entrar na igreja, você precisa passar por ela.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Romper a roda',
        teste: { chave: 'forca', dificuldade: 9 },
        sucesso: {
          texto: 'Você escolhe duas mãos dadas e passa entre elas com o ombro, sem bater, só separando. A roda abre e se fecha atrás de você, mas mais devagar, como quem acordou um pouco.',
          cronica: '{nome} rompeu a roda dos que dormem em volta da igreja afogada.',
        },
        falha: {
          texto: 'As mãos não soltam. A roda inteira empurra de volta, sem raiva, como maré, e você cai sentado na lama. Na terceira tentativa, passa, com as costelas doendo.',
          cronica: 'A roda dos que dormem jogou {nome} na lama duas vezes.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar quem está acordando',
        teste: { chave: 'percepcao', dificuldade: 8 },
        sucesso: {
          texto: 'Um deles pisca. É Dinho, o menor. Você se ajoelha na frente dele e segura as duas mãos. Ele solta a roda para segurar as suas. Pela abertura, você passa, e Dinho vem junto, acordado.',
          cronica: '{nome} achou Dinho acordando na roda dos que dormem, e passou pela mão dele.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você procura um olho que pisque, e todos os onze, ao mesmo tempo, piscam para você. Uma vez. Depois nunca mais. Você passa pela roda tremendo, com o coração no pescoço.',
          cronica: 'Os onze que dormem piscaram para {nome} ao mesmo tempo.',
          efeitos: { sanidade: -3 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Chamar cada um pelo nome',
        teste: { chave: 'presenca', dificuldade: 9 },
        sucesso: {
          texto: '"Juvenal. Nair. Dinho. Cosme. Rosa." Um nome por vez, olhando cada um nos olhos. A cada nome, uma mão solta. Quando você termina, a roda é só gente parada na lama, com frio, procurando o caminho de casa.',
          cronica: '{nome} chamou os onze pelo nome, um por um, até a roda se desfazer.',
          efeitos: { lacos: 1, sanidade: -1 },
        },
        falha: {
          texto: 'Você chama, mas troca dois nomes. A roda inteira para e olha para você, ofendida, como só gente esquecida sabe olhar. Você passa por baixo dos braços deles, de cabeça baixa.',
          cronica: '{nome} trocou o nome de dois dos que dormem, e a roda inteira olhou para ele.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'benzer',
        rotulo: 'Benzer a roda inteira',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 5 },
        sucesso: {
          texto: 'Você anda por dentro da roda no sentido contrário ao dela, rezando, com a vela erguida. Na terceira volta, as mãos soltam todas juntas e os onze sentam na lama, cansados, de olho fechado, como gente.',
          cronica: '{nome} desfez com benzeção a roda dos que dormem.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Você anda contra a roda e a roda o leva. Uma volta, duas, até você não saber mais para que lado estava indo. Sai tonto, pelo lado de dentro.',
          cronica: 'A roda dos que dormem levou {nome} em volta da igreja.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'aliado',
        rotulo: 'Pegar a mão do compadre',
        requer: { antecedente: 'aliado' },
        livre: true,
        resultado: {
          texto: 'Um dos onze é o seu compadre Cosme, que desceu ontem. Você pega a mão dele no lugar da do vizinho, e aperta do jeito de sempre, de quem fecha negócio. Ele aperta de volta, acorda e abre a roda para você.',
          cronica: '{nome} apertou a mão do compadre na roda dos que dormem, e ele acordou e abriu caminho.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 's3-chapeu',
    ato: 3,
    titulo: 'O homem de chapéu de palha',
    texto:
      'Na neblina, alguém começa a andar do seu lado, no mesmo passo. Um homem magro, de chapéu de palha, roupa de domingo de trinta anos atrás, sem lama nenhuma nos sapatos. Ele cumprimenta tocando a aba. Pergunta, com educação, o que você leva aceso na mão, e se não podia lhe emprestar só um pouquinho.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Apressar o passo',
        teste: { chave: 'agilidade', dificuldade: 9 },
        sucesso: {
          texto: 'Você aperta o passo, depois corre. Ele não corre: só fica para trás, de chapéu na mão, olhando você ir com uma tristeza que dá vergonha. Você chega à igreja sozinho e ofegante.',
          cronica: '{nome} deixou o homem de chapéu de palha para trás na neblina.',
        },
        falha: {
          texto: 'Você corre, e ele continua do seu lado, sem correr, no mesmo passo de antes. Quando você para, sem fôlego, ele ainda está ali. "Não precisava", diz.',
          cronica: '{nome} correu, e o homem de chapéu continuou do lado dele sem correr.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Perceber o que ele quer',
        teste: { chave: 'sabedoria', dificuldade: 9 },
        sucesso: {
          texto: 'Ele não quer a vela: quer que alguém lhe dê alguma coisa, qualquer coisa, sem medo. Você para e oferece o braço, como se oferece a um velho na rua. Ele aceita. Andam assim até a porta da igreja, onde ele tira o chapéu e some.',
          cronica: '{nome} deu o braço ao homem de chapéu de palha até a porta da igreja.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Você acha que ele quer a vela e a esconde atrás das costas. Ele vê o gesto. Para de andar, e você ouve, quando já está longe, um homem chorar baixinho na neblina.',
          cronica: '{nome} escondeu a vela do homem de chapéu, e o ouviu chorar na neblina.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Emprestar um pouco da chama',
        teste: { chave: 'empatia', dificuldade: 9 },
        sucesso: {
          texto: 'Você acende um fósforo na vela e entrega a ele. Ele segura a chama pequena com cuidado, perto do rosto, e você vê que é um rosto comum, cansado, que alguém devia lembrar. "Obrigado", diz. "Faz tempo."',
          cronica: '{nome} emprestou um pouco da chama ao homem de chapéu de palha e viu o rosto dele.',
          efeitos: { marca: 'retrato', brasa: -1 },
        },
        falha: {
          texto: 'Você estende a vela, e ele chega perto demais. A chama deita para o lado dele e encolhe. Você puxa de volta, e o que ficou com ele não volta mais.',
          cronica: '{nome} emprestou a chama ao homem de chapéu, e ele levou mais do que pediu.',
          efeitos: { brasa: -2, sanidade: -1 },
        },
      },
      {
        id: 'historia',
        rotulo: 'Contar a ele a Pedra-Funda',
        requer: { nivel: { historia: 1 } },
        teste: { chave: 'historia', dificuldade: 4 },
        sucesso: {
          texto: 'Você conta o que sabe: a festa do padroeiro, a banda, a farmácia, o sino de chamar enterro. Ele ouve, sorrindo, corrigindo um detalhe ou outro. Na porta da igreja diz: "Você sabe quase tudo. Falta pouco."',
          cronica: '{nome} contou a Pedra-Funda ao homem de chapéu, e ele disse que faltava pouco.',
          efeitos: { marca: 'retrato', marco: true },
        },
        falha: {
          texto: 'Você conta errado, e ele corrige, e corrige de novo, cada vez mais triste. "Ninguém lembra mais", diz, e some na neblina antes da igreja.',
          cronica: '{nome} contou a Pedra-Funda errado ao homem de chapéu de palha.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
  {
    id: 's3-tiao',
    ato: 3,
    requer: { semMarca: 's1-tiao' },
    titulo: 'O silêncio de Tião',
    texto:
      'Na escadaria da igreja velha, Tião, o menino surdo, está sentado sozinho, abraçando os joelhos. Desceu atrás de você sem ninguém ver. Ele não ouve o sino, mas viu os onze, a roda, a água com janelas. Treme inteiro. Quando você chega, faz um sinal que você entende: "Eu vi tudo. Não deixa."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Levar Tião nas costas',
        teste: { chave: 'fisico', dificuldade: 8 },
        sucesso: {
          texto: 'Você põe o menino nas costas, de cavalinho, e ele se agarra no seu pescoço. É pesado e não é. Ele segura a vela por você, com as duas mãos, sério, e não treme mais.',
          cronica: '{nome} levou Tião nas costas pela escadaria da igreja velha, e ele segurou a vela.',
          efeitos: { lacos: 1, companheiro: 'tiao' },
        },
        falha: {
          texto: 'O degrau de limo escorrega e vocês dois caem sentados. Tião ri, sem som, de nervoso. Você ri também, e sangra no cotovelo.',
          cronica: '{nome} escorregou na escadaria da igreja com Tião nas costas.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Explicar por sinais',
        teste: { chave: 'inteligencia', dificuldade: 8 },
        sucesso: {
          texto: 'Você explica com as mãos, do jeito que der: sino, homem, nome, esquecer. Tião entende mais depressa do que você explica. Termina a frase por você, com um gesto que quer dizer "lembrar", e levanta.',
          cronica: '{nome} explicou o sino a Tião por sinais, e ele terminou a frase.',
          efeitos: { lacos: 1, companheiro: 'tiao' },
        },
        falha: {
          texto: 'Os sinais saem errados, e Tião não entende se você está com medo ou bravo. Ele se encolhe mais. Você fica ao lado dele um tempo, sem conseguir dizer nada.',
          cronica: '{nome} não achou os sinais para acalmar Tião.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sentar do lado dele',
        teste: { chave: 'vontade', dificuldade: 8 },
        sucesso: {
          texto: 'Você senta do lado dele na escada, de vela no colo, e espera o seu próprio medo passar primeiro. Tião percebe. Encosta a cabeça no seu ombro. Depois levanta e estende a mão para entrar com você.',
          cronica: '{nome} sentou com Tião na escadaria até os dois terem coragem.',
          efeitos: { lacos: 1, companheiro: 'tiao' },
        },
        falha: {
          texto: 'Você senta, mas a sua perna não para de bater no degrau, e Tião sente a escada tremer. Ele chora sem som. Você o deixa ali, na porta, prometendo voltar.',
          cronica: '{nome} deixou Tião chorando na escadaria da igreja velha.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
];
