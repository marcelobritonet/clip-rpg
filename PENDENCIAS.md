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
