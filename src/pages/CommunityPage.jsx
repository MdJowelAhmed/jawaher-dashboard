import { useEffect, useMemo, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { deleteCommunity, getCommunities, updateCommunity } from '../api/communityApi'
import { PageHeader } from '../components/common/PageHeader'
import { SearchBar } from '../components/common/SearchBar'
import { FilterBar } from '../components/common/FilterBar'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import { Dropdown, DropdownItem } from '../components/ui/Dropdown'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../context/ToastContext'
import { COMMUNITY_STATUSES, PAGE_SIZE } from '../utils/constants'
import { formatDate, formatNumber } from '../utils/format'

export function CommunityPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [status, setStatus] = useState('all')
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], total: 0, pageCount: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [edit, setEdit] = useState(null)
  const [pending, setPending] = useState(null)
  const [working, setWorking] = useState(false)

  const query = useMemo(() => ({ search: debouncedSearch, status, sortKey, sortDir, page, pageSize: PAGE_SIZE }), [debouncedSearch, status, sortKey, sortDir, page])

  function load() {
    setLoading(true)
    setError('')
    getCommunities(query).then(setResult).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [query])
  useEffect(() => setPage(1), [debouncedSearch, status])

  function onSort(key) {
    if (sortKey === key) setSortDir((value) => (value === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  async function onSave(event) {
    event.preventDefault()
    setWorking(true)
    try {
      await updateCommunity(edit.id, { name: edit.name, description: edit.description })
      push({ message: 'Community updated.' })
      setEdit(null)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  async function applyPending() {
    setWorking(true)
    try {
      if (pending.action === 'delete') await deleteCommunity(pending.item.id)
      else await updateCommunity(pending.item.id, { status: pending.item.status === 'disabled' ? 'active' : 'disabled' })
      push({ message: 'Community updated.' })
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
      <PageHeader title="Community" description="Manage player communities created in Freej Trivia." />
      <Card>
        <div className="border-b border-line px-4 py-4">
          <FilterBar>
            <SearchBar className="w-full lg:max-w-sm" value={search} onChange={setSearch} placeholder="Search communities" />
            <Select value={status} onChange={(event) => setStatus(event.target.value)} className="lg:w-44">
              <option value="all">All statuses</option>
              {COMMUNITY_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </FilterBar>
        </div>
        <DataTable
          columns={[
            { key: 'name', header: 'Community', sortKey: 'name', render: (row) => <span className="font-medium">{row.name}</span> },
            { key: 'memberCount', header: 'Members', sortKey: 'memberCount', render: (row) => formatNumber(row.memberCount) },
            { key: 'activity', header: 'Activity' },
            { key: 'creatorName', header: 'Creator' },
            { key: 'createdAt', header: 'Created Date', sortKey: 'createdAt', render: (row) => formatDate(row.createdAt) },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'actions', header: '', render: (row) => (
              <Dropdown trigger={<button type="button" className="rounded-lg p-2 text-ink-muted hover:bg-canvas" aria-label="Actions"><MoreHorizontal size={16} /></button>}>
                <DropdownItem onClick={() => navigate(`/community/${row.id}`)}>View</DropdownItem>
                <DropdownItem onClick={() => setEdit({ ...row })}>Edit</DropdownItem>
                <DropdownItem onClick={() => setPending({ action: 'disable', item: row })}>{row.status === 'disabled' ? 'Enable' : 'Disable'}</DropdownItem>
                <DropdownItem tone="danger" onClick={() => setPending({ action: 'delete', item: row })}>Delete</DropdownItem>
              </Dropdown>
            )},
          ]}
          rows={result.data} loading={loading} error={error} onRetry={load} emptyTitle="No communities found" sortKey={sortKey} sortDir={sortDir} onSort={onSort} page={page} pageCount={result.pageCount} total={result.total} pageSize={PAGE_SIZE} onPageChange={setPage}
        />
      </Card>
      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title="Edit community">
        {edit ? (
          <form className="space-y-3" onSubmit={onSave}>
            <Input label="Name" value={edit.name} onChange={(event) => setEdit((current) => ({ ...current, name: event.target.value }))} />
            <Textarea label="Description" value={edit.description} onChange={(event) => setEdit((current) => ({ ...current, description: event.target.value }))} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
              <Button type="submit" disabled={working}>Save</Button>
            </div>
          </form>
        ) : null}
      </Modal>
      <ConfirmDialog open={Boolean(pending)} title={pending?.action === 'delete' ? 'Delete community?' : 'Change community status?'} description="This only affects community membership in Freej Trivia." confirmLabel={pending?.action === 'delete' ? 'Delete' : 'Continue'} loading={working} onClose={() => setPending(null)} onConfirm={applyPending} />
    </div>
  )
}
