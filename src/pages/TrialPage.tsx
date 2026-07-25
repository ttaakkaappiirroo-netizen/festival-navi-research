import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Send, AlertCircle, ArrowLeft } from 'lucide-react'
import { Reveal } from '../components/ui/Reveal'
import { DemoBanner } from '../components/ui/DemoBanner'
import { TRIAL_BENEFITS } from '../config/site'
import { PREFECTURES } from '../data/prefectures'
import { isSupabaseConfigured } from '../lib/supabase'
import { submitTrialRequest } from '../lib/api'
import { isValidEmail } from '../lib/utils'
import type { TrialRequestInput } from '../types/survey'

const ROLES = ['一般生徒', '生徒会', '文化祭実行委員', '部活動・出店担当者', '教職員', 'その他']
const FEATURE_OPTIONS = [
  '出店一覧・カテゴリ検索',
  'デジタル校内マップ',
  'リアルタイム混雑表示',
  'お知らせの即時配信',
  '整理券・順番待ち',
  '来場データ分析',
  '翌年度へのデータ引き継ぎ',
]

const EMPTY: TrialRequestInput = {
  role: '',
  name: '',
  school_name: '',
  prefecture: '',
  email: '',
  festival_date: '',
  interested_features: [],
  message: '',
}

export default function TrialPage() {
  const [form, setForm] = useState<TrialRequestInput>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof TrialRequestInput, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ demo: boolean } | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = <K extends keyof TrialRequestInput>(k: K, v: TrialRequestInput[K]) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => {
      if (!p[k]) return p
      const n = { ...p }
      delete n[k]
      return n
    })
  }

  const toggleFeature = (f: string) => {
    setForm((p) => ({
      ...p,
      interested_features: p.interested_features.includes(f)
        ? p.interested_features.filter((x) => x !== f)
        : [...p.interested_features, f],
    }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof TrialRequestInput, string>> = {}
    if (!form.role) e.role = '選択してください。'
    if (!form.name.trim()) e.name = '入力してください。'
    if (!form.school_name.trim()) e.school_name = '入力してください。'
    if (!form.prefecture) e.prefecture = '選択してください。'
    if (!form.email.trim()) e.email = '入力してください。'
    else if (!isValidEmail(form.email)) e.email = 'メールアドレスの形式が正しくありません。'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (submitting) return
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitTrialRequest(form)
    if (result.ok) {
      setDone({ demo: result.demo })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setSubmitError(result.error ?? '送信に失敗しました。もう一度お試しください。')
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="bg-slate-50">
        <div className="container-page flex min-h-[70vh] max-w-2xl flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-11 w-11 text-emerald-600" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-ink">お問い合わせありがとうございます！</h1>
          <p className="mt-4 max-w-lg text-ink-soft">
            内容を確認のうえ、担当者よりご連絡いたします。無料デモや試験導入について、一緒に相談させてください。
          </p>
          {done.demo && (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
              ※ 現在はデモモードのため、内容はデータベースに保存されていません。
            </p>
          )}
          <Link to="/" className="btn-primary mt-8">
            トップページへ戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50">
      {/* ヘッダー */}
      <section className="relative overflow-hidden bg-brand-gradient py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="container-page relative max-w-3xl text-center">
          <h1 className="text-3xl font-black sm:text-4xl">
            あなたの学校でFestival Naviを試してみませんか？
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            無料デモや試験導入に対応しています。プログラミングの知識は不要です。まずはお気軽にご相談ください。
          </p>
        </div>
      </section>

      {/* メリット */}
      <section className="container-page max-w-5xl py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRIAL_BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="card h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
                  <b.icon className="h-5 w-5 text-brand-indigo" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-bold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* フォーム */}
      <section className="container-page max-w-2xl pb-20">
        {!isSupabaseConfigured && <DemoBanner className="mb-6" />}
        <div className="card sm:p-8">
          <h2 className="text-2xl font-black text-ink">相談フォーム</h2>
          <p className="mt-2 text-sm text-ink-soft">
            <span className="text-brand-orange">*</span> は必須項目です。
          </p>

          {submitError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
            {/* 立場 */}
            <div>
              <label className="field-label" htmlFor="t-role">
                立場<span className="ml-1 text-brand-orange">*</span>
              </label>
              <select
                id="t-role"
                className="field-input"
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                aria-invalid={!!errors.role}
              >
                <option value="">選択してください</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm font-semibold text-red-600">{errors.role}</p>}
            </div>

            {/* 名前 */}
            <TextField
              id="t-name"
              label="名前・担当者名"
              required
              value={form.name}
              onChange={(v) => set('name', v)}
              error={errors.name}
              maxLength={40}
              placeholder="例）文化祭実行委員 山田"
            />

            {/* 学校名 */}
            <TextField
              id="t-school"
              label="学校名"
              required
              value={form.school_name}
              onChange={(v) => set('school_name', v)}
              error={errors.school_name}
              maxLength={60}
              placeholder="例）〇〇高等学校"
            />

            {/* 都道府県 */}
            <div>
              <label className="field-label" htmlFor="t-pref">
                都道府県<span className="ml-1 text-brand-orange">*</span>
              </label>
              <select
                id="t-pref"
                className="field-input"
                value={form.prefecture}
                onChange={(e) => set('prefecture', e.target.value)}
                aria-invalid={!!errors.prefecture}
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.prefecture && (
                <p className="mt-1 text-sm font-semibold text-red-600">{errors.prefecture}</p>
              )}
            </div>

            {/* メール */}
            <TextField
              id="t-email"
              label="メールアドレス"
              required
              type="email"
              value={form.email}
              onChange={(v) => set('email', v)}
              error={errors.email}
              maxLength={120}
              placeholder="例）example@school.ac.jp"
            />

            {/* 開催予定日 */}
            <TextField
              id="t-date"
              label="文化祭の開催予定日（任意）"
              value={form.festival_date}
              onChange={(v) => set('festival_date', v)}
              maxLength={60}
              placeholder="例）2026年9月中旬"
            />

            {/* 興味のある機能 */}
            <div>
              <span className="field-label">興味のある機能（任意・複数選択可）</span>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                {FEATURE_OPTIONS.map((f) => {
                  const selected = form.interested_features.includes(f)
                  return (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleFeature(f)}
                      aria-pressed={selected}
                      className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all ${
                        selected
                          ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                          : 'border-slate-200 bg-white text-ink hover:border-brand-purple/40'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${selected ? 'text-brand-purple' : 'text-slate-300'}`}
                      />
                      {f}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 相談内容 */}
            <div>
              <label className="field-label" htmlFor="t-msg">
                相談内容（任意）
              </label>
              <textarea
                id="t-msg"
                className="field-input min-h-[120px] resize-y"
                value={form.message}
                maxLength={500}
                placeholder="例）来場者向けのマップと混雑表示を試したいです。"
                onChange={(e) => set('message', e.target.value)}
              />
              <p className="mt-1 text-right text-xs text-ink-faint">{form.message.length} / 500</p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse sm:items-center sm:justify-between">
              <button type="submit" className="btn-primary sm:min-w-[200px]" disabled={submitting}>
                {submitting ? (
                  '送信中…'
                ) : (
                  <>
                    相談を送信する
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
              <Link to="/" className="btn-ghost justify-center">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                トップへ戻る
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  error?: string
  maxLength?: number
  placeholder?: string
}

function TextField({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
  error,
  maxLength,
  placeholder,
}: TextFieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-brand-orange">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className="field-input"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}
