export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'banned';
export type ExperienceLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';
export type LearningStyle = 'hands-on' | 'guided' | 'projects' | 'gamified';
export type DailyGoalId = 'casual' | 'regular' | 'focused' | 'intense';
export type DocumentType = 'CC' | 'TI' | 'CE' | 'PASSPORT';

export interface UserEntityProps {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string;
  avatarUrl?: string | null;
  avatarObjectKey?: string | null;
  documentNumber?: string | null;
  documentType?: DocumentType | null;
  bio?: string | null;
  timezone: string;
  locale: string;
  initialLanguageSlug: string;
  experienceLevel: ExperienceLevel;
  learningStyle: LearningStyle;
  dailyGoalId: DailyGoalId;
  dailyGoalMinutes: number;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezeCount: number;
  totalStudyTimeSeconds: number;
  lastStudyDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  constructor(private readonly props: UserEntityProps) {}

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get avatarObjectKey(): string | null | undefined {
    return this.props.avatarObjectKey;
  }

  get documentNumber(): string | null | undefined {
    return this.props.documentNumber;
  }

  get documentType(): DocumentType | null | undefined {
    return this.props.documentType;
  }

  get bio(): string | null | undefined {
    return this.props.bio;
  }

  get timezone(): string {
    return this.props.timezone;
  }

  get locale(): string {
    return this.props.locale;
  }

  get initialLanguageSlug(): string {
    return this.props.initialLanguageSlug;
  }

  get experienceLevel(): ExperienceLevel {
    return this.props.experienceLevel;
  }

  get learningStyle(): LearningStyle {
    return this.props.learningStyle;
  }

  get dailyGoalId(): DailyGoalId {
    return this.props.dailyGoalId;
  }

  get dailyGoalMinutes(): number {
    return this.props.dailyGoalMinutes;
  }

  get totalXp(): number {
    return this.props.totalXp;
  }

  get currentLevel(): number {
    return this.props.currentLevel;
  }

  get currentStreak(): number {
    return this.props.currentStreak;
  }

  get longestStreak(): number {
    return this.props.longestStreak;
  }

  get streakFreezeCount(): number {
    return this.props.streakFreezeCount;
  }

  get totalStudyTimeSeconds(): number {
    return this.props.totalStudyTimeSeconds;
  }

  get lastStudyDate(): Date | null | undefined {
    return this.props.lastStudyDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get maskedDocumentNumber(): string | null {
    if (!this.props.documentNumber) return null;
    const doc = this.props.documentNumber.trim();
    if (doc.length <= 4) return '***' + doc;
    return '***' + doc.slice(-4);
  }

  isProfileComplete(): boolean {
    return Boolean(this.props.displayName && this.props.initialLanguageSlug);
  }

  toPrimitives(): UserEntityProps {
    return { ...this.props };
  }
}
