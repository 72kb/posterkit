import { ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import { LogoMark } from '../components/brand/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark size={56} className="-rotate-6" />
      <div>
        <div className="font-serif text-6xl italic text-ink-100">Return to sender</div>
        <p className="mt-3 text-ink-400">That page doesn’t exist — it may have moved or been deleted.</p>
      </div>
      <Button as="a" href="#/" variant="light" icon={ArrowLeft}>Back home</Button>
    </div>
  )
}
