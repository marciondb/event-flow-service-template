import { randomUUID } from "crypto"

let currentCorrelationId: string | undefined

export function getCorrelationId(): string | undefined {
    return currentCorrelationId
}

export function setCorrelationId(id: string): void {
    currentCorrelationId = id
}

export function generateCorrelationId(parentId?: string): string {
    const segment = randomUUID().slice(0, 8)
    
    const id = parentId !== undefined && parentId !== ""
        ? `${parentId}.${segment}`
        : segment
    
    setCorrelationId(id)
    return id
}

export function clearCorrelationId(): void {
    currentCorrelationId = undefined
}
