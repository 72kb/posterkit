import { useRef, useEffect, useState, useId } from 'react'
import { selection } from '../../lib/selection'
import { useCanvasMode } from '../../store/usePoster'

/**
 * Inline-editable text on the poster canvas.
 * Click → select (shows toolbar), click again / double-click → edit.
 * Read-only when rendered inside a non-interactive canvas (previews).
 */
export default function EditableText(props) {
  const { interactive } = useCanvasMode()
  if (!interactive) {
    const { value, style, displayContent } = props
    return <div style={style}>{displayContent ?? value}</div>
  }
  return <InteractiveText {...props} />
}

function InteractiveText({ value, onChange, style, multiline, displayContent, onHide, label }) {
  const id = useId()
  const [isSelected, setIsSelected] = useState(() => selection.get() === id)
  const [editing, setEditing] = useState(false)
  const editRef = useRef(null)

  useEffect(() => selection.subscribe((sid) => setIsSelected(sid === id)), [id])

  // Focus + caret-to-end when entering edit mode
  useEffect(() => {
    if (!editing || !editRef.current) return
    const el = editRef.current
    el.innerText = value ?? ''
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }, [editing]) // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = () => {
    selection.clear()
    setEditing(true)
  }

  const commit = () => {
    const text = (editRef.current?.innerText ?? '').replace(/\n$/, '')
    const next = multiline ? text : text.replace(/\n/g, ' ')
    setEditing(false)
    // Clearing a hideable element hides it (one undo step, old text kept for
    // when it's switched back on) instead of leaving an invisible empty slot.
    if (!next.trim() && onHide && value) { onHide(); return }
    if (next !== value) onChange(next)
  }

  const handleKeyDown = (e) => {
    e.stopPropagation() // keep global shortcuts away while typing
    if (!multiline && e.key === 'Enter') { e.preventDefault(); editRef.current?.blur() }
    if (e.key === 'Escape') editRef.current?.blur()
  }

  // Paste as plain text so foreign styles never leak into the poster.
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, multiline ? text : text.replace(/\n/g, ' '))
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (isSelected) startEdit()
    else selection.set(id, { onDelete: onHide, onEdit: startEdit })
  }

  const handleHide = (e) => {
    e.stopPropagation()
    selection.clear()
    onHide()
  }

  // Empty slots render exactly as they export: as nothing. (Hideable elements
  // are hidden when cleared; every field stays editable from the side panel.)
  if (!value && !editing) return <div style={style} aria-hidden="true" />

  if (editing) {
    return (
      // Distinct keys force React to swap DOM nodes. Reusing the node would keep
      // the browser-typed text and React would append its own copy (duplicate text).
      <div
        key="editing"
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline={multiline ? 'true' : 'false'}
        aria-label={label || 'Edit text'}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...style,
          outline: 'none',
          cursor: 'text',
          whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
          minWidth: 24,
          minHeight: '1em',
        }}
        className="poster-editable poster-editing"
      />
    )
  }

  return (
    <div
      key="display"
      onClick={handleClick}
      onDoubleClick={(e) => { e.stopPropagation(); startEdit() }}
      style={{
        ...style,
        outline: 'none',
        position: style?.position === 'absolute' ? 'absolute' : 'relative',
      }}
      className={`poster-editable${isSelected ? ' poster-selected' : ''}`}
    >
      {displayContent ?? value}

      {isSelected && (
        <div className="poster-action-bar" data-export-ignore="true" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="poster-action-btn" onClick={(e) => { e.stopPropagation(); startEdit() }} title="Edit text (Enter)">
            Edit
          </button>
          {onHide && (
            <button type="button" className="poster-action-btn poster-action-remove" onClick={handleHide} title="Hide element (Delete)">
              Hide
            </button>
          )}
        </div>
      )}
    </div>
  )
}
