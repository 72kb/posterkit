import usePosterStore from '../../store/posterStore'

export default function PhotoArea({ height }) {
  const { photoUrl, photoPosition, photoScale, tintColor, tintOpacity, vignetteIntensity, vignetteDirection, grainOpacity } = usePosterStore()

  const vignetteGradient = {
    bottom: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
    top: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
    edges: `radial-gradient(ellipse at center, rgba(0,0,0,0.0) 40%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
    left: `linear-gradient(to right, rgba(0,0,0,${vignetteIntensity}) 0%, rgba(0,0,0,0.0) 50%)`,
    right: `linear-gradient(to left, rgba(0,0,0,${vignetteIntensity}) 0%, rgba(0,0,0,0.0) 50%)`,
  }[vignetteDirection] || ''

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height || '72%',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: photoUrl ? `url(${photoUrl})` : 'none',
        backgroundColor: photoUrl ? 'transparent' : '#1a1a1a',
        backgroundSize: `${photoScale}%`,
        backgroundPosition: photoPosition,
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Placeholder when no photo */}
      {!photoUrl && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.15)',
          fontSize: 13,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Upload a photo
        </div>
      )}

      {/* Tint overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: tintColor,
        opacity: tintOpacity,
        mixBlendMode: 'multiply',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: vignetteGradient,
        pointerEvents: 'none',
      }} />

      {/* Grain */}
      {grainOpacity > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  )
}
