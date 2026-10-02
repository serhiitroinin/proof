import { useSyncExternalStore } from "react"

// Each key is a data attribute on <html>, read by the signature section of globals.css.

export const SIGNATURE_KEYS = ["marker", "backdrop", "frame", "accent", "controls", "headings"] as const
export type SignatureKey = (typeof SIGNATURE_KEYS)[number]

export const SIGNATURE_OPTIONS: Record<SignatureKey, readonly string[]> = {
  marker: ["fill", "dot"],
  backdrop: ["plain", "dots"],
  frame: ["none", "offset"],
  accent: ["ink", "balanced", "loud"],
  controls: ["ink", "accent"],
  headings: ["as-is", "lower", "upper"],
}

export type Signature = Record<SignatureKey, string>

export const NATIVE_SIGNATURE: Signature = {
  marker: "fill",
  backdrop: "plain",
  frame: "none",
  accent: "balanced",
  controls: "ink",
  headings: "as-is",
}

const KEY = "signature"
const listeners = new Set<() => void>()
let cache: Signature | null = null

const read = (): Signature => {
  if (cache) return cache
  let stored: Partial<Signature>
  try {
    stored = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<Signature>
  } catch {
    stored = {}
  }
  const sig = { ...NATIVE_SIGNATURE }
  for (const k of SIGNATURE_KEYS) {
    const v = stored[k]
    if (v && SIGNATURE_OPTIONS[k].includes(v)) sig[k] = v
  }
  cache = sig
  return sig
}

const apply = (sig: Signature) => {
  const el = document.documentElement
  for (const k of SIGNATURE_KEYS) {
    if (sig[k] === NATIVE_SIGNATURE[k]) el.removeAttribute(`data-${k}`)
    else el.setAttribute(`data-${k}`, sig[k])
  }
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function setSignature(key: SignatureKey, value: string) {
  const next = { ...read(), [key]: value }
  cache = next
  localStorage.setItem(KEY, JSON.stringify(next))
  apply(next)
  listeners.forEach((cb) => cb())
}

export function resetSignature() {
  cache = { ...NATIVE_SIGNATURE }
  localStorage.removeItem(KEY)
  apply(cache)
  listeners.forEach((cb) => cb())
}

export const useSignature = () => useSyncExternalStore(subscribe, read)

// Apply the stored choice as soon as the module loads, before the first render.
if (typeof document !== "undefined") apply(read())
