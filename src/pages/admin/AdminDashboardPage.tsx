import { useMemo } from 'react'
import {
  Users,
  MapPin,
  School,
  Sparkles,
  Eye,
  MessageCircle,
  CalendarDays,
  RefreshCw,
} from 'lucide-react'
import { useAdminData } from '../../hooks/useAdminData'
import { Loading } from '../../components/ui/Loading'
import {
  ChartCard,
  HBarChart,
  VBarChart,
  DonutChart,
  DailyAreaChart,
} from '../../components/admin/Charts'
import {
  summarize,
  countBy,
  countByArray,
  dailyCounts,
} from '../../lib/aggregate'
import { formatNumber } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  accent: string
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <p className="text-2xl font-black text-ink">{formatNumber(value)}</p>
        <p className="text-xs font-semibold text-ink-soft">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { responses, loading, error, refresh } = useAdminData()

  const summary = useMemo(() => summarize(responses), [responses])
  const byPrefecture = useMemo(() => countBy(responses, 'prefecture'), [responses])
  const byRole = useMemo(() => countBy(responses, 'respondent_role'), [responses])
  const bySchoolType = useMemo(() => countBy(responses, 'school_type'), [responses])
  const byProblems = useMemo(() => countByArray(responses, 'operational_problems'), [responses])
  const byFeatures = useMemo(() => countByArray(responses, 'desired_features'), [responses])
  const byUsage = useMemo(() => countBy(responses, 'usage_interest'), [responses])
  const byTrial = useMemo(() => countBy(responses, 'trial_interest'), [responses])
  const daily = useMemo(() => dailyCounts(responses, 14), [responses])

  if (loading) return <Loading label="集計データを読み込み中…" />

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">ダッシュボード</h1>
          <p className="text-sm text-ink-soft">アンケート回答の集計サマリー</p>
        </div>
        <button onClick={() => void refresh()} className="btn-secondary px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          更新
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* 集計カード */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="総回答数" value={summary.total} accent="bg-indigo-50 text-brand-indigo" />
        <StatCard icon={MapPin} label="回答都道府県数" value={summary.prefectureCount} accent="bg-blue-50 text-brand-blue" />
        <StatCard icon={School} label="学校名が入力された学校数" value={summary.schoolCount} accent="bg-purple-50 text-brand-purple" />
        <StatCard icon={CalendarDays} label="直近7日間の回答数" value={summary.last7days} accent="bg-orange-50 text-brand-orange" />
        <StatCard icon={Sparkles} label="試験導入に興味あり" value={summary.trialInterested} accent="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Eye} label="デモ希望" value={summary.demoWanted} accent="bg-sky-50 text-sky-600" />
        <StatCard icon={MessageCircle} label="詳しい説明を希望" value={summary.explanationWanted} accent="bg-pink-50 text-pink-600" />
        <StatCard
          icon={Sparkles}
          label="試験導入への関心 合計"
          value={summary.trialInterested + summary.demoWanted + summary.explanationWanted}
          accent="bg-amber-50 text-brand-amber"
        />
      </div>

      {/* グラフ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="日別回答数" subtitle="直近14日間">
          <DailyAreaChart data={daily} />
        </ChartCard>
        <ChartCard title="試験導入への興味" subtitle="回答者の内訳">
          <DonutChart data={byTrial} />
        </ChartCard>
        <ChartCard title="回答者の立場">
          <VBarChart data={byRole} />
        </ChartCard>
        <ChartCard title="学校の種類">
          <DonutChart data={bySchoolType} />
        </ChartCard>
        <ChartCard title="文化祭運営の課題" subtitle="複数選択・多い順">
          <HBarChart data={byProblems} />
        </ChartCard>
        <ChartCard title="欲しい機能" subtitle="複数選択・多い順">
          <HBarChart data={byFeatures} />
        </ChartCard>
        <ChartCard title="利用意向">
          <VBarChart data={byUsage} />
        </ChartCard>
        <ChartCard title="都道府県別回答数" subtitle="多い順">
          <HBarChart data={byPrefecture} />
        </ChartCard>
      </div>
    </div>
  )
}
