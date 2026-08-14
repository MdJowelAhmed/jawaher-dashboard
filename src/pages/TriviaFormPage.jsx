import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createTriviaQuestion, getTriviaQuestionById, updateTriviaQuestion } from '../api/triviaApi'
import { getCategories } from '../api/categoriesApi'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/ui/LoadingState'
import { QuestionForm } from '../components/trivia/QuestionForm'
import { QuestionPreview } from '../components/trivia/QuestionPreview'
import { useToast } from '../context/ToastContext'

const blank = {
  categoryId: '',
  value: 200,
  questionType: 'text',
  question: '',
  media: { type: 'text', url: '', name: '' },
  answer: '',
  status: 'draft',
}

function toForm(question) {
  return {
    categoryId: question.categoryId || '',
    value: question.value || 200,
    questionType: question.questionType || 'text',
    question: question.question || '',
    media: question.media || { type: question.questionType || 'text', url: '', name: '' },
    answer: question.answer || '',
    status: question.status || 'draft',
  }
}

export function TriviaFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { push } = useToast()
  const [form, setForm] = useState(blank)
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then((items) => setCategories(items.filter((item) => item.status === 'active')))
  }, [])

  useEffect(() => {
    if (!isEdit) return undefined
    let active = true
    getTriviaQuestionById(id)
      .then((question) => { if (active) setForm(toForm(question)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, isEdit])

  function patch(next) {
    setForm((current) => ({ ...current, ...next }))
    setErrors({})
  }

  function validate(mode) {
    if (mode === 'draft') return true
    const next = {}
    if (!form.categoryId) next.categoryId = 'Please select a category.'
    if (!form.value) next.value = 'Please select a question value.'
    if (!form.questionType) next.questionType = 'Please select a question type.'
    if (!form.question.trim()) next.question = 'Question is required.'
    if (!form.answer.trim()) next.answer = 'Correct answer is required.'
    if (form.questionType === 'image' && !form.media?.url) next.media = 'Please upload an image.'
    if (form.questionType === 'audio' && !form.media?.url) next.media = 'Please upload an audio file.'
    if (form.questionType === 'video' && !form.media?.url) next.media = 'Please upload a video.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function save(status) {
    if (!validate(status)) return
    setSaving(true)
    const payload = {
      categoryId: form.categoryId,
      value: form.value,
      questionType: form.questionType,
      question: form.question.trim() || 'Untitled question',
      media: form.media,
      answer: form.answer.trim(),
      status,
    }
    try {
      if (isEdit) await updateTriviaQuestion(id, payload)
      else await createTriviaQuestion(payload)
      push({
        message: status === 'published' ? 'Question published successfully.' : 'Question saved as draft.',
      })
      navigate('/trivia')
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading question…" />

  const categoryName = categories.find((item) => item.id === form.categoryId)?.name
  const actions = (
    <>
      <Button variant="outline" onClick={() => navigate('/trivia')}>Cancel</Button>
      <Button variant="ghost" disabled={saving} onClick={() => save('draft')}>Save Draft</Button>
      <Button disabled={saving} onClick={() => save('published')}>{saving ? 'Saving…' : 'Publish'}</Button>
    </>
  )

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Trivia Question' : 'Add Trivia Question'}
        description="Create a new trivia question and configure its category, point value, media, and answer."
        actions={actions}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <QuestionForm form={form} errors={errors} categories={categories} onChange={patch} />
        <div className="xl:sticky xl:top-24">
          <QuestionPreview form={form} categoryName={categoryName} />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2">{actions}</div>
    </div>
  )
}
