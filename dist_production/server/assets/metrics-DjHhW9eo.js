import promClient from "prom-client";
import "./logger-DtfYvGVK.js";
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });
uptimeGauge.set(process.uptime());
function getMetrics() {
  return register.metrics();
}
export {
  getMetrics as g
};
