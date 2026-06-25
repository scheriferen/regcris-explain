import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'

import ProtectedRoute from './components/routing'
import Login from './pages/Login'
import Admin from './pages/Admin'
import LanguageSelect from './pages/LanguageSelect'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App