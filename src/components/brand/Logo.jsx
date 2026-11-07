/** Postakit mark: a perforated postage stamp framing a "P". */
export function LogoMark({ size = 28, className = '' }) {
  const S = 64, pad = 4, r = 2.6, n = 7
  const step = (S - 2 * pad) / n
  const holes = []
  for (let i = 0; i <= n; i++) {
    const t = pad + i * step
    holes.push([t, pad], [t, S - pad], [pad, t], [S - pad, t])
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <mask id="pk-perf">
          <rect width="64" height="64" fill="#fff" />
          {holes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill="#000" />)}
        </mask>
      </defs>
      <rect x={pad} y={pad} width={S - 2 * pad} height={S - 2 * pad} rx="1.5" fill="#FF4D2E" mask="url(#pk-perf)" />
      <rect x="13" y="13" width="38" height="38" rx="1" fill="none" stroke="#0B0B0C" strokeWidth="2.4" />
      <path d="M24 44V20h9.5a7 7 0 0 1 0 14H24" fill="none" stroke="#0B0B0C" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  )
}

export default function Logo({ size = 28, className = '', showWord = true }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {showWord && (
        <span className="text-[17px] leading-none tracking-tight text-ink-100">
          <span className="font-semibold">posta</span>
          <span className="font-serif text-[20px] italic text-stamp">kit</span>
        </span>
      )}
    </span>
  )
}
