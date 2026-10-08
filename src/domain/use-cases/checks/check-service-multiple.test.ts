import { describe, it, expect, vi, afterEach } from 'vitest';
import { LogRepository } from '../../repositories/log.repository';
import { LogEntity } from '../../entities/log.entity';
import { CheckServiceMultiple } from './check-service-multiple';

describe('CheckService use case', () => {



    const mockRepositories: LogRepository[] = [
        {
            saveLog: vi.fn(),
            getLogs: vi.fn()
        },
        {
            saveLog: vi.fn(),
            getLogs: vi.fn()
        }
    ]

    const successCallback = vi.fn();
    const errorCallback = vi.fn();

    const checkService = new CheckServiceMultiple(mockRepositories, successCallback, errorCallback);

    afterEach(() => {
        vi.restoreAllMocks();
    })

    it("should call successCallback when checkService succeeds", async () => {
        const wasOk = await checkService.execute('https://google.com');

        expect(wasOk).toBe(true)
        expect(successCallback).toHaveBeenCalledOnce()
        expect(errorCallback).not.toHaveBeenCalledOnce()

        mockRepositories.forEach(mockRepository => expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity)))
    })

    it("should call errorCallback when checkService fails", async () => {
        const wasOk = await checkService.execute('https://googleasdfsadfsadfsdffwewe.com');

        expect(wasOk).toBe(false)
        expect(successCallback).not.toHaveBeenCalledOnce()
        expect(errorCallback).toHaveBeenCalledOnce()

        mockRepositories.forEach(mockRepository => expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity)))
    })


})