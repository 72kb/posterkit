import { forwardRef } from 'react'
import { usePoster } from '../../store/usePoster'
import { hexToRgba } from '../../lib/colorUtils'
import { posterSize } from '../../lib/dimensions'
import TopBar from './TopBar'
import PhotoArea from './PhotoArea'
import PhotoBackdrop from './PhotoBackdrop'
import MidCaption from './MidCaption'
import DetailGrid from './DetailGrid'
import BottomFooter from './BottomFooter'
import EditableText from './EditableText'
import AnnotatedCanvas from './AnnotatedCanvas'
import MagazineCanvas from './MagazineCanvas'

/**
 * The poster itself — a fixed-pixel element (export depends on exact size).
 * Scale it with a CSS transform on a wrapper, never by resizing this node.
 */
const PosterCanvas = forwardRef(function PosterCanvas(_, ref) {
  const posterStyle = usePoster((s) => s.posterStyle)
  const orientation = usePoster((s) => s.orientation)
  const bgColor = usePoster((s) => s.bgColor)
  const { width, height } = posterSize({ posterStyle, orientation })
  const isPortrait = orientation === 'portrait'

  return (
    <div
      ref={ref}
      className="poster-root"
      style={{
        width,
        height,
        backgroundColor: bgColor || '#0d0d0d',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {posterStyle === 'annotated'
        ? <AnnotatedCanvas />
        : posterStyle === 'magazine'
          ? <MagazineCanvas />
          : isPortrait ? <PortraitLayout /> : <LandscapeLayout />}
    </div>
  )
})

function PortraitLayout() {
  const { photoHeightPercent, portraitStyle } = usePoster()
  if (portraitStyle === 'transparent') return <TransparentPortraitLayout />
  if (portraitStyle === 'compact')     return <CompactStoryLayout />
  return (
    <>
      <TopBar />
      <PhotoArea height={`${photoHeightPercent}%`} />
      <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <MidCaption />
        <DetailGrid />
        <BottomFooter />
      </div>
    </>
  )
}

function TransparentPortraitLayout() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <PhotoBackdrop />
      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <TopBar />
        <div>
          <MidCaption />
          <DetailGrid />
          <BottomFooter />
        </div>
      </div>
    </div>
  )
}

