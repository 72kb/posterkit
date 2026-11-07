import { useContext } from 'react'
import { useStore } from 'zustand'
import { PosterStoreContext, CanvasModeContext } from './contexts'

const selectAll = (s) => s

/** Read the nearest poster store. Without a selector returns the whole state. */
export function usePoster(selector = selectAll) {
  const store = useContext(PosterStoreContext)
  if (!store) throw new Error('usePoster must be used inside <PosterProvider>')
  return useStore(store, selector)
}

/** The raw store (for imperative access: getState / subscribe). */
export function usePosterStoreApi() {
  return useContext(PosterStoreContext)
}

export function useCanvasMode() {
  return useContext(CanvasModeContext)
}
