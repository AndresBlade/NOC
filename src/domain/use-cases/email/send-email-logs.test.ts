import { describe, it, expect, vi, afterEach } from 'vitest';
import { LogRepository } from '../../repositories/log.repository';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { SendEmailLogs } from './send-email-logs';
import { EmailService } from '../../../presentation/email/email-service';

vi.mock('../../../presentation/email/email-service', () => {
    const EmailService = vi.fn(class {
        sendEmail = vi.fn().mockResolvedValueOnce(true).mockRejectedValue(false)
        sendEmailWithFileSystemLogs = vi.fn().mockResolvedValueOnce(true).mockRejectedValue(false)
    });
    return {
        EmailService
    }
})

describe('SendEmailLogs use case', () => {



    const mockLogRepository: LogRepository = {
        saveLog: vi.fn(),
        getLogs: vi.fn()
    }



    const emailService = new EmailService();

    const sendEmailLogs = new SendEmailLogs(emailService, mockLogRepository);

    const email = 'test@example.com'

    afterEach(() => {
        vi.restoreAllMocks();
    })

    it("should call sendEmailWithFileSystemLogs when transport succeeds", async () => {
        const wasOk = await sendEmailLogs.execute(email);

        expect(wasOk).toBe(true)

        expect(emailService.sendEmailWithFileSystemLogs).toHaveBeenCalledOnce();
        expect(emailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(email)

        expect(mockLogRepository.saveLog).toHaveBeenCalledExactlyOnceWith(expect.any(LogEntity))
        expect(mockLogRepository.saveLog).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
            level: LogSeverityLevel.low,
        }))

    })

    it("should call saveLog when transport fails", async () => {
        const wasOk = await sendEmailLogs.execute(email);

        expect(wasOk).toBe(false)

        expect(mockLogRepository.saveLog).toHaveBeenCalledExactlyOnceWith(expect.any(LogEntity))
        expect(mockLogRepository.saveLog).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
            level: LogSeverityLevel.high,
        }))
    })


})