import { createContext, useContext, useMemo, useState } from 'react'
import { AUTH_STORAGE_KEY } from '../utils/constants'
import * as authApi from '../api/authApi'

const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  async function login(email, password, remember = true) {
    const result = await authApi.login(email, password)
    const next = { token: result.token, admin: result.admin }
    if (remember) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(AUTH_STORAGE_KEY)
    setSession(next)
    return next
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setSession(null)
  }

  function updateAdmin(patch) {
    setSession((current) => {
      if (!current) return current
      const next = { ...current, admin: { ...current.admin, ...patch } }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const value = useMemo(
    () => ({
      admin: session?.admin ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
      updateAdmin,
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
