import { useRef, useEffect, useState } from 'react'
import PosterCanvas from './components/canvas/PosterCanvas'
import EditorPanel from './components/editor/EditorPanel'
import { useExport } from './hooks/useExport'
import usePosterStore from './store/posterStore'

const PORTRAIT_W = 700
const PORTRAIT_H = 980
const LANDSCAPE_W = 1060
const LANDSCAPE_H = 700

export default function App() {
  const posterRef = useRef(null)
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const orientation = usePosterStore((s) => s.orientation)
  const exportFns = useExport(posterRef)

  const posterW = orientation === 'portrait' ? PORTRAIT_W : LANDSCAPE_W
  const posterH = orientation === 'portrait' ? PORTRAIT_H : LANDSCAPE_H

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      const availH = containerRef.current.clientHeight - 32
      const availW = containerRef.current.clientWidth - 32
      const scaleH = availH / posterH
      const scaleW = availW / posterW
      setScale(Math.min(scaleH, scaleW, 1))
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [posterW, posterH])

  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 flex-shrink-0 bg-neutral-900">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm tracking-wide">PosterKit</span>
          <span className="text-neutral-600 text-xs">editorial poster editor</span>
        </div>
        <button
          onClick={exportFns.exportPng}
          disabled={exportFns.exporting}
          className="px-3 py-1.5 bg-white hover:bg-neutral-200 text-black text-xs font-medium rounded transition-colors disabled:opacity-40"
        >
          {exportFns.exporting ? 'Exporting…' : 'Export PNG'}
        </button>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas panel */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden bg-neutral-950 min-w-0"
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              flexShrink: 0,
            }}
          >
            <PosterCanvas ref={posterRef} />
          </div>
        </div>

        {/* Editor panel */}
        <div className="w-72 flex-shrink-0 border-l border-neutral-800 overflow-hidden">
          <EditorPanel exportFns={exportFns} />
        </div>
      </div>
    </div>
  )
}
