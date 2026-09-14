import { Monitor, Database, Cube, CodeSimple, Moon } from '@phosphor-icons/react';
import React from 'react';
import { GraphDataset } from '../roadmap-graph.types';
import { FRONTEND_COURSES_DATASET } from './frontend-track.mock';
import { BACKEND_COURSES_DATASET } from './backend-track.mock';
import { DEVOPS_COURSES_DATASET } from './devops-track.mock';
import { PYTHON_COURSES_DATASET } from './python-track.mock';
import { LUA_COURSES_DATASET, LUA_TRACK_TOTALS } from './lua-track.mock';

export type CareerBranchId = 'frontend' | 'backend' | 'devops' | 'python' | 'lua';

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
    icon: Monitor,
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
    icon: Database,
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
    icon: Cube,
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
    icon: CodeSimple,
    color: '#F59E0B',
    progressPercent: 28,
    earnedStars: 10,
    totalStars: 60,
    completedCourses: 1,
    totalCourses: 6,
    dataset: PYTHON_COURSES_DATASET,
  },
  {
    id: 'lua',
    title: 'Lua Specialist',
    tagline: 'Tablas, Metatablas & Corrutinas',
    technologies: 'Lua, Tables, POO, Corrutinas',
    icon: Moon,
    color: '#8FA8FF',
    progressPercent: 8,
    earnedStars: 0,
    totalStars: LUA_TRACK_TOTALS.totalStars,
    completedCourses: 0,
    totalCourses: LUA_TRACK_TOTALS.totalCourses,
    dataset: LUA_COURSES_DATASET,
  },
];
