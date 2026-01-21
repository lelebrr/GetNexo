import winston from 'winston';

// Configuração do logger com diferentes níveis
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'getnexo-site' },
    transports: [
        // Log de erros em arquivo separado
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // Log geral
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

// Em desenvolvimento, log também no console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Função helper para logs estruturados
logger.business = (message, meta = {}) => {
    logger.info(message, { ...meta, level: 'business' });
};

logger.performance = (message, meta = {}) => {
    logger.info(message, { ...meta, level: 'performance' });
};

logger.audit = (message, meta = {}) => {
    logger.info(message, { ...meta, level: 'audit', timestamp: new Date().toISOString() });
};

export default logger;