import { useEffect, useRef } from 'react'
import { selection } from '../lib/selection'

const isTyping = (el) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
export const MOD = isMac ? '⌘' : 'Ctrl'

/**
 * Editor keyboard shortcuts. `handlers` may change every render —
 * the listener always calls the latest version.
 */
export function useShortcuts(handlers) {
  const ref = useRef(handlers)
  useEffect(() => { ref.current = handlers })

  useEffect(() => {
    const onKey = (e) => {
      const h = ref.current
      const mod = isMac ? e.metaKey : e.ctrlKey
      const key = e.key.toLowerCase()
      const typing = isTyping(e.target)

      if (mod && key === 's') { e.preventDefault(); h.save?.(); return }
      if (mod && key === 'e') { e.preventDefault(); h.exportPng?.(); return }
      if (typing) return

      if (mod && key === 'z' && !e.shiftKey) { e.preventDefault(); h.undo?.(); return }
      if ((mod && key === 'z' && e.shiftKey) || (mod && key === 'y')) { e.preventDefault(); h.redo?.(); return }
      if (mod && (key === '=' || key === '+')) { e.preventDefault(); h.zoomIn?.(); return }
      if (mod && key === '-') { e.preventDefault(); h.zoomOut?.(); return }
      if (mod && key === '0') { e.preventDefault(); h.zoomFit?.(); return }
      if (mod) return

      if (key === 'escape') { selection.clear(); return }
      if ((key === 'delete' || key === 'backspace') && selection.get()) {
        const del = selection.actions().onDelete
        if (del) { e.preventDefault(); selection.clear(); del() }
        return
      }
      if (key === 'enter' && selection.get()) {
        const edit = selection.actions().onEdit
        if (edit) { e.preventDefault(); edit() }
        return
      }
      if (e.key === '?') { e.preventDefault(); h.help?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
