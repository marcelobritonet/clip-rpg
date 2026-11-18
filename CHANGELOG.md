# Novidades

O Clip tem duas linhas de versão: as **regras** (o texto do Sistema Clip, no [README](README.md)) e as **ferramentas** (ficha digital, manual navegável, motor de regras e protótipos de jogo). A versão de cada uma aparece no rodapé das páginas.

## Ficha, manual e motor

### 1.1.0 (18/11/2026)

Dois protótipos de jogo, cada um na sua página, para testar ideias e medir as regras.

- **Arena** (`/arena/`): duelos rápidos com o combate do Clip, contra a IA ou entre dois jogadores no mesmo aparelho. Há builds prontas de 15 pontos e uma montagem livre, e o registro explica cada passo do cálculo.
- **Simulador de equilíbrio** na arena: roda milhares de duelos entre as builds e mostra a taxa de vitória e a duração média, com as variantes de regra em aberto (Resistência, críticos, Sanidade, distância inicial).
- **Travessia** (`/cartas/`): jogo de cartas solo de 7 cenas em que o personagem é montado com cartas de Perícias e Aprimoramentos, liberadas pelos Atributos. O Mestre escolhe desafios no Caminho mais fraco do personagem, e ao final o personagem abre na ficha digital.
- Menu do topo igual em todas as páginas: Manual, Ficha digital, Arena, Cartas e Novidades.
- Os achados de equilíbrio e as dúvidas de regra dos protótipos estão em `arena/NOTAS.md` e `cartas/NOTAS.md`.

### 1.0.0 (16/11/2026)

Primeira versão das ferramentas.

- **Ficha digital**: distribui os Pontos de Evolução e confere as regras na hora (limites de Aprimoramentos e Perícias, pontos gastos, limite de equipamento, Antecedentes). Calcula os Valores Resumidos mostrando a fórmula e controla Vida, Magia e Sanidade.
- **Dicas ao passar o mouse**: cada termo da ficha mostra um resumo do que significa e um link para o trecho do manual. No celular, o primeiro toque mostra a dica.
- **Painel do manual**: cada termo e cada selo "§ regra" abre o trecho exato do manual ao lado da ficha.
- **Mesa de rolagens**: teste (com objeto e insistência), ataque, defesa e magia, já com os valores da ficha.
- **Modo jogador**: Vida, Magia e Sanidade aparecem em palavras, sem números, para desencorajar o meta-jogo.
- **Aprimoramentos propostos** para Mente e Espírito, que podem ser ligados para teste (a decisão está em [PENDENCIAS.md](PENDENCIAS.md)).
- **Manual navegável**: as regras com sumário, busca e um link para cada Atributo, Aprimoramento e regra.
- **Motor de regras** em JavaScript, com testes, usado pela ficha.
- Salva sozinha no navegador, exporta e importa JSON, gera link para compartilhar a ficha e imprime.
- Rodapé com as versões e esta página de novidades.

## Regras do Sistema Clip

### 0.9.3

- Regras para Evolução do Personagem
- Revisão de Texto e ortografia

### 0.9.2

- Nova Perícia Mágica: Ataque Mágico Mental
- Nova Regra: Sanidade
- Nova Regra: Forçar objetos encantados magicamente
- Revisão de Textos

### 0.9.1

- Exemplo de Ficha de Personagem
- Modificação de Regra: Cálculo de Pontos de Vida
- Correção de erros ortográficos
- Revisão de textos explicativos

### 0.9

- Liberação da versão de teste aberto
