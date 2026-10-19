import { SectionStarsEntity } from './section-stars.entity';

describe('SectionStarsEntity', () => {
  it('debe otorgar 3 estrellas y targetXp en el primer pase exitoso', () => {
    const entity = new SectionStarsEntity({
      userId: 'user-001',
      sectionId: 'py-m01',
      moduleId: 'fundamentos',
    });

    const result = entity.recordAttempt(100, 120);

    expect(result.attemptStars).toBe(3);
    expect(result.starsEarnedOverall).toBe(3);
    expect(result.isNewlyPassed).toBe(true);
    expect(result.xpAwarded).toBe(120);
    expect(entity.isPassed).toBe(true);
    expect(entity.isPerfect).toBe(true);
  });

  it('debe otorgar estrictamente 0 XP si la seccion ya estaba completada (bloqueo de repeticion)', () => {
    const entity = new SectionStarsEntity({
      userId: 'user-001',
      sectionId: 'py-m01',
      moduleId: 'fundamentos',
      starsEarned: 3,
      bestAccuracyScore: 100,
      totalAttemptsCount: 1,
    });

    expect(entity.isPassed).toBe(true);

    const result = entity.recordAttempt(100, 120);

    expect(result.attemptStars).toBe(3);
    expect(result.starsEarnedOverall).toBe(3);
    expect(result.isNewlyPassed).toBe(false);
    expect(result.xpAwarded).toBe(0);
  });

  it('no debe disminuir las estrellas historicas si un reintento tiene peor precision', () => {
    const entity = new SectionStarsEntity({
      userId: 'user-001',
      sectionId: 'py-m02',
      moduleId: 'fundamentos',
      starsEarned: 3,
      bestAccuracyScore: 100,
      totalAttemptsCount: 1,
    });

    const result = entity.recordAttempt(60, 150);

    expect(result.attemptStars).toBe(0);
    expect(result.starsEarnedOverall).toBe(3);
    expect(result.isNewlyPassed).toBe(false);
    expect(result.xpAwarded).toBe(0);
  });
});
