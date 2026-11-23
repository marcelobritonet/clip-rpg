# Pendências do Sistema Clip

Fonte da verdade do que falta decidir, corrigir ou escrever no manual. Ao fechar um item, atualize o README e, se o motor tiver adotado uma interpretação provisória, ajuste `REGRAS` em [`motor/clip.js`](motor/clip.js) e os testes.

**Legenda:** Lacuna = o manual não diz · Contradição = o manual diz duas coisas · Erro = texto ou fórmula errada · Proposta = ideia nova para discutir

## 1. Contradições e erros de regra

| # | Tópico | Tipo | O que o manual diz | Como o motor faz hoje | Proposta | Decisão |
|---|---|---|---|---|---|---|
| 1.1 | Cálculo do dano | Erro | "Subtraia o Valor de Ataque do Valor de Defesa" (daria dano negativo) | Ataque − Defesa | Corrigir o texto para "Valor de Ataque − Valor de Defesa" | ☐ |
| 1.2 | Resistência conta duas vezes | Contradição | Entra no Valor de Defesa **e** é subtraída de novo do dano | Segue o texto: conta duas vezes (`REGRAS.resistenciaReduzDano`) | Tirar a Resistência da Defesa (Defesa = Reflexo + Perícias) e deixar só a redução de dano, que é o papel descrito para ela | ☐ |
| 1.3 | Recuperar Sanidade | Contradição | "Um personagem **jamais** pode recuperar os seus Pontos de Sanidade até no máximo o seu valor inicial" | Permite recuperar até o máximo | Escrever: "pode recuperar até no máximo o valor inicial" e dizer **como** se recupera (descanso, Fé, ajuda; ver 4.4) | ☐ |
| 1.4 | "Ataque à Curta Distância" duplicado | Erro | O item aparece duas vezes em Valores Resumidos | Usa o primeiro | Apagar a cópia | ☐ |
| 1.5 | Iniciativa cita "Atributo Corpo" | Erro | Corpo é Caminho, não Atributo | Usa o valor do Caminho do Corpo | Trocar por "Maior valor no Caminho do Corpo" | ☐ |
| 1.6 | Valor de um Caminho | Lacuna | Usa "maior valor no Caminho", "Corpo 3" e a ficha tem campo "Nível" do Caminho, sem definir o cálculo | Soma dos 3 Atributos (`REGRAS.valorCaminho`) | Definir como soma dos Atributos | ☐ |
| 1.7 | Empate entre Caminhos | Lacuna | Vida e Sanidade dependem do Caminho de maior valor; empate não está previsto | O jogador escolhe o Caminho principal | Regra: em empate, o jogador escolhe na criação e anota na ficha | ☐ |
| 1.8 | Manipulação de Peso | Lacuna | "Permite utilizar armas 1 nível a mais que o permitido" | +1 por nível no limite de modificadores (Força) | Escrever: "cada nível soma 1 ao limite de modificadores de equipamento" | ☐ |
| 1.9 | "Perícias Correspondentes" em combate | Lacuna | As fórmulas somam Perícias, mas não dizem quais | A ficha deixa marcar onde cada Perícia soma (curta, longa, defesa) | Regra: Perícia de arma (Espada, Arco…) soma no ataque daquele tipo; Mestre aprova | ☐ |
| 1.10 | Perícia "Ataque Mágico Mental" | Contradição | Citada no CHANGELOG 0.9.2; no manual virou "Mágicas de Ataque Mental" | Usa "Mágicas de Ataque Mental" | Ajustar o CHANGELOG | ☐ |
| 1.11 | Insistir em Mente e Espírito | Lacuna | Só o Corpo pode insistir (paga com Vida) | Só Corpo | Mente insiste pagando Sanidade; Espírito pagando PM. Ver também Determinação em 2 | ☐ |
| 1.12 | Efeito dos críticos | Lacuna | "Cabe ao mestre punir ou bonificar" | Só sinaliza o crítico | Ver 5.4 | ☐ |
| 1.13 | Teto de nível | Lacuna | "Variam em média entre zero e cinco" | Acima de 5 só gera aviso | Manter 5 como teto na criação; acima disso só com evolução | ☐ |

## 2. Aprimoramentos de Mente e Espírito (proposta)

