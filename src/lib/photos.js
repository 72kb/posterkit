import { db } from './db'
import { uid } from './uid'

/** Longest edge kept after upload — plenty for 3× PDF export of a 980px poster. */
const MAX_EDGE = 3200

const urlCache = new Map() // photoId -> object URL

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

/**
 * Downscale very large images so projects stay small and exports stay fast.
 * Returns the original blob if it is already small enough or can't be decoded.
 */
export async function processImage(file) {
  if (!file || !file.type?.startsWith('image/')) throw new Error('That file is not an image')
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('This image format is not supported by your browser')
  }
  const { width, height } = bitmap
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  if (scale === 1 && file.size < 6 * 1024 * 1024) {
    bitmap.close?.()
    return file
  }
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b || file), type, 0.92))
}

/** Persist a photo for a project and return { photoId, photoUrl }. */
export async function savePhoto(projectId, blob) {
  const id = uid()
  await db.put('photos', { id, projectId, blob, createdAt: Date.now() })
  const url = URL.createObjectURL(blob)
  urlCache.set(id, url)
  return { photoId: id, photoUrl: url }
}

/** Resolve a stored photo id to an object URL (cached). */
export async function getPhotoUrl(photoId) {
  if (!photoId) return null
  if (urlCache.has(photoId)) return urlCache.get(photoId)
  const rec = await db.get('photos', photoId).catch(() => null)
  if (!rec?.blob) return null
  const url = URL.createObjectURL(rec.blob)
  urlCache.set(photoId, url)
  return url
}

export async function getPhotoBlob(photoId) {
  if (!photoId) return null
  const rec = await db.get('photos', photoId).catch(() => null)
  return rec?.blob ?? null
}

export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

export async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return res.blob()
}
