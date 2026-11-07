import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

/** Collapsible panel section with an animated body. */
export default function Section({ title, children, defaultOpen = true, aside }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border-b border-ink-800 last:border-b-0">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group flex flex-1 items-center justify-between py-3.5 text-left"
        >
          <span className="label-xs text-ink-300 group-hover:text-ink-100">{title}</span>
          <ChevronDown size={14} className={`text-ink-500 transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
        </button>
        {aside}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex flex-col gap-4 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
