import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

const palette = ['#38B8B3', '#2563EB', '#8B5CF6', '#0EA5E9', '#059669', '#D97706']

function colorFromName(name) {
  const seed = [...(name || '')].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return palette[seed % palette.length]
}

export function Avatar({ name, src, size = 'md', className }) {
  const sizes = { sm: 'h-8 w-8 text-[11px]', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' }
  if (src) return <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size], className)} />
  return (
    <span aria-hidden="true" className={cn('inline-flex items-center justify-center rounded-full font-semibold text-white', sizes[size], className)} style={{ backgroundColor: colorFromName(name) }}>
      {initials(name)}
    </span>
  )
}
