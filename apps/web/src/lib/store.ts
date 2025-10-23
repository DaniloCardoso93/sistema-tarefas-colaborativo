import { type Task } from "@/components/tasks/task-columns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: () => boolean;
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  selectedTask: Task | null;
  isDeleteModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;

  openDeleteModal: (task: Task) => void;
  openEditModal: (task: Task) => void;
  openDetailsModal: (task: Task) => void;
  closeModals: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: () => !!get().accessToken,
      login: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
        });
      },
      selectedTask: null,
      isDeleteModalOpen: false,
      isEditModalOpen: false,
      isDetailsModalOpen: false,
      openDeleteModal: (task: Task) =>
        set({ isDeleteModalOpen: true, selectedTask: task }),
      openEditModal: (task: Task) =>
        set({ isEditModalOpen: true, selectedTask: task }),
      openDetailsModal: (task: Task) =>
        set({ isDetailsModalOpen: true, selectedTask: task }),
      closeModals: () =>
        set({
          isDeleteModalOpen: false,
          isEditModalOpen: false,
          isDetailsModalOpen: false,
          selectedTask: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
