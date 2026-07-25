import { Link } from 'react-router-dom'
import { Logo } from './ui/Logo'
import { SITE } from '../config/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-8 border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            {SITE.subCopy}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">サイト内リンク</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>
              <Link to="/" className="hover:text-brand-indigo">
                トップページ
              </Link>
            </li>
            <li>
              <Link to="/survey" className="hover:text-brand-indigo">
                アンケートに回答する
              </Link>
            </li>
            <li>
              <Link to="/trial" className="hover:text-brand-indigo">
                無料デモ・試験導入の相談
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-brand-indigo">
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">運営</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>{SITE.name} 開発チーム（高校生）</li>
            <li>起業家甲子園に向けた実態調査</li>
            <li>
              <Link to="/admin/login" className="hover:text-brand-indigo">
                管理者ログイン
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-faint sm:flex-row">
          <p>© {year} {SITE.name}. 全国文化祭アンケート.</p>
          <p>本サイトの数値・実績は事実に基づき、確定前の項目は「調査中」等と表示しています。</p>
        </div>
      </div>
    </footer>
  )
}
