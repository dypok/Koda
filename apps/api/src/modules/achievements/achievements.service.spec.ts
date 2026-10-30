import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { PrismaService } from '@infra/database/postgres/prisma.service';

describe('AchievementsService', () => {
  let service: AchievementsService;
  let prisma: any;

  const mockUser = {
    id: 'user-1',
    displayName: 'Dylan Gamero',
    avatarUrl: '/avatars/custom.png',
    bio: 'Python developer',
    totalXp: 120,
    currentStreak: 3,
    longestStreak: 5,
  };

  const mockAchievements = [
    {
      id: 'ach-1',
      code: 'first_lesson',
      title: '¡Hola, Mundo!',
      description: 'Completa tu primera lección',
      iconName: 'Sparkle',
      category: 'curriculum',
      xpReward: 50,
      conditionType: 'lessons_completed',
      conditionValue: 1,
      isActive: true,
    },
    {
      id: 'ach-2',
      code: 'streak_7_days',
      title: 'Semana de Fuego',
      description: '7 días de racha',
      iconName: 'Flame',
      category: 'streak',
      xpReward: 150,
      conditionType: 'streak_days',
      conditionValue: 7,
      isActive: true,
    },
    {
      id: 'ach-3',
      code: 'xp_100',
      title: 'Primeros 100 XP',
      description: 'Alcanza 100 XP',
      iconName: 'Lightning',
      category: 'xp',
      xpReward: 50,
      conditionType: 'total_xp',
      conditionValue: 100,
      isActive: true,
    },
  ];

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ ...mockUser }),
        update: jest.fn().mockResolvedValue({ ...mockUser, totalXp: 170 }),
      },
      achievement: {
        findMany: jest.fn().mockResolvedValue(mockAchievements),
      },
      userAchievement: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: 'ua-new' }),
      },
      userSectionStars: {
        findMany: jest.fn().mockResolvedValue([
          { sectionSlug: 'py-m01', maxStarsEarned: 3 },
        ]),
      },
      userModuleProgress: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      userMistakesNotebook: {
        count: jest.fn().mockResolvedValue(0),
      },
      attempt: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      xpTransaction: {
        create: jest.fn().mockResolvedValue({ id: 'tx-1' }),
      },
      $transaction: jest.fn().mockImplementation((cb) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.getAchievementsForUser('non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should evaluate and unlock eligible achievements, awarding XP and returning newly_unlocked', async () => {
    // User has 1 section completed (qualifies for first_lesson), totalXp=120 (qualifies for xp_100), streak=5 (< 7 for streak_7_days)
    const result = await service.getAchievementsForUser('user-1');

    expect(result.achievements).toHaveLength(3);
    expect(result.newly_unlocked).toHaveLength(2); // first_lesson and xp_100

    const firstLesson = result.achievements.find((a) => a.code === 'first_lesson');
    expect(firstLesson?.is_unlocked).toBe(true);
    expect(firstLesson?.progress_percentage).toBe(100);

    const streak7 = result.achievements.find((a) => a.code === 'streak_7_days');
    expect(streak7?.is_unlocked).toBe(false);
    expect(streak7?.current_value).toBe(5);
    expect(streak7?.target_value).toBe(7);
    expect(streak7?.progress_percentage).toBe(71); // 5/7 = 71%

    // Verifies transactions and user updates were executed for newly unlocked items
    expect(prisma.userAchievement.create).toHaveBeenCalledTimes(2);
    expect(prisma.xpTransaction.create).toHaveBeenCalledTimes(2);
  });

  it('should not re-grant achievements if already unlocked in user_achievements', async () => {
    prisma.userAchievement.findMany.mockResolvedValue([
      {
        userId: 'user-1',
        achievementId: 'ach-1',
        unlockedAt: new Date('2026-10-20T00:00:00.000Z'),
      },
    ]);

    const result = await service.getAchievementsForUser('user-1');

    // Only xp_100 should be newly unlocked
    expect(result.newly_unlocked).toHaveLength(1);
    expect(result.newly_unlocked[0].code).toBe('xp_100');

    // ach-1 was already unlocked
    const ach1 = result.achievements.find((a) => a.code === 'first_lesson');
    expect(ach1?.is_unlocked).toBe(true);
    expect(ach1?.unlocked_at).toBe('2026-10-20T00:00:00.000Z');

    // Transaction called only once for xp_100
    expect(prisma.userAchievement.create).toHaveBeenCalledTimes(1);
  });

  it('should correctly compute overall stats', async () => {
    const result = await service.getAchievementsForUser('user-1');
    expect(result.stats.total).toBe(3);
    expect(result.stats.unlocked_count).toBe(2);
    expect(result.stats.total_xp_earned).toBe(100); // 50 + 50
  });
});
