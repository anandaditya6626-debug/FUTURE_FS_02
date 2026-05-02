import { create } from 'zustand'

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  activeModal: null,
  notifications: [],
  unreadCount: 0,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPalette: (open) => set({ commandPaletteOpen: open }),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),

  addNotification: (notif) =>
    set((s) => ({
      notifications: [{ id: Date.now(), ...notif, read: false }, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}))
