import { PosterStoreContext, CanvasModeContext } from './contexts'

const INTERACTIVE = { interactive: true }
const STATIC = { interactive: false }

export function PosterProvider({ store, interactive = false, children }) {
  return (
    <PosterStoreContext.Provider value={store}>
      <CanvasModeContext.Provider value={interactive ? INTERACTIVE : STATIC}>
        {children}
      </CanvasModeContext.Provider>
    </PosterStoreContext.Provider>
  )
}
