# Arena: notas de equilíbrio e dúvidas de regra

Achados do simulador da arena (`arena/arena.js`, função `simular`) para ajudar
a fechar a seção 5 de `PENDENCIAS.md`. **Nada aqui decide regra:** os números
mostram o que acontece com o texto atual e com as alternativas.

Como reproduzir: aba "Simulador de equilíbrio" em `/arena/`, ou no Node:

```js
import * as A from './arena/arena.js';
A.simular({ n: 2000, opcoes: { resistenciaReduzDano: false }, rng: A.semente(42) });
```

Dados abaixo: 2.000 duelos por confronto, semente 42, 15 Pontos de Evolução,
distância inicial longa, IA contra IA.

## Builds prontas (15 PE)

Cada build é uma receita: a ordem em que os pontos são gastos, respeitando
Aprimoramento ≤ Atributo, Perícia ≤ menor requisito e nível ≤ 5. O limite de
Força + Manipulação de Peso vira equipamento.

| Build | Atq. curto | Atq. longo | Defesa | Def. mental | Vida | PM | Sanidade | Equipamento | Mágica |
|---|---|---|---|---|---|---|---|---|---|
| Guerreira de lâmina | 4 | 0 | 2 | 0 | 18 | 0 | 4 | Arma2, Armadura1 | — |
| Arqueiro do vale | 0 | 4 | 2 | 0 | 16 | 0 | 4 | Arma2, Armadura1 | — |
| Conjuradora de faíscas | 0 | 0 | 1 | 0 | 5 | 16 | 7 | — | Ataque Físico 4 |
| Místico do silêncio | 0 | 0 | 0 | 5 | 5 | 14 | 17 | — | Ataque Mental 3 |
| Sentinela de ferro | 3 | 0 | 4 | 0 | 18 | 0 | 4 | Armadura1, Escudo1 | — |

## Taxa de vitória geral por variante de regra

Vitórias contra as outras quatro builds (sem contar o espelho).

| Build | Texto atual | Resistência só na Defesa | Críticos sem efeito | Sanidade 0 não derruba | Início na curta |
|---|---|---|---|---|---|
| Guerreira de lâmina | 61% | 74% | 62% | 75% | 72% |
| Arqueiro do vale | 47% | 48% | 47% | 50% | 47% |
| Conjuradora de faíscas | 21% | 22% | 22% | 25% | 21% |
| Místico do silêncio | 39% | 37% | 38% | 0% | 22% |
| Sentinela de ferro | 55% | 56% | 54% | 73% | 62% |
| Empates (30 rodadas) | 11% | 5% | 11% | 11% | 10% |
| Rodadas em média | 7,2 | 6,8 | 7,3 | 7,5 | 6,7 |

Com 10, 20 e 25 PE a ordem quase não muda (Guerreira 57–61%, Conjuradora
21–23%), então os problemas abaixo não são efeito do orçamento.

## Confronto a confronto (texto atual)

Linha vence coluna; "r" = rodadas em média.

| | Guerreira | Arqueiro | Conjuradora | Místico | Sentinela |
|---|---|---|---|---|---|
| Guerreira | 40% (18% empate) 22,7r | 99% 7,8r | 100% 2,6r | 46% 1,6r | 1% (99% empate) 30r |
| Arqueiro | 1% 7,8r | 50% 4,6r | 100% 1,6r | 87% 1,2r | 0% (8% empate) 19,7r |
| Conjuradora | 0% 2,6r | 0% 1,6r | 49% 1,6r | 85% 1,6r | 0% 4,5r |
| Místico | 54% 1,6r | 13% 1,2r | 15% 1,6r | 49% 4,1r | 73% 1,7r |
| Sentinela | 0% (99% empate) 30r | 93% (8% empate) 19,7r | 100% 4,5r | 27% 1,7r | 0% (100% empate) 30r |

## Problemas de regra que os números mostram

