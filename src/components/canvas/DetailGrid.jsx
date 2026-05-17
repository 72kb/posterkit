import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'

export default function DetailGrid() {
  const { detailRows, showDetailGrid, showDivider, dividerOpacity, accentColor, bodyFont, updateDetailRow } = usePosterStore()

  if (!showDetailGrid) return null

  return (
    <div style={{ padding: '6px 20px 8px', flexShrink: 0 }}>
      {showDivider && (
        <div style={{
          height: '0.5px',
          backgroundColor: `rgba(255,255,255,${dividerOpacity})`,
          marginBottom: 8,
        }} />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
        {detailRows.map((row) => (
          <div key={row.id} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
            <EditableText
              value={row.label}
              onChange={(v) => updateDetailRow(row.id, 'label', v)}
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontSize: 7.5,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: accentColor,
                flexShrink: 0,
                minWidth: 52,
              }}
            />
            <EditableText
              value={row.value}
              onChange={(v) => updateDetailRow(row.id, 'value', v)}
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontSize: 7.5,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.4,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
