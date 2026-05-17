import usePosterStore from '../../../store/posterStore'
import SliderControl from '../controls/SliderControl'

export default function LayoutTab() {
  const { orientation, photoHeightPercent, set } = usePosterStore()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-400">Orientation</label>
        <div className="flex gap-2">
          {['portrait', 'landscape'].map((o) => (
            <button
              key={o}
              onClick={() => set({ orientation: o })}
              className={`flex-1 py-2 rounded text-xs font-medium capitalize transition-colors
                ${orientation === o ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
            >
              {o === 'portrait' ? '◻ Portrait' : '⬜ Landscape'}
            </button>
          ))}
        </div>
        <div className="text-xs text-neutral-600 mt-1">
          {orientation === 'portrait' ? '700 × 980 px' : '1060 × 700 px'}
        </div>
      </div>

      {orientation === 'portrait' && (
        <SliderControl
          label="Photo Height"
          value={photoHeightPercent}
          min={40} max={85} step={1}
          format={(v) => `${v}%`}
          onChange={(v) => set({ photoHeightPercent: v })}
        />
      )}
    </div>
  )
}
