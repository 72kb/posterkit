import { useId } from 'react'

export default function Slider({ label, value, min, max, step = 0.01, onChange, format }) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] text-ink-300">{label}</label>
        <span className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-ink-300">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range"
        style={{ '--fill': `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  )
}
