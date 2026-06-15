// types/index.ts
// Single source of truth for all types shared across the app.
// These mirror the Pydantic response schemas in backend/main.py exactly.

export type DetectionMode = 'paragraph' | 'article'

export type DetectionLabel = 'AI' | 'Human'

export interface SentenceScore {
  sentence: string
  ai_prob:  number
  label:    DetectionLabel
}

export interface PredictResponse {
  label:            DetectionLabel
  ai_prob:          number
  human_prob:       number
  word_count:       number
  mode:             DetectionMode
  sentence_scores:  SentenceScore[] | null
  latency_ms:       number
}

export interface PredictRequest {
  text: string
  mode: DetectionMode
}

// UI-only types
export type VerdictSeverity = 'ai-high' | 'ai-mid' | 'borderline' | 'human-mid' | 'human-high'

export interface VerdictMeta {
  label:    string
  sub:      string
  severity: VerdictSeverity
}

export interface SentenceColorScheme {
  bg:     string
  border: string
  text:   string
}

// Theme
export type Theme = 'light' | 'dark'
