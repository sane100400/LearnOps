import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/level-test" element={<LevelTest />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="/lab" element={<Lab />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/study-group" element={<StudyGroup />} />
      <Route path="/curriculum-generate" element={<CurriculumGenerate />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/augment-demo" element={<AugmentDemo />} />
    </Routes>
  )
}
