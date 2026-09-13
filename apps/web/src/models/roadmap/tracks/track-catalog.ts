import React from 'react';
import { IconDeviceDesktop, IconServer, IconBrandDocker, IconBrandPython } from '@tabler/icons-react';
import { GraphDataset } from '../roadmap-graph.types';
import { FRONTEND_COURSES_DATASET } from './frontend-track.mock';
import { BACKEND_COURSES_DATASET } from './backend-track.mock';
import { DEVOPS_COURSES_DATASET } from './devops-track.mock';
import { PYTHON_COURSES_DATASET } from './python-track.mock';

export type CareerBranchId = 'frontend' | 'backend' | 'devops' | 'python';

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
    id: 'frontend',
    title: 'Frontend Developer',
    tagline: 'Interfaces Web & DOM',
    technologies: 'HTML, CSS, JS DOM, React',
    icon: IconDeviceDesktop,
    color: '#38BDF8',
    progressPercent: 18,
    earnedStars: 6,
    totalStars: 45,
    completedCourses: 1,
    totalCourses: 5,
    dataset: FRONTEND_COURSES_DATASET,
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    tagline: 'Lógica, APIs & Concurrencia',
    technologies: 'Python, SQL, FastAPI, Go',
    icon: IconServer,
    color: '#10B981',
    progressPercent: 24,
    earnedStars: 8,
    totalStars: 54,
    completedCourses: 1,
    totalCourses: 5,
    dataset: BACKEND_COURSES_DATASET,
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    tagline: 'Infraestructura & CI/CD',
    technologies: 'Linux, Git, Docker, K8s',
    icon: IconBrandDocker,
    color: '#A855F7',
    progressPercent: 12,
    earnedStars: 3,
    totalStars: 48,
    completedCourses: 1,
    totalCourses: 5,
    dataset: DEVOPS_COURSES_DATASET,
  },
  {
    id: 'python',
    title: 'Python Specialist',
    tagline: 'Sintaxis, OOP & Algoritmos',
    technologies: 'Python 3, POO, Scripts, FastAPI',
    icon: IconBrandPython,
    color: '#F59E0B',
    progressPercent: 28,
    earnedStars: 10,
    totalStars: 60,
    completedCourses: 1,
    totalCourses: 6,
    dataset: PYTHON_COURSES_DATASET,
  },
];
