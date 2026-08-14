import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { BrandLogo } from '../components/common/BrandLogo'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <BrandLogo variant="full" size="lg" className="mb-6 max-w-[200px] rounded-xl" />
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-1 text-sm text-ink-muted">This route is not part of the Freej Trivia admin dashboard.</p>
      <Button as={Link} to="/dashboard" className="mt-5">Go to dashboard</Button>
    </div>
  )
}
