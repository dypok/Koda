export type ModuleProgressStatus = 'locked' | 'in_progress' | 'completed';

export interface ModuleProgressProps {
  id?: string;
  userId: string;
  moduleId: string;
  courseId: string;
  languageCode?: string;
  status?: ModuleProgressStatus;
  starsEarnedPercentage?: number;
  isUnlocked?: boolean;
  unlockedByDiagnostic?: boolean;
  unlockedAt?: Date | null;
  completedAt?: Date | null;
  updatedAt?: Date;
}

export class ModuleProgressEntity {
  public readonly id?: string;
  public readonly userId: string;
  public readonly moduleId: string;
  public readonly courseId: string;
  public readonly languageCode: string;
  private _status: ModuleProgressStatus;
  private _starsEarnedPercentage: number;
  private _isUnlocked: boolean;
  private _unlockedByDiagnostic: boolean;
  private _unlockedAt: Date | null;
  private _completedAt: Date | null;
  private _updatedAt: Date;

  constructor(props: ModuleProgressProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.moduleId = props.moduleId;
    this.courseId = props.courseId;
    this.languageCode = props.languageCode ?? 'python';
    this._status = props.status ?? 'locked';
    this._starsEarnedPercentage = props.starsEarnedPercentage ?? 0;
    this._isUnlocked = props.isUnlocked ?? false;
    this._unlockedByDiagnostic = props.unlockedByDiagnostic ?? false;
    this._unlockedAt = props.unlockedAt ?? null;
    this._completedAt = props.completedAt ?? null;
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get status(): ModuleProgressStatus {
    return this._status;
  }

  get starsEarnedPercentage(): number {
    return this._starsEarnedPercentage;
  }

  get isUnlocked(): boolean {
    return this._isUnlocked;
  }

  get unlockedByDiagnostic(): boolean {
    return this._unlockedByDiagnostic;
  }

  get unlockedAt(): Date | null {
    return this._unlockedAt;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public unlock(byDiagnostic = false): void {
    this._isUnlocked = true;
    if (this._status === 'locked') {
      this._status = 'in_progress';
    }
    if (byDiagnostic) {
      this._unlockedByDiagnostic = true;
    }
    if (!this._unlockedAt) {
      this._unlockedAt = new Date();
    }
    this._updatedAt = new Date();
  }

  public complete(): void {
    this._isUnlocked = true;
    this._status = 'completed';
    if (!this._completedAt) {
      this._completedAt = new Date();
    }
    this._updatedAt = new Date();
  }

  public updateStarsProgress(earnedStars: number, maxStars: number): void {
    if (maxStars > 0) {
      const percentage = (earnedStars / maxStars) * 100;
      this._starsEarnedPercentage = Math.min(100, Math.max(0, parseFloat(percentage.toFixed(2))));
    }
    this._updatedAt = new Date();
  }
}
