export const AUTH_STORAGE_KEY = 'freej_admin_session'

export const QUESTION_TYPES = [
  { value: 'text', label: 'Text Question' },
  { value: 'image', label: 'Image Question' },
  { value: 'audio', label: 'Audio Question' },
  { value: 'video', label: 'Video Question' },
]

export const POINT_VALUES = [200, 400, 600]

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

export const TRIVIA_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

export const USER_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'inactive', label: 'Inactive' },
]

export const GAME_STATUSES = [
  { value: 'waiting', label: 'Waiting' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const COMMUNITY_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
]

export const NOTIFICATION_AUDIENCES = [
  { value: 'all_users', label: 'All Users' },
  { value: 'active_players', label: 'Active Players' },
  { value: 'community_members', label: 'Community Members' },
]

export const TICKET_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'complete', label: 'Complete' },
]

export const LEADERBOARD_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'all_time', label: 'All Time' },
]

export const DEMO_CREDENTIALS = {
  email: 'admin@freejtrivia.com',
  password: 'admin123',
}

export const PAGE_SIZE = 8
