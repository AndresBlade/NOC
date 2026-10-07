import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { db } from "../../prisma/db"

export class PostgresLogDatasource extends LogDatasource {
    async saveLog(log: LogEntity): Promise<void> {
        // const newLog = await LogModel.create(log);
        const newLog = await db.orm.public.LogModel.create({
            message: log.message,
            level: log.level,
            origin: log.origin,
            createdAt: Temporal.Instant.from(log.createdAt.toISOString()),
        });

        console.log("Mongo log created:", newLog.id);
    }
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const logs = await db.orm.public.LogModel.where({
            level: severityLevel
        }).all();

        return await logs.map(log => new LogEntity({ ...log, level: log.level as LogSeverityLevel, createdAt: new Date(log.createdAt.toString()) }));
    }
}