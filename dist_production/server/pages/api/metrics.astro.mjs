import { g as getMetrics } from "../../assets/metrics-DjHhW9eo.js";
import { renderers } from "../../renderers.mjs";
const GET = async () => {
  try {
    const metrics = await getMetrics();
    return new Response(metrics, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8"
      }
    });
  } catch (error) {
    return new Response("Error generating metrics", { status: 500 });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
