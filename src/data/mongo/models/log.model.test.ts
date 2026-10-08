import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import { MongoDatabase } from '../init'
import { LogEntity, LogSeverityLevel } from '../../../domain/entities/log.entity'
import { LogModel } from './log.model'

describe('log.model.test.ts', () => {
    beforeAll(async () => {
        await MongoDatabase.connect({
            dbName: process.env['MONGO_DB_NAME']!,
            mongoUrl: process.env['MONGO_URL']!,
            user: process.env['MONGO_USER']!,
            pass: process.env['MONGO_PASS']!
        })
    })

    afterAll(async () => {
        await LogModel.deleteMany({})
        await mongoose.disconnect()
    })

    it('should return logModel', async () => {
        const logData = new LogEntity({
            message: 'Test log message',
            level: LogSeverityLevel.low,
            origin: 'log.model.test.ts'
        })

        const log = await LogModel.create(logData);

        expect(log).toEqual(expect.objectContaining({
            ...logData,
            createdAt: expect.any(Date)
        }));
    })

    it('should return the schema object', () => {
        const schema = LogModel.schema.obj;

        expect(schema).toEqual(expect.objectContaining({
            message: { type: expect.any(Function), required: true },
            origin: { type: expect.any(Function) },
            level: {
                type: expect.any(Function),
                enum: ['low', 'medium', 'high'],
                default: 'low'
            },
            createdAt: expect.any(Object)

        }))
    })
})