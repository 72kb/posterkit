import usePosterStore from '../../store/posterStore'
import MagStandardLayout from './MagStandardLayout'
import MagForbesLayout from './MagForbesLayout'
import MagVogueLayout from './MagVogueLayout'
import MagWiredLayout from './MagWiredLayout'

export default function MagazineCanvas() {
  const { magLayout } = usePosterStore()
  if (magLayout === 'forbes') return <MagForbesLayout />
  if (magLayout === 'vogue')  return <MagVogueLayout />
  if (magLayout === 'wired')  return <MagWiredLayout />
  return <MagStandardLayout />
}
