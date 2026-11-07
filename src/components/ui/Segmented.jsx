import { useId } from 'react'
import { motion } from 'motion/react'

/** Animated segmented control. options: [{ value, label, icon? }] */
export default function Segmented({ value, onChange, options, size = 'md', className = '' }) {
  const group = useId()
  return (
    <div role="radiogroup" className={`relative flex rounded-lg border border-ink-700 bg-ink-850 p-0.5 ${className}`}>
      {options.map((o) => {
        const active = o.value === value
        const Icon = o.icon
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            title={o.title}
            className={`relative z-0 flex flex-1 items-center justify-center gap-1.5 rounded-md font-medium transition-colors
              ${size === 'sm' ? 'h-7 px-2 text-[11px]' : 'h-8 px-2.5 text-xs'}
              ${active ? 'text-ink-950' : 'text-ink-400 hover:text-ink-100'}`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${group}`}
                className="absolute inset-0 -z-10 rounded-md bg-ink-100"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            {Icon && <Icon size={14} strokeWidth={2} aria-hidden="true" />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
