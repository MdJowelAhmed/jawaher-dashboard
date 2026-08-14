import { useEffect, useMemo, useState } from 'react'
import { Download, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { deleteUser, getUsers, updateUser } from '../api/usersApi'
import { PageHeader } from '../components/common/PageHeader'
import { SearchBar } from '../components/common/SearchBar'
import { FilterBar } from '../components/common/FilterBar'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { DataTable } from '../components/ui/DataTable'
import { Avatar } from '../components/ui/Avatar'
import { StatusBadge } from '../components/ui/Badge'
import { Dropdown, DropdownItem } from '../components/ui/Dropdown'
import { Card } from '../components/ui/Card'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../context/ToastContext'
import { PAGE_SIZE, USER_STATUSES } from '../utils/constants'
import { formatDate, formatNumber, fullName } from '../utils/format'

export function UsersPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [status, setStatus] = useState('all')
  const [sortKey, setSortKey] = useState('joinedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], total: 0, pageCount: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [working, setWorking] = useState(false)

  const query = useMemo(() => ({ search: debouncedSearch, status, sortKey, sortDir, page, pageSize: PAGE_SIZE }), [debouncedSearch, status, sortKey, sortDir, page])

  function load() {
    setLoading(true)
    setError('')
    getUsers(query).then(setResult).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [query])
  useEffect(() => { setPage(1) }, [debouncedSearch, status])

  function onSort(key) {
    if (sortKey === key) setSortDir((value) => (value === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  async function applyConfirm() {
    if (!confirm) return
    setWorking(true)
    try {
      if (confirm.action === 'delete') {
        await deleteUser(confirm.user.id)
        push({ message: 'User deleted.' })
      } else {
        await updateUser(confirm.user.id, { status: confirm.user.status === 'suspended' ? 'active' : 'suspended' })
        push({ message: confirm.user.status === 'suspended' ? 'User restored.' : 'User suspended.' })
      }
      setConfirm(null)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  const columns = [
    { key: 'user', header: 'User', sortKey: 'firstName', render: (row) => (
      <div className="flex items-center gap-3"><Avatar name={fullName(row)} size="sm" /><div><p className="font-medium">{fullName(row)}</p><p className="text-xs text-ink-muted">{row.id}</p></div></div>
    )},
    { key: 'email', header: 'Email', sortKey: 'email' },
    { key: 'gamesPlayed', header: 'Games Played', sortKey: 'gamesPlayed', render: (row) => formatNumber(row.gamesPlayed) },
    { key: 'score', header: 'Score', sortKey: 'score', render: (row) => formatNumber(row.score) },
    { key: 'rank', header: 'Rank', sortKey: 'rank', render: (row) => `#${row.rank}` },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'joinedAt', header: 'Joined', sortKey: 'joinedAt', render: (row) => formatDate(row.joinedAt) },
    { key: 'actions', header: '', render: (row) => (
      <Dropdown trigger={<button type="button" className="rounded-lg p-2 text-ink-muted hover:bg-canvas" aria-label="Actions"><MoreHorizontal size={16} /></button>}>
        <DropdownItem onClick={() => navigate(`/users/${row.id}`)}>View</DropdownItem>
        <DropdownItem onClick={() => setConfirm({ action: 'suspend', user: row })}>{row.status === 'suspended' ? 'Restore' : 'Suspend'}</DropdownItem>
        <DropdownItem tone="danger" onClick={() => setConfirm({ action: 'delete', user: row })}>Delete</DropdownItem>
      </Dropdown>
    )},
  ]

  return (
    <div>
      <PageHeader title="Users" description="Manage Freej Trivia users and view their activity." actions={
        <Button variant="outline" onClick={() => push({ tone: 'info', message: 'CSV export will be available when the users API is connected.' })}><Download size={16} /> Export</Button>
      } />
      <Card>
        <div className="border-b border-line px-4 py-4">
          <FilterBar>
            <SearchBar className="w-full lg:max-w-sm" value={search} onChange={setSearch} placeholder="Search users" />
            <Select value={status} onChange={(event) => setStatus(event.target.value)} className="lg:w-44">
              <option value="all">All statuses</option>
              {USER_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </FilterBar>
        </div>
        <DataTable columns={columns} rows={result.data} loading={loading} error={error} onRetry={load} emptyTitle="No users found" emptyDescription="Try a different search or status filter." sortKey={sortKey} sortDir={sortDir} onSort={onSort} page={page} pageCount={result.pageCount} total={result.total} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Card>
      <ConfirmDialog open={Boolean(confirm)} title={confirm?.action === 'delete' ? 'Delete user?' : 'Change user status?'} description={confirm?.action === 'delete' ? `This will remove ${fullName(confirm?.user)} from the admin records.` : `${fullName(confirm?.user)} will be ${confirm?.user?.status === 'suspended' ? 'restored' : 'suspended'}.`} confirmLabel={confirm?.action === 'delete' ? 'Delete' : 'Continue'} loading={working} onClose={() => setConfirm(null)} onConfirm={applyConfirm} />
    </div>
  )
}
