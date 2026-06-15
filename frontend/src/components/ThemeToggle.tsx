// components/ThemeToggle.tsx
import React from 'react'
import type { Theme } from '../types'

interface Props {
  theme:  Theme
  onToggle: () => void
}

export default function ThemeToggle({ theme, onToggle }: Props): React.JSX.Element {
  const isDark = theme === 'dark'

  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={styles.btn}
    >
      <span
        style={{
          ...styles.track,
          background: isDark ? 'var(--bg-3)' : 'var(--bg-3)',
        }}
      >
        <span
          style={{
            ...styles.thumb,
            transform: isDark ? 'translateX(18px)' : 'translateX(0px)',
            background: 'var(--accent)',
          }}
        >
          {isDark ? (
            // Moon icon
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            // Sun icon
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2.2"/>
              <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          )}
        </span>
      </span>
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  btn: {
    background: 'none',
    border:     'none',
    padding:    0,
    cursor:     'pointer',
    display:    'flex',
    alignItems: 'center',
  },
  track: {
    width:        40,
    height:       22,
    borderRadius: 99,
    border:       '1px solid var(--border-2)',
    display:      'flex',
    alignItems:   'center',
    padding:      2,
    transition:   'background-color 0.25s ease',
    position:     'relative',
  },
  thumb: {
    width:          16,
    height:         16,
    borderRadius:   '50%',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    transition:     'transform 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.25s ease',
    boxShadow:      '0 1px 4px rgba(0,0,0,0.25)',
  },
}
