import { GraphDataset, GraphNode, GraphConnection } from '../roadmap-graph.types';

const NODES: GraphNode[] = [
  // Tronco Común
  {
    id: 'py-level-1',
    code: '01',
    label: 'PYTHON 1: FUNDAMENTOS',
    subtitle: 'SINTAXIS, VARIABLES & CONTROL',
    x: 120,
    y: 310,
    variant: 'active',
    iconType: 'brackets',
    stars: 8,
    maxStars: 30,
    xp: 300,
    statusText: 'ACTIVO • EN PROGRESO',
    targetCourseId: 'python-1',
    isUnlocked: true,
  },
  {
    id: 'py-level-2',
    code: '02',
    label: 'PYTHON 2: INTERMEDIO',
    subtitle: 'ESTRUCTURAS, POO & PYTEST',
    x: 290,
    y: 310,
    variant: 'locked',
    iconType: 'lock',
    stars: 0,
    maxStars: 30,
    xp: 350,
    statusText: 'RQ PYTHON 1',
    targetCourseId: 'python-2',
    isUnlocked: false,
  },
  {
    id: 'py-level-3',
    code: '03',
    label: 'PYTHON 3: AVANZADO',
    subtitle: 'ASYNCIO, DECORADORES & PATRONES',
    x: 470,
    y: 310,
    variant: 'locked',
    iconType: 'lock',
    stars: 0,
    maxStars: 30,
    xp: 400,
    statusText: 'RQ PYTHON 2',
    targetCourseId: 'python-3',
    isUnlocked: false,
  },

  // Rama A: Backend (FastAPI + Django)
  {
    id: 'py-fastapi',
    code: 'A1',
    label: 'BACKEND: FASTAPI',
    subtitle: 'APIS ASYNC, PYDANTIC & DOCKER',
    x: 650,
    y: 140,
    variant: 'branch',
    iconType: 'server',
    stars: 0,
    maxStars: 15,
    xp: 350,
    statusText: 'RQ PYTHON 3',
    targetCourseId: 'fastapi-async',
    isUnlocked: false,
  },
  {
    id: 'py-django',
    code: 'A2',
    label: 'BACKEND: DJANGO',
    subtitle: 'MVT, ORM, DRF & SEGURIDAD',
    x: 830,
    y: 140,
    variant: 'branch',
    iconType: 'server',
    stars: 0,
    maxStars: 15,
    xp: 350,
    statusText: 'RQ FASTAPI',
    targetCourseId: 'django-enterprise',
    isUnlocked: false,
  },

  // Rama B: Análisis de Datos
  {
    id: 'py-data',
    code: 'B',
    label: 'ANÁLISIS DE DATOS',
    subtitle: 'PANDAS, EDA, ML & STREAMLIT',
    x: 740,
    y: 310,
    variant: 'branch',
    iconType: 'atom',
    stars: 0,
    maxStars: 30,
    xp: 450,
    statusText: 'RQ PYTHON 3',
    targetCourseId: 'data-analytics',
    isUnlocked: false,
  },

  // Rama C: Python + IA
  {
    id: 'py-ia',
    code: 'C',
    label: 'PYTHON + IA: AGENTES',
    subtitle: 'LLMS, RAG & AGENTES REACT',
    x: 740,
    y: 480,
    variant: 'branch',
    iconType: 'matrix',
    stars: 0,
    maxStars: 30,
    xp: 500,
    statusText: 'RQ PYTHON 3',
    targetCourseId: 'ai-agents',
    isUnlocked: false,
  },

  // Apex Master Gate (Nodo integrador final donde desembocan todas las ramas)
  {
    id: 'py-apex',
    code: 'Ω',
    label: 'APEX MASTER GATE',
    subtitle: 'PROYECTO INTEGRADOR FINAL',
    x: 1020,
    y: 310,
    variant: 'boss',
    iconType: 'skull',
    xp: 800,
    statusText: 'DESAFÍO FINAL • CERTIFICACIÓN',
    targetCourseId: 'python-apex',
    isUnlocked: false,
  },
];

const CONNECTIONS: GraphConnection[] = [
  // Tronco Común
  { id: 'c-py-1-to-2', fromId: 'py-level-1', toId: 'py-level-2', color: '#38BDF8', path: 'M 120 310 C 180 310, 230 310, 290 310' },
  { id: 'c-py-2-to-3', fromId: 'py-level-2', toId: 'py-level-3', color: '#06B6D4', path: 'M 290 310 C 350 310, 410 310, 470 310', isDashed: true },

  // Bifurcación en 3 ramas desde Python 3
  { id: 'c-py-3-to-fa', fromId: 'py-level-3', toId: 'py-fastapi', color: '#8B5CF6', path: 'M 470 310 C 530 310, 580 140, 650 140', isDashed: true },
  { id: 'c-fa-to-dj', fromId: 'py-fastapi', toId: 'py-django', color: '#8B5CF6', path: 'M 650 140 C 710 140, 770 140, 830 140', isDashed: true },
  { id: 'c-py-3-to-data', fromId: 'py-level-3', toId: 'py-data', color: '#06B6D4', path: 'M 470 310 C 560 310, 650 310, 740 310', isDashed: true },
  { id: 'c-py-3-to-ia', fromId: 'py-level-3', toId: 'py-ia', color: '#EC4899', path: 'M 470 310 C 560 310, 650 480, 740 480', isDashed: true },

  // Desembocadura en Apex Master Gate
  { id: 'c-dj-to-apex', fromId: 'py-django', toId: 'py-apex', color: '#10B981', path: 'M 830 140 C 900 140, 950 310, 1020 310', isDashed: true },
  { id: 'c-data-to-apex', fromId: 'py-data', toId: 'py-apex', color: '#06B6D4', path: 'M 740 310 C 830 310, 930 310, 1020 310', isDashed: true },
  { id: 'c-ia-to-apex', fromId: 'py-ia', toId: 'py-apex', color: '#EC4899', path: 'M 740 480 C 830 480, 930 310, 1020 310', isDashed: true },
];

export const PYTHON_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'PYTHON SPECIALIST: DE FUNDAMENTOS A AGENTES AUTÓNOMOS',
  progressPercent: 20,
  nodes: NODES,
  connections: CONNECTIONS,
};
