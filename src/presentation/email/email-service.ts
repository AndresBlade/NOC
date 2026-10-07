import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';

interface Attachment {
	filename: string;
	path: string;
}

interface SendMailOptions {
	to: string | string[];
	subject: string;
	htmlBody: string;
	attachments?: Attachment[];
}

//TODO: Attachment

export class EmailService {
	private transporter = nodemailer.createTransport({
		service: envs.MAILER_SERVICE,
		auth: { user: envs.MAILER_EMAIL, pass: envs.MAILER_SECRET_KEY },
	});

	async sendEmail(options: SendMailOptions): Promise<boolean> {
		const { to, subject, htmlBody, attachments = [] } = options;

		try {
			const sentInformation = await this.transporter.sendMail({
				to,
				subject,
				html: htmlBody,
				attachments,
			});

			console.log(sentInformation);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async sendEmailWithFileSystemLogs(to: string | string[]) {
		const subject = `Logs del servidor`;
		const htmlBody = `<h1 style="background-color:#0000FF">Más cool que fan cooler</h1>`;
		const attachments: Attachment[] = [
			{
				filename: 'logs-all.log',
				path: 'logs/logs-all.log',
			},
			{
				filename: 'logs-medium.log',
				path: 'logs/logs-medium.log',
			},
			{
				filename: 'logs-high.log',
				path: 'logs/logs-high.log',
			},
		];

		return this.sendEmail({ to, subject, htmlBody, attachments });
	}
}
