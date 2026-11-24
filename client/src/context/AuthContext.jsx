import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch('/api/auth/me')
      setUser(data.user)
    } catch { setUser(null) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { refreshUser() }, [refreshUser])

  const login = async (credentials) => {
    const data = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
    setUser(data.user)
    return data.user
  }
  const register = async (details) => {
    const data = await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(details) })
    setUser(data.user)
    return data.user
  }
  const logout = async () => {
    try { await apiFetch('/api/auth/logout', { method: 'POST' }) }
    finally { setUser(null) }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
