import { usePoster } from '../../store/usePoster'
import EditableText from './EditableText'
import PhotoBackdrop from './PhotoBackdrop'

const BAND_H = 70

export default function MagCircuitLayout() {
  const {
    bgColor, accentColor,
    displayFont, bodyFont,
    magTitle, magIssue,
    magSubjectName, magSubjectRole,
    magPullQuote,
    magMainLine, magMainSub,
    magCoverLines,
    set, updateMagCoverLine,
  } = usePoster()

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: bgColor || '#0d0a14', overflow: 'hidden' }}>

      <PhotoBackdrop
        vignette={false}
        placeholderBg={bgColor || '#1a0a2a'}
        after={['linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0) 40%)']}
      />

      {/* ── Masthead band — typeset wordmark on an accent band ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: BAND_H, overflow: 'hidden',
        backgroundColor: accentColor,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 14px 0 12px',
      }}>
        <EditableText
          value={magTitle}
          onChange={(v) => set({ magTitle: v })}
          style={{
            fontFamily: `'${displayFont}', 'Barlow Condensed', Impact, sans-serif`,
            fontSize: 78, fontWeight: 900, lineHeight: 0.8,
            color: '#ffffff', letterSpacing: '0.04em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}
        />
        <EditableText
          value={magIssue}
          onChange={(v) => set({ magIssue: v })}
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 7, color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            alignSelf: 'flex-end', marginBottom: 8, textAlign: 'right', maxWidth: 140,
          }}
        />
      </div>

      {/* ── Subject name + role (top-left, below band) ── */}
      <div style={{
        position: 'absolute', top: BAND_H + 12, left: 18,
        maxWidth: 210,
      }}>
        <EditableText
          value={magSubjectName}
          onChange={(v) => set({ magSubjectName: v })}
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 8, fontWeight: 700,
            color: '#ffffff', letterSpacing: '0.04em',
          }}
        />
        <EditableText
          value={magSubjectRole}
          onChange={(v) => set({ magSubjectRole: v })}
          multiline
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 7.5, color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.45, marginTop: 3,
            whiteSpace: 'pre-wrap',
          }}
        />
      </div>

      {/* ── Right stories with + separators ── */}
      {magCoverLines.length > 0 && (
        <div style={{
          position: 'absolute', top: BAND_H + 12, right: 18,
          maxWidth: 155,
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {magCoverLines.map((line, i) => (
            <div key={line.id}>
              {i > 0 && (
                <div style={{
                  fontFamily: `'${displayFont}', sans-serif`,
                  fontSize: 14, fontWeight: 900,
                  color: accentColor, lineHeight: 1,
                  margin: '5px 0',
                }}>+</div>
              )}
              <EditableText
                value={line.label}
                onChange={(v) => updateMagCoverLine(line.id, 'label', v)}
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`,
                  fontSize: 7.5, fontWeight: 700,
                  color: '#ffffff', letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              />
              <EditableText
                value={line.text}
                onChange={(v) => updateMagCoverLine(line.id, 'text', v)}
                multiline
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`,
                  fontSize: 7.5, color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.4, marginTop: 2,
                  whiteSpace: 'pre-wrap',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Pull quote — bold, all-caps, left-middle ── */}
      <div style={{
        position: 'absolute', left: 18, top: '38%',
        maxWidth: 290,
      }}>
        <EditableText
          value={magPullQuote}
          onChange={(v) => set({ magPullQuote: v })}
          multiline
          style={{
            fontFamily: `'${displayFont}', 'Barlow Condensed', Impact, sans-serif`,
            fontSize: 24, fontWeight: 900,
            color: '#ffffff', lineHeight: 1.12,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            whiteSpace: 'pre-wrap',
          }}
        />
      </div>

      {/* ── Bottom: massive headline + subtitle ── */}
      <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
        <EditableText
          value={magMainLine}
          onChange={(v) => set({ magMainLine: v })}
          style={{
            fontFamily: `'${displayFont}', 'Barlow Condensed', Impact, sans-serif`,
            fontSize: 100, fontWeight: 900,
            color: '#ffffff', lineHeight: 0.86,
            letterSpacing: '-0.01em',
          }}
        />
        {magMainSub && (
          <div style={{
            marginTop: 9,
            borderTop: `1.5px solid rgba(255,255,255,0.22)`,
            paddingTop: 7,
          }}>
            <EditableText
              value={magMainSub}
              onChange={(v) => set({ magMainSub: v })}
              multiline
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontSize: 9, fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.45, whiteSpace: 'pre-wrap',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
