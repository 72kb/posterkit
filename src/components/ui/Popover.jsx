import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/**
 * Lightweight anchored popover. Closes on outside click and Escape.
 * `align` positions the panel relative to the trigger wrapper.
 */
export default function Popover({ open, onClose, trigger, children, align = 'left', className = '', side = 'bottom' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose() } }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open, onClose])

  const pos = `${align === 'right' ? 'right-0' : 'left-0'} ${side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`

  return (
    <div ref={ref} className="relative">
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={`absolute z-50 ${pos} rounded-xl border border-ink-700 bg-ink-850/95 p-2 shadow-panel backdrop-blur-xl ${className}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
