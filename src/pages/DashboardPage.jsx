import { useEffect, useState } from 'react'
import { BookOpen, Gamepad2, Globe, Trophy, Users } from 'lucide-react'
import { getDashboardStats, getOnlineGamesSeries, getUserGrowth } from '../api/dashboardApi'
import { StatCard } from '../components/dashboard/StatCard'
import { UserGrowthChart } from '../components/dashboard/UserGrowthChart'
import { GamesChart } from '../components/dashboard/GamesChart'

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [range, setRange] = useState('30d')
  const [growth, setGrowth] = useState([])
  const [games, setGames] = useState([])

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getDashboardStats(), getOnlineGamesSeries('7d')])
      .then(([nextStats, nextGames]) => {
        if (!active) return
        setStats(nextStats)
        setGames(nextGames.series)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    getUserGrowth(range).then(setGrowth)
  }, [range])

  const cards = [
    { key: 'totalUsers', label: 'Total Users', icon: Users, accent: 'brand' },
    { key: 'activeUsers', label: 'Active Users', icon: Trophy, accent: 'accent' },
    { key: 'gamesPlayed', label: 'Games Played', icon: Gamepad2, accent: 'violet' },
    { key: 'totalQuestions', label: 'Total Questions', icon: BookOpen, accent: 'brand' },
    { key: 'onlineGames', label: 'Online Games', icon: Globe, accent: 'accent' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <StatCard key={card.key} icon={card.icon} label={card.label} accent={card.accent} loading={loading || !stats} value={stats?.[card.key]?.value} change={stats?.[card.key]?.change} comparison={stats?.[card.key]?.comparison} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <UserGrowthChart data={growth} loading={loading} range={range} onRangeChange={setRange} />
        <GamesChart data={games} loading={loading} />
      </div>
    </div>
  )
}
