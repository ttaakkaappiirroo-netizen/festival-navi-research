import { Link } from 'react-router-dom'
import { Home, ClipboardList } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="bg-brand-gradient bg-clip-text text-7xl font-black text-transparent sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-black text-ink">ページが見つかりませんでした</h1>
        <p className="mt-3 max-w-md text-ink-soft">
          お探しのページは移動または削除された可能性があります。URLをご確認ください。
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" aria-hidden="true" />
            トップページへ
          </Link>
          <Link to="/survey" className="btn-secondary">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            アンケートに回答する
          </Link>
        </div>
      </div>
    </div>
  )
}
