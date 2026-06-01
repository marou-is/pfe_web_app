// hooks/usePredict.ts
import { useState, useCallback } from 'react'
import type { PredictResponse, DetectionMode } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

interface UsePredictReturn {
  result:  PredictResponse | null
  loading: boolean
  error:   string | null
  predict: (text: string, mode: DetectionMode) => Promise<void>
  reset:   () => void
}

export function usePredict(): UsePredictReturn {
  const [result,  setResult]  = useState<PredictResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error,   setError]   = useState<string | null>(null)

  const predict = useCallback(async (text: string, mode: DetectionMode): Promise<void> => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: text.trim(), mode }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { detail?: string }
        throw new Error(err.detail ?? `Server error ${res.status}`)
      }

      const data = await res.json() as PredictResponse
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback((): void => {
    setResult(null)
    setError(null)
    setLoading(false)
  }, [])

  return { result, loading, error, predict, reset }
}