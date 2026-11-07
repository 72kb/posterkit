import { RectangleHorizontal, RectangleVertical } from 'lucide-react'
import { usePoster } from '../../../store/usePoster'
import Section from '../../ui/Section'
import Segmented from '../../ui/Segmented'
import Slider from '../../ui/Slider'

const PORTRAIT_STYLES = [
  { value: 'standard', label: 'Stacked', hint: 'Photo above, text panel below' },
  { value: 'transparent', label: 'Overlay', hint: 'Full-bleed photo, text on top' },
  { value: 'compact', label: 'Story', hint: 'Full-bleed photo, small floating caption' },
]

const POSITIONS = [
  ['top-left', 'top-center', 'top-right'],
  ['mid-left', 'center', 'mid-right'],
  ['bottom-left', 'bottom-center', 'bottom-right'],
]

/** Tiny wireframe thumbnails for each portrait style. */
function StyleDiagram({ kind, active }) {
  const ink = active ? '#ff4d2e' : '#6e6e7a'
  return (
    <svg viewBox="0 0 40 56" className="h-14 w-10" aria-hidden="true">
      <rect x="0.5" y="0.5" width="39" height="55" rx="2" fill="#17171c" stroke={active ? '#ff4d2e' : '#34343d'} />
      {kind === 'standard' && (
        <>
          <rect x="3" y="5" width="34" height="30" rx="1" fill={ink} opacity="0.35" />
          <rect x="3" y="39" width="20" height="3" rx="1" fill={ink} />
          <rect x="3" y="45" width="28" height="1.5" rx="0.75" fill={ink} opacity="0.6" />
          <rect x="3" y="49" width="14" height="4" rx="1" fill={ink} />
        </>
      )}
      {kind === 'transparent' && (
        <>
          <rect x="1" y="1" width="38" height="54" rx="1.5" fill={ink} opacity="0.35" />
          <rect x="3" y="36" width="20" height="3" rx="1" fill={ink} />
          <rect x="3" y="42" width="28" height="1.5" rx="0.75" fill={ink} opacity="0.7" />
          <rect x="3" y="47" width="16" height="5" rx="1" fill={ink} />
        </>
      )}
      {kind === 'compact' && (
        <>
          <rect x="1" y="1" width="38" height="54" rx="1.5" fill={ink} opacity="0.35" />
          <rect x="4" y="44" width="16" height="2.5" rx="1" fill={ink} />
          <rect x="4" y="48.5" width="12" height="1.5" rx="0.75" fill={ink} opacity="0.7" />
        </>
      )}
    </svg>
  )
}

export default function LayoutTab() {
  const { orientation, photoHeightPercent, portraitStyle, compactPosition, set } = usePoster()

  return (
    <div className="flex flex-col">
      <Section title="Orientation">
        <Segmented
          value={orientation}
          onChange={(o) => set({ orientation: o })}
          options={[
            { value: 'portrait', label: 'Portrait', icon: RectangleVertical },
            { value: 'landscape', label: 'Landscape', icon: RectangleHorizontal },
          ]}
        />
        <p className="font-mono text-[11px] text-ink-500">
          {orientation === 'portrait' ? '700 × 980 px · exports at 1400 × 1960' : '1060 × 700 px · exports at 2120 × 1400'}
        </p>
      </Section>

      {orientation === 'portrait' && (
        <Section title="Composition">
          <div className="grid grid-cols-3 gap-2">
            {PORTRAIT_STYLES.map(({ value, label }) => {
              const active = portraitStyle === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => set({ portraitStyle: value })}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition-all
                    ${active ? 'border-stamp/70 bg-stamp/5' : 'border-ink-800 hover:border-ink-600 hover:bg-ink-850'}`}
                >
                  <StyleDiagram kind={value} active={active} />
                  <span className={`text-xs font-medium ${active ? 'text-ink-100' : 'text-ink-400'}`}>{label}</span>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-ink-500">{PORTRAIT_STYLES.find((s) => s.value === portraitStyle)?.hint}</p>

          {portraitStyle === 'standard' && (
            <Slider label="Photo height" value={photoHeightPercent} min={40} max={85} step={1} format={(v) => `${v}%`} onChange={(v) => set({ photoHeightPercent: v })} />
          )}

          {portraitStyle === 'compact' && (
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-ink-300">Caption position</span>
              <div className="grid w-36 grid-cols-3 gap-1 rounded-xl border border-ink-800 bg-ink-850 p-1.5" role="radiogroup" aria-label="Caption position">
                {POSITIONS.flat().map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    role="radio"
                    aria-checked={compactPosition === pos}
                    aria-label={pos.replace('-', ' ')}
                    onClick={() => set({ compactPosition: pos })}
                    className="flex h-9 items-center justify-center rounded-md transition-colors hover:bg-ink-750"
                  >
                    <span className={`rounded-full transition-all ${compactPosition === pos ? 'h-3 w-3 bg-stamp' : 'h-1.5 w-1.5 bg-ink-500'}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}
    </div>
  )
}
