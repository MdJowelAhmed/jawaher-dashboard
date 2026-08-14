import { wait } from '../utils/delay'
import {
  dashboardStats,
  userGrowth,
  onlineGamesSeries,
  userActivitySeries,
  defaultUserActivity,
  appSettings,
} from '../data/dashboard'

export async function getDashboardStats() {
  await wait()
  return { ...dashboardStats }
}

export async function getUserGrowth(range = '30d') {
  await wait()
  return userGrowth[range] ?? userGrowth['30d']
}

export async function getOnlineGamesSeries(range = '7d') {
  await wait()
  return { series: onlineGamesSeries[range] ?? onlineGamesSeries['7d'], offlineAvailable: false }
}

export async function getUserActivity(userId) {
  await wait()
  return userActivitySeries[userId] ?? defaultUserActivity
}

export async function getSettings() {
  await wait()
  return { ...appSettings }
}

export async function updateSettings(patch) {
  await wait()
  Object.assign(appSettings, patch)
  return { ...appSettings }
}
