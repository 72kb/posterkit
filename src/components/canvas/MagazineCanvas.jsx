import { usePoster } from '../../store/usePoster'
import MagStandardLayout from './MagStandardLayout'
import MagCapitalLayout from './MagCapitalLayout'
import MagCoutureLayout from './MagCoutureLayout'
import MagCircuitLayout from './MagCircuitLayout'

export default function MagazineCanvas() {
  const magLayout = usePoster((s) => s.magLayout)
  if (magLayout === 'capital') return <MagCapitalLayout />
  if (magLayout === 'couture') return <MagCoutureLayout />
  if (magLayout === 'circuit') return <MagCircuitLayout />
  return <MagStandardLayout />
}
