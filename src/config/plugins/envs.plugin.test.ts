import { describe, test, expect } from "vitest"
import { envs, envSchema } from "./envs.plugin"

describe("envs.plugin.ts", () => {
    // El schema se valida contra process.env cargado (únicamente) desde .env.test.
    test("should validate process.env (.env.test) against the schema", () => {
        expect(envSchema.safeParse(process.env).success).toBe(true)
    })

    // Todas las asertaciones usan valores que SOLO existen en .env.test
    // (en .env son distintos: MONGO_DB_NAME=NOC, MONGO_PASS=123456, etc.).
    // Si alguna vez se cargara .env en lugar de .env.test, estos tests fallarían.
    test("should load environment variables from .env.test", () => {
        expect(envs.MONGO_DB_NAME).toBe("NOC-TEST")
        expect(envs.MONGO_PASS).toBe("654321")
        expect(envs.MONGO_URL).toBe("mongodb://andres:654321@localhost:27017")
        expect(envs.PORT).toBe(3002)
    })

    test("should reject invalid values independently of process.env", () => {
        const result = envSchema.safeParse({ ...envs, PORT: -1 })
        expect(result.success).toBe(false)
    })
})