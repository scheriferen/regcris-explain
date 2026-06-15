import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import LanguageSelect from './pages/LanguageSelect'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/language" element={<LanguageSelect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
