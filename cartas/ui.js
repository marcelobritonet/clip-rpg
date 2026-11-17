/**
 * Interface da Travessia. Redesenha a mesa inteira a cada ação (o estado é
 * pequeno) e trata os cliques por delegação, pelo atributo `data-acao`.
 */
import { ATRIBUTOS, APRIMORAMENTOS, CAMINHOS, ancora, nivelDe, descrever, valores, nomeDe } from '../motor/clip.js';
import { dica } from '../motor/glossario.js';
import { aposRender } from '../ficha/dicas.js';
import * as J from './jogo.js';

const raiz = document.getElementById('jogo');
const botaoRecomecar = document.getElementById('recomecar');
const CHAVE_RECORDE = 'clip.cartas.recorde';

let estado = null;
let insistir = false;
let tela = 'inicio';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ler = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } };

/** Chave do glossário para um id do sistema. */
function chave(id) {
  if (id in ATRIBUTOS) return id;
  if (id in APRIMORAMENTOS) return ancora(id) ?? 'aprimoramentos-propostos';
  return dica(id) ? id : 'pericias';
}
const termo = (id, texto = nomeDe(id)) => `<span class="termo" data-dica="${chave(id)}">${esc(texto)}</span>`;
const termoChave = (k, texto) => `<span class="termo" data-dica="${k}">${esc(texto)}</span>`;

const caminhoDoId = (id) => ATRIBUTOS[id]?.caminho ?? ATRIBUTOS[APRIMORAMENTOS[id]?.atributo]?.caminho ?? null;
const NOME_CAMINHO = Object.fromEntries(CAMINHOS.map((c) => [c.id, c.nome]));
const TIPO = { aprimoramento: 'Aprimoramento', pericia: 'Perícia', equipamento: 'Equipamento', objeto: 'Objeto', momento: 'Momento' };

/* ------------------------------------------------------------------------ */
/* Tela inicial                                                             */
/* ------------------------------------------------------------------------ */

function telaInicio() {
  const recorde = ler(CHAVE_RECORDE);
  return `
  <section class="abertura">
    <h1>Travessia</h1>
    <p class="lema">Um jogo de cartas solo do Sistema Clip. Sete cenas até o vau, e o Mestre está de olho no seu ponto fraco.</p>
    ${recorde ? `<p class="recorde">Seu melhor Renome: <b>${recorde.renome}</b> (${esc(recorde.origem)}).</p>` : ''}
    <details class="regras" open>
      <summary>Como jogar</summary>
      <ol>
        <li><b>Cada cena</b>, o Mestre revela um desafio. Antes de enfrentar, você recebe <b>${J.JOGO.pePorCena} ${termoChave('distribuicao-de-pontos', 'Pontos de Evolução')}</b> (na primeira, +${J.JOGO.peCriacao} para criar o personagem).</li>
        <li><b>Treinar um ${termoChave('atributos', 'Atributo')}</b> custa ${J.JOGO.custo.atributo} PE. Atributos são o terreno: liberam as cartas.</li>
        <li><b>Jogar uma carta</b> custa 1 PE. ${termoChave('aprimoramentos', 'Aprimoramentos')} não passam do Atributo; ${termoChave('pericias', 'Perícias')} não passam do menor requisito. Jogar de novo a mesma carta sobe 1 nível.</li>
        <li><b>${termoChave('testes', 'Testes')}</b>: escolha como resolver. Cada nível é 1D6 contra a ${termoChave('definindo-dificuldades', 'Dificuldade')}. Objetos somam dados; no Corpo dá para ${termoChave('insistir', 'Insistir')} pagando com Vida.</li>
        <li><b>Conflitos</b> usam o ${termoChave('sequencia-de-combate', 'combate do Clip')} em três frentes: Lutar, Convencer ou Encarar com fé. Todas tiram o Ímpeto do oponente. Vencer sem Lutar vale mais Renome.</li>
        <li><b>O Mestre escolhe o desafio do seu Caminho mais fraco.</b> Especializar demais custa caro.</li>
        <li>Você perde se a ${termoChave('pontos-de-vida', 'Vida')} ou a ${termoChave('sanidade', 'Sanidade')} chegar a zero. Na cena ${J.JOGO.cenas + 1}, o Guardião do Vau.</li>
      </ol>
    </details>
    <h2>Escolha a origem</h2>
    <div class="origens">
      ${Object.entries(J.ORIGENS).map(([id, o]) => {
        const f = J.novoJogo({ origem: id }).ficha;
        const v = valores(f);
        const atrib = Object.keys(o.atributos).map((a) => `${ATRIBUTOS[a].nome} ${o.atributos[a]}`).join(', ');
        const extra = [...Object.entries(o.aprimoramentos ?? {}), ...Object.entries(o.pericias ?? {})].map(([k, n]) => `${nomeDe(k)} ${n}`).join(', ');
        return `<button type="button" class="carta origem c-${o.caminho}" data-acao="origem" data-id="${id}">
          <span class="carta-tipo">${NOME_CAMINHO[o.caminho]}</span>
          <strong class="carta-nome">${esc(o.nome)}</strong>
          <span class="carta-texto">${esc(o.texto)}</span>
          <span class="carta-req">${esc(atrib)}; ${esc(extra)}</span>
          <span class="carta-req">Vida ${v.vida.valor} · Sanidade ${v.sanidade.valor}</span>
        </button>`;
      }).join('')}
    </div>
  </section>`;
}

