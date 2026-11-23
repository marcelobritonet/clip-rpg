# Duplo Seis

Uma sessão de RPG de mesa para um jogador, em 10 a 15 minutos, sobre o Sistema Clip.
O Mestre narra a cena, o jogador escolhe uma abordagem, os dados rolam.

Jogar: https://marcelobritonet.github.io/clip-rpg/duplo-seis/

A base é o manual (`README.md` da raiz), e só ele. Nenhum arquivo dos outros protótipos é usado:
as regras foram reescritas do zero em `regras.js`, cada função citando a seção do manual.

## Versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.4.0 | 23/11/2026 | **História viva: o jogador cria a aventura com uma IA de fora.** Formulário guiado e ficha livre viram um pedido completo; a IA devolve o núcleo e o ato 1 em JSON, que se cola no jogo. A cada pausa o jogo monta o pedido da sequência com a crônica, as escolhas e o estado do personagem, e o ato seguinte (e por fim o final) nasce disso. Conferência do que foi colado com pedido de conserto, exportar e importar `.json`. Ao colar, o robô joga o trecho e avisa se o equilíbrio saiu da faixa. Quem chega a um final pode pedir o capítulo seguinte, levando ficha, marcas e companheiros. Os finais das três aventuras da casa passaram de função a condição declarada, sem mudar resultado. Detalhes na seção "História viva" |
| 0.3.0 | 22/11/2026 | **Terceira aventura e as duas primeiras revistas.** "O Sino Afogado", horror de interior nos anos 1950, só em português: um sino toca no lago seco e quem ouve dormindo esquece o nome; a vela da última missa é o relógio. Abertura, 36 cenas, duas cenas na torre, cinco finais, seis passados e cinco cenários desenhados. A Brasa e o Ar passam a ter 12 cenas por ato (18 novas, só em português), com uma revisão de continuidade dos textos (15 correções). Equilíbrio refeito, robô atento, final de 3 estrelas: Brasa de 32% a 58%, Ar de 33% a 54% (o Piloto subiu de 16% para 36%), Sino de 32% a 57%. Em inglês, o que ainda não foi traduzido aparece em português (PENDENCIAS 8.11). |
| 0.2.1 | 21/11/2026 | **Polimento.** "Como se joga" na tela inicial, Antecedentes na ficha livre (pontos pelo menor Caminho, como no manual), vibração nos dados, tremor de tela na falha e clarão no duplo seis, atalhos de teclado (1 a 9, Enter, F), título "Double Six" em inglês. Ficou por fazer: revisão de continuidade dos textos das duas aventuras e equilíbrio entre os passados da Brasa. |
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

`aventuras/FORMATO.md` descreve o formato das cenas das aventuras da casa (as do jogador seguem a seção
"História viva"). Cada aventura é uma pasta com `base.js` (catálogo, abertura,
final, textos), `passados.js`, três atos e um `index.js`; a tradução fica numa subpasta `en/` com os mesmos arquivos.
`node duplo-seis/aventuras/paridade.js ar en` confere que a tradução não mexeu na mecânica.

## História viva (22/11/2026, 8.13)

O jogador cria a aventura com uma IA de fora, um ato por vez, e o que o personagem faz muda o que vem depois.

| Tópico | Como ficou |
|---|---|
| Fluxo | Formulário guiado → ficha livre → pedido inicial → colar o núcleo e o ato 1 → jogar → em cada pausa, pedido da sequência → colar → ... → pedido do final. Quatro idas à IA por história |
| Formato | JSON puro, dois documentos: `duplo-seis/historia@1` (núcleo, abertura e ato 1; é também o arquivo exportado) e `duplo-seis/sequencia@1` (ato 2, ato 3 ou o final). Descritos em `aventuras/historia.js` |
| Memória | O pedido da sequência leva a crônica, cada escolha com o resultado, a ficha como está, Vida, Sanidade, Magia, relógio, laços, marcas, itens, companheiros que seguem e os que ficaram pelo caminho (`e.perdidos`), e o `rumo` |
| `rumo` | Segredo do Mestre que a IA escreve e o jogador não lê: volta em todo pedido e a IA o atualiza a cada ato |
| Ordem | As 4 cenas de um ato entram na ordem escrita (`ordem: 'escrita'`), sem sorteio. Cena de história não leva `requer`; as abordagens levam |
| Personagem | Só a ficha livre, feita antes; a IA escolhe até 3 itens iniciais. A ficha do criador vira o passado da história |
| Finais | Condição declarada como dados (`fechaFinal` em `jogo.js`): `brasa`, `lacos`, `vida` com `min`/`max`; `marca`, `semMarca`, `companheiro`, `semCompanheiro`. As três da casa foram convertidas e o simulador deu números idênticos |
| Quedas | Vêm no núcleo, não no final: o personagem pode morrer antes de o final existir |
| Conferência | `validarHistoria` e `validarSequencia` reusam `validarCenas` e somam forma, faixas de efeito (uma IA mão-pesada não mata numa cena), ids, marcas que ninguém concede, paisagens e finais. Erro vira "pedido de conserto" para colar na mesma conversa |
| Segurança | Nada colado é código nem HTML: só dados, escritos na tela como texto. Ids fora do padrão são recusados |
| Idioma | O pedido é sempre em português e manda a IA escrever no idioma da mesa |
| Depois do fim | A história completa é uma aventura comum: dá para jogar de novo, exportar e importar |

