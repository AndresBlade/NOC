import { LogEntity, LogSeverityLevel } from '../entities/Log.entity';

export abstract class LogDatasource {
	abstract saveLog(log: LogEntity): Promise<void>;
	abstract getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]>;
}
