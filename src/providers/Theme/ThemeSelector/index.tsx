'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'

import type { Theme } from './types'
import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

const modes = ['dark', 'light', 'auto'] as const
type Mode = (typeof modes)[number]

const icons: Record<Mode, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  auto: <Monitor className="h-4 w-4" />,
}

const labels: Record<Mode, string> = {
  light: 'Light',
  dark: 'Dark',
  auto: 'System',
}

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [mode, setMode] = useState<Mode>('dark')

  useEffect(() => {
    const stored = window.localStorage.getItem(themeLocalStorageKey)
    if (stored === 'light' || stored === 'dark') {
      setMode(stored)
    } else {
      setMode('auto')
    }
  }, [])

  const cycle = () => {
    const next = modes[(modes.indexOf(mode) + 1) % modes.length]
    setMode(next)

    if (next === 'auto') {
      setTheme(null)
    } else {
      setTheme(next as Theme)
    }
  }

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${labels[mode]}. Click to switch.`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground hover:border-primary/50 hover:bg-card/80"
    >
      <span className="transition-transform duration-300">{icons[mode]}</span>
      <span>{labels[mode]}</span>
    </button>
  )
}
