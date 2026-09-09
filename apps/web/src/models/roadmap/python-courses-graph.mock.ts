import { GraphDataset, GraphNode, GraphConnection } from './roadmap-graph.types';

const NODES: GraphNode[] = [
  {
    id: 'py-course-basic', code: '01', label: 'PYTHON BÁSICO', subtitle: 'FUNDAMENTOS & SINTAXIS',
    x: 160, y: 290, variant: 'active', iconType: 'brackets', stars: 8, maxStars: 15, xp: 115,
    statusText: 'ACTIVO • CLIC PARA VER CLASES', badge: 'EN CURSO • 3/5 LECCIONES', targetCourseId: 'py-basic', isUnlocked: true,
  },
  {
    id: 'py-course-intermediate', code: '02', label: 'PYTHON INTERMEDIO', subtitle: 'POO & ESTRUCTURAS',
    x: 460, y: 290, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 12, xp: 135,
    statusText: 'SELLADO • REQ. BÁSICO', targetCourseId: 'py-intermediate', isUnlocked: false,
  },
  {
    id: 'py-fw-fastapi', code: 'F1', label: 'FASTAPI ASYNC', subtitle: 'MICROSERVICIOS REST',
    x: 670, y: 150, variant: 'branch', iconType: 'server', stars: 0, maxStars: 9, xp: 150,
    statusText: 'SELLADO • REQ. INTERMEDIO', badge: 'LÍNEA 1: FRAMEWORKS', targetCourseId: 'py-fw-fastapi', isUnlocked: false,
  },
  {
    id: 'py-fw-django', code: 'F2', label: 'DJANGO & FLASK', subtitle: 'FULL-STACK & ORM',
    x: 670, y: 430, variant: 'branch', iconType: 'database', stars: 0, maxStars: 18, xp: 180,
    statusText: 'SELLADO • REQ. INTERMEDIO', badge: 'LÍNEA 2: FRAMEWORKS', targetCourseId: 'py-fw-django', isUnlocked: false,
  },
  {
    id: 'py-course-advanced', code: '03', label: 'PYTHON AVANZADO', subtitle: 'ASYNCIO & CONCURRENCIA',
    x: 820, y: 290, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 9, xp: 140,
    statusText: 'SELLADO • REQ. INTERMEDIO', targetCourseId: 'py-advanced', isUnlocked: false,
  },
  {
    id: 'py-course-boss', code: 'Ω', label: 'APEX MASTER GATE', subtitle: 'PROYECTO INTEGRAL PYTHON',
    x: 1010, y: 290, variant: 'boss', iconType: 'skull', xp: 500,
    statusText: 'DESAFÍO FINAL • 3 FASES', badge: 'APEX GATE', isUnlocked: false,
  },
];

const CONNECTIONS: GraphConnection[] = [
  { id: 'c-b-to-i', fromId: 'py-course-basic', toId: 'py-course-intermediate', color: '#38BDF8', path: 'M 160 290 C 270 290, 350 290, 460 290' },
  { id: 'c-i-to-fastapi', fromId: 'py-course-intermediate', toId: 'py-fw-fastapi', color: '#A855F7', path: 'M 460 290 C 520 290, 570 150, 670 150', isDashed: true },
  { id: 'c-i-to-django', fromId: 'py-course-intermediate', toId: 'py-fw-django', color: '#10B981', path: 'M 460 290 C 520 290, 570 430, 670 430', isDashed: true },
  { id: 'c-i-to-a', fromId: 'py-course-intermediate', toId: 'py-course-advanced', color: '#64748B', path: 'M 460 290 C 580 290, 700 290, 820 290', isDashed: true },
  { id: 'c-a-to-boss', fromId: 'py-course-advanced', toId: 'py-course-boss', color: '#EF4444', path: 'M 820 290 C 890 290, 930 290, 1010 290', isDashed: true },
];

export const PYTHON_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'SECTOR 01: PYTHON TRACK OVERVIEW',
  sectorTag: 'RUTA PRINCIPAL Y ESPECIALIZACIONES',
  progressPercent: 24,
  nodes: NODES,
  connections: CONNECTIONS,
};
