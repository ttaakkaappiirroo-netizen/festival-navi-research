import { SITE } from '../config/site'

export default function PrivacyPage() {
  const sections: { title: string; body: string[] }[] = [
    {
      title: '1. 基本方針',
      body: [
        `${SITE.name}（以下「当サービス」）は、全国の高校生・文化祭実行委員・生徒会・教職員を対象とした文化祭運営の実態調査を行っています。回答者の多くが未成年である可能性を踏まえ、個人情報の取得は必要最小限にとどめ、慎重に取り扱います。`,
      ],
    },
    {
      title: '2. 取得する情報',
      body: [
        'アンケートでは、立場・都道府県・学校の種類などの属性情報と、文化祭運営に関する回答を取得します。',
        '学校名・氏名・メールアドレス・その他の連絡先は任意入力です。試験導入やデモを希望される場合にのみ、ご相談のために入力していただきます。',
        '本サービスは、初期状態でGoogle Analyticsなどの外部トラッキングツールを使用していません。',
      ],
    },
    {
      title: '3. 利用目的',
      body: [
        '取得した情報は、次の目的で利用します。',
        '・文化祭運営の課題を把握し、サービスを改善するため',
        '・匿名の統計情報として、発表資料やサービス紹介に利用するため',
        '・試験導入やデモを希望された方へご連絡するため',
      ],
    },
    {
      title: '4. 匿名性の確保と公開',
      body: [
        '調査結果を統計情報として公開・発表する場合は、個人が特定できない形に加工します。',
        '個人が特定できる情報（氏名・学校名・連絡先など）を、本人の許可なく公開することはありません。',
      ],
    },
    {
      title: '5. 情報の管理',
      body: [
        '取得した情報は、認証されたデータベース（Supabase）に保存し、管理者のみが認証後に閲覧できるようにアクセス制御しています。',
        '一般の利用者が他の回答者の情報を閲覧・編集・削除することはできません。',
      ],
    },
    {
      title: '6. 第三者提供',
      body: [
        '法令に基づく場合を除き、取得した情報を本人の同意なく第三者へ提供することはありません。',
      ],
    },
    {
      title: '7. 未成年の方へ',
      body: [
        '回答に個人情報の入力は必須ではありません。連絡先などの入力に不安がある場合は、入力せずに回答を送信できます。心配なときは、保護者や先生に相談してください。',
      ],
    },
    {
      title: '8. お問い合わせ・削除の依頼',
      body: [
        `ご自身が入力した情報の確認・削除をご希望の場合は、${SITE.contactEmail} までご連絡ください。`,
      ],
    },
  ]

  return (
    <div className="bg-white">
      <div className="container-page max-w-3xl py-14 sm:py-20">
        <span className="section-eyebrow">プライバシーポリシー</span>
        <h1 className="mt-4 text-3xl font-black text-ink sm:text-4xl">プライバシーポリシー</h1>
        <p className="mt-3 text-sm text-ink-faint">最終更新日：2026年7月</p>

        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-ink">{s.title}</h2>
              <div className="mt-3 space-y-2">
                {s.body.map((p, i) => (
                  <p key={i} className="leading-relaxed text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
