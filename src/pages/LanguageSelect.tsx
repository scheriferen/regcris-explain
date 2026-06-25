import { useNavigate } from 'react-router-dom';
import type { Language } from '../types/nte.types';

export default function LanguageSelect() {
  const navigate = useNavigate();

  const choose = (lang: Language) => {
    navigate('/nte-form', { state: { language: lang } });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fdf0f0 0%, #fff 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>

        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: '.04em',
          color: '#1a1a1a',
          margin: '0 0 6px',
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}>
          CREATE NOTICE TO EXPLAIN
        </h1>

        <p style={{
          fontSize: 15,
          fontStyle: 'italic',
          color: '#555',
          margin: '0 0 2rem',
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}>
          (ABISO PARA MAGPALIWANAG)
        </p>

        <p style={{
          fontSize: 14,
          fontStyle: 'italic',
          color: '#444',
          lineHeight: 1.8,
          margin: '0 0 2.5rem',
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}>
          Select a language to generate the notice.<br />
          Pumili ng wika upang malikha ang abiso. <br />
          NOT YET DONE HEHE
        </p>

        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>

          <button
  onClick={() => choose('tag')}
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  }}
>
  <div style={{
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: '#8b0000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 14px #cc000033',
    transition: 'transform .15s',
  }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
  >
    <span style={{ fontSize: 52 }}></span>
    <span style={{
      fontSize: 14,
      fontWeight: 800,
      letterSpacing: '.1em',
      color: '#fff',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>TAG</span>
  </div>
</button>

<button
  onClick={() => choose('eng')}
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  }}
>
  <div style={{
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: '#8b0000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 14px #cc000033',
    transition: 'transform .15s',
  }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
  >
    <span style={{ fontSize: 52 }}></span>
    <span style={{
      fontSize: 14,
      fontWeight: 800,
      letterSpacing: '.1em',
      color: '#fff',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>ENG</span>
  </div>
</button>

        </div>
      </div>
    </div>
  );
}