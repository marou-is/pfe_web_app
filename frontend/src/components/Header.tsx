// components/Header.tsx
import React from 'react'

import logoSrc from '../assets/Logo-04-cropped.png'

export default function Header(): React.JSX.Element {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img
          src={logoSrc}
          alt="TruthLens"
          style={{ height: '48px', width: 'auto' }}
        />
      </div>
    </header>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display:           'flex',
    alignItems:        'center',
    justifyContent:    'space-between',
    padding:           '20px 40px',
    borderBottom:      '1px solid var(--border)',
    position:          'sticky',
    top:               0,
    zIndex:            100,
    background:        'rgba(10,10,15,0.85)',
    backdropFilter:    'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  logo: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
  },
  logoMark: {
    width:          32,
    height:         32,
    borderRadius:   '8px',
    background:     'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontSize:       16,
    fontWeight:     700,
    fontFamily:     'var(--font-display)',
    color:          '#fff',
    letterSpacing:  '-0.5px',
  },
  logoText: {
    fontFamily:    'var(--font-display)',
    fontSize:      '1.1rem',
    fontWeight:    700,
    color:         'var(--text)',
    letterSpacing: '-0.3px',
  },
  logoSub: {
    fontFamily:    'var(--font-mono)',
    fontSize:      '0.65rem',
    color:         'var(--text-3)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop:     1,
  },
  badge: {
    fontFamily:    'var(--font-mono)',
    fontSize:      '0.7rem',
    padding:       '4px 10px',
    border:        '1px solid var(--border-2)',
    borderRadius:  'var(--r-sm)',
    color:         'var(--text-3)',
    letterSpacing: '0.06em',
  },
}