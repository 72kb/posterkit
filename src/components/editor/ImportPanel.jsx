import { useState, useRef } from 'react'
import { parseImport } from '../../lib/importSchema'
import { loadFont } from '../../lib/fonts'
import { DISPLAY_FONTS, BODY_FONTS } from '../../lib/fonts'
import usePosterStore from '../../store/posterStore'

export default function ImportPanel({ onClose }) {
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef(null)
  const { set } = usePosterStore()

  const apply = async (raw) => {
    setError(null)
    const result = parseImport(raw)
    if (!result.ok) {
      setError(result.error)
      return
    }
    // Pre-load any fonts referenced
    const dFont = DISPLAY_FONTS.find((f) => f.name === result.data.displayFont)
    const bFont = BODY_FONTS.find((f) => f.name === result.data.bodyFont)
    await Promise.all([
      dFont ? loadFont(dFont.url) : Promise.resolve(),
      bFont ? loadFont(bFont.url) : Promise.resolve(),
    ])
    set(result.data)
    setSuccess(true)
    setTimeout(onClose, 800)
  }

  const onFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => apply(ev.target.result)
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <div>
            <div className="text-sm font-medium text-white">Import AI-generated preset</div>
            <div className="text-xs text-neutral-500 mt-0.5">Paste JSON or load a .json file</div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white text-lg leading-none">✕</button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); setSuccess(false) }}
            placeholder='{ "palette": { "accentColor": "#E8112D" }, "subject": { "subjectTitle": "…" }, … }'
            rows={8}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
          />

          {error && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-xs text-green-400 bg-green-950/40 border border-green-800/50 rounded px-3 py-2">
              Preset applied ✓
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => apply(text)}
              disabled={!text.trim()}
              className="flex-1 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-medium rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded transition-colors"
            >
              Load file
            </button>
            <input ref={fileRef} type="file" accept=".json,application/json" onChange={onFile} className="hidden" />
          </div>

          <div className="text-xs text-neutral-600 leading-relaxed border-t border-neutral-800 pt-3">
            Give an AI agent the <code className="text-neutral-400">posterkit-schema.json</code> file
            alongside your photo. It will fill in the colors, text, and metadata — paste the output here.
          </div>
        </div>
      </div>
    </div>
  )
}
