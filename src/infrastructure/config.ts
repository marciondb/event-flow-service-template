// src/infrastructure/config.ts
export const config = {
    serviceName: process.env.SERVICE_NAME,
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: parseInt(process.env.PORT ?? "3000", 10),
    logLevel: process.env.LOG_LEVEL ?? "info",
    // kafka: {
    //     brokers: (process.env.KAFKA_BROKERS ?? "localhost:9092").split(","),
    //     clientId: process.env.KAFKA_CLIENT_ID ?? "eventflow-service",
    //     groupId: process.env.KAFKA_GROUP_ID ?? "eventflow-service-group",
    // }
} as const
