import { CodeSimple } from '@phosphor-icons/react';
import React from 'react';
import { GraphDataset } from '../roadmap-graph.types';
import { PYTHON_COURSES_DATASET } from './python-track.mock';

export type CareerBranchId = string;

export interface CareerBranchInfo {
  id: CareerBranchId;
  title: string;
  tagline: string;
  technologies: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  progressPercent: number;
  earnedStars: number;
  totalStars: number;
  completedCourses: number;
  totalCourses: number;
  dataset: GraphDataset;
}

export const CAREER_BRANCHES: CareerBranchInfo[] = [
  {
    id: 'python',
    title: 'Python Specialist',
    tagline: 'De Fundamentos a Agentes Autónomos',
    technologies: 'Python 3.12, FastAPI, Django, Pandas, IA & Agentes',
    icon: CodeSimple,
    color: '#F59E0B',
    progressPercent: 28,
    earnedStars: 10,
    totalStars: 60,
    completedCourses: 1,
    totalCourses: 7,
    dataset: PYTHON_COURSES_DATASET,
  },
];
