/** classNames を安全に連結（falsy を除去） */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 入力文字列のサニタイズ。
 * - 制御文字を除去（改行・タブは残す）
 * - HTMLタグ由来の < > を全角に置換（スクリプト混入・表示崩れ防止）
 * - 前後の空白を除去し、最大文字数で切り詰め
 */
export function sanitizeText(value: string, maxLength = 1000): string {
  if (!value) return ''
  let out = Array.from(value)
    .filter((c) => {
      const code = c.charCodeAt(0)
      return code >= 32 || c === '\n' || c === '\t'
    })
    .join('')
    .trim()
  out = out.replace(/</g, '＜').replace(/>/g, '＞')
  if (out.length > maxLength) out = out.slice(0, maxLength)
  return out
}

/** メールアドレスの簡易フォーマット確認（空文字は許容＝任意項目向け） */
export function isValidEmail(value: string): boolean {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

/** 数値を3桁区切りに */
export function formatNumber(n: number): string {
  return n.toLocaleString('ja-JP')
}

/** 日時を「YYYY/MM/DD HH:mm」形式に */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

/** 日付のみ「YYYY/MM/DD」 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`
}

/**
 * 配列データをUTF-8 BOM付きCSVに変換してダウンロード。
 * 日本語Excelでの文字化けを防ぐためBOMを付与。
 */
export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
): void {
  const escape = (v: string | number | null | undefined): string => {
    const s = v === null || v === undefined ? '' : String(v)
    // CSVインジェクション対策: 数式開始文字はクォート
    const guarded = /^[=+\-@]/.test(s) ? `'${s}` : s
    return `"${guarded.replace(/"/g, '""')}"`
  }
  const csv = [headers, ...rows]
    .map((row) => row.map(escape).join(','))
    .join('\r\n')
  const bom = '﻿'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
