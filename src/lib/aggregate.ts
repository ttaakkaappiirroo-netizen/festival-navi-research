import type { SurveyResponseRow } from '../types/survey'
import { formatDate } from './utils'

export interface CountItem {
  name: string
  value: number
}

/** 単一文字列項目の集計（多い順） */
export function countBy(
  rows: SurveyResponseRow[],
  key: keyof SurveyResponseRow,
): CountItem[] {
  const map = new Map<string, number>()
  for (const r of rows) {
    const v = r[key]
    if (typeof v !== 'string' || !v) continue
    map.set(v, (map.get(v) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/** 配列項目の集計（複数選択の各要素をカウント） */
export function countByArray(
  rows: SurveyResponseRow[],
  key: keyof SurveyResponseRow,
): CountItem[] {
  const map = new Map<string, number>()
  for (const r of rows) {
    const v = r[key]
    if (!Array.isArray(v)) continue
    for (const item of v) {
      if (typeof item !== 'string' || !item) continue
      map.set(item, (map.get(item) ?? 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/** 直近 days 日の日別回答数（古い→新しい順） */
export function dailyCounts(rows: SurveyResponseRow[], days = 14): CountItem[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const buckets: CountItem[] = []
  const index = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    index.set(d.toDateString(), buckets.length)
    buckets.push({ name: label, value: 0 })
  }
  for (const r of rows) {
    if (!r.created_at) continue
    const d = new Date(r.created_at)
    d.setHours(0, 0, 0, 0)
    const idx = index.get(d.toDateString())
    if (idx !== undefined) buckets[idx].value += 1
  }
  return buckets
}

export interface DashboardSummary {
  total: number
  prefectureCount: number
  schoolCount: number
  trialInterested: number
  demoWanted: number
  explanationWanted: number
  last7days: number
}

/** ダッシュボードの集計カード用サマリー */
export function summarize(rows: SurveyResponseRow[]): DashboardSummary {
  const prefs = new Set<string>()
  const schools = new Set<string>()
  let trialInterested = 0
  let demoWanted = 0
  let explanationWanted = 0
  let last7days = 0
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  for (const r of rows) {
    if (r.prefecture) prefs.add(r.prefecture)
    if (r.school_name && r.school_name.trim()) schools.add(r.school_name.trim())
    if (r.trial_interest === '無料試験導入に興味がある') trialInterested += 1
    if (r.trial_interest === 'デモを見てみたい') demoWanted += 1
    if (r.trial_interest === '詳しい説明を聞きたい') explanationWanted += 1
    if (r.created_at && new Date(r.created_at).getTime() >= weekAgo) last7days += 1
  }

  return {
    total: rows.length,
    prefectureCount: prefs.size,
    schoolCount: schools.size,
    trialInterested,
    demoWanted,
    explanationWanted,
    last7days,
  }
}

/** CSV用に日時を整形 */
export function csvDate(iso?: string): string {
  return iso ? formatDate(iso) : ''
}
