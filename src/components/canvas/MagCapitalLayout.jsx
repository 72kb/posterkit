import { usePoster } from '../../store/usePoster'
import EditableText from './EditableText'
import NewspaperColumns from './NewspaperColumns'
import PhotoBackdrop from './PhotoBackdrop'

export default function MagCapitalLayout() {
  const {
    bgColor, accentColor,
    displayFont, bodyFont,
    magTitle, magIssue,
    magMainLine, magMainSub,
    magTickerLines, magSpineText,
    magSubjectName, magSubjectRole, magPullQuote,
    magPlusLine, magFinePrint,
    magTemplateId, magColumnOpacity,
    set,
  } = usePoster()

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: bgColor || '#1a1a1a', overflow: 'hidden' }}>

      <PhotoBackdrop
        vignette={false}
        placeholderBg={bgColor || '#2a2a2a'}
        after={['linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 22%, rgba(0,0,0,0) 42%)']}
      >
        {magTemplateId === 'broadsheet' && magColumnOpacity > 0 && (
          <NewspaperColumns font={bodyFont} opacity={magColumnOpacity} />
        )}
      </PhotoBackdrop>

      {/* ── Top ticker strip ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 26,
        backgroundColor: 'rgba(10,10,10,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingLeft: 22,
      }}>
        <EditableText
          value={magTickerLines}
          onChange={(v) => set({ magTickerLines: v })}
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 6.5, letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.8)',
            textTransform: 'uppercase', textAlign: 'center',
          }}
        />
      </div>

      {/* ── Left spine ── */}
      <div style={{
        position: 'absolute', left: 0, top: 26, bottom: 0,
        width: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ writingMode: 'vertical-lr', fontSize: 6, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)', fontFamily: `'${bodyFont}', sans-serif`, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {magSpineText}
        </div>
      </div>

      {/* ── Masthead — centered, below ticker ── */}
      <div style={{
        position: 'absolute', top: 34, left: 14, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <EditableText
          value={magTitle}
          onChange={(v) => set({ magTitle: v })}
          style={{
            fontFamily: `'${displayFont}', Georgia, 'Times New Roman', serif`,
            fontSize: 92, lineHeight: 0.88,
            color: '#ffffff',
            textAlign: 'center',
          }}
        />
        <EditableText
          value={magIssue}
          onChange={(v) => set({ magIssue: v })}
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 7.5, letterSpacing: '0.24em',
            color: 'rgba(255,255,255,0.65)',
            textTransform: 'uppercase',
            marginTop: 5, textAlign: 'center',
          }}
        />
      </div>

      {/* ── Right floating block — subject name + pull quote ── */}
      <div style={{
        position: 'absolute', right: 22, top: '38%',
        maxWidth: 150, textAlign: 'right',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div>
          <EditableText
            value={magSubjectName}
            onChange={(v) => set({ magSubjectName: v })}
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 8, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#ffffff',
            }}
          />
          <EditableText
            value={magSubjectRole}
            onChange={(v) => set({ magSubjectRole: v })}
            multiline
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 7.5, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.5, whiteSpace: 'pre-wrap', marginTop: 2,
            }}
          />
        </div>
        <EditableText
          value={magPullQuote}
          onChange={(v) => set({ magPullQuote: v })}
          multiline
          style={{
            fontFamily: `'${displayFont}', Georgia, serif`,
            fontSize: 17, fontStyle: 'italic',
            color: '#ffffff', lineHeight: 1.25,
            whiteSpace: 'pre-wrap', textAlign: 'right',
          }}
        />
      </div>

      {/* ── Bottom-left — huge headline + subtitle + PLUS line ── */}
      <div style={{
        position: 'absolute',
        bottom: magFinePrint ? 28 : 18,
        left: 18,
        right: 24,
      }}>
        <EditableText
          value={magMainLine}
          onChange={(v) => set({ magMainLine: v })}
          multiline
          style={{
            fontFamily: `'${displayFont}', Georgia, 'Times New Roman', serif`,
            fontSize: 82, lineHeight: 0.86,
            color: '#ffffff', fontWeight: 900,
            whiteSpace: 'pre-wrap',
          }}
        />
        <EditableText
          value={magMainSub}
          onChange={(v) => set({ magMainSub: v })}
          multiline
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 8, fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.88)',
            marginTop: 9, lineHeight: 1.45,
            whiteSpace: 'pre-wrap',
          }}
        />
        {magPlusLine && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 5 }}>
            <span style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 8, fontWeight: 900,
              color: accentColor, letterSpacing: '0.1em',
              flexShrink: 0,
            }}>PLUS</span>
            <EditableText
              value={magPlusLine}
              onChange={(v) => set({ magPlusLine: v })}
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontSize: 8, color: 'rgba(255,255,255,0.82)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}
            />
          </div>
        )}
      </div>

      {/* ── Fine print strip ── */}
      {magFinePrint && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          padding: '4px 14px',
        }}>
          <EditableText
            value={magFinePrint}
            onChange={(v) => set({ magFinePrint: v })}
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 5.5, color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.04em',
            }}
          />
        </div>
      )}
    </div>
  )
}
