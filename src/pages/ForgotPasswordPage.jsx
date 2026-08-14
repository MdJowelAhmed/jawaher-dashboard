import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../api/authApi'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../context/ToastContext'
import { BrandLogo } from '../components/common/BrandLogo'

export function ForgotPasswordPage() {
  const { push } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    if (!email.trim()) { setError('Email is required'); return }
    setSubmitting(true)
    setError('')
    try {
      await requestPasswordReset(email)
      push({ title: 'Check your inbox', message: 'If this email belongs to an admin, a reset link will be sent.' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-[420px] rounded-card border border-line bg-white p-8 shadow-card">
        <BrandLogo variant="full" size="lg" className="mb-6 max-w-[220px] rounded-xl" />
        <h1 className="text-2xl font-semibold text-ink">Reset password</h1>
        <p className="mt-1 text-sm text-ink-muted">Password reset is handled by the Freej Trivia operations team.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Admin email" type="email" value={email} error={error} onChange={(event) => setEmail(event.target.value)} />
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Sending…' : 'Send reset link'}</Button>
        </form>
        <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand">Back to sign in</Link>
      </div>
    </div>
  )
}
