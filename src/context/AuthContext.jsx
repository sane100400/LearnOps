import { createContext, useContext, useState, useEffect } from 'react'
import { dummyUsers } from '../data/users'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnops_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('learnops_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('learnops_user')
    }
  }, [user])

  const login = (email) => {
    const found = dummyUsers.find((u) => u.email === email)
    if (!found) return false
    setUser(found)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
