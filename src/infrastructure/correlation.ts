// src/infrastructure/correlation.ts
import { randomUUID } from "crypto"

let currentCorrelationId: string | undefined

export function getCorrelationId(): string | undefined {
    return currentCorrelationId
}

export function setCorrelationId(id: string): void {
    currentCorrelationId = id
}

export function generateCorrelationId(): string {
    const id = randomUUID()
    setCorrelationId(id)
    return id
}

export function clearCorrelationId(): void {
    currentCorrelationId = undefined
}
