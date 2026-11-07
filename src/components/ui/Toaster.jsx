import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { useToasts } from '../../lib/toast'

const ICONS = { success: CheckCircle2, error: AlertTriangle, default: Info }
const TONES = { success: 'text-emerald-400', error: 'text-stamp', default: 'text-ink-300' }

function ToastItem({ t }) {
  const dismiss = useToasts((s) => s.dismiss)
  useEffect(() => {
    const timer = setTimeout(() => dismiss(t.id), t.duration)
    return () => clearTimeout(timer)
  }, [t.id, t.duration, dismiss])
  const Icon = ICONS[t.tone] || Info
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
      role={t.tone === 'error' ? 'alert' : 'status'}
      className="pointer-events-auto flex w-[min(360px,calc(100vw-32px))] items-start gap-3 rounded-xl border border-ink-700 bg-ink-850/95 px-3.5 py-3 shadow-panel backdrop-blur-xl"
    >
      <Icon size={17} className={`mt-0.5 flex-shrink-0 ${TONES[t.tone]}`} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-ink-100">{t.title}</div>
        {t.description && <div className="mt-0.5 text-xs text-ink-400">{t.description}</div>}
      </div>
      <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-ink-500 hover:text-ink-200">
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function Toaster() {
  const toasts = useToasts((s) => s.toasts)
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[200] flex flex-col items-end gap-2 max-sm:bottom-20 max-sm:left-4 max-sm:right-4 max-sm:items-center">
      <AnimatePresence initial={false}>
        {toasts.map((t) => <ToastItem key={t.id} t={t} />)}
      </AnimatePresence>
    </div>
  )
}
