import registry from "../../registry.json"

// Demo files are named demos/<component>/NN-title.tsx and render one example each.

type Item = { name: string; type: string; title: string; description: string }
export type Demo = { title: string; code: string; Component: () => React.ReactNode }

const modules = import.meta.glob<{ default: () => React.ReactNode }>("./demos/*/*.tsx", { eager: true })
const sources = import.meta.glob<string>("./demos/*/*.tsx", { eager: true, query: "?raw", import: "default" })

export const components = (registry.items as Item[]).filter((i) => i.type === "registry:ui")

export function demosFor(name: string): Demo[] {
  return Object.keys(modules)
    .filter((path) => path.startsWith(`./demos/${name}/`))
    .sort()
    .map((path) => ({
      title: titleOf(path),
      code: sources[path],
      Component: modules[path].default,
    }))
}

const titleOf = (path: string) => {
  const words = path.split("/").pop()!.replace(/\.tsx$/, "").replace(/^\d+-/, "").replace(/-/g, " ")
  return words[0].toUpperCase() + words.slice(1)
}
