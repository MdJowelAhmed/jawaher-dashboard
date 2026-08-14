const numberFormatter = new Intl.NumberFormat('en-US')

export function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return numberFormatter.format(value)
}

export function formatPoints(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return `${numberFormatter.format(Number(value))} Points`
}

export function formatPercent(value, { sign = true } = {}) {
  if (value == null || Number.isNaN(value)) return '—'
  const prefix = sign && value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}

export function formatDate(value, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', options)
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatRelativeTime(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  const diff = Date.now() - date.getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function fullName(user) {
  if (!user) return 'Unknown'
  return [user.firstName, user.lastName].filter(Boolean).join(' ')
}

export function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
