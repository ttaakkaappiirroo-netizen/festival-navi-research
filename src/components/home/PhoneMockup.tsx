import { MapPin, Bell, Search, Users } from 'lucide-react'

/** スマホ上に文化祭サイトが表示されている様子の架空UIモックアップ（CSS/Reactのみ） */
export function PhoneMockup() {
  const shops = [
    { name: 'たこ焼き研究会', cat: '食べ物', level: '混雑', color: 'bg-orange-100 text-orange-700' },
    { name: '演劇部 公演', cat: '体験', level: 'やや混雑', color: 'bg-amber-100 text-amber-700' },
    { name: '美術部 展示', cat: '展示', level: '空いてる', color: 'bg-emerald-100 text-emerald-700' },
    { name: '軽音ライブ', cat: 'ステージ', level: '受付中', color: 'bg-blue-100 text-blue-700' },
  ]
  return (
    <div className="relative mx-auto w-[260px] select-none sm:w-[280px]" aria-hidden="true">
      {/* 端末フレーム */}
      <div className="relative rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
        <div className="overflow-hidden rounded-[1.9rem] bg-slate-50">
          {/* アプリヘッダー */}
          <div className="bg-brand-gradient px-4 pb-4 pt-7 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold opacity-90">育英祭 2026</p>
                <p className="text-base font-black">文化祭ナビ</p>
              </div>
              <div className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand-orange ring-2 ring-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-xs">
              <Search className="h-3.5 w-3.5" />
              <span className="opacity-90">出店・展示をさがす</span>
            </div>
          </div>

          {/* お知らせ */}
          <div className="mx-3 -mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-card">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
              <Bell className="h-3.5 w-3.5 text-brand-orange" />
            </span>
            <p className="text-[10px] font-semibold text-ink">
              体育館ステージは13:00開始に変更
            </p>
          </div>

          {/* 混雑マップミニ */}
          <div className="mx-3 mt-3 rounded-xl bg-white p-3 shadow-card">
            <div className="mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-indigo" />
              <p className="text-[10px] font-bold text-ink">校内マップ・混雑状況</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['bg-emerald-200', 'bg-amber-200', 'bg-orange-300', 'bg-emerald-200', 'bg-orange-300', 'bg-amber-200'].map(
                (c, i) => (
                  <div key={i} className={`h-7 rounded-md ${c}`} />
                ),
              )}
            </div>
          </div>

          {/* 出店リスト */}
          <div className="mx-3 my-3 space-y-2">
            {shops.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-card">
                <div>
                  <p className="text-[11px] font-bold text-ink">{s.name}</p>
                  <p className="text-[9px] text-ink-faint">{s.cat}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${s.color}`}>
                  {s.level}
                </span>
              </div>
            ))}
          </div>

          {/* タブバー */}
          <div className="flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2 text-brand-indigo">
            <Search className="h-4 w-4" />
            <MapPin className="h-4 w-4" />
            <Users className="h-4 w-4" />
            <Bell className="h-4 w-4 opacity-40" />
          </div>
        </div>
      </div>

      {/* 装飾バッジ */}
      <div className="absolute -left-6 top-16 rotate-[-8deg] rounded-xl bg-white px-3 py-2 shadow-card-hover">
        <p className="text-[10px] font-bold text-brand-orange">リアルタイム混雑</p>
      </div>
      <div className="absolute -right-4 bottom-24 rotate-[6deg] rounded-xl bg-white px-3 py-2 shadow-card-hover">
        <p className="text-[10px] font-bold text-brand-indigo">スマホで完結</p>
      </div>
    </div>
  )
}
