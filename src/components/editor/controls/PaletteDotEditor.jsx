import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Plus, Trash2 } from 'lucide-react'
import { usePoster } from '../../../store/usePoster'
import { MAX_PALETTE_DOTS, MIN_PALETTE_DOTS } from '../../../store/posterStore'

export default function PaletteDotEditor() {
  const { paletteDots, addPaletteDot, removePaletteDot, updatePaletteDot } = usePoster()
  const [active, setActive] = useState(null)
  const current = active !== null && active < paletteDots.length ? active : null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {paletteDots.map((color, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Palette colour ${i + 1}: ${color}`}
            aria-pressed={current === i}
            onClick={() => setActive(current === i ? null : i)}
            className={`h-8 w-8 rounded-full ring-1 ring-inset ring-white/15 transition-all
              ${current === i ? 'scale-110 outline outline-2 outline-offset-2 outline-stamp' : 'hover:scale-105'}`}
            style={{ backgroundColor: color }}
          />
        ))}
        {paletteDots.length < MAX_PALETTE_DOTS && (
          <button
            type="button"
            aria-label="Add palette colour"
            onClick={() => { addPaletteDot(); setActive(paletteDots.length) }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-ink-600 text-ink-400 transition-colors hover:border-stamp/60 hover:text-ink-100"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
      {current !== null && (
        <div className="flex items-start gap-3">
          <div className="color-picker w-44">
            <HexColorPicker color={paletteDots[current]} onChange={(c) => updatePaletteDot(current, c)} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase text-ink-300">{paletteDots[current]}</span>
            {paletteDots.length > MIN_PALETTE_DOTS && (
              <button
                type="button"
                onClick={() => { removePaletteDot(current); setActive(null) }}
                className="flex items-center gap-1 text-xs text-ink-400 transition-colors hover:text-stamp"
              >
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
