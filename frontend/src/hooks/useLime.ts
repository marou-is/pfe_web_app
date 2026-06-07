// hooks/useLime.ts
import { useState, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export interface LimeFeature {
  word:   string
  weight: number
}

interface UseLimeReturn {
  features:    LimeFeature[]
  limeLoading: boolean
  limeError:   string | null
  explain:     (text: string, numFeatures?: number) => Promise<void>
  resetLime:   () => void
}

export function useLime(): UseLimeReturn {
  const [features,    setFeatures]    = useState<LimeFeature[]>([])
  const [limeLoading, setLimeLoading] = useState<boolean>(false)
  const [limeError,   setLimeError]   = useState<string | null>(null)

  const explain = useCallback(async (text: string, numFeatures = 10): Promise<void> => {
    setLimeLoading(true)
    setLimeError(null)
    setFeatures([])

    try {
      const res = await fetch(`${API_BASE}/explain/lime`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: text.trim(), num_features: numFeatures }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { detail?: string }
        throw new Error(err.detail ?? `Server error ${res.status}`)
      }

      const data = await res.json() as { features: LimeFeature[]; latency_ms: number }
      setFeatures(data.features)
    } catch (e) {
      setLimeError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLimeLoading(false)
    }
  }, [])

  const resetLime = useCallback((): void => {
    setFeatures([])
    setLimeError(null)
    setLimeLoading(false)
  }, [])

  return { features, limeLoading, limeError, explain, resetLime }
}