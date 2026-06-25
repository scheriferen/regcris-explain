import { useNavigate, useLocation } from 'react-router-dom'
import NTEForm from './NTEForm'
import type { Language, NTEFormData } from '../types/nte.types'

export default function NTEFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const language = (location.state as { language: Language })?.language

  // if somehow they got here without a language, send them back
  if (!language) {
    navigate('/language')
    return null
  }

  function handleBack() {
    navigate('/language')
  }

  function handlePreview(data: NTEFormData) {
    navigate('/preview', { state: { data, language } })
  }

  return (
    <NTEForm
      language={language}
      onBack={handleBack}
      onPreview={handlePreview}
    />
  )
}