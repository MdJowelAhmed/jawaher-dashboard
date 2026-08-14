import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils/cn'

const icons = { success: CheckCircle2, error: CircleAlert, info: Info }
const tones = {
  success: 'border-success/20 bg-white text-ink',
  error: 'border-danger/20 bg-white text-ink',
  info: 'border-accent/20 bg-white text-ink',
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast()
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.tone] || Info
        return (
          <div key={toast.id} className={cn('pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-float', tones[toast.tone])}>
            <Icon size={18} className={cn('mt-0.5', toast.tone === 'error' ? 'text-danger' : toast.tone === 'success' ? 'text-success' : 'text-accent')} />
            <div className="flex-1">
              {toast.title ? <p className="text-sm font-semibold">{toast.title}</p> : null}
              <p className="text-sm text-ink-muted">{toast.message}</p>
            </div>
            <button type="button" onClick={() => dismiss(toast.id)} className="rounded-md p-1 text-ink-muted hover:bg-canvas" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
