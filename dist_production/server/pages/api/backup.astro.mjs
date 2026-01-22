import fs from "fs";
import path from "path";
import { renderers } from "../../renderers.mjs";
async function get({ request }) {
  try {
    const backupData = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.1",
      data: {
        globalConfigs: {},
        userConfigs: {},
        systemStats: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version
        }
      }
    };
    try {
      const globalConfigsPath = path.join(process.cwd(), "globalConfigs.json");
      if (fs.existsSync(globalConfigsPath)) {
        backupData.data.globalConfigs = JSON.parse(fs.readFileSync(globalConfigsPath, "utf8"));
      }
    } catch (error) {
    }
    try {
      const userConfigsPath = path.join(process.cwd(), "userConfigs.json");
      if (fs.existsSync(userConfigsPath)) {
        backupData.data.userConfigs = JSON.parse(fs.readFileSync(userConfigsPath, "utf8"));
      }
    } catch (error) {
    }
    return new Response(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="getnexo_backup_' + (/* @__PURE__ */ new Date()).toISOString().split("T")[0] + '.json"'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Backup failed: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function post({ request }) {
  try {
    const backupData = await request.json();
    if (!backupData.data) {
      return new Response(JSON.stringify({ error: "Invalid backup data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (backupData.data.globalConfigs) {
      fs.writeFileSync("globalConfigs.json", JSON.stringify(backupData.data.globalConfigs, null, 2));
    }
    if (backupData.data.userConfigs) {
      fs.writeFileSync("userConfigs.json", JSON.stringify(backupData.data.userConfigs, null, 2));
    }
    return new Response(JSON.stringify({ success: true, message: "Backup restored successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Restore failed: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get,
  post
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
