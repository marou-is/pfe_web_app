// components/Header.tsx
import React from 'react'
import ThemeToggle from './ThemeToggle'
import type { Theme } from '../types'

interface Props {
  theme:        Theme
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: Props): React.JSX.Element {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div>
          <img src="./src/assets/Logo-05.png" alt="TruthLens Logo" style={{ width: '70px', height: '70px' }} />
        </div>
        <div>
          <div style={styles.logoText}>TruthLens</div>
          <div style={styles.logoSub}>AI Detection Engine</div>
        </div>
      </div>

      <div style={styles.right}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
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
    background:        'var(--bg)',
    backdropFilter:    'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    opacity:           0.97,
    transition:        'background-color 0.25s ease, border-color 0.25s ease',
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
  right: {
    display:    'flex',
    alignItems: 'center',
    gap:        16,
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
