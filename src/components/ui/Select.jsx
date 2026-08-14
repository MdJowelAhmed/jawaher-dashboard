import { cn } from '../../utils/cn'

export function Select({ label, error, id, className, required, children, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-0.5 text-danger">*</span> : null}
        </span>
      ) : null}
      <select
        id={inputId}
        className={cn(
          'h-10 w-full rounded-control border bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2',
          error ? 'border-danger focus:ring-danger/20' : 'border-line focus:border-brand focus:ring-brand/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </label>
  )
}
