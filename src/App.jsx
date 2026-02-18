import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LevelTest from './pages/LevelTest'
import Curriculum from './pages/Curriculum'
import Lab from './pages/Lab'
import Ranking from './pages/Ranking'
import StudyGroup from './pages/StudyGroup'
import CurriculumGenerate from './pages/CurriculumGenerate'
import Admin from './pages/Admin'
import AugmentDemo from './pages/AugmentDemo'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/level-test" element={<ProtectedRoute><LevelTest /></ProtectedRoute>} />
      <Route path="/curriculum" element={<ProtectedRoute><Curriculum /></ProtectedRoute>} />
      <Route path="/lab" element={<ProtectedRoute><Lab /></ProtectedRoute>} />
      <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
      <Route path="/study-group" element={<ProtectedRoute><StudyGroup /></ProtectedRoute>} />
      <Route path="/curriculum-generate" element={<ProtectedRoute><CurriculumGenerate /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/augment-demo" element={<ProtectedRoute><AugmentDemo /></ProtectedRoute>} />
    </Routes>
  )
}
