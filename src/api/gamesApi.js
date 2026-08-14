import { wait } from '../utils/delay'
import { games } from '../data/games'
import { triviaQuestions } from '../data/trivia'
import { categories } from '../data/categories'
import { paginate, sortBy } from './helpers'

function withMeta(game) {
  const category = categories.find((item) => item.id === game.categoryId)
  const questions = (game.questionIds || []).map((id) => triviaQuestions.find((item) => item.id === id)).filter(Boolean)
  return {
    ...game,
    categoryName: category?.name ?? 'Mixed',
    questions: questions.map((item) => ({ id: item.id, question: item.question, correctAnswer: item.answer || item.correctAnswer })),
  }
}

export async function getGames({ tab = 'online', search = '', status = 'all', sortKey = 'startedAt', sortDir = 'desc', page = 1, pageSize = 8 } = {}) {
  await wait()
  const query = search.trim().toLowerCase()
  let result = games.filter((game) => (tab === 'completed' ? game.status === 'completed' : true))
  result = result.filter((game) => {
    const matchesStatus = status === 'all' || game.status === status
    const playerNames = game.players.map((player) => player.name.toLowerCase()).join(' ')
    const matchesQuery = !query || game.id.toLowerCase().includes(query) || playerNames.includes(query)
    return matchesStatus && matchesQuery
  })
  result = sortBy(result, sortKey, sortDir).map(withMeta)
  return paginate(result, page, pageSize)
}

export async function getGameById(id) {
  await wait()
  const game = games.find((item) => item.id === id)
  if (!game) throw new Error('Game not found')
  return withMeta(game)
}

export async function cancelGame(id) {
  await wait()
  const game = games.find((item) => item.id === id)
  if (!game) throw new Error('Game not found')
  game.status = 'cancelled'
  game.completedAt = new Date().toISOString()
  return withMeta(game)
}
