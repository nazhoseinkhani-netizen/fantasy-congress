'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface DevModeContextValue {
  devMode: boolean
  toggle: () => void
}

const DevModeContext = createContext<DevModeContextValue>({ devMode: false, toggle: () => {} })

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [devMode, setDevMode] = useState(false)

  const toggle = useCallback(() => setDevMode((v) => !v), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [toggle])

  useEffect(() => {
    document.documentElement.classList.toggle('dev-mode', devMode)
  }, [devMode])

  return (
    <DevModeContext.Provider value={{ devMode, toggle }}>
      {children}
    </DevModeContext.Provider>
  )
}

export const useDevMode = () => useContext(DevModeContext)
