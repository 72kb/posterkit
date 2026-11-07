import usePosterStore from '../../../store/posterStore'
import ColorPicker from '../controls/ColorPicker'
import FontPicker from '../controls/FontPicker'
import PaletteDotEditor from '../controls/PaletteDotEditor'
import SliderControl from '../controls/SliderControl'
import { DISPLAY_FONTS, BODY_FONTS } from '../../../lib/fonts'
import Toggle from '../../ui/Toggle'

const TINT_PRESETS = [
  { name: 'None',        color: '#000000', opacity: 0 },
  { name: 'Golden Hour', color: '#B46414', opacity: 0.18 },
  { name: 'Cool Blue',   color: '#1A3D6E', opacity: 0.20 },
  { name: 'Noir',        color: '#000000', opacity: 0.35 },
]

const ACCENT_SWATCHES = [
  { name: 'Red Bull', color: '#E8112D' },
  { name: 'Electric Blue', color: '#0066FF' },
  { name: 'Turmeric', color: '#FFC906' },
  { name: 'Chalk', color: '#F0EBE1' },
  { name: 'Black', color: '#111111' },
]

const TEXT_SWATCHES = [
  { name: 'White',      color: '#ffffff' },
  { name: 'Warm Cream', color: '#F5ECD7' },
  { name: 'Cool Gray',  color: '#C8D0D8' },
  { name: 'Soft Gold',  color: '#E8D5A3' },
  { name: 'Black',      color: '#111111' },
]

export default function DesignTab() {
  const s = usePosterStore()

  return (
    <div className="flex flex-col gap-4">
      <Section title="Background">
        <ColorPicker label="Background Color" value={s.bgColor || '#0d0d0d'} onChange={(v) => s.set({ bgColor: v })} />
      </Section>

      <Section title="Text Color">
        <ColorPicker label="Color" value={s.textColor || '#ffffff'} onChange={(v) => s.set({ textColor: v })} />
        <div className="flex gap-2 flex-wrap mt-1">
          {TEXT_SWATCHES.map((sw) => (
            <button
              key={sw.name}
              onClick={() => s.set({ textColor: sw.color })}
              title={sw.name}
              style={{ backgroundColor: sw.color }}
              className="w-6 h-6 rounded border border-neutral-600 hover:scale-110 transition-transform"
            />
          ))}
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">Applies to titles, captions, credits, and dividers. Accent color controls labels and name stamp.</p>
      </Section>

      <Section title="Accent Color">
        <ColorPicker label="Color" value={s.accentColor} onChange={(v) => s.set({ accentColor: v })} />
        <div className="flex gap-2 flex-wrap mt-1">
          {ACCENT_SWATCHES.map((sw) => (
            <button
              key={sw.name}
              onClick={() => s.set({ accentColor: sw.color })}
              title={sw.name}
              style={{ backgroundColor: sw.color }}
              className="w-6 h-6 rounded border border-neutral-600 hover:scale-110 transition-transform"
            />
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <FontPicker label="Display Font" value={s.displayFont} options={DISPLAY_FONTS} onChange={(v) => s.set({ displayFont: v })} />
        <FontPicker label="Body Font" value={s.bodyFont} options={BODY_FONTS} onChange={(v) => s.set({ bodyFont: v })} />
      </Section>

      <Section title="Palette">
        <PaletteDotEditor />
      </Section>

      <Section title="Photo Tint">
        <ColorPicker label="Tint Color" value={s.tintColor} onChange={(v) => s.set({ tintColor: v })} />
        <SliderControl label="Tint Opacity" value={s.tintOpacity} min={0} max={0.5} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.set({ tintOpacity: v })} />
        <div className="flex gap-2 flex-wrap">
          {TINT_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => s.set({ tintColor: p.color, tintOpacity: p.opacity })}
              className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Vignette">
        <SliderControl label="Intensity" value={s.vignetteIntensity} min={0} max={1} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.set({ vignetteIntensity: v })} />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-400">Direction</label>
          <div className="flex gap-1 flex-wrap">
            {['bottom', 'top', 'edges', 'left', 'right'].map((d) => (
              <button
                key={d}
                onClick={() => s.set({ vignetteDirection: d })}
                className={`px-2 py-1 text-xs rounded capitalize transition-colors
                  ${s.vignetteDirection === d ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Grain">
        <SliderControl label="Opacity" value={s.grainOpacity} min={0} max={0.2} step={0.005} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.set({ grainOpacity: v })} />
      </Section>

      <Section title="Divider">
        <Toggle label="Show divider lines" value={s.showDivider} onChange={(v) => s.set({ showDivider: v })} />
        <SliderControl label="Opacity" value={s.dividerOpacity} min={0} max={1} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.set({ dividerOpacity: v })} />
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 pb-1">{title}</div>
      {children}
    </div>
  )
}
