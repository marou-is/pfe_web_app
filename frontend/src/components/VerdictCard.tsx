// components/VerdictCard.tsx
import React from 'react'
import type { PredictResponse, VerdictMeta } from '../types'

function getColor(aiProb: number): string {
  if (aiProb >= 0.75) return 'var(--ai-high)'
  if (aiProb >= 0.5)  return 'var(--ai-mid)'
  if (aiProb >= 0.3)  return 'var(--human-mid)'
  return 'var(--human-high)'
}

function getVerdict(aiProb: number): VerdictMeta {
  if (aiProb >= 0.85) return { label: 'Almost certainly AI',      sub: 'High confidence detection',      severity: 'ai-high' }
  if (aiProb >= 0.65) return { label: 'Likely AI-generated',      sub: 'Moderate-high confidence',       severity: 'ai-mid' }
  if (aiProb >= 0.50) return { label: 'Possibly AI-generated',    sub: 'Borderline — treat with caution', severity: 'ai-mid' }
  if (aiProb >= 0.35) return { label: 'Possibly human-written',   sub: 'Borderline — treat with caution', severity: 'borderline' }
  if (aiProb >= 0.15) return { label: 'Likely human-written',     sub: 'Moderate-high confidence',       severity: 'human-mid' }
  return                     { label: 'Almost certainly human',   sub: 'High confidence detection',      severity: 'human-high' }
}

type MetaRow = [string, string | number]

interface Props {
  result: PredictResponse
}

export default function VerdictCard({ result }: Props): React.JSX.Element {
  const { ai_prob, human_prob, word_count, latency_ms, mode } = result
  const color   = getColor(ai_prob)
  const verdict = getVerdict(ai_prob)
  const pct     = Math.round(ai_prob * 100)

  const metaRows: MetaRow[] = [
    ['words',   word_count],
    ['mode',    mode],
    ['latency', `${Math.round(latency_ms)}ms`],
    ['model',   'RoBERTa'],
  ]

  return (
    <div style={{ ...styles.card, borderColor: `${color}55` }}>

      <div style={styles.top}>
        <div>
          <div style={{ ...styles.verdictLabel, color }}>{verdict.label}</div>
          <div style={styles.verdictSub}>{verdict.sub}</div>
        </div>
        <div style={{ ...styles.pctBadge, background: `${color}18`, color }}>
          {pct}%
          <span style={styles.pctSub}>AI</span>
        </div>
      </div>

      <div style={styles.barTrack}>
        <div style={{
          ...styles.barFill,
          width:      `${pct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
        }} />
        <div style={{ ...styles.barThumb, left: `${pct}%`, background: color }} />
      </div>

      <div style={styles.barLabels}>
        <span style={{ color: 'var(--human-high)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          Human {Math.round(human_prob * 100)}%
        </span>
        <span style={{ color: 'var(--ai-high)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          AI {pct}%
        </span>
      </div>

      <div style={styles.meta}>
        {metaRows.map(([k, v]) => (
          <div key={k} style={styles.metaItem}>
            <div style={styles.metaKey}>{k}</div>
            <div style={styles.metaVal}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background:    'var(--bg-2)',
    border:        '1px solid',
    borderRadius:  'var(--r-xl)',
    padding:       '28px 32px',
    display:       'flex',
    flexDirection: 'column',
    gap:           20,
  },
  top: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  verdictLabel: {
    fontFamily:    'var(--font-display)',
    fontSize:      '1.5rem',
    fontWeight:    700,
    letterSpacing: '-0.5px',
  },
  verdictSub: {
    fontFamily: 'var(--font-mono)',
    fontSize:   '0.72rem',
    color:      'var(--text-3)',
    marginTop:  4,
  },
  pctBadge: {
    fontFamily:    'var(--font-display)',
    fontSize:      '2rem',
    fontWeight:    800,
    padding:       '8px 18px',
    borderRadius:  'var(--r-md)',
    display:       'flex',
    alignItems:    'baseline',
    gap:           4,
    letterSpacing: '-1px',
  },
  pctSub: {
    fontSize:   '0.8rem',
    fontWeight: 500,
    opacity:    0.7,
  },
  barTrack: {
    height:       6,
    background:   'var(--bg-3)',
    borderRadius: 99,
    position:     'relative',
    overflow:     'visible',
  },
  barFill: {
    height:     '100%',
    borderRadius: 99,
    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
  },
  barThumb: {
    position:   'absolute',
    top:        '50%',
    transform:  'translate(-50%, -50%)',
    width:      12,
    height:     12,
    borderRadius: '50%',
    border:     '2px solid var(--bg)',
    transition: 'left 0.8s cubic-bezier(0.4,0,0.2,1)',
  },
  barLabels: {
    display:        'flex',
    justifyContent: 'space-between',
    marginTop:      -8,
  },
  meta: {
    display:   'flex',
    gap:       24,
    paddingTop: 16,
    borderTop: '1px solid var(--border)',
  },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaKey:  { fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  metaVal:  { fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-2)' },
}