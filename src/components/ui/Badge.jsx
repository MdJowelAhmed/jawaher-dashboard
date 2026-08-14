import { cn } from '../../utils/cn'

const tones = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-accent-soft text-accent',
  neutral: 'bg-slate-100 text-ink-muted',
  brand: 'bg-brand-soft text-brand-hover',
  violet: 'bg-violet-soft text-violet',
}

const statusMap = {
  active: 'success', published: 'success', completed: 'success', sent: 'success', success: 'success',
  suspended: 'danger', cancelled: 'danger', disabled: 'danger', archived: 'neutral', inactive: 'neutral',
  draft: 'warning', waiting: 'warning', pending: 'warning', scheduled: 'info', in_progress: 'info', info: 'info', warning: 'warning',
  complete: 'success',
}

export function statusTone(status) {
  return statusMap[status] || 'neutral'
}

export function Badge({ children, tone = 'neutral', className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', tones[tone] || tones.neutral, className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const label = String(status || '').replaceAll('_', ' ')
  return <Badge tone={statusTone(status)}>{label}</Badge>
}
