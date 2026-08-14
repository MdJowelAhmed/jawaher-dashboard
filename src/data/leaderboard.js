import { users } from './users'

function byPeriod(user, period) {
  const score = user.score
  if (period === 'daily') return Math.round(score * 0.04)
  if (period === 'weekly') return Math.round(score * 0.18)
  if (period === 'monthly') return Math.round(score * 0.45)
  return score
}

export function getLeaderboardRows(period = 'all_time') {
  return [...users]
    .filter((user) => user.status !== 'inactive')
    .map((user) => {
      const points = byPeriod(user, period)
      const games = period === 'all_time' ? user.gamesPlayed : Math.max(4, Math.round(user.gamesPlayed * (period === 'daily' ? 0.03 : period === 'weekly' ? 0.12 : 0.3)))
      const wins = period === 'all_time' ? user.gamesWon : Math.max(1, Math.round(user.gamesWon * (period === 'daily' ? 0.03 : period === 'weekly' ? 0.12 : 0.3)))
      return {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        games,
        wins,
        points,
        score: points,
        status: user.status,
      }
    })
    .sort((a, b) => b.points - a.points)
    .map((row, index) => ({ ...row, rank: index + 1 }))
}
