import { forwardRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { usePoster } from '../../store/usePoster'
import { posterSize } from '../../lib/dimensions'
import { selection } from '../../lib/selection'
import { useElementSize } from '../../hooks/useElementSize'
import PosterCanvas from '../canvas/PosterCanvas'

const PADDING = 48

/**
 * The canvas area: a dotted work surface that scales the fixed-size poster
 * to fit (or to an explicit zoom), and accepts dropped photos.
 */
const Stage = forwardRef(function Stage({ scale, zoomed, onFitScale, onDropFile, uploading }, posterRef) {
  const posterStyle = usePoster((s) => s.posterStyle)
  const orientation = usePoster((s) => s.orientation)
  const { width: pw, height: ph } = posterSize({ posterStyle, orientation })
  const [ref, { width, height }] = useElementSize()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!width || !height) return
    const pad = width < 640 ? 24 : PADDING
    onFitScale(Math.max(0.1, Math.min((width - pad) / pw, (height - pad) / ph, 1.5)))
  }, [width, height, pw, ph, onFitScale])

  const onDragOver = (e) => {
    if ([...e.dataTransfer.types].includes('Files')) {
      e.preventDefault()
      setDragging(true)
    }
  }
  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onDropFile(file)
  }

  return (
    <div
      ref={ref}
      data-testid="stage"
      className={`dot-grid relative min-h-0 flex-1 bg-ink-950 ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
      onClick={() => selection.clear()}
      onDragOver={onDragOver}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setDragging(false) }}
      onDrop={onDrop}
    >
      {/* soft spotlight behind the poster */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,77,46,0.06),transparent_60%)]" />

      <div
        className="relative flex min-h-full min-w-full items-center justify-center"
        style={zoomed ? { width: Math.max(width, pw * scale + PADDING * 2), height: Math.max(height, ph * scale + PADDING * 2) } : undefined}
      >
        <motion.div
          key={`${posterStyle}-${orientation}`}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ width: pw * scale, height: ph * scale, flexShrink: 0 }}
          className="relative"
        >
          <div
            className="shadow-poster"
            style={{
              width: pw,
              height: ph,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              '--canvas-scale': scale,
            }}
          >
            <PosterCanvas ref={posterRef} />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {(dragging || uploading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-2xl border-2 border-dashed border-stamp/70 bg-ink-950/70 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3 text-ink-100">
              {uploading ? <Loader2 className="animate-spin text-stamp" size={32} /> : <ImagePlus className="text-stamp" size={32} />}
              <span className="text-sm font-medium">{uploading ? 'Processing photo…' : 'Drop to use this photo'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default Stage
