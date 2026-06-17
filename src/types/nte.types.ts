export type Language = 'tag' | 'eng';

export interface LangConfig {
  formTitle: string;
  sectionLabel: string;
  to: string;
  date: string;
  who: string;
  what: string;
  where: string;
  when: string;
  why: string;
  whyLabel: string;
  reasons: string[];
  whyPlaceholder: string;
  namePlaceholders: {
    lastName: string;
    firstName: string;
    middleName: string;
  };
}

export interface NameFields {
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
}

export interface NTEFormData {
  to: NameFields;
  date: string;
  who: NameFields;
  what: string;
  whatDetail: string;
  province: string;
  city: string;
  specificLocation: string;
  when: string;
  why: string;
}

export const SUFFIXES = ['', 'Jr.', 'Sr.', 'II', 'III', 'IV'];

export const PROVINCES = [
  '', 'Metro Manila', 'Cebu', 'Davao', 'Iloilo', 'Laguna',
];

export const CITIES = [
  '', 'Quezon City', 'Manila', 'Makati', 'Taguig', 'Pasig',
];

export const LANG_CONFIG: Record<Language, LangConfig> = {
  tag: {
    formTitle: 'PAHAYAG NG PANGYAYARI',
    sectionLabel: 'Sagutan ang lahat ng kinakailangang patlang',
    to: 'PARA KAY:',
    date: 'PETSA:',
    who: 'SINO:',
    what: 'ANO:',
    where: 'SAAN:',
    when: 'KAILAN:',
    why: 'PAANO / BAKIT:',
    whyLabel: 'PAANO /\nBAKIT:',
    reasons: ['PUMILI NG DAHILAN *', 'Insidente', 'Aksidente', 'Pagnanakaw', 'Pinsala sa ari-arian', 'Iba pa'],
    whyPlaceholder: 'Ilarawan ang kadahilanan ng pangyayaring ito.',
    namePlaceholders: {
        lastName: 'APELYIDO*',
        firstName: 'PANGALAN*',
        middleName: 'GITNANG PANGALAN',
    },
  },
  eng: {
    formTitle: 'NOTICE TO EXPLAIN',
    sectionLabel: 'Fill in all required fields',
    to: 'TO:',
    date: 'DATE:',
    who: 'WHO:',
    what: 'WHAT:',
    where: 'WHERE:',
    when: 'WHEN:',
    why: 'HOW / WHY:',
    whyLabel: 'HOW /\nWHY:',
    reasons: ['SELECT REASON *', 'Incident', 'Accident', 'Theft', 'Property Damage', 'Other'],
    whyPlaceholder: 'Provide thorough discussion regarding the cause of this action.',
    namePlaceholders: {
        lastName: 'LAST NAME*',
        firstName: 'FIRST NAME',
        middleName: 'MIDDLE NAME',
    }
  },
};

export const EMPTY_NAME: NameFields = {
  lastName: '',
  firstName: '',
  middleName: '',
  suffix: '',
};

export const INITIAL_FORM_DATA: NTEFormData = {
  to: { ...EMPTY_NAME },
  date: new Date().toISOString().split('T')[0],
  who: { ...EMPTY_NAME },
  what: '',
  whatDetail: '',
  province: '',
  city: '',
  specificLocation: '',
  when: '',
  why: '',
};