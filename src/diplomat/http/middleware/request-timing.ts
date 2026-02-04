import type { FastifyRequest } from "fastify"

const requestTimings = new WeakMap<FastifyRequest, number>()

export function setRequestStartTime(request: FastifyRequest): void {
    requestTimings.set(request, Date.now())
}

export function getRequestDuration(request: FastifyRequest): number {
    const startTime = requestTimings.get(request)
    
    if (startTime === undefined) {
        return 0
    }
    
    return Date.now() - startTime
}
