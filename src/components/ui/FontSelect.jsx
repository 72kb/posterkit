import { useEffect, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import Popover from './Popover'
import { loadFont } from '../../lib/fonts'

/** Font dropdown that previews each option in its own typeface. */
export default function FontSelect({ label, value, groups, onChange, sample }) {
  const [open, setOpen] = useState(false)

  // Load every font in the list when the menu opens so previews render.
  useEffect(() => {
    if (open) groups.forEach((g) => g.fonts.forEach((f) => loadFont(f.url)))
  }, [open, groups])

  const choose = async (font) => {
    // Brief head start for the font, but don't hold the UI hostage to the network.
    await Promise.race([
      loadFont(font.url).then(() => document.fonts?.load?.(`16px "${font.name}"`)).catch(() => null),
      new Promise((r) => setTimeout(r, 450)),
    ])
    onChange(font.name)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-[13px] text-ink-300">{label}</span>}
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        className="max-h-80 w-full min-w-[240px] overflow-y-auto"
        trigger={
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="field-input flex h-10 items-center justify-between"
          >
            <span style={{ fontFamily: `'${value}', sans-serif` }} className="truncate text-[15px]">{value}</span>
            <ChevronDown size={15} className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        }
      >
        <div role="listbox" aria-label={label}>
          {groups.map((g) => (
            <div key={g.label} className="mb-1 last:mb-0">
              <div className="label-xs px-2 pb-1 pt-2">{g.label}</div>
              {g.fonts.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  role="option"
                  aria-selected={f.name === value}
                  onClick={() => choose(f)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors
                    ${f.name === value ? 'bg-stamp/10 text-ink-100' : 'text-ink-200 hover:bg-ink-750'}`}
                >
                  <span className="truncate text-[17px] leading-tight" style={{ fontFamily: `'${f.name}', sans-serif` }}>
                    {sample || f.name}
                  </span>
                  <span className="flex flex-shrink-0 items-center gap-1.5 text-[10px] text-ink-500">
                    {sample && f.name}
                    {f.name === value && <Check size={14} className="text-stamp" />}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </Popover>
    </div>
  )
}
