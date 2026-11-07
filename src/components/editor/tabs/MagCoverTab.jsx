import { AnimatePresence, motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { usePoster } from '../../../store/usePoster'
import { MAX_COVER_LINES } from '../../../store/posterStore'
import Section from '../../ui/Section'
import Slider from '../../ui/Slider'
import Button from '../../ui/Button'
import { TextField } from '../../ui/Field'

const LAYOUT_NAMES = { standard: 'Classic', capital: 'Capital', couture: 'Couture', circuit: 'Circuit' }

export default function MagCoverTab() {
  const s = usePoster()
  const { magLayout, magTemplateId, set } = s
  const isCapital = magLayout === 'capital'
  const isCouture = magLayout === 'couture'
  const isCircuit = magLayout === 'circuit'
  const hasSubject = isCapital || isCouture || isCircuit

  return (
    <div className="flex flex-col">
      <div className="mb-1 mt-2 inline-flex items-center gap-2 self-start rounded-full border border-ink-700 bg-ink-850 px-3 py-1 text-[11px] text-ink-400">
        Layout <span className="font-medium text-ink-100">{LAYOUT_NAMES[magLayout] || 'Classic'}</span>
        <span className="text-ink-600">·</span> change it in Templates
      </div>

      <Section title="Masthead">
        <TextField label="Publication name" value={s.magTitle} onChange={(v) => set({ magTitle: v })} placeholder="THE MAGAZINE" />
        {(isCapital || isCouture) && (
          <TextField
            label={isCouture ? 'Edition' : 'Spine text'}
            value={s.magSpineText}
            onChange={(v) => set({ magSpineText: v })}
            placeholder={isCouture ? 'PARIS' : 'CAPITAL · AFRICA EDITION'}
          />
        )}
        <TextField label="Issue / date" value={s.magIssue} onChange={(v) => set({ magIssue: v })} placeholder="Volume 01 · April 2026" />
        {isCapital && (
          <TextField label="Ticker strip" value={s.magTickerLines} onChange={(v) => set({ magTickerLines: v })} placeholder="Story one · Story two · Story three" />
        )}
      </Section>

      {hasSubject && (
        <Section title={isCouture ? 'Cover star' : 'Subject'}>
          <TextField label="Name" value={s.magSubjectName} onChange={(v) => set({ magSubjectName: v })} placeholder="Subject name" />
          {(isCapital || isCircuit) && (
            <TextField label="Role" value={s.magSubjectRole} onChange={(v) => set({ magSubjectRole: v })} multiline rows={2} placeholder="Founder, Company" />
          )}
          <TextField label="Pull quote" value={s.magPullQuote} onChange={(v) => set({ magPullQuote: v })} multiline rows={3} placeholder={'"A quote from\nthe subject."'} />
        </Section>
      )}

      <Section title="Cover story">
        <TextField
          label="Headline"
          value={s.magMainLine}
          onChange={(v) => set({ magMainLine: v })}
          multiline={isCapital || isCouture}
          rows={2}
          hint={isCapital || isCouture ? 'Line breaks are kept.' : undefined}
        />
        {!isCouture && (
          <TextField label="Subtitle" value={s.magMainSub} onChange={(v) => set({ magMainSub: v })} multiline rows={2} />
        )}
        {isCapital && (
          <TextField label="“Plus” line" value={s.magPlusLine} onChange={(v) => set({ magPlusLine: v })} placeholder="Leave empty to hide" />
        )}
      </Section>

      {!isCapital && (
        <Section title="Cover lines">
          <AnimatePresence initial={false}>
            {s.magCoverLines.map((line) => (
              <motion.div
                key={line.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-1.5 rounded-xl border border-ink-800 bg-ink-850 p-1.5"
              >
                <input
                  value={line.label}
                  onChange={(e) => s.updateMagCoverLine(line.id, 'label', e.target.value)}
                  placeholder="LABEL"
                  aria-label="Cover line label"
                  className="w-24 min-w-0 rounded-lg bg-ink-800 px-2 py-1.5 font-mono text-[11px] uppercase text-stamp placeholder-ink-500 focus:outline-none focus:ring-1 focus:ring-stamp/50"
                />
                <input
                  value={line.text}
                  onChange={(e) => s.updateMagCoverLine(line.id, 'text', e.target.value)}
                  placeholder="Cover line"
                  aria-label="Cover line text"
                  className="min-w-0 flex-1 rounded-lg bg-ink-800 px-2 py-1.5 text-xs text-ink-100 placeholder-ink-500 focus:outline-none focus:ring-1 focus:ring-stamp/50"
                />
                <button
                  type="button"
                  onClick={() => s.removeMagCoverLine(line.id)}
                  aria-label="Remove cover line"
                  className="rounded-md p-1 text-ink-500 transition-colors hover:bg-ink-750 hover:text-stamp"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {s.magCoverLines.length < MAX_COVER_LINES && (
            <Button variant="dashed" icon={Plus} onClick={s.addMagCoverLine}>Add cover line</Button>
          )}
          <p className="text-xs text-ink-500">The label is the coloured prefix (e.g. EXCLUSIVE). Leave it blank to hide it.</p>
        </Section>
      )}

      {(isCapital || isCouture) && (
        <Section title="Fine print">
          <TextField label="Bottom strip" value={s.magFinePrint} onChange={(v) => set({ magFinePrint: v })} multiline rows={2} placeholder="Prices, edition info… (empty hides it)" />
        </Section>
      )}

      {magTemplateId === 'broadsheet' && (
        <Section title="Newsprint columns">
          <Slider label="Column opacity" value={Math.round(s.magColumnOpacity * 100)} min={0} max={25} step={1} format={(v) => `${v}%`} onChange={(v) => set({ magColumnOpacity: v / 100 })} />
        </Section>
      )}
    </div>
  )
}
