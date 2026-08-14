import { wait } from '../utils/delay'
import { triviaQuestions } from '../data/trivia'
import { categories } from '../data/categories'
import { paginate, sortBy, nextId } from './helpers'
import { POINT_VALUES } from '../utils/constants'

function inferValue(question) {
  const numeric = Number(question.value)
  if (POINT_VALUES.includes(numeric)) return numeric
  const idNum = Number(String(question.id).replace(/\D/g, '')) || 1
  return POINT_VALUES[(idNum - 1) % POINT_VALUES.length]
}

function resolveAnswer(question) {
  return question.answer || question.correctAnswer || ''
}

export function normalizeQuestion(question) {
  const rest = { ...question }
  delete rest.explanation
  delete rest.answers
  delete rest.options
  const answer = resolveAnswer(question)
  const questionType = question.questionType || 'text'
  return {
    ...rest,
    value: inferValue(question),
    questionType,
    media: question.media || { type: questionType === 'text' ? null : questionType, url: '', name: '' },
    answer,
    correctAnswer: answer,
    categoryName: categories.find((item) => item.id === question.categoryId)?.name ?? question.categoryName ?? 'Uncategorized',
  }
}

export async function getTriviaQuestions({
  search = '',
  categoryId = 'all',
  questionType = 'all',
  value = 'all',
  status = 'all',
  sortKey = 'createdAt',
  sortDir = 'desc',
  page = 1,
  pageSize = 8,
} = {}) {
  await wait()
  const query = search.trim().toLowerCase()
  let result = triviaQuestions.map(normalizeQuestion).filter((item) => {
    const matchesQuery = !query || item.question.toLowerCase().includes(query)
    const matchesCategory = categoryId === 'all' || item.categoryId === categoryId
    const matchesType = questionType === 'all' || item.questionType === questionType
    const matchesValue = value === 'all' || Number(item.value) === Number(value)
    const matchesStatus = status === 'all' || item.status === status
    return matchesQuery && matchesCategory && matchesType && matchesValue && matchesStatus
  })
  result = sortBy(result, sortKey, sortDir)
  return paginate(result, page, pageSize)
}

export async function getTriviaQuestionById(id) {
  await wait()
  const question = triviaQuestions.find((item) => item.id === id)
  if (!question) throw new Error('Question not found')
  return normalizeQuestion(question)
}

function persistShape(payload) {
  const answer = (payload.answer || payload.correctAnswer || '').trim()
  const numeric = Number(payload.value)
  const value = POINT_VALUES.includes(numeric) ? numeric : 200
  const questionType = payload.questionType || 'text'
  return {
    categoryId: payload.categoryId,
    value,
    questionType,
    question: payload.question || '',
    media: payload.media || { type: questionType === 'text' ? null : questionType, url: '', name: '' },
    answer,
    correctAnswer: answer,
    status: payload.status || 'draft',
    difficulty: value === 600 ? 'hard' : value === 400 ? 'medium' : 'easy',
  }
}

function stripChoiceFields(question) {
  delete question.explanation
  delete question.answers
  delete question.options
  delete question.type
}

export async function createTriviaQuestion(payload) {
  await wait()
  const question = {
    id: nextId('q', triviaQuestions),
    createdAt: new Date().toISOString(),
    ...persistShape(payload),
  }
  triviaQuestions.unshift(question)
  const category = categories.find((item) => item.id === question.categoryId)
  if (category) category.questionCount += 1
  return normalizeQuestion(question)
}

export async function updateTriviaQuestion(id, patch) {
  await wait()
  const question = triviaQuestions.find((item) => item.id === id)
  if (!question) throw new Error('Question not found')
  const nextCategoryId = patch.categoryId ?? question.categoryId
  if (nextCategoryId && nextCategoryId !== question.categoryId) {
    const previous = categories.find((item) => item.id === question.categoryId)
    const next = categories.find((item) => item.id === nextCategoryId)
    if (previous) previous.questionCount = Math.max(0, previous.questionCount - 1)
    if (next) next.questionCount += 1
  }
  Object.assign(question, persistShape({ ...normalizeQuestion(question), ...patch }), {
    id: question.id,
    createdAt: question.createdAt,
  })
  stripChoiceFields(question)
  return normalizeQuestion(question)
}

export async function deleteTriviaQuestion(id) {
  await wait()
  const index = triviaQuestions.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Question not found')
  const [removed] = triviaQuestions.splice(index, 1)
  const category = categories.find((item) => item.id === removed.categoryId)
  if (category) category.questionCount = Math.max(0, category.questionCount - 1)
  return { ok: true }
}
