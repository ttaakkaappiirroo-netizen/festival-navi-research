/**
 * =====================================================================
 *  サイト全体の文章・実績・数値をまとめた設定ファイル
 * ---------------------------------------------------------------------
 *  ここを編集すると、サイト内の文言や実績カードの内容を一括で変更できます。
 *  ※ 架空の利用者数などを「事実」として載せないでください。
 *     未確定の数値は null にすると「調査中」等の控えめな表示になります。
 * =====================================================================
 */

import type { LucideIcon } from 'lucide-react'
import {
  Newspaper,
  MapPin,
  Users2,
  Megaphone,
  Sparkles,
  BarChart3,
  Ticket,
  Search,
  Store,
  CalendarClock,
  Bell,
  Trophy,
  PackageSearch,
  Languages,
  ClipboardList,
  Repeat,
  Smartphone,
  Palette,
  ShieldCheck,
} from 'lucide-react'

export const SITE = {
  name: 'Festival Navi',
  fullName: 'Festival Navi 全国文化祭アンケート',
  tagline: '文化祭運営を、もっと簡単に。',
  subCopy:
    'Festival Naviは、出店情報、校内マップ、混雑状況、お知らせなどを一つにまとめる、学校向け文化祭運営プラットフォームです。実際の高校文化祭で運用した経験をもとに、全国の高校生・先生を対象とした文化祭運営の実態調査を行っています。',
  surveyMinutes: 3,
  contactEmail: 'festival.navi.research@example.com',
} as const

/** ヘッダーのナビゲーション（アンカーリンク or ページ遷移） */
export const NAV_LINKS = [
  { label: 'Festival Naviについて', hash: '#about' },
  { label: '調査の目的', hash: '#purpose' },
  { label: '主な機能', hash: '#features' },
  { label: 'アンケート', to: '/survey' },
  { label: '試験導入', to: '/trial' },
] as const

/**
 * 実績・数値。
 * 事実として確定しているものだけ value を入れてください。
 * 未確定は null にすると「調査中」と表示されます。
 */
export interface StatItem {
  label: string
  value: number | null
  suffix?: string
  note?: string
}

export const STATS: StatItem[] = [
  { label: '運用した文化祭', value: 1, suffix: '校', note: '実際の高校文化祭で運用' },
  { label: 'デジタル化した出店情報', value: null, note: '運用校で出店情報をWeb化' },
  { label: '調査対象', value: 47, suffix: '都道府県', note: '全国の高校生・先生が対象' },
  { label: '回答目安時間', value: 3, suffix: '分', note: '匿名で回答できます' },
]

/** 実績カード（事実ベースの取り組み内容） */
export interface AchievementCard {
  icon: LucideIcon
  title: string
  description: string
}

export const ACHIEVEMENTS: AchievementCard[] = [
  {
    icon: Trophy,
    title: '実際の高校文化祭で運用',
    description:
      '構想だけでなく、実際の高校の文化祭で来場者・運営が使うシステムとして運用しました。',
  },
  {
    icon: Store,
    title: '出店情報をデジタル化',
    description:
      '紙のパンフレットに頼らず、出店の場所・内容・カテゴリをWeb上で一覧・検索できるようにしました。',
  },
  {
    icon: Users2,
    title: '混雑状況をWeb上で表示',
    description:
      '各出店の混雑状況をWebで確認できるようにし、来場者が空いている場所を選べるようにしました。',
  },
  {
    icon: ClipboardList,
    title: '管理画面から情報を更新',
    description:
      '実行委員が管理画面から出店情報やお知らせをその場で更新できる仕組みを用意しました。',
  },
  {
    icon: Smartphone,
    title: 'スマートフォンから利用可能',
    description:
      '来場者は自分のスマートフォンから、アプリのインストール不要で情報を確認できます。',
  },
]

/** 文化祭運営の課題 */
export interface ChallengeCard {
  icon: LucideIcon
  title: string
}

export const CHALLENGES: ChallengeCard[] = [
  { icon: Newspaper, title: '紙のパンフレットでは最新情報を反映できない' },
  { icon: MapPin, title: '出店場所や内容が分かりにくい' },
  { icon: Users2, title: '混雑している場所が分からない' },
  { icon: Megaphone, title: '急な変更を来場者に伝えにくい' },
  { icon: ClipboardList, title: '文化祭実行委員の負担が大きい' },
  { icon: Repeat, title: '前年度のデータやノウハウが引き継がれない' },
]

