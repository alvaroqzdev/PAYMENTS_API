const { createLogger, format, transports } = require('winston')

const devFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
        return `${timestamp} [${level}] ${message}${metaStr}`
    })
)

const prodFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
)

const logger = createLogger({
    level: 'info',

    transports: [
        new transports.Console({ format: devFormat }),
        new transports.File({ filename: 'logs/app.log', format: prodFormat })
    ]
})

module.exports = logger