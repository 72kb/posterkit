import { MAG_TEMPLATES } from '../../../lib/magTemplates'
import { DISPLAY_FONTS, BODY_FONTS, SERIF_FONTS, loadFont } from '../../../lib/fonts'

const ALL_FONTS = [...DISPLAY_FONTS, ...BODY_FONTS, ...SERIF_FONTS]
import usePosterStore from '../../../store/posterStore'

export default function MagTemplatesTab() {
  const { set } = usePosterStore()

  const applyTemplate = async (t) => {
    const dFont = ALL_FONTS.find((f) => f.name === t.template.displayFont)
    const bFont = ALL_FONTS.find((f) => f.name === t.template.bodyFont)
    await Promise.all([
      dFont ? loadFont(dFont.url) : Promise.resolve(),
      bFont ? loadFont(bFont.url) : Promise.resolve(),
    ])
    set(t.template)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {MAG_TEMPLATES.filter((t) => ['forbes', 'the-times', 'vogue'].includes(t.id)).map((t) => (
          <button
            key={t.id}
            onClick={() => applyTemplate(t)}
            className="flex flex-col rounded overflow-hidden border border-neutral-800 hover:border-neutral-500 transition-colors text-left group"
          >
            {/* Mini magazine cover preview */}
            <div
              className="w-full h-20 relative overflow-hidden flex-shrink-0"
              style={{ backgroundColor: t.template.bgColor || '#0d0d0d' }}
            >
              {/* Top: masthead + rule */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                padding: '5px 7px 0',
              }}>
                <div style={{
                  fontFamily: `'${t.template.displayFont}', Impact, sans-serif`,
                  fontSize: 14, lineHeight: 1,
                  color: '#ffffff',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}>
                  {t.template.magTitle}
                </div>
                <div style={{
                  height: 1.5, backgroundColor: t.template.accentColor,
                  marginTop: 3, width: '100%',
                }} />
              </div>

              {/* Bottom: cover line + palette */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '0 7px 5px',
              }}>
                <div style={{
                  fontFamily: `'${t.template.displayFont}', Impact, sans-serif`,
                  fontSize: 11, lineHeight: 1,
                  color: '#ffffff', marginBottom: 4,
                }}>
                  COVER STORY
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {t.palette.slice(0, 5).map((color, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: color,
                      border: '0.5px solid rgba(255,255,255,0.1)',
                    }} />
                  ))}
                </div>
              </div>

              {/* Subtle vignette on preview */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Label */}
            <div className="px-2 py-1.5 bg-neutral-900 group-hover:bg-neutral-800 transition-colors">
              <div className="text-xs font-medium text-white">{t.name}</div>
              <div className="text-xs text-neutral-500">{t.vibe}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-neutral-600 leading-relaxed">
        Sets colors, fonts, and overlays. Your photo and cover text are preserved.
      </p>
    </div>
  )
}
