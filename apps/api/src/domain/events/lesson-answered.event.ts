export interface LessonAnsweredEventPayload {
  userId: string;
  lessonId: string;
  sectionSlug: string;
  moduleSlug: string;
  courseSlug: string;
  languageSlug: string;
  prompt: string;
  selectedOptionIds: string[];
  correctOptionId?: string;
  isCorrect: boolean;
  xpEarned: number;
  timeSpentSeconds: number;
  feedbackText: string;
}

export class LessonAnsweredEvent {
  constructor(public readonly payload: LessonAnsweredEventPayload) {}
}
