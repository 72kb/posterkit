import { useRef } from 'react'
import { usePoster, useCanvasMode } from '../../store/usePoster'
import EditableText from './EditableText'

const DRAG_THRESHOLD = 4

export default function FloatingAnnotations() {
  const { annotations, annotationFont, annotationColor, updateAnnotation, removeAnnotation } = usePoster()
  const { interactive } = useCanvasMode()
  const wrapperRef = useRef(null)
  const moved = useRef(false)

  // Pointer events cover mouse, touch and pen in one code path.
  const handlePointerDown = (annotation, e) => {
    if (!interactive || e.button > 0) return
    if (e.target.closest?.('.poster-editing, .poster-action-bar')) return
    moved.current = false
    const startX = e.clientX
    const startY = e.clientY
    const rect = wrapperRef.current.getBoundingClientRect()
    const el = e.currentTarget
    const pointerId = e.pointerId

    const onMove = (me) => {
      if (me.pointerId !== pointerId) return
      const dx = me.clientX - startX
      const dy = me.clientY - startY
      if (!moved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      if (!moved.current) {
        moved.current = true
        el.setPointerCapture?.(pointerId)
      }
      me.preventDefault()
      const x = Math.min(98, Math.max(2, ((me.clientX - rect.left) / rect.width) * 100))
      const y = Math.min(98, Math.max(2, ((me.clientY - rect.top) / rect.height) * 100))
      updateAnnotation(annotation.id, { x, y })
    }

    const onUp = () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {annotations.map((a) => (
        <div
          key={a.id}
          className={interactive ? 'poster-annotation' : undefined}
          style={{
            position: 'absolute',
            left: `${a.x}%`,
            top: `${a.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: interactive ? 'auto' : 'none',
            cursor: interactive ? 'grab' : undefined,
            userSelect: 'none',
            touchAction: 'none',
          }}
          onPointerDown={(e) => handlePointerDown(a, e)}
          onClickCapture={(e) => {
            if (moved.current) {
              e.stopPropagation()
              moved.current = false
            }
          }}
        >
          <EditableText
            value={a.text}
            onChange={(v) => updateAnnotation(a.id, { text: v })}
            onHide={() => removeAnnotation(a.id)}
            label="Annotation"
            multiline
            style={{
              fontFamily: `'${annotationFont}', cursive`,
              fontSize: a.fontSize,
              color: annotationColor,
              lineHeight: 1.3,
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              textShadow: '0 1px 6px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      ))}
    </div>
  )
}
