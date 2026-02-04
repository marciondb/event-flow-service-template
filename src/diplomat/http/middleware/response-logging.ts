import type { FastifyRequest, FastifyReply } from "fastify"
import { logger } from "@infrastructure/logger"
import { getRequestDuration } from "./request-timing"

/**
 * Logs HTTP responses with status code and duration.
 * Use together with requestLoggingMiddleware for complete request/response logging.
 *
 * @param request - The Fastify request object
 * @param reply - The Fastify reply object
 * @returns void
 */
export function responseLoggingMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): void {
    const duration = getRequestDuration(request)

    logger.info("HTTP Response", {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        duration,
    })
}
