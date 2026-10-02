import { useSyncExternalStore } from "react"

// Hash routes: #/<page> or #/<page>/<section>. Empty route is the first page.
const parts = () => window.location.hash.replace(/^#\/?/, "").split("/")
const read = () => parts()[0]
const readSection = () => parts()[1] ?? ""
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb)
  return () => window.removeEventListener("hashchange", cb)
}

export const useRoute = () => useSyncExternalStore(subscribe, read)
export const useSection = () => useSyncExternalStore(subscribe, readSection)
export const href = (id: string, section?: string) => (section ? `#/${id}/${section}` : `#/${id}`)
