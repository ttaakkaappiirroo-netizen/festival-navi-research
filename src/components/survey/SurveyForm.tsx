import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send, AlertCircle, RotateCcw } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { QuestionField } from './QuestionField'
import { DemoBanner } from '../ui/DemoBanner'
import {
  SURVEY_STEPS,
  EMPTY_ANSWERS,
  CONTACT_FIELD_IDS,
  TRIAL_INTEREST_WITH_CONTACT,
} from '../../config/survey'
import type { QuestionDef, SurveyAnswers } from '../../types/survey'
import { submitSurvey } from '../../lib/api'
import { isSupabaseConfigured } from '../../lib/supabase'
import { isValidEmail } from '../../lib/utils'

const STORAGE_KEY = 'fn_survey_draft'

type Value = string | string[] | boolean

function loadDraft(): SurveyAnswers {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY_ANSWERS }
    const parsed = JSON.parse(raw)
    return { ...EMPTY_ANSWERS, ...parsed }
  } catch {
    return { ...EMPTY_ANSWERS }
  }
}

export function SurveyForm() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [answers, setAnswers] = useState<SurveyAnswers>(loadDraft)
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Partial<Record<keyof SurveyAnswers, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const step = SURVEY_STEPS[stepIndex]
  const isLast = stepIndex === SURVEY_STEPS.length - 1

  // 下書きを保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    } catch {
      /* localStorage 使用不可でも動作継続 */
    }
  }, [answers])

  // 表示する質問（試験導入ステップの連絡先は条件付き）
  const visibleQuestions = useMemo<QuestionDef[]>(() => {
    const showContact = TRIAL_INTEREST_WITH_CONTACT.includes(answers.trial_interest)
    return step.questions.filter((q) => {
      if (CONTACT_FIELD_IDS.includes(q.id)) return showContact
      return true
    })
  }, [step, answers.trial_interest])

  const handleChange = (id: keyof SurveyAnswers, value: Value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const validateStep = (): boolean => {
    const next: Partial<Record<keyof SurveyAnswers, string>> = {}
    for (const q of visibleQuestions) {
      const v = answers[q.id]
      if (q.required) {
        if (q.kind === 'multi' && Array.isArray(v) && v.length === 0) {
          next[q.id] = '1つ以上選択してください。'
        } else if (q.kind === 'consent' && v !== true) {
          next[q.id] = '同意が必要です。'
        } else if ((q.kind === 'single' || q.kind === 'prefecture') && !v) {
          next[q.id] = '選択してください。'
        } else if ((q.kind === 'text' || q.kind === 'textarea') && !String(v).trim()) {
          next[q.id] = '入力してください。'
        }
      }
      if (q.id === 'contact_email' && typeof v === 'string' && !isValidEmail(v)) {
        next[q.id] = 'メールアドレスの形式が正しくありません。'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const scrollTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNext = () => {
    if (!validateStep()) {
      scrollTop()
      return
    }
    setStepIndex((i) => Math.min(i + 1, SURVEY_STEPS.length - 1))
    scrollTop()
  }

  const handleBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0))
    setSubmitError(null)
    scrollTop()
  }

  const handleSubmit = async () => {
    if (submitting) return
    if (!validateStep()) {
      scrollTop()
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    // 連絡先を表示していない場合は空にして送信（残骸を送らない）
    const showContact = TRIAL_INTEREST_WITH_CONTACT.includes(answers.trial_interest)
    const payload: SurveyAnswers = showContact
      ? answers
      : {
          ...answers,
          contact_name: '',
          contact_email: '',
          contact_method: '',
          festival_schedule: '',
          consultation_details: '',
        }
    const result = await submitSurvey(payload)
    if (result.ok) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* noop */
      }
      navigate('/survey/complete', { state: { demo: result.demo } })
    } else {
      setSubmitError(
        result.error ?? '送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。',
      )
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    if (!confirm('入力した内容をすべて消去して最初からやり直しますか？')) return
    setAnswers({ ...EMPTY_ANSWERS })
    setErrors({})
    setStepIndex(0)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
    scrollTop()
  }

  return (
    <div className="container-page max-w-3xl py-10 sm:py-14">
      <div ref={topRef} className="scroll-mt-24" />

      {!isSupabaseConfigured && <DemoBanner className="mb-6" />}

      <div className="card sm:p-8">
        <ProgressBar current={stepIndex} total={SURVEY_STEPS.length} stepTitle={step.title} />

        {step.description && (
          <p className="mt-4 text-sm text-ink-soft">{step.description}</p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-8 space-y-8"
          >
            {visibleQuestions.map((q) => (
              <QuestionField
                key={q.id}
                q={q}
                value={answers[q.id]}
                onChange={handleChange}
                error={errors[q.id]}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          {stepIndex > 0 ? (
            <button type="button" onClick={handleBack} className="btn-ghost" disabled={submitting}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              戻る
            </button>
          ) : (
            <span />
          )}

          {isLast ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                '送信中…'
              ) : (
                <>
                  回答を送信する
                  <Send className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          ) : (
            <button type="button" onClick={handleNext} className="btn-primary">
              次へ
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-ink-faint">
        <p>入力内容はこの端末に一時保存され、送信すると削除されます。</p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 font-semibold hover:text-ink-soft"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          最初からやり直す
        </button>
      </div>
    </div>
  )
}
