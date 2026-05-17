export const SERIF_FONTS = [
  { name: 'Playfair Display',   url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap' },
  { name: 'Abril Fatface',      url: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap' },
  { name: 'EB Garamond',        url: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap' },
  { name: 'Cormorant Garamond', url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap' },
  { name: 'Libre Baskerville',  url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap' },
  { name: 'UnifrakturMaguntia', url: 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap' },
  { name: 'Bodoni Moda',        url: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700&display=swap' },
]

export const HANDWRITING_FONTS = [
  { name: 'Caveat', url: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap' },
  { name: 'Kalam', url: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400&display=swap' },
  { name: 'Patrick Hand', url: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap' },
  { name: 'Permanent Marker', url: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap' },
]

export const DISPLAY_FONTS = [
  { name: 'Barlow Condensed', url: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&display=swap' },
  { name: 'Bebas Neue', url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap' },
  { name: 'Anton', url: 'https://fonts.googleapis.com/css2?family=Anton&display=swap' },
  { name: 'Black Han Sans', url: 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap' },
  { name: 'Staatliches', url: 'https://fonts.googleapis.com/css2?family=Staatliches&display=swap' },
  { name: 'Big Shoulders Display', url: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap' },
]

export const BODY_FONTS = [
  { name: 'DM Sans', url: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap' },
  { name: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap' },
  { name: 'Outfit', url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap' },
  { name: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&display=swap' },
  { name: 'Syne', url: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600&display=swap' },
  { name: 'Epilogue', url: 'https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,300;0,400;1,300;1,400&display=swap' },
]

const loadedFonts = new Set()

export function loadFont(url) {
  if (loadedFonts.has(url)) return Promise.resolve()
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => {
      loadedFonts.add(url)
      resolve()
    }
    link.onerror = resolve
    document.head.appendChild(link)
  })
}
