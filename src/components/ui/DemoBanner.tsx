import { FlaskConical } from 'lucide-react'

/** Supabase未設定時に表示する「デモモード」バナー */
export function DemoBanner({ className = '' }: { className?: string }) {
  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 ${className}`}
    >
      <FlaskConical className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        現在はデモモードです。入力内容はデータベースに保存されません（表示は
        サンプルデータです）。
      </span>
    </div>
  )
}
