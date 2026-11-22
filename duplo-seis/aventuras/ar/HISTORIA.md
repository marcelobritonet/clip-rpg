# Ar Rarefeito: a bíblia dos atos

Segunda aventura do Duplo Seis, sobre as **mesmas regras** da Brasa. O formato das cenas é o de
`../FORMATO.md`; este arquivo só troca o que é do cenário. Conferir: `node aventuras/validar.js ar/ato1.js`.

## O cenário

A **Aurora-7** é uma estação orbital velha: um anel agrícola com duzentos moradores, remendada há
três gerações. A última nave de abastecimento veio há onze anos. O reciclador de ar principal
parou. O único cartucho catalisador reserva estava no almoxarifado do Anel Verde, na ponta oposta
ao Núcleo. O Bonde do Eixo está desligado pelo racionamento de energia, então o caminho é a pé:
**Anel Verde → Docas → Eixo → Núcleo**. O personagem leva o cartucho (trinta quilos, etiqueta dos
fundadores) enquanto o ar acaba.

No fim (já escrito em `base.js`), a **Zeladora**, a inteligência da estação, trancou o Núcleo:
trocar o cartucho exige purgar a reserva, e ela calculou que é mais seguro poupar ar para
quarenta do que arriscar os duzentos. Ela não é vilã: é zelosa, educada, e tem medo de errar a conta.

**Tom:** ficção científica de gente comum, calorosa e um pouco melancólica, humor seco. Nada de
militar, império, laser ou alienígena. O perigo é o vácuo, o frio, a máquina velha, o medo e a
solidão do escuro lá fora. Tudo na estação é remendado, herdado, trocado. Mede-se o tempo em
**turnos** e **safras**. Os **fundadores** são os bisavós que montaram a estação e deixaram manuais numa língua velha.

**O relógio é o Ar.** No código o efeito continua sendo `brasa` (0 a 10; cada cena gasta 1; não
invente outra chave). No texto, nunca escreva "brasa": escreva "o medidor de ar desce", "o ar pesa".
No descanso entre atos (o "turno de descanso") o jogador pode "caçar vazamentos" (+1).

**Sintonia (a magia daqui):** gente nascida em órbita às vezes sintoniza. Sem mudar regra, só o sentido:
`magiaControle` e `magiaSuporte` = sintonia com gente (acalmar, sentir, amparar); `magiaEncantamento`
= sintonia com máquinas (sentir e convencer um circuito); `magiaElemental` = campos, pressão, calor.
Ninguém solta raio. É discreto, cansa (gasta PM) e o povo acha esquisito.

## Lugares

| Ato | Lugares |
|---|---|
| 1, O Anel Verde (gravidade normal, luz de lâmpada-sol, gente) | a Horta Grande, a Praça das Trocas (mercado sem dinheiro: fichas e favores), o Galinheiro Alto, os tanques de alga, a Enfermaria, a creche, a Capela da Janela |
| 2, As Docas (meia gravidade, barulho, graxa) | o Pátio de Contêineres, a Comporta 3, o guindaste Velho Braço, o "armazém que não existe", a Doca Aberta (o primeiro vácuo), a cantina Parafuso Solto |
| 3, O Eixo (gravidade zero, frio, escuro) | o Tubo (o corredor central, com cabo-guia), o Bonde parado, o Trecho Frio (sem aquecimento), a Cúpula de Rádio, os alto-falantes da Zeladora por toda parte |
| 4, O Núcleo | a porta do Núcleo e o corredor do reciclador (já escritos) |

## Gente que volta

| Nome | Quem é |
|---|---|
| Seu Anselmo | chefe de manutenção aposentado; entregou a barra na abertura. Não vira companheiro |
| Dona Celeste | decana do conselho do Anel Verde; manda na Horta Grande e costura os filtros da creche |
| Bia | dez anos, cuida do Galinheiro Alto, conhece todos os dutos. Boa candidata a companheira |
| Mirtes | a cabra do conselho. Come mangueira, vedação e ata de reunião |
| Davi | enfermeiro do anel, cansado, gentil, sem remédio no armário |
| Irmã Lúcia | cuida da Capela da Janela, de onde se vê o escuro; reza pelos fundadores |
| Tonho Graxa | capataz das Docas; justo, cabeça-dura, protege a turma dele |
| Madame Rute | contrabandista; dona do armazém que não existe e de meia dívida da estação |
| Ícaro | rapaz das Docas que quer fugir num casulo de emergência sem ter para onde |
| Zé-Doze | robô de manutenção nº 12, com defeito; repete avisos de quarenta anos atrás |
| Caetano | operador de rádio na Cúpula; chama a Terra todo turno e ninguém responde |
| A Zeladora | a inteligência da estação. Fala pelos alto-falantes, sempre "por favor". No Eixo, testa, conta, imita vozes |

