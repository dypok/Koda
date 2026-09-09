import { GraphDataset, GraphNode, GraphConnection } from './roadmap-graph.types';

const NODES: GraphNode[] = [
  {
    id: 'py-course-basic', code: '01', label: 'PYTHON BÁSICO', subtitle: 'FUNDAMENTOS & SINTAXIS',
    x: 140, y: 290, variant: 'active', iconType: 'brackets', stars: 8, maxStars: 15, xp: 115,
    statusText: 'ACTIVO • CLIC PARA VER CLASES', targetCourseId: 'py-basic', isUnlocked: true,
  },
  {
    id: 'py-course-intermediate', code: '02', label: 'PYTHON INTERMEDIO', subtitle: 'POO & ESTRUCTURAS',
    x: 370, y: 290, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 12, xp: 135,
    statusText: 'SELLADO • REQ. BÁSICO', targetCourseId: 'py-intermediate', isUnlocked: false,
  },
  {
    id: 'py-course-advanced', code: '03', label: 'PYTHON AVANZADO', subtitle: 'ASYNCIO & CONCURRENCIA',
    x: 600, y: 290, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 9, xp: 140,
    statusText: 'SELLADO • REQ. INTERMEDIO', targetCourseId: 'py-advanced', isUnlocked: false,
  },
  {
    id: 'py-fw-fastapi', code: 'F1', label: 'FASTAPI ASYNC', subtitle: 'MICROSERVICIOS REST',
    x: 820, y: 150, variant: 'branch', iconType: 'server', stars: 0, maxStars: 9, xp: 150,
    statusText: 'SELLADO • REQ. AVANZADO', targetCourseId: 'py-fw-fastapi', isUnlocked: false,
  },
  {
    id: 'py-fw-django', code: 'F2', label: 'DJANGO & FLASK', subtitle: 'FULL-STACK & ORM',
    x: 820, y: 430, variant: 'branch', iconType: 'database', stars: 0, maxStars: 18, xp: 180,
    statusText: 'SELLADO • REQ. AVANZADO', targetCourseId: 'py-fw-django', isUnlocked: false,
  },
  {
    id: 'py-course-boss', code: 'Ω', label: 'APEX MASTER GATE', subtitle: 'PROYECTO INTEGRAL PYTHON',
    x: 1020, y: 290, variant: 'boss', iconType: 'skull', xp: 500,
    statusText: 'DESAFÍO FINAL • 3 FASES', isUnlocked: false,
  },
];

const CONNECTIONS: GraphConnection[] = [
  { id: 'c-b-to-i', fromId: 'py-course-basic', toId: 'py-course-intermediate', color: '#38BDF8', path: 'M 140 290 C 220 290, 290 290, 370 290' },
  { id: 'c-i-to-a', fromId: 'py-course-intermediate', toId: 'py-course-advanced', color: '#64748B', path: 'M 370 290 C 450 290, 520 290, 600 290', isDashed: true },
  { id: 'c-a-to-fastapi', fromId: 'py-course-advanced', toId: 'py-fw-fastapi', color: '#A855F7', path: 'M 600 290 C 670 290, 720 150, 820 150', isDashed: true },
  { id: 'c-a-to-django', fromId: 'py-course-advanced', toId: 'py-fw-django', color: '#10B981', path: 'M 600 290 C 670 290, 720 430, 820 430', isDashed: true },
  { id: 'c-a-to-boss', fromId: 'py-course-advanced', toId: 'py-course-boss', color: '#475569', path: 'M 600 290 L 1020 290', isDashed: true },
  { id: 'c-fastapi-to-boss', fromId: 'py-fw-fastapi', toId: 'py-course-boss', color: '#A855F7', path: 'M 820 150 C 900 150, 950 250, 1020 290', isDashed: true },
  { id: 'c-django-to-boss', fromId: 'py-fw-django', toId: 'py-course-boss', color: '#10B981', path: 'M 820 430 C 900 430, 950 330, 1020 290', isDashed: true },
];

export const PYTHON_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'SECTOR 01: PYTHON TRACK OVERVIEW',
  progressPercent: 24,
  nodes: NODES,
  connections: CONNECTIONS,
};
