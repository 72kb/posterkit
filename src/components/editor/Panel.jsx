import { AnimatePresence, motion } from 'motion/react'
import { FileText, Newspaper, PenLine } from 'lucide-react'
import { usePoster } from '../../store/usePoster'
import { loadFontByName } from '../../lib/fonts'
import { selection } from '../../lib/selection'
import Segmented from '../ui/Segmented'
import { TAB_COMPONENTS, TAB_META } from './tabs/registry'

const FORMATS = [
  { value: 'editorial', label: 'Editorial', icon: FileText },
  { value: 'magazine', label: 'Magazine', icon: Newspaper },
  { value: 'annotated', label: 'Annotated', icon: PenLine },
]

export default function Panel({ tab, ctx }) {
  const posterStyle = usePoster((s) => s.posterStyle)
  const annotationFont = usePoster((s) => s.annotationFont)
  const set = usePoster((s) => s.set)
  const TabComponent = TAB_COMPONENTS[tab]
  const meta = TAB_META[tab]

  const switchFormat = async (format) => {
    if (format === posterStyle) return
    selection.clear()
    if (format === 'annotated') await loadFontByName(annotationFont)
    set({ posterStyle: format })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b border-ink-800 px-4 pb-3 pt-3">
        <Segmented value={posterStyle} onChange={switchFormat} options={FORMATS} size="sm" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${tab}-${posterStyle}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="px-4 pb-10 pt-4"
          >
            {meta && (
              <div className="mb-2">
                <h2 className="font-serif text-[26px] leading-none text-ink-100">{meta.title}</h2>
                {meta.blurb && <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{meta.blurb}</p>}
              </div>
            )}
            {TabComponent && <TabComponent ctx={ctx} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
