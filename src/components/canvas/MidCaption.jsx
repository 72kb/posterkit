import { usePoster } from '../../store/usePoster'
import EditableText from './EditableText'
import { hexToRgba } from '../../lib/colorUtils'

export default function MidCaption() {
  const { subjectTitle, subjectTitleAccentWord, showSubjectTitle, captionText, showCaption, displayFont, bodyFont, accentColor, textColor, set } = usePoster()

  const titleStyle = {
    fontFamily: `'${displayFont}', Impact, sans-serif`,
    fontSize: 36,
    lineHeight: 1.0,
    letterSpacing: '0.02em',
    marginBottom: 8,
    color: textColor,
  }

  const titleDisplay = (() => {
    if (!subjectTitleAccentWord || !subjectTitle.includes(subjectTitleAccentWord)) {
      return <span style={{ color: textColor }}>{subjectTitle}</span>
    }
    const idx = subjectTitle.indexOf(subjectTitleAccentWord)
    return (
      <>
        {idx > 0 && <span style={{ color: textColor }}>{subjectTitle.slice(0, idx)}</span>}
        <span style={{ color: accentColor }}>{subjectTitleAccentWord}</span>
        {idx + subjectTitleAccentWord.length < subjectTitle.length && (
          <span style={{ color: textColor }}>{subjectTitle.slice(idx + subjectTitleAccentWord.length)}</span>
        )}
      </>
    )
  })()

  return (
    <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
      {showSubjectTitle && (
        <EditableText
          value={subjectTitle}
          onChange={(v) => set({ subjectTitle: v })}
          onHide={() => set({ showSubjectTitle: false })}
          style={titleStyle}
          displayContent={titleDisplay}
        />
      )}
      {showCaption && (
        <EditableText
          value={captionText}
          onChange={(v) => set({ captionText: v })}
          onHide={() => set({ showCaption: false })}
          multiline
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 9,
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: hexToRgba(textColor, 0.65),
            maxWidth: 440,
            whiteSpace: 'pre-wrap',
          }}
        />
      )}
    </div>
  )
}
