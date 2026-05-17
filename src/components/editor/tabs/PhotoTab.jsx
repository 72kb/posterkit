import { useRef, useState } from 'react'
import usePosterStore from '../../../store/posterStore'
import { useImageUpload } from '../../../hooks/useImageUpload'
import SliderControl from '../controls/SliderControl'
import Button from '../../ui/Button'
import ImportPanel from '../ImportPanel'

export default function PhotoTab() {
  const [showImport, setShowImport] = useState(false)
  const { photoUrl, photoPosition, photoScale, set } = usePosterStore()
  const { onFileInput, onDrop, onDragOver } = useImageUpload()
  const fileRef = useRef(null)

  const updatePosition = (axis, val) => {
    const [x, y] = photoPosition.split(' ')
    if (axis === 'x') set({ photoPosition: `${val}% ${y}` })
    else set({ photoPosition: `${x} ${val}%` })
  }

  const [posX, posY] = photoPosition
    .replace('%', '').split(' ')
    .map(v => isNaN(parseFloat(v)) ? 50 : parseFloat(v))

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => fileRef.current?.click()}
        className="border border-dashed border-neutral-600 rounded-lg p-6 text-center cursor-pointer hover:border-neutral-400 transition-colors"
      >
        {photoUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img src={photoUrl} alt="Preview" className="w-full max-h-40 object-cover rounded" />
            <span className="text-xs text-neutral-400">Click or drop to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-500">
            <div className="text-3xl">↑</div>
            <div className="text-xs">Drop photo here or click to upload</div>
            <div className="text-xs opacity-50">JPG, PNG, WEBP</div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFileInput}
          className="hidden"
        />
      </div>

      {/* AI Import */}
      <button
        onClick={() => setShowImport(true)}
        className="w-full py-2 border border-dashed border-neutral-600 hover:border-neutral-400 rounded text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
      >
        ✦ Import AI-generated preset
      </button>

      {showImport && <ImportPanel onClose={() => setShowImport(false)} />}

      {photoUrl && (
        <>
          <SliderControl
            label="Position X"
            value={posX}
            min={0} max={100} step={1}
            format={(v) => `${v}%`}
            onChange={(v) => updatePosition('x', v)}
          />
          <SliderControl
            label="Position Y"
            value={posY}
            min={0} max={100} step={1}
            format={(v) => `${v}%`}
            onChange={(v) => updatePosition('y', v)}
          />
          <SliderControl
            label="Scale"
            value={photoScale}
            min={50} max={200} step={1}
            format={(v) => `${v}%`}
            onChange={(v) => set({ photoScale: v })}
          />
          <Button variant="ghost" onClick={() => set({ photoUrl: null })}>
            Remove photo
          </Button>
        </>
      )}
    </div>
  )
}
