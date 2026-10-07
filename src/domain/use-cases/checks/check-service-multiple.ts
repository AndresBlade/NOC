import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repositories/log.repository';
interface CheckServiceMultipleUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
    constructor(
        private readonly logRepository: LogRepository[],
        private readonly successCallback?: SuccessCallback,
        private readonly errorCallback?: ErrorCallback
    ) { }

    private async saveLogToRepositories(log: LogEntity): Promise<void> {
        for (const repo of this.logRepository) {
            await repo.saveLog(log);
        }
    }

    async execute(url: string): Promise<boolean> {
        try {
            const request = await fetch(url);
            if (!request.ok) {
                throw new Error(`Error on check service ${url}`);
            }

            const log = new LogEntity({
                message: `Service ${url} working`,
                level: LogSeverityLevel.low,
                origin: `check-service.ts`,
            });
            await this.saveLogToRepositories(log);
            this.successCallback?.();
        } catch (error) {
            const errorMessage = `${url} is not ok. ${error}`;
            const log = new LogEntity({
                message: errorMessage,
                level: LogSeverityLevel.high,
                origin: 'check-service.ts',
            });

            await this.saveLogToRepositories(log);
            this.errorCallback?.(`${error}`);

            return false;
        }

        return true;
    }
}
