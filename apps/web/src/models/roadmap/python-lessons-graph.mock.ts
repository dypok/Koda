import { GraphDataset, GraphNode, GraphConnection } from './roadmap-graph.types';

const NODES: GraphNode[] = [
  {
    id: 'les-01', code: '01', label: 'SYNTAX GENESIS', subtitle: 'VARIABLES & TIPOS',
    x: 130, y: 340, variant: 'completed', iconType: 'brackets', stars: 3, maxStars: 3, xp: 200,
    statusText: 'DOMINADO • +200 XP', isUnlocked: true,
  },
  {
    id: 'les-02', code: '02', label: 'SCOPE MATRIX', subtitle: 'OPERADORES & LOGICA',
    x: 270, y: 240, variant: 'completed', iconType: 'flow', stars: 3, maxStars: 3, xp: 250,
    statusText: 'DOMINADO • +250 XP', isUnlocked: true,
  },
  {
    id: 'les-03', code: '03', label: 'CLOSURE CORE', subtitle: 'CONDICIONALES IF/ELSE',
    x: 410, y: 370, variant: 'completed', iconType: 'atom', stars: 2, maxStars: 3, xp: 300,
    statusText: 'DOMINADO • +300 XP', isUnlocked: true,
  },
  {
    id: 'les-04', code: '04', label: 'CONTROL FLOW', subtitle: 'BUCLES FOR & WHILE',
    x: 570, y: 300, variant: 'active', iconType: 'matrix', stars: 0, maxStars: 3, xp: 250,
    statusText: 'EN PROGRESO • +250 XP', badge: 'ACTIVE • STEP 3/4', isUnlocked: true,
  },
  {
    id: 'les-05a', code: '05A', label: 'MODULAR MATRIX', subtitle: 'FUNCIONES & PARAMETROS',
    x: 740, y: 190, variant: 'locked', iconType: 'lock', xp: 350,
    statusText: 'SELLADO • REQ. PASO 4', badge: 'SECTOR γ • FUNCIONES', isUnlocked: false,
  },
  {
    id: 'les-05b', code: '05B', label: 'MEMORY & DICTS', subtitle: 'ESTRUCTURAS BÁSICAS',
    x: 750, y: 410, variant: 'unlocked', iconType: 'code', xp: 350,
    statusText: 'DISPONIBLE • +350 XP', isUnlocked: true,
  },
  {
    id: 'les-bonus', code: '★', label: 'BONUS LOOT CHEST', subtitle: 'RETO ALGORÍTMICO',
    x: 750, y: 530, variant: 'bonus', iconType: 'chest', xp: 150,
    statusText: '+150 XP & CYBER THEME', isUnlocked: true,
  },
  {
    id: 'les-boss', code: 'Ω', label: 'APEX BOSS GATE', subtitle: 'DESAFÍO FINAL DE SECTOR',
    x: 960, y: 260, variant: 'boss', iconType: 'skull', xp: 450,
    statusText: 'PRUEBA FINAL • 3 FASES', isUnlocked: false,
  },
];

const CONNECTIONS: GraphConnection[] = [
  { id: 'c-01-02', fromId: 'les-01', toId: 'les-02', color: '#38BDF8', path: 'M 130 340 C 180 340, 210 240, 270 240' },
  { id: 'c-02-03', fromId: 'les-02', toId: 'les-03', color: '#38BDF8', path: 'M 270 240 C 330 240, 350 370, 410 370' },
  { id: 'c-03-04', fromId: 'les-03', toId: 'les-04', color: '#F97316', path: 'M 410 370 C 470 370, 500 300, 570 300' },
  { id: 'c-04-05a', fromId: 'les-04', toId: 'les-05a', color: '#A855F7', path: 'M 570 300 C 640 300, 680 190, 740 190' },
  { id: 'c-04-05b', fromId: 'les-04', toId: 'les-05b', color: '#10B981', path: 'M 570 300 C 640 300, 680 410, 750 410' },
  { id: 'c-05b-bonus', fromId: 'les-05b', toId: 'les-bonus', color: '#F59E0B', path: 'M 750 410 L 750 530' },
  { id: 'c-05a-boss', fromId: 'les-05a', toId: 'les-boss', color: '#A855F7', path: 'M 740 190 C 820 190, 880 260, 960 260', isDashed: true },
  { id: 'c-05b-boss', fromId: 'les-05b', toId: 'les-boss', color: '#10B981', path: 'M 750 410 C 820 410, 880 260, 960 260', isDashed: true },
];

export const PYTHON_BASIC_LESSONS_DATASET: GraphDataset = {
  sectorTitle: 'SECTOR 02: PYTHON BÁSICO',
  sectorTag: 'SECTOR ALPHA: CORE FUNDAMENTALS [3/5 MASTERED]',
  progressPercent: 68,
  nodes: NODES,
  connections: CONNECTIONS,
};
