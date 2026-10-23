import { Test, TestingModule } from '@nestjs/testing';
import { NotebookService } from './notebook.service';
import { PrismaService } from '@infra/database/postgres/prisma.service';
import { getModelToken } from '@nestjs/mongoose';
import { Lesson } from '../../database/schemas';
import { NotFoundException } from '@nestjs/common';

describe('NotebookService', () => {
  let service: NotebookService;
  let prisma: jest.Mocked<PrismaService>;
  let lessonModel: any;

  const mockDate = new Date('2026-10-22T00:00:00.000Z');

  beforeEach(async () => {
    prisma = {
      userMistakesNotebook: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'mistake-1',
            userId: 'user-123',
            trackSlug: 'python',
            courseSlug: 'python-1',
            moduleSlug: 'fundamentos',
            sectionSlug: 'py-m01',
            lessonId: 'py-m01-l01',
            questionId: 'q-1',
            failCount: 2,
            isResolved: false,
            intervalDays: 1,
            easeFactor: 2.5,
            repetitionCount: 0,
            nextReviewAt: mockDate,
            firstFailedAt: mockDate,
            lastFailedAt: mockDate,
          },
        ]),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({ totalXp: 120 }),
        update: jest.fn(),
      },
      xpTransaction: {
        create: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation((promises) => Promise.all(promises)),
    } as any;

    lessonModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            slug: 'py-m01-l01',
            title: 'Entorno y Sintaxis',
            item_2_quiz: { prompt: '¿Qué es Python?' },
            item_1_console: { initial_code: 'print("Hola")' },
          },
        ]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebookService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: getModelToken(Lesson.name),
          useValue: lessonModel,
        },
      ],
    }).compile();

    service = module.get<NotebookService>(NotebookService);
  });

  it('should return pending mistakes mapped with lesson details', async () => {
    const result = await service.getMistakes('user-123');
    expect(result).toHaveLength(1);
    expect(result[0].lesson_title).toBe('Entorno y Sintaxis');
    expect(result[0].prompt).toBe('¿Qué es Python?');
    expect(result[0].error_count).toBe(2);
    expect(prisma.userMistakesNotebook.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-123', isResolved: false },
      orderBy: { lastFailedAt: 'desc' },
    });
  });

  it('should throw NotFoundException if mistake does not exist when resolving', async () => {
    (prisma.userMistakesNotebook.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(service.resolveMistake('user-123', 'non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should resolve mistake, update SM-2 metrics and award +5 XP via transaction', async () => {
    (prisma.userMistakesNotebook.findFirst as jest.Mock).mockResolvedValue({
      id: 'mistake-1',
      userId: 'user-123',
      questionId: 'q-1',
      isResolved: false,
      intervalDays: 1,
      easeFactor: 2.5,
      repetitionCount: 0,
    });

    const result = await service.resolveMistake('user-123', 'q-1');

    expect(result).toEqual({ success: true, xp_reward: 5 });
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
