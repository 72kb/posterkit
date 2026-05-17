export default function TextInput({ label, value, onChange, placeholder, multiline, rows = 3 }) {
  const sharedClass = 'w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500'

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-neutral-400">{label}</label>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={sharedClass}
        />
      )}
    </div>
  )
}
