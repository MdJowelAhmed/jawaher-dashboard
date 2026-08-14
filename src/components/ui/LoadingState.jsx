import { cn } from '../../utils/cn'

export function LoadingState({ label = 'Loading…', className }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 px-6 py-16 text-sm text-ink-muted', className)}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand" />
      {label}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-sm text-danger">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-3 text-sm font-medium text-brand hover:text-brand-hover">
          Try again
        </button>
      ) : null}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80', className)} />
}
