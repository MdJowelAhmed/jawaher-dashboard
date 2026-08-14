import { NavLink } from 'react-router-dom'
import { Bell, BookOpen, FolderOpen, Gamepad2, LayoutDashboard, LogOut, Settings, ShieldAlert, Users } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useSidebar } from '../../context/SidebarContext'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui/Avatar'
import { BrandLogo } from '../common/BrandLogo'

const sections = [
  { label: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Management', items: [
    { to: '/users', label: 'Users', icon: Users },
    { to: '/trivia', label: 'Trivia', icon: BookOpen },
    { to: '/categories', label: 'Categories', icon: FolderOpen },
    { to: '/games', label: 'Games', icon: Gamepad2 },
  ]},
  { label: 'System', items: [
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/reports', label: 'Reports', icon: ShieldAlert },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]},
]

function Logo({ collapsed }) {
  return (
    <div className={cn('flex items-center px-2', collapsed && 'justify-center px-0')}>
      <BrandLogo variant={collapsed ? 'mark' : 'full'} className={collapsed ? '' : 'max-w-[196px]'} />
    </div>
  )
}

export function Sidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar()
  const { admin, logout } = useAuth()

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center border-b border-white/10 px-3">
        <Logo collapsed={collapsed} />
      </div>
      <nav className={cn('flex-1 px-2 py-4 scrollbar-thin', !collapsed && 'overflow-y-auto')}>
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed ? <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{section.label}</p> : null}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    onClick={closeMobile}
                    className={({ isActive }) => cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-0',
                      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-brand" /> : null}
                        <Icon size={18} />
                        {!collapsed ? item.label : (
                          <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white shadow-float group-hover:block">
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <NavLink to="/settings" onClick={closeMobile} title={collapsed ? admin?.name : undefined} className={cn('mb-1 flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-slate-200 hover:bg-white/5', collapsed && 'justify-center')}>
          <Avatar name={admin?.name} size="sm" />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{admin?.name}</p>
              <p className="truncate text-xs text-slate-400">{admin?.role}</p>
            </div>
          ) : null}
        </NavLink>
        <button type="button" onClick={logout} title={collapsed ? 'Logout' : undefined} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white', collapsed && 'justify-center px-0')}>
          <LogOut size={18} />
          {!collapsed ? 'Logout' : null}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className={cn('fixed inset-y-0 left-0 z-40 hidden bg-[#0f1b3d] text-white transition-[width] duration-200 lg:flex lg:flex-col', collapsed ? 'w-[80px]' : 'w-[260px]')}>
        {content}
      </aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close menu" onClick={closeMobile} />
          <aside className="relative h-full w-[260px] bg-[#0f1b3d] text-white shadow-float">{content}</aside>
        </div>
      ) : null}
    </>
  )
}
