# Festival Navi 全国文化祭アンケート

> 文化祭運営を、もっと簡単に。

全国の高校生・文化祭実行委員・生徒会・教職員を対象に、文化祭運営の実態を調査するためのWebサイトです。
起業家甲子園に向けて、**回答者数・都道府県数・学校数・困っていること・欲しい機能・利用意向・試験導入への興味**を集めることを目的としています。

単なるアンケートフォームではなく、Festival Naviの内容と実績が伝わる「サービス紹介サイト＋アンケート＋集計管理画面」の一体型サイトです。

---

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [使用技術](#使用技術)
3. [ローカル起動方法](#ローカル起動方法)
4. [必要な環境変数](#必要な環境変数)
5. [Supabaseプロジェクトの作成方法](#supabaseプロジェクトの作成方法)
6. [SQLの実行方法](#sqlの実行方法)
7. [管理者ユーザーの作成方法](#管理者ユーザーの作成方法)
8. [Cloudflare Pagesへの公開方法](#cloudflare-pagesへの公開方法)
9. [アンケート項目の変更方法](#アンケート項目の変更方法)
10. [サイト内文章の変更方法](#サイト内文章の変更方法)
11. [実績数値の変更方法](#実績数値の変更方法)
12. [CSV出力方法](#csv出力方法)
13. [セキュリティ上の注意](#セキュリティ上の注意)
14. [トラブルシューティング](#トラブルシューティング)
15. [ディレクトリ構成](#ディレクトリ構成)

---

## プロジェクト概要

| ページ | パス | 内容 |
| --- | --- | --- |
| トップページ | `/` | サービス紹介・実績・課題・機能・調査目的・CTA |
| アンケート回答 | `/survey` | 5ステップ・進捗バー・途中保存付きフォーム |
| 回答完了 | `/survey/complete` | お礼・SNS共有（X / LINE / リンクコピー） |
| 試験導入相談 | `/trial` | メリット紹介＋相談フォーム |
| プライバシーポリシー | `/privacy` | 日本語のプライバシーポリシー |
| 管理者ログイン | `/admin/login` | Supabase Auth ログイン（デモモードあり） |
| 管理ダッシュボード | `/admin` | 集計カード＋Rechartsグラフ |
| 回答一覧 | `/admin/responses` | 検索・フィルター・ページネーション・詳細・CSV |
| 試験導入候補 | `/admin/trials` | ステータス管理・対応メモ・CSV |
| 404 | その他すべて | Not Found ページ |

### デモモードと本番モード

- **デモモード（Supabase未設定）**: 環境変数がなくても起動します。フォーム送信時は「デモモードです」と明示し、DBには保存しません。管理画面はサンプルデータを表示します（本物の回答として偽装しません）。
- **本番モード（Supabase設定済み）**: 回答が実際にデータベースへ保存され、管理画面で集計できます。

環境変数を設定するだけで、コード変更なしにデモ→本番へ切り替わります。

---

## 使用技術

- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3**（デザインシステム）
- **React Router 6**（ルーティング）
- **Framer Motion 11**（控えめなスクロールアニメーション）
- **Lucide React**（アイコン）
- **Supabase**（データベース＋認証）
- **Recharts 2**（集計グラフ）
- **Cloudflare Pages** で公開可能な構成（`_redirects` / `_headers` 同梱）

---

## ローカル起動方法

> Node.js 18 以上を推奨します（開発時は v24 で動作確認済み）。

```bash
# 1. このフォルダに移動
cd festival-navi-research

# 2. パッケージのインストール
npm install

# 3. 開発サーバーの起動（http://localhost:5180 が開きます）
npm run dev
```

その他のコマンド:

```bash
npm run build      # 本番ビルド（型チェック込み）
npm run preview    # ビルド結果をローカル確認
npm run lint       # ESLint
npm run typecheck  # 型チェックのみ
```

> この時点では **Supabase未設定 = デモモード** で動きます。画面確認だけならここまででOKです。

---

## 必要な環境変数

`.env.example` をコピーして `.env` を作成し、値を設定します。

```bash
# macOS / Linux
cp .env.example .env
# Windows PowerShell
Copy-Item .env.example .env
```

| 変数名 | 必須 | 説明 |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | 本番のみ | Supabase プロジェクトのURL |
| `VITE_SUPABASE_ANON_KEY` | 本番のみ | Supabase の anon / publishable キー（**公開用**） |
| `VITE_SITE_URL` | 任意 | 公開URL（OGP・共有リンク用）。未設定なら実行中のオリジンを使用 |

> ⚠️ **service_role / secret キーは絶対にフロントの `.env` に置かないでください。** 必ず anon（publishable）キーを使います。

---

## Supabaseプロジェクトの作成方法

1. [https://supabase.com](https://supabase.com) にアクセスし、アカウントを作成してログイン。
2. 「New project」からプロジェクトを作成（データベースのパスワードは控えておく）。
3. 作成後、左メニューの **Project Settings → API** を開く。
4. 次の2つをメモ:
   - **Project URL** → `.env` の `VITE_SUPABASE_URL`
   - **anon public**（または publishable）キー → `.env` の `VITE_SUPABASE_ANON_KEY`

---

## SQLの実行方法

1. Supabaseの左メニューから **SQL Editor** を開く。
2. このリポジトリの [`supabase/schema.sql`](./supabase/schema.sql) の中身をすべてコピーして貼り付ける。
3. **Run** を押して実行する。

これで以下が作成されます。

- テーブル: `survey_responses` / `trial_requests` / `admin_profiles`
- インデックス・入力長やステータスの制約
- **RLS（行レベルセキュリティ）ポリシー**
  - 一般ユーザー（anon）は **回答・相談の新規登録（insert）のみ** 可能
  - 一般ユーザーは他人の回答を **閲覧・編集・削除できない**
  - **管理者（authenticated かつ `admin_profiles` に登録）だけ** が閲覧・更新可能

> このSQLは何度実行しても安全（冪等）です。

---

## 管理者ユーザーの作成方法

1. Supabase の **Authentication → Users → Add user** で、管理者用のメールアドレスとパスワードを登録する（「Auto Confirm User」を有効に）。
2. **SQL Editor** で以下を実行し、そのユーザーを管理者として登録する（メールを実際のものに変更）。

```sql
insert into public.admin_profiles (id, email, display_name)
select id, email, '管理者'
from auth.users
where email = 'admin@example.com'
on conflict (id) do nothing;
```

3. サイトの `/admin/login` から、登録したメール・パスワードでログインできます。

> `admin_profiles` に登録されていないユーザーは、ログインできても回答データを閲覧できません（RLSで保護）。

---

## Cloudflare Pagesへの公開方法

1. このプロジェクトを GitHub リポジトリにプッシュする。
2. Cloudflare ダッシュボード → **Workers & Pages → Create → Pages → Connect to Git** でリポジトリを選択。
3. ビルド設定:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Environment variables（Production / Preview 両方）** に以下を設定:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - （任意）`VITE_SITE_URL`（例: `https://festival-navi-research.pages.dev`）
5. **Save and Deploy**。

> - SPA のルーティング用に `public/_redirects`（`/* /index.html 200`）を同梱済みです。
> - セキュリティヘッダーは `public/_headers` に定義済みです。
> - **Viteは環境変数をビルド時に埋め込みます。** 変数を変更したら必ず再デプロイしてください。

---

## アンケート項目の変更方法

アンケートの質問は [`src/config/survey.ts`](./src/config/survey.ts) にまとまっています。

- 質問の追加・変更・並び替えは `SURVEY_STEPS` を編集します。
- 質問の型（`kind`）は `single`（単一選択）/ `multi`（複数選択）/ `text` / `textarea` / `prefecture` / `consent`。
- 新しい保存項目を増やす場合は、あわせて以下も更新してください。
  1. [`src/types/survey.ts`](./src/types/survey.ts) の `SurveyAnswers`
  2. [`src/config/survey.ts`](./src/config/survey.ts) の `EMPTY_ANSWERS`
  3. [`supabase/schema.sql`](./supabase/schema.sql) の `survey_responses` にカラム追加

---

## サイト内文章の変更方法

トップページや共通の文言・実績・機能一覧は [`src/config/site.ts`](./src/config/site.ts) に集約しています。

- `SITE`: サイト名・キャッチコピー・サブコピー・問い合わせ先
- `ACHIEVEMENTS`: 実績カード
- `CHALLENGES`: 文化祭運営の課題
- `FEATURES`: できること（`status` に `提供中` / `開発予定` / `構想中`）
- `PURPOSES` / `AUDIENCES`: 調査の目的・回答対象者
- `TRIAL_BENEFITS`: 試験導入ページのメリット

プライバシーポリシー本文は [`src/pages/PrivacyPage.tsx`](./src/pages/PrivacyPage.tsx) にあります。

---

## 実績数値の変更方法

実績の数値は [`src/config/site.ts`](./src/config/site.ts) の `STATS` で管理します。

```ts
export const STATS: StatItem[] = [
  { label: '運用した文化祭', value: 1, suffix: '校', note: '実際の高校文化祭で運用' },
  { label: 'デジタル化した出店情報', value: null, note: '運用校で出店情報をWeb化' }, // ← null は「調査中」と表示
  // ...
]
```

> **確定していない数値は `value: null` にしてください。** 「調査中」と控えめに表示され、架空の数字を事実のように見せることを防ぎます。

---

## CSV出力方法

管理画面 `/admin/responses` から、UTF-8 **BOM付き**CSV（日本語Excelで文字化けしにくい）を出力できます。

- **集計用CSV（匿名）**: 学校名・氏名・メールなどの個人情報を **含まない** 集計向けCSV。
- **個人情報含むCSV**: 連絡先を含むCSV（確認ダイアログ付き・取り扱い注意）。
- 現在の検索・フィルター結果がそのまま出力対象になります。

試験導入候補 `/admin/trials` からは、相談者一覧のCSVを出力できます。

---

## セキュリティ上の注意

- **service_role / secret キーをフロント（`.env` や Cloudflare の `VITE_` 変数）に置かない。** anon(publishable) キーのみ使用。
- 管理画面は **認証必須**（Supabase Auth ＋ `admin_profiles` ＋ RLS）。一般ユーザーは他人の回答を閲覧・編集・削除できません。
- 個人情報（学校名・氏名・連絡先）は **すべて任意入力**。回答者が高校生である可能性を考慮しています。
- Google Analytics などの **外部トラッキングは初期状態で入れていません**。
- 入力値はクライアントでサニタイズ（制御文字除去・`<` `>` の全角化）し、DB側でも文字数・値の制約をかけています。
- CSV出力時は数式インジェクション（`=`/`+`/`-`/`@` 始まり）をエスケープします。

---

## トラブルシューティング

| 症状 | 対処 |
| --- | --- |
| フォーム送信で「デモモードです」と出る | `.env` に Supabase の URL / anon キーが設定されているか確認。設定後は開発サーバーを再起動。 |
| 管理画面ログインできない | Supabase の Authentication にユーザーがいるか、`admin_profiles` に登録済みか確認。 |
| ログインできるがデータが見えない | `admin_profiles` に該当メールが登録されていない可能性。管理者登録SQLを再実行。 |
| Cloudflareで白画面 / 404 | `_redirects` が `dist` に含まれているか、環境変数を設定して**再デプロイ**したか確認。 |
| リアルタイムに集計が変わらない | 管理ダッシュボード右上の「更新」ボタンで再取得。 |
| 本番でグラフが空 | まだ回答が0件の可能性。回答が入ると自動で集計されます。 |
| ビルドが失敗する | `npm run typecheck` と `npm run lint` でエラー内容を確認。 |

---

## ディレクトリ構成

```
festival-navi-research/
├─ public/               # favicon / ogp / robots / sitemap / _redirects / _headers
├─ supabase/
│  └─ schema.sql         # テーブル・制約・RLS（SQL Editorで実行）
├─ src/
│  ├─ config/            # site.ts（文章・実績）/ survey.ts（アンケート項目）
│  ├─ components/        # UI・レイアウト・ホーム・アンケート・管理画面の部品
│  ├─ pages/             # 各ページ（admin/ は管理画面）
│  ├─ hooks/             # useAuth / useAdminData
│  ├─ lib/               # supabase / api / aggregate / utils
│  ├─ data/              # 都道府県・デモ用モックデータ
│  └─ types/             # 型定義
├─ .env.example
└─ README.md
```

---

作成: Festival Navi 開発チーム（高校生）／ 起業家甲子園に向けた実態調査プロジェクト