Conferir: `test/duplo-seis-historia.test.js` joga uma história de mentira (`test/duplo-seis-historia-exemplo.js`)
do núcleo ao final. `node test/duplo-seis-historia-exemplo.js <pasta>` grava os quatro JSON para colar à mão.

### Primeiro teste com IA (22/11/2026)

O Claude respondeu aos quatro pedidos de verdade (formulário e ficha do exemplo), no papel da IA de fora. Ressalva:
foi a mesma IA que escreveu o pedido e a conferência, então o teste é generoso. Falta repetir no ChatGPT e no Gemini.

| O quê | Resultado |
|---|---|
| Tamanho | Pedidos de 16 a 19 mil letras; respostas de 10 a 19 mil (a maior é o núcleo com o ato 1). Coube sem cortar |
| Conferência | Núcleo, ato 2 e ato 3 passaram de primeira. O final voltou com 2 erros |
| Erro 1 | `brasa: -3` numa falha, fora da faixa. A conferência pegou e o conserto resolveu |
| Erro 2 | `requer.marca` com lista, que só os finais aceitavam. Era defeito do jogo: `requer` agora aceita lista em item, companheiro e marca |
| História viva | Encadeou: a banda acordada no coreto (ato 1) virou o mutirão do armazém (ato 2), que convenceu o banco na ponte e tocou a valsa para o pai na torre (ato 3); a promessa feita a Nico foi cobrada na porta da torre e no sino |
| Equilíbrio | Fácil demais. Rejogada 300 vezes, o robô atento tira 3 estrelas em 100% e não falha nunca; o que joga ao acaso falha 51% e tira 3 estrelas em 2%. A IA pôs uma especial sem dados ou quase certa em toda cena |
| Ajustes no pedido | No máximo uma especial livre por ato; cada marca vai com a frase da crônica que a concedeu (uma IA em conversa nova só via a palavra) |

A história que saiu está em `aventuras/exemplos/as-tres-da-tarde.json`: dá para importar no jogo e jogar.

### Medir ao colar (23/11/2026, 8.16)

A conferência garante a forma, não o equilíbrio. Ao colar, `aventuras/medir.js` põe o robô atento para jogar o
trecho novo 120 vezes, a partir da sessão do jogador (mesmo personagem, outros dados), numa cópia: a história e a
sessão só mudam se ele seguir.

| Aviso | Quando | Faixa das aventuras da casa |
|---|---|---|
| Fácil demais / difícil demais | Escolhas que dão certo acima de 90% ou abaixo de 50% | 70% a 83% |
| Perigoso | Morte ou loucura em 20% ou mais das vezes dentro do trecho | 0% a 6% na sessão inteira |
| Pouco dado | Mais da metade das escolhas do robô foi sem dados | |
| Melhor final garantido / fora de alcance | 3 estrelas acima de 80% ou abaixo de 8% (só ao colar o final) | 32% a 58% |

O robô atento escolhe pela chance, não pela história. Um final que pede a escolha pior nos dados ele nunca vê; por
isso, antes de dizer "fora de alcance", o medidor joga também ao acaso e fica com o melhor dos dois.

Com aviso, o jogador copia um **pedido de ajuste** (só Dificuldades, efeitos e condições dos finais; a história não
muda) ou segue assim mesmo. A medida é conselho: se ela falhar, a história segue.

O pedido à IA também mudou. As faixas fixas por ato ("ato 1 entre 4 e 8") davam certo para as fichas da casa e
ficavam fáceis para um personagem que evolui. Agora a IA recebe os dados que ele rola em cada Atributo e uma
tabela: folgado (85%), justo (65%) e apertado (40%) para 1 a 6 dados. Abertas do Caminho forte: justo no ato 1,
apertado no ato 3; especiais: folgado, nunca certeza; no máximo uma especial livre por ato.

