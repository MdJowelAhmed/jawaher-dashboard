import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { EmptyState } from './EmptyState'
import { ErrorState, LoadingState } from './LoadingState'
import { Pagination } from './Pagination'

export function DataTable({ columns, rows, loading, error, onRetry, emptyTitle, emptyDescription, sortKey, sortDir, onSort, page, pageCount, total, pageSize, onPageChange }) {
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (!rows?.length) return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-canvas/80">
              {columns.map((column) => {
                const sortable = Boolean(column.sortKey && onSort)
                const active = sortKey === column.sortKey
                return (
                  <th key={column.key} className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted', column.align === 'right' && 'text-right')}>
                    {sortable ? (
                      <button type="button" onClick={() => onSort(column.sortKey)} className="inline-flex items-center gap-1 hover:text-ink">
                        {column.header}
                        {active ? (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-40" />}
                      </button>
                    ) : column.header}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-b-0 hover:bg-canvas/70">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-3.5 text-sm text-ink align-middle', column.align === 'right' && 'text-right')}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onPageChange ? <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={onPageChange} /> : null}
    </div>
  )
}
