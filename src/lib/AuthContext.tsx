import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthUser {
  id: string
  username: string
  role: string
}

interface AuthContextType {
  currentUser: AuthUser | null
  setCurrentUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  })

  function setCurrentUser(user: AuthUser | null) {
    setCurrentUserState(user)
    if (user) sessionStorage.setItem('currentUser', JSON.stringify(user))
    else sessionStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}