Hoje Inteligência, Percepção, Sabedoria, Vontade e Fé não têm Aprimoramentos. A proposta espelha o Corpo: cada Atributo ganha um Aprimoramento de **ataque ou uso**, um de **defesa ou resistência** e um de **conhecimento ou percepção**. Já estão no motor como `proposto: true` e aparecem na ficha com a chave "Aprimoramentos propostos".

| Atributo | Aprimoramento | Efeito proposto | Espelho no Corpo | Decisão |
|---|---|---|---|---|
| Inteligência | Memória | Lembrar fatos, rotas e detalhes já vistos | — | ☐ |
| Inteligência | Raciocínio | +1 no Valor de Ataque de Mágicas de Ataque Físico | Ataque Corporal | ☐ |
| Inteligência | Erudição | Conhecimento acumulado: história, línguas, ciência | — | ☐ |
| Percepção | Atenção | Entra na Iniciativa antes de Reflexo; notar emboscadas | Reflexo | ☐ |
| Percepção | Sentidos | Visão, audição e olfato apurados; rastrear | Precisão | ☐ |
| Percepção | Intuição | Pressentir perigo e intenções sem prova | — | ☐ |
| Sabedoria | Discernimento | Perceber mentiras e julgar situações | — | ☐ |
| Sabedoria | Vivência | Costumes, culturas, "como as coisas funcionam" | — | ☐ |
| Sabedoria | Serenidade | −1 em cada perda de Sanidade | Resistência | ☐ |
| Vontade | Determinação | Permite Insistir em testes de Mente, pagando com Sanidade | — | ☐ |
| Vontade | Autocontrole | +1 na Defesa contra Ataque Mental e Controle | Reflexo | ☐ |
| Vontade | Foco | +1 no limite de PM gastos por mágica | Manipulação de Peso | ☐ |
| Fé | Convicção | Resistir a dúvida, tentação e Mágicas de Controle | — | ☐ |
| Fé | Devoção | Canalizar aquilo em que se acredita (magia de fé) | — | ☐ |
| Fé | Esperança | Recuperar Sanidade própria e de aliados no descanso | Saúde | ☐ |

## 3. Experiência e custos (lacunas "XX")

| # | Tópico | Situação | Proposta | Decisão |
|---|---|---|---|---|
| 3.1 | Custo na criação | "XX". O motor usa 1 ponto por nível (`REGRAS.custoPorNivel`) | Manter 1 ponto por nível na criação: simples, e a tabela de Nível Inicial já foi pensada assim | ☐ |
| 3.2 | Custo para evoluir depois | "XX" | Custo = **novo nível × peso**: Atributo ×3, Aprimoramento ×2, Perícia ×1. Ir de Força 2 para 3 custa 9; de Agilidade 1 para 2 custa 4; uma Perícia nova no nível 1 custa 1 | ☐ |
| 3.3 | Como se ganha experiência | "XX". O manual critica dar XP por combate vencido | XP por **marcos de história**, nunca por inimigo derrotado: 1 por sessão jogada, +1 por agir de acordo com o background mesmo quando custa caro, +1 por um objetivo pessoal alcançado, +1 por resolver um conflito sem violência quando a violência era o caminho fácil. Faixa de 1 a 4 por sessão | ☐ |
| 3.4 | O que pode evoluir | Lacuna | **Evolução pelo uso**: só sobe o que foi usado em momento decisivo na sessão (o jogador marca na ficha) ou o que foi treinado no tempo livre, com um mestre ou livro | ☐ |
| 3.5 | Comprar Antecedentes depois | Título existe, regra não | Antecedentes mudam pela história (o Mestre concede ou retira), não por XP | ☐ |

## 4. Magia

