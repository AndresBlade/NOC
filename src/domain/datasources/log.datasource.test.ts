import { describe, it, expect, vi } from "vitest";
import { LogDatasource } from "./log.datasource";
import { LogEntity, LogSeverityLevel } from "../entities/log.entity";

class MockLogDatasource extends LogDatasource {
    async saveLog(log: LogEntity): Promise<void> { }

    async getLogs(): Promise<LogEntity[]> {
        return [];
    }
}

describe("log.datasource.ts", () => {
    it("cannot be instantiated directly", () => {
        expect(LogDatasource).toBeDefined();
        expect(typeof LogDatasource).toBe("function");
    });

    it("allows instantiation through a subclass", () => {
        const mockDatasource = new MockLogDatasource();

        expect(mockDatasource).toBeInstanceOf(LogDatasource);
        expect(mockDatasource).toBeInstanceOf(MockLogDatasource);
    });

    it("has saveLog method defined", () => {
        const mockDatasource = new MockLogDatasource();

        expect(mockDatasource.saveLog).toBeDefined();
        expect(typeof mockDatasource.saveLog).toBe("function");
    });

    it("has getLogs method defined", () => {
        const mockDatasource = new MockLogDatasource();

        expect(mockDatasource.getLogs).toBeDefined();
        expect(typeof mockDatasource.getLogs).toBe("function");
    });

    it("executes saveLog with a LogEntity instance", async () => {
        const mockDatasource = new MockLogDatasource();
        const saveLogSpy = vi.spyOn(mockDatasource, "saveLog");

        const logEntity = new LogEntity({
            level: LogSeverityLevel.low,
            message: "Test message",
            origin: "test",
            createdAt: new Date(),
        });

        await mockDatasource.saveLog(logEntity);

        expect(saveLogSpy).toHaveBeenCalledTimes(1);
        expect(saveLogSpy).toHaveBeenCalledWith(logEntity);
    });

    it("executes getLogs and returns an array", async () => {
        const mockDatasource = new MockLogDatasource();
        const getLogsSpy = vi.spyOn(mockDatasource, "getLogs");

        const result = await mockDatasource.getLogs();

        expect(getLogsSpy).toHaveBeenCalledTimes(1);
        expect(Array.isArray(result)).toBe(true);
    });

    it("enforces saveLog implementation in subclasses", () => {
        const mockDatasource = new MockLogDatasource();

        expect(typeof mockDatasource.saveLog).toBe("function");
    });

    it("enforces getLogs implementation in subclasses", () => {
        const mockDatasource = new MockLogDatasource();

        expect(typeof mockDatasource.getLogs).toBe("function");
    });
});