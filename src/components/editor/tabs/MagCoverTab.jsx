import usePosterStore from '../../../store/posterStore'
import TextInput from '../controls/TextInput'
import SliderControl from '../controls/SliderControl'

export default function MagCoverTab() {
  const {
    magLayout, magTemplateId,
    magTitle, magIssue, magMainLine, magMainSub, magCoverLines,
    magTickerLines, magSpineText, magSubjectName, magSubjectRole,
    magPullQuote, magPlusLine, magFinePrint,
    magColumnOpacity,
    set, addMagCoverLine, removeMagCoverLine, updateMagCoverLine,
  } = usePosterStore()

  const isForbes = magLayout === 'forbes'
  const isVogue  = magLayout === 'vogue'
  const isWired  = magLayout === 'wired'

  return (
    <div className="flex flex-col gap-4">

      {/* ── Masthead ── */}
      <Section title="Masthead">
        <TextInput label="Publication name" value={magTitle} onChange={(v) => set({ magTitle: v })} placeholder="VOGUE" />
        {(isForbes || isVogue) && (
          <TextInput label={isVogue ? 'Edition (e.g. BRITISH)' : 'Spine text'} value={magSpineText} onChange={(v) => set({ magSpineText: v })} placeholder={isVogue ? 'BRITISH' : 'FORBES AFRICA'} />
        )}
        <TextInput label="Issue / date" value={magIssue} onChange={(v) => set({ magIssue: v })} placeholder={isVogue ? 'SEPT 2026' : 'August | September 2026'} />
        {isForbes && (
          <TextInput label="Ticker (top strip)" value={magTickerLines} onChange={(v) => set({ magTickerLines: v })} placeholder="Story One · Story Two · Story Three" />
        )}
      </Section>

      {/* ── Subject (Forbes + Vogue + Wired) ── */}
      {(isForbes || isVogue || isWired) && (
        <Section title={isVogue ? 'Cover Star' : 'Subject'}>
          <TextInput label={isVogue ? 'Name (italic, left side)' : 'Subject name'} value={magSubjectName} onChange={(v) => set({ magSubjectName: v })} placeholder={isVogue ? 'Linda Evangelista' : isWired ? 'SUBJECT NAME' : 'IDRIS ELBA'} />
          {(isForbes || isWired) && (
            <TextInput label="Roles / title" value={magSubjectRole} onChange={(v) => set({ magSubjectRole: v })} multiline rows={2} placeholder={isWired ? 'CEO, Company Name' : 'Actor, Entrepreneur,\nMusician, Philanthropist'} />
          )}
          <TextInput label="Pull quote" value={magPullQuote} onChange={(v) => set({ magPullQuote: v })} multiline rows={3} placeholder={isVogue ? '"A quote from\nthe cover star."' : isWired ? '"THE FUTURE\nIS ALREADY\nHERE."' : '"I WANT\nAFRICAN CINEMA\nTO BE GLOBAL."'} />
        </Section>
      )}

      {/* ── Main Story ── */}
      <Section title={isVogue ? 'Cover Story (bottom)' : 'Main Story'}>
        <TextInput
          label={isForbes ? 'Headline (line break = new line)' : isVogue ? 'Cover story title (italic)' : isWired ? 'Headline (massive, bottom)' : 'Cover line'}
          value={magMainLine}
          onChange={(v) => set({ magMainLine: v })}
          multiline={isForbes || isVogue || isWired}
          rows={2}
          placeholder={isForbes ? 'NEW\nDIRECTION' : isVogue ? 'THE BIG\nFASHION ISSUE' : isWired ? 'OPEN AI' : 'Cover Story Title'}
        />
        {!isVogue && (
          <TextInput
            label={isForbes ? 'Subtitle (all caps)' : isWired ? 'Subtitle (all caps)' : 'Subtitle'}
            value={magMainSub}
            onChange={(v) => set({ magMainSub: v })}
            multiline rows={2}
            placeholder={isWired ? 'HOW ONE COMPANY IS RESHAPING THE WORLD' : 'A brief description of the main feature…'}
          />
        )}
        {isForbes && (
          <TextInput label="PLUS line" value={magPlusLine} onChange={(v) => set({ magPlusLine: v })} placeholder="Venture capital in entertainment" />
        )}
      </Section>

      {/* ── Cover lines (standard + vogue) ── */}
      {!isForbes && (
        <Section title="Cover Lines">
          <div className="flex flex-col gap-2">
            {magCoverLines.map((line) => (
              <div key={line.id} className="flex flex-col gap-1.5 bg-neutral-800/50 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <input
                    value={line.label}
                    onChange={(e) => updateMagCoverLine(line.id, 'label', e.target.value)}
                    placeholder="LABEL"
                    className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 uppercase"
                  />
                  <input
                    value={line.text}
                    onChange={(e) => updateMagCoverLine(line.id, 'text', e.target.value)}
                    placeholder="cover line text"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                  />
                  <button onClick={() => removeMagCoverLine(line.id)} className="text-neutral-600 hover:text-red-400 text-sm leading-none flex-shrink-0">✕</button>
                </div>
              </div>
            ))}
            {magCoverLines.length < 5 && (
              <button onClick={addMagCoverLine} className="w-full py-2 border border-dashed border-neutral-600 hover:border-neutral-400 rounded text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                + Add cover line
              </button>
            )}
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">Label is the accent prefix (e.g. EXCLUSIVE). Leave blank to hide.</p>
        </Section>
      )}

      {/* ── Fine print (Forbes + Vogue only) ── */}
      {(isForbes || isVogue) && (
        <Section title="Fine Print">
          <TextInput
            label={isVogue ? 'Names strip (bottom)' : 'Bottom strip'}
            value={magFinePrint}
            onChange={(v) => set({ magFinePrint: v })}
            multiline rows={2}
            placeholder={isVogue ? 'KATE MOSS · NAOMI CAMPBELL · ADUT AKECH · …' : 'Country prices, edition info…'}
          />
        </Section>
      )}

      {/* ── Newspaper columns (Times only) ── */}
      {magTemplateId === 'the-times' && (
        <Section title="Newspaper Columns">
          <SliderControl
            label="Column opacity"
            value={Math.round(magColumnOpacity * 100)}
            min={0} max={25} step={1}
            format={(v) => `${v}%`}
            onChange={(v) => set({ magColumnOpacity: v / 100 })}
          />
        </Section>
      )}

    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 pb-1">{title}</div>
      {children}
    </div>
  )
}
