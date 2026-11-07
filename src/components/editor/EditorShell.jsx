import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePoster, usePosterStoreApi } from '../../store/usePoster'
import { useAutosave } from '../../hooks/useAutosave'
import { useExporter } from '../../hooks/useExporter'
import { useShortcuts } from '../../hooks/useShortcuts'
import { usePhotoUpload } from '../../hooks/usePhotoUpload'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { toast } from '../../lib/toast'
import EditorHeader from './EditorHeader'
import Stage from './Stage'
import Panel from './Panel'
import ToolRail, { MobileTabBar } from './ToolRail'
import ShortcutsModal from './ShortcutsModal'
import { tabsFor } from './tabs/registry'

const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2]

export default function EditorShell({ project, onRename }) {
  const store = usePosterStoreApi()
  const posterStyle = usePoster((s) => s.posterStyle)
  const posterRef = useRef(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const tabs = tabsFor(posterStyle)
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const visibleTab = tabs.some((t) => t.id === activeTab) ? activeTab : tabs[0].id
  const [sheetOpen, setSheetOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  // Zoom: null = fit to stage
  const [zoom, setZoom] = useState(null)
  const [fitScale, setFitScale] = useState(1)
  const scale = zoom ?? fitScale

  const { status, saveNow } = useAutosave(store, project.id)
  const exporter = useExporter(posterRef, project.name)
  const upload = usePhotoUpload(project.id)

  const zoomBy = useCallback((dir) => {
    const cur = zoom ?? fitScale
    const next = dir > 0 ? ZOOM_STEPS.find((z) => z > cur + 0.001) : [...ZOOM_STEPS].reverse().find((z) => z < cur - 0.001)
    if (next) setZoom(next)
  }, [zoom, fitScale])

  useShortcuts({
    undo: () => store.getState().undo(),
    redo: () => store.getState().redo(),
    save: async () => { await saveNow(); toast.success('Saved', { description: 'Your poster is stored in this browser.', duration: 1800 }) },
    exportPng: () => exporter.run('png'),
    zoomIn: () => zoomBy(1),
    zoomOut: () => zoomBy(-1),
    zoomFit: () => setZoom(null),
    help: () => setHelpOpen(true),
  })

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (status === 'saving') { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [status])

  const selectTab = (id) => {
    if (!isDesktop && id === visibleTab && sheetOpen) setSheetOpen(false)
    else { setActiveTab(id); setSheetOpen(true) }
  }

  const ctx = { project, exporter, upload, posterRef, saveNow, openHelp: () => setHelpOpen(true) }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ink-900">
      <EditorHeader
        project={project}
        onRename={onRename}
        saveStatus={status}
        exporter={exporter}
        scale={scale}
        isFit={zoom === null}
        onZoomIn={() => zoomBy(1)}
        onZoomOut={() => zoomBy(-1)}
        onZoomFit={() => setZoom(null)}
        onHelp={() => setHelpOpen(true)}
        compact={!isDesktop}
      />

      <div className="flex min-h-0 flex-1">
        {isDesktop && (
          <>
            <ToolRail tabs={tabs} active={visibleTab} onSelect={setActiveTab} />
            <aside className="w-[340px] flex-shrink-0 border-r border-ink-800 bg-ink-900">
              <Panel tab={visibleTab} ctx={ctx} />
            </aside>
          </>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Stage
            ref={posterRef}
            scale={scale}
            zoomed={zoom !== null}
            onFitScale={setFitScale}
            onDropFile={upload.handleFile}
            uploading={upload.busy}
          />

          {!isDesktop && (
            <AnimatePresence initial={false}>
              {sheetOpen && (
                <motion.div
                  key="sheet"
                  initial={{ height: 0 }}
                  animate={{ height: '52dvh' }}
                  exit={{ height: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                  className="relative flex-shrink-0 overflow-hidden rounded-t-2xl border-t border-ink-700 bg-ink-900 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.8)]"
                >
                  <button
                    type="button"
                    aria-label="Close panel"
                    onClick={() => setSheetOpen(false)}
                    className="absolute left-1/2 top-1.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink-600"
                  />
                  <div className="h-full pt-3">
                    <Panel tab={visibleTab} ctx={ctx} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {!isDesktop && <MobileTabBar tabs={tabs} active={sheetOpen ? visibleTab : null} onSelect={selectTab} />}

      <ShortcutsModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