Conferido reescrevendo as Dificuldades do exemplo pela tabela, sem mexer no texto:

| Trecho | Como a IA escreveu | Pela tabela |
|---|---|---|
| Ato 1 | 100% | 87% |
| Ato 2 | 100% (75% sem dados) | 92% a 95%: ainda fácil, por ter três especiais livres, o que o pedido novo proíbe |
| Ato 3 | 100% | 65% a 82% |
| Final | 100%, 3 estrelas garantidas | 63% a 85%; 3 estrelas fora de alcance para o robô atento, que prefere arrancar a aliança |

Falta ver se uma IA de verdade segue a tabela (8.17).

### Capítulo seguinte (23/11/2026, 8.14)

Quem chega a um final pode pedir outro capítulo: uma história nova, com o mesmo personagem, que parte dali.
Quem morre ou perde a cabeça no caminho não segue.

| Tópico | Como ficou |
|---|---|
| O que ele leva | A ficha evoluída, as marcas (cada uma com a frase da crônica que a concedeu) e os companheiros que estão com ele |
| O que recomeça | Laços, Vida, Sanidade, Magia e o relógio. Os itens a IA escolhe de novo, sabendo o que ele tinha |
| O pedido | Leva o resumo, o segredo e a crônica do capítulo anterior, o final alcançado, o que ele traz e uma linha opcional do jogador sobre o que quer |
| No jogo | O fim fica guardado na história (`ultimoFim`), então o capítulo pode nascer depois: botão na tela de fim e na tela inicial |
| No motor | O passado da história nova traz `marcas` e `companheiros`, que `J.nova` põe na sessão; `pontos` guarda quanto a ficha já vale, para a importação aceitar mais de 12 |
| Arquivo | O capítulo exporta e importa com a herança e com `anterior` (nome, resumo, final e crônica do capítulo de onde veio) |

Limite conhecido: o capítulo 3 só conhece o capítulo 2. A crônica do capítulo 1 não segue adiante, só as marcas.

## Medir a mesa

`node duplo-seis/simular.mjs [sessões] [atento|teimoso|acaso] [brasa|ar]` imprime a tabela de finais por passado.
`node duplo-seis/aventuras/validar.js brasa/ato1.js` confere um arquivo de cenas contra `aventuras/FORMATO.md`.

### Equilíbrio dos passados da Brasa (22/11/2026, ainda sem versão publicada)

O Espírito juntava laços demais: a Presença abria a porta do Farol e ainda rendia um laço, e a fama
rendia outro sem ajudar ninguém. Quatro mudanças, só em efeitos (texto intocado), espelhadas em `en/`:

| Cena | Saída | Antes | Agora | Por quê |
|---|---|---|---|---|
| A porta do Farol | Falar com o Faroleiro | Faroleiro e +1 laço | Só o Faroleiro | O Faroleiro já é a recompensa; o laço contava em dobro |
| A balsa | Fama (livre) | +1 laço e corda | Só a corda | Laço é gente que você ajudou; ali é a fama que ajuda você |
| A mesa na clareira | Servir sem derramar | Manto | Manto e +1 laço | Era a única saída bem-sucedida da cena sem laço |
| O ganso do poço | Vitória no combate | Nada | +1 laço | A família volta ao poço; vale o mesmo que a saída pacífica, como manda o FORMATO |

Final de 3 estrelas, robô atento:

| Passado | Antes (400) | Agora (400) | Agora (1500) | Teimoso antes | Teimoso agora |
|---|---|---|---|---|---|
| A Desertora | 21% | 37% | 38% | 18% | 32% |
| O Caçador | 33% | 44% | 48% | 34% | 46% |
| A Boticária | 45% | 45% | 45% | 43% | 43% |
| O Aprendiz | 54% | 54% | 56% | 51% | 51% |
| O Menestrel | 82% | 52% | 54% | 75% | 39% |
| A Peregrina | 73% | 53% | 55% | 70% | 55% |

Alvo era todos entre 30% e 60%. Média de estrelas ficou entre 1,95 e 2,53 (antes 1,73 a 2,74).
O robô ao acaso continua quase sempre em "Cinza".

### Continuidade dos textos (22/11/2026, só pt)

As cenas de cada ato saem sorteadas (4 de 9 na época; agora 4 de 12), então nenhuma pode supor outra. Corrigido só em português; o
inglês ainda tem a versão antiga destes trechos (pendência 8.11 do `PENDENCIAS.md`).

| Aventura | Cena | Problema | Correção |
|---|---|---|---|
| Brasa | A ponte do pedágio | Cruzava o mesmo rio da balsa; com as duas na sessão, o rio era atravessado duas vezes | A ponte agora é sobre um ribeirão |
| Brasa | Três caminhos e um carroceiro | Encruzilhada vazia, enquanto outras cenas põem a feira na encruzilhada | "Longe da feira", outra bifurcação |
| Brasa | A picada | A saída de Medicina falava da "folha prateada" que só a saída da Inteligência apresenta | A folha é apresentada na própria saída |
| Brasa | O homem na neve | Levava Brás "ao refúgio"; se o refúgio tinha esvaziado antes, não fazia sentido | Leva à cabana do irmão dele |
| Brasa | O refúgio dos pastores | Os pastores choravam Brás perdido, mesmo que você já o tivesse salvado | O perdido é Zé, neto de Jacinta |
| Brasa | Os lobos brancos | Na derrota, vocês "descem a montanha"; na especial, a alcateia segue "até o refúgio" | Saem do platô; seguem até a próxima dobra |
| Brasa | A vigília da capela | Irmã Anselma, nome quase igual ao do ganso Anselmo | Irmã Inácia |
| Ar | A escotilha (abertura) | A Zeladora aparecia no ato 3 sem nunca ter sido apresentada | Apresentada na abertura |
| Ar | O alarme do Galinheiro Alto | A saída "Pedir a Bia o duto" supunha Bia conhecida | A cena apresenta Bia |
| Ar | As fichas do conselho | Citava Dona Celeste, que só aparece na creche | A conselheira de turno |
| Ar | Comporta 3, garrafas, casulos | Tonho Graxa aparecia sem apresentação em duas delas | "o chefe dos estivadores" em cada uma |
| Ar | O armazém que não existe | "A planta marca" supunha ter o item Planta | "Nas plantas antigas da estação" |
| Ar | A Doca Aberta | "Primeira vez sem vidro" contradizia quem anda por fora do casco | Frase trocada |
| Ar | O Trecho Frio | 42 fundadores, contra os mais de 160 nomes lidos na capela | Mais de duzentos |
| Ar | A voz emprestada | Citava "a janela da capela", que pode não ter aparecido | "o lado de fora sem vidro" |

### Doze cenas por ato (22/11/2026, só pt)

Três cenas novas por ato em cada aventura, 18 ao todo, só em português. O inglês segue com as 9 antigas
por ato até a pendência 8.11; `paridade.js` aceita cena que só existe no original e lista as que faltam.

| Aventura | Ato | Cenas novas |
|---|---|---|
| Brasa | 1, O Vale | A pipa no campanário · A forja fria (a brasa acende a forja e não diminui) · A carta molhada |
| Brasa | 2, A Mata Velha | A barqueira do Rio Escuro (a travessia custa uma história verdadeira) · A última página · A caieira |
| Brasa | 3, O Cimo | Os que subiram antes (lanternas de quem tentou; o Faroleiro também subiu um dia) · O sino do passo · A que desceu |
| Ar | 1, O Anel Verde | A colmeia da estufa · O voluntário · A festa suspensa |
| Ar | 2, As Docas | A última nave · A queda de braço · A gata no ejetor |
| Ar | 3, O Eixo | O jardim do Eixo · Fogo sem peso · Os primeiros dias (o diário da Zeladora) |

Prêmios que faltavam: a Lente de Vidro da Brasa e o Manual dos Fundadores do Ar só eram usados em `ajuda`,
nunca dados; agora a última página e a última nave os dão.

Equilíbrio depois das cenas novas (robô atento, 1500 sessões, final de 3 estrelas). Na Brasa, a primeira versão
passou de 70% para três passados; tirei os laços da forja e da caieira (viraram itens e brasa) e da lamparina
da Rosa, que o Aprendiz já traz de casa.

| Brasa | Antes | Agora | | Ar | Antes | Agora |
|---|---|---|---|---|---|---|
| A Desertora | 38% | 32% | | A Estivadora | 32% | 38% |
| O Caçador | 48% | 42% | | O Piloto de Rebocador | 15% | 16% |
| A Boticária | 45% | 46% | | A Médica do Anel | 21% | 33% |
| O Aprendiz | 56% | 52% | | O Técnico de Sistemas | 35% | 41% |
| O Menestrel | 54% | 51% | | O Negociador do Mercado | 49% | 54% |
| A Peregrina | 55% | 58% | | A Sensitiva | 57% | 53% |

