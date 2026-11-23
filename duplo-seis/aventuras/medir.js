/**
 * História viva: medir o ato que acabou de ser colado. A conferência garante
 * a forma; aqui o robô joga o trecho novo várias vezes, a partir do ponto em
 * que o jogador está, e diz se saiu fácil ou difícil demais. Sem DOM.
 *
 * As faixas vêm das aventuras da casa: o robô atento acerta de 70% a 83% dos
 * testes e chega ao final de 3 estrelas em 32% a 58% das sessões.
 */
import * as J from '../jogo.js';
import { fluxo } from '../rng.js';
import { seguir } from '../robo.js';

export const FAIXAS = {
  sucesso: { min: 0.5, max: 0.9 }, // testes e escolhas que dão certo no ato
  queda: 0.2, // sessões que acabam em morte ou loucura dentro do ato
  semDados: 0.5, // escolhas sem dados entre as que o robô fez
  tres: { min: 0.08, max: 0.8 }, // sessões que chegam a um final de 3 estrelas
};

/**
 * `historia` já com o trecho novo; `guardada` é a sessão do jogador no
 * acampamento (`J.guardar`), ou null para medir desde a abertura com `passado`.
 * Devolve os números e a lista de `avisos` ('facil', 'dificil', 'mortal',
 * 'semDados', 'garantido', 'inalcancavel'); lista vazia quer dizer "na faixa".
 */
export function medir(historia, guardada, { passado = 'criador', n = 120 } = {}) {
  const cenas = new Map([historia.abertura, ...historia.cenas, ...(historia.desfecho ?? [])].map((c) => [c.id, c]));
  const temFinal = !!(historia.desfecho?.length && historia.finais?.length);
  let passos = 0, certos = 0, livres = 0, quedas = 0, relogio = 0, tres = 0, chegaram = 0;
  const finais = {};
  for (let i = 0; i < n; i++) {
    const semente = `medir-${i}`;
    let e;
    if (guardada) {
      e = J.retomar(JSON.parse(JSON.stringify(guardada)), [historia]);
      if (!e) return null;
      e.r = fluxo(semente, 'dados'); // outros dados a cada volta: é o mesmo personagem, com outra sorte
    } else {
      e = J.nova({ semente, passado, aventura: historia });
    }
    const de = e.trilha.length;
    seguir(e, { semente });
    for (const t of e.trilha.slice(de)) {
      passos++;
      if (t.ok) certos++;
      if (cenas.get(t.cena)?.abordagens.find((a) => a.id === t.abordagem)?.livre) livres++;
    }
    relogio += e.brasa;
    if (e.fase === 'fim') {
      if (e.fim.id === 'morte' || e.fim.id === 'perdido') quedas++;
      else { chegaram++; finais[e.fim.id] = (finais[e.fim.id] ?? 0) + 1; if (e.fim.estrelas === 3) tres++; }
    }
  }
  const m = {
    n,
    sucesso: passos ? certos / passos : 1,
    semDados: passos ? livres / passos : 0,
    queda: quedas / n,
    relogio: relogio / n,
    final: temFinal && guardada ? { tres: tres / n, finais: Object.fromEntries(Object.entries(finais).map(([k, v]) => [k, v / n])) } : null,
    avisos: [],
  };
  // O robô atento escolhe pela chance, não pela história: um final que pede a escolha "errada" nos dados
  // ele nunca vê. Antes de dizer que está fora de alcance, joga também ao acaso e fica com o melhor dos dois.
  if (m.final && m.final.tres < FAIXAS.tres.min) {
    let outros = 0;
    for (let i = 0; i < n; i++) {
      const e = J.retomar(JSON.parse(JSON.stringify(guardada)), [historia]);
      e.r = fluxo(`acaso-${i}`, 'dados');
      seguir(e, { semente: `acaso-${i}`, perfil: 'acaso' });
      if (e.fase === 'fim' && e.fim.estrelas === 3) outros++;
    }
    m.final.tres = Math.max(m.final.tres, outros / n);
  }
  if (m.queda >= FAIXAS.queda) m.avisos.push('mortal');
  if (m.sucesso > FAIXAS.sucesso.max) m.avisos.push('facil');
  else if (m.sucesso < FAIXAS.sucesso.min) m.avisos.push('dificil');
  if (m.semDados > FAIXAS.semDados) m.avisos.push('semDados');
  if (m.final) {
    if (m.final.tres > FAIXAS.tres.max) m.avisos.push('garantido');
    else if (m.final.tres < FAIXAS.tres.min) m.avisos.push('inalcancavel');
  }
  return m;
}
