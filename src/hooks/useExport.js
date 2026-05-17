import { useState } from 'react'
import { toPng, toJpeg } from 'html-to-image'
import jsPDF from 'jspdf'
import usePosterStore from '../store/posterStore'

export function useExport(posterRef) {
  const [exporting, setExporting] = useState(false)
  const { orientation, nameStamp } = usePosterStore()

  const getFilename = (ext) => {
    const slug = (nameStamp || 'posterkit').toLowerCase().replace(/\s+/g, '-')
    const date = new Date().toISOString().slice(0, 10)
    return `${slug}-${date}.${ext}`
  }

  const triggerDownload = (dataUrl, filename) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
  }

  const blurActive = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }

  const exportPng = async () => {
    if (!posterRef.current) return
    blurActive()
    setExporting(true)
    try {
      await document.fonts.ready
      const dataUrl = await toPng(posterRef.current, { pixelRatio: 2 })
      triggerDownload(dataUrl, getFilename('png'))
    } catch (err) {
      console.error('PNG export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const exportJpg = async () => {
    if (!posterRef.current) return
    blurActive()
    setExporting(true)
    try {
      await document.fonts.ready
      const dataUrl = await toJpeg(posterRef.current, { pixelRatio: 2, quality: 0.92 })
      triggerDownload(dataUrl, getFilename('jpg'))
    } catch (err) {
      console.error('JPG export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const exportPdf = async () => {
    if (!posterRef.current) return
    blurActive()
    setExporting(true)
    try {
      await document.fonts.ready
      const dataUrl = await toPng(posterRef.current, { pixelRatio: 3 })
      const isPortrait = orientation === 'portrait'
      const pdfOrientation = isPortrait ? 'portrait' : 'landscape'
      const pdf = new jsPDF({ orientation: pdfOrientation, unit: 'mm', format: 'a4' })
      const pageWidth = isPortrait ? 210 : 297
      const pageHeight = isPortrait ? 297 : 210
      // Add 2mm bleed inset
      pdf.addImage(dataUrl, 'PNG', 2, 2, pageWidth - 4, pageHeight - 4)
      pdf.save(getFilename('pdf'))
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return { exportPng, exportJpg, exportPdf, exporting }
}
