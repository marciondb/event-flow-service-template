import type { FastifyInstance } from "fastify"

export function httpServer(app: FastifyInstance): void {
    app.get("/health", () => ({ status: "ok" }))
}
