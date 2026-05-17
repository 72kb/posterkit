export default function ExportTab({ exportFns }) {
  const { exportPng, exportJpg, exportPdf, exporting } = exportFns

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs text-neutral-500 leading-relaxed">
        Export your poster as a high-resolution image or print-ready PDF.
        PNG/JPG use 2× pixel ratio. PDF uses 3× pixel ratio on A4.
      </div>

      <div className="flex flex-col gap-2">
        <ExportButton
          label="Export PNG"
          sub="Lossless · 2× · Best for sharing"
          disabled={exporting}
          onClick={exportPng}
        />
        <ExportButton
          label="Export JPG"
          sub="Compressed · 2× · Smaller file"
          disabled={exporting}
          onClick={exportJpg}
        />
        <ExportButton
          label="Export PDF"
          sub="Print-ready · 3× · A4 format"
          disabled={exporting}
          onClick={exportPdf}
        />
      </div>

      {exporting && (
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <div className="w-3 h-3 border border-neutral-400 border-t-white rounded-full animate-spin" />
          Rendering export…
        </div>
      )}
    </div>
  )
}

function ExportButton({ label, sub, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-between w-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed rounded px-3 py-3 transition-colors text-left"
    >
      <div>
        <div className="text-xs font-medium text-white">{label}</div>
        <div className="text-xs text-neutral-500 mt-0.5">{sub}</div>
      </div>
      <span className="text-neutral-500 text-sm">↓</span>
    </button>
  )
}
