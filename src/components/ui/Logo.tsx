import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

interface LogoProps {
  className?: string
  /** 白背景以外（グラデ背景）で使うとき文字を白に */
  light?: boolean
}

/** Festival Navi のロゴ（CSSのみで作成） */
export function Logo({ className, light = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5', className)}
      aria-label="Festival Navi ホームへ"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M7 18V7a1 1 0 0 1 1-1h2l6 2.5L10 11H8"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="18.5" r="1.5" fill="#fff" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-base font-black tracking-tight',
            light ? 'text-white' : 'text-ink',
          )}
        >
          Festival Navi
        </span>
        <span
          className={cn(
            'text-[10px] font-bold',
            light ? 'text-white/80' : 'text-brand-indigo',
          )}
        >
          全国文化祭アンケート
        </span>
      </span>
    </Link>
  )
}
