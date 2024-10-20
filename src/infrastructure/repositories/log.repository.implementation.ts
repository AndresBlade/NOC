import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/Log.entity';
import { LogRepository } from '../../domain/repositories/log.repository';

export class LogRepositoryImplementation extends LogRepository {
	constructor(private readonly logDatasource: LogDatasource) {
		super();
	}

	override saveLog(log: LogEntity): Promise<void> {
		return this.logDatasource.saveLog(log);
	}
	override getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
		return this.logDatasource.getLogs(severityLevel);
	}
}
