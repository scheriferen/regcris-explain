import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language, NTEFormData } from '../types/nte.types';
import {
  INITIAL_FORM_DATA,
  LANG_CONFIG,
  PROVINCES,
  CITIES,
} from '../types/nte.types';
import NameRow from '../components/NameRow';
import styles from '../components/NTEForm.module.css';
import { useAuth } from '../lib/AuthContext';
import { FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';

interface NTEFormProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onPreview: (data: NTEFormData) => void;
}

export default function NTEForm({ language, onLanguageChange, onPreview }: NTEFormProps) {
  const [form, setForm] = useState<NTEFormData>({ ...INITIAL_FORM_DATA });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const L = LANG_CONFIG[language];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setCurrentUser(null);
    navigate('/');
  }

  const set =
    <K extends keyof NTEFormData>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPreview(form);
  };

  return (
    <div className={styles.pageWrapper}>

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.topbarLogo}><span>regcris</span></div>
          <span className={styles.topbarTitle}>Notice to Explain</span>
        </div>

        <div className={styles.topbarRight}>

          {/* Language toggle */}
          <div className={styles.langToggle}>
            <button
              type="button"
              className={`${styles.langBtn} ${language === 'eng' ? styles.langBtnActive : ''}`}
              onClick={() => onLanguageChange('eng')}
            >
              ENG
            </button>
            <span className={styles.langDivider}>|</span>
            <button
              type="button"
              className={`${styles.langBtn} ${language === 'tag' ? styles.langBtnActive : ''}`}
              onClick={() => onLanguageChange('tag')}
            >
              TAG
            </button>
          </div>

          {/* User profile dropdown */}
          <div className={styles.userMenu} ref={dropdownRef}>
            <button
              type="button"
              className={styles.userMenuBtn}
              onClick={() => setDropdownOpen((o) => !o)}
            >
              <FaUserCircle className={styles.userIcon} />
              <span className={styles.userName}>{currentUser?.username ?? 'User'}</span>
              <FaChevronDown className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`} />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownUsername}>{currentUser?.username}</span>
                  <span className={styles.dropdownRole}>{currentUser?.role}</span>
                </div>
                <div className={styles.dropdownDivider} />
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className={styles.dropdownItemIcon} />
                  Log out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.pageHeading}>
          <h1 className={styles.pageTitle}>{L.formTitle}</h1>
          <p className={styles.pageSubtitle}>{L.sectionLabel}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTopBar} />
          <form onSubmit={handleSubmit} noValidate>

            <NameRow
              label={L.to}
              value={form.to}
              onChange={(val) => setForm((prev) => ({ ...prev, to: val }))}
              placeholders={L.namePlaceholders}
            />

            <div className={styles.row}>
              <span className={styles.fieldLabel}>{L.date}</span>
              <div className={styles.fields}>
                <input
                  type="date"
                  className={`${styles.input} ${styles.fDate}`}
                  value={form.date}
                  onChange={set('date')}
                  required
                />
              </div>
            </div>

            <NameRow
              label={L.who}
              value={form.who}
              onChange={(val) => setForm((prev) => ({ ...prev, who: val }))}
              placeholders={L.namePlaceholders}
            />

            <div className={styles.row}>
              <span className={styles.fieldLabel}>{L.what}</span>
              <div className={styles.fields}>
                <select
                  className={`${styles.input} ${styles.fReason}`}
                  value={form.what}
                  onChange={set('what')}
                >
                  {L.reasons.map((r, i) => (
                    <option key={r} value={i === 0 ? '' : r}>{r}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className={`${styles.input} ${styles.fDetail}`}
                  value={form.whatDetail}
                  onChange={set('whatDetail')}
                />
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.fieldLabel}>{L.where}</span>
              <div className={styles.fields}>
                <select className={`${styles.input} ${styles.fProv}`} value={form.province} onChange={set('province')}>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p === '' ? 'PROVINCE *' : p}</option>)}
                </select>
                <select className={`${styles.input} ${styles.fCity}`} value={form.city} onChange={set('city')}>
                  {CITIES.map((c) => <option key={c} value={c}>{c === '' ? 'CITY *' : c}</option>)}
                </select>
                <input
                  type="text"
                  className={`${styles.input} ${styles.fLoc}`}
                  placeholder="SPECIFIC LOCATION (Recommended)"
                  value={form.specificLocation}
                  onChange={set('specificLocation')}
                />
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.fieldLabel}>{L.when}</span>
              <div className={styles.fields}>
                <input
                  type="date"
                  className={`${styles.input} ${styles.fDate}`}
                  value={form.when}
                  onChange={set('when')}
                />
              </div>
            </div>

            <div className={`${styles.row} ${styles.rowTop}`}>
              <span className={`${styles.fieldLabel} ${styles.fieldLabelTop}`}>
                {L.whyLabel.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </span>
              <div className={styles.fields}>
                <textarea
                  className={styles.textarea}
                  value={form.why}
                  onChange={set('why')}
                  placeholder={L.whyPlaceholder}
                />
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>Preview Document →</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}