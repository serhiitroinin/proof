import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@/styles/globals.css"
import { App } from "@/docs/app"
import { applyStoredTheme } from "@/lib/theme"

applyStoredTheme()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
