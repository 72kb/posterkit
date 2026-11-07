import Modal from '../ui/Modal'
import Kbd from '../ui/Kbd'
import { MOD } from '../../hooks/useShortcuts'

const GROUPS = [
  {
    title: 'General',
    items: [
      [[MOD, 'Z'], 'Undo'],
      [[MOD, '⇧', 'Z'], 'Redo'],
      [[MOD, 'S'], 'Save now'],
      [[MOD, 'E'], 'Export PNG'],
      [['?'], 'Show shortcuts'],
    ],
  },
  {
    title: 'Canvas',
    items: [
      [['Click'], 'Select text'],
      [['Enter'], 'Edit selected text'],
      [['Del'], 'Hide selected element'],
      [['Esc'], 'Deselect / finish editing'],
      [['Drop'], 'Drop an image to replace the photo'],
    ],
  },
  {
    title: 'View',
    items: [
      [[MOD, '+'], 'Zoom in'],
      [[MOD, '−'], 'Zoom out'],
      [[MOD, '0'], 'Fit to screen'],
    ],
  },
]

export default function ShortcutsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard shortcuts" width="max-w-lg">
      <div className="grid gap-6 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <div key={g.title} className={g.title === 'Canvas' ? 'sm:row-span-2' : ''}>
            <div className="label-xs mb-2">{g.title}</div>
            <ul className="flex flex-col gap-2">
              {g.items.map(([keys, label]) => (
                <li key={label} className="flex items-center justify-between gap-4 text-[13px] text-ink-300">
                  <span>{label}</span>
                  <span className="flex gap-1">{keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  )
}
