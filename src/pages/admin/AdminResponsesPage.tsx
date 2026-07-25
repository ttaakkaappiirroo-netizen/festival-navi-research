import { useMemo, useState } from 'react'
import { Search, Download, FileSpreadsheet, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useAdminData } from '../../hooks/useAdminData'
import { Loading } from '../../components/ui/Loading'
import { ResponseDetailModal } from '../../components/admin/ResponseDetailModal'
import { PREFECTURES } from '../../data/prefectures'
import { downloadCsv, formatDateTime } from '../../lib/utils'
import { csvDate } from '../../lib/aggregate'
import type { SurveyResponseRow } from '../../types/survey'

const ROLES = ['一般生徒', '生徒会', '文化祭実行委員', '部活動・出店担当者', '教職員', 'その他']
const TRIAL_OPTIONS = [
  '無料試験導入に興味がある',
  'デモを見てみたい',
  '詳しい説明を聞きたい',
  '今回はアンケートのみ',
]
const PAGE_SIZE = 12

export default function AdminResponsesPage() {
  const { responses, loading } = useAdminData()
  const [keyword, setKeyword] = useState('')
  const [prefFilter, setPrefFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [trialFilter, setTrialFilter] = useState('')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(0)
  const [detail, setDetail] = useState<SurveyResponseRow | null>(null)

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    const list = responses.filter((r) => {
      if (prefFilter && r.prefecture !== prefFilter) return false
      if (roleFilter && r.respondent_role !== roleFilter) return false
      if (trialFilter && r.trial_interest !== trialFilter) return false
      if (kw) {
        const hay = [
          r.school_name,
          r.prefecture,
          r.respondent_role,
          r.biggest_problem,
          r.most_desired_feature,
          r.problem_details,
          r.additional_feedback,
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(kw)) return false
      }
      return true
    })
    list.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0
      return sortDesc ? tb - ta : ta - tb
    })
    return list
  }, [responses, keyword, prefFilter, roleFilter, trialFilter, sortDesc])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const clampedPage = Math.min(page, pageCount - 1)
  const pageRows = filtered.slice(clampedPage * PAGE_SIZE, clampedPage * PAGE_SIZE + PAGE_SIZE)

  const resetPage = () => setPage(0)

  // CSV: 匿名化集計用（個人情報を含めない）
  const exportAnonymousCsv = () => {
    const headers = [
      '回答日時',
      '立場',
      '都道府県',
      '学校の種類',
      '情報発信の方法',
      '当日の更新可否',
      '急な変更の伝達',
      '混雑の経験',
      '運営で大変なこと',
      '最も解決したい課題',
      '便利だと思う機能',
      '最も使いたい機能',
      '利用意向',
      '試験導入への興味',
      '統計利用への同意',
    ]
    const rows = filtered.map((r) => [
      csvDate(r.created_at),
      r.respondent_role,
      r.prefecture,
      r.school_type,
      r.current_information_methods.join(' / '),
      r.update_availability,
      r.emergency_communication_methods.join(' / '),
      r.congestion_experience,
      r.operational_problems.join(' / '),
      r.biggest_problem,
      r.desired_features.join(' / '),
      r.most_desired_feature,
      r.usage_interest,
      r.trial_interest,
      r.statistics_consent ? '同意' : '未同意',
    ])
    downloadCsv('survey_anonymous.csv', headers, rows)
  }

  // CSV: 個人情報を含む（取り扱い注意）
  const exportFullCsv = () => {
    if (
      !confirm(
        'メールアドレスなどの個人情報を含むCSVを出力します。取り扱いに十分ご注意ください。続行しますか？',
      )
    )
      return
    const headers = [
      '回答日時',
      '立場',
      '都道府県',
      '学校の種類',
      '学校名',
      '情報発信の方法',
      '当日の更新可否',
      '急な変更の伝達',
      '混雑の経験',
      '運営で大変なこと',
      '最も解決したい課題',
      '具体的な困りごと',
      '便利だと思う機能',
      '最も使いたい機能',
      '利用意向',
      '試験導入への興味',
      '連絡先氏名',
      '連絡先メール',
      '連絡先その他',
      '開催予定時期',
      '相談内容',
      '意見・要望',
      '統計利用への同意',
    ]
    const rows = filtered.map((r) => [
      csvDate(r.created_at),
      r.respondent_role,
      r.prefecture,
      r.school_type,
      r.school_name,
      r.current_information_methods.join(' / '),
      r.update_availability,
      r.emergency_communication_methods.join(' / '),
      r.congestion_experience,
      r.operational_problems.join(' / '),
      r.biggest_problem,
      r.problem_details,
      r.desired_features.join(' / '),
      r.most_desired_feature,
      r.usage_interest,
      r.trial_interest,
      r.contact_name,
      r.contact_email,
      r.contact_method,
      r.festival_schedule,
      r.consultation_details,
      r.additional_feedback,
      r.statistics_consent ? '同意' : '未同意',
    ])
    downloadCsv('survey_full_personal.csv', headers, rows)
  }

  if (loading) return <Loading label="回答データを読み込み中…" />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">回答一覧</h1>
          <p className="text-sm text-ink-soft">
            全 {responses.length} 件中 {filtered.length} 件を表示
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportAnonymousCsv} className="btn-secondary px-4 py-2 text-sm">
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
            集計用CSV（匿名）
          </button>
          <button onClick={exportFullCsv} className="btn-secondary px-4 py-2 text-sm">
            <Download className="h-4 w-4" aria-hidden="true" />
            個人情報含むCSV
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            className="field-input mt-0 pl-9"
            placeholder="キーワード検索（学校名・課題など）"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              resetPage()
            }}
          />
        </div>
        <select
          className="field-input mt-0"
          value={prefFilter}
          onChange={(e) => {
            setPrefFilter(e.target.value)
            resetPage()
          }}
        >
          <option value="">都道府県（すべて）</option>
          {PREFECTURES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="field-input mt-0"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value)
            resetPage()
          }}
        >
          <option value="">立場（すべて）</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="field-input mt-0"
          value={trialFilter}
          onChange={(e) => {
            setTrialFilter(e.target.value)
            resetPage()
          }}
        >
          <option value="">試験導入意向（すべて）</option>
          {TRIAL_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* テーブル */}
      {filtered.length === 0 ? (
        <div className="card py-16 text-center text-ink-faint">
          条件に一致する回答がありません。
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-soft">
                <tr>
                  <th className="px-4 py-3">
                    <button
                      onClick={() => setSortDesc((v) => !v)}
                      className="font-bold hover:text-ink"
                    >
                      回答日時 {sortDesc ? '▼' : '▲'}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-bold">都道府県</th>
                  <th className="px-4 py-3 font-bold">立場</th>
                  <th className="px-4 py-3 font-bold">学校種別</th>
                  <th className="px-4 py-3 font-bold">学校名</th>
                  <th className="px-4 py-3 font-bold">最も困っていること</th>
                  <th className="px-4 py-3 font-bold">最も欲しい機能</th>
                  <th className="px-4 py-3 font-bold">利用意向</th>
                  <th className="px-4 py-3 font-bold">試験導入</th>
                  <th className="px-4 py-3 font-bold">詳細</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                      {r.created_at ? formatDateTime(r.created_at) : '—'}
                    </td>
                    <td className="px-4 py-3">{r.prefecture}</td>
                    <td className="px-4 py-3">{r.respondent_role}</td>
                    <td className="px-4 py-3">{r.school_type}</td>
                    <td className="px-4 py-3">
                      {r.school_name || <span className="text-ink-faint">—</span>}
                    </td>
                    <td className="px-4 py-3">{r.biggest_problem}</td>
                    <td className="px-4 py-3">{r.most_desired_feature}</td>
                    <td className="px-4 py-3">{r.usage_interest}</td>
                    <td className="px-4 py-3">
                      {r.trial_interest !== '今回はアンケートのみ' ? (
                        <span className="chip bg-emerald-50 text-xs text-emerald-700">
                          {r.trial_interest}
                        </span>
                      ) : (
                        <span className="text-ink-faint">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetail(r)}
                        className="inline-flex items-center gap-1 font-semibold text-brand-indigo hover:underline"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        表示
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
            <p className="text-ink-soft">
              {clampedPage + 1} / {pageCount} ページ
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={clampedPage === 0}
                className="btn-ghost px-3 py-1.5"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                前へ
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={clampedPage >= pageCount - 1}
                className="btn-ghost px-3 py-1.5"
              >
                次へ
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      <ResponseDetailModal row={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
