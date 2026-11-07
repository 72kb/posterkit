import { usePoster } from '../../store/usePoster'
import EditableText from './EditableText'
import NewspaperColumns from './NewspaperColumns'
import PhotoBackdrop from './PhotoBackdrop'

export default function MagStandardLayout() {
  const {
    bgColor,
    displayFont, bodyFont, accentColor,
    magTitle, magIssue, magMainLine, magMainSub, magCoverLines,
    magTemplateId, magColumnOpacity,
    set, updateMagCoverLine,
  } = usePoster()


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <PhotoBackdrop
        placeholderBg={bgColor || '#1a1a1a'}
        before={['linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 38%)']}
        after={['linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 52%)']}
      >
        {magTemplateId === 'broadsheet' && magColumnOpacity > 0 && (
          <NewspaperColumns font={bodyFont} opacity={magColumnOpacity} />
        )}
      </PhotoBackdrop>

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
