import { useState, useEffect, useId } from 'react'
import { selection } from '../../lib/selection'

export default function HideableDivider({ style, onHide }) {
  const id = useId()
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => selection.subscribe((sid) => setIsSelected(sid === id)), [id])

  const handleClick = (e) => {
    e.stopPropagation()
    selection.set(id)
  }

  const handleHide = (e) => {
    e.stopPropagation()
    selection.clear()
    onHide()
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        padding: '5px 0',
        cursor: 'crosshair',
        marginBottom: style.marginBottom,
      }}
    >
      <div style={{
        height: '0.5px',
        backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : style.backgroundColor,
        transition: 'background-color 0.15s',
        outline: isSelected ? '1px solid rgba(255,255,255,0.4)' : 'none',
        outlineOffset: '3px',
      }} />

      {isSelected && onHide && (
        <div className="poster-action-bar" style={{ right: 0 }}>
          <button className="poster-action-btn poster-action-remove" onClick={handleHide} title="Remove">
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
