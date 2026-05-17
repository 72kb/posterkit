import { useCallback, useRef } from 'react'
import usePosterStore from '../store/posterStore'

export function useImageUpload() {
  const setPhoto = usePosterStore((s) => s.setPhoto)
  const currentUrl = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (currentUrl.current) {
      URL.revokeObjectURL(currentUrl.current)
    }
    const url = URL.createObjectURL(file)
    currentUrl.current = url
    setPhoto(url)
  }, [setPhoto])

  const onFileInput = useCallback((e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  return { onFileInput, onDrop, onDragOver }
}
