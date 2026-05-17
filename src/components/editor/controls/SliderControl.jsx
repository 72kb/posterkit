export default function SliderControl({ label, value, min, max, step = 0.01, onChange, format }) {
  const display = format ? format(value) : value
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-xs text-neutral-400">{label}</label>
        <span className="text-xs text-neutral-500 tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-neutral-700 rounded accent-white cursor-pointer"
      />
    </div>
  )
}
