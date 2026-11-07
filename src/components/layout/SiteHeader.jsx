import { useEffect, useState } from 'react'
import { Github } from 'lucide-react'
import Logo from '../brand/Logo'
import Button from '../ui/Button'
import { REPO_URL } from '../../config'

export default function SiteHeader({ current }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'border-b border-ink-800/80 bg-ink-900/80 backdrop-blur-xl' : 'border-b border-transparent'}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#/" aria-label="Postakit home"><Logo /></a>
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <a
            href="#/projects"
            className={`rounded-lg px-3 py-2 text-[13px] transition-colors ${current === 'projects' ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100'}`}
          >
            My posters
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] text-ink-400 transition-colors hover:text-ink-100 sm:inline-flex"
          >
            <Github size={15} /> GitHub
          </a>
          <Button as="a" href="#/new" variant="light" size="sm">Create poster</Button>
        </nav>
      </div>
    </header>
  )
}
