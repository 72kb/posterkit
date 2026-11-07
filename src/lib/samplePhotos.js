/**
 * Procedurally painted sample "photos" so the app looks alive without shipping
 * any third-party imagery. Each scene is drawn once onto a canvas and cached
 * as an object URL / Blob.
 */

const W = 1200
const H = 1560

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function grad(g, stops, x0 = 0, y0 = 0, x1 = 0, y1 = H) {
  const gr = g.createLinearGradient(x0, y0, x1, y1)
  stops.forEach(([o, c]) => gr.addColorStop(o, c))
  return gr
}

function glow(g, x, y, r, color) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r)
  gr.addColorStop(0, color)
  gr.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gr
  g.fillRect(x - r, y - r, r * 2, r * 2)
}

function ridge(g, rand, baseY, amp, color, step = 40) {
  g.fillStyle = color
  g.beginPath()
  g.moveTo(0, H)
  let y = baseY
  for (let x = 0; x <= W + step; x += step) {
    y += (rand() - 0.5) * amp
    y = Math.max(baseY - amp * 2, Math.min(baseY + amp, y))
    g.lineTo(x, y)
  }
  g.lineTo(W, H)
  g.closePath()
  g.fill()
}

/** Film grain: one small noise tile, repeated as a pattern (fast). */
function film(g, rand, amount = 22) {
  const tile = document.createElement('canvas')
  tile.width = tile.height = 128
  const t = tile.getContext('2d')
  const img = t.createImageData(128, 128)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (rand() - 0.5) * amount * 4
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  t.putImageData(img, 0, 0)
  g.save()
  g.globalCompositeOperation = 'overlay'
  g.globalAlpha = 0.18
  g.fillStyle = g.createPattern(tile, 'repeat')
  g.fillRect(0, 0, W, H)
  g.restore()
}

