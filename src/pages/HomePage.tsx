import { Link } from 'react-router-dom'
import { ArrowRight, Clock, CheckCircle2, Target, UserCheck } from 'lucide-react'
import { Reveal } from '../components/ui/Reveal'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PhoneMockup } from '../components/home/PhoneMockup'
import { CtaBanner } from '../components/CtaBanner'
import {
  SITE,
  STATS,
  ACHIEVEMENTS,
  CHALLENGES,
  FEATURES,
  FEATURE_TAGS,
  PURPOSES,
  AUDIENCES,
} from '../config/site'
import { formatNumber } from '../lib/utils'

function Eyebrow({ children }: { children: string }) {
  return <span className="section-eyebrow">{children}</span>
}

export default function HomePage() {
  return (
    <>
      {/* ===== ファーストビュー ===== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-brand-soft" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-purple/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Reveal>
              <Eyebrow>全国の高校生・先生を対象とした実態調査</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
                文化祭運営を、
                <br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  もっと簡単に。
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                全国の高校生・文化祭実行委員・生徒会・先生を対象に、文化祭運営の課題を調査しています。回答時間は約{SITE.surveyMinutes}分です。
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/survey" className="btn-primary px-7 py-4 text-lg">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  {SITE.surveyMinutes}分アンケートに回答する
                </Link>
                <a href="#about" className="btn-secondary px-7 py-4 text-lg">
                  Festival Naviについて見る
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-sm font-semibold text-ink-faint">
                匿名で回答できます／個人情報の入力は不要です
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="flex justify-center lg:justify-end">
            <div className="animate-float">
              <PhoneMockup />
            </div>
          </Reveal>
        </div>

        {/* 統計バー */}
        <div className="container-page relative pb-16">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-card backdrop-blur sm:grid-cols-4 sm:gap-6 sm:p-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-brand-indigo sm:text-3xl">
                    {s.value === null ? (
                      <span className="text-xl text-ink-faint sm:text-2xl">調査中</span>
                    ) : (
                      <>
                        {formatNumber(s.value)}
                        <span className="text-base font-bold sm:text-lg">{s.suffix}</span>
                      </>
                    )}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-ink-soft sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 実績紹介（about） ===== */}
      <section id="about" className="container-page scroll-mt-20 py-16 sm:py-20">
        <Reveal>
          <div className="text-center">
            <Eyebrow>Festival Naviについて</Eyebrow>
            <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">
              実際の高校文化祭で運用した実績
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
              構想だけのサービスではありません。実際の文化祭で来場者・運営が使うシステムとして運用した経験をもとに開発しています。
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.05}>
              <div className="card h-full transition-shadow hover:shadow-card-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
                  <a.icon className="h-6 w-6 text-brand-indigo" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.description}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <div className="flex h-full flex-col justify-center rounded-2xl bg-brand-gradient p-6 text-white shadow-glow">
              <p className="text-sm font-semibold opacity-90">この経験を、全国の学校へ。</p>
              <p className="mt-2 text-xl font-black">
                あなたの学校の文化祭も、もっと簡単に運営できるようにしたい。
              </p>
              <Link
                to="/survey"
                className="btn mt-5 w-fit bg-white px-5 py-2.5 text-sm text-brand-indigo hover:bg-slate-50"
              >
                アンケートで声を届ける
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 文化祭運営の課題 ===== */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-page">
          <Reveal>
            <div className="text-center">
              <Eyebrow>よくある課題</Eyebrow>
              <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">
                文化祭運営には、こんな課題があります
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHALLENGES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    <c.icon className="h-5 w-5 text-brand-orange" aria-hidden="true" />
                  </span>
                  <p className="pt-1.5 font-semibold text-ink">{c.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Festival Naviでできること（features） ===== */}
      <section id="features" className="container-page scroll-mt-20 py-16 sm:py-20">
        <Reveal>
          <div className="text-center">
            <Eyebrow>主な機能</Eyebrow>
            <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">
              Festival Naviでできること
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
              来場者にも、運営する実行委員にもうれしい機能をそろえています。開発状況もあわせて表示しています。
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.05}>
              <div className="card h-full transition-shadow hover:shadow-card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
                    <f.icon className="h-5 w-5 text-brand-indigo" aria-hidden="true" />
                  </div>
                  <StatusBadge status={f.status} />
                </div>
                <h3 className="mt-4 font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 機能タグ */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {FEATURE_TAGS.map((t) => (
              <span
                key={t.label}
                className="chip border border-slate-200 bg-white text-ink-soft shadow-sm"
              >
                <t.icon className="h-4 w-4 text-brand-purple" aria-hidden="true" />
                {t.label}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== ページ途中CTA ===== */}
      <CtaBanner />

      {/* ===== 調査の目的（purpose） ===== */}
      <section id="purpose" className="bg-slate-50 py-16 scroll-mt-20 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <Eyebrow>調査の目的</Eyebrow>
              <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">
                なぜアンケートを行うのか
              </h2>
              <p className="mt-4 text-ink-soft">
                いただいた声は、本当に必要とされる機能の開発と、全国の学校で使えるサービスへの成長に活用します。
              </p>
              <ul className="mt-8 space-y-4">
                {PURPOSES.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <Target className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" aria-hidden="true" />
                    <span className="font-semibold text-ink">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
              <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-brand-indigo" aria-hidden="true" />
                <h3 className="text-xl font-black text-ink">回答対象者</h3>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                以下のいずれかに当てはまる方は、ぜひご回答ください。
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {AUDIENCES.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 rounded-xl bg-brand-soft px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-indigo" aria-hidden="true" />
                    <span className="text-sm font-bold text-ink">{a}</span>
                  </div>
                ))}
              </div>
              <Link to="/survey" className="btn-primary mt-8 w-full">
                アンケートを始める
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 試験導入への導線 ===== */}
      <section id="trial" className="container-page scroll-mt-20 py-16 sm:py-20">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
            <div className="grid lg:grid-cols-2">
              <div className="bg-brand-gradient p-8 text-white sm:p-12">
                <h2 className="text-2xl font-black sm:text-3xl">
                  あなたの学校でFestival Naviを試してみませんか？
                </h2>
                <p className="mt-4 leading-relaxed text-white/90">
                  無料デモや試験導入に対応しています。プログラミングの知識は不要で、スマートフォンから情報を更新できます。まずはお気軽にご相談ください。
                </p>
                <Link
                  to="/trial"
                  className="btn mt-8 bg-white px-6 py-3 text-brand-indigo hover:bg-slate-50"
                >
                  無料デモ・試験導入を相談する
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 p-8 sm:p-12">
                {[
                  '無料デモ対応',
                  '学校ごとにデザイン変更',
                  'プログラミング知識不要',
                  'スマホから情報更新',
                  '導入前のオンライン相談',
                  '内容は個別相談',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== 最下部CTA ===== */}
      <CtaBanner
        heading="最後に、あなたの声を聞かせてください"
        sub={`約${SITE.surveyMinutes}分・匿名回答可能`}
      />
    </>
  )
}
