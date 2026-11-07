import { useRef, useState } from 'react'
import { ImagePlus, Loader2, RotateCcw, Trash2, Upload } from 'lucide-react'
import { usePoster } from '../../../store/usePoster'
import { SAMPLE_PHOTOS } from '../../../lib/samplePhotos'
import { useSamplePhoto } from '../../../hooks/usePhotoUrl'
import Section from '../../ui/Section'
import Slider from '../../ui/Slider'
import Button from '../../ui/Button'

const KEYWORDS = { left: 0, top: 0, center: 50, right: 100, bottom: 100 }

/** Parse a CSS background/object-position into numeric percentages. */
function parsePosition(pos = '50% 50%') {
  const parts = String(pos).trim().split(/\s+/)
  const toNum = (v) => (v in KEYWORDS ? KEYWORDS[v] : Number.isFinite(parseFloat(v)) ? parseFloat(v) : 50)
  return [toNum(parts[0] ?? '50%'), toNum(parts[1] ?? parts[0] ?? '50%')]
}

function SampleThumb({ name, onPick, disabled }) {
  const url = useSamplePhoto(name)
  return (
    <button
      type="button"
      onClick={() => onPick(name)}
      disabled={disabled}
      title={`Use the “${name}” sample`}
      className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-ink-800 bg-ink-800 transition-all hover:border-stamp/60 disabled:opacity-50"
    >
      {url && <img src={url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1 pt-4 text-left text-[10px] capitalize text-white/90">
        {name}
      </span>
    </button>
  )
}

export default function PhotoTab({ ctx }) {
  const { photoUrl, photoPosition, photoScale, set, setPhoto } = usePoster()
  const { handleFile, applySample, busy } = ctx.upload
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [posX, posY] = parsePosition(photoPosition)

  return (
    <div className="flex flex-col">
      <div className="py-4">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a photo"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click() } }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]) }}
          className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-all
            ${dragging ? 'border-stamp bg-stamp/10' : 'border-ink-600 hover:border-stamp/60 hover:bg-ink-850'}
            ${photoUrl ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}
        >
          {photoUrl ? (
            <>
              <img src={photoUrl} alt="Current photo" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-2 text-xs font-medium text-white"><Upload size={14} /> Replace photo</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-400">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-800 text-ink-200 transition-transform group-hover:scale-110">
                <ImagePlus size={20} />
              </span>
              <span className="text-[13px] text-ink-200">Drop a photo or click to browse</span>
              <span className="text-[11px] text-ink-500">JPG · PNG · WEBP · AVIF</span>
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="animate-spin text-stamp" />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            data-testid="photo-input"
            onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
          />
        </div>
        {photoUrl && (
          <div className="mt-2 flex gap-2">
            <Button size="sm" icon={Upload} onClick={() => fileRef.current?.click()} className="flex-1">Replace</Button>
            <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setPhoto(null, null)}>Remove</Button>
          </div>
        )}
      </div>

      {photoUrl && (
        <Section title="Framing">
          <Slider label="Horizontal" value={posX} min={0} max={100} step={1} format={(v) => `${v}%`} onChange={(v) => set({ photoPosition: `${v}% ${posY}%` })} />
          <Slider label="Vertical" value={posY} min={0} max={100} step={1} format={(v) => `${v}%`} onChange={(v) => set({ photoPosition: `${posX}% ${v}%` })} />
          <Slider label="Zoom" value={photoScale} min={100} max={250} step={1} format={(v) => `${v}%`} onChange={(v) => set({ photoScale: v })} />
          <Button size="xs" variant="ghost" icon={RotateCcw} className="self-start" onClick={() => set({ photoPosition: '50% 50%', photoScale: 100 })}>
            Reset framing
          </Button>
        </Section>
      )}

      <Section title="Sample photos" defaultOpen={!photoUrl}>
        <p className="-mt-1 text-xs text-ink-500">No photo handy? Try a generated scene.</p>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_PHOTOS.map((n) => <SampleThumb key={n} name={n} onPick={applySample} disabled={busy} />)}
        </div>
      </Section>
    </div>
  )
}
