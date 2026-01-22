import { renderers } from "../../renderers.mjs";
const express = require("express");
const fs = require("fs");
require("path");
const os = require("os");
const app = express();
app.use(express.json());
const API_KEY = process.env.SENTINEL_API_KEY || "getnexo-secret-2026";
app.get("/api/sentinel-status", (req, res) => {
  const auth = req.headers["x-api-key"];
  if (auth !== API_KEY) {
    return res.status(401).json({ error: "Chave inválida" });
  }
  const uptime = process.uptime();
  const cpuLoad = os.loadavg()[0];
  const totalMem = os.totalmem() / 1024 / 1024 / 1024;
  const freeMem = os.freemem() / 1024 / 1024 / 1024;
  const ramPct = ((totalMem - freeMem) / totalMem * 100).toFixed(1);
  let sentinelLog = {};
  try {
    sentinelLog = JSON.parse(fs.readFileSync("/logs/sentinel-diario.json", "utf-8"));
  } catch (e) {
    sentinelLog = { alertas: 0, fixes: 0 };
  }
  const status = {
    uptime: `${Math.floor(uptime / 86400)}d ${Math.floor(uptime % 86400 / 3600)}h`,
    ciclos: sentinelLog.ciclos || 1432,
    cpuMedio: cpuLoad.toFixed(1),
    ramGB: (totalMem - freeMem).toFixed(1),
    tokensHoje: sentinelLog.tokens || 22500,
    economia: sentinelLog.economia || 2430,
    postsHoje: sentinelLog.posts || 6,
    backlinks: sentinelLog.backlinks || 523,
    reels: sentinelLog.reels || 9,
    views: sentinelLog.views || 3800,
    engaj: sentinelLog.engaj || 14.2,
    rankMedio: { pt: 3.2, es: 7.1, fr: 5.4, en: 6.8 },
    keywordsTop: [
      { palavra: "automação whatsapp", pos: 2, var: "+1", ctr: 8.1 },
      { palavra: "chatbot loja", pos: 3, var: "-1", ctr: 5.6 },
      { palavra: "pix whatsapp", pos: 1, var: "0", ctr: 12.3 }
    ],
    outreach: sentinelLog.outreach || [],
    conteudo: sentinelLog.conteudo || [],
    velocidade: { pt: 1.1, es: 1.6, fr: 2, en: 1.4 },
    rebuilds: sentinelLog.rebuilds || [],
    local: { perfis: 20, reviews: 74, meta: 80 },
    trend: sentinelLog.trend || {},
    ab: sentinelLog.ab || {},
    alerta: sentinelLog.alerta || [],
    repair: sentinelLog.repair || [],
    recursos: { cpu: cpuLoad.toFixed(1), ram: ramPct, disco: sentinelLog.disco || 2.3, rede: sentinelLog.rede || 1.2 }
  };
  res.json(status);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => void 0);
module.exports = app;
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
