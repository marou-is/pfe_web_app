// components/Header.tsx
import React from 'react'
import ThemeToggle from './ThemeToggle'
import type { Theme } from '../types'
import logoSrc from '../assets/Logo-04-cropped.png'

interface Props {
  theme:         Theme
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: Props): React.JSX.Element {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img
          src={logoSrc}
          alt="TruthLens"
          style={styles.logoImg}
        />
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
  logoImg: {
    height: '48px',
    width:  'auto',
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