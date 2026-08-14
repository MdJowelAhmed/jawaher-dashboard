import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { resetPasswordWithOtp, sendPasswordOtp, verifyPasswordOtp } from '../api/authApi'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { OtpInput } from '../components/auth/OtpInput'
import { useToast } from '../context/ToastContext'
import { BrandLogo } from '../components/common/BrandLogo'

const RESEND_SECONDS = 30

function AuthCard({ title, description, children }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-[420px] rounded-card border border-line bg-white p-8 shadow-card">
        <BrandLogo variant="full" size="lg" className="mb-6 max-w-[220px] rounded-xl" />
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
        {children}
      </div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const { push } = useToast()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return undefined
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  async function sendOtp(event) {
    event?.preventDefault()
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await sendPasswordOtp(email)
      setOtp('')
      setStep('otp')
      setCountdown(RESEND_SECONDS)
      push({ message: 'Verification code sent.' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function onVerify(event) {
    event.preventDefault()
    if (otp.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await verifyPasswordOtp(email, otp)
      setStep('password')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function onReset(event) {
    event.preventDefault()
    const next = {}
    if (!password) next.password = 'New password is required'
    else if (password.length < 8) next.password = 'Use at least 8 characters'
    if (!confirm) next.confirm = 'Confirm your password'
    else if (password !== confirm) next.confirm = 'Passwords do not match'
    setErrors(next)
    if (Object.keys(next).length) return
    setSubmitting(true)
    try {
      await resetPasswordWithOtp(email, password)
      setStep('success')
      push({ message: 'Password reset successfully.' })
    } catch (err) {
      setErrors({ password: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'otp') {
    return (
      <AuthCard
        title="Verify OTP"
        description={`We've sent a 6-digit verification code to ${email}.`}
      >
        <form className="mt-6 space-y-4" onSubmit={onVerify}>
          <OtpInput value={otp} onChange={(value) => { setOtp(value); setError('') }} error={error} disabled={submitting} />
          <Button type="submit" className="w-full" disabled={submitting || otp.length !== 6}>
            {submitting ? 'Verifying…' : 'Verify OTP'}
          </Button>
        </form>
        <div className="mt-4 text-sm text-ink-muted">
          {countdown > 0 ? (
            <p>Resend OTP in {countdown}s</p>
          ) : (
            <button type="button" className="font-medium text-brand hover:text-brand-hover" onClick={() => sendOtp()} disabled={submitting}>
              Resend OTP
            </button>
          )}
        </div>
      </AuthCard>
    )
  }

  if (step === 'password') {
    return (
      <AuthCard title="Create New Password" description="Choose a new password for your administrator account.">
        <form className="mt-6 space-y-4" onSubmit={onReset}>
          <Input label="New Password" type="password" value={password} error={errors.password} onChange={(event) => setPassword(event.target.value)} />
          <Input label="Confirm Password" type="password" value={confirm} error={errors.confirm} onChange={(event) => setConfirm(event.target.value)} />
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Saving…' : 'Reset Password'}</Button>
        </form>
      </AuthCard>
    )
  }

  if (step === 'success') {
    return (
      <AuthCard title="Password reset">
        <div className="mt-5 rounded-xl bg-success-soft px-4 py-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="mt-0.5 text-success" />
            <p className="text-sm text-ink">Your password has been reset successfully. You can now sign in with your new password.</p>
          </div>
        </div>
        <Button as={Link} to="/login" className="mt-6 w-full">Back to Sign In</Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Forgot password" description="Enter your administrator email to receive a 6-digit verification code.">
      <form className="mt-6 space-y-4" onSubmit={sendOtp}>
        <Input label="Admin email" type="email" value={email} error={error} onChange={(event) => setEmail(event.target.value)} />
        <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Sending…' : 'Send OTP'}</Button>
      </form>
      <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand">Back to Sign In</Link>
    </AuthCard>
  )
}