| # | Tópico | Situação | Proposta | Decisão |
|---|---|---|---|---|
| 4.1 | Princípio "forma livre, efeito pago" | Só implícito ("o objetivo não é exemplificar as formas") | Inserir no início do Suplemento de Magia: *"O jogador descreve a mágica como quiser. A aparência não muda a regra: o efeito no jogo depende só dos PM gastos, limitados pelo nível da Perícia Mágica. Um meteoro de fogo lançado com 1 PM é um espetáculo de luz que causa o efeito de 1 PM."* O motor já faz isso (`lancarMagia`) | ☐ |
| 4.2 | Tabela de potência | Lacuna | Uma régua para o Mestre traduzir a descrição em efeito: 1 PM = efeito pequeno (acender uma vela, dano 1); 2–3 = efeito de uma pessoa treinada (derrubar uma porta, dano 3); 4–5 = feito de especialista (incendiar uma casa); 6+ = lendário | ☐ |
| 4.3 | Dano de Mágicas de Ataque Físico | Lacuna | O exemplo diz "Valor de Ataque 3 e Dano 3" sem fórmula | Dano = Valor de Ataque − Defesa do alvo, como no combate físico (mínimo 1) | ☐ |
| 4.4 | Recuperar PM e Sanidade | Lacuna | PM: todo o valor após uma noite de descanso. Sanidade: 1 por dia de descanso em lugar seguro, +Esperança (ver 2) | ☐ |
| 4.5 | Mágicas de Suporte: exemplo do custo | Erro provável | "Bonifica todos os amigos com Dano +2" custaria 2 PM × número de alvos; vale deixar o cálculo explícito no exemplo | ☐ |

## 5. Combate (seção "XX")

| # | Tópico | Situação | Proposta | Decisão |
|---|---|---|---|---|
| 5.1 | Rodada | Lacuna | Cada personagem age uma vez por rodada, na ordem da Iniciativa (definida no início da luta). Uma ação: atacar, lançar mágica, mover-se e agir de outra forma | ☐ |
| 5.2 | Defender é ação? | Lacuna | Defender é reação e não gasta ação. Quem gasta a ação só defendendo ganha +2 na Defesa até a próxima rodada | ☐ |
| 5.3 | Vários atacantes | Lacuna | −1 na Defesa para cada atacante além do primeiro na mesma rodada | ☐ |
| 5.4 | Efeito dos críticos | Lacuna | Sucesso crítico no ataque: dano dobrado. Na defesa: contra-ataque imediato. Falha crítica no ataque: perde a próxima ação ou derruba a arma. Na defesa: o dano não sofre redução de armadura | ☐ |
| 5.5 | Vida a zero | "Desmaiado ou morto" | Vida 0 = desmaiado. Abaixo de −(Físico + Saúde) = morto. Isso dá margem para resgate | ☐ |
| 5.6 | Dano em Sanidade | Só o Ataque Mental fala disso | Cenas de horror e perdas pesadas também tiram Sanidade (1 a 3), reduzidas por Serenidade | ☐ |

## 6. Texto e ortografia

| # | Onde | Correção |
|---|---|---|
| 6.1 | Subtítulo | "Um RGP" → "Um RPG" |
| 6.2 | Vários | "Desteza" → "Destreza" |
| 6.3 | Ataque corporal | "infringido" → "infligido" |
| 6.4 | Testes | "peronsagens", "fala no seu teste", "Stualção", "Coseguir", "obtivo" |
| 6.5 | Perícias | "Equilíbrio \| Agilidade" sem a barra final da tabela |
| 6.6 | Antecedentes | "ser poder ser modificado" → "sem poder ser modificado" |
| 6.7 | Sequência de Combate | Numeração das sublistas quebrada (passos 7 a 14 dentro de 1 a 3) |
| 6.8 | Seções vazias | "Testando o Caminho da Mente", "Testando o Caminho do Espírito" e "Glossário" estão vazias |

## 7. Dúvidas levantadas pelo Desvario (crawler)

O protótipo [`crawler/`](crawler/) precisou decidir estas regras para funcionar. A coluna "Proposta" é o que ele faz hoje; o detalhe está em [`crawler/NOTAS.md`](crawler/NOTAS.md), seção "Dúvidas de regra". Itens já cobertos acima: Sanidade fora de magia (5.6), Fé e Vontade como ação e Serenidade/Memória (seção 2).

