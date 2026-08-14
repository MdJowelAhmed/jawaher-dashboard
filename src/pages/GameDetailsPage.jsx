import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGameById } from '../api/gamesApi'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState, LoadingState } from '../components/ui/LoadingState'
import { formatDateTime } from '../utils/format'

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getGameById(id)
      .then((item) => { if (active) setGame(item) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <LoadingState label="Loading game…" />
  if (error) return <ErrorState message={error} />
  if (!game) return <EmptyState title="Game not found" />

  return (
    <div className="space-y-6">
      <PageHeader title={game.id} description={`${game.categoryName} · Online match`} actions={<Button variant="outline" onClick={() => navigate('/games')}>Back to games</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Status</p>
          <div className="mt-2"><StatusBadge status={game.status} /></div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-muted">Winner</dt><dd>{game.winnerName || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Score</dt><dd>{game.score}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Started</dt><dd>{formatDateTime(game.startedAt)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Completed</dt><dd>{game.completedAt ? formatDateTime(game.completedAt) : '—'}</dd></div>
          </dl>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Players" />
          <ul className="divide-y divide-line">
            {game.players.map((player, index) => (
              <li key={`${player.name}-${index}`} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={player.name} />
                  <div>
                    <p className="font-medium text-ink">{player.name}</p>
                    <p className="text-sm text-ink-muted">{player.correct} correct</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-ink">{player.score}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <CardHeader title="Questions" description="Rounds included in this online match." />
        {game.questions?.length ? (
          <ol className="divide-y divide-line">
            {game.questions.map((item, index) => (
              <li key={item.id} className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Round {index + 1}</p>
                <p className="mt-1 font-medium text-ink">{item.question}</p>
                <p className="mt-1 text-sm text-ink-muted">Correct answer: {item.correctAnswer}</p>
              </li>
            ))}
          </ol>
        ) : <EmptyState title="No round details" description="Question history is not available for this match." />}
      </Card>
    </div>
  )
}
