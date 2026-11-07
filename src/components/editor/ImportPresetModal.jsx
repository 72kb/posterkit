import { useRef, useState } from 'react'
import { FileJson, Sparkles } from 'lucide-react'
import { parseImport } from '../../lib/importSchema'
import { ensureDocFontsQuick } from '../../lib/fonts'
import { usePoster } from '../../store/usePoster'
import { toast } from '../../lib/toast'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function ImportPresetModal({ open, onClose }) {
  const state = usePoster()
  const applyTemplate = usePoster((s) => s.applyTemplate)
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const apply = async (raw) => {
    setError(null)
    const result = parseImport(raw)
    if (!result.ok) { setError(result.error); return }
    await ensureDocFontsQuick({ ...state, ...result.data })
    applyTemplate(result.data)
    toast.success('Preset applied', { description: `${Object.keys(result.data).length} fields updated · undo with ⌘Z` })
    setText('')
    onClose()
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then((t) => { setText(t); apply(t) })
    e.target.value = ''
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import an AI preset"
      description="Paste JSON that follows the Postakit schema."
      footer={
        <>
          <Button variant="ghost" size="sm" icon={FileJson} onClick={() => fileRef.current?.click()}>Load file</Button>
          <Button variant="primary" size="sm" icon={Sparkles} onClick={() => apply(text)} disabled={!text.trim()}>Apply</Button>
        </>
      }
    >
      <textarea
        data-autofocus
        value={text}
        onChange={(e) => { setText(e.target.value); setError(null) }}
        placeholder='{ "palette": { "accentColor": "#E8112D" }, "subject": { "subjectTitle": "…" } }'
        rows={9}
        className="field-input resize-none font-mono text-xs"
      />
      {error && (
        <div role="alert" className="mt-3 rounded-lg border border-stamp/30 bg-stamp/10 px-3 py-2 text-xs text-stamp-400">{error}</div>
      )}
      <p className="mt-3 text-xs leading-relaxed text-ink-500">
        Give an AI assistant your photo plus the{' '}
        <a href="./postakit-schema.json" download className="text-ink-200 underline decoration-ink-600 underline-offset-2 hover:text-stamp">postakit-schema.json</a>{' '}
        file and ask it to fill in colours, copy and metadata. Paste its answer here.
      </p>
      <input ref={fileRef} type="file" accept=".json,application/json" onChange={onFile} className="hidden" />
    </Modal>
  )
}
