import { f as createComponent, n as renderHead, l as renderScript, h as addAttribute, r as renderTemplate } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
const $$Feriados = createComponent(async ($$result, $$props, $$slots) => {
  const feriadosData = await fetch("/data/feriados.json").then((r) => r.json());
  await fetch("/data/feriados-config.json").then((r) => r.json());
  function calculaCarnaval(ano) {
    const pascoa = calculaPascoa(ano);
    const carnaval = new Date(pascoa);
    carnaval.setDate(carnaval.getDate() - 47);
    return carnaval.toISOString().slice(0, 10);
  }
  function calculaPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = (h + l - 7 * m + 114) % 31 + 1;
    return new Date(ano, mes - 1, dia);
  }
  function calculaCorpus(ano) {
    const pascoa = calculaPascoa(ano);
    const corpus = new Date(pascoa);
    corpus.setDate(corpus.getDate() + 60);
    return corpus.toISOString().slice(0, 10);
  }
  function blackFriday(ano) {
    const nov = new Date(ano, 10, 1);
    const diaSemana = nov.getDay();
    const ultimaSexta = new Date(nov);
    ultimaSexta.setDate(nov.getDate() + (5 - diaSemana + 26) % 7);
    return ultimaSexta.toISOString().slice(0, 10);
  }
  function segundoDomingo(mes, ano) {
    const primeiroDia = new Date(ano, mes, 1);
    const primeiroDomingo = new Date(primeiroDia);
    primeiroDomingo.setDate(primeiroDia.getDate() + (7 - primeiroDia.getDay()));
    const segundoDomingo2 = new Date(primeiroDomingo);
    segundoDomingo2.setDate(primeiroDomingo.getDate() + 7);
    return segundoDomingo2.toISOString().slice(0, 10);
  }
  function terceiroQuintaNovembro(ano) {
    const nov = new Date(ano, 10, 1);
    const primeiraQuinta = new Date(nov);
    primeiraQuinta.setDate(nov.getDate() + (4 - nov.getDay() + 7) % 7);
    const terceiraQuinta = new Date(primeiraQuinta);
    terceiraQuinta.setDate(primeiraQuinta.getDate() + 14);
    return terceiraQuinta.toISOString().slice(0, 10);
  }
  function terceiraSegundaAbril(ano) {
    const abr = new Date(ano, 3, 1);
    const primeiraSegunda = new Date(abr);
    primeiraSegunda.setDate(abr.getDate() + (1 - abr.getDay() + 7) % 7);
    const terceiraSegunda = new Date(primeiraSegunda);
    terceiraSegunda.setDate(primeiraSegunda.getDate() + 14);
    return terceiraSegunda.toISOString().slice(0, 10);
  }
  function sextaAntesPrimavera(ano) {
    const primavera = new Date(ano, 8, 22);
    if (primavera.getDay() === 5) primavera.setDate(primavera.getDate() - 7);
    while (primavera.getDay() !== 5) primavera.setDate(primavera.getDate() - 1);
    return primavera.toISOString().slice(0, 10);
  }
  function variavelOrgulho(ano) {
    return `${ano}-06-28`;
  }
  function calculaDataFeriado(feriado, ano = (/* @__PURE__ */ new Date()).getFullYear()) {
    switch (feriado.data) {
      case "variavel_carnaval":
        return calculaCarnaval(ano);
      case "variavel_pascoa":
        return calculaPascoa(ano).toISOString().slice(0, 10);
      case "variavel_corpus":
        return calculaCorpus(ano);
      case "variavel_blackfriday":
        return blackFriday(ano);
      case "segundo_domingo_maio":
        return segundoDomingo(4, ano);
      case "segundo_domingo_agosto":
        return segundoDomingo(7, ano);
      case "segundo_domingo_setembro":
        return segundoDomingo(8, ano);
      case "primeiro_domingo_julho":
        return segundoDomingo(6, ano);
      case "terceira_quinta_novembro":
        return terceiroQuintaNovembro(ano);
      case "terceira_segunda_abril":
        return terceiraSegundaAbril(ano);
      case "sexta_antes_primavera":
        return sextaAntesPrimavera(ano);
      case "variavel_orgulho":
        return variavelOrgulho(ano);
      default:
        return feriado.data;
    }
  }
  return renderTemplate`<html lang="pt-BR" data-astro-cid-bb3dtdgr> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Painel Feriados - GetNexo Admin</title><meta name="description" content="Controle dos efeitos festivos do site GetNexo">${renderHead()}</head> <body data-astro-cid-bb3dtdgr> <header class="cyber-header" data-astro-cid-bb3dtdgr> <h1 class="cyber-title" data-astro-cid-bb3dtdgr>🎯 PAINEL FERIADOS GETNEXO</h1> <p class="cyber-subtitle" data-astro-cid-bb3dtdgr>Controle Total dos Efeitos Festivos • Calendário Vivo do Site</p> </header> <main style="padding: 2rem;" data-astro-cid-bb3dtdgr> <div class="controls" data-astro-cid-bb3dtdgr> <button id="activate-all" class="control-btn" data-astro-cid-bb3dtdgr>⚡ ATIVAR TODOS</button> <button id="deactivate-all" class="control-btn secondary" data-astro-cid-bb3dtdgr>🚫 DESATIVAR TODOS</button> <button id="save-config" class="control-btn" style="background: linear-gradient(45deg, #00ff88, var(--neon-blue));" data-astro-cid-bb3dtdgr>
💾 SALVAR CONFIGURAÇÃO
</button> </div> <div class="feriados-table" data-astro-cid-bb3dtdgr> <div class="table-header" data-astro-cid-bb3dtdgr>
CONTROLE DOS EFEITOS FESTIVOS • ${feriadosData.feriados.length} FERIADOS CONFIGURADOS
</div> ${feriadosData.feriados.map((feriado, index) => renderTemplate`<div class="feriado-row"${addAttribute(feriado.nome, "data-feriado")} data-astro-cid-bb3dtdgr> <div class="feriado-name" data-astro-cid-bb3dtdgr>${feriado.nome}</div> <div class="feriado-date" data-astro-cid-bb3dtdgr> ${feriado.data.startsWith("variavel") || feriado.data.includes("_") ? renderTemplate`<span class="variable-badge" data-astro-cid-bb3dtdgr>VARIÁVEL</span>` : feriado.data} ${feriado.data.startsWith("variavel") && renderTemplate`<div style="font-size: 0.7rem; margin-top: 0.2rem; color: var(--text-muted);" data-astro-cid-bb3dtdgr> ${calculaDataFeriado(feriado)} </div>`} </div> <div class="feriado-lang" data-astro-cid-bb3dtdgr> <div data-astro-cid-bb3dtdgr>${feriado.idiomas.pt}</div> <div style="font-size: 0.7rem; color: var(--text-muted);" data-astro-cid-bb3dtdgr>
EN/ES/FR disponíveis
</div> </div> <div class="feriado-effect" data-astro-cid-bb3dtdgr>${feriado.efeito.replace(/_/g, " ")}</div> <div class="toggle-switch"${addAttribute(feriado.nome, "data-feriado")} data-astro-cid-bb3dtdgr> <div class="toggle-slider" data-astro-cid-bb3dtdgr></div> </div> <div data-astro-cid-bb3dtdgr> <button class="preview-btn"${addAttribute(feriado.efeito, "data-effect")} data-astro-cid-bb3dtdgr>
👁️ PREVIEW
</button> </div> </div>`)} </div> </main> ${renderScript($$result, "/home/lele/usenexo/getnexo-site/src/pages/admin/feriados.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/feriados.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/feriados.astro";
const $$url = "/admin/feriados";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Feriados,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
