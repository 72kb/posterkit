import {
  Download, Image as ImageIcon, LayoutTemplate, ListOrdered, Newspaper, Palette, PanelsTopLeft, StickyNote, Type,
} from 'lucide-react'
import TemplatesTab from './TemplatesTab'
import PhotoTab from './PhotoTab'
import LayoutTab from './LayoutTab'
import TextTab from './TextTab'
import DesignTab from './DesignTab'
import DetailsTab from './DetailsTab'
import LabelsTab from './LabelsTab'
import MagCoverTab from './MagCoverTab'
import ExportTab from './ExportTab'

const T = {
  templates: { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  photo: { id: 'photo', label: 'Photo', icon: ImageIcon },
  layout: { id: 'layout', label: 'Layout', icon: PanelsTopLeft },
  text: { id: 'text', label: 'Text', icon: Type },
  style: { id: 'style', label: 'Style', icon: Palette },
  details: { id: 'details', label: 'Details', icon: ListOrdered },
  labels: { id: 'labels', label: 'Labels', icon: StickyNote },
  cover: { id: 'cover', label: 'Cover', icon: Newspaper },
  export: { id: 'export', label: 'Export', icon: Download },
}

const FORMAT_TABS = {
  editorial: ['templates', 'photo', 'layout', 'text', 'style', 'details', 'export'],
  magazine: ['templates', 'photo', 'cover', 'style', 'export'],
  annotated: ['photo', 'labels', 'style', 'export'],
}

export function tabsFor(posterStyle) {
  return (FORMAT_TABS[posterStyle] || FORMAT_TABS.editorial).map((id) => T[id])
}

export const TAB_COMPONENTS = {
  templates: TemplatesTab,
  photo: PhotoTab,
  layout: LayoutTab,
  text: TextTab,
  style: DesignTab,
  details: DetailsTab,
  labels: LabelsTab,
  cover: MagCoverTab,
  export: ExportTab,
}

export const TAB_META = {
  templates: { title: 'Templates', blurb: 'Restyle colours, type and texture in one click. Your text and photo stay put.' },
  photo: { title: 'Photo', blurb: 'Drop in an image, then frame it. Photos never leave your device.' },
  layout: { title: 'Layout', blurb: 'Orientation and how the photo and text share the page.' },
  text: { title: 'Text', blurb: 'Edit copy here, or click any text on the poster to edit it in place.' },
  style: { title: 'Style', blurb: 'Colour, typography and film-like finishing.' },
  details: { title: 'Details', blurb: 'The small label/value grid. Drag to reorder.' },
  labels: { title: 'Labels', blurb: 'Handwritten notes you can drag anywhere on the photo.' },
  cover: { title: 'Cover', blurb: 'Masthead, cover story and the lines that sell the issue.' },
  export: { title: 'Export', blurb: 'Download high-resolution files or back up your project.' },
}
