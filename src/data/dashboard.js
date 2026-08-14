export const dashboardStats = {
  totalUsers: { value: 24580, change: 12.5, comparison: 'vs last month' },
  activeUsers: { value: 8942, change: 8.2, comparison: 'vs last month' },
  gamesPlayed: { value: 156420, change: 15.4, comparison: 'vs last month' },
  totalQuestions: { value: 2840, change: 4.1, comparison: 'vs last month' },
  onlineGames: { value: 12450, change: 9.8, comparison: 'vs last month' },
}

export const userGrowth = {
  '7d': [
    { label: 'Aug 8', users: 24110 }, { label: 'Aug 9', users: 24180 }, { label: 'Aug 10', users: 24240 },
    { label: 'Aug 11', users: 24310 }, { label: 'Aug 12', users: 24390 }, { label: 'Aug 13', users: 24480 }, { label: 'Aug 14', users: 24580 },
  ],
  '30d': [
    { label: 'Jul 16', users: 22140 }, { label: 'Jul 20', users: 22480 }, { label: 'Jul 24', users: 22810 },
    { label: 'Jul 28', users: 23160 }, { label: 'Aug 1', users: 23520 }, { label: 'Aug 5', users: 23910 },
    { label: 'Aug 9', users: 24180 }, { label: 'Aug 14', users: 24580 },
  ],
  '3m': [
    { label: 'May', users: 18420 }, { label: 'Jun', users: 20680 }, { label: 'Jul', users: 22840 }, { label: 'Aug', users: 24580 },
  ],
  '1y': [
    { label: 'Sep', users: 8200 }, { label: 'Nov', users: 11480 }, { label: 'Jan', users: 14820 },
    { label: 'Mar', users: 17640 }, { label: 'May', users: 18420 }, { label: 'Jul', users: 22840 }, { label: 'Aug', users: 24580 },
  ],
}

export const onlineGamesSeries = {
  '7d': [
    { label: 'Aug 8', online: 1480 }, { label: 'Aug 9', online: 1620 }, { label: 'Aug 10', online: 1390 },
    { label: 'Aug 11', online: 1710 }, { label: 'Aug 12', online: 1880 }, { label: 'Aug 13', online: 1960 }, { label: 'Aug 14', online: 1240 },
  ],
  '30d': [
    { label: 'W1', online: 8420 }, { label: 'W2', online: 9010 }, { label: 'W3', online: 8760 }, { label: 'W4', online: 9680 },
  ],
  '3m': [
    { label: 'May', online: 28400 }, { label: 'Jun', online: 31220 }, { label: 'Jul', online: 34880 }, { label: 'Aug', online: 12450 },
  ],
  '1y': [
    { label: 'Q4', online: 48200 }, { label: 'Q1', online: 61440 }, { label: 'Q2', online: 73810 }, { label: 'Q3', online: 42100 },
  ],
}

export const userActivitySeries = {
  usr_001: [
    { label: 'Mon', games: 4 }, { label: 'Tue', games: 6 }, { label: 'Wed', games: 3 },
    { label: 'Thu', games: 5 }, { label: 'Fri', games: 8 }, { label: 'Sat', games: 7 }, { label: 'Sun', games: 5 },
  ],
}

export const defaultUserActivity = [
  { label: 'Mon', games: 1 }, { label: 'Tue', games: 2 }, { label: 'Wed', games: 0 },
  { label: 'Thu', games: 3 }, { label: 'Fri', games: 2 }, { label: 'Sat', games: 4 }, { label: 'Sun', games: 1 },
]

export const appSettings = {
  appName: 'Freej Trivia',
  supportEmail: 'support@freejtrivia.com',
  defaultDifficulty: 'easy',
  allowRegistrations: true,
  terms: `Terms & Conditions\n\nThese terms govern use of the Freej Trivia mobile application and this admin dashboard.\n\n1. Accounts must belong to a real person.\n2. Trivia content is provided for entertainment and learning.\n3. Administrators may suspend accounts that violate community guidelines.\n4. Leaderboard standings are based on completed online games.`,
  privacy: `Privacy Policy\n\nFreej Trivia collects account details needed to operate play, leaderboards, and communities.\n\n1. We store name, email, and gameplay statistics.\n2. Offline play stays on the device unless a future sync is enabled.\n3. Administrators can access user records through this dashboard.\n4. Contact support@freejtrivia.com for data requests.`,
}
