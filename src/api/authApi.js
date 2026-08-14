import { wait } from '../utils/delay'
import { DEMO_CREDENTIALS } from '../utils/constants'
import { adminUser } from '../data/users'

const MOCK_OTP = '123456'
let passwordResetSession = null

export async function login(email, password) {
  await wait(500)
  if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return { token: 'mock-admin-token', admin: { ...adminUser } }
  }
  const error = new Error('Invalid email or password')
  error.code = 'INVALID_CREDENTIALS'
  throw error
}

export async function sendPasswordOtp(email) {
  await wait(500)
  const normalized = email.trim().toLowerCase()
  if (!normalized) throw new Error('Email is required')
  passwordResetSession = {
    email: normalized,
    otp: MOCK_OTP,
    verified: false,
    expiresAt: Date.now() + 10 * 60 * 1000,
  }
  return { sent: true, email: normalized }
}

export async function verifyPasswordOtp(email, otp) {
  await wait(400)
  const normalized = email.trim().toLowerCase()
  if (!passwordResetSession || passwordResetSession.email !== normalized) {
    throw new Error('Please request a new verification code.')
  }
  if (Date.now() > passwordResetSession.expiresAt) {
    throw new Error('This code has expired. Request a new one.')
  }
  if (otp !== passwordResetSession.otp) {
    throw new Error('Invalid verification code.')
  }
  passwordResetSession.verified = true
  return { verified: true }
}

export async function resetPasswordWithOtp(email, password) {
  await wait(500)
  const normalized = email.trim().toLowerCase()
  if (!passwordResetSession?.verified || passwordResetSession.email !== normalized) {
    throw new Error('Verify the code before resetting your password.')
  }
  if (!password || password.length < 8) {
    throw new Error('Use at least 8 characters.')
  }
  passwordResetSession = null
  return { reset: true }
}
