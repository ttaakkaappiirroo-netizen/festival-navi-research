import { Check } from 'lucide-react'
import type { QuestionDef, SurveyAnswers } from '../../types/survey'
import { cn } from '../../lib/utils'

type Value = string | string[] | boolean

interface QuestionFieldProps {
  q: QuestionDef
  value: Value
  onChange: (id: keyof SurveyAnswers, value: Value) => void
  error?: string
}

export function QuestionField({ q, value, onChange, error }: QuestionFieldProps) {
  const describedBy = error ? `${q.id}-error` : q.note ? `${q.id}-note` : undefined

  // 同意チェックボックスは専用レイアウト
  if (q.kind === 'consent') {
    const checked = value as boolean
    return (
      <div className="space-y-1">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange(q.id, !checked)}
          className={cn(
            'flex w-full items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition-all',
            checked
              ? 'border-brand-indigo bg-brand-indigo/5'
              : 'border-slate-200 bg-white hover:border-brand-indigo/40',
          )}
        >
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2',
              checked ? 'border-brand-indigo bg-brand-indigo' : 'border-slate-300',
            )}
          >
            {checked && <Check className="h-3.5 w-3.5 text-white" />}
          </span>
          <span className="text-sm font-semibold text-ink">
            {q.label}
            {q.required && <span className="ml-1 text-brand-orange">*</span>}
          </span>
        </button>
        {q.note && <p className="pl-1 text-xs text-ink-faint">{q.note}</p>}
        {error && (
          <p id={`${q.id}-error`} role="alert" className="pt-1 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <fieldset className="space-y-1">
      <legend className="field-label">
        {q.label}
        {q.required && <span className="ml-1 text-brand-orange">*</span>}
      </legend>
      {q.note && (
        <p id={`${q.id}-note`} className="text-xs text-ink-faint">
          {q.note}
        </p>
      )}

      <div className="pt-2">
        {q.kind === 'single' && (
          <SingleChoice
            q={q}
            value={value as string}
            onChange={(v) => onChange(q.id, v)}
            describedBy={describedBy}
          />
        )}
        {q.kind === 'multi' && (
          <MultiChoice
            q={q}
            value={(value as string[]) ?? []}
            onChange={(v) => onChange(q.id, v)}
          />
        )}
        {q.kind === 'prefecture' && (
          <select
            id={q.id}
            className="field-input"
            value={value as string}
            onChange={(e) => onChange(q.id, e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={!!error}
          >
            <option value="">選択してください</option>
            {q.options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
        {q.kind === 'text' && (
          <input
            id={q.id}
            type="text"
            className="field-input"
            value={value as string}
            maxLength={q.maxLength}
            placeholder={q.placeholder}
            onChange={(e) => onChange(q.id, e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={!!error}
          />
        )}
        {q.kind === 'textarea' && (
          <div>
            <textarea
              id={q.id}
              className="field-input min-h-[110px] resize-y"
              value={value as string}
              maxLength={q.maxLength}
              placeholder={q.placeholder}
              onChange={(e) => onChange(q.id, e.target.value)}
              aria-describedby={describedBy}
              aria-invalid={!!error}
            />
            {q.maxLength && (
              <p className="mt-1 text-right text-xs text-ink-faint">
                {(value as string).length} / {q.maxLength}
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p id={`${q.id}-error`} role="alert" className="pt-1 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function SingleChoice({
  q,
  value,
  onChange,
  describedBy,
}: {
  q: QuestionDef
  value: string
  onChange: (v: string) => void
  describedBy?: string
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-describedby={describedBy}>
      {q.options?.map((o) => {
        const selected = value === o
        return (
          <button
            type="button"
            key={o}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o)}
            className={cn(
              'flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all',
              selected
                ? 'border-brand-indigo bg-brand-indigo/5 text-brand-indigo shadow-sm'
                : 'border-slate-200 bg-white text-ink hover:border-brand-indigo/40',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                selected ? 'border-brand-indigo bg-brand-indigo' : 'border-slate-300',
              )}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            {o}
          </button>
        )
      })}
    </div>
  )
}

function MultiChoice({
  q,
  value,
  onChange,
}: {
  q: QuestionDef
  value: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (o: string) => {
    if (value.includes(o)) onChange(value.filter((v) => v !== o))
    else onChange([...value, o])
  }
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {q.options?.map((o) => {
        const selected = value.includes(o)
        return (
          <button
            type="button"
            key={o}
            role="checkbox"
            aria-checked={selected}
            onClick={() => toggle(o)}
            className={cn(
              'flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all',
              selected
                ? 'border-brand-purple bg-brand-purple/5 text-brand-purple shadow-sm'
                : 'border-slate-200 bg-white text-ink hover:border-brand-purple/40',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2',
                selected ? 'border-brand-purple bg-brand-purple' : 'border-slate-300',
              )}
            >
              {selected && <Check className="h-3.5 w-3.5 text-white" />}
            </span>
            {o}
          </button>
        )
      })}
    </div>
  )
}
