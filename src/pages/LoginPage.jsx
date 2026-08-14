import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DEMO_CREDENTIALS } from '../utils/constants'
import { DummyLogo } from '../components/branding/DummyLogo'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to={location.state?.from || '/dashboard'} replace />

  function validate() {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(form.email, form.password, form.remember)
      push({ title: 'Welcome back', message: 'Signed in to Freej Trivia Admin.' })
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (error) {
      setErrors({ password: error.message || 'Unable to sign in' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-[#0f1b3d] text-white lg:flex lg:flex-col">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20" />
        <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-violet/20" />
        <DummyLogo size="md" showSubtitle className="relative mx-12 mt-12" />
        <div className="relative mt-auto max-w-md px-12 pb-12 pt-10">
          <p className="text-sm font-medium text-brand">Admin Console</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">Manage the Freej Trivia ecosystem.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">Review players, publish questions, monitor online games, and keep communities healthy from one professional workspace.</p>
        </div>
      </aside>
      <main className="flex items-center justify-center bg-canvas px-4 py-10">
        <div className="w-full max-w-[420px] rounded-card border border-line bg-white p-8 shadow-card">
          <div className="mb-8 lg:hidden">
            <DummyLogo size="md" showSubtitle tone="light" />
          </div>
          <h2 className="text-2xl font-semibold text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-ink-muted">Use your administrator credentials to continue.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input label="Email" type="email" name="email" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              <button type="button" className="absolute right-3 top-[38px] text-ink-muted" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-muted">
                <input type="checkbox" checked={form.remember} onChange={(event) => setForm((current) => ({ ...current, remember: event.target.checked }))} className="h-4 w-4 rounded border-line text-brand" />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-brand hover:text-brand-hover">Forgot password</Link>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</Button>
          </form>
          <p className="mt-6 rounded-xl bg-canvas px-3 py-2 text-xs text-ink-muted">Demo access: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}</p>
        </div>
      </main>
    </div>
  )
}