/* ------------------------------------------------------------------------ */
/* Mesa                                                                     */
/* ------------------------------------------------------------------------ */

function barra() {
  const v = valores(estado.ficha);
  const rec = (tipo, atual, max, k, nome) => `
    <div class="recurso r-${tipo}">
      <span class="recurso-nome">${termoChave(k, nome)}</span>
      <span class="recurso-valor"><b>${Math.max(0, atual)}</b>/${max}</span>
      <span class="recurso-desc">${descrever(tipo, atual, max)}</span>
      <span class="medidor"><span style="width:${Math.max(0, Math.min(100, (100 * atual) / max))}%"></span></span>
    </div>`;
  const cena = estado.desafio?.final ? 'Final' : `${estado.cena}/${J.JOGO.cenas}`;
  return `
  <div class="barra" aria-label="Estado do personagem">
    <div class="recurso"><span class="recurso-nome">Cena</span><span class="recurso-valor"><b>${cena}</b></span></div>
    ${rec('vida', estado.vida, v.vida.valor, 'pontos-de-vida', 'Vida')}
    ${rec('sanidade', estado.sanidade, v.sanidade.valor, 'sanidade', 'Sanidade')}
    <div class="recurso"><span class="recurso-nome">${termoChave('distribuicao-de-pontos', 'PE')}</span><span class="recurso-valor"><b>${estado.pe}</b></span></div>
    <div class="recurso"><span class="recurso-nome">Renome</span><span class="recurso-valor"><b>${estado.renome}</b></span></div>
  </div>`;
}

function cartaDesafio() {
  const d = estado.desafio;
  const tipo = d.tipo === 'teste' ? 'Teste' : 'Conflito';
  const cls = d.caminho ? `c-${d.caminho}` : 'c-final';
  const escala = d.escala ? `<span class="selo">+${d.escala} de dificuldade</span>` : '';
  return `
  <article class="desafio ${cls}">
    <p class="mestre">${esc(estado.motivoMestre)}</p>
    <span class="carta-tipo">${tipo}${d.caminho ? ` de ${NOME_CAMINHO[d.caminho]}` : ''} ${escala}</span>
    <h2>${esc(d.nome)}</h2>
    <p>${esc(d.texto)}</p>
    ${d.tipo === 'teste' ? listaAbordagens(estado.fase === 'teste') : ''}
  </article>`;
}

function textoDificuldade(n) {
  return J.enxergaDificuldade(estado.ficha) ? `${J.faixa(n)} (${n})` : J.faixa(n);
}

