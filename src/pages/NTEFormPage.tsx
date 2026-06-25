import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NTEForm from './NTEForm'
import type { Language, NTEFormData } from '../types/nte.types'

export default function NTEFormPage() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language>('eng')

  function handlePreview(data: NTEFormData) {
    navigate('/preview', { state: { data, language } })
  }

  return (
    <NTEForm
      language={language}
      onLanguageChange={setLanguage}
      onPreview={handlePreview}
    />
  )
}