| # | Tópico | Situação | Proposta | Decisão |
|---|---|---|---|---|
| 7.1 | Sanidade 0 | "Perde o controle" não diz por quanto tempo nem se volta | Surto curto (5 turnos): o personagem age sozinho, volta com metade e uma cicatriz; o terceiro surto encerra | ✅ 21/11/2026: no surto o jogador não age. O personagem ataca quem estiver perto (aliados também), quebra coisas, corre sem rumo e perde itens. Volta com metade da Sanidade e uma cicatriz; o terceiro surto encerra. Falta escrever no manual |
| 7.2 | Teste de "isto é real?" | O manual não tem teste contra ilusão | Percepção ou Sabedoria contra a lucidez de quem olha | ✅ 21/11/2026: Percepção ou Sabedoria (o maior) contra uma dificuldade que sobe com a perda de lucidez. Falta escrever no manual |
| 7.3 | Convencer em conflito | Não há regra para convencer um inimigo no meio da luta | Presença + Aprimoramento social contra 3 + Vontade + andar | ✅ 21/11/2026: Presença + Aprimoramento social contra 3 + Vontade do outro. Falta escrever no manual |
| 7.4 | Defesa mental | Igual à arena e às cartas | Vontade + Fé + Autocontrole (proposto na seção 2) | ✅ 21/11/2026: Vontade + Fé + Autocontrole (depende da seção 2 adotar o Autocontrole). Falta escrever no manual |
| 7.5 | Caminho dominante muda | O manual não diz o que acontece ao evoluir e trocar de Caminho | Vida e Sanidade recalculadas pelo novo Caminho, mantendo o dano sofrido | ✅ 21/11/2026: recalcula Vida e Sanidade pelo novo Caminho, mantendo o dano sofrido. Falta escrever no manual |
| 7.6 | Aliados e Unindo forças | O manual soma Atributos ao unir forças | A companhia luta ao lado com números fixos e faz o tempo pesar menos | ✅ 21/11/2026: o aliado do Mestre também une forças (soma o Atributo dele). O Desvario ainda usa números fixos. Falta escrever no manual |
| 7.7 | Cansaço | O Clip tem Vida, Magia e Sanidade, sem fadiga | Consciência como terceiro recurso (cai com o tempo e as pancadas, volta descansando). Ou cabe nos Pontos de Magia? | ✅ 21/11/2026: o cansaço cabe nos Pontos de Magia; o Clip continua com três recursos. O Desvario mantém a Consciência separada, como regra só dele |
| 7.8 | Penalidade por ferimento | O manual não diz se o personagem ferido luta pior | Lentidão e tremor com Vida baixa | ✅ 21/11/2026: −1 nos testes físicos com Vida abaixo da metade; −2 abaixo de um quarto. O Desvario usa lentidão e tremor. Falta escrever no manual |
| 7.9 | Manobras de combate | Não há defesa total, empurrar nem preparar golpe | Defender (+2 na defesa e contra-golpe), empurrar (teste de Força), golpe preparado (avisado, +2 no ataque) | ✅ 21/11/2026: só defender (defesa total). Empurrar e golpe preparado ficam no Desvario. Falta escrever no manual |

## 8. Duplo Seis (em `duplo-seis/`, na 0.4.0 em 23/11/2026)

Jogar: https://marcelobritonet.github.io/clip-rpg/duplo-seis/ · Notas e decisões da mesa: `duplo-seis/NOTAS.md`

