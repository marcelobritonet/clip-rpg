/**
 * Simulador da Travessia: um robô guloso joga N partidas por origem e mostra
 * vitórias, derrotas, Renome médio e quanto se perde em testes e conflitos.
 * Serve para medir o efeito de mudar um número em `JOGO` ou nos desafios.
 *
 *   node cartas/simular.mjs [partidas]
 *
 * O robô joga toda carta que puder, treina o Atributo mais baixo do Caminho
 * mais fraco, escolhe a abordagem com mais dados e, no conflito, a frente com
 * maior vantagem. Foge (ou defende, no final) quando a Vida ou a Sanidade
 * chega a 3. Uma pessoa que monta o personagem com intenção vai melhor.
 */
import * as J from './jogo.js';
import { CAMINHOS, nivelDe, valoresCaminhos } from '../motor/clip.js';

const N = Number(process.argv[2] ?? 2000);

function partida(origem, m) {
  const e = J.novoJogo({ origem });
  while (e.fase !== 'fim') {
    if (e.fase === 'preparo') {
      let jogou = true;
      while (jogou) {
        jogou = false;
        for (const c of [...e.mao]) {
          if (c.tipo === 'momento' && (c.alvo === 'folego' || c.alvo === 'prece')) continue;
          if (J.podeJogar(e, c).ok) { J.jogarCarta(e, c.uid); jogou = true; }
        }
        const vc = valoresCaminhos(e.ficha);
        const fraco = Object.entries(vc).sort((a, b) => a[1] - b[1])[0][0];
        const at = [...CAMINHOS.find((c) => c.id === fraco).atributos].sort((a, b) => nivelDe(e.ficha, a) - nivelDe(e.ficha, b))[0];
        if (J.podeTreinar(e, at).ok) { J.treinar(e, at); jogou = true; }
      }
      J.enfrentar(e);
    } else if (e.fase === 'teste') {
      const valor = (a) => (a.nivel + a.objeto) * 3.5 - a.dificuldade;
      const ab = J.abordagens(e).sort((a, b) => valor(b) - valor(a))[0];
      const antes = e.vida + e.sanidade;
      const r = J.resolverTeste(e, { abordagem: ab.id, insistir: !!ab.insistir && e.vida > 6 });
      m.testes++; if (r.teste.sucesso) m.sucessos++; m.perdaTestes += antes - e.vida - e.sanidade;
    } else if (e.fase === 'conflito') {
      for (const c of [...e.mao]) if (c.tipo === 'momento' && J.podeJogar(e, c).ok && (e.vida < 4 || e.sanidade < 4)) J.jogarCarta(e, c.uid);
      const fr = J.frentes(e.ficha);
      const op = e.conflito.oponente;
      const vantagem = (k) => fr[k].ataque + fr[k].arma - op.defesa[k];
      const melhor = Object.keys(fr).sort((a, b) => vantagem(b) - vantagem(a))[0];
      let acao = melhor;
      if (e.vida <= 3 || e.sanidade <= 3) acao = e.desafio.final || e.conflito.rodada >= 2 ? 'defender' : 'fugir';
      else if (!e.conflito.analisado && e.conflito.rodada === 0 && nivelDe(e.ficha, 'percepcao') >= 2) acao = 'analisar';
      if (acao in m.frentes) m.frentes[acao]++;
      const antes = e.vida + e.sanidade;
      J.agir(e, acao);
      m.perdaConflitos += antes - e.vida - e.sanidade;
      if (e.fase !== 'conflito') { m.conflitos++; if (e.resultado.fim === 'vitoria') m.vitoriasConflito++; }
    } else {
      for (const c of [...e.mao]) if (c.tipo === 'momento' && J.podeJogar(e, c).ok) J.jogarCarta(e, c.uid);
      J.continuar(e);
    }
  }
  return e;
}

const pct = (a, b) => `${Math.round((100 * a) / Math.max(1, b))}%`;
const linhas = [];
for (const origem of Object.keys(J.ORIGENS)) {
  const m = { testes: 0, sucessos: 0, perdaTestes: 0, conflitos: 0, vitoriasConflito: 0, perdaConflitos: 0, frentes: { fisico: 0, palavra: 0, fe: 0 } };
  const fins = { vitoria: 0, parcial: 0, derrota: 0 };
  let renome = 0;
  for (let i = 0; i < N; i++) {
    const e = partida(origem, m);
    fins[e.fim.tipo]++;
    renome += e.renome;
  }
  const f = m.frentes;
  const totalFrentes = f.fisico + f.palavra + f.fe;
  linhas.push({
    origem,
    vitoria: pct(fins.vitoria, N),
    parcial: pct(fins.parcial, N),
    derrota: pct(fins.derrota, N),
    renome: (renome / N).toFixed(1),
    'testes ok': pct(m.sucessos, m.testes),
    'perda/teste': (m.perdaTestes / m.testes).toFixed(1),
    'conflitos ok': pct(m.vitoriasConflito, m.conflitos),
    'perda/conflito': (m.perdaConflitos / m.conflitos).toFixed(1),
    'lutar/convencer/fé': `${pct(f.fisico, totalFrentes)}/${pct(f.palavra, totalFrentes)}/${pct(f.fe, totalFrentes)}`,
  });
}
console.table(linhas);
