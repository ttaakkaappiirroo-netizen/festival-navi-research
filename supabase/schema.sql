-- =====================================================================
--  Festival Navi 全国文化祭アンケート  Supabase スキーマ
-- ---------------------------------------------------------------------
--  Supabase の SQL Editor にこのファイルの内容を貼り付けて実行してください。
--  （何度実行しても安全なように書いています = 冪等）
--
--  設計方針:
--   - 一般ユーザー(anon)は「回答の新規登録(insert)」のみ許可
--   - 一般ユーザーは他人の回答を閲覧・編集・削除できない
--   - 管理者(authenticated かつ admin_profiles に登録)のみ閲覧・更新可能
--   - service_role キーはフロントに絶対に置かない（サーバー/管理作業のみ）
-- =====================================================================

-- 拡張機能（UUID生成）
create extension if not exists "pgcrypto";

-- =====================================================================
-- 1. アンケート回答テーブル
-- =====================================================================
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  respondent_role text not null,
  prefecture text not null,
  school_type text not null,
  school_name text default '',
  current_information_methods text[] not null default '{}',
  update_availability text default '',
  emergency_communication_methods text[] not null default '{}',
  congestion_experience text default '',
  operational_problems text[] not null default '{}',
  biggest_problem text default '',
  problem_details text default '',
  desired_features text[] not null default '{}',
  most_desired_feature text default '',
  usage_interest text default '',
  trial_interest text default '',
  contact_name text default '',
  contact_email text default '',
  contact_method text default '',
  festival_schedule text default '',
  consultation_details text default '',
  additional_feedback text default '',
  statistics_consent boolean not null default false,
  created_at timestamptz not null default now(),

  -- DB側の制約（長すぎる入力・不正な同意を弾く）
  constraint school_name_len check (char_length(school_name) <= 100),
  constraint problem_details_len check (char_length(problem_details) <= 1000),
  constraint contact_email_len check (char_length(contact_email) <= 200),
  constraint feedback_len check (char_length(additional_feedback) <= 1000),
  constraint consent_required check (statistics_consent = true)
);

create index if not exists idx_survey_created_at on public.survey_responses (created_at desc);
create index if not exists idx_survey_prefecture on public.survey_responses (prefecture);
create index if not exists idx_survey_role on public.survey_responses (respondent_role);
create index if not exists idx_survey_trial on public.survey_responses (trial_interest);

-- =====================================================================
-- 2. 試験導入相談テーブル
-- =====================================================================
create table if not exists public.trial_requests (
  id uuid primary key default gen_random_uuid(),
  role text default '',
  name text not null,
  school_name text not null,
  prefecture text not null,
  email text not null,
  festival_date text default '',
  interested_features text[] not null default '{}',
  message text default '',
  status text not null default '未対応',
  admin_memo text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint trial_email_len check (char_length(email) <= 200),
  constraint trial_message_len check (char_length(message) <= 1000),
  constraint trial_status_valid check (
    status in ('未対応','連絡予定','連絡済み','商談中','試験導入予定','見送り')
  )
);

create index if not exists idx_trial_created_at on public.trial_requests (created_at desc);
create index if not exists idx_trial_status on public.trial_requests (status);

-- =====================================================================
-- 3. 管理者プロフィール
--    ここに登録された auth ユーザーだけが「管理者」として扱われます。
-- =====================================================================
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text default '',
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- 現在のユーザーが管理者かどうかを判定するヘルパー関数
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles where id = auth.uid()
  );
$$;

-- =====================================================================
-- 4. Row Level Security (RLS)
-- =====================================================================
alter table public.survey_responses enable row level security;
alter table public.trial_requests   enable row level security;
alter table public.admin_profiles   enable row level security;

-- ---- survey_responses ----
-- 一般ユーザー(anon/authenticated)は新規登録(insert)のみ許可
drop policy if exists "survey_insert_anon" on public.survey_responses;
create policy "survey_insert_anon"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (true);

-- 閲覧は管理者のみ
drop policy if exists "survey_select_admin" on public.survey_responses;
create policy "survey_select_admin"
  on public.survey_responses
  for select
  to authenticated
  using (public.is_admin());

-- 更新・削除は管理者のみ
drop policy if exists "survey_update_admin" on public.survey_responses;
create policy "survey_update_admin"
  on public.survey_responses
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "survey_delete_admin" on public.survey_responses;
create policy "survey_delete_admin"
  on public.survey_responses
  for delete
  to authenticated
  using (public.is_admin());

-- ---- trial_requests ----
drop policy if exists "trial_insert_anon" on public.trial_requests;
create policy "trial_insert_anon"
  on public.trial_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "trial_select_admin" on public.trial_requests;
create policy "trial_select_admin"
  on public.trial_requests
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "trial_update_admin" on public.trial_requests;
create policy "trial_update_admin"
  on public.trial_requests
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "trial_delete_admin" on public.trial_requests;
create policy "trial_delete_admin"
  on public.trial_requests
  for delete
  to authenticated
  using (public.is_admin());

-- ---- admin_profiles ----
-- 管理者は自分たちのプロフィールを閲覧できる（他は不可）
drop policy if exists "admin_select_self" on public.admin_profiles;
create policy "admin_select_self"
  on public.admin_profiles
  for select
  to authenticated
  using (public.is_admin());

-- =====================================================================
-- 5. 管理者の登録方法（メモ）
-- ---------------------------------------------------------------------
--  (1) Supabase ダッシュボード > Authentication > Users で
--      管理者のメール＋パスワードのユーザーを作成する。
--  (2) 下記SQLの 'admin@example.com' を作成したメールに変えて実行する。
--
--  insert into public.admin_profiles (id, email, display_name)
--  select id, email, '管理者'
--  from auth.users
--  where email = 'admin@example.com'
--  on conflict (id) do nothing;
-- =====================================================================
