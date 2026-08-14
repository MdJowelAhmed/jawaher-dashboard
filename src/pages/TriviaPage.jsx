import { useCallback, useEffect, useMemo, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { deleteTriviaQuestion, getTriviaQuestions, updateTriviaQuestion } from '../api/triviaApi'
import { getCategories } from '../api/categoriesApi'
import { PageHeader } from '../components/common/PageHeader'
import { SearchBar } from '../components/common/SearchBar'
import { FilterBar } from '../components/common/FilterBar'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { Dropdown, DropdownItem } from '../components/ui/Dropdown'
import { QuestionStatusBadge } from '../components/trivia/QuestionStatusBadge'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../context/ToastContext'
import { PAGE_SIZE, POINT_VALUES, QUESTION_TYPES, TRIVIA_STATUSES } from '../utils/constants'
import { formatDate, formatPoints } from '../utils/format'

const typeLabels = Object.fromEntries(QUESTION_TYPES.map((item) => [item.value, item.label.replace(' Question', '')]))

export function TriviaPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [categoryId, setCategoryId] = useState('all')
  const [questionType, setQuestionType] = useState('all')
  const [value, setValue] = useState('all')
  const [status, setStatus] = useState('all')
  const [categories, setCategories] = useState([])
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], total: 0, pageCount: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)
  const [working, setWorking] = useState(false)

  const query = useMemo(
    () => ({ search: debouncedSearch, categoryId, questionType, value, status, sortKey, sortDir, page, pageSize: PAGE_SIZE }),
    [debouncedSearch, categoryId, questionType, value, status, sortKey, sortDir, page],
  )

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    getTriviaQuestions(query).then(setResult).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [query])

  useEffect(() => { getCategories().then(setCategories) }, [])
  useEffect(() => { load() }, [load])
  useEffect(() => setPage(1), [debouncedSearch, categoryId, questionType, value, status])

  function onSort(key) {
    if (sortKey === key) setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  async function onDelete() {
    setWorking(true)
    try {
      await deleteTriviaQuestion(pending.id)
      push({ message: 'Question deleted.' })
      setPending(null)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  async function togglePublish(row) {
    const nextStatus = row.status === 'published' ? 'draft' : 'published'
    if (nextStatus === 'published') {
      const needsMedia = row.questionType && row.questionType !== 'text' && !row.media?.url
      if (!row.categoryId || !row.value || !row.question?.trim() || !row.answer?.trim() || needsMedia) {
        push({ tone: 'error', message: 'Complete all required fields before publishing.' })
        return
      }
    }
    try {
      await updateTriviaQuestion(row.id, { ...row, status: nextStatus })
      push({ message: nextStatus === 'published' ? 'Question published successfully.' : 'Question unpublished.' })
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    }
  }

  return (
    <div>
      <PageHeader
        title="Trivia"
        description="Manage the Freej Trivia question bank."
        actions={<Button onClick={() => navigate('/trivia/create')}><Plus size={16} /> Create Question</Button>}
      />
      <Card>
        <div className="border-b border-line px-4 py-4">
          <FilterBar className="lg:flex-wrap">
            <SearchBar className="w-full lg:max-w-sm" value={search} onChange={setSearch} placeholder="Search questions" />
            <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="lg:w-48">
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Select>
            <Select value={value} onChange={(event) => setValue(event.target.value)} className="lg:w-40">
              <option value="all">All values</option>
              {POINT_VALUES.map((points) => <option key={points} value={points}>{formatPoints(points)}</option>)}
            </Select>
            <Select value={questionType} onChange={(event) => setQuestionType(event.target.value)} className="lg:w-40">
              <option value="all">All types</option>
              {QUESTION_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
            <Select value={status} onChange={(event) => setStatus(event.target.value)} className="lg:w-40">
              <option value="all">All statuses</option>
              {TRIVIA_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </FilterBar>
        </div>
        <DataTable
          columns={[
            { key: 'question', header: 'Question', sortKey: 'question', render: (row) => <p className="max-w-md font-medium">{row.question}</p> },
            { key: 'categoryName', header: 'Category' },
            { key: 'value', header: 'Value', sortKey: 'value', render: (row) => formatPoints(row.value) },
            { key: 'questionType', header: 'Type', render: (row) => typeLabels[row.questionType] || 'Text' },
            { key: 'status', header: 'Status', render: (row) => <QuestionStatusBadge status={row.status} /> },
            { key: 'createdAt', header: 'Created', sortKey: 'createdAt', render: (row) => formatDate(row.createdAt) },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <Dropdown trigger={<button type="button" className="rounded-lg p-2 text-ink-muted hover:bg-canvas" aria-label="Actions"><MoreHorizontal size={16} /></button>}>
                  <DropdownItem onClick={() => navigate(`/trivia/${row.id}/edit`)}>View</DropdownItem>
                  <DropdownItem onClick={() => navigate(`/trivia/${row.id}/edit`)}>Edit</DropdownItem>
                  <DropdownItem onClick={() => togglePublish(row)}>{row.status === 'published' ? 'Unpublish' : 'Publish'}</DropdownItem>
                  <DropdownItem tone="danger" onClick={() => setPending(row)}>Delete</DropdownItem>
                </Dropdown>
              ),
            },
          ]}
          rows={result.data}
          loading={loading}
          error={error}
          onRetry={load}
          emptyTitle="No questions found"
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
          page={page}
          pageCount={result.pageCount}
          total={result.total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete question?"
        description="This question will be removed from the question bank."
        confirmLabel="Delete"
        loading={working}
        onClose={() => setPending(null)}
        onConfirm={onDelete}
      />
    </div>
  )
}
