import { useRef, useEffect, useState, useId } from 'react'
import { selection } from '../../lib/selection'

export default function EditableText({ value, onChange, style, multiline, displayContent, onHide }) {
  const id = useId()
  const [isSelected, setIsSelected] = useState(false)
  const [editing, setEditing] = useState(false)
  const editRef = useRef(null)

  // Stay in sync with global selection
  useEffect(() => selection.subscribe((sid) => setIsSelected(sid === id)), [id])

  // Focus + cursor-to-end when entering edit mode
  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus()
      editRef.current.innerText = value
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(editRef.current)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [editing]) // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = () => {
    selection.clear()
    setEditing(true)
  }

  const handleBlur = () => {
    const text = editRef.current?.innerText?.replace(/\n$/, '') || ''
    if (text !== value) onChange(text)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); editRef.current?.blur() }
    if (e.key === 'Escape') editRef.current?.blur()
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (isSelected) {
      startEdit()
    } else {
      selection.set(id)
    }
  }

  const handleHide = (e) => {
    e.stopPropagation()
    selection.clear()
    onHide()
  }

  const baseStyle = { outline: 'none', ...style }

  if (editing) {
    return (
      <div
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{ ...baseStyle, cursor: 'text', whiteSpace: multiline ? 'pre-wrap' : 'nowrap' }}
        className="poster-editable poster-editing"
      />
    )
  }

  return (
    <div
      onClick={handleClick}
      onDoubleClick={(e) => { e.stopPropagation(); startEdit() }}
      style={{
        ...baseStyle,
        position: 'relative',
        cursor: 'crosshair',
        ...(isSelected && {
          outline: '1px solid rgba(255,255,255,0.75)',
          outlineOffset: '3px',
          borderRadius: '2px',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }),
      }}
      className="poster-editable"
    >
      {displayContent ?? value}

      {/* Action bar — only when selected */}
      {isSelected && (
        <div className="poster-action-bar">
          <button className="poster-action-btn" onClick={(e) => { e.stopPropagation(); startEdit() }} title="Edit">
            ✎
          </button>
          {onHide && (
            <button className="poster-action-btn poster-action-remove" onClick={handleHide} title="Remove">
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
}
