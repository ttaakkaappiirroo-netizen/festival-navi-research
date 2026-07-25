import { Link } from 'react-router-dom'
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react'
import { Reveal } from './ui/Reveal'
import { SITE } from '../config/site'

interface CtaBannerProps {
  heading?: string
  sub?: string
}

/** ページ途中・最下部に置くアンケート誘導CTA */
export function CtaBanner({
  heading = 'あなたの学校の文化祭について教えてください',
  sub = `約${SITE.surveyMinutes}分・匿名回答可能`,
}: CtaBannerProps) {
  return (
    <section className="container-page py-12 sm:py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-12 text-center shadow-glow sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-2xl font-black text-white sm:text-3xl">
            {heading}
          </h2>
          <div className="relative mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" /> {sub}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" /> 個人情報の入力は不要
            </span>
          </div>
          <div className="relative mt-8">
            <Link
              to="/survey"
              className="btn inline-flex bg-white px-8 py-4 text-lg text-brand-indigo shadow-card-hover hover:brightness-100 hover:bg-slate-50 active:scale-[0.98]"
            >
              アンケートを始める
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
