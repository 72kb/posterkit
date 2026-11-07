import { useState, useEffect, useId } from 'react'
import { selection } from '../../lib/selection'
import { useCanvasMode } from '../../store/usePoster'

export default function HideableDivider({ color, marginBottom = 8, onHide }) {
  const { interactive } = useCanvasMode()
  if (!interactive) {
    return (
      <div style={{ padding: '5px 0', marginBottom }}>
        <div style={{ height: '0.5px', backgroundColor: color }} />
      </div>
    )
  }
  return <InteractiveDivider color={color} marginBottom={marginBottom} onHide={onHide} />
}

function InteractiveDivider({ color, marginBottom, onHide }) {
  const id = useId()
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => selection.subscribe((sid) => setIsSelected(sid === id)), [id])

  const handleHide = (e) => {
    e.stopPropagation()
    selection.clear()
    onHide()
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); selection.set(id, { onDelete: onHide }) }}
      className={`poster-divider${isSelected ? ' poster-selected' : ''}`}
      style={{ position: 'relative', padding: '5px 0', marginBottom }}
    >
      <div style={{ height: '0.5px', backgroundColor: color }} />
      {isSelected && onHide && (
        <div className="poster-action-bar" data-export-ignore="true">
          <button type="button" className="poster-action-btn poster-action-remove" onClick={handleHide} title="Hide divider (Delete)">
            Hide
          </button>
        </div>
      )}
    </div>
  )
}
