/**
 * Ar Rarefeito, Ato 1: O Anel Verde. Gravidade normal, luz de lâmpada-sol,
 * horta, galinha, cabra e gente. Problemas pequenos, de vizinho, enquanto o
 * medidor de ar desce (no código, o efeito `brasa`).
 */

export const itens = {};

export const companheiros = {
  biaDoGalinheiro: {
    nome: 'Bia',
    quem: 'dez anos, dona do Galinheiro Alto, conhece todos os dutos do anel',
    niveis: { agilidade: 1, percepcao: 2 },
  },
  daviEnfermeiro: {
    nome: 'Davi',
    quem: 'enfermeiro do anel, cansado e gentil, de bolsos vazios e mãos firmes',
    niveis: { sabedoria: 1, empatia: 1 },
  },
};

export const inimigos = {
  galoBrigadeiro: {
    nome: 'Brigadeiro, o galo',
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
    id: 'ar1-mirtes',
    ato: 1,
    titulo: 'A cabra do conselho',
    texto:
      'A Horta Grande está seca desde cedo: a bomba de irrigação parou, e a braçadeira que faltava nela vai embora entre os canteiros, na boca de Mirtes, a cabra do conselho. O corredor para as Docas passa por ali, alagado até a canela pelo cano solto. Mirtes mastiga devagar, olhando para você. Os tomateiros murcham em volta.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Agarrar a cabra',
        teste: { chave: 'agilidade', dificuldade: 6 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'Mirtes finta para a esquerda, você também. Um abraço no pescoço, um berro ofendido, e a braçadeira cai babada na sua mão. A bomba volta a pulsar e o corredor escoa em minutos.',
          cronica: '{nome} agarrou a cabra do conselho e devolveu a braçadeira à bomba.',
        },
        falha: {
          texto: 'Você agarra um pé de alface, depois uma estaca, depois o chão. Mirtes larga a braçadeira sozinha quando enjoa do gosto. Você atravessa a horta enlameado, com o medidor de ar um risco abaixo.',
          cronica: '{nome} correu atrás de uma cabra pela Horta Grande inteira e perdeu.',
          efeitos: { brasa: -1 },
        },
        critico: {
          texto: 'Você salta o canteiro de couve e cai montado em Mirtes, que para de susto. A horta inteira aplaude de enxada na mão. Alguém lhe enfia um saco de ração na mochila: "Para a próxima cabra."',
          cronica: '{nome} montou na cabra do conselho diante da Horta Grande inteira.',
          efeitos: { item: 'racao' },
        },
        desastre: {
          texto: 'Mirtes espera você chegar bem perto e abaixa a cabeça. A cabeçada pega na coxa e joga você de costas na vala do cano solto. Ela termina a braçadeira ali mesmo, assistindo.',
          cronica: '{nome} levou uma cabeçada da cabra do conselho e caiu na vala.',
          efeitos: { vida: -2, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Improvisar outra braçadeira',
        teste: { chave: 'inteligencia', dificuldade: 5 },
        ajuda: ['remendo', 'ferramenta'],
        sucesso: {
          texto: 'Um arame de tutorar tomate, três voltas e um pedaço de mangueira velha por baixo. Fica feio e aguenta. A bomba volta a pulsar, e Mirtes perde o interesse na braçadeira assim que ninguém mais a quer.',
          cronica: '{nome} consertou a bomba da Horta Grande com arame de tomateiro.',
        },
        falha: {
          texto: 'O arame segura até a bomba ganhar pressão. Depois solta, e o jato pega você no peito. O conserto de verdade leva o resto do turno, com Mirtes mastigando ao fundo.',
          cronica: '{nome} tomou um banho de irrigação tentando consertar a bomba da horta.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Chamar Mirtes pelo nome',
        teste: { chave: 'presenca', dificuldade: 5 },
        ajuda: ['isca'],
        sucesso: {
          texto: '"Mirtes." Você diz no tom de quem preside reunião. A cabra reconhece autoridade quando ouve: vem, cospe a braçadeira no seu pé e fica esperando o próximo item da pauta.',
          cronica: '{nome} chamou a cabra do conselho pelo nome, e ela obedeceu.',
        },
        falha: {
          texto: 'Você chama, assobia, promete. Mirtes ouve tudo com atenção e engole a braçadeira. Os hortelãos torcem outra com um pedaço de calha, e você perde a manhã segurando a ponta.',
          cronica: '{nome} discursou para uma cabra, que engoliu a prova.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'lidarAnimais',
        rotulo: 'Coçar atrás do chifre',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Você chega de lado, sem olhar, e coça onde cabra nenhuma alcança. Mirtes fecha os olhos e abre a boca. Os hortelãos, que tentavam desde cedo, pagam a aula com um saco de ração.',
          cronica: '{nome} tirou a braçadeira da boca de Mirtes com uma coçada atrás do chifre.',
          efeitos: { item: 'racao' },
        },
        falha: {
          texto: 'Mirtes aceita a coçada inteira, suspira e só então sai andando com a braçadeira. Você vai atrás, coçando, até o fim do canteiro, onde ela enfim troca o ferro por um talo de couve.',
          cronica: '{nome} coçou a cabra do conselho por um canteiro inteiro até ela ceder.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-filtro',
    ato: 1,
    titulo: 'O filtro da creche',
    texto:
      'Na porta da creche, Dona Celeste está sentada num caixote com um filtro de ar no colo, largo como um lençol. Tem a agulha numa mão e a linha na outra, e as duas não se encontram. "Os olhos foram embora na safra passada", diz. Lá dentro, quinze crianças dormem a sesta respirando por um filtro rasgado.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Costurar você mesmo',
        teste: { chave: 'destreza', dificuldade: 6 },
        sucesso: {
          texto: 'A linha entra na terceira tentativa. Você fecha o rasgo em pontos miúdos, e Dona Celeste confere com a unha, um por um. Aprova com um resmungo e um saquinho de chá de hortelã.',
          cronica: '{nome} costurou o filtro da creche sob a unha exigente de Dona Celeste.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Seus pontos ficam largos como dentes de criança. Dona Celeste desmancha tudo com paciência e dita cada ponto de novo, devagar, enquanto o medidor de ar desce um risco.',
          cronica: '{nome} costurou o filtro da creche duas vezes, a segunda sob ditado.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Procurar o rasgo escondido',
        teste: { chave: 'percepcao', dificuldade: 5 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'O rasgo grande todo mundo viu. Você estende o filtro contra a lâmpada-sol e acha o outro, fino como um cabelo, bem na dobra. Dona Celeste fica um tempo calada. Depois lhe dá chá.',
          cronica: '{nome} achou no filtro da creche o rasgo que ninguém tinha visto.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'Você examina o pano palmo a palmo e não acha nada além do rasgo óbvio. Uma vizinha vem enfiar a linha. O filtro volta para a grade chiando um pouco, e você segue com essa pulga.',
          cronica: '{nome} procurou um defeito no filtro da creche e saiu sem certeza.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ouvir a história do filtro',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'O pano veio com os fundadores, ela conta, e cada remendo tem o nome de quem deu o ponto. Enquanto fala, as mãos dela lembram sozinhas. A linha entra. O último ponto ela deixa para você.',
          cronica: '{nome} deu um ponto no filtro dos fundadores, ao lado dos nomes antigos.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'A história é comprida e tem três gerações de costureiras. Você olha o medidor de ar uma vez, e ela vê. "Vai, vai. Quem tem pressa não remenda." Você vai, com o rosto quente.',
          cronica: '{nome} olhou o medidor no meio da história de Dona Celeste.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'prestidigitacao',
        rotulo: 'Enfiar a linha sem olhar',
        requer: { nivel: { prestidigitacao: 1 } },
        teste: { chave: 'prestidigitacao', dificuldade: 3 },
        sucesso: {
          texto: 'Dedo que tira ficha de bolso alheio enfia linha de olho fechado. Você costura conversando, e o ponto sai mais miúdo que o dela. Dona Celeste lhe dá o chá e a agulha reserva embrulhada num gel de sutura.',
          cronica: '{nome} costurou o filtro da creche de olhos fechados e deixou Dona Celeste sem assunto.',
          efeitos: { lacos: 1, item: ['cha', 'gel'] },
        },
        falha: {
          texto: 'A mão é boa, mas Dona Celeste conhece a sua fama e não tira o olho ruim dos seus dedos. Você erra duas vezes de puro nervoso. O filtro fica pronto mesmo assim.',
          cronica: '{nome} costurou o filtro da creche vigiado de perto por Dona Celeste.',
          efeitos: { lacos: 1 },
        },
      },
    ],
  },
  {
    id: 'ar1-algas',
    ato: 1,
    titulo: 'A válvula do fundo',
    texto:
      'Os tanques de alga dão um terço do ar do anel, e o maior deles está indo embora pelo ralo. A válvula de fundo travou aberta, três metros abaixo de uma sopa verde e morna. Meia dúzia de moradores olha da borda, cada um com um balde e nenhuma ideia. O nível desce um dedo enquanto você chega.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Mergulhar até a válvula',
        teste: { chave: 'fisico', dificuldade: 6 },
        ajuda: ['luz'],
        sucesso: {
          texto: 'Você desce de olhos fechados, que abertos dá no mesmo. Acha o volante no tato e gira até o peito queimar. Sobe verde dos pés à cabeça, e o tanque para de descer.',
          cronica: '{nome} mergulhou no tanque de algas e fechou a válvula num fôlego só.',
        },
        falha: {
          texto: 'O fôlego acaba com a válvula pela metade. Você sobe engasgado, engole alga, desce de novo, sobe de novo. Fecha na quarta vez, com meio tanque perdido e o peito doendo.',
          cronica: '{nome} precisou de quatro mergulhos para fechar a válvula das algas.',
          efeitos: { vida: -1, brasa: -1 },
        },
        critico: {
          texto: 'A válvula fecha fácil, e sobra fôlego para tatear o fundo. Há uma lanterna de testa presa na grade, perdida por alguém há muitas safras. Você sobe com ela acesa, e a borda inteira grita.',
          cronica: '{nome} fechou a válvula das algas e voltou do fundo com uma lanterna acesa.',
          efeitos: { item: 'lanterna' },
        },
        desastre: {
          texto: 'A manga prende no volante. Por um tempo comprido só existe verde e a vontade de abrir a boca. Alguém puxa você pela gola. A válvula fecha depois, a balde e a grito.',
          cronica: '{nome} ficou preso no fundo do tanque de algas e foi puxado pela gola.',
          efeitos: { vida: -2, sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Esvaziar pelo sifão',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['ferramenta', 'manual'],
        sucesso: {
          texto: 'Uma mangueira de rega, cheia e dobrada na ponta, puxa a sopa para o tanque vizinho mais depressa que o ralo leva. Com o nível na cintura, qualquer um alcança a válvula a pé.',
          cronica: '{nome} salvou as algas com uma mangueira de rega e um sifão.',
        },
        falha: {
          texto: 'O sifão funciona, só que ao contrário: o tanque vizinho começa a descer também. Você arranca a mangueira no susto e fecha a válvula por último, tarde, num palmo de alga.',
          cronica: '{nome} quase esvaziou dois tanques de alga em vez de um.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Organizar a fila de baldes',
        teste: { chave: 'lideranca', dificuldade: 5 },
        sucesso: {
          texto: 'Você põe o mais alto na borda, as crianças na ponta e dá o ritmo com a palma. A sopa passa de mão em mão para o tanque ao lado. Quando o fundo aparece, a fila já canta.',
          cronica: '{nome} pôs o Anel Verde em fila e salvou as algas balde a balde.',
          efeitos: { marco: true },
        },
        falha: {
          texto: 'Todo mundo quer ficar na borda e ninguém na ponta. Dois baldes se chocam, um vizinho ofendido vai embora. A fila anda aos trancos, e meio tanque escorre antes de o fundo aparecer.',
          cronica: '{nome} tentou organizar uma fila de baldes e organizou uma discussão.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'engenharia',
        rotulo: 'Fechar o registro de cima',
        requer: { nivel: { engenharia: 1 } },
        teste: { chave: 'engenharia', dificuldade: 3 },
        ajuda: ['ferramenta'],
        sucesso: {
          texto: 'Todo tanque dos fundadores tem dois registros, e o segundo fica sempre atrás de uma tampa pintada por cima. Você raspa a tinta, dá meia volta, e o tanque para e volta a borbulhar. O medidor de ar sobe um risco.',
          cronica: '{nome} achou o segundo registro do tanque de algas debaixo de três demãos de tinta.',
          efeitos: { brasa: 1 },
        },
        falha: {
          texto: 'O registro está onde devia, soldado de ferrugem. Você o vence com paciência e óleo de cozinha, e o tanque para com um terço a menos.',
          cronica: '{nome} brigou com um registro enferrujado no tanque de algas.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'sobrevivencia',
        rotulo: 'Descer sem gastar o fôlego',
        requer: { nivel: { sobrevivencia: 1 } },
        teste: { chave: 'sobrevivencia', dificuldade: 3 },
        sucesso: {
          texto: 'Quem trabalha de traje aprende a fazer um pulmão durar. Você solta o ar aos poucos, desce sem pressa, gira o volante contando e ainda confere a vedação antes de subir.',
          cronica: '{nome} fechou a válvula das algas com a calma de quem conhece pouco ar.',
        },
        falha: {
          texto: 'A conta do fôlego estava certa para água. Sopa de alga é mais grossa. Você fecha a válvula e sobe vendo estrelas, tossindo verde por um bom tempo.',
          cronica: '{nome} fechou a válvula das algas e tossiu verde o resto do turno.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-sementes',
    ato: 1,
    titulo: 'A estante dos fundadores',
    texto:
      'O atalho corta a sala de sementes, colada à creche. Na hora em que você entra, a estante dos fundadores estala e começa a inclinar: quatro prateleiras de vidros etiquetados na língua velha, cada um a última semente de alguma coisa. Embaixo dela, numa esteira, três crianças fugidas da sesta olham para cima de boca aberta.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Escorar a estante no ombro',
        teste: { chave: 'forca', dificuldade: 7 },
        ajuda: ['alavanca'],
        sucesso: {
          texto: 'Você mete o ombro debaixo da segunda prateleira e trava os joelhos. Os vidros tilintam e ficam. As crianças saem engatinhando por entre as suas pernas e voltam com a professora e um calço.',
          cronica: '{nome} segurou no ombro a estante de sementes dos fundadores.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O peso vence devagar. As crianças escapam, a estante desce até o seu joelho e seis vidros se abrem no chão. Você passa um bom tempo catando semente por semente com a ponta do dedo.',
          cronica: '{nome} amparou a estante de sementes e catou do chão o que caiu.',
          efeitos: { vida: -1, brasa: -1 },
        },
        desastre: {
          texto: 'O pé escorrega na esteira. A estante desce inteira, com você embaixo fazendo de calço. As crianças saem ilesas. O feijão-de-corda dos fundadores, a partir de hoje, só existe em fotografia.',
          cronica: '{nome} serviu de calço para a estante de sementes, e uma semente se perdeu para sempre.',
          efeitos: { vida: -3, sanidade: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o parafuso que cedeu',
        teste: { chave: 'percepcao', dificuldade: 5 },
        ajuda: ['ferramenta', 'luz'],
        sucesso: {
          texto: 'A estante não está caindo, está girando: três parafusos seguram, o de cima à esquerda soltou. Você enfia o cabo de uma colher de jardim no furo, e ela para no meio do gesto.',
          cronica: '{nome} parou a queda da estante de sementes com uma colher de jardim.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você procura o defeito em cima enquanto ele acontece embaixo. Puxa as crianças pela esteira no último instante. Dois vidros estouram no chão, e o cheiro de coentro velho enche a sala.',
          cronica: '{nome} tirou as crianças de baixo da estante, mas não salvou todos os vidros.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Manter as crianças quietas',
        teste: { chave: 'vontade', dificuldade: 5 },
        sucesso: {
          texto: 'Qualquer grito e elas correm para o lado errado. Você se agacha, sorri sem pressa e chama de estátua. Elas viram estátua. Saem na ponta do pé, uma por vez, e só então você grita por ajuda.',
          cronica: '{nome} tirou três crianças de baixo da estante brincando de estátua.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A voz sai fina. A menor começa a chorar, as outras correm, uma esbarra no pé da estante. Ninguém se machuca, mas um vidro cai, e o choro acorda a creche inteira.',
          cronica: '{nome} assustou as crianças da creche debaixo da estante de sementes.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'sintonia',
        rotulo: 'Sintonizar as três',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 4 },
        sucesso: {
          texto: 'Três medos pequenos, agudos como apito. Você acha o tom deles e baixa, como quem abafa uma corda. As crianças bocejam e saem andando de mãos dadas. A professora chega, vê e prefere não perguntar.',
          cronica: '{nome} acalmou três crianças debaixo da estante sem dizer palavra.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O medo delas entra em você em vez de sair delas. Por um instante a estante parece enorme e você tem quatro anos. Passa. As crianças já correram sozinhas para a porta.',
          cronica: '{nome} sentiu o medo de três crianças como se fosse seu.',
          efeitos: { sanidade: -2 },
        },
      },
    ],
  },
  {
    id: 'ar1-praca',
    ato: 1,
    titulo: 'As garrafinhas da praça',
    texto:
      'A Praça das Trocas parou de trocar. No meio dela, o dono da banca de conservas e uma tecelã puxam cada um uma alça do mesmo caixote: as garrafinhas de ar de emergência do anel. Em volta, cinquenta pessoas escolhem lado. Alguém conta em voz alta e chega a dezoito garrafinhas. Na tampa do caixote está escrito vinte e quatro.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Separar os dois',
        teste: { chave: 'forca', dificuldade: 7 },
        sucesso: {
          texto: 'Você entra no meio, pega uma alça em cada mão e levanta o caixote acima das cabeças. Os dois ficam segurando o vazio. A praça ri, a raiva esfria, e a contagem recomeça em cima de uma banca.',
          cronica: '{nome} ergueu o caixote das garrafinhas acima da briga na Praça das Trocas.',
        },
        falha: {
          texto: 'Um cotovelo que não era para você acha o seu nariz. O caixote cai, as garrafinhas rolam por baixo das bancas, e a praça gasta o turno de quatro no chão atrás delas.',
          cronica: '{nome} apartou uma briga na praça com o nariz.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Refazer a conta do estoque',
        teste: { chave: 'sabedoria', dificuldade: 6 },
        ajuda: ['troca'],
        sucesso: {
          texto: 'Ninguém roubou. Você pergunta quem teve criança doente nesta safra e seis mãos sobem devagar. A Enfermaria pegou emprestado e não anotou. A briga perde o chão, e a praça decide dividir por casa.',
          cronica: '{nome} achou as seis garrafinhas que faltavam sem acusar ninguém.',
          efeitos: { lacos: 1, marco: true },
        },
        falha: {
          texto: 'Você soma em voz alta e chega a dezenove. A praça agora briga por causa de três números. Vai longe, até uma velha contar de novo com grãos de feijão e todos cansarem.',
          cronica: '{nome} recontou as garrafinhas da praça e achou um terceiro resultado.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Fazer a praça rir',
        teste: { chave: 'presenca', dificuldade: 6 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'Você sobe numa banca e leiloa o ar que os dois estão gastando na gritaria: quem dá mais? A tecelã ri primeiro, contra a vontade. Depois a praça toda. Dividem as garrafinhas por casa, ainda rindo.',
          cronica: '{nome} leiloou o fôlego de dois brigões e fez a Praça das Trocas rir.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A piada cai no silêncio de cinquenta pessoas com medo. "Tem graça para quem vai embora", diz alguém. Você desce da banca. A briga recomeça com mais gosto, e sem você.',
          cronica: '{nome} contou uma piada na Praça das Trocas e ninguém riu.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'boaFama',
        rotulo: 'Pedir a palavra',
        requer: { antecedente: 'boaFama' },
        livre: true,
        resultado: {
          texto: 'Metade da praça já teve um armário carregado por você. Basta levantar a mão. Fazem silêncio, ouvem, dividem por casa. A tecelã ainda lhe enfia umas fichas no bolso, para o caminho.',
          cronica: '{nome} levantou a mão na Praça das Trocas e a briga parou para ouvir.',
          efeitos: { lacos: 1, item: 'fichas' },
        },
      },
      {
        id: 'maFama',
        rotulo: 'Deixar que culpem você',
        requer: { antecedente: 'maFama' },
        livre: true,
        resultado: {
          texto: 'Alguém aponta: "Onde some coisa, esse aí está perto." Você não desmente. Os dois largam o caixote para vigiar os seus bolsos, e a praça se une na hora. Contra você, mas se une.',
          cronica: '{nome} acabou com a briga da praça deixando que a culpa caísse em si.',
          efeitos: { sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-galinheiro',
    ato: 1,
    titulo: 'O alarme do Galinheiro Alto',
    texto:
      'O alarme de fumaça do Galinheiro Alto disparou sem fumaça nenhuma, e a porta corta-fogo do corredor fechou na sua cara. O botão de silenciar fica a dez metros, lá dentro, atrás da tela. Entre a tela e o botão, trezentas galinhas em pânico e o galo Brigadeiro, que nunca gostou de visita e hoje está com razão. Os dutos dali, todo mundo sabe, são de Bia, a menina de dez anos que cuida das poedeiras.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Entrar e encarar o galo',
        combate: 'galoBrigadeiro',
        vitoria: {
          texto: 'Brigadeiro recua para o poleiro mais alto, despenteado, jurando vingança. Você aperta o botão com a mão bicada. O silêncio cai, a porta corta-fogo abre, e trezentas galinhas olham para você com reprovação.',
          cronica: '{nome} venceu o galo Brigadeiro e não conta isso a ninguém.',
        },
        derrota: {
          texto: 'Você sai pela tela de costas, protegendo os olhos. Brigadeiro canta lá dentro, por cima do alarme. Uma vizinha de luva grossa entra e resolve em um minuto, sem comentar.',
          cronica: '{nome} foi expulso do Galinheiro Alto por um galo.',
          efeitos: { brasa: -1 },
        },
        fuga: {
          texto: 'Duas bicadas bastam para você reconsiderar. Sai, fecha a tela e espera o alarme cansar sozinho, o que leva quase um turno. Brigadeiro passa o tempo todo olhando.',
          cronica: '{nome} bateu em retirada diante do galo do Galinheiro Alto.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Achar o quadro de força',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['mapa', 'scanner'],
        sucesso: {
          texto: 'Alarme velho tem disjuntor próprio, e os fundadores punham tudo atrás do bebedouro. Lá está o quadro. Na porta dele, dobrada em oito, uma planta da estação que ninguém consultava desde antes de você nascer.',
          cronica: '{nome} calou o alarme do galinheiro pelo quadro de força e achou uma planta da estação.',
          efeitos: { item: 'planta' },
        },
        falha: {
          texto: 'Você acha um quadro, e desliga com convicção a lâmpada-sol do galinheiro. No escuro as galinhas calam. O alarme, não. Leva um bom tempo até alguém lhe mostrar o disjuntor certo.',
          cronica: '{nome} apagou a luz do Galinheiro Alto em vez do alarme.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Pedir a Bia o duto',
        teste: { chave: 'presenca', dificuldade: 5 },
        sucesso: {
          texto: 'Bia ouve com os braços cruzados, pesa você de cima a baixo e some por uma grade de ventilação. O alarme cala. Ela reaparece do outro lado da porta: "Daqui até as Docas eu sei um caminho melhor que o seu."',
          cronica: '{nome} convenceu Bia a calar o alarme pelo duto, e ela resolveu ir junto.',
          efeitos: { companheiro: 'biaDoGalinheiro', marca: 'a1-bia' },
        },
        falha: {
          texto: '"O duto é meu", diz Bia, e cobra pedágio: você varre o galinheiro de fora enquanto ela pensa. Ela pensa bastante. Depois entra, aperta o botão e vai cuidar das galinhas.',
          cronica: '{nome} varreu o Galinheiro Alto para pagar o pedágio de um duto.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'equilibrio',
        rotulo: 'Ir pela viga dos poleiros',
        requer: { nivel: { equilibrio: 1 } },
        teste: { chave: 'equilibrio', dificuldade: 3 },
        sucesso: {
          texto: 'A viga tem um palmo de largura e corre por cima de tudo. Para quem anda no casco, é avenida. Você passa sobre Brigadeiro, que não acredita, e aperta o botão com a ponta do pé.',
          cronica: '{nome} cruzou o Galinheiro Alto pela viga e calou o alarme com o pé.',
        },
        falha: {
          texto: 'Viga de galinheiro tem o que casco de estação não tem. Você escorrega no meio e desce sentado num monte de palha, a um passo do botão e a dois do galo. Aperta e corre.',
          cronica: '{nome} escorregou da viga do galinheiro e caiu perto o bastante do botão.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'bia',
        rotulo: 'Deixar com a Bia',
        requer: { companheiro: 'biaDoGalinheiro' },
        livre: true,
        resultado: {
          texto: 'Bia nem espera você pedir. Some pela grade, o alarme cala, e lá de dentro vem a voz dela dando bronca no galo pelo nome completo. A porta abre. Ela volta com um ovo no bolso.',
          cronica: 'Bia calou o alarme do Galinheiro Alto antes que {nome} terminasse a frase.',
        },
      },
    ],
  },
  {
    id: 'ar1-fichas',
    ato: 1,
    requer: { semMarca: 'a1-bia' },
    titulo: 'As fichas do conselho',
    texto:
      'A caixa de fichas do conselho amanheceu vazia, e sem ficha ninguém libera a passagem de serviço para as Docas. Bia, dez anos, sentada na escada do Galinheiro Alto, jura que não viu nada. Jura depressa, antes da pergunta. Tem milho novo nos bolsos, num turno em que a ração foi cortada pela metade.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir ao esconderijo dela',
        teste: { chave: 'destreza', dificuldade: 6 },
        ajuda: ['cabo'],
        sucesso: {
          texto: 'Atrás da última grade, lá no alto, há um ninho de cobertor e uma lata com as fichas que sobraram. Você devolve a lata ao conselho sem dizer onde achou. A conselheira de turno lhe separa um punhado para a viagem.',
          cronica: '{nome} achou as fichas do conselho num duto e não disse de quem era o esconderijo.',
          efeitos: { item: 'fichas' },
        },
        falha: {
          texto: 'O duto é do tamanho de uma menina de dez anos. Você entala na segunda curva, e é a própria Bia quem puxa você pelos pés, rindo, e entrega a lata só para a cena acabar.',
          cronica: '{nome} entalou num duto do galinheiro e foi salvo pela suspeita.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Perceber a mentira',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'Quem jura antes da pergunta já respondeu. Você só diz que galinha com fome não põe, e que alguém precisava fazer a conta. Bia olha o chão, vai buscar a lata e entrega as fichas que sobraram.',
          cronica: '{nome} percebeu a mentira de Bia e entendeu o motivo antes de cobrar.',
        },
        falha: {
          texto: 'Você acredita. Passa meio turno interrogando o homem das conservas, que tem cara de culpado desde que nasceu. As fichas aparecem sozinhas na caixa, depois, faltando umas tantas.',
          cronica: '{nome} acusou o homem das conservas pelo sumiço das fichas, e errou.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Sentar e deixar que conte',
        teste: { chave: 'empatia', dificuldade: 5 },
        ajuda: ['isca'],
        sucesso: {
          texto: 'Você se senta no degrau de baixo e fala de galinha. Lá pelas tantas ela conta tudo, de uma vez, com raiva. Devolvem a lata juntos. "Se o ar acabar, o milho não adianta", ela conclui, e pega a mochila.',
          cronica: '{nome} ouviu a confissão de Bia num degrau do galinheiro e ganhou uma guia.',
          efeitos: { companheiro: 'biaDoGalinheiro', marca: 'a1-bia' },
        },
        falha: {
          texto: 'Ela fala de galinha por muito tempo, com muito detalhe, e de ficha nenhuma. Quando você se levanta, sabe o nome de trinta poedeiras. A lata aparece na caixa do conselho só na troca de turno.',
          cronica: '{nome} aprendeu o nome de trinta galinhas e nada sobre as fichas.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'investigacao',
        rotulo: 'Seguir o rastro do milho',
        requer: { nivel: { investigacao: 1 } },
        teste: { chave: 'investigacao', dificuldade: 3 },
        sucesso: {
          texto: 'Milho novo só sai de uma banca, e a dona lembra bem da freguesa pequena que pagou adiantado. Você mostra a Bia que sabe e que não vai contar. Ela devolve as fichas e resolve ficar de olho em você de perto.',
          cronica: '{nome} seguiu um rastro de milho até Bia e guardou o segredo dela.',
          efeitos: { companheiro: 'biaDoGalinheiro', marca: 'a1-bia', item: 'fichas' },
        },
        falha: {
          texto: 'O rastro leva à banca certa, mas a dona não entrega freguesa. Bia vê você rondando e devolve a lata por conta própria, de madrugada, com um bilhete malcriado.',
          cronica: '{nome} rondou a banca do milho até as fichas voltarem sozinhas.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'furtividade',
        rotulo: 'Seguir Bia sem ser visto',
        requer: { nivel: { furtividade: 1 } },
        teste: { chave: 'furtividade', dificuldade: 3 },
        sucesso: {
          texto: 'Ela confere a lata a cada hora, como todo ladrão novato. Você espera ela sair, tira as fichas e deixa no lugar o seu lenço. O conselho paga o achado com um punhado delas.',
          cronica: '{nome} recuperou as fichas do conselho e deixou um lenço no lugar.',
          efeitos: { item: 'fichas' },
        },
        falha: {
          texto: 'Ninguém segue Bia nos dutos dela. Você dá a volta completa no galinheiro e a encontra sentada no mesmo degrau, esperando, com a lata no colo e cara de quem ganhou.',
          cronica: '{nome} tentou seguir Bia pelos dutos e foi seguido por ela.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-capela',
    ato: 1,
    titulo: 'A vigília da Janela',
    texto:
      'O atalho para as Docas passa por dentro da Capela da Janela, e é hora de vigília. Vinte pessoas sentadas no chão, de costas para a porta e de frente para o vidro, onde só há o escuro e umas estrelas paradas. Irmã Lúcia lê os nomes dos fundadores, um por um. Faltam uns cento e sessenta.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Dar a volta correndo',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'São seiscentos metros de corredor de serviço com o cartucho batendo nas costas. Você chega do outro lado sem ar e sem atraso, e ainda ouve a irmã no nome quarenta e três.',
          cronica: '{nome} contornou a Capela da Janela correndo com o cartucho nas costas.',
        },
        falha: {
          texto: 'No meio da volta o fôlego acaba, e o corredor de serviço não tem banco. Você termina andando, com uma pontada do lado, e chega depois da vigília.',
          cronica: '{nome} deu a volta pela capela e chegou depois de quem ficou rezando.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Passar conforme o rito',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'Sapato na mão, cabeça baixa, e nunca entre a irmã e o vidro. Você passa pela parede do fundo e toca o batente ao sair, como se deve. Ninguém se vira. Um velho lhe faz sinal de boa viagem.',
          cronica: '{nome} atravessou a vigília da Capela da Janela sem quebrar o rito.',
        },
        falha: {
          texto: 'Você cruza na frente do vidro. Vinte cabeças se levantam, a irmã perde a conta e recomeça do primeiro nome. Ninguém reclama, o que é pior. Você sai de fininho, e isso também leva tempo.',
          cronica: '{nome} fez Irmã Lúcia recomeçar a lista dos fundadores do primeiro nome.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ficar para a vigília',
        teste: { chave: 'fe', dificuldade: 5 },
        ajuda: ['amuleto'],
        sucesso: {
          texto: 'Você se senta de frente para o escuro, e o escuro não faz nada. Lá pelo nome cem, o peito desaperta. Na saída, Irmã Lúcia põe no seu pescoço uma medalha dos fundadores. "Eles também foram a pé."',
          cronica: '{nome} ficou para a vigília, olhou o escuro de frente e saiu com uma medalha.',
          efeitos: { item: 'medalha', marco: true },
        },
        falha: {
          texto: 'O escuro do vidro é grande demais para ficar olhando. Os nomes viram um zumbido, o medidor de ar pesa no pulso. Você sai no meio, com a impressão de que a Janela olhou de volta.',
          cronica: '{nome} não aguentou a vigília e saiu antes do último nome.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'aliado',
        rotulo: 'Fazer sinal à Irmã Lúcia',
        requer: { antecedente: 'aliado' },
        livre: true,
        resultado: {
          texto: 'Irmã Lúcia conhece você desde o berço. Sem parar a leitura, aponta com o queixo a porta da sacristia, que dá direto no corredor. No banco de lá, um saquinho de chá com o seu nome.',
          cronica: 'Irmã Lúcia abriu a sacristia para {nome} sem interromper a lista dos fundadores.',
          efeitos: { item: 'cha' },
        },
      },
      {
        id: 'idiomas',
        rotulo: 'Ler junto na língua velha',
        requer: { nivel: { idiomas: 1 } },
        teste: { chave: 'idiomas', dificuldade: 3 },
        sucesso: {
          texto: 'A irmã lê os nomes de ouvido, e metade está torta. Você pega a outra ponta da lista e lê como estão escritos. Com duas vozes a vigília acaba cedo, e a capela inteira repete um sobrenome que não ouvia havia gerações.',
          cronica: '{nome} leu os nomes dos fundadores na língua velha, como eram ditos.',
          efeitos: { item: 'medalha' },
        },
        falha: {
          texto: 'Você corrige a pronúncia de um nome que, descobre depois, era o da bisavó de Irmã Lúcia. Ela agradece com muita educação. A vigília segue no ritmo dela.',
          cronica: '{nome} corrigiu a pronúncia do nome errado na Capela da Janela.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-enfermaria',
    ato: 1,
    titulo: 'O fole da Enfermaria',
    texto:
      'O ar ruim chegou primeiro à Enfermaria. Cinco velhos em cinco catres, de lábios arroxeados, dividem um concentrador dos fundadores que hoje só funciona no braço, por um fole. Davi, o enfermeiro, bombeia desde o turno passado e dorme em pé entre uma puxada e outra. O armário de remédios atrás dele está aberto e vazio.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Assumir o fole',
        teste: { chave: 'fisico', dificuldade: 6 },
        sucesso: {
          texto: 'Você bombeia até os braços virarem outra coisa. Davi dorme uma hora inteira sentado no chão. Quando acorda, os cinco estão corados, e ele acha no fundo do jaleco um gel de sutura que jurava ter acabado.',
          cronica: '{nome} tocou o fole da Enfermaria por uma hora para o enfermeiro dormir.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'O fole tem um ritmo, e você perde o ritmo. Em vinte minutos seus braços tremem e a sua cabeça gira do mesmo ar ruim. Davi acorda e reassume, pedindo desculpas por você.',
          cronica: '{nome} tentou render Davi no fole e precisou ser rendido.',
          efeitos: { vida: -1, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ligar o fole num motor',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        ajuda: ['ferramenta', 'remendo'],
        sucesso: {
          texto: 'O ventilador do teto gira à toa. Uma correia de avental, uma roldana de soro, e é ele quem puxa o fole, sem cansar. Davi olha as próprias mãos paradas e paga com um gel de sutura.',
          cronica: '{nome} pôs o ventilador da Enfermaria para tocar o fole no lugar de Davi.',
          efeitos: { lacos: 1, item: 'gel' },
        },
        falha: {
          texto: 'A correia aguenta dez puxadas e arrebenta, levando junto a pá do ventilador. Agora a Enfermaria tem um fole no braço e nenhum vento. Você ajuda a consertar o que piorou.',
          cronica: '{nome} quebrou o ventilador da Enfermaria tentando aposentar o fole.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Acalmar a respiração deles',
        teste: { chave: 'vontade', dificuldade: 5 },
        ajuda: ['musica'],
        sucesso: {
          texto: 'Quem tem medo respira por dois. Você se senta entre os catres e respira devagar, alto, até os cinco acompanharem. O fole passa a dar e sobrar. Davi entrega a manivela à parteira: "Vou onde o ar vai ser consertado."',
          cronica: '{nome} ensinou a Enfermaria a respirar devagar, e Davi resolveu seguir junto.',
          efeitos: { lacos: 1, companheiro: 'daviEnfermeiro' },
        },
        falha: {
          texto: 'Você respira devagar. Um dos velhos pergunta, com toda a calma, se o ar vai voltar. Você demora a responder, e os cinco reparam. O fole range mais depressa quando você sai.',
          cronica: '{nome} não soube o que responder a um velho da Enfermaria.',
          efeitos: { sanidade: -2 },
        },
      },
      {
        id: 'medicina',
        rotulo: 'Fazer a triagem',
        requer: { nivel: { medicina: 1 } },
        teste: { chave: 'medicina', dificuldade: 3 },
        ajuda: ['remedio'],
        sucesso: {
          texto: 'Dois dos cinco não precisam do concentrador, precisam sentar direito e de uma janela de duto aberta. Sobra ar para os outros três. Davi lhe dá o último gel e pega o jaleco: "Com você eu aprendo mais que aqui."',
          cronica: '{nome} reorganizou a Enfermaria em dez minutos e levou o enfermeiro consigo.',
          efeitos: { lacos: 1, companheiro: 'daviEnfermeiro', item: 'gel' },
        },
        falha: {
          texto: 'O exame está certo, mas ninguém ali quer largar o bocal para provar a sua teoria. Você convence um por um, no tempo de cada um. Funciona, e demora.',
          cronica: '{nome} gastou um turno convencendo cinco velhos teimosos na Enfermaria.',
          efeitos: { lacos: 1, brasa: -1 },
        },
      },
      {
        id: 'recursos',
        rotulo: 'Buscar o que você guardou',
        requer: { antecedente: 'recursos' },
        livre: true,
        resultado: {
          texto: 'Você tem uma garrafa de oxigênio guardada para um dia ruim, do outro lado do anel. O dia ruim é este. A ida e a volta custam um risco do medidor de ar, e Davi, sem palavra, paga com o último gel de sutura.',
          cronica: '{nome} atravessou o anel para trazer à Enfermaria uma garrafa de oxigênio guardada.',
          efeitos: { lacos: 1, brasa: -1, item: 'gel' },
        },
      },
    ],
  },
  {
    id: 'ar1-abelhas',
    ato: 1,
    titulo: 'A colmeia da estufa',
    texto:
      'Na estufa de polinização o ventilador parou, e as abelhas saíram da caixa atrás de ar. Agora são um novelo zumbindo no teto, em volta da lâmpada-sol, e sem elas a horta não dá fruto na safra que vem. Seu Lázaro, o apicultor, está de véu e luvas e não alcança. "Elas seguem a rainha", diz. "E a rainha segue o calor."',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir e pegar a rainha',
        teste: { chave: 'destreza', dificuldade: 6 },
        sucesso: {
          texto: 'Você sobe pela treliça dos tomates até a altura da lâmpada, com abelha no cabelo e na gola. A rainha é maior e mais lenta. Você a fecha na mão em concha e desce, e o novelo inteiro desce atrás de você, como um casaco.',
          cronica: '{nome} desceu a rainha da estufa na palma da mão, com o enxame atrás.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A treliça balança, as abelhas não gostam, e você desce mais depressa do que subiu, com sete ferroadas e nenhuma rainha. Seu Lázaro resolve depois, com fumaça e paciência.',
          cronica: '{nome} subiu atrás de uma rainha e voltou com sete ferroadas.',
          efeitos: { vida: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Mudar o calor de lugar',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        sucesso: {
          texto: 'Se a rainha segue o calor, quem manda é o calor. Você apaga a lâmpada-sol do teto e acende a de mudas, lá embaixo, ao lado da caixa. O novelo hesita, desce e entra. Seu Lázaro tira o véu para ver melhor.',
          cronica: '{nome} levou as abelhas da estufa de volta para casa trocando a luz de lugar.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você apaga a lâmpada do teto, e as abelhas, no escuro, se espalham pela estufa inteira. Acender de novo e esperar o novelo se refazer leva o resto do turno.',
          cronica: '{nome} apagou a luz da estufa e espalhou o enxame.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Ficar parado no meio delas',
        teste: { chave: 'vontade', dificuldade: 6 },
        sucesso: {
          texto: 'Você entra no zumbido e para. Abelha no rosto, nas mãos, no pescoço. Nenhuma ferroa quem não se mexe. Seu Lázaro aproveita a calma e ergue a caixa até o novelo, que entra sozinho, devagar.',
          cronica: '{nome} ficou imóvel no meio de um enxame até as abelhas voltarem para a caixa.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Uma abelha anda pela sua pálpebra e você pisca. Pisca de novo. Depois já está batendo nos braços e correndo para a porta, e o enxame acha que é guerra.',
          cronica: '{nome} piscou no meio de um enxame, e o enxame não perdoou.',
          efeitos: { vida: -1, sanidade: -1 },
        },
      },
      {
        id: 'lidarAnimais',
        rotulo: 'Zumbir no tom delas',
        requer: { nivel: { lidarAnimais: 1 } },
        teste: { chave: 'lidarAnimais', dificuldade: 3 },
        sucesso: {
          texto: 'Zumbido baixo, mão aberta, respiração lenta. O novelo se desfaz numa fila que entra na caixa como quem volta do trabalho. Seu Lázaro lhe dá um saquinho de chá do pé de hortelã da estufa.',
          cronica: '{nome} conversou com as abelhas da estufa, e elas voltaram para casa em fila.',
          efeitos: { lacos: 1, item: 'cha' },
        },
        falha: {
          texto: 'As abelhas entendem o recado e não concordam. Você sai da estufa com três ferroadas e um respeito novo por elas.',
          cronica: '{nome} discutiu com um enxame e perdeu por três ferroadas.',
          efeitos: { vida: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-tobias',
    ato: 1,
    titulo: 'O voluntário',
    texto:
      'Na saída do Anel Verde, um menino de oito anos espera você com uma fronha nas costas, cheia de pão e de meias. É Tobias, e ele vai junto até o Núcleo, já decidiu. Lá no fundo do corredor, a mãe dele grita o nome, ainda longe. Tobias segura a alça do cartucho com as duas mãos e não solta.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Levá-lo de volta no ombro',
        teste: { chave: 'forca', dificuldade: 6 },
        sucesso: {
          texto: 'Você põe Tobias no ombro como saco de adubo, e ele esperneia o corredor inteiro. A mãe o recebe com um abraço e um puxão de orelha, nessa ordem. Por cima do ombro dela, ele faz você jurar que conta como foi.',
          cronica: '{nome} devolveu Tobias à mãe carregado no ombro, esperneando.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Tobias escorrega do ombro e corre, e menino de oito anos em corredor de anel é sabão. Você leva meio turno para achá-lo de novo, atrás das caixas de adubo.',
          cronica: '{nome} perdeu meio turno correndo atrás de um menino de oito anos.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Dar a ele uma missão aqui',
        teste: { chave: 'sabedoria', dificuldade: 5 },
        sucesso: {
          texto: 'Você explica, sério, que alguém precisa vigiar o medidor de ar do anel e avisar o conselho se ele cair. Serviço de confiança. Tobias pensa, entrega a fronha e vai para o posto de peito estufado.',
          cronica: '{nome} deu a Tobias o posto de vigia do medidor de ar do Anel Verde.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Ele percebe na hora que é truque. "Isso é coisa que se diz para criança", diz, ofendido, e chora. A mãe chega, leva Tobias e olha para você como se a culpa fosse sua.',
          cronica: '{nome} tentou enganar Tobias com uma missão de mentira.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Prometer que volta para contar',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Você se agacha na altura dele e promete, com a mão no cartucho, que volta para contar tudo. Tobias examina a promessa por todos os lados, aceita e solta a alça. A mãe chega a tempo de ver o filho acenar.',
          cronica: '{nome} prometeu a Tobias que voltaria para contar, e ele soltou o cartucho.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'Você promete, mas ele já ouviu promessa de adulto antes. Não solta. Quem resolve é a mãe, chegando de cara vermelha, e o turno vai embora em explicações.',
          cronica: '{nome} prometeu, e Tobias não acreditou.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'semRecursos',
        rotulo: 'Contar que você também foi assim',
        requer: { antecedente: 'semRecursos' },
        livre: true,
        resultado: {
          texto: 'Você conta do menino de bolso vazio que fugiu para as Docas aos nove anos e voltou no mesmo turno, de fome. Tobias ri, contra a vontade, e solta a alça. A história tem um pedaço que você não conta, e ele dói.',
          cronica: '{nome} contou a Tobias a própria fuga de menino, e Tobias ficou.',
          efeitos: { lacos: 1, sanidade: -1 },
        },
      },
    ],
  },
  {
    id: 'ar1-casamento',
    ato: 1,
    titulo: 'A festa suspensa',
    texto:
      'No refeitório do Anel Verde há bandeirolas de pano e uma mesa posta para o casamento de Joana e Teodoro, da turma da horta. O conselho mandou suspender: festa gasta ar. A noiva está de vestido e de braços cruzados, o pai do noivo discute com o conselheiro de turno, e as crianças já comeram metade dos doces.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Levar a festa para a Horta',
        teste: { chave: 'forca', dificuldade: 7 },
        sucesso: {
          texto: 'Mesa, bancos, panela, bolo: você carrega tudo para o meio dos tomateiros, onde as plantas devolvem o ar que a festa gasta. O conselheiro não acha artigo no regulamento contra isso. Os noivos casam debaixo da treliça.',
          cronica: '{nome} carregou um casamento inteiro para o meio da Horta Grande.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'No caminho da horta, o bolo escorrega da tábua. Casam assim mesmo, mais tarde e sem bolo, e você leva a culpa com o glacê na manga.',
          cronica: '{nome} derrubou o bolo de um casamento no corredor da horta.',
          efeitos: { brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Fazer a conta da festa',
        teste: { chave: 'inteligencia', dificuldade: 6 },
        sucesso: {
          texto: 'Quarenta pessoas sentadas gastam menos ar que quarenta pessoas nervosas discutindo de pé. Você faz a conta num guardanapo. O conselheiro confere duas vezes, assina embaixo e manda servir. Sem dança.',
          cronica: '{nome} salvou um casamento com uma conta de ar feita num guardanapo.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'A sua conta está certa, mas o conselheiro acha no guardanapo um erro que não existe e ganha a discussão por cansaço. A festa sai depois, menor, e você não é convidado.',
          cronica: '{nome} fez a conta certa e perdeu a discussão com o conselheiro.',
          efeitos: { sanidade: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Fazer o brinde',
        teste: { chave: 'presenca', dificuldade: 6 },
        sucesso: {
          texto: 'Você sobe num banco e brinda à noiva, ao noivo e ao ar, que é de todos e por isso também é deles hoje. O refeitório aplaude. O conselheiro, encurralado, brinda junto. É o casamento mais curto e mais feliz que o anel já viu.',
          cronica: '{nome} fez o brinde que salvou o casamento de Joana e Teodoro.',
          efeitos: { lacos: 1 },
        },
        falha: {
          texto: 'O brinde sai comprido e a voz tremida. O conselheiro aproveita a pausa para ler o regulamento. Os noivos casam no corredor, em voz baixa, de mãos dadas, e ninguém lembra do seu brinde.',
          cronica: '{nome} fez um brinde que ninguém lembrou.',
          efeitos: { sanidade: -1, brasa: -1 },
        },
        critico: {
          texto: 'O refeitório inteiro ergue os copos, e o conselheiro ergue o dele primeiro. Joana desce da mesa para abraçar você antes do noivo. Daqui a muitas safras, nos casamentos do anel, ainda vão repetir o seu brinde.',
          cronica: '{nome} fez um brinde de casamento que o Anel Verde passou a repetir.',
          efeitos: { lacos: 1, marco: true },
        },
      },
      {
        id: 'gaita',
        rotulo: 'Tocar a valsa dos noivos',
        requer: { item: 'gaita' },
        livre: true,
        resultado: {
          texto: 'Você toca baixinho, só para os dois. Ninguém dança, que dança gasta ar, mas os noivos se balançam sentados, e o refeitório inteiro balança junto. A festa passa da hora, e o conselheiro finge que não vê.',
          cronica: '{nome} tocou na gaita a valsa de um casamento em que ninguém podia dançar.',
          efeitos: { lacos: 1, brasa: -1 },
        },
      },
    ],
  },
];
