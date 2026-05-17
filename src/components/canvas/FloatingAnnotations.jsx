import { useRef } from 'react'
import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'

export default function FloatingAnnotations() {
  const { annotations, annotationFont, annotationColor, updateAnnotation } = usePosterStore()
  const wrapperRef = useRef(null)
  const moved = useRef(false)

  const handleMouseDown = (annotation, e) => {
    moved.current = false
    const startX = e.clientX
    const startY = e.clientY
    const rect = wrapperRef.current.getBoundingClientRect()

    const onMove = (me) => {
      const dx = me.clientX - startX
      const dy = me.clientY - startY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        moved.current = true
        const x = Math.min(98, Math.max(2, ((me.clientX - rect.left) / rect.width) * 100))
        const y = Math.min(98, Math.max(2, ((me.clientY - rect.top) / rect.height) * 100))
        updateAnnotation(annotation.id, { x, y })
      }
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {annotations.map((a) => (
        <div
          key={a.id}
          style={{
            position: 'absolute',
            left: `${a.x}%`,
            top: `${a.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'all',
            cursor: 'move',
            userSelect: 'none',
          }}
          onMouseDown={(e) => handleMouseDown(a, e)}
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