function listaAbordagens(ativa) {
  const abs = J.abordagens(estado);
  const algumaInsiste = abs.some((a) => a.insistir);
  const itens = abs.map((a) => {
    const obj = a.objetos.map((o) => J.OBJETOS[o].nome);
    if (estado.ajuda) obj.push('Companheiro de estrada');
    const ins = a.insistir ? `<span class="nota">pode insistir (${a.insistir.paga === 'vida' ? 'Vida' : 'Sanidade'})</span>` : '';
    const conteudo = `
      <span class="ab-nome c-${a.caminho}">${esc(a.nome)} ${a.nivel}</span>
      <span class="ab-dados">${a.dados}</span>
      <span class="ab-dif">${textoDificuldade(a.dificuldade)}</span>
      ${obj.length ? `<span class="nota">com ${esc(obj.join(' e '))}</span>` : ''}${ins}`;
    return ativa
      ? `<li><button type="button" class="abordagem" data-acao="testar" data-id="${a.id}">${conteudo}</button></li>`
      : `<li class="abordagem">${conteudo}</li>`;
  }).join('');
  const chaveInsistir = ativa && algumaInsiste
    ? `<label class="chave"><input type="checkbox" data-acao="insistir" ${insistir ? 'checked' : ''}> ${termoChave('insistir', 'Insistir')} se faltar</label>`
    : '';
  return `
    <p class="rotulo">${ativa ? 'Como você resolve?' : 'Abordagens possíveis'}</p>
    <ul class="abordagens">${itens}</ul>
    ${chaveInsistir}`;
}

function painelAcao() {
  const f = estado.fase;
  if (f === 'preparo') {
    return `<div class="acao">
      <p>Prepare-se: treine Atributos e jogue cartas. Depois, enfrente o desafio.</p>
      <button type="button" class="primario" data-acao="enfrentar">Enfrentar ${esc(estado.desafio.nome)}</button>
    </div>`;
  }
  if (f === 'teste') return '';
  if (f === 'conflito') return painelConflito();
  if (f === 'resultado') return painelResultado();
  return '';
}

function dadosHtml(lista) {
  return `<span class="dados">${lista.map((d) => `<span class="dado">${d}</span>`).join('')}</span>`;
}

function painelConflito() {
  const c = estado.conflito;
  const op = c.oponente;
  const l = J.leituraOponente(estado);
  const fr = J.frentes(estado.ficha);
  const nums = l.numeros;
  const def = (k) => (nums ? ` <span class="nota">defesa ${nums.defesa[k]}${k === 'fisico' && nums.armadura ? `, armadura ${nums.armadura}` : ''}</span>` : '');
  const botaoFrente = (k) => `
    <button type="button" class="frente c-${fr[k].caminho}" data-acao="agir" data-id="${k}">
      <b>${fr[k].nome}</b>
      <span>${termoChave(fr[k].dica, String(fr[k].ataque))} + 1D6${fr[k].arma ? ` · arma +${fr[k].arma}` : ''}</span>${def(k)}
    </button>`;
  const ataqueDe = op.ataque.frente === 'alterna' ? 'corpo e mente, alternando' : op.ataque.frente === 'fisico' ? 'o corpo (Vida)' : 'a mente (Sanidade)';
  const log = c.log.slice(-6).map((e) => `<li class="log-${e.tipo}">${esc(e.texto)}${detalhe(e)}</li>`).join('');
  return `
  <div class="acao conflito">
    <div class="oponente">
      <strong>${esc(op.nome)}</strong>
      <span class="estado-op">${esc(l.estado)}${nums ? ` · Ímpeto ${Math.max(0, nums.impeto)}/${nums.maximo}` : ''}</span>
      <span class="nota">Ataca ${ataqueDe}. Rodada ${Math.min(c.rodada + 1, J.limiteRodadas(estado))} de ${J.limiteRodadas(estado)}.</span>
    </div>
    <div class="frentes">
      ${['fisico', 'palavra', 'fe'].map(botaoFrente).join('')}
      <button type="button" class="frente c-mente" data-acao="agir" data-id="analisar" ${c.analisado ? 'disabled' : ''}>
        <b>Analisar</b><span>${termo('percepcao')} ou ${termo('investigacao')} contra ${J.JOGO.dificuldadeAnalisar}</span>
      </button>
      <button type="button" class="frente" data-acao="agir" data-id="defender">
        <b>Defender</b><span>+${J.JOGO.bonusDefender} na ${termoChave('defesa', 'Defesa')} nesta rodada</span>
      </button>
      <button type="button" class="frente" data-acao="agir" data-id="fugir" ${estado.desafio.final ? 'disabled' : ''}>
        <b>Fugir</b><span>${termo('destreza')} ou ${termo('furtividade')} contra ${J.JOGO.dificuldadeFugir}</span>
      </button>
    </div>
    <ol class="log" aria-live="polite">${log}</ol>
  </div>`;
}

