/**
 * Robô que joga o Desvario para medir o equilíbrio. Sem DOM.
 *
 * Ele só enxerga `percebido(estado)`: o mesmo que a tela mostra. Não sabe o
 * que é real. Dois perfis:
 * - `ingenuo`: acredita em tudo o que vê;
 * - `atento`: conhece os sinais (sombra, quem se aproxima) e os lê com 75%
 *   de acerto, como uma pessoa que já jogou algumas vezes.
 */
import { agir, percebido, novaPartida, resumo } from './jogo.js';
import { T, primeiroPasso, distancia } from './mapa.js';
import { fluxo, prox, chance, escolher } from './rng.js';

const PASSA = (t) => t === T.CHAO || t === T.PORTA || t === T.ABERTA;
const VIDA_RUIM = ['Muito ferido', 'À beira do colapso'];

export function novoRobo(perfil = 'atento', semente = 'robo') {
  return { perfil, r: fluxo(semente, 'robo', perfil), crencas: new Map(), conversados: new Set(), antes: new Map(), parado: 0, ultimo: null, andar: 0, turnosNoAndar: 0 };
}

/** O robô acredita que a entidade é falsa? (decide uma vez por aparição) */
function crê(robo, p, ent) {
  if (robo.perfil !== 'atento') return { falso: false, emboscada: false };
  const chave = ent.id + ':' + ent.categoria;
  if (!robo.crencas.has(chave)) {
    const lê = chance(robo.r, 0.75);
    robo.crencas.set(chave, { falso: lê && ent.respira, le: lê });
  }
  const c = robo.crencas.get(chave);
  // Aliado que vem andando até você: desconfie.
  // Aliado que sai do lugar e vem andando até você: desconfie.
  const antes = robo.antes.get(ent.id);
  const andou = antes && (antes.x !== ent.x || antes.y !== ent.y);
  const veio = andou && distancia(ent, p.jogador) < distancia(antes, p.jogador) && ent.categoria === 'aliado' && !ent.companheiro;
  if (veio) c.veio = true;
  return { falso: c.falso || ent.marca === 'suspeito', emboscada: c.le && !!c.veio };
}

/** Decide, age e lembra se a ação não gastou turno (para não insistir nela). */
export function passo(robo, e) {
  const t = e.turno;
  const a = decidir(robo, e);
  agir(e, a);
  robo.falhou = e.turno === t && !e.escolha && a.tipo !== 'escolher' ? a.tipo + ':' + (a.alvo ?? a.dx + ',' + a.dy) : null;
  return a;
}

export function decidir(robo, e) {
  const a = decidirBruto(robo, e);
  if (robo.falhou && robo.falhou === a.tipo + ':' + (a.alvo ?? a.dx + ',' + a.dy)) {
    robo.falhou = null;
    const [dx, dy] = escolher(robo.r, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]);
    return { tipo: 'mover', dx, dy };
  }
  return a;
}

