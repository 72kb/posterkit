import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

export default function MagVogueLayout() {
  const {
    photoUrl, photoPosition, photoScale, bgColor,
    tintColor, tintOpacity, grainOpacity, accentColor,
    displayFont, bodyFont,
    magTitle, magIssue, magSpineText,
    magSubjectName, magPullQuote,
    magMainLine, magCoverLines, magFinePrint,
    set, updateMagCoverLine,
  } = usePosterStore()

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: bgColor || '#0d0d0d', overflow: 'hidden' }}>

      {/* ── Photo — full bleed ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: photoUrl ? `url(${photoUrl})` : 'none',
        backgroundColor: photoUrl ? 'transparent' : (bgColor || '#1a1a1a'),
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

      {/* ── Overlays ── */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: tintColor, opacity: tintOpacity, mixBlendMode: 'multiply' }} />
      {/* Subtle top fade — masthead legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%)', pointerEvents: 'none' }} />
      {/* Bottom gradient — cover story legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.22) 28%, rgba(0,0,0,0) 46%)', pointerEvents: 'none' }} />
      {grainOpacity > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: grainOpacity, backgroundImage: GRAIN_SVG, backgroundRepeat: 'repeat', backgroundSize: '128px', mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      )}

      {/* ── Masthead ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {/* Edition + issue line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '14px 20px 0' }}>
          <EditableText
            value={magSpineText}
            onChange={(v) => set({ magSpineText: v })}
            style={{
              fontFamily: `'${bodyFont}', serif`,
              fontSize: 7.5, letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.65)',
              textTransform: 'uppercase',
            }}
          />
          <EditableText
            value={magIssue}
            onChange={(v) => set({ magIssue: v })}
            style={{
              fontFamily: `'${bodyFont}', serif`,
              fontSize: 7.5, letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.65)',
              textTransform: 'uppercase', textAlign: 'right',
            }}
          />
        </div>

        {/* VOGUE wordmark */}
        <div style={{ padding: '0 14px', marginTop: 1, textAlign: 'center' }}>
          <EditableText
            value={magTitle}
            onChange={(v) => set({ magTitle: v })}
            style={{
              fontFamily: `'${displayFont}', 'Bodoni MT', 'Didot', Georgia, serif`,
              fontSize: 116, lineHeight: 0.84,
              color: accentColor,
              letterSpacing: '0.06em',
              display: 'block', textAlign: 'center',
            }}
          />
        </div>

        {/* Rule below masthead */}
        <div style={{ height: 1, backgroundColor: accentColor, opacity: 0.4, margin: '5px 20px 0' }} />
      </div>

      {/* ── Left floating: subject name + pull quote ── */}
      <div style={{
        position: 'absolute', left: 20, top: '38%',
        maxWidth: 200,
      }}>
        <EditableText
          value={magSubjectName}
          onChange={(v) => set({ magSubjectName: v })}
          style={{
            fontFamily: `'${bodyFont}', serif`,
            fontSize: 20, fontStyle: 'italic',
            color: '#ffffff', lineHeight: 1.2,
          }}
        />
        <EditableText
          value={magPullQuote}
          onChange={(v) => set({ magPullQuote: v })}
          multiline
          style={{
            fontFamily: `'${bodyFont}', serif`,
            fontSize: 10, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.55, marginTop: 7,
            whiteSpace: 'pre-wrap',
          }}
        />
      </div>

      {/* ── Right floating: cover lines ── */}
      {magCoverLines.length > 0 && (
        <div style={{
          position: 'absolute', right: 20, top: '30%',
          maxWidth: 160,
          display: 'flex', flexDirection: 'column', gap: 13,
        }}>
          {magCoverLines.map((line) => (
            <div key={line.id} style={{ textAlign: 'right' }}>
              <EditableText
                value={line.label}
                onChange={(v) => updateMagCoverLine(line.id, 'label', v)}
                style={{
                  fontFamily: `'${bodyFont}', serif`,
                  fontSize: 8.5, fontWeight: 700,
                  color: accentColor,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                }}
              />
              <EditableText
                value={line.text}
                onChange={(v) => updateMagCoverLine(line.id, 'text', v)}
                multiline
                style={{
                  fontFamily: `'${bodyFont}', serif`,
                  fontSize: 7.5, color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.45, marginTop: 2,
                  whiteSpace: 'pre-wrap',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom: cover story title ── */}
      <div style={{
        position: 'absolute',
        bottom: magFinePrint ? 28 : 20,
        left: 20, right: 20,
      }}>
        <EditableText
          value={magMainLine}
          onChange={(v) => set({ magMainLine: v })}
          multiline
          style={{
            fontFamily: `'${displayFont}', 'Bodoni MT', Georgia, serif`,
            fontSize: 52, fontStyle: 'italic',
            lineHeight: 0.9, color: '#ffffff',
            whiteSpace: 'pre-wrap',
          }}
        />
      </div>

      {/* ── Fine print names strip ── */}
      {magFinePrint && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          padding: '4px 20px',
        }}>
          <EditableText
            value={magFinePrint}
            onChange={(v) => set({ magFinePrint: v })}
            style={{
              fontFamily: `'${bodyFont}', serif`,
              fontSize: 5.8, color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textAlign: 'center',
            }}
          />
        </div>
      )}
    </div>
  )
}
