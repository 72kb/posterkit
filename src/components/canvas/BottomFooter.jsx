import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'
import HideableDivider from './HideableDivider'
import { hexToRgba } from '../../lib/colorUtils'

export default function BottomFooter() {
  const {
    nameStamp, showNameStamp, tagline, showTagline, tracklist, showTracklist,
    photoCredit, photoLocation, showPhotoCredit, showPhotoLocation,
    displayFont, bodyFont, accentColor, textColor,
    showDivider, dividerOpacity, set,
  } = usePosterStore()

  return (
    <div style={{ padding: '6px 20px 14px', flexShrink: 0, marginTop: 'auto' }}>
      {showDivider && (
        <HideableDivider
          style={{ backgroundColor: hexToRgba(textColor, dividerOpacity), marginBottom: 8 }}
          onHide={() => set({ showDivider: false })}
        />
      )}

      {showNameStamp && (
        <EditableText
          value={nameStamp}
          onChange={(v) => set({ nameStamp: v })}
          onHide={() => set({ showNameStamp: false })}
          style={{
            fontFamily: `'${displayFont}', Impact, sans-serif`,
            fontSize: 64,
            lineHeight: 0.9,
            letterSpacing: '0.02em',
            color: accentColor,
            marginBottom: 4,
          }}
        />
      )}

      {showTagline && (
        <EditableText
          value={tagline}
          onChange={(v) => set({ tagline: v })}
          onHide={() => set({ showTagline: false })}
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 7.5,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: hexToRgba(textColor, 0.45),
            marginBottom: 8,
          }}
        />
      )}

      {showTracklist && (
        <EditableText
          value={tracklist}
          onChange={(v) => set({ tracklist: v })}
          onHide={() => set({ showTracklist: false })}
          multiline
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 7,
            color: hexToRgba(textColor, 0.22),
            letterSpacing: '0.06em',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            marginBottom: 6,
          }}
        />
      )}

      {showPhotoCredit && (
        <div>
          <EditableText
            value={photoCredit}
            onChange={(v) => set({ photoCredit: v })}
            onHide={() => set({ showPhotoCredit: false })}
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 7,
              color: hexToRgba(textColor, 0.3),
              letterSpacing: '0.06em',
            }}
          />
          {showPhotoLocation && (
            <EditableText
              value={photoLocation}
              onChange={(v) => set({ photoLocation: v })}
              onHide={() => set({ showPhotoLocation: false })}
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontSize: 7,
                color: hexToRgba(textColor, 0.3),
                letterSpacing: '0.06em',
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