function decidirBruto(robo, e) {
  const p = percebido(e);
  if (e.escolha) return { tipo: 'escolher', indice: escolherEvolucao(e) };
  if (p.surto) return { tipo: 'esperar' };
  if (p.andar !== robo.andar) { robo.andar = p.andar; robo.turnosNoAndar = 0; robo.conversados.clear(); }
  robo.turnosNoAndar++;
  const eu = p.jogador;
  const inv = p.inventario;
  const usar = (tipo) => { const i = inv.findIndex((x) => x.tipo === tipo); return i >= 0 ? { tipo: 'usar', indice: i } : null; };

  // Cuidar de si: o robô lê as palavras (que podem mentir) e a cor (que não mente).
  if (VIDA_RUIM.includes(p.estado.vida)) { const a = usar('cura'); if (a) return fim(robo, p, a); }
  if (p.lucidez >= 4) { const a = usar('ancora') ?? usar('calma'); if (a) return fim(robo, p, a); }
  if (p.lucidez >= 3) { const a = usar('calma'); if (a) return fim(robo, p, a); }
  if (p.lucidez >= 3 && p.cargasAncora > 0 && !p.ancorado && (e.origem === 'espirito' || p.lucidez >= 4)) return fim(robo, p, { tipo: 'ancorar' });

  const vistos = p.entidades.map((x) => ({ ...x, d: distancia(x, eu), fe: crê(robo, p, x) }));
  const hostis = vistos.filter((x) => (x.categoria === 'hostil' || x.fe.emboscada) && !x.fugindo).sort((a, b) => a.d - b.d);
  const reaisHostis = hostis.filter((x) => !x.fe.falso);
  const falsos = hostis.filter((x) => x.fe.falso);

  // Vulto que o robô acha falso, colado: tira a dúvida (ou ignora).
  const falsoColado = falsos.find((x) => x.d === 1);
  if (falsoColado && !reaisHostis.some((x) => x.d <= 2)) {
    if (e.origem === 'mente' || (e.origem === 'corpo' && chance(robo.r, 0.5))) return fim(robo, p, { tipo: 'olhar', alvo: falsoColado.id });
    if (e.origem === 'espirito') return fim(robo, p, { tipo: 'encarar', alvo: falsoColado.id });
  }

  const alvo = reaisHostis[0];
  // Fugir quando o corpo não aguenta mais e não há curativo.
  if (alvo && alvo.d <= 2 && VIDA_RUIM.includes(p.estado.vida) && e.origem !== 'corpo' && chance(robo.r, 0.7)) {
    const fuga = fugirDe(p, alvo);
    if (fuga) return fim(robo, p, fuga);
  }
  if (alvo) {
    const especie = alvo.especie;
    if (e.origem === 'espirito') {
      if (alvo.d === 1 && alvo.fe.emboscada) return fim(robo, p, { tipo: 'olhar', alvo: alvo.id });
      if (alvo.d === 1 && (especie === 'humano' || alvo.fe.emboscada)) return fim(robo, p, { tipo: 'falar', alvo: alvo.id });
      if (alvo.d <= 3 && (especie === 'besta' || especie === 'assombro')) return fim(robo, p, { tipo: 'encarar', alvo: alvo.id });
    }
    if (e.origem === 'mente' && p.estado.magia !== 'Vazio' && alvo.d <= 6 && alvo.d >= 1) {
      if (robo.perfil === 'atento' && alvo.d <= 6 && !alvo.marca && chance(robo.r, 0.25)) return fim(robo, p, { tipo: 'olhar', alvo: alvo.id });
      return fim(robo, p, { tipo: 'magia', alvo: alvo.id });
    }
    if (alvo.d === 1) {
      if (alvo.categoria === 'aliado') return fim(robo, p, { tipo: 'atacar', dx: alvo.x - eu.x, dy: alvo.y - eu.y });
      return fim(robo, p, { tipo: 'mover', dx: alvo.x - eu.x, dy: alvo.y - eu.y });
    }
    if (alvo.d <= 4 && e.origem === 'corpo') return fim(robo, p, irPara(robo, p, (x, y) => x === alvo.x && y === alvo.y) ?? { tipo: 'esperar' });
  }

  // Conversar com quem parece aliado.
  const aliado = vistos.filter((x) => x.categoria === 'aliado' && !x.companheiro && !robo.conversados.has(x.id) && !x.fe.emboscada).sort((a, b) => a.d - b.d)[0];
  if (aliado) {
    if (aliado.d === 1) { robo.conversados.add(aliado.id); return fim(robo, p, { tipo: 'mover', dx: aliado.x - eu.x, dy: aliado.y - eu.y }); }
    const a = irPara(robo, p, (x, y) => x === aliado.x && y === aliado.y);
    if (a) return fim(robo, p, a);
  }

  // Objetos: itens, altar e, na hora certa, a saída.
  const cheio = inv.length >= 5;
  if (cheio && p.lucidez >= 2) { const a = usar('calma'); if (a) return fim(robo, p, a); }
  const objs = p.objetos.filter((o) => (o.tipo === 'item' && !(cheio && ['cura', 'calma', 'ancora'].includes(o.item)) && !robo.ignorar?.has(o.id)) || (o.tipo === 'altar' && p.lucidez >= 1));
  const perto = objs.map((o) => ({ ...o, d: distancia(o, eu) })).filter((o) => o.d <= 10).sort((a, b) => a.d - b.d)[0];
  if (perto) { const a = irPara(robo, p, (x, y) => x === perto.x && y === perto.y); if (a) return fim(robo, p, a); }

  const saida = p.objetos.find((o) => o.tipo === 'escada' || o.tipo === 'saida');
  const pressa = robo.turnosNoAndar > 220 || p.lucidez >= 3;
  if (saida && pressa) { const a = irPara(robo, p, (x, y) => x === saida.x && y === saida.y); if (a) return fim(robo, p, a); }

  // Explorar: ir até a borda do que se conhece.
  const k = (x, y) => y * p.w + x;
  const fronteira = (x, y) => {
    if (!PASSA(p.tiles[k(x, y)])) return false;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < p.w && yy < p.h && p.tiles[k(xx, yy)] === -1) return true;
    }
    return false;
  };
  const exp = irPara(robo, p, fronteira);
  if (exp) return fim(robo, p, exp);
  if (saida) { const a = irPara(robo, p, (x, y) => x === saida.x && y === saida.y); if (a) return fim(robo, p, a); }
  const [dx, dy] = escolher(robo.r, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]]);
  return fim(robo, p, { tipo: 'mover', dx, dy });
}

