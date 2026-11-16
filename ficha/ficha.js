import * as clip from '../motor/clip.js';
import { aposRender } from './dicas.js';

/* ------------------------------------------------------------------------ */
/* Estado e persistência                                                    */
/* ------------------------------------------------------------------------ */

const CHAVE_FICHA = 'clip:ficha';
const CHAVE_OPCOES = 'clip:opcoes';

const ler = (chave) => {
  try { return JSON.parse(localStorage.getItem(chave)); } catch { return null; }
};
const gravar = (chave, valor) => {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* sem armazenamento */ }
};

/** Completa uma ficha lida de fora com os campos que faltarem. */
function normalizar(dados) {
  const base = clip.novaFicha();
  if (!dados || typeof dados !== 'object') return base;
  return {
    ...base,
    ...dados,
    atributos: { ...base.atributos, ...dados.atributos },
    aprimoramentos: { ...base.aprimoramentos, ...dados.aprimoramentos },
    atual: { ...base.atual, ...dados.atual },
    pericias: Array.isArray(dados.pericias) ? dados.pericias : [],
    equipamentos: Array.isArray(dados.equipamentos) ? dados.equipamentos : [],
    antecedentes: Array.isArray(dados.antecedentes) ? dados.antecedentes : [],
  };
}

const paraBase64 = (texto) => btoa(String.fromCharCode(...new TextEncoder().encode(texto)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deBase64 = (b64) => new TextDecoder().decode(
  Uint8Array.from(atob(b64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
);

function fichaInicial() {
  const m = location.hash.match(/^#ficha=(.+)$/);
  if (m) {
    try {
      const f = normalizar(JSON.parse(deBase64(m[1])));
      history.replaceState(null, '', location.pathname);
      setTimeout(() => avisar('Ficha carregada do link.'), 0);
      return f;
    } catch { /* link quebrado: segue para a ficha salva */ }
  }
  return normalizar(ler(CHAVE_FICHA));
}

const opcoesSalvas = ler(CHAVE_OPCOES) ?? {};
const estado = {
  ficha: fichaInicial(),
  modoJogador: !!opcoesSalvas.modoJogador,
  propostos: !!opcoesSalvas.propostos,
  propria: { nome: '', requisitos: [], aplica: '' },
  mesa: {
    teste: { alvo: 'forca', dificuldade: 4, objeto: 0, insistir: false },
    ataque: { distancia: 'curta', defesa: 2, armadura: 0, escudo: 0, resistencia: 0 },
    defesa: { ataque: 6, arma: 0 },
    magia: { pericia: '', pm: 1 },
  },
  registro: [],
};

const salvar = () => gravar(CHAVE_FICHA, estado.ficha);
const salvarOpcoes = () => gravar(CHAVE_OPCOES, { modoJogador: estado.modoJogador, propostos: estado.propostos });

function mudar(fn) {
  fn(estado.ficha);
  salvar();
  render();
}

/* ------------------------------------------------------------------------ */
/* Pedaços de HTML                                                          */
/* ------------------------------------------------------------------------ */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * Texto que leva ao trecho do manual. Ao passar o mouse, mostra a dica do
 * glossário (por padrão a da própria âncora; `chave` troca por outra).
 */
const ref = (ancora, texto, chave = ancora) =>
  ancora ? `<a class="ref" href="../manual/#${ancora}" data-manual="${ancora}" data-dica="${chave}">${texto}</a>` : texto;

/** Selo "§ regra" que leva ao trecho do manual, também com dica. */
const selo = (ancora, rotulo = 'regra') =>
  `<a class="ref-icone" href="../manual/#${ancora}" data-manual="${ancora}" data-dica="${ancora}" aria-label="${rotulo}: ver no manual">§ ${rotulo}</a>`;

/** Rótulo sem link, mas com dica. */
const termo = (chave, texto) => `<span class="termo" data-dica="${chave}" tabindex="0">${texto}</span>`;

const pips = (n, max = 5) =>
  `<span class="pips" aria-hidden="true">${Array.from({ length: Math.max(max, n) }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;

function passo(tipo, id, nivel, { max = Infinity, nome = '' } = {}) {
  const k = `${tipo}:${id}`;
  return `<span class="passo">
    <button type="button" data-acao="menos" data-tipo="${tipo}" data-id="${esc(id)}" data-foco="${esc(k)}:-" ${nivel <= 0 ? 'disabled' : ''} aria-label="Diminuir ${esc(nome)}">−</button>
    <span class="nivel" aria-label="Nível">${nivel}</span>
    <button type="button" data-acao="mais" data-tipo="${tipo}" data-id="${esc(id)}" data-foco="${esc(k)}:+" ${nivel >= max ? 'disabled' : ''} aria-label="Aumentar ${esc(nome)}" ${nivel >= max && max !== Infinity ? `title="Limitado a ${max}"` : ''}>+</button>
  </span>`;
}

const nomeCaminho = { corpo: 'Caminho do Corpo', mente: 'Caminho da Mente', espirito: 'Caminho do Espírito' };

/* ------------------------------------------------------------------------ */
/* Seções                                                                   */
/* ------------------------------------------------------------------------ */

function secaoIdentidade(f) {
  return `<section class="cartao">
    <h2>Personagem ${selo('construcao-do-personagem', 'construção')}</h2>
    <div class="grade-identidade">
      <label class="campo">Nome<input type="text" data-campo="nome" data-foco="nome" value="${esc(f.nome)}" placeholder="Quem é?"></label>
      <label class="campo">Jogador<input type="text" data-campo="jogador" data-foco="jogador" value="${esc(f.jogador)}"></label>
      <label class="campo">Classe ou conceito<input type="text" data-campo="conceito" data-foco="conceito" value="${esc(f.conceito)}" placeholder="Guerreira, ladrão, sacerdote…"></label>
    </div>
  </section>`;
}

function secaoPontos(f) {
  const g = clip.pontosGastos(f);
  const total = f.pontosDeEvolucao;
  const escala = Math.max(total, g.total, 1);
  const pct = (v) => `${(100 * v) / escala}%`;
  const restante = total - g.total;
  const idx = clip.NIVEIS_INICIAIS.findIndex((n) => total >= n.min && (n.max == null || total <= n.max));
  return `<section class="cartao">
    <h2>Pontos de Evolução ${selo(clip.SECOES.distribuicao, 'distribuição')} ${selo(clip.SECOES.experiencia, 'experiência')}</h2>
    <div class="pontos">
      <label class="campo">${ref(clip.SECOES.distribuicao, 'Nível inicial')}
        <select data-acao="nivel-inicial" data-foco="nivel-inicial">
          ${clip.NIVEIS_INICIAIS.map((n, i) => `<option value="${i}" ${i === idx ? 'selected' : ''}>${n.nome} (${n.max == null ? `${n.min}+` : `${n.min}–${n.max}`} pts)</option>`).join('')}
        </select>
      </label>
      <label class="campo">Pontos disponíveis<input type="number" min="0" max="200" data-num="pontosDeEvolucao" data-foco="pontos" value="${total}"></label>
      <div class="medidor">
        <div class="linha"><span>Gastos <span class="grande">${g.total}</span> de ${total}</span>
          <span style="color:var(${restante < 0 ? '--erro' : restante === 0 ? '--ok' : '--ink-2'})">${restante < 0 ? `${-restante} a mais` : restante === 0 ? 'todos usados' : `${restante} sobrando`}</span></div>
        <div class="barra ${restante < 0 ? 'excedido' : ''}" role="img" aria-label="${g.total} de ${total} pontos gastos">
          <span class="b-atr" style="width:${pct(g.atributos)}"></span>
          <span class="b-apr" style="width:${pct(g.aprimoramentos)}"></span>
          <span class="b-per" style="width:${pct(g.pericias)}"></span>
        </div>
        <div class="legenda"><span><i class="b-atr" style="background:var(--accent)"></i>Atributos ${g.atributos}</span>
          <span><i style="background:color-mix(in srgb,var(--accent) 60%,var(--surface-2))"></i>Aprimoramentos ${g.aprimoramentos}</span>
          <span><i style="background:color-mix(in srgb,var(--accent) 30%,var(--surface-2))"></i>Perícias ${g.pericias}</span></div>
      </div>
    </div>
    <p class="resumo-linha">Custo provisório: 1 ponto por nível. O manual ainda não define custos nem experiência.</p>
  </section>`;
}

function secaoProblemas(f) {
  const lista = clip.validar(f);
  const itens = lista.length
    ? lista.map((p) => `<li class="${p.nivel}"><span>${esc(p.mensagem)}</span>${p.manual ? selo(p.manual) : ''}</li>`).join('')
    : '<li class="ok"><span>A ficha está dentro das regras.</span></li>';
  return `<section class="cartao"><h2>Conferência</h2><ul class="problemas">${itens}</ul></section>`;
}

function secaoCaminhos(f) {
  const vc = clip.valoresCaminhos(f);
  const dom = clip.caminhoDominante(f);
  const desempate = dom.empate
    ? `<div class="desempate"><span>Empate entre Caminhos. Qual é o ${termo('caminho-principal', 'Caminho principal')}?</span>
        ${dom.empate.map((id) => `<label class="chave"><input type="radio" name="principal" data-acao="principal" value="${id}" ${dom.id === id ? 'checked' : ''}> ${nomeCaminho[id]}</label>`).join('')}</div>`
    : '';
  const cartoes = clip.CAMINHOS.map((c) => {
    const atributos = c.atributos.map((atr) => {
      const n = clip.nivelDe(f, atr);
      const aprs = Object.entries(clip.APRIMORAMENTOS).filter(
        ([id, a]) => a.atributo === atr && (!a.proposto || estado.propostos || clip.nivelDe(f, id) > 0),
      );
      const temPropostos = Object.values(clip.APRIMORAMENTOS).some((a) => a.atributo === atr && a.proposto);
      const linhasApr = aprs.map(([id, a]) => {
        const na = clip.nivelDe(f, id);
        const nome = a.proposto
          ? `${esc(a.nome)}<span class="tag">proposto</span><span class="efeito">${esc(a.efeito)}</span>`
          : ref(clip.ancora(id), esc(a.nome));
        return `<div class="linha-nivel apr ${na > n ? 'invalido' : ''}"><span class="nome">${nome}</span>${passo('aprimoramentos', id, na, { max: n, nome: a.nome })}</div>`;
      }).join('');
      const vazio = !aprs.length && temPropostos
        ? '<div class="vazio-apr">O manual ainda não tem Aprimoramentos aqui. Ligue “Aprimoramentos propostos” no topo para testar a sugestão.</div>'
        : '';
      return `<div class="atributo">
        <div class="linha-nivel"><span class="nome">${ref(clip.ancora(atr), clip.ATRIBUTOS[atr].nome)}</span>${pips(n)}${passo('atributos', atr, n, { nome: clip.ATRIBUTOS[atr].nome })}</div>
        ${linhasApr}${vazio}
      </div>`;
    }).join('');
    return `<section class="cartao caminho" data-c="${c.id}">
      <h2>${ref(c.manual, nomeCaminho[c.id])}${dom.id === c.id ? '<span class="tag">principal</span>' : ''}<span class="valor-caminho">valor <b>${vc[c.id]}</b></span></h2>
      ${atributos}
    </section>`;
  }).join('');
  return `${desempate}<div class="caminhos">${cartoes}</div>`;
}

function secaoValores(f) {
  const v = clip.valores(f);
  const simples = ['ataqueCurta', 'ataqueLonga', 'defesa'].map((k) => `<div class="valor">
      <span class="titulo">${ref(v[k].manual, v[k].nome)}</span>
      <span class="numero">${v[k].valor}</span>
      <span class="formula">${esc(v[k].formula)}</span>
    </div>`).join('');
  const recursos = ['vida', 'magia', 'sanidade'].map((k) => {
    const max = v[k].valor;
    const atual = Math.min(estado.ficha.atual[k] ?? max, max);
    const pct = max > 0 ? (100 * Math.max(0, atual)) / max : 0;
    return `<div class="valor" data-v="${k}">
      <span class="titulo">${ref(v[k].manual, v[k].nome)}</span>
      <span class="numero so-mestre">${atual}<small> / ${max}</small></span>
      <span class="estado so-jogador">${clip.descrever(k, atual, max)}</span>
      <div class="barra"><span style="width:${pct}%"></span></div>
      <span class="formula so-mestre">${esc(v[k].formula)}</span>
      <div class="controle">
        <button type="button" data-acao="recurso" data-r="${k}" data-d="-1" data-foco="r:${k}:-" aria-label="Perder 1 de ${v[k].nome}">−1</button>
        <button type="button" data-acao="recurso" data-r="${k}" data-d="1" data-foco="r:${k}:+" aria-label="Recuperar 1 de ${v[k].nome}">+1</button>
        <button type="button" data-acao="recurso-cheio" data-r="${k}" data-foco="r:${k}:c" ${atual >= max ? 'disabled' : ''}>Restaurar</button>
      </div>
    </div>`;
  }).join('');
  return `<section class="cartao">
    <h2>Valores Resumidos ${selo(clip.SECOES.valores)}
      <span class="sub so-jogador">Modo jogador: o estado aparece em palavras, sem números, para não virar meta-jogo.</span></h2>
    <div class="valores">${simples}${recursos}</div>
  </section>`;
}

/** Opções de requisitos para Perícias próprias. */
function candidatosRequisito(f) {
  const atr = Object.entries(clip.ATRIBUTOS).map(([id, a]) => [id, a.nome]);
  const apr = Object.entries(clip.APRIMORAMENTOS)
    .filter(([id, a]) => !a.proposto || estado.propostos || clip.nivelDe(f, id) > 0)
    .map(([id, a]) => [id, a.nome]);
  const per = f.pericias.map((p) => [p.id, p.nome]);
  return { atr, apr, per };
}

function secaoPericias(f) {
  const linhas = f.pericias.map((p, i) => {
    const max = clip.maximoPericia(f, p);
    const chips = p.requisitos.map((r) => {
      const a = clip.ancora(r);
      return `<span class="chip">${a ? ref(a, esc(clip.nomeDe(r, f))) : esc(clip.nomeDe(r, f))} ${clip.nivelDe(f, r)}</span>`;
    }).join('');
    const nomeP = p.magica || clip.PERICIAS_EXEMPLO.some((x) => x.id === p.id && x.manual)
      ? ref(clip.ancora(p.id), esc(p.nome))
      : clip.PERICIAS_EXEMPLO.some((x) => x.id === p.id)
        ? ref('pericias', esc(p.nome), p.id)
        : esc(p.nome);
    return `<tr class="${p.nivel > max ? 'invalido' : ''}">
      <td class="largo"><span class="nome">${nomeP}</span>${p.magica ? '<span class="tag">mágica</span>' : ''}</td>
      <td class="largo"><div class="chips">${chips}</div></td>
      <td>${passo('pericias', p.id, p.nivel, { max, nome: p.nome })} <span class="formula" style="font-size:.8rem;color:var(--ink-2)">máx ${max}</span></td>
      <td>${p.magica ? '<span class="vazio">—</span>' : `<select data-lista="pericias" data-i="${i}" data-campo="aplica" data-foco="per:${i}:aplica" aria-label="Onde ${esc(p.nome)} soma">
        <option value="">Não soma em combate</option>
        <option value="curta" ${p.aplica === 'curta' ? 'selected' : ''}>Soma no Ataque Curto</option>
        <option value="longa" ${p.aplica === 'longa' ? 'selected' : ''}>Soma no Ataque Longo</option>
        <option value="defesa" ${p.aplica === 'defesa' ? 'selected' : ''}>Soma na Defesa</option>
      </select>`}</td>
      <td><button type="button" class="remover" data-acao="remover" data-lista="pericias" data-i="${i}" aria-label="Remover ${esc(p.nome)}">✕</button></td>
    </tr>`;
  }).join('');
  const usados = new Set(f.pericias.map((p) => p.id));
  const opt = (lista) => lista.filter((p) => !usados.has(p.id)).map((p) => `<option value="${p.id}">${esc(p.nome)} (${p.requisitos.map((r) => clip.nomeDe(r)).join(', ')})</option>`).join('');
  const c = candidatosRequisito(f);
  const caixa = ([id, nome]) => `<label class="chave"><input type="checkbox" data-acao="propria-req" value="${esc(id)}" ${estado.propria.requisitos.includes(id) ? 'checked' : ''}> ${esc(nome)}</label>`;
  return `<section class="cartao">
    <h2>Perícias ${selo(clip.SECOES.pericias)} ${selo(clip.SECOES.limitesMagia, 'mágicas')}
      <span class="sub">O nível nunca passa do menor requisito.</span></h2>
    ${f.pericias.length ? `<table class="itens"><thead><tr><th>Perícia</th><th>Requisitos</th><th>Nível</th><th>${termo('em-combate', 'Em combate')}</th><th></th></tr></thead><tbody>${linhas}</tbody></table>` : '<p class="vazio">Nenhuma Perícia ainda.</p>'}
    <div class="adicionar">
      <select id="catalogo" aria-label="Perícia do manual">
        <optgroup label="Exemplos do manual">${opt(clip.PERICIAS_EXEMPLO.filter((p) => !p.magica))}</optgroup>
        <optgroup label="Perícias Mágicas">${opt(clip.PERICIAS_EXEMPLO.filter((p) => p.magica))}</optgroup>
      </select>
      <button type="button" data-acao="add-pericia">Adicionar</button>
    </div>
    <details class="propria" ${estado.propria.nome || estado.propria.requisitos.length ? 'open' : ''}>
      <summary>Criar uma Perícia própria</summary>
      <label class="campo" style="margin-top:10px">Nome<input type="text" data-propria="nome" data-foco="propria-nome" value="${esc(estado.propria.nome)}" placeholder="Ex.: Navegação"></label>
      <div class="requisitos"><strong style="width:100%;font-size:.85rem;color:var(--ink-2)">Atributos</strong>${c.atr.map(caixa).join('')}</div>
      <div class="requisitos"><strong style="width:100%;font-size:.85rem;color:var(--ink-2)">Aprimoramentos</strong>${c.apr.map(caixa).join('')}</div>
      ${c.per.length ? `<div class="requisitos"><strong style="width:100%;font-size:.85rem;color:var(--ink-2)">Perícias</strong>${c.per.map(caixa).join('')}</div>` : ''}
      <button type="button" data-acao="add-propria" ${estado.propria.nome.trim() && estado.propria.requisitos.length ? '' : 'disabled'}>Criar Perícia</button>
    </details>
  </section>`;
}

function secaoEquipamentos(f) {
  const lim = clip.limiteEquipamento(f);
  const usado = f.equipamentos.reduce((s, e) => s + Math.max(0, +e.modificador || 0), 0);
  const linhas = f.equipamentos.map((e, i) => `<tr>
    <td class="largo"><input type="text" data-lista="equipamentos" data-i="${i}" data-campo="nome" data-foco="eq:${i}:nome" value="${esc(e.nome)}" placeholder="Espada, cota de malha…" aria-label="Nome do equipamento"></td>
    <td><select data-lista="equipamentos" data-i="${i}" data-campo="tipo" data-foco="eq:${i}:tipo" aria-label="Tipo">
      ${['arma', 'armadura', 'escudo', 'outro'].map((t) => `<option value="${t}" ${e.tipo === t ? 'selected' : ''}>${t[0].toUpperCase() + t.slice(1)}</option>`).join('')}
    </select></td>
    <td><input type="number" min="0" max="20" data-lista="equipamentos" data-i="${i}" data-campo="modificador" data-foco="eq:${i}:mod" value="${e.modificador}" aria-label="Modificador"></td>
    <td><button type="button" class="remover" data-acao="remover" data-lista="equipamentos" data-i="${i}" aria-label="Remover equipamento">✕</button></td>
  </tr>`).join('');
  return `<section class="cartao">
    <h2>Armas e Equipamentos ${selo(clip.SECOES.armas, 'armas')} ${selo(clip.SECOES.equipamentos, 'limite')}</h2>
    ${f.equipamentos.length ? `<table class="itens"><thead><tr><th>Item</th><th>Tipo</th><th>Mod.</th><th></th></tr></thead><tbody>${linhas}</tbody></table>` : '<p class="vazio">Nenhum equipamento.</p>'}
    <p class="resumo-linha" style="color:var(${usado > lim ? '--erro' : '--ink-2'})">Modificadores em uso: <b>${usado}</b> de ${lim} (Força${clip.REGRAS.manipulacaoAumentaLimite ? ' + Manipulação de Peso' : ''}). Itens com modificador 0 não contam.</p>
    <div class="adicionar"><button type="button" data-acao="add-equip">Adicionar equipamento</button></div>
  </section>`;
}

function secaoAntecedentes(f) {
  const a = clip.pontosAntecedentes(f);
  const linhas = f.antecedentes.map((x, i) => `<tr>
    <td class="largo"><input type="text" list="sugestoes-antecedentes" data-lista="antecedentes" data-i="${i}" data-campo="nome" data-foco="an:${i}:nome" value="${esc(x.nome)}" aria-label="Antecedente"></td>
    <td><select data-lista="antecedentes" data-i="${i}" data-campo="tipo" data-foco="an:${i}:tipo" aria-label="Tipo">
      <option value="bom" ${x.tipo === 'bom' ? 'selected' : ''}>Bom (custa)</option>
      <option value="mau" ${x.tipo === 'mau' ? 'selected' : ''}>Mau (concede)</option>
    </select></td>
    <td><input type="number" min="0" max="10" data-lista="antecedentes" data-i="${i}" data-campo="nivel" data-foco="an:${i}:nivel" value="${x.nivel}" aria-label="Nível"></td>
    <td><button type="button" class="remover" data-acao="remover" data-lista="antecedentes" data-i="${i}" aria-label="Remover antecedente">✕</button></td>
  </tr>`).join('');
  return `<section class="cartao">
    <h2>Antecedentes ${selo(clip.SECOES.regrasAntecedentes)}</h2>
    ${f.antecedentes.length ? `<table class="itens"><thead><tr><th>Antecedente</th><th>Tipo</th><th>Nível</th><th></th></tr></thead><tbody>${linhas}</tbody></table>` : '<p class="vazio">Nenhum Antecedente.</p>'}
    <datalist id="sugestoes-antecedentes">${[...clip.ANTECEDENTES_EXEMPLO.bons, ...clip.ANTECEDENTES_EXEMPLO.maus].map((n) => `<option value="${esc(n)}">`).join('')}</datalist>
    <p class="resumo-linha">Pontos: <b>${a.inicial}</b> do menor Caminho + <b>${a.ganhos}</b> de Maus Antecedentes − <b>${a.gastos}</b> em Bons = <b style="color:var(${a.disponivel < 0 ? '--erro' : '--ink'})">${a.disponivel}</b> sobrando. Teto: ${a.teto}.</p>
    <div class="adicionar"><button type="button" data-acao="add-antecedente">Adicionar antecedente</button></div>
  </section>`;
}

function secaoMesa(f) {
  const m = estado.mesa;
  const alvos = [
    ['Atributos', Object.entries(clip.ATRIBUTOS).map(([id, a]) => [id, a.nome])],
    ['Aprimoramentos', Object.entries(clip.APRIMORAMENTOS).filter(([id, a]) => !a.proposto || estado.propostos || clip.nivelDe(f, id) > 0).map(([id, a]) => [id, a.nome])],
    ['Perícias', f.pericias.map((p) => [p.id, p.nome])],
  ];
  const caminhoDoAlvo = caminhoDe(m.teste.alvo);
  const magicas = f.pericias.filter((p) => p.magica);
  if (!magicas.some((p) => p.id === m.magia.pericia)) m.magia.pericia = magicas[0]?.id ?? '';
  const nivelMagia = m.magia.pericia ? clip.nivelDe(f, m.magia.pericia) : 0;
  const faixa = clip.DIFICULDADES.find((d) => m.teste.dificuldade >= d.min && m.teste.dificuldade <= d.max);

  const registro = estado.registro.length
    ? `<ul class="registro">${estado.registro.map((r) => `<li>${r}</li>`).join('')}</ul>
       <div class="adicionar"><button type="button" data-acao="limpar-registro">Limpar registro</button></div>`
    : '';

  return `<section class="cartao mesa-cartao">
    <h2>Mesa de rolagens <span class="sub">Usa o motor de regras com os valores desta ficha.</span></h2>
    <div class="mesa">
      <div class="rolagem">
        <h3>Teste ${selo(clip.SECOES.testes)}</h3>
        <label class="campo">O que testar
          <select data-mesa="teste.alvo" data-foco="m:alvo">${alvos.map(([g, l]) => l.length ? `<optgroup label="${g}">${l.map(([id, n]) => `<option value="${esc(id)}" ${m.teste.alvo === id ? 'selected' : ''}>${esc(n)} (${clip.nivelDe(f, id)})</option>`).join('')}</optgroup>` : '').join('')}</select>
        </label>
        <div class="lado">
          <label class="campo">${ref(clip.SECOES.dificuldades, 'Dificuldade')}<input type="number" min="1" max="40" data-mesa="teste.dificuldade" data-foco="m:dif" value="${m.teste.dificuldade}"></label>
          <label class="campo">${termo('objeto', 'Objeto (mod.)')}<input type="number" min="0" max="10" data-mesa="teste.objeto" data-foco="m:obj" value="${m.teste.objeto}"></label>
        </div>
        <span class="formula" style="font-size:.85rem;color:var(--ink-2)">${faixa ? faixa.nome : 'Fora da tabela'} · rola ${Math.max(1, clip.nivelDe(f, m.teste.alvo) + m.teste.objeto)}D6${clip.nivelDe(f, m.teste.alvo) + m.teste.objeto <= 0 ? ' − 2' : ''}</span>
        <label class="check"><input type="checkbox" data-mesa="teste.insistir" data-foco="m:ins" ${m.teste.insistir ? 'checked' : ''} ${caminhoDoAlvo === 'corpo' ? '' : 'disabled'}> ${termo('insistir', 'Insistir')}, pagando com Vida (só Corpo)</label>
        <button type="button" class="primario" data-acao="rolar-teste">Rolar teste</button>
      </div>

      <div class="rolagem">
        <h3>Atacar ${selo(clip.SECOES.sequencia)}</h3>
        <label class="campo">Distância
          <select data-mesa="ataque.distancia" data-foco="m:dist">
            <option value="curta" ${m.ataque.distancia === 'curta' ? 'selected' : ''}>Curta (corpo a corpo)</option>
            <option value="longa" ${m.ataque.distancia === 'longa' ? 'selected' : ''}>Longa (arremesso, projétil)</option>
          </select>
        </label>
        <div class="lado">
          <label class="campo">Defesa do alvo<input type="number" min="0" max="40" data-mesa="ataque.defesa" data-foco="m:def" value="${m.ataque.defesa}"></label>
          <label class="campo">Resistência do alvo<input type="number" min="0" max="20" data-mesa="ataque.resistencia" data-foco="m:res" value="${m.ataque.resistencia}"></label>
          <label class="campo">Armadura do alvo<input type="number" min="0" max="20" data-mesa="ataque.armadura" data-foco="m:arm" value="${m.ataque.armadura}"></label>
          <label class="campo">Escudo do alvo<input type="number" min="0" max="20" data-mesa="ataque.escudo" data-foco="m:esc" value="${m.ataque.escudo}"></label>
        </div>
        <button type="button" class="primario" data-acao="rolar-ataque">Rolar ataque</button>
      </div>

      <div class="rolagem">
        <h3>Defender ${selo(clip.SECOES.sequencia)}</h3>
        <div class="lado">
          <label class="campo">Valor de Ataque recebido<input type="number" min="0" max="60" data-mesa="defesa.ataque" data-foco="m:vatk" value="${m.defesa.ataque}"></label>
          <label class="campo">Arma do atacante<input type="number" min="0" max="20" data-mesa="defesa.arma" data-foco="m:darma" value="${m.defesa.arma}"></label>
        </div>
        <span class="formula" style="font-size:.85rem;color:var(--ink-2)">Já com o dado do atacante. Sua Defesa, armadura, escudo e Resistência vêm da ficha; o dano sai da sua Vida.</span>
        <button type="button" class="primario" data-acao="rolar-defesa">Rolar defesa</button>
      </div>

      <div class="rolagem">
        <h3>Magia ${selo(clip.SECOES.magiaSuplemento, 'magia')} ${selo(clip.SECOES.limitesMagia, 'limites')}</h3>
        ${magicas.length ? `
          <label class="campo">Perícia Mágica
            <select data-mesa="magia.pericia" data-foco="m:mag">${magicas.map((p) => `<option value="${esc(p.id)}" ${p.id === m.magia.pericia ? 'selected' : ''}>${esc(p.nome)} (${p.nivel})</option>`).join('')}</select>
          </label>
          <label class="campo">PM que quer gastar<input type="number" min="1" max="30" data-mesa="magia.pm" data-foco="m:pm" value="${m.magia.pm}"></label>
          <span class="formula" style="font-size:.85rem;color:var(--ink-2)">Descreva a magia como quiser: o efeito vale até ${nivelMagia} PM (o nível da Perícia).</span>
          <button type="button" class="primario" data-acao="rolar-magia">Lançar</button>`
        : '<p class="vazio">Adicione uma Perícia Mágica para lançar magias.</p>'}
      </div>
    </div>
    ${registro}
  </section>`;
}

function secaoNotas(f) {
  return `<section class="cartao">
    <h2>História e notas ${selo('conteudo-e-o-rei', 'conteúdo é o rei')}</h2>
    <textarea data-campo="notas" data-foco="notas" rows="5" style="width:100%" placeholder="Background, motivações, aliados, segredos…">${esc(f.notas)}</textarea>
  </section>`;
}

/* ------------------------------------------------------------------------ */
/* Render                                                                   */
/* ------------------------------------------------------------------------ */

const main = document.getElementById('ficha');

function render() {
  const foco = document.activeElement?.dataset?.foco;
  const f = estado.ficha;
  document.body.classList.toggle('modo-jogador', estado.modoJogador);
  document.getElementById('modo-jogador').checked = estado.modoJogador;
  document.getElementById('propostos').checked = estado.propostos;
  document.title = f.nome ? `${f.nome} · Ficha do Sistema Clip` : 'Ficha do Sistema Clip';
  main.innerHTML = [
    secaoIdentidade(f),
    secaoPontos(f),
    secaoProblemas(f),
    secaoCaminhos(f),
    secaoValores(f),
    secaoPericias(f),
    secaoEquipamentos(f),
    secaoAntecedentes(f),
    secaoMesa(f),
    secaoNotas(f),
  ].join('');
  if (foco) {
    const el = main.querySelector(`[data-foco="${CSS.escape(foco)}"]`);
    if (el && !el.disabled) el.focus({ preventScroll: true });
  }
  aposRender();
}

/* ------------------------------------------------------------------------ */
/* Rolagens                                                                 */
/* ------------------------------------------------------------------------ */

function caminhoDe(id) {
  if (clip.ATRIBUTOS[id]) return clip.ATRIBUTOS[id].caminho;
  if (clip.APRIMORAMENTOS[id]) return clip.ATRIBUTOS[clip.APRIMORAMENTOS[id].atributo].caminho;
  return null;
}

const dadosHtml = (lista) => lista.map((d) => `<span class="dado">${d}</span>`).join('');

function registrar(html) {
  estado.registro.unshift(html);
  estado.registro.length = Math.min(estado.registro.length, 12);
}

function ajustarRecurso(k, delta) {
  const max = clip.valores(estado.ficha)[k].valor;
  const atual = Math.min(estado.ficha.atual[k] ?? max, max);
  const novo = Math.max(0, Math.min(max, atual + delta));
  estado.ficha.atual[k] = novo >= max ? null : novo;
}

const textoCritico = (c) => (c === 'sucesso' ? ' · <b>Sucesso crítico!</b>' : c === 'falha' ? ' · <b>Falha crítica!</b>' : '');

function rolarTeste() {
  const f = estado.ficha;
  const t = estado.mesa.teste;
  const r = clip.testar({
    nivel: clip.nivelDe(f, t.alvo),
    dificuldade: t.dificuldade,
    objeto: t.objeto,
    insistir: t.insistir,
    caminho: caminhoDe(t.alvo),
  });
  if (r.insistiu) ajustarRecurso('vida', -r.custoVida);
  const nome = clip.nomeDe(t.alvo, f);
  registrar(`Teste de ${esc(nome)} (Dificuldade ${t.dificuldade}): ${dadosHtml(r.dados)}${r.dados.length === 1 && clip.nivelDe(f, t.alvo) + t.objeto <= 0 ? ' − 2' : ''} = <b>${r.total}</b> →
    <span class="res ${r.sucesso ? 'sucesso' : 'falha'}">${r.sucesso ? 'sucesso' : 'falha'}</span>
    ${r.insistiu ? `<div class="det">Insistiu: pagou ${r.custoVida} de Vida para completar.</div>` : ''}
    ${!r.sucesso && t.insistir && !r.podeInsistir ? '<div class="det">Insistir só vale para o Caminho do Corpo e com nível acima de 0.</div>' : ''}`);
}

function descreverAtaque(r, titulo) {
  const passos = r.passos.filter((p) => p.valor !== 0).map((p) => `${p.nome} ${p.valor >= 0 ? '+' : '−'}${Math.abs(p.valor)}`).join(', ');
  return `${titulo}: Ataque <b>${r.valorAtaque}</b>${r.dadoAtaque ? ` (dado ${r.dadoAtaque})` : ''} contra Defesa <b>${r.valorDefesa}</b> (dado ${r.dadoDefesa}) →
    <span class="res ${r.acertou ? 'sucesso' : 'falha'}">${r.acertou ? `acertou, ${r.dano} de dano` : 'defendido'}</span>
    ${textoCritico(r.critico.ataque)}${r.acertou ? `<div class="det">${passos}</div>` : ''}`;
}

function rolarAtaque() {
  const f = estado.ficha;
  const a = estado.mesa.ataque;
  const v = clip.valores(f);
  const arma = Math.max(0, ...f.equipamentos.filter((e) => e.tipo === 'arma').map((e) => +e.modificador || 0));
  const r = clip.resolverAtaque({
    ataque: a.distancia === 'longa' ? v.ataqueLonga.valor : v.ataqueCurta.valor,
    defesa: a.defesa,
    arma,
    armadura: a.armadura,
    escudo: a.escudo,
    resistencia: a.resistencia,
  });
  registrar(descreverAtaque(r, `Ataque à ${a.distancia === 'longa' ? 'longa' : 'curta'} distância`));
}

function rolarDefesa() {
  const f = estado.ficha;
  const d = estado.mesa.defesa;
  const melhor = (tipo) => Math.max(0, ...f.equipamentos.filter((e) => e.tipo === tipo).map((e) => +e.modificador || 0));
  const r = clip.resolverAtaque({
    ataque: d.ataque,
    dadoAtaque: 0,
    defesa: clip.valores(f).defesa.valor,
    arma: d.arma,
    armadura: melhor('armadura'),
    escudo: melhor('escudo'),
    resistencia: clip.nivelDe(f, 'resistencia'),
  });
  if (r.acertou) ajustarRecurso('vida', -r.dano);
  registrar(`${descreverAtaque(r, 'Defesa')}${r.acertou ? '<div class="det">Descontado da sua Vida.</div>' : ''}${textoCritico(r.critico.defesa)}`);
}

function rolarMagia() {
  const f = estado.ficha;
  const m = estado.mesa.magia;
  const v = clip.valores(f);
  const disponivel = Math.min(f.atual.magia ?? v.magia.valor, v.magia.valor);
  const nivel = clip.nivelDe(f, m.pericia);
  const r = clip.lancarMagia(f, { pericia: m.pericia, pm: m.pm, pmDisponivel: disponivel });
  const nome = esc(clip.nomeDe(m.pericia, f));
  if (r.falhou) {
    registrar(`${nome}: <span class="res falha">não sai</span><div class="det">${esc(r.motivo)}</div>`);
    return;
  }
  ajustarRecurso('magia', -r.gasto);
  const limite = r.limitado
    ? `<div class="det">Pediu ${m.pm} PM, mas só ${r.gasto} valem: ${r.teto === nivel ? `a Perícia está no nível ${nivel}` : `restam ${disponivel} PM`}. A forma é livre; o efeito, não.</div>`
    : '';
  const ataque = r.valorAtaque != null ? ` · Valor de Ataque <b>${r.valorAtaque}</b> (dado ${r.dado} + ${r.gasto})` : '';
  registrar(`${nome}: gastou ${r.gasto} PM, ${termo('potencia-magica', 'potência')} <b>${r.potencia}</b>${ataque}${limite}`);
}

/* ------------------------------------------------------------------------ */
/* Eventos                                                                  */
/* ------------------------------------------------------------------------ */

const lerNum = (v, min = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(min, n) : min;
};

function definirMesa(caminho, valor) {
  const [grupo, campo] = caminho.split('.');
  estado.mesa[grupo][campo] = valor;
}

main.addEventListener('click', (e) => {
  const b = e.target.closest('[data-acao]');
  if (!b || b.tagName === 'SELECT' || b.tagName === 'INPUT') return;
  const { acao, tipo, id, lista, i } = b.dataset;
  switch (acao) {
    case 'mais':
    case 'menos':
      mudar((f) => {
        const d = acao === 'mais' ? 1 : -1;
        if (tipo === 'pericias') {
          const p = f.pericias.find((x) => x.id === id);
          p.nivel = Math.max(0, p.nivel + d);
        } else {
          f[tipo][id] = Math.max(0, (f[tipo][id] ?? 0) + d);
        }
      });
      break;
    case 'recurso':
      mudar(() => ajustarRecurso(b.dataset.r, +b.dataset.d));
      break;
    case 'recurso-cheio':
      mudar((f) => { f.atual[b.dataset.r] = null; });
      break;
    case 'remover':
      mudar((f) => { f[lista].splice(+i, 1); });
      break;
    case 'add-pericia': {
      const idSel = document.getElementById('catalogo').value;
      const modelo = clip.PERICIAS_EXEMPLO.find((p) => p.id === idSel);
      if (modelo) mudar((f) => f.pericias.push({ id: modelo.id, nome: modelo.nome, requisitos: [...modelo.requisitos], nivel: 0, aplica: null, magica: !!modelo.magica }));
      break;
    }
    case 'add-propria': {
      const nome = estado.propria.nome.trim();
      if (!nome || !estado.propria.requisitos.length) break;
      mudar((f) => {
        let novoId = `p-${clip.slug(nome) || 'pericia'}`;
        for (let n = 2; f.pericias.some((p) => p.id === novoId); n++) novoId = `p-${clip.slug(nome)}-${n}`;
        f.pericias.push({ id: novoId, nome, requisitos: [...estado.propria.requisitos], nivel: 0, aplica: null });
        estado.propria = { nome: '', requisitos: [], aplica: '' };
      });
      break;
    }
    case 'add-equip':
      mudar((f) => f.equipamentos.push({ nome: '', tipo: 'arma', modificador: 0 }));
      break;
    case 'add-antecedente':
      mudar((f) => f.antecedentes.push({ nome: '', tipo: 'bom', nivel: 1 }));
      break;
    case 'rolar-teste': rolarTeste(); salvar(); render(); break;
    case 'rolar-ataque': rolarAtaque(); render(); break;
    case 'rolar-defesa': rolarDefesa(); salvar(); render(); break;
    case 'rolar-magia': rolarMagia(); salvar(); render(); break;
    case 'limpar-registro': estado.registro = []; render(); break;
    default:
  }
});

// Texto: atualiza sem redesenhar, para não perder o cursor.
main.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.campo && !el.dataset.lista) {
    estado.ficha[el.dataset.campo] = el.value;
    if (el.dataset.campo === 'nome') document.title = el.value ? `${el.value} · Ficha do Sistema Clip` : 'Ficha do Sistema Clip';
    salvar();
  } else if (el.dataset.lista && el.type === 'text') {
    estado.ficha[el.dataset.lista][+el.dataset.i][el.dataset.campo] = el.value;
    salvar();
  } else if (el.dataset.propria === 'nome') {
    estado.propria.nome = el.value;
    const botao = main.querySelector('[data-acao="add-propria"]');
    if (botao) botao.disabled = !(el.value.trim() && estado.propria.requisitos.length);
  }
});

// Números, seleções e caixas: atualiza e redesenha.
main.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.num) {
    mudar((f) => { f[el.dataset.num] = lerNum(el.value); });
  } else if (el.dataset.acao === 'nivel-inicial') {
    const n = clip.NIVEIS_INICIAIS[+el.value];
    mudar((f) => { f.pontosDeEvolucao = n.max ?? n.min + 4; });
  } else if (el.dataset.acao === 'principal') {
    mudar((f) => { f.caminhoPrincipal = el.value; });
  } else if (el.dataset.lista && el.type !== 'text') {
    mudar((f) => {
      const item = f[el.dataset.lista][+el.dataset.i];
      item[el.dataset.campo] = el.type === 'number' ? lerNum(el.value) : el.value || null;
    });
  } else if (el.dataset.acao === 'propria-req') {
    const reqs = new Set(estado.propria.requisitos);
    if (el.checked) reqs.add(el.value); else reqs.delete(el.value);
    estado.propria.requisitos = [...reqs];
    render();
  } else if (el.dataset.mesa) {
    const valor = el.type === 'checkbox' ? el.checked : el.type === 'number' ? lerNum(el.value) : el.value;
    definirMesa(el.dataset.mesa, valor);
    render();
  }
});

document.getElementById('modo-jogador').addEventListener('change', (e) => {
  estado.modoJogador = e.target.checked;
  salvarOpcoes();
  render();
});
document.getElementById('propostos').addEventListener('change', (e) => {
  estado.propostos = e.target.checked;
  salvarOpcoes();
  render();
});

/* Menu "Ficha" */

function exemplo() {
  const f = clip.novaFicha();
  Object.assign(f, {
    nome: 'Ilka da Ponte Velha',
    jogador: '',
    conceito: 'Guerreira de estrada que reza para não precisar lutar',
    pontosDeEvolucao: 15,
    notas: 'Cresceu cobrando pedágio na ponte do pai. Saiu de casa quando a ponte caiu e ninguém quis reconstruir.',
  });
  Object.assign(f.atributos, { forca: 3, destreza: 2, fisico: 2, percepcao: 1, vontade: 1, fe: 1 });
  Object.assign(f.aprimoramentos, { ataqueCorporal: 2, reflexo: 1, resistencia: 1, saude: 1 });
  f.pericias = [
    { id: 'sobrevivencia', nome: 'Sobrevivência', requisitos: ['fisico', 'percepcao'], nivel: 0, aplica: null },
  ];
  f.equipamentos = [
    { nome: 'Espada', tipo: 'arma', modificador: 2 },
    { nome: 'Escudo de madeira', tipo: 'escudo', modificador: 1 },
    { nome: 'Gibão de couro', tipo: 'armadura', modificador: 0 },
  ];
  f.antecedentes = [{ nome: 'Inimigo', tipo: 'mau', nivel: 1 }, { nome: 'Aliado', tipo: 'bom', nivel: 1 }];
  return f;
}

function avisar(texto) {
  const t = document.getElementById('aviso');
  t.textContent = texto;
  t.hidden = false;
  clearTimeout(avisar.timer);
  avisar.timer = setTimeout(() => { t.hidden = true; }, 2400);
}

document.querySelector('.menu-itens').addEventListener('click', async (e) => {
  const acao = e.target.closest('[data-acao]')?.dataset.acao;
  if (!acao) return;
  e.target.closest('details').open = false;
  const f = estado.ficha;
  if (acao === 'nova') {
    if (!confirm('Apagar esta ficha e começar outra?')) return;
    estado.ficha = clip.novaFicha();
    estado.registro = [];
    salvar();
    render();
  } else if (acao === 'exemplo') {
    if ((f.nome || clip.pontosGastos(f).total) && !confirm('Trocar esta ficha pelo exemplo?')) return;
    estado.ficha = exemplo();
    salvar();
    render();
  } else if (acao === 'link') {
    const url = `${location.origin}${location.pathname}#ficha=${paraBase64(JSON.stringify(f))}`;
    try {
      await navigator.clipboard.writeText(url);
      avisar('Link copiado. Quem abrir recebe uma cópia desta ficha.');
    } catch {
      prompt('Copie o link da ficha:', url);
    }
  } else if (acao === 'exportar') {
    const blob = new Blob([JSON.stringify(f, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${clip.slug(f.nome) || 'personagem'}.clip.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  } else if (acao === 'imprimir') {
    window.print();
  }
});

document.getElementById('importar').addEventListener('change', async (e) => {
  const arquivo = e.target.files[0];
  e.target.value = '';
  document.querySelector('.menu').open = false;
  if (!arquivo) return;
  try {
    estado.ficha = normalizar(JSON.parse(await arquivo.text()));
    salvar();
    render();
    avisar('Ficha importada.');
  } catch {
    avisar('Esse arquivo não é uma ficha do Clip.');
  }
});

/* Painel do manual */

const pagina = document.querySelector('.pagina');
const painel = document.getElementById('painel');
const frame = document.getElementById('painel-frame');
const abrirAba = document.getElementById('painel-abrir');

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-manual]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  const ancora = a.dataset.manual;
  painel.hidden = false;
  pagina.classList.add('com-painel');
  abrirAba.href = `../manual/#${ancora}`;
  try {
    if (frame.dataset.pronto) {
      // Zera antes para que clicar de novo na mesma âncora também role a página.
      frame.contentWindow.location.hash = '';
      frame.contentWindow.location.hash = ancora;
      return;
    }
  } catch { /* outra origem: recarrega */ }
  frame.src = `../manual/#${ancora}`;
});
frame.addEventListener('load', () => { frame.dataset.pronto = '1'; });
document.getElementById('painel-fechar').addEventListener('click', () => {
  painel.hidden = true;
  pagina.classList.remove('com-painel');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !painel.hidden) document.getElementById('painel-fechar').click();
});

render();
