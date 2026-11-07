import { motion } from 'motion/react'

export default function Toggle({ label, value, onChange, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!value}
      onClick={() => onChange(!value)}
      className="group flex w-full items-center justify-between gap-3 py-1 text-left"
    >
      <span className="min-w-0">
        <span className="block text-[13px] text-ink-200 group-hover:text-ink-100">{label}</span>
        {hint && <span className="block text-[11px] text-ink-500">{hint}</span>}
      </span>
      <span
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full p-0.5 transition-colors duration-200
          ${value ? 'bg-stamp' : 'bg-ink-700 group-hover:bg-ink-600'}`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 600, damping: 35 }}
          className={`h-4 w-4 rounded-full bg-white shadow ${value ? 'ml-auto' : ''}`}
        />
      </span>
    </button>
  )
}
