import { GraphDataset, GraphNode, GraphConnection } from './roadmap-graph.types';

interface LessonDef {
  id: string;
  code: string;
  label: string;
  subtitle: string;
  variant: 'completed' | 'active' | 'unlocked' | 'locked' | 'branch' | 'boss';
  iconType: 'brackets' | 'flow' | 'atom' | 'matrix' | 'server' | 'skull' | 'code' | 'lock';
  stars: number;
  maxStars: number;
  xp: number;
  statusText: string;
}

function buildSectionDataset(
  sectorTitle: string,
  progressPercent: number,
  lessons: LessonDef[],
  edgeColor = '#38BDF8'
): GraphDataset {
  const count = lessons.length;
  const startX = 110;
  const endX = 1040;
  const stepX = (endX - startX) / (count - 1 || 1);

  const nodes: GraphNode[] = lessons.map((l, i) => {
    const x = Math.round(startX + i * stepX);
    // Patrón ondulado suave alternando arriba (230) y abajo (390), primer y último nodo más centrados (310)
    let y = 310;
    if (i > 0 && i < count - 1) {
      y = i % 2 === 1 ? 230 : 390;
    }
    return {
      id: l.id,
      code: l.code,
      label: l.label,
      subtitle: l.subtitle,
      x,
      y,
      variant: l.variant,
      iconType: l.iconType,
      stars: l.stars,
      maxStars: l.maxStars,
      xp: l.xp,
      statusText: l.statusText,
      isUnlocked: l.variant !== 'locked',
    };
  });

  const connections: GraphConnection[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const n1 = nodes[i];
    const n2 = nodes[i + 1];
    const midX = Math.round((n1.x + n2.x) / 2);
    connections.push({
      id: `c-${n1.id}-to-${n2.id}`,
      fromId: n1.id,
      toId: n2.id,
      color: edgeColor,
      path: `M ${n1.x} ${n1.y} C ${midX} ${n1.y}, ${midX} ${n2.y}, ${n2.x} ${n2.y}`,
      isDashed: !n2.isUnlocked,
    });
  }

  return {
    sectorTitle,
    progressPercent,
    nodes,
    connections,
  };
}

