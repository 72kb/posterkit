import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import Popover from './Popover'

const isHex = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)

/** Color swatch button + popover picker. `swatches` = [{ name, color }] */
export default function ColorField({ label, value, onChange, swatches = [] }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(null) // text being typed, null = in sync

  const commitDraft = () => {
    if (draft !== null && isHex(draft)) onChange(draft.toLowerCase())
    setDraft(null)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-[13px] text-ink-300">{label}</span>}
      <div className="flex items-center gap-2">
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          trigger={
            <button
              type="button"
              aria-label={`${label || 'Color'}: ${value}`}
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 items-center gap-2 rounded-lg border border-ink-700 bg-ink-850 pl-1.5 pr-2.5 transition-colors hover:border-ink-600"
            >
              <span className="h-6 w-6 rounded-md ring-1 ring-inset ring-white/15" style={{ backgroundColor: value }} />
              <span className="font-mono text-[11px] uppercase text-ink-300">{value}</span>
            </button>
          }
          className="w-[228px]"
        >
          <div className="color-picker">
            <HexColorPicker color={isHex(value) ? value : '#000000'} onChange={onChange} />
          </div>
          <input
            aria-label="Hex value"
            value={draft ?? value}
            onChange={(e) => setDraft(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
            onBlur={commitDraft}
            onKeyDown={(e) => { if (e.key === 'Enter') commitDraft() }}
            maxLength={7}
            className={`field-input mt-2 font-mono text-xs uppercase ${draft !== null && !isHex(draft) ? 'border-red-500/60' : ''}`}
          />
        </Popover>
        {swatches.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {swatches.map((sw) => (
              <button
                key={sw.color + sw.name}
                type="button"
                title={sw.name}
                aria-label={sw.name}
                onClick={() => onChange(sw.color)}
                className={`h-6 w-6 rounded-full ring-1 ring-inset ring-white/15 transition-transform hover:scale-110
                  ${value?.toLowerCase() === sw.color.toLowerCase() ? 'outline outline-2 outline-offset-2 outline-stamp' : ''}`}
                style={{ backgroundColor: sw.color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
