import { db } from './db'
import { uid } from './uid'
import { normalizeDoc, serializeDoc } from '../store/posterStore'
import { savePhoto, getPhotoBlob, blobToDataUrl, dataUrlToBlob } from './photos'

export const PROJECT_FILE_VERSION = 1

const sortByUpdated = (a, b) => b.updatedAt - a.updatedAt

export async function listProjects() {
  const all = await db.getAll('projects')
  return all.sort(sortByUpdated)
}

export function getProject(id) {
  return db.get('projects', id)
}

/**
 * Create a project from a partial doc. If `photoBlob` is provided it is stored
 * and linked to the project.
 */
export async function createProject({ name = 'Untitled poster', doc = {}, photoBlob = null } = {}) {
  const id = uid()
  const now = Date.now()
  const fullDoc = serializeDoc(normalizeDoc(doc))
  if (photoBlob) {
    const { photoId } = await savePhoto(id, photoBlob)
    fullDoc.photoId = photoId
  }
  const project = { id, name, createdAt: now, updatedAt: now, doc: fullDoc }
  await db.put('projects', project)
  return project
}

export async function saveProjectDoc(id, state) {
  const existing = await db.get('projects', id)
  if (!existing) return null
  const project = { ...existing, doc: serializeDoc(state), updatedAt: Date.now() }
  await db.put('projects', project)
  return project
}

export async function renameProject(id, name) {
  const existing = await db.get('projects', id)
  if (!existing) return null
  const project = { ...existing, name: name.trim() || 'Untitled poster', updatedAt: Date.now() }
  await db.put('projects', project)
  return project
}

export async function duplicateProject(id) {
  const src = await db.get('projects', id)
  if (!src) return null
  const blob = await getPhotoBlob(src.doc.photoId)
  return createProject({ name: `${src.name} copy`, doc: src.doc, photoBlob: blob })
}

export function deleteProject(id) {
  return db.deleteProject(id)
}

/** Export a project (with its photo embedded) to a portable JSON object. */
export async function exportProjectFile(id) {
  const project = await db.get('projects', id)
  if (!project) throw new Error('Project not found')
  const blob = await getPhotoBlob(project.doc.photoId)
  return {
    app: 'postakit',
    version: PROJECT_FILE_VERSION,
    name: project.name,
    exportedAt: new Date().toISOString(),
    doc: project.doc,
    photo: blob ? await blobToDataUrl(blob) : null,
  }
}

/** Import a project file produced by `exportProjectFile`. */
export async function importProjectFile(json) {
  const data = typeof json === 'string' ? JSON.parse(json) : json
  if (!data || data.app !== 'postakit' || typeof data.doc !== 'object') {
    throw new Error('This is not a Postakit project file')
  }
  let photoBlob = null
  if (typeof data.photo === 'string' && data.photo.startsWith('data:image/')) {
    photoBlob = await dataUrlToBlob(data.photo)
  }
  const doc = { ...data.doc, photoId: null }
  return createProject({ name: String(data.name || 'Imported poster').slice(0, 120), doc, photoBlob })
}
