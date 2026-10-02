// WCAG contrast audit over :root and .dark in globals.css. Exits 1 on any failure.

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { audit, blockOf, parseBlock, type Check } from "../src/lib/contrast.ts"

const css = readFileSync(resolve(import.meta.dirname, "../src/styles/globals.css"), "utf8")
const root = parseBlock(blockOf(css, ":root"))
const dark = { ...root, ...parseBlock(blockOf(css, ".dark")) }
const modes = {
  "native light": root,
  "native dark": dark,
}

const pad = (s: string, n: number) => s.padEnd(n)
const num = (n: number) => n.toFixed(2).padStart(5)

const failures: string[] = []
for (const [mode, vars] of Object.entries(modes)) {
  const checks: Check[] = audit(vars)
  console.log(`\n${mode}`)
  console.log(`${pad("pair", 32)} ${pad("fg", 8)} ${pad("bg", 8)} ${pad("ratio", 5)}  min  result`)
  for (const c of checks) {
    const result = c.pass ? "pass" : "FAIL"
    console.log(`${pad(c.name, 32)} ${pad(c.fgValue, 8)} ${pad(c.bgValue, 8)} ${num(c.ratio)}  ${c.min.toFixed(1)}  ${result}`)
    if (!c.pass) failures.push(`${mode}: ${c.name} (${c.fg} on ${c.bg}) ${c.ratio.toFixed(2)} < ${c.min}`)
  }
}

console.log("")
if (failures.length) {
  console.log(`${failures.length} failing:`)
  for (const f of failures) console.log(`  ${f}`)
  process.exit(1)
}
console.log("all pass")
