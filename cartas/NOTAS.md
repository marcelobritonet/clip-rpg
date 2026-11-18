# Travessia — notas do protótipo de cartas

Protótipo para testar se um jogo de cartas solo, curto, baseado no Sistema Clip é divertido.
Não decide regra: usa o motor (`motor/clip.js`) e anota aqui o que o manual não responde.

- Jogar: `python3 -m http.server` na raiz e abrir `/cartas/`.
- Lógica: `cartas/jogo.js` (sem DOM), testes em `test/cartas.test.js`.
- Interface: `cartas/index.html`, `ui.js`, `cartas.css`.
- Equilíbrio: `node cartas/simular.mjs [partidas]` joga com um robô e mostra os números.

## Como se joga

| Etapa | O que acontece | Regra do Clip usada |
|---|---|---|
| Origem | Sentinela (Corpo), Erudita (Mente) ou Romeira (Espírito): 5 níveis de Atributo e 1 Aprimoramento ou Perícia | `novaFicha`, `valores` (Vida e Sanidade pelo Caminho dominante) |
| Cena | O Mestre (IA) revela 2 desafios e escolhe o do seu **Caminho mais fraco**. Você vê o desafio antes de se preparar | `valoresCaminhos` |
| Preparo | Recebe 3 PE (7 na primeira cena). Treinar Atributo custa 2; jogar carta custa 1. Uma troca de carta por cena | `maximoPericia`, limite Aprimoramento ≤ Atributo, `limiteEquipamento` |
| Teste | Escolhe a abordagem (Atributo, Aprimoramento ou Perícia). Objetos somam níveis; no Corpo dá para Insistir | `testar` (nível em D6, nível 0 = 1D6−2, insistir, objeto) |
| Conflito | Iniciativa; a cada rodada: Lutar, Convencer, Encarar com fé, Analisar, Defender ou Fugir. As três primeiras tiram Ímpeto do oponente | `iniciativa`, `resolverAtaque` |
| Fim | 7 cenas e o Guardião do Vau. Perde quem chega a Vida 0 ou Sanidade 0. Pontuação: Renome. O personagem abre na ficha digital | `pontosGastos`, `NIVEIS_INICIAIS`, `validar` |

## Parâmetros do jogo (não são regra do Clip)

Ficam em `JOGO`, em `cartas/jogo.js`. Foram ajustados com o simulador.

| Parâmetro | Valor | Por quê |
|---|---|---|
| PE por cena / na criação | 3 / +4 | 25 PE na partida inteira: o personagem termina perto de Especialista Iniciante (10 a 12 pontos na ficha) |
| Custo de Atributo / carta | 2 / 1 | Atributo é o "terreno" que libera várias cartas; a 1 PE, ninguém jogaria Aprimoramento |
| Renome | teste 2, conflito 3, +2 sem Lutar | Premia resolver sem violência, na linha do manual |
| Escala | +1 na Dificuldade e nos oponentes a cada 3 cenas | Mantém tensão enquanto o personagem cresce |
| Rodadas por conflito | 4 (final: 8), depois impasse | Sem limite, o conflito vira atrito e a partida passa de 10 minutos |
| Descanso entre cenas | +1 Vida, +1 Sanidade (+Esperança) | Sem isso, quase toda partida acabava em derrota |
| Ataque dos oponentes comuns | 0 + 1D6 (sobe com a escala) | Ver dúvida 8: o dano pela diferença é letal em nível baixo |
| Mestre | Sempre o desafio do Caminho mais fraco | É o jeito do jogo de punir o meta-jogo da especialização |
| Mente lê o mundo | Com Percepção ou Sabedoria 2, você vê o número da Dificuldade; abaixo, só a faixa. O oponente só mostra números depois de Analisar | Dá à Mente um papel além dos testes e esconde números, como o "modo jogador" da ficha |

## Dúvidas de regra que o protótipo levantou

