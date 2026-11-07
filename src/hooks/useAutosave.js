import { useCallback, useEffect, useRef, useState } from 'react'
import { saveProjectDoc } from '../lib/projects'

const DELAY = 700

/**
 * Persist the poster doc to IndexedDB shortly after every change.
 * Returns { status: 'saved' | 'saving' | 'error', saveNow }.
 */
export function useAutosave(store, projectId) {
  const [status, setStatus] = useState('saved')
  const timer = useRef(null)
  const pending = useRef(false)

  const saveNow = useCallback(async () => {
    if (!store) return
    clearTimeout(timer.current)
    pending.current = false
    setStatus('saving')
    try {
      await saveProjectDoc(projectId, store.getState())
      setStatus('saved')
    } catch (err) {
      console.error('Autosave failed', err)
      setStatus('error')
    }
  }, [store, projectId])

  useEffect(() => {
    if (!store) return
    const unsub = store.subscribe((s, prev) => {
      if (s.revision === prev.revision) return
      pending.current = true
      setStatus('saving')
      clearTimeout(timer.current)
      timer.current = setTimeout(saveNow, DELAY)
    })
    const flush = () => { if (pending.current) saveNow() }
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush() }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      unsub()
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
      flush()
    }
  }, [store, saveNow])

  return { status, saveNow }
}
