import { forwardRef } from 'react'

const VARIANTS = {
  primary: 'bg-stamp text-white hover:bg-stamp-400 active:bg-stamp-600 shadow-[0_8px_24px_-8px_rgba(255,77,46,0.6)]',
  light: 'bg-ink-100 text-ink-950 hover:bg-white',
  secondary: 'bg-ink-800 text-ink-100 border border-ink-700 hover:bg-ink-750 hover:border-ink-600',
  ghost: 'bg-transparent text-ink-300 hover:bg-ink-800 hover:text-ink-100',
  danger: 'bg-red-600/90 text-white hover:bg-red-500',
  dashed: 'bg-transparent border border-dashed border-ink-600 text-ink-300 hover:border-stamp/60 hover:text-ink-100 hover:bg-stamp/5',
}

const SIZES = {
  xs: 'h-7 px-2.5 text-[11px] gap-1.5 rounded-md',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-[13px] gap-2 rounded-lg',
  lg: 'h-12 px-6 text-sm gap-2.5 rounded-xl',
}

const Button = forwardRef(function Button(
  { as: Comp = 'button', variant = 'secondary', size = 'md', icon: Icon, iconRight: IconRight, className = '', children, ...rest },
  ref,
) {
  const extra = Comp === 'button' ? { type: rest.type || 'button' } : {}
  return (
    <Comp
      ref={ref}
      {...extra}
      {...rest}
      className={`inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-150
        active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {Icon && <Icon size={size === 'lg' ? 18 : size === 'xs' ? 13 : 15} strokeWidth={2} aria-hidden="true" />}
      {children}
      {IconRight && <IconRight size={size === 'lg' ? 18 : 15} strokeWidth={2} aria-hidden="true" />}
    </Comp>
  )
})

export default Button
