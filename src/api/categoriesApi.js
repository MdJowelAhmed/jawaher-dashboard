import { wait } from '../utils/delay'
import { categories } from '../data/categories'
import { nextId } from './helpers'

export async function getCategories() {
  await wait()
  return categories.map((item) => ({ ...item }))
}

export async function createCategory(payload) {
  await wait()
  const name = (payload.name || '').trim()
  const category = {
    id: nextId('cat', categories),
    name,
    icon: payload.icon || '',
    questionCount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  }
  categories.unshift(category)
  return { ...category }
}

export async function updateCategory(id, patch) {
  await wait()
  const category = categories.find((item) => item.id === id)
  if (!category) throw new Error('Category not found')
  if (patch.name != null) {
    category.name = patch.name.trim()
    category.slug = category.name.toLowerCase().replace(/\s+/g, '-')
  }
  if (patch.icon != null) category.icon = patch.icon
  return { ...category }
}

export async function deleteCategory(id) {
  await wait()
  const index = categories.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Category not found')
  categories.splice(index, 1)
  return { ok: true }
}