/** Festival Naviでできること。status で開発状況を表示 */
export type FeatureStatus = '提供中' | '開発予定' | '構想中'

export interface FeatureCard {
  icon: LucideIcon
  title: string
  description: string
  status: FeatureStatus
}

export const FEATURES: FeatureCard[] = [
  {
    icon: Store,
    title: '出店一覧とカテゴリ検索',
    description: '出店を一覧表示し、食べ物・体験・展示などカテゴリで絞り込めます。',
    status: '提供中',
  },
  {
    icon: MapPin,
    title: 'デジタル校内マップ',
    description: '校内のどこに何があるかをマップ上で確認できます。',
    status: '提供中',
  },
  {
    icon: Users2,
    title: 'リアルタイム混雑表示',
    description: '各エリアの混雑状況をリアルタイムで見える化します。',
    status: '提供中',
  },
  {
    icon: Bell,
    title: '緊急のお知らせ配信',
    description: '中止・変更などの重要なお知らせを即座に来場者へ届けます。',
    status: '提供中',
  },
  {
    icon: ClipboardList,
    title: '文化祭実行委員向け管理画面',
    description: '出店情報やお知らせを、実行委員がその場で更新できます。',
    status: '提供中',
  },
  {
    icon: Ticket,
    title: '整理券・順番待ち機能',
    description: '人気の出店の整理券発行や順番待ちをデジタルで管理します。',
    status: '開発予定',
  },
  {
    icon: BarChart3,
    title: '来場データの分析',
    description: '来場者数や人気の出店などのデータを可視化します。',
    status: '開発予定',
  },
  {
    icon: Repeat,
    title: '翌年度へのデータ引き継ぎ',
    description: '今年のデータやノウハウを翌年度にそのまま引き継げます。',
    status: '構想中',
  },
]

/** 「主な機能」セクションで使う機能タグ（アイコン付き） */
export const FEATURE_TAGS: { icon: LucideIcon; label: string }[] = [
  { icon: Store, label: '出店一覧' },
  { icon: Search, label: 'カテゴリ検索' },
  { icon: MapPin, label: 'デジタル校内マップ' },
  { icon: Users2, label: 'リアルタイム混雑表示' },
  { icon: Bell, label: 'お知らせ即時配信' },
  { icon: Ticket, label: '整理券・順番待ち' },
  { icon: CalendarClock, label: 'スケジュール表示' },
  { icon: Sparkles, label: 'スタンプラリー' },
  { icon: Trophy, label: '投票・人気ランキング' },
  { icon: PackageSearch, label: '落とし物情報' },
  { icon: BarChart3, label: '来場データ分析' },
  { icon: Languages, label: '多言語対応' },
]

/** 調査の目的 */
export const PURPOSES: string[] = [
  '学校ごとの文化祭運営方法を調べる',
  '実行委員や先生が困っていることを知る',
  '本当に必要な機能を開発する',
  '全国の学校で利用できるサービスに成長させる',
  '無料試験導入に協力してくれる学校を探す',
]

/** 回答対象者 */
export const AUDIENCES: string[] = [
  '一般生徒',
  '生徒会',
  '文化祭実行委員',
  '部活動・出店担当者',
  '教職員',
  '学校関係者',
]

/** 試験導入ページのメリット */
export interface TrialBenefit {
  icon: LucideIcon
  title: string
  description: string
}

export const TRIAL_BENEFITS: TrialBenefit[] = [
  {
    icon: Sparkles,
    title: '無料デモに対応',
    description: '実際の画面を見ながら、機能や使い方をオンラインでご説明します。',
  },
  {
    icon: Palette,
    title: '学校ごとのデザインに変更可能',
    description: '学校名やテーマカラーなど、学校に合わせた見た目に調整できます。',
  },
  {
    icon: ShieldCheck,
    title: 'プログラミング知識は不要',
    description: '管理画面から操作するだけ。専門知識がなくても運用できます。',
  },
  {
    icon: Smartphone,
    title: 'スマートフォンから情報更新',
    description: '当日もスマホから出店情報やお知らせを更新できます。',
  },
  {
    icon: Users2,
    title: '導入前のオンライン相談',
    description: '不安な点や必要な機能を、導入前にオンラインでご相談いただけます。',
  },
  {
    icon: ClipboardList,
    title: '試験導入の内容は個別相談',
    description: '学校の状況に合わせて、試験導入の範囲や内容を個別に決められます。',
  },
]
