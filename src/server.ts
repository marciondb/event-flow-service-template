/**
 * EventFlow Service Entry Point
 *
 * This is the main entry point for the service.
 * Replace this placeholder with actual service initialization.
 */
import "dotenv/config"
import { logger } from "@infrastructure/logger"
import { config } from "@infrastructure/config"
import {fastifyHelmet} from "@fastify/helmet"
// import cors from "@fastify/cors"
// import swagger from "@fastify/swagger"
// import { ZodTypeProvider } from "fastify-type-provider-zod"
import { fastify } from "fastify"
import { requestLoggingMiddleware } from "@diplomat/http/middleware/request-logging"
import { responseLoggingMiddleware } from "@diplomat/http/middleware/response-logging"

const app = fastify({ logger: false })

app.register(fastifyHelmet, {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
        }
    }
})

app.addHook("onRequest", requestLoggingMiddleware)
app.addHook("onResponse", responseLoggingMiddleware)

app.get("/health", () => ({ status: "ok" }))

async function main(): Promise<void> {
    logger.info("🚀 EventFlow Service starting...")

    const address = await app.listen({
        port: config.port,
        host: "0.0.0.0"
    })

    logger.info("✅ Server is running", {
        url: address,
        port: config.port
    })
}

main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    logger.error("❌ Failed to start server", { error: message })
    process.exit(1)
})
