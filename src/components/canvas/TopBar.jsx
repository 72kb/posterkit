import { usePoster } from '../../store/usePoster'
import EditableText from './EditableText'
import { hexToRgba } from '../../lib/colorUtils'

export default function TopBar() {
  const { paletteDots, eventLabel, aliasPill, showAliasPill, showEventLabel, accentColor, textColor, bodyFont, set } = usePoster()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px 10px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
          {paletteDots.map((color, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
          ))}
        </div>
        {showEventLabel && (
          <EditableText
            value={eventLabel}
            onChange={(v) => set({ eventLabel: v })}
            onHide={() => set({ showEventLabel: false })}
            style={{
              fontFamily: `'${bodyFont}', sans-serif`,
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: accentColor,
              opacity: 0.9,
            }}
          />
        )}
      </div>

      {showAliasPill && (
        <EditableText
          value={aliasPill}
          onChange={(v) => set({ aliasPill: v })}
          onHide={() => set({ showAliasPill: false })}
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 8,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: hexToRgba(textColor, 0.55),
            border: `0.5px solid ${hexToRgba(textColor, 0.25)}`,
            borderRadius: 20,
            padding: '2px 8px',
          }}
        />
      )}
    </div>
  )
}
