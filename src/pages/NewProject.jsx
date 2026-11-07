import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, ImagePlus, Loader2, Plus, X } from 'lucide-react'
import SiteHeader from '../components/layout/SiteHeader'
import PosterPreview from '../components/poster/PosterPreview'
import { TEMPLATES } from '../lib/templates'
import { MAG_TEMPLATES } from '../lib/magTemplates'
import { SHOWCASE } from '../lib/showcase'
import { FORMATS, TEMPLATE_SCENES, startProject, templatePreviewDoc } from '../lib/starters'
import { processImage } from '../lib/photos'
import { navigate, useRoute } from '../router'
import { toast } from '../lib/toast'

const FORMAT_PREVIEW = {
  editorial: SHOWCASE.find((s) => s.id === 'car-park-drift'),
  magazine: SHOWCASE.find((s) => s.id === 'couture'),
  annotated: SHOWCASE.find((s) => s.id === 'field-notes'),
}

function Card({ children, onClick, label, sub, index = 0, active }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.035, type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group text-left"
    >
      <div className={`overflow-hidden rounded-xl border transition-all duration-300 group-hover:shadow-poster ${active ? 'border-stamp shadow-glow' : 'border-ink-800 group-hover:border-ink-600'}`}>
        {children}
      </div>
      <div className="mt-2.5 px-0.5">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink-100">
          {label}
          <ArrowRight size={13} className="-translate-x-1 text-stamp opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </div>
        {sub && <div className="text-[11px] text-ink-500">{sub}</div>}
      </div>
    </motion.button>
  )
}

export default function NewProject() {
  const { query } = useRoute()
  const [format, setFormat] = useState(query.get('format') || 'editorial')
  const [creating, setCreating] = useState(false)
  const [photo, setPhoto] = useState(null) // { blob, url }
  const fileRef = useRef(null)
  const autoStarted = useRef(false)

  const create = async (opts) => {
    if (creating) return
    setCreating(true)
    try {
      const project = await startProject({ ...opts, photoBlob: photo?.blob || null })
      navigate(`/editor/${project.id}`, { replace: true })
    } catch (err) {
      console.error(err)
      toast.error('Couldn’t create the poster', { description: err.message })
      setCreating(false)
    }
  }

  // Deep links: #/new?example=… or #/new?template=… create immediately.
  useEffect(() => {
    const example = query.get('example')
    const template = query.get('template')
    if ((example || template) && !autoStarted.current) {
      autoStarted.current = true
      create({ exampleId: example, templateId: template, format })
    }
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (photo?.url) URL.revokeObjectURL(photo.url) }, [photo])

  const onPhoto = async (file) => {
    if (!file) return
    try {
      const blob = await processImage(file)
      setPhoto({ blob, url: URL.createObjectURL(blob) })
    } catch (err) {
      toast.error('Couldn’t use that photo', { description: err.message })
    }
  }

  const templates = format === 'magazine' ? MAG_TEMPLATES : format === 'editorial' ? TEMPLATES : []
  const examples = useMemo(() => SHOWCASE.filter((s) => (s.doc.posterStyle || 'editorial') === format), [format])

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <div className="label-xs mb-2 text-stamp">New poster</div>
        <h1 className="font-serif text-5xl leading-[0.95] text-ink-100 sm:text-6xl">What are we making?</h1>

        {/* Format chooser */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {FORMATS.map((f, i) => {
            const active = format === f.id
            const ex = FORMAT_PREVIEW[f.id]
            return (
              <motion.button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                aria-pressed={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition-all
                  ${active ? 'border-stamp/70 bg-stamp/[0.06]' : 'border-ink-800 bg-ink-850/50 hover:border-ink-600'}`}
              >
                <div className="w-16 flex-shrink-0 overflow-hidden rounded-md shadow-poster">
                  <PosterPreview doc={ex.doc} sample={ex.photo} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-100">
                    {f.name}
                    {active && <Check size={14} className="text-stamp" />}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{f.blurb}</p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Optional photo */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-ink-800 bg-ink-850/40 p-3">
          {photo ? (
            <>
              <img src={photo.url} alt="Your photo" className="h-14 w-14 rounded-lg object-cover" />
              <div className="text-[13px]">
                <div className="font-medium text-ink-100">Using your photo</div>
                <div className="text-xs text-ink-500">Every option below will start with it.</div>
              </div>
              <button type="button" onClick={() => setPhoto(null)} className="ml-auto rounded-md p-1.5 text-ink-400 hover:bg-ink-800 hover:text-ink-100" aria-label="Remove photo">
                <X size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onPhoto(e.dataTransfer.files?.[0]) }}
              className="flex w-full items-center gap-3 text-left"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-ink-600 text-ink-300"><ImagePlus size={18} /></span>
              <span className="text-[13px]">
                <span className="font-medium text-ink-100">Have a photo ready?</span>
                <span className="block text-xs text-ink-500">Drop it here first — otherwise we’ll start with a sample scene.</span>
              </span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={format}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-12"
          >
            <h2 className="label-xs mb-4">{templates.length ? 'Start from a template' : 'Start'}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
              <Card onClick={() => create({ format })} label="Blank" sub="Default styling" index={0}>
                <div className="flex aspect-[700/980] flex-col items-center justify-center gap-3 bg-ink-900 text-ink-400 transition-colors group-hover:text-ink-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-ink-600 transition-colors group-hover:border-stamp group-hover:text-stamp">
                    <Plus size={18} />
                  </span>
                </div>
              </Card>
              {templates.map((t, i) => (
                <Card key={t.id} onClick={() => create({ templateId: t.id })} label={t.name} sub={t.vibe || t.category} index={i + 1}>
                  <PosterPreview doc={templatePreviewDoc(t)} sample={TEMPLATE_SCENES[t.id]} />
                </Card>
              ))}
            </div>

            {examples.length > 0 && (
              <>
                <h2 className="label-xs mb-4 mt-12">Or remix an example</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
                  {examples.map((ex, i) => (
                    <Card key={ex.id} onClick={() => create({ exampleId: ex.id })} label={ex.name} sub="Fully art-directed" index={i}>
                      <PosterPreview doc={ex.doc} sample={ex.photo} />
                    </Card>
                  ))}
                </div>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-ink-950/80 backdrop-blur-sm"
            role="status"
          >
            <Loader2 className="animate-spin text-stamp" size={28} />
            <span className="text-sm text-ink-300">Setting up your poster…</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
