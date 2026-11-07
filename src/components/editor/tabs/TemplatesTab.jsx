import { useDeferredValue, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { usePoster } from '../../../store/usePoster'
import { TEMPLATES, CATEGORIES } from '../../../lib/templates'
import { MAG_TEMPLATES } from '../../../lib/magTemplates'
import { styleOnly, STYLE_KEYS, TEMPLATE_SCENES } from '../../../lib/starters'
import { ensureDocFontsQuick } from '../../../lib/fonts'
import { serializeDoc } from '../../../store/posterStore'
import PosterPreview from '../../poster/PosterPreview'

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export default function TemplatesTab() {
  const state = usePoster()
  const applyTemplate = usePoster((s) => s.applyTemplate)
  const isMag = state.posterStyle === 'magazine'
  const [category, setCategory] = useState('All')

  // Previews show the user's own poster restyled — deferred so typing stays snappy.
  const doc = useDeferredValue(useMemo(() => serializeDoc(state), [state]))

  const list = isMag
    ? MAG_TEMPLATES
    : category === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category)

  const apply = async (t) => {
    const patch = styleOnly(t.template)
    await ensureDocFontsQuick({ ...state, ...patch })
    applyTemplate(patch)
  }

  const isActive = (t) => {
    const patch = styleOnly(t.template)
    return STYLE_KEYS.every((k) => patch[k] === undefined || same(patch[k], state[k]))
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      {!isMag && (
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors
                ${category === cat ? 'bg-ink-100 text-ink-950' : 'bg-ink-800 text-ink-400 hover:bg-ink-750 hover:text-ink-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {list.map((t, i) => {
          const active = isActive(t)
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => apply(t)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-colors
                ${active ? 'border-stamp shadow-glow' : 'border-ink-800 hover:border-ink-600'}`}
            >
              <div className="relative">
                <PosterPreview
                  doc={{ ...doc, ...styleOnly(t.template) }}
                  sample={doc.photoId ? undefined : TEMPLATE_SCENES[t.id]}
                />
                {active && (
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stamp text-white shadow">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 bg-ink-850 px-2.5 py-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium text-ink-100">{t.name}</div>
                  <div className="truncate text-[10px] text-ink-500">{t.vibe || t.category}</div>
                </div>
                <div className="flex flex-shrink-0 -space-x-1">
                  {t.palette.slice(0, 4).map((c, j) => (
                    <span key={j} className="h-3 w-3 rounded-full ring-1 ring-ink-850" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
