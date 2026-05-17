import usePosterStore from '../../../store/posterStore'
import { HANDWRITING_FONTS, BODY_FONTS, loadFont } from '../../../lib/fonts'
import SliderControl from '../controls/SliderControl'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'

const ALL_LABEL_FONTS = [...HANDWRITING_FONTS, ...BODY_FONTS]

export default function LabelsTab() {
  const {
    annotations, annotationFont, annotationColor,
    addAnnotation, removeAnnotation, updateAnnotation, set,
  } = usePosterStore()

  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleFontChange = async (fontName) => {
    const font = ALL_LABEL_FONTS.find((f) => f.name === fontName)
    if (font) await loadFont(font.url)
    set({ annotationFont: fontName })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Global style */}
      <div className="flex flex-col gap-3">
        <div className="text-xs text-neutral-500 uppercase tracking-widest">Label style</div>

        {/* Font */}
        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-400">Font</div>
          <select
            value={annotationFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded px-2 py-1.5 focus:outline-none"
          >
            <optgroup label="Handwriting">
              {HANDWRITING_FONTS.map((f) => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </optgroup>
            <optgroup label="Sans-serif">
              {BODY_FONTS.map((f) => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Color */}
        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-400">Color</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowColorPicker((v) => !v)}
              style={{ backgroundColor: annotationColor }}
              className="w-7 h-7 rounded border border-neutral-600 flex-shrink-0"
            />
            <span className="text-xs font-mono text-neutral-400">{annotationColor}</span>
          </div>
          {showColorPicker && (
            <div className="mt-1">
              <HexColorPicker color={annotationColor} onChange={(c) => set({ annotationColor: c })} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* Label list */}
      <div className="flex flex-col gap-2">
        <div className="text-xs text-neutral-500 uppercase tracking-widest">Labels</div>

        {annotations.length === 0 && (
          <div className="text-xs text-neutral-600 text-center py-4">
            No labels yet — add one and drag it onto the photo
          </div>
        )}

        {annotations.map((a) => (
          <div key={a.id} className="flex flex-col gap-1.5 bg-neutral-800/50 rounded-lg p-2.5">
            <div className="flex items-center gap-2">
              <input
                value={a.text}
                onChange={(e) => updateAnnotation(a.id, { text: e.target.value })}
                className="flex-1 bg-neutral-800 border border-neutral-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-neutral-500"
                placeholder="label text"
              />
              <button
                onClick={() => removeAnnotation(a.id)}
                className="text-neutral-600 hover:text-red-400 text-sm leading-none flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <SliderControl
              label="Size"
              value={a.fontSize}
              min={8} max={32} step={1}
              format={(v) => `${v}px`}
              onChange={(v) => updateAnnotation(a.id, { fontSize: v })}
            />
          </div>
        ))}

        <button
          onClick={addAnnotation}
          className="w-full py-2 border border-dashed border-neutral-600 hover:border-neutral-400 rounded text-xs text-neutral-500 hover:text-neutral-300 transition-colors mt-1"
        >
          + Add label
        </button>
      </div>

      <div className="text-xs text-neutral-600 leading-relaxed border-t border-neutral-800 pt-3">
        Click a label on the canvas to edit its text. Drag to reposition.
      </div>
    </div>
  )
}
