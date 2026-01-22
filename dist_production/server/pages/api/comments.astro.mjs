import { v as verifyToken } from "../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../renderers.mjs";
const comments = /* @__PURE__ */ new Map();
async function get(req) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const projectComments = comments.get(projectId) || [];
  return new Response(JSON.stringify(projectComments), {
    headers: { "Content-Type": "application/json" }
  });
}
async function post(req) {
  const cookies = req.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/auth_token=([^;]+)/);
  if (!tokenMatch) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = tokenMatch[1];
  const user = verifyToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { projectId, text } = await req.json();
    if (!projectId || !text) {
      return new Response(JSON.stringify({ error: "Project ID and text required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const comment = {
      id: Date.now().toString(),
      projectId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const projectComments = comments.get(projectId) || [];
    projectComments.push(comment);
    comments.set(projectId, projectComments);
    if (global.io) {
      global.io.to(`project-${projectId}`).emit("new-comment", comment);
    }
    return new Response(JSON.stringify(comment), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
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
