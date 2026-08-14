import { wait } from '../utils/delay'
import { DEMO_CREDENTIALS } from '../utils/constants'
import { adminUser } from '../data/users'

export async function login(email, password) {
  await wait(500)
  if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return { token: 'mock-admin-token', admin: { ...adminUser } }
  }
  const error = new Error('Invalid email or password')
  error.code = 'INVALID_CREDENTIALS'
  throw error
}

export async function requestPasswordReset(email) {
  await wait(500)
  if (!email) throw new Error('Email is required')
  return { sent: true }
}
