import { usePoster } from '../../../store/usePoster'
import { HEADLINE_FONT_GROUPS, BODY_FONT_GROUPS } from '../../../lib/fonts'
import Section from '../../ui/Section'
import ColorField from '../../ui/ColorField'
import FontSelect from '../../ui/FontSelect'
import Slider from '../../ui/Slider'
import Segmented from '../../ui/Segmented'
import Toggle from '../../ui/Toggle'
import PaletteDotEditor from '../controls/PaletteDotEditor'

const TINT_PRESETS = [
  { name: 'None', color: '#000000', opacity: 0 },
  { name: 'Golden', color: '#B46414', opacity: 0.18 },
  { name: 'Cool', color: '#1A3D6E', opacity: 0.2 },
  { name: 'Rose', color: '#8B0036', opacity: 0.14 },
  { name: 'Noir', color: '#000000', opacity: 0.35 },
]

const ACCENT_SWATCHES = [
  { name: 'Signal red', color: '#E8112D' },
  { name: 'Stamp', color: '#FF4D2E' },
  { name: 'Electric blue', color: '#0066FF' },
  { name: 'Turmeric', color: '#FFC906' },
  { name: 'Chalk', color: '#F0EBE1' },
]

const TEXT_SWATCHES = [
  { name: 'White', color: '#ffffff' },
  { name: 'Warm cream', color: '#F5ECD7' },
  { name: 'Cool grey', color: '#C8D0D8' },
  { name: 'Soft gold', color: '#E8D5A3' },
  { name: 'Ink', color: '#111111' },
]

const pct = (v) => `${Math.round(v * 100)}%`

export default function DesignTab() {
  const s = usePoster()
  const isEditorial = s.posterStyle === 'editorial'
  const isAnnotated = s.posterStyle === 'annotated'
  const usesVignette = s.posterStyle !== 'magazine' || s.magLayout === 'standard'

  return (
    <div className="flex flex-col">
      <Section title="Colour">
        <ColorField label="Background" value={s.bgColor || '#0d0d0d'} onChange={(v) => s.set({ bgColor: v })} />
        {!isAnnotated && (
          <ColorField label="Accent" value={s.accentColor} onChange={(v) => s.set({ accentColor: v })} swatches={ACCENT_SWATCHES} />
        )}
        {isEditorial && (
          <ColorField label="Text" value={s.textColor || '#ffffff'} onChange={(v) => s.set({ textColor: v })} swatches={TEXT_SWATCHES} />
        )}
      </Section>

      {!isAnnotated && (
        <Section title="Typography">
          <FontSelect label="Headline" value={s.displayFont} groups={HEADLINE_FONT_GROUPS} onChange={(v) => s.set({ displayFont: v })} />
          <FontSelect label="Body" value={s.bodyFont} groups={BODY_FONT_GROUPS} onChange={(v) => s.set({ bodyFont: v })} />
        </Section>
      )}

      {isEditorial && (
        <Section title="Palette dots">
          <p className="-mt-1 text-xs text-ink-500">The row of colour dots in the top bar — pick tones from your photo.</p>
          <PaletteDotEditor />
        </Section>
      )}

      <Section title="Photo finish">
        <ColorField label="Tint" value={s.tintColor} onChange={(v) => s.set({ tintColor: v })} />
        <Slider label="Tint strength" value={s.tintOpacity} min={0} max={0.5} step={0.01} format={pct} onChange={(v) => s.set({ tintOpacity: v })} />
        <div className="flex flex-wrap gap-1.5">
          {TINT_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => s.set({ tintColor: p.color, tintOpacity: p.opacity })}
              className="flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-850 py-1 pl-1 pr-2.5 text-[11px] text-ink-300 transition-colors hover:border-ink-600 hover:text-ink-100"
            >
              <span className="h-4 w-4 rounded-full ring-1 ring-inset ring-white/10" style={{ backgroundColor: p.color, opacity: p.opacity ? 1 : 0.3 }} />
              {p.name}
            </button>
          ))}
        </div>
        <Slider label="Film grain" value={s.grainOpacity} min={0} max={0.2} step={0.005} format={pct} onChange={(v) => s.set({ grainOpacity: v })} />
      </Section>

      {usesVignette && (
        <Section title="Vignette">
          <Slider label="Intensity" value={s.vignetteIntensity} min={0} max={1} step={0.01} format={pct} onChange={(v) => s.set({ vignetteIntensity: v })} />
          <Segmented
            size="sm"
            value={s.vignetteDirection}
            onChange={(d) => s.set({ vignetteDirection: d })}
            options={['bottom', 'top', 'edges', 'left', 'right'].map((d) => ({ value: d, label: d[0].toUpperCase() + d.slice(1) }))}
          />
        </Section>
      )}

      {isEditorial && (
        <Section title="Dividers">
          <Toggle label="Show divider lines" value={s.showDivider} onChange={(v) => s.set({ showDivider: v })} />
          {s.showDivider && (
            <Slider label="Opacity" value={s.dividerOpacity} min={0} max={1} step={0.01} format={pct} onChange={(v) => s.set({ dividerOpacity: v })} />
          )}
        </Section>
      )}
    </div>
  )
}
