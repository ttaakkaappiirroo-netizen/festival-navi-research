import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchSurveyResponses,
  fetchTrialRequests,
  updateTrialRequest,
} from '../lib/api'
import type {
  SurveyResponseRow,
  TrialRequestRow,
  TrialStatus,
} from '../types/survey'

interface AdminDataState {
  responses: SurveyResponseRow[]
  trials: TrialRequestRow[]
  loading: boolean
  demo: boolean
  error: string | null
  refresh: () => Promise<void>
  patchTrial: (id: string, patch: { status?: TrialStatus; admin_memo?: string }) => Promise<void>
}

const AdminDataContext = createContext<AdminDataState | undefined>(undefined)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [responses, setResponses] = useState<SurveyResponseRow[]>([])
  const [trials, setTrials] = useState<TrialRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [demo, setDemo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [r, t] = await Promise.all([fetchSurveyResponses(), fetchTrialRequests()])
    if (r.error || t.error) {
      setError(r.error ?? t.error ?? '読み込みに失敗しました。')
    }
    setResponses(r.rows)
    setTrials(t.rows)
    setDemo(r.demo || t.demo)
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const patchTrial = useCallback(
    async (id: string, patch: { status?: TrialStatus; admin_memo?: string }) => {
      // 楽観的更新
      setTrials((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...patch, updated_at: new Date().toISOString() } : t,
        ),
      )
      await updateTrialRequest(id, patch)
    },
    [],
  )

  return (
    <AdminDataContext.Provider
      value={{ responses, trials, loading, demo, error, refresh, patchTrial }}
    >
      {children}
    </AdminDataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminData(): AdminDataState {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
