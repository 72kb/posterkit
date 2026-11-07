import { useId } from 'react'

export function Field({ label, hint, children, htmlFor, action }) {
  return (
    <div className="flex flex-col gap-1.5">
      {(label || action) && (
        <div className="flex items-center justify-between gap-2">
          {label && <label htmlFor={htmlFor} className="text-[13px] text-ink-300">{label}</label>}
          {action}
        </div>
      )}
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-ink-500">{hint}</p>}
    </div>
  )
}

export function TextField({ label, value, onChange, placeholder, multiline, rows = 3, hint, action, maxLength }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id} action={action}>
      {multiline ? (
        <textarea
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="field-input resize-none leading-relaxed"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="field-input"
        />
      )}
    </Field>
  )
}