| # | Tópico | Situação | Por onde começar | Decisão |
|---|---|---|---|---|
| 8.1 | Revisão de continuidade dos textos | ✅ 22/11/2026, só pt: 15 problemas corrigidos nas duas aventuras (lista em `duplo-seis/NOTAS.md`). Cada cena agora se sustenta sozinha, em qualquer ordem. O inglês não acompanhou: está na 8.11 | Só texto | ✅ 22/11/2026: só a versão pt. O inglês vira a 8.11 |
| 8.2 | Equilíbrio entre os passados da Brasa | ✅ 22/11/2026: final de 3 estrelas do robô atento entre 37% (Desertora) e 54% (Aprendiz); antes 21% a 82%. Quatro efeitos mudados, texto intocado, espelho `en/` conferido. Números e motivos em `duplo-seis/NOTAS.md`. Ainda não está numa versão publicada | `node duplo-seis/simular.mjs 400 atento brasa`; mexer nos `lacos` das cenas ou nas condições de `finais` em `aventuras/brasa/base.js` (e no espelho `en/`) | Seguir |
| 8.5 | Menu das outras páginas | ✅ 22/11/2026: nova página `jogos/` com Duplo Seis, Arena, Travessia e Desvario. No menu das 6 páginas, Arena, Cartas e Crawler deram lugar a um só link, Jogos (marcado quando se está num jogo). O README aponta para `/jogos` e lista os quatro. Ainda não está publicado | Criar a página `/jogos` reunindo todos os jogos; pôr o link dela no menu das 6 páginas e no README | ✅ 22/11/2026: todos os jogos numa mesma aba `/jogos` |
| 8.6 | Mais cenas por ato | ✅ 22/11/2026, só pt: 12 cenas por ato nas duas aventuras (18 novas). Equilíbrio medido de novo: Brasa 32% a 58%, Ar 16% a 54%. Lista em `duplo-seis/NOTAS.md` | `duplo-seis/aventuras/FORMATO.md` descreve o formato | ✅ 22/11/2026: com Opus 5.5, só cenas boas. Só pt; o inglês vai para a 8.11 |
| 8.7 | Terceira aventura e mais idiomas | ✅ 22/11/2026, só pt: **O Sino Afogado** (horror de interior, anos 1950). Abertura, 36 cenas (12 por ato), duas cenas de torre, cinco finais, seis passados e cinco cenários desenhados. Robô atento: 32% a 57% de final de 3 estrelas. Na versão em inglês ela aparece em português. Bíblia em `duplo-seis/aventuras/sino/HISTORIA.md`, números em `duplo-seis/NOTAS.md`. Ainda não está publicada | Copiar a estrutura de `aventuras/ar/` | ✅ 22/11/2026: terceira aventura só em pt-br. Espanhol e inglês dela vão para a 8.11 |
| 8.13 | História viva: o jogador cria a aventura com uma IA | ✅ 22/11/2026 feito, publicado na 0.4.0. Formulário guiado e ficha livre geram o pedido; a IA devolve JSON (núcleo e ato 1), que se cola; a cada pausa o jogo gera o pedido da sequência com a crônica e o estado do personagem; o final nasce do que ele fez. Exporta e importa `.json`. Testado com o Claude no papel da IA (resultado em `duplo-seis/NOTAS.md`); a história do teste está em `duplo-seis/aventuras/exemplos/as-tres-da-tarde.json` | | ✅ 23/11/2026: o exemplo fica no repositório |
| 8.14 | História viva: capítulos | ✅ 23/11/2026: quem chega a um final (não quem cai no caminho) pode pedir o capítulo seguinte, na tela de fim ou na tela inicial. O personagem leva a ficha evoluída, as marcas (com a frase que as concedeu) e os companheiros que seguem com ele; laços, Vida, Sanidade e relógio recomeçam. O pedido leva a crônica e o final do capítulo anterior. Exporta e importa com a herança | | ✅ 23/11/2026: faça |
| 8.15 | História viva: galeria | ☐ Adiada em 23/11/2026: só vale quando houver histórias boas para pôr nela, o que depende da 8.17. Hoje uma história só sai do aparelho como arquivo `.json`, que cada um manda a quem quiser. A galeria seria uma lista de histórias prontas dentro do próprio jogo, para qualquer jogador escolher e jogar sem importar nada | Pasta `duplo-seis/aventuras/galeria/` lida pela tela inicial; as histórias entrariam por PR no repositório | ✅ 23/11/2026: não por agora |
| 8.16 | História viva: medir ao colar | ✅ 23/11/2026: ao colar, o robô joga o trecho 120 vezes a partir de onde o jogador está e avisa se saiu fácil demais, difícil demais, mortal, sem dados ou com o melhor final garantido ou fora de alcance. O jogador copia um pedido de ajuste ou segue assim mesmo. O pedido à IA trocou as faixas fixas de Dificuldade por uma tabela pelos dados que o personagem rola. Números em `duplo-seis/NOTAS.md` | `duplo-seis/aventuras/medir.js` | ✅ 23/11/2026: importante, faça |
| 8.12 | O Piloto do Ar fica para trás | ✅ 22/11/2026: 16% → 36% no final de 3 estrelas do robô atento; os outros passados não mudaram (33% a 54%). As especiais dele somavam 2 laços, contra 4 a 9 dos outros. Mudanças em `duplo-seis/NOTAS.md`; espelho `en/` feito onde a cena já existia | `node duplo-seis/simular.mjs 1500 atento ar`; mesmo caminho da 8.2 | |

### Próxima etapa

| # | Tópico | Situação | Por onde começar | Decisão |
|---|---|---|---|---|
| 8.17 | História viva em outras IAs | ☐ Só o Claude respondeu aos pedidos, e foi ele que os escreveu. Falta o teste real no ChatGPT e no Gemini: a resposta cabe sem cortar? passa na conferência de primeira? a sequência usa o que o personagem fez? o aviso de equilíbrio aparece e o ajuste resolve? | Criar uma história no jogo publicado e levar cada pedido às duas IAs | ✅ 23/11/2026: teste real, na próxima etapa |

