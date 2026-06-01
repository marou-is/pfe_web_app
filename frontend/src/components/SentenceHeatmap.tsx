// components/SentenceHeatmap.tsx
import React, { useState } from 'react'
import type { SentenceScore, SentenceColorScheme, DetectionLabel } from '../types'

function sentenceColor(prob: number): SentenceColorScheme {
  if (prob >= 0.75) return { bg: 'rgba(240,74,74,0.22)',  border: 'rgba(240,74,74,0.5)',   text: '#f04a4a' }
  if (prob >= 0.55) return { bg: 'rgba(245,166,35,0.18)', border: 'rgba(245,166,35,0.45)', text: '#f5a623' }
  if (prob >= 0.40) return { bg: 'rgba(91,141,239,0.15)', border: 'rgba(91,141,239,0.35)', text: '#5b8def' }
  return                   { bg: 'rgba(45,212,160,0.12)', border: 'rgba(45,212,160,0.3)',  text: '#2dd4a0' }
}

interface LegendItem { color: string; label: string }

const LEGEND: LegendItem[] = [
  { color: '#2dd4a0', label: 'Human' },
  { color: '#5b8def', label: 'Borderline' },
  { color: '#f5a623', label: 'Suspicious' },
  { color: '#f04a4a', label: 'AI' },
]

interface TooltipProps {
  prob:  number
  label: DetectionLabel
}

function Tooltip({ prob, label }: TooltipProps): React.JSX.Element {
  return (
    <div style={tipStyles.box}>
      <div style={tipStyles.row}>
        <span style={tipStyles.key}>label</span>
        <span style={{ ...tipStyles.val, color: label === 'AI' ? 'var(--ai-high)' : 'var(--human-high)' }}>
          {label}
        </span>
      </div>
      <div style={tipStyles.row}>
        <span style={tipStyles.key}>ai_prob</span>
        <span style={tipStyles.val}>{(prob * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}

const tipStyles: Record<string, React.CSSProperties> = {
  box: {
    position:      'absolute',
    bottom:        'calc(100% + 6px)',
    left:          '50%',
    transform:     'translateX(-50%)',
    background:    'var(--bg-3)',
    border:        '1px solid var(--border-2)',
    borderRadius:  'var(--r-sm)',
    padding:       '6px 10px',
    zIndex:        50,
    whiteSpace:    'nowrap',
    pointerEvents: 'none',
    display:       'flex',
    flexDirection: 'column',
    gap:           2,
    boxShadow:     '0 4px 20px rgba(0,0,0,0.4)',
  },
  row: { display: 'flex', gap: 8, alignItems: 'center' },
  key: { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-3)' },
  val: { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text)' },
}

interface Props {
  sentences: SentenceScore[]
}

export default function SentenceHeatmap({ sentences }: Props): React.JSX.Element | null {
  const [hovered, setHovered] = useState<number | null>(null)

  if (!sentences || sentences.length === 0) return null

  return (
    <div style={styles.wrapper}>

      <div style={styles.header}>
        <div style={styles.title}>Sentence Analysis</div>
        <div style={styles.legend}>
          {LEGEND.map(({ color, label }) => (
            <div key={label} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.text}>
        {sentences.map((s, i) => {
          const col       = sentenceColor(s.ai_prob)
          const isHovered = hovered === i
          return (
            <span
              key={i}
              style={{
                ...styles.sentence,
                background:   isHovered ? col.bg : col.bg.replace('0.22','0.12').replace('0.18','0.09').replace('0.15','0.08').replace('0.12','0.06'),
                borderBottom: `2px solid ${col.border}`,
                color:        isHovered ? col.text : 'var(--text)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {s.sentence}{' '}
              {isHovered && <Tooltip prob={s.ai_prob} label={s.label} />}
            </span>
          )
        })}
      </div>

      <div style={styles.chartWrap}>
        <div style={styles.chartTitle}>Per-sentence AI probability</div>
        <div style={styles.chart}>
          {sentences.map((s, i) => {
            const col = sentenceColor(s.ai_prob)
            return (
              <div
                key={i}
                style={styles.chartCol}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  ...styles.chartBar,
                  height:     `${Math.max(4, s.ai_prob * 100)}%`,
                  background: col.text,
                  opacity:    hovered === i ? 1 : 0.7,
                }} />
              </div>
            )
          })}
        </div>
        <div style={styles.chartLabels}>
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background:    'var(--bg-2)',
    border:        '1px solid var(--border)',
    borderRadius:  'var(--r-xl)',
    padding:       '28px 32px',
    display:       'flex',
    flexDirection: 'column',
    gap:           24,
  },
  header: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    flexWrap:       'wrap',
    gap:            12,
  },
  title: {
    fontFamily:    'var(--font-display)',
    fontWeight:    700,
    fontSize:      '1rem',
    letterSpacing: '-0.3px',
  },
  legend: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  legendItem: {
    display:    'flex',
    alignItems: 'center',
    gap:        5,
    fontSize:   '0.72rem',
    fontFamily: 'var(--font-mono)',
    color:      'var(--text-3)',
  },
  legendDot: {
    width:        8,
    height:       8,
    borderRadius: '50%',
    display:      'inline-block',
  },
  text: {
    fontFamily: 'var(--font-body)',
    fontSize:   '0.95rem',
    lineHeight: 2,
  },
  sentence: {
    display:      'inline',
    position:     'relative',
    cursor:       'default',
    borderRadius: '3px',
    padding:      '1px 3px',
    transition:   'all 0.15s ease',
  },
  chartWrap: {
    paddingTop: 16,
    borderTop:  '1px solid var(--border)',
  },
  chartTitle: {
    fontFamily:    'var(--font-mono)',
    fontSize:      '0.68rem',
    color:         'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom:  8,
  },
  chart: {
    display:    'flex',
    alignItems: 'flex-end',
    height:     60,
    gap:        2,
  },
  chartCol: {
    flex:       1,
    height:     '100%',
    display:    'flex',
    alignItems: 'flex-end',
    cursor:     'default',
  },
  chartBar: {
    width:        '100%',
    borderRadius: '2px 2px 0 0',
    transition:   'opacity 0.15s',
    minHeight:    4,
  },
  chartLabels: {
    display:        'flex',
    justifyContent: 'space-between',
    fontFamily:     'var(--font-mono)',
    fontSize:       '0.65rem',
    color:          'var(--text-3)',
    marginTop:      4,
  },
}