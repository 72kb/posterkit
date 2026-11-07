import { forwardRef } from 'react'

const IconButton = forwardRef(function IconButton(
  { icon: Icon, label, active = false, size = 'md', className = '', ...rest },
  ref,
) {
  const dims = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9'
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95
        disabled:pointer-events-none disabled:opacity-30
        ${active ? 'bg-ink-750 text-ink-100' : 'text-ink-300 hover:bg-ink-800 hover:text-ink-100'} ${dims} ${className}`}
    >
      <Icon size={size === 'sm' ? 15 : 17} strokeWidth={1.9} aria-hidden="true" />
    </button>
  )
})

export default IconButton
