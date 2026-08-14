import { useCallback, useEffect, useMemo, useState } from 'react'
import { completeTicket, getTicketStats, getTickets } from '../api/ticketsApi'
import { PageHeader } from '../components/common/PageHeader'
import { SearchBar } from '../components/common/SearchBar'
import { FilterBar } from '../components/common/FilterBar'
import { TicketStats } from '../components/reports/TicketStats'
import { TicketDetails } from '../components/reports/TicketDetails'
import { TicketStatusBadge } from '../components/reports/TicketStatusBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { Modal } from '../components/ui/Modal'
import { Select } from '../components/ui/Select'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../context/ToastContext'
import { PAGE_SIZE, TICKET_STATUSES } from '../utils/constants'
import { formatDate } from '../utils/format'

export function ReportsPage() {
  const { push } = useToast()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [status, setStatus] = useState('all')
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], total: 0, pageCount: 1 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [working, setWorking] = useState(false)

  const query = useMemo(
    () => ({ search: debouncedSearch, status, sortKey, sortDir, page, pageSize: PAGE_SIZE }),
    [debouncedSearch, status, sortKey, sortDir, page],
  )

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    Promise.all([getTickets(query), getTicketStats()])
      .then(([nextResult, nextStats]) => {
        setResult(nextResult)
        setStats(nextStats)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [query])

  useEffect(() => { load() }, [load])
  useEffect(() => setPage(1), [debouncedSearch, status])

  function onSort(key) {
    if (sortKey === key) setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  async function onComplete() {
    setWorking(true)
    try {
      const { ticket, notification } = await completeTicket(selected.id)
      setSelected(ticket)
      push({
        message: notification
          ? `Ticket completed. ${notification.message}`
          : 'Ticket already completed.',
      })
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  return (
    <div>
      <PageHeader title="Reports" description="Manage user support tickets and resolve reported issues." />
      <div className="mb-6">
        <TicketStats stats={stats} loading={loading && !stats} />
      </div>
      <Card>
        <div className="border-b border-line px-4 py-4">
          <FilterBar className="lg:flex-wrap">
            <SearchBar className="w-full lg:max-w-sm" value={search} onChange={setSearch} placeholder="Search tickets, users, subjects..." />
            <Select value={status} onChange={(event) => setStatus(event.target.value)} className="lg:w-44">
              <option value="all">All Statuses</option>
              {TICKET_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </FilterBar>
        </div>
        <DataTable
          columns={[
            { key: 'id', header: 'Ticket ID', sortKey: 'id', render: (row) => <button type="button" className="font-medium text-ink hover:text-brand" onClick={() => setSelected(row)}>#{row.id}</button> },
            { key: 'userName', header: 'User', sortKey: 'userName' },
            { key: 'subject', header: 'Subject', render: (row) => <p className="max-w-xs">{row.subject}</p> },
            { key: 'createdAt', header: 'Submitted', sortKey: 'createdAt', render: (row) => formatDate(row.createdAt) },
            { key: 'status', header: 'Status', render: (row) => <TicketStatusBadge status={row.status} /> },
            { key: 'actions', header: 'Action', render: (row) => <Button size="sm" variant="ghost" onClick={() => setSelected(row)}>View</Button> },
          ]}
          rows={result.data}
          loading={loading}
          error={error}
          onRetry={load}
          emptyTitle="No support tickets found."
          emptyDescription="New user support requests will appear here."
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
          page={page}
          pageCount={result.pageCount}
          total={result.total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Ticket #${selected.id}` : 'Ticket'}
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
      >
        {selected ? (
          <TicketDetails
            ticket={selected}
            working={working}
            onComplete={onComplete}
          />
        ) : null}
      </Modal>
    </div>
  )
}
