export interface SectionStarsProps {
  id?: string;
  userId: string;
  sectionId: string;
  moduleId: string;
  starsEarned?: number;
  bestAccuracyScore?: number;
  totalAttemptsCount?: number;
  completedAt?: Date | null;
  updatedAt?: Date;
}

export class SectionStarsEntity {
  public readonly id?: string;
  public readonly userId: string;
  public readonly sectionId: string;
  public readonly moduleId: string;
  private _starsEarned: number;
  private _bestAccuracyScore: number;
  private _totalAttemptsCount: number;
  private _completedAt: Date | null;
  private _updatedAt: Date;

  constructor(props: SectionStarsProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.sectionId = props.sectionId;
    this.moduleId = props.moduleId;
    this._starsEarned = props.starsEarned ?? 0;
    this._bestAccuracyScore = props.bestAccuracyScore ?? 0;
    this._totalAttemptsCount = props.totalAttemptsCount ?? 0;
    this._completedAt = props.completedAt ?? null;
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get starsEarned(): number {
    return this._starsEarned;
  }

  get bestAccuracyScore(): number {
    return this._bestAccuracyScore;
  }

  get totalAttemptsCount(): number {
    return this._totalAttemptsCount;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isPassed(): boolean {
    return this._starsEarned >= 1;
  }

  get isPerfect(): boolean {
    return this._starsEarned === 3;
  }

  /**
   * Fórmula pedagógica canónica de estrellas según porcentaje de acierto (14 §4, 16 §4):
   * - 100% -> 3 estrellas (⭐⭐⭐)
   * - 80% a 99% -> 2 estrellas (⭐⭐)
   * - 70% a 79% -> 1 estrella (⭐)
   * - < 70% -> 0 estrellas (No aprobada)
   */
  public static calculateStars(accuracyPercentage: number): number {
    if (accuracyPercentage >= 100) return 3;
    if (accuracyPercentage >= 80) return 2;
    if (accuracyPercentage >= 70) return 1;
    return 0;
  }

  /**
   * Registra un nuevo intento de la sección.
   * La marca histórica de estrellas está blindada: nunca disminuye ante reintentos.
   */
  public recordAttempt(
    accuracyPercentage: number,
    targetXp?: number,
  ): {
    attemptStars: number;
    starsEarnedOverall: number;
    isNewBest: boolean;
    isNewlyPassed: boolean;
    xpAwarded: number;
  } {
    const attemptStars = SectionStarsEntity.calculateStars(accuracyPercentage);
    const wasAlreadyPassed = this.isPassed;
    const previousStars = this._starsEarned;

    this._totalAttemptsCount += 1;
    this._updatedAt = new Date();

    let isNewBest = false;
    if (accuracyPercentage > this._bestAccuracyScore) {
      this._bestAccuracyScore = accuracyPercentage;
      isNewBest = true;
    }

    if (attemptStars > this._starsEarned) {
      this._starsEarned = attemptStars;
      isNewBest = true;
    }

    const isNewlyPassed = !wasAlreadyPassed && this.isPassed;
    if (isNewlyPassed || (this.isPassed && !this._completedAt)) {
      this._completedAt = new Date();
    }

    // Regla de XP determinista:
    // Si la seccion es recien aprobada (primera vez), se otorga el bono calibrado (targetXp) o la regla base.
    // En reintentos de una seccion ya aprobada, se bloquea estrictamente a +0 XP.
    let xpAwarded = 0;
    if (isNewlyPassed) {
      if (typeof targetXp === 'number' && targetXp > 0) {
        xpAwarded += targetXp;
      } else {
        xpAwarded += 30;
      }
      if (attemptStars === 3 && previousStars < 3 && (!targetXp || targetXp <= 30)) {
        xpAwarded += 10;
      }
    } else {
      // Reintentos o practica de una seccion ya aprobada: 0 XP adicional
      xpAwarded = 0;
    }

    return {
      attemptStars,
      starsEarnedOverall: this._starsEarned,
      isNewBest,
      isNewlyPassed,
      xpAwarded,
    };
  }
}
