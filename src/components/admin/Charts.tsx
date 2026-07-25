import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import type { CountItem } from '../../lib/aggregate'

const CHART_COLORS = [
  '#4f46e5',
  '#7c3aed',
  '#2563eb',
  '#f97316',
  '#f59e0b',
  '#0ea5e9',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#6366f1',
]

interface CardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function ChartCard({ title, subtitle, children }: CardProps) {
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="font-bold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-faint">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-ink-faint">
      データがありません
    </div>
  )
}

/** 横棒グラフ（項目が多い集計向け） */
export function HBarChart({ data }: { data: CountItem[] }) {
  if (data.length === 0) return <EmptyChart />
  const height = Math.max(240, data.length * 34)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="#f1f5f9" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 12, fill: '#334155' }}
          interval={0}
        />
        <Tooltip
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} name="件数">
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/** 縦棒グラフ */
export function VBarChart({ data }: { data: CountItem[] }) {
  if (data.length === 0) return <EmptyChart />
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -16, right: 8, top: 4, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#334155' }}
          interval={0}
          angle={data.length > 6 ? -30 : 0}
          textAnchor={data.length > 6 ? 'end' : 'middle'}
          height={data.length > 6 ? 60 : 30}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
        <Tooltip
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} name="件数">
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/** 円グラフ */
export function DonutChart({ data }: { data: CountItem[] }) {
  if (data.length === 0) return <EmptyChart />
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
          formatter={(v) => <span className="text-ink-soft">{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

/** 日別の面グラフ */
export function DailyAreaChart({ data }: { data: CountItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 4, bottom: 4 }}>
        <defs>
          <linearGradient id="fillDaily" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval="preserveStartEnd" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          name="回答数"
          stroke="#4f46e5"
          strokeWidth={2.5}
          fill="url(#fillDaily)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
