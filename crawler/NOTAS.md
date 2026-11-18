# Desvario — notas do protótipo de crawler

Protótipo de dungeon crawler (roguelike) do Sistema Clip em que a **Sanidade
distorce a percepção**: quanto menos são o personagem está, mais o jogo mente.
Não decide regra: usa o motor (`motor/clip.js`) e anota aqui o que o manual não
responde e o que foi ajustado para ficar divertido.

- Jogar: `python3 -m http.server` na raiz e abrir `/crawler/`. Link direto para
  uma partida: `/crawler/?semente=nora-3311&tema=masmorra&origem=mente&jogar=1`.
- Lógica sem DOM: `crawler/jogo.js` (estado, regras e percepção), `mapa.js`
  (geração, visão e caminhos), `rng.js` (sorteio com semente), `temas.js`
  (a "pele" de cada tema). Testes em `test/crawler.test.js`.
- Tela: `crawler/index.html`, `ui.js`, `sprites.js` (pixel art gerada em código),
  `crawler.css`.
- Equilíbrio: `node crawler/simular.mjs [partidas] [atento|ingenuo]` faz o robô
  (`crawler/robo.js`) jogar e imprime as tabelas desta nota.
- Depuração: tecla <kbd>`</kbd> ou `?depurar=1` mostra os números, marca o que é
  falso no mapa e expõe `window.desvario` no console.

## Versões

A versão do Desvario é só dele (`crawler/versao.js`) e aparece no rodapé da
página. Não mexe na versão das regras nem das ferramentas do Clip.

| Versão | Data | O que mudou |
|---|---|---|
| 0.1.0 | 18/11/2026 | Primeira versão jogável: três temas, três origens, cinco andares, a Sanidade distorce a percepção, diário entre tentativas, robô e simulador. |
| 0.2.0 | 18/11/2026 | Três medidas, três jeitos de errar. **Vida** baixa: sangue no chão que as bestas seguem, perna arrastada (passo de dois turnos), mãos que tremem, pulso vermelho na tela. **Consciência** (medida nova, só do jogo): o espaço mente (portas pintadas, buracos que não existem, corredores sem fim, vultos, miragens), a vista fecha e dobra, os olhos piscam; em zero, desmaio; descansar quieto devolve. **Sanidade** baixa: quem e o que as coisas são (aliado ↔ monstro, itens com cara de bicho parado, sussurros, palavras que mentem). Fotografias, cartas e corpos fazem mal de olhar, mas mostram o caminho, dão item ou âncora. Buraco de verdade é atalho com tombo. Item de fôlego. Seis pistas novas. |
| 0.3.0 | 18/11/2026 | **Urgência**: cada andar tem um fio que queima (linha na base da tela e no painel); quando acaba, a ronda do tema chega (não cai, só dá para fugir ou atrasar) e a cabeça pesa o dobro. A escolha entre andares tem 15 segundos; se acabar, o lugar escolhe. **Combate**: golpe preparado com aviso (!), Defender (com contra-golpe), Empurrar (tonto contra a parede, derruba no buraco), Fechar porta (bichos não abrem). **Janelas**: algo passa lá fora; às vezes bate e entra, a não ser que você segure a janela; com a cabeça ruim, há batidas que ninguém dá. **Caminho**: uma peça por andar do meio (prontuário, selo, rádio) devolve fio e mostra a saída; com as três, o fim é inteiro. "Ancorar" virou "Ancorar-se", com explicação. |
| 0.3.1 | 18/11/2026 | **O dom da Mente** deixa de ser "magia" na tela: diagnóstico no sanatório (dizer o nome exato do que o outro tem), fórmula de fogo na masmorra, frasco incendiário no prédio; o recurso vira Foco, Fórmulas ou Mistura, com palavras próprias. A regra continua Mágicas de Ataque Físico. **Âncora** vira cura para o espírito com gesto do tema (olhar a foto de casa, apertar a medalha, ouvir o recado no rádio), em frase no lugar das gemas. **Fôlego**: correr sem parar deixa ofegante, cansa a vista e, no limite, cada passo custa dois turnos; o fio ficou mais longo para compensar. **Perdas e curas visíveis**: cada estado tem uma frase curta ("sangrando", "pálpebras pesadas", "as coisas tremem"), setas ▼/▲ por alguns segundos quando algo muda e uma linha no registro quando a palavra muda. |
| 0.3.2 | 18/11/2026 | **Mente ajustada.** Metade das mortes da Mente vinha da ronda, nos andares 4 e 5. Agora o dom da Mente deixa tonto quem acerta (1 turno; a ronda, 2): é o jeito dela de ganhar distância. Defender soma metade da Percepção. Robô atento da Mente usa o dom na ronda e defende quando está colado. Resultado (robô atento, 40 partidas por tema): fuga da Mente de 11% para 18%, morte de 86% para 76%; Corpo 13%, Espírito 28%. Correção: "a horda" e outros artigos femininos. |
| 0.4.0 | 18/11/2026 | **Consequências, não pancadaria.** Humanos comuns (enfermeiro, guarda, carcereiro, cultista, saqueador) **só vigiam**: não caçam; ficar perto deles por 4 turnos os faz mandar você embora. Bater em quem vigia dá **alarme** (todos os humanos do andar caçam) e pesa na cabeça; matar gente pesa para todos, até para o Corpo, e quem só vigiava pesa o dobro. **Percepção** 2 ou mais mostra quem só vigia (moldura amarela; andar contra é conversar); sem ela, olhe de novo ou fale. Já conversou: dá para passar espremido. **Encarar gente de bem gera antipatia**: aliado se fecha e para de seguir, vigia vem tirar satisfação. **Desfazer uma mentira devolve clareza** (+1 de Sanidade). **Acreditar numa mentira cobra**: item falso, janela onde ninguém bate (−1 de Sanidade), porta pintada (−1 de Consciência). **Fé** reduz os sustos (metade da Fé soma à Serenidade) e **Percepção** ajuda a notar sozinho o que está errado. Consciência mínima 13 (antes 10), fôlego mais brando, fio de 350 a 430 turnos. Robô atento, 40 partidas por tema: fuga Corpo 11%, Mente 13%, Espírito 26%. |

## Como se joga

Chegue à saída do quinto andar. Ninguém mostra pontos: o estado aparece em
palavras (de `descrever`, do motor) e na própria imagem.

| Ação | Teclado | Toque | Quem faz bem | Regra do Clip |
|---|---|---|---|---|
| Andar / bater / conversar | setas, WASD, hjkl, yubn, teclado numérico | cruz ou tocar no mapa (anda até lá) | Todos | Andar contra o que **parece** hostil é atacar (`resolverAtaque`); contra o que **parece** aliado é conversar |
| Forçar ataque | Shift + direção | — | Corpo | `resolverAtaque` |
| Olhar de novo | X | botão | Mente | `testar` com Percepção ou Sabedoria (+ Sentidos ou Discernimento como objeto) contra 2 + nível de loucura. O Corpo insiste e paga a diferença com Vida |
| Falar | T | botão | Espírito | `testar` com Presença (+ Empatia, Intimidação ou Liderança) contra 3 + Vontade do alvo + andar |
| Encarar | E | botão | Espírito | `testar` com Vontade ou Fé (+ Convicção, Devoção ou Autocontrole) contra 4 + Vontade do alvo + andar |
| Fogo | F | botão | Mente | `lancarMagia` (Mágicas de Ataque Físico) e `resolverAtaque` |
| Ancorar | Q | botão | Espírito | `testar` com Vontade ou Fé contra 3; poucas vezes por andar |
| Itens | 1 a 5 | botões | Todos | — |
| Esperar / descansar | Espaço | ponto do meio da cruz | Todos | Sem monstro à vista, devolve Consciência (0.2.0) |
| Pular num buraco | andar duas vezes contra ele | idem | Todos | O primeiro passo só chega à beira (0.2.0) |
| Explorar sozinho | O | botão | Todos | Anda até o que ainda não foi visto; para quando algo aparece |
| Trocar o alvo | Tab | tocar na criatura | Todos | — |

O personagem é uma ficha do motor com 10 Pontos de Evolução (Especialista
Iniciante). A cada andar, escolhe +1 nível entre três opções que respeitam os
limites do Clip (Aprimoramento até o Atributo; Perícia até o menor requisito).

| Origem | Ficha | Jeito de passar |
|---|---|---|
| Corpo | Força 2, Destreza 1, Físico 2, Percepção 1, Vontade 1; Ataque Corporal 2, Resistência 1; arma do tema | Luta. Vê mal o que é falso e insiste com o corpo para olhar de novo |
| Mente | Inteligência 2, Percepção 2, Sabedoria 1; Sentidos 1, Discernimento 1, Raciocínio 1; Mágicas de Ataque Físico 2 | Olha de novo quase sempre certo, nota sozinho o que está errado e queima à distância. Frágil de perto |
| Espírito | Vontade 2, Presença 2, Fé 2, Destreza 1; Empatia 1, Autocontrole 1, Convicção 1 | Convence gente, espanta bestas e assombros, se ancora. Demora a enlouquecer |

Cada tema dá nome próprio às origens (no sanatório: Interno da ala pesada,
Médica internada, Capelão esquecido).

## As três medidas (desde a 0.2.0)

Nenhuma aparece em número. Cada uma tem palavras, uma assinatura na imagem e um
jeito próprio de mentir, para que o jogador aprenda a separar "estou ferido",
"estou cansado" e "estou enlouquecendo".

| Medida | Palavras | Na imagem | O que muda no jogo | Como volta |
|---|---|---|---|---|
| **Vida** (Corpo) | Intacto … Caído (`descrever` do motor) | Pulso vermelho nas bordas, mais rápido quanto pior; gotas de sangue no chão | Ferido: deixa sangue por onde passa, e bestas fora de vista seguem o rastro fresco. Muito ferido: 20% dos passos custam dois turnos e o cansaço vem duas vezes mais rápido. À beira do colapso: 40% dos passos custam dois turnos e −1 no Ataque | Curativos, tempo, escada |
| **Consciência** (atenção; só do jogo) | Alerta, Desperto, Cansado, Zonzo, Apagando, Apagado | A vista escurece e encolhe (raio 7 → 4), a imagem dobra (visão dupla), os olhos piscam devagar; a palavra perde letras | **O espaço mente**: vultos, miragens, paredes que trocam, portas pintadas na parede (muitas ao lado de uma porta de verdade), buracos que não existem, passos que não rendem no corredor, mapa lembrado que troca e apaga. Em zero: desmaio de 5 turnos | Esperar sem monstro à vista (+1 a cada 4 turnos), fôlego (+6), escada (+4); acorda do desmaio com metade |
| **Sanidade** (Cabeça) | Lúcido … Fora de si (`descrever` do motor) | A cor desbota, aparece grão, as cores se separam, a tela treme; a palavra embaralha | **Quem e o que as coisas são**: aliado com cara de monstro e o contrário, itens de verdade com cara de bicho parado, sussurros, golpes que não aconteceram, nome de sala errado, palavras do painel que mentem. Em zero: surto | Calmantes, altar, ancorar, conversa, presente de aliado |

A Consciência cai com o tempo (1 a cada 40 → 24 turnos, conforme o andar), com
pancadas (golpe de 4 ou mais) e com o sangue perdido; o máximo é 10 + 2 × (Físico
+ Percepção + Sabedoria): Corpo e Mente 16, Espírito 10. Descansar devolve a
atenção, mas o tempo parado continua pesando na Sanidade: é a troca que o jogo
propõe.

**Coisas que fazem mal de olhar** (1 ou 2 por andar). Pisar em cima examina:

| Coisa | Custa | Dá |
|---|---|---|
| Carta | −1 de Sanidade | O caminho até a saída do andar fica marcado no mapa |
| Fotografia | −2 de Sanidade | +1 âncora no andar |
| Corpo | −1 ao ver pela primeira vez (menos para o Corpo, que já viu gente caída) e −1 ao revistar | Um item (curativo, fôlego ou calmante) |

**Buraco de verdade** (andares 2 a 4, às vezes): o primeiro passo só chega à
beira; o segundo pula. Cai no andar de baixo com −3 de Vida, sem o fôlego da
escada. É atalho, e é aposta: o buraco falso só derruba você de joelhos.

## O fio, o combate, as janelas e o caminho (desde a 0.3.0)

**Âncora**, para não haver dúvida: ancorar-se é segurar algo seu (o nome dito
em voz alta, uma lembrança, uma oração) para lembrar quem você é. Pela tecla Q,
é um teste de Vontade ou Fé; os itens "âncora" (fotografia de casa, medalha,
rádio) fazem o mesmo sem teste. Recupera um pouco de Sanidade e, por 12 turnos,
apaga o que é falso à vista e impede disfarces novos. Os ◆ do painel são as
vezes que ainda dá neste andar; fotografias e altares dão mais.

| Peça | O que faz | Por quê |
|---|---|---|
| Fio do andar | 260 a 340 turnos (cresce com o andar). Avisos do tema na metade, a um quarto e a um décimo. Quando acaba, a ronda chega pela entrada do andar | Urgência sem relógio de verdade: o turno continua sendo a unidade, e a linha que queima é a única medida |
| A ronda | Enfermeiro-chefe, carrasco ou horda. Sabe onde você está, não cai, anda dois de cada três turnos. Golpe forte a deixa tonta; encarar faz recuar 4 turnos; empurrar deixa tonta. Sem fio, a Sanidade cai no dobro do ritmo | É a ameaça que obriga a escolher entre explorar e sair |
| Escolha entre andares | 15 segundos de verdade (pausa com a aba escondida); se acabar, escolhe uma das opções pela semente | Pedido: "até as escolhas precisam ser rápidas" |
| Golpe preparado | Monstro colado com arma ou força às vezes recua e prepara (aviso no registro e ! vermelho). No turno seguinte: +2 no ataque e +2 no dano, se você ainda estiver colado | Combate com leitura: sair, defender ou empurrar |
| Defender (Z) | +2 de Defesa até o próximo turno (+4 contra golpe preparado). Se o golpe errar, quem luta devolve na hora | Dá ao Corpo um verbo além de bater |
| Empurrar (G) | Força (+ Ataque Corporal ou Agilidade) contra 2 + Defesa do alvo (+2 na ronda). Tira de perto e deixa tonto 1 turno; contra parede ou porta, 2 turnos; para dentro de buraco de verdade, derruba de vez | Usa o mapa: buraco, parede, corredor |
| Fechar porta (C) | Fecha uma porta aberta ao lado. Bestas não abrem portas; gente e a ronda abrem | Fuga com cabeça, não só com pernas |
| Janelas | 2 a 4 por andar, na parede de cima das salas. Algo passa lá fora (6% por turno por janela à vista). Às vezes algo bate (mais perto do fim do fio); depois de 3 batidas, o vidro cede e um monstro entra. Andar contra a janela que bate a segura de vez. Com a cabeça Perturbada ou pior, há batidas que ninguém dá | "Janelas com coisas passando, talvez entrando" |
| Peças do caminho | Uma nos andares 2, 3 e 4, longe da entrada. Cada uma: +50 de fio, +2 de Sanidade, o caminho até a saída do andar marcado. Com a cabeça cansada, aparecem peças falsas | "Os itens dão o caminho para fechar o jogo" |
| Finais | Sair com as três peças: fim inteiro (o prontuário, o selo, o rádio respondem). Sair sem elas: fuga pela metade. Morte e loucura continuam | O objetivo deixa de ser só fugir: é fugir sabendo quem você é |

## Dom da Mente, âncora, fôlego e retorno (desde a 0.3.1)

| Tema | Dom da Mente (botão, tecla F) | Recurso e palavras | Âncora (tecla Q) |
|---|---|---|---|
| Sanatório | Diagnosticar: dizer o nome exato do que o outro tem; não quebra itens, só os reconhece | Foco: Afiado, Atento, Disperso, Esgotado, Em branco | Olhar a foto de casa |
| Masmorra | Fogo: uma das fórmulas do alquimista | Fórmulas: Na ponta da língua … Esquecidas | Apertar a medalha |
| Zumbi | Arremessar: frasco incendiário improvisado | Mistura: Frascos cheios … Acabou | Ouvir o recado no rádio |

A regra é a mesma nos três (Mágicas de Ataque Físico, Pontos de Magia): muda só
a leitura, para que "magia" não pareça poder sobrenatural onde não cabe.

**Fôlego.** Cada passo soma 1; qualquer turno parado ou fazendo outra coisa tira
3. Acima de 22, você fica ofegante (palavra no painel) e a cada 5 passos perde 1
de Consciência; acima de 38, 30% dos passos custam dois turnos. É o contrapeso do
fio: a pressa custa a vista. O fio passou para 290 a 370 turnos.

**Perdas e curas.** Sem números, mas sem vagueza:

| Medida | Frases por estado |
|---|---|
| Corpo | sem um arranhão · cortes que ardem · sangrando · mal se aguenta em pé · mais um golpe e acabou |
| Consciência | tudo nítido · atento, por enquanto · pálpebras pesadas · o chão balança · a vista falha |
| Cabeça | o mundo é o que é · algo incomoda · as coisas tremem · nem tudo o que vê é real · quase nada é real |

Cada perda ou cura mostra ▼ ou ▲ (dois, se foi grande) ao lado da palavra por
alguns segundos. Quando a palavra muda, o registro diz a direção ("▼ Seu corpo
piorou: agora, Ferido (sangrando)."). As setas seguem a verdade; as palavras
da Cabeça ainda podem mentir.

## Consequências (desde a 0.4.0)

| Ação | Consequência | Quem faz bem |
|---|---|---|
| Bater em quem só vigia | Alarme no andar, −1 de Sanidade (sem desconto da Fé) | Ninguém |
| Matar gente | −1 de Sanidade para todos; −2 se só vigiava | Ninguém |
| Falar com quem vigia | Convencer: ele vai embora (+1 de Sanidade). Falhar: ele fica de olho, não ataca | Espírito (Presença) |
| Olhar de novo para quem vigia | Mostra a intenção ("só vigia") | Mente (Percepção) |
| Encarar aliado de verdade | Antipatia: ele se fecha, não ajuda, para de seguir; −1 de Sanidade | — |
| Encarar quem vigia | Ele vem tirar satisfação | — |
| Desfazer vulto, disfarce, miragem ou item falso | +1 de Sanidade (clareza) | Mente, Espírito |
| Pegar item falso, segurar janela onde ninguém bate | −1 de Sanidade | — |
| Empurrar porta pintada | −1 de Consciência | — |
| Sustos (assombro, corpo, carta, foto) | Perda reduzida por Serenidade + metade da Fé | Espírito |

A intenção de quem vigia só aparece para quem tem Percepção 2 ou mais, ou depois
de olhar de novo ou de falar. Para o Corpo (Percepção 1), todo guarda parece
hostil: é o jeito de a Percepção valer tanto quanto a força.

## Decisões de design

| Decisão | Por quê |
|---|---|
| Duas camadas: a **verdade** (`estado`) e a **percepção** (`percebido(estado)`) | A tela e o robô só enxergam a percepção. Isso garante que a mentira seja de verdade e que o simulador meça o quanto ela engana |
| A **aparência decide o verbo**: andar contra algo que parece hostil é bater; contra algo que parece aliado é conversar | A alucinação vira risco real, não enfeite: você bate no aliado porque ele parecia monstro |
| **Sinais consistentes** que nunca mentem (tabela abaixo) | A loucura vira jogo de leitura. Quem aprende os sinais engana-se menos; o diário guarda o que se descobre |
| **As palavras mentem; a imagem não.** Com a cabeça ruim, o estado em palavras pode dizer "Lúcido" quando você está "Por um fio", mas a cor, a vinheta e o tremor seguem a lucidez verdadeira | Esconde o meta-jogo sem deixar o jogador às cegas: ele aprende a ler a imagem |
| Cada Caminho tem **sua ferramenta para duvidar**: Mente olha de novo, Espírito ancora e encara, Corpo insiste pagando Vida | Pedido do manual: Mente e Espírito valem tanto quanto o combate |
| **Falar antes de bater** desmascara aliados disfarçados; **encarar** um aliado disfarçado também o revela | Recompensa a prudência e dá ao Espírito um jeito seguro de testar o mundo |
| Atacar aliado tem **consequência descobrível**: ele grita o seu nome, o disfarce cai, ele foge e não ajuda mais; a culpa tira Sanidade; matar fica no diário da partida e corta a companhia no resto da corrida | Pedido da tarefa; e é o melhor momento de "ah, não" do jogo |
| Monstro disfarçado de aliado **vem andando até você** e, quando ataca, pega desprevenido (+2) e mostra a cara | Sinal de comportamento, aprendível |
| **Sem Sanidade, surto**: o jogo toma o controle por 5 turnos (anda a esmo e bate no que estiver perto, aliado ou não), depois você volta com metade da Sanidade e uma cicatriz (−3 de Sanidade máxima). Na terceira vez, não volta | "Sem Sanidade, o personagem perde o controle", do manual, sem virar morte instantânea |
| **Os andares fundos mentem para todos** (`pressaoDoAndar`): a partir do 3º andar, as alucinações têm um piso, desde que você não esteja Lúcido | Sem isso, o Espírito quase nunca via o jogo mentir |
| O **tempo tira a mesma fração de Sanidade de todos** (o intervalo cresce com a Sanidade máxima); os sustos tiram valores fixos | Quem tem mais Sanidade (Espírito) aguenta mais sustos, mas ninguém escapa do tempo |
| **Geração por semente** em fluxos separados (mapa por andar, dados, alucinação, IA, evolução) | O mesmo andar sai igual para qualquer origem e não muda se você rolar mais dados antes; a semente fica na tela e no link |
| **Viajar** (tocar num ponto) e **Explorar** (O) param quando algo aparece | Corrida curta no celular sem cansar o dedo; o perigo ainda interrompe |
| Pixel art só em código: sprites 12×12 por matriz, tiles com ruído estável por casa, paleta por tema | Sem assets de terceiros; cada tema troca a pele (azulejo, pedra, concreto) |

### Os sinais que não mentem

| Sinal | O que diz | Onde se aprende |
|---|---|---|
| Sombra no chão | O que é real projeta sombra (criaturas, itens, escadas). Vultos e miragens não têm sombra | Pista "sombra", depois de desfazer 3 mentiras |
| "Respirar" | O que é falso sobe e desce um pixel. Com `prefers-reduced-motion`, fica parado e só a sombra vale | Mesma pista |
| Quem se aproxima | Aliados ficam onde estão; quem "parece aliado" e vem até você é monstro | Pista "aproxima", na primeira emboscada |
| O grito | Monstros não gritam seu nome | Pista "grito", ao ferir um aliado |
| O corpo | Golpe de vulto tira Sanidade, não Vida: a palavra do Corpo não muda | Pista "marca" |
| A cor | Cor desbotada, vinheta e tremor seguem a lucidez verdadeira | Pista "palavras", no primeiro surto |
| "Algo nele não está certo" | Com Sentidos ou Discernimento, às vezes você nota sozinho; aparece um "?" sobre a criatura | Na hora |
| Luz por baixo da porta | Porta de verdade tem um fio de luz na base; a pintada, não | Pista "porta", ao empurrar uma pintada |
| Ar frio do buraco | Buraco de verdade solta fiapos de ar claro; o falso, não | Pista "buraco", ao pular num falso |
| Bicho que nunca se mexe | Item com cara de monstro não sai do lugar, mesmo vendo você (e tem sombra, porque o item é real) | Pista "imovel", ao quebrar ou desmascarar um |
| O corredor que não acaba | É cansaço, não lugar: descanse | Pista "infinito", no terceiro passo perdido |
| O rastro | Sangrando, você deixa sangue; as bestas seguem | Pista "sangue", quando uma besta fareja |

### O que a cabeça inventa, por nível de lucidez

Desde a 0.2.0, vultos, miragens, paredes e memória vêm da **Consciência**
(`PARAM.aluCons`, mesmas faixas de valor, mais portas, buracos e corredor sem
fim) e disfarces, sussurros, golpes falsos e palavras vêm da **Sanidade**
(`PARAM.alu`, mais os itens com cara de bicho: 0%, 0%, 12%, 28%, 42% e 55% ao
aparecer). A tabela abaixo é da 0.1.0, quando tudo vinha da Sanidade.

Valores em `PARAM.alu` (chance por turno, salvo indicação).

| Lucidez | Vultos | Disfarce ao aparecer | Miragens | Paredes que mentem | Memória do mapa | Sussurros | Golpe falso | Palavras mentem |
|---|---|---|---|---|---|---|---|---|
| Lúcido | — | — | — | — | — | — | — | — |
| Inquieto | 0,4% | 8% | 0,4% | — | — | 0,6% | — | — |
| Abalado | 1,5% | 22% | 1,4% | 1 por época | 4% troca | 2% | — | — |
| Perturbado | 3% | 42% | 2,8% | 3 | 10% | 4% | 1% | 50% |
| Por um fio | 5% | 62% | 4,5% | 5 | 20% + 12% esquece | 6% | 2,5% | 80% |

Vultos nascem na borda da visão e vêm andando; acertam a Sanidade com a mesma
mensagem e o mesmo lampejo vermelho de um golpe real. Miragens são itens,
escadas, saídas e altares falsos. Paredes que mentem: uma parede entre dois chãos
parece passagem; um corredor parece parede. A memória troca e apaga casas
lembradas fora da vista (Memória ≥ 1 protege). O nome da sala pode mentir
("Refeitório. De novo?").

### Progressão entre tentativas

| O que fica | Onde | Por quê |
|---|---|---|
| Pistas (os sinais acima, em frases) | Diário, na abertura e no fim da partida | Conhecimento, não poder: quem já jogou lê melhor o mundo |
| Últimas 30 tentativas, com semente, tema, origem e fim | Diário; clicar na semente repete a partida | Repetir ou compartilhar um pesadelo |
| Mancha onde você caiu, na mesma semente e andar | No mapa | "Você já esteve aqui" |

Tudo em `localStorage` (chave `clip-desvario-diario`), com `try/catch`: sem
armazenamento, o jogo funciona igual. Não há desbloqueio de poder, para não
virar grind.

## Números do simulador — 0.3.0

`node crawler/simular.mjs 200`, mesmas sementes. "Fuga inteira" é sair com as
três peças do caminho.

### Robô atento (0.3.0)


| Tema | Origem | Fuga | Fuga inteira | Morte | Loucura | Limite | Andar médio | Turnos (fuga) | Turnos (todas) | Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sanatorio | corpo | 13% | 7% | 45% | 43% | 0% | 4,4 | 774 | 736 | 23,7 | 5,8 | 1,6 | 44% |
| sanatorio | mente | 15% | 9% | 81% | 5% | 0% | 4,5 | 794 | 719 | 24,1 | 8,3 | 0,5 | 45% |
| sanatorio | espirito | 33% | 24% | 51% | 17% | 0% | 4,7 | 893 | 885 | 30,1 | 12,5 | 0,7 | 35% |
| masmorra | corpo | 16% | 9% | 44% | 40% | 0% | 4,4 | 816 | 800 | 26,2 | 5,5 | 1,6 | 43% |
| masmorra | mente | 14% | 8% | 84% | 3% | 0% | 4,5 | 820 | 728 | 23,3 | 7,7 | 0,3 | 34% |
| masmorra | espirito | 37% | 27% | 53% | 11% | 0% | 4,7 | 886 | 866 | 29,6 | 12,0 | 0,6 | 29% |
| zumbi | corpo | 20% | 12% | 19% | 62% | 0% | 4,6 | 741 | 812 | 28,9 | 6,5 | 2,1 | 48% |
| zumbi | mente | 21% | 16% | 72% | 7% | 0% | 4,6 | 842 | 766 | 28,0 | 8,7 | 0,5 | 42% |

### Robô ingênuo (0.3.0)


| Tema | Origem | Fuga | Fuga inteira | Morte | Loucura | Limite | Andar médio | Turnos (fuga) | Turnos (todas) | Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |
| sanatorio | corpo | 3% | 2% | 64% | 34% | 0% | 4,0 | 856 | 633 | 23,9 | 1,1 | 1,4 | 46% |
| sanatorio | mente | 3% | 1% | 95% | 3% | 0% | 4,0 | 693 | 553 | 20,9 | 0,4 | 0,3 | 46% |
| sanatorio | espirito | 16% | 10% | 73% | 12% | 0% | 4,4 | 929 | 847 | 30,0 | 11,0 | 0,6 | 35% |
| masmorra | corpo | 5% | 3% | 68% | 28% | 0% | 4,2 | 778 | 678 | 25,8 | 1,2 | 1,1 | 43% |
| masmorra | mente | 3% | 2% | 94% | 3% | 0% | 3,9 | 708 | 547 | 20,3 | 0,3 | 0,3 | 36% |
| masmorra | espirito | 19% | 11% | 70% | 11% | 0% | 4,4 | 898 | 842 | 29,3 | 11,3 | 0,5 | 31% |
| zumbi | corpo | 11% | 6% | 32% | 57% | 0% | 4,5 | 797 | 781 | 32,6 | 1,4 | 2,0 | 54% |
| zumbi | mente | 5% | 2% | 89% | 7% | 0% | 4,1 | 834 | 606 | 25,3 | 0,4 | 0,5 | 45% |
| zumbi | espirito | 30% | 18% | 55% | 16% | 0% | 4,6 | 929 | 909 | 31,6 | 13,2 | 0,7 | 36% |

### Fio, combate e janelas (robô atento, média por partida, todos os temas)

| Engano (média por partida) | Valor |
|---|---|
| Vezes que a ronda chegou | 0,4 |
| Turnos sem fio | 48,6 |
| Golpes preparados | 4,8 |
| Golpes pesados recebidos | 0,6 |
| Golpes pesados evitados | 1,4 |
| Defender | 0,2 |
| Contra-golpes | 0,0 |
| Empurrões certos | 10,9 |
| Monstros empurrados no buraco | 0,0 |
| Invasões pela janela | 1,1 |
| Janelas seguradas | 1,1 |
| Batidas que ninguém deu | 0,3 |

### Leitura (0.3.0)

| Achado | O que fazer |
|---|---|
| Fuga do robô atento: Corpo 13–20%, Mente 14–21%, Espírito 33–44% (na 0.2.0: 12–17%, 13–26%, 48–59%). A distância entre os Caminhos diminuiu | Manter |
| A ronda chega em 4 de cada 10 partidas; quando chega, mata ou enlouquece com frequência (sem fio, a Sanidade cai no dobro) | É o objetivo. Se ficar cruel para pessoas, alongar `PARAM.fio.turnos` |
| O robô ingênuo caiu muito (Mente 3–5%): não lê golpe preparado, não segura janela, não foge da ronda | O jogo agora premia quem lê sinais. Ver com gente se a curva de aprendizado é justa |
| Mente morre de 72% a 84% (atento): frágil de perto, e janelas e golpes pesados trazem o perigo para perto | Candidato a ajuste: Defender com bônus maior para quem não luta, ou fogo que empurra |
| Fuga inteira em 7% a 31%: as peças estão longe da entrada e competem com o fio | Bom: é a escolha que o fio cria |

## Números do simulador — 0.2.0

`node crawler/simular.mjs 200`, mesmas sementes. As tabelas da 0.1.0 continuam
abaixo, para comparar.

### Robô atento (0.2.0)


| Tema | Origem | Fuga | Morte | Loucura | Limite | Andar médio | Turnos (fuga) | Turnos (todas) | Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sanatorio | corpo | 12% | 46% | 43% | 0% | 4,3 | 760 | 734 | 25,6 | 5,3 | 1,6 | 50% |
| sanatorio | mente | 15% | 63% | 22% | 0% | 4,3 | 1002 | 792 | 31,2 | 9,6 | 0,9 | 51% |
| sanatorio | espirito | 48% | 38% | 14% | 0% | 4,8 | 1043 | 983 | 36,2 | 15,2 | 0,5 | 41% |
| masmorra | corpo | 13% | 50% | 37% | 0% | 4,5 | 888 | 797 | 27,6 | 6,0 | 1,4 | 44% |
| masmorra | mente | 13% | 69% | 19% | 0% | 4,3 | 1020 | 812 | 31,5 | 8,4 | 0,7 | 43% |
| masmorra | espirito | 56% | 28% | 15% | 0% | 4,8 | 1041 | 1045 | 41,3 | 15,4 | 0,5 | 39% |
| zumbi | corpo | 17% | 23% | 61% | 0% | 4,7 | 791 | 807 | 30,6 | 6,7 | 2,1 | 52% |
| zumbi | mente | 26% | 53% | 22% | 0% | 4,5 | 962 | 875 | 37,6 | 10,4 | 0,9 | 52% |

### Robô ingênuo (0.2.0)


| Tema | Origem | Fuga | Morte | Loucura | Limite | Andar médio | Turnos (fuga) | Turnos (todas) | Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |
| sanatorio | corpo | 7% | 46% | 47% | 0% | 4,3 | 839 | 690 | 27,5 | 1,0 | 1,6 | 53% |
| sanatorio | mente | 9% | 79% | 13% | 0% | 4,0 | 854 | 632 | 29,6 | 0,4 | 0,7 | 51% |
| sanatorio | espirito | 37% | 48% | 16% | 0% | 4,7 | 1105 | 1069 | 40,3 | 15,3 | 0,6 | 45% |
| masmorra | corpo | 12% | 42% | 47% | 0% | 4,4 | 821 | 773 | 32,1 | 1,0 | 1,6 | 51% |
| masmorra | mente | 8% | 80% | 12% | 0% | 4,1 | 900 | 674 | 29,4 | 0,5 | 0,6 | 42% |
| masmorra | espirito | 45% | 41% | 14% | 0% | 4,8 | 1203 | 1122 | 44,5 | 16,1 | 0,5 | 43% |
| zumbi | corpo | 16% | 16% | 68% | 0% | 4,7 | 826 | 809 | 34,9 | 1,2 | 2,3 | 60% |
| zumbi | mente | 14% | 68% | 19% | 0% | 4,3 | 891 | 736 | 34,5 | 0,5 | 0,8 | 53% |
| zumbi | espirito | 50% | 32% | 19% | 0% | 4,8 | 1113 | 1179 | 49,5 | 18,3 | 0,7 | 51% |

### Consciência e enganos novos (robô atento, média por partida)

| % dos turnos em cada Consciência | corpo | mente | espirito |
|---|---|---|---|
| Alerta | 12% | 12% | 13% |
| Desperto | 58% | 59% | 54% |
| Cansado | 29% | 29% | 31% |
| Zonzo | 1% | 1% | 2% |
| Apagando | 0% | 0% | 0% |
| Apagado | 0% | 0% | 0% |

| Engano (média por partida) | Valor |
|---|---|
| Desmaios | 0,0 |
| Passos no corredor sem fim | 2,7 |
| Portas pintadas empurradas | 16,8 |
| Buracos falsos pulados | 0,1 |
| Quedas por buraco de verdade | 0,0 |
| Passos arrastados | 0,9 |
| Bestas que farejaram sangue | 0,7 |
| Itens com cara de monstro | 2,4 |
| Itens quebrados por engano | 0,7 |
| Itens desmascarados | 1,1 |
| Coisas perturbadoras examinadas | 4,3 |
| Golpes no vazio | 1,1 |
| Golpes de vulto recebidos | 2,5 |
| Aliados feridos | 0,7 |
| Aliados mortos | 0,3 |
| Emboscadas de falso aliado | 2,4 |
| Miragens pisadas | 7,0 |
| Paredes falsas | 4,9 |
| Vultos desfeitos | 6,9 |
| Disfarces desfeitos | 1,9 |
| Olhar de novo | 8,5 |

### Leitura (0.2.0)

| Achado | O que fazer |
|---|---|
| O Espírito caiu de 60–77% para 48–59% de fuga (atento): a Consciência baixa (máximo 10) e as coisas perturbadoras pesam mais nele | Era o pedido da 0.1.0; manter |
| Corpo (12–17%) e Mente (13–26%) ficaram um pouco mais difíceis que na 0.1.0 (18–40%) | Se pesar nas pessoas, aliviar `perturbador` ou `consciencia.cansaco` |
| O robô descansa cedo e quase nunca passa de Cansado (Zonzo 1%, nenhum desmaio). Portas pintadas, buracos falsos e corredor sem fim aparecem, mas o pior da Consciência só quem não descansa vai ver | Testar com gente: é o jogador apressado que vai desmaiar |
| O robô empurra 16 portas pintadas por partida: ele explora borda desconhecida, e a porta pintada parece borda | Para uma pessoa, a luz por baixo da porta deve bastar; ver no teste |
| Partidas mais longas (800–1100 turnos), por causa do descanso | Ainda dentro de 10 a 20 minutos com Explorar |

## Números do simulador — 0.1.0

Robô `node crawler/simular.mjs 200`: 200 partidas por tema e origem, sementes `sim-0` a `sim-199`, com os parâmetros desta versão. O robô **atento** conhece os sinais e os lê com 75% de acerto; o **ingênuo** acredita em tudo. Os dois só enxergam `percebido()`.

### Robô atento

| Tema | Origem | Fuga | Morte | Loucura | Limite | Andar médio | Turnos (fuga) | Turnos (todas) | Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sanatorio | corpo | 18% | 33% | 50% | 0% | 4,2 | 781 | 773 | 18,1 | 5,6 | 1,7 | 44% |
| sanatorio | mente | 26% | 55% | 20% | 0% | 4,5 | 904 | 822 | 17,9 | 9,0 | 0,7 | 34% |
| sanatorio | espirito | 63% | 28% | 9% | 0% | 4,8 | 830 | 835 | 16,3 | 10,2 | 0,3 | 19% |
| masmorra | corpo | 23% | 39% | 39% | 0% | 4,4 | 800 | 774 | 17,9 | 4,8 | 1,3 | 38% |
| masmorra | mente | 20% | 67% | 14% | 0% | 4,4 | 868 | 712 | 12,7 | 6,6 | 0,5 | 24% |
| masmorra | espirito | 60% | 31% | 9% | 0% | 4,8 | 826 | 819 | 16,1 | 10,5 | 0,3 | 16% |
| zumbi | corpo | 28% | 20% | 53% | 0% | 4,5 | 809 | 803 | 19,2 | 5,7 | 1,8 | 42% |
| zumbi | mente | 40% | 41% | 20% | 0% | 4,6 | 888 | 817 | 17,4 | 9,0 | 0,7 | 32% |
| zumbi | espirito | 77% | 14% | 9% | 0% | 4,9 | 819 | 868 | 17,1 | 11,8 | 0,3 | 19% |

### Robô ingênuo

| Tema | Origem | Fuga | Morte | Loucura | Limite | Andar médio | Turnos (fuga) | Turnos (todas) | Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sanatorio | corpo | 14% | 32% | 55% | 0% | 4,2 | 787 | 755 | 22,1 | 0,9 | 1,8 | 45% |
| sanatorio | mente | 6% | 74% | 21% | 0% | 4,2 | 868 | 713 | 21,7 | 0,4 | 0,8 | 37% |
| sanatorio | espirito | 40% | 50% | 10% | 0% | 4,7 | 870 | 827 | 17,3 | 10,3 | 0,4 | 21% |
| masmorra | corpo | 19% | 41% | 41% | 0% | 4,3 | 820 | 741 | 20,5 | 0,8 | 1,4 | 39% |
| masmorra | mente | 10% | 82% | 9% | 0% | 4,2 | 817 | 639 | 17,3 | 0,3 | 0,4 | 27% |
| masmorra | espirito | 49% | 43% | 9% | 0% | 4,8 | 839 | 815 | 17,3 | 9,9 | 0,3 | 18% |
| zumbi | corpo | 26% | 18% | 56% | 0% | 4,5 | 827 | 801 | 23,8 | 1,3 | 2,0 | 44% |
| zumbi | mente | 14% | 66% | 20% | 0% | 4,4 | 885 | 786 | 25,6 | 0,4 | 0,8 | 37% |
| zumbi | espirito | 57% | 34% | 9% | 0% | 4,9 | 827 | 831 | 17,4 | 10,8 | 0,3 | 17% |

### De onde vem e para onde vai a Sanidade (robô atento, média por partida)

| Sanidade por partida | corpo | mente | espirito |
|---|---|---|---|
| −O tempo | 16,3 | 17,6 | 31,6 |
| −Assombros | 11,8 | 3,4 | 2,8 |
| −Golpes de vulto | 4,8 | 1,1 | 0,2 |
| −Golpe no vazio | 2,1 | 0,0 | 0,0 |
| −Miragens | 3,0 | 2,3 | 3,3 |
| −Emboscadas | 2,1 | 0,9 | 3,3 |
| −Ferir aliado | 3,0 | 2,4 | 0,0 |
| −Matar gente | 0,1 | 5,0 | 0,0 |
| −Encarar e falhar | 0,0 | 0,0 | 0,9 |
| −Perder a companhia | 0,1 | 0,1 | 0,4 |
| +Itens de calma | 15,2 | 11,7 | 9,9 |
| +Ancorar e âncoras | 4,3 | 2,0 | 3,2 |
| +Altar | 5,0 | 5,2 | 7,5 |
| +Presente de aliado | 1,9 | 2,6 | 4,4 |
| +Conversa | 1,4 | 1,7 | 7,1 |

### Como as partidas acabam (robô atento)

| Como acaba (todas as partidas) | corpo | mente | espirito |
|---|---|---|---|
| fuga no andar 5 | 23% | 28% | 67% |
| loucura no andar 1 | 1% | 1% | 0% |
| loucura no andar 2 | 4% | 2% | 0% |
| loucura no andar 3 | 5% | 3% | 0% |
| loucura no andar 4 | 14% | 4% | 2% |
| loucura no andar 5 | 24% | 8% | 6% |
| morte no andar 1 | 1% | 0% | 0% |
| morte no andar 2 | 1% | 1% | 1% |
| morte no andar 3 | 3% | 4% | 1% |
| morte no andar 4 | 13% | 19% | 5% |
| morte no andar 5 | 13% | 30% | 18% |

### Quanto a loucura engana (robô atento, média por partida, todos os temas)

| Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sanatorio | corpo | 18% | 33% | 50% | 0% | 4,2 | 781 | 773 | 18,1 | 5,6 | 1,7 | 44% |
| sanatorio | mente | 26% | 55% | 20% | 0% | 4,5 | 904 | 822 | 17,9 | 9,0 | 0,7 | 34% |
| sanatorio | espirito | 63% | 28% | 9% | 0% | 4,8 | 830 | 835 | 16,3 | 10,2 | 0,3 | 19% |
| masmorra | corpo | 23% | 39% | 39% | 0% | 4,4 | 800 | 774 | 17,9 | 4,8 | 1,3 | 38% |
| masmorra | mente | 20% | 67% | 14% | 0% | 4,4 | 868 | 712 | 12,7 | 6,6 | 0,5 | 24% |
| masmorra | espirito | 60% | 31% | 9% | 0% | 4,8 | 826 | 819 | 16,1 | 10,5 | 0,3 | 16% |
| zumbi | corpo | 28% | 20% | 53% | 0% | 4,5 | 809 | 803 | 19,2 | 5,7 | 1,8 | 42% |
| zumbi | mente | 40% | 41% | 20% | 0% | 4,6 | 888 | 817 | 17,4 | 9,0 | 0,7 | 32% |
| zumbi | espirito | 77% | 14% | 9% | 0% | 4,9 | 819 | 868 | 17,1 | 11,8 | 0,3 | 19% |

### Leitura

| Achado | Números |
|---|---|
| **Ler os sinais vale a pena.** O robô atento escapa mais que o ingênuo em todas as combinações e se engana menos | Mente: 20–40% contra 6–14% de fuga; Corpo golpeia o vazio 2 vezes por partida contra quase 7 do ingênuo (perda de Sanidade por "golpe no vazio" 2,1 × 6,7) |
| **Todo mundo é enganado**, mesmo o Espírito | 13 a 19 enganos por partida no atento; 11 vultos, 11 miragens e 5 disfarces criados por partida |
| **Duração na meta** de 10 a 20 minutos | 700 a 870 turnos por partida; com Explorar, uma pessoa joga cerca de 1 turno por segundo |
| **Cada Caminho sofre de um jeito** | Corpo enlouquece (40–53% das partidas acabam em loucura; assombros tiram 12 de Sanidade). Mente morre de perto (55–67% de morte). Espírito sente o tempo (30 de Sanidade) e se recupera conversando e rezando |
| **O Espírito está fácil** | 60–77% de fuga no atento, contra 18–40% do Corpo e da Mente |
| **O último andar é o funil** | Metade das derrotas acontece no 5º andar; o chefe fica na sala da saída |
| **Miragens de escada são a mentira que mais pega** | 7 miragens pisadas por partida no atento; o robô ainda corre para escadas falsas |

## Diversão: primeira leitura

Testado por mim no navegador (desktop e celular, 375 px) nos três temas, e pelo
robô. **Ainda não foi testado com pessoas.**

| Funcionou | Não funcionou ou ficou em dúvida |
|---|---|
| Ver um "aliado" vir andando na sua direção e perceber tarde demais. A emboscada é o melhor susto do jogo | O robô de Corpo fere um aliado disfarçado 1 ou 2 vezes por partida; uma pessoa também vai, e a primeira vez é dura. É o objetivo, mas precisa de teste com gente |
| Encarar uma "prisioneira" e ela virar ratazana; falar com um "enfermeiro" e ele virar o faxineiro | O Espírito ficou mais fácil (o robô atento escapa em 60% a 77%); Corpo e Mente, entre 18% e 40%. O manual quer o Espírito resistente, mas a distância é grande |
| A imagem desbotando, as cores se separando e as palavras embaralhando ("Preutrbado") passam a loucura sem número nenhum | O mapa lembrado que mente vira ruído quadriculado com a cabeça muito ruim; dá desorientação, mas é feio |
| A aliada que "desenha o caminho na poeira" vale a conversa | Sem minimapa, achar a escada num andar grande cansa; Explorar e a dica da aliada ajudam |
| Explorar (O) e tocar no mapa tornam o celular jogável | O último andar ainda é o mais letal para Corpo e Mente (o chefe fica junto da saída) |
| Partida de 600 a 900 turnos: 10 a 15 minutos com Explorar | Os textos de sussurro repetem depois de duas ou três partidas no mesmo tema |
| Os três temas trocam a pele inteira: azulejo e enfermeiros; pedra, cultistas e ossadas; concreto, errantes e saqueadores | — |

## Desvios das regras do Clip

Todos ficam em `PARAM` (`crawler/jogo.js`) ou em `temas.js`; o motor não foi alterado.

| # | Desvio | Valor | Por quê | Ver |
|---|---|---|---|---|
| 1 | Fôlego: soma à Vida do motor | +8 | Com Vida 5, Mente e Espírito morrem com um golpe (A4 da arena) | PENDENCIAS 1.2, 5.5 |
| 2 | Sanidade do jogo = 0,75 × Sanidade do motor + 9 | Corpo 14, Mente 14, Espírito 23 | Corpo começa com 4 no manual e cairia em poucos turnos; Espírito com 18 nunca enlouqueceria. Comprime sem inverter a ordem | Sanidade |
| 3 | Resistência só na Defesa | `resolverAtaque` recebe `resistencia: 0` | Contar duas vezes trava lutas entre personagens de Corpo (A1 da arena) | PENDENCIAS 5 |
| 4 | Dano da magia de fogo = diferença + PM gastos + Raciocínio | — | O motor soma só ao ataque; com dano só pela diferença, a Mente não derruba ninguém (A5 da arena, dúvida D2) | Mágicas de Ataque Físico |
| 5 | Teto de 2 de Sanidade por sussurro de assombro | `danoMentalMaximo` | Dano pela diferença dos dados com Sanidade baixa vira morte instantânea por loucura (A3 da arena) | PENDENCIAS 5.6 |
| 6 | Golpe de vulto tira 1 de Sanidade | — | É alucinação; a perda é o susto | — |
| 7 | Sanidade cai com o tempo | 1 a cada 40→24 turnos (cresce com o andar), ajustado pela Sanidade máxima; companhia ao lado alonga em 60% | O manual não diz como a Sanidade cai fora de magia | Sanidade |
| 8 | Recuperação | Vida +1 a cada 10 turnos, PM +1 a cada 6, +5 de Vida ao trocar de andar; itens (+6 Vida, +4 Sanidade), altar (+5), conversa (+2) | O manual não diz como se recupera | PENDENCIAS 1.3, 4.4 |
| 9 | Sanidade 0 = surto de 5 turnos e cicatriz (−3 de Sanidade máxima); 3 surtos encerram | — | "Perde o controle" sem dizer por quanto tempo | Sanidade |
| 10 | Matar gente tira 1 de Sanidade, menos de quem tem o Corpo como Caminho dominante | — | Violência pesa para Mente e Espírito; o Corpo se acostumou. Sem a exceção, o Corpo enlouquecia só de lutar | — |
| 11 | Insistir no "olhar de novo" | Só Corpo; paga até 2 de Vida; desiste abaixo de 3 de Vida | `testar` com `insistir`, como no manual, com teto para não matar o personagem por curiosidade | Insistir |
| 12 | Nível 0 sempre rola 1D6−2 | — | Igual ao motor; o manual diz "falha automática, a critério do Mestre" | Testes |
| 13 | Monstros têm números próprios, sem ficha | `temas.js` | Ficha completa para um rato é ruído; ataque, defesa, Vida, arma e Vontade bastam | — |
| 14 | Assombros flutuam devagar (andam a cada 2 turnos) e só atacam a Sanidade; os "corredores" andam 2 casas | — | Dar ao Corpo como fugir do que ele não enfrenta; dar pressão ao tema zumbi | — |
| 15 | Críticos | Sucesso crítico do jogador dobra o dano; falha crítica só vira texto | A arena mostrou que críticos mudam pouco (A8) | PENDENCIAS 5.4 |
| 16 | Equipamento acima do limite de Força | Não dá para usar ("pesado demais") | `limiteEquipamento` do motor; Mente e Espírito com Força 0 lutam de mãos nuas | Limitação para Equipamentos |
| 17 | **Consciência**, medida nova | Máximo 10 + 2 × (Físico + Percepção + Sabedoria); cai com o tempo, pancadas e sangue; volta descansando; em zero, desmaio de 5 turnos | Separar "cansado" de "louco": o espaço mente pelo cansaço, as identidades pela Sanidade. Não existe no Clip | — |
| 18 | Ferimento muda o corpo | Muito ferido: 20% dos passos custam dois turnos; À beira do colapso: 40% e −1 no Ataque | O manual não tem penalidade por Vida baixa | PENDENCIAS 1 |
| 19 | Coisas perturbadoras | Carta −1, fotografia −2, corpo −1 ao ver e −1 ao revistar (o Corpo não perde ao ver) | Mais um jeito de a Sanidade cair, agora por escolha do jogador | Sanidade |
| 20 | A ronda é invencível | Vida 999; só atrasa (tonta, recua) | Urgência; não há regra de criatura invencível no Clip | — |
| 21 | Defender | +2 de Defesa (+4 contra golpe preparado) e contra-golpe se errar | O manual não tem defesa total nem contra-ataque | Combate |
| 22 | Empurrar | Teste de Força contra 2 + Defesa do alvo | O manual não tem manobras | Combate |
| 23 | Humanos comuns só vigiam | Estado "vigiando"; paciência de 4 turnos; alarme ao agredir | O Clip não fala de disposição de PNJ; é decisão de mesa |
| 24 | Clareza | +1 de Sanidade por mentira desfeita | O manual não dá recuperação por acerto | Sanidade |
| 25 | Fé reduz sustos | Metade da Fé soma à Serenidade na redução | Proposta: Fé como resistência a medo | PENDENCIAS 2 |

## Dúvidas de regra que o protótipo levantou

| # | Tema | O que o protótipo fez | Por que importa | Ver |
|---|---|---|---|---|
| 1 | Como a Sanidade cai fora de magia | Tempo, sustos, vultos, matar gente, ferir aliado, falhar ao encarar | O manual só define a Sanidade inicial e o Ataque Mental | Sanidade, PENDENCIAS 1.3 |
| 2 | O que acontece em Sanidade 0 | Surto curto + cicatriz; terceiro surto encerra | "Perde o controle" não diz por quanto tempo nem se volta | Sanidade |
| 3 | Percepção como defesa contra ilusão | Olhar de novo = Percepção ou Sabedoria contra a lucidez | O manual não tem teste de "isto é real?" | Testes, PENDENCIAS 6.8 |
| 4 | Fé e Vontade como ação | Encarar (espantar) e Ancorar (recuperar lucidez) | Sem isso, o Espírito não tem verbo em combate | PENDENCIAS 2 |
| 5 | Convencer em conflito | Presença + Aprimoramento social contra 3 + Vontade + andar | Mesmo problema da dúvida 7 das cartas | Combate |
| 6 | Defesa mental | Vontade + Fé + Autocontrole (proposto) | Igual à arena e às cartas; Autocontrole é proposta | Magia, PENDENCIAS 2 |
| 7 | Serenidade | −1 em cada perda de Sanidade por susto (não no tempo) | A proposta não diz se vale para tudo | PENDENCIAS 2 |
| 8 | Memória | Memória ≥ 1 impede o mapa lembrado de mentir | Primeiro uso concreto do Aprimoramento proposto | PENDENCIAS 2 |
| 9 | Caminho dominante muda no meio da campanha | Ao evoluir, Vida e Sanidade são recalculadas pelo novo Caminho, mantendo o dano sofrido | O manual não diz o que acontece se o Caminho dominante mudar | Valores Resumidos |
| 10 | Aliados e Unindo forças | A companhia luta sozinha, ao lado, com números fixos, e faz o tempo pesar menos | O manual soma Atributos ao unir forças; aqui é outra coisa | Testes, Situação 5 |
| 11 | Cansaço e atenção | Consciência como terceiro recurso (ver desvio 17) | O Clip tem Vida, Magia e Sanidade. Vale um recurso de fadiga, ou isso cabe nos Pontos de Magia? | Pontos de Magia, PENDENCIAS 1 |
| 12 | Penalidade por ferimento | Lentidão e tremor com Vida baixa | O manual não diz se o personagem ferido luta pior | Combate, PENDENCIAS 1 |
| 13 | Manobras de combate | Defender, empurrar, golpe preparado | Vale ter manobras no Clip (defesa total, empurrar, preparar)? Com que teste? | Combate |

## Próximos passos possíveis

| Ideia | Esforço |
|---|---|
| Testar com 3 a 5 pessoas, cronometrar e anotar quando acreditaram numa mentira | Baixo |
| Minimapa que também mente (rabiscado à mão, com a memória) | Médio |
| Mais sussurros e salas por tema; eventos de sala (uma enfermaria com cartas para ler, um poço que chama) | Médio |
| Rever os números quando custos, combate e recuperação forem fechados em `PENDENCIAS.md` | Baixo: só `PARAM` e `temas.js` |
| Equilibrar o Espírito (está fácil) e o chefe do último andar | Baixo |
| Sons gerados em código (passos, sussurros) que também mentem | Médio |
