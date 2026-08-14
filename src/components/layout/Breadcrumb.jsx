import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-sm text-ink-muted md:flex">
      {items.map((item, index) => {
        const last = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? <ChevronRight size={14} /> : null}
            {item.to && !last ? <Link to={item.to} className="hover:text-ink">{item.label}</Link> : <span className={last ? 'font-medium text-ink' : ''}>{item.label}</span>}
          </span>
        )
      })}
    </nav>
  )
}
