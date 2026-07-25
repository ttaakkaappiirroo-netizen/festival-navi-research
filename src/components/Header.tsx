import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from './ui/Logo'
import { NAV_LINKS } from '../config/site'
import { cn } from '../lib/utils'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ページ遷移でメニューを閉じる
  useEffect(() => setOpen(false), [location.pathname])

  // アンカーリンク: トップページ以外からは / に飛んでからスクロール
  const handleHash = (hash: string) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/' + hash)
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-slate-200 bg-white/90 backdrop-blur-md shadow-sm'
          : 'border-transparent bg-white/60 backdrop-blur-sm',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="メインナビゲーション">
          {NAV_LINKS.map((link) =>
            'to' in link ? (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-slate-100 hover:text-ink"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleHash(link.hash)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-slate-100 hover:text-ink"
              >
                {link.label}
              </button>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <Link to="/survey" className="btn-primary px-5 py-2.5 text-sm">
            アンケートに回答する
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          className="btn-ghost p-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="モバイルナビゲーション">
            {NAV_LINKS.map((link) =>
              'to' in link ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-lg px-4 py-3 text-base font-semibold text-ink hover:bg-slate-100"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleHash(link.hash)}
                  className="rounded-lg px-4 py-3 text-left text-base font-semibold text-ink hover:bg-slate-100"
                >
                  {link.label}
                </button>
              ),
            )}
            <Link to="/survey" className="btn-primary mt-2 w-full">
              アンケートに回答する
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
