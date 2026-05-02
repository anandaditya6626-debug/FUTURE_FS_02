import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      workspace: null,
      isAuthenticated: false,

      setAuth: (user, token, workspace) => set({
        user, token, workspace, isAuthenticated: true,
      }),

      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates },
      })),

      updateWorkspace: (updates) => set((state) => ({
        workspace: { ...state.workspace, ...updates },
      })),

      logout: () => set({
        user: null, token: null, workspace: null, isAuthenticated: false,
      }),
    }),
    { name: 'velora-auth', partialize: (s) => ({ user: s.user, token: s.token, workspace: s.workspace, isAuthenticated: s.isAuthenticated }) }
  )
)