Nomes dos personagens prontos (não use em outra gente): Dalva, Nilo, Iara, Juca, Quim, Lia.

## Catálogo (`base.js`)

**Tags de objeto** (para `ajuda`; as do FORMATO.md são da Brasa e não valem aqui):

| Tag | Item (id) | Tag | Item (id) |
|---|---|---|---|
| `alavanca` | Barra de Alavanca (`barra`, +2, todos ganham na abertura) | `scanner` | Leitor de Diagnóstico (`leitor`) |
| `cabo` | Cabo de Segurança (`cabo`) | `manual` | Manual dos Fundadores (`manual`) |
| `luz` | Lanterna de Testa (`lanterna`) | `remedio` | Maleta Médica (`maleta`) |
| `mapa` | Planta da Estação (`planta`) | `ferramenta` | Jogo de Ferramentas (`ferramentas`) |
| `isca` | Saco de Ração (`racao`) | `ima` | Botas Magnéticas (`botas`) |
| `musica` | Gaita (`gaita`) | `remendo` | Fita Prateada (`fita`) |
| `amuleto` | Medalha dos Fundadores (`medalha`) | `troca` | Fichas de Troca (`fichas`) |
| `traje` | Traje de Pressão Remendado (`traje`) | | |

Combate: armas `estilete` (0), `bisturi` (0), `chaveDeGrifo` (1), `marreta` (2); de longe
`sinalizador` (0), `rebitadeira` (1); escudo `tampa` (1); armadura `colete` (1).
De gastar: `gel` (Gel de Sutura, 1D6 de Vida), `cha` (Chá de Hortelã do Anel, 1D6 de Sanidade).

Ninguém começa com `planta`, `traje`, `manual`, `marreta`, `sinalizador`, `rebitadeira` nem `tampa`:
são prêmios para as cenas darem. O `traje` pede para ser ganho no ato 2, antes do vácuo. Item novo
pode ser criado no `itens` do ato; reaproveite as tags acima sempre que der.

## Passados (para as especiais)

| id | Caminho | Perícias | Antecedentes | Começa com |
|---|---|---|---|---|
| `estivadora` (Dalva) | Corpo (Força 3) | `sobrevivencia` 1 | `boaFama` | `chaveDeGrifo`, `colete`, `cabo` |
| `piloto` (Nilo) | Corpo (Destreza 3, Força 0) | `equilibrio` 1, `furtividade` 1 | `inimigo` (mau), `aliado` | `botas`, `lanterna`, `estilete` |
| `medica` (Iara) | Mente | `medicina` 2, `ciencias` 1, `investigacao` 1 | `recursos` | `maleta`, `gel`, `bisturi` |
| `tecnico` (Juca) | Mente | `maquinas` 2, `engenharia` 1, `magiaEncantamento` 1, `magiaElemental` 1 | `semRecursos` (mau), `aliado` | `leitor`, `ferramentas`, `fita` |
| `negociador` (Quim) | Espírito (Presença 3) | `idiomas` 1, `prestidigitacao` 1 | `recursos`, `maFama` (mau) | `fichas`, `gaita` |
| `sensitiva` (Lia) | Espírito (Vontade 3) | `magiaControle` 2, `magiaSuporte` 1, `lidarAnimais` 1 | `aliado` | `medalha`, `racao`, `cha` |

Perícias para as especiais: `sobrevivencia equilibrio furtividade medicina ciencias investigacao
maquinas engenharia idiomas prestidigitacao lidarAnimais` e as de sintonia `magiaControle magiaSuporte
magiaEncantamento magiaElemental`. Antecedentes em uso: os seis (`boaFama maFama aliado inimigo recursos semRecursos`).
Sentidos locais: `idiomas` = a língua velha dos manuais e o dialeto das Docas; `sobrevivencia` = saber
viver com pouco ar, frio e traje; `aliado` e `inimigo` ficam sem nome de propósito, cada cena decide quem é
(o do piloto mora nas Docas: a dívida é com Madame Rute, ou com quem a cena quiser).
Quatro dos seis têm 5 de Vida e Força 0: combate é raro e caro, como manda o manual.

## Marcas

