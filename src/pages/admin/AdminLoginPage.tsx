import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, LogIn, ShieldCheck, AlertCircle, FlaskConical } from 'lucide-react'
import { Logo } from '../../components/ui/Logo'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLoginPage() {
  const { signIn, signInDemo, configured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/admin')
  }

  const handleDemo = () => {
    signInDemo()
    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-soft px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="card sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient">
              <Lock className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-black text-ink">管理者ログイン</h1>
              <p className="text-sm text-ink-soft">回答データの集計・管理用</p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="field-label" htmlFor="email">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required={configured}
                disabled={!configured}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="password">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required={configured}
                disabled={!configured}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !configured}
            >
              {loading ? (
                'ログイン中…'
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  ログイン
                </>
              )}
            </button>
          </form>

          {!configured && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-800">
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                Supabase未設定（デモモード）
              </p>
              <p className="mt-1 text-xs text-amber-800/90">
                認証は無効です。サンプルデータで管理画面を確認できます。
              </p>
              <button onClick={handleDemo} className="btn-secondary mt-3 w-full">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                デモとして管理画面を見る
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="font-semibold text-ink-soft hover:text-brand-indigo">
            ← トップページへ戻る
          </Link>
        </p>
      </div>
    </div>
  )
}