const COMPACT_POSITIONS = {
  'top-left':      { top: 28, left: 24 },
  'top-center':    { top: 28, left: '50%', transform: 'translateX(-50%)' },
  'top-right':     { top: 28, right: 24 },
  'mid-left':      { top: '50%', left: 24, transform: 'translateY(-50%)' },
  'center':        { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  'mid-right':     { top: '50%', right: 24, transform: 'translateY(-50%)' },
  'bottom-left':   { bottom: 28, left: 24 },
  'bottom-center': { bottom: 28, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right':  { bottom: 28, right: 24 },
}

const COMPACT_ALIGN = {
  'top-left': 'left', 'mid-left': 'left', 'bottom-left': 'left',
  'top-center': 'center', 'center': 'center', 'bottom-center': 'center',
  'top-right': 'right', 'mid-right': 'right', 'bottom-right': 'right',
}

function CompactStoryLayout() {
  const {
    bgColor,
    subjectTitle, showSubjectTitle, captionText, showCaption, photoCredit, photoLocation, showPhotoCredit, showPhotoLocation,
    displayFont, bodyFont, textColor,
    compactPosition,
    set,
  } = usePoster()

  const pos = COMPACT_POSITIONS[compactPosition] || COMPACT_POSITIONS['bottom-left']
  const textAlign = COMPACT_ALIGN[compactPosition] || 'left'

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <PhotoBackdrop vignette="soft" placeholderBg={bgColor || '#1a1a1a'} />

      {/* Floating text block */}
      <div style={{
        position: 'absolute',
        maxWidth: 340,
        textAlign,
        ...pos,
      }}>
        {showSubjectTitle && (
          <EditableText
            value={subjectTitle}
            onChange={(v) => set({ subjectTitle: v })}
            onHide={() => set({ showSubjectTitle: false })}
            style={{
              fontFamily: `'${displayFont}', Impact, sans-serif`,
              fontSize: 30,
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              color: textColor,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
              display: 'block',
              marginBottom: captionText ? 6 : 10,
            }}
          />
        )}
        {showCaption && (
          <EditableText
            value={captionText}
            onChange={(v) => set({ captionText: v })}
            onHide={() => set({ showCaption: false })}
            multiline
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 8.5,
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: hexToRgba(textColor, 0.65),
              whiteSpace: 'pre-wrap',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              display: 'block',
              marginBottom: 10,
            }}
          />
        )}
        <div style={{ height: '0.5px', backgroundColor: hexToRgba(textColor, 0.25), marginBottom: 8 }} />
        {showPhotoCredit && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: textAlign === 'right' ? 'flex-end' : textAlign === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
            <EditableText
              value={photoCredit}
              onChange={(v) => set({ photoCredit: v })}
              onHide={() => set({ showPhotoCredit: false })}
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontSize: 7,
                letterSpacing: '0.06em',
                color: hexToRgba(textColor, 0.45),
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}
            />
            {showPhotoLocation && photoLocation && (
              <>
                <span style={{ color: hexToRgba(textColor, 0.2), fontSize: 7, lineHeight: 1 }}>·</span>
                <EditableText
                  value={photoLocation}
                  onChange={(v) => set({ photoLocation: v })}
                  onHide={() => set({ showPhotoLocation: false })}
                  style={{
                    fontFamily: `'${bodyFont}', sans-serif`,
                    fontSize: 7,
                    letterSpacing: '0.06em',
                    color: hexToRgba(textColor, 0.45),
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function LandscapeLayout() {
  const {
    nameStamp, showNameStamp, tagline, showTagline, tracklist, showTracklist,
    photoCredit, photoLocation, showPhotoCredit, showPhotoLocation,
    displayFont, bodyFont, accentColor, textColor,
    detailRows, showDetailGrid, showDivider, dividerOpacity,
    captionText, showCaption,
    set, updateDetailRow, removeDetailRow,
  } = usePoster()

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <PhotoBackdrop />

      {/* Content overlay */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top bar — reuses shared component (already has EditableText) */}
        <TopBar />

        {/* Bottom two-column section */}
        <div style={{ display: 'flex', padding: '0 24px 16px', gap: 24 }}>

          {/* Left col: caption + details + tracklist */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6 }}>
            {showCaption && (
              <EditableText
                value={captionText}
                onChange={(v) => set({ captionText: v })}
                onHide={() => set({ showCaption: false })}
                multiline
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`, fontSize: 9, fontStyle: 'italic',
                  color: hexToRgba(textColor, 0.55), lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}
              />
            )}

            {showDetailGrid && detailRows.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {detailRows.map((row) => (
                  <div key={row.id} style={{ display: 'flex', gap: 8 }}>
                    <EditableText
                      value={row.label}
                      onChange={(v) => updateDetailRow(row.id, 'label', v)}
                      onHide={() => removeDetailRow(row.id)}
                      style={{
                        fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7.5, fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, minWidth: 52,
                      }}
                    />
                    <EditableText
                      value={row.value}
                      onChange={(v) => updateDetailRow(row.id, 'value', v)}
                      onHide={() => removeDetailRow(row.id)}
                      style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7.5, color: hexToRgba(textColor, 0.7) }}
                    />
                  </div>
                ))}
              </div>
            )}

            {showTracklist && (
              <EditableText
                value={tracklist}
                onChange={(v) => set({ tracklist: v })}
                onHide={() => set({ showTracklist: false })}
                multiline
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7, color: hexToRgba(textColor, 0.22),
                  letterSpacing: '0.06em', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}
              />
            )}
          </div>

          {/* Right col: name stamp + tagline + credit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', minWidth: 200 }}>
            {showDivider && (
              <div style={{ height: '0.5px', backgroundColor: hexToRgba(textColor, dividerOpacity), width: '100%', marginBottom: 6 }} />
            )}
            {showNameStamp && (
              <EditableText
                value={nameStamp}
                onChange={(v) => set({ nameStamp: v })}
                onHide={() => set({ showNameStamp: false })}
                style={{
                  fontFamily: `'${displayFont}', Impact, sans-serif`, fontSize: 72,
                  lineHeight: 0.9, color: accentColor, textAlign: 'right',
                }}
              />
            )}
            {showTagline && (
              <EditableText
                value={tagline}
                onChange={(v) => set({ tagline: v })}
                onHide={() => set({ showTagline: false })}
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7.5, textTransform: 'uppercase',
                  letterSpacing: '0.18em', color: hexToRgba(textColor, 0.45), marginTop: 4, textAlign: 'right',
                }}
              />
            )}
            {showPhotoCredit && (
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <EditableText
                  value={photoCredit}
                  onChange={(v) => set({ photoCredit: v })}
                  onHide={() => set({ showPhotoCredit: false })}
                  style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7, color: hexToRgba(textColor, 0.3), letterSpacing: '0.06em' }}
                />
                {showPhotoLocation && (
                  <EditableText
                    value={photoLocation}
                    onChange={(v) => set({ photoLocation: v })}
                    onHide={() => set({ showPhotoLocation: false })}
                    style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7, color: hexToRgba(textColor, 0.3), letterSpacing: '0.06em' }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PosterCanvas
