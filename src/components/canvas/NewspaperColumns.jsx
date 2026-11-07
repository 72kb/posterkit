const COLUMN_TEXT = `Harbour council approves new ferry timetable after months of debate · Morning markets open steady as traders weigh a quiet week ahead · City orchestra announces a season of free open-air concerts in the old quarter · Rainfall expected across the northern hills by the weekend, forecasters say · Local bakery celebrates fifty years on the same corner with a street party · Library extends evening hours for students during the exam period · Cyclists welcome the opening of a riverside path linking three districts · Museum unveils a restored collection of hand-drawn maps from the coast · Night market returns to the square with food stalls and live music · Volunteers plant four hundred trees along the eastern ring road · Regional rail line to add carriages on its busiest commuter routes · A new community garden takes shape on a disused car park downtown · Photographers gather for the annual walk through the industrial waterfront · School robotics team heads to the national finals next month · Artists open their studios to the public for a weekend of tours · The lighthouse keeper's cottage reopens as a small seaside café · Fishermen report a strong season as the waters stay calm · Theatre company stages an all-night reading of a classic play · Weather service warns of strong winds along the exposed headland · Residents vote to keep the old clock tower lit through the winter · `

const columnStyle = (font) => ({
  fontFamily: `'${font}', 'Libre Baskerville', Georgia, serif`,
  fontSize: 6.2,
  lineHeight: 1.55,
  color: '#ffffff',
  padding: '10px 7px',
  wordBreak: 'break-word',
  whiteSpace: 'normal',
})

export default function NewspaperColumns({ font, opacity }) {
  const text = COLUMN_TEXT.repeat(4)

  return (
    <>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 104, overflow: 'hidden',
        opacity, pointerEvents: 'none',
      }}>
        <div style={columnStyle(font)}>{text}</div>
      </div>

      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 104, overflow: 'hidden',
        opacity, pointerEvents: 'none',
      }}>
        <div style={columnStyle(font)}>{text}</div>
      </div>
    </>
  )
}
