import { loadFont } from '../../../lib/fonts'

export default function FontPicker({ label, value, options, onChange }) {
  const handleChange = async (e) => {
    const font = options.find((f) => f.name === e.target.value)
    if (font) {
      await loadFont(font.url)
      await document.fonts.ready
    }
    onChange(e.target.value)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-neutral-400">{label}</label>}
      <select
        value={value}
        onChange={handleChange}
        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500"
      >
        {options.map((f) => (
          <option key={f.name} value={f.name}>{f.name}</option>
        ))}
      </select>
    </div>
  )
}
