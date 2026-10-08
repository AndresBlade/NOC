import { describe, it, expect, afterAll } from "vitest"
import mongoose from "mongoose"
import { MongoDatabase } from "./init"
import { envs } from "../../config/plugins/envs.plugin"

describe("init Mongo DB", () => {
    it("should connect to MongoDB", async () => {
        const connected = await MongoDatabase.connect({
            dbName: process.env['MONGO_DB_NAME']!,
            mongoUrl: process.env['MONGO_URL']!,
            user: process.env['MONGO_USER']!,
            pass: process.env['MONGO_PASS']!
        })

        expect(connected).toBeUndefined();
    })

    it("should throw an error", async () => {
        const connectToDatabase = () => MongoDatabase.connect({
            dbName: process.env['MONGO_DB_NAME']!,
            mongoUrl: 'postgresql://postgres:123456@localhost:1234/NOC-TEST',
            user: process.env['MONGO_USER']!,
            pass: process.env['MONGO_PASS']!
        })

        await expect(connectToDatabase()).rejects.toThrow()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})