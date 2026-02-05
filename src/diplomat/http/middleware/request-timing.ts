import type { FastifyRequest } from "fastify"

const requestTimings = new WeakMap<FastifyRequest, number>()

export function setRequestStartTime(request: FastifyRequest): void {
    requestTimings.set(request, Date.now())
}

/**
 * Gets the duration of a request in milliseconds.
 * Returns 0 if the request start time is not set.
 * @param request - The Fastify request object
 * @returns The duration of the request in milliseconds
 */
export function getRequestDuration(request: FastifyRequest): number {
    const startTime = requestTimings.get(request)

    if (startTime === undefined) {
        return 0
    }

    return Date.now() - startTime
}
