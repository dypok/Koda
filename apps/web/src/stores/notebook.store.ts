import { create } from 'zustand';
import type { MistakesNotebookItem } from '@koda/types';
import { NotebookService } from '@/services/notebook/notebook.service';
import { useAuthStore } from '@/stores/auth.store';

export type NotebookFilter = 'all' | 'due';

interface NotebookState {
  mistakes: MistakesNotebookItem[];
  isLoading: boolean;
  isResolving: boolean;
  activeMistake: MistakesNotebookItem | null;
  filter: NotebookFilter;

  // Acciones
  fetchMistakes: () => Promise<void>;
  setFilter: (filter: NotebookFilter) => void;
  openRemediation: (mistake: MistakesNotebookItem) => void;
  closeRemediation: () => void;
  resolveMistake: (questionId: string) => Promise<{ success: boolean; xp_reward: number }>;

  // Métricas calculadas
  getPendingCount: () => number;
  getDueTodayCount: () => number;
  getXpRecoveredTotal: () => number;
}

export const useNotebookStore = create<NotebookState>((set, get) => ({
  mistakes: [],
  isLoading: false,
  isResolving: false,
  activeMistake: null,
  filter: 'all',

  fetchMistakes: async () => {
    set({ isLoading: true });
    try {
      const items = await NotebookService.getMistakes();
      set({ mistakes: items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setFilter: (filter) => set({ filter }),

  openRemediation: (mistake) => set({ activeMistake: mistake }),

  closeRemediation: () => set({ activeMistake: null }),

  resolveMistake: async (questionId: string) => {
    set({ isResolving: true });
    try {
      const res = await NotebookService.resolveMistake(questionId);

      if (res.success) {
        // Remover el error resuelto de la lista local de pendientes
        set((state) => ({
          mistakes: state.mistakes.filter((m) => m.question_id !== questionId),
          activeMistake: null,
          isResolving: false,
        }));

        // Actualizar XP en la sesión del usuario inmediatamente (+5 XP)
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().updateUserProfile({
            totalXp: (currentUser.totalXp ?? 0) + res.xp_reward,
            isActiveToday: true,
          });
        }
      } else {
        set({ isResolving: false });
      }

      return res;
    } catch (err) {
      set({ isResolving: false });
      throw err;
    }
  },

  getPendingCount: () => {
    return get().mistakes.filter((m) => !m.is_resolved).length;
  },

  getDueTodayCount: () => {
    const now = new Date();
    return get().mistakes.filter((m) => {
      if (m.is_resolved) return false;
      if (!m.next_review_at) return true;
      return new Date(m.next_review_at) <= now;
    }).length;
  },

  getXpRecoveredTotal: () => {
    return get().mistakes.filter((m) => m.is_resolved).length * 5;
  },
}));
