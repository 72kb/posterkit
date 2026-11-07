import { memo, useEffect, useState } from 'react'
import { createPosterStore, normalizeDoc } from '../../store/posterStore'
import { PosterProvider } from '../../store/PosterContext'
import { posterSize } from '../../lib/dimensions'
import { ensureDocFonts } from '../../lib/fonts'
import { useElementSize } from '../../hooks/useElementSize'
import { useSamplePhoto, useStoredPhoto } from '../../hooks/usePhotoUrl'
import PosterCanvas from '../canvas/PosterCanvas'

/**
 * A live, read-only poster render that scales to the width of its container.
 * Pass `sample` to use a procedural sample photo, otherwise the doc's photoId
 * is resolved from IndexedDB.
 */
function PosterPreview({ doc, sample, className = '', style }) {
  const sampleUrl = useSamplePhoto(sample)
  const storedUrl = useStoredPhoto(sample ? null : doc.photoId)
  const photoUrl = sample ? sampleUrl : storedUrl

  const [store] = useState(() => createPosterStore({ ...doc, photoUrl }, { history: false }))
  const [ref, { width }] = useElementSize()

  useEffect(() => {
    store.getState().replace({ ...normalizeDoc(doc), photoUrl })
  }, [store, doc, photoUrl])

  useEffect(() => {
    ensureDocFonts(doc)
  }, [doc])

  const size = posterSize(doc)
  const scale = width ? width / size.width : 0

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${size.width} / ${size.height}`, backgroundColor: doc.bgColor || '#0d0d0d', ...style }}
    >
      {scale > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: size.width, height: size.height,
            transform: `scale(${scale})`, transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          <PosterProvider store={store}>
            <PosterCanvas />
          </PosterProvider>
        </div>
      )}
    </div>
  )
}

export default memo(PosterPreview)
