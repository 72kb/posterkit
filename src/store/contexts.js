import { createContext } from 'react'

export const PosterStoreContext = createContext(null)

/** `interactive` — when false the canvas renders read-only (previews, thumbnails). */
export const CanvasModeContext = createContext({ interactive: false })
