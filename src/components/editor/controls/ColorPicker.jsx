import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

export default function ColorPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      {label && <label className="text-xs text-neutral-400">{label}</label>}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 w-full focus:outline-none hover:border-neutral-500 transition-colors"
        >
          <div
            className="w-4 h-4 rounded border border-neutral-600 flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs text-neutral-300 font-mono">{value}</span>
        </button>
        {open && (
          <div className="absolute z-50 mt-1 left-0">
            <HexColorPicker color={value} onChange={onChange} />
            <input
              type="text"
              value={value}
              onChange={(e) => {
                if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value)
              }}
              className="mt-1 w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs font-mono text-white focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}
