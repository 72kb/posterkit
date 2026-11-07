import usePosterStore from '../../../store/posterStore'
import SliderControl from '../controls/SliderControl'

const PORTRAIT_STYLES = [
  { value: 'standard',    label: 'Standard',     hint: 'Photo stacked above text panel' },
  { value: 'transparent', label: 'Transparent',  hint: 'Photo fills full canvas, text overlays on top' },
  { value: 'compact',     label: 'Compact Story', hint: 'Full-bleed photo, minimal floating caption' },
]

const POSITIONS = [
  ['top-left',    'top-center',    'top-right'   ],
  ['mid-left',    'center',        'mid-right'   ],
  ['bottom-left', 'bottom-center', 'bottom-right'],
]

export default function LayoutTab() {
  const { orientation, photoHeightPercent, portraitStyle, compactPosition, set } = usePosterStore()

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
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400">Portrait Style</label>
            <div className="flex flex-col gap-1.5">
              {PORTRAIT_STYLES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => set({ portraitStyle: value })}
                  className={`w-full py-2 px-3 rounded text-xs font-medium text-left transition-colors
                    ${portraitStyle === value ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="text-xs text-neutral-600 leading-relaxed">
              {PORTRAIT_STYLES.find(s => s.value === portraitStyle)?.hint}
            </div>
          </div>

          {portraitStyle === 'standard' && (
            <SliderControl
              label="Photo Height"
              value={photoHeightPercent}
              min={40} max={85} step={1}
              format={(v) => `${v}%`}
              onChange={(v) => set({ photoHeightPercent: v })}
            />
          )}

          {portraitStyle === 'compact' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400">Caption Position</label>
              <div className="flex flex-col gap-1">
                {POSITIONS.map((row, ri) => (
                  <div key={ri} className="flex gap-1">
                    {row.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => set({ compactPosition: pos })}
                        className={`flex-1 h-8 rounded transition-colors
                          ${compactPosition === pos
                            ? 'bg-white'
                            : 'bg-neutral-800 hover:bg-neutral-700'}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-xs text-neutral-600">
                {compactPosition.replace('-', ' ')}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