function detalhe(e) {
  if (e.ataque) {
    const a = e.ataque;
    return ` <span class="nota">${a.valorAtaque} contra ${a.valorDefesa}</span>`;
  }
  if (e.teste) return ` ${dadosHtml(e.teste.dados)} <span class="nota">${e.teste.total} contra ${e.teste.dificuldade}</span>`;
  return '';
}

function painelResultado() {
  const r = estado.resultado;
  let corpo;
  if (r.tipo === 'teste') {
    const t = r.teste;
    const perdas = [r.perdas.vida && `−${r.perdas.vida} Vida`, r.perdas.sanidade && `−${r.perdas.sanidade} Sanidade`].filter(Boolean).join(', ');
    let titulo = t.sucesso ? 'Sucesso' : 'Falha';
    if (t.insistiu) titulo = `Sucesso, insistindo (paga ${t.custoVida} de ${r.paga === 'vida' ? 'Vida' : 'Sanidade'})`;
    corpo = `
      <p class="resultado-titulo ${t.sucesso ? 'ok' : 'ruim'}">${titulo}</p>
      <p>${esc(r.abordagem.nome)}: ${dadosHtml(t.dados)} ${t.dados.length === 1 && r.abordagem.nivel + r.abordagem.objeto <= 0 ? '−2 ' : ''}= <b>${t.total}</b> contra ${t.dificuldade} (${J.faixa(t.dificuldade)}).</p>
      ${!t.sucesso ? `<p>${esc(estado.desafio.falha.texto)}</p>` : ''}
      ${perdas ? `<p class="ruim">${perdas}</p>` : ''}
      ${r.renome ? `<p class="ok">+${r.renome} Renome</p>` : ''}`;
  } else {
    const textos = {
      vitoria: r.semViolencia ? 'Resolvido sem violência.' : 'Você vence o conflito.',
      impasse: 'Ninguém cede. A cena acaba e você segue, sem glória.',
      fuga: 'Você escapa, sem glória.',
      derrota: 'Você cai.',
    };
    const log = estado.conflito.log.slice(-4).map((e) => `<li class="log-${e.tipo}">${esc(e.texto)}${detalhe(e)}</li>`).join('');
    corpo = `
      <p class="resultado-titulo ${r.fim === 'vitoria' ? 'ok' : r.fim === 'derrota' ? 'ruim' : ''}">${textos[r.fim]}</p>
      <ol class="log">${log}</ol>
      ${r.renome ? `<p class="ok">+${r.renome} Renome${r.semViolencia ? ` (inclui +${J.JOGO.renome.semViolencia} por não Lutar)` : ''}</p>` : ''}`;
  }
  const proximo = estado.fim ? 'Ver o desfecho' : 'Seguir viagem';
  const descanso = estado.fim ? '' : `<p class="nota">No descanso: +${J.JOGO.descanso.vida} Vida e +${J.JOGO.descanso.sanidade + nivelDe(estado.ficha, 'esperanca')} Sanidade.</p>`;
  return `<div class="acao resultado">${corpo}${descanso}<button type="button" class="primario" data-acao="continuar">${proximo}</button></div>`;
}

function cartaHtml(carta) {
  const pode = J.podeJogar(estado, carta);
  const custo = J.JOGO.custo[carta.tipo];
  const req = carta.requisitos.length
    ? `<span class="carta-req">Requer ${carta.requisitos.map((r) => termo(r)).join(' e ')}</span>`
    : '';
  const nivel = carta.tipo === 'aprimoramento' || carta.tipo === 'pericia' ? nivelDe(estado.ficha, carta.alvo) : null;
  const proposto = carta.proposto ? `<span class="selo" title="Aprimoramento proposto, ainda fora do manual">proposto</span>` : '';
  return `
  <div class="carta c-${carta.caminho ?? 'neutro'} ${pode.ok ? 'jogavel' : 'travada'}">
    <span class="carta-tipo">${TIPO[carta.tipo]} ${proposto}<span class="custo" aria-label="Custo">${custo ? `${custo} PE` : 'grátis'}</span></span>
    <strong class="carta-nome">${esc(carta.nome)}${nivel !== null ? ` <span class="nota">${nivel} → ${nivel + 1}</span>` : ''}</strong>
    ${req}
    ${carta.texto ? `<span class="carta-texto">${esc(carta.texto)}</span>` : ''}
    <span class="carta-pes">
      <button type="button" data-acao="jogar" data-id="${carta.uid}" ${pode.ok ? '' : 'disabled'}>Jogar</button>
      ${estado.fase === 'preparo' && estado.trocou !== estado.cena ? `<button type="button" class="discreto" data-acao="trocar" data-id="${carta.uid}" title="Descarta e compra outra (1 por cena)">Trocar</button>` : ''}
    </span>
    ${pode.ok || (estado.fase !== 'preparo' && carta.tipo !== 'momento') ? '' : `<span class="motivo">${esc(pode.motivo)}</span>`}
  </div>`;
}

