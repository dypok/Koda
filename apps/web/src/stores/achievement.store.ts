import { create } from 'zustand';
import type {
  AchievementCategory,
  AchievementItem,
  UserAchievementsResponse,
} from '@koda/types';
import { AchievementService } from '@/services/gamification/achievement.service';
import { useAuthStore } from '@/stores/auth.store';

export type AchievementStatusFilter = 'all' | 'unlocked' | 'locked';

interface AchievementState {
  achievements: AchievementItem[];
  stats: {
    total: number;
    unlocked_count: number;
    total_xp_earned: number;
  } | null;
  isLoading: boolean;
  categoryFilter: AchievementCategory | 'all';
  statusFilter: AchievementStatusFilter;
  recentUnlockedToast: AchievementItem | null;

  // Acciones
  fetchAchievements: () => Promise<void>;
  checkAchievements: () => Promise<AchievementItem[]>;
  dismissToast: () => void;
  triggerToast: (achievement: AchievementItem) => void;
  setCategoryFilter: (category: AchievementCategory | 'all') => void;
  setStatusFilter: (status: AchievementStatusFilter) => void;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  stats: null,
  isLoading: false,
  categoryFilter: 'all',
  statusFilter: 'all',
  recentUnlockedToast: null,

  fetchAchievements: async () => {
    set({ isLoading: true });
    try {
      const data: UserAchievementsResponse = await AchievementService.getAchievements();
      set({
        achievements: data.achievements,
        stats: data.stats,
        isLoading: false,
      });

      // Si llegaron logros recién desbloqueados en la consulta, mostrar toast
      if (data.newly_unlocked && data.newly_unlocked.length > 0) {
        set({ recentUnlockedToast: data.newly_unlocked[0] });

        // Actualizar el XP del usuario en authStore de forma reactiva
        const authUser = useAuthStore.getState().user;
        if (authUser) {
          const addedXp = data.newly_unlocked.reduce((acc, a) => acc + a.xp_reward, 0);
          useAuthStore.getState().updateUserProfile({
            totalXp: (authUser.totalXp || 0) + addedXp,
          });
        }
      }
    } catch {
      set({ isLoading: false });
    }
  },

  checkAchievements: async () => {
    try {
      const data = await AchievementService.checkAchievements();
      set({
        achievements: data.achievements,
        stats: data.stats,
      });

      if (data.newly_unlocked && data.newly_unlocked.length > 0) {
        set({ recentUnlockedToast: data.newly_unlocked[0] });

        const authUser = useAuthStore.getState().user;
        if (authUser) {
          const addedXp = data.newly_unlocked.reduce((acc, a) => acc + a.xp_reward, 0);
          useAuthStore.getState().updateUserProfile({
            totalXp: (authUser.totalXp || 0) + addedXp,
          });
        }
        return data.newly_unlocked;
      }
      return [];
    } catch (err) {
      console.warn('Error al verificar logros:', err);
      return [];
    }
  },

  dismissToast: () => set({ recentUnlockedToast: null }),

  triggerToast: (achievement: AchievementItem) =>
    set({ recentUnlockedToast: achievement }),

  setCategoryFilter: (category) => set({ categoryFilter: category }),

  setStatusFilter: (status) => set({ statusFilter: status }),
}));