function fugirDe(p, ameaca) {
  let melhor = null, md = distancia(ameaca, p.jogador);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const x = p.jogador.x + dx, y = p.jogador.y + dy;
    if (!PASSA(p.tiles[y * p.w + x]) || p.entidades.some((q) => q.x === x && q.y === y)) continue;
    const d = distancia({ x, y }, ameaca);
    if (d > md) { md = d; melhor = { tipo: 'mover', dx, dy }; }
  }
  return melhor;
}

function irPara(robo, p, alvo) {
  const k = (x, y) => y * p.w + x;
  const ocupado = new Set(p.entidades.filter((x) => !x.companheiro).map((x) => k(x.x, x.y)));
  const passo = primeiroPasso(p.w, p.h, p.jogador, (x, y) => PASSA(p.tiles[k(x, y)]) && !ocupado.has(k(x, y)), alvo, 3000);
  if (!passo) return null;
  return { tipo: 'mover', dx: passo.dx, dy: passo.dy };
}

function fim(robo, p, acao) {
  for (const x of p.entidades) robo.antes.set(x.id, { x: x.x, y: x.y });
  const pos = p.jogador.x + ',' + p.jogador.y;
  robo.parado = pos === robo.ultimo ? robo.parado + 1 : 0;
  robo.ultimo = pos;
  if (robo.parado > 6 && acao.tipo === 'mover') {
    const [dx, dy] = escolher(robo.r, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]);
    return { tipo: 'mover', dx, dy };
  }
  return acao;
}

const PREFERE = {
  corpo: ['saude', 'ataqueCorporal', 'reflexo', 'resistencia', 'fisico', 'forca', 'destreza', 'agilidade', 'vontade', 'fe', 'percepcao', 'sabedoria', 'serenidade'],
  mente: ['magiaAtaqueFisico', 'inteligencia', 'raciocinio', 'sabedoria', 'serenidade', 'fisico', 'saude', 'vontade', 'fe', 'percepcao', 'memoria'],
  espirito: ['fe', 'vontade', 'presenca', 'empatia', 'conviccao', 'esperanca', 'autocontrole', 'fisico', 'saude', 'sabedoria'],
};

function escolherEvolucao(e) {
  const ops = e.escolha.opcoes;
  const pref = PREFERE[e.origem];
  let melhor = 0, mp = 1e9;
  ops.forEach((o, i) => { const r = pref.indexOf(o.id); const v = r < 0 ? 99 : r; if (v < mp) { mp = v; melhor = i; } });
  return melhor;
}

/** Joga uma partida inteira. Devolve o resumo. */
export function jogarPartida({ semente, tema, origem, perfil = 'atento', limite = 4000 }) {
  const e = novaPartida({ semente, tema, origem });
  const robo = novoRobo(perfil, semente);
  let passos = 0;
  while (!e.fim && passos++ < limite) passo(robo, e);
  if (!e.fim) e.fim = { tipo: 'limite', andar: e.andar, turno: e.turno };
  return resumo(e);
}
