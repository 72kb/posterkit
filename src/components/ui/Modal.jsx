import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, description, children, width = 'max-w-md', footer }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey, true)
    const t = setTimeout(() => {
      const target = panelRef.current?.querySelector('[data-autofocus]') || panelRef.current
      target?.focus()
    }, 30)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey, true)
      if (prev instanceof HTMLElement) prev.focus()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className={`relative flex max-h-[90dvh] w-full ${width} flex-col overflow-hidden rounded-t-2xl border border-ink-700 bg-ink-850 shadow-panel focus:outline-none sm:rounded-2xl`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink-800 px-5 py-4">
              <div>
                <h2 className="text-[15px] font-semibold text-ink-100">{title}</h2>
                {description && <p className="mt-0.5 text-[13px] text-ink-400">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-750 hover:text-ink-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-ink-800 bg-ink-900/50 px-5 py-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
