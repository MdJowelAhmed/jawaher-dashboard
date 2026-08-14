function iconDataUri(background, letter) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${background}"/><text x="32" y="42" text-anchor="middle" font-size="26" font-family="Arial, sans-serif" fill="#ffffff">${letter}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const categories = [
  { id: 'cat_001', name: 'General Knowledge', slug: 'general-knowledge', icon: iconDataUri('#38B8B3', 'G'), questionCount: 4, status: 'active', createdAt: '2025-10-12T09:00:00.000Z' },
  { id: 'cat_002', name: 'Science', slug: 'science', icon: iconDataUri('#2563EB', 'S'), questionCount: 3, status: 'active', createdAt: '2025-10-12T09:00:00.000Z' },
  { id: 'cat_003', name: 'Geography', slug: 'geography', icon: iconDataUri('#0EA5E9', 'G'), questionCount: 2, status: 'active', createdAt: '2025-10-14T09:00:00.000Z' },
  { id: 'cat_004', name: 'History', slug: 'history', icon: iconDataUri('#D97706', 'H'), questionCount: 1, status: 'active', createdAt: '2025-10-14T09:00:00.000Z' },
  { id: 'cat_005', name: 'Sports', slug: 'sports', icon: iconDataUri('#8B5CF6', 'S'), questionCount: 2, status: 'active', createdAt: '2025-10-18T09:00:00.000Z' },
  { id: 'cat_006', name: 'Animals', slug: 'animals', icon: iconDataUri('#059669', 'A'), questionCount: 1, status: 'active', createdAt: '2025-11-02T09:00:00.000Z' },
  { id: 'cat_007', name: 'Entertainment', slug: 'entertainment', icon: iconDataUri('#DB2777', 'E'), questionCount: 2, status: 'active', createdAt: '2025-11-02T09:00:00.000Z' },
  { id: 'cat_008', name: 'Food & Culture', slug: 'food-culture', icon: iconDataUri('#EA580C', 'F'), questionCount: 0, status: 'active', createdAt: '2026-04-20T09:00:00.000Z' },
]
