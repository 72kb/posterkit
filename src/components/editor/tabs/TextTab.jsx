import usePosterStore from '../../../store/posterStore'
import TextInput from '../controls/TextInput'
import Toggle from '../../ui/Toggle'

export default function TextTab() {
  const s = usePosterStore()

  return (
    <div className="flex flex-col gap-4">
      <Section title="Top Bar">
        <Toggle label="Show event label" value={s.showEventLabel} onChange={(v) => s.set({ showEventLabel: v })} />
        <TextInput label="Event Label" value={s.eventLabel} onChange={(v) => s.set({ eventLabel: v })} />
        <Toggle label="Show alias pill" value={s.showAliasPill} onChange={(v) => s.set({ showAliasPill: v })} />
        <TextInput label="Alias Pill" value={s.aliasPill} onChange={(v) => s.set({ aliasPill: v })} />
      </Section>

      <Section title="Subject">
        <Toggle label="Show title" value={s.showSubjectTitle} onChange={(v) => s.set({ showSubjectTitle: v })} />
        <TextInput label="Subject Title" value={s.subjectTitle} onChange={(v) => s.set({ subjectTitle: v })} />
        <TextInput label="Accent Word" value={s.subjectTitleAccentWord} onChange={(v) => s.set({ subjectTitleAccentWord: v })} placeholder="Word to highlight" />
        <Toggle label="Show caption" value={s.showCaption} onChange={(v) => s.set({ showCaption: v })} />
        <TextInput label="Caption" value={s.captionText} onChange={(v) => s.set({ captionText: v })} multiline rows={3} />
      </Section>

      <Section title="Footer">
        <Toggle label="Show name stamp" value={s.showNameStamp} onChange={(v) => s.set({ showNameStamp: v })} />
        <TextInput label="Name Stamp" value={s.nameStamp} onChange={(v) => s.set({ nameStamp: v })} />
        <Toggle label="Show tagline" value={s.showTagline} onChange={(v) => s.set({ showTagline: v })} />
        <TextInput label="Tagline" value={s.tagline} onChange={(v) => s.set({ tagline: v })} />
        <Toggle label="Show tracklist" value={s.showTracklist} onChange={(v) => s.set({ showTracklist: v })} />
        <TextInput label="Tracklist / Tags" value={s.tracklist} onChange={(v) => s.set({ tracklist: v })} multiline rows={3} placeholder="tag · tag · tag" />
      </Section>

      <Section title="Photo Credit">
        <Toggle label="Show credit" value={s.showPhotoCredit} onChange={(v) => s.set({ showPhotoCredit: v })} />
        <TextInput label="Credit Line" value={s.photoCredit} onChange={(v) => s.set({ photoCredit: v })} placeholder="Photograph by…" />
        <Toggle label="Show location" value={s.showPhotoLocation} onChange={(v) => s.set({ showPhotoLocation: v })} />
        <TextInput label="Location / Year" value={s.photoLocation} onChange={(v) => s.set({ photoLocation: v })} placeholder="Location (Year)" />
      </Section>
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
