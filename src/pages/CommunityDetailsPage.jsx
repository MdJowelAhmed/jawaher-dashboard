import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCommunityById, removeCommunityMember } from '../api/communityApi'
import { PageHeader } from '../components/common/PageHeader'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { DataTable } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState, LoadingState } from '../components/ui/LoadingState'
import { useToast } from '../context/ToastContext'
import { formatDate, formatNumber, formatRelativeTime } from '../utils/format'

export function CommunityDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { push } = useToast()
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    setLoading(true)
    getCommunityById(id).then(setCommunity).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  async function onRemove() {
    setWorking(true)
    try {
      await removeCommunityMember(id, pending.userId)
      push({ message: 'Member removed.' })
      setPending(null)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!community) return <EmptyState title="Community not found" />

  return (
    <div className="space-y-6">
      <PageHeader title={community.name} description={community.description} actions={<Button variant="outline" onClick={() => navigate('/community')}>Back to communities</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Community overview</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-ink-muted">Creator</dt><dd>{community.creatorName}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-ink-muted">Members</dt><dd>{formatNumber(community.memberCount)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-ink-muted">Created</dt><dd>{formatDate(community.createdAt)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-ink-muted">Status</dt><dd><StatusBadge status={community.status} /></dd></div>
          </dl>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Activity" description="Recent membership and community events." />
          <ul className="divide-y divide-line">
            {community.activityFeed.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                <p>{item.text}</p>
                <span className="shrink-0 text-ink-muted">{formatRelativeTime(item.at)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <CardHeader title="Members" />
        <DataTable
          columns={[
            { key: 'user', header: 'User', render: (row) => <div className="flex items-center gap-3"><Avatar name={row.name} size="sm" /><span className="font-medium">{row.name}</span></div> },
            { key: 'role', header: 'Role' },
            { key: 'joinedAt', header: 'Joined', render: (row) => formatDate(row.joinedAt) },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'actions', header: '', render: (row) => row.role === 'Creator' ? <span className="text-xs text-ink-muted">Owner</span> : <Button size="sm" variant="ghost" onClick={() => setPending(row)}>Remove</Button> },
          ]}
          rows={community.members.map((member) => ({ ...member, id: member.userId }))}
          emptyTitle="No members"
        />
      </Card>
      <ConfirmDialog open={Boolean(pending)} title="Remove member?" description={`${pending?.name} will leave this community.`} confirmLabel="Remove" loading={working} onClose={() => setPending(null)} onConfirm={onRemove} />
    </div>
  )
}
