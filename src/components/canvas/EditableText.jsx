import { useRef, useEffect, useState } from 'react'

/**
 * Inline-editable text for the poster canvas.
 * - When not editing: renders `displayContent` (JSX) if provided, else plain `value`
 * - When editing: shows a transparent contenteditable with the plain `value`
 * Both modes use the same `style` so layout never shifts.
 */
export default function EditableText({ value, onChange, style, multiline, displayContent }) {
  const [editing, setEditing] = useState(false)
  const editRef = useRef(null)

  const startEdit = () => {
    setEditing(true)
  }

  // Focus + move cursor to end once the editable div mounts
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

  const handleBlur = () => {
    const text = editRef.current?.innerText?.replace(/\n$/, '') || ''
    if (text !== value) onChange(text)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); editRef.current?.blur() }
    if (e.key === 'Escape') editRef.current?.blur()
  }

  const baseStyle = { outline: 'none', cursor: 'text', ...style }

  if (editing) {
    return (
      <div
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{ ...baseStyle, whiteSpace: multiline ? 'pre-wrap' : 'nowrap' }}
        className="poster-editable"
      />
    )
  }

  return (
    <div
      onClick={startEdit}
      style={baseStyle}
      className="poster-editable"
    >
      {displayContent ?? value}
    </div>
  )
}
