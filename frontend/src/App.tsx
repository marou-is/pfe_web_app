// App.tsx
import React, { useState } from 'react'
import Header          from './components/Header'
import ModeToggle      from './components/ModeToggle'
import TextEditor      from './components/TextEditor'
import VerdictCard     from './components/VerdictCard'
import SentenceHeatmap from './components/SentenceHeatmap'
import LimePanel       from './components/LimePanel'
import { usePredict }  from './hooks/usePredict'
import { useLime }     from './hooks/useLime'
import type { DetectionMode } from './types'

export default function App(): React.JSX.Element {
  const [text, setText] = useState<string>('')
  const [mode, setMode] = useState<DetectionMode>('paragraph')
  const { result, loading, error, predict, reset } = usePredict()
  const { features, limeLoading, limeError, explain, resetLime } = useLime()

  const handleSubmit = (): void => {
    void predict(text, mode)
    resetLime()
  }

  const handleModeChange = (m: DetectionMode): void => {
    setMode(m)
    reset()
    resetLime()
  }

  const handleReset = (): void => {
    setText('')
    reset()
    resetLime()
  }

  const handleExplain = (): void => {
    void explain(text)
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      <Header />

      <main style={styles.main}>

        <div style={styles.hero}>
          <div style={styles.eyebrow}>AI · HUMAN · CLASSIFICATION</div>
          <h1 style={styles.title}>
            Is this text<br />
            <span style={styles.accent}>AI-generated?</span>
          </h1>
          <p style={styles.sub}>
            Paste any text below. Our model will analyse it
            {mode === 'article' ? ' sentence by sentence' : ''} and give you a confidence score.
          </p>
        </div>

        <ModeToggle mode={mode} onChange={handleModeChange} />

        <TextEditor
          text={text}
          onChange={setText}
          mode={mode}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {loading && (
          <div style={styles.loadingRow}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <span key={i} style={{ ...styles.dot, animationDelay: `${delay}s` }} />
            ))}
            <span style={styles.loadingText}>Analysing text…</span>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {result && !loading && (
          <div style={styles.results}>
            <div style={styles.resultsHeader}>
              <div style={styles.resultsTitle}>Analysis results</div>
              <button onClick={handleReset} style={styles.resetBtn}>↺ New analysis</button>
            </div>

            <VerdictCard result={result} />

            {result.sentence_scores && result.sentence_scores.length > 0 && (
              <SentenceHeatmap sentences={result.sentence_scores} />
            )}

            <LimePanel
              features={features}
              loading={limeLoading}
              error={limeError}
              onExplain={handleExplain}
              hasResult={!!result}
            />
          </div>
        )}

      </main>

      <footer style={styles.footer}>
        <span style={styles.footerText}>TruthLens · PFE 2026</span>
      </footer>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: {
    flex:          1,
    maxWidth:      820,
    width:         '100%',
    margin:        '0 auto',
    padding:       '56px 24px 80px',
    display:       'flex',
    flexDirection: 'column',
    gap:           28,
  },
  hero:    { marginBottom: 8 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: 12 },
  title: {
    fontFamily:    'var(--font-display)',
    fontSize:      'clamp(2rem, 5vw, 3.2rem)',
    fontWeight:    800,
    lineHeight:    1.1,
    letterSpacing: '-1.5px',
    color:         'var(--text)',
    marginBottom:  16,
  },
  accent: {
    background:           'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor:  'transparent',
    backgroundClip:       'text',
  },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize:   '1rem',
    color:      'var(--text-2)',
    lineHeight: 1.65,
    maxWidth:   520,
    fontWeight: 300,
  },
  loadingRow: {
    display:      'flex',
    alignItems:   'center',
    gap:          6,
    padding:      '12px 20px',
    background:   'var(--bg-2)',
    border:       '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: '50%',
    background:   'var(--accent)',
    animation:    'pulse 1s ease-in-out infinite',
    display:      'inline-block',
  },
  loadingText: { fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-3)', marginLeft: 6 },
  errorBox: {
    display:      'flex',
    alignItems:   'center',
    gap:          10,
    padding:      '14px 20px',
    background:   'rgba(240,74,74,0.08)',
    border:       '1px solid rgba(240,74,74,0.3)',
    borderRadius: 'var(--r-md)',
    fontFamily:   'var(--font-mono)',
    fontSize:     '0.82rem',
    color:        'var(--ai-high)',
  },
  results:       { display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' },
  resultsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resultsTitle:  { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  resetBtn:      { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-3)', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '5px 12px', cursor: 'pointer' },
  footer:        { borderTop: '1px solid var(--border)', padding: '16px 40px', textAlign: 'center' },
  footerText:    { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-3)', letterSpacing: '0.08em' },
}