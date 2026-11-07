import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft, Check, ChevronDown, CloudOff, Download, FileImage, FileText, Image as ImageIcon,
  Keyboard, Loader2, Minus, Plus, Redo2, Undo2,
} from 'lucide-react'
import { usePoster } from '../../store/usePoster'
import { MOD } from '../../hooks/useShortcuts'
import Logo from '../brand/Logo'
import Button from '../ui/Button'
import IconButton from '../ui/IconButton'
import Popover from '../ui/Popover'

const EXPORTS = [
  { id: 'png', label: 'PNG image', sub: 'Lossless · 2× · best for sharing', icon: ImageIcon },
  { id: 'jpg', label: 'JPG image', sub: 'Smaller file · 2×', icon: FileImage },
  { id: 'pdf', label: 'PDF document', sub: 'Print-ready A4 · 3×', icon: FileText },
]

function SaveStatus({ status }) {
  const map = {
    saved: { icon: Check, text: 'Saved', cls: 'text-ink-400' },
    saving: { icon: Loader2, text: 'Saving…', cls: 'text-ink-400', spin: true },
    error: { icon: CloudOff, text: 'Not saved', cls: 'text-stamp' },
  }
  const s = map[status] || map.saved
  const Icon = s.icon
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.15 }}
        className={`hidden items-center gap-1.5 text-xs sm:inline-flex ${s.cls}`}
        aria-live="polite"
      >
        <Icon size={13} className={s.spin ? 'animate-spin' : ''} />
        {s.text}
      </motion.span>
    </AnimatePresence>
  )
}

function ProjectName({ name, onRename }) {
  const [draft, setDraft] = useState(null)
  const commit = () => {
    if (draft !== null && draft.trim() && draft.trim() !== name) onRename(draft.trim())
    setDraft(null)
  }
  return (
    <input
      aria-label="Poster name"
      value={draft ?? name}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => e.target.select()}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') { setDraft(null); setTimeout(() => e.target.blur()) }
      }}
      maxLength={120}
      className="min-w-0 max-w-[40vw] truncate rounded-md border border-transparent bg-transparent px-2 py-1 text-[13px] font-medium text-ink-100 transition-colors hover:border-ink-700 focus:border-stamp/60 focus:bg-ink-850 focus:outline-none sm:max-w-[260px]"
      style={{ width: `${Math.max(8, (draft ?? name).length + 2)}ch` }}
    />
  )
}

export default function EditorHeader({
  project, onRename, saveStatus, exporter, scale, isFit,
  onZoomIn, onZoomOut, onZoomFit, onHelp, compact,
}) {
  const canUndo = usePoster((s) => s.canUndo)
  const canRedo = usePoster((s) => s.canRedo)
  const undo = usePoster((s) => s.undo)
  const redo = usePoster((s) => s.redo)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative z-30 flex h-14 flex-shrink-0 items-center gap-2 border-b border-ink-800 bg-ink-900/90 px-2 backdrop-blur-xl sm:px-3">
      <a
        href="#/projects"
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-ink-300 transition-colors hover:bg-ink-800 hover:text-ink-100"
        title="All posters"
      >
        {compact ? <ArrowLeft size={18} /> : <Logo size={26} />}
      </a>
      <span className="hidden h-5 w-px bg-ink-800 sm:block" />
      <ProjectName name={project.name} onRename={onRename} />
      <SaveStatus status={saveStatus} />

      <div className="ml-auto flex items-center gap-1">
        <IconButton icon={Undo2} label={`Undo (${MOD}Z)`} onClick={undo} disabled={!canUndo} />
        <IconButton icon={Redo2} label={`Redo (${MOD}⇧Z)`} onClick={redo} disabled={!canRedo} />

        {!compact && (
          <>
            <span className="mx-1.5 h-5 w-px bg-ink-800" />
            <div className="flex items-center rounded-lg border border-ink-800 bg-ink-850">
              <IconButton icon={Minus} size="sm" label={`Zoom out (${MOD}−)`} onClick={onZoomOut} />
              <button
                type="button"
                onClick={onZoomFit}
                title={`Fit to screen (${MOD}0)`}
                className="w-14 font-mono text-[11px] tabular-nums text-ink-300 hover:text-ink-100"
              >
                {isFit ? 'Fit' : `${Math.round(scale * 100)}%`}
              </button>
              <IconButton icon={Plus} size="sm" label={`Zoom in (${MOD}+)`} onClick={onZoomIn} />
            </div>
            <IconButton icon={Keyboard} label="Keyboard shortcuts (?)" onClick={onHelp} />
            <span className="mx-1.5 h-5 w-px bg-ink-800" />
          </>
        )}

        <Popover
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          align="right"
          className="w-64"
          trigger={
            <Button
              variant="primary"
              size="sm"
              icon={exporter.exporting ? Loader2 : Download}
              iconRight={compact ? undefined : ChevronDown}
              onClick={() => setMenuOpen((o) => !o)}
              disabled={!!exporter.exporting}
              className={exporter.exporting ? '[&>svg:first-child]:animate-spin' : ''}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {compact ? null : exporter.exporting ? 'Exporting…' : 'Export'}
            </Button>
          }
        >
          <div role="menu" className="flex flex-col">
            {EXPORTS.map(({ id, label, sub, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="menuitem"
                onClick={() => { setMenuOpen(false); exporter.run(id) }}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-ink-750"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-750 text-ink-200">
                  <Icon size={15} />
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-ink-100">{label}</span>
                  <span className="block text-[11px] text-ink-500">{sub}</span>
                </span>
              </button>
            ))}
            <div className="mt-1 border-t border-ink-800 px-2.5 pb-1 pt-2 text-[11px] text-ink-500">
              Tip: <span className="font-mono text-ink-400">{MOD}E</span> exports a PNG instantly
            </div>
          </div>
        </Popover>
      </div>
    </header>
  )
}
