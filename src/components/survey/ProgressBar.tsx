interface ProgressBarProps {
  current: number
  total: number
  stepTitle: string
}

export function ProgressBar({ current, total, stepTitle }: ProgressBarProps) {
  const percent = Math.round(((current + 1) / total) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold text-brand-indigo">
          ステップ {current + 1} / {total}
        </p>
        <p className="text-sm font-semibold text-ink-soft">{percent}% 完了</p>
      </div>
      <p className="mt-1 text-lg font-black text-ink">{stepTitle}</p>
      <div
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="アンケートの進捗"
      >
        <div
          className="h-full rounded-full bg-brand-gradient transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
