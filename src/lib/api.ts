import { supabase, isSupabaseConfigured } from './supabase'
import { sanitizeText } from './utils'
import type {
  SurveyAnswers,
  SurveyResponseRow,
  TrialRequestInput,
  TrialRequestRow,
  TrialStatus,
} from '../types/survey'
import { makeMockResponses, makeMockTrialRequests } from '../data/mockResponses'

export interface SubmitResult {
  ok: boolean
  demo: boolean
  error?: string
}

/** 送信前にテキスト項目をサニタイズ */
function cleanAnswers(a: SurveyAnswers): SurveyAnswers {
  return {
    ...a,
    school_name: sanitizeText(a.school_name, 60),
    problem_details: sanitizeText(a.problem_details, 500),
    contact_name: sanitizeText(a.contact_name, 40),
    contact_email: sanitizeText(a.contact_email, 120),
    contact_method: sanitizeText(a.contact_method, 120),
    festival_schedule: sanitizeText(a.festival_schedule, 60),
    consultation_details: sanitizeText(a.consultation_details, 500),
    additional_feedback: sanitizeText(a.additional_feedback, 500),
  }
}

/** アンケート回答を送信 */
export async function submitSurvey(answers: SurveyAnswers): Promise<SubmitResult> {
  const clean = cleanAnswers(answers)

  if (!isSupabaseConfigured || !supabase) {
    // デモモード: 保存せず、成功として扱う（画面上でデモと明示）
    await new Promise((r) => setTimeout(r, 600))
    return { ok: true, demo: true }
  }

  const { error } = await supabase.from('survey_responses').insert([clean])
  if (error) {
    return { ok: false, demo: false, error: error.message }
  }
  return { ok: true, demo: false }
}

/** 試験導入相談を送信 */
export async function submitTrialRequest(input: TrialRequestInput): Promise<SubmitResult> {
  const clean: TrialRequestInput = {
    ...input,
    name: sanitizeText(input.name, 40),
    school_name: sanitizeText(input.school_name, 60),
    email: sanitizeText(input.email, 120),
    festival_date: sanitizeText(input.festival_date, 60),
    message: sanitizeText(input.message, 500),
  }

  if (!isSupabaseConfigured || !supabase) {
    await new Promise((r) => setTimeout(r, 600))
    return { ok: true, demo: true }
  }

  const { error } = await supabase.from('trial_requests').insert([clean])
  if (error) {
    return { ok: false, demo: false, error: error.message }
  }
  return { ok: true, demo: false }
}

export interface FetchResponsesResult {
  rows: SurveyResponseRow[]
  demo: boolean
  error?: string
}

/** アンケート回答一覧を取得（管理者用） */
export async function fetchSurveyResponses(): Promise<FetchResponsesResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { rows: makeMockResponses(), demo: true }
  }
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return { rows: [], demo: false, error: error.message }
  }
  return { rows: (data ?? []) as SurveyResponseRow[], demo: false }
}

export interface FetchTrialsResult {
  rows: TrialRequestRow[]
  demo: boolean
  error?: string
}

/** 試験導入相談一覧を取得（管理者用） */
export async function fetchTrialRequests(): Promise<FetchTrialsResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { rows: makeMockTrialRequests(), demo: true }
  }
  const { data, error } = await supabase
    .from('trial_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return { rows: [], demo: false, error: error.message }
  }
  return { rows: (data ?? []) as TrialRequestRow[], demo: false }
}

/** 試験導入相談のステータス・メモを更新 */
export async function updateTrialRequest(
  id: string,
  patch: { status?: TrialStatus; admin_memo?: string },
): Promise<SubmitResult> {
  if (!isSupabaseConfigured || !supabase) {
    await new Promise((r) => setTimeout(r, 300))
    return { ok: true, demo: true }
  }
  const { error } = await supabase
    .from('trial_requests')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) {
    return { ok: false, demo: false, error: error.message }
  }
  return { ok: true, demo: false }
}
