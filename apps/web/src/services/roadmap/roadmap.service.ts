import { GraphDataset } from '@/models/roadmap/roadmap-graph.types';
import { PYTHON_COURSES_DATASET } from '@/models/roadmap/python-courses-graph.mock';
import { PYTHON_BASIC_LESSONS_DATASET } from '@/models/roadmap/python-lessons-graph.mock';

// NEXT_PUBLIC_API_URL ya incluye el prefijo /api/v1 (ver apps/web/.env.example).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class RoadmapService {
  public static async getCoursesGraph(langSlug: string): Promise<GraphDataset> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap/${langSlug}/courses`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data?.dataset || PYTHON_COURSES_DATASET;
    } catch {
      // Graceful offline-first fallback to canonical seed
      return PYTHON_COURSES_DATASET;
    }
  }

  public static async getCourseLessonsGraph(courseId: string): Promise<GraphDataset> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap/courses/${courseId}/lessons`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data?.dataset || PYTHON_BASIC_LESSONS_DATASET;
    } catch {
      // Graceful offline-first fallback to canonical seed
      return PYTHON_BASIC_LESSONS_DATASET;
    }
  }

  public static async autoSeedDatabase(langSlug: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: langSlug, coursesDataset: PYTHON_COURSES_DATASET, lessonsDataset: PYTHON_BASIC_LESSONS_DATASET }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
