import { wait } from '../utils/delay'
import { getLeaderboardRows } from '../data/leaderboard'

export async function getLeaderboard(period = 'all_time') {
  await wait()
  return getLeaderboardRows(period)
}
