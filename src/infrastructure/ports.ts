export interface LogMeta {
    cid?: string
    [key: string]: unknown
}

export interface Logger {
    debug(message: string, meta?: LogMeta): void
    info(message: string, meta?: LogMeta): void
    warn(message: string, meta?: LogMeta): void
    error(message: string, meta?: LogMeta): void
}

export interface LogInfo {
    level: string
    message: string
    timestamp: string
    service: string
    cid?: string
    [key: string]: unknown
}
