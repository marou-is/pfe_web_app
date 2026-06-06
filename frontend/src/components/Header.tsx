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
    display:              'flex',
    alignItems:           'center',
    justifyContent:       'space-between',
    padding:              '20px 40px',
    borderBottom:         '1px solid var(--border)',
    position:             'sticky',
    top:                  0,
    zIndex:               100,
    background:           'rgba(10,10,15,0.85)',
    backdropFilter:       'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  logo: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
  },
}