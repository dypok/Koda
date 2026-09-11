import { GraphDataset, GraphNode, GraphConnection } from '../roadmap-graph.types';

const NODES: GraphNode[] = [
  {
    id: 'fe-html', code: '01', label: 'HTML SEMÁNTICO', subtitle: 'ESTRUCTURA & A11Y',
    x: 140, y: 290, variant: 'active', iconType: 'code', stars: 6, maxStars: 9, xp: 90,
    statusText: 'ACTIVO • EN PROGRESO', targetCourseId: 'fe-html', isUnlocked: true,
  },
  {
    id: 'fe-css', code: '02', label: 'CSS MODERNO', subtitle: 'FLEXBOX, GRID & ESTILOS',
    x: 370, y: 290, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 12, xp: 120,
    statusText: 'RQ HTML', targetCourseId: 'fe-css', isUnlocked: false,
  },
  {
    id: 'fe-js-dom', code: '03', label: 'JS & MANEJO DEL DOM', subtitle: 'EVENTOS, SELECTORES & APIS',
    x: 600, y: 290, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 15, xp: 150,
    statusText: 'RQ CSS', targetCourseId: 'fe-js-dom', isUnlocked: false,
  },
  {
    id: 'fe-react', code: 'F1', label: 'REACT & HOOKS', subtitle: 'ESTADO & COMPONENTES',
    x: 820, y: 150, variant: 'branch', iconType: 'lock', stars: 0, maxStars: 9, xp: 140,
    statusText: 'RQ JS DOM', targetCourseId: 'fe-react', isUnlocked: false,
  },
  {
    id: 'fe-tailwind', code: 'F2', label: 'TAILWIND & UI', subtitle: 'SISTEMAS DE DISEÑO',
    x: 820, y: 430, variant: 'branch', iconType: 'lock', stars: 0, maxStars: 9, xp: 130,
    statusText: 'RQ JS DOM', targetCourseId: 'fe-tailwind', isUnlocked: false,
  },
  {
    id: 'fe-apex', code: 'Ω', label: 'APEX FRONTEND GATE', subtitle: 'PROYECTO SPA INTEGRAL',
    x: 1020, y: 290, variant: 'boss', iconType: 'skull', xp: 500,
    statusText: 'DESAFÍO FINAL • 3 FASES', isUnlocked: false,
  },
];

const CONNECTIONS: GraphConnection[] = [
  { id: 'c-html-to-css', fromId: 'fe-html', toId: 'fe-css', color: '#38BDF8', path: 'M 140 290 C 220 290, 290 290, 370 290' },
  { id: 'c-css-to-js', fromId: 'fe-css', toId: 'fe-js-dom', color: '#F59E0B', path: 'M 370 290 C 450 290, 520 290, 600 290', isDashed: true },
  { id: 'c-js-to-react', fromId: 'fe-js-dom', toId: 'fe-react', color: '#06B6D4', path: 'M 600 290 C 670 290, 720 150, 820 150', isDashed: true },
  { id: 'c-js-to-tailwind', fromId: 'fe-js-dom', toId: 'fe-tailwind', color: '#10B981', path: 'M 600 290 C 670 290, 720 430, 820 430', isDashed: true },
  { id: 'c-js-to-apex', fromId: 'fe-js-dom', toId: 'fe-apex', color: '#475569', path: 'M 600 290 L 1020 290', isDashed: true },
  { id: 'c-react-to-apex', fromId: 'fe-react', toId: 'fe-apex', color: '#06B6D4', path: 'M 820 150 C 900 150, 950 250, 1020 290', isDashed: true },
  { id: 'c-tailwind-to-apex', fromId: 'fe-tailwind', toId: 'fe-apex', color: '#10B981', path: 'M 820 430 C 900 430, 950 330, 1020 290', isDashed: true },
];

export const FRONTEND_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'FRONTEND WEB & DOM TRACK',
  progressPercent: 18,
  nodes: NODES,
  connections: CONNECTIONS,
};
