import { LogEntity, LogSeverityLevel } from './log.entity';
import { describe, it, expect } from 'vitest';

describe('log.entity.test.ts', () => {
    const dataObj = {
        message: 'Test message',
        origin: 'log.entity.ts',
        level: LogSeverityLevel.low
    }

    it('should create a LogEntity instance with valid properties', () => {


        const logData = new LogEntity(dataObj);

        expect(logData).toBeInstanceOf(LogEntity);
        expect(logData).toEqual(expect.objectContaining(dataObj));
        expect(logData.createdAt).toBeInstanceOf(Date);
    })

    it("should create log from json", () => {
        const jsonString = '{"message":"https://googalsjdfklsdjfle.com is not ok. TypeError: fetch failed","level":"high","createdAt":"2026-10-07T15:11:25.012Z","origin":"check-service.ts"}';

        const log = LogEntity.fromJson(jsonString);

        expect(log).toBeInstanceOf(LogEntity);
        expect(log.message).toBe("https://googalsjdfklsdjfle.com is not ok. TypeError: fetch failed");
        expect(log.level).toBe(LogSeverityLevel.high);
        expect(log.origin).toBe("check-service.ts");
        expect(log.createdAt).toBeInstanceOf(Date);
    })

    it('should create log from object', () => {
        const logData = LogEntity.fromObject(dataObj);

        expect(logData).toBeInstanceOf(LogEntity);
        expect(logData).toEqual(expect.objectContaining(dataObj));
        expect(logData.createdAt).toBeInstanceOf(Date);
    })
})