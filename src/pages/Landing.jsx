import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import {
  ArrowRight, Download, Github, ImagePlus, Layers, Lock, MousePointerClick, Palette, Sparkles, Undo2, WifiOff,
} from 'lucide-react'
import SiteHeader from '../components/layout/SiteHeader'
import PosterPreview from '../components/poster/PosterPreview'
import Button from '../components/ui/Button'
import Logo, { LogoMark } from '../components/brand/Logo'
import { SHOWCASE } from '../lib/showcase'
import { TEMPLATES } from '../lib/templates'
import { MAG_TEMPLATES } from '../lib/magTemplates'
import { TEMPLATE_SCENES, templatePreviewDoc } from '../lib/starters'
import { REPO_URL, APP_VERSION } from '../config'

const byId = (id) => SHOWCASE.find((s) => s.id === id)
const HERO = [byId('couture'), byId('car-park-drift'), byId('circuit')]

const MARQUEE = [
  ...SHOWCASE.map((s) => ({ key: s.id, doc: s.doc, sample: s.photo })),
  ...[...TEMPLATES.slice(3, 8), ...MAG_TEMPLATES.slice(4)].map((t) => ({ key: t.id, doc: templatePreviewDoc(t), sample: TEMPLATE_SCENES[t.id] })),
]

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
}

/** Circular rotating text badge. */
function SpinBadge({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id="circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-ink-100 font-mono" style={{ fontSize: 13.5, letterSpacing: 4.2 }}>
          <textPath href="#circle">FREE · OPEN SOURCE · PRIVATE BY DESIGN · </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <LogoMark size={56} />
      </div>
    </div>
  )
}

function HeroStack() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const cards = [
    { item: HERO[0], className: 'left-0 top-[14%] w-[44%]', rotate: -9, delay: 0.25, float: 10, z: 10 },
    { item: HERO[2], className: 'right-0 top-[18%] w-[44%]', rotate: 8, delay: 0.4, float: 12, z: 10 },
    { item: HERO[1], className: 'left-[24%] top-0 w-[52%]', rotate: -1, delay: 0.1, float: 8, z: 20 },
  ]

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
      className="relative mx-auto aspect-[1/1] w-full max-w-[560px] [perspective:1400px]"
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="absolute inset-0 [transform-style:preserve-3d]">
        {cards.map(({ item, className, rotate, delay, float, z }) => (
          // Outer div owns layout (Tailwind transforms); motion layers own animation.
          <div key={item.id} className={`absolute ${className}`} style={{ zIndex: z }}>
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate }}
              transition={{ delay, type: 'spring', stiffness: 90, damping: 16 }}
            >
              <motion.div
                animate={{ y: [0, -float, 0] }}
                transition={{ duration: 6 + float / 4, repeat: Infinity, ease: 'easeInOut', delay }}
                className="rounded-[3px] shadow-poster ring-1 ring-white/5"
              >
                <PosterPreview doc={item.doc} sample={item.photo} />
              </motion.div>
            </motion.div>
          </div>
        ))}
      </motion.div>
      <SpinBadge className="absolute -bottom-2 left-[4%] z-30 h-28 w-28 sm:h-32 sm:w-32" />
    </div>
  )
}

