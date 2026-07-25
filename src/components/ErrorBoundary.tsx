import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
  message?: string
}

/** アプリ全体を包む簡易エラーバウンダリ */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 本番では外部送信しない（プライバシー配慮）。開発時のみ最小限の記録。
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info.componentStack)
    }
  }

  handleReload = (): void => {
    this.setState({ hasError: false, message: undefined })
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-brand-soft p-6">
          <div className="card max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-7 w-7 text-brand-orange" />
            </div>
            <h1 className="text-xl font-bold text-ink">
              問題が発生しました
            </h1>
            <p className="mt-2 text-ink-soft">
              ページの表示中にエラーが発生しました。お手数ですが、もう一度お試しください。
            </p>
            <button onClick={this.handleReload} className="btn-primary mt-6 w-full">
              トップページへ戻る
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
