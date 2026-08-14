import { useEffect, useState } from 'react'
import { getSettings, updateSettings } from '../api/dashboardApi'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { LoadingState } from '../components/ui/LoadingState'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const tabs = [
  { value: 'profile', label: 'Profile' },
  { value: 'legal', label: 'Legal' },
]

export function SettingsPage() {
  const { admin, updateAdmin } = useAuth()
  const { push } = useToast()
  const [tab, setTab] = useState('profile')
  const [settings, setSettings] = useState(null)
  const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passErrors, setPassErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(setSettings).finally(() => setLoading(false))
  }, [])

  async function saveProfile(event) {
    event.preventDefault()
    if (!profile.name.trim() || !profile.email.trim()) {
      push({ tone: 'error', message: 'Name and email are required.' })
      return
    }
    updateAdmin(profile)
    push({ message: 'Profile updated.' })
  }

  function savePassword(event) {
    event.preventDefault()
    const next = {}
    if (!passwords.current) next.current = 'Current password is required'
    if (passwords.next.length < 8) next.next = 'Use at least 8 characters'
    if (passwords.next !== passwords.confirm) next.confirm = 'Passwords do not match'
    setPassErrors(next)
    if (Object.keys(next).length) return
    setPasswords({ current: '', next: '', confirm: '' })
    push({ message: 'Password updated.' })
  }

  if (loading || !settings) return <LoadingState />

  return (
    <div>
      <PageHeader title="Settings" description="Administrator profile and legal content." />
      <div className="mb-5 max-w-xl"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>
      {tab === 'profile' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-4">
              <Avatar name={profile.name} size="lg" />
              <div>
                <p className="font-semibold text-ink">{profile.name}</p>
                <p className="text-sm text-ink-muted">Avatar uses your initials in this admin build.</p>
              </div>
            </div>
            <form className="space-y-3" onSubmit={saveProfile}>
              <Input label="Name" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} />
              <Input label="Email" type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
              <Button type="submit">Save profile</Button>
            </form>
          </Card>
          <Card className="p-6">
            <h2 className="mb-4 text-base font-semibold text-ink">Change password</h2>
            <form className="space-y-3" onSubmit={savePassword}>
              <Input label="Current password" type="password" value={passwords.current} error={passErrors.current} onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))} />
              <Input label="New password" type="password" value={passwords.next} error={passErrors.next} onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))} />
              <Input label="Confirm password" type="password" value={passwords.confirm} error={passErrors.confirm} onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))} />
              <Button type="submit">Update password</Button>
            </form>
          </Card>
        </div>
      ) : null}
      {tab === 'legal' ? (
        <Card className="p-6">
          <form className="grid gap-4 lg:grid-cols-2" onSubmit={async (event) => { event.preventDefault(); await updateSettings(settings); push({ message: 'Legal content saved.' }) }}>
            <Textarea label="Terms & Conditions" rows={14} value={settings.terms} onChange={(event) => setSettings((current) => ({ ...current, terms: event.target.value }))} />
            <Textarea label="Privacy Policy" rows={14} value={settings.privacy} onChange={(event) => setSettings((current) => ({ ...current, privacy: event.target.value }))} />
            <div className="lg:col-span-2"><Button type="submit">Save legal pages</Button></div>
          </form>
        </Card>
      ) : null}
    </div>
  )
}
