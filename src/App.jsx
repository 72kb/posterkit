import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRoute, matchPath } from './router'
import Toaster from './components/ui/Toaster'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import PageLoader from './components/ui/PageLoader'

const Projects = lazy(() => import('./pages/Projects'))
const Editor = lazy(() => import('./pages/Editor'))
const NewProject = lazy(() => import('./pages/NewProject'))

function resolve(path) {
  if (path === '/' || path === '') return { key: 'home', el: <Landing /> }
  if (path === '/projects') return { key: 'projects', el: <Projects /> }
  if (path === '/new') return { key: 'new', el: <NewProject /> }
  const ed = matchPath('/editor/:id', path)
  if (ed) return { key: `editor-${ed.id}`, el: <Editor id={ed.id} /> }
  return { key: '404', el: <NotFound /> }
}

const TITLES = { home: 'Postakit — editorial poster studio', projects: 'My posters · Postakit', new: 'New poster · Postakit', '404': 'Not found · Postakit' }

export default function App() {
  const { path } = useRoute()
  const { key, el } = resolve(path)

  useEffect(() => {
    if (!key.startsWith('editor')) document.title = TITLES[key] || TITLES.home
    window.scrollTo(0, 0)
  }, [key])

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="min-h-full"
        >
          <Suspense fallback={<PageLoader />}>{el}</Suspense>
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </>
  )
}
