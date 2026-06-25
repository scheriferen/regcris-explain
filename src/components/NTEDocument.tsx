import type { Language, NTEFormData } from '../types/nte.types'
import styles from './NTEDocument.module.css'

interface Props {
  data: NTEFormData
  language: Language
  aiBody: string | null
  coordinatorName: string
}

export default function NTEDocument({ data, language, aiBody, coordinatorName }: Props) {
  const isTagalog = language === 'tag'

  function formatName(n: { lastName: string; firstName: string; middleName: string; suffix: string }) {
    return [n.firstName, n.middleName, n.lastName, n.suffix].filter(Boolean).join(' ').toUpperCase()
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const toName = formatName(data.to)

  const placeholderBody = isTagalog
    ? `[Pindutin ang "I-generate ang Katawan" para awtomatikong isulat ng AI ang pormal na katawan ng liham.]`
    : `[Click "Generate Body" to have AI automatically write the formal letter body.]`

  const bodyParagraphs = aiBody
    ? aiBody.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
    : null

  return (
    <div className={styles.document}>

      <div className={styles.letterhead}>
        <div className={styles.letterheadLeft}>
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 48 46" fill="none">
            <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
          </svg>
          <div className={styles.companyInfo}>
            <span className={styles.companyName}>REGCRIS</span>
            <span className={styles.companyTagline}>Human Resources Department</span>
          </div>
        </div>
        <span className={styles.docType}>
          {isTagalog ? 'ABISO SA PAGPAPALIWANAG' : 'NOTICE TO EXPLAIN'}
        </span>
      </div>

      <div className={styles.headerDivider}></div>

      <div className={styles.fields}>
        <div className={styles.fieldRow}>
          <span className={styles.fieldKey}>{isTagalog ? 'PARA KAY' : 'TO'}</span>
          <span className={styles.fieldColon}>:</span>
          <span className={styles.fieldValue} style={{ textDecoration: 'underline', fontWeight: 600 }}>
            {toName || '\u00A0'}
          </span>
        </div>
        <div className={styles.fieldRow}>
          <span className={styles.fieldKey}>{isTagalog ? 'PETSA' : 'DATE'}</span>
          <span className={styles.fieldColon}>:</span>
          <span className={styles.fieldValue} style={{ textDecoration: 'underline', fontWeight: 600 }}>
            {formatDate(data.date) || '\u00A0'}
          </span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.body}>
        {bodyParagraphs
          ? bodyParagraphs.map((para, i) => (
              <p key={i} className={styles.para}>{para}</p>
            ))
          : <p className={styles.paraPlaceholder}>{placeholderBody}</p>
        }
      </div>

      <div className={styles.signatures}>
        <div className={styles.sigRight}>
          <p className={styles.sigLabel}>{isTagalog ? 'Natanggap ni:' : 'Received by:'}</p>
        </div>
        <div className={styles.sigRow}>
          <div className={styles.sigBlock}>
            <div className={styles.sigLine}></div>
            <p className={styles.sigName}>{coordinatorName.toUpperCase()}</p>
            <p className={styles.sigTitle}>{isTagalog ? 'Pangalan at Pirma ng' : 'Name and Signature of'}</p>
            <p className={styles.sigTitle}>{isTagalog ? 'Superyor Coordinator / Account Officer' : 'Superior Coordinator / Account Officer'}</p>
          </div>
          <div className={styles.sigBlock}>
            <div className={styles.sigLine}></div>
            <p className={styles.sigTitle}>{isTagalog ? 'Pangalan at Pirma ng Tumanggap' : 'Name and Signature of Recipient'}</p>
            <div className={styles.sigDateRow}>
              <span className={styles.sigDateLabel}>{isTagalog ? 'Petsa:' : 'Date:'}</span>
              <div className={styles.sigDateLine}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}