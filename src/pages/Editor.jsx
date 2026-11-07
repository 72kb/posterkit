import { useEffect, useState } from 'react'
import { createPosterStore } from '../store/posterStore'
import { PosterProvider } from '../store/PosterContext'
import { getProject, renameProject } from '../lib/projects'
import { getPhotoUrl } from '../lib/photos'
import { ensureDocFonts, ensureDocFontsQuick } from '../lib/fonts'
import { selection } from '../lib/selection'
import { navigate } from '../router'
import { toast } from '../lib/toast'
import PageLoader from '../components/ui/PageLoader'
import EditorShell from '../components/editor/EditorShell'

export default function Editor({ id }) {
  const [session, setSession] = useState(null) // { store, project }

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const project = await getProject(id)
        if (!alive) return
        if (!project) {
          toast.error('Poster not found', { description: 'It may have been deleted.' })
          navigate('/projects', { replace: true })
          return
        }
        const photoUrl = await getPhotoUrl(project.doc.photoId)
        // Give fonts a moment to avoid a flash of fallback type, but never
        // block the editor on a slow font CDN (exports wait for fonts anyway).
        await ensureDocFontsQuick(project.doc, 900)
        if (!alive) return
        const store = createPosterStore({ ...project.doc, photoUrl })
        setSession({ store, project })
      } catch (err) {
        console.error(err)
        toast.error('Couldn’t open this poster', { description: err.message })
        navigate('/projects', { replace: true })
      }
    })()
    return () => {
      alive = false
      selection.clear()
    }
  }, [id])

  // Keep fonts loaded as the user changes them (also covers undo/redo).
  useEffect(() => {
    if (!session) return
    return session.store.subscribe((s, prev) => {
      if (s.displayFont !== prev.displayFont || s.bodyFont !== prev.bodyFont
        || s.annotationFont !== prev.annotationFont || s.posterStyle !== prev.posterStyle) {
        ensureDocFonts(s)
      }
    })
  }, [session])

  useEffect(() => {
    if (session) document.title = `${session.project.name} · Postakit`
  }, [session])

  if (!session) return <PageLoader label="Opening poster" />

  const onRename = async (name) => {
    const updated = await renameProject(id, name)
    if (updated) {
      setSession((s) => ({ ...s, project: updated }))
    }
  }

  return (
    <PosterProvider store={session.store} interactive>
      <EditorShell project={session.project} onRename={onRename} />
    </PosterProvider>
  )
}
