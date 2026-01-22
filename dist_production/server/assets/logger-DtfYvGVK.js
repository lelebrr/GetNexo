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
export {
  logger as l
};
