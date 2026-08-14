import { cn } from '../../utils/cn'

export function Card({ className, children }) {
  return <section className={cn('rounded-card border border-line bg-white shadow-card', className)}>{children}</section>
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-line px-5 py-4', className)}>
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
