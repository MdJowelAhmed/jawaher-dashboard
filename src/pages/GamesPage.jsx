import { useEffect, useMemo, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cancelGame, getGames } from '../api/gamesApi'
import { PageHeader } from '../components/common/PageHeader'
import { SearchBar } from '../components/common/SearchBar'
import { FilterBar } from '../components/common/FilterBar'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { Select } from '../components/ui/Select'
import { Tabs } from '../components/ui/Tabs'
import { StatusBadge } from '../components/ui/Badge'
import { Dropdown, DropdownItem } from '../components/ui/Dropdown'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../context/ToastContext'
import { GAME_STATUSES, PAGE_SIZE } from '../utils/constants'
import { formatDateTime } from '../utils/format'

export function GamesPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [tab, setTab] = useState('online')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [status, setStatus] = useState('all')
  const [sortKey, setSortKey] = useState('startedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], total: 0, pageCount: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)
  const [working, setWorking] = useState(false)

  const query = useMemo(() => ({ tab, search: debouncedSearch, status, sortKey, sortDir, page, pageSize: PAGE_SIZE }), [tab, debouncedSearch, status, sortKey, sortDir, page])

  function load() {
    setLoading(true)
    setError('')
    getGames(query).then(setResult).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [query])
  useEffect(() => setPage(1), [tab, debouncedSearch, status])

  function onSort(key) {
    if (sortKey === key) setSortDir((value) => (value === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  async function onCancel() {
    setWorking(true)
    try {
      await cancelGame(pending.id)
      push({ message: 'Game cancelled.' })
      setPending(null)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  return (
    <div>
      <PageHeader title="Games" description="Monitor online Freej Trivia matches. Offline play is not managed here." />
      <Card>
        <div className="flex flex-col gap-4 border-b border-line px-4 py-4">
          <Tabs value={tab} onChange={setTab} tabs={[{ value: 'online', label: 'Online Games' }, { value: 'completed', label: 'Completed Games' }]} />
          <FilterBar>
            <SearchBar className="w-full lg:max-w-sm" value={search} onChange={setSearch} placeholder="Search game ID or player" />
            <Select value={status} onChange={(event) => setStatus(event.target.value)} className="lg:w-44">
              <option value="all">All statuses</option>
              {GAME_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </FilterBar>
        </div>
        <DataTable
          columns={[
            { key: 'id', header: 'Game ID', sortKey: 'id' },
            { key: 'players', header: 'Players', render: (row) => row.players.map((player) => player.name).join(' vs ') },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'winnerName', header: 'Winner', render: (row) => row.winnerName || '—' },
            { key: 'score', header: 'Score' },
            { key: 'startedAt', header: 'Started', sortKey: 'startedAt', render: (row) => formatDateTime(row.startedAt) },
            { key: 'completedAt', header: 'Completed', render: (row) => (row.completedAt ? formatDateTime(row.completedAt) : '—') },
            { key: 'actions', header: '', render: (row) => (
              <Dropdown trigger={<button type="button" className="rounded-lg p-2 text-ink-muted hover:bg-canvas" aria-label="Actions"><MoreHorizontal size={16} /></button>}>
                <DropdownItem onClick={() => navigate(`/games/${row.id}`)}>View</DropdownItem>
                {row.status === 'waiting' || row.status === 'in_progress' ? <DropdownItem tone="danger" onClick={() => setPending(row)}>Cancel</DropdownItem> : null}
              </Dropdown>
            )},
          ]}
          rows={result.data} loading={loading} error={error} onRetry={load} emptyTitle="No games found" sortKey={sortKey} sortDir={sortDir} onSort={onSort} page={page} pageCount={result.pageCount} total={result.total} pageSize={PAGE_SIZE} onPageChange={setPage}
        />
      </Card>
      <ConfirmDialog open={Boolean(pending)} title="Cancel this game?" description="Players will be removed from the match." confirmLabel="Cancel game" loading={working} onClose={() => setPending(null)} onConfirm={onCancel} />
    </div>
  )
}
