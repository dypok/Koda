import { GraphDataset } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_BASIC_LESSONS_DATASET, getLessonsDatasetForCourse } from '@/models/roadmap/python-lessons-graph.mock';
import { useAuthStore } from '@/stores/auth.store';

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
// Evita duplicar `/api/v1` cuando el env ya lo incluye.
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, '').endsWith('/api/v1')
  ? RAW_BASE_URL.replace(/\/$/, '')
  : `${RAW_BASE_URL.replace(/\/$/, '')}/api/v1`;

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined'
    ? (useAuthStore.getState().token || localStorage.getItem('koda_auth_token'))
    : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchWithFallback<T>(endpoint: string): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const headers = getAuthHeaders();

  // 1. Probar ruta relativa con proxy si estamos en navegador
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/v1${cleanEndpoint}`, {
        headers,
        cache: 'no-store',
      });
      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch {
      // Continuar al fallback directo
    }
  }

  // 2. Conexión directa a API_BASE_URL
  const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return (await res.json()) as T;
}

export function getDynamicMaxStarsForCourse(courseSlug: string): number {
  const lessons = getLessonsDatasetForCourse(courseSlug);
  if (lessons?.nodes && lessons.nodes.length > 0) {
    return lessons.nodes.reduce((sum, l) => sum + (typeof l.maxStars === 'number' && l.maxStars > 0 ? l.maxStars : 3), 0);
  }
  return COURSE_MAX_STARS_MAP[courseSlug] ?? 24;
}

function sanitizeGraphDataset(dataset: GraphDataset): GraphDataset {
  if (!dataset || !Array.isArray(dataset.nodes) || !Array.isArray(dataset.connections)) {
    return dataset;
  }
  // Excluir terminantemente nodos fantasma o fallbacks obsoletos como python-core
  const filteredNodes = dataset.nodes.filter((n) => {
    const isLegacySlug = n.id === 'python-core' || n.targetCourseId === 'python-core';
    const labelLower = typeof n.label === 'string' ? n.label.toLowerCase() : '';
    const isLegacyLabel =
      labelLower.includes('python 3.12') ||
      labelLower.includes('fundamentos de programación con python 3.12');
    return !isLegacySlug && !isLegacyLabel;
  }).map((n) => {
    const isCourse = Boolean(n.targetCourseId || COURSE_MAX_STARS_MAP[n.id]);
    const courseKey = n.targetCourseId || n.id;
    const maxStars = isCourse
      ? getDynamicMaxStarsForCourse(courseKey)
      : (typeof n.maxStars === 'number' && n.maxStars > 0 ? n.maxStars : 3);

    return {
      ...n,
      stars: typeof n.stars === 'number' ? n.stars : 0,
      maxStars,
    };
  });

  const nodeMap = new Map(filteredNodes.map((n) => [n.id, n]));
  const connections = dataset.connections
    .filter((c) => nodeMap.has(c.fromId) && nodeMap.has(c.toId))
    .map((c) => {
      const a = nodeMap.get(c.fromId)!;
      const b = nodeMap.get(c.toId)!;
      const dx = Math.abs(b.x - a.x) * 0.5;
      return {
        ...c,
        path: `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`,
      };
    });
  return {
    ...dataset,
    nodes: filteredNodes,
    connections,
  };
}

export const COURSE_MAX_STARS_MAP: Record<string, number> = {
  'python-1': 24,
  'py-basic': 24,
  'py-level-1': 24,
  'python-2': 32,
  'py-intermediate': 32,
  'py-level-2': 32,
  'python-3': 36,
  'py-advanced': 36,
  'py-level-3': 36,
  'fastapi-async': 15,
  'py-fastapi': 15,
  'django-enterprise': 15,
  'py-django': 15,
  'data-analytics': 30,
  'py-data': 30,
  'ai-agents': 30,
  'py-ia': 30,
  'python-apex': 9,
  'py-apex': 9,
};

export class RoadmapService {
  public static async getCoursesGraph(langSlug: string): Promise<GraphDataset> {
    try {
      const data = await fetchWithFallback<{ dataset?: GraphDataset }>(`/roadmap/${langSlug}/courses`);
      if (data?.dataset && Array.isArray(data.dataset.nodes) && data.dataset.nodes.length > 0) {
        const calibrated: GraphDataset = {
          ...data.dataset,
          nodes: data.dataset.nodes.map((n) => {
            const courseKey = n.targetCourseId || n.id;
            const dynamicMax = getDynamicMaxStarsForCourse(courseKey);
            return {
              ...n,
              maxStars: dynamicMax,
            };
          }),
        };
        return sanitizeGraphDataset(calibrated);
      }
      return { sectorTitle: `${langSlug.toUpperCase()} ROADMAP`, progressPercent: 0, nodes: [], connections: [] };
    } catch {
      return { sectorTitle: `${langSlug.toUpperCase()} ROADMAP`, progressPercent: 0, nodes: [], connections: [] };
    }
  }

  public static async getCourseLessonsGraph(courseId: string): Promise<GraphDataset> {
    try {
      const data = await fetchWithFallback<{ dataset?: GraphDataset }>(`/roadmap/courses/${courseId}/lessons`);
      const baseDataset = data?.dataset || getLessonsDatasetForCourse(courseId);
      // Calibrar maxStars de cada nodo con el mock de referencia si el backend no trae maxStars específico
      const localSeed = getLessonsDatasetForCourse(courseId);
      const localMap = new Map(localSeed.nodes.map((n) => [n.id, n]));
      const calibratedNodes = baseDataset.nodes.map((node) => {
        const local = localMap.get(node.id);
        return {
          ...node,
          maxStars: typeof local?.maxStars === 'number' ? local.maxStars : (node.maxStars ?? 3),
        };
      });
      return sanitizeGraphDataset({ ...baseDataset, nodes: calibratedNodes });
    } catch {
      // Graceful offline-first fallback to canonical seed
      return sanitizeGraphDataset(getLessonsDatasetForCourse(courseId));
    }
  }

  public static async autoSeedDatabase(langSlug: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap/seed`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ language: langSlug, lessonsDataset: PYTHON_BASIC_LESSONS_DATASET }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
