/**
 * デモモード用のモックデータ生成。
 * Supabase未設定時に管理画面のグラフ・一覧を確認できるようにするための
 * 「サンプル」であり、本物の回答ではありません（画面上でも明示します）。
 */
import type { SurveyResponseRow, TrialRequestRow, TrialStatus } from '../types/survey'
import { PREFECTURES } from './prefectures'

const roles = ['一般生徒', '生徒会', '文化祭実行委員', '部活動・出店担当者', '教職員', 'その他']
const schoolTypes = ['公立高校', '私立高校', '通信制高校', '中高一貫校', '高等専門学校', '中学校']
const problems = [
  '出店情報の収集',
  '紙のパンフレット作成',
  '出店場所の案内',
  'スケジュール管理',
  '情報の変更・修正',
  '混雑への対応',
  '来場者へのお知らせ',
  '実行委員間の情報共有',
  '前年度からの引き継ぎ',
]
const features = [
  '出店一覧',
  'デジタル校内マップ',
  'リアルタイム混雑表示',
  'お知らせの即時配信',
  '整理券・順番待ち',
  'スケジュール表示',
  '来場データ分析',
  '翌年度へのデータ引き継ぎ',
]
const usageInterest = ['ぜひ使いたい', '条件が合えば使いたい', '詳しい内容を知りたい', 'あまり必要ない', '分からない']
const trialInterest = ['無料試験導入に興味がある', 'デモを見てみたい', '詳しい説明を聞きたい', '今回はアンケートのみ']

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}
function pickMany<T>(arr: T[], seed: number, count: number): T[] {
  const out: T[] = []
  for (let i = 0; i < count; i++) out.push(arr[(seed + i * 3) % arr.length])
  return Array.from(new Set(out))
}

/** 決定的（乱数を使わない）にモック回答を生成 */
export function makeMockResponses(count = 42): SurveyResponseRow[] {
  const now = Date.now()
  const rows: SurveyResponseRow[] = []
  for (let i = 0; i < count; i++) {
    const daysAgo = i % 20
    const created = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - i * 60000)
    const trial = pick(trialInterest, i + 1)
    const hasContact = trial !== '今回はアンケートのみ' && i % 3 === 0
    rows.push({
      id: `mock-${i + 1}`,
      respondent_role: pick(roles, i),
      prefecture: pick([...PREFECTURES], i * 5 + 3),
      school_type: pick(schoolTypes, i + 2),
      school_name: i % 4 === 0 ? `サンプル第${(i % 9) + 1}高等学校` : '',
      current_information_methods: pickMany(
        ['紙のパンフレット', '学校公式サイト', 'Instagram', 'X', '校内掲示'],
        i,
        2,
      ),
      update_availability: pick(['簡単に更新できる', '一部のみ更新できる', '更新が難しい', '更新できない'], i),
      emergency_communication_methods: pickMany(['校内アナウンス', 'SNSで発信', '校内掲示の貼り替え'], i, 2),
      congestion_experience: pick(['よくある', 'ときどきある', 'あまりない', 'ない'], i),
      operational_problems: pickMany(problems, i, 3),
      biggest_problem: pick(problems, i),
      problem_details: i % 5 === 0 ? '当日の変更を伝えるのが大変でした。' : '',
      desired_features: pickMany(features, i, 3),
      most_desired_feature: pick(features, i),
      usage_interest: pick(usageInterest, i),
      trial_interest: trial,
      contact_name: hasContact ? `担当${i}` : '',
      contact_email: hasContact ? `sample${i}@example.com` : '',
      contact_method: '',
      festival_schedule: hasContact ? '2026年9月ごろ' : '',
      consultation_details: hasContact ? 'マップ機能を試したいです。' : '',
      additional_feedback: i % 7 === 0 ? '応援しています！' : '',
      statistics_consent: true,
      created_at: created.toISOString(),
    })
  }
  return rows
}

const statuses: TrialStatus[] = ['未対応', '連絡予定', '連絡済み', '商談中', '試験導入予定', '見送り']

export function makeMockTrialRequests(count = 8): TrialRequestRow[] {
  const now = Date.now()
  const rows: TrialRequestRow[] = []
  for (let i = 0; i < count; i++) {
    const created = new Date(now - (i % 15) * 24 * 60 * 60 * 1000)
    rows.push({
      id: `mock-trial-${i + 1}`,
      role: pick(roles, i),
      name: `担当者${i + 1}`,
      school_name: `サンプル第${(i % 9) + 1}高等学校`,
      prefecture: pick([...PREFECTURES], i * 4 + 1),
      email: `trial${i}@example.com`,
      festival_date: '2026年9月ごろ',
      interested_features: pickMany(features, i, 2),
      message: 'デモを見てみたいです。',
      status: pick(statuses, i),
      admin_memo: '',
      created_at: created.toISOString(),
      updated_at: created.toISOString(),
    })
  }
  return rows
}
