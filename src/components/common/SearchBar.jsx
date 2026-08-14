import { Search } from 'lucide-react'
import { cn } from '../../utils/cn'

export function SearchBar({ value, onChange, placeholder = 'Search', className }) {
  return (
    <label className={cn('relative block', className)}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-control border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  )
}