function mao() {
  return `
  <section class="mao" aria-label="Sua mão">
    <h3>Mão <span class="nota">${estado.baralho.length} no baralho${estado.fase === 'preparo' ? '' : ' · agora só os Momentos podem ser jogados'}</span></h3>
    <div class="cartas">${estado.mao.map(cartaHtml).join('') || '<p class="nota">Sem cartas.</p>'}</div>
  </section>`;
}

function personagem() {
  const f = estado.ficha;
  const colunas = CAMINHOS.map((c) => {
    const atributos = c.atributos.map((a) => {
      const n = nivelDe(f, a);
      const pode = J.podeTreinar(estado, a);
      return `<li class="atributo">
        ${termo(a)} <span class="pips" aria-label="nível ${n}">${'●'.repeat(n)}${'○'.repeat(Math.max(0, 3 - n))}</span>
        ${estado.fase === 'preparo' ? `<button type="button" class="mais" data-acao="treinar" data-id="${a}" ${pode.ok ? '' : 'disabled'} title="Treinar: ${J.JOGO.custo.atributo} PE" aria-label="Treinar ${ATRIBUTOS[a].nome}">+</button>` : ''}
      </li>`;
    }).join('');
    const aprim = Object.keys(APRIMORAMENTOS).filter((id) => APRIMORAMENTOS[id].atributo && ATRIBUTOS[APRIMORAMENTOS[id].atributo].caminho === c.id && nivelDe(f, id) > 0);
    const peri = f.pericias.filter((p) => p.nivel > 0 && caminhoDoId(p.requisitos[0]) === c.id);
    const itens = [...aprim.map((id) => `${termo(id)} ${nivelDe(f, id)}`), ...peri.map((p) => `${termo(p.id, p.nome)} ${p.nivel}`)];
    return `<div class="caminho c-${c.id}">
      <h4>${termoChave(c.id, c.nome)} <span class="nota">${J.balanco(estado).caminhos[c.id]}</span></h4>
      <ul class="atributos">${atributos}</ul>
      ${itens.length ? `<p class="aprim">${itens.join(' · ')}</p>` : ''}
    </div>`;
  }).join('');
  const equip = f.equipamentos.map((e) => `${e.nome} (${e.tipo} +${e.modificador})`);
  const objetos = estado.objetos.map((o) => J.OBJETOS[o].nome);
  const fr = J.frentes(f);
  const d = J.defesas(f);
  return `
  <section class="personagem" aria-label="Seu personagem">
    <h3>${esc(f.nome)} <span class="nota">o terreno das suas cartas</span></h3>
    <div class="caminhos">${colunas}</div>
    <p class="resumo">
      Lutar ${fr.fisico.ataque} · Convencer ${fr.palavra.ataque} · Fé ${fr.fe.ataque} ·
      ${termoChave('defesa', 'Defesa')} ${d.fisico.defesa} · Defesa da mente ${d.mente.defesa}
      ${equip.length ? `<br>${termoChave('armas', 'Equipamento')}: ${esc(equip.join(', '))} <span class="nota">(limite ${termoChave('limitacao-para-equipamentos', 'pela Força')})</span>` : ''}
      ${objetos.length ? `<br>${termoChave('objeto', 'Objetos')}: ${esc(objetos.join(', '))}` : ''}
    </p>
  </section>`;
}

