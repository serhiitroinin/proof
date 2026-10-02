import { useSyncExternalStore } from "react"

// index.html applies the stored mode before first paint, so there is no flash.
export type Mode = "light" | "dark"

const KEY = "theme"
const media = () => window.matchMedia("(prefers-color-scheme: dark)")
const read = (): Mode => {
  const stored = localStorage.getItem(KEY)
  if (stored === "light" || stored === "dark") return stored
  return media().matches ? "dark" : "light"
}
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  media().addEventListener("change", cb)
  return () => {
    listeners.delete(cb)
    media().removeEventListener("change", cb)
  }
}

export function setMode(mode: Mode) {
  localStorage.setItem(KEY, mode)
  document.documentElement.classList.toggle("dark", mode === "dark")
  listeners.forEach((cb) => cb())
}

export const useMode = () => useSyncExternalStore(subscribe, read)
