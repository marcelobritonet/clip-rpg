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

### O que a cabeça inventa, por nível de lucidez

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

## Números do simulador

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

## Próximos passos possíveis

| Ideia | Esforço |
|---|---|
| Testar com 3 a 5 pessoas, cronometrar e anotar quando acreditaram numa mentira | Baixo |
| Minimapa que também mente (rabiscado à mão, com a memória) | Médio |
| Mais sussurros e salas por tema; eventos de sala (uma enfermaria com cartas para ler, um poço que chama) | Médio |
| Rever os números quando custos, combate e recuperação forem fechados em `PENDENCIAS.md` | Baixo: só `PARAM` e `temas.js` |
| Equilibrar o Espírito (está fácil) e o chefe do último andar | Baixo |
| Sons gerados em código (passos, sussurros) que também mentem | Médio |