const SCENES = {
  dusk(g, rand) {
    g.fillStyle = grad(g, [[0, '#1d1240'], [0.38, '#7a2f5e'], [0.62, '#f2793a'], [0.78, '#ffc46b'], [1, '#2a1406']])
    g.fillRect(0, 0, W, H)
    glow(g, W * 0.62, H * 0.66, 520, 'rgba(255,190,110,0.55)')
    g.fillStyle = '#ffe2a6'
    g.beginPath(); g.arc(W * 0.62, H * 0.66, 120, 0, Math.PI * 2); g.fill()
    ridge(g, rand, H * 0.70, 70, '#5a2440')
    ridge(g, rand, H * 0.76, 60, '#3a1430')
    ridge(g, rand, H * 0.84, 40, '#1a0812', 30)
  },
  city(g, rand) {
    g.fillStyle = grad(g, [[0, '#04060f'], [0.55, '#14183a'], [0.8, '#3a1d4a'], [1, '#05050a']])
    g.fillRect(0, 0, W, H)
    glow(g, W * 0.3, H * 0.75, 700, 'rgba(255,80,140,0.18)')
    glow(g, W * 0.8, H * 0.7, 600, 'rgba(60,140,255,0.16)')
    let x = -20
    while (x < W) {
      const bw = 70 + rand() * 140
      const bh = H * (0.18 + rand() * 0.42)
      const top = H * 0.86 - bh
      g.fillStyle = `rgb(${8 + rand() * 10},${8 + rand() * 12},${18 + rand() * 18})`
      g.fillRect(x, top, bw, H - top)
      for (let wy = top + 16; wy < H * 0.86; wy += 22) {
        for (let wx = x + 10; wx < x + bw - 12; wx += 18) {
          if (rand() > 0.62) {
            g.fillStyle = rand() > 0.85 ? 'rgba(255,120,190,0.85)' : `rgba(255,${200 + rand() * 40},${120 + rand() * 60},${0.5 + rand() * 0.4})`
            g.fillRect(wx, wy, 8, 11)
          }
        }
      }
      x += bw + 4
    }
    g.fillStyle = grad(g, [[0, 'rgba(10,10,20,0)'], [1, 'rgba(0,0,0,0.9)']], 0, H * 0.8, 0, H)
    g.fillRect(0, H * 0.8, W, H * 0.2)
  },
  coast(g, rand) {
    g.fillStyle = grad(g, [[0, '#9fc3d8'], [0.45, '#e8d9c4'], [0.52, '#f4c9a0'], [0.53, '#4f7a8f'], [1, '#0d2533']])
    g.fillRect(0, 0, W, H)
    glow(g, W * 0.4, H * 0.5, 400, 'rgba(255,240,210,0.5)')
    for (let i = 0; i < 160; i++) {
      const y = H * 0.54 + Math.pow(rand(), 1.6) * H * 0.46
      const w = 30 + rand() * 220 * (y / H)
      g.fillStyle = `rgba(255,240,220,${0.05 + rand() * 0.18})`
      g.fillRect(rand() * W, y, w, 2 + (y / H) * 3)
    }
    g.fillStyle = '#0a1a22'
    g.beginPath(); g.moveTo(W * 0.72, H * 0.53); g.lineTo(W * 0.86, H * 0.42); g.lineTo(W, H * 0.47); g.lineTo(W, H * 0.53); g.fill()
  },
  neon(g, rand) {
    g.fillStyle = '#07040f'
    g.fillRect(0, 0, W, H)
    const colors = ['rgba(0,212,255,0.55)', 'rgba(255,46,154,0.55)', 'rgba(123,0,255,0.5)', 'rgba(0,255,136,0.35)']
    for (let i = 0; i < 7; i++) glow(g, rand() * W, rand() * H, 300 + rand() * 500, colors[i % colors.length])
    g.strokeStyle = 'rgba(255,255,255,0.08)'
    g.lineWidth = 2
    for (let y = H * 0.6; y < H; y += 40 + (y - H * 0.6) * 0.15) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke()
    }
    for (let i = -10; i <= 10; i++) {
      g.beginPath(); g.moveTo(W / 2 + i * 30, H * 0.6); g.lineTo(W / 2 + i * 260, H); g.stroke()
    }
  },
  dunes(g, rand) {
    g.fillStyle = grad(g, [[0, '#f3e1c7'], [0.5, '#f0b98a'], [1, '#a2512a']])
    g.fillRect(0, 0, W, H)
    glow(g, W * 0.25, H * 0.22, 260, 'rgba(255,255,240,0.6)')
    const tones = ['#d98b55', '#c0703f', '#9c522b', '#6e3418', '#3d1a0a']
    tones.forEach((c, i) => {
      g.fillStyle = c
      g.beginPath()
      const base = H * (0.5 + i * 0.1)
      g.moveTo(0, H)
      for (let x = 0; x <= W; x += 10) {
        g.lineTo(x, base + Math.sin(x / (180 + i * 40) + i * 2 + rand() * 0.02) * (40 + i * 10))
      }
      g.lineTo(W, H)
      g.fill()
    })
  },
  forest(g, rand) {
    g.fillStyle = grad(g, [[0, '#cfd9c4'], [0.5, '#6f8a6a'], [1, '#0d1a10']])
    g.fillRect(0, 0, W, H)
    for (let layer = 0; layer < 4; layer++) {
      const shade = 70 - layer * 18
      g.fillStyle = `rgb(${shade * 0.4},${shade},${shade * 0.55})`
      for (let i = 0; i < 26; i++) {
        const x = rand() * W
        const base = H * (0.55 + layer * 0.12)
        const h = 260 + rand() * 300 + layer * 80
        const w = 50 + rand() * 60 + layer * 20
        g.beginPath(); g.moveTo(x, base - h); g.lineTo(x - w, base); g.lineTo(x + w, base); g.fill()
      }
      g.fillRect(0, H * (0.55 + layer * 0.12), W, H)
      g.fillStyle = 'rgba(220,230,210,0.12)'
      g.fillRect(0, 0, W, H)
    }
  },
}

export const SAMPLE_PHOTOS = Object.keys(SCENES)

const urlCache = new Map()
const blobCache = new Map()

export function getSampleBlob(name = 'dusk') {
  if (blobCache.has(name)) return blobCache.get(name)
  const p = new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const g = canvas.getContext('2d')
    const rand = rng(name.split('').reduce((a, c) => a + c.charCodeAt(0) * 31, 7))
    ;(SCENES[name] || SCENES.dusk)(g, rand)
    film(g, rand)
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.88)
  })
  blobCache.set(name, p)
  return p
}

export async function getSampleUrl(name = 'dusk') {
  if (urlCache.has(name)) return urlCache.get(name)
  const url = URL.createObjectURL(await getSampleBlob(name))
  urlCache.set(name, url)
  return url
}
