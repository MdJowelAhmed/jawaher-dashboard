import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (toast) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const item = { id, tone: 'success', duration: 3200, ...toast }
      setToasts((current) => [...current, item])
      window.setTimeout(() => dismiss(id), item.duration)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ push, dismiss, toasts }), [push, dismiss, toasts])
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
