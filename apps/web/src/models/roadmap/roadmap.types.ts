import React from 'react';

export type CourseLevel = 'basic' | 'intermediate' | 'advanced' | 'framework';

export interface RoadmapLesson {
  id: string;
  title: string;
  order: number;
  durationMinutes: number;
  xp: number;
  stars: number; // 0..3
  maxStars: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface RoadmapCourse {
  id: string;
  title: string;
  shortTitle: string;
  level: CourseLevel;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisite?: string;
  totalStars: number;
  earnedStars: number;
  lessons: RoadmapLesson[];
}

export interface FrameworkBranch {
  id: string;
  name: string;
  description: string;
  courses: RoadmapCourse[];
}

export interface LanguageTrack {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  isAvailable: boolean;
  mainCourses: RoadmapCourse[];
  frameworkBranches: FrameworkBranch[];
}

export interface SidebarLanguageItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isAvailable: boolean;
  totalStars: number;
  earnedStars: number;
  completedCourses?: number;
  totalCourses?: number;
  progressPercent?: number;
  currentStage?: string;
}
