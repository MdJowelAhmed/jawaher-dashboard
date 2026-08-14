import { cn } from '../../utils/cn'

export function Textarea({ label, error, id, className, required, rows = 4, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-0.5 text-danger">*</span> : null}
        </span>
      ) : null}
      <textarea
        id={inputId}
        rows={rows}
        className={cn(
          'w-full rounded-control border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2',
          error ? 'border-danger focus:ring-danger/20' : 'border-line focus:border-brand focus:ring-brand/20',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </label>
  )
}
