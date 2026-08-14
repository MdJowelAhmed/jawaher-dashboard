import { Bell, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, Settings, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import { Avatar } from '../ui/Avatar'
import { Dropdown, DropdownItem } from '../ui/Dropdown'
import { Breadcrumb } from './Breadcrumb'
import { BrandLogo } from '../common/BrandLogo'

export function Header({ title, breadcrumbs }) {
  const { admin, logout } = useAuth()
  const { collapsed, toggleCollapsed, openMobile } = useSidebar()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function onSearch(event) {
    event.preventDefault()
    const value = query.trim().toLowerCase()
    if (!value) return
    if (value.includes('user')) navigate('/users')
    else if (value.includes('triv') || value.includes('question')) navigate('/trivia')
    else if (value.includes('game')) navigate('/games')
    else navigate('/users')
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" className="rounded-lg p-2 text-ink-muted hover:bg-canvas lg:hidden" onClick={openMobile} aria-label="Open menu">
          <Menu size={18} />
        </button>
        <BrandLogo variant="mark" size="sm" className="lg:hidden" />
        <button type="button" className="hidden rounded-lg p-2 text-ink-muted hover:bg-canvas lg:inline-flex" onClick={toggleCollapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <div className="min-w-0">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="truncate text-lg font-semibold text-ink">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <form onSubmit={onSearch} className="relative hidden md:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users, trivia, games…" className="h-10 w-64 rounded-control border border-line bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 lg:w-80" />
        </form>
        <Link to="/notifications" className="relative rounded-lg p-2 text-ink-muted hover:bg-canvas hover:text-ink" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
        </Link>
        <Dropdown
          trigger={
            <button type="button" className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-canvas">
              <Avatar name={admin?.name} size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold text-ink">{admin?.name}</span>
                <span className="block text-xs text-ink-muted">{admin?.role}</span>
              </span>
            </button>
          }
        >
          <DropdownItem onClick={() => navigate('/settings')}><UserRound size={15} /> Profile</DropdownItem>
          <DropdownItem onClick={() => navigate('/settings')}><Settings size={15} /> Settings</DropdownItem>
          <DropdownItem tone="danger" onClick={logout}><LogOut size={15} /> Logout</DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}