// 1. Python 1: Fundamentos
export const PYTHON_1_LESSONS_DATASET = buildSectionDataset(
  'PYTHON 1: FUNDAMENTOS & SINTAXIS',
  45,
  [
    { id: 'les-01', code: '01', label: 'ENTORNO & SINTAXIS', subtitle: 'VS CODE, VENV & PRINT', variant: 'completed', iconType: 'brackets', stars: 3, maxStars: 3, xp: 120, statusText: 'DOMINADO • +120 XP' },
    { id: 'les-02', code: '02', label: 'VARIABLES & TIPOS', subtitle: 'INT, FLOAT, STR, BOOL & TYPE', variant: 'completed', iconType: 'flow', stars: 3, maxStars: 3, xp: 150, statusText: 'DOMINADO • +150 XP' },
    { id: 'les-03', code: '03', label: 'OPERADORES & LÓGICA', subtitle: 'ARITMÉTICA & BOOLEANOS', variant: 'completed', iconType: 'atom', stars: 3, maxStars: 3, xp: 180, statusText: 'DOMINADO • +180 XP' },
    { id: 'les-04', code: '04', label: 'ENTRADA/SALIDA & STRINGS', subtitle: 'INPUT(), PRINT() & F-STRINGS', variant: 'completed', iconType: 'matrix', stars: 3, maxStars: 3, xp: 180, statusText: 'DOMINADO • +180 XP' },
    { id: 'les-05', code: '05', label: 'CONDICIONALES', subtitle: 'IF, ELIF, ELSE & DECISIONES', variant: 'active', iconType: 'code', stars: 1, maxStars: 3, xp: 200, statusText: 'EN PROGRESO • +200 XP' },
    { id: 'les-miniboss', code: '🛡️', label: 'GUARDIÁN DE LA LÓGICA', subtitle: 'MINI-BOSS: RETO MÓDULOS 1-5', variant: 'branch', iconType: 'code', stars: 0, maxStars: 3, xp: 250, statusText: 'MINI-BOSS • REQUIERE M05' },
    { id: 'les-06', code: '06', label: 'BUCLE FOR', subtitle: 'ITERACIÓN CON FOR & RANGE()', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 220, statusText: 'RQ GUARDIÁN' },
    { id: 'les-07', code: '07', label: 'BUCLE WHILE', subtitle: 'REPETICIÓN CONDICIONAL & FLAGS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 220, statusText: 'RQ BUCLE FOR' },
    { id: 'les-08', code: '08', label: 'LISTAS & TUPLAS', subtitle: 'COLECCIONES & MUTABILIDAD', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 240, statusText: 'RQ BUCLE WHILE' },
    { id: 'les-09', code: '09', label: 'DICCIONARIOS & SETS', subtitle: 'CLAVE-VALOR & UNICIDAD', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 240, statusText: 'RQ LISTAS & TUPLAS' },
    { id: 'les-10', code: '10', label: 'FUNCIONES & ERRORES', subtitle: 'DEF, RETURN & DEBUGGING', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 260, statusText: 'RQ DICCIONARIOS' },
    { id: 'les-boss', code: 'Ω', label: 'APEX BOSS GATE 1', subtitle: 'EXAMEN DE CERTIFICACIÓN M01-M10', variant: 'boss', iconType: 'skull', stars: 0, maxStars: 3, xp: 500, statusText: 'DESAFÍO FINAL FUNDAMENTOS' },
  ],
  '#38BDF8'
);

// 2. Python 2: Intermedio
export const PYTHON_2_LESSONS_DATASET = buildSectionDataset(
  'PYTHON 2: INTERMEDIO & PROGRAMACIÓN ORIENTADA A OBJETOS',
  0,
  [
    { id: 'py2-01', code: '01', label: 'COMPRENSIONES', subtitle: 'LIST, DICT & SET COMPREHENSIONS', variant: 'active', iconType: 'brackets', stars: 0, maxStars: 3, xp: 200, statusText: 'DISPONIBLE • +200 XP' },
    { id: 'py2-02', code: '02', label: 'FUNCIONES AVANZADAS', subtitle: '*ARGS, **KWARGS & LAMBDAS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 220, statusText: 'RQ COMPRENSIONES' },
    { id: 'py2-03', code: '03', label: 'MÓDULOS & PAQUETES', subtitle: '__INIT__.PY & IMPORTACIONES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 220, statusText: 'RQ FUNCIONES AVANZADAS' },
    { id: 'py2-04', code: '04', label: 'MANEJO DE EXCEPCIONES', subtitle: 'TRY, EXCEPT, RAISE & FINALLY', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 240, statusText: 'RQ MÓDULOS' },
    { id: 'py2-miniboss', code: '🛡️', label: 'CENTINELA MODULAR', subtitle: 'MINI-BOSS: RETO MÓDULOS 1-4', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 300, statusText: 'RQ EXCEPCIONES' },
    { id: 'py2-05', code: '05', label: 'ARCHIVOS I/O', subtitle: 'TXT, CSV, JSON & WITH OPEN()', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 250, statusText: 'RQ CENTINELA' },
    { id: 'py2-06', code: '06', label: 'POO I: CLASES & OBJETOS', subtitle: 'ATRIBUTOS, MÉTODOS & __INIT__', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 260, statusText: 'RQ ARCHIVOS I/O' },
    { id: 'py2-07', code: '07', label: 'POO II: HERENCIA', subtitle: 'SUPER(), POLIMORFISMO & MRO', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 260, statusText: 'RQ POO I' },
    { id: 'py2-08', code: '08', label: 'DATETIME & REGEX', subtitle: 'TIEMPO & EXPRESIONES REGULARES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 250, statusText: 'RQ HERENCIA' },
    { id: 'py2-09', code: '09', label: 'PIP, VENV & GIT', subtitle: 'DEPENDENCIAS & CONTROL DE VERSIONES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 250, statusText: 'RQ DATETIME' },
    { id: 'py2-10', code: '10', label: 'TESTING CON PYTEST', subtitle: 'ASSERTS, FIXTURES & TDD BÁSICO', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 280, statusText: 'RQ PIP & GIT' },
    { id: 'py2-boss', code: 'Ω', label: 'APEX BOSS GATE 2', subtitle: 'PROYECTO INTEGRADOR INTERMEDIO', variant: 'locked', iconType: 'skull', stars: 0, maxStars: 3, xp: 600, statusText: 'DESAFÍO FINAL INTERMEDIO' },
  ],
  '#06B6D4'
);

// 3. Python 3: Avanzado
export const PYTHON_3_LESSONS_DATASET = buildSectionDataset(
  'PYTHON 3: AVANZADO, CONCURRENCIA & ARQUITECTURA',
  0,
  [
    { id: 'py3-01', code: '01', label: 'ITERADORES & GENERADORES', subtitle: '__ITER__, __NEXT__ & YIELD', variant: 'active', iconType: 'brackets', stars: 0, maxStars: 3, xp: 250, statusText: 'DISPONIBLE • +250 XP' },
    { id: 'py3-02', code: '02', label: 'DECORADORES', subtitle: 'CLOSURES, @WRAPS & DECORADORES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 260, statusText: 'RQ GENERADORES' },
    { id: 'py3-03', code: '03', label: 'CONTEXT MANAGERS', subtitle: '__ENTER__, __EXIT__ & CONTEXTLIB', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 260, statusText: 'RQ DECORADORES' },
    { id: 'py3-04', code: '04', label: 'TYPE HINTS & DATACLASSES', subtitle: 'TYPING, PROTOCOLS & @DATACLASS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 270, statusText: 'RQ CONTEXT MANAGERS' },
    { id: 'py3-miniboss', code: '🛡️', label: 'GUARDIÁN DEL PATRÓN', subtitle: 'MINI-BOSS: RETO MÓDULOS 1-4', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 350, statusText: 'RQ DATACLASSES' },
    { id: 'py3-05', code: '05', label: 'PROG. FUNCIONAL', subtitle: 'ITERTOOLS, FUNCTOOLS & PARTIAL', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 280, statusText: 'RQ GUARDIÁN' },
    { id: 'py3-06', code: '06', label: 'CONCURRENCIA & ASYNCIO', subtitle: 'ASYNC, AWAIT, TASKS & GATHER', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 320, statusText: 'RQ PROG. FUNCIONAL' },
    { id: 'py3-07', code: '07', label: 'PEP 8 & RUFF', subtitle: 'LINTERS, FORMATEADORES & DOCSTRINGS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 260, statusText: 'RQ ASYNCIO' },
    { id: 'py3-08', code: '08', label: 'LOGGING & EMPAQUETADO', subtitle: 'LOGGER PROFESIONAL & PYPROJECT', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 270, statusText: 'RQ PEP 8' },
    { id: 'py3-09', code: '09', label: 'PROFILING & MEMORIA', subtitle: 'CPROFILE, TIMEIT & OPTIMIZACIÓN', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 300, statusText: 'RQ LOGGING' },
    { id: 'py3-10', code: '10', label: 'PATRONES DE DISEÑO', subtitle: 'FACTORY, SINGLETON & OBSERVER', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 320, statusText: 'RQ PROFILING' },
    { id: 'py3-boss', code: 'Ω', label: 'APEX BOSS GATE 3', subtitle: 'EXAMEN INTEGRAL AVANZADO', variant: 'locked', iconType: 'skull', stars: 0, maxStars: 3, xp: 700, statusText: 'DESAFÍO FINAL AVANZADO' },
  ],
  '#F59E0B'
);

// 4. FastAPI
export const FASTAPI_LESSONS_DATASET = buildSectionDataset(
  'RAMA BACKEND: FASTAPI ASÍNCRONO & MICROSERVICIOS',
  0,
  [
    { id: 'fa-01', code: '01', label: 'HTTP & ASGI', subtitle: 'ARQUITECTURA FASTAPI & UVICORN', variant: 'active', iconType: 'server', stars: 0, maxStars: 3, xp: 250, statusText: 'DISPONIBLE • +250 XP' },
    { id: 'fa-02', code: '02', label: 'PYDANTIC V2', subtitle: 'VALIDACIÓN, SCHEMAS & TIPADO', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 280, statusText: 'RQ HTTP & ASGI' },
    { id: 'fa-03', code: '03', label: 'SQLALCHEMY & ALEMBIC', subtitle: 'PERSISTENCIA ORM & MIGRACIONES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 300, statusText: 'RQ PYDANTIC' },
    { id: 'fa-04', code: '04', label: 'AUTENTICACIÓN JWT', subtitle: 'OAUTH2, PASSWORD HASH & DEPENDS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 320, statusText: 'RQ SQLALCHEMY' },
    { id: 'fa-05', code: '05', label: 'DOCKER & DESPLIEGUE', subtitle: 'CONTAINERIZACIÓN & TESTING APIS', variant: 'locked', iconType: 'skull', stars: 0, maxStars: 3, xp: 400, statusText: 'PROYECTO FINAL FASTAPI' },
  ],
  '#8B5CF6'
);

// 5. Django
export const DJANGO_LESSONS_DATASET = buildSectionDataset(
  'RAMA BACKEND: DJANGO ENTERPRISE & REST FRAMEWORK',
  0,
  [
    { id: 'dj-01', code: '01', label: 'ARQUITECTURA MVT', subtitle: 'SETTINGS, URLS & VISTAS', variant: 'active', iconType: 'server', stars: 0, maxStars: 3, xp: 250, statusText: 'DISPONIBLE • +250 XP' },
    { id: 'dj-02', code: '02', label: 'DJANGO ORM', subtitle: 'MODELOS, RELACIONES & QUERIES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 280, statusText: 'RQ ARQUITECTURA MVT' },
    { id: 'dj-03', code: '03', label: 'FORMS & ADMIN', subtitle: 'PANEL ADMINISTRATIVO & FORMULARIOS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 300, statusText: 'RQ DJANGO ORM' },
    { id: 'dj-04', code: '04', label: 'DJANGO REST FRAMEWORK', subtitle: 'SERIALIZADORES, VIEWSETS & ROUTERS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 320, statusText: 'RQ FORMS & ADMIN' },
    { id: 'dj-05', code: '05', label: 'SEGURIDAD & DEPLOY', subtitle: 'AUTENTICACIÓN, CSRF & PRODUCCIÓN', variant: 'locked', iconType: 'skull', stars: 0, maxStars: 3, xp: 400, statusText: 'PROYECTO FINAL DJANGO' },
  ],
  '#10B981'
);

// 6. Data Analytics
export const DATA_ANALYTICS_LESSONS_DATASET = buildSectionDataset(
  'RAMA ANÁLISIS DE DATOS: NUMPY, PANDAS, EDA & STREAMLIT',
  0,
  [
    { id: 'da-01', code: '01', label: 'NUMPY VECTORIZADO', subtitle: 'ARRAYS, INDEXING & OPERACIONES', variant: 'active', iconType: 'atom', stars: 0, maxStars: 3, xp: 250, statusText: 'DISPONIBLE • +250 XP' },
    { id: 'da-02', code: '02', label: 'PANDAS SERIES & DF', subtitle: 'ESTRUCTURAS, CARGA CSV/PARQUET', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 260, statusText: 'RQ NUMPY' },
    { id: 'da-03', code: '03', label: 'LIMPIEZA DE DATOS', subtitle: 'DATOS NULOS, CASTING & DUPLICADOS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 280, statusText: 'RQ PANDAS SERIES' },
    { id: 'da-04', code: '04', label: 'AGRUPACIONES & MERGES', subtitle: 'GROUPBY, AGG, MERGE & CONCAT', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 290, statusText: 'RQ LIMPIEZA' },
    { id: 'da-miniboss', code: '🛡️', label: 'RETO WRANGLING', subtitle: 'MINI-BOSS: LIMPIEZA DE DATASET REAL', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 350, statusText: 'RQ AGRUPACIONES' },
    { id: 'da-05', code: '05', label: 'MATPLOTLIB & SEABORN', subtitle: 'DISTRIBUCIONES & CORRELACIONES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 280, statusText: 'RQ RETO WRANGLING' },
    { id: 'da-06', code: '06', label: 'PLOTLY INTERACTIVO', subtitle: 'GRÁFICOS MODERNOS E INTERACTIVOS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 290, statusText: 'RQ MATPLOTLIB' },
    { id: 'da-07', code: '07', label: 'EDA & ESTADÍSTICA', subtitle: 'ANÁLISIS EXPLORATORIO & OUTLIERS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 300, statusText: 'RQ PLOTLY' },
    { id: 'da-08', code: '08', label: 'SQL CON PYTHON', subtitle: 'SQLITE3, DUCKDB & READ_SQL', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 300, statusText: 'RQ EDA' },
    { id: 'da-09', code: '09', label: 'SCIKIT-LEARN INTRO ML', subtitle: 'REGRESIÓN & CLASIFICACIÓN BASE', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 320, statusText: 'RQ SQL' },
    { id: 'da-10', code: '10', label: 'STREAMLIT DASHBOARDS', subtitle: 'APLICACIONES WEB CON DATOS EN VIVO', variant: 'locked', iconType: 'skull', stars: 0, maxStars: 3, xp: 450, statusText: 'PROYECTO FINAL DATOS' },
  ],
  '#06B6D4'
);

// 7. AI & Agents
export const AI_AGENTS_LESSONS_DATASET = buildSectionDataset(
  'RAMA PYTHON + IA: ARQUITECTURA DE AGENTES AUTÓNOMOS',
  0,
  [
    { id: 'ia-01', code: '01', label: 'LLMS & PROMPTING', subtitle: 'ARQUITECTURA, TOKENS & SYSTEM PROMPTS', variant: 'active', iconType: 'matrix', stars: 0, maxStars: 3, xp: 260, statusText: 'DISPONIBLE • +260 XP' },
    { id: 'ia-02', code: '02', label: 'APIS DE MODELOS', subtitle: 'SDK CLIENTS, STREAMING & TEMPERATURA', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 280, statusText: 'RQ LLMS' },
    { id: 'ia-03', code: '03', label: 'SALIDAS ESTRUCTURADAS', subtitle: 'JSON MODE & VALIDACIÓN CON PYDANTIC', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 300, statusText: 'RQ APIS' },
    { id: 'ia-04', code: '04', label: 'FUNCTION CALLING', subtitle: 'HERRAMIENTAS & DECLARACIÓN DE TOOLS', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 320, statusText: 'RQ SALIDAS' },
    { id: 'ia-miniboss', code: '🛡️', label: 'TOOL CALLER MASTER', subtitle: 'MINI-BOSS: AGENTE DE CONSULTA AUTOMATIZADA', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 380, statusText: 'RQ FUNCTION CALLING' },
    { id: 'ia-05', code: '05', label: 'MEMORIA & CONTEXTO', subtitle: 'WINDOW BUFFERS, SUMMARY & ESTADO', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 310, statusText: 'RQ TOOL CALLER' },
    { id: 'ia-06', code: '06', label: 'EMBEDDINGS & VECTOR DBS', subtitle: 'CHROMADB, COSINE SIMILARITY & ÍNDICES', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 330, statusText: 'RQ MEMORIA' },
    { id: 'ia-07', code: '07', label: 'RAG DE PUNTA A PUNTA', subtitle: 'CHUNK, RETRIEVE & CONTEXT INJECTION', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 350, statusText: 'RQ EMBEDDINGS' },
    { id: 'ia-08', code: '08', label: 'BUCLE REACT AGENT', subtitle: 'THOUGHT, ACTION & OBSERVATION LOOP', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 380, statusText: 'RQ RAG' },
    { id: 'ia-09', code: '09', label: 'GUARDRAILS & SEGURIDAD', subtitle: 'PROMPT INJECTION & VALIDACIÓN OUTPUT', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 340, statusText: 'RQ BUCLE REACT' },
    { id: 'ia-10', code: '10', label: 'AGENTE AUTÓNOMO COMPLETO', subtitle: 'MULTI-TOOL AGENT CON INTERFAZ WEB', variant: 'locked', iconType: 'skull', stars: 0, maxStars: 3, xp: 500, statusText: 'PROYECTO FINAL AGENTE' },
  ],
  '#EC4899'
);

// 8. Apex Master Gate
export const APEX_GATE_LESSONS_DATASET = buildSectionDataset(
  'APEX MASTER GATE: PROYECTO INTEGRADOR DE CERTIFICACIÓN',
  0,
  [
    { id: 'apex-01', code: '01', label: 'FASE 1: ARQUITECTURA', subtitle: 'DISEÑO DEL SISTEMA & CONCURRENCIA', variant: 'active', iconType: 'brackets', stars: 0, maxStars: 3, xp: 400, statusText: 'DISPONIBLE • +400 XP' },
    { id: 'apex-02', code: '02', label: 'FASE 2: SERVICIOS & IA', subtitle: 'BACKEND, RAG & PROCESAMIENTO', variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 500, statusText: 'RQ FASE 1' },
    { id: 'apex-03', code: '03', label: 'FASE 3: AUDITORÍA & DEPLOY', subtitle: 'TESTING INTEGRAL & CERTIFICACIÓN', variant: 'locked', iconType: 'skull', stars: 0, maxStars: 3, xp: 700, statusText: 'CERTIFICACIÓN PROFESIONAL' },
  ],
  '#F43F5E'
);

export const PYTHON_BASIC_LESSONS_DATASET = PYTHON_1_LESSONS_DATASET;

export function getLessonsDatasetForCourse(courseId: string): GraphDataset {
  switch (courseId) {
    case 'python-1':
    case 'py-basic':
      return PYTHON_1_LESSONS_DATASET;
    case 'python-2':
    case 'py-intermediate':
      return PYTHON_2_LESSONS_DATASET;
    case 'python-3':
    case 'py-advanced':
      return PYTHON_3_LESSONS_DATASET;
    case 'fastapi-async':
    case 'py-fastapi':
      return FASTAPI_LESSONS_DATASET;
    case 'django-enterprise':
    case 'py-django':
      return DJANGO_LESSONS_DATASET;
    case 'data-analytics':
    case 'py-data':
      return DATA_ANALYTICS_LESSONS_DATASET;
    case 'ai-agents':
    case 'py-ia':
      return AI_AGENTS_LESSONS_DATASET;
    case 'python-apex':
    case 'py-apex':
      return APEX_GATE_LESSONS_DATASET;
    default:
      return PYTHON_1_LESSONS_DATASET;
  }
}
