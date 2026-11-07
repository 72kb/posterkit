import { LogoMark } from '../brand/Logo'

export default function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex h-dvh items-center justify-center bg-ink-900" role="status" aria-label={label}>
      <div className="flex flex-col items-center gap-4">
        <LogoMark size={44} className="animate-pulse" />
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-ink-800">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-stamp to-transparent bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  )
}
