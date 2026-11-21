/**
 * Mede a mesa: o robô joga N sessões por passado e imprime uma tabela.
 * Uso: node duplo-seis/simular.mjs [sessões=300] [atento|teimoso|acaso]
 */
import { jogar } from './robo.js';
import { AVENTURAS } from './aventuras/index.js';

const n = Number(process.argv[2] ?? 300);
const perfil = process.argv[3] ?? 'atento';
const brasa = AVENTURAS.find((a) => a.id === (process.argv[4] ?? 'brasa'));
const PASSADOS = brasa.passados;
const finais = [...brasa.finais.map((f) => f.id), ...Object.keys(brasa.quedas)];

console.log(`${brasa.nome}: robô ${perfil}, ${n} sessões por passado\n`);
console.log(`| Passado | ${finais.join(' | ')} | ★ média | brasa | laços | sucesso | insistiu | surtos | quedas |`);
console.log(`|---|${finais.map(() => '---').join('|')}|---|---|---|---|---|---|---|`);
for (const p of PASSADOS) {
  const conta = Object.fromEntries(finais.map((f) => [f, 0]));
  let estrelas = 0, brasaF = 0, lacos = 0, testes = 0, ok = 0, insistiu = 0, surtos = 0, quedas = 0, presos = 0;
  for (let i = 0; i < n; i++) {
    const e = jogar({ semente: `sim-${i}`, passado: p.id, aventura: brasa, perfil });
    if (!e.fim) { presos++; continue; }
    conta[e.fim.id]++;
    estrelas += e.fim.estrelas; brasaF += e.brasa; lacos += e.lacos; surtos += e.surtos; quedas += e.quedas;
    for (const t of e.trilha) { testes++; if (t.ok) ok++; }
  }
  const pc = (x) => `${Math.round((x / n) * 100)}%`;
  console.log(`| ${p.titulo} | ${finais.map((f) => pc(conta[f])).join(' | ')} | ${(estrelas / n).toFixed(2)} | ${(brasaF / n).toFixed(1)} | ${(lacos / n).toFixed(1)} | ${Math.round((ok / testes) * 100)}% | ${insistiu} | ${(surtos / n).toFixed(2)} | ${(quedas / n).toFixed(2)} |${presos ? ` presos: ${presos}` : ''}`);
}
