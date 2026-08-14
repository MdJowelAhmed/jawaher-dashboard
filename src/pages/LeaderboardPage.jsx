import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Medal } from 'lucide-react'
import { getLeaderboard } from '../api/leaderboardApi'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'
import { Avatar } from '../components/ui/Avatar'
import { DataTable } from '../components/ui/DataTable'
import { LoadingState } from '../components/ui/LoadingState'
import { LEADERBOARD_PERIODS } from '../utils/constants'
import { formatNumber, fullName } from '../utils/format'
import { cn } from '../utils/cn'

export function LeaderboardPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('all_time')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    getLeaderboard(period).then((data) => { if (active) setRows(data) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [period])

  const podium = rows.slice(0, 3)
  const rest = rows.slice(3)
  const order = [podium[1], podium[0], podium[2]].filter(Boolean)
  const heights = { 1: 'pt-4', 2: 'pt-10', 3: 'pt-12' }
  const accents = { 1: 'from-[#38B8B3] to-[#2d9e9a]', 2: 'from-[#2563EB] to-[#1d4ed8]', 3: 'from-[#8B5CF6] to-[#7c3aed]' }

  return (
    <div className="space-y-6">
      <PageHeader title="Leaderboard" description="Rankings are based on completed online games." actions={<Tabs value={period} onChange={setPeriod} tabs={LEADERBOARD_PERIODS.map((item) => ({ value: item.value, label: item.label }))} />} />
      {loading ? <LoadingState /> : (
        <>
          <div className="grid items-end gap-4 md:grid-cols-3">
            {order.map((player) => (
              <button key={player.userId} type="button" onClick={() => navigate(`/users/${player.userId}`)} className={cn('rounded-card border border-line bg-white p-6 text-center shadow-card', heights[player.rank], player.rank === 1 && 'md:-translate-y-2')}>
                <div className={cn('mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white', accents[player.rank])}>
                  {player.rank === 1 ? <Crown size={22} /> : <Medal size={22} />}
                </div>
                <Avatar name={fullName(player)} className="mx-auto" />
                <p className="mt-3 font-semibold text-ink">{fullName(player)}</p>
                <p className="text-sm text-ink-muted">Rank #{player.rank}</p>
                <p className="mt-3 text-2xl font-semibold text-ink">{formatNumber(player.points)}</p>
                <p className="text-xs text-ink-muted">points</p>
              </button>
            ))}
          </div>
          <Card>
            <DataTable
              columns={[
                { key: 'rank', header: 'Rank', render: (row) => `#${row.rank}` },
                { key: 'player', header: 'Player', render: (row) => (
                  <button type="button" className="flex items-center gap-3 text-left" onClick={() => navigate(`/users/${row.userId}`)}>
                    <Avatar name={fullName(row)} size="sm" />
                    <span className="font-medium">{fullName(row)}</span>
                  </button>
                )},
                { key: 'games', header: 'Games', render: (row) => formatNumber(row.games) },
                { key: 'wins', header: 'Wins', render: (row) => formatNumber(row.wins) },
                { key: 'points', header: 'Points', render: (row) => formatNumber(row.points) },
                { key: 'score', header: 'Score', render: (row) => formatNumber(row.score) },
              ]}
              rows={rest.map((row) => ({ ...row, id: row.userId }))}
              emptyTitle="No additional rankings"
            />
          </Card>
        </>
      )}
    </div>
  )
}
