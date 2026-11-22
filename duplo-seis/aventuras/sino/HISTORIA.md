# O Sino Afogado: a bíblia dos atos

Terceira aventura do Duplo Seis, sobre as **mesmas regras** da Brasa e do Ar. O formato das cenas
é o de `../FORMATO.md`; este arquivo só troca o que é do cenário. Só em português por enquanto
(a tradução está na pendência 8.11). Conferir: `node aventuras/validar.js sino/ato1.js`.

## O cenário

Interior do Brasil, anos 1950. Há trinta anos a represa da companhia de força encheu o vale e
afogou a velha **Pedra-Funda**: casas, igreja, cemitério de cima. O povo mudou para a **Vila Nova
da Represa**, no morro, com indenização pequena e promessa grande. O sino da igreja velha foi
tirado antes da enchente e está na torre da igreja nova.

Este ano veio a seca grande. O lago baixou, e a torre da igreja velha apareceu no meio da lama.
Há três madrugadas um sino toca lá embaixo. Quem ouve dormindo levanta, desce o morro de olhos
abertos e entra na água até a cintura. Os que são puxados de volta acordam sem saber o próprio
nome. Já são onze.

**Dona Sinhá**, a benzedeira mais velha da vila, guardou a vela de cera da última missa da Pedra-Funda.
Enquanto ela estiver acesa na sua mão, o sono não pega você. Alguém precisa descer até a torre e
descobrir quem toca. Esse alguém é você.

**A verdade (só o final conta inteira):** Damião, o sineiro, não quis sair. Disse que sineiro não
abandona sino. A companhia encheu o lago assim mesmo, e a vila combinou, sem nunca dizer em voz alta,
que ninguém mais ia falar dele. O sino que toca é o pequeno, o de chamar para enterro, que Damião
levou para a torre e ninguém foi buscar. Ele não quer vingança. Quer o nome de volta. Por isso quem
ouve perde o seu.

**Tom:** horror de interior, quieto, de lampião e reza. Neblina, lama, água parada, voz que chama
do escuro, gente que dorme de olho aberto. Nada de sangue, monstro nem demônio. O medo é de esquecer
e de ser esquecido. Calor humano, café ralo, humor seco de quem já viu muita coisa. A Sanidade pesa
mais que a Vida: falhar custa cabeça com frequência.

**O relógio é a vela.** No código o efeito continua sendo `brasa` (0 a 10; cada cena gasta 1; não
invente outra chave). No texto, nunca escreva "brasa": escreva "a vela encurta", "a chama baixa", "o
pavio". No descanso entre atos o jogador pode "abrigar a vela" (+2).

**Benzeção (a magia daqui):** sem mudar regra, só o sentido. `magiaControle` = tirar quebranto,
acalmar, segurar alguém acordado; `magiaSuporte` = amparar, curar com reza e erva;
`magiaEncantamento` = simpatia com objeto (fita, chave, sino); `magiaElemental` = água e fogo
(a chama da vela, a lama, a neblina). É discreto e cansa. Metade da vila acredita, a outra metade
manda chamar escondido.

## Lugares

| Ato | Lugares |
|---|---|
| 1, A Vila Nova (anoitecer, gente acordada à força) | a igreja nova e o sino grande, a venda do Seu Brás, a casa do fotógrafo, a agência do correio, a escola, a pensão, a delegacia, o coreto |
| 2, A Margem (noite, lama rachada, eucaliptos) | a estrada que desce o morro, a casa de máquinas da represa, o cemitério que não mudou, os barcos encalhados, o rancho da Luzia pescadora, a ponte velha que reapareceu |
| 3, A Cidade Afogada (madrugada, neblina, ruas de lama) | a rua do comércio sem telhado, a escola velha, a casa do sineiro, o coreto submerso, a praça, a sacristia |
| 4, A Torre | a porta da igreja afogada e a subida ao sino (já escritas) |

## Gente que volta

| Nome | Quem é |
|---|---|
| Dona Sinhá | benzedeira, noventa anos, deu a vela na abertura. Não vira companheira |
| Padre Olavo | padre novo, chegou depois da enchente, não acredita em nada disso e está com medo |
| Tião | onze anos, surdo, fala por sinais. É o único que não ouve o sino. Bom companheiro |
| Seu Brás | dono da venda, sabe o fiado e o segredo de todo mundo |
| Dona Zica | da agência do correio; leu as cartas da vila inteira sem querer, trinta anos |
| Seu Bené | fotógrafo velho, tem as chapas de vidro da Pedra-Funda |
| Engenheiro Moura | aposentado da companhia, mora sozinho na casa de máquinas. Assinou a ordem de encher |
| Luzia | pescadora da represa, conhece cada torre e telhado debaixo d'água |
| Os que dormem | onze, entre eles Seu Juvenal, a professora Nair e o menino Dinho. Andam de olho aberto |
| Damião | o sineiro. Ninguém diz o nome. É a resposta |

