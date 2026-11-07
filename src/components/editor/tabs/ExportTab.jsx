import { useState } from 'react'
import { FileDown, FileImage, FileText, Image as ImageIcon, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { usePoster } from '../../../store/usePoster'
import { posterSize } from '../../../lib/dimensions'
import { exportProjectFile } from '../../../lib/projects'
import { slugify } from '../../../lib/exportPoster'
import { toast } from '../../../lib/toast'
import Section from '../../ui/Section'
import Segmented from '../../ui/Segmented'
import Button from '../../ui/Button'
import ImportPresetModal from '../ImportPresetModal'

const FORMATS = [
  { id: 'png', label: 'PNG', sub: 'Lossless — best for social and screens', icon: ImageIcon },
  { id: 'jpg', label: 'JPG', sub: 'Smaller file, great for messaging', icon: FileImage },
  { id: 'pdf', label: 'PDF', sub: 'A4, print-ready, high resolution', icon: FileText },
]

export default function ExportTab({ ctx }) {
  const { exporter, project } = ctx
  const posterStyle = usePoster((s) => s.posterStyle)
  const orientation = usePoster((s) => s.orientation)
  const [ratio, setRatio] = useState(2)
  const [importOpen, setImportOpen] = useState(false)
  const size = posterSize({ posterStyle, orientation })

  const downloadProject = async () => {
    try {
      await ctx.saveNow() // flush pending edits so the file is up to date
      const data = await exportProjectFile(project.id)
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slugify(project.name)}.postakit.json`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      toast.success('Project file downloaded', { description: 'Open it later from “My posters → Import”.' })
    } catch (err) {
      toast.error('Couldn’t export project', { description: err.message })
    }
  }

  return (
    <div className="flex flex-col">
      <Section title="Download">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-ink-300">Resolution</span>
          <Segmented
            size="sm"
            value={ratio}
            onChange={setRatio}
            options={[1, 2, 3, 4].map((r) => ({ value: r, label: `${r}×` }))}
          />
          <span className="font-mono text-[11px] text-ink-500">{size.width * ratio} × {size.height * ratio} px</span>
        </div>
        <div className="flex flex-col gap-2">
          {FORMATS.map(({ id, label, sub, icon: Icon }) => {
            const busy = exporter.exporting === id
            return (
              <button
                key={id}
                type="button"
                disabled={!!exporter.exporting}
                onClick={() => exporter.run(id, { pixelRatio: id === 'pdf' ? Math.max(3, ratio) : ratio })}
                className="group flex items-center gap-3 rounded-xl border border-ink-800 bg-ink-850 p-3 text-left transition-all hover:border-stamp/50 hover:bg-ink-800 disabled:opacity-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-750 text-ink-200 transition-colors group-hover:bg-stamp group-hover:text-white">
                  {busy ? <Loader2 size={17} className="animate-spin" /> : <Icon size={17} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-ink-100">{label}</span>
                  <span className="block text-[11px] text-ink-500">{busy ? 'Rendering…' : sub}</span>
                </span>
                <FileDown size={15} className="text-ink-500 transition-transform group-hover:translate-y-0.5 group-hover:text-ink-200" />
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Project file">
        <p className="-mt-1 text-xs leading-relaxed text-ink-500">
          Posters are saved in this browser. Download a project file (photo included) to back it up or move it to another device.
        </p>
        <Button icon={FileDown} onClick={downloadProject}>Download .postakit.json</Button>
      </Section>

      <Section title="AI preset" defaultOpen={false}>
        <p className="-mt-1 text-xs leading-relaxed text-ink-500">Let an AI suggest colours and copy from your photo, then paste the JSON here.</p>
        <Button icon={Sparkles} onClick={() => setImportOpen(true)}>Import AI preset</Button>
      </Section>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-ink-800 bg-ink-850/60 p-3 text-[11px] leading-relaxed text-ink-400">
        <ShieldCheck size={15} className="mt-0.5 flex-shrink-0 text-emerald-400" />
        Everything renders on your device. Your photos are never uploaded anywhere.
      </div>

      <ImportPresetModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}
