import { createContext, useContext, useState } from 'react'
import { dummyUsers } from '../data/users'

const AUTH_KEY = 'learnops-user'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function loadUser() {
  try {
    const email = localStorage.getItem(AUTH_KEY)
    if (!email) return null
    return dummyUsers.find((u) => u.email === email) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  const login = (email) => {
    const found = dummyUsers.find((u) => u.email === email)
    if (!found) return false
    localStorage.setItem(AUTH_KEY, found.email)
    setUser(found)
    return true
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
