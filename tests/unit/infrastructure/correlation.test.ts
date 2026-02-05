import {
    generateCorrelationId,
    setCorrelationId,
    getCorrelationId,
    clearCorrelationId,
} from "@infrastructure/correlation"

describe("Correlation", () => {
    afterEach(() => {
        clearCorrelationId()
    })

    describe("generateCorrelationId", () => {
        it("should generate a correlation ID", () => {
            const id = generateCorrelationId()
            
            expect(id).toBeDefined()
            expect(typeof id).toBe("string")
            expect(id.length).toBeGreaterThan(0)
        })

        it("should generate an 8-character hex ID when no parent", () => {
            const id = generateCorrelationId()
            const hexRegex = /^[0-9a-f]{8}$/i
            
            expect(id).toMatch(hexRegex)
            expect(id.length).toBe(8)
        })

        it("should set the generated ID as current", () => {
            const id = generateCorrelationId()
            const current = getCorrelationId()
            
            expect(current).toBe(id)
        })

        it("should generate different IDs each time", () => {
            const id1 = generateCorrelationId()
            clearCorrelationId()
            const id2 = generateCorrelationId()
            
            expect(id1).not.toBe(id2)
        })

        it("should generate cryptographically random IDs", () => {
            const ids = new Set<string>()
            const iterations = 100
            
            for (let i = 0; i < iterations; i++) {
                const id = generateCorrelationId()
                ids.add(id)
                clearCorrelationId()
            }
            
            expect(ids.size).toBe(iterations)
        })

        it("should chain with parent ID", () => {
            const parentId = "abc12345"
            const id = generateCorrelationId(parentId)
            
            expect(id).toContain(parentId)
            expect(id).toContain(".")
            expect(id.startsWith(parentId + ".")).toBe(true)
        })

        it("should generate format parentId.segment when parent exists", () => {
            const parentId = "parent123"
            const id = generateCorrelationId(parentId)
            const parts = id.split(".")
            
            expect(parts.length).toBe(2)
            expect(parts[0]).toBe(parentId)
            expect(parts[1]?.length).toBe(8)
        })

        it("should handle nested chaining", () => {
            const id1 = generateCorrelationId()
            const id2 = generateCorrelationId(id1)
            const id3 = generateCorrelationId(id2)
            
            expect(id1.split(".").length).toBe(1)
            expect(id2.split(".").length).toBe(2)
            expect(id3.split(".").length).toBe(3)
            
            expect(id3).toContain(id1)
            expect(id3).toContain(id2)
        })

        it("should treat empty string parent as no parent", () => {
            const id = generateCorrelationId("")
            
            expect(id).not.toContain(".")
            expect(id.length).toBe(8)
        })

        it("should generate different segments for same parent", () => {
            const parentId = "parent"
            const id1 = generateCorrelationId(parentId)
            clearCorrelationId()
            const id2 = generateCorrelationId(parentId)
            
            expect(id1).not.toBe(id2)
            expect(id1.split(".")[0]).toBe(parentId)
            expect(id2.split(".")[0]).toBe(parentId)
            expect(id1.split(".")[1]).not.toBe(id2.split(".")[1])
        })
    })

    describe("setCorrelationId", () => {
        it("should set a custom correlation ID", () => {
            const customId = "test-123"
            
            setCorrelationId(customId)
            
            expect(getCorrelationId()).toBe(customId)
        })

        it("should override previous ID", () => {
            setCorrelationId("first-id")
            setCorrelationId("second-id")
            
            expect(getCorrelationId()).toBe("second-id")
        })

        it("should accept any string value", () => {
            const values = [
                "simple",
                "with-dashes",
                "with_underscores",
                "123456",
                "mixed-123_abc",
                "",
            ]
            
            values.forEach(value => {
                setCorrelationId(value)
                expect(getCorrelationId()).toBe(value)
            })
        })

        it("should accept empty string", () => {
            setCorrelationId("")
            
            expect(getCorrelationId()).toBe("")
        })
    })

    describe("getCorrelationId", () => {
        it("should return undefined when no ID is set", () => {
            expect(getCorrelationId()).toBeUndefined()
        })

        it("should return the current ID after setting", () => {
            const id = "test-correlation-id"
            setCorrelationId(id)
            
            expect(getCorrelationId()).toBe(id)
        })

        it("should return the generated ID", () => {
            const id = generateCorrelationId()
            
            expect(getCorrelationId()).toBe(id)
        })

        it("should return undefined after clearing", () => {
            setCorrelationId("some-id")
            clearCorrelationId()
            
            expect(getCorrelationId()).toBeUndefined()
        })
    })

    describe("clearCorrelationId", () => {
        it("should clear the current correlation ID", () => {
            setCorrelationId("some-id")
            clearCorrelationId()
            
            expect(getCorrelationId()).toBeUndefined()
        })

        it("should clear generated correlation ID", () => {
            generateCorrelationId()
            clearCorrelationId()
            
            expect(getCorrelationId()).toBeUndefined()
        })

        it("should not error when no ID is set", () => {
            expect(() => { clearCorrelationId(); }).not.toThrow()
            expect(getCorrelationId()).toBeUndefined()
        })

        it("should not error when called multiple times", () => {
            setCorrelationId("test")
            clearCorrelationId()
            clearCorrelationId()
            clearCorrelationId()
            
            expect(getCorrelationId()).toBeUndefined()
        })
    })

    describe("workflow scenarios", () => {
        it("should support complete generate-use-clear workflow", () => {
            const id = generateCorrelationId()
            expect(getCorrelationId()).toBe(id)
            expect(id).toBeDefined()
            
            const retrieved = getCorrelationId()
            expect(retrieved).toBe(id)
            
            clearCorrelationId()
            expect(getCorrelationId()).toBeUndefined()
        })

        it("should support set-use-clear workflow", () => {
            const customId = "custom-workflow-id"
            setCorrelationId(customId)
            expect(getCorrelationId()).toBe(customId)
            
            const retrieved = getCorrelationId()
            expect(retrieved).toBe(customId)
            
            clearCorrelationId()
            expect(getCorrelationId()).toBeUndefined()
        })

        it("should support multiple set operations", () => {
            setCorrelationId("id-1")
            expect(getCorrelationId()).toBe("id-1")
            
            setCorrelationId("id-2")
            expect(getCorrelationId()).toBe("id-2")
            
            setCorrelationId("id-3")
            expect(getCorrelationId()).toBe("id-3")
        })

        it("should support generate after clear", () => {
            const id1 = generateCorrelationId()
            clearCorrelationId()
            const id2 = generateCorrelationId()
            
            expect(id1).not.toBe(id2)
            expect(getCorrelationId()).toBe(id2)
        })

        it("should support set after generate", () => {
            generateCorrelationId()
            const customId = "manual-override"
            setCorrelationId(customId)
            
            expect(getCorrelationId()).toBe(customId)
        })
    })

    describe("edge cases", () => {
        it("should handle rapid successive calls", () => {
            const ids: string[] = []
            
            for (let i = 0; i < 10; i++) {
                const id = generateCorrelationId()
                ids.push(id)
            }
            
            expect(getCorrelationId()).toBe(ids[ids.length - 1])
            
            const uniqueIds = new Set(ids)
            expect(uniqueIds.size).toBe(ids.length)
        })

        it("should maintain state across multiple get calls", () => {
            const id = "persistent-id"
            setCorrelationId(id)
            
            expect(getCorrelationId()).toBe(id)
            expect(getCorrelationId()).toBe(id)
            expect(getCorrelationId()).toBe(id)
        })

        it("should handle empty string as valid ID", () => {
            setCorrelationId("")
            
            const retrieved = getCorrelationId()
            expect(retrieved).toBe("")
            expect(retrieved).not.toBeUndefined()
        })
    })
})
