// アンケート回答のデータ型定義

/** 単一選択・複数選択・自由記述などのフィールド種別 */
export type FieldKind =
  | 'single'
  | 'multi'
  | 'text'
  | 'textarea'
  | 'prefecture'
  | 'consent'

/** アンケートの1つの質問定義 */
export interface QuestionDef {
  /** 保存キー（SurveyAnswers のプロパティ名に対応） */
  id: keyof SurveyAnswers
  /** 表示ラベル（質問文） */
  label: string
  /** 補足・注意書き */
  note?: string
  kind: FieldKind
  required?: boolean
  /** 選択肢（single / multi のとき） */
  options?: string[]
  /** 自由記述の最大文字数 */
  maxLength?: number
  placeholder?: string
}

/** アンケートの1ステップ */
export interface SurveyStep {
  id: string
  title: string
  description?: string
  questions: QuestionDef[]
}

/** アンケート回答全体（フロント側の状態） */
export interface SurveyAnswers {
  // ステップ1: 回答者について
  respondent_role: string
  prefecture: string
  school_type: string
  school_name: string

  // ステップ2: 現在の文化祭運営
  current_information_methods: string[]
  update_availability: string
  emergency_communication_methods: string[]
  congestion_experience: string

  // ステップ3: 困っていること
  operational_problems: string[]
  biggest_problem: string
  problem_details: string

  // ステップ4: 欲しい機能
  desired_features: string[]
  most_desired_feature: string
  usage_interest: string

  // ステップ5: 試験導入について
  trial_interest: string
  contact_name: string
  contact_email: string
  contact_method: string
  festival_schedule: string
  consultation_details: string
  additional_feedback: string
  statistics_consent: boolean
}

/** DBに保存する行（created_id 等はサーバー側で付与） */
export interface SurveyResponseRow extends SurveyAnswers {
  id?: string
  created_at?: string
}

/** 試験導入相談フォームの入力 */
export interface TrialRequestInput {
  role: string
  name: string
  school_name: string
  prefecture: string
  email: string
  festival_date: string
  interested_features: string[]
  message: string
}

export type TrialStatus =
  | '未対応'
  | '連絡予定'
  | '連絡済み'
  | '商談中'
  | '試験導入予定'
  | '見送り'

export interface TrialRequestRow extends TrialRequestInput {
  id: string
  status: TrialStatus
  admin_memo?: string | null
  created_at: string
  updated_at: string
}
