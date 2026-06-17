import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/nte-form" element={<NTEFormPage />} />
          <Route path="*" element={<div>404 - page not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App