import { LogEntity, LogSeverityLevel } from '../../entities/Log.entity';
import { LogRepository } from '../../repositories/log.repository';
interface CheckServiceUseCase {
	execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
	constructor(
		private readonly logRepository: LogRepository,
		private readonly successCallback?: SuccessCallback,
		private readonly errorCallback?: ErrorCallback
	) {}

	async execute(url: string): Promise<boolean> {
		try {
			const request = await fetch(url);
			if (!request.ok) {
				throw new Error(`Error on check service ${url}`);
			}

			const log = new LogEntity(
				`Service ${url} working`,
				LogSeverityLevel.low
			);
			this.logRepository.saveLog(log);
			this.successCallback?.();
		} catch (error) {
			const errorMessage = `${url} is not ok. ${error}`;
			const log = new LogEntity(errorMessage, LogSeverityLevel.high);

			this.logRepository.saveLog(log);
			this.errorCallback?.(`${error}`);

			return false;
		}

		return true;
	}
}
