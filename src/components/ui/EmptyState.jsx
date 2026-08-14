import { cn } from '../../utils/cn'
import { BrandLogo } from '../common/BrandLogo'

export function EmptyState({ icon: Icon, title = 'Nothing to show', description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      {Icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Icon size={22} />
        </div>
      ) : (
        <BrandLogo variant="mark" size="md" className="mb-4" />
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
