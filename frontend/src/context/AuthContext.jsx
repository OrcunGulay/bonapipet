import { createContext, useContext, useState, useCallback } from 'react'
import apiClient from '../api/apiClient.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('bp_admin_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.post('/auth/login', { username, password })
      const { token, admin: adminData } = res.data
      localStorage.setItem('bp_admin_token', token)
      localStorage.setItem('bp_admin_user', JSON.stringify(adminData))
      setAdmin(adminData)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Giriş başarısız.'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await apiClient.post('/auth/logout') } catch {}
    localStorage.removeItem('bp_admin_token')
    localStorage.removeItem('bp_admin_user')
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, loading, error, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
