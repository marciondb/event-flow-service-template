import winston from "winston"
import type { Logger, LogMeta, LogInfo } from "./interfaces"
import { getCorrelationId } from "./correlation"
import { config } from "./config"


class WinstonLogger implements Logger {
    private winston = winston.createLogger({
        level: config.logLevel,
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            config.nodeEnv === "development"
                ? winston.format.combine(
                    winston.format.colorize(),
                    winston.format.printf((info) => {
                        const logInfo = info as unknown as LogInfo
                        const { level, message, timestamp, service, cid, ...meta } = logInfo
                        
                        const cidShort = cid !== undefined ? cid.slice(0, 8) : "--------"
                        
                        const method = meta.method as string | undefined
                        const url = meta.url as string | undefined
                        const statusCode = meta.statusCode as number | undefined
                        const durationMs = meta.durationMs as number | undefined
                        
                        if (method !== undefined && url !== undefined && statusCode !== undefined) {
                            const durationStr = durationMs !== undefined ? ` ${String(durationMs)}ms` : ""
                            return `${timestamp} ${level} [${service}] cid=${cidShort} ${method} ${url} ${String(statusCode)}${durationStr}`
                        }
                        
                        const metaStr = Object.keys(meta).length > 0 
                            ? `\n${JSON.stringify(meta, null, 2)}` 
                            : ""
                        
                        return `${timestamp} ${level} [${service}] [${cidShort}] ${message}${metaStr}`
                    })
                )
                : winston.format.json()
        ),
        transports: [
            new winston.transports.Console(),
        ],
        defaultMeta: {
            service: config.serviceName,
        },
    })
    
    private addCorrelationId(meta?: LogMeta): LogMeta {
        const correlationId = getCorrelationId()
        return {
            ...meta,
            ...((correlationId !== undefined) && { cid: correlationId })
        }
    }
    
    debug(message: string, meta?: LogMeta): void {
        this.winston.debug(message, this.addCorrelationId(meta))
    }

    info(message: string, meta?: LogMeta): void {
        this.winston.info(message, this.addCorrelationId(meta))
    }

    warn(message: string, meta?: LogMeta): void {
        this.winston.warn(message, this.addCorrelationId(meta))
    }

    error(message: string, meta?: LogMeta): void {
        this.winston.error(message, this.addCorrelationId(meta))
    }
}
export const logger: Logger = new WinstonLogger()
