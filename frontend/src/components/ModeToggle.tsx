// components/ModeToggle.tsx
import React from 'react'
import type { DetectionMode } from '../types'

interface ModeOption {
  id:   DetectionMode
  label: string
  icon:  string
  desc:  string
}

const MODES: ModeOption[] = [
  { id: 'paragraph', label: 'Paragraph', icon: '¶', desc: 'Short text, single block' },
  { id: 'article',   label: 'Article',   icon: '≡', desc: 'Long text, sentence-by-sentence' },
]

interface Props {
  mode:     DetectionMode
  onChange: (mode: DetectionMode) => void
}

export default function ModeToggle({ mode, onChange }: Props): React.JSX.Element {
  return (
    <div style={styles.wrapper}>
      {MODES.map((m) => {
        const active = mode === m.id
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            style={{ ...styles.btn, ...(active ? styles.btnActive : styles.btnIdle) }}
          >
            <span style={styles.icon}>{m.icon}</span>
            <span>
              <div style={styles.label}>{m.label}</div>
              <div style={styles.desc}>{m.desc}</div>
            </span>
          </button>
        )
      })}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display:      'flex',
    gap:          8,
    padding:      '4px',
    background:   'var(--bg-2)',
    borderRadius: 'var(--r-lg)',
    border:       '1px solid var(--border)',
    width:        'fit-content',
  },
  btn: {
    display:    'flex',
    alignItems: 'center',
    gap:        10,
    padding:    '10px 20px',
    borderRadius: 'var(--r-md)',
    border:     'none',
    cursor:     'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s ease',
    textAlign:  'left',
  },
  btnActive: {
    background: 'var(--bg-3)',
    boxShadow:  '0 0 0 1px var(--border-2), 0 2px 12px rgba(0,0,0,0.3)',
    color:      'var(--text)',
  },
  btnIdle: {
    background: 'transparent',
    color:      'var(--text-3)',
  },
  icon: {
    fontFamily: 'var(--font-mono)',
    fontSize:   '1.1rem',
    opacity:    0.7,
  },
  label: {
    fontFamily:    'var(--font-display)',
    fontWeight:    600,
    fontSize:      '0.85rem',
    letterSpacing: '-0.2px',
  },
  desc: {
    fontSize:   '0.7rem',
    fontFamily: 'var(--font-mono)',
    opacity:    0.6,
    marginTop:  1,
  },
}