O Piloto do Ar continua bem abaixo dos outros (16%); não era parte da 8.2, que tratava só da Brasa.

## O Piloto do Ar (22/11/2026, 8.12)

O Piloto de Rebocador chegava ao final de 3 estrelas do Ar em 16% das sessões (robô atento), contra 33% a 54% dos outros. O motivo: as abordagens especiais a que ele tem acesso somavam 2 laços no total, contra 4 a 9 dos outros passados, e nenhum dos itens dele (botas, lanterna, estilete) abria coisa nenhuma. Como o final "duzentos" pede 5 laços, ele parava no "Ar limpo".

| Cena | Mudança |
|---|---|
| ar1-galinheiro, viga dos poleiros (`equilibrio`) | Bia vê a travessia da porta; +1 laço |
| ar2-andorinha, nova especial `inimigo` (livre) | Ele confessa a Dona Ester a quem deve; ela também deve à mesma pessoa e abre a cabine. +1 laço, −1 Sanidade. É a primeira cena que usa o `inimigo` do Ar |
| ar3-apagao, nova especial `lanterna` (livre) | O facho acha um menino perdido no escuro, Dico; +1 laço. Quem pegou a lanterna nos tanques de alga também usa |

| Robô | Piloto antes | Piloto depois |
|---|---|---|
| atento | 16% | 36% |
| teimoso | — | 34% |

Os outros cinco passados ficaram com os mesmos números. O inglês recebeu as mudanças da viga e do apagão (cenas que já existiam lá); a Andorinha ainda não foi traduzida (8.11).

## O Sino Afogado (22/11/2026, 8.7, só pt)

Terceira aventura, de horror com investigação, para a Sanidade pesar. A represa afogou a velha
Pedra-Funda há trinta anos; na seca, a torre da igreja reaparece e um sino toca de madrugada. Quem
ouve dormindo desce até a água e acorda sem o próprio nome. O personagem desce com a vela da última
missa, que é o relógio (por dentro, o mesmo efeito `brasa`). A verdade, que só o final conta: Damião,
o sineiro, não quis sair da torre, e a vila combinou nunca mais dizer o nome dele.

| Peça | Como ficou |
|---|---|
| Atos | 1. A Vila Nova · 2. A Margem · 3. A Cidade Afogada · Torre (2 cenas fixas) |
| Investigação | A marca `retrato` (a chapa de vidro, a carta, o livro de tombo, o caderno do barqueiro, a gaveta do sineiro...) abre na porta da torre a saída que dá `damiao`, o nome. Sem ela, o nome vem perguntando com educação ou com 5 laços na subida |
| Finais | `nome` (3★: vela ≥ 2, nome e 5 laços), `acordado` (3★: vela 0 e 6 laços), `silencio` (2★), `madrugada` (1★), `agua` (0★); quedas `morte` e `perdido` |
| Companheiros | Tião, o menino surdo que não ouve o sino (ato 1, ou no ato 3 se não veio antes) e Luzia, a pescadora (ato 2) |
| Cenários | `oratorio`, `vilanova`, `margem`, `afogada`, `torre` em `cenario.js` |
| Inglês | Sem tradução (8.11). A lista em inglês mostra a aventura em português, como a interface já previa. O teste de paridade pula aventura sem tradução |

Equilíbrio, robô atento, 1500 sessões por passado (final de 3 estrelas):

| Passado | 1ª versão | Final |
|---|---|---|
| Barqueiro | 44% | 50% |
| Trapezista | 12% | 32% |
| Professora | 27% | 50% |
| Farmacêutico | 17% | 52% |
| Locutor | 53% | 57% |
| Benzedeira | 26% | 37% |

O que subiu os de baixo foi o mesmo da 8.12: dar uso aos antecedentes que nenhuma cena pedia
(`aliado` na banda, no cavalo e na roda; `semRecursos` no mascate), laço na saída de Mente de três
cenas de gente (padre, engenheiro, comporta) e especiais da Trapezista e da Benzedeira (a bala na
orelha de Marina, a crista da barragem, benzer a tristeza de Dona Cândida por 1 PM).

Ressalva: como nas outras aventuras, o robô quase nunca chega à queda `perdido`. A Sanidade cai
mais aqui (muitas falhas custam 2 a 4), mas ainda não derruba ninguém nas simulações. Vale o seu
teste de mão (8.3) para dizer se o medo pesa o bastante.

## Próximos passos

Estão no `PENDENCIAS.md`, seção 8.
