import { v as verifyToken, j as hasPermission } from "../../assets/auth-bbOfVkaL.js";
import fs from "fs/promises";
import path from "path";
import { c as cachingEngine } from "../../assets/caching-engine-CPK5heYG.js";
import { renderers } from "../../renderers.mjs";
const GLOBAL_CONFIGS_PATH = path.join(process.cwd(), "globalConfigs.json");
const USER_CONFIGS_PATH = path.join(process.cwd(), "userConfigs.json");
const CONFIG_CACHE_LAYER = "configs";
try {
  cachingEngine.createCacheLayer(CONFIG_CACHE_LAYER, { type: "memory", ttl: 3e5 });
} catch (e) {
}
const configSchema = {
  key: { type: "string", required: true, minLength: 1, maxLength: 100 },
  value: { type: "any", required: true },
  type: { type: "string", enum: ["global", "user"], required: true },
  userId: { type: "number", required: false },
  // Required if type === 'user'
  description: { type: "string", required: false, maxLength: 500 }
};
function validateConfig(config) {
  const errors = [];
  for (const [field, rules] of Object.entries(configSchema)) {
    const value = config[field];
    if (rules.required && (value === void 0 || value === null)) {
      errors.push(`${field} is required`);
      continue;
    }
    if (value !== void 0 && value !== null) {
      if (rules.type === "string" && typeof value !== "string") {
        errors.push(`${field} must be a string`);
      } else if (rules.type === "number" && typeof value !== "number") {
        errors.push(`${field} must be a number`);
      } else if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(", ")}`);
      } else if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      } else if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }
    }
  }
  if (config.type === "user" && !config.userId) {
    errors.push("userId is required for user configs");
  }
  if (config.type === "global" && config.userId) {
    errors.push("userId should not be set for global configs");
  }
  return errors;
}
async function readConfigs(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}
async function writeConfigs(filePath, configs) {
  await fs.writeFile(filePath, JSON.stringify(configs, null, 2));
}
async function getCachedConfigs(type, userId = null) {
  const cacheKey = userId ? `user_${userId}` : "global";
  return await cachingEngine.get(cacheKey, [CONFIG_CACHE_LAYER]);
}
async function setCachedConfigs(type, configs, userId = null) {
  const cacheKey = userId ? `user_${userId}` : "global";
  await cachingEngine.set(cacheKey, configs, {
    layers: [CONFIG_CACHE_LAYER],
    tags: [type, userId ? `user_${userId}` : "global"]
  });
}
async function clearConfigCache(type, userId = null) {
  const cacheKey = userId ? `user_${userId}` : "global";
  await cachingEngine.delete(cacheKey, [CONFIG_CACHE_LAYER]);
}
const GET = async ({ request, url }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = authHeader.slice(7);
    const user = verifyToken(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!hasPermission(user.permissions, "admin") && !hasPermission(user.permissions, "reseller")) {
      return new Response(JSON.stringify({ error: "Permissão insuficiente" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const searchParams = url.searchParams;
    const type = searchParams.get("type") || "all";
    const userId = searchParams.get("userId") ? parseInt(searchParams.get("userId")) : null;
    const key = searchParams.get("key");
    let configs = {};
    if (type === "global" || type === "all") {
      let globalConfigs = await getCachedConfigs("global");
      if (!globalConfigs) {
        globalConfigs = await readConfigs(GLOBAL_CONFIGS_PATH);
        await setCachedConfigs("global", globalConfigs);
      }
      configs.global = globalConfigs;
    }
    if (type === "user" || type === "all") {
      if (userId || type === "all") {
        if (type === "all") {
          if (!hasPermission(user.permissions, "admin")) {
            return new Response(JSON.stringify({ error: "Apenas admin pode listar todas as configs de usuário" }), {
              status: 403,
              headers: { "Content-Type": "application/json" }
            });
          }
          const userConfigs = await readConfigs(USER_CONFIGS_PATH);
          configs.user = userConfigs;
        } else {
          if (user.id !== userId && !hasPermission(user.permissions, "admin")) {
            return new Response(JSON.stringify({ error: "Não autorizado a acessar configs de outro usuário" }), {
              status: 403,
              headers: { "Content-Type": "application/json" }
            });
          }
          let userConfigs = await getCachedConfigs("user", userId);
          if (!userConfigs) {
            const allUserConfigs = await readConfigs(USER_CONFIGS_PATH);
            userConfigs = allUserConfigs[userId] || {};
            await setCachedConfigs("user", userConfigs, userId);
          }
          configs.user = { [userId]: userConfigs };
        }
      }
    }
    if (key) {
      const filtered = {};
      for (const [configType, typeConfigs] of Object.entries(configs)) {
        filtered[configType] = {};
        for (const [id, userConfig] of Object.entries(typeConfigs)) {
          filtered[configType][id] = {};
          for (const [k, v] of Object.entries(userConfig)) {
            if (k.includes(key)) {
              filtered[configType][id][k] = v;
            }
          }
        }
      }
      configs = filtered;
    }
    return new Response(JSON.stringify({ configs }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = authHeader.slice(7);
    const user = verifyToken(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!hasPermission(user.permissions, "admin") && !hasPermission(user.permissions, "reseller")) {
      return new Response(JSON.stringify({ error: "Permissão insuficiente" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const config = await request.json();
    const validationErrors = validateConfig(config);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({ error: "Dados inválidos", details: validationErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (config.type === "user" && config.userId !== user.id && !hasPermission(user.permissions, "admin")) {
      return new Response(JSON.stringify({ error: "Não autorizado a criar configs para outro usuário" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const newConfig = {
      ...config,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (config.type === "global") {
      const globalConfigs = await readConfigs(GLOBAL_CONFIGS_PATH);
      if (globalConfigs[config.key]) {
        return new Response(JSON.stringify({ error: "Config global já existe" }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
      globalConfigs[config.key] = newConfig;
      await writeConfigs(GLOBAL_CONFIGS_PATH, globalConfigs);
      await clearConfigCache("global");
    } else {
      const userConfigs = await readConfigs(USER_CONFIGS_PATH);
      if (!userConfigs[config.userId]) userConfigs[config.userId] = {};
      if (userConfigs[config.userId][config.key]) {
        return new Response(JSON.stringify({ error: "Config de usuário já existe" }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
      userConfigs[config.userId][config.key] = newConfig;
      await writeConfigs(USER_CONFIGS_PATH, userConfigs);
      await clearConfigCache("user", config.userId);
    }
    return new Response(JSON.stringify({ message: "Config criada com sucesso", config: newConfig }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = authHeader.slice(7);
    const user = verifyToken(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!hasPermission(user.permissions, "admin") && !hasPermission(user.permissions, "reseller")) {
      return new Response(JSON.stringify({ error: "Permissão insuficiente" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const config = await request.json();
    const validationErrors = validateConfig(config);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({ error: "Dados inválidos", details: validationErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (config.type === "user" && config.userId !== user.id && !hasPermission(user.permissions, "admin")) {
      return new Response(JSON.stringify({ error: "Não autorizado a atualizar configs de outro usuário" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const updatedConfig = {
      ...config,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (config.type === "global") {
      const globalConfigs = await readConfigs(GLOBAL_CONFIGS_PATH);
      if (!globalConfigs[config.key]) {
        return new Response(JSON.stringify({ error: "Config global não encontrada" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      updatedConfig.createdAt = globalConfigs[config.key].createdAt;
      globalConfigs[config.key] = updatedConfig;
      await writeConfigs(GLOBAL_CONFIGS_PATH, globalConfigs);
      await clearConfigCache("global");
    } else {
      const userConfigs = await readConfigs(USER_CONFIGS_PATH);
      if (!userConfigs[config.userId] || !userConfigs[config.userId][config.key]) {
        return new Response(JSON.stringify({ error: "Config de usuário não encontrada" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      updatedConfig.createdAt = userConfigs[config.userId][config.key].createdAt;
      userConfigs[config.userId][config.key] = updatedConfig;
      await writeConfigs(USER_CONFIGS_PATH, userConfigs);
      await clearConfigCache("user", config.userId);
    }
    return new Response(JSON.stringify({ message: "Config atualizada com sucesso", config: updatedConfig }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ request, url }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = authHeader.slice(7);
    const user = verifyToken(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!hasPermission(user.permissions, "admin")) {
      return new Response(JSON.stringify({ error: "Apenas admin pode deletar configs" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const searchParams = url.searchParams;
    const type = searchParams.get("type");
    const userId = searchParams.get("userId") ? parseInt(searchParams.get("userId")) : null;
    const key = searchParams.get("key");
    if (!type || !key) {
      return new Response(JSON.stringify({ error: "Parâmetros type e key são obrigatórios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (type === "global") {
      const globalConfigs = await readConfigs(GLOBAL_CONFIGS_PATH);
      if (!globalConfigs[key]) {
        return new Response(JSON.stringify({ error: "Config global não encontrada" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      delete globalConfigs[key];
      await writeConfigs(GLOBAL_CONFIGS_PATH, globalConfigs);
      await clearConfigCache("global");
    } else if (type === "user") {
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId é obrigatório para configs de usuário" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      const userConfigs = await readConfigs(USER_CONFIGS_PATH);
      if (!userConfigs[userId] || !userConfigs[userId][key]) {
        return new Response(JSON.stringify({ error: "Config de usuário não encontrada" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      delete userConfigs[userId][key];
      await writeConfigs(USER_CONFIGS_PATH, userConfigs);
      await clearConfigCache("user", userId);
    } else {
      return new Response(JSON.stringify({ error: "Type deve ser global ou user" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "Config deletada com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
