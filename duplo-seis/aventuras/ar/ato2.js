/**
 * Ar Rarefeito, Ato 2: As Docas. Meia gravidade, barulho, graxa, gente que
 * carrega peso e desconfia de quem vem do Anel Verde. Aqui aparece o primeiro
 * vácuo, e o medo começa a custar Sanidade. O relógio é o Ar (efeito `brasa`).
 */

export const itens = {};

export const companheiros = {
  ar2Icaro: {
    nome: 'Ícaro',
    quem: 'rapaz das Docas que queria fugir num casulo e agora sobe em qualquer coisa por você',
    niveis: { destreza: 2, percepcao: 1 },
  },
  ar2ZeDoze: {
    nome: 'Zé-Doze',
    quem: 'robô de manutenção nº 12, que carrega peso e avisa de perigos de quarenta anos atrás',
    niveis: { forca: 2, fisico: 1 },
  },
};

export const inimigos = {
  ar2ZeDozeSoldador: {
    nome: 'Zé-Doze, de maçarico aceso',
    ataque: 1,
    defesa: 2,
    vida: 4,
    arma: 1,
    armadura: 0,
    resistencia: 1,
    reflexo: 0,
    vontade: 0,
    fe: 0,
  },
};

export const cenas = [
  {
    id: 'ar2-comporta',
    ato: 2,
    titulo: 'A Comporta 3',
    texto:
      'A Comporta 3 desceu no meio do turno e ficou. São quatro toneladas de chapa entre você e o resto das Docas, com um palmo de fresta embaixo e uma sirene que ninguém sabe desligar. A turma de Tonho Graxa, o chefe dos estivadores, olha de braços cruzados. "Racionamento", diz ele. "O motor só volta na safra que vem."',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Erguer pela fresta',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        ajudantes: [{ nome: 'Tonho Graxa', nivel: 1 }],
        sucesso: {
          texto: 'A barra entra na fresta, Tonho Graxa encosta o ombro por pura curiosidade, e a chapa sobe dois palmos rangendo. Você empurra o cartucho por baixo e rola atrás dele. A turma assobia.',
          cronica: '{nome} ergueu a Comporta 3 dois palmos e passou rolando por baixo.',
        },
        falha: {
          texto: 'A chapa sobe um dedo e desce em cima da ponta da sua bota. Você puxa o pé a tempo, quase. O jeito é desmontar a grade de um duto de carga, parafuso por parafuso.',
          cronica: '{nome} perdeu para a Comporta 3 e passou mancando por um duto de carga.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Achar o contrapeso manual',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['manual', 'scanner'],
        sucesso: {
          texto: 'Atrás de uma tampa pintada três vezes há uma corrente e um desenho de boneco puxando. Você puxa. O contrapeso desce pelo poço, a comporta sobe sozinha, e a sirene enfim se cala.',
          cronica: '{nome} abriu a Comporta 3 pelo contrapeso que os fundadores deixaram.',
        },
        falha: {
          texto: 'Você acha uma corrente e puxa com gosto. Era a do chuveiro de descontaminação. Sai encharcado, gelado, e ainda vai ter de passar pelo duto de carga, sob risos.',
          cronica: '{nome} puxou a corrente errada na Comporta 3 e tomou um banho frio.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
        critico: {
          texto: 'A comporta sobe sem um gemido. No nicho do contrapeso, enrolada num tubo, está a planta da estação que a turma procurava há safras. Tonho Graxa coça a nuca. "Leva. Você achou."',
          cronica: '{nome} abriu a Comporta 3 e achou no nicho do contrapeso uma planta da estação.',
          efeitos: { item: 'planta' },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Pôr a turma no cabo',
        teste: { chave: 'presenca', dificuldade: 6 },
        ajuda: ['troca'],
        sucesso: {
          texto: 'Você não pede favor: conta para onde vai o cartucho. Tonho Graxa cospe de lado, passa um cabo pela roldana do teto e berra o compasso. Doze pessoas puxam, a chapa sobe.',
          cronica: '{nome} pôs a turma de Tonho Graxa no cabo e a Comporta 3 subiu no grito.',
        },
        falha: {
          texto: '"Gente do Anel sempre tem pressa", diz Tonho Graxa, e a turma volta para o café. Você passa pelo duto de carga, arrastando o cartucho e o orgulho.',
          cronica: '{nome} pediu ajuda nas Docas e ouviu que o turno era de café.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'maquinas',
        rotulo: 'Soltar o freio do motor',
        requer: { nivel: { maquinas: 1 } },
        teste: { chave: 'maquinas', dificuldade: 4 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'O motor está bom, o freio é que travou por falta de corrente. Você solta a sapata na mão e a comporta sobe pelo próprio contrapeso. Tonho Graxa pergunta, sério, se você quer emprego.',
          cronica: '{nome} soltou o freio da Comporta 3 e recebeu uma proposta de emprego nas Docas.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A sapata solta de uma vez e a chapa sobe meio metro antes de travar de novo, torta. Dá para passar de lado, raspando as costelas e a etiqueta do cartucho.',
          cronica: '{nome} destravou a Comporta 3 pela metade e passou de lado.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Ler a placa na língua velha',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 3 },
        sucesso: {
          texto: 'A placa que todo mundo achava que era aviso de perigo diz, na língua velha: "Sem força, gire o volante azul." O volante azul é o cabide da turma. Você tira os casacos e gira.',
          cronica: '{nome} leu a placa dos fundadores e abriu a Comporta 3 com o cabide da turma.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A tinta descascou no meio da frase e você gira o volante para o lado errado. A comporta desce o palmo que faltava. Resta o duto de carga.',
          cronica: '{nome} leu meia placa na Comporta 3 e fechou o que faltava fechar.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-zedoze',
    ato: 2,
    titulo: 'O soldador do corredor',
    texto:
      'No corredor de serviço, o robô de manutenção nº 12 solda tudo o que se mexe. Já soldou um carrinho de mão ao piso, e uma bota, felizmente vazia. O maçarico azul gira para você. "Atenção", diz Zé-Doze, com voz de fita gasta. "Inspeção do comandante às catorze horas." O comandante morreu há quarenta anos.',
    abordagens: [
      {
        id: 'lutar',
        rotulo: 'Desligar no tranco',
        combate: 'ar2ZeDozeSoldador',
        vitoria: {
          texto: 'O último golpe acerta a caixa de fusíveis. Zé-Doze dobra os joelhos devagar, como quem se senta, e o maçarico apaga. "Inspeção adiada", diz, e mais nada.',
          cronica: '{nome} desligou Zé-Doze na pancada, no corredor de serviço.',
        },
        derrota: {
          texto: 'O maçarico passa rente e você cai para trás, com a manga fumegando e cheiro de pano queimado. Zé-Doze perde o interesse e volta a soldar o carrinho.',
          cronica: '{nome} foi vencido por um robô de manutenção e saiu chamuscado.',
          efeitos: { brasa: -1 },
        },
        fuga: {
          texto: 'Você recua até o cruzamento e dá a volta pelo túnel dos encanamentos, de gatinhas, empurrando o cartucho. Atrás de você, a voz anuncia a inspeção outra vez.',
          cronica: '{nome} deixou Zé-Doze soldando e deu a volta pelos encanamentos.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Achar a chave geral',
        teste: { chave: 'percepcao', dificuldade: 6 },
        ajuda: ['scanner', 'luz'],
        sucesso: {
          texto: 'Ele só olha para o que se mexe. Você fica parado até virar parede, vê a tampa nas costas dele e, na volta seguinte, estica dois dedos. Um estalo. O maçarico morre.',
          cronica: '{nome} esperou parado e desligou Zé-Doze pela chave das costas.',
        },
        falha: {
          texto: 'A tampa que você abre é a do reservatório de fluxo. Zé-Doze gira, ofendido, e solda a sua manga ao corrimão. Você sai sem a manga e com a pele ardendo.',
          cronica: '{nome} abriu a tampa errada de Zé-Doze e deixou uma manga no corrimão.',
          efeitos: { vida: -2 },
        },
        critico: {
          texto: 'Ao lado da chave geral há um seletor emperrado em "obra". Você empurra para "serviço". Zé-Doze guarda o maçarico, pega o cartucho com dois braços e pergunta para onde é a entrega.',
          cronica: '{nome} achou o seletor certo, e Zé-Doze passou a carregar o cartucho.',
          efeitos: { companheiro: 'ar2ZeDoze' },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Dar a ordem do comandante',
        teste: { chave: 'presenca', dificuldade: 7 },
        ajuda: ['manual'],
        sucesso: {
          texto: 'Você endireita as costas e fala como ninguém fala há quarenta anos: "Número doze. Inspeção concluída. Acompanhe a carga." O maçarico apaga. Zé-Doze bate continência com a pinça e vem atrás.',
          cronica: '{nome} deu a ordem no protocolo dos fundadores, e Zé-Doze passou a acompanhar a carga.',
          efeitos: { companheiro: 'ar2ZeDoze' },
        },
        falha: {
          texto: '"Voz não autorizada", diz Zé-Doze, e repete, e repete, cada vez mais perto. Você passa correndo por baixo do braço dele, com aquela frase grudada na nuca.',
          cronica: '{nome} tentou mandar em Zé-Doze e ouviu que não tinha autorização.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Sintonizar o nº 12',
        requer: { nivel: { magiaEncantamento: 1 } },
        teste: { chave: 'magiaEncantamento', dificuldade: 4 },
        sucesso: {
          texto: 'Lá dentro há um laço: a mesma tarde, quarenta anos seguidos, esperando uma inspeção. Você acha a ponta e desata. Zé-Doze olha as próprias mãos. "Que horas são?", pergunta. E segue você.',
          cronica: '{nome} sintonizou Zé-Doze e o tirou de uma tarde que durava quarenta anos.',
          efeitos: { companheiro: 'ar2ZeDoze', lacos: 1 },
        },
        falha: {
          texto: 'A tarde de quarenta anos atrás entra na sua cabeça inteira: sirene, graxa nova, gente que já morreu passando com pressa. Quando você volta a si, está sentado do outro lado do corredor.',
          cronica: '{nome} sintonizou Zé-Doze e ficou preso um tempo na tarde dele.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-braco',
    ato: 2,
    titulo: 'O Velho Braço',
    texto:
      'O guindaste Velho Braço parou com a lança esticada sobre o vão da doca, e na ponta dela, vinte metros acima, há um rapaz agarrado à treliça. É Ícaro. Subiu para alcançar o casulo de emergência do teto, a energia caiu, e agora ele não sobe nem desce. Em meia gravidade a queda é lenta, mas o piso é o mesmo.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Lançar o cabo lá em cima',
        teste: { chave: 'destreza', dificuldade: 6 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'O cabo sobe preguiçoso na meia gravidade, faz uma curva que nenhum manual explica e cai no colo de Ícaro. Ele amarra na cintura e desce de costas, pedindo desculpas a cada metro.',
          cronica: '{nome} lançou um cabo até a ponta do Velho Braço e desceu Ícaro inteiro.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro' },
        },
        falha: {
          texto: 'Três lances, três erros, e o quarto enrosca na treliça. Ícaro acaba descendo sozinho por ele, queimando as mãos, e vai embora sem olhar para você.',
          cronica: '{nome} errou o lance três vezes, e Ícaro desceu do guindaste por conta própria.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Baixar a lança na manivela',
        teste: { chave: 'inteligencia', dificuldade: 7 },
        ajuda: ['manual', 'ferramenta'],
        sucesso: {
          texto: 'Na cabine há uma manivela de emergência e uma tabela de voltas por metro. Você conta alto para Ícaro ouvir. Duzentas e quarenta voltas depois, ele pisa no chão e ajuda a carregar o cartucho.',
          cronica: '{nome} baixou a lança do Velho Braço na manivela, com Ícaro na ponta.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro' },
        },
        falha: {
          texto: 'A alavanca que você solta é a do giro. A lança roda devagar sobre o vão, com Ícaro gritando, até encostar na passarela. Ele pula para lá. Você fica com os braços tremendo.',
          cronica: '{nome} girou o Velho Braço para o lado errado com um rapaz pendurado.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Mandar soltar e flutuar',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você abre os braços e não tira os olhos dele. "Solta. Eu não saio daqui." Ele solta. Desce como folha, girando, e chega nos seus braços com o peso de uma criança.',
          cronica: '{nome} convenceu Ícaro a soltar o Velho Braço e o apanhou no ar.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro', marco: true },
        },
        falha: {
          texto: 'A sua voz falha na palavra "solta". Ícaro ouve a dúvida e aperta mais a treliça. Só desce muito depois, quando a turma traz a rede de carga.',
          cronica: '{nome} pediu que Ícaro soltasse o guindaste, e nem a própria voz acreditou.',
          efeitos: { brasa: -1, sanidade: -1 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Acalmar o medo dele',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 4 },
        sucesso: {
          texto: 'O medo dele chega até você como um zumbido fino. Você abaixa o tom, devagar, feito quem nina. Lá em cima as mãos param de tremer, e Ícaro desce a treliça sozinho, degrau por degrau.',
          cronica: '{nome} acalmou Ícaro de longe, e ele desceu do Velho Braço com as próprias mãos.',
          efeitos: { lacos: 1, companheiro: 'ar2Icaro', item: 'sinalizador' },
        },
        falha: {
          texto: 'O medo dele é maior que o seu fôlego e entra em você de uma vez: o vão, a altura, o piso. Você se agarra ao corrimão. A turma traz a rede de carga.',
          cronica: '{nome} sintonizou o medo de Ícaro e ficou com ele.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-armazem',
    ato: 2,
    titulo: 'O armazém que não existe',
    texto:
      'Nas plantas antigas da estação, entre o depósito de sucata e a parede do casco, há um espaço vazio. O espaço cheira a café de verdade. Uma pilha de caixas tapa o corredor, e atrás dela alguém conta fichas sem pressa. Todo mundo nas Docas sabe que Madame Rute tem trajes de pressão. Ninguém sabe onde fica a porta.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Passar por cima das caixas',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'Você escala a pilha sem derrubar uma lata e cai de pé diante de uma mesa. Madame Rute nem ergue os olhos. "Quem entra pelo teto paga à vista." Aceita um turno de carga em troca de um traje remendado.',
          cronica: '{nome} entrou pelo teto no armazém de Madame Rute e saiu com um traje de pressão.',
          efeitos: { item: 'traje', brasa: -1 },
        },
        falha: {
          texto: 'A pilha desaba com você dentro. Quando a poeira assenta, há latas amassadas, um joelho inchado e uma voz calma do outro lado: "Isso vai para a sua conta."',
          cronica: '{nome} derrubou meio estoque de Madame Rute e ficou devendo.',
          efeitos: { vida: -2, marca: 'a2-rute' },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Procurar a trava escondida',
        teste: { chave: 'percepcao', dificuldade: 7 },
        ajuda: ['mapa', 'luz'],
        sucesso: {
          texto: 'O rebite que brilha é o único que mãos tocam todo dia. Você aperta, e a parede corre. Madame Rute serve duas xícaras. "Quem acha a porta é cliente." O traje sai pelo preço de um favor futuro.',
          cronica: '{nome} achou a trava do armazém que não existe e saiu de lá com um traje de pressão.',
          efeitos: { item: 'traje', marca: 'a2-rute' },
        },
        falha: {
          texto: 'Você tateia rebite por rebite até os dedos doerem. Nada. Do outro lado, a contagem de fichas para um instante, e alguém ri baixinho. O medidor de ar desce.',
          cronica: '{nome} procurou a porta de Madame Rute e não achou.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'presenca',
        rotulo: 'Negociar com Madame Rute',
        teste: { chave: 'presenca', dificuldade: 7 },
        ajuda: ['troca'],
        sucesso: {
          texto: 'Você fala alto, para a parede: a estação inteira é freguesa dela, e freguês sem ar não paga dívida. A parede corre. Madame Rute entrega o traje e anota num caderno. "Investimento", diz.',
          cronica: '{nome} convenceu Madame Rute de que ar para duzentos era bom negócio.',
          efeitos: { item: 'traje', lacos: 1 },
        },
        falha: {
          texto: '"Bonito", diz a voz atrás das caixas. "Volte quando tiver algo que eu não tenha." Você fica falando com papelão até desistir.',
          cronica: '{nome} discursou para uma pilha de caixas, e a pilha não se comoveu.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'recursos',
        rotulo: 'Pagar o preço dela',
        requer: { antecedente: 'recursos' },
        livre: true,
        resultado: {
          texto: 'Você bate três vezes e diz um número. A parede corre. Madame Rute confere, embrulha o traje e ainda põe por cima um sachê de chá. Sai caro, e ela faz questão de que você saiba.',
          cronica: '{nome} comprou um traje de pressão de Madame Rute pelo preço que ela quis.',
          efeitos: { item: ['traje', 'cha'], marca: 'a2-rute' },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Entrar pelo duto do café',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 4 },
        sucesso: {
          texto: 'O cheiro de café vem de algum lugar, e você vai atrás dele por dentro da parede. Sai ao lado da cafeteira. Madame Rute ri, o que é raro. "Leva o traje. E me conta por onde."',
          cronica: '{nome} entrou no armazém de Madame Rute pelo duto do café e ganhou um traje pela ousadia.',
          efeitos: { item: 'traje', lacos: 1 },
        },
        falha: {
          texto: 'O duto estreita e você entala, com a cara a um palmo da grade e do café. Madame Rute manda alguém puxar pelos pés. Cobra o serviço.',
          cronica: '{nome} entalou num duto atrás de café e foi puxado pelos pés.',
          efeitos: { vida: -1, marca: 'a2-rute' },
        },
      },
    ],
  },
  {
    id: 'ar2-garrafas',
    ato: 2,
    titulo: 'As garrafas que faltam',
    texto:
      'O depósito de garrafas de ar está aberto e seis ganchos estão vazios. Tonho Graxa, o chefe dos estivadores, bloqueia a passagem com o corpo inteiro. Ninguém atravessa as Docas enquanto as garrafas não aparecerem. Ele sabe quem pegou, dá para ver, e não vai entregar gente da turma a alguém de fora. Atrás dele, oito estivadores estudam as próprias botas.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Pagar descarregando um contêiner',
        teste: { chave: 'forca', dificuldade: 7 },
        ajudantes: [{ nome: 'um estivador calado', nivel: 1 }],
        sucesso: {
          texto: 'Você esvazia o contêiner da ração sem pedir pausa. No último saco, Tonho Graxa fala baixo: foi o Bento, a mulher dele está de cama. As garrafas voltam ao gancho, menos uma, que todos fingem não contar.',
          cronica: '{nome} descarregou um contêiner inteiro e ganhou a confiança de Tonho Graxa.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'No décimo saco as costas travam e você derruba a carga no pé de alguém. Tonho Graxa abre a passagem só para se ver livre de você.',
          cronica: '{nome} tentou trabalhar de estivador e durou dez sacos.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Ler quem desvia o olho',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        sucesso: {
          texto: 'Sete estudam as botas. O oitavo olha a porta da enfermaria das Docas. Você não aponta ninguém: pergunta a Tonho Graxa quem está doente. Ele solta o ar, e a história sai inteira.',
          cronica: '{nome} descobriu quem levou as garrafas de ar sem acusar ninguém.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você escolhe o sujeito de cara mais fechada. Era o único que estava de folga. A turma fecha a cara junto, e a passagem só abre depois de muita desculpa.',
          cronica: '{nome} acusou o estivador errado e pediu desculpas a oito pessoas.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Sustentar o silêncio',
        teste: { chave: 'vontade', dificuldade: 7 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você pousa o cartucho no chão, senta em cima e espera. O silêncio cresce até pesar mais que as garrafas. Um homem miúdo dá um passo à frente. "Fui eu. Era para a minha mulher."',
          cronica: '{nome} sentou no cartucho e esperou em silêncio até a confissão vir sozinha.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Estivador aguenta silêncio melhor que qualquer um: passa turnos inteiros dentro de um capacete. Você é quem fala primeiro. Tonho Graxa deixa passar, por cansaço.',
          cronica: '{nome} tentou vencer as Docas no silêncio e perdeu.',
          efeitos: { brasa: -1 },
        },
        desastre: {
          texto: 'O silêncio vira outra coisa. Você ouve o próprio sangue, depois o zumbido dos dutos, depois nada, como lá fora. Quando alguém toca o seu ombro, você grita. A turma abre caminho, assustada.',
          cronica: '{nome} ficou em silêncio tempo demais no depósito das garrafas.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Seguir a poeira dos ganchos',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'Seis ganchos sem poeira, um rastro de rodinha de maca, uma mancha de pomada no trinco. Você conta só a Tonho Graxa, de lado. Ele agradece a discrição com um aperto de mão que estala.',
          cronica: '{nome} seguiu um rastro de maca e resolveu o sumiço das garrafas em segredo.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'O rastro de rodinha leva ao carrinho do café. A turma acha graça, e é a graça que abre a passagem.',
          cronica: '{nome} investigou o sumiço das garrafas e prendeu um carrinho de café.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Perguntar quem está doente',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        ajuda: ['remedio'],
        sucesso: {
          texto: 'Ninguém rouba ar por esporte. Você pergunta pela doente, e um homem miúdo leva você até ela. É pulmão cansado, coisa de tratar com pouco. Cinco garrafas voltam ao gancho pelas mãos dele.',
          cronica: '{nome} tratou a mulher de um estivador, e as garrafas de ar voltaram sozinhas.',
          efeitos: { lacos: 1, item: 'marreta' },
        },
        falha: {
          texto: 'Você chega à doente, mas o que ela tem pede um remédio que a estação não vê há onze anos. Você fica um pouco, segura a mão dela e segue com isso no peito.',
          cronica: '{nome} achou a doente das Docas e não tinha o que dar a ela.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-docaaberta',
    ato: 2,
    titulo: 'A Doca Aberta',
    texto:
      'A Doca Aberta perdeu a porta de fora há duas safras. Entre esta eclusa e a outra há dez metros de piso gradeado, e além da grade, nada: o escuro inteiro, com estrelas que não piscam. A eclusa de lá abre e fecha sozinha, num ciclo teimoso. Não há ar nenhum no meio. Daqui, o lado de fora não tem vidro nenhum.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Atravessar no fôlego',
        teste: { chave: 'fisico', dificuldade: 7 },
        ajuda: ['traje', 'ima'],
        sucesso: {
          texto: 'Você solta o ar, como ensinam às crianças, e vai. Dez metros de silêncio absoluto, a pele repuxando, o cartucho leve de repente. A eclusa de lá fecha atrás de você com um sopro morno.',
          cronica: '{nome} atravessou a Doca Aberta no fôlego, dez metros sem ar.',
        },
        falha: {
          texto: 'No meio do caminho a vista escurece pelas bordas e os joelhos esquecem o serviço. Você chega à eclusa de rastros, com sangue no nariz e gosto de ferro.',
          cronica: '{nome} quase ficou no meio da Doca Aberta.',
          efeitos: { vida: -2, sanidade: -1 },
        },
        desastre: {
          texto: 'Você tropeça na grade e, por um segundo comprido, flutua de frente para o escuro. Ele não tem fundo. Uma mão sua acha o corrimão. Você entra na eclusa sem saber como, e não fala por um bom tempo.',
          cronica: '{nome} olhou o escuro de frente na Doca Aberta, e o escuro olhou de volta.',
          efeitos: { vida: -2, sanidade: -3 },
        },
      },
      {
        id: 'percepcao',
        rotulo: 'Cronometrar a eclusa',
        teste: { chave: 'percepcao', dificuldade: 6 },
        sucesso: {
          texto: 'Quarenta batidas aberta, noventa fechada, e um estalo três batidas antes de abrir. Você sai no estalo. Chega do outro lado com a porta ainda correndo e nem um segundo de sobra.',
          cronica: '{nome} contou o ciclo da eclusa e atravessou a Doca Aberta no tempo exato.',
        },
        falha: {
          texto: 'Você conta noventa. Eram cem. São dez batidas de coração diante de uma porta fechada, sem ar, com o escuro às costas. Ela abre. Você entra outro.',
          cronica: '{nome} errou a conta da eclusa e esperou no vácuo diante de uma porta fechada.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Confiar e pular',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto', 'cabo'],
        sucesso: {
          texto: 'Os fundadores cruzaram isso tudo de olhos abertos para chegar aqui. Você dobra os joelhos e salta. Dez metros num voo só, reto, quieto, e a eclusa de lá abre como se estivesse esperando.',
          cronica: '{nome} cruzou a Doca Aberta num salto só, confiando.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'O salto sai torto e você gira devagar, vendo estrela, grade, estrela, grade. Bate de ombro na moldura da eclusa e se arrasta para dentro, enjoado até a alma.',
          cronica: '{nome} saltou na Doca Aberta e chegou do outro lado girando.',
          efeitos: { vida: -1, sanidade: -2 },
        },
      },
      {
        id: 'pressao',
        rotulo: 'Levar uma bolha de ar',
        requer: { nivel: { magiaElemental: 1 } },
        teste: { chave: 'magiaElemental', dificuldade: 5 },
        sucesso: {
          texto: 'Você sente a pressão da eclusa como água morna e pede que ela venha junto. Vem um resto, fino, colado no rosto. Dá para dez metros e sobra um suspiro, que você devolve à estação.',
          cronica: '{nome} atravessou a Doca Aberta vestindo um resto de ar.',
          efeitos: { marco: true, brasa: 1 },
        },
        falha: {
          texto: 'A bolha estoura no terceiro passo, com um puxão atrás dos olhos. O resto é no fôlego e no susto.',
          cronica: '{nome} perdeu a bolha de ar no meio da Doca Aberta.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Ir pelo corrimão de fora',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 3 },
        ajuda: ['ima'],
        sucesso: {
          texto: 'Por fora do casco é a sua rua. Você prende o cartucho às costas e vai de mão em mão, sem pressa nenhuma, e ainda aperta um parafuso frouxo da eclusa na passagem.',
          cronica: '{nome} cruzou a Doca Aberta como quem volta para casa.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'O corrimão acaba dois metros antes do que você lembrava. O último trecho é um impulso no vazio e uma pancada feia na moldura.',
          cronica: '{nome} descobriu na Doca Aberta que o corrimão tinha encolhido.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ar2-patio',
    ato: 2,
    titulo: 'O pátio que mudou de lugar',
    texto:
      'O Pátio de Contêineres foi rearrumado no último turno, para poupar energia das esteiras, e ninguém refez a sinalização. São corredores de aço de seis metros de altura, todos da mesma cor de ferrugem, com a metade das lâmpadas apagada. Em algum lugar ali dentro fica a cantina Parafuso Solto. Dá para ouvir uma colher batendo em caneca.',
    abordagens: [
      {
        id: 'destreza',
        rotulo: 'Ir por cima dos contêineres',
        teste: { chave: 'destreza', dificuldade: 7 },
        ajuda: ['ima', 'cabo'],
        sucesso: {
          texto: 'Em meia gravidade, seis metros são um pulo bom. Lá de cima o pátio vira tabuleiro, e você vai de casa em casa, com o cartucho no ombro, até o telhado de lona da cantina.',
          cronica: '{nome} atravessou o Pátio de Contêineres por cima, de pulo em pulo.',
        },
        falha: {
          texto: 'Meia gravidade engana na ida e cobra na volta. Você erra a beirada, desce raspando uma parede de aço e fica um tempo sentado no escuro, entre dois contêineres, ouvindo o pátio estalar.',
          cronica: '{nome} caiu entre dois contêineres e demorou a achar a saída.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'inteligencia',
        rotulo: 'Decifrar as marcas de tinta',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['mapa', 'luz'],
        sucesso: {
          texto: 'Os contêineres mudaram, mas os números de doca pintados no piso, não. Você ignora as paredes, lê o chão e chega à Parafuso Solto por um corredor que nem a turma conhecia.',
          cronica: '{nome} leu o piso do Pátio de Contêineres e achou um atalho.',
          efeitos: { item: 'cha' },
        },
        falha: {
          texto: 'O número catorze aparece duas vezes. As lâmpadas do corredor apagam por economia, e você passa um tempo comprido tateando aço frio, com a certeza de que as paredes andaram.',
          cronica: '{nome} se perdeu no escuro do Pátio de Contêineres.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'vontade',
        rotulo: 'Aguentar a prosa do vigia',
        teste: { chave: 'vontade', dificuldade: 6 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'O vigia sabe o caminho, mas só conta depois da história da enchente do tanque, do casamento da irmã e do campeonato de dominó. Você ouve tudo, de pé. Ele leva você até a porta e serve um chá.',
          cronica: '{nome} ouviu três histórias do vigia do pátio e ganhou o caminho e um chá.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Na segunda história você olha o medidor de ar. O vigia vê, se ofende e aponta um corredor qualquer. É o errado, claro.',
          cronica: '{nome} perdeu a paciência com o vigia do pátio e pagou com uma volta inteira.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'planta',
        rotulo: 'Cortar pelo túnel da planta',
        requer: { item: 'planta' },
        livre: true,
        resultado: {
          texto: 'A planta mostra o que a ferrugem escondeu: um túnel de cabos por baixo do pátio, reto, com tampa a cada dez metros. Você sai dentro da despensa da cantina, adiantado, e leva uma bronca pequena.',
          cronica: '{nome} passou por baixo do Pátio de Contêineres e ganhou tempo.',
          efeitos: { brasa: 1 },
        },
      },
      {
        id: 'aliado',
        rotulo: 'Assobiar para um conhecido',
        requer: { antecedente: 'aliado' },
        livre: true,
        resultado: {
          texto: 'Você assobia as três notas de sempre. De cima de um contêiner responde outro assobio, e uma lanterna pisca mostrando o caminho, curva por curva. Fica um favor a pagar, como sempre.',
          cronica: '{nome} atravessou o pátio guiado pela lanterna de um velho conhecido.',
          efeitos: { marca: 'a2-favor' },
        },
      },
    ],
  },
  {
    id: 'ar2-casulos',
    ato: 2,
    titulo: 'A fila dos casulos',
    texto:
      'Os estivadores largaram o serviço e fizeram fila diante dos casulos de emergência. São doze casulos para sessenta pessoas, e a conta já começou a ser feita aos empurrões. A passagem para o Eixo fica atrás da fila. Tonho Graxa, o chefe da turma, tenta segurar todo mundo no grito e está perdendo. Alguém já quebrou o lacre do primeiro casulo.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Fazer o serviço de três',
        teste: { chave: 'forca', dificuldade: 8 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Você não diz nada. Pega a carga parada da esteira e leva sozinho, três volumes por vez, com o cartucho nas costas. Um a um, sem jeito, os estivadores saem da fila e voltam ao serviço.',
          cronica: '{nome} envergonhou as Docas inteiras trabalhando por três.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'No segundo volume algo estala no seu ombro. A fila olha, com pena, e continua fila. Você atravessa por entre os cotovelos, devagar.',
          cronica: '{nome} tentou dar o exemplo nas Docas e torceu o ombro.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Perguntar para onde vão',
        teste: { chave: 'sabedoria', dificuldade: 7 },
        ajuda: ['manual'],
        sucesso: {
          texto: 'Você pergunta, sem levantar a voz, onde o casulo desce. Ninguém sabe. A última nave veio há onze anos. Um casulo é a mesma falta de ar, só que sozinho. A fila se desfaz em resmungos.',
          cronica: '{nome} perguntou às Docas para onde iam os casulos, e ninguém soube responder.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: '"Para longe daqui", responde alguém, e a fila aplaude. Não há argumento contra isso. Você passa espremido, levando uma cotovelada que não era para você.',
          cronica: '{nome} discutiu com uma fila assustada e perdeu.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Lembrar a promessa dos fundadores',
        teste: { chave: 'fe', dificuldade: 7 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'Você sobe na esteira e ergue o cartucho, com a etiqueta para a fila. Os bisavós de todos ali assinaram embaixo de uma frase: ninguém respira sozinho. Você só lê em voz alta. Tonho Graxa tira o boné.',
          cronica: '{nome} leu a etiqueta dos fundadores para as Docas paradas, e as Docas voltaram ao serviço.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'A frase sai, mas o medo da fila é mais alto. Alguém grita que fundador não paga garrafa. Por um instante você também olha os casulos e faz a conta.',
          cronica: '{nome} falou dos fundadores a uma fila que só ouvia o medidor de ar.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
        critico: {
          texto: 'Quando você termina de ler, a fila inteira repete a frase, baixo, como reza. Tonho Graxa refaz o lacre do casulo com as próprias mãos e manda dois da turma abrirem caminho para você até o Eixo.',
          cronica: '{nome} fez as Docas repetirem a promessa dos fundadores e seguiu com escolta.',
          efeitos: { lacos: 1, marco: true, brasa: 1 },
        },
      },
      {
        id: 'ciencias',
        rotulo: 'Fazer a conta do casulo',
        requer: { nivel: { ciencias: 1 } },
        teste: { chave: 'ciencias', dificuldade: 3 },
        sucesso: {
          texto: 'Você risca a conta na lateral do casulo, com giz de marcar carga: seis horas de ar, nenhum motor, nenhuma nave em onze anos. Não precisa explicar o resultado. Quem estava na frente da fila apaga o próprio nome da lista.',
          cronica: '{nome} riscou a conta do casulo a giz, e a fila se desfez.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'A conta está certa, mas o giz quebra, a letra sai tremida e alguém diz que doutor também erra. A fila fica. Você passa.',
          cronica: '{nome} fez a conta certa para a fila errada.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'fama',
        rotulo: 'Chamar cada um pelo nome',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Você conhece a fila inteira: carregou a mudança de metade e o caixão do pai da outra metade. Chama um por um, pelo nome. É difícil furar fila olhando para você. O serviço recomeça, devagar.',
          cronica: '{nome} desfez a fila dos casulos chamando cada estivador pelo nome.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ar2-assobio',
    ato: 2,
    titulo: 'O assobio da Parafuso Solto',
    texto:
      'A cantina Parafuso Solto está cheia e muda. Em algum ponto da parede do fundo, a que dá para o casco, o ar assobia para fora, fino como chaleira. Ninguém acha o furo. As canecas tremem nas mãos, o dono segura uma chapa de remendo sem saber onde pôr, e o medidor da cantina desce um risco enquanto você olha.',
    abordagens: [
      {
        id: 'fisico',
        rotulo: 'Tapar com as costas',
        teste: { chave: 'fisico', dificuldade: 7 },
        ajuda: ['traje', 'remendo'],
        sucesso: {
          texto: 'Você corre as costas pela parede até o frio morder num ponto só, e fica ali, de rolha, enquanto o dono solda a chapa em volta. Sai com um círculo roxo entre as omoplatas e uma tigela de sopa.',
          cronica: '{nome} tapou com as costas o vazamento da Parafuso Solto.',
          efeitos: { lacos: 1, vida: -1 },
        },
        falha: {
          texto: 'O frio queima antes de você achar o ponto. Você se afasta com as costas dormentes, e o furo só aparece muito depois, quando o gelo desenha uma flor branca na parede.',
          cronica: '{nome} procurou o vazamento da cantina com o corpo e saiu queimado de frio.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'sabedoria',
        rotulo: 'Seguir a fumaça do fogareiro',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        ajuda: ['luz', 'remendo'],
        sucesso: {
          texto: 'Coisa de avó: você sopra o fogareiro e deixa a fumaça escolher. Ela deita, corre rente à parede e some atrás do quadro do campeonato de dominó. A chapa entra ali. O assobio para.',
          cronica: '{nome} achou o vazamento da Parafuso Solto com a fumaça de um fogareiro.',
          efeitos: { lacos: 1, brasa: 1 },
        },
        falha: {
          texto: 'A fumaça se espalha pela cantina inteira e não aponta coisa nenhuma. Agora, além de vazando, o lugar está enfumaçado, e todo mundo tosse olhando para você.',
          cronica: '{nome} encheu de fumaça uma cantina que já estava sem ar.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'fe',
        rotulo: 'Pedir silêncio e escutar',
        teste: { chave: 'fe', dificuldade: 6 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você pede que todos prendam o fôlego, juntos, e fecha os olhos. No silêncio de quarenta pessoas, o assobio tem endereço. Você anda até ele e põe o dedo. Alguém atrás de você começa a rezar de alívio.',
          cronica: '{nome} fez a cantina inteira calar e achou o vazamento de olhos fechados.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'No silêncio, o assobio parece vir de todo lado, e de dentro de você também. É o som do lado de fora chamando. Você abre os olhos depressa. O furo, quem acha é uma criança.',
          cronica: '{nome} escutou demais o assobio do vácuo na Parafuso Solto.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'fita',
        rotulo: 'Fechar com fita prateada',
        requer: { item: 'fita' },
        livre: true,
        resultado: {
          texto: 'Você molha o dedo, corre a parede e sente o puxão. Três voltas de fita prateada, cruzadas, do jeito que não se ensina em manual. O assobio morre. O rolo acabou, e a cantina respira.',
          cronica: '{nome} gastou o último rolo de fita prateada selando a Parafuso Solto.',
          efeitos: { semItem: 'fita', lacos: 1, brasa: 1 },
        },
      },
      {
        id: 'amparo',
        rotulo: 'Sossegar a cantina',
        requer: { nivel: { magiaSuporte: 1 } },
        teste: { chave: 'magiaSuporte', dificuldade: 4 },
        sucesso: {
          texto: 'O medo de quarenta pessoas faz mais barulho que o furo. Você baixa o tom de todo mundo, como quem abafa um pano. No sossego, o dono ouve o assobio, acha, remenda, e põe um chá na sua mão.',
          cronica: '{nome} sossegou a cantina inteira, e no sossego acharam o vazamento.',
          efeitos: { lacos: 1, brasa: 1, item: 'cha' },
        },
        falha: {
          texto: 'É gente demais com medo demais. Você segura o que consegue e o resto transborda em você. O furo é achado, mas você passa um tempo sentado no chão da cozinha.',
          cronica: '{nome} tentou carregar o medo de uma cantina inteira.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
];
