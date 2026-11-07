export default function Kbd({ children }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-ink-600 bg-ink-800 px-1 font-mono text-[10px] text-ink-300 shadow-[0_1px_0_0_theme(colors.ink.600)]">
      {children}
    </kbd>
  )
}
