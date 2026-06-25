import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Language, NTEFormData } from '../types/nte.types'

interface Props {
  data: NTEFormData
  language: Language
  aiBody: string | null
  coordinatorName: string
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 64,
    color: '#111111',
    backgroundColor: '#ffffff',
  },
  letterhead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  letterheadLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  companyBlock: { flexDirection: 'column' },
  companyName: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: '#863bff', letterSpacing: 2 },
  companyTagline: { fontFamily: 'Helvetica', fontSize: 8, color: '#888888', letterSpacing: 0.5 },
  docTypeLabel: { fontFamily: 'Helvetica', fontSize: 8, color: '#555555', letterSpacing: 1 },
  headerDivider: { height: 2, backgroundColor: '#863bff', marginBottom: 18 },
  fieldsBlock: { marginBottom: 14, gap: 8 },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-end' },
  fieldKey: { fontFamily: 'Times-Bold', fontSize: 11, width: 56 },
  fieldColon: { fontFamily: 'Times-Bold', fontSize: 11, width: 20, textAlign: 'center' },
  fieldValue: { fontFamily: 'Times-Bold', fontSize: 11, textDecoration: 'underline', flex: 1 },
  divider: { height: 1, backgroundColor: '#aaaaaa', marginBottom: 16, marginTop: 4 },
  para: { fontFamily: 'Times-Roman', fontSize: 11, lineHeight: 1.7, textAlign: 'justify', marginBottom: 11, textIndent: 28 },
  paraPlaceholder: { fontFamily: 'Times-Roman', fontSize: 10, color: '#bbbbbb', textAlign: 'center', marginVertical: 20 },
  signatures: { marginTop: 28 },
  sigReceivedBy: { textAlign: 'right', fontFamily: 'Times-Roman', fontSize: 11, marginBottom: 24 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 32 },
  sigBlock: { flex: 1, flexDirection: 'column', gap: 3 },
  sigLine: { height: 1, backgroundColor: '#111111', width: 180, marginBottom: 4 },
  sigName: { fontFamily: 'Times-Bold', fontSize: 10 },
  sigTitle: { fontFamily: 'Times-Roman', fontSize: 9, color: '#333333', lineHeight: 1.4 },
  sigDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  sigDateLabel: { fontFamily: 'Times-Roman', fontSize: 10 },
  sigDateLine: { height: 1, backgroundColor: '#111111', width: 130 },
})

function formatName(n: { lastName: string; firstName: string; middleName: string; suffix: string }) {
  return [n.firstName, n.middleName, n.lastName, n.suffix].filter(Boolean).join(' ').toUpperCase()
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function NTEPdfDocument({ data, language, aiBody, coordinatorName }: Props) {
  const isTagalog = language === 'tag'
  const toName = formatName(data.to)
  const bodyParagraphs = aiBody
    ? aiBody.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
    : null
  const placeholder = isTagalog
    ? '[Walang nabuong katawan. Bumalik sa form at pindutin ang "I-generate ang Katawan".]'
    : '[No letter body generated. Go back and click "Generate Body".]'

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.letterhead}>
          <View style={styles.letterheadLeft}>
            <View style={styles.companyBlock}>
              <Text style={styles.companyName}>REGCRIS</Text>
              <Text style={styles.companyTagline}>Human Resources Department</Text>
            </View>
          </View>
          <Text style={styles.docTypeLabel}>
            {isTagalog ? 'ABISO SA PAGPAPALIWANAG' : 'NOTICE TO EXPLAIN'}
          </Text>
        </View>

        <View style={styles.headerDivider} />

        <View style={styles.fieldsBlock}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldKey}>{isTagalog ? 'PARA KAY' : 'TO'}</Text>
            <Text style={styles.fieldColon}>:</Text>
            <Text style={styles.fieldValue}>{toName || ' '}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldKey}>{isTagalog ? 'PETSA' : 'DATE'}</Text>
            <Text style={styles.fieldColon}>:</Text>
            <Text style={styles.fieldValue}>{formatDate(data.date) || ' '}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {bodyParagraphs
          ? bodyParagraphs.map((para, i) => <Text key={i} style={styles.para}>{para}</Text>)
          : <Text style={styles.paraPlaceholder}>{placeholder}</Text>
        }

        <View style={styles.signatures}>
          <Text style={styles.sigReceivedBy}>{isTagalog ? 'Natanggap ni:' : 'Received by:'}</Text>
          <View style={styles.sigRow}>
            <View style={styles.sigBlock}>
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>{coordinatorName.toUpperCase()}</Text>
              <Text style={styles.sigTitle}>{isTagalog ? 'Pangalan at Pirma ng' : 'Name and Signature of'}</Text>
              <Text style={styles.sigTitle}>{isTagalog ? 'Superyor Coordinator / Account Officer' : 'Superior Coordinator / Account Officer'}</Text>
            </View>
            <View style={styles.sigBlock}>
              <View style={styles.sigLine} />
              <Text style={styles.sigTitle}>{isTagalog ? 'Pangalan at Pirma ng Tumanggap' : 'Name and Signature of Recipient'}</Text>
              <View style={styles.sigDateRow}>
                <Text style={styles.sigDateLabel}>{isTagalog ? 'Petsa:' : 'Date:'}</Text>
                <View style={styles.sigDateLine} />
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}