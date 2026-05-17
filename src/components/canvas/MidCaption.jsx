import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'

export default function MidCaption() {
  const { subjectTitle, subjectTitleAccentWord, captionText, displayFont, bodyFont, accentColor, set } = usePosterStore()

  const titleStyle = {
    fontFamily: `'${displayFont}', Impact, sans-serif`,
    fontSize: 36,
    lineHeight: 1.0,
    letterSpacing: '0.02em',
    marginBottom: 8,
    color: '#fff',
  }

  const titleDisplay = (() => {
    if (!subjectTitleAccentWord || !subjectTitle.includes(subjectTitleAccentWord)) {
      return <span style={{ color: '#fff' }}>{subjectTitle}</span>
    }
    const idx = subjectTitle.indexOf(subjectTitleAccentWord)
    return (
      <>
        {idx > 0 && <span style={{ color: '#fff' }}>{subjectTitle.slice(0, idx)}</span>}
        <span style={{ color: accentColor }}>{subjectTitleAccentWord}</span>
        {idx + subjectTitleAccentWord.length < subjectTitle.length && (
          <span style={{ color: '#fff' }}>{subjectTitle.slice(idx + subjectTitleAccentWord.length)}</span>
        )}
      </>
    )
  })()

  return (
    <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
      <EditableText
        value={subjectTitle}
        onChange={(v) => set({ subjectTitle: v })}
        style={titleStyle}
        displayContent={titleDisplay}
      />
      <EditableText
        value={captionText}
        onChange={(v) => set({ captionText: v })}
        multiline
        style={{
          fontFamily: `'${bodyFont}', sans-serif`,
          fontSize: 9,
          fontStyle: 'italic',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 440,
          whiteSpace: 'pre-wrap',
        }}
      />
    </div>
  )
}
