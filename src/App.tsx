import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/admin/RequireAuth'
import { Loading } from './components/ui/Loading'

// ページは遅延読み込みして初期表示を軽くする
const HomePage = lazy(() => import('./pages/HomePage'))
const SurveyPage = lazy(() => import('./pages/SurveyPage'))
const SurveyCompletePage = lazy(() => import('./pages/SurveyCompletePage'))
const TrialPage = lazy(() => import('./pages/TrialPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminResponsesPage = lazy(() => import('./pages/admin/AdminResponsesPage'))
const AdminTrialsPage = lazy(() => import('./pages/admin/AdminTrialsPage'))
import { AdminLayout } from './pages/admin/AdminLayout'

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* 公開ページ */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="survey" element={<SurveyPage />} />
            <Route path="survey/complete" element={<SurveyCompletePage />} />
            <Route path="trial" element={<TrialPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* 管理者ログイン（レイアウト外） */}
          <Route path="admin/login" element={<AdminLoginPage />} />

          {/* 管理画面（認証必須） */}
          <Route
            path="admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="responses" element={<AdminResponsesPage />} />
            <Route path="trials" element={<AdminTrialsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}
