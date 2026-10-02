import { useState } from "react"
import { DownloadIcon, FolderIcon, HistoryIcon, ListChecksIcon, MonitorIcon, SettingsIcon } from "lucide-react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const library = [
  { id: "downloads", label: "Downloads", icon: DownloadIcon, count: 128 },
  { id: "desktop", label: "Desktop", icon: MonitorIcon, count: 12 },
  { id: "documents", label: "Documents", icon: FolderIcon },
]
const activity = [
  { id: "review", label: "Needs review", icon: ListChecksIcon, badge: 3 },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
]

export default function SidebarCollapsibleIcons() {
  const [active, setActive] = useState("desktop")
  const render = (items: typeof library | typeof activity) =>
    items.map((it) => (
      <SidebarMenuItem key={it.id}>
        <SidebarMenuButton tooltip={it.label} isActive={active === it.id} onClick={() => setActive(it.id)}>
          <it.icon />
          <span>{it.label}</span>
          {"count" in it && it.count !== undefined && <SidebarMenuBadge>{it.count}</SidebarMenuBadge>}
          {"badge" in it && it.badge !== undefined && <SidebarMenuBadge variant="accent">{it.badge}</SidebarMenuBadge>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  return (
    <div className="flex h-96 w-full overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-0" defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu marker={false}>
              <SidebarMenuItem>
                <SidebarMenuButton size="default" tooltip="Butler">
                  <span className="size-4 shrink-0 rounded-full bg-family-butler" aria-hidden />
                  <span className="font-medium">Butler</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Library</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{render(library)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Activity</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{render(activity)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu marker={false}>
              <SidebarMenuItem>
                <SidebarTrigger className="w-full justify-start group-data-[collapsible=icon]:justify-center" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <span className="text-sm font-medium">{[...library, ...activity].find((i) => i.id === active)?.label}</span>
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              Toggle
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>B</Kbd>
              </KbdGroup>
            </span>
          </header>
          <div className="flex-1 p-4 text-sm text-muted-foreground">Press ⌘B or drag the rail to collapse the sidebar.</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
