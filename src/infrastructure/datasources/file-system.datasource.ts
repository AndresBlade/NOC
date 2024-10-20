import fsp from 'fs/promises';

import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/Log.entity';

//Fernando herrera implements it instead of extending it; The difference is that
//Implementing will force you to implement every method of the abstract class,
//whether they are abstract or not (that means, they have an implementation already or not)
//while extending will force you to implement only the ones that are not implemented (abscract methods)

export class FileSystemDatasource extends LogDatasource {
	private readonly logPath = 'logs';
	private readonly allLogsPath = `${this.logPath}/logs-all.log`;
	private readonly mediumLogsPath = `${this.logPath}/logs-medium.log`;
	private readonly highLogsPath = `${this.logPath}/logs-high.log`;

	constructor() {
		super();
		this.createLogsFiles();
	}

	private async createLogsFiles() {
		await fsp.access(this.logPath).catch(() => fsp.mkdir(this.logPath));

		await Promise.all(
			[this.allLogsPath, this.mediumLogsPath, this.highLogsPath].map(
				logFilePath =>
					fsp
						.access(logFilePath)
						.catch(() => fsp.writeFile(logFilePath, ''))
			)
		);
	}

	override async saveLog(newLog: LogEntity): Promise<void> {
		const logAsJSON = `${JSON.stringify(newLog)}\n`;

		fsp.appendFile(this.allLogsPath, logAsJSON);

		if (newLog.level === 'medium')
			return fsp.appendFile(this.mediumLogsPath, logAsJSON);
		if (newLog.level === 'high')
			return fsp.appendFile(this.highLogsPath, logAsJSON);
	}

	private async getLogsFromFile(path: string): Promise<LogEntity[]> {
		const content = await fsp.readFile(path, { encoding: 'utf-8' });

		// const logs = content
		// 	.split('\n')
		// 	.map(logAsString => LogEntity.fromJson(logAsString));
		const logs = content.split('\n').map(LogEntity.fromJson);

		return logs;
	}

	override async getLogs(
		severityLevel: LogSeverityLevel
	): Promise<LogEntity[]> {
		switch (severityLevel) {
			case LogSeverityLevel.low: {
				return this.getLogsFromFile(this.allLogsPath);
			}

			case LogSeverityLevel.medium: {
				return this.getLogsFromFile(this.mediumLogsPath);
			}

			case LogSeverityLevel.high: {
				return this.getLogsFromFile(this.highLogsPath);
			}

			default: {
				throw new Error(
					`Severity level not implemented: ${severityLevel}`
				);
			}
		}
	}
}
