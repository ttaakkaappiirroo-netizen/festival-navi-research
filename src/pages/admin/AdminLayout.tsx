import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Sparkles, LogOut, ExternalLink } from 'lucide-react'
import { Logo } from '../../components/ui/Logo'
import { DemoBanner } from '../../components/ui/DemoBanner'
import { AdminDataProvider, useAdminData } from '../../hooks/useAdminData'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

const TABS = [
  { to: '/admin', label: 'ダッシュボード', icon: LayoutDashboard, end: true },
  { to: '/admin/responses', label: '回答一覧', icon: ListChecks, end: false },
  { to: '/admin/trials', label: '試験導入候補', icon: Sparkles, end: false },
]

function AdminChrome() {
  const { email, signOut } = useAuth()
  const { demo } = useAdminData()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* トップバー */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-indigo sm:inline">
              管理画面
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-slate-100 sm:inline-flex"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              サイトを見る
            </a>
            <span className="hidden max-w-[180px] truncate text-sm text-ink-faint md:inline">
              {email}
            </span>
            <button onClick={handleSignOut} className="btn-ghost px-3 py-2 text-sm">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">ログアウト</span>
            </button>
          </div>
        </div>

        {/* タブ */}
        <nav className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors',
                  isActive
                    ? 'border-brand-indigo text-brand-indigo'
                    : 'border-transparent text-ink-soft hover:text-ink',
                )
              }
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {demo && <DemoBanner className="mb-6" />}
        <Outlet />
      </main>
    </div>
  )
}

export function AdminLayout() {
  return (
    <AdminDataProvider>
      <AdminChrome />
    </AdminDataProvider>
  )
}
