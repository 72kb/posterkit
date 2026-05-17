export default function Button({ children, onClick, variant = 'default', disabled, className = '' }) {
  const base = 'px-3 py-1.5 text-xs font-medium rounded transition-colors focus:outline-none'
  const variants = {
    default: 'bg-neutral-700 hover:bg-neutral-600 text-white',
    primary: 'bg-white hover:bg-neutral-200 text-black',
    danger: 'bg-red-700 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-neutral-700 text-neutral-300',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
