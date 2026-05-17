import { forwardRef } from 'react'
import usePosterStore from '../../store/posterStore'
import TopBar from './TopBar'
import PhotoArea from './PhotoArea'
import MidCaption from './MidCaption'
import DetailGrid from './DetailGrid'
import BottomFooter from './BottomFooter'
import EditableText from './EditableText'
import AnnotatedCanvas from './AnnotatedCanvas'
import MagazineCanvas from './MagazineCanvas'

const PORTRAIT_W = 700
const PORTRAIT_H = 980
const LANDSCAPE_W = 1060
const LANDSCAPE_H = 700

const PosterCanvas = forwardRef(function PosterCanvas(_, ref) {
  const { orientation, bgColor, posterStyle } = usePosterStore()
  const isPortrait = orientation === 'portrait'
  const W = isPortrait ? PORTRAIT_W : LANDSCAPE_W
  const H = isPortrait ? PORTRAIT_H : LANDSCAPE_H

  return (
    <div
      ref={ref}
      style={{
        width: W,
        height: H,
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
        : isPortrait ? <PortraitLayout /> : <LandscapeLayout />
      }
    </div>
  )
})

function PortraitLayout() {
  const { photoHeightPercent } = usePosterStore()
  return (
    <>
      <TopBar />
      {/* Photo: fixed percentage of the canvas height */}
      <PhotoArea height={`${photoHeightPercent}%`} />
      {/* Bottom section: takes exactly the remaining space, never overflows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <MidCaption />
        <DetailGrid />
        <BottomFooter />
      </div>
    </>
  )
}

function LandscapeLayout() {
  const {
    nameStamp, tagline, tracklist, photoCredit, photoLocation,
    showPhotoCredit, displayFont, bodyFont, accentColor,
    detailRows, showDetailGrid, showDivider, dividerOpacity,
    captionText, photoUrl, photoPosition, photoScale,
    tintColor, tintOpacity, vignetteIntensity, vignetteDirection, grainOpacity,
    set, updateDetailRow,
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
      {/* Photo background layers */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: photoUrl ? `url(${photoUrl})` : 'none',
        backgroundColor: photoUrl ? 'transparent' : '#1a1a1a',
        backgroundSize: `${photoScale}%`,
        backgroundPosition: photoPosition,
        backgroundRepeat: 'no-repeat',
      }} />
      {!photoUrl && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.15)', fontSize: 13, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>
          Upload a photo
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: tintColor, opacity: tintOpacity, mixBlendMode: 'multiply' }} />
      <div style={{ position: 'absolute', inset: 0, background: vignetteGradient, pointerEvents: 'none' }} />
      {grainOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0, opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '128px', mixBlendMode: 'overlay', pointerEvents: 'none',
        }} />
      )}

      {/* Content overlay */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top bar — reuses shared component (already has EditableText) */}
        <TopBar />

        {/* Bottom two-column section */}
        <div style={{ display: 'flex', padding: '0 24px 16px', gap: 24 }}>

          {/* Left col: caption + details + tracklist */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6 }}>
            <EditableText
              value={captionText}
              onChange={(v) => set({ captionText: v })}
              multiline
              style={{
                fontFamily: `'${bodyFont}', sans-serif`, fontSize: 9, fontStyle: 'italic',
                color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, whiteSpace: 'pre-wrap',
              }}
            />

            {showDetailGrid && detailRows.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {detailRows.map((row) => (
                  <div key={row.id} style={{ display: 'flex', gap: 8 }}>
                    <EditableText
                      value={row.label}
                      onChange={(v) => updateDetailRow(row.id, 'label', v)}
                      style={{
                        fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7.5, fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, minWidth: 52,
                      }}
                    />
                    <EditableText
                      value={row.value}
                      onChange={(v) => updateDetailRow(row.id, 'value', v)}
                      style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7.5, color: 'rgba(255,255,255,0.7)' }}
                    />
                  </div>
                ))}
              </div>
            )}

            <EditableText
              value={tracklist}
              onChange={(v) => set({ tracklist: v })}
              multiline
              style={{
                fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7, color: 'rgba(255,255,255,0.22)',
                letterSpacing: '0.06em', lineHeight: 1.6, whiteSpace: 'pre-wrap',
              }}
            />
          </div>

          {/* Right col: name stamp + tagline + credit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', minWidth: 200 }}>
            {showDivider && (
              <div style={{ height: '0.5px', backgroundColor: `rgba(255,255,255,${dividerOpacity})`, width: '100%', marginBottom: 6 }} />
            )}
            <EditableText
              value={nameStamp}
              onChange={(v) => set({ nameStamp: v })}
              style={{
                fontFamily: `'${displayFont}', Impact, sans-serif`, fontSize: 72,
                lineHeight: 0.9, color: accentColor, textAlign: 'right',
              }}
            />
            <EditableText
              value={tagline}
              onChange={(v) => set({ tagline: v })}
              style={{
                fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7.5, textTransform: 'uppercase',
                letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginTop: 4, textAlign: 'right',
              }}
            />
            {showPhotoCredit && (
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <EditableText
                  value={photoCredit}
                  onChange={(v) => set({ photoCredit: v })}
                  style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}
                />
                <EditableText
                  value={photoLocation}
                  onChange={(v) => set({ photoLocation: v })}
                  style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PosterCanvas
