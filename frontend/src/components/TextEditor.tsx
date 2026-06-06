// components/TextEditor.tsx
import React, { useRef } from 'react'
import type { DetectionMode } from '../types'

const MIN_WORDS: Record<DetectionMode, number> = {
  paragraph: 50,
  article:   100,
}

const MAX_WORDS: Record<DetectionMode, number> = {
  paragraph: 500,
  article:   5000,
}

interface Props {
  text:     string
  onChange: (value: string) => void
  mode:     DetectionMode
  onSubmit: () => void
  loading:  boolean
}

export default function TextEditor({ text, onChange, mode, onSubmit, loading }: Props): React.JSX.Element {
  const ref      = useRef<HTMLTextAreaElement>(null)
  const words    = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars    = text.length
  const minWords = MIN_WORDS[mode]
  const maxWords = MAX_WORDS[mode]
  const ready    = words >= minWords && words <= maxWords && !loading

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && ready) {
      onSubmit()
    }
  }

  return (
    <div style={styles.wrapper}>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={
          mode === 'paragraph'
            ? 'Paste a paragraph, essay excerpt, or any block of text…'
            : 'Paste a full article, blog post, or multi-paragraph text…'
        }
        style={styles.textarea}
        spellCheck={false}
      />

      <div style={styles.footer}>
        <div style={styles.stats}>
          <span style={styles.stat}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: words > maxWords
                ? 'var(--ai-mid)'
                : words >= minWords
                  ? 'var(--human-high)'
                  : 'var(--text-3)',
            }}>
              {words}
            </span>
            {' '}words
          </span>
          <span style={styles.divider}>·</span>
          <span style={styles.stat}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{chars}</span>
            {' '}chars
          </span>
          {words < minWords && words > 0 && (
            <>
              <span style={styles.divider}>·</span>
              <span style={{ ...styles.stat, color: 'var(--ai-mid)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                {minWords - words} more words needed
              </span>
            </>
          )}
          {words > maxWords && (
            <>
              <span style={styles.divider}>·</span>
              <span style={{ ...styles.stat, color: 'var(--ai-mid)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                {words - maxWords} words over limit
              </span>
            </>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={!ready}
          style={{ ...styles.btn, ...(ready ? styles.btnReady : styles.btnDisabled) }}
        >
          {loading ? (
            <span style={styles.spinner} />
          ) : (
            <>
              <span>Analyse</span>
              <span style={styles.shortcut}>⌘↵</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    border:       '1px solid var(--border)',
    borderRadius: 'var(--r-xl)',
    background:   'var(--bg-2)',
    overflow:     'hidden',
    transition:   'border-color 0.2s',
  },
  textarea: {
    width:      '100%',
    minHeight:  220,
    padding:    '24px 28px',
    background: 'transparent',
    border:     'none',
    outline:    'none',
    resize:     'vertical',
    color:      'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize:   '1rem',
    lineHeight: 1.75,
  },
  footer: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '12px 20px',
    borderTop:      '1px solid var(--border)',
    background:     'var(--bg-3)',
  },
  stats: {
    display:    'flex',
    alignItems: 'center',
    gap:        6,
    fontSize:   '0.78rem',
    color:      'var(--text-3)',
    fontFamily: 'var(--font-body)',
  },
  stat:    { fontSize: '0.78rem' },
  divider: { color: 'var(--border-2)', margin: '0 2px' },
  btn: {
    display:       'flex',
    alignItems:    'center',
    gap:           8,
    padding:       '9px 22px',
    borderRadius:  'var(--r-md)',
    border:        'none',
    cursor:        'pointer',
    fontFamily:    'var(--font-display)',
    fontWeight:    600,
    fontSize:      '0.85rem',
    letterSpacing: '-0.2px',
    transition:    'all 0.2s ease',
  },
  btnReady: {
    background: 'var(--accent)',
    color:      '#fff',
    boxShadow:  '0 0 20px var(--accent-glow)',
  },
  btnDisabled: {
    background: 'var(--bg-3)',
    color:      'var(--text-3)',
    cursor:     'not-allowed',
    border:     '1px solid var(--border)',
  },
  shortcut: {
    fontFamily: 'var(--font-mono)',
    fontSize:   '0.7rem',
    opacity:    0.6,
  },
  spinner: {
    display:        'inline-block',
    width:          14,
    height:         14,
    border:         '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius:   '50%',
    animation:      'spin 0.7s linear infinite',
  },
}
