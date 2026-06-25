<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
=======
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
>>>>>>> 81306d3ef2ae7d92b3a739eb28b550f1df6f0a06
import { AuthProvider } from './lib/AuthContext'

import ProtectedRoute from './components/routing'
import Login from './pages/Login'
import Admin from './pages/Admin'
import LanguageSelect from './pages/LanguageSelect'
import NTEForm from './pages/NTEForm'
function NTEFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const language = location.state?.language ?? 'eng'

  return (
    <NTEForm
      language={language}
      onBack={() => navigate(-1)}
      onPreview={(data) => {
        // temporarily alert to test
        alert(`Preview:\nTO: ${data.to.firstName} ${data.to.lastName}\nWHO: ${data.who.firstName} ${data.who.lastName}`)
      }}
    />
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
<<<<<<< HEAD

          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } />

          <Route path="/language" element={
            <ProtectedRoute requiredRole="coordinator">
              <LanguageSelect />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
=======
          <Route path="/admin" element={<Admin />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/nte-form" element={<NTEFormPage />} />
          <Route path="*" element={<div>404 - page not found</div>} />
>>>>>>> 81306d3ef2ae7d92b3a739eb28b550f1df6f0a06
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App