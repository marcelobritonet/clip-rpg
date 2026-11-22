# Duplo Seis

Uma sessão de RPG de mesa para um jogador, em 10 a 15 minutos, sobre o Sistema Clip.
O Mestre narra a cena, o jogador escolhe uma abordagem, os dados rolam.

Jogar: https://marcelobritonet.github.io/clip-rpg/duplo-seis/

A base é o manual (`README.md` da raiz), e só ele. Nenhum arquivo dos outros protótipos é usado:
as regras foram reescritas do zero em `regras.js`, cada função citando a seção do manual.

## Versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.2.0 | 21/11/2026 | **Genérico e adaptável: outra aventura, outro idioma, as mesmas regras.** Segunda aventura, "Ar Rarefeito", ficção científica numa estação orbital: 27 cenas, seis passados, sete finais; a magia do suplemento vira "sintonia" (o manual prevê poderes psíquicos ou nascidos com o personagem) sem mudar regra nenhuma. O jogo inteiro em inglês ("Double Six": interface, "The Last Ember" e "Thin Air"), com um teste que confere que a tradução tem exatamente a mesma mecânica. Robô atento, 400 sessões por passado, final de 3 estrelas: na Brasa de 21% (Desertora) a 82% (Menestrel); no Ar de 17% (Piloto) a 56% (Sensitiva). |
| 0.1.1 | 21/11/2026 | **A mesa ganha rosto e memória.** Cenário desenhado em código no alto de cada cena (vila, vale, mata, montanha, farol), com a lanterna brilhando conforme a brasa. Sessão guardada no aparelho, para continuar depois. Ficha livre: o jogador escreve o passado e distribui os 12 pontos, com os tetos do manual. Aventura do dia (a mesma semente para todos), caderno de finais, palpite do Mestre antes de rolar, e companheiro que une forças numa falha fica de fora da cena seguinte. Instalável no celular e joga sem rede. Velar a brasa passa a valer +2. Robô atento, 300 sessões: 3 estrelas entre 20% (Desertora) e 82% (Menestrel). |
| 0.1.0 | 21/11/2026 | **Primeira sessão completa.** Aventura "A Última Brasa": abertura (a porta de Dificuldade 10 do manual), três atos de quatro cenas sorteadas entre 27, o Farol em duas cenas e sete finais. Seis passados, todos fichas válidas de 12 pontos. Teste com objeto, unir forças, insistir, nível 0 e dado da sorte; combate por rodadas; magia por Ponto de Magia; Sanidade e perda de controle; evolução por marcos no acampamento; crônica da sessão; dados animados e som em código. Robô atento, 500 sessões por passado: final de 3 estrelas entre 20% (Desertora) e 79% (Menestrel); sucesso por teste entre 76% e 84%. Robô ao acaso: 85% de "Cinza". |

## Como o manual vira jogo

| No manual | No jogo |
|---|---|
| "Conteúdo é o Rei" | A sessão começa pelo passado: quem você foi e por que viaja. Os pontos vêm depois |
| Físico, mental e social mensurados | Toda cena tem três saídas abertas, uma por Caminho |
| Contra XP por combate | Ponto de Evolução vem de ato vencido e de marco de história. Um teste confere que nenhum desfecho de combate rende marco |
| Teste, Dificuldade, objeto, unir forças, nível 0 | `regras.testar`, com os seis casos da porta cobertos por teste |
| Insistir, só no Corpo | Botão depois da falha, com o preço em Vida à vista |
| Sequência de Combate | `regras.atacar`: empate é da defesa, dano mínimo 1, Resistência na Defesa e no dano, como está escrito |
| Regras Especiais | O dado da sorte (o dourado) rola de novo ao cair 1 ou 6 |
| Sem Sanidade, "perde o controle" | O Mestre sorteia uma das quatro reações do manual: fúria, loucura impulsiva, convulsões, torpor |
| Limitação para Equipamentos | O jogo escolhe a melhor combinação que cabe na Força |
| Magia (suplemento) | 1 PM por dado ou por modificador, com teto no nível da Perícia Mágica |

## O que o manual deixa em aberto e a mesa decidiu

Tudo isto está no bloco `MESA` de `jogo.js`. Nada aqui muda regra escrita.

| # | Lacuna no manual | Decisão da mesa |
|---|---|---|
| 1 | Custo de evolução ("XX") | 1 Ponto de Evolução por nível, como na criação |
| 2 | De onde vem a experiência ("XX") | 1 ponto por ato vencido, mais 1 por marco de história. Nunca por inimigo |
| 3 | Efeito dos críticos ("cabe ao mestre") | Em teste: duplo seis vira a falha em sucesso, ou melhora o sucesso; duplo um piora a falha, ou cobra 1 de Vida do sucesso. Em combate: ataque com duplo seis dobra o dano; com duplo um, erra; defesa com duplo seis escapa; com duplo um, perde a proteção |
| 4 | Críticos em teste de vários dados | Vale o primeiro dado, o "dado da sorte". O manual só descreve o crítico para um D6 |
| 5 | Recuperar Vida, Magia e Sanidade | Uma noite devolve toda a Magia e deixa escolher: 1D6 de Vida (mais Saúde), 1D6 de Sanidade ou +2 de brasa |
| 6 | Vida 0: "morto ou desmaiado" | Na primeira vez, desmaia e acorda com 1D6 de Vida e menos brasa. Na segunda, morre |
| 7 | Sanidade 0 | Uma das quatro reações, depois volta com 1D6 de Sanidade. Na terceira vez não volta |
| 8 | Quando o Mestre autoriza insistir | Sempre que a Vida cobrir o custo e sobrar ao menos 1 |
| 9 | Valor de um Caminho | A soma dos três Atributos. Em empate vale a ordem Corpo, Mente, Espírito |
| 10 | Manipulação de Peso ("1 nível a mais") | +1 no limite de equipamento por nível |
| 11 | Companheiro em combate | Soma +1 em "outros modificadores" do ataque |
| 12 | Teste de Perícia Mágica fora de combate | 1D6 por PM gasto contra a Dificuldade, como no encantamento temporário |
| 13 | Dificuldade ao longo da sessão | O Mestre aperta em +1 a partir do ato 2 (`MESA.aperto`) |
| 14 | Unir forças tem preço? | Companheiro que uniu forças numa falha fica de fora da cena seguinte (`MESA.cansaco`) |

## Coisas do jogo que não são do Clip

- **O relógio da jornada:** a brasa na Brasa, o ar no Ar. Começa em 10, perde 2 por noite e o que as falhas custarem.
- **Laços:** gente que você ajudou. Com cinco, o Faroleiro sobe com você.
- **A crônica:** uma frase por cena, no passado, que vira a história da sessão.

## Escrever uma aventura

`aventuras/FORMATO.md` descreve o formato das cenas. Cada aventura é uma pasta com `base.js` (catálogo, abertura,
final, textos), `passados.js`, três atos e um `index.js`; a tradução fica numa subpasta `en/` com os mesmos arquivos.
`node duplo-seis/aventuras/paridade.js ar en` confere que a tradução não mexeu na mecânica.

## Medir a mesa

`node duplo-seis/simular.mjs [sessões] [atento|teimoso|acaso] [brasa|ar]` imprime a tabela de finais por passado.
`node duplo-seis/aventuras/validar.js brasa/ato1.js` confere um arquivo de cenas contra `aventuras/FORMATO.md`.

## Próximos passos

Equilíbrio entre os passados da Brasa (o Espírito junta laços demais para o robô), Antecedentes na ficha livre,
mais cenas por ato, terceira aventura de outro gênero (investigação, horror), espanhol.
