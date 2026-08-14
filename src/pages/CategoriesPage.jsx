import { useEffect, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../api/categoriesApi'
import { PageHeader } from '../components/common/PageHeader'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { CategoryIconUploader } from '../components/categories/CategoryIconUploader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Dropdown, DropdownItem } from '../components/ui/Dropdown'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { useToast } from '../context/ToastContext'
import { formatNumber } from '../utils/format'

const emptyForm = { name: '', icon: '' }

export function CategoriesPage() {
  const { push } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(null)
  const [working, setWorking] = useState(false)

  function load() {
    setLoading(true)
    getCategories().then(setItems).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(emptyForm)
    setErrors({})
    setModal({ mode: 'create' })
  }

  function openEdit(item) {
    setForm({ name: item.name, icon: item.icon || '' })
    setErrors({})
    setModal({ mode: 'edit', id: item.id })
  }

  async function onSave(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      setErrors({ name: 'Category name is required.' })
      return
    }
    setWorking(true)
    const payload = { name: form.name.trim(), icon: form.icon }
    try {
      if (modal.mode === 'create') await createCategory(payload)
      else await updateCategory(modal.id, payload)
      push({ message: modal.mode === 'create' ? 'Category created.' : 'Category updated.' })
      setModal(null)
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
      await deleteCategory(pending.id)
      push({ message: 'Category deleted.' })
      setPending(null)
      load()
    } catch (err) {
      push({ tone: 'error', message: err.message })
    } finally {
      setWorking(false)
    }
  }

  return (
    <div>
      <PageHeader title="Categories" description="Configure the trivia categories available in Freej Trivia." actions={<Button onClick={openCreate}><Plus size={16} /> New category</Button>} />
      {loading ? <LoadingState /> : !items.length ? <Card><EmptyState title="No categories" action={<Button onClick={openCreate}>Create category</Button>} /></Card> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.icon ? (
                    <img src={item.icon} alt="" className="h-11 w-11 rounded-xl object-cover bg-canvas" />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-sm font-semibold text-brand">
                      {item.name.slice(0, 1)}
                    </span>
                  )}
                  <div>
                    <h3 className="font-semibold text-ink">{item.name}</h3>
                    <p className="text-xs text-ink-muted">{formatNumber(item.questionCount)} questions</p>
                  </div>
                </div>
                <Dropdown trigger={<button type="button" className="rounded-lg p-2 text-ink-muted hover:bg-canvas" aria-label="Actions"><MoreHorizontal size={16} /></button>}>
                  <DropdownItem onClick={() => openEdit(item)}>View</DropdownItem>
                  <DropdownItem onClick={() => openEdit(item)}>Edit</DropdownItem>
                  <DropdownItem tone="danger" onClick={() => setPending(item)}>Delete</DropdownItem>
                </Dropdown>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={Boolean(modal)} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Edit category' : 'Create category'}>
        <form className="space-y-4" onSubmit={onSave}>
          <Input
            label="Category Name"
            required
            placeholder="Enter category name"
            value={form.name}
            error={errors.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <CategoryIconUploader
            value={form.icon}
            onChange={(icon) => setForm((current) => ({ ...current, icon }))}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" disabled={working}>{working ? 'Saving…' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(pending)} title="Delete category?" description="Questions in this category will need to be recategorized later." confirmLabel="Delete" loading={working} onClose={() => setPending(null)} onConfirm={onDelete} />
    </div>
  )
}
