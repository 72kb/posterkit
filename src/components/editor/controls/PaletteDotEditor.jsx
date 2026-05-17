import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import usePosterStore from '../../../store/posterStore'

export default function PaletteDotEditor() {
  const { paletteDots, addPaletteDot, removePaletteDot, updatePaletteDot } = usePosterStore()
  const [activeDot, setActiveDot] = useState(null)
  const pickerRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setActiveDot(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-neutral-400">Palette Dots</label>
      <div className="flex items-center gap-2 flex-wrap">
        {paletteDots.map((color, i) => (
          <button
            key={i}
            onClick={() => setActiveDot(activeDot === i ? null : i)}
            style={{ backgroundColor: color }}
            className={`w-7 h-7 rounded-full border-2 transition-all ${activeDot === i ? 'border-white scale-110' : 'border-neutral-600 hover:border-neutral-400'}`}
          />
        ))}
        {paletteDots.length < 6 && (
          <button
            onClick={addPaletteDot}
            className="w-7 h-7 rounded-full border border-dashed border-neutral-600 text-neutral-500 text-lg leading-none hover:border-neutral-400 hover:text-neutral-300 flex items-center justify-center"
          >
            +
          </button>
        )}
        {paletteDots.length > 3 && activeDot !== null && (
          <button
            onClick={() => { removePaletteDot(activeDot); setActiveDot(null) }}
            className="text-xs text-red-500 hover:text-red-400"
          >
            Remove
          </button>
        )}
      </div>
      {activeDot !== null && (
        <div ref={pickerRef}>
          <HexColorPicker
            color={paletteDots[activeDot]}
            onChange={(c) => updatePaletteDot(activeDot, c)}
          />
        </div>
      )}
    </div>
  )
}
