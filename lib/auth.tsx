'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/user')
        const data = await response.json()
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
          })
        }
      } catch (error) {
        console.error('[v0] Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      setUser({
        id: data.user.id,
        email: data.user.email,
      })
      return true
    } catch (error) {
      console.error('[v0] Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
