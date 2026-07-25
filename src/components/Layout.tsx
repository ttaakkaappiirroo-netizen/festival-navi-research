import { useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

/** 公開ページ共通レイアウト（ヘッダー + フッター + ページ遷移時スクロールトップ） */
export function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // アンカー付き遷移はスクロールトップしない
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card"
      >
        本文へスキップ
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
