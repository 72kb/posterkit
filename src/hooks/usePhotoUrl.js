import { useEffect, useState } from 'react'
import { getPhotoUrl } from '../lib/photos'
import { getSampleUrl } from '../lib/samplePhotos'

/** Resolve a stored photo id to an object URL. */
export function useStoredPhoto(photoId) {
  const [resolved, setResolved] = useState({ id: null, url: null })
  useEffect(() => {
    if (!photoId) return
    let alive = true
    getPhotoUrl(photoId).then((u) => alive && setResolved({ id: photoId, url: u }))
    return () => { alive = false }
  }, [photoId])
  return photoId && resolved.id === photoId ? resolved.url : null
}

/** Resolve a procedural sample scene name to an object URL. */
export function useSamplePhoto(name) {
  const [resolved, setResolved] = useState({ name: null, url: null })
  useEffect(() => {
    if (!name) return
    let alive = true
    getSampleUrl(name).then((u) => alive && setResolved({ name, url: u }))
    return () => { alive = false }
  }, [name])
  return name && resolved.name === name ? resolved.url : null
}
