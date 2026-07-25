import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthState {
  /** ログイン中の管理者メール（デモモードでは 'demo-admin'） */
  email: string | null
  /** デモモードでログインしているか */
  isDemo: boolean
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signInDemo: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const DEMO_KEY = 'fn_demo_admin'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isDemo, setIsDemo] = useState<boolean>(
    () => sessionStorage.getItem(DEMO_KEY) === '1',
  )
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      email: session?.user?.email ?? (isDemo ? 'demo-admin' : null),
      isDemo,
      loading,
      configured: isSupabaseConfigured,
      async signIn(email, password) {
        if (!isSupabaseConfigured || !supabase) {
          return { error: 'Supabaseが未設定です。デモログインをご利用ください。' }
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: error.message }
        return {}
      },
      signInDemo() {
        sessionStorage.setItem(DEMO_KEY, '1')
        setIsDemo(true)
      },
      async signOut() {
        sessionStorage.removeItem(DEMO_KEY)
        setIsDemo(false)
        if (isSupabaseConfigured && supabase) {
          await supabase.auth.signOut()
        }
      },
    }),
    [session, isDemo, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
