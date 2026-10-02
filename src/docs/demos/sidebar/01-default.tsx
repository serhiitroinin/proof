import { useState } from "react"
import { ActivityIcon, DownloadIcon, FolderIcon, HistoryIcon, ListChecksIcon, MonitorIcon, SettingsIcon } from "lucide-react"

import { Kbd } from "@/components/ui/kbd"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type Item = { id: string; label: string; icon: typeof FolderIcon; count?: number; badge?: number }

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Library",
    items: [
      { id: "downloads", label: "Downloads", icon: DownloadIcon, count: 128 },
      { id: "desktop", label: "Desktop", icon: MonitorIcon, count: 12 },
      { id: "documents", label: "Documents", icon: FolderIcon },
    ],
  },
  {
    label: "Activity",
    items: [
      { id: "review", label: "Needs review", icon: ListChecksIcon, badge: 3 },
      { id: "history", label: "History", icon: HistoryIcon },
      { id: "settings", label: "Settings", icon: SettingsIcon },
    ],
  },
]

export default function SidebarDefault() {
  const [active, setActive] = useState("downloads")
  return (
    <div className="flex h-96 w-full overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-0">
        <Sidebar collapsible="none">
          <SidebarHeader>
            <div className="flex h-8 items-center gap-2 px-2 text-sm font-medium">
              <span className="size-3 rounded-full bg-family-butler" aria-hidden />
              Butler
            </div>
          </SidebarHeader>
          <SidebarContent>
            {groups.map((g) => (
              <SidebarGroup key={g.label}>
                <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {g.items.map((it) => (
                      <SidebarMenuItem key={it.id}>
                        <SidebarMenuButton isActive={active === it.id} onClick={() => setActive(it.id)}>
                          <it.icon />
                          <span>{it.label}</span>
                          {it.count !== undefined && <SidebarMenuBadge>{it.count}</SidebarMenuBadge>}
                          {it.badge !== undefined && <SidebarMenuBadge variant="accent">{it.badge}</SidebarMenuBadge>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <div className="flex h-7 items-center gap-2 px-2">
              <ActivityIcon className="size-3.5 text-success" />
              Watching 3 folders
              <Kbd className="ml-auto">⌘K</Kbd>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <span className="text-sm font-medium">{groups.flatMap((g) => g.items).find((i) => i.id === active)?.label}</span>
          </header>
          <div className="flex-1 p-4 text-sm text-muted-foreground">Content for the selected folder goes here.</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
