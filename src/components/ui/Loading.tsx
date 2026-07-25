import { Loader2 } from 'lucide-react'

export function Loading({ label = '読み込み中…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
      <Loader2 className="h-8 w-8 animate-spin text-brand-indigo" aria-hidden="true" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  )
}