### Separado: o Marcelo decide depois

| # | Tópico | Situação | Por onde começar | Decisão |
|---|---|---|---|---|
| 8.4 | Lacunas do manual que a mesa decidiu | ☐ 14 decisões registradas em `duplo-seis/NOTAS.md` (custo de evolução, experiência por marcos, efeito dos críticos, recuperação, Vida 0, Sanidade 0, cansaço de quem une forças...). Nenhuma mudou regra escrita | Ler a tabela e dizer quais viram regra do manual | 23/11/2026: farei depois; fica separado |

### Rodadas futuras

| # | Tópico | Situação | Por onde começar | Decisão |
|---|---|---|---|---|
| 8.11 | Tudo que não for pt-br | ☐ Despriorizado em 22/11/2026: espelhar no inglês as 15 correções de continuidade da 8.1 (lista em `duplo-seis/NOTAS.md`), traduzir as 18 cenas novas da 8.6 (`node duplo-seis/aventuras/paridade.js brasa en` lista as que faltam), inglês e espanhol da terceira aventura (8.7). Até lá, a versão em inglês pode ficar atrás da pt | Só depois de fechar as pendências em pt | ✅ 23/11/2026: sem outras línguas por agora; fica para rodadas futuras |

Saíram da tabela em 23/11/2026, por estarem com o Marcelo e em andamento: 8.3 (jogar e dizer o que achou) e 8.8 (jogar sem rede e em celular de verdade).

### 8.9 Que modelo dá conta de cada pendência do Duplo Seis

Auditoria de 21/11/2026. "Modelo mínimo" é o mais barato em que dá para confiar sem retrabalho; é julgamento, não medição.

| # | Pendência | O que exige | Modelo mínimo | Observação |
|---|---|---|---|---|
| 8.1 | Revisão de continuidade | Ler 54 cenas em dois idiomas e editar prosa sem perder a voz | Opus 5.5 | Dá para dividir: Sonnet lista os problemas, Opus corrige |
| 8.2 | Equilíbrio da Brasa | Simular, mexer em números, simular de novo | Sonnet 5.5 | Laço fechado com medição objetiva. Enunciado pronto em 8.10 |
| 8.4 | Lacunas que viram regra | Decisão de autor | Nenhum para decidir; Sonnet 5.5 para escrever no README | |
| 8.5 | Link no menu e no README | Uma linha em sete arquivos | Haiku 5.5 | Depende de decisão do Marcelo |
| 8.6 | Mais cenas por ato | Escrita criativa em formato rígido, com validador | Sonnet 5.5 (corretas), Opus 5.5 (boas) | O validador garante a forma, não a graça |
| 8.7 | Terceira aventura | Conceber cenário, tom, final e 27 cenas | Opus 5.5 na base e na bíblia; Sonnet 5.5 nos atos | |
| 8.7 | Espanhol | Tradução literária com paridade conferida por teste | Sonnet 5.5; Haiku 5.5 no dicionário da interface | |

Fable 5.2 não é necessário para nenhuma delas; só valeria para desenhar um jogo novo ou repensar a estrutura deste.
Na primeira rodada, traduções e atos da segunda aventura rodaram no modelo mais caro e caberiam em Sonnet com bíblia e glossário prontos.
Para gastar pouco: sessão nova (sem o histórico longo), sem subagentes, um item por vez.

### 8.10 Enunciado que existia para a 8.2 (já resolvida em 22/11/2026; fica de registro)

> No clip-rpg, branch `claude/duplo-seis`: resolver a pendência 8.2 do `PENDENCIAS.md`. Rodar `node duplo-seis/simular.mjs 400 atento brasa` e aproximar os seis passados no final de 3 estrelas (hoje 21% a 82%; alvo, todos entre 30% e 60%), mexendo só em `lacos` das cenas ou nas condições de `finais` em `duplo-seis/aventuras/brasa/`, e espelhando no `en/`. Sem subagentes. Conferir com `npm test` e `node duplo-seis/aventuras/paridade.js brasa en`. Registrar os números novos no `duplo-seis/NOTAS.md`, marcar a 8.2 no `PENDENCIAS.md`, commitar e parar; não publicar release.
