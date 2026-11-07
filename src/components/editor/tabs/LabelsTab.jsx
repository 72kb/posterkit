import { AnimatePresence, motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { usePoster } from '../../../store/usePoster'
import { LABEL_FONT_GROUPS } from '../../../lib/fonts'
import Section from '../../ui/Section'
import FontSelect from '../../ui/FontSelect'
import ColorField from '../../ui/ColorField'
import Slider from '../../ui/Slider'
import Button from '../../ui/Button'

const INK = [
  { name: 'Paper', color: '#fdf6e3' },
  { name: 'White', color: '#ffffff' },
  { name: 'Marker yellow', color: '#ffe14d' },
  { name: 'Stamp', color: '#ff4d2e' },
  { name: 'Ink', color: '#111111' },
]

export default function LabelsTab() {
  const { annotations, annotationFont, annotationColor, addAnnotation, removeAnnotation, updateAnnotation, set } = usePoster()

  return (
    <div className="flex flex-col">
      <Section title="Handwriting">
        <FontSelect label="Font" value={annotationFont} groups={LABEL_FONT_GROUPS} onChange={(v) => set({ annotationFont: v })} sample="hello there" />
        <ColorField label="Ink" value={annotationColor} onChange={(v) => set({ annotationColor: v })} swatches={INK} />
      </Section>

      <Section title={`Labels · ${annotations.length}`}>
        {annotations.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink-700 px-4 py-6 text-center text-xs text-ink-500">
            No labels yet — add one, then drag it onto the photo.
          </div>
        )}
        <AnimatePresence initial={false}>
          {annotations.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-2 rounded-xl border border-ink-800 bg-ink-850 p-2.5"
            >
              <div className="flex items-center gap-2">
                <textarea
                  value={a.text}
                  rows={Math.min(3, a.text.split('\n').length)}
                  onChange={(e) => updateAnnotation(a.id, { text: e.target.value })}
                  className="field-input resize-none py-1.5"
                  style={{ fontFamily: `'${annotationFont}', cursive`, fontSize: 16 }}
                  aria-label="Label text"
                />
                <button
                  type="button"
                  onClick={() => removeAnnotation(a.id)}
                  aria-label="Remove label"
                  className="rounded-md p-1 text-ink-500 transition-colors hover:bg-ink-750 hover:text-stamp"
                >
                  <X size={15} />
                </button>
              </div>
              <Slider label="Size" value={a.fontSize} min={10} max={48} step={1} format={(v) => `${v}px`} onChange={(v) => updateAnnotation(a.id, { fontSize: v })} />
            </motion.div>
          ))}
        </AnimatePresence>
        <Button variant="dashed" icon={Plus} onClick={addAnnotation}>Add label</Button>
        <p className="text-xs leading-relaxed text-ink-500">Drag labels on the canvas to place them. Click once to select, again to edit.</p>
      </Section>
    </div>
  )
}