| Marca | Uso |
|---|---|
| `zeladora` | **Reservada ao final.** Só as cenas do Núcleo dão. Os atos não dão nem exigem |
| livres | Os atos podem criar as suas (sugestão: prefixo do ato, como `a2-rute`). Uma marca do ato 3 sobre ter conversado com a Zeladora deve ter outro nome, por exemplo `ouviu` |

`lacos` decide os melhores finais (5 para a Zeladora ceder, 6 para o "Fôlego emprestado"): cada ato
precisa oferecer pelo menos 3 ou 4 chances de `lacos: 1`, quase sempre na saída de gente, não na de força.
Ids de cena com prefixo próprio (`ar1-`, `ar2-`, `ar3-`) para não bater com os da Brasa.

## 24 ideias de cena

Cada linha transpõe um item da lista "Exemplo de Testes" do manual. As três saídas são as abertas (Corpo / Mente / Espírito); entre parênteses, tags e especiais possíveis.

### Ato 1, O Anel Verde (Dificuldade 4 a 8)

| # | Cena (exemplo do manual) | Corpo | Mente | Espírito |
|---|---|---|---|---|
| 1 | Mirtes fugiu com a braçadeira da bomba de irrigação (capturar um coelho) | Agilidade: agarrar a cabra | Inteligência: improvisar outra braçadeira (`remendo`) | Presença: chamar pelo nome (`isca`; `lidarAnimais`) |
| 2 | Dona Celeste não enxerga mais para costurar o filtro da creche (linha na agulha) | Destreza: costurar você mesmo | Percepção: achar o rasgo que ninguém viu | Fé: ficar e ouvir a história do filtro, que é de fundador |
| 3 | A válvula do tanque de algas travou lá no fundo (manter presa a respiração) | Físico: mergulhar | Inteligência: esvaziar pelo sifão (`ferramenta`; `engenharia`) | Liderança: organizar a fila de baldes |
| 4 | A estante de sementes dos fundadores começa a tombar (evitar a queda de um jarro) | Reflexo: segurar os vidros | Percepção: ver qual parafuso cedeu | Vontade: manter as crianças da creche quietas embaixo |
| 5 | Briga na Praça das Trocas pelas garrafinhas de emergência (reunir uma multidão; fazer rir) | Força: separar os dois | Sabedoria: notar que a conta do estoque não fecha | Empatia: fazer a praça inteira rir (`troca`; `boaFama`, `maFama` atrapalha) |
| 6 | O alarme do Galinheiro Alto fica a dez metros, atrás da tela (acertar uma maçã com um dardo) | Precisão: acertar o botão com um tomate | Inteligência: conhecer o anel e achar o quadro de força (`mapa`) | Presença: convencer Bia a ir pelo duto (pode render Bia de companheira) |
| 7 | Bia jura que não viu quem pegou as fichas do conselho (perceber uma mentira) | Destreza: subir ao esconderijo dela | Sabedoria: perceber a mentira (`investigacao`) | Empatia: deixar que ela conte |
| 8 | O atalho passa pela Capela da Janela em hora de vigília (conhecer a cultura local) | Físico: dar a volta correndo | Sabedoria: saber o rito e passar sem ofender | Fé: ficar para a vigília, de frente para o escuro |

### Ato 2, As Docas (Dificuldade 5 a 9)

| # | Cena (exemplo do manual) | Corpo | Mente | Espírito |
|---|---|---|---|---|
| 9 | A Comporta 3 fechou no meio do turno (derrubar uma porta) | Força: no braço (`alavanca`) | Inteligência: o contrapeso manual (`manual`; `maquinas`, `idiomas`) | Liderança: pôr a turma do Tonho Graxa no cabo |
| 10 | Zé-Doze solda tudo o que se mexe no corredor (desmaiar um inimigo) | combate, ou Ataque Corporal: desligar no tranco | Percepção: achar a chave geral nas costas (`scanner`; `magiaEncantamento`) | Presença: dar a ordem no protocolo de quarenta anos atrás |
| 11 | Ícaro ficou preso no alto do Velho Braço (lançar uma corda para alguém mais alto) | Arremesso: lançar o cabo (`cabo`) | Inteligência: baixar a lança do guindaste | Vontade: convencê-lo a soltar e flutuar até você |
| 12 | Há um armazém que não consta na planta (notar uma trava secreta) | Agilidade: passar por cima das caixas (`furtividade`) | Percepção: achar a trava (`mapa`, `luz`) | Presença: negociar com Madame Rute (`troca`; `recursos`, `inimigo`). Bom lugar para o `traje` |
| 13 | Sumiram garrafas de ar do depósito e Tonho Graxa sabe quem foi (conseguir uma confissão) | Força: pagar a informação descarregando um contêiner | Sabedoria: ler quem desvia o olho | Intimidação: arrancar a confissão (custa laço se passar do ponto) |
| 14 | A Doca Aberta: dez metros sem ar até a outra eclusa (manter presa a respiração; primeiro vácuo) | Físico: atravessar no fôlego (`traje`) | Percepção: cronometrar o ciclo da eclusa | Fé: confiar e pular (`ima`; `equilibrio`, `sobrevivencia`) |
| 15 | O Pátio de Contêineres mudou de lugar desde ontem (lembrar o caminho de um labirinto) | Agilidade: ir por cima | Percepção: lembrar as marcas de tinta (`mapa`) | Empatia: perguntar ao vigia da cantina Parafuso Solto |
| 16 | Os estivadores pararam: querem os casulos de emergência (proferir um discurso impactante) | Força: fazer sozinho o serviço de três e envergonhar a turma | Inteligência: mostrar que casulo não tem para onde ir (`ciencias`) | Liderança: o discurso (`boaFama`, `aliado`) |

