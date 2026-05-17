import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'
import NewspaperColumns from './NewspaperColumns'

export default function MagStandardLayout() {
  const {
    photoUrl, photoPosition, photoScale, bgColor,
    tintColor, tintOpacity, vignetteIntensity, vignetteDirection, grainOpacity,
    displayFont, bodyFont, accentColor,
    magTitle, magIssue, magMainLine, magMainSub, magCoverLines,
    magTemplateId, magColumnOpacity,
    set, updateMagCoverLine,
  } = usePosterStore()

  const vignetteGradient = {
    bottom: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
    top: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
    edges: `radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
    left: `linear-gradient(to right, rgba(0,0,0,${vignetteIntensity}) 0%, rgba(0,0,0,0) 50%)`,
    right: `linear-gradient(to left, rgba(0,0,0,${vignetteIntensity}) 0%, rgba(0,0,0,0) 50%)`,
  }[vignetteDirection] || ''

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
          color: 'rgba(255,255,255,0.15)', fontSize: 13, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>Upload a photo</div>
      )}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: tintColor, opacity: tintOpacity, mixBlendMode: 'multiply' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 38%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: vignetteGradient, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 52%)', pointerEvents: 'none' }} />
      {magTemplateId === 'the-times' && magColumnOpacity > 0 && (
        <NewspaperColumns font={bodyFont} opacity={magColumnOpacity} />
      )}

      {grainOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0, opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '128px', mixBlendMode: 'overlay', pointerEvents: 'none',
        }} />
      )}

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 22px 0', flexShrink: 0 }}>
          <EditableText value={magIssue} onChange={(v) => set({ magIssue: v })} style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7.5, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 3 }} />
          <EditableText value={magTitle} onChange={(v) => set({ magTitle: v })} style={{ fontFamily: `'${displayFont}', Impact, sans-serif`, fontSize: 64, lineHeight: 0.88, color: '#ffffff', letterSpacing: '0.03em' }} />
          <div style={{ height: 2.5, backgroundColor: accentColor, marginTop: 9, width: '100%' }} />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 22px 22px' }}>
          <EditableText value={magMainLine} onChange={(v) => set({ magMainLine: v })} style={{ fontFamily: `'${displayFont}', Impact, sans-serif`, fontSize: 40, lineHeight: 0.95, color: '#ffffff', marginBottom: 7 }} />
          <EditableText value={magMainSub} onChange={(v) => set({ magMainSub: v })} multiline style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 9.5, fontStyle: 'italic', color: 'rgba(255,255,255,0.62)', lineHeight: 1.55, marginBottom: 12, whiteSpace: 'pre-wrap' }} />
          {magCoverLines.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {magCoverLines.map((line) => (
                <div key={line.id} style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <EditableText value={line.label} onChange={(v) => updateMagCoverLine(line.id, 'label', v)} style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 6.5, fontWeight: 700, color: accentColor, letterSpacing: '0.16em', textTransform: 'uppercase', minWidth: 38, flexShrink: 0 }} />
                  <EditableText value={line.text} onChange={(v) => updateMagCoverLine(line.id, 'text', v)} style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 8, color: 'rgba(255,255,255,0.72)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
