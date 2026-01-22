import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v as verifyToken } from "../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../renderers.mjs";
const POST = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Token não fornecido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Token inválido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Tipo de conteúdo inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "Arquivo não fornecido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Tipo de arquivo não permitido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split(".").pop()}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (file.type.startsWith("image/")) {
      await sharp(buffer).resize(1200, 1200, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(filePath);
    } else {
      fs.writeFileSync(filePath, buffer);
    }
    const fileUrl = `/uploads/${fileName}`;
    return new Response(JSON.stringify({
      success: true,
      fileUrl,
      fileName,
      size: buffer.length
    }), {
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
const GET = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Token não fornecido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Token inválido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      return new Response(JSON.stringify({ files: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const files = fs.readdirSync(uploadDir).map((file) => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        url: `/uploads/${file}`,
        size: stats.size,
        createdAt: stats.birthtime
      };
    });
    return new Response(JSON.stringify({ files }), {
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
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
