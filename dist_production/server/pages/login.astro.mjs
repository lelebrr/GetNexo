import { f as createComponent, r as renderTemplate, l as renderScript, n as renderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
/* empty css                                */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="pt-BR" data-astro-cid-sgpqyurt> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Login - GetNexo</title>', `</head> <body data-astro-cid-sgpqyurt> <div class="login-container" data-astro-cid-sgpqyurt> <div class="login-header" data-astro-cid-sgpqyurt> <h1 data-astro-cid-sgpqyurt>🚀 GetNexo</h1> <p data-astro-cid-sgpqyurt>Acesse sua conta</p> </div> <div id="error-message" class="error-message" data-astro-cid-sgpqyurt></div> <div id="success-message" class="success-message" data-astro-cid-sgpqyurt></div> <form id="login-form" data-astro-cid-sgpqyurt> <div class="form-group" data-astro-cid-sgpqyurt> <label for="email" data-astro-cid-sgpqyurt>Email</label> <input type="email" id="email" name="email" placeholder="seu@email.com" required data-astro-cid-sgpqyurt> </div> <div class="form-group" data-astro-cid-sgpqyurt> <label for="password" data-astro-cid-sgpqyurt>Senha</label> <input type="password" id="password" name="password" placeholder="••••••••" required data-astro-cid-sgpqyurt> </div> <button type="submit" class="login-btn" id="login-btn" data-astro-cid-sgpqyurt>
Entrar
</button> </form> <div class="divider" data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>Contas de Demonstração</span> </div> <div class="demo-accounts" data-astro-cid-sgpqyurt> <h3 data-astro-cid-sgpqyurt>👤 Clique para preencher automaticamente:</h3> <div class="demo-account" onclick="(function(){const demoAccounts={admin:{email:'admin@getnexo.local',password:'admin123'},reseller:{email:'revendedor@getnexo.com',password:'reseller123'},client:{email:'cliente@getnexo.com',password:'cliente123'}};const account=demoAccounts.admin;if(account){document.getElementById('email').value=account.email;document.getElementById('password').value=account.password;}})()" data-astro-cid-sgpqyurt> <div class="demo-label" data-astro-cid-sgpqyurt>Admin</div> <div class="demo-creds" data-astro-cid-sgpqyurt>admin@getnexo.local</div> </div> <div class="demo-account" onclick="(function(){const demoAccounts={admin:{email:'admin@getnexo.local',password:'admin123'},reseller:{email:'revendedor@getnexo.com',password:'reseller123'},client:{email:'cliente@getnexo.com',password:'cliente123'}};const account=demoAccounts.reseller;if(account){document.getElementById('email').value=account.email;document.getElementById('password').value=account.password;}})()" data-astro-cid-sgpqyurt> <div class="demo-label" data-astro-cid-sgpqyurt>Revendedor</div> <div class="demo-creds" data-astro-cid-sgpqyurt>revendedor@getnexo.com</div> </div> <div class="demo-account" onclick="(function(){const demoAccounts={admin:{email:'admin@getnexo.local',password:'admin123'},reseller:{email:'revendedor@getnexo.com',password:'reseller123'},client:{email:'cliente@getnexo.com',password:'cliente123'}};const account=demoAccounts.client;if(account){document.getElementById('email').value=account.email;document.getElementById('password').value=account.password;}})()" data-astro-cid-sgpqyurt> <div class="demo-label" data-astro-cid-sgpqyurt>Cliente</div> <div class="demo-creds" data-astro-cid-sgpqyurt>cliente@getnexo.com</div> </div> </div> </div> <!-- Fill Demo Script --> <script src="/fillDemo.js"><\/script> `, " </body> </html>"])), renderHead(), renderScript($$result, "/home/lele/usenexo/getnexo-site/src/pages/login.astro?astro&type=script&index=0&lang.ts"));
}, "/home/lele/usenexo/getnexo-site/src/pages/login.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/login.astro";
const $$url = "/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
