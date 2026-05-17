export default function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full transition-colors ${value ? 'bg-white' : 'bg-neutral-600'}`}
      >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-transform bg-black ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      {label && <span className="text-xs text-neutral-400">{label}</span>}
    </label>
  )
}
