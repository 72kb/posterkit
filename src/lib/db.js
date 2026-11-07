/**
 * Tiny promise wrapper around IndexedDB. Two stores:
 *   projects — { id, name, createdAt, updatedAt, doc }
 *   photos   — { id, projectId, blob, createdAt }
 * Everything stays on the user's device.
 */
const DB_NAME = 'postakit'
const DB_VERSION = 1

let dbPromise = null

function openDb() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('projects')) {
        const s = db.createObjectStore('projects', { keyPath: 'id' })
        s.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('photos')) {
        const s = db.createObjectStore('photos', { keyPath: 'id' })
        s.createIndex('projectId', 'projectId')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
    req.onblocked = () => reject(new Error('Database upgrade blocked — close other Postakit tabs'))
  })
  dbPromise.catch(() => { dbPromise = null })
  return dbPromise
}

function promisify(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function tx(storeNames, mode, fn) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const t = db.transaction(storeNames, mode)
    let result
    Promise.resolve(fn(t)).then((r) => { result = r }, reject)
    t.oncomplete = () => resolve(result)
    t.onerror = () => reject(t.error)
    t.onabort = () => reject(t.error || new Error('Transaction aborted'))
  })
}

export const db = {
  get: (store, key) => tx(store, 'readonly', (t) => promisify(t.objectStore(store).get(key))),
  getAll: (store) => tx(store, 'readonly', (t) => promisify(t.objectStore(store).getAll())),
  put: (store, value) => tx(store, 'readwrite', (t) => promisify(t.objectStore(store).put(value))),
  delete: (store, key) => tx(store, 'readwrite', (t) => promisify(t.objectStore(store).delete(key))),

  /** Delete a project and every photo that belongs to it. */
  deleteProject: (id) => tx(['projects', 'photos'], 'readwrite', async (t) => {
    t.objectStore('projects').delete(id)
    const idx = t.objectStore('photos').index('projectId')
    const keys = await promisify(idx.getAllKeys(id))
    keys.forEach((k) => t.objectStore('photos').delete(k))
  }),
}
