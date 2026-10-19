import { CodeSimple } from '@phosphor-icons/react';
import React from 'react';
import { GraphDataset } from '../roadmap-graph.types';

export type CareerBranchId = 'python';

const EMPTY_BRANCH_DATASET: GraphDataset = {
  sectorTitle: 'PYTHON SPECIALIST: DE FUNDAMENTOS A AGENTES AUTÓNOMOS',
  progressPercent: 0,
  nodes: [],
  connections: [],
};

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
    progressPercent: 0,
    earnedStars: 0,
    totalStars: 60,
    completedCourses: 0,
    totalCourses: 7,
    dataset: EMPTY_BRANCH_DATASET,
  },
];
