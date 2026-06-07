// components/LimePanel.tsx
import React from 'react'
import type { LimeFeature } from '../hooks/useLime'

interface Props {
  features:    LimeFeature[]
  loading:     boolean
  error:       string | null
  onExplain:   () => void
  hasResult:   boolean
}

export default function LimePanel({ features, loading, error, onExplain, hasResult }: Props): React.JSX.Element | null {
  if (!hasResult) return null

  const maxWeight = Math.max(...features.map(f => Math.abs(f.weight)), 0.0001)

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>LIME Explanation</div>
          <div style={styles.sub}>Most influential words for this prediction</div>
        </div>
        {features.length === 0 && !loading && (
          <button onClick={onExplain} style={styles.btn} disabled={loading}>
            {loading ? 'Analysing…' : '⚡ Explain'}
          </button>
        )}
      </div>

      {loading && (
        <div style={styles.loadingRow}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <span key={i} style={{ ...styles.dot, animationDelay: `${delay}s` }} />
          ))}
          <span style={styles.loadingText}>Running LIME (this may take ~15s)…</span>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>⚠ {error}</div>
      )}

      {features.length > 0 && (
        <div style={styles.list}>
          {[...features]
            .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
            .map((f, i) => {
              const isAI    = f.weight > 0
              const barPct  = Math.round((Math.abs(f.weight) / maxWeight) * 100)
              const color   = isAI ? 'var(--ai-high)' : 'var(--human-high)'
              return (
                <div key={i} style={styles.row}>
                  <div style={styles.wordCell}>
                    <span style={{ ...styles.word, color }}>{f.word}</span>
                    <span style={styles.tag}>{isAI ? '→ AI' : '→ Human'}</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{
                      ...styles.barFill,
                      width:      `${barPct}%`,
                      background: `${color}`,
                      opacity:    0.75,
                    }} />
                  </div>
                  <span style={{ ...styles.weightVal, color }}>
                    {f.weight > 0 ? '+' : ''}{f.weight.toFixed(3)}
                  </span>
                </div>
              )
            })}
        </div>
      )}

      {features.length > 0 && (
        <div style={styles.legend}>
          <span style={{ color: 'var(--ai-high)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>■ pushes toward AI</span>
          <span style={{ color: 'var(--human-high)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>■ pushes toward Human</span>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background:    'var(--bg-2)',
    border:        '1px solid var(--border)',
    borderRadius:  'var(--r-xl)',
    padding:       '24px 28px',
    display:       'flex',
    flexDirection: 'column',
    gap:           16,
  },
  header: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  title: {
    fontFamily:  'var(--font-display)',
    fontWeight:  700,
    fontSize:    '1rem',
    color:       'var(--text)',
  },
  sub: {
    fontFamily: 'var(--font-mono)',
    fontSize:   '0.7rem',
    color:      'var(--text-3)',
    marginTop:  3,
  },
  btn: {
    fontFamily:   'var(--font-mono)',
    fontSize:     '0.78rem',
    background:   'var(--accent)',
    color:        '#fff',
    border:       'none',
    borderRadius: 'var(--r-sm)',
    padding:      '7px 16px',
    cursor:       'pointer',
    fontWeight:   600,
  },
  loadingRow: {
    display:    'flex',
    alignItems: 'center',
    gap:        6,
    padding:    '10px 0',
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: '50%',
    background:   'var(--accent)',
    animation:    'pulse 1s ease-in-out infinite',
    display:      'inline-block',
  },
  loadingText: {
    fontFamily: 'var(--font-mono)',
    fontSize:   '0.75rem',
    color:      'var(--text-3)',
    marginLeft: 6,
  },
  errorBox: {
    fontFamily:   'var(--font-mono)',
    fontSize:     '0.8rem',
    color:        'var(--ai-high)',
    background:   'rgba(240,74,74,0.08)',
    border:       '1px solid rgba(240,74,74,0.3)',
    borderRadius: 'var(--r-md)',
    padding:      '10px 14px',
  },
  list: {
    display:       'flex',
    flexDirection: 'column',
    gap:           10,
  },
  row: {
    display:    'flex',
    alignItems: 'center',
    gap:        12,
  },
  wordCell: {
    display:    'flex',
    alignItems: 'center',
    gap:        6,
    minWidth:   140,
  },
  word: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize:   '0.85rem',
  },
  tag: {
    fontFamily:   'var(--font-mono)',
    fontSize:     '0.62rem',
    color:        'var(--text-3)',
    background:   'var(--bg-3)',
    borderRadius: 4,
    padding:      '1px 5px',
  },
  barTrack: {
    flex:         1,
    height:       6,
    background:   'var(--bg-3)',
    borderRadius: 99,
    overflow:     'hidden',
  },
  barFill: {
    height:       '100%',
    borderRadius: 99,
    transition:   'width 0.5s ease',
  },
  weightVal: {
    fontFamily: 'var(--font-mono)',
    fontSize:   '0.75rem',
    minWidth:   52,
    textAlign:  'right',
  },
  legend: {
    display:   'flex',
    gap:       20,
    paddingTop: 8,
    borderTop: '1px solid var(--border)',
  },
}