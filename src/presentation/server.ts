import { CheckService } from '../domain/use-cases/checks/check-service';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log.repository.implementation';
import { CronService } from './cron/cron-service';

import { envs } from '../config/plugins/envs.plugin';
import { EmailService } from './email/email-service';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { MongoLogDatasource } from '../infrastructure/datasources/mongo-log.datasource';
import { PostgresLogDatasource } from '../infrastructure/datasources/postgres-log.datasource';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service-multiple';

const postgresLogRepository = new LogRepositoryImplementation(
	new PostgresLogDatasource()
);

const mongoLogRepository = new LogRepositoryImplementation(
	new MongoLogDatasource()
);

const fileSystemLogRepository = new LogRepositoryImplementation(
	new FileSystemDatasource()
);

const emailService = new EmailService();

export class Server {
	public static start() {
		console.log('Server started');

		// new SendEmailLogs(emailService, logRepository).execute([
		// 	'1001.30266948.ucla@gmail.com',
		// ]);

		//Mandar email

		// emailService.sendEmail({
		// 	to: '1001.30266948.ucla@gmail.com',
		// 	subject: 'Logs del sistema',
		// 	htmlBody: `
		// 	<h2>Logs del sistema</h2>
		// 	<p>lorem lorem lorem ipsum sisdfojsokdf</p>
		// 	<p>Ver logs adjuntos</p>
		// 	`,
		// });

		CronService.createJob('*/5 * * * * *', () => {
			const url = `https://googalsjdfklsdjfle.com`;
			new CheckServiceMultiple(
				[fileSystemLogRepository, mongoLogRepository, postgresLogRepository],
				() => {
					console.log(`${url} is ok`);
				},
				error => {
					console.log(error);
				}
			).execute(url);
		});

		console.log(envs);
	}
}
