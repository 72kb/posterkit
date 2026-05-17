import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import usePosterStore from '../../../store/posterStore'
import Toggle from '../../ui/Toggle'
import Button from '../../ui/Button'

function SortableRow({ row }) {
  const { updateDetailRow, removeDetailRow } = usePosterStore()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-neutral-800 rounded p-2">
      <button
        {...attributes}
        {...listeners}
        className="text-neutral-600 hover:text-neutral-400 cursor-grab active:cursor-grabbing text-sm px-1"
      >
        ⠿
      </button>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <input
          type="text"
          value={row.label}
          onChange={(e) => updateDetailRow(row.id, 'label', e.target.value)}
          placeholder="Label"
          className="w-full bg-neutral-700 rounded px-2 py-1 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none"
        />
        <input
          type="text"
          value={row.value}
          onChange={(e) => updateDetailRow(row.id, 'value', e.target.value)}
          placeholder="Value"
          className="w-full bg-neutral-700 rounded px-2 py-1 text-xs text-white placeholder-neutral-600 focus:outline-none"
        />
      </div>
      <button
        onClick={() => removeDetailRow(row.id)}
        className="text-neutral-600 hover:text-red-400 text-sm px-1 flex-shrink-0"
      >
        ✕
      </button>
    </div>
  )
}

export default function DetailsTab() {
  const { detailRows, showDetailGrid, addDetailRow, reorderDetailRows, set } = usePosterStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = detailRows.findIndex((r) => r.id === active.id)
      const newIndex = detailRows.findIndex((r) => r.id === over.id)
      reorderDetailRows(arrayMove(detailRows, oldIndex, newIndex))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Toggle label="Show detail grid" value={showDetailGrid} onChange={(v) => set({ showDetailGrid: v })} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={detailRows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {detailRows.map((row) => (
              <SortableRow key={row.id} row={row} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {detailRows.length < 6 && (
        <Button variant="ghost" onClick={addDetailRow}>+ Add row</Button>
      )}
      {detailRows.length >= 6 && (
        <p className="text-xs text-neutral-600">Max 6 rows reached</p>
      )}
    </div>
  )
}
