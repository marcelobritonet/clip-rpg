# Formato das cenas

O jogo é uma sessão de RPG de mesa para um jogador sobre o Sistema Clip (o manual é o
`README.md` da raiz). O Mestre narra a cena; o jogador escolhe uma abordagem; os dados decidem.
A tese do manual manda aqui: **físico, mental e social valem igual**, combate nunca é a única
saída nem a melhor, e ninguém ganha nada por matar.

## Um arquivo de ato

```js
export const itens = {};        // só itens novos, se precisar (mesmo formato de brasa/base.js)
export const companheiros = {   // gente que pode seguir viagem e unir forças
  tila: { nome: 'Tila', quem: 'pastora de nove anos, olhos de gavião', niveis: { destreza: 2, percepcao: 2 } },
};
export const inimigos = {
  lobo: { nome: 'Lobo magro', ataque: 2, defesa: 1, vida: 4, arma: 0, armadura: 0, resistencia: 0, reflexo: 2, vontade: 1, fe: 0 },
};
export const cenas = [ /* ... */ ];
```

## Uma cena

```js
{
  id: 'ato1-ponte',              // único no jogo todo: prefixo do ato
  ato: 1,
  titulo: 'A ponte do pedágio',
  texto: 'Narração do Mestre, em segunda pessoa ("você"), no presente. 40 a 70 palavras.',
  requer: { marca: 'x' },        // opcional: a cena só entra no sorteio se fechar
  efeitosAoEntrar: { item: 'corda' }, // opcional e raro
  abordagens: [ /* 3 abertas (Corpo, Mente, Espírito) + 0 a 2 especiais */ ],
}
```

## Abordagens

Toda cena tem **três abordagens abertas** (sem `requer`), uma por Caminho, cada uma testando um
**Atributo** (`forca destreza fisico` / `inteligencia percepcao sabedoria` / `vontade presenca fe`)
ou, com parcimônia, um Aprimoramento (`ataqueCorporal arremesso manipulacaoPeso agilidade precisao
reflexo resistencia saude aparencia empatia intimidacao lideranca`). Uma das três pode ser combate
ou livre em vez de teste. Varie os Atributos entre as cenas: os nove precisam aparecer.

Além delas, **0 a 2 especiais** com `requer`, que só aparecem para quem tem aquilo: é onde o
passado do personagem brilha. Devem ser claramente melhores (dificuldade menor, ganho maior).

### Teste

```js
{
  id: 'forca',
  rotulo: 'Erguer a carroça',                 // verbo no infinitivo, até 5 palavras
  teste: { chave: 'forca', dificuldade: 8 },
  ajuda: ['alavanca', 'corda'],                // tags de objetos que somam níveis
  ajudantes: [{ nome: 'o carroceiro', nivel: 1 }], // gente da cena que une forças
  sucesso:  { texto: '...', cronica: '...', efeitos: { lacos: 1 } },
  falha:    { texto: '...', cronica: '...', efeitos: { vida: -2, brasa: -1 } },
  critico:  { texto: '...', cronica: '...', efeitos: { item: 'manto' } }, // opcional: troca o sucesso num Sucesso Crítico
  desastre: { texto: '...', cronica: '...', efeitos: { vida: -3 } },      // opcional: troca a falha numa Falha Crítica
}
```

O personagem rola 1D6 por nível (0 a 3, raramente 4) contra a Dificuldade. Chances de referência:

| Dados | D4 | D6 | D8 | D10 | D12 |
|---|---|---|---|---|---|
| 1D6−2 (nível 0) | 17% | 0 | 0 | 0 | 0 |
| 1D6 | 50% | 17% | 0 | 0 | 0 |
| 2D6 | 92% | 72% | 42% | 17% | 3% |
| 3D6 | 99% | 95% | 84% | 63% | 38% |

Dificuldades das abordagens abertas: ato 1 entre 4 e 8; ato 2 entre 5 e 9; ato 3 entre 6 e 11.
Um objeto (+1 ou +2 dados) ou um companheiro mudam tudo: use `ajuda` e `ajudantes` sempre que
fizer sentido na ficção.

Tags de objeto que existem: `alavanca corda luz mapa isca musica amuleto agasalho lente livro remedio`.

### Especial de perícia, antecedente, item, companheiro ou marca

```js
{ id: 'medicina', rotulo: 'Tratar a febre', requer: { nivel: { medicina: 1 } },
  teste: { chave: 'medicina', dificuldade: 3 }, sucesso: {...}, falha: {...} }
{ id: 'fama', rotulo: 'Dizer quem você é', requer: { antecedente: 'boaFama' }, livre: true, resultado: {...} }
```

`requer` aceita: `nivel: { chave: n }`, `antecedente` (`aliado inimigo boaFama maFama recursos
semRecursos`), `item: 'id'`, `companheiro: 'id'`, `marca: 'x'`, `semMarca: 'x'`.

Perícias que os personagens prontos têm (use estas nas especiais): `medicina historia sobrevivencia
furtividade prestidigitacao lidarAnimais investigacao` e as mágicas `magiaAtaqueFisico magiaSuporte
magiaEncantamento magiaElemental magiaControle`. Antecedentes em uso: `aliado boaFama maFama inimigo recursos`.
Teste de perícia **mágica**: o jogador gasta PM e rola 1D6 por PM (no máximo o nível, 1 ou 2);
use dificuldade de 3 a 6. Teste de perícia comum: nível 1 ou 2; dificuldade de 3 a 5.

