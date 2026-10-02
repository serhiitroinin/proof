import { useEffect, useState } from "react"

import { toHex } from "@/lib/contrast"
import { useMode } from "@/hooks/use-mode"

// Re-read on html class/style changes and on stylesheet edits (HMR, theme editor).

export type Vars = Record<string, string>

export const readVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()

export function useTokens(names: readonly string[]): Vars {
  const mode = useMode()
  const [vars, setVars] = useState<Vars>({})
  useEffect(() => {
    const read = () => {
      const next: Vars = {}
      for (const n of names) next[n] = readVar(n)
      setVars((prev) => (names.every((n) => prev[n] === next[n]) ? prev : next))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    observer.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [mode, names])
  return vars
}

export const hex = (value: string | undefined) => (value ? toHex(value) : "")
