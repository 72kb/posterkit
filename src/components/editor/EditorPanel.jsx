import { useState } from 'react'
import usePosterStore from '../../store/posterStore'
import { loadFont, HANDWRITING_FONTS } from '../../lib/fonts'
import Tabs from '../ui/Tabs'
import PhotoTab from './tabs/PhotoTab'
import LayoutTab from './tabs/LayoutTab'
import TextTab from './tabs/TextTab'
import DesignTab from './tabs/DesignTab'
import DetailsTab from './tabs/DetailsTab'
import ExportTab from './tabs/ExportTab'
import TemplatesTab from './tabs/TemplatesTab'
import LabelsTab from './tabs/LabelsTab'
import MagCoverTab from './tabs/MagCoverTab'
import MagTemplatesTab from './tabs/MagTemplatesTab'

const FORMAT_TABS = {
  editorial: ['Templates', 'Photo', 'Layout', 'Text', 'Design', 'Details', 'Export'],
  annotated: ['Photo', 'Labels', 'Design', 'Export'],
  magazine:  ['Templates', 'Photo', 'Cover', 'Design', 'Export'],
}

const FORMATS = [
  { id: 'editorial', label: 'Editorial' },
  { id: 'annotated', label: 'Annotated' },
  { id: 'magazine',  label: 'Magazine' },
]

export default function EditorPanel({ exportFns }) {
  const { posterStyle, set } = usePosterStore()
  const [active, setActive] = useState('Templates')

  const tabs = FORMAT_TABS[posterStyle] ?? FORMAT_TABS.editorial

  const switchFormat = async (format) => {
    if (format === posterStyle) return
    if (format === 'annotated') {
      const caveat = HANDWRITING_FONTS.find((f) => f.name === 'Caveat')
      if (caveat) await loadFont(caveat.url)
    }
    set({ posterStyle: format })
    setActive(FORMAT_TABS[format][0])
  }

  // If the active tab isn't in the current format's tab list, reset it
  const visibleActive = tabs.includes(active) ? active : tabs[0]

  const renderTab = () => {
    switch (visibleActive) {
      case 'Templates': return posterStyle === 'magazine' ? <MagTemplatesTab /> : <TemplatesTab />
      case 'Photo':     return <PhotoTab />
      case 'Layout':    return <LayoutTab />
      case 'Text':      return <TextTab />
      case 'Design':    return <DesignTab />
      case 'Details':   return <DetailsTab />
      case 'Labels':    return <LabelsTab />
      case 'Cover':     return <MagCoverTab />
      case 'Export':    return <ExportTab exportFns={exportFns} />
      default:          return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Format switcher */}
      <div className="px-4 pt-4 pb-3 border-b border-neutral-800 flex-shrink-0">
        <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Format</div>
        <div className="flex gap-1.5">
          {FORMATS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => switchFormat(id)}
              className={`flex-1 py-1.5 rounded text-[11px] font-medium transition-colors ${
                posterStyle === id
                  ? 'bg-white text-black'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Tabs tabs={tabs} active={visibleActive} onChange={setActive} />
      <div className="flex-1 overflow-y-auto p-4">
        {renderTab()}
      </div>
    </div>
  )
}
