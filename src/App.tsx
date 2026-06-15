import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Login from './pages/Login'
import Admin from './pages/Admin'
import LanguageSelect from './pages/LanguageSelect'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="*" element={<div>404 - page not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App