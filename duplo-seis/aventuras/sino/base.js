/**
 * O Sino Afogado: catálogo comum (itens, companheiros, inimigos), a cena de
 * abertura, as cenas da torre, os finais e os textos de sistema. As cenas dos
 * atos ficam em ato1.js, ato2.js e ato3.js. O relógio da jornada é a vela da
 * última missa, que por dentro continua sendo o efeito `brasa` (0 a 10).
 */

export const itens = {
  // Objetos que ajudam em testes: o modificador soma níveis (manual, Situação 4).
  fosforos: { nome: 'Caixa de Fósforos', mod: 1, tipo: 'objeto', tags: ['fogo'] },
  lampiao: { nome: 'Lampião de Querosene', mod: 1, tipo: 'objeto', tags: ['luz'] },
  lanterna: { nome: 'Lanterna de Pilha', mod: 1, tipo: 'objeto', tags: ['luz'] },
  corda: { nome: 'Corda de Sisal', mod: 1, tipo: 'objeto', tags: ['corda'] },
  pe: { nome: 'Pé de Cabra', mod: 2, tipo: 'objeto', tags: ['alavanca'] },
  planta: { nome: 'Planta da Pedra-Funda', mod: 1, tipo: 'objeto', tags: ['mapa'] },
  milho: { nome: 'Bornal de Milho', mod: 1, tipo: 'objeto', tags: ['isca'] },
  violao: { nome: 'Violão', mod: 1, tipo: 'objeto', tags: ['musica'] },
  terco: { nome: 'Terço da Avó', mod: 1, tipo: 'objeto', tags: ['amuleto'] },
  maleta: { nome: 'Maleta da Farmácia', mod: 1, tipo: 'objeto', tags: ['remedio'] },
  caderno: { nome: 'Caderno de Chamada', mod: 1, tipo: 'objeto', tags: ['livro'] },
  tombo: { nome: 'Livro de Tombo da Paróquia', mod: 1, tipo: 'objeto', tags: ['livro'] },
  lupa: { nome: 'Lupa', mod: 1, tipo: 'objeto', tags: ['lente'] },
  canoa: { nome: 'Canoa da Luzia', mod: 2, tipo: 'objeto', tags: ['barco'] },
  // Armas improvisadas e armadura: entram no combate e contam no limite da Força.
  canivete: { nome: 'Canivete', mod: 0, tipo: 'arma' },
  remo: { nome: 'Remo', mod: 1, tipo: 'arma' },
  facao: { nome: 'Facão', mod: 2, tipo: 'arma' },
  capa: { nome: 'Capa de Oleado', mod: 1, tipo: 'armadura' },
  // De gastar: usa-se uma vez, fora de combate.
  unguento: { nome: 'Unguento de Arnica', tipo: 'consumivel', cura: { vida: '1d6' } },
  cha: { nome: 'Chá de Erva-Cidreira', tipo: 'consumivel', cura: { sanidade: '1d6' } },
  xarope: { nome: 'Xarope Calmante', tipo: 'consumivel', cura: { sanidade: '1d6' } },
};

export const companheiros = {
  // Ganhos no ato 1 (Tião) e no ato 2 (Luzia); as cenas dos outros atos podem contar com eles.
  tiao: {
    nome: 'Tião',
    quem: 'onze anos, surdo, fala por sinais; o único da vila que não ouve o sino',
    niveis: { percepcao: 2, destreza: 1 },
  },
  luzia: {
    nome: 'Luzia',
    quem: 'pescadora da represa, conhece cada telhado debaixo d\'água',
    niveis: { fisico: 2, percepcao: 1, sobrevivencia: 1 },
  },
};

export const inimigos = {};

export const abertura = {
  id: 'sinha',
  ato: 0,
  titulo: 'A vela de Dona Sinhá',
  efeitosAoEntrar: { item: 'fosforos' },
  texto:
    'Lá embaixo, no lago seco, o sino toca de novo, e a Vila Nova inteira acende o lampião para não dormir. Já são onze os que desceram à água e voltaram sem nome. Dona Sinhá, noventa anos, abre o oratório e tira de lá uma vela de cera amarelada. "É da última missa da Pedra-Funda", diz. "Acesa na sua mão, o sono não pega você. Desce e descobre quem está tocando." Ela põe uma caixa de fósforos no seu bolso. A vela não quer acender.',
  abordagens: [
    {
      id: 'mente',
      rotulo: 'Acender longe do vento',
      teste: { chave: 'percepcao', dificuldade: 5 },
      sucesso: {
        texto: 'A corrente de ar vem da fresta do assoalho, que sopra frio do lado do lago. Você se ajoelha, faz concha com o corpo, e a chama pega no segundo fósforo, pequena e reta.',
        cronica: '{nome} achou a fresta que soprava do lago e acendeu a vela da última missa.',
      },
      falha: {
        texto: 'Um fósforo, dois, cinco. A chama nasce e deita. Quando enfim pega, você já gastou meia caixa e um pedaço bom do pavio.',
        cronica: '{nome} gastou meia caixa de fósforos para acender a vela da última missa.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'espirito',
      rotulo: 'Rezar com Dona Sinhá',
      teste: { chave: 'fe', dificuldade: 5 },
      sucesso: {
        texto: 'Você reza com ela a oração de acender, que é curta e meio esquecida. No amém o pavio pega sozinho. Dona Sinhá faz o sinal da cruz na sua testa com o polegar e não diz nada.',
        cronica: '{nome} rezou com Dona Sinhá, e a vela da última missa acendeu no amém.',
      },
      falha: {
        texto: 'Você erra a oração no meio, e ela recomeça, paciente, três vezes. A vela pega na terceira. "Reza é igual remo", diz ela. "Ninguém nasce sabendo."',
        cronica: '{nome} errou a oração de acender três vezes na frente de Dona Sinhá.',
        efeitos: { brasa: -1 },
      },
    },
    {
      id: 'presenca',
      rotulo: 'Pedir a vizinhança na porta',
      teste: { chave: 'presenca', dificuldade: 5 },
      sucesso: {
        texto: 'Você chama a rua. Vem gente de pijama e lampião, e todos fazem roda em volta de você, de costas para o lago, segurando o vento. A vela acende no meio do povo, e alguém começa a bater palmas.',
        cronica: '{nome} acendeu a vela no meio de uma roda de vizinhos e partiu sob palmas.',
        efeitos: { lacos: 1 },
      },
      falha: {
        texto: 'As janelas da rua estão todas acesas, mas ninguém abre a porta. Medo de sair, medo de dormir. Você acende a vela sozinho, na soleira, depois de muitos fósforos.',
        cronica: '{nome} chamou a rua, e a rua teve medo de abrir a porta.',
        efeitos: { brasa: -1 },
      },
    },
  ],
};

export const desfecho = [
  {
    id: 'torre-porta',
    ato: 4,
    titulo: 'A igreja afogada',
    texto:
      'A igreja da Pedra-Funda sai da lama até a metade das janelas, coberta de limo verde como um barco virado. A porta está meio enterrada. Lá dentro, a corda do sino desce pelo forro da torre e balança sozinha, devagar, como quem respira. Um degrau acima da lama alguém deixou um chapéu de palha, seco, e uma caneca de café ainda morna.',
    abordagens: [
      {
        id: 'forca',
        rotulo: 'Desenterrar a porta',
        teste: { chave: 'forca', dificuldade: 11 },
        ajuda: ['alavanca', 'barco'],
        sucesso: {
          texto: 'Você cava com as mãos e com o que tiver, e a porta cede de uma vez, soltando um cheiro de vela velha e de rio. A corda do sino para de balançar quando você entra. Começa de novo quando você olha para ela.',
          cronica: 'Na lama do lago, {nome} desenterrou a porta da igreja afogada.',
        },
        falha: {
          texto: 'A lama devolve cada punhado que você tira. Você acaba entrando pela janela da sacristia, de barriga, cortando a mão num caco de vitral.',
          cronica: '{nome} entrou na igreja afogada pela janela, sangrando.',
          efeitos: { vida: -2, brasa: -2 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Ler a parede da sacristia',
        teste: { chave: 'percepcao', dificuldade: 8 },
        ajuda: ['luz', 'lente'],
        sucesso: {
          texto: 'Na parede, a lista dos que serviram à igreja, a tinta lavada pela água. Padres, sacristãs, coroinhas. Na linha do sineiro há um nome raspado com faca, de propósito, faz muito tempo. Você entra pela sacristia sabendo que alguém quis esquecer.',
          cronica: '{nome} achou na sacristia afogada um nome raspado de propósito.',
        },
        falha: {
          texto: 'O limo cobre tudo. Você passa a vela tão perto da parede que a chama chia e encolhe, e o que se lê é só a palavra "sineiro", sem nada depois.',
          cronica: '{nome} gastou a vela lendo uma parede apagada.',
          efeitos: { brasa: -2 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Perguntar quem está aí',
        teste: { chave: 'presenca', dificuldade: 8 },
        sucesso: {
          texto: 'Você tira o chapéu, como se faz em igreja, e pergunta com educação. A corda para. Lá de cima, uma voz rouca de quem não fala há muito tempo: "Faz trinta anos que ninguém pergunta. Damião. Damião, o sineiro."',
          cronica: '{nome} perguntou com educação, e o sineiro da igreja afogada disse o próprio nome.',
          efeitos: { marca: 'damiao' },
        },
        falha: {
          texto: 'A sua voz sai fina e some no forro. Ninguém responde. Só a corda, que balança mais depressa, e um frio que sobe pela lama até os seus joelhos.',
          cronica: '{nome} perguntou quem tocava o sino, e o silêncio respondeu.',
          efeitos: { sanidade: -2, brasa: -1 },
        },
      },
      {
        id: 'retrato',
        rotulo: 'Mostrar o rastro que você achou',
        requer: { marca: 'retrato' },
        livre: true,
        resultado: {
          texto: 'Você ergue a vela e diz o que achou no caminho: o rosto, a letra, o registro. Um homem de chapéu de palha, que todo mundo fingiu esquecer. A corda para. "Damião", diz a voz lá de cima, como quem confirma. "Então ainda tem quem saiba."',
          cronica: '{nome} juntou os rastros do caminho e reconheceu Damião, o sineiro.',
          efeitos: { marca: 'damiao' },
        },
      },
      {
        id: 'historia',
        rotulo: 'Lembrar como era a igreja',
        requer: { nivel: { historia: 1 } },
        teste: { chave: 'historia', dificuldade: 4 },
        sucesso: {
          texto: 'Igreja desse tempo tem porta de enterro do lado do cemitério, estreita, que só abria para caixão. Você a acha atrás de um monte de telha e entra sem sujar a vela.',
          cronica: '{nome} entrou na igreja afogada pela porta de enterro, que só abria para caixão.',
        },
        falha: {
          texto: 'A porta de enterro existe, mas está do lado errado da sua memória. Você dá a volta inteira na igreja, na lama até a canela.',
          cronica: '{nome} deu a volta na igreja afogada procurando uma porta lembrada.',
          efeitos: { brasa: -1 },
        },
      },
    ],
  },
  {
    id: 'torre-sino',
    ato: 4,
    titulo: 'O sino de chamar enterro',
    texto:
      'A escada da torre sobe torta, degrau podre e degrau firme. No alto, pendurado na viga, não está o sino grande: está o pequeno, de chamar enterro, verde de limo. Cada badalada puxa alguma coisa de dentro de você, de leve, como quem puxa uma linha. Lá fora, na margem, os onze que dormem estão de pé, olhando para cá.',
    abordagens: [
      {
        id: 'corpo',
        rotulo: 'Subir e segurar o badalo',
        teste: { chave: 'fisico', dificuldade: 8 },
        ajuda: ['corda'],
        sucesso: {
          texto: 'Você sobe pulando os degraus podres, com a vela presa no cinto, e agarra o badalo com as duas mãos. Ele bate na sua palma em vez do bronze. Dói até o ombro. O sino cala.',
          cronica: '{nome} subiu a torre afogada e calou o sino com as mãos.',
        },
        falha: {
          texto: 'Um degrau cede e você fica pendurado pelos braços, e o sino bate três vezes bem em cima da sua cabeça. Cada badalada leva um pedaço de alguma lembrança boa. Você sobe assim mesmo.',
          cronica: '{nome} ficou pendurado na escada da torre enquanto o sino tocava.',
          efeitos: { vida: -1, sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'mente',
        rotulo: 'Dizer o próprio nome a cada degrau',
        teste: { chave: 'sabedoria', dificuldade: 8 },
        sucesso: {
          texto: 'Um degrau, o seu nome. Outro degrau, o nome da sua mãe. Outro, a rua onde você nasceu. O sino puxa a linha e a linha não vem. No alto, você segura o badalo sem pressa.',
          cronica: '{nome} subiu a torre dizendo o próprio nome a cada degrau, e o sino não o levou.',
        },
        falha: {
          texto: 'No décimo degrau você para, com a boca aberta, procurando uma palavra que estava ali agora mesmo. Volta. Era o seu nome. Você sobe o resto com ele apertado na mão, como moeda.',
          cronica: 'Na escada da torre, {nome} esqueceu o próprio nome por um instante.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'espirito',
        rotulo: 'Subir cantando o bendito',
        teste: { chave: 'vontade', dificuldade: 8 },
        ajuda: ['amuleto', 'musica'],
        sucesso: {
          texto: 'Você canta o bendito de procissão, aquele que todo mundo sabe pela metade. O sino erra o compasso. No alto da torre ele já está tocando no ritmo do seu canto, e depois para, como quem escuta.',
          cronica: '{nome} subiu a torre cantando o bendito, e o sino parou para ouvir.',
        },
        falha: {
          texto: 'A voz falha no meio do bendito e o sino entra no silêncio, alto, dentro da sua cabeça. Você chega lá em cima chorando sem saber de quê.',
          cronica: '{nome} perdeu a voz na torre, e o sino tocou dentro dele.',
          efeitos: { sanidade: -4 },
        },
      },
      {
        id: 'benzer',
        rotulo: 'Benzer a linha que o sino puxa',
        requer: { nivel: { magiaControle: 1 } },
        teste: { chave: 'magiaControle', dificuldade: 5 },
        sucesso: {
          texto: 'Você sente a linha, fina, saindo do peito de cada um na margem até o badalo. Corta com a reza de quebranto, três cruzes no ar, e os onze sentam na lama ao mesmo tempo, como quem acorda.',
          cronica: '{nome} cortou com reza a linha que prendia os onze ao sino.',
        },
        falha: {
          texto: 'A linha é mais forte que a reza. Ela puxa você também, um passo, dois, até a beira da janela da torre. Você se segura no batente com as unhas.',
          cronica: 'O sino quase levou {nome} pela janela da torre.',
          efeitos: { sanidade: -3, brasa: -1 },
        },
      },
      {
        id: 'nomes',
        rotulo: 'Esperar quem vem pela lama',
        requer: { lacos: 5, semMarca: 'damiao' },
        livre: true,
        resultado: {
          texto: 'Pela margem vêm lampiões, um atrás do outro: gente que você ajudou no caminho. Lá embaixo, eles começam a dizer os nomes da Pedra-Funda, os de casa e os de cemitério, um por um. No meio da lista, uma velha diz "Damião", e o sino para no ar.',
          cronica: 'A gente que {nome} ajudou veio pela lama e disse os nomes da Pedra-Funda até achar o do sineiro.',
          efeitos: { marca: 'damiao' },
        },
      },
    ],
  },
];

/**
 * Finais: vale o primeiro cuja condição fecha. `quando` é declarado como dados
 * (ver `fechaFinal` em jogo.js); o último não tem condição. Aqui `brasa` é a vela.
 */
export const finais = [
  {
    id: 'nome',
    titulo: 'O nome dele',
    estrelas: 3,
    quando: { brasa: { min: 2 }, marca: 'damiao', lacos: { min: 5 } },
    texto:
      'Você diz "Damião" do alto da torre, e lá embaixo a margem inteira repete, com a sua gente na frente. O sino pequeno dá uma última badalada, comprida, de quem se despede. Os onze olham as próprias mãos e dizem os próprios nomes. No domingo, Padre Olavo reza missa pelo sineiro, e a igreja nova não tem lugar para todo mundo.',
  },
  {
    id: 'acordado',
    titulo: 'Acordado por eles',
    estrelas: 3,
    quando: { brasa: { max: 0 }, lacos: { min: 6 } },
    texto:
      'A vela apaga no último degrau e o sono vem como água. Você acorda na margem, molhado até o peito, com gente em volta segurando os seus braços e repetindo o seu nome, alto, até ele voltar. Depois, juntos, eles sobem a torre e perguntam ao sineiro o nome dele. Ele diz.',
  },
  {
    id: 'silencio',
    titulo: 'O badalo amarrado',
    estrelas: 2,
    quando: { brasa: { min: 3 } },
    texto:
      'Você amarra o badalo à viga com o que tem, nó de barqueiro, apertado. O sino tenta e não consegue. Os onze acordam na margem e voltam para casa sem saber direito por quê. A vila dorme em paz por muito tempo. Mas a seca vai voltar um dia, e a torre também.',
  },
  {
    id: 'madrugada',
    titulo: 'Toco de vela',
    estrelas: 1,
    quando: { brasa: { min: 1 } },
    texto:
      'O sino cala quando a vela já é um toco que queima os dedos. Os onze acordam devagar, uns de manhã, outros na semana seguinte, e um deles nunca lembra direito do próprio sobrenome. Você também não dorme bem por um bom tempo. Mas a vila amanhece.',
  },
  {
    id: 'agua',
    titulo: 'Doze',
    estrelas: 0,
    texto:
      'A vela apaga e ninguém vem. O sono chega manso e leva você escada abaixo, porta afora, lama adentro, até a água morna da cintura. De manhã, Luzia puxa para a canoa uma pessoa que não sabe quem é. Na vila, agora, dizem doze.',
  },
];

/** Finais de quem não chega. */
export const quedas = {
  morte: {
    id: 'morte',
    titulo: 'A vela na lama',
    estrelas: 0,
    texto: 'O corpo não vai mais longe. A vela cai de lado na lama e continua acesa um pouco, sozinha, mostrando o caminho para quem vier depois.',
  },
  perdido: {
    id: 'perdido',
    titulo: 'Sem nome',
    estrelas: 0,
    texto: 'O sino levou o resto. Dizem que há alguém andando pela margem seca com uma vela apagada na mão, perguntando a quem passa se não sabe, por acaso, como é que ele se chama.',
  },
};

/** Textos de sistema: substituem, chave a chave, o bloco `T` de jogo.js e os rótulos da interface. */
export const textos = {
  desmaio: 'Tudo escurece. Quando você abre os olhos, a vela encurtou e o corpo inteiro dói.',
  desmaioAcompanhado: 'Tudo escurece. Você acorda com {quem} segurando a vela longe do vento e a sua cabeça no colo.',
  furia: 'Algo se rompe. Quando a vista volta, suas mãos estão fechadas e doendo, e há alguém se afastando de você na rua, com medo.',
  furiaSozinho: 'Algo se rompe. Quando a vista volta, seus punhos estão esfolados num muro que não lhe fez nada.',
  impulso: 'Você ri. Não sabe de quê. Larga o que pesa e anda depressa, rindo, e alguém no escuro ri junto. Quando para, falta alguma coisa no bornal.',
  convulsao: 'O chão sobe. O corpo treme sozinho, os dentes batem, a língua sangra. Passa. Demora, mas passa.',
  torpor: 'Você se senta. Só um pouco. Fica olhando a chama da vela, que é bonita, por tempo demais.',
  noite: 'Você para numa varanda de porta aberta, onde alguém deixou café no bule, e cochila sentado com a vela no colo, a mão em concha. Ela queima enquanto você descansa.',
  cronicaDesmaio: '{nome} caiu sem sentidos e acordou com a vela mais curta.',
  cronicaSurto: '{nome} ficou fora de si por um tempo, e não gosta de lembrar.',
  velar: 'Abrigar a vela',
  velou: 'Você passa o descanso num oratório de beira de estrada, com a vela protegida do vento e o pavio aparado.',
  subir: 'Descer à torre',
  pausa: 'Café na varanda',
  seguir: 'Seguir pela noite',
};
