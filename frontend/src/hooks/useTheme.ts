// hooks/useTheme.ts
// Manages light/dark theme state, persists choice in localStorage,
// and applies it via a data-theme attribute on <html>.
// Light mode is the default.

import { useState, useEffect, useCallback } from 'react'
import type { Theme } from '../types'

const STORAGE_KEY = 'truthlens-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  // Default to light regardless of system preference
  return 'light'
}

interface UseThemeReturn {
  theme:    Theme
  toggle:   () => void
  setTheme: (theme: Theme) => void
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = useCallback((): void => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const setTheme = useCallback((next: Theme): void => {
    setThemeState(next)
  }, [])

  return { theme, toggle, setTheme }
}
