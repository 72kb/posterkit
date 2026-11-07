import { AnimatePresence, motion } from 'motion/react'
import { usePoster } from '../../../store/usePoster'
import Section from '../../ui/Section'
import Toggle from '../../ui/Toggle'
import { TextField } from '../../ui/Field'

/** A visibility toggle with its field revealed underneath when on. */
function Toggled({ label, on, onToggle, children }) {
  return (
    <div className="flex flex-col gap-2">
      <Toggle label={label} value={on} onChange={onToggle} />
      <AnimatePresence initial={false}>
        {on && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pb-1 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TextTab() {
  const s = usePoster()
  const isPortrait = s.orientation === 'portrait'
  const isCompact = isPortrait && s.portraitStyle === 'compact'

  return (
    <div className="flex flex-col">
      {!isCompact && (
        <Section title="Top bar">
          <Toggled label="Event label" on={s.showEventLabel} onToggle={(v) => s.set({ showEventLabel: v })}>
            <TextField value={s.eventLabel} onChange={(v) => s.set({ eventLabel: v })} placeholder="Event · Location" />
          </Toggled>
          <Toggled label="Alias pill" on={s.showAliasPill} onToggle={(v) => s.set({ showAliasPill: v })}>
            <TextField value={s.aliasPill} onChange={(v) => s.set({ aliasPill: v })} placeholder="@handle or Vol. 1" maxLength={24} />
          </Toggled>
        </Section>
      )}

      <Section title="Headline">
        {isPortrait && (
          <Toggled label="Title" on={s.showSubjectTitle} onToggle={(v) => s.set({ showSubjectTitle: v })}>
            <TextField value={s.subjectTitle} onChange={(v) => s.set({ subjectTitle: v })} />
            <TextField
              label="Accent word"
              value={s.subjectTitleAccentWord}
              onChange={(v) => s.set({ subjectTitleAccentWord: v })}
              placeholder="A word from the title to colour"
              hint={s.subjectTitleAccentWord && !s.subjectTitle.includes(s.subjectTitleAccentWord) ? 'That word isn’t in the title (it’s case-sensitive).' : undefined}
            />
          </Toggled>
        )}
        <Toggled label="Caption" on={s.showCaption} onToggle={(v) => s.set({ showCaption: v })}>
          <TextField value={s.captionText} onChange={(v) => s.set({ captionText: v })} multiline rows={3} />
        </Toggled>
      </Section>

      {!isCompact && (
        <Section title="Footer">
          <Toggled label="Name stamp" on={s.showNameStamp} onToggle={(v) => s.set({ showNameStamp: v })}>
            <TextField value={s.nameStamp} onChange={(v) => s.set({ nameStamp: v })} />
          </Toggled>
          <Toggled label="Tagline" on={s.showTagline} onToggle={(v) => s.set({ showTagline: v })}>
            <TextField value={s.tagline} onChange={(v) => s.set({ tagline: v })} />
          </Toggled>
          <Toggled label="Tracklist / tags" on={s.showTracklist} onToggle={(v) => s.set({ showTracklist: v })}>
            <TextField value={s.tracklist} onChange={(v) => s.set({ tracklist: v })} multiline rows={3} placeholder="tag · tag · tag" />
          </Toggled>
        </Section>
      )}

      <Section title="Credit">
        <Toggled label="Photo credit" on={s.showPhotoCredit} onToggle={(v) => s.set({ showPhotoCredit: v })}>
          <TextField value={s.photoCredit} onChange={(v) => s.set({ photoCredit: v })} placeholder="Photograph by…" />
          <Toggle label="Show location" value={s.showPhotoLocation} onChange={(v) => s.set({ showPhotoLocation: v })} />
          {s.showPhotoLocation && (
            <TextField value={s.photoLocation} onChange={(v) => s.set({ photoLocation: v })} placeholder="Location (Year)" />
          )}
        </Toggled>
      </Section>
    </div>
  )
}
