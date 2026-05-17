import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'

export default function BottomFooter() {
  const {
    nameStamp, tagline, tracklist, photoCredit, photoLocation,
    showPhotoCredit, displayFont, bodyFont, accentColor,
    showDivider, dividerOpacity, set,
  } = usePosterStore()

  return (
    <div style={{ padding: '6px 20px 14px', flexShrink: 0, marginTop: 'auto' }}>
      {showDivider && (
        <div style={{
          height: '0.5px',
          backgroundColor: `rgba(255,255,255,${dividerOpacity})`,
          marginBottom: 8,
        }} />
      )}

      <EditableText
        value={nameStamp}
        onChange={(v) => set({ nameStamp: v })}
        style={{
          fontFamily: `'${displayFont}', Impact, sans-serif`,
          fontSize: 64,
          lineHeight: 0.9,
          letterSpacing: '0.02em',
          color: accentColor,
          marginBottom: 4,
        }}
      />

      <EditableText
        value={tagline}
        onChange={(v) => set({ tagline: v })}
        style={{
          fontFamily: `'${bodyFont}', sans-serif`,
          fontSize: 7.5,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.45)',
          marginBottom: 8,
        }}
      />

      <EditableText
        value={tracklist}
        onChange={(v) => set({ tracklist: v })}
        multiline
        style={{
          fontFamily: `'${bodyFont}', sans-serif`,
          fontSize: 7,
          color: 'rgba(255,255,255,0.22)',
          letterSpacing: '0.06em',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          marginBottom: 6,
        }}
      />

      {showPhotoCredit && (
        <>
          <EditableText
            value={photoCredit}
            onChange={(v) => set({ photoCredit: v })}
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 7,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.06em',
            }}
          />
          <EditableText
            value={photoLocation}
            onChange={(v) => set({ photoLocation: v })}
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 7,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.06em',
            }}
          />
        </>
      )}
    </div>
  )
}
