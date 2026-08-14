import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getUserById, updateUser } from '../api/usersApi'
import { getGames } from '../api/gamesApi'
import { getUserActivity } from '../api/dashboardApi'
import { getCommunities } from '../api/communityApi'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader } from '../components/ui/Card'
import { Avatar } from '../components/ui/Avatar'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState, LoadingState } from '../components/ui/LoadingState'
import { Select } from '../components/ui/Select'
import { useToast } from '../context/ToastContext'
import { formatDate, formatNumber, fullName } from '../utils/format'

export function UserDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { push } = useToast()
  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])
  const [activity, setActivity] = useState([])
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getUserById(id), getGames({ pageSize: 50 }), getUserActivity(id), getCommunities({ pageSize: 50 })])
      .then(([nextUser, nextGames, nextActivity, nextCommunities]) => {
        if (!active) return
        setUser(nextUser)
        setGames(nextGames.data.filter((game) => game.players.some((player) => player.userId === id)))
        setActivity(nextActivity)
        setCommunities(nextCommunities.data.filter((item) => item.members.some((member) => member.userId === id)))
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function onStatusChange(status) {
    setSaving(true)
    try {
      const updated = await updateUser(id, { status })
      setUser(updated)
      push({ message: 'User updated.' })
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading profile…" />
  if (error) return <ErrorState message={error} onRetry={() => navigate('/users')} />
  if (!user) return <EmptyState title="User not found" />

  const name = fullName(user)
  const stats = [
    { label: 'Games Played', value: formatNumber(user.gamesPlayed) },
    { label: 'Games Won', value: formatNumber(user.gamesWon) },
    { label: 'Total Score', value: formatNumber(user.score) },
    { label: 'Current Rank', value: `#${user.rank}` },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={name} description="Player profile, online game history, and community membership." actions={<Button variant="outline" onClick={() => navigate('/users')}>Back to users</Button>} />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={name} size="xl" />
            <h2 className="mt-4 text-lg font-semibold text-ink">{name}</h2>
            <p className="text-sm text-ink-muted">{user.email}</p>
            <div className="mt-3"><StatusBadge status={user.status} /></div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Date of birth</dt><dd>{formatDate(user.dateOfBirth)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Gender</dt><dd>{user.gender}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Joined</dt><dd>{formatDate(user.joinedAt)}</dd></div>
          </dl>
          <div className="mt-5">
            <Select label="Account status" value={user.status} disabled={saving} onChange={(event) => onStatusChange(event.target.value)}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </Card>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.label} className="p-4"><p className="text-sm text-ink-muted">{item.label}</p><p className="mt-2 text-2xl font-semibold text-ink">{item.value}</p></Card>
            ))}
          </div>
          <Card>
            <CardHeader title="Game activity" description="Online games completed this week." />
            <div className="h-[220px] px-2 py-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity}>
                  <defs><linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38B8B3" stopOpacity={0.2} /><stop offset="100%" stopColor="#38B8B3" stopOpacity={0.02} /></linearGradient></defs>
                  <CartesianGrid stroke="#EEF2F7" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E6EAF2' }} />
                  <Area type="monotone" dataKey="games" stroke="#38B8B3" fill="url(#userFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Leaderboard information" />
          <div className="grid grid-cols-3 gap-4 p-5 text-center">
            <div><p className="text-sm text-ink-muted">Current rank</p><p className="mt-1 text-xl font-semibold">#{user.rank}</p></div>
            <div><p className="text-sm text-ink-muted">Highest rank</p><p className="mt-1 text-xl font-semibold">#{user.highestRank}</p></div>
            <div><p className="text-sm text-ink-muted">Total points</p><p className="mt-1 text-xl font-semibold">{formatNumber(user.score)}</p></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Community activity" />
          {communities.length ? (
            <ul className="divide-y divide-line">
              {communities.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">{item.name}</p>
                    <p className="text-ink-muted">{item.memberCount} members</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          ) : <EmptyState title="No community memberships" description="This player has not joined a community." />}
        </Card>
      </div>
      <Card>
        <CardHeader title="Recent games" description="Online matches associated with this player." />
        <DataTable
          columns={[
            { key: 'id', header: 'Game' },
            { key: 'mode', header: 'Mode', render: () => 'Online' },
            { key: 'score', header: 'Score', render: (row) => row.players.find((player) => player.userId === id)?.score ?? '—' },
            { key: 'result', header: 'Result', render: (row) => row.status !== 'completed' ? row.status.replace('_', ' ') : row.winnerId === id ? 'Won' : 'Lost' },
            { key: 'startedAt', header: 'Date', render: (row) => formatDate(row.startedAt) },
          ]}
          rows={games}
          emptyTitle="No online games yet"
          emptyDescription="Offline play is not synced to this profile."
        />
      </Card>
    </div>
  )
}
