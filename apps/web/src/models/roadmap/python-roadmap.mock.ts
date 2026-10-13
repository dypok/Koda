import { CodeSimple, BracketsCurly, Gear } from '@phosphor-icons/react';
import { LanguageTrack, RoadmapCourse, SidebarLanguageItem } from './roadmap.types';

const BASIC_LESSONS = [
  { id: 'py-b-01', title: 'Variables y tipos de datos', order: 1, durationMinutes: 5, xp: 15, stars: 3, maxStars: 3, isUnlocked: true, isCompleted: true },
  { id: 'py-b-02', title: 'Operadores y expresiones', order: 2, durationMinutes: 8, xp: 20, stars: 3, maxStars: 3, isUnlocked: true, isCompleted: true },
  { id: 'py-b-03', title: 'Estructuras condicionales (if/else)', order: 3, durationMinutes: 10, xp: 25, stars: 2, maxStars: 3, isUnlocked: true, isCompleted: true },
  { id: 'py-b-04', title: 'Bucles y repetición (while/for)', order: 4, durationMinutes: 10, xp: 25, stars: 0, maxStars: 3, isUnlocked: true, isCompleted: false },
  { id: 'py-b-05', title: 'Funciones y modularidad', order: 5, durationMinutes: 12, xp: 30, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
];

const INTERMEDIATE_LESSONS = [
  { id: 'py-i-01', title: 'Listas, tuplas y diccionarios avanzados', order: 1, durationMinutes: 12, xp: 30, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
  { id: 'py-i-02', title: 'Comprensión de listas y generadores', order: 2, durationMinutes: 15, xp: 35, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
  { id: 'py-i-03', title: 'Programación Orientada a Objetos (POO)', order: 3, durationMinutes: 15, xp: 40, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
  { id: 'py-i-04', title: 'Manejo robusto de excepciones', order: 4, durationMinutes: 10, xp: 30, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
];

const ADVANCED_LESSONS = [
  { id: 'py-a-01', title: 'Decoradores y metaclases', order: 1, durationMinutes: 15, xp: 45, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
  { id: 'py-a-02', title: 'Concurrencia y asyncio', order: 2, durationMinutes: 20, xp: 50, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
  { id: 'py-a-03', title: 'Testing automatizado y pytest', order: 3, durationMinutes: 15, xp: 45, stars: 0, maxStars: 3, isUnlocked: false, isCompleted: false },
];

export const PYTHON_MAIN_COURSES: RoadmapCourse[] = [
  { id: 'py-basic', title: 'Python Básico', shortTitle: 'Básico', level: 'basic', description: 'Sintaxis inicial, variables, condicionales y funciones.', isUnlocked: true, isCompleted: false, totalStars: 15, earnedStars: 8, lessons: BASIC_LESSONS },
  { id: 'py-intermediate', title: 'Python Intermedio', shortTitle: 'Intermedio', level: 'intermediate', description: 'Estructuras de datos, POO y manejo de excepciones.', isUnlocked: false, isCompleted: false, prerequisite: 'Completa Python Básico', totalStars: 12, earnedStars: 0, lessons: INTERMEDIATE_LESSONS },
  { id: 'py-advanced', title: 'Python Avanzado', shortTitle: 'Avanzado', level: 'advanced', description: 'Concurrencia, decoradores, asyncio y testing profesional.', isUnlocked: false, isCompleted: false, prerequisite: 'Completa Python Intermedio', totalStars: 9, earnedStars: 0, lessons: ADVANCED_LESSONS },
];

export const PYTHON_FRAMEWORK_BRANCHES = [
  {
    id: 'fastapi-branch', name: 'Línea 1: FastAPI (APIs Asíncronas)', description: 'Construcción de APIs REST y GraphQL ultra-rápidas en Python moderno.',
    courses: [
      { id: 'py-fw-fastapi', title: 'FastAPI Modern APIs', shortTitle: 'FastAPI', level: 'framework' as const, description: 'Modelos Pydantic, OpenAPI y endpoints async.', isUnlocked: false, isCompleted: false, prerequisite: 'Requiere Python Intermedio', totalStars: 9, earnedStars: 0, lessons: [] },
    ],
  },
  {
    id: 'web-branch', name: 'Línea 2: Django & Flask (Desarrollo Web)', description: 'Patrones full-stack y microservicios ligeros con bases de datos.',
    courses: [
      { id: 'py-fw-django', title: 'Django Full-Stack', shortTitle: 'Django', level: 'framework' as const, description: 'Arquitectura MVT, ORM y panel de administración.', isUnlocked: false, isCompleted: false, prerequisite: 'Requiere Python Intermedio', totalStars: 9, earnedStars: 0, lessons: [] },
      { id: 'py-fw-flask', title: 'Flask Microservices', shortTitle: 'Flask', level: 'framework' as const, description: 'Micro-framework minimalista para servicios ligeros.', isUnlocked: false, isCompleted: false, prerequisite: 'Requiere Python Intermedio', totalStars: 9, earnedStars: 0, lessons: [] },
    ],
  },
];

export const PYTHON_TRACK: LanguageTrack = {
  id: 'python', name: 'Python', slug: 'python', color: '#38BDF8', icon: CodeSimple, isAvailable: true,
  mainCourses: PYTHON_MAIN_COURSES, frameworkBranches: PYTHON_FRAMEWORK_BRANCHES,
};

export const SIDEBAR_LANGUAGES: SidebarLanguageItem[] = [
  { id: 'python', name: 'Python', icon: CodeSimple, color: '#38BDF8', isAvailable: true, totalStars: 54, earnedStars: 8, completedCourses: 1, totalCourses: 5, progressPercent: 24, currentStage: '01 Básico' },
  { id: 'javascript', name: 'JavaScript', icon: BracketsCurly, color: '#FACC15', isAvailable: false, totalStars: 45, earnedStars: 0, completedCourses: 0, totalCourses: 4, progressPercent: 0, currentStage: 'Próximamente' },
  { id: 'typescript', name: 'TypeScript', icon: BracketsCurly, color: '#60A5FA', isAvailable: false, totalStars: 45, earnedStars: 0, completedCourses: 0, totalCourses: 4, progressPercent: 0, currentStage: 'Próximamente' },
  { id: 'rust', name: 'Rust', icon: Gear, color: '#FB923C', isAvailable: false, totalStars: 45, earnedStars: 0, completedCourses: 0, totalCourses: 4, progressPercent: 0, currentStage: 'Próximamente' },
  { id: 'go', name: 'Go', icon: CodeSimple, color: '#22D3EE', isAvailable: false, totalStars: 45, earnedStars: 0, completedCourses: 0, totalCourses: 4, progressPercent: 0, currentStage: 'Próximamente' },
];
