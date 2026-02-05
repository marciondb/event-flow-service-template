import type { FastifyRequest, FastifyReply } from "fastify"
import { logger } from "@infrastructure/logger"
import { generateCorrelationId, setCorrelationId } from "@infrastructure/correlation"
import { setRequestStartTime } from "./request-timing"

/**
 * Logs incoming HTTP requests and sets up correlation ID.
 *
 * Extracts correlation ID from 'x-correlation-id' header or generates a new one.
 * Sets the correlation ID for the current request context.
 * Records request start time for duration tracking.
 *
 * @param request - The Fastify request object
 * @param reply - The Fastify reply object
 * @returns void
 */
export function requestLoggingMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    setRequestStartTime(request)
    
    const correlationHeader = request.headers["x-correlation-id"]
    const parentCid = typeof correlationHeader === "string" 
        ? correlationHeader 
        : undefined
    
    const cid = generateCorrelationId(parentCid)
    
    setCorrelationId(cid)
    void reply.header("x-correlation-id", cid)

    logger.info("←", {
        method: request.method,
        url: request.url,
        ip: request.ip,
    })
    
    return Promise.resolve()
}
