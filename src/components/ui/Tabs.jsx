export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-neutral-700 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors focus:outline-none
            ${active === tab
              ? 'text-white border-b-2 border-white -mb-px'
              : 'text-neutral-500 hover:text-neutral-300'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
