import { useSyncExternalStore } from 'react'

/**
 * Minimal hash router — works on static hosts (GitHub Pages) without
 * server rewrites. Routes look like `#/editor/abc123?tab=photo`.
 */
function read() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  return { path: path || '/', query: new URLSearchParams(query), raw }
}

let current = read()
const listeners = new Set()

window.addEventListener('hashchange', () => {
  current = read()
  listeners.forEach((l) => l())
})

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l) }
const getSnapshot = () => current

export function useRoute() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export function navigate(to, { replace = false } = {}) {
  const hash = to.startsWith('#') ? to : `#${to}`
  if (replace) {
    window.history.replaceState(null, '', hash)
    current = read()
    listeners.forEach((l) => l())
  } else {
    window.location.hash = hash
  }
}

/** Match `/editor/:id` style patterns. Returns params or null. */
export function matchPath(pattern, path) {
  const p = pattern.split('/').filter(Boolean)
  const a = path.split('/').filter(Boolean)
  if (p.length !== a.length) return null
  const params = {}
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i])
    else if (p[i] !== a[i]) return null
  }
  return params
}