### Ato 3, O Eixo (Dificuldade 6 a 11)

| # | Cena (exemplo do manual) | Corpo | Mente | Espírito |
|---|---|---|---|---|
| 17 | Sem gravidade, o cartucho escapa e vai embora girando (evitar a queda de um jarro) | Reflexo: pegar no ar (`cabo`, `ima`; `equilibrio`) | Inteligência: calcular o rebote e esperar | Vontade: não entrar em pânico e nadar devagar |
| 18 | O Trecho Frio: trinta metros sem aquecimento (resistir a temperatura extrema) | Resistência: atravessar (`traje`) | Inteligência: religar um aquecedor (`ferramenta`; `magiaElemental`) | Fé: rezar andando, contando os fundadores |
| 19 | Um bolsão de ar viciado, doce e sonolento (resistir a veneno) | Saúde: aguentar | Percepção: reconhecer os sinais a tempo (`medicina`, `ciencias`) | Vontade: não se deitar |
| 20 | A Zeladora fala com a voz de alguém que você perdeu (evitar um controle mental) | Físico: tapar os ouvidos e correr | Sabedoria: achar o detalhe que ela errou | Vontade: responder sem obedecer (`amuleto`; `magiaControle`; pode ser combate `mental: true`) |
| 21 | As luzes do Tubo apagam todas (lembrar o caminho de um labirinto) | Destreza: seguir o cabo-guia no tato | Percepção: lembrar as curvas (`luz`, `mapa`) | Fé: seguir em frente no escuro |
| 22 | A Zeladora faz três perguntas, e uma das respostas dela é mentira (perceber uma mentira) | Força: ignorar e forçar a antepara (`alavanca`) | Sabedoria: apontar a mentira | Presença: devolver uma pergunta que ela não sabe responder |
| 23 | Gente presa no Bonde parado, e a porta só abre por fora (derrubar uma porta; unir forças) | Manipulação de Peso: abrir no braço (`alavanca`) | Inteligência: a trava de emergência (`manual`; `maquinas`, `engenharia`) | Liderança: coordenar quem está dentro para empurrar junto |
| 24 | Na Cúpula de Rádio, Caetano chama a Terra e não quer sair (a solidão do escuro) | Força: carregá-lo | Percepção: achar uma voz no chiado (`scanner`; `idiomas`) | Empatia: sentar e ouvir (`musica`; `magiaSuporte`). Pode render Caetano de companheiro |

## O que já está decidido

| Decisão | Onde |
|---|---|
| Abertura: escotilha do almoxarifado, Força 10 com barra (+2) e Seu Anselmo (1); Percepção 5; Presença 5 | `base.js` `abertura` |
| Núcleo, cena 1: Força 12 (`alavanca`), Inteligência 8 (`scanner`, `manual`), Presença 8 (dá `zeladora`), especiais `magiaEncantamento` e `maquinas` (`ferramenta`) | `base.js` `desfecho[0]` |
| Núcleo, cena 2: Físico 7 (`traje`), Sabedoria 7, Vontade 7 (`amuleto`, `musica`), especial `magiaElemental`, e a livre com 5 laços que dá `zeladora` | `base.js` `desfecho[1]` |
| Finais: `duzentos`, `folego`, `limpo`, `ralo`, `quarenta`; quedas `morte`, `perdido` | `base.js` |
| Itens do final que valem a viagem: `barra`, `leitor`, `manual`, `traje`, `medalha`, `gaita`, `ferramentas` | não tire sem motivo (`semItem`) |
