import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Loading } from '../ui/Loading'

/** 管理者ページのアクセス制御。未ログインはログイン画面へ */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { email, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="認証を確認中…" />
      </div>
    )
  }

  if (!email) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
