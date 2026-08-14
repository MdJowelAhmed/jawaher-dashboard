export function paginate(items, page = 1, pageSize = 8) {
  const total = items.length
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export function sortBy(items, key, direction = 'desc') {
  const copy = [...items]
  copy.sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'number' && typeof bv === 'number') {
      return direction === 'asc' ? av - bv : bv - av
    }
    return direction === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })
  return copy
}

export function nextId(prefix, collection) {
  const max = collection.reduce((acc, item) => {
    const num = Number(String(item.id).replace(/\D/g, ''))
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `${prefix}_${String(max + 1).padStart(3, '0')}`
}
