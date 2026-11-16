/** Preenche o rodapé (`#rodape`) com as versões e o link para as novidades. */
import { VERSAO } from '../motor/versao.js';

const rodape = document.getElementById('rodape');
if (rodape) {
  const [a, m, d] = VERSAO.data.split('-');
  rodape.innerHTML = `
    <span>Sistema Clip</span>
    <span>Regras <b>v${VERSAO.regras}</b></span>
    <span>Ficha e manual <b>v${VERSAO.ferramentas}</b> · ${d}/${m}/${a}</span>
    <a href="../novidades/">Novidades (changelog)</a>
    <a href="https://github.com/marcelobritonet/clip-rpg">Código no GitHub</a>`;
}
