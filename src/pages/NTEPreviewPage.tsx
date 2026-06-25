import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { pdf } from '@react-pdf/renderer'
import type { Language, NTEFormData } from '../types/nte.types'
import { useAuth } from '../lib/AuthContext'
import NTEDocument from '../components/NTEPdfDocument'
import NTEPdfDocument from '../components/NTEPdfDocument'
import styles from '../components/NTEPreview.module.css'
import { FaArrowLeft, FaFilePdf, FaCopy, FaMagic, FaCheck } from 'react-icons/fa'

export default function NTEPreviewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const state = location.state as { data: NTEFormData; language: Language } | null

  const [aiBody, setAiBody] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [copied, setCopied] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  if (!state?.data) {
    navigate('/nte-form')
    return null
  }

  const { data, language } = state
  const isTagalog = language === 'tag'
  const coordinatorName = currentUser?.username ?? 'Coordinator'

  function formatName(n: { lastName: string; firstName: string; middleName: string; suffix: string }) {
    return [n.firstName, n.middleName, n.lastName, n.suffix].filter(Boolean).join(' ').toUpperCase()
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  async function handleGenerateAI() {
    setAiLoading(true)
    setAiError('')
    try {
      const prompt = isTagalog
        ? `Ikaw ay isang HR officer ng Regcris. Sumulat ng pormal na NTE (Notice to Explain) na katawan ng liham sa Filipino/Tagalog batay sa mga sumusunod na detalye:

Para Kay: ${formatName(data.to)}
Petsa ng Insidente: ${formatDate(data.when)}
Uri ng Insidente: ${data.what}${data.whatDetail ? ` - ${data.whatDetail}` : ''}
Lugar: ${[data.specificLocation, data.city, data.province].filter(Boolean).join(', ')}
Karagdagang Detalye: ${data.why || '(walang ibinigay)'}

Sumulat ng tatlo hanggang limang talata na nagpapaliwanag ng insidente nang pormal at propesyonal. Isama ang:
1. Isang talata na naglalahad ng insidente
2. Isang talata na nagpapaliwanag ng epekto nito sa kumpanya
3. Ang hinihingi na paliwanag mula sa empleyado sa loob ng 5 araw na trabaho
4. Isang talata tungkol sa pagpapadala ng paliwanag sa HR Department
5. Isang pangwakas na talata

Huwag isama ang salutation, heading, o pangalan. Ang katawan lamang ng liham. Huwag gumamit ng markdown.`
        : `You are an HR officer at Regcris. Write a formal NTE (Notice to Explain) letter body in English based on the following details:

To: ${formatName(data.to)}
Incident Date: ${formatDate(data.when)}
Type of Incident: ${data.what}${data.whatDetail ? ` - ${data.whatDetail}` : ''}
Location: ${[data.specificLocation, data.city, data.province].filter(Boolean).join(', ')}
Additional Details: ${data.why || '(none provided)'}

Write three to five formal, professional paragraphs. Include:
1. A paragraph stating the incident
2. A paragraph explaining its impact on the company
3. The request for a written explanation within 5 working days
4. A paragraph about submitting the explanation to HR Department
5. A closing paragraph

Do not include salutation, heading, or names. Body text only. No markdown.`

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )
      const result = await response.json()
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      setAiBody(text.trim())
    } catch (e) {
      setAiError('Failed to generate. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleCopy() {
    const toName = formatName(data.to)
    const body = aiBody || (isTagalog
      ? '[Katawan ng liham - pindutin ang "I-generate ang Katawan" para makuha ang AI-generated na teksto]'
      : '[Letter body - click "Generate Body" to get AI-generated text]')

    const text = isTagalog
      ? `ABISO SA PAGPAPALIWANAG\n\nPARA KAY: ${toName}\nPETSA: ${formatDate(data.date)}\n\n${body}\n\nNatanggap ni:\n\n\n_________________________\nPangalan at Pirma ng\nSuperyor Coordinator / Account Officer\n\n\n_________________________\nPangalan at Pirma ng Tumanggap\n\nPetsa: ___________________`
      : `NOTICE TO EXPLAIN\n\nTO: ${toName}\nDATE: ${formatDate(data.date)}\n\n${body}\n\nReceived by:\n\n\n_________________________\nName and Signature of\nSuperior Coordinator / Account Officer\n\n\n_________________________\nName and Signature of Recipient\n\nDate: ___________________`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  async function handleDownloadPdf() {
    setPdfLoading(true)
    try {
      const blob = await pdf(
        <NTEPdfDocument
          data={data}
          language={language}
          aiBody={aiBody}
          coordinatorName={coordinatorName}
        />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const recipientLast = data.to.lastName || 'NTE'
      const dateStr = data.date || new Date().toISOString().split('T')[0]
      a.download = `NTE_${recipientLast}_${dateStr}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.actionBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft /> {isTagalog ? 'Bumalik sa Form' : 'Back to Form'}
        </button>
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.aiBtn}`}
            onClick={handleGenerateAI}
            disabled={aiLoading}
          >
            <FaMagic />
            {aiLoading
              ? (isTagalog ? 'Ginagawa...' : 'Generating...')
              : (isTagalog ? 'I-generate ang Katawan' : 'Generate Body')}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.copyBtn}`}
            onClick={handleCopy}
          >
            {copied ? <FaCheck /> : <FaCopy />}
            {copied
              ? (isTagalog ? 'Nakopya!' : 'Copied!')
              : (isTagalog ? 'Kopyahin' : 'Copy Text')}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.pdfBtn}`}
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
          >
            <FaFilePdf />
            {pdfLoading ? 'Preparing...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {aiError && <div className={styles.aiError}>{aiError}</div>}

      <div className={styles.pageWrapper}>
        <div className={styles.page}>
          <NTEDocument
            data={data}
            language={language}
            aiBody={aiBody}
            coordinatorName={coordinatorName}
          />
        </div>
      </div>
    </div>
  )
}