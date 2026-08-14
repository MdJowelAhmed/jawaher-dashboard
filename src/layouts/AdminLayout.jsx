import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { PageContainer } from '../components/layout/PageContainer'
import { useSidebar } from '../context/SidebarContext'
import { cn } from '../utils/cn'
import { getRouteMeta } from '../routes/routeMeta'

export function AdminLayout() {
  const { collapsed } = useSidebar()
  const location = useLocation()
  const meta = getRouteMeta(location.pathname)
  return (
    <div className="min-h-svh bg-canvas">
      <Sidebar />
      <div className={cn('min-h-svh transition-[padding] duration-200', collapsed ? 'lg:pl-[80px]' : 'lg:pl-[260px]')}>
        <Header title={meta.title} breadcrumbs={meta.breadcrumbs} />
        <main>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  )
}
