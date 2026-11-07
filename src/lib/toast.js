import { create } from 'zustand'
import { uid } from './uid'

export const useToasts = create((set) => ({
  toasts: [],
  push: (t) => {
    const id = uid()
    set((s) => ({ toasts: [...s.toasts.slice(-3), { id, tone: 'default', duration: 3200, ...t }] }))
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  show: (title, opts = {}) => useToasts.getState().push({ title, ...opts }),
  success: (title, opts = {}) => useToasts.getState().push({ title, tone: 'success', ...opts }),
  error: (title, opts = {}) => useToasts.getState().push({ title, tone: 'error', duration: 5000, ...opts }),
}
