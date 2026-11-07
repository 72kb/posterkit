import { motion } from 'motion/react'

export default function ToolRail({ tabs, active, onSelect }) {
  return (
    <nav aria-label="Editor tools" className="flex w-[72px] flex-shrink-0 flex-col items-center gap-1 border-r border-ink-800 bg-ink-900 py-3">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative flex w-[60px] flex-col items-center gap-1 rounded-xl py-2 transition-colors
              ${isActive ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100'}`}
          >
            {isActive && (
              <motion.span
                layoutId="rail-active"
                className="absolute inset-0 rounded-xl bg-ink-800"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            {isActive && (
              <motion.span
                layoutId="rail-bar"
                className="absolute -left-1.5 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-stamp"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <Icon size={19} strokeWidth={1.8} className="relative transition-transform group-active:scale-90" />
            <span className="relative text-[10px] font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function MobileTabBar({ tabs, active, onSelect }) {
  return (
    <nav
      aria-label="Editor tools"
      className="flex flex-shrink-0 items-stretch justify-around border-t border-ink-800 bg-ink-900 px-1 pb-[max(env(safe-area-inset-bottom),4px)] pt-1"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={isActive}
            className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors
              ${isActive ? 'text-stamp' : 'text-ink-400'}`}
          >
            <Icon size={20} strokeWidth={1.8} />
            <span className="truncate text-[10px] font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
