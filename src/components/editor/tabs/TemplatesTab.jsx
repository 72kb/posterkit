import { useState } from 'react'
import { TEMPLATES, CATEGORIES } from '../../../lib/templates'
import { DISPLAY_FONTS, BODY_FONTS, loadFont } from '../../../lib/fonts'
import usePosterStore from '../../../store/posterStore'

export default function TemplatesTab() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { set } = usePosterStore()

  const filtered = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory)

  const applyTemplate = async (template) => {
    // Pre-load fonts before applying so the poster updates instantly
    const dFont = DISPLAY_FONTS.find((f) => f.name === template.template.displayFont)
    const bFont = BODY_FONTS.find((f) => f.name === template.template.bodyFont)
    await Promise.all([
      dFont ? loadFont(dFont.url) : Promise.resolve(),
      bFont ? loadFont(bFont.url) : Promise.resolve(),
    ])
    set(template.template)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors
              ${activeCategory === cat
                ? 'bg-white text-black font-medium'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => applyTemplate(t)}
            className="flex flex-col rounded overflow-hidden border border-neutral-800 hover:border-neutral-500 transition-colors text-left group"
          >
            {/* Color palette preview */}
            <div
              className="w-full h-16 flex-shrink-0 relative"
              style={{ backgroundColor: t.template.bgColor }}
            >
              {/* Simulated name stamp */}
              <div style={{
                position: 'absolute',
                bottom: 6,
                left: 8,
                fontFamily: `'${t.template.displayFont}', Impact, sans-serif`,
                fontSize: 22,
                lineHeight: 1,
                color: t.template.accentColor,
                letterSpacing: '0.02em',
              }}>
                NAME
              </div>
              {/* Palette dots */}
              <div style={{
                position: 'absolute',
                top: 6,
                left: 8,
                display: 'flex',
                gap: 3,
              }}>
                {t.palette.slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '0.5px solid rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
              {/* Accent line */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: t.template.accentColor,
                opacity: 0.6,
              }} />
            </div>

            {/* Label */}
            <div className="px-2 py-1.5 bg-neutral-900 group-hover:bg-neutral-800 transition-colors">
              <div className="text-xs font-medium text-white">{t.name}</div>
              <div className="text-xs text-neutral-500">{t.category}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-neutral-600 leading-relaxed">
        Templates set colors, fonts, and overlays. Your text and photo are preserved.
      </p>
    </div>
  )
}
