import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export function Pagination({ page, pageCount, total, pageSize, onPageChange }) {
  if (!total) return null
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink-muted">
        Showing <span className="font-medium text-ink">{start}</span>–<span className="font-medium text-ink">{end}</span> of <span className="font-medium text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={14} /> Prev
        </Button>
        <span className="min-w-16 text-center text-sm text-ink-muted">{page} / {pageCount}</span>
        <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
