import { GraphDataset, GraphNode, GraphConnection } from '../roadmap-graph.types';

const NODES: GraphNode[] = [
  {
    id: 'be-py-core', code: '01', label: 'PYTHON BACKEND', subtitle: 'SINTAXIS, POO & ESTRUCTURAS',
    x: 140, y: 290, variant: 'active', iconType: 'brackets', stars: 8, maxStars: 15, xp: 115,
    statusText: 'ACTIVO • EN PROGRESO', targetCourseId: 'py-basic', isUnlocked: true,
  },
  {
    id: 'be-sql', code: '02', label: 'BASES DE DATOS & SQL', subtitle: 'MODELADO, ORM & CONSULTAS',
    x: 370, y: 290, variant: 'locked', iconType: 'database', stars: 0, maxStars: 12, xp: 135,
    statusText: 'SELLADO • REQ. PYTHON', targetCourseId: 'be-sql', isUnlocked: false,
  },
  {
    id: 'be-apis', code: '03', label: 'APIS REST & FASTAPI', subtitle: 'ENDPOINTS ASYNC & PYDANTIC',
    x: 600, y: 290, variant: 'locked', iconType: 'server', stars: 0, maxStars: 15, xp: 150,
    statusText: 'SELLADO • REQ. SQL', targetCourseId: 'be-apis', isUnlocked: false,
  },
  {
    id: 'be-go', code: 'B1', label: 'GO CONCURRENTE', subtitle: 'GOROUTINES & BAJA LATENCIA',
    x: 820, y: 150, variant: 'branch', iconType: 'server', stars: 0, maxStars: 12, xp: 160,
    statusText: 'SELLADO • REQ. APIS', targetCourseId: 'be-go', isUnlocked: false,
  },
  {
    id: 'be-django', code: 'B2', label: 'DJANGO FULL-STACK', subtitle: 'ARQUITECTURA MVT & AUTH',
    x: 820, y: 430, variant: 'branch', iconType: 'database', stars: 0, maxStars: 12, xp: 160,
    statusText: 'SELLADO • REQ. APIS', targetCourseId: 'be-django', isUnlocked: false,
  },
  {
    id: 'be-apex', code: 'Ω', label: 'APEX BACKEND GATE', subtitle: 'SISTEMAS DISTRIBUIDOS',
    x: 1020, y: 290, variant: 'boss', iconType: 'skull', xp: 500,
    statusText: 'DESAFÍO FINAL • 3 FASES', isUnlocked: false,
  },
];

const CONNECTIONS: GraphConnection[] = [
  { id: 'c-py-to-sql', fromId: 'be-py-core', toId: 'be-sql', color: '#38BDF8', path: 'M 140 290 C 220 290, 290 290, 370 290' },
  { id: 'c-sql-to-apis', fromId: 'be-sql', toId: 'be-apis', color: '#64748B', path: 'M 370 290 C 450 290, 520 290, 600 290', isDashed: true },
  { id: 'c-apis-to-go', fromId: 'be-apis', toId: 'be-go', color: '#22D3EE', path: 'M 600 290 C 670 290, 720 150, 820 150', isDashed: true },
  { id: 'c-apis-to-django', fromId: 'be-apis', toId: 'be-django', color: '#10B981', path: 'M 600 290 C 670 290, 720 430, 820 430', isDashed: true },
  { id: 'c-apis-to-apex', fromId: 'be-apis', toId: 'be-apex', color: '#475569', path: 'M 600 290 L 1020 290', isDashed: true },
  { id: 'c-go-to-apex', fromId: 'be-go', toId: 'be-apex', color: '#22D3EE', path: 'M 820 150 C 900 150, 950 250, 1020 290', isDashed: true },
  { id: 'c-django-to-apex', fromId: 'be-django', toId: 'be-apex', color: '#10B981', path: 'M 820 430 C 900 430, 950 330, 1020 290', isDashed: true },
];

export const BACKEND_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'SECTOR 02: BACKEND & DISTRIBUTED SYSTEMS',
  progressPercent: 24,
  nodes: NODES,
  connections: CONNECTIONS,
};
