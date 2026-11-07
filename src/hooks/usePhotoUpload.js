import { useCallback, useState } from 'react'
import { usePosterStoreApi } from '../store/usePoster'
import { processImage, savePhoto } from '../lib/photos'
import { getSampleBlob } from '../lib/samplePhotos'
import { toast } from '../lib/toast'

export function usePhotoUpload(projectId) {
  const store = usePosterStoreApi()
  const [busy, setBusy] = useState(false)

  const applyBlob = useCallback(async (blob) => {
    const { photoId, photoUrl } = await savePhoto(projectId, blob)
    store.getState().setPhoto(photoId, photoUrl)
  }, [projectId, store])

  const handleFile = useCallback(async (file) => {
    if (!file) return
    if (!file.type?.startsWith('image/')) {
      toast.error('That file isn’t an image', { description: 'Try a JPG, PNG, WEBP or AVIF.' })
      return
    }
    setBusy(true)
    try {
      await applyBlob(await processImage(file))
    } catch (err) {
      console.error(err)
      toast.error('Couldn’t load that photo', { description: err.message })
    } finally {
      setBusy(false)
    }
  }, [applyBlob])

  const applySample = useCallback(async (name) => {
    setBusy(true)
    try {
      await applyBlob(await getSampleBlob(name))
    } finally {
      setBusy(false)
    }
  }, [applyBlob])

  return { handleFile, applySample, busy }
}
