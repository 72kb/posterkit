import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Copy, FileUp, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import SiteHeader from '../components/layout/SiteHeader'
import PosterPreview from '../components/poster/PosterPreview'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Popover from '../components/ui/Popover'
import { listProjects, deleteProject, duplicateProject, renameProject, importProjectFile } from '../lib/projects'
import { toast } from '../lib/toast'
import { navigate } from '../router'

function timeAgo(ts) {
  const s = Math.round((Date.now() - ts) / 1000)
  if (s < 45) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d} d ago`
  return new Date(ts).toLocaleDateString()
}

const FORMAT_LABEL = { editorial: 'Editorial', magazine: 'Magazine', annotated: 'Annotated' }

function ProjectCard({ project, index, onDuplicate, onDelete, onRename }) {
  const [menu, setMenu] = useState(false)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index, 10) * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
      className="group relative"
    >
      <a href={`#/editor/${project.id}`} className="block" aria-label={`Open ${project.name}`}>
        <div className="overflow-hidden rounded-xl border border-ink-800 bg-ink-850 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-ink-600 group-hover:shadow-poster">
          <div className="flex aspect-[5/6] items-center justify-center bg-ink-950 p-4">
            <div className="w-full max-w-[85%] shadow-poster transition-transform duration-500 group-hover:scale-[1.03]">
              <PosterPreview doc={project.doc} />
            </div>
          </div>
        </div>
      </a>
      <div className="mt-3 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-ink-100">{project.name}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-500">
            <span>{FORMAT_LABEL[project.doc.posterStyle] || 'Poster'}</span>
            <span>·</span>
            <span>{timeAgo(project.updatedAt)}</span>
          </div>
        </div>
        <Popover
          open={menu}
          onClose={() => setMenu(false)}
          align="right"
          side="top"
          className="w-44"
          trigger={
            <button
              type="button"
              aria-label={`Actions for ${project.name}`}
              onClick={() => setMenu((m) => !m)}
              className="rounded-md p-1 text-ink-500 transition-colors hover:bg-ink-800 hover:text-ink-100"
            >
              <MoreHorizontal size={16} />
            </button>
          }
        >
          {[
            { label: 'Rename', icon: Pencil, fn: onRename },
            { label: 'Duplicate', icon: Copy, fn: onDuplicate },
            { label: 'Delete', icon: Trash2, fn: onDelete, danger: true },
          ].map(({ label, icon: Icon, fn, danger }) => (
            <button
              key={label}
              type="button"
              onClick={() => { setMenu(false); fn(project) }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors hover:bg-ink-750 ${danger ? 'text-stamp-400' : 'text-ink-200'}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </Popover>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState(null)
  const [query, setQuery] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [toRename, setToRename] = useState(null)
  const [renameDraft, setRenameDraft] = useState('')
  const fileRef = useRef(null)

  const refresh = useCallback(() => {
    listProjects()
      .then(setProjects)
      .catch((err) => {
        console.error(err)
        toast.error('Couldn’t read saved posters', { description: err.message })
        setProjects([])
      })
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const filtered = (projects || []).filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  const onDuplicate = async (p) => {
    await duplicateProject(p.id)
    toast.success('Duplicated', { description: p.name })
    refresh()
  }

  const confirmDelete = async () => {
    const p = toDelete
    setToDelete(null)
    await deleteProject(p.id)
    toast.show('Poster deleted', { description: p.name })
    refresh()
  }

  const confirmRename = async () => {
    await renameProject(toRename.id, renameDraft)
    setToRename(null)
    refresh()
  }

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const project = await importProjectFile(await file.text())
      toast.success('Project imported', { description: project.name })
      navigate(`/editor/${project.id}`)
    } catch (err) {
      toast.error('Couldn’t import that file', { description: err.message })
    }
  }

  return (
    <div className="min-h-dvh">
      <SiteHeader current="projects" />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="label-xs mb-2 text-stamp">Library</div>
            <h1 className="font-serif text-5xl leading-none text-ink-100 sm:text-6xl">My posters</h1>
            <p className="mt-3 text-sm text-ink-400">Saved automatically in this browser.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {projects?.length > 0 && (
              <label className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  aria-label="Search posters"
                  className="field-input h-10 w-44 pl-8"
                />
              </label>
            )}
            <Button icon={FileUp} onClick={() => fileRef.current?.click()}>Import</Button>
            <Button as="a" href="#/new" variant="primary" icon={Plus}>New poster</Button>
            <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onImport} data-testid="import-input" />
          </div>
        </div>

        <div className="mt-10">
          {projects === null ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[5/6] animate-pulse rounded-xl bg-ink-850" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-2xl border border-dashed border-ink-700 px-6 py-20 text-center"
            >
              <div className="relative mb-6 h-24 w-20">
                <div className="absolute inset-0 -rotate-6 rounded-md border border-ink-600 bg-ink-800" />
                <div className="absolute inset-0 rotate-3 rounded-md border border-ink-600 bg-ink-750" />
                <div className="absolute inset-0 flex items-center justify-center rounded-md border border-stamp/50 bg-ink-850">
                  <Plus className="text-stamp" />
                </div>
              </div>
              <h2 className="font-serif text-3xl text-ink-100">Nothing pinned up yet</h2>
              <p className="mt-2 max-w-sm text-sm text-ink-400">Start from a template or an example — it only takes a photo.</p>
              <Button as="a" href="#/new" variant="primary" icon={Plus} className="mt-6">Create your first poster</Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                <motion.a
                  href="#/new"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex aspect-[5/6] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-700 text-ink-400 transition-all hover:border-stamp/60 hover:bg-stamp/5 hover:text-ink-100"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 transition-transform group-hover:scale-110 group-hover:bg-stamp group-hover:text-white">
                    <Plus size={20} />
                  </span>
                  <span className="text-[13px] font-medium">New poster</span>
                </motion.a>
                <AnimatePresence>
                  {filtered.map((p, i) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      index={i}
                      onDuplicate={onDuplicate}
                      onDelete={setToDelete}
                      onRename={(proj) => { setToRename(proj); setRenameDraft(proj.name) }}
                    />
                  ))}
                </AnimatePresence>
              </div>
              {filtered.length === 0 && (
                <p className="mt-10 text-center text-sm text-ink-500">No posters match “{query}”.</p>
              )}
            </>
          )}
        </div>
      </main>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete this poster?"
        description={toDelete ? `“${toDelete.name}” and its photo will be permanently removed from this browser.` : ''}
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={() => setToDelete(null)} data-autofocus>Cancel</Button>
            <Button size="sm" variant="danger" icon={Trash2} onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-[13px] text-ink-400">This can’t be undone. Download a project file first if you might want it back.</p>
      </Modal>

      <Modal
        open={!!toRename}
        onClose={() => setToRename(null)}
        title="Rename poster"
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={() => setToRename(null)}>Cancel</Button>
            <Button size="sm" variant="primary" onClick={confirmRename} disabled={!renameDraft.trim()}>Save</Button>
          </>
        }
      >
        <input
          data-autofocus
          value={renameDraft}
          onChange={(e) => setRenameDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && renameDraft.trim()) confirmRename() }}
          maxLength={120}
          className="field-input"
          aria-label="Poster name"
        />
      </Modal>
    </div>
  )
}
