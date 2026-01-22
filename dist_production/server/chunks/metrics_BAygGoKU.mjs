import promClient from "prom-client";
import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "getnexo-site" },
  transports: [
    // Log de erros em arquivo separado
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),
    // Log geral
    new winston.transports.File({
      filename: "logs/combined.log"
    })
  ]
});
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}
logger.business = (message, meta = {}) => {
  logger.info(message, { ...meta, level: "business" });
};
logger.performance = (message, meta = {}) => {
  logger.info(message, { ...meta, level: "performance" });
};
logger.audit = (message, meta = {}) => {
  logger.info(message, { ...meta, level: "audit", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
};
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });
const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in microseconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5]
});
const activeConnections = new promClient.Gauge({
  name: "active_connections",
  help: "Number of active connections"
});
const errorCounter = new promClient.Counter({
  name: "application_errors_total",
  help: "Total number of application errors",
  labelNames: ["type", "endpoint"]
});
const uptimeGauge = new promClient.Gauge({
  name: "application_uptime_seconds",
  help: "Application uptime in seconds"
});
register.registerMetric(httpRequestDuration);
register.registerMetric(activeConnections);
register.registerMetric(errorCounter);
register.registerMetric(uptimeGauge);
uptimeGauge.set(process.uptime());
function incrementError(type, endpoint = "unknown") {
  errorCounter.inc({ type, endpoint });
  logger.error(`Error incremented: ${type} on ${endpoint}`);
}
function getMetrics() {
  return register.metrics();
}
export {
  getMetrics as g,
  incrementError as i,
  logger as l
};
