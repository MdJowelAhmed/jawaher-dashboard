import { wait } from '../utils/delay'
import { notifications } from '../data/notifications'
import { paginate, nextId } from './helpers'

export async function getNotifications() {
  await wait()
  return paginate([...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), 1, 50)
}

export async function createNotification(payload) {
  await wait()
  const item = {
    id: nextId('nt', notifications),
    createdAt: new Date().toISOString(),
    scheduledFor: payload.sendAt || null,
    status: payload.sendAt ? 'scheduled' : 'sent',
    ...payload,
  }
  notifications.unshift(item)
  return { ...item }
}

export async function notifyTicketCompleted(ticket) {
  await wait()
  const exists = notifications.some((item) => item.type === 'support_ticket' && item.ticketId === ticket.id)
  if (exists) return null
  const item = {
    id: nextId('nt', notifications),
    userId: ticket.userId,
    type: 'support_ticket',
    title: 'Ticket Completed',
    message: `Your support ticket #${ticket.id} has been completed.`,
    ticketId: ticket.id,
    read: false,
    audience: 'active_players',
    status: 'sent',
    createdAt: new Date().toISOString(),
    scheduledFor: null,
  }
  notifications.unshift(item)
  return { ...item }
}

export async function deleteNotification(id) {
  await wait()
  const index = notifications.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Notification not found')
  notifications.splice(index, 1)
  return { ok: true }
}
