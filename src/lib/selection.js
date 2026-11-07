// Module-level selection manager — only one canvas element selected at a time.
// Each selection can register actions so keyboard shortcuts (Enter / Delete)
// can act on whatever is selected.
let currentId = null
let currentActions = {}
const listeners = new Set()

const emit = () => listeners.forEach((fn) => fn(currentId))

export const selection = {
  get: () => currentId,
  actions: () => currentActions,
  set(id, actions = {}) {
    currentId = id
    currentActions = actions
    emit()
  },
  clear() {
    if (currentId === null) return
    currentId = null
    currentActions = {}
    emit()
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
