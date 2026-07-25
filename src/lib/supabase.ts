import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Supabaseの環境変数が両方そろっている場合のみ本番モード。
 * 片方でも欠けていればデモモード（DBに保存せず、モックで動作）。
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * 本番モードのときだけ実クライアントを生成。
 * デモモードでは null（呼び出し側で isSupabaseConfigured を必ず確認すること）。
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