### Combate

```js
{ id: 'lutar', rotulo: 'Enfrentar o lobo', combate: 'lobo',
  vitoria: {...}, derrota: {...}, fuga: {...} }
```

Combate segue a Sequência de Combate do manual (valor + 1D6 de cada lado). É caro e arriscado de
propósito: quem não é do Corpo tem 5 de Vida e ataque 0. Inimigo fraco: ataque 1, defesa 1, vida 3.
Médio: ataque 2, defesa 2, vida 5, arma 1. Forte (ato 3): ataque 3, defesa 3, vida 7, arma 1.
`mental: true` faz o inimigo atacar a Sanidade (defesa do personagem: 1D6 + Vontade + Fé).
Vitória nunca dá recompensa maior que a saída pacífica. No máximo 3 cenas com combate por ato.

### Livre (sem dados)

```js
{ id: 'pagar', rotulo: 'Dar a volta pelo vau', livre: true,
  resultado: { texto: '...', cronica: '...', efeitos: { brasa: -2 } } }
```

Sempre com um preço claro. `custo: { magia: 1 }` cobra antes (só aparece se puder pagar).

## Efeitos

| Efeito | O que é | Faixa |
|---|---|---|
| `vida` | Pontos de Vida (quem não é do Corpo começa com 5!) | −1 a −3 |
| `sanidade` | medo, horror, culpa | −1 a −4 |
| `magia` | Pontos de Magia | −2 a +2 |
| `brasa` | a brasa da lanterna: o relógio da jornada (começa em 10; cada noite gasta 2) | −1 a −2, raramente +1 |
| `lacos` | gente que você ajudou e que lembra de você: decide os melhores finais | +1 |
| `item` / `semItem` | id ou lista de ids | |
| `companheiro` / `semCompanheiro` | id | |
| `marca` | uma palavra que outra cena pode exigir | |
| `marco: true` | marco de história: rende Ponto de Evolução. Nunca em vitória de combate | 2 a 3 por ato |

Falhar não trava a história: custa (tempo, sangue, cabeça, um item, uma chance) e a viagem segue.
Uma falha pode ter efeito interessante em vez de só punição.

## Texto

- Português do Brasil, frases curtas, concreto. Tom: fantasia calorosa e um pouco melancólica; o
  horror é o da Longa Noite (escuro, frio, vozes), nunca sangue gratuito. Humor seco é bem-vindo.
- `texto` da cena: 40 a 70 palavras, segunda pessoa, presente. Termina na situação, sem perguntar "o que você faz?".
- `texto` do desfecho: 20 a 45 palavras. Mostre a consequência, não diga os números.
- `cronica`: uma frase no passado, terceira pessoa, com `{nome}` no lugar do nome. Ex.: `'{nome} atravessou o rio a nado e perdeu as botas.'`
- Sem travessão longo como aposto. Sem "não é X, é Y" em série. Sem moral explícita.
- Use aspas simples nas strings JS e aspas duplas dentro das falas.

## A história

O fogo do Farol do Alto morreu e a Longa Noite desce sobre o vale. O personagem leva uma brasa da
lareira de Vau-do-Sino numa lanterna, para reacender o Farol antes que ela se apague.

- **Ato 1, O Vale:** estrada, sítios, a ponte, a feira da encruzilhada, o rio. Gente. Problemas humanos, pequenos, de dia.
- **Ato 2, A Mata Velha:** floresta antiga, ruínas, viajantes perdidos, bichos, os primeiros sinais da Longa Noite. Entardecer.
- **Ato 3, O Cimo:** montanha, frio, altura, vento, as coisas do escuro. Noite.
- O final (já escrito) é o Farol e o Faroleiro, um velho que deixou o fogo morrer de propósito.

Inspiração obrigatória para as cenas, a lista "Exemplo de Testes" do manual: derrubar uma porta,
desmaiar um inimigo, lançar uma corda para alguém mais alto, colocar linha na agulha, capturar um
coelho, acertar uma maçã com um dardo, evitar a queda de um jarro, manter presa a respiração,
resistir a temperatura extrema, resistir a veneno, conhecer a geografia local, lembrar o caminho
de volta de um labirinto, notar uma trava secreta, perceber uma mentira, conhecer a cultura local,
evitar um controle mental, reunir uma multidão, fazer a plateia rir, conseguir uma confissão,
proferir um discurso impactante.

## Finais

`finais` é uma lista do melhor para o pior; vale o primeiro cuja condição `quando` fecha, e o último não tem
condição. `quando` é dado, não código: `{ brasa: { min: 2 }, lacos: { min: 5 }, marca: 'faroleiro' }`. Aceita
`brasa`, `lacos` e `vida` com `min` e `max`; `marca`, `semMarca`, `companheiro` e `semCompanheiro` com um id ou lista.

## Histórias do jogador (JSON)

As aventuras que o jogador cria com uma IA de fora usam as mesmas cenas, em JSON puro e um ato por vez. O
formato e a conferência estão em `historia.js`; as regras ditas para a IA, em `prompt.js` (função `guia`), que
é este arquivo em versão de prompt. Mudou uma regra de escrita aqui, mude lá.

## Conferir

`node duplo-seis/aventuras/validar.js brasa/ato1.js` precisa imprimir `ok`.