function Marquee() {
  const row = [...MARQUEE, ...MARQUEE]
  return (
    <div className="group relative overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
        {row.map((m, i) => (
          <div key={`${m.key}-${i}`} className="w-40 flex-shrink-0 transition-transform duration-300 hover:-translate-y-2 sm:w-48">
            <div className="shadow-poster">
              <PosterPreview doc={m.doc} sample={m.sample} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const STEPS = [
  { icon: ImagePlus, title: 'Drop a photo', text: 'Any JPG, PNG or WEBP. It stays on your device — nothing is uploaded.' },
  { icon: Palette, title: 'Pick a look', text: 'Eighteen templates across editorial, magazine and annotated formats. Restyle in one click.' },
  { icon: MousePointerClick, title: 'Edit in place', text: 'Click any word on the poster to rewrite it. Tune colour, type, grain and framing.' },
  { icon: Download, title: 'Export', text: 'High-resolution PNG, JPG or print-ready PDF — up to 4× resolution.' },
]

const FEATURES = [
  { icon: Lock, title: 'Private by design', text: 'No accounts, no servers, no tracking. Your photos never leave the browser.' },
  { icon: Layers, title: 'Three formats', text: 'Gallery-wall editorial posters, magazine covers and hand-annotated prints.' },
  { icon: Undo2, title: 'Undo everything', text: 'Full history with keyboard shortcuts, plus autosave to a local library.' },
  { icon: WifiOff, title: 'Works anywhere', text: 'Desktop, tablet or phone. Once loaded it keeps working on a flaky connection.' },
  { icon: Sparkles, title: 'AI-ready presets', text: 'Hand an AI assistant the JSON schema and your photo; paste back a finished look.' },
  { icon: Github, title: 'Open source', text: 'MIT licensed. Fork it, theme it, self-host it, add your own templates.' },
]

export default function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="relative overflow-x-clip">
      <SiteHeader />

      {/* ───────────── Hero ───────────── */}
      <section ref={heroRef} className="relative">
        <div className="pointer-events-none absolute inset-0 -top-16 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-[-10%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,77,46,0.16),transparent)]" />
          <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroFade }} className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
          <div>
            <motion.a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-850/70 py-1 pl-1 pr-3 text-xs text-ink-300 backdrop-blur transition-colors hover:border-ink-600 hover:text-ink-100"
            >
              <span className="rounded-full bg-stamp px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">v{APP_VERSION}</span>
              Free & open source
              <ArrowRight size={12} />
            </motion.a>

            <h1 className="mt-6 text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.035em] text-ink-100">
              {['Posters', 'with an'].map((w, i) => (
                <motion.span
                  key={w}
                  className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {w}
                </motion.span>
              ))}
              <br />
              <motion.span
                className="inline-block font-serif text-[1.12em] font-normal italic tracking-[-0.02em] text-stamp"
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              >
                editorial eye.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-300"
            >
              Postakit turns your photos into gallery-wall posters, magazine covers and annotated prints —
              right in your browser. No sign-up. Nothing uploaded.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button as="a" href="#/new" variant="primary" size="lg" iconRight={ArrowRight}>Start designing</Button>
              <Button as="a" href={REPO_URL} target="_blank" rel="noreferrer" variant="secondary" size="lg" icon={Github}>Star on GitHub</Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500"
            >
              <span>18 templates</span><span>3 formats</span><span>PNG · JPG · PDF</span><span>MIT</span>
            </motion.div>
          </div>

          <HeroStack />
        </motion.div>
      </section>

      {/* ───────────── Marquee ───────────── */}
      <section aria-label="Example posters" className="border-y border-ink-800/80 bg-ink-950/60">
        <Marquee />
      </section>

      {/* ───────────── How it works ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <motion.div {...reveal} className="max-w-2xl">
          <div className="label-xs mb-3 text-stamp">How it works</div>
          <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink-100 sm:text-5xl">
            From camera roll to <span className="font-serif font-normal italic">print-ready</span> in a minute.
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className="group relative bg-ink-900 p-6 transition-colors hover:bg-ink-850"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 text-ink-100 transition-all duration-300 group-hover:rotate-[-6deg] group-hover:bg-stamp">
                  <Icon size={19} />
                </span>
                <span className="font-serif text-4xl italic text-ink-700 transition-colors group-hover:text-ink-500">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-[15px] font-semibold text-ink-100">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-400">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────────── Formats ───────────── */}
      <section className="relative border-t border-ink-800/80 bg-ink-950/50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...reveal} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <div className="label-xs mb-3 text-stamp">Formats</div>
              <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink-100 sm:text-5xl">
                One photo. <span className="font-serif font-normal italic">Three</span> ways to hang it.
              </h2>
            </div>
            <Button as="a" href="#/new" variant="light" iconRight={ArrowRight}>Browse templates</Button>
          </motion.div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { id: 'last-light', fmt: 'editorial', title: 'Editorial poster', text: 'Palette dots, headline, details grid and a giant name stamp. Portrait or landscape.' },
              { id: 'capital', fmt: 'magazine', title: 'Magazine cover', text: 'Masthead, cover lines and pull quotes across four distinct cover layouts.' },
              { id: 'field-notes', fmt: 'annotated', title: 'Annotated print', text: 'Handwritten labels you drag straight onto the photo. Field-journal energy.' },
            ].map(({ id, fmt, title, text }, i) => {
              const ex = byId(id)
              return (
                <motion.a
                  key={id}
                  href={`#/new?format=${fmt}`}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.1 }}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-8 transition-colors group-hover:border-ink-600">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,77,46,0.18),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative mx-auto w-[78%] shadow-poster transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]">
                      <PosterPreview doc={ex.doc} sample={ex.photo} />
                    </div>
                  </div>
                  <h3 className="mt-5 flex items-center gap-2 text-lg font-semibold text-ink-100">
                    {title}
                    <ArrowRight size={16} className="-translate-x-1 text-stamp opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{text}</p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────── Features ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <motion.div {...reveal} className="max-w-xl">
          <div className="label-xs mb-3 text-stamp">Why Postakit</div>
          <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink-100 sm:text-5xl">
            A design studio that <span className="font-serif font-normal italic">fits in a tab.</span>
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <motion.div key={title} {...reveal} transition={{ ...reveal.transition, delay: (i % 3) * 0.08 }} className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-ink-700 bg-ink-850 text-stamp">
                <Icon size={18} />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-ink-100">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="px-4 pb-24 sm:px-6">
        <motion.div
          {...reveal}
          className="grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-stamp/30 bg-stamp px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[28px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full border-[36px] border-black/10" />
          <h2 className="relative font-serif text-5xl leading-[0.95] text-white sm:text-7xl">
            Made in the open.
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/85">
            Postakit is MIT-licensed. Use it, fork it, host your own, or contribute a template.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button as="a" href="#/new" variant="light" size="lg" iconRight={ArrowRight}>Make a poster</Button>
            <Button as="a" href={REPO_URL} target="_blank" rel="noreferrer" size="lg" icon={Github} className="border-white/30 bg-black/20 text-white hover:bg-black/30">
              View source
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-ink-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-ink-500 sm:flex-row sm:px-6">
          <Logo size={22} />
          <span>MIT License · Built with React, Vite & Tailwind · Photos stay on your device</span>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-ink-200">
            <Github size={14} /> Source
          </a>
        </div>
      </footer>
    </div>
  )
}