| # | Tema | O que o protótipo fez | Por que importa | Ver |
|---|---|---|---|---|
| 1 | Custo de Atributo × Aprimoramento × Perícia | Atributo 2 PE, o resto 1 PE | Com tudo a 1, Atributo domina: libera mais e testa direto | PENDENCIAS 3.1, 3.2 |
| 2 | Experiência | PE fixo por cena, vença ou perca; Renome é a pontuação | Bate com "XP por marco, nunca por inimigo" | PENDENCIAS 3.3 |
| 3 | Testar Perícia ou Aprimoramento | Rola o nível da própria Perícia ou Aprimoramento (Medicina 2 = 2D6) | O manual só mostra teste de Atributo. Atributo + Perícia? Só a Perícia? | Testes |
| 4 | Testes de Mente e Espírito | Mesma mecânica do Corpo | As seções "Testando o Caminho da Mente/Espírito" estão vazias | PENDENCIAS 6.8 |
| 5 | Nível 0 | Sempre permite 1D6−2 | O manual diz "à critério do Mestre, falha automática". Aqui seria frustrante | Testes, Situação 6 |
| 6 | Insistir na Mente | Determinação (proposto) permite, pagando Sanidade com a mesma conta do Corpo | Confirma que a proposta funciona na prática | PENDENCIAS 2 |
| 7 | Conflito social e espiritual | Convencer = dois maiores entre Empatia, Intimidação e Liderança + Interrogação; Encarar com fé = Convicção + Devoção; ambos + 1D6 contra a defesa do oponente | O manual só tem combate físico e Ataque Mental por magia. Sem isso, Espírito não tem como vencer um conflito | Combate, Magia |
| 8 | Dano pela diferença dos dados | Segue o motor (diferença + arma − armadura − escudo − Resistência, mínimo 1) | Com Vida 5 (Mente ou Espírito dominante), um único acerto de diferença 5 derruba o personagem. Antes dos ajustes, 99% das partidas acabavam em derrota | PENDENCIAS 1.2, 5.5 |
| 9 | Defesa contra pressão mental sem magia | Vontade + Fé (+ Autocontrole); Serenidade reduz a perda | É a defesa do Ataque Mental, usada fora da magia | Magia, PENDENCIAS 2 |
| 10 | Rodada e Defender | Uma ação por rodada; Defender dá +2 na Defesa | Usa as propostas sem decidir | PENDENCIAS 5.1, 5.2 |
| 11 | Iniciativa com Atenção | Atenção entra como a "Perícia correspondente" do primeiro critério | O motor rotula como "Perícia Atenção", mas Atenção é Aprimoramento (proposto) | PENDENCIAS 2 |
| 12 | Recuperar Vida e Sanidade | Descanso +1/+1; Fôlego e Prece; Esperança soma Sanidade | O manual não diz como se recupera | PENDENCIAS 1.3, 4.4 |
| 13 | Objetos e limite de equipamento | Objetos (+2 em testes) ficam fora do limite de Força; só arma, armadura e escudo contam | `validar` soma todo equipamento com modificador, inclusive "outro". Na exportação os objetos vão com modificador 0 | Limitação para Equipamentos |
| 14 | Unindo forças | "Companheiro de estrada" soma +1 nível ao próximo teste | O manual soma os Atributos dos dois; aqui o companheiro tem nível 1 | Testes, Situação 5 |

## O que a simulação mostrou

Robô guloso, 3000 partidas por origem (`node cartas/simular.mjs 3000`):

| Origem | Vitória | Impasse no vau | Derrota | Renome médio | Testes vencidos | Conflitos vencidos | Lutar / Convencer / Fé |
|---|---|---|---|---|---|---|---|
| Sentinela | 53% | 37% | 10% | 9,9 | 60% | 44% | 51% / 36% / 13% |
| Erudita | 38% | 43% | 19% | 8,6 | 55% | 37% | 42% / 41% / 17% |
| Romeira | 44% | 41% | 16% | 9,7 | 53% | 46% | 38% / 52% / 10% |

- Cerca de 46 ações por partida: 5 a 8 minutos para uma pessoa.
- Teste custa em média 1,3 de Vida ou Sanidade; conflito, 1,9.
- A Erudita perde mais: Vida 5 e pouca defesa física. É o efeito da dúvida 8.
- Encarar com fé quase não é usado: os dois Aprimoramentos dependem só de Fé e são propostos.

## Diversão: primeira leitura

Testado por mim no navegador (desktop e celular) e pelo simulador. **Ainda não foi testado com pessoas.**

| Funcionou | Não funcionou ou ficou em dúvida |
|---|---|
| O Mestre mirando o Caminho mais fraco cria uma decisão real a cada cena e se explica ("notou que seu Espírito é frágil") | O dano pela diferença dos dados é letal no começo; foi preciso amaciar os oponentes |
| Ver o desafio antes de gastar PE faz de cada cena um pequeno quebra-cabeça | No começo, testes de 1D6 contra 5 falham muito, e 1D6−2 quase sempre |
| A carta travada diz o que falta ("Precisa de Sabedoria 1"): a regra do menor requisito vira objetivo | O impasse no vau (cerca de 40%) é um final morno |
| Acalmar o lobo com fé e ganhar Renome por não lutar foi o melhor momento da partida | A mão pode travar com cartas sem requisito; uma troca por cena às vezes não basta |
| Analisar recompensa a Mente; esconder os números do oponente combate o meta-jogo | Encarar com fé ficou fraco (10% a 17% do uso) |
| Partida curta e o personagem abre na ficha digital no fim | São só 15 desafios: repetem depois de 3 ou 4 partidas |

## Próximos passos possíveis

| Ideia | Esforço |
|---|---|
| Testar com 3 a 5 pessoas e cronometrar | Baixo |
| Desafios com mais de uma etapa (teste de Mente que abre um conflito mais fácil) | Médio |
| Oponentes que mudam de frente conforme você age (o Mestre reage) | Médio |
| Mágicas como cartas, usando `lancarMagia` e Pontos de Magia | Médio |
| Rever os números quando as regras de custo e combate forem fechadas | Baixo: só `JOGO` e os desafios |
