export const POSTER_SIZES = {
  portrait: { width: 700, height: 980 },
  landscape: { width: 1060, height: 700 },
}

/** Magazine & annotated formats are always portrait. */
export function posterSize(doc) {
  if (doc.posterStyle !== 'editorial') return POSTER_SIZES.portrait
  return POSTER_SIZES[doc.orientation] || POSTER_SIZES.portrait
}
