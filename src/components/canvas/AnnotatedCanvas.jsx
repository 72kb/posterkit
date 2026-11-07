import { usePoster } from '../../store/usePoster'
import PhotoBackdrop from './PhotoBackdrop'
import FloatingAnnotations from './FloatingAnnotations'

export default function AnnotatedCanvas() {
  const bgColor = usePoster((s) => s.bgColor)
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <PhotoBackdrop vignette="light" placeholderBg={bgColor || '#1a1a1a'} />
      <FloatingAnnotations />
    </div>
  )
}
