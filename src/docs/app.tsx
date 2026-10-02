import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { MoonIcon, PaletteIcon, SearchIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { setMode, useMode } from "@/hooks/use-mode"
import "@/hooks/use-signature"

import { Wordmark } from "./kit"
import { GROUPS, PAGES, pageById, type Page } from "./pages"
import { href, useRoute, useSection } from "./router"
import { ThemeEditor } from "./theme-editor"

export function App() {
  return (
    <TooltipProvider>
      <Shell />
      <Toaster theme={useMode()} />
    </TooltipProvider>
  )
}

type TocEntry = { id: string; title: string }

const spy = (toc: TocEntry[]) => {
  const line = window.innerHeight * 0.2 + 56
  let current = toc[0]?.id ?? ""
  for (const { id } of toc) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= line) current = id
  }
  return current
}

function Shell() {
  const page = pageById(useRoute())
  const section = useSection()
  const [searchOpen, setSearchOpen] = useState(false)
  const [toc, setToc] = useState<TocEntry[]>([])
  const [active, setActive] = useState("")
  const article = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = `${page.title} · proof`
  }, [page])

  // Sections register with data-toc, so read them after paint before scrolling to the routed one.
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      const els = Array.from(article.current?.querySelectorAll<HTMLElement>("[data-toc]") ?? [])
      const entries = els.map((el) => ({ id: el.id, title: el.dataset.toc ?? el.id }))
      setToc(entries)
      const target = section ? document.getElementById(section) : null
      if (target) target.scrollIntoView({ block: "start" })
      else if (!section) window.scrollTo(0, 0)
      setActive(spy(entries))
    })
    return () => cancelAnimationFrame(raf)
  }, [page, section])

  useEffect(() => {
    if (!toc.length) return
    const onScroll = () => setActive(spy(toc))
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [toc])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((o) => !o)
        return
      }
      const t = e.target as HTMLElement | null
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const { Render } = page
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background px-6">
        <a href={href(PAGES[0].id)} className="text-base">
          <Wordmark />
        </a>
        <Button variant="outline" size="sm" className="w-56 justify-start" onClick={() => setSearchOpen(true)} aria-label="Search pages">
          <SearchIcon data-icon="inline-start" />
          Search pages
          <span className="flex-1" />
          <Kbd>⌘K</Kbd>
        </Button>
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm md:flex">
          <span className="text-muted-foreground">{page.group}</span>
          <span className="text-faint">/</span>
          <span className="font-medium">{page.title}</span>
        </nav>
        <div className="flex-1" />
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="sm" />}>
            <PaletteIcon data-icon="inline-start" />
            Theme
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Theme</SheetTitle>
              <SheetDescription>Tune the tokens live, then copy the CSS into globals.css.</SheetDescription>
            </SheetHeader>
            <ThemeEditor />
          </SheetContent>
        </Sheet>
        <ModeToggle />
      </header>
      <div className="flex flex-1">
        <nav aria-label="Pages" className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 border-r md:block">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-5 p-3 pb-8">
              {GROUPS.map((group) => (
                <div key={group} className="flex flex-col gap-1">
                  <span className="px-2 pt-1 pb-1 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {group}
                  </span>
                  <SidebarMenu>
                    {PAGES.filter((p) => p.group === group).map((p) => {
                      const on = p.id === page.id
                      return (
                        <SidebarMenuItem key={p.id}>
                          <SidebarMenuSubButton href={href(p.id)} isActive={on}>
                            <span>{p.title}</span>
                          </SidebarMenuSubButton>
                          {on && toc.length > 0 && (
                            <SidebarMenuSub>
                              {toc.map((t) => (
                                <SidebarMenuSubItem key={t.id}>
                                  <SidebarMenuSubButton size="sm" href={href(p.id, t.id)} isActive={t.id === active} aria-current={undefined}>
                                    <span>{t.title}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          )}
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </nav>
        <main className="min-w-0 flex-1 px-6 py-12 md:px-12">
          <article key={page.id} ref={article} className="mx-auto max-w-3xl">
            <Render />
          </article>
        </main>
      </div>
      <Search key={String(searchOpen)} open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}

function Search({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const go = (p: Page) => {
    window.location.assign(href(p.id))
    onOpenChange(false)
  }
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search pages" description="Type to filter pages. Arrow keys move, Enter opens." className="sm:max-w-lg">
      <Command>
        <CommandInput placeholder="Search pages" />
        <CommandList>
          <CommandEmpty>No page matches</CommandEmpty>
          {GROUPS.map((group) => (
            <CommandGroup key={group} heading={group}>
              {PAGES.filter((p) => p.group === group).map((p) => (
                <CommandItem key={p.id} value={p.title} keywords={[p.blurb ?? "", p.keys ?? "", p.group]} onSelect={() => go(p)}>
                  <span className="truncate">{p.title}</span>
                  {p.blurb && <span className="truncate text-xs text-muted-foreground">{p.blurb}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <CommandFooter>
          <Kbd>↑↓</Kbd> move <Kbd>↵</Kbd> open <Kbd>esc</Kbd> close
        </CommandFooter>
      </Command>
    </CommandDialog>
  )
}

function ModeToggle() {
  const dark = useMode() === "dark"
  return (
    <Button variant="ghost" size="icon-sm" aria-label="Toggle dark mode" onClick={() => setMode(dark ? "light" : "dark")}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

