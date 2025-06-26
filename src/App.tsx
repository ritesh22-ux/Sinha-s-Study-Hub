import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
import Community from './pages/Community'
import Profile from './pages/Profile'
import YearView from './pages/YearView'
import SemesterView from './pages/SemesterView'
import SubjectView from './pages/SubjectView'
import DepartmentView from './pages/DepartmentView'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'

function App() {
  const { user } = useAuthStore()
  const { isDark } = useThemeStore()

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Navbar />

        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pt-16"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={user ? <Profile /> : <Login />} />
              <Route path="/year/:year" element={<YearView />} />
              <Route path="/semester/:semester" element={<SemesterView />} />
              <Route path="/year/:year/semester/:semester" element={<SemesterView />} />
              <Route path="/year/:year/semester/:semester/subject/:subject" element={<SubjectView />} />
              <Route path="/department/:department" element={<DepartmentView />} />
            </Routes>
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  )
}

export default App