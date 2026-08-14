import { cn } from '../../utils/cn'

export function Input({ label, hint, error, id, className, required, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-0.5 text-danger">*</span> : null}
        </span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'h-10 w-full rounded-control border bg-white px-3 text-sm text-ink placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-2',
          error ? 'border-danger focus:ring-danger/20' : 'border-line focus:border-brand focus:ring-brand/20',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="mt-1.5 text-xs text-ink-muted">{hint}</p> : null}
    </label>
  )
}
