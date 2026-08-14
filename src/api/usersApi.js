import { wait } from '../utils/delay'
import { users } from '../data/users'
import { paginate, sortBy } from './helpers'
import { fullName } from '../utils/format'

export async function getUsers({ search = '', status = 'all', sortKey = 'joinedAt', sortDir = 'desc', page = 1, pageSize = 8 } = {}) {
  await wait()
  const query = search.trim().toLowerCase()
  let result = users.filter((user) => {
    const matchesStatus = status === 'all' || user.status === status
    const matchesQuery = !query || fullName(user).toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    return matchesStatus && matchesQuery
  })
  result = sortBy(result, sortKey, sortDir)
  return paginate(result, page, pageSize)
}

export async function getUserById(id) {
  await wait()
  const user = users.find((item) => item.id === id)
  if (!user) {
    const error = new Error('User not found')
    error.code = 'NOT_FOUND'
    throw error
  }
  return { ...user }
}

export async function updateUser(id, patch) {
  await wait()
  const user = users.find((item) => item.id === id)
  if (!user) throw new Error('User not found')
  Object.assign(user, patch)
  return { ...user }
}

export async function deleteUser(id) {
  await wait()
  const index = users.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('User not found')
  users.splice(index, 1)
  return { ok: true }
}
