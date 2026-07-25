import { useMemo, useState } from 'react'
import { Download, Save, Mail, MapPin, CalendarDays } from 'lucide-react'
import { useAdminData } from '../../hooks/useAdminData'
import { Loading } from '../../components/ui/Loading'
import { downloadCsv, formatDateTime } from '../../lib/utils'
import { csvDate } from '../../lib/aggregate'
import type { TrialStatus, TrialRequestRow } from '../../types/survey'

const STATUSES: TrialStatus[] = [
  '未対応',
  '連絡予定',
  '連絡済み',
  '商談中',
  '試験導入予定',
  '見送り',
]

const STATUS_STYLE: Record<TrialStatus, string> = {
  未対応: 'bg-slate-100 text-slate-700',
  連絡予定: 'bg-blue-50 text-blue-700',
  連絡済み: 'bg-sky-50 text-sky-700',
  商談中: 'bg-amber-50 text-amber-700',
  試験導入予定: 'bg-emerald-50 text-emerald-700',
  見送り: 'bg-slate-100 text-slate-400',
}

function TrialCard({ row }: { row: TrialRequestRow }) {
  const { patchTrial } = useAdminData()
  const [memo, setMemo] = useState(row.admin_memo ?? '')
  const [saved, setSaved] = useState(false)

  const saveMemo = async () => {
    await patchTrial(row.id, { admin_memo: memo })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-ink">{row.school_name || '（学校名なし）'}</h3>
            <span className={`chip text-xs ${STATUS_STYLE[row.status]}`}>{row.status}</span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {row.name}（{row.role}）
          </p>
        </div>
        <p className="text-xs text-ink-faint">{formatDateTime(row.created_at)}</p>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-indigo" aria-hidden="true" />
          {row.prefecture || '—'}
        </p>
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-brand-indigo" aria-hidden="true" />
          {row.email ? (
            <a href={`mailto:${row.email}`} className="hover:text-brand-indigo hover:underline">
              {row.email}
            </a>
          ) : (
            '—'
          )}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-brand-indigo" aria-hidden="true" />
          {row.festival_date || '—'}
        </p>
      </div>

      {row.interested_features.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {row.interested_features.map((f) => (
            <span key={f} className="chip bg-brand-soft text-xs text-brand-indigo">
              {f}
            </span>
          ))}
        </div>
      )}

      {row.message && (
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-ink">{row.message}</p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-[200px_1fr] sm:items-end">
        <div>
          <label className="field-label text-xs" htmlFor={`status-${row.id}`}>
            ステータス
          </label>
          <select
            id={`status-${row.id}`}
            className="field-input mt-1 py-2 text-sm"
            value={row.status}
            onChange={(e) => patchTrial(row.id, { status: e.target.value as TrialStatus })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label text-xs" htmlFor={`memo-${row.id}`}>
            対応メモ
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id={`memo-${row.id}`}
              className="field-input mt-0 py-2 text-sm"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="対応状況をメモ"
              maxLength={300}
            />
            <button onClick={saveMemo} className="btn-secondary shrink-0 px-3 py-2 text-sm">
              <Save className="h-4 w-4" aria-hidden="true" />
              {saved ? '保存済' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminTrialsPage() {
  const { trials, responses, loading } = useAdminData()
  const [statusFilter, setStatusFilter] = useState<string>('')

  // 試験導入に興味がある回答（アンケート由来）も候補として抽出
  const surveyLeads = useMemo(
    () =>
      responses.filter(
        (r) => r.trial_interest && r.trial_interest !== '今回はアンケートのみ',
      ),
    [responses],
  )

  const filteredTrials = useMemo(
    () => (statusFilter ? trials.filter((t) => t.status === statusFilter) : trials),
    [trials, statusFilter],
  )

  const exportTrialsCsv = () => {
    if (!confirm('個人情報（メールアドレス等）を含むCSVを出力します。続行しますか？')) return
    const headers = [
      '受付日時',
      'ステータス',
      '学校名',
      '担当者',
      '立場',
      '都道府県',
      'メール',
      '開催予定日',
      '興味のある機能',
      '相談内容',
      '対応メモ',
    ]
    const rows = filteredTrials.map((t) => [
      csvDate(t.created_at),
      t.status,
      t.school_name,
      t.name,
      t.role,
      t.prefecture,
      t.email,
      t.festival_date,
      t.interested_features.join(' / '),
      t.message,
      t.admin_memo ?? '',
    ])
    downloadCsv('trial_requests.csv', headers, rows)
  }

  if (loading) return <Loading label="試験導入候補を読み込み中…" />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">試験導入候補</h1>
          <p className="text-sm text-ink-soft">
            相談フォームから {trials.length} 件、アンケート経由の関心 {surveyLeads.length} 件
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="field-input mt-0 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">ステータス（すべて）</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={exportTrialsCsv} className="btn-secondary px-4 py-2 text-sm">
            <Download className="h-4 w-4" aria-hidden="true" />
            CSV出力
          </button>
        </div>
      </div>

      {/* 相談フォーム由来 */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-soft">
          相談フォームからの申し込み
        </h2>
        {filteredTrials.length === 0 ? (
          <div className="card py-12 text-center text-ink-faint">
            該当する相談はありません。
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredTrials.map((t) => (
              <TrialCard key={t.id} row={t} />
            ))}
          </div>
        )}
      </section>

      {/* アンケート由来のリード */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-soft">
          アンケートで試験導入に関心を示した回答
        </h2>
        {surveyLeads.length === 0 ? (
          <div className="card py-12 text-center text-ink-faint">
            まだ該当する回答はありません。
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-soft">
                  <tr>
                    <th className="px-4 py-3 font-bold">回答日時</th>
                    <th className="px-4 py-3 font-bold">都道府県</th>
                    <th className="px-4 py-3 font-bold">立場</th>
                    <th className="px-4 py-3 font-bold">学校名</th>
                    <th className="px-4 py-3 font-bold">興味の内容</th>
                    <th className="px-4 py-3 font-bold">連絡先</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {surveyLeads.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                        {r.created_at ? formatDateTime(r.created_at) : '—'}
                      </td>
                      <td className="px-4 py-3">{r.prefecture}</td>
                      <td className="px-4 py-3">{r.respondent_role}</td>
                      <td className="px-4 py-3">
                        {r.school_name || <span className="text-ink-faint">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="chip bg-emerald-50 text-xs text-emerald-700">
                          {r.trial_interest}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.contact_email ? (
                          <a
                            href={`mailto:${r.contact_email}`}
                            className="text-brand-indigo hover:underline"
                          >
                            {r.contact_email}
                          </a>
                        ) : (
                          <span className="text-ink-faint">連絡先なし</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
