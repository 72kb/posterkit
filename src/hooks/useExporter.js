import { useCallback, useState } from 'react'
import { exportPoster } from '../lib/exportPoster'
import { toast } from '../lib/toast'

export function useExporter(posterRef, name) {
  const [exporting, setExporting] = useState(null) // format being exported

  const run = useCallback(async (format, opts = {}) => {
    if (exporting) return
    setExporting(format)
    try {
      await exportPoster(posterRef.current, format, { name, ...opts })
      toast.success(`Exported ${format.toUpperCase()}`, { description: 'Check your downloads folder.' })
    } catch (err) {
      console.error(`${format} export failed`, err)
      toast.error('Export failed', { description: err?.message || 'Something went wrong while rendering.' })
    } finally {
      setExporting(null)
    }
  }, [posterRef, name, exporting])

  return { run, exporting }
}
