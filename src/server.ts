/**
 * EventFlow Service Entry Point
 *
 * This is the main entry point for the service.
 * Replace this placeholder with actual service initialization.
 */
import "dotenv/config"
import { logger } from "@infrastructure/logger";


function main(): number {
    logger.info("🚀 EventFlow Service starting...")
    return 0;
}

// TODO: Initialize service components
// import fastify from "fastify"
// import { requestLoggingMiddleware } from "@diplomat/http/middleware/request-logging"
// import { responseLoggingMiddleware } from "@diplomat/http/middleware/response-logging"

// const app = fastify({ logger: false })

// // Registra os middlewares
// app.addHook("onRequest", requestLoggingMiddleware)
// app.addHook("onResponse", responseLoggingMiddleware)

// // Suas rotas...
// app.get("/health", async () => ({ status: "ok" }))

// await app.listen({ port: 3000 })

main();
export {};