Nomes dos personagens prontos (não use em outra gente): Bento, Estela, Celina, Otávio, Odair, Rosário.

## Catálogo (`base.js`)

**Tags de objeto** (para `ajuda`):

| Tag | Item (id) | Tag | Item (id) |
|---|---|---|---|
| `fogo` | Caixa de Fósforos (`fosforos`, todos ganham na abertura) | `musica` | Violão (`violao`) |
| `luz` | Lampião (`lampiao`), Lanterna de Pilha (`lanterna`) | `amuleto` | Terço da Avó (`terco`) |
| `corda` | Corda de Sisal (`corda`) | `remedio` | Maleta da Farmácia (`maleta`) |
| `alavanca` | Pé de Cabra (`pe`) | `livro` | Caderno de Chamada (`caderno`), Livro de Tombo (`tombo`) |
| `mapa` | Planta da Pedra-Funda (`planta`) | `lente` | Lupa (`lupa`) |
| `isca` | Bornal de Milho (`milho`) | `barco` | Canoa da Luzia (`canoa`) |

Combate (raro; aqui quase ninguém é inimigo): armas `canivete` (0), `remo` (1), `facao` (2); armadura
`capa` (1). De gastar: `unguento` (1D6 de Vida), `cha` e `xarope` (1D6 de Sanidade).

Ninguém começa com `pe`, `planta`, `tombo`, `canoa` nem `facao`: são prêmios.

## Passados

| id | Caminho | Perícias | Antecedentes | Começa com |
|---|---|---|---|---|
| `barqueiro` (Bento) | Corpo (Força 3) | `sobrevivencia` 1 | `boaFama` | `remo`, `capa`, `lampiao` |
| `trapezista` (Estela) | Corpo (Destreza 3) | `equilibrio` 1, `prestidigitacao` 1 | `inimigo` (mau), `aliado` | `corda`, `lanterna`, `canivete` |
| `professora` (Celina) | Mente | `historia` 2, `investigacao` 1, `idiomas` 1 | `recursos` | `caderno`, `lanterna`, `cha` |
| `farmaceutico` (Otávio) | Mente | `medicina` 2, `ciencias` 1, `historia` 1, `magiaElemental` 1 | `semRecursos` (mau), `aliado` | `maleta`, `lupa`, `xarope` |
| `radialista` (Odair) | Espírito (Presença 3) | `historia` 1, `prestidigitacao` 1 | `recursos`, `maFama` (mau) | `violao`, `lampiao` |
| `benzedeira` (Rosário) | Espírito (Vontade 3) | `magiaControle` 2, `magiaSuporte` 1, `lidarAnimais` 1 | `aliado` | `terco`, `milho`, `cha` |

## Marcas

| Marca | Uso |
|---|---|
| `damiao` | **Reservada ao final.** Só as cenas da torre dão: é saber o nome |
| `retrato` | Dada por cenas dos atos em que você acha um rastro do sineiro (a foto, a carta, o livro de tombo). Abre uma livre na porta da torre que dá `damiao` |
| livres | Prefixo do ato, como `s2-moura` |

`lacos` decide os melhores finais (5 para o nome ser dito por muitos, 6 para "Acordado por eles"):
cada ato oferece de 3 a 5 chances de `lacos: 1`, quase sempre na saída de gente.
Ids de cena com prefixo `s1-`, `s2-`, `s3-`.

## O que já está decidido

| Decisão | Onde |
|---|---|
| Abertura: a casa de Dona Sinhá; todos ganham `fosforos` | `base.js` `abertura` |
| Torre, cena 1: a porta da igreja afogada; Presença/Sabedoria dão `damiao`; livre com `retrato` dá `damiao` | `base.js` `desfecho[0]` |
| Torre, cena 2: o sino; Vontade, Sabedoria e Físico pesados de Sanidade; livre com 5 laços dá `damiao` | `base.js` `desfecho[1]` |
| Finais: `nome`, `acordado`, `silencio`, `madrugada`, `agua`; quedas `morte`, `perdido` | `base.js` |
