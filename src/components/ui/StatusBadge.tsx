import type { FeatureStatus } from '../../config/site'
import { cn } from '../../lib/utils'

const STYLES: Record<FeatureStatus, string> = {
  提供中: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  開発予定: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  構想中: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
}

export function StatusBadge({ status }: { status: FeatureStatus }) {
  return (
    <span className={cn('chip text-xs', STYLES[status])}>{status}</span>
  )
}
