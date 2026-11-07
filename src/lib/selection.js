// Module-level selection manager — only one element selected at a time across the whole canvas
let currentId = null
const listeners = new Set()

export const selection = {
  get: () => currentId,
  set(id) {
    currentId = id
    listeners.forEach(fn => fn(id))
  },
  clear() {
    currentId = null
    listeners.forEach(fn => fn(null))
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
