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

function sanitizeGraphDataset(dataset: GraphDataset): GraphDataset {
  if (!dataset || !Array.isArray(dataset.nodes) || !Array.isArray(dataset.connections)) {
    return dataset;
  }
  const nodeMap = new Map(dataset.nodes.map((n) => [n.id, n]));
  const connections = dataset.connections.map((c) => {
    const a = nodeMap.get(c.fromId);
    const b = nodeMap.get(c.toId);
    if (!a || !b) return c;
    const dx = Math.abs(b.x - a.x) * 0.5;
    return {
      ...c,
      path: `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`,
    };
  });
  return {
    ...dataset,
    connections,
  };
}

export class RoadmapService {
  public static async getCoursesGraph(langSlug: string): Promise<GraphDataset> {
    try {
      const data = await fetchWithFallback<{ dataset?: GraphDataset }>(`/roadmap/${langSlug}/courses`);
      if (data?.dataset && Array.isArray(data.dataset.nodes) && data.dataset.nodes.length > 0) {
        return sanitizeGraphDataset(data.dataset);
      }
      return { sectorTitle: `${langSlug.toUpperCase()} ROADMAP`, progressPercent: 0, nodes: [], connections: [] };
    } catch {
      return { sectorTitle: `${langSlug.toUpperCase()} ROADMAP`, progressPercent: 0, nodes: [], connections: [] };
    }
  }

  public static async getCourseLessonsGraph(courseId: string): Promise<GraphDataset> {
    try {
      const data = await fetchWithFallback<{ dataset?: GraphDataset }>(`/roadmap/courses/${courseId}/lessons`);
      return sanitizeGraphDataset(data?.dataset || getLessonsDatasetForCourse(courseId));
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
