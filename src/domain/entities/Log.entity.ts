export enum LogSeverityLevel {
	low = 'low',
	medium = 'medium',
	high = 'high',
}

export interface LogEntityOptions {
	message: string;
	level: LogSeverityLevel;
	origin: string;
	createdAt?: Date;
}

export class LogEntity {
	public level: LogSeverityLevel;
	public message: string;
	public createdAt: Date;
	public origin: string;
	constructor({
		message,
		level,
		createdAt = new Date(),
		origin,
	}: LogEntityOptions) {
		this.message = message;
		this.level = level;
		this.createdAt = createdAt ?? new Date();
		this.origin = origin;
	}

	static fromJson(json: string): LogEntity {
		const { message, level, createdAt, origin } = JSON.parse(
			json
		) as LogEntity;

		const log = new LogEntity({
			message,
			level,
			origin,
			createdAt,
		});

		log.createdAt = new Date(createdAt);

		return log;
	}
}