| # | Achado | Números | Liga com |
|---|---|---|---|
| A1 | **Resistência contada duas vezes trava lutas entre personagens de Corpo.** Ela entra na Defesa e de novo no dano; com armadura e o dano mínimo de 1, quase todo acerto vira 1. | Guerreira × Guerreira: 18% de empates, 22,7 rodadas → 0% e 13,4 rodadas com Resistência só na Defesa. Guerreira × Sentinela: 99% → 47% de empates. Empates gerais: 11% → 5%. | `REGRAS.resistenciaReduzDano`, PENDENCIAS 5 |
| A2 | **Defesa empilhada contra ataque baixo não termina.** Sentinela × Sentinela empata 100% nas duas variantes: Defesa 4 contra Ataque 3, redução 4 e dano mínimo 1 dão ~0,3 de dano por rodada contra 18 de Vida. | 100% de empates em 30 rodadas. | Dano mínimo, Armadura + Escudo + Resistência |
| A3 | **Ataque Mental é decisivo contra o Corpo e inútil contra os outros.** Personagens de Corpo têm Sanidade 4 e Defesa mental 0 (Vontade + Fé); dois acertos bastam. Contra quem tem Vontade e Fé, quase nunca acerta. | Místico vence Sentinela 73% e Guerreira 54%, todos por Sanidade, em 1,6–1,7 rodadas. Contra Arqueiro e Conjuradora, 13–15%. Sem "Sanidade 0 derruba", vence 0%. | Mágicas de Ataque Mental, Sanidade, PENDENCIAS 5.6 |
| A4 | **Mente e Espírito começam com 5 de Vida e morrem com um golpe.** Sem Saúde (que exige Físico), uma arma +2 acerta 5 de dano com folga. | Conjuradora e Místico perdem para Guerreira e Arqueiro em 1,2–2,6 rodadas. Na distância curta, Místico cai de 39% para 22%. | Pontos de Vida (base 5) |
| A5 | **Mágica de Ataque Físico é fraca contra armadura.** O Valor de Ataque é só o PM gasto (até o nível da Perícia), não soma arma, e o dano sofre Armadura + Escudo + Resistência. Com 16 PM e custo 4, são 4 ataques. | Conjuradora vence 21% no geral e 0% contra Guerreira, Arqueiro e Sentinela. | Mágicas de Ataque Físico, Limitações para Magias |
| A6 | **A arma soma em qualquer ataque, mesmo sem perícia.** Uma Guerreira com Arremesso 0 e Precisão 0 ataca à distância com 0 + 1D6 + Arma2 e pode matar um místico (Vida 5) na primeira rodada. | Visto no teste manual no navegador. | Armas, Ataque à Longa Distância |
| A7 | **Equipamento não custa Pontos de Evolução.** Cada ponto de Força libera +1 de modificador de equipamento de graça, além do que Força já dá. | Builds de Corpo dominam em todos os orçamentos (10 a 25 PE). | Limitação para Equipamentos |
| A8 | **Críticos quase não mudam o resultado.** Com a proposta 5.4 (dano dobrado, ação perdida, contra-ataque, armadura ignorada), as taxas mudam no máximo 1 ponto. | 1/36 de chance por dado para cada tipo de crítico. | PENDENCIAS 5.4 |
| A9 | **Quem foge depende só de Agilidade.** Builds de longa distância sem Agilidade não conseguem manter distância. | Arqueiro × Guerreira: 1%. | Movimento (não existe no manual) |

## Dúvidas de regra (interpretações da arena)

| # | Dúvida | O que a arena fez | Precisa decidir |
|---|---|---|---|
| D1 | Defesa contra Mágica de Ataque Físico | Defesa normal (Reflexo + Resistência + 1D6) | Se é essa defesa ou outra |
| D2 | Dano da Mágica de Ataque Físico | Igual ao ataque com arma: diferença − Armadura − Escudo − Resistência, mínimo 1, sem modificador de arma | A tabela do manual diz "Valor de Ataque 3 e Dano 3", o que sugere dano fixo igual ao modificador |
| D3 | Dano da Mágica de Ataque Mental | Diferença, mínimo 1, sem nenhuma redução, na Sanidade | Se Resistência ou algum Aprimoramento (ex.: Serenidade proposta) reduz |
| D4 | Sanidade a zero | Tira do duelo ("fora de si") | Se a pessoa continua lutando, descontrolada |
| D5 | Rodada | Cada lado age uma vez por rodada, na ordem da Iniciativa decidida no início (proposta 5.1) | PENDENCIAS 5.1 |
| D6 | Defender | Gastar a ação dá +2 na Defesa até a próxima ação (proposta 5.2). A IA não usa, porque atacar sempre rende mais | PENDENCIAS 5.2 |
| D7 | Críticos | Proposta 5.4. Falha crítica no ataque perde a próxima ação; sucesso crítico na defesa dá um contra-ataque com arma | PENDENCIAS 5.4 |
| D8 | Vida a zero | Desmaiado, fim do duelo | PENDENCIAS 5.5 |
| D9 | Distância e movimento | Corpo a corpo só na curta; à distância e mágicas em qualquer uma. Aproximar sempre funciona; afastar exige vencer Agilidade + 1D6 contra Agilidade + 1D6 (empate fica perto) | O manual não trata de movimento |
| D10 | Ataque à distância na distância curta | Permitido sem penalidade | Se deve ter penalidade |
| D11 | Escolha da Perícia Mágica a usar | A IA gasta sempre o máximo de PM (nível da Perícia) | — |

## Sobre o motor

O motor não foi alterado. A arena liga e desliga `REGRAS.resistenciaReduzDano`
só durante cada ação (e restaura depois) para comparar as variantes. O teste
`opção de Resistência só na Defesa muda o dano e restaura o motor` confere isso.
