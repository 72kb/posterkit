export function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith('#')) return `rgba(255,255,255,${alpha})`
  let h = hex.slice(1)
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2]
  if (h.length !== 6) return `rgba(255,255,255,${alpha})`
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
