import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

const BAND_H = 70

export default function MagWiredLayout() {
  const {
    photoUrl, photoPosition, photoScale, bgColor,
    tintColor, tintOpacity, grainOpacity, accentColor,
    displayFont, bodyFont,
    magTitle, magIssue,
    magSubjectName, magSubjectRole,
    magPullQuote,
    magMainLine, magMainSub,
    magCoverLines,
    set, updateMagCoverLine,
  } = usePosterStore()

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: bgColor || '#0d0a14', overflow: 'hidden' }}>

      {/* ── Photo — full bleed ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: photoUrl ? `url(${photoUrl})` : 'none',
        backgroundColor: photoUrl ? 'transparent' : (bgColor || '#1a0a2a'),
        backgroundSize: `${photoScale}%`,
        backgroundPosition: photoPosition,
        backgroundRepeat: 'no-repeat',
      }} />
      {!photoUrl && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.12)', fontSize: 13, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>Upload a photo</div>
      )}

      {/* ── Tint ── */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: tintColor, opacity: tintOpacity, mixBlendMode: 'multiply' }} />

      {/* ── Bottom gradient — headline legibility ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0) 40%)',
        pointerEvents: 'none',
      }} />

      {/* ── Grain ── */}
      {grainOpacity > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: grainOpacity, backgroundImage: GRAIN_SVG, backgroundRepeat: 'repeat', backgroundSize: '128px', mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      )}

      {/* ── Masthead band — WIRED logo fills full width ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: BAND_H,
        overflow: 'hidden',
      }}>
        <img
          src="/wired-logo.png"
          alt="WIRED"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
            pointerEvents: 'none', userSelect: 'none',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
          padding: '0 10px 7px',
        }}>
          <EditableText
            value={magIssue}
            onChange={(v) => set({ magIssue: v })}
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 7, color: 'rgba(0,0,0,0.5)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}
          />
        </div>
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
