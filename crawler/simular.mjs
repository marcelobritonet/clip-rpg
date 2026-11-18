/**
 * Simulador do Desvario: o robô joga muitas partidas e o resultado sai em
 * tabelas Markdown. Uso: `node crawler/simular.mjs [partidas] [perfil]`.
 */
import { jogarPartida } from './robo.js';
import { LISTA_TEMAS } from './temas.js';

const N = Number(process.argv[2] ?? 200);
const perfis = process.argv[3] ? [process.argv[3]] : ['atento', 'ingenuo'];
const origens = ['corpo', 'mente', 'espirito'];
const pct = (x) => `${Math.round(x * 100)}%`;
const med = (l) => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : 0);
const f1 = (x) => x.toFixed(1).replace('.', ',');

for (const perfil of perfis) {
  console.log(`\n### Robô ${perfil} (${N} partidas por tema e origem)\n`);
  console.log('| Tema | Origem | Fuga | Fuga inteira | Morte | Loucura | Limite | Andar médio | Turnos (fuga) | Turnos (todas) | Enganos/partida | Revelados/partida | Surtos | % turnos Abalado ou pior |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  const total = [];
  for (const tema of LISTA_TEMAS) {
    for (const origem of origens) {
      const rs = [];
      for (let i = 0; i < N; i++) rs.push(jogarPartida({ semente: `sim-${i}`, tema, origem, perfil }));
      total.push(...rs);
      const c = (t) => rs.filter((r) => r.resultado === t).length / rs.length;
      const ruim = med(rs.map((r) => { const t = r.stats.turnosPorLucidez; const s = t.reduce((a, b) => a + b, 0) || 1; return (t[2] + t[3] + t[4] + t[5]) / s; }));
      console.log(`| ${tema} | ${origem} | ${pct(c('fuga'))} | ${pct(rs.filter((r) => r.inteira).length / rs.length)} | ${pct(c('morte'))} | ${pct(c('loucura'))} | ${pct(c('limite'))} | ${f1(med(rs.map((r) => r.andar)))} | ${Math.round(med(rs.filter((r) => r.resultado === 'fuga').map((r) => r.turnos)))} | ${Math.round(med(rs.map((r) => r.turnos)))} | ${f1(med(rs.map((r) => r.enganos)))} | ${f1(med(rs.map((r) => r.revelados)))} | ${f1(med(rs.map((r) => r.stats.surtos)))} | ${pct(ruim)} |`);
    }
  }
  // De onde vem e para onde vai a Sanidade, e como as partidas acabam.
  const MOTIVOS = { perturbador: 'Fotos, cartas e corpos', tempo: 'O tempo', assombro: 'Assombros', vulto: 'Golpes de vulto', vazio: 'Golpe no vazio', miragem: 'Miragens', emboscada: 'Emboscadas', aliado: 'Ferir aliado', matar: 'Matar gente', encarar: 'Encarar e falhar', companheiro: 'Perder a companhia' };
  const GANHOS = { calma: 'Itens de calma', ancora: 'Ancorar e âncoras', altar: 'Altar', aliado: 'Presente de aliado', conversa: 'Conversa' };
  console.log('\n| Sanidade por partida | ' + origens.join(' | ') + ' |\n|---|' + origens.map(() => '---').join('|') + '|');
  const porOrigem = (o) => total.filter((r) => r.origem === o);
  for (const [k, nome] of Object.entries(MOTIVOS)) console.log(`| −${nome} | ${origens.map((o) => f1(med(porOrigem(o).map((r) => r.stats.perdas[k] ?? 0)))).join(' | ')} |`);
  for (const [k, nome] of Object.entries(GANHOS)) console.log(`| +${nome} | ${origens.map((o) => f1(med(porOrigem(o).map((r) => r.stats.ganhos[k] ?? 0)))).join(' | ')} |`);
  console.log('\n| Como acaba (todas as partidas) | ' + origens.join(' | ') + ' |\n|---|' + origens.map(() => '---').join('|') + '|');
  const chaves = new Set(total.map((r) => `${r.resultado} no andar ${r.andar}`));
  for (const k of [...chaves].sort()) console.log(`| ${k} | ${origens.map((o) => pct(porOrigem(o).filter((r) => `${r.resultado} no andar ${r.andar}` === k).length / porOrigem(o).length)).join(' | ')} |`);

  const faixas = (chave, nomes) => {
    console.log(`\n| % dos turnos em cada ${chave === 'turnosPorConsciencia' ? 'Consciência' : 'Vida'} | ` + origens.join(' | ') + ' |\n|---|' + origens.map(() => '---').join('|') + '|');
    nomes.forEach((nome, i) => console.log(`| ${nome} | ${origens.map((o) => pct(med(porOrigem(o).map((r) => { const t = r.stats[chave]; return t[i] / (t.reduce((a, b) => a + b, 0) || 1); })))).join(' | ')} |`));
  };
  faixas('turnosPorConsciencia', ['Alerta', 'Desperto', 'Cansado', 'Zonzo', 'Apagando', 'Apagado']);
  faixas('turnosPorVida', ['Intacto', 'Arranhado', 'Ferido', 'Muito ferido', 'À beira do colapso', 'Caído']);
  console.log('\n| Consciência por partida | ' + origens.join(' | ') + ' |\n|---|' + origens.map(() => '---').join('|') + '|');
  for (const [k, nome] of Object.entries({ tempo: 'O tempo', sangue: 'Sangue perdido', pancada: 'Pancadas', buraco: 'Buracos falsos' })) console.log(`| −${nome} | ${origens.map((o) => f1(med(porOrigem(o).map((r) => r.stats.cansaco[k] ?? 0)))).join(' | ')} |`);
  const s = (k) => f1(med(total.map((r) => r.stats[k])));
  console.log('\n| Engano (média por partida) | Valor |\n|---|---|');
  for (const [k, nome] of [['rondas', 'Vezes que a ronda chegou'], ['turnosSemFio', 'Turnos sem fio'], ['preparos', 'Golpes preparados'], ['pesadosRecebidos', 'Golpes pesados recebidos'], ['pesadosEvitados', 'Golpes pesados evitados'], ['defesas', 'Defender'], ['contraGolpes', 'Contra-golpes'], ['empurroesCertos', 'Empurrões certos'], ['quedasDeMonstro', 'Monstros empurrados no buraco'], ['invasoes', 'Invasões pela janela'], ['janelasBarradas', 'Janelas seguradas'], ['batidasFalsas', 'Batidas que ninguém deu'], ['desmaios', 'Desmaios'], ['passosPerdidos', 'Passos no corredor sem fim'], ['portasFalsas', 'Portas pintadas empurradas'], ['buracosFalsos', 'Buracos falsos pulados'], ['quedas', 'Quedas por buraco de verdade'], ['passosArrastados', 'Passos arrastados'], ['farejado', 'Bestas que farejaram sangue'], ['itensDisfarcados', 'Itens com cara de monstro'], ['itensQuebrados', 'Itens quebrados por engano'], ['itensRevelados', 'Itens desmascarados'], ['perturbadores', 'Coisas perturbadoras examinadas'], ['golpesNoVazio', 'Golpes no vazio'], ['fantasmasGolpes', 'Golpes de vulto recebidos'], ['aliadosFeridos', 'Aliados feridos'], ['aliadosMortos', 'Aliados mortos'], ['emboscadas', 'Emboscadas de falso aliado'], ['miragensPisadas', 'Miragens pisadas'], ['paredesFalsas', 'Paredes falsas'], ['fantasmasCriados', 'Vultos criados'], ['disfarcesCriados', 'Disfarces criados'], ['miragensCriadas', 'Miragens criadas'], ['fantasmasRevelados', 'Vultos desfeitos'], ['disfarcesRevelados', 'Disfarces desfeitos'], ['olhares', 'Olhar de novo'], ['pacificados', 'Convencidos'], ['espantados', 'Espantados com fé'], ['vencidos', 'Derrubados']]) {
    console.log(`| ${nome} | ${s(k)} |`);
  }
}
