import { Link, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { CheckCircle2, Home, Users, Share2, Link2, Check } from 'lucide-react'
import { Reveal } from '../components/ui/Reveal'
import { SITE } from '../config/site'

export default function SurveyCompletePage() {
  const location = useLocation()
  const demo = (location.state as { demo?: boolean } | null)?.demo ?? false
  const [copied, setCopied] = useState(false)

  const shareUrl = useMemo(() => {
    const base = import.meta.env.VITE_SITE_URL || window.location.origin
    return `${base}/survey`
  }, [])
  const shareText = `文化祭運営の実態調査アンケートに回答しました！あなたの学校の文化祭についても教えてください🎪 #FestivalNavi`

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="bg-slate-50">
      <div className="container-page flex min-h-[70vh] max-w-2xl flex-col items-center justify-center py-16 text-center">
        <Reveal>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-11 w-11 text-emerald-600" aria-hidden="true" />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 text-3xl font-black text-ink sm:text-4xl">
            ご回答ありがとうございました！
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-lg text-ink-soft">
            いただいた回答は、文化祭運営をより便利にするサービスの開発に活用します。
            あなたの声が、全国の文化祭をもっと簡単にする力になります。
          </p>
        </Reveal>

        {demo && (
          <Reveal delay={0.12}>
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
              ※ 現在はデモモードのため、回答はデータベースに保存されていません。
            </p>
          </Reveal>
        )}

        <Reveal delay={0.15}>
          <div className="mt-8 w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <p className="flex items-center justify-center gap-2 text-sm font-bold text-ink">
              <Share2 className="h-4 w-4 text-brand-purple" aria-hidden="true" />
              友達にアンケートを共有する
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Xで共有
              </a>
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                LINEで共有
              </a>
              <button onClick={copyLink} className="btn-secondary">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" /> コピーしました
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" aria-hidden="true" /> リンクをコピー
                  </>
                )}
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="btn-secondary">
              <Home className="h-4 w-4" aria-hidden="true" />
              {SITE.name}について見る
            </Link>
            <Link to="/trial" className="btn-primary">
              <Users className="h-4 w-4" aria-hidden="true" />
              無料デモ・試験導入を相談する
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
