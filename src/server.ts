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
import {fastifyCors} from "@fastify/cors"
import { serializerCompiler,
    validatorCompiler,
    jsonSchemaTransform,
    type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { fastifySwagger } from "@fastify/swagger"
import { fastify } from "fastify"
import { requestLoggingMiddleware } from "@diplomat/http/middleware/request-logging"
import { responseLoggingMiddleware } from "@diplomat/http/middleware/response-logging"
import { httpServer } from "@diplomat/http/http_server"

const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
    origin: "true",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "EventFlow Service",
            description: "EventFlow Service",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifyHelmet, {
    global: true,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
        }
    }
})

app.addHook("onRequest", requestLoggingMiddleware)
app.addHook("onResponse", responseLoggingMiddleware)

app.register(httpServer)

app.get("/documentation/json", () => app.swagger())
app.get("/documentation/yaml", () => app.swagger({ yaml: true }))

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
