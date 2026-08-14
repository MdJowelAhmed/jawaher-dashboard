import { wait } from '../utils/delay'
import { tickets } from '../data/tickets'
import { paginate, sortBy } from './helpers'
import { notifyTicketCompleted } from './notificationsApi'

function nextHistoryId(ticket) {
  return `h${(ticket.history?.length || 0) + 1}`
}

export async function getTicketStats() {
  await wait()
  return {
    total: tickets.length,
    pending: tickets.filter((item) => item.status === 'pending').length,
    complete: tickets.filter((item) => item.status === 'complete').length,
  }
}

export async function getTickets({
  search = '',
  status = 'all',
  sortKey = 'createdAt',
  sortDir = 'desc',
  page = 1,
  pageSize = 8,
} = {}) {
  await wait()
  const query = search.trim().toLowerCase().replace(/^#/, '')
  let result = tickets.filter((item) => {
    const matchesQuery = !query
      || item.id.toLowerCase().includes(query)
      || item.userName.toLowerCase().includes(query)
      || item.subject.toLowerCase().includes(query)
    const matchesStatus = status === 'all' || item.status === status
    return matchesQuery && matchesStatus
  })
  result = sortBy(result, sortKey, sortDir)
  return paginate(result, page, pageSize)
}

export async function getTicketById(id) {
  await wait()
  const ticket = tickets.find((item) => item.id === id)
  if (!ticket) throw new Error('Ticket not found')
  return { ...ticket, history: [...ticket.history] }
}

export async function completeTicket(id) {
  await wait()
  const ticket = tickets.find((item) => item.id === id)
  if (!ticket) throw new Error('Ticket not found')
  if (ticket.status === 'complete') return { ticket: { ...ticket, history: [...ticket.history] }, notification: null }
  const completedAt = new Date().toISOString()
  ticket.status = 'complete'
  ticket.completedAt = completedAt
  ticket.history = [
    ...ticket.history,
    {
      id: nextHistoryId(ticket),
      type: 'completed',
      title: 'Ticket Completed',
      detail: 'Admin marked this ticket as complete.',
      at: completedAt,
    },
  ]
  const notification = await notifyTicketCompleted(ticket)
  return { ticket: { ...ticket, history: [...ticket.history] }, notification }
}
