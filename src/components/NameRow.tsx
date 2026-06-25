import type { NameFields } from '../types/nte.types';
import { SUFFIXES } from '../types/nte.types';
import styles from './NTEForm.module.css';

interface NameRowProps {
  label: string;
  value: NameFields;
  onChange: (value: NameFields) => void;
  placeholders?: {
    lastName: string;
    firstName: string;
    middleName: string;
  };
}

export default function NameRow({ label, value, onChange, placeholders }: NameRowProps) {
  const set = (field: keyof NameFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...value, [field]: e.target.value });

  return (
    <div className={styles.row}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.fields}>
        <input
          type="text"
          className={styles.fLast}
          placeholder={placeholders?.lastName ?? 'LAST NAME *'}
          value={value.lastName}
          onChange={set('lastName')}
          required
        />
        <input
          type="text"
          className={styles.fFirst}
          placeholder={placeholders?.firstName ?? 'FIRST NAME *'}
          value={value.firstName}
          onChange={set('firstName')}
          required
        />
        <input
          type="text"
          className={styles.fMid}
          placeholder={placeholders?.middleName ?? 'MIDDLE NAME'}
          value={value.middleName}
          onChange={set('middleName')}
        />
        <select
          className={`${styles.input} ${styles.fSuf}`}
          value={value.suffix}
          onChange={set('suffix')}
          aria-label="Suffix"
        >
          {SUFFIXES.map((s) => (
            <option key={s} value={s}>
              {s === '' ? 'SUFFIX' : s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}