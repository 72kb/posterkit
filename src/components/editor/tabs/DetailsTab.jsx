import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { usePoster } from '../../../store/usePoster'
import { MAX_DETAIL_ROWS } from '../../../store/posterStore'
import Toggle from '../../ui/Toggle'
import Button from '../../ui/Button'

function SortableRow({ row }) {
  const updateDetailRow = usePoster((s) => s.updateDetailRow)
  const removeDetailRow = usePoster((s) => s.removeDetailRow)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className={`flex items-center gap-1.5 rounded-xl border bg-ink-850 p-1.5 ${isDragging ? 'border-stamp/60 shadow-glow' : 'border-ink-800'}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="flex h-full cursor-grab touch-none items-center px-0.5 text-ink-500 hover:text-ink-200 active:cursor-grabbing"
      >
        <GripVertical size={15} />
      </button>
      <input
        value={row.label}
        onChange={(e) => updateDetailRow(row.id, 'label', e.target.value)}
        placeholder="Label"
        aria-label="Label"
        className="w-24 min-w-0 rounded-lg bg-ink-800 px-2 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-200 placeholder-ink-500 focus:outline-none focus:ring-1 focus:ring-stamp/50"
      />
      <input
        value={row.value}
        onChange={(e) => updateDetailRow(row.id, 'value', e.target.value)}
        placeholder="Value"
        aria-label="Value"
        className="min-w-0 flex-1 rounded-lg bg-ink-800 px-2 py-1.5 text-xs text-ink-100 placeholder-ink-500 focus:outline-none focus:ring-1 focus:ring-stamp/50"
      />
      <button
        type="button"
        onClick={() => removeDetailRow(row.id)}
        aria-label="Remove row"
        className="rounded-md p-1 text-ink-500 transition-colors hover:bg-ink-750 hover:text-stamp"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function DetailsTab() {
  const { detailRows, showDetailGrid, addDetailRow, reorderDetailRows, set } = usePoster()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const from = detailRows.findIndex((r) => r.id === active.id)
    const to = detailRows.findIndex((r) => r.id === over.id)
    reorderDetailRows(arrayMove(detailRows, from, to))
  }

  return (
    <div className="flex flex-col gap-4 pt-3">
      <Toggle label="Show detail grid" value={showDetailGrid} onChange={(v) => set({ showDetailGrid: v })} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={detailRows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className={`flex flex-col gap-2 transition-opacity ${showDetailGrid ? '' : 'opacity-40'}`}>
            <AnimatePresence initial={false}>
              {detailRows.map((row) => <SortableRow key={row.id} row={row} />)}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>
      {detailRows.length < MAX_DETAIL_ROWS ? (
        <Button variant="dashed" icon={Plus} onClick={addDetailRow}>Add row</Button>
      ) : (
        <p className="text-center text-xs text-ink-500">Maximum of {MAX_DETAIL_ROWS} rows reached</p>
      )}
    </div>
  )
}
