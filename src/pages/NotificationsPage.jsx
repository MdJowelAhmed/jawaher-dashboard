import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { createNotification, deleteNotification, getNotifications } from '../api/notificationsApi'
import { PageHeader } from '../components/common/PageHeader'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Select } from '../components/ui/Select'
import { StatusBadge } from '../components/ui/Badge'
import { useToast } from '../context/ToastContext'
import { NOTIFICATION_AUDIENCES } from '../utils/constants'
import { formatDateTime } from '../utils/format'

const empty = { title: '', message: '', audience: 'all_users', sendAt: '' }

export function NotificationsPage() {
  const { push } = useToast()
  const [result, setResult] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    setLoading(true)
    getNotifications().then(setResult).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function onCreate(event) {
    event.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.message.trim()) next.message = 'Message is required'
    setErrors(next)
    if (Object.keys(next).length) return
    setWorking(true)
    try {
      await createNotification(form)
      push({ message: form.sendAt ? 'Notification scheduled.' : 'Notification sent.' })
      setOpen(false)
      setForm(empty)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  async function onDelete() {
    setWorking(true)
    try {
      await deleteNotification(pending.id)
      push({ message: 'Notification removed.' })
      setPending(null)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  const audienceLabel = (value) => NOTIFICATION_AUDIENCES.find((item) => item.value === value)?.label || value

  return (
    <div>
      <PageHeader title="Notifications" description="Send announcements to Freej Trivia players." actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> New notification</Button>} />
      <Card>
        <DataTable
          columns={[
            { key: 'title', header: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
            { key: 'message', header: 'Message', render: (row) => <span className="line-clamp-1 max-w-sm">{row.message}</span> },
            { key: 'audience', header: 'Audience', render: (row) => audienceLabel(row.audience) },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
            { key: 'actions', header: '', render: (row) => <Button size="sm" variant="ghost" onClick={() => setPending(row)}>Delete</Button> },
          ]}
          rows={result.data}
          loading={loading}
          emptyTitle="No notifications"
        />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Create notification" description="Send now or schedule for later.">
        <form className="space-y-3" onSubmit={onCreate}>
          <Input label="Title" required value={form.title} error={errors.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          <Textarea label="Message" required value={form.message} error={errors.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
          <Select label="Audience" value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}>
            {NOTIFICATION_AUDIENCES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Input label="Schedule (optional)" type="datetime-local" hint="Leave empty to send now." value={form.sendAt} onChange={(event) => setForm((current) => ({ ...current, sendAt: event.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={working}>{form.sendAt ? 'Schedule' : 'Send now'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(pending)} title="Delete notification?" description="This removes the record from the admin list." confirmLabel="Delete" loading={working} onClose={() => setPending(null)} onConfirm={onDelete} />
    </div>
  )
}