function telaMesa() {
  return `${barra()}
  <div class="mesa">
    <div class="centro">${cartaDesafio()}${painelAcao()}</div>
    ${mao()}
    ${personagem()}
  </div>`;
}

/* ------------------------------------------------------------------------ */
/* Desfecho                                                                 */
/* ------------------------------------------------------------------------ */

function paraBase64(texto) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(texto))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function telaFim() {
  const b = J.balanco(estado);
  const titulo = { vitoria: 'Travessia completa', parcial: 'Quase lá', derrota: 'Fim da estrada' }[b.fim.tipo];
  const link = `../ficha/#ficha=${paraBase64(JSON.stringify(J.fichaParaExportar(estado)))}`;
  const linhas = estado.historico.map((h) => `<tr><td>${h.cena > J.JOGO.cenas ? 'Final' : h.cena}</td><td>${esc(h.desafio)}</td><td>${h.caminho ? NOME_CAMINHO[h.caminho] : '—'}</td><td>${esc(h.via)}</td><td class="${h.sucesso ? 'ok' : 'ruim'}">${h.sucesso ? 'superado' : 'não'}</td></tr>`).join('');
  const recorde = ler(CHAVE_RECORDE);
  const novo = !recorde || b.renome > recorde.renome;
  if (novo && b.renome > 0) gravar(CHAVE_RECORDE, { renome: b.renome, origem: J.ORIGENS[estado.origem].nome });
  return `
  <section class="desfecho">
    <h1>${titulo}</h1>
    <p class="lema">${esc(b.fim.motivo)}</p>
    <p class="renome">Renome <b>${b.renome}</b>${novo && b.renome > 0 ? ' · seu melhor até agora' : ''}</p>
    <p>${esc(estado.ficha.nome)} terminou como <b>${esc(b.nivel)}</b> (${b.gastos} pontos). Caminhos: Corpo ${b.caminhos.corpo}, Mente ${b.caminhos.mente}, Espírito ${b.caminhos.espirito}.</p>
    <div class="tabela"><table>
      <thead><tr><th>Cena</th><th>Desafio</th><th>Caminho</th><th>Como</th><th>Resultado</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table></div>
    <p class="botoes">
      <button type="button" class="primario" data-acao="novo">Jogar de novo</button>
      <a class="botao" href="${link}">Abrir o personagem na ficha digital</a>
    </p>
  </section>`;
}

/* ------------------------------------------------------------------------ */
/* Laço                                                                     */
/* ------------------------------------------------------------------------ */

function render() {
  if (estado?.fase === 'fim') tela = 'fim';
  raiz.innerHTML = tela === 'inicio' ? telaInicio() : tela === 'fim' ? telaFim() : telaMesa();
  botaoRecomecar.hidden = tela !== 'mesa';
  aposRender();
}

raiz.addEventListener('change', (e) => {
  if (e.target.dataset.acao === 'insistir') insistir = e.target.checked;
});

raiz.addEventListener('click', (e) => {
  const el = e.target.closest('button[data-acao]');
  if (!el || el.disabled) return;
  const { acao, id } = el.dataset;
  const rolarTopo = ['continuar', 'origem', 'novo', 'enfrentar'].includes(acao);
  try {
    if (acao === 'origem') { estado = J.novoJogo({ origem: id }); tela = 'mesa'; insistir = false; }
    else if (acao === 'novo') { estado = null; tela = 'inicio'; }
    else if (acao === 'jogar') J.jogarCarta(estado, id);
    else if (acao === 'trocar') J.trocarCarta(estado, id);
    else if (acao === 'treinar') J.treinar(estado, id);
    else if (acao === 'enfrentar') J.enfrentar(estado);
    else if (acao === 'testar') J.resolverTeste(estado, { abordagem: id, insistir });
    else if (acao === 'agir') J.agir(estado, id);
    else if (acao === 'continuar') { J.continuar(estado); insistir = false; }
    else return;
  } catch (erro) {
    console.warn(erro);
  }
  render();
  if (rolarTopo) window.scrollTo({ top: 0, behavior: 'smooth' });
});

botaoRecomecar.addEventListener('click', () => {
  if (confirm('Abandonar a travessia e voltar ao começo?')) { estado = null; tela = 'inicio'; render(); }
});

render();
