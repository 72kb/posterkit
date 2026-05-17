import usePosterStore from '../../store/posterStore'
import EditableText from './EditableText'

export default function TopBar() {
  const { paletteDots, eventLabel, aliasPill, showAliasPill, accentColor, bodyFont, set } = usePosterStore()

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
        <EditableText
          value={eventLabel}
          onChange={(v) => set({ eventLabel: v })}
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
      </div>

      {showAliasPill && (
        <EditableText
          value={aliasPill}
          onChange={(v) => set({ aliasPill: v })}
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontSize: 8,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            border: '0.5px solid rgba(255,255,255,0.25)',
            borderRadius: 20,
            padding: '2px 8px',
          }}
        />
      )}
    </div>
  )
}
