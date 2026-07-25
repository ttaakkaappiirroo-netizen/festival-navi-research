import { X } from 'lucide-react'
import type { SurveyResponseRow } from '../../types/survey'
import { formatDateTime } from '../../lib/utils'

interface Props {
  row: SurveyResponseRow | null
  onClose: () => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  const empty = value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-slate-100 py-2.5 last:border-0">
      <dt className="text-sm font-semibold text-ink-soft">{label}</dt>
      <dd className="col-span-2 text-sm text-ink">
        {empty ? <span className="text-ink-faint">（未回答）</span> : value}
      </dd>
    </div>
  )
}

function Tags({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <span className="text-ink-faint">（未回答）</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="chip bg-brand-soft text-xs text-brand-indigo">
          {t}
        </span>
      ))}
    </div>
  )
}

export function ResponseDetailModal({ row, onClose }: Props) {
  if (!row) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="回答の詳細"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-card-hover sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="font-black text-ink">回答の詳細</h2>
          <button onClick={onClose} className="btn-ghost p-2" aria-label="閉じる">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4">
          <dl>
            <Row label="回答日時" value={row.created_at ? formatDateTime(row.created_at) : ''} />
            <Row label="立場" value={row.respondent_role} />
            <Row label="都道府県" value={row.prefecture} />
            <Row label="学校の種類" value={row.school_type} />
            <Row label="学校名" value={row.school_name} />
            <Row label="情報発信の方法" value={<Tags items={row.current_information_methods} />} />
            <Row label="当日の更新可否" value={row.update_availability} />
            <Row label="急な変更の伝達" value={<Tags items={row.emergency_communication_methods} />} />
            <Row label="混雑の経験" value={row.congestion_experience} />
            <Row label="運営で大変なこと" value={<Tags items={row.operational_problems} />} />
            <Row label="最も解決したい課題" value={row.biggest_problem} />
            <Row label="具体的な困りごと" value={row.problem_details} />
            <Row label="便利だと思う機能" value={<Tags items={row.desired_features} />} />
            <Row label="最も使いたい機能" value={row.most_desired_feature} />
            <Row label="利用意向" value={row.usage_interest} />
            <Row label="試験導入への興味" value={row.trial_interest} />
            <Row label="連絡先（名前）" value={row.contact_name} />
            <Row label="連絡先（メール）" value={row.contact_email} />
            <Row label="連絡先（その他）" value={row.contact_method} />
            <Row label="文化祭の開催予定時期" value={row.festival_schedule} />
            <Row label="相談したい内容" value={row.consultation_details} />
            <Row label="意見・要望" value={row.additional_feedback} />
            <Row label="統計利用への同意" value={row.statistics_consent ? '同意' : '未同意'} />
          </dl>
        </div>
      </div>
    </div>
  )
}
