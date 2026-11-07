import { usePoster } from '../../store/usePoster'
import { hexToRgba } from '../../lib/colorUtils'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url%28%23noise%29'/%3E%3C/svg%3E")`

/** Vignette presets: [edge alpha at the opposite side, fade-out stop, fade-in stop] */
const VIGNETTE_VARIANTS = {
  default: [0.4, 25, 55],
  soft: [0.3, 30, 55],
  light: [0.2, 30, 50],
}

function vignetteGradient(direction, intensity, variant = 'default') {
  const [edge, a, b] = VIGNETTE_VARIANTS[variant] || VIGNETTE_VARIANTS.default
  const v = intensity
  switch (direction) {
    case 'bottom': return `linear-gradient(to bottom, rgba(0,0,0,${edge}) 0%, rgba(0,0,0,0) ${a}%, rgba(0,0,0,0) ${b}%, rgba(0,0,0,${v}) 100%)`
    case 'top': return `linear-gradient(to top, rgba(0,0,0,${edge}) 0%, rgba(0,0,0,0) ${a}%, rgba(0,0,0,0) ${b}%, rgba(0,0,0,${v}) 100%)`
    case 'edges': return `radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,${v}) 100%)`
    case 'left': return `linear-gradient(to right, rgba(0,0,0,${v}) 0%, rgba(0,0,0,0) 50%)`
    case 'right': return `linear-gradient(to left, rgba(0,0,0,${v}) 0%, rgba(0,0,0,0) 50%)`
    default: return ''
  }
}

const layer = { position: 'absolute', inset: 0, pointerEvents: 'none' }

/**
 * The photographic base of every layout: photo → tint → gradients → vignette →
 * extra layers → grain. Positioned absolutely to fill its parent unless
 * `height` is given (stacked editorial layout).
 */
export default function PhotoBackdrop({
  height,
  vignette = 'default',
  before = [],
  after = [],
  placeholderBg,
  children,
}) {
  const {
    photoUrl, photoPosition, photoScale, textColor,
    tintColor, tintOpacity, vignetteIntensity, vignetteDirection, grainOpacity,
  } = usePoster()

  // Stacked mode: `height` is the preferred size, but the photo yields space
  // (down to 30%) so the text panel below is never clipped.
  const container = height
    ? { position: 'relative', width: '100%', flex: `0 1 ${height}`, minHeight: '30%', overflow: 'hidden' }
    : { position: 'absolute', inset: 0, overflow: 'hidden' }

  return (
    <div style={container}>
      <div style={{ ...layer, backgroundColor: photoUrl ? 'transparent' : (placeholderBg || '#1a1a1a') }} />
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: photoPosition,
            transform: photoScale !== 100 ? `scale(${photoScale / 100})` : undefined,
            transformOrigin: photoPosition,
            pointerEvents: 'none', userSelect: 'none',
          }}
        />
      ) : (
        <div style={{
          ...layer, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: hexToRgba(textColor || '#ffffff', 0.18), fontSize: 13, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif",
        }}>
          Add a photo
        </div>
      )}
      <div style={{ ...layer, backgroundColor: tintColor, opacity: tintOpacity, mixBlendMode: 'multiply' }} />
      {before.map((bg, i) => <div key={`b${i}`} style={{ ...layer, background: bg }} />)}
      {vignette && <div style={{ ...layer, background: vignetteGradient(vignetteDirection, vignetteIntensity, vignette) }} />}
      {after.map((bg, i) => <div key={`a${i}`} style={{ ...layer, background: bg }} />)}
      {children}
      {grainOpacity > 0 && (
        <div style={{
          ...layer, opacity: grainOpacity, backgroundImage: GRAIN_SVG,
          backgroundRepeat: 'repeat', backgroundSize: '128px', mixBlendMode: 'overlay',
        }} />
      )}
    </div>
  )